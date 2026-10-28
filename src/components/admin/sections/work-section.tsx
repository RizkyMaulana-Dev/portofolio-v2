"use client";

import type { Project, WorkAccent, WorkContent, WorkVisual } from "@/content/work";
import {
  AddButton,
  CommaListField,
  FormShell,
  ItemCard,
  SelectField,
  Subsection,
  TextAreaField,
  TextField,
} from "@/components/admin/admin-fields";
import { useSectionDraft, type SectionEditorProps } from "@/components/admin/admin-types";

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

export function WorkSection({ value, onSave, onReset }: SectionEditorProps<WorkContent>) {
  const { draft, setDraft, isDirty, markSaved } = useSectionDraft(value);

  function updateHeading(index: 0 | 1, next: string) {
    setDraft((current) => {
      const heading = [...current.heading] as [string, string];
      heading[index] = next;
      return { ...current, heading };
    });
  }

  function updateProject(index: number, patch: Partial<Project>) {
    setDraft((current) => ({
      ...current,
      projects: current.projects.map((project, projectIndex) =>
        projectIndex === index ? { ...project, ...patch } : project
      ),
    }));
  }

  function handleSave() {
    if (onSave(draft)) markSaved();
  }

  return (
    <FormShell
      eyebrow="Homepage / Work"
      title="Work"
      description="Project yang tampil sebagai kartu sticky di homepage. Setiap project punya cover, ringkasan, tags, dan link."
      isDirty={isDirty}
      onSave={handleSave}
      onReset={onReset}
    >
      <Subsection title="Heading" description="Judul dan intro section Work.">
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
      </Subsection>

      <Subsection
        title="Projects"
        description="Urutan project mengikuti urutan kartu di homepage."
        action={
          <AddButton
            onClick={() =>
              setDraft((current) => ({
                ...current,
                projects: [
                  ...current.projects,
                  {
                    title: "New project",
                    category: "Category",
                    year: "2026",
                    summary: "Short project summary.",
                    tags: ["Tag"],
                    mark: "N",
                    href: "#",
                    accent: "violet",
                    visual: "halo",
                  },
                ],
              }))
            }
          >
            Tambah project
          </AddButton>
        }
      >
        <div className="grid gap-4">
          {draft.projects.map((project, index) => (
            <ItemCard
              key={index}
              index={index}
              label="Project"
              onRemove={() =>
                setDraft((current) => ({
                  ...current,
                  projects: current.projects.filter(
                    (_, projectIndex) => projectIndex !== index
                  ),
                }))
              }
            >
              <TextField
                label="Judul"
                value={project.title}
                onChange={(title) => updateProject(index, { title })}
              />
              <TextField
                label="Kategori"
                value={project.category}
                onChange={(category) => updateProject(index, { category })}
              />
              <TextField
                label="Tahun"
                value={project.year}
                onChange={(year) => updateProject(index, { year })}
              />
              <TextField
                label="Mark"
                value={project.mark}
                onChange={(mark) => updateProject(index, { mark })}
                hint="Huruf atau inisial di cover."
              />
              <TextField
                label="Link project"
                value={project.href}
                onChange={(href) => updateProject(index, { href })}
              />
              <TextField
                label="Cover image"
                value={project.cover ?? ""}
                onChange={(cover) => updateProject(index, { cover })}
                hint="Path seperti /images/work/slug/cover.webp. Kosongkan untuk memakai cover abstrak."
              />
              <SelectField
                label="Accent"
                value={project.accent}
                onChange={(accent) => updateProject(index, { accent })}
                options={ACCENT_OPTIONS}
              />
              <SelectField
                label="Bentuk cover"
                value={project.visual}
                onChange={(visual) => updateProject(index, { visual })}
                options={VISUAL_OPTIONS}
              />
              <CommaListField
                label="Tags"
                value={project.tags}
                onChange={(tags) => updateProject(index, { tags })}
                hint="Pisahkan dengan koma."
              />
              <TextAreaField
                label="Ringkasan"
                value={project.summary}
                onChange={(summary) => updateProject(index, { summary })}
                className="md:col-span-2"
              />
            </ItemCard>
          ))}
        </div>
      </Subsection>
    </FormShell>
  );
}
