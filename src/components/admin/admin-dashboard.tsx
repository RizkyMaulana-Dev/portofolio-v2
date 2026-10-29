"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clapperboard,
  LayoutDashboard,
  LogOut,
  Mail,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { getAdminSession, signOut } from "@/lib/admin-auth";
import { withBase } from "@/lib/paths";
import {
  fetchRemoteContent,
  fetchRemoteDrafts,
  resetRemoteContent,
  saveRemoteContent,
  saveRemoteSection,
} from "@/lib/content-api";
import {
  clearLocalDraft,
  seedDraftsFromServer,
} from "@/lib/content-drafts";
import {
  defaultSiteContent,
  getSiteContent,
  hasStoredSiteContent,
  mergeRemoteSections,
  resetSiteContent,
  saveSiteContent,
  type SiteContent,
  type SiteSection,
} from "@/lib/site-content";
import { AboutSection } from "@/components/admin/sections/about-section";
import { ContactSection } from "@/components/admin/sections/contact-section";
import { HeroSection } from "@/components/admin/sections/hero-section";
import { VideosSection } from "@/components/admin/sections/videos-section";
import { WorkSection } from "@/components/admin/sections/work-section";
import { AdminOverview } from "@/components/admin/admin-overview";
import { cloneValue, type AdminView } from "@/components/admin/admin-types";

const NAV: Array<{
  id: AdminView;
  label: string;
  caption: string;
  icon: LucideIcon;
}> = [
  { id: "overview", label: "Ringkasan", caption: "Status konten", icon: LayoutDashboard },
  { id: "hero", label: "Hero", caption: "Headline & CTA", icon: Sparkles },
  { id: "about", label: "About", caption: "Skill & certificate", icon: UserRound },
  { id: "work", label: "Work", caption: "Project & cover", icon: BriefcaseBusiness },
  { id: "videos", label: "Videos", caption: "Clip & feed", icon: Clapperboard },
  { id: "site", label: "Contact", caption: "Email & footer", icon: Mail },
];

const SECTION_LABELS: Record<keyof SiteContent, string> = {
  hero: "Hero",
  about: "About",
  work: "Work",
  videos: "Videos",
  site: "Contact",
};

type Toast = { type: "success" | "error"; message: string } | null;
type StorageMode = "mysql" | "browser";

const INITIAL_SECTION_VERSIONS: Record<keyof SiteContent, number> = {
  hero: 0,
  about: 0,
  work: 0,
  videos: 0,
  site: 0,
};

export function AdminDashboard() {
  const [ready, setReady] = useState(false);
  const [sessionEmail, setSessionEmail] = useState("");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [active, setActive] = useState<AdminView>("overview");
  const [sectionVersions, setSectionVersions] = useState(INITIAL_SECTION_VERSIONS);
  const [toast, setToast] = useState<Toast>(null);
  const [storageMode, setStorageMode] = useState<StorageMode>("browser");

  useEffect(() => {
    const session = getAdminSession();
    if (!session) {
      window.location.replace(withBase("/admin/login"));
      return;
    }

    const hash = window.location.hash.replace("#", "");
    if (NAV.some((item) => item.id === hash)) {
      setActive(hash as AdminView);
    }

    setSessionEmail(session.email);

    let cancelled = false;

    void (async () => {
      const [remoteContent, remoteDrafts] = await Promise.all([
        fetchRemoteContent(),
        fetchRemoteDrafts(),
      ]);

      if (cancelled) return;

      seedDraftsFromServer(remoteDrafts);

      const apiAvailable = remoteContent !== null;
      const hasRemoteContent =
        apiAvailable && Object.keys(remoteContent ?? {}).length > 0;

      if (hasRemoteContent) {
        const merged = mergeRemoteSections(remoteContent);
        saveSiteContent(merged);
        setContent(merged);
      } else {
        const local = getSiteContent();
        setContent(local);

        if (apiAvailable && hasStoredSiteContent()) {
          const migrated = await saveRemoteContent(local);
          if (!cancelled) {
            setToast({
              type: migrated ? "success" : "error",
              message: migrated
                ? "Konten lokal dipindahkan ke MySQL."
                : "MySQL aktif, tetapi migrasi konten lokal gagal. Konten tetap aman di browser.",
            });
          }
        }
      }

      if (!cancelled) {
        setStorageMode(apiAvailable ? "mysql" : "browser");
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const showToast = useCallback((next: Toast) => {
    setToast(next);
  }, []);

  const navigate = useCallback((view: AdminView) => {
    setActive(view);
    const adminPath = withBase("/admin");
    const nextHash = view === "overview" ? adminPath : `${adminPath}#${view}`;
    window.history.replaceState(null, "", nextHash);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSave = useCallback(
    async (section: SiteSection, value: SiteContent[SiteSection]) => {
      if (!content) return false;

      const next = { ...content, [section]: value } as SiteContent;
      const storedLocally = saveSiteContent(next);
      const storedInMysql =
        storageMode === "mysql" ? await saveRemoteSection(section, value) : false;

      setContent(next);

      if (storedInMysql) {
        setStorageMode("mysql");
        showToast({
          type: "success",
          message: `${SECTION_LABELS[section]} berhasil disimpan di MySQL lokal.`,
        });
        return true;
      }

      if (storageMode === "browser") {
        showToast({
          type: storedLocally ? "success" : "error",
          message: storedLocally
            ? `${SECTION_LABELS[section]} disimpan di browser ini. MySQL tidak tersedia.`
            : "Perubahan tampil, tapi browser menolak menyimpan. Cek pengaturan penyimpanan.",
        });
        return storedLocally;
      }

      showToast({
        type: "error",
        message: `${SECTION_LABELS[section]} gagal disimpan ke MySQL. Perubahan tetap aman sebagai draft; coba simpan lagi.`,
      });
      return false;
    },
    [content, showToast, storageMode]
  );

  const handleResetSection = useCallback(
    async (section: SiteSection) => {
      if (!content) return;
      if (
        !window.confirm(
          `Reset bagian ${SECTION_LABELS[section]} ke konten default? Perubahan yang belum disimpan di bagian ini akan hilang.`
        )
      ) {
        return;
      }

      const defaultValue = cloneValue(defaultSiteContent[section]);

      if (storageMode === "mysql") {
        const saved = await saveRemoteSection(section, defaultValue);
        if (!saved) {
          showToast({
            type: "error",
            message: `Reset ${SECTION_LABELS[section]} gagal karena MySQL tidak bisa dihubungi.`,
          });
          return;
        }
      }

      const next = {
        ...content,
        [section]: defaultValue,
      } as SiteContent;

      saveSiteContent(next);
      clearLocalDraft(section);
      setContent(next);
      setSectionVersions((current) => ({
        ...current,
        [section]: current[section] + 1,
      }));
      showToast({
        type: "success",
        message: `${SECTION_LABELS[section]} dikembalikan ke default.`,
      });
    },
    [content, showToast, storageMode]
  );

  const handleResetAll = useCallback(async () => {
    if (
      !window.confirm(
        "Reset seluruh konten homepage ke default? Semua perubahan tersimpan dan draft akan hilang."
      )
    ) {
      return;
    }

    if (storageMode === "mysql") {
      const reset = await resetRemoteContent();
      if (!reset) {
        showToast({
          type: "error",
          message: "Reset gagal karena MySQL tidak bisa dihubungi. Konten lama tetap aman.",
        });
        return;
      }
    }

    resetSiteContent();
    for (const section of Object.keys(defaultSiteContent) as SiteSection[]) {
      clearLocalDraft(section);
    }
    setContent(cloneValue(defaultSiteContent));
    setSectionVersions((current) =>
      Object.fromEntries(
        Object.entries(current).map(([section, version]) => [section, version + 1])
      ) as Record<SiteSection, number>
    );
    showToast({ type: "success", message: "Semua konten dikembalikan ke default." });
  }, [showToast, storageMode]);

  function handleLogout() {
    signOut();
    window.location.replace(withBase("/admin/login"));
  }

  if (!ready || !content) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" />
          <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-foreground/55">
            Menyiapkan konten & koneksi MySQL
          </span>
        </div>
      </main>
    );
  }

  const activeNav = NAV.find((item) => item.id === active) ?? NAV[0];

  return (
    <div className="min-h-svh bg-background">
      <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="border-b border-[var(--color-border)] bg-[var(--color-surface)] lg:sticky lg:top-0 lg:h-svh lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 px-5 pt-5 md:px-7 lg:px-6 lg:pt-7">
              <a
                href={withBase("/admin")}
                className="text-lg font-semibold tracking-[-0.02em] text-foreground focus-visible:underline focus-visible:outline-none"
              >
                Rizky°
              </a>
              <span className="rounded-full border border-[var(--color-border)] bg-white/55 px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.16em] text-foreground/45">
                Admin
              </span>
            </div>

            <nav
              aria-label="Navigasi dashboard"
              className="mt-5 px-3 pb-4 md:px-4 lg:mt-10 lg:px-3"
            >
              <p className="hidden px-3 text-[9px] font-medium uppercase tracking-[0.22em] text-foreground/35 lg:block">
                Konten homepage
              </p>
              <div className="flex flex-wrap gap-1 lg:mt-3 lg:flex-col">
                {NAV.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => navigate(item.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={
                        isActive
                          ? "group flex items-center gap-3 rounded-xl bg-white/80 px-3 py-2.5 text-left text-foreground shadow-[0_10px_30px_-24px_rgb(0_0_0/0.5)] transition-colors"
                          : "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-foreground/50 transition-colors hover:bg-white/50 hover:text-foreground"
                      }
                    >
                      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                      <span>
                        <span className="block text-xs font-medium">{item.label}</span>
                        <span className="mt-0.5 hidden text-[9px] text-foreground/35 lg:block">
                          {item.caption}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>

            <div className="mt-auto hidden border-t border-[var(--color-border)] px-5 py-5 lg:block lg:px-6">
              <p className="truncate text-[10px] text-foreground/40">{sessionEmail}</p>
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href={withBase("/")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-9 items-center justify-between gap-2 rounded-lg px-2 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground/55 transition-colors hover:bg-white/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
                >
                  Lihat situs
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground/45 transition-colors hover:bg-rose/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
                >
                  <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-background/85 backdrop-blur-md">
            <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-8 lg:px-12">
              <div className="flex min-w-0 items-center gap-3">
                <span className="hidden h-1.5 w-1.5 rounded-full bg-foreground/50 sm:block" />
                <p className="truncate text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/45">
                  Admin / {activeNav.label}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/50 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.12em] text-foreground/45 sm:inline-flex">
                  <span
                    className={`h-1 w-1 rounded-full ${
                      storageMode === "mysql" ? "bg-lime" : "bg-foreground/30"
                    }`}
                  />
                  {storageMode === "mysql" ? "MySQL lokal" : "Browser fallback"}
                </span>
                <a
                  href={withBase("/")}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Lihat situs"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/50 text-foreground/55 transition-colors hover:border-foreground/25 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 lg:hidden"
                >
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Keluar"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/50 text-foreground/55 transition-colors hover:border-rose/40 hover:bg-rose/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 lg:hidden"
                >
                  <LogOut aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          <div className="px-5 py-8 md:px-8 md:py-10 lg:px-12 lg:py-12">
            {active === "overview" && (
              <AdminOverview
                content={content}
                sessionEmail={sessionEmail}
                storageMode={storageMode}
                onNavigate={navigate}
                onResetAll={handleResetAll}
              />
            )}

            <div className={active === "hero" ? "block" : "hidden"}>
              <HeroSection
                key={`hero-${sectionVersions.hero}`}
                section="hero"
                value={content.hero}
                onSave={(value) => handleSave("hero", value)}
                onReset={() => handleResetSection("hero")}
              />
            </div>

            <div className={active === "about" ? "block" : "hidden"}>
              <AboutSection
                key={`about-${sectionVersions.about}`}
                section="about"
                value={content.about}
                onSave={(value) => handleSave("about", value)}
                onReset={() => handleResetSection("about")}
              />
            </div>

            <div className={active === "work" ? "block" : "hidden"}>
              <WorkSection
                key={`work-${sectionVersions.work}`}
                section="work"
                value={content.work}
                onSave={(value) => handleSave("work", value)}
                onReset={() => handleResetSection("work")}
              />
            </div>

            <div className={active === "videos" ? "block" : "hidden"}>
              <VideosSection
                key={`videos-${sectionVersions.videos}`}
                section="videos"
                value={content.videos}
                onSave={(value) => handleSave("videos", value)}
                onReset={() => handleResetSection("videos")}
              />
            </div>

            <div className={active === "site" ? "block" : "hidden"}>
              <ContactSection
                key={`site-${sectionVersions.site}`}
                section="site"
                value={content.site}
                onSave={(value) => handleSave("site", value)}
                onReset={() => handleResetSection("site")}
              />
            </div>
          </div>
        </main>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-50 flex max-w-[360px] items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_24px_70px_-40px_rgb(0_0_0/0.55)] md:bottom-8 md:right-8"
        >
          {toast.type === "success" ? (
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-foreground/60" />
          ) : (
            <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-rose" />
          )}
          <p className="text-xs leading-relaxed text-foreground/70">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
