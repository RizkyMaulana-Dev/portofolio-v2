"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { isAdminAuthenticated, signIn } from "@/lib/admin-auth";
import { withBase } from "@/lib/paths";

export function AdminLogin() {
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAdminAuthenticated()) {
      window.location.replace(withBase("/admin"));
      return;
    }

    setChecking(false);
  }, []);

  function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    setError("");

    const result = signIn(email, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }

    window.location.assign(withBase("/admin"));
  }

  if (checking) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground" />
          <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-foreground/55">
            Memeriksa sesi
          </span>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-svh overflow-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[18%] -top-[22%] h-[720px] w-[720px] rounded-full bg-[var(--color-blob-2)] opacity-35 blur-[170px]" />
        <div className="absolute -right-[16%] bottom-[-24%] h-[660px] w-[660px] rounded-full bg-[var(--color-blob-1)] opacity-30 blur-[170px]" />
        <div className="absolute left-[42%] top-[18%] h-[280px] w-[280px] rounded-full bg-[var(--color-blob-3)] opacity-20 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex min-h-svh max-w-[1280px] flex-col px-6 py-7 md:px-10 lg:px-16">
        <header className="enter-up flex items-center justify-between gap-6">
          <a
            href={withBase("/")}
            className="text-lg font-semibold tracking-[-0.02em] text-foreground focus-visible:underline focus-visible:outline-none"
          >
            Rizky°
          </a>
          <p className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/50">
            <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
            Admin access
          </p>
        </header>

        <div className="grid flex-1 items-center gap-10 py-10 max-lg:mx-auto max-lg:w-full max-lg:max-w-[430px] md:gap-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(360px,430px)] lg:gap-24 lg:py-20">
          <section className="enter-up enter-up-delay-1 max-w-[680px]">
            <p className="flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.26em] text-foreground/55">
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-foreground" />
              Content workspace
            </p>
            <h1 className="mt-4 font-display text-[clamp(2.7rem,8vw,7.6rem)] leading-[0.86] tracking-[-0.045em] text-balance">
              Keep the site
              <br />
              <em className="italic">clear.</em>
            </h1>
            <p className="mt-7 hidden max-w-[48ch] text-sm leading-relaxed text-foreground/60 md:text-[15px] lg:block">
              Satu tempat untuk merapikan copy, project, video, dan kontak yang tampil di
              halaman utama. Tanpa menyentuh kode.
            </p>

            <ul className="mt-10 hidden max-w-[600px] gap-3 sm:grid-cols-3 lg:grid">
              {[
                ["01", "Hero", "Headline, CTA, navigasi"],
                ["02", "Konten", "About, work, video"],
                ["03", "Kontak", "Email, sosial, footer"],
              ].map(([index, title, caption]) => (
                <li
                  key={index}
                  className="border-t border-[var(--color-border)] pt-3 text-[11px] leading-relaxed text-foreground/55"
                >
                  <span className="block text-[9px] font-medium uppercase tracking-[0.16em] text-foreground/35">
                    {index}
                  </span>
                  <span className="mt-1 block font-medium text-foreground/80">{title}</span>
                  {caption}
                </li>
              ))}
            </ul>
          </section>

          <section className="enter-up enter-up-delay-2 mx-auto w-full max-w-[430px] lg:mx-0">
            <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)]/90 p-6 shadow-[0_36px_100px_-60px_rgb(0_0_0/0.55)] backdrop-blur-sm md:p-8">
              <div className="flex items-start justify-between gap-5 border-b border-[var(--color-border)] pb-6">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-foreground/45">
                    Dashboard
                  </p>
                  <h2 className="mt-2 font-display text-[2.4rem] leading-none tracking-[-0.02em]">
                    Masuk.
                  </h2>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/50">
                  <LockKeyhole aria-hidden="true" className="h-4 w-4 text-foreground/60" />
                </span>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="admin-email"
                    className="text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/60"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/35"
                    />
                    <input
                      id="admin-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="nama@email.com"
                      className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-white/60 pl-10 pr-3.5 text-sm text-foreground placeholder:text-foreground/30 transition-colors focus:border-foreground/25 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ring/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="admin-password"
                    className="text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/60"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/35"
                    />
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••"
                      className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-white/60 pl-10 pr-11 text-sm text-foreground placeholder:text-foreground/30 transition-colors focus:border-foreground/25 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ring/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-foreground/40 transition-[color,background-color,scale] duration-200 motion-safe:hover:scale-110 motion-safe:active:scale-95 hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
                    >
                      {showPassword ? (
                        <EyeOff aria-hidden="true" className="h-4 w-4" />
                      ) : (
                        <Eye aria-hidden="true" className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-rose/35 bg-rose/10 px-3.5 py-3 text-xs leading-relaxed text-foreground/70"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="group flex h-12 w-full items-center justify-between rounded-full bg-foreground pl-5 pr-2 text-[10px] font-medium uppercase tracking-[0.16em] text-background transition-[opacity,scale] duration-200 motion-safe:hover:scale-[1.01] motion-safe:active:scale-[0.99] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2"
                >
                  Masuk ke dashboard
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                    <ArrowRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </span>
                </button>
              </form>

              <p className="mt-5 text-[10px] leading-relaxed text-foreground/40">
                Demo lokal · sesi disimpan di browser ini selama 12 jam.
              </p>
            </div>

            <a
              href={withBase("/")}
              className="group mt-5 inline-flex min-h-9 items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/45 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:outline-none"
            >
              <ArrowLeft
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
              />
              Kembali ke portfolio
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
