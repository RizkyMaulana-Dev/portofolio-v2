"use client";

import type { Project, WorkAccent, WorkContent, WorkVisual } from "@/content/work";
import {
  CommaListField,
  FileDropField,
  FormShell,
  MediaListField,
  SelectField,
  SettingsDisclosure,
  TextAreaField,
  TextField,
} from "@/components/admin/admin-fields";
import {
  CollectionManager,
  DetailGallery,
  DetailGrid,
  DetailImage,
} from "@/components/admin/collection-manager";
import { useSectionDraft, type SectionEditorProps } from "@/components/admin/admin-types";
import { withBase } from "@/lib/paths";

const ACCENT_OPTIONS: Array<{ value: WorkAccent; label: string }> = [
  { value: "violet", label: "Violet" },
  { value: "sky", label: "Sky" },
  { value: "peach", label: "Peach" },
  { value: "lime", label: "Lime" },
];

const VISUAL_OPTIONS: Array<{ value: WorkVisual; label: string }> = [
  { value: "halo", label: "Halo" },
  { value: "arch", label: "Arch" },
  { value: "stack", label: "Stack" },
  { value: "bars", label: "Bars" },
];

const STATUS_LABELS: Record<NonNullable<Project["status"]>, string> = {
  completed: "Completed",
  "in-progress": "In progress",
  planned: "Planned",
};

function createProject(): Project {
  return {
    title: "New project",
    category: "Category",
    year: "2026",
    summary: "Short project summary.",
    tags: ["Tag"],
    mark: "N",
    href: "#",
    accent: "violet",
    visual: "halo",
  };
}

function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) {
    return <span className="text-foreground/35">—</span>;
  }

  return (
    <span className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-[var(--color-border)] bg-[var(--color-glass)] px-2 py-1 text-[10px] text-foreground/60"
        >
          {tag}
        </span>
      ))}
    </span>
  );
}

function ProjectEditor({
  project,
  onChange,
}: {
  project: Project;
  onChange: (patch: Partial<Project>) => void;
}) {
  return (
    <>
      <TextField
        label="Judul"
        value={project.title}
        onChange={(title) => onChange({ title })}
      />
      <TextField
        label="Kategori"
        value={project.category}
        onChange={(category) => onChange({ category })}
      />
      <TextField
        label="Tahun"
        value={project.year}
        onChange={(year) => onChange({ year })}
      />
      <TextField
        label="Mark"
        value={project.mark}
        onChange={(mark) => onChange({ mark })}
        hint="Huruf atau inisial di cover."
      />
      <TextField
        label="Link project"
        value={project.href}
        onChange={(href) => onChange({ href })}
      />
      <SelectField
        label="Accent"
        value={project.accent}
        onChange={(accent) => onChange({ accent })}
        options={ACCENT_OPTIONS}
      />
      <SelectField
        label="Bentuk cover"
        value={project.visual}
        onChange={(visual) => onChange({ visual })}
        options={VISUAL_OPTIONS}
      />
      <CommaListField
        label="Tags"
        value={project.tags}
        onChange={(tags) => onChange({ tags })}
        hint="Pisahkan dengan koma."
      />
      <TextAreaField
        label="Ringkasan"
        value={project.summary}
        onChange={(summary) => onChange({ summary })}
        className="md:col-span-2"
      />
      <FileDropField
        label="Cover image"
        value={project.cover ?? ""}
        onChange={(cover) => onChange({ cover: cover || undefined })}
        accept="image/*"
        kind="image"
        hint="Tarik gambar ke area di atas atau tempel path seperti /images/work/slug/cover.webp."
        className="md:col-span-2"
      />
      <FileDropField
        label="Video utama"
        value={project.video ?? ""}
        onChange={(video) => onChange({ video: video || undefined })}
        accept="video/*"
        kind="video"
        hint="Video pendek untuk halaman detail project. Format MP4/WebM/MOV."
        className="md:col-span-2"
      />
      <MediaListField
        label="Gallery gambar"
        values={project.gallery ?? []}
        onChange={(gallery) => onChange({ gallery })}
        accept="image/*"
        kind="image"
        hint="Urutan gambar mengikuti urutan di halaman detail project."
        className="md:col-span-2"
      />
      <MediaListField
        label="Video tambahan"
        values={project.videos ?? []}
        onChange={(videos) => onChange({ videos })}
        accept="video/*"
        kind="video"
        hint="Opsional. Beberapa video bisa ditambahkan di sini."
        className="md:col-span-2"
      />
    </>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  const hasLink = project.href && project.href !== "#";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
      <div>
        <DetailGrid
          fields={[
            { label: "Kategori", value: project.category },
            { label: "Tahun", value: project.year },
            { label: "Status", value: project.status ? STATUS_LABELS[project.status] : undefined },
            { label: "Mark", value: project.mark },
            { label: "Accent", value: project.accent },
            { label: "Bentuk cover", value: project.visual },
            {
              label: "Tags",
              value: <TagList tags={project.tags} />,
              full: true,
            },
            {
              label: "Ringkasan",
              value: project.summary,
              full: true,
            },
            {
              label: "Link project",
              value: hasLink ? (
                <a
                  href={withBase(project.href)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 underline decoration-foreground/25 underline-offset-4 transition-colors hover:text-foreground"
                >
                  {project.href}
                </a>
              ) : undefined,
              full: true,
            },
          ]}
        />

        {project.gallery?.length ? (
          <div className="mt-6">
            <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.16em] text-foreground/40">
              Gallery · {project.gallery.length} gambar
            </p>
            <DetailGallery values={project.gallery} alt={project.title} />
          </div>
        ) : null}
      </div>

      <div className="space-y-3">
        <DetailImage src={project.cover} alt={project.title} />
        <p className="text-[10px] leading-relaxed text-foreground/40">
          Cover project tampil sebagai visual utama di homepage dan halaman detail.
        </p>
        {project.video ? (
          <a
            href={withBase(project.video)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-9 w-full items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-glass)] px-3 text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/55 transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            Buka video utama
          </a>
        ) : null}
      </div>
    </div>
  );
}

export function WorkSection({ section, value, onSave, onReset }: SectionEditorProps<WorkContent>) {
  const {
    draft,
    setDraft,
    isDirty,
    isSaving,
    restoredAt,
    save,
    discardDraft,
  } = useSectionDraft(section, value, onSave);

  function updateHeading(index: 0 | 1, next: string) {
    setDraft((current) => {
      const heading = [...current.heading] as [string, string];
      heading[index] = next;
      return { ...current, heading };
    });
  }

  return (
    <FormShell
      eyebrow="Homepage / Work"
      title="Work"
      description="Klik project di tabel untuk melihat detail, lalu masuk ke mode edit. Project yang tampil sebagai kartu sticky di homepage tetap mengikuti urutan tabel."
      isDirty={isDirty}
      isSaving={isSaving}
      restoredAt={restoredAt}
      onSave={save}
      onReset={onReset}
      onDiscardDraft={discardDraft}
    >
      <CollectionManager<Project>
        title="Projects"
        description="Cari project, buka detail individual, lalu edit tanpa menggulir seluruh halaman."
        items={draft.projects}
        onChange={(projects) => setDraft((current) => ({ ...current, projects }))}
        getKey={(project, index) => project.slug || `${project.title}-${index}`}
        getTitle={(project) => project.title}
        getSubtitle={(project) => project.category}
        searchText={(project) =>
          [project.title, project.category, project.year, project.summary, ...project.tags].join(" ")
        }
        columns={[
          {
            key: "project",
            header: "Project",
            render: (project) => (
              <span className="block max-w-[220px] sm:max-w-[360px]">
                <span className="block truncate text-sm font-medium text-foreground">
                  {project.title}
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-foreground/45">
                  {project.summary}
                </span>
              </span>
            ),
          },
          {
            key: "category",
            header: "Category",
            className: "hidden md:table-cell",
            render: (project) => (
              <span className="text-xs text-foreground/55">{project.category}</span>
            ),
          },
          {
            key: "year",
            header: "Year",
            className: "hidden sm:table-cell",
            render: (project) => (
              <span className="text-xs text-foreground/55">{project.year}</span>
            ),
          },
          {
            key: "assets",
            header: "Assets",
            className: "hidden lg:table-cell",
            render: (project) => (
              <span className="flex flex-wrap items-center gap-1.5">
                {project.cover ? (
                  <span className="rounded-full border border-lime/40 bg-lime/15 px-2 py-0.5 text-[9px] text-foreground/60">
                    Cover
                  </span>
                ) : null}
                {project.gallery?.length ? (
                  <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-glass)] px-2 py-0.5 text-[9px] text-foreground/50">
                    {project.gallery.length} foto
                  </span>
                ) : null}
                {!project.cover && !project.gallery?.length ? (
                  <span className="text-[9px] text-foreground/35">—</span>
                ) : null}
              </span>
            ),
          },
        ]}
        createItem={createProject}
        renderDetail={(project) => <ProjectDetail project={project} />}
        renderEditor={(project, patch) => (
          <ProjectEditor project={project} onChange={patch} />
        )}
        addLabel="Tambah project"
        itemLabel="project"
        emptyLabel="Belum ada project. Tambahkan project pertama dari tombol di atas."
        className="mt-8"
      />

      <SettingsDisclosure
        title="Pengaturan section Work"
        description="Judul dan intro section Work. Pengaturan ini tidak perlu dibuka saat mengedit project."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Eyebrow"
            value={draft.eyebrow}
            onChange={(eyebrow) => setDraft((current) => ({ ...current, eyebrow }))}
            className="md:col-span-2"
          />
          <TextField
            label="Heading — baris 1"
            value={draft.heading[0]}
            onChange={(next) => updateHeading(0, next)}
          />
          <TextField
            label="Heading — baris 2"
            value={draft.heading[1]}
            onChange={(next) => updateHeading(1, next)}
          />
          <TextAreaField
            label="Intro"
            value={draft.intro}
            onChange={(intro) => setDraft((current) => ({ ...current, intro }))}
            className="md:col-span-2"
          />
          <TextField
            label="Periode"
            value={draft.period}
            onChange={(period) => setDraft((current) => ({ ...current, period }))}
          />
        </div>
      </SettingsDisclosure>
    </FormShell>
  );
}
