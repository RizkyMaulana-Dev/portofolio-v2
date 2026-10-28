'use client';

import { ArrowUpRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { withBase } from '@/lib/paths';
import type { VideoAccent, VideoClip, VideoEntry } from '@/content/videos';
import { useSiteContent } from '@/lib/site-content';
import { Reveal, RevealLine, useReveal } from '@/components/motion/reveal';
import { SectionPattern } from '@/components/ui/section-pattern';

const FILL: Record<VideoAccent, string> = {
  sun: 'bg-sun/80',
  rose: 'bg-rose/80',
  sky: 'bg-sky/80',
  violet: 'bg-violet/80',
  lime: 'bg-lime/80',
};

const ACCENT_HEX: Record<VideoAccent, string> = {
  sun: '#FFD36B',
  rose: '#FF9FC0',
  sky: '#8FD3FF',
  violet: '#B9A2FF',
  lime: '#D7F56B',
};

const GRID_STYLE = {
  backgroundImage:
    'linear-gradient(to right, var(--color-pattern-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--color-pattern-grid) 1px, transparent 1px)',
  backgroundSize: '32px 32px',
};

const SCANLINE_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(to bottom, var(--color-pattern-scan) 0px, var(--color-pattern-scan) 1px, transparent 1px, transparent 5px)',
};

function ArtBackdrop({ entry, compact = false }: { entry: VideoEntry; compact?: boolean }) {
  const accent = ACCENT_HEX[entry.accent];

  return (
    <>
      <div className="absolute inset-0" style={GRID_STYLE} />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${compact ? '10%' : '8%'} 6%, ${accent}b8 0%, ${accent}3d 36%, transparent 68%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(circle at 94% 96%, ${accent}99 0%, transparent 58%)`,
        }}
      />
    </>
  );
}

function VideoArt({ entry }: { entry: VideoEntry }) {
  const fill = FILL[entry.accent];

  if (entry.visual === 'horizon') {
    return (
      <div aria-hidden="true" className="relative h-[58%] w-[78%]">
        <span
          className={cn(
            'absolute top-[6%] left-1/2 aspect-square w-[54%] -translate-x-1/2 rounded-full shadow-[0_22px_60px_-28px_rgb(0_0_0/0.35)]',
            fill
          )}
        />
        <span className="bg-foreground/20 absolute inset-x-0 top-[62%] h-px" />
        <span className="border-foreground/10 absolute bottom-[6%] left-[10%] h-[20%] w-[46%] rounded-t-[10px] border bg-[var(--color-glass-soft)]" />
        <span className="border-foreground/10 absolute right-[8%] bottom-[6%] h-[12%] w-[24%] rounded-t-[6px] border bg-[var(--color-glass-soft)]" />
        <span className="bg-foreground/20 absolute top-[62%] left-1/2 h-6 w-px" />
      </div>
    );
  }

  if (entry.visual === 'portal') {
    return (
      <div aria-hidden="true" className="relative h-[62%] w-[52%]">
        <span className="border-foreground/10 absolute inset-0 overflow-hidden rounded-t-full rounded-b-[24px] border bg-[var(--color-glass-soft)]">
          <span className={cn('absolute inset-x-0 bottom-0 h-[64%]', fill)} />
          <span className="bg-foreground/15 absolute inset-x-0 bottom-[34%] h-px" />
        </span>
        <span className="bg-foreground/60 absolute top-[24%] -right-4 h-3 w-3 translate-x-full rounded-full" />
        <span className="bg-foreground/70 absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
      </div>
    );
  }

  if (entry.visual === 'fold') {
    return (
      <div aria-hidden="true" className="relative h-[58%] w-[64%]">
        <span className="border-foreground/10 absolute top-[18%] left-[2%] h-[62%] w-[62%] -rotate-6 rounded-[18px] border bg-[var(--color-glass)]" />
        <span className="border-foreground/10 bg-surface/80 absolute top-[8%] right-[2%] h-[62%] w-[62%] rotate-6 rounded-[18px] border" />
        <span
          className={cn(
            'border-foreground/[0.07] absolute bottom-[2%] left-[20%] h-[62%] w-[62%] rotate-12 rounded-[18px] border',
            fill
          )}
        />
      </div>
    );
  }

  if (entry.visual === 'meter') {
    return (
      <div aria-hidden="true" className="flex h-[56%] items-end gap-2 md:gap-3">
        {[34, 62, 48, 84, 56].map((height, index) => (
          <span
            key={height}
            className={cn('w-3 rounded-full md:w-4', index === 3 ? fill : 'bg-foreground/10')}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="relative aspect-square h-[56%]">
      <span className="border-foreground/10 absolute inset-0 rounded-full border" />
      <span className="border-foreground/[0.07] absolute inset-[12%] rounded-full border" />
      <span className={cn('absolute inset-[32%] rounded-full', fill)} />
      <span className="bg-foreground/70 absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
    </div>
  );
}

function FeaturedVideo({
  entry,
  href,
  label,
  total,
}: {
  entry: VideoEntry;
  href: string;
  label: string;
  total: number;
}) {
  const reveal = useReveal({ distance: 30, amount: 0.16 });

  return (
    <motion.div {...reveal}>
      <a
        id="showreel"
        href={href}
        aria-label={`${entry.title} — ${label}`}
        className="video-feed-card group bg-surface focus-visible:ring-ring relative block scroll-mt-24 overflow-hidden rounded-[28px] border border-[var(--color-border)] shadow-[0_30px_90px_-64px_rgb(0_0_0/0.55)] focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <div className="relative aspect-[9/16] w-full overflow-hidden">
          <div className="absolute inset-0 transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.035] group-hover:blur-[7px] group-focus-visible:scale-[1.035] group-focus-visible:blur-[7px]">
            <ArtBackdrop entry={entry} />
            <div className="absolute inset-0 flex items-center justify-center">
              <VideoArt entry={entry} />
            </div>
            <div className="absolute inset-0 opacity-35" style={SCANLINE_STYLE} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/[0.02] via-transparent to-black/[0.14]" />
          </div>

          <div
            aria-hidden="true"
            className="bg-foreground/0 group-hover:bg-foreground/[0.08] group-focus-visible:bg-foreground/[0.08] pointer-events-none absolute inset-0 transition-colors duration-500"
          />

          <div className="text-foreground/55 pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between text-[9px] font-medium tracking-[0.2em] uppercase md:inset-x-5 md:top-5">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="bg-foreground/60 h-1.5 w-1.5 rounded-full" />
              Featured clip
            </span>
            <span>{entry.duration}</span>
          </div>

          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between md:inset-x-5 md:bottom-5">
            <span className="text-foreground/70 inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-glass)] px-3 py-1.5 text-[9px] font-medium tracking-[0.16em] uppercase backdrop-blur-sm">
              {entry.category}
            </span>
            <span className="text-foreground/70 hidden h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-glass)] backdrop-blur-sm md:flex">
              <Play aria-hidden="true" className="h-3 w-3 fill-current" />
            </span>
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
            <span className="video-feed-cta bg-foreground text-background inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[10px] font-medium tracking-[0.16em] whitespace-nowrap uppercase opacity-100 shadow-xl transition-all duration-500 ease-out">
              {label}
              <ArrowUpRight aria-hidden="true" className="h-3 w-3" />
            </span>
          </div>
        </div>
      </a>

      <div className="mt-5 border-t border-[var(--color-border)] pt-4">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-muted-foreground text-[10px] font-medium tracking-[0.18em] uppercase">
              {entry.category}
              <span aria-hidden="true" className="text-muted-foreground/40 mx-2">
                /
              </span>
              {entry.date}
            </p>
            <h3 className="font-display mt-2 text-[clamp(1.8rem,3vw,2.25rem)] leading-[0.95] tracking-[-0.01em]">
              {entry.title}
            </h3>
          </div>
          <p className="text-muted-foreground/70 shrink-0 pt-0.5 text-right text-[10px] tracking-[0.18em] uppercase">
            01
            <span aria-hidden="true" className="text-muted-foreground/40">
              {' '}
              / {String(total).padStart(2, '0')}
            </span>
          </p>
        </div>
        <p className="text-muted-foreground mt-3 max-w-[36ch] text-xs leading-relaxed">
          {entry.description}
        </p>
      </div>
    </motion.div>
  );
}

function ClipRow({
  clip,
  index,
  feedHref,
}: {
  clip: VideoClip;
  index: number;
  feedHref: string;
}) {
  const reveal = useReveal({
    delay: Math.min(index * 0.04, 0.16),
    distance: 18,
    amount: 0.35,
  });

  return (
    <motion.li {...reveal} className="border-b border-[var(--color-border)]">
      <a
        href={`${feedHref}?clip=${clip.slug}`}
        className="group focus-visible:ring-ring grid grid-cols-[1.25rem_3.5rem_minmax(0,1fr)_auto] items-center gap-3 py-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:grid-cols-[1.5rem_4.25rem_minmax(0,1fr)_auto] md:gap-5 md:py-5"
      >
        <span className="text-muted-foreground/60 self-start pt-1 text-[9px] font-medium tracking-[0.16em]">
          {String(index + 2).padStart(2, '0')}
        </span>

        <div className="bg-surface relative aspect-[9/16] w-14 overflow-hidden rounded-[14px] border border-[var(--color-border)] md:w-[68px] lg:w-[76px]">
          <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
            <ArtBackdrop entry={clip} compact />
            <div className="absolute inset-0 flex items-center justify-center">
              <VideoArt entry={clip} />
            </div>
            <div className="absolute inset-0 opacity-30" style={SCANLINE_STYLE} />
          </div>
          <span className="bg-foreground/65 text-background absolute right-1.5 bottom-1.5 rounded-full px-1.5 py-0.5 text-[7px] font-medium tracking-[0.08em] backdrop-blur-sm">
            {clip.duration}
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-muted-foreground text-[9px] font-medium tracking-[0.18em] uppercase">
            {clip.category}
            <span aria-hidden="true" className="text-muted-foreground/40 mx-2">
              /
            </span>
            {clip.date}
          </p>
          <h3 className="font-display mt-1.5 text-[1.55rem] leading-none tracking-[-0.01em] md:text-[1.75rem]">
            {clip.title}
          </h3>
          <p className="text-muted-foreground mt-1.5 hidden text-[11px] leading-snug md:block">
            {clip.description}
          </p>
        </div>

        <span className="text-foreground/60 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] transition-colors duration-300">
          <ArrowUpRight
            aria-hidden="true"
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </a>
    </motion.li>
  );
}

export function Videos() {
  const { videos } = useSiteContent();
  const [featured, ...moreClips] = videos.clips;
  if (!featured) return null;

  const totalClips = videos.clips.length;
  const totalLabel = `${String(totalClips).padStart(2, '0')} clips`;

  return (
    <section
      id="videos"
      aria-labelledby="videos-heading"
      className="relative border-t border-[var(--color-border)]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-24 -left-[14%] h-[520px] w-[520px] rounded-full bg-[var(--color-blob-2)] opacity-35 blur-[160px]" />
        <div className="absolute -right-[12%] bottom-0 h-[440px] w-[440px] rounded-full bg-[var(--color-blob-1)] opacity-25 blur-[150px]" />
        <SectionPattern edge="left" variant="hatch" className="opacity-50" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
        <header className="grid gap-8 border-b border-[var(--color-border)] pb-10 md:grid-cols-[minmax(0,1fr)_340px] md:items-end md:gap-12 md:pb-14 lg:gap-20">
          <div>
            <Reveal distance={10} amount={0.6}>
              <p className="text-muted-foreground flex items-center gap-2.5 text-[10px] font-medium tracking-[0.26em] uppercase">
                <span aria-hidden="true" className="bg-foreground h-1 w-1 rounded-full" />
                {videos.eyebrow}
              </p>
            </Reveal>
            <h2
              id="videos-heading"
              className="font-display mt-5 text-[clamp(3.2rem,7vw,6.2rem)] leading-[0.87] font-normal tracking-[-0.03em]"
            >
              <RevealLine>{videos.heading[0]}</RevealLine>
              <RevealLine delay={0.08}>
                <em className="italic">{videos.heading[1]}</em>
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
              {videos.intro}
            </p>
            <p className="text-muted-foreground/70 text-[10px] tracking-[0.18em] uppercase">
              {totalLabel} · {videos.period}
            </p>
          </Reveal>
        </header>

        <div className="mt-12 grid gap-14 md:mt-16 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] md:items-start md:gap-10 lg:mt-20 lg:gap-16">
          <FeaturedVideo
            entry={featured}
            href={withBase(`${videos.feedHref}?clip=${featured.slug}`)}
            label={videos.feedLabel}
            total={totalClips}
          />

          <div>
            <Reveal
              className="flex items-end justify-between gap-6 border-b border-[var(--color-border)] pb-4"
              delay={0.08}
              distance={12}
              amount={0.4}
            >
              <div>
                <p className="text-muted-foreground text-[10px] font-medium tracking-[0.26em] uppercase">
                  More from the feed
                </p>
                <p className="text-muted-foreground/80 mt-2 max-w-[32ch] text-xs leading-relaxed">
                  A running index of recent posts, kept in the order they landed.
                </p>
              </div>
              <p className="text-muted-foreground/70 shrink-0 pb-0.5 text-[10px] tracking-[0.18em] uppercase">
                {String(moreClips.length).padStart(2, '0')} clips
              </p>
            </Reveal>

            <ol aria-label="More from the feed">
              {moreClips.map((clip, index) => (
                <ClipRow
                  key={`${clip.slug}-${index}`}
                  clip={clip}
                  index={index}
                  feedHref={withBase(videos.feedHref)}
                />
              ))}
            </ol>

            <Reveal className="mt-5" distance={8} amount={0.6} delay={0.12}>
              <p className="text-muted-foreground/55 text-[10px] tracking-[0.18em] uppercase">
                New clips appear here as they’re posted.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
