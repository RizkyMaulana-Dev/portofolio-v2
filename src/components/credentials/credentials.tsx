'use client';

import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Accent, Certificate } from '@/content/about';
import { useSiteContent } from '@/lib/site-content';
import { Reveal, RevealLine, useReveal } from '@/components/motion/reveal';

const SEAL: Record<Accent, string> = {
  lime: 'bg-lime/45',
  violet: 'bg-violet/40',
  peach: 'bg-peach/45',
  sky: 'bg-sky/40',
  sun: 'bg-sun/45',
  rose: 'bg-rose/40',
};

const GRID_STYLE = {
  backgroundImage:
    'linear-gradient(to right, rgb(17 17 17 / 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgb(17 17 17 / 0.045) 1px, transparent 1px)',
  backgroundSize: '48px 48px',
};

function CertificateCard({
  certificate,
  index,
  stickyClass,
  stickyTop,
}: {
  certificate: Certificate;
  index: number;
  stickyClass: string;
  stickyTop: string;
}) {
  const reveal = useReveal({
    delay: Math.min(index * 0.04, 0.24),
    distance: 28,
    amount: 0.18,
  });

  const number = String(index + 1).padStart(2, '0');

  return (
    <motion.a
      {...reveal}
      href={certificate.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${certificate.title} certificate PDF in a new tab`}
      style={{ top: stickyTop }}
      className={cn('group bg-background block focus-visible:z-10', stickyClass)}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[26px] border border-[var(--color-border)] bg-[#f4eee2] shadow-[0_28px_70px_-56px_rgb(0_0_0/0.35)]">
        <div aria-hidden="true" className="absolute inset-0 opacity-55" style={GRID_STYLE} />
        <div
          aria-hidden="true"
          className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-[var(--color-blob-2)] opacity-55 blur-[90px]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-16 -bottom-28 h-72 w-72 rounded-full bg-[var(--color-blob-1)] opacity-35 blur-[100px]"
        />

        <div className="absolute inset-0 flex items-center justify-center p-5 md:p-7">
          {certificate.image ? (
            <img
              src={certificate.image}
              alt=""
              loading="lazy"
              decoding="async"
              className="max-h-full max-w-full rounded-[6px] border border-black/5 object-contain shadow-[0_20px_44px_-26px_rgb(0_0_0/0.45)] transition-transform duration-700 ease-out group-hover:scale-[1.018]"
            />
          ) : (
            <span
              aria-hidden="true"
              className="font-display text-foreground/15 text-[7rem] leading-none italic select-none"
            >
              {certificate.mark}
            </span>
          )}
        </div>

        <div className="text-foreground/55 absolute inset-x-5 top-4 flex items-center justify-between text-[9px] font-medium tracking-[0.2em] uppercase md:inset-x-6 md:top-5">
          <span>N° {number}</span>
          <span>{certificate.year}</span>
        </div>

        <div className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-4 md:inset-x-6 md:bottom-5">
          <span
            aria-hidden="true"
            className={cn(
              'text-foreground/75 relative flex h-10 w-10 items-center justify-center rounded-full border border-black/10 shadow-sm',
              SEAL[certificate.accent]
            )}
          >
            <span
              aria-hidden="true"
              className="absolute inset-[3px] rounded-full border border-black/10"
            />
            <span className="font-display text-sm leading-none">{certificate.mark}</span>
          </span>
          <span className="text-foreground/75 group-hover:text-foreground inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-[9px] font-medium tracking-[0.16em] uppercase backdrop-blur-sm transition-colors duration-300 group-hover:bg-white">
            View PDF
            <ArrowUpRight
              className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>

      <div className="mt-5 border-t border-[var(--color-border)] pt-4">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-muted-foreground text-[10px] font-medium tracking-[0.18em] uppercase">
              {certificate.category ?? 'Certificate'}
              <span aria-hidden="true" className="text-muted-foreground/40 mx-2">
                /
              </span>
              {certificate.date ?? certificate.year}
            </p>
            <h3 className="font-display mt-2 line-clamp-2 min-h-[1.96em] max-w-[28ch] text-[1.8rem] leading-[0.98] tracking-[-0.01em] text-balance md:text-[1.55rem] lg:text-[2rem]">
              {certificate.title}
            </h3>
            <p className="text-muted-foreground mt-2 truncate text-xs">{certificate.issuer}</p>
          </div>
          <span className="text-foreground/60 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] transition-colors duration-300">
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-3">
          <span className="text-muted-foreground/65 truncate text-[9px] font-medium tracking-[0.16em] uppercase">
            {certificate.credentialId ? `ID ${certificate.credentialId}` : 'PDF credential'}
          </span>
          <span className="text-foreground/65 group-hover:text-foreground inline-flex shrink-0 items-center gap-1.5 text-[9px] font-medium tracking-[0.16em] uppercase transition-colors duration-300">
            Open credential
            <ArrowUpRight
              className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </motion.a>
  );
}

function CompactCertificate({
  certificate,
  index,
  top,
}: {
  certificate: Certificate;
  index: number;
  top: string;
}) {
  const reveal = useReveal({
    delay: Math.min(index * 0.025, 0.18),
    distance: 18,
    amount: 0.2,
  });

  return (
    <motion.a
      {...reveal}
      href={certificate.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${certificate.title} certificate PDF in a new tab`}
      style={{ top }}
      className="group bg-background sticky block motion-reduce:static"
    >
      <div className="flex items-center gap-3.5 rounded-2xl border border-[var(--color-border)] bg-white/65 p-3.5 transition-colors duration-300 hover:bg-white/90">
        <span
          className={cn(
            'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10',
            SEAL[certificate.accent]
          )}
        >
          <span
            aria-hidden="true"
            className="absolute inset-[3px] rounded-full border border-black/10"
          />
          <span className="font-display text-sm leading-none">{certificate.mark}</span>
        </span>

        <span className="min-w-0 flex-1">
          <span className="text-muted-foreground block truncate text-[9px] font-medium tracking-[0.16em] uppercase">
            {certificate.category ?? 'Certificate'} · {certificate.year}
          </span>
          <span className="text-foreground mt-0.5 line-clamp-2 min-h-[2.75em] text-[13px] leading-snug font-medium">
            {certificate.title}
          </span>
          <span className="text-muted-foreground mt-0.5 block truncate text-[10px]">
            {certificate.issuer}
          </span>
        </span>

        <span className="text-foreground/60 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] transition-colors duration-300">
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </motion.a>
  );
}

export function Credentials() {
  const { about } = useSiteContent();
  const certificates = about.certificates.items;
  const leftCertificates = certificates
    .map((certificate, index) => ({ certificate, index }))
    .filter(({ index }) => index % 2 === 0);
  const rightCertificates = certificates
    .map((certificate, index) => ({ certificate, index }))
    .filter(({ index }) => index % 2 === 1);
  const certificateCount = `${String(certificates.length).padStart(2, '0')} certificates`;
  const years = certificates
    .map(certificate => Number(certificate.year))
    .filter(year => Number.isFinite(year));
  const period = years.length > 0 ? `${Math.min(...years)}–${Math.max(...years)}` : '2023–2026';

  if (certificates.length === 0) return null;

  return (
    <section
      id="credentials"
      aria-labelledby="credentials-heading"
      className="relative border-t border-[var(--color-border)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-28 -left-[14%] h-[560px] w-[560px] rounded-full bg-[var(--color-blob-1)] opacity-35 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 pt-20 pb-0 md:px-10 md:pt-28 md:pb-0 lg:px-16 lg:pt-32">
        <header className="grid gap-8 border-b border-[var(--color-border)] pb-10 md:grid-cols-[minmax(0,1fr)_340px] md:items-end md:gap-12 md:pb-14 lg:gap-20">
          <div>
            <Reveal distance={10} amount={0.6}>
              <p className="text-muted-foreground flex items-center gap-2.5 text-[10px] font-medium tracking-[0.26em] uppercase">
                <span aria-hidden="true" className="bg-foreground h-1 w-1 rounded-full" />
                {about.certificates.label} — complete record
              </p>
            </Reveal>
            <h2
              id="credentials-heading"
              className="font-display mt-5 text-[clamp(3.2rem,7vw,6.2rem)] leading-[0.87] font-normal tracking-[-0.03em]"
            >
              <RevealLine>Every</RevealLine>
              <RevealLine delay={0.08}>
                <em className="italic">certificate.</em>
              </RevealLine>
            </h2>
          </div>

          <Reveal
            className="flex flex-col gap-5 md:items-end md:pb-2 md:text-right"
            delay={0.14}
            distance={18}
            amount={0.35}
          >
            <p className="text-muted-foreground max-w-[38ch] text-sm leading-relaxed">
              The full archive — from cybersecurity and programming to game development and
              interface design. Each certificate opens the original PDF.
            </p>
            <p className="text-muted-foreground/70 text-[10px] tracking-[0.18em] uppercase">
              {certificateCount} · {period}
            </p>
            <a
              href="/certificates"
              className="group text-foreground/60 hover:text-foreground focus-visible:text-foreground inline-flex min-h-8 items-center gap-1.5 text-[10px] font-medium tracking-[0.16em] uppercase transition-colors focus-visible:underline focus-visible:outline-none md:justify-end"
            >
              Open certificate archive
              <ArrowUpRight
                aria-hidden="true"
                className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </Reveal>
        </header>

        {/* Mobile: compact rows stack over each other as the page scrolls. */}
        <div className="mt-12 flex flex-col gap-3 md:hidden">
          {certificates.map((certificate, index) => (
            <CompactCertificate
              key={`${certificate.title}-${index}`}
              certificate={certificate}
              index={index}
              top={`calc(1rem + ${index * 4}px)`}
            />
          ))}
          <div aria-hidden="true" className="h-[56svh] shrink-0 motion-reduce:hidden" />
        </div>

        {/* Desktop: two staggered sticky columns, matching the project stack. */}
        <div className="mt-16 hidden md:grid md:grid-cols-2 md:gap-x-8 lg:mt-20 lg:gap-x-14">
          <div className="flex flex-col gap-20 lg:gap-24">
            {leftCertificates.map(({ certificate, index }, columnIndex) => (
              <CertificateCard
                key={`${certificate.title}-${index}`}
                certificate={certificate}
                index={index}
                stickyClass="sticky motion-reduce:static"
                stickyTop={`calc(4rem + ${columnIndex * 5}px)`}
              />
            ))}
            <div aria-hidden="true" className="h-[56svh] shrink-0 motion-reduce:hidden" />
          </div>

          <div className="flex flex-col gap-20 md:mt-20 lg:mt-28 lg:gap-24">
            {rightCertificates.map(({ certificate, index }, columnIndex) => (
              <CertificateCard
                key={`${certificate.title}-${index}`}
                certificate={certificate}
                index={index}
                stickyClass="sticky motion-reduce:static"
                stickyTop={`calc(5rem + ${columnIndex * 5}px)`}
              />
            ))}
            <div aria-hidden="true" className="h-[56svh] shrink-0 motion-reduce:hidden" />
          </div>
        </div>

        <div aria-hidden="true" className="hidden h-20 motion-reduce:block" />
      </div>
    </section>
  );
}
