"use client";

import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Accent } from "@/content/about";
import { useSectionProgress } from "@/lib/use-section-progress";
import { useSiteContent } from "@/lib/site-content";
import { Reveal, RevealLine } from "@/components/motion/reveal";
import { SectionPattern } from "@/components/ui/section-pattern";

const DOT: Record<Accent, string> = {
  lime: "bg-lime",
  violet: "bg-violet",
  peach: "bg-peach",
  sky: "bg-sky",
  sun: "bg-sun",
  rose: "bg-rose",
};

export function About() {
  const wrapperRef = useRef<HTMLElement>(null);
  const progress = useSectionProgress(wrapperRef);
  const sheetY = useTransform(progress, [0, 1], ["0%", "-100%"]);
  const { about } = useSiteContent();
  const totalSkills = about.skillGroups.reduce((count, group) => count + group.skills.length, 0);
  const stages = about.fullstack.stages;
  const featuredCertificates = about.certificates.items
    .filter((certificate) => certificate.featured)
    .slice(0, 3);

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

        <SectionPattern edge="left" variant="grid" />

        {/* Pinned header — never covered by the credential sheet */}
        <header className="relative z-20 shrink-0">
          <div className="mx-auto flex max-w-[1280px] items-start justify-between gap-8 px-6 pb-5 pt-9 md:px-10 md:pb-7 md:pt-11 lg:px-16 lg:pt-14">
            <div>
              <Reveal distance={10} amount={0.6}>
                <p className="flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-foreground" />
                  {about.eyebrow}
                </p>
              </Reveal>
              <h2
                id="about-heading"
                className="mt-3.5 font-display text-[clamp(2.6rem,5vw,4.6rem)] font-normal leading-[0.9] tracking-[-0.025em]"
              >
                <RevealLine>{about.heading[0]}</RevealLine>
                <RevealLine delay={0.08}>
                  <em className="italic">{about.heading[1]}</em>
                </RevealLine>
              </h2>
            </div>
            <Reveal
              delay={0.16}
              distance={0}
              amount={0.6}
              className="hidden shrink-0 md:block"
            >
              <span
                aria-hidden="true"
                className="block select-none font-display text-[clamp(4.5rem,8vw,7.5rem)] leading-[0.7] text-foreground/[0.05]"
              >
                ✦
              </span>
            </Reveal>
          </div>
        </header>

        {/* Skills sit under the header; the full-stack sheet rises over this layer only */}
        <div className="relative min-h-0 flex-1">
          <div className="mx-auto flex h-full max-w-[1280px] flex-col px-6 pb-6 pt-4 md:px-10 md:pb-10 md:pt-7 lg:px-16">
            <Reveal
              className="flex items-end justify-between gap-4 pb-4 md:pb-7"
              distance={12}
              amount={0.4}
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                {about.skills.label}
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
                {about.skillGroups.length} disciplines · {totalSkills} skills
              </p>
            </Reveal>

            <div className="grid gap-y-5 md:grid-cols-3 md:gap-x-12 md:gap-y-0">
              {about.skillGroups.map((group, groupIndex) => (
                <Reveal
                  key={`${group.label}-${groupIndex}`}
                  delay={groupIndex * 0.08}
                  distance={22}
                  amount={0.18}
                >
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
                        key={`${skill}-${skillIndex}`}
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
                </Reveal>
              ))}
            </div>
          </div>

          {/* Full-stack path — slides up with scroll, stopping below the title */}
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
            <div className="mx-auto flex h-full max-w-[1280px] flex-col overflow-y-auto overscroll-contain px-6 pb-8 pt-6 md:px-10 md:pb-10 md:pt-8 lg:px-16 lg:pt-10">
              <div className="flex flex-wrap items-end justify-between gap-3 pb-5 md:pb-7">
                <div className="max-w-[720px]">
                  <Reveal distance={8} amount={0.6}>
                    <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                      {about.fullstack.label}
                    </p>
                  </Reveal>
                  <h3
                    id="certificates-heading"
                    className="mt-2.5 font-display text-[2rem] leading-[0.95] tracking-[-0.015em] md:text-[2.7rem]"
                  >
                    <RevealLine>
                      {about.fullstack.heading[0]}{" "}
                      <em className="italic">{about.fullstack.heading[1]}</em>
                    </RevealLine>
                  </h3>
                </div>
                <div className="flex flex-col items-start gap-2 pb-1 md:items-end">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground/70">
                    {about.fullstack.note}
                  </p>
                  <a
                    href="/certificates"
                    className="group inline-flex min-h-8 items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/60 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:outline-none"
                  >
                    See all credentials
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </div>
              </div>

              <div className="mt-1 grid grid-cols-2 gap-2.5 md:mt-2 md:gap-4 lg:grid-cols-4">
                {stages.map((stage, stageIndex) => (
                  <Reveal
                    key={`${stage.title}-${stageIndex}`}
                    delay={stageIndex * 0.06}
                    distance={22}
                    amount={0.2}
                    className="h-full"
                  >
                    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white/55 p-4 md:rounded-[24px] md:p-5">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground/70">
                          Stage {String(stageIndex + 1).padStart(2, "0")}
                        </span>
                        <span
                          aria-hidden="true"
                          className={cn("h-2 w-2 shrink-0 rounded-full", DOT[stage.accent])}
                        />
                      </div>

                      <div className="mt-4 md:mt-auto md:pt-10">
                        <h4 className="font-display text-[clamp(1.4rem,7vw,1.55rem)] leading-[0.95] tracking-[-0.01em] md:text-[2rem]">
                          {stage.title}
                        </h4>
                        <p className="mt-2 hidden text-[12px] leading-relaxed text-muted-foreground md:block">
                          {stage.summary}
                        </p>
                      </div>

                      <div className="mt-4 border-t border-[var(--color-border)] pt-3">
                        <p className="text-[9px] leading-relaxed uppercase tracking-[0.14em] text-muted-foreground/70">
                          {stage.proof}
                        </p>
                      </div>

                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-7 -right-3 select-none font-display text-[6.5rem] italic leading-none text-foreground/[0.035]"
                      >
                        {stageIndex + 1}
                      </span>
                    </article>
                  </Reveal>
                ))}
              </div>

              {featuredCertificates.length > 0 && (
                <div className="mt-auto flex min-w-0 items-center gap-2 overflow-x-auto border-t border-[var(--color-border)] pt-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:pt-5 md:pb-0">
                  <p className="shrink-0 text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground/60">
                    Selected proof
                  </p>
                  {featuredCertificates.map((certificate, certificateIndex) => (
                    <a
                      key={`${certificate.title}-${certificateIndex}`}
                      href={certificate.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${certificate.title} certificate PDF in a new tab`}
                      className="group flex shrink-0 items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/40 py-1 pl-1 pr-2.5 transition-colors hover:bg-white/80 focus-visible:bg-white/80 focus-visible:outline-none"
                    >
                      <span className="relative flex h-8 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-[#f4eee2]">
                        {certificate.image ? (
                          <img
                            src={certificate.image}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-contain p-0.5"
                          />
                        ) : (
                          <span className="font-display text-xs italic">{certificate.mark}</span>
                        )}
                      </span>
                      <span className="max-w-[26ch] truncate text-[10px] font-medium text-foreground/70">
                        {certificate.title.replace(/^Xpresso ACP Lite — /, "")}
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="hidden h-3 w-3 shrink-0 text-foreground/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 lg:block"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </section>
  );
}
