import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { after, describe, test } from 'node:test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createCmsMcpServer } from '../mcp/server.mjs';

const TEMP_ROOT = path.join(os.tmpdir(), 'portfolio-cms-mcp-tests');

function clone(value) {
  return value === undefined ? undefined : structuredClone(value);
}

function now() {
  return new Date().toISOString();
}

function createFakeApi(seed = {}) {
  const state = {
    sections: clone(seed.sections ?? {}),
    drafts: clone(seed.drafts ?? {}),
    revisions: clone(seed.revisions ?? {}),
    uploads: clone(seed.uploads ?? []),
  };
  let revisionId = 1;
  let uploadId = state.uploads.length;

  return {
    baseUrl: 'http://fake-cms/api',
    state,

    async health() {
      return { ok: true };
    },

    async getContent() {
      return { sections: clone(state.sections) };
    },

    async getDrafts() {
      return { drafts: clone(state.drafts) };
    },

    async saveSection(section, content) {
      const updatedAt = now();
      state.sections[section] = { content: clone(content), updatedAt };
      delete state.drafts[section];
      state.revisions[section] ??= [];
      state.revisions[section].unshift({
        id: revisionId,
        section,
        content: clone(content),
        createdAt: updatedAt,
      });
      revisionId += 1;
      return { section, updatedAt };
    },

    async saveDraft(section, content) {
      const savedAt = now();
      state.drafts[section] = { content: clone(content), savedAt };
      return { section, savedAt };
    },

    async clearDraft(section) {
      delete state.drafts[section];
      return { ok: true };
    },

    async listRevisions(section, limit = 20) {
      return { revisions: clone((state.revisions[section] ?? []).slice(0, limit)) };
    },

    async resetContent() {
      state.sections = {};
      state.drafts = {};
      state.revisions = {};
      return { ok: true };
    },

    async listUploads() {
      return { uploads: clone(state.uploads) };
    },

    async uploadBytes(bytes, filename, mimeType) {
      uploadId += 1;
      const upload = {
        id: uploadId,
        originalName: filename,
        mimeType,
        size: bytes.length,
        url: `/uploads/fake-${uploadId}`,
        createdAt: now(),
      };
      state.uploads.push(upload);
      return { upload: clone(upload) };
    },

    async deleteUpload(id) {
      state.uploads = state.uploads.filter(upload => upload.id !== id);
      return { ok: true };
    },
  };
}

function defaultsForTests() {
  return {
    hero: {
      brand: 'Default brand',
      headline: ['Default headline', 'second line'],
      nav: [{ label: 'Work', href: '#work' }],
    },
    about: {
      eyebrow: 'Default about',
      certificates: {
        label: 'Credentials',
        heading: ['Every', 'certificate.'],
        note: '0 certificates',
        items: [],
      },
    },
    work: {
      eyebrow: 'Default work',
      projects: [],
    },
    videos: {
      eyebrow: 'Default videos',
      clips: [],
    },
    site: {
      name: 'Default name',
      email: 'default@example.com',
      socials: [],
      footerNav: [],
    },
  };
}

async function createSession(seed = {}) {
  const api = createFakeApi(seed);
  const server = createCmsMcpServer({
    api,
    defaults: defaultsForTests(),
  });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  await server.connect(serverTransport);

  const client = new Client({ name: 'cms-mcp-test', version: '1.0.0' });
  await client.connect(clientTransport);

  return {
    api,
    client,
    async close() {
      await client.close();
      await server.close();
    },
  };
}

async function callTool(session, name, args = {}) {
  const result = await session.client.callTool({ name, arguments: args });
  const text = result.content?.[0]?.type === 'text' ? result.content[0].text : '';

  if (result.isError) {
    throw new Error(text);
  }

  return JSON.parse(text);
}

async function expectToolError(session, name, args, pattern) {
  const result = await session.client.callTool({ name, arguments: args });
  assert.equal(result.isError, true);
  assert.match(result.content[0].text, pattern);
}

after(async () => {
  await fs.rm(TEMP_ROOT, { recursive: true, force: true }).catch(() => undefined);
});

describe('CMS MCP server', () => {
  test('registers the full CMS tool set', async () => {
    const session = await createSession();

    try {
      const result = await session.client.listTools();
      const names = result.tools.map(tool => tool.name).sort();

      assert.deepEqual(names, [
        'cms_status',
        'create_item',
        'delete_item',
        'delete_upload',
        'discard_draft',
        'get_item',
        'get_section',
        'list_items',
        'list_revisions',
        'list_uploads',
        'move_item',
        'patch_section',
        'publish_section',
        'reset_content',
        'restore_revision',
        'save_section',
        'search_content',
        'set_field',
        'update_item',
        'upload_file',
      ]);
    } finally {
      await session.close();
    }
  });

  test('merges default content with saved content for reads', async () => {
    const session = await createSession({
      sections: {
        hero: {
          content: { brand: 'Live brand' },
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      },
    });

    try {
      const section = await callTool(session, 'get_section', { section: 'hero' });

      assert.equal(section.workingSource, 'published');
      assert.equal(section.workingContent.brand, 'Live brand');
      assert.deepEqual(section.workingContent.headline, ['Default headline', 'second line']);
    } finally {
      await session.close();
    }
  });

  test('saves item changes as a draft and publishes them explicitly', async () => {
    const session = await createSession();

    try {
      const created = await callTool(session, 'create_item', {
        section: 'about',
        path: 'certificates.items',
        item: {
          title: 'New certificate',
          issuer: 'Test issuer',
          year: '2026',
          href: '/documents/test.pdf',
        },
      });

      assert.equal(created.live, false);
      assert.equal(created.index, 0);
      assert.equal(session.api.state.drafts.about.content.certificates.items.length, 1);
      assert.equal(session.api.state.sections.about, undefined);

      const draftSection = await callTool(session, 'get_section', { section: 'about' });
      assert.equal(draftSection.workingSource, 'draft');
      assert.equal(draftSection.workingContent.certificates.items[0].title, 'New certificate');

      const published = await callTool(session, 'publish_section', { section: 'about' });
      assert.equal(published.live, true);
      assert.equal(session.api.state.drafts.about, undefined);
      assert.equal(
        session.api.state.sections.about.content.certificates.items[0].title,
        'New certificate'
      );
    } finally {
      await session.close();
    }
  });

  test('updates by match and sets a nested field', async () => {
    const session = await createSession({
      sections: {
        work: {
          content: {
            eyebrow: 'Work',
            projects: [
              { title: 'Alpha', year: '2024', tags: ['PHP'] },
              { title: 'Beta', year: '2025', tags: ['React'] },
            ],
          },
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      },
    });

    try {
      const updated = await callTool(session, 'update_item', {
        section: 'work',
        path: 'projects',
        match: 'Alpha',
        patch: { summary: 'Updated summary', tags: ['Laravel'] },
      });

      assert.equal(updated.index, 0);
      assert.deepEqual(updated.item.tags, ['Laravel']);

      const field = await callTool(session, 'set_field', {
        section: 'work',
        path: 'projects[1].year',
        value: '2026',
      });

      assert.equal(field.previousValue, '2025');
      assert.equal(field.value, '2026');
      assert.equal(session.api.state.drafts.work.content.projects[1].year, '2026');

      const list = await callTool(session, 'list_items', {
        section: 'work',
        path: 'projects',
        query: 'Alpha',
      });

      assert.equal(list.source, 'draft');
      assert.equal(list.total, 1);
      assert.equal(list.items[0].preview, 'Updated summary');
    } finally {
      await session.close();
    }
  });

  test('searches content and returns a usable path', async () => {
    const session = await createSession({
      sections: {
        site: {
          content: {
            name: 'Rizky',
            email: 'hello@example.com',
            socials: [{ label: 'GitHub', href: 'https://github.com/rizky' }],
          },
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      },
    });

    try {
      const result = await callTool(session, 'search_content', {
        query: 'github',
        sections: ['site'],
      });

      assert.equal(result.total, 2);
      assert.ok(result.matches.some(match => match.path === 'site.socials[0].href'));
    } finally {
      await session.close();
    }
  });

  test('requires confirmation for destructive operations', async () => {
    const session = await createSession({
      sections: {
        work: {
          content: { projects: [{ title: 'Alpha' }] },
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      },
    });

    try {
      await expectToolError(
        session,
        'delete_item',
        { section: 'work', path: 'projects', index: 0 },
        /confirm/i
      );

      const deleted = await callTool(session, 'delete_item', {
        section: 'work',
        path: 'projects',
        index: 0,
        confirm: true,
      });

      assert.equal(deleted.removed.title, 'Alpha');
      assert.equal(session.api.state.drafts.work.content.projects.length, 0);

      await expectToolError(session, 'reset_content', { confirm: 'WRONG' }, /RESET_PORTFOLIO_CMS/);

      const reset = await callTool(session, 'reset_content', {
        confirm: 'RESET_PORTFOLIO_CMS',
      });

      assert.equal(reset.reset, true);
      assert.deepEqual(session.api.state.sections, {});
    } finally {
      await session.close();
    }
  });

  test('lists revisions without dumping content by default', async () => {
    const session = await createSession({
      revisions: {
        hero: [
          {
            id: 7,
            section: 'hero',
            content: { brand: 'Old brand' },
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        ],
      },
    });

    try {
      const list = await callTool(session, 'list_revisions', { section: 'hero' });
      assert.equal(list.revisions[0].id, 7);
      assert.equal(list.revisions[0].content, undefined);
      assert.deepEqual(list.revisions[0].topLevelKeys, ['brand']);

      const restored = await callTool(session, 'restore_revision', {
        section: 'hero',
        revisionId: 7,
      });

      assert.equal(restored.mode, 'draft');
      assert.equal(session.api.state.drafts.hero.content.brand, 'Old brand');
    } finally {
      await session.close();
    }
  });

  test('uploads a local file through the API client', async () => {
    const session = await createSession();
    const tempDir = path.join(TEMP_ROOT, 'upload');
    const filePath = path.join(tempDir, 'cover.png');

    try {
      await fs.mkdir(tempDir, { recursive: true });
      await fs.writeFile(filePath, Buffer.from([0x89, 0x50, 0x4e, 0x47]));

      const result = await callTool(session, 'upload_file', { path: filePath });

      assert.equal(result.upload.originalName, 'cover.png');
      assert.equal(result.upload.mimeType, 'image/png');
      assert.equal(result.upload.size, 4);
      assert.equal(session.api.state.uploads.length, 1);
    } finally {
      await session.close();
    }
  });

  test('reports status with collections and drafts', async () => {
    const session = await createSession({
      sections: {
        work: {
          content: { projects: [{ title: 'Alpha' }, { title: 'Beta' }] },
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      },
      drafts: {
        site: { content: { name: 'Draft name' }, savedAt: '2026-01-02T00:00:00.000Z' },
      },
    });

    try {
      const status = await callTool(session, 'cms_status');

      assert.equal(status.health.ok, true);
      assert.equal(status.sections.work.collections.projects, 2);
      assert.equal(status.sections.site.workingSource, 'draft');
      assert.ok(status.sections.site.draft.savedAt);
    } finally {
      await session.close();
    }
  });
});
