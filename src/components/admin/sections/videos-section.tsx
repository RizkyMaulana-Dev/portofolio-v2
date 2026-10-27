"use client";

import type {
  VideoAccent,
  VideoClip,
  VideoFeedContent,
  VideoVisual,
} from "@/content/videos";
import {
  AddButton,
  FormShell,
  ItemCard,
  SelectField,
  Subsection,
  TextAreaField,
  TextField,
} from "@/components/admin/admin-fields";
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

export function VideosSection({
  value,
  onSave,
  onReset,
}: SectionEditorProps<VideoFeedContent>) {
  const { draft, setDraft, isDirty, markSaved } = useSectionDraft(value);

  function updateHeading(index: 0 | 1, next: string) {
    setDraft((current) => {
      const heading = [...current.heading] as [string, string];
      heading[index] = next;
      return { ...current, heading };
    });
  }

  function updateClip(index: number, patch: Partial<VideoClip>) {
    setDraft((current) => ({
      ...current,
      clips: current.clips.map((clip, clipIndex) =>
        clipIndex === index ? { ...clip, ...patch } : clip
      ),
    }));
  }

  function handleSave() {
    if (onSave(draft)) markSaved();
  }

  return (
    <FormShell
      eyebrow="Homepage / Videos"
      title="Videos"
      description="Section video dan clip yang muncul di homepage. Slug tetap dipakai untuk membuka clip di feed."
      isDirty={isDirty}
      onSave={handleSave}
      onReset={onReset}
    >
      <Subsection title="Heading" description="Copy section video di homepage.">
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
      </Subsection>

      <Subsection
        title="Clips"
        description="Clip pertama menjadi video utama; sisanya masuk ke daftar More from the feed."
        action={
          <AddButton
            onClick={() =>
              setDraft((current) => ({
                ...current,
                clips: [
                  ...current.clips,
                  {
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
                  },
                ],
              }))
            }
          >
            Tambah clip
          </AddButton>
        }
      >
        <div className="grid gap-4">
          {draft.clips.map((clip, index) => (
            <ItemCard
              key={index}
              index={index}
              label="Clip"
              onRemove={() =>
                setDraft((current) => ({
                  ...current,
                  clips: current.clips.filter((_, clipIndex) => clipIndex !== index),
                }))
              }
            >
              <TextField
                label="Slug"
                value={clip.slug}
                onChange={(slug) => updateClip(index, { slug })}
                hint="Dipakai di URL /feed?clip=…"
              />
              <TextField
                label="Judul"
                value={clip.title}
                onChange={(title) => updateClip(index, { title })}
              />
              <TextField
                label="Kategori"
                value={clip.category}
                onChange={(category) => updateClip(index, { category })}
              />
              <TextField
                label="Tanggal"
                value={clip.date}
                onChange={(date) => updateClip(index, { date })}
              />
              <TextField
                label="Durasi"
                value={clip.duration}
                onChange={(duration) => updateClip(index, { duration })}
              />
              <TextField
                label="Mark"
                value={clip.mark}
                onChange={(mark) => updateClip(index, { mark })}
                hint="Label kecil di artwork."
              />
              <SelectField
                label="Accent"
                value={clip.accent}
                onChange={(accent) => updateClip(index, { accent })}
                options={ACCENT_OPTIONS}
              />
              <SelectField
                label="Bentuk artwork"
                value={clip.visual}
                onChange={(visual) => updateClip(index, { visual })}
                options={VISUAL_OPTIONS}
              />
              <TextAreaField
                label="Deskripsi"
                value={clip.description}
                onChange={(description) => updateClip(index, { description })}
                className="md:col-span-2"
              />
            </ItemCard>
          ))}
        </div>
      </Subsection>
    </FormShell>
  );
}
