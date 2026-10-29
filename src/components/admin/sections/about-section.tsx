"use client";

import { useState } from "react";
import type {
  AboutContent,
  Accent,
  Certificate,
  SkillGroup,
} from "@/content/about";
import {
  CommaListField,
  FileDropField,
  FormShell,
  SelectField,
  SettingsDisclosure,
  TextField,
} from "@/components/admin/admin-fields";
import {
  CollectionManager,
  CollectionTabs,
  DetailGrid,
  DetailImage,
} from "@/components/admin/collection-manager";
import { useSectionDraft, type SectionEditorProps } from "@/components/admin/admin-types";
import { withBase } from "@/lib/paths";

const ACCENT_OPTIONS: Array<{ value: Accent; label: string }> = [
  { value: "lime", label: "Lime" },
  { value: "violet", label: "Violet" },
  { value: "peach", label: "Peach" },
  { value: "sky", label: "Sky" },
  { value: "sun", label: "Sun" },
  { value: "rose", label: "Rose" },
];

function createSkillGroup(): SkillGroup {
  return {
    label: "New group",
    note: "What this group covers",
    accent: "lime",
    skills: ["Skill"],
  };
}

function createCertificate(): Certificate {
  return {
    title: "New certificate",
    issuer: "Issuer",
    mark: "N",
    year: "2025",
    credentialId: "CREDENTIAL-ID",
    href: "#",
    accent: "violet",
  };
}

function SkillGroupEditor({
  group,
  onChange,
}: {
  group: SkillGroup;
  onChange: (patch: Partial<SkillGroup>) => void;
}) {
  return (
    <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
      <TextField
        label="Label"
        value={group.label}
        onChange={(label) => onChange({ label })}
      />
      <TextField
        label="Catatan"
        value={group.note}
        onChange={(note) => onChange({ note })}
      />
      <SelectField
        label="Accent"
        value={group.accent}
        onChange={(accent) => onChange({ accent })}
        options={ACCENT_OPTIONS}
      />
      <CommaListField
        label="Skills"
        value={group.skills}
        onChange={(skills) => onChange({ skills })}
        hint="Pisahkan dengan koma."
      />
    </div>
  );
}

function SkillGroupDetail({ group }: { group: SkillGroup }) {
  return (
    <DetailGrid
      fields={[
        { label: "Label", value: group.label },
        { label: "Accent", value: group.accent },
        { label: "Catatan", value: group.note, full: true },
        {
          label: "Skills",
          value: (
            <span className="flex flex-wrap gap-1.5">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-glass)] px-2 py-1 text-[10px] text-foreground/60"
                >
                  {skill}
                </span>
              ))}
            </span>
          ),
          full: true,
        },
      ]}
    />
  );
}

function CertificateEditor({
  certificate,
  onChange,
}: {
  certificate: Certificate;
  onChange: (patch: Partial<Certificate>) => void;
}) {
  return (
    <>
      <TextField
        label="Judul"
        value={certificate.title}
        onChange={(title) => onChange({ title })}
      />
      <TextField
        label="Issuer"
        value={certificate.issuer}
        onChange={(issuer) => onChange({ issuer })}
      />
      <TextField
        label="Mark"
        value={certificate.mark}
        onChange={(mark) => onChange({ mark })}
        hint="Huruf atau inisial di cover certificate."
      />
      <TextField
        label="Tahun"
        value={certificate.year}
        onChange={(year) => onChange({ year })}
      />
      <TextField
        label="Credential ID"
        value={certificate.credentialId}
        onChange={(credentialId) => onChange({ credentialId })}
      />
      <SelectField
        label="Accent"
        value={certificate.accent}
        onChange={(accent) => onChange({ accent })}
        options={ACCENT_OPTIONS}
      />
      <FileDropField
        label="Gambar certificate"
        value={certificate.image ?? ""}
        onChange={(image) => onChange({ image: image || undefined })}
        accept="image/*"
        kind="image"
        hint="Preview kartu certificate. Bisa upload atau tempel path gambar."
        className="md:col-span-2"
      />
      <FileDropField
        label="File PDF certificate"
        value={certificate.href}
        onChange={(href) => onChange({ href })}
        accept="application/pdf"
        kind="document"
        hint="Dokumen yang dibuka saat certificate diklik."
        className="md:col-span-2"
      />
      <SelectField
        label="Selected badge"
        value={certificate.featured ? "yes" : "no"}
        onChange={(value) => onChange({ featured: value === "yes" })}
        options={[
          { value: "no", label: "Tidak" },
          { value: "yes", label: "Ya" },
        ]}
      />
    </>
  );
}

function CertificateDetail({ certificate }: { certificate: Certificate }) {
  const hasPdf = certificate.href && certificate.href !== "#";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
      <DetailGrid
        fields={[
          { label: "Issuer", value: certificate.issuer },
          { label: "Tahun", value: certificate.year },
          { label: "Credential ID", value: certificate.credentialId },
          { label: "Accent", value: certificate.accent },
          { label: "Mark", value: certificate.mark },
          {
            label: "Selected badge",
            value: certificate.featured ? "Ya" : "Tidak",
          },
          {
            label: "File PDF",
            value: hasPdf ? (
              <a
                href={withBase(certificate.href)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 underline decoration-foreground/25 underline-offset-4 transition-colors hover:text-foreground"
              >
                Buka dokumen
              </a>
            ) : undefined,
            full: true,
          },
        ]}
      />

      <div>
        <DetailImage src={certificate.image} alt={certificate.title} />
      </div>
    </div>
  );
}

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
  const [activeCollection, setActiveCollection] = useState<"certificates" | "skills">(
    "certificates"
  );

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

  return (
    <FormShell
      eyebrow="Homepage / About"
      title="About"
      description="Pilih daftar di bawah, cari data yang ingin diubah, lalu buka detail dan masuk ke mode edit."
      isDirty={isDirty}
      isSaving={isSaving}
      restoredAt={restoredAt}
      onSave={save}
      onReset={onReset}
      onDiscardDraft={discardDraft}
    >
      <CollectionTabs
        value={activeCollection}
        onChange={(next) => setActiveCollection(next as "certificates" | "skills")}
        options={[
          {
            value: "certificates",
            label: "Certificates",
            count: draft.certificates.items.length,
          },
          { value: "skills", label: "Skill groups", count: draft.skillGroups.length },
        ]}
      />

      {activeCollection === "certificates" ? (
        <CollectionManager<Certificate>
          title="Certificates"
          description="Semua credential di arsip. Klik baris untuk melihat detail, lalu edit."
          items={draft.certificates.items}
          onChange={(items) =>
            setDraft((current) => ({
              ...current,
              certificates: { ...current.certificates, items },
            }))
          }
          getKey={(certificate, index) =>
            `${certificate.credentialId || certificate.title}-${index}`
          }
          getTitle={(certificate) => certificate.title}
          getSubtitle={(certificate) => certificate.issuer}
          searchText={(certificate) =>
            [
              certificate.title,
              certificate.issuer,
              certificate.year,
              certificate.credentialId,
              certificate.category ?? "",
            ].join(" ")
          }
          columns={[
            {
              key: "certificate",
              header: "Certificate",
              render: (certificate) => (
                <span className="block max-w-[220px] sm:max-w-[380px]">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {certificate.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-foreground/45">
                    {certificate.issuer}
                  </span>
                </span>
              ),
            },
            {
              key: "year",
              header: "Year",
              className: "hidden sm:table-cell",
              render: (certificate) => (
                <span className="text-xs text-foreground/55">{certificate.year}</span>
              ),
            },
            {
              key: "credential",
              header: "Credential ID",
              className: "hidden md:table-cell",
              render: (certificate) => (
                <span className="block max-w-[200px] truncate font-mono text-[10px] text-foreground/45">
                  {certificate.credentialId}
                </span>
              ),
            },
            {
              key: "selected",
              header: "Selected",
              className: "hidden sm:table-cell",
              render: (certificate) =>
                certificate.featured ? (
                  <span className="rounded-full border border-lime/40 bg-lime/15 px-2 py-0.5 text-[9px] text-foreground/60">
                    Ya
                  </span>
                ) : (
                  <span className="text-[9px] text-foreground/35">—</span>
                ),
            },
          ]}
          createItem={createCertificate}
          renderDetail={(certificate) => (
            <CertificateDetail certificate={certificate} />
          )}
          renderEditor={(certificate, patch) => (
            <CertificateEditor certificate={certificate} onChange={patch} />
          )}
          addLabel="Tambah certificate"
          itemLabel="certificate"
          emptyLabel="Belum ada certificate. Tambahkan credential pertama dari tombol di atas."
          className="mt-5"
        />
      ) : (
        <CollectionManager<SkillGroup>
          title="Skill groups"
          description="Kartu capability yang membentuk lembar About. Klik baris untuk melihat atau mengedit."
          items={draft.skillGroups}
          onChange={(skillGroups) =>
            setDraft((current) => ({ ...current, skillGroups }))
          }
          getKey={(group, index) => `${group.label}-${index}`}
          getTitle={(group) => group.label}
          getSubtitle={(group) => group.note}
          searchText={(group) => [group.label, group.note, ...group.skills].join(" ")}
          columns={[
            {
              key: "group",
              header: "Skill group",
              render: (group) => (
                <span className="block max-w-[380px]">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {group.label}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-foreground/45">
                    {group.note}
                  </span>
                </span>
              ),
            },
            {
              key: "accent",
              header: "Accent",
              className: "hidden sm:table-cell",
              render: (group) => (
                <span className="text-xs text-foreground/55">{group.accent}</span>
              ),
            },
            {
              key: "skills",
              header: "Skills",
              className: "hidden md:table-cell",
              render: (group) => (
                <span className="text-xs text-foreground/55">
                  {group.skills.length} skill
                </span>
              ),
            },
          ]}
          createItem={createSkillGroup}
          renderDetail={(group) => <SkillGroupDetail group={group} />}
          renderEditor={(group, patch) => (
            <SkillGroupEditor group={group} onChange={patch} />
          )}
          addLabel="Tambah group"
          itemLabel="skill group"
          emptyLabel="Belum ada skill group. Tambahkan group pertama dari tombol di atas."
          className="mt-5"
        />
      )}

      <SettingsDisclosure
        title="Pengaturan section About"
        description="Judul, label, dan copy arsip certificate. Buka hanya saat perlu mengubah teks section."
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
          <TextField
            label="Label skill"
            value={draft.skills.label}
            onChange={(label) =>
              setDraft((current) => ({ ...current, skills: { ...current.skills, label } }))
            }
            hint="Label kecil di sisi kiri daftar skill."
          />
        </div>

        <div className="mt-8 border-t border-[var(--color-border)] pt-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/55">
            Copy certificate
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
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
        </div>
      </SettingsDisclosure>
    </FormShell>
  );
}
