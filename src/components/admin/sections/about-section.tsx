"use client";

import type {
  AboutContent,
  Accent,
  Certificate,
  SkillGroup,
} from "@/content/about";
import {
  AddButton,
  CommaListField,
  FileDropField,
  FormShell,
  ItemCard,
  SelectField,
  Subsection,
  TextField,
} from "@/components/admin/admin-fields";
import { useSectionDraft, type SectionEditorProps } from "@/components/admin/admin-types";

const ACCENT_OPTIONS: Array<{ value: Accent; label: string }> = [
  { value: "lime", label: "Lime" },
  { value: "violet", label: "Violet" },
  { value: "peach", label: "Peach" },
  { value: "sky", label: "Sky" },
  { value: "sun", label: "Sun" },
  { value: "rose", label: "Rose" },
];

export function AboutSection({ section, value, onSave, onReset }: SectionEditorProps<AboutContent>) {
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

  function updateCertificateHeading(index: 0 | 1, next: string) {
    setDraft((current) => {
      const heading = [...current.certificates.heading] as [string, string];
      heading[index] = next;
      return {
        ...current,
        certificates: { ...current.certificates, heading },
      };
    });
  }

  function updateGroup(index: number, patch: Partial<SkillGroup>) {
    setDraft((current) => ({
      ...current,
      skillGroups: current.skillGroups.map((group, groupIndex) =>
        groupIndex === index ? { ...group, ...patch } : group
      ),
    }));
  }

  function updateCertificate(index: number, patch: Partial<Certificate>) {
    setDraft((current) => ({
      ...current,
      certificates: {
        ...current.certificates,
        items: current.certificates.items.map((item, itemIndex) =>
          itemIndex === index ? { ...item, ...patch } : item
        ),
      },
    }));
  }

  return (
    <FormShell
      eyebrow="Homepage / About"
      title="About"
      description="Section capability dan credential. Skill ditulis sebagai daftar yang dipisahkan koma."
      isDirty={isDirty}
      isSaving={isSaving}
      restoredAt={restoredAt}
      onSave={save}
      onReset={onReset}
      onDiscardDraft={discardDraft}
    >
      <Subsection title="Heading" description="Judul section About di homepage.">
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
          <TextField
            label="Label skill"
            value={draft.skills.label}
            onChange={(label) =>
              setDraft((current) => ({ ...current, skills: { ...current.skills, label } }))
            }
            hint="Label kecil di sisi kiri daftar skill."
          />
        </div>
      </Subsection>

      <Subsection
        title="Skill groups"
        description="Tiga kartu capability yang membentuk lembar About."
        action={
          <AddButton
            onClick={() =>
              setDraft((current) => ({
                ...current,
                skillGroups: [
                  ...current.skillGroups,
                  {
                    label: "New group",
                    note: "What this group covers",
                    accent: "lime",
                    skills: ["Skill"],
                  },
                ],
              }))
            }
          >
            Tambah group
          </AddButton>
        }
      >
        <div className="grid gap-4">
          {draft.skillGroups.map((group, index) => (
            <ItemCard
              key={index}
              index={index}
              label="Skill group"
              onRemove={() =>
                setDraft((current) => ({
                  ...current,
                  skillGroups: current.skillGroups.filter(
                    (_, groupIndex) => groupIndex !== index
                  ),
                }))
              }
            >
              <TextField
                label="Label"
                value={group.label}
                onChange={(label) => updateGroup(index, { label })}
              />
              <TextField
                label="Catatan"
                value={group.note}
                onChange={(note) => updateGroup(index, { note })}
              />
              <SelectField
                label="Accent"
                value={group.accent}
                onChange={(accent) => updateGroup(index, { accent })}
                options={ACCENT_OPTIONS}
              />
              <CommaListField
                label="Skills"
                value={group.skills}
                onChange={(skills) => updateGroup(index, { skills })}
                hint="Pisahkan dengan koma."
              />
            </ItemCard>
          ))}
        </div>
      </Subsection>

      <Subsection
        title="Certificates"
        description="Heading dan daftar credential di arsip sertifikat homepage. Tandai certificate sebagai Selected untuk badge di wall dan strip Selected proof di About."
        action={
          <AddButton
            onClick={() =>
              setDraft((current) => ({
                ...current,
                certificates: {
                  ...current.certificates,
                  items: [
                    ...current.certificates.items,
                    {
                      title: "New certificate",
                      issuer: "Issuer",
                      mark: "N",
                      year: "2025",
                      credentialId: "CREDENTIAL-ID",
                      href: "#",
                      accent: "violet",
                    },
                  ],
                },
              }))
            }
          >
            Tambah certificate
          </AddButton>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Label section"
            value={draft.certificates.label}
            onChange={(label) =>
              setDraft((current) => ({
                ...current,
                certificates: { ...current.certificates, label },
              }))
            }
          />
          <TextField
            label="Catatan kecil"
            value={draft.certificates.note}
            onChange={(note) =>
              setDraft((current) => ({
                ...current,
                certificates: { ...current.certificates, note },
              }))
            }
          />
          <TextField
            label="Heading — baris 1"
            value={draft.certificates.heading[0]}
            onChange={(next) => updateCertificateHeading(0, next)}
          />
          <TextField
            label="Heading — baris 2"
            value={draft.certificates.heading[1]}
            onChange={(next) => updateCertificateHeading(1, next)}
          />
        </div>

        <div className="mt-4 grid gap-4">
          {draft.certificates.items.map((certificate, index) => (
            <ItemCard
              key={index}
              index={index}
              label="Certificate"
              onRemove={() =>
                setDraft((current) => ({
                  ...current,
                  certificates: {
                    ...current.certificates,
                    items: current.certificates.items.filter(
                      (_, itemIndex) => itemIndex !== index
                    ),
                  },
                }))
              }
            >
              <TextField
                label="Judul"
                value={certificate.title}
                onChange={(title) => updateCertificate(index, { title })}
              />
              <TextField
                label="Issuer"
                value={certificate.issuer}
                onChange={(issuer) => updateCertificate(index, { issuer })}
              />
              <TextField
                label="Mark"
                value={certificate.mark}
                onChange={(mark) => updateCertificate(index, { mark })}
                hint="Huruf atau inisial di cover certificate."
              />
              <TextField
                label="Tahun"
                value={certificate.year}
                onChange={(year) => updateCertificate(index, { year })}
              />
              <TextField
                label="Credential ID"
                value={certificate.credentialId}
                onChange={(credentialId) => updateCertificate(index, { credentialId })}
              />
              <SelectField
                label="Accent"
                value={certificate.accent}
                onChange={(accent) => updateCertificate(index, { accent })}
                options={ACCENT_OPTIONS}
              />
              <FileDropField
                label="Gambar certificate"
                value={certificate.image ?? ""}
                onChange={(image) => updateCertificate(index, { image: image || undefined })}
                accept="image/*"
                kind="image"
                hint="Preview kartu certificate. Bisa upload atau tempel path gambar."
                className="md:col-span-2"
              />
              <FileDropField
                label="File PDF certificate"
                value={certificate.href}
                onChange={(href) => updateCertificate(index, { href })}
                accept="application/pdf"
                kind="document"
                hint="Dokumen yang dibuka saat certificate diklik."
                className="md:col-span-2"
              />
              <SelectField
                label="Selected badge"
                value={certificate.featured ? "yes" : "no"}
                onChange={(value) => updateCertificate(index, { featured: value === "yes" })}
                options={[
                  { value: "no", label: "Tidak" },
                  { value: "yes", label: "Ya" },
                ]}
              />
            </ItemCard>
          ))}
        </div>
      </Subsection>
    </FormShell>
  );
}
