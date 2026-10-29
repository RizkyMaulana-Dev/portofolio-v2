"use client";

import type {
  VideoAccent,
  VideoClip,
  VideoFeedContent,
  VideoVisual,
} from "@/content/videos";
import {
  FormShell,
  SelectField,
  SettingsDisclosure,
  TextAreaField,
  TextField,
} from "@/components/admin/admin-fields";
import {
  CollectionManager,
  DetailGrid,
} from "@/components/admin/collection-manager";
import { useSectionDraft, type SectionEditorProps } from "@/components/admin/admin-types";

const ACCENT_OPTIONS: Array<{ value: VideoAccent; label: string }> = [
  { value: "sun", label: "Sun" },
  { value: "rose", label: "Rose" },
  { value: "sky", label: "Sky" },
  { value: "violet", label: "Violet" },
  { value: "lime", label: "Lime" },
];

const VISUAL_OPTIONS: Array<{ value: VideoVisual; label: string }> = [
  { value: "horizon", label: "Horizon" },
  { value: "portal", label: "Portal" },
  { value: "fold", label: "Fold" },
  { value: "meter", label: "Meter" },
  { value: "orbit", label: "Orbit" },
];

function createClip(): VideoClip {
  return {
    slug: `new-clip-${Date.now().toString(36)}`,
    title: "New clip",
    category: "Process note",
    date: "2026",
    duration: "00:30",
    description: "Short clip description.",
    accent: "sun",
    visual: "horizon",
    mark: "New",
    likes: 0,
    shares: 0,
    comments: [],
  };
}

function ClipEditor({
  clip,
  onChange,
}: {
  clip: VideoClip;
  onChange: (patch: Partial<VideoClip>) => void;
}) {
  return (
    <>
      <TextField
        label="Slug"
        value={clip.slug}
        onChange={(slug) => onChange({ slug })}
        hint="Dipakai di URL /feed?clip=…"
      />
      <TextField
        label="Judul"
        value={clip.title}
        onChange={(title) => onChange({ title })}
      />
      <TextField
        label="Kategori"
        value={clip.category}
        onChange={(category) => onChange({ category })}
      />
      <TextField
        label="Tanggal"
        value={clip.date}
        onChange={(date) => onChange({ date })}
      />
      <TextField
        label="Durasi"
        value={clip.duration}
        onChange={(duration) => onChange({ duration })}
      />
      <TextField
        label="Mark"
        value={clip.mark}
        onChange={(mark) => onChange({ mark })}
        hint="Label kecil di artwork."
      />
      <SelectField
        label="Accent"
        value={clip.accent}
        onChange={(accent) => onChange({ accent })}
        options={ACCENT_OPTIONS}
      />
      <SelectField
        label="Bentuk artwork"
        value={clip.visual}
        onChange={(visual) => onChange({ visual })}
        options={VISUAL_OPTIONS}
      />
      <TextAreaField
        label="Deskripsi"
        value={clip.description}
        onChange={(description) => onChange({ description })}
        className="md:col-span-2"
      />
    </>
  );
}

function ClipDetail({ clip }: { clip: VideoClip }) {
  return (
    <DetailGrid
      fields={[
        { label: "Slug", value: clip.slug },
        { label: "Kategori", value: clip.category },
        { label: "Tanggal", value: clip.date },
        { label: "Durasi", value: clip.duration },
        { label: "Mark", value: clip.mark },
        { label: "Accent", value: clip.accent },
        { label: "Bentuk artwork", value: clip.visual },
        { label: "Likes", value: String(clip.likes) },
        { label: "Shares", value: String(clip.shares) },
        { label: "Comments", value: `${clip.comments.length} komentar` },
        {
          label: "Deskripsi",
          value: clip.description,
          full: true,
        },
      ]}
    />
  );
}

export function VideosSection({
  section,
  value,
  onSave,
  onReset,
}: SectionEditorProps<VideoFeedContent>) {
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
      eyebrow="Homepage / Videos"
      title="Videos"
      description="Cari clip di tabel, buka detail individual, lalu edit. Clip pertama tetap menjadi video utama di homepage."
      isDirty={isDirty}
      isSaving={isSaving}
      restoredAt={restoredAt}
      onSave={save}
      onReset={onReset}
      onDiscardDraft={discardDraft}
    >
      <CollectionManager<VideoClip>
        title="Clips"
        description="Clip pertama menjadi video utama; sisanya masuk ke daftar More from the feed."
        items={draft.clips}
        onChange={(clips) => setDraft((current) => ({ ...current, clips }))}
        getKey={(clip, index) => `${clip.slug}-${index}`}
        getTitle={(clip) => clip.title}
        getSubtitle={(clip) => clip.description}
        searchText={(clip) =>
          [clip.title, clip.slug, clip.category, clip.date, clip.description].join(" ")
        }
        columns={[
          {
            key: "clip",
            header: "Clip",
            render: (clip) => (
              <span className="block max-w-[220px] sm:max-w-[380px]">
                <span className="block truncate text-sm font-medium text-foreground">
                  {clip.title}
                </span>
                <span className="mt-0.5 block truncate font-mono text-[10px] text-foreground/45">
                  /{clip.slug}
                </span>
              </span>
            ),
          },
          {
            key: "category",
            header: "Category",
            className: "hidden md:table-cell",
            render: (clip) => (
              <span className="text-xs text-foreground/55">{clip.category}</span>
            ),
          },
          {
            key: "date",
            header: "Date",
            className: "hidden sm:table-cell",
            render: (clip) => (
              <span className="text-xs text-foreground/55">{clip.date}</span>
            ),
          },
          {
            key: "duration",
            header: "Duration",
            className: "hidden sm:table-cell",
            render: (clip) => (
              <span className="font-mono text-[10px] text-foreground/45">
                {clip.duration}
              </span>
            ),
          },
        ]}
        createItem={createClip}
        renderDetail={(clip) => <ClipDetail clip={clip} />}
        renderEditor={(clip, patch) => <ClipEditor clip={clip} onChange={patch} />}
        addLabel="Tambah clip"
        itemLabel="clip"
        emptyLabel="Belum ada clip. Tambahkan clip pertama dari tombol di atas."
        className="mt-8"
      />

      <SettingsDisclosure
        title="Pengaturan section Videos"
        description="Copy section video di homepage. Buka hanya saat perlu mengubah teks section."
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
          <TextField
            label="Label feed"
            value={draft.feedLabel}
            onChange={(feedLabel) => setDraft((current) => ({ ...current, feedLabel }))}
          />
          <TextField
            label="Handle"
            value={draft.handle}
            onChange={(handle) => setDraft((current) => ({ ...current, handle }))}
            hint="Tampil sebagai identitas sosial di section video."
            className="md:col-span-2"
          />
        </div>
      </SettingsDisclosure>
    </FormShell>
  );
}
