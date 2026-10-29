"use client";

import type { HeroContent } from "@/content/hero";
import {
  AddButton,
  FormShell,
  ItemCard,
  Subsection,
  TextAreaField,
  TextField,
} from "@/components/admin/admin-fields";
import { useSectionDraft, type SectionEditorProps } from "@/components/admin/admin-types";

export function HeroSection({ section, value, onSave, onReset }: SectionEditorProps<HeroContent>) {
  const {
    draft,
    setDraft,
    isDirty,
    isSaving,
    restoredAt,
    save,
    discardDraft,
  } = useSectionDraft(section, value, onSave);

  function setHeadline(index: 0 | 1, next: string) {
    setDraft((current) => {
      const headline = [...current.headline] as [string, string];
      headline[index] = next;
      return { ...current, headline };
    });
  }

  function updateNav(index: number, patch: Partial<HeroContent["nav"][number]>) {
    setDraft((current) => ({
      ...current,
      nav: current.nav.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      ),
    }));
  }

  return (
    <FormShell
      eyebrow="Homepage / Hero"
      title="Hero"
      description="Copy utama, call to action, tagline, dan navigasi yang dilihat pertama kali. Kartu orbit tetap memakai komposisi default."
      isDirty={isDirty}
      isSaving={isSaving}
      restoredAt={restoredAt}
      onSave={save}
      onReset={onReset}
      onDiscardDraft={discardDraft}
    >
      <Subsection
        title="Identitas & headline"
        description="Baris pertama tampil tegak, baris kedua tampil miring."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Brand"
            value={draft.brand}
            onChange={(brand) => setDraft((current) => ({ ...current, brand }))}
          />
          <div className="hidden md:block" />
          <TextField
            label="Headline — baris 1"
            value={draft.headline[0]}
            onChange={(next) => setHeadline(0, next)}
          />
          <TextField
            label="Headline — baris 2"
            value={draft.headline[1]}
            onChange={(next) => setHeadline(1, next)}
          />
          <TextAreaField
            label="Subheadline"
            value={draft.subheadline}
            onChange={(subheadline) => setDraft((current) => ({ ...current, subheadline }))}
            className="md:col-span-2"
          />
        </div>
      </Subsection>

      <Subsection title="Call to action" description="Dua tombol utama di bawah headline.">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="CTA utama — label"
            value={draft.ctaPrimary.label}
            onChange={(label) =>
              setDraft((current) => ({
                ...current,
                ctaPrimary: { ...current.ctaPrimary, label },
              }))
            }
          />
          <TextField
            label="CTA utama — link"
            value={draft.ctaPrimary.href}
            onChange={(href) =>
              setDraft((current) => ({
                ...current,
                ctaPrimary: { ...current.ctaPrimary, href },
              }))
            }
          />
          <TextField
            label="CTA sekunder — label"
            value={draft.ctaSecondary.label}
            onChange={(label) =>
              setDraft((current) => ({
                ...current,
                ctaSecondary: { ...current.ctaSecondary, label },
              }))
            }
          />
          <TextField
            label="CTA sekunder — link"
            value={draft.ctaSecondary.href}
            onChange={(href) =>
              setDraft((current) => ({
                ...current,
                ctaSecondary: { ...current.ctaSecondary, href },
              }))
            }
          />
          <TextField
            label="Trust line"
            value={draft.trust}
            onChange={(trust) => setDraft((current) => ({ ...current, trust }))}
            className="md:col-span-2"
          />
        </div>
      </Subsection>

      <Subsection title="Tagline & sticker" description="Detail kecil di sudut halaman.">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Tagline — baris 1"
            value={draft.tagline[0]}
            onChange={(next) =>
              setDraft((current) => {
                const tagline = [...current.tagline];
                tagline[0] = next;
                return { ...current, tagline };
              })
            }
          />
          <TextField
            label="Tagline — baris 2"
            value={draft.tagline[1]}
            onChange={(next) =>
              setDraft((current) => {
                const tagline = [...current.tagline];
                tagline[1] = next;
                return { ...current, tagline };
              })
            }
          />
          <TextField
            label="Teks sticker"
            value={draft.sticker}
            onChange={(sticker) => setDraft((current) => ({ ...current, sticker }))}
            hint="Teks ini diulang otomatis di badge berputar."
            className="md:col-span-2"
          />
        </div>
      </Subsection>

      <Subsection
        title="Navigasi"
        description="Link di navbar desktop dan menu mobile."
        action={
          <AddButton
            onClick={() =>
              setDraft((current) => ({
                ...current,
                nav: [...current.nav, { label: "Link baru", href: "#" }],
              }))
            }
          >
            Tambah link
          </AddButton>
        }
      >
        <div className="grid gap-4">
          {draft.nav.map((item, index) => (
            <ItemCard
              key={index}
              index={index}
              label="Link navigasi"
              onRemove={() =>
                setDraft((current) => ({
                  ...current,
                  nav: current.nav.filter((_, itemIndex) => itemIndex !== index),
                }))
              }
            >
              <TextField
                label="Label"
                value={item.label}
                onChange={(label) => updateNav(index, { label })}
              />
              <TextField
                label="Link"
                value={item.href}
                onChange={(href) => updateNav(index, { href })}
              />
            </ItemCard>
          ))}
        </div>

        <div className="mt-4 grid gap-4 rounded-2xl border border-[var(--color-border)] bg-white/30 p-4 md:grid-cols-2 md:p-5">
          <TextField
            label="Navbar CTA — label"
            value={draft.navCta.label}
            onChange={(label) =>
              setDraft((current) => ({
                ...current,
                navCta: { ...current.navCta, label },
              }))
            }
          />
          <TextField
            label="Navbar CTA — link"
            value={draft.navCta.href}
            onChange={(href) =>
              setDraft((current) => ({
                ...current,
                navCta: { ...current.navCta, href },
              }))
            }
          />
        </div>
      </Subsection>
    </FormShell>
  );
}
