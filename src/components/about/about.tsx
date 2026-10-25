"use client";

import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { about, type Accent } from "@/content/about";
import { useSectionProgress } from "@/lib/use-section-progress";

const DOT: Record<Accent, string> = {
  lime: "bg-lime",
  violet: "bg-violet",
  peach: "bg-peach",
  sky: "bg-sky",
  sun: "bg-sun",
  rose: "bg-rose",
};

const SEAL: Record<Accent, string> = {
  lime: "bg-lime/45",
  violet: "bg-violet/40",
  peach: "bg-peach/45",
  sky: "bg-sky/40",
  sun: "bg-sun/45",
  rose: "bg-rose/40",
};

export function About() {
  const wrapperRef = useRef<HTMLElement>(null);
  const progress = useSectionProgress(wrapperRef);
  const sheetY = useTransform(progress, [0, 1], ["0%", "-100%"]);
  const totalSkills = about.skillGroups.reduce((count, group) => count + group.skills.length, 0);

  return (
    <section
      id="about"
      ref={wrapperRef}
      aria-labelledby="about-heading"
      className="relative h-[200svh] border-t border-[var(--color-border)]"
    >
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        {/* Soft ambient wash, continuing the warm paper feel */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[14%] -top-48 h-[520px] w-[520px] rounded-full bg-[var(--color-blob-2)] opacity-50 blur-[150px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 left-[-16%] h-[440px] w-[440px] rounded-full bg-[var(--color-blob-1)] opacity-40 blur-[150px]"
        />

        {/* Pinned header — never covered by the credential sheet */}
        <header className="relative z-20 shrink-0">
          <div className="mx-auto flex max-w-[1280px] items-start justify-between gap-8 px-6 pb-5 pt-9 md:px-10 md:pb-7 md:pt-11 lg:px-16 lg:pt-14">
            <div>
              <p className="flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-foreground" />
                {about.eyebrow}
              </p>
              <h2
                id="about-heading"
                className="mt-3.5 font-display text-[clamp(2.6rem,5vw,4.6rem)] font-normal leading-[0.9] tracking-[-0.025em]"
              >
                {about.heading[0]}
                <br />
                <em className="italic">{about.heading[1]}</em>
              </h2>
            </div>
            <span
              aria-hidden="true"
              className="hidden shrink-0 select-none font-display text-[clamp(4.5rem,8vw,7.5rem)] leading-[0.7] text-foreground/[0.05] md:block"
            >
              ✦
            </span>
          </div>
        </header>

        {/* Skills sit under the header; the credential sheet rises over this layer only */}
        <div className="relative min-h-0 flex-1">
          <div className="mx-auto flex h-full max-w-[1280px] flex-col px-6 pb-6 pt-4 md:px-10 md:pb-10 md:pt-7 lg:px-16">
            <div className="flex items-end justify-between gap-4 pb-4 md:pb-7">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                {about.skills.label}
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
                {about.skillGroups.length} disciplines · {totalSkills} skills
              </p>
            </div>

            <div className="grid gap-y-5 md:grid-cols-3 md:gap-x-12 md:gap-y-0">
              {about.skillGroups.map((group) => (
                <div key={group.label}>
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className={cn("h-1.5 w-1.5 shrink-0 rounded-full", DOT[group.accent])}
                    />
                    <h3 className="font-display text-2xl leading-none tracking-[-0.01em]">
                      {group.label}
                    </h3>
                  </div>
                  <p className="mt-1.5 hidden text-[11px] leading-snug text-muted-foreground md:block">
                    {group.note}
                  </p>

                  <ul className="mt-2.5 grid grid-cols-2 gap-x-5 md:mt-4 md:grid-cols-1 md:gap-x-0">
                    {group.skills.map((skill, skillIndex) => (
                      <li
                        key={skill}
                        className="group flex items-baseline justify-between gap-3 border-b border-[var(--color-border)] py-1.5 md:py-2.5"
                      >
                        <span className="text-[13px] leading-snug text-foreground md:text-[14px]">
                          {skill}
                        </span>
                        <span
                          aria-hidden="true"
                          className="hidden font-display text-[11px] text-muted-foreground/40 transition-colors duration-300 group-hover:text-muted-foreground/80 md:inline"
                        >
                          {String(skillIndex + 1).padStart(2, "0")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Separate certificate section — slides up with scroll, stopping below the title */}
          <motion.section
            id="certificates"
            aria-labelledby="certificates-heading"
            style={{ y: sheetY }}
            className={cn(
              "absolute inset-x-0 top-full z-30 h-full",
              "border-t border-[var(--color-border)] bg-[var(--color-surface)]",
              "shadow-[0_-32px_64px_-40px_rgb(0_0_0/0.35)]"
            )}
          >
            <div className="mx-auto flex h-full max-w-[1280px] flex-col px-6 pb-8 pt-6 md:px-10 md:pb-10 md:pt-8 lg:px-16 lg:pt-10">
              <div className="flex flex-wrap items-end justify-between gap-3 pb-5 md:pb-7">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                    {about.certificates.label}
                  </p>
                  <h3
                    id="certificates-heading"
                    className="mt-2.5 font-display text-[2rem] leading-[0.95] tracking-[-0.015em] md:text-[2.7rem]"
                  >
                    {about.certificates.heading[0]}{" "}
                    <em className="italic">{about.certificates.heading[1]}</em>
                  </h3>
                </div>
                <p className="pb-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
                  {about.certificates.note}
                </p>
              </div>

              {/* Mobile: compact credential rows */}
              <div className="grid gap-2.5 lg:hidden">
                {about.certificates.items.map((certificate) => (
                  <a
                    key={certificate.title}
                    href={certificate.href}
                    className={cn(
                      "group flex items-center gap-3.5 rounded-2xl border border-[var(--color-border)]",
                      "bg-white/50 px-3.5 py-3 transition-colors duration-300 hover:bg-white/80"
                    )}
                  >
                    <span
                      className={cn(
                        "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10",
                        SEAL[certificate.accent]
                      )}
                    >
                      <span aria-hidden="true" className="absolute inset-[3px] rounded-full border border-black/10" />
                      <span className="font-display text-sm leading-none">{certificate.mark}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        {certificate.issuer} · {certificate.year}
                      </span>
                      <span className="mt-0.5 block truncate font-display text-lg leading-tight">
                        {certificate.title}
                      </span>
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-foreground/60">
                      <ArrowUpRight
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                ))}
              </div>

              {/* Desktop: certificate cards */}
              <div className="hidden gap-4 lg:grid lg:grid-cols-3 lg:gap-5">
                {about.certificates.items.map((certificate) => (
                  <a
                    key={certificate.title}
                    href={certificate.href}
                    className={cn(
                      "group relative flex min-h-[240px] flex-col overflow-hidden rounded-[24px]",
                      "border border-[var(--color-border)] bg-white/55 p-6",
                      "transition-[transform,background-color,box-shadow] duration-300 ease-out",
                      "hover:-translate-y-1 hover:bg-white/80 hover:shadow-[0_28px_56px_-28px_rgb(0_0_0/0.22)]"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-white/80 via-white/40 to-transparent"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-8 -right-4 select-none font-display text-[8rem] leading-none text-foreground/[0.035]"
                    >
                      {certificate.mark}
                    </span>

                    <div className="flex items-start justify-between gap-4">
                      <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        {certificate.year}
                      </span>
                      <span
                        className={cn(
                          "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10",
                          "transition-transform duration-500 ease-out group-hover:rotate-6",
                          SEAL[certificate.accent]
                        )}
                      >
                        <span aria-hidden="true" className="absolute inset-[3px] rounded-full border border-black/10" />
                        <span className="font-display text-base leading-none">{certificate.mark}</span>
                      </span>
                    </div>

                    <div className="mt-auto pt-7">
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        {certificate.issuer}
                      </p>
                      <h4 className="mt-2 max-w-[17ch] font-display text-[1.65rem] leading-[1.02] tracking-[-0.01em]">
                        {certificate.title}
                      </h4>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-3.5">
                      <span className="truncate text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">
                        ID {certificate.credentialId}
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em]">
                        View
                        <ArrowUpRight
                          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </section>
  );
}
