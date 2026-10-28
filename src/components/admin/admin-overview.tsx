"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  Clapperboard,
  HardDrive,
  Mail,
  RotateCcw,
  Sparkles,
  UserRound,
} from "lucide-react";
import type { SiteContent } from "@/lib/site-content";
import { withBase } from "@/lib/paths";
import type { AdminView } from "@/components/admin/admin-types";

const CONTENT_VIEWS: Array<{
  id: AdminView;
  label: string;
  caption: string;
  icon: typeof Sparkles;
  meta: (content: SiteContent) => string;
}> = [
  {
    id: "hero",
    label: "Hero",
    caption: "Headline, CTA, navigasi",
    icon: Sparkles,
    meta: (content) => `${content.hero.nav.length} link navigasi`,
  },
  {
    id: "about",
    label: "About",
    caption: "Skill dan certificate",
    icon: UserRound,
    meta: (content) =>
      `${content.about.skillGroups.length} group · ${content.about.certificates.items.length} certificate`,
  },
  {
    id: "work",
    label: "Work",
    caption: "Project dan cover",
    icon: BriefcaseBusiness,
    meta: (content) => `${content.work.projects.length} project`,
  },
  {
    id: "videos",
    label: "Videos",
    caption: "Clip dan section video",
    icon: Clapperboard,
    meta: (content) => `${content.videos.clips.length} clip`,
  },
  {
    id: "site",
    label: "Contact",
    caption: "Email, sosial, footer",
    icon: Mail,
    meta: (content) => `${content.site.socials.length} social link`,
  },
];

export function AdminOverview({
  content,
  sessionEmail,
  onNavigate,
  onResetAll,
}: {
  content: SiteContent;
  sessionEmail: string;
  onNavigate: (view: AdminView) => void;
  onResetAll: () => void;
}) {
  const firstName = content.site.name.split(" ")[0] || "there";

  return (
    <div className="max-w-5xl pb-16">
      <section className="border-b border-[var(--color-border)] pb-9">
        <p className="flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.24em] text-foreground/55">
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-foreground" />
          Workspace / Ringkasan
        </p>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-[clamp(3.2rem,6vw,5.6rem)] leading-[0.88] tracking-[-0.035em]">
              Halo, {firstName}.
            </h2>
            <p className="mt-4 max-w-[56ch] text-sm leading-relaxed text-foreground/55">
              Semua konten homepage ada di satu tempat. Pilih bagian yang mau diubah, simpan,
              lalu buka situs untuk melihat hasilnya.
            </p>
          </div>
          <a
            href={withBase("/")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/50 px-4 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground/60 transition-colors hover:border-foreground/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
          >
            Lihat homepage
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {CONTENT_VIEWS.map((view) => {
          const Icon = view.icon;
          return (
            <button
              key={view.id}
              type="button"
              onClick={() => onNavigate(view.id)}
              className="group flex min-h-[154px] flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-white/45 p-5 text-left transition-colors hover:border-foreground/25 hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/60 text-foreground/60 transition-colors group-hover:border-foreground/20 group-hover:text-foreground">
                  <Icon aria-hidden="true" className="h-4 w-4" />
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 text-foreground/25 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground/60"
                />
              </div>
              <div>
                <p className="font-display text-3xl leading-none tracking-[-0.02em]">{view.label}</p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-foreground/50">
                  {view.caption}
                </p>
                <p className="mt-3 text-[9px] font-medium uppercase tracking-[0.16em] text-foreground/35">
                  {view.meta(content)}
                </p>
              </div>
            </button>
          );
        })}
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 md:p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70 text-foreground/60">
              <HardDrive aria-hidden="true" className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/45">
                Demo mode
              </p>
              <h3 className="mt-2 font-display text-2xl leading-none tracking-[-0.01em]">
                Tersimpan di browser ini.
              </h3>
              <p className="mt-3 max-w-[60ch] text-xs leading-relaxed text-foreground/55">
                Belum ada database. Perubahan disimpan di <code>localStorage</code> browser ini
                dan langsung dibaca oleh homepage di origin yang sama. Login juga masih hardcoded,
                jadi jangan pakai sebagai autentikasi produksi.
              </p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-foreground/35">
                Masuk sebagai {sessionEmail}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-[var(--color-border)] bg-white/35 p-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/45">
              Reset
            </p>
            <p className="mt-2 text-xs leading-relaxed text-foreground/55">
              Kembalikan seluruh konten homepage ke default. Tindakan ini tidak bisa dibatalkan.
            </p>
          </div>
          <button
            type="button"
            onClick={onResetAll}
            className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-white/55 px-4 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground/55 transition-colors hover:border-rose/50 hover:bg-rose/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
          >
            <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
            Reset semua konten
          </button>
        </div>
      </section>
    </div>
  );
}
