"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Accent, Certificate } from "@/content/about";
import { useSiteContent } from "@/lib/site-content";
import { Reveal, RevealLine, useReveal } from "@/components/motion/reveal";
import { SectionPattern } from "@/components/ui/section-pattern";

const GRID_STYLE = {
  backgroundImage:
    "linear-gradient(to right, rgb(17 17 17 / 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgb(17 17 17 / 0.045) 1px, transparent 1px)",
  backgroundSize: "36px 36px",
};

const DOT: Record<Accent, string> = {
  lime: "bg-lime",
  violet: "bg-violet",
  peach: "bg-peach",
  sky: "bg-sky",
  sun: "bg-sun",
  rose: "bg-rose",
};

const TITLE_CLAMP = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical" as const,
  WebkitLineClamp: 2,
  overflow: "hidden",
};

function CertificateTile({
  certificate,
  index,
}: {
  certificate: Certificate;
  index: number;
}) {
  const reveal = useReveal({
    delay: Math.min(index * 0.025, 0.2),
    distance: 20,
    amount: 0.12,
  });

  return (
    <motion.a
      {...reveal}
      href={certificate.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${certificate.title} certificate PDF in a new tab`}
      className="group flex h-full items-start gap-2.5 focus-visible:outline-none lg:block"
    >
      <div className="relative h-12 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[#f4eee2] shadow-[0_14px_30px_-26px_rgb(0_0_0/0.35)] transition-[border-color,box-shadow,transform] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:border-foreground/20 group-hover:shadow-[0_22px_38px_-28px_rgb(0_0_0/0.32)] group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background lg:aspect-[4/3] lg:h-auto lg:w-full lg:rounded-[20px] lg:group-hover:-translate-y-1">
        <div aria-hidden="true" className="absolute inset-0 opacity-55" style={GRID_STYLE} />
        <div
          aria-hidden="true"
          className={cn(
            "absolute -left-16 -top-20 h-48 w-48 rounded-full opacity-35 blur-[70px]",
            DOT[certificate.accent]
          )}
        />

        <div className="absolute inset-0 flex items-center justify-center p-1 lg:p-4">
          {certificate.image ? (
            <img
              src={certificate.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="max-h-full max-w-full rounded-[3px] border border-black/5 object-contain shadow-[0_10px_20px_-16px_rgb(0_0_0/0.4)] transition-transform duration-500 ease-out group-hover:scale-[1.018] lg:rounded-[6px] lg:shadow-[0_16px_34px_-24px_rgb(0_0_0/0.4)]"
            />
          ) : (
            <span
              aria-hidden="true"
              className="select-none font-display text-xl italic leading-none text-foreground/15 lg:text-[5rem]"
            >
              {certificate.mark}
            </span>
          )}
        </div>

        <div className="absolute inset-x-4 top-3 hidden items-center justify-between text-[8px] font-medium uppercase tracking-[0.16em] text-foreground/55 lg:flex">
          <span>N° {String(index + 1).padStart(2, "0")}</span>
          <span>{certificate.year}</span>
        </div>

        {certificate.featured && (
          <span className="absolute bottom-3 left-3 hidden items-center gap-1.5 rounded-full border border-black/10 bg-white/85 px-2 py-1 text-[8px] font-medium uppercase tracking-[0.14em] text-foreground/70 backdrop-blur-sm lg:inline-flex">
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-foreground/70" />
            Selected
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 items-start justify-between gap-2 lg:mt-3 lg:flex-none">
        <div className="min-w-0 flex-1">
          <p className="hidden truncate text-[8px] font-medium uppercase tracking-[0.15em] text-muted-foreground lg:block">
            {certificate.category ?? "Certificate"} · {certificate.year}
          </p>
          <p className="text-[8px] font-medium uppercase tracking-[0.14em] text-muted-foreground lg:hidden">
            {certificate.year}
            {certificate.featured ? " · Selected" : ""}
          </p>
          <h3
            className="mt-0.5 font-display text-[13px] leading-[1.15] tracking-[-0.005em] lg:mt-1 lg:h-[2.05em] lg:text-[1.4rem] lg:leading-[1.02] lg:tracking-[-0.01em]"
            style={TITLE_CLAMP}
          >
            {certificate.title}
          </h3>
          <p className="mt-1 hidden truncate text-[10px] text-muted-foreground lg:block">
            {certificate.issuer}
          </p>
        </div>
        <span className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] text-foreground/55 transition-colors duration-300 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background lg:flex">
          <ArrowUpRight
            aria-hidden="true"
            className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </motion.a>
  );
}

export function Credentials() {
  const { about } = useSiteContent();
  const certificates = about.certificates.items;
  const count = certificates.length;

  if (count === 0) return null;

  const years = certificates
    .map((certificate) => Number(certificate.year))
    .filter((year) => Number.isFinite(year));
  const period = years.length > 0 ? `${Math.min(...years)}–${Math.max(...years)}` : "";
  const certificateCount = `${String(count).padStart(2, "0")} certificates`;

  return (
    <section
      id="credentials"
      aria-labelledby="credentials-heading"
      className="relative border-t border-[var(--color-border)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[14%] top-24 h-[520px] w-[520px] rounded-full bg-[var(--color-blob-1)] opacity-30 blur-[160px]" />
        <SectionPattern edge="right" variant="dots" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 py-14 md:px-10 md:py-24 lg:px-16 lg:py-28">
        <header className="grid gap-8 border-b border-[var(--color-border)] pb-7 md:grid-cols-[minmax(0,1fr)_340px] md:items-end md:gap-12 md:pb-10 lg:gap-20">
          <div>
            <Reveal distance={10} amount={0.6}>
              <p className="flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.26em] text-muted-foreground">
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-foreground" />
                {about.certificates.label} — complete record
              </p>
            </Reveal>
            <h2
              id="credentials-heading"
              className="mt-4 font-display text-[clamp(2.7rem,7vw,6.2rem)] font-normal leading-[0.87] tracking-[-0.03em]"
            >
              <RevealLine>{about.certificates.heading[0]}</RevealLine>
              <RevealLine delay={0.08}>
                <em className="italic">{about.certificates.heading[1]}</em>
              </RevealLine>
            </h2>
          </div>

          <Reveal
            className="flex flex-col gap-4 md:items-end md:pb-2 md:text-right"
            delay={0.14}
            distance={18}
            amount={0.35}
          >
            <p className="max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
              The full archive, in one compact wall. Every certificate stays visible — open any
              card for the original PDF.
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
              {certificateCount} · {period}
            </p>
            <a
              href="/certificates"
              className="group inline-flex min-h-8 items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-foreground/60 transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:outline-none md:justify-end"
            >
              Open certificate archive
              <ArrowUpRight
                aria-hidden="true"
                className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </Reveal>
        </header>

        <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-4 md:mt-10 md:gap-x-5 md:gap-y-5 lg:mt-12 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10">
          {certificates.map((certificate, index) => (
            <CertificateTile
              key={`${certificate.title}-${index}`}
              certificate={certificate}
              index={index}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4 md:mt-12 md:pt-5">
          <p className="max-w-[48ch] text-xs leading-relaxed text-muted-foreground">
            Selected credentials are marked. Every card links directly to its verified PDF.
          </p>
          <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground/60">
            {about.certificates.note} · PDF verified
          </p>
        </div>
      </div>
    </section>
  );
}
