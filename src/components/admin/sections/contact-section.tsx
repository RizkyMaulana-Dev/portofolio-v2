"use client";

import type { FooterLink, SiteContentData, SocialLink } from "@/content/site";
import {
  AddButton,
  FormShell,
  ItemCard,
  Subsection,
  TextAreaField,
  TextField,
} from "@/components/admin/admin-fields";
import { useSectionDraft, type SectionEditorProps } from "@/components/admin/admin-types";

export function ContactSection({ section, value, onSave, onReset }: SectionEditorProps<SiteContentData>) {
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
      const footerHeading = [...current.footerHeading] as [string, string];
      footerHeading[index] = next;
      return { ...current, footerHeading };
    });
  }

  function updateSocial(index: number, patch: Partial<SocialLink>) {
    setDraft((current) => ({
      ...current,
      socials: current.socials.map((social, socialIndex) =>
        socialIndex === index ? { ...social, ...patch } : social
      ),
    }));
  }

  function updateFooterLink(index: number, patch: Partial<FooterLink>) {
    setDraft((current) => ({
      ...current,
      footerNav: current.footerNav.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  }

  return (
    <FormShell
      eyebrow="Homepage / Contact"
      title="Contact & footer"
      description="Detail kontak yang muncul di footer homepage dan halaman blog, plus link sosial dan navigasi footer."
      isDirty={isDirty}
      isSaving={isSaving}
      restoredAt={restoredAt}
      onSave={save}
      onReset={onReset}
      onDiscardDraft={discardDraft}
    >
      <Subsection title="Detail utama" description="Email dan status yang dilihat pengunjung.">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Nama"
            value={draft.name}
            onChange={(name) => setDraft((current) => ({ ...current, name }))}
          />
          <TextField
            label="Email"
            type="email"
            value={draft.email}
            onChange={(email) => setDraft((current) => ({ ...current, email }))}
          />
          <TextField
            label="Lokasi"
            value={draft.location}
            onChange={(location) => setDraft((current) => ({ ...current, location }))}
          />
          <TextAreaField
            label="Availability"
            value={draft.availability}
            onChange={(availability) => setDraft((current) => ({ ...current, availability }))}
          />
          <TextField
            label="Footer heading — baris 1"
            value={draft.footerHeading[0]}
            onChange={(next) => updateHeading(0, next)}
          />
          <TextField
            label="Footer heading — baris 2"
            value={draft.footerHeading[1]}
            onChange={(next) => updateHeading(1, next)}
            hint="Baris kedua tampil miring."
          />
        </div>
      </Subsection>

      <Subsection
        title="Social links"
        description="Link yang tampil di kolom Elsewhere."
        action={
          <AddButton
            onClick={() =>
              setDraft((current) => ({
                ...current,
                socials: [...current.socials, { label: "New link", href: "#" }],
              }))
            }
          >
            Tambah sosial
          </AddButton>
        }
      >
        <div className="grid gap-4">
          {draft.socials.map((social, index) => (
            <ItemCard
              key={index}
              index={index}
              label="Social link"
              onRemove={() =>
                setDraft((current) => ({
                  ...current,
                  socials: current.socials.filter((_, socialIndex) => socialIndex !== index),
                }))
              }
            >
              <TextField
                label="Label"
                value={social.label}
                onChange={(label) => updateSocial(index, { label })}
              />
              <TextField
                label="Link"
                value={social.href}
                onChange={(href) => updateSocial(index, { href })}
              />
            </ItemCard>
          ))}
        </div>
      </Subsection>

      <Subsection
        title="Footer navigation"
        description="Link navigasi kecil di bagian bawah footer."
        action={
          <AddButton
            onClick={() =>
              setDraft((current) => ({
                ...current,
                footerNav: [...current.footerNav, { label: "New link", href: "/" }],
              }))
            }
          >
            Tambah link
          </AddButton>
        }
      >
        <div className="grid gap-4">
          {draft.footerNav.map((item, index) => (
            <ItemCard
              key={index}
              index={index}
              label="Footer link"
              onRemove={() =>
                setDraft((current) => ({
                  ...current,
                  footerNav: current.footerNav.filter((_, itemIndex) => itemIndex !== index),
                }))
              }
            >
              <TextField
                label="Label"
                value={item.label}
                onChange={(label) => updateFooterLink(index, { label })}
              />
              <TextField
                label="Link"
                value={item.href}
                onChange={(href) => updateFooterLink(index, { href })}
              />
            </ItemCard>
          ))}
        </div>
      </Subsection>
    </FormShell>
  );
}
