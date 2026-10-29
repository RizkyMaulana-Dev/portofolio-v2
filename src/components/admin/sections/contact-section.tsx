"use client";

import { useState } from "react";
import type { FooterLink, SiteContentData, SocialLink } from "@/content/site";
import {
  FormShell,
  SettingsDisclosure,
  TextAreaField,
  TextField,
} from "@/components/admin/admin-fields";
import {
  CollectionManager,
  CollectionTabs,
  DetailGrid,
} from "@/components/admin/collection-manager";
import { useSectionDraft, type SectionEditorProps } from "@/components/admin/admin-types";
import { withBase } from "@/lib/paths";

type LinkValue = {
  label: string;
  href: string;
};

function createLink(): LinkValue {
  return { label: "New link", href: "#" };
}

function LinkEditor({
  link,
  onChange,
}: {
  link: LinkValue;
  onChange: (patch: Partial<LinkValue>) => void;
}) {
  return (
    <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
      <TextField
        label="Label"
        value={link.label}
        onChange={(label) => onChange({ label })}
      />
      <TextField
        label="Link"
        value={link.href}
        onChange={(href) => onChange({ href })}
      />
    </div>
  );
}

function LinkDetail({ link }: { link: LinkValue }) {
  return (
    <DetailGrid
      fields={[
        { label: "Label", value: link.label },
        {
          label: "Link",
          value:
            link.href && link.href !== "#" ? (
              <a
                href={withBase(link.href)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 underline decoration-foreground/25 underline-offset-4 transition-colors hover:text-foreground"
              >
                {link.href}
              </a>
            ) : undefined,
          full: true,
        },
      ]}
    />
  );
}

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
  const [activeCollection, setActiveCollection] = useState<"socials" | "footer">("socials");

  function updateHeading(index: 0 | 1, next: string) {
    setDraft((current) => {
      const footerHeading = [...current.footerHeading] as [string, string];
      footerHeading[index] = next;
      return { ...current, footerHeading };
    });
  }

  return (
    <FormShell
      eyebrow="Homepage / Contact"
      title="Contact & footer"
      description="Kelola link sosial dan navigasi footer lewat tabel. Pilih daftar, cari data, buka detail, lalu edit."
      isDirty={isDirty}
      isSaving={isSaving}
      restoredAt={restoredAt}
      onSave={save}
      onReset={onReset}
      onDiscardDraft={discardDraft}
    >
      <CollectionTabs
        value={activeCollection}
        onChange={(next) => setActiveCollection(next as "socials" | "footer")}
        options={[
          { value: "socials", label: "Social links", count: draft.socials.length },
          { value: "footer", label: "Footer nav", count: draft.footerNav.length },
        ]}
      />

      {activeCollection === "socials" ? (
        <CollectionManager<SocialLink>
          title="Social links"
          description="Link yang tampil di kolom Elsewhere pada footer."
          items={draft.socials}
          onChange={(socials) => setDraft((current) => ({ ...current, socials }))}
          getKey={(social, index) => `${social.label}-${index}`}
          getTitle={(social) => social.label}
          getSubtitle={(social) => social.href}
          searchText={(social) => `${social.label} ${social.href}`}
          columns={[
            {
              key: "label",
              header: "Label",
              render: (social) => (
                <span className="block text-sm font-medium text-foreground">
                  {social.label}
                </span>
              ),
            },
            {
              key: "href",
              header: "Link",
              render: (social) => (
                <span className="block max-w-[130px] truncate text-xs text-foreground/50 sm:max-w-[360px]">
                  {social.href}
                </span>
              ),
            },
          ]}
          createItem={createLink}
          renderDetail={(social) => <LinkDetail link={social} />}
          renderEditor={(social, patch) => <LinkEditor link={social} onChange={patch} />}
          addLabel="Tambah sosial"
          itemLabel="link"
          emptyLabel="Belum ada social link. Tambahkan link pertama dari tombol di atas."
          className="mt-5"
        />
      ) : (
        <CollectionManager<FooterLink>
          title="Footer navigation"
          description="Link navigasi kecil di bagian bawah footer."
          items={draft.footerNav}
          onChange={(footerNav) => setDraft((current) => ({ ...current, footerNav }))}
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
                <span className="block max-w-[360px] truncate text-xs text-foreground/50">
                  {item.href}
                </span>
              ),
            },
          ]}
          createItem={createLink}
          renderDetail={(item) => <LinkDetail link={item} />}
          renderEditor={(item, patch) => <LinkEditor link={item} onChange={patch} />}
          addLabel="Tambah link"
          itemLabel="link"
          emptyLabel="Belum ada footer link. Tambahkan link pertama dari tombol di atas."
          className="mt-5"
        />
      )}

      <SettingsDisclosure
        title="Pengaturan contact & footer"
        description="Email, lokasi, availability, dan heading footer. Buka hanya saat perlu mengubah detail utama."
      >
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
      </SettingsDisclosure>
    </FormShell>
  );
}
