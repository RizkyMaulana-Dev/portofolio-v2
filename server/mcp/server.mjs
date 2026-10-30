import fs from 'node:fs/promises';
import path from 'node:path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as z from 'zod/v4';
import { config } from '../config.mjs';
import { SECTIONS } from '../lib/sections.mjs';
import { MIME_EXTENSIONS } from '../lib/upload-service.mjs';
import {
  deepMerge,
  getAtPath,
  isPlainObject,
  itemMatchesQuery,
  resolveItemIndex,
  setAtPath,
  summarizeItem,
  walkStrings,
} from './content-utils.mjs';

const SECTION_VALUES = [...SECTIONS];
const EXTENSION_MIME_TYPES = new Map(
  [...MIME_EXTENSIONS.entries()].map(([mimeType, extension]) => [extension, mimeType])
);
const ALLOWED_MIME_TYPES = [...MIME_EXTENSIONS.keys()];

const COLLECTIONS = {
  hero: {
    nav: 'nav',
    cards: 'cards',
    sideNotes: 'sideNotes',
  },
  about: {
    skillGroups: 'skillGroups',
    fullstackStages: 'fullstack.stages',
    certificates: 'certificates.items',
  },
  work: {
    projects: 'projects',
  },
  videos: {
    clips: 'clips',
  },
  site: {
    socials: 'socials',
    footerNav: 'footerNav',
  },
};

const SERVER_INSTRUCTIONS = `CMS portofolio lokal ini bisa dibaca dan diubah lewat tool.

Alur yang disarankan:
1. Mulai dengan cms_status untuk melihat section, draft, dan status API.
2. Baca section dengan get_section sebelum mengubah. workingContent adalah draft jika ada; kalau tidak, konten live yang sudah digabung dengan default src/content.
3. Untuk daftar (projects, certificates.items, skillGroups, clips, socials, footerNav, nav), gunakan list_items lalu get_item. Edit dengan create_item, update_item, delete_item, atau move_item. Untuk field tunggal gunakan set_field.
4. Semua perubahan default masuk draft, belum live. Setelah selesai, panggil publish_section untuk menerapkan ke MySQL dan membersihkan draft. discard_draft membuang draft.
5. save_section dan patch_section untuk perubahan tingkat section. save_section mengganti seluruh isi section, jadi hati-hati.
6. delete_item, delete_upload, dan reset_content bersifat destruktif dan butuh konfirmasi eksplisit.
7. upload_file menerima path file lokal (absolut atau relatif dari root repo) atau base64. URL hasil upload bisa dipakai di field gambar/video/PDF.

Catatan: halaman publik yang memakai API akan membaca konten live setelah reload. Build statis GitHub Pages tidak otomatis berubah; build ulang untuk deployment statis.`;

function jsonResult(payload) {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(payload, null, 2),
      },
    ],
  };
}

function requireRecord(value, label) {
  if (!isPlainObject(value)) {
    throw new Error(`${label} must be a JSON object.`);
  }

  return value;
}

function sectionLabel(section) {
  return section === 'site' ? 'Contact / site' : section;
}

export function createCmsMcpServer({
  api,
  defaults = {},
  serverInfo = { name: 'portfolio-cms', version: '1.0.0' },
} = {}) {
  if (!api) throw new Error('createCmsMcpServer requires a CMS API client.');

  const server = new McpServer(serverInfo, {
    instructions: SERVER_INSTRUCTIONS,
  });

  function defaultFor(section) {
    return isPlainObject(defaults[section]) ? defaults[section] : {};
  }

  async function loadSnapshot() {
    const [contentResponse, draftsResponse] = await Promise.all([
      api.getContent(),
      api.getDrafts(),
    ]);

    return {
      sections: contentResponse?.sections ?? {},
      drafts: draftsResponse?.drafts ?? {},
    };
  }

  function workingContent(section, snapshot) {
    const published = snapshot.sections[section] ?? null;
    const draft = snapshot.drafts[section] ?? null;
    const stored = draft?.content ?? published?.content ?? {};

    return {
      content: deepMerge(defaultFor(section), stored),
      source: draft ? 'draft' : 'published',
      draft,
      published,
      defaultsLoaded: Object.hasOwn(defaults, section),
    };
  }

  async function persistSection(section, content, mode) {
    requireRecord(content, 'Section content');

    const result =
      mode === 'publish'
        ? await api.saveSection(section, content)
        : await api.saveDraft(section, content);

    return {
      ...result,
      mode,
      live: mode === 'publish',
      note:
        mode === 'publish'
          ? 'Section sudah live di MySQL.'
          : 'Draft tersimpan. Panggil publish_section untuk membuatnya live.',
    };
  }

  function statusCollections(section, content) {
    const collections = {};

    for (const [name, itemPath] of Object.entries(COLLECTIONS[section] ?? {})) {
      const { value } = getAtPath(content, itemPath);
      if (Array.isArray(value)) collections[name] = value.length;
    }

    return collections;
  }

  const sectionSchema = z
    .enum(SECTION_VALUES)
    .describe('Section CMS: hero, about, work, videos, atau site (Contact).');
  const itemPathSchema = z
    .string()
    .min(1)
    .describe('Path array/item, misalnya projects atau certificates.items[0].title.');
  const itemIndexSchema = z.number().int().min(0).optional().describe('Index item, mulai 0.');
  const itemMatchSchema = z
    .string()
    .min(1)
    .optional()
    .describe('Cari item dari slug, id, title, label, atau name.');
  const modeSchema = z
    .enum(['draft', 'publish'])
    .default('draft')
    .describe('draft = belum live; publish = langsung disimpan ke MySQL.');
  const recordSchema = z.record(z.string(), z.unknown());

  server.registerTool(
    'cms_status',
    {
      title: 'CMS status',
      description:
        'Cek kesehatan API CMS, section yang tersimpan, draft pending, jumlah item, dan jumlah upload.',
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () => {
      const result = {
        api: api.baseUrl,
        health: null,
        sections: {},
        uploads: null,
        warnings: [],
      };

      try {
        result.health = await api.health();
      } catch (error) {
        result.health = { ok: false, error: error.message };
      }

      try {
        const [contentResponse, draftsResponse, uploadsResponse] = await Promise.all([
          api.getContent(),
          api.getDrafts(),
          api.listUploads(),
        ]);
        const sections = contentResponse?.sections ?? {};
        const drafts = draftsResponse?.drafts ?? {};

        for (const section of SECTIONS) {
          const published = sections[section] ?? null;
          const draft = drafts[section] ?? null;
          const working = workingContent(section, { sections, drafts });

          result.sections[section] = {
            label: sectionLabel(section),
            saved: Boolean(published),
            updatedAt: published?.updatedAt ?? null,
            draft: draft ? { savedAt: draft.savedAt } : null,
            workingSource: working.source,
            defaultsLoaded: working.defaultsLoaded,
            collections: statusCollections(section, working.content),
          };

          if (!working.defaultsLoaded) {
            result.warnings.push(
              `Default content untuk "${section}" tidak termuat. Jalankan lewat "npm run mcp" agar fallback src/content tersedia.`
            );
          }
        }

        result.uploads = { total: uploadsResponse?.uploads?.length ?? 0 };
      } catch (error) {
        result.error = error.message;
      }

      return jsonResult(result);
    }
  );

  server.registerTool(
    'get_section',
    {
      title: 'Read CMS section',
      description:
        'Baca konten satu section. Mengembalikan workingContent (draft jika ada, jika tidak live+default), workingSource, dan draft pending bila ada.',
      inputSchema: { section: sectionSchema },
      annotations: { readOnlyHint: true },
    },
    async ({ section }) => {
      const snapshot = await loadSnapshot();
      const working = workingContent(section, snapshot);
      const liveContent = deepMerge(defaultFor(section), working.published?.content ?? {});
      const payload = {
        section,
        label: sectionLabel(section),
        api: api.baseUrl,
        updatedAt: working.published?.updatedAt ?? null,
        workingSource: working.source,
        defaultsLoaded: working.defaultsLoaded,
        workingContent: working.content,
        note:
          working.source === 'draft'
            ? 'workingContent berasal dari draft. liveContent adalah versi yang sedang tampil.'
            : 'workingContent adalah konten live yang sudah digabung dengan default src/content.',
      };

      if (working.draft) {
        payload.draft = {
          savedAt: working.draft.savedAt,
          content: working.draft.content,
        };
        payload.liveContent = liveContent;
      }

      return jsonResult(payload);
    }
  );

  server.registerTool(
    'search_content',
    {
      title: 'Search CMS content',
      description:
        'Cari teks di seluruh section. Default mencari di workingContent (draft jika ada). Kembalikan path yang bisa dipakai di set_field.',
      inputSchema: {
        query: z.string().min(1).describe('Teks yang dicari (case-insensitive).'),
        sections: z.array(sectionSchema).optional().describe('Batasi ke section tertentu.'),
        limit: z.number().int().min(1).max(100).default(20),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ query, sections, limit }) => {
      const snapshot = await loadSnapshot();
      const targetSections = sections?.length ? sections : SECTIONS;
      const needle = query.toLowerCase();
      const matches = [];
      let total = 0;

      for (const section of targetSections) {
        const working = workingContent(section, snapshot);
        walkStrings(working.content, section, (matchPath, value) => {
          if (!value.toLowerCase().includes(needle)) return;

          total += 1;
          if (matches.length >= limit) return;

          matches.push({
            section,
            path: matchPath,
            value: value.length > 320 ? `${value.slice(0, 317)}...` : value,
          });
        });
      }

      return jsonResult({
        query,
        source: 'working',
        sections: targetSections,
        total,
        returned: matches.length,
        truncated: total > matches.length,
        matches,
      });
    }
  );

  server.registerTool(
    'list_items',
    {
      title: 'List CMS items',
      description:
        'Tampilkan item pada path array, misalnya work/projects, about/certificates.items, videos/clips, site/socials, atau hero/nav.',
      inputSchema: {
        section: sectionSchema,
        path: itemPathSchema,
        query: z.string().optional().describe('Filter teks item.'),
        offset: z.number().int().min(0).default(0),
        limit: z.number().int().min(1).max(100).default(50),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ section, path: itemPath, query, offset, limit }) => {
      const snapshot = await loadSnapshot();
      const working = workingContent(section, snapshot);
      const { value } = getAtPath(working.content, itemPath);

      if (!Array.isArray(value)) {
        throw new Error(`Path "${itemPath}" bukan array pada section "${section}".`);
      }

      const needle = query?.trim();
      const filtered = value
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => !needle || itemMatchesQuery(item, needle))
        .map(({ item, index }) => summarizeItem(item, index));

      return jsonResult({
        section,
        path: itemPath,
        source: working.source,
        total: filtered.length,
        offset,
        limit,
        items: filtered.slice(offset, offset + limit),
      });
    }
  );

  server.registerTool(
    'get_item',
    {
      title: 'Read CMS item',
      description:
        'Ambil satu item lengkap dari path array memakai index atau match (slug/title/label).',
      inputSchema: {
        section: sectionSchema,
        path: itemPathSchema,
        index: itemIndexSchema,
        match: itemMatchSchema,
      },
      annotations: { readOnlyHint: true },
    },
    async ({ section, path: itemPath, index, match }) => {
      const snapshot = await loadSnapshot();
      const working = workingContent(section, snapshot);
      const { value } = getAtPath(working.content, itemPath);

      if (!Array.isArray(value)) {
        throw new Error(`Path "${itemPath}" bukan array pada section "${section}".`);
      }

      const resolvedIndex = resolveItemIndex(value, { index, match });

      return jsonResult({
        section,
        path: itemPath,
        source: working.source,
        index: resolvedIndex,
        item: value[resolvedIndex],
      });
    }
  );

  server.registerTool(
    'create_item',
    {
      title: 'Create CMS item',
      description:
        'Tambahkan item baru ke path array. Default masuk draft; set mode=publish untuk langsung live.',
      inputSchema: {
        section: sectionSchema,
        path: itemPathSchema,
        item: z.unknown().describe('Item JSON yang akan ditambahkan.'),
        position: z
          .union([z.number().int().min(0), z.enum(['start', 'end'])])
          .optional()
          .describe('Index sisip atau start/end. Default end.'),
        mode: modeSchema,
      },
    },
    async ({ section, path: itemPath, item, position, mode }) => {
      if (item === undefined) {
        throw new Error('item wajib diisi.');
      }

      const snapshot = await loadSnapshot();
      const working = workingContent(section, snapshot);
      const { value } = getAtPath(working.content, itemPath);

      if (!Array.isArray(value)) {
        throw new Error(`Path "${itemPath}" bukan array pada section "${section}".`);
      }

      const insertAt =
        position === 'start'
          ? 0
          : position === 'end' || position === undefined
            ? value.length
            : position;

      if (insertAt < 0 || insertAt > value.length) {
        throw new Error(`Posisi ${insertAt} di luar range (0–${value.length}).`);
      }

      const next = [...value];
      next.splice(insertAt, 0, item);
      const { content: nextContent } = setAtPath(working.content, itemPath, next);
      const result = await persistSection(section, nextContent, mode);

      return jsonResult({
        section,
        path: itemPath,
        index: insertAt,
        item,
        ...result,
      });
    }
  );

  server.registerTool(
    'update_item',
    {
      title: 'Update CMS item',
      description:
        'Edit satu item memakai patch (deep merge) atau item penuh. Default masuk draft.',
      inputSchema: {
        section: sectionSchema,
        path: itemPathSchema,
        index: itemIndexSchema,
        match: itemMatchSchema,
        item: z.unknown().optional().describe('Item pengganti penuh.'),
        patch: recordSchema.optional().describe('Field yang diubah (deep merge).'),
        mode: modeSchema,
      },
    },
    async ({ section, path: itemPath, index, match, item, patch, mode }) => {
      if (item === undefined && patch === undefined) {
        throw new Error('Isi salah satu: item (pengganti penuh) atau patch (partial).');
      }

      if (item !== undefined && patch !== undefined) {
        throw new Error('Gunakan item atau patch, bukan keduanya.');
      }

      const snapshot = await loadSnapshot();
      const working = workingContent(section, snapshot);
      const { value } = getAtPath(working.content, itemPath);

      if (!Array.isArray(value)) {
        throw new Error(`Path "${itemPath}" bukan array pada section "${section}".`);
      }

      const resolvedIndex = resolveItemIndex(value, { index, match });
      const current = value[resolvedIndex];
      let updated;

      if (item !== undefined) {
        updated = item;
      } else {
        if (!isPlainObject(current)) {
          throw new Error(
            'Item saat ini bukan object; gunakan item (pengganti penuh), bukan patch.'
          );
        }

        updated = deepMerge(current, requireRecord(patch, 'patch'));
      }

      const next = [...value];
      next[resolvedIndex] = updated;
      const { content: nextContent } = setAtPath(working.content, itemPath, next);
      const result = await persistSection(section, nextContent, mode);

      return jsonResult({
        section,
        path: itemPath,
        index: resolvedIndex,
        item: updated,
        ...result,
      });
    }
  );

  server.registerTool(
    'delete_item',
    {
      title: 'Delete CMS item',
      description:
        'Hapus satu item dari path array. Butuh confirm=true. Default masuk draft; mode=publish langsung live.',
      inputSchema: {
        section: sectionSchema,
        path: itemPathSchema,
        index: itemIndexSchema,
        match: itemMatchSchema,
        mode: modeSchema,
        confirm: z.literal(true).describe('Harus true untuk menghapus.'),
      },
    },
    async ({ section, path: itemPath, index, match, mode }) => {
      const snapshot = await loadSnapshot();
      const working = workingContent(section, snapshot);
      const { value } = getAtPath(working.content, itemPath);

      if (!Array.isArray(value)) {
        throw new Error(`Path "${itemPath}" bukan array pada section "${section}".`);
      }

      const resolvedIndex = resolveItemIndex(value, { index, match });
      const removed = value[resolvedIndex];
      const next = value.filter((_item, itemIndex) => itemIndex !== resolvedIndex);
      const { content: nextContent } = setAtPath(working.content, itemPath, next);
      const result = await persistSection(section, nextContent, mode);

      return jsonResult({
        section,
        path: itemPath,
        index: resolvedIndex,
        removed,
        ...result,
      });
    }
  );

  server.registerTool(
    'move_item',
    {
      title: 'Move CMS item',
      description: 'Pindahkan urutan item di path array. Default masuk draft.',
      inputSchema: {
        section: sectionSchema,
        path: itemPathSchema,
        from: z.union([z.number().int().min(0), z.string().min(1)]),
        to: z.number().int().min(0),
        mode: modeSchema,
      },
    },
    async ({ section, path: itemPath, from, to, mode }) => {
      const snapshot = await loadSnapshot();
      const working = workingContent(section, snapshot);
      const { value } = getAtPath(working.content, itemPath);

      if (!Array.isArray(value)) {
        throw new Error(`Path "${itemPath}" bukan array pada section "${section}".`);
      }

      const fromIndex = resolveItemIndex(value, {
        index: typeof from === 'number' ? from : undefined,
        match: typeof from === 'string' ? from : undefined,
      });

      if (to < 0 || to >= value.length) {
        throw new Error(`Tujuan ${to} di luar range (0–${value.length - 1}).`);
      }

      if (fromIndex === to) {
        return jsonResult({
          section,
          path: itemPath,
          from: fromIndex,
          to,
          moved: value[fromIndex],
          changed: false,
        });
      }

      const next = [...value];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(to, 0, moved);
      const { content: nextContent } = setAtPath(working.content, itemPath, next);
      const result = await persistSection(section, nextContent, mode);

      return jsonResult({
        section,
        path: itemPath,
        from: fromIndex,
        to,
        moved,
        changed: true,
        ...result,
      });
    }
  );

  server.registerTool(
    'set_field',
    {
      title: 'Set CMS field',
      description:
        'Set satu nilai pada path field, misalnya site.email atau hero.headline[0]. Default masuk draft.',
      inputSchema: {
        section: sectionSchema,
        path: z.string().min(1).describe('Path field, misalnya site.email atau hero.headline[0].'),
        value: z.unknown().describe('Nilai JSON baru.'),
        mode: modeSchema,
      },
    },
    async ({ section, path: fieldPath, value, mode }) => {
      if (value === undefined) {
        throw new Error('value wajib diisi.');
      }

      const snapshot = await loadSnapshot();
      const working = workingContent(section, snapshot);
      const { content: nextContent, previousValue } = setAtPath(working.content, fieldPath, value);
      const result = await persistSection(section, nextContent, mode);

      return jsonResult({
        section,
        path: fieldPath,
        previousValue,
        value,
        ...result,
      });
    }
  );

  server.registerTool(
    'patch_section',
    {
      title: 'Patch CMS section',
      description:
        'Deep-merge sebagian field ke satu section. Array diganti utuh. Default masuk draft.',
      inputSchema: {
        section: sectionSchema,
        patch: recordSchema.describe('Object berisi field yang diubah.'),
        mode: modeSchema,
      },
    },
    async ({ section, patch, mode }) => {
      const snapshot = await loadSnapshot();
      const working = workingContent(section, snapshot);
      const nextContent = deepMerge(working.content, requireRecord(patch, 'patch'));
      const result = await persistSection(section, nextContent, mode);

      return jsonResult({
        section,
        changedKeys: Object.keys(patch),
        ...result,
      });
    }
  );

  server.registerTool(
    'save_section',
    {
      title: 'Replace CMS section',
      description:
        'Ganti seluruh isi section dengan content yang diberikan. Gunakan patch_section atau item tools bila hanya mengubah sebagian. Default masuk draft.',
      inputSchema: {
        section: sectionSchema,
        content: recordSchema.describe('Isi section lengkap.'),
        mode: modeSchema,
      },
    },
    async ({ section, content, mode }) => {
      const result = await persistSection(section, content, mode);

      return jsonResult({
        section,
        ...result,
      });
    }
  );

  server.registerTool(
    'publish_section',
    {
      title: 'Publish CMS section',
      description:
        'Terapkan draft section ke MySQL, atau publish content yang diberikan. Draft otomatis dibersihkan oleh API.',
      inputSchema: {
        section: sectionSchema,
        content: recordSchema
          .optional()
          .describe('Isi yang dipublish. Kosongkan untuk memakai draft.'),
      },
    },
    async ({ section, content }) => {
      let publishContent = content;

      if (!publishContent) {
        const snapshot = await loadSnapshot();
        const draft = snapshot.drafts[section];

        if (!draft) {
          throw new Error(
            `Section "${section}" tidak punya draft. Simpan perubahan dulu atau kirim content.`
          );
        }

        publishContent = draft.content;
      }

      const result = await api.saveSection(
        section,
        requireRecord(publishContent, 'Published content')
      );

      return jsonResult({
        section,
        published: true,
        live: true,
        ...result,
      });
    }
  );

  server.registerTool(
    'discard_draft',
    {
      title: 'Discard CMS draft',
      description: 'Hapus draft satu section dan kembali ke konten live.',
      inputSchema: { section: sectionSchema },
    },
    async ({ section }) => {
      const result = await api.clearDraft(section);

      return jsonResult({
        section,
        discarded: true,
        ...result,
      });
    }
  );

  server.registerTool(
    'list_revisions',
    {
      title: 'List CMS revisions',
      description: 'Lihat riwayat revisi satu section. Default hanya metadata, bukan isi penuh.',
      inputSchema: {
        section: sectionSchema,
        limit: z.number().int().min(1).max(50).default(10),
        includeContent: z.boolean().default(false),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ section, limit, includeContent }) => {
      const data = await api.listRevisions(section, limit);
      const revisions = (data?.revisions ?? []).map(revision => {
        const serialized = JSON.stringify(revision.content);

        return {
          id: revision.id,
          createdAt: revision.createdAt,
          bytes: serialized.length,
          topLevelKeys: isPlainObject(revision.content) ? Object.keys(revision.content) : [],
          ...(includeContent ? { content: revision.content } : {}),
        };
      });

      return jsonResult({
        section,
        count: revisions.length,
        revisions,
      });
    }
  );

  server.registerTool(
    'restore_revision',
    {
      title: 'Restore CMS revision',
      description:
        'Kembalikan satu revisi ke draft atau langsung publish. Butuh revisionId dari list_revisions.',
      inputSchema: {
        section: sectionSchema,
        revisionId: z.number().int().positive(),
        mode: modeSchema,
      },
    },
    async ({ section, revisionId, mode }) => {
      const data = await api.listRevisions(section, 100);
      const revision = (data?.revisions ?? []).find(entry => Number(entry.id) === revisionId);

      if (!revision) {
        throw new Error(
          `Revisi ${revisionId} tidak ditemukan. Panggil list_revisions untuk melihat ID yang tersedia.`
        );
      }

      const result = await persistSection(section, revision.content, mode);

      return jsonResult({
        section,
        revisionId,
        createdAt: revision.createdAt,
        ...result,
      });
    }
  );

  server.registerTool(
    'list_uploads',
    {
      title: 'List CMS uploads',
      description: 'Daftar file upload yang tersimpan di CMS.',
      inputSchema: {
        offset: z.number().int().min(0).default(0),
        limit: z.number().int().min(1).max(100).default(50),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ offset, limit }) => {
      const data = await api.listUploads();
      const uploads = data?.uploads ?? [];

      return jsonResult({
        total: uploads.length,
        offset,
        limit,
        uploads: uploads.slice(offset, offset + limit),
      });
    }
  );

  server.registerTool(
    'upload_file',
    {
      title: 'Upload CMS file',
      description:
        'Upload gambar/video/PDF dari path lokal (absolut atau relatif dari root repo) atau base64. URL hasil bisa dipakai di field konten.',
      inputSchema: {
        path: z.string().min(1).optional().describe('Path file lokal.'),
        base64: z.string().min(1).optional().describe('Isi file base64 (boleh data URL).'),
        filename: z.string().min(1).optional(),
        mimeType: z.string().min(1).optional().describe('Contoh: image/png atau application/pdf.'),
      },
    },
    async ({ path: inputPath, base64, filename, mimeType }) => {
      if ((inputPath && base64) || (!inputPath && !base64)) {
        throw new Error('Isi salah satu: path atau base64.');
      }

      let bytes;
      let resolvedFilename = filename;
      let resolvedMimeType = mimeType;
      let sourceLabel;

      if (inputPath) {
        const absolutePath = path.isAbsolute(inputPath)
          ? inputPath
          : path.resolve(process.cwd(), inputPath);
        const stat = await fs.stat(absolutePath);

        if (!stat.isFile()) {
          throw new Error(`"${inputPath}" bukan file.`);
        }

        if (stat.size > config.maxUploadBytes) {
          throw new Error(
            `File terlalu besar (${stat.size} bytes). Batas ${config.maxUploadBytes} bytes.`
          );
        }

        bytes = await fs.readFile(absolutePath);
        resolvedFilename ??= path.basename(absolutePath);
        resolvedMimeType ??= EXTENSION_MIME_TYPES.get(path.extname(absolutePath).toLowerCase());
        sourceLabel = absolutePath;
      } else {
        let base64Data = base64.trim();
        const dataUrl = /^data:([^;]+);base64,(.*)$/s.exec(base64Data);

        if (dataUrl) {
          resolvedMimeType ??= dataUrl[1];
          base64Data = dataUrl[2];
        }

        const compactBase64 = base64Data.replace(/\s+/g, '');
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(compactBase64)) {
          throw new Error('Nilai base64 tidak valid.');
        }

        bytes = Buffer.from(compactBase64, 'base64');
        sourceLabel = 'base64';

        if (bytes.length === 0) {
          throw new Error('File base64 kosong.');
        }

        if (bytes.length > config.maxUploadBytes) {
          throw new Error(
            `File terlalu besar (${bytes.length} bytes). Batas ${config.maxUploadBytes} bytes.`
          );
        }

        resolvedFilename ??= `upload-${Date.now()}${
          EXTENSION_MIME_TYPES.has(resolvedMimeType) ? MIME_EXTENSIONS.get(resolvedMimeType) : ''
        }`;
      }

      resolvedMimeType ??= EXTENSION_MIME_TYPES.get(
        path.extname(resolvedFilename ?? '').toLowerCase()
      );

      if (!resolvedMimeType || !MIME_EXTENSIONS.has(resolvedMimeType)) {
        throw new Error(`Tipe file tidak didukung. Gunakan: ${ALLOWED_MIME_TYPES.join(', ')}.`);
      }

      const result = await api.uploadBytes(bytes, resolvedFilename, resolvedMimeType);

      return jsonResult({
        upload: result.upload,
        source: sourceLabel,
        note: 'Pakai upload.url pada field konten, misalnya cover, gallery, image, atau href PDF.',
      });
    }
  );

  server.registerTool(
    'delete_upload',
    {
      title: 'Delete CMS upload',
      description:
        'Hapus file upload dari disk dan database. Butuh confirm=true. Ganti referensi di konten terlebih dahulu.',
      inputSchema: {
        id: z.number().int().positive(),
        confirm: z.literal(true).describe('Harus true untuk menghapus file.'),
      },
    },
    async ({ id }) => {
      const result = await api.deleteUpload(id);

      return jsonResult({
        id,
        deleted: true,
        ...result,
      });
    }
  );

  server.registerTool(
    'reset_content',
    {
      title: 'Reset all CMS content',
      description:
        'Hapus semua konten dan draft di MySQL. File upload tidak dihapus. Butuh confirm="RESET_PORTFOLIO_CMS".',
      inputSchema: {
        confirm: z
          .literal('RESET_PORTFOLIO_CMS')
          .describe('Tulis RESET_PORTFOLIO_CMS untuk melanjutkan.'),
      },
    },
    async () => {
      const result = await api.resetContent();

      return jsonResult({
        reset: true,
        content:
          'Semua section dan draft sudah dihapus. Konten publik kembali ke default src/content.',
        ...result,
      });
    }
  );

  return server;
}
