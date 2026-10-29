"use client";

import type { HeroContent } from "@/content/hero";
import {
  FormShell,
  SettingsDisclosure,
  TextAreaField,
  TextField,
} from "@/components/admin/admin-fields";
import {
  CollectionManager,
  DetailGrid,
} from "@/components/admin/collection-manager";
import { useSectionDraft, type SectionEditorProps } from "@/components/admin/admin-types";
import { withBase } from "@/lib/paths";

type NavItem = HeroContent["nav"][number];

function createNavItem(): NavItem {
  return { label: "Link baru", href: "#" };
}

function NavEditor({
  item,
  onChange,
}: {
  item: NavItem;
  onChange: (patch: Partial<NavItem>) => void;
}) {
  return (
    <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
      <TextField
        label="Label"
        value={item.label}
        onChange={(label) => onChange({ label })}
      />
      <TextField
        label="Link"
        value={item.href}
        onChange={(href) => onChange({ href })}
      />
    </div>
  );
}

function NavDetail({ item }: { item: NavItem }) {
  return (
    <DetailGrid
      fields={[
        { label: "Label", value: item.label },
        {
          label: "Link",
          value: item.href ? (
            <a
              href={withBase(item.href)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 underline decoration-foreground/25 underline-offset-4 transition-colors hover:text-foreground"
            >
              {item.href}
            </a>
          ) : undefined,
          full: true,
        },
      ]}
    />
  );
}

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

  return (
    <FormShell
      eyebrow="Homepage / Hero"
      title="Hero"
      description="Navigasi ada di tabel terpisah. Buka detail untuk melihat, lalu edit label atau link tanpa mencari di seluruh form."
      isDirty={isDirty}
      isSaving={isSaving}
      restoredAt={restoredAt}
      onSave={save}
      onReset={onReset}
      onDiscardDraft={discardDraft}
    >
      <CollectionManager<NavItem>
        title="Navigasi"
        description="Link di navbar desktop dan menu mobile. Klik baris untuk detail, lalu edit."
        items={draft.nav}
        onChange={(nav) => setDraft((current) => ({ ...current, nav }))}
        getKey={(item, index) => `${item.label}-${index}`}
        getTitle={(item) => item.label}
        getSubtitle={(item) => item.href}
        searchText={(item) => `${item.label} ${item.href}`}
        columns={[
          {
            key: "label",
            header: "Label",
            render: (item) => (
              <span className="block text-sm font-medium text-foreground">
                {item.label}
              </span>
            ),
          },
          {
            key: "href",
            header: "Link",
            render: (item) => (
              <span className="block max-w-[130px] truncate text-xs text-foreground/50 sm:max-w-[360px]">
                {item.href}
              </span>
            ),
          },
        ]}
        createItem={createNavItem}
        renderDetail={(item) => <NavDetail item={item} />}
        renderEditor={(item, patch) => <NavEditor item={item} onChange={patch} />}
        addLabel="Tambah link"
        itemLabel="link"
        emptyLabel="Belum ada link navigasi. Tambahkan link pertama dari tombol di atas."
        className="mt-8"
      />

      <SettingsDisclosure
        title="Konten hero"
        description="Brand, headline, CTA, tagline, dan CTA navbar. Buka hanya saat perlu mengubah copy utama."
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
      </SettingsDisclosure>
    </FormShell>
  );
}
