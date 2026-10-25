'use client';

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { copyTextToClipboard } from '@/lib/clipboard';
import { formatClipIndex, getClipShareUrl } from '@/lib/feed';
import { videos, type VideoClip, type VideoComment } from '@/content/videos';
import { FeedSheet, type FeedPanelMode } from '@/components/videos/feed-sheet';
import { FeedSlide } from '@/components/videos/feed-slide';

interface FeedPanel {
  mode: FeedPanelMode;
  clip: VideoClip;
  index: number;
}

const LIKES_STORAGE_KEY = 'rizky-feed-likes-v1';
const WHEEL_QUIET_MS = 220;

export function Videos() {
  const feedRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const toastTimeout = useRef<number | null>(null);
  const wheelAccum = useRef(0);
  const wheelReset = useRef<number | null>(null);
  const wheelLock = useRef(false);
  const wheelLockTimer = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [likesReady, setLikesReady] = useState(false);
  const [shares, setShares] = useState<Record<string, number>>(() =>
    Object.fromEntries(videos.clips.map(clip => [clip.slug, clip.shares]))
  );
  const [comments, setComments] = useState<Record<string, VideoComment[]>>(() =>
    Object.fromEntries(videos.clips.map(clip => [clip.slug, clip.comments]))
  );
  const [panel, setPanel] = useState<FeedPanel | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const totalClips = videos.clips.length;
  const totalLabel = `${String(totalClips).padStart(2, '0')} clips`;
  const activeClip = videos.clips[activeIndex];

  useEffect(() => {
    const restored: Record<string, boolean> = {};

    try {
      const stored = window.localStorage.getItem(LIKES_STORAGE_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : null;
      if (parsed && typeof parsed === 'object') {
        for (const clip of videos.clips) {
          if ((parsed as Record<string, unknown>)[clip.slug] === true) {
            restored[clip.slug] = true;
          }
        }
      }
    } catch {
      // Ignore unavailable or malformed storage and keep the in-memory state.
    }

    setLiked(restored);
    setLikesReady(true);
  }, []);

  useEffect(() => {
    if (!likesReady) return;

    try {
      window.localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(liked));
    } catch {
      // Ignore unavailable storage.
    }
  }, [liked, likesReady]);

  useEffect(() => {
    const root = feedRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const nextIndex = Number((entry.target as HTMLElement).dataset.index);
          if (Number.isInteger(nextIndex)) setActiveIndex(nextIndex);
        }
      },
      { root, threshold: 0.55 }
    );

    for (const slide of slideRefs.current) {
      if (slide) observer.observe(slide);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const clipSlug = new URL(window.location.href).searchParams.get('clip');
    if (!clipSlug) return;

    const index = videos.clips.findIndex(clip => clip.slug === clipSlug);
    const root = feedRef.current;
    if (index < 0 || !root) return;

    const frame = window.requestAnimationFrame(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      root.scrollTo({
        top: index * root.clientHeight,
        behavior: reduced ? 'auto' : 'smooth',
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(
    () => () => {
      if (toastTimeout.current) window.clearTimeout(toastTimeout.current);
      if (wheelReset.current) window.clearTimeout(wheelReset.current);
      if (wheelLockTimer.current) window.clearTimeout(wheelLockTimer.current);
    },
    []
  );

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimeout.current) window.clearTimeout(toastTimeout.current);
    toastTimeout.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const root = feedRef.current;
      if (!root) return;
      const target = Math.max(0, Math.min(index, totalClips - 1));
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      root.scrollTo({
        top: target * root.clientHeight,
        behavior: reduced ? 'auto' : 'smooth',
      });
    },
    [totalClips]
  );

  useEffect(() => {
    const feed = feedRef.current;
    if (!feed) return;

    const releaseWheelLock = () => {
      if (wheelLockTimer.current) window.clearTimeout(wheelLockTimer.current);
      wheelLockTimer.current = window.setTimeout(() => {
        wheelLock.current = false;
        wheelAccum.current = 0;
      }, WHEEL_QUIET_MS);
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.deltaY === 0) return;

      // Normalize line/page wheel modes so one mouse notch behaves like a pixel wheel.
      const unit =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? 16
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? feed.clientHeight
            : 1;
      const delta = event.deltaY * unit;

      const atStart = activeIndex <= 0;
      const atEnd = activeIndex >= totalClips - 1;
      const leavingFeed = (delta > 0 && atEnd) || (delta < 0 && atStart);
      if (leavingFeed && !wheelLock.current) return;

      event.preventDefault();
      event.stopPropagation();

      // Absorb the inertia tail of one gesture before accepting the next one.
      if (wheelLock.current) {
        releaseWheelLock();
        return;
      }

      wheelAccum.current += delta;

      if (wheelReset.current) window.clearTimeout(wheelReset.current);
      wheelReset.current = window.setTimeout(() => {
        wheelAccum.current = 0;
      }, 140);

      if (Math.abs(wheelAccum.current) < 40) return;

      const direction = wheelAccum.current > 0 ? 1 : -1;
      wheelAccum.current = 0;
      wheelLock.current = true;
      goTo(activeIndex + direction);
      releaseWheelLock();
    };

    feed.addEventListener('wheel', handleWheel, { passive: false });
    return () => feed.removeEventListener('wheel', handleWheel);
  }, [activeIndex, goTo, totalClips]);

  function handleFeedKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;

    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      goTo(activeIndex + 1);
    } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      goTo(activeIndex - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      goTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      goTo(totalClips - 1);
    }
  }

  function toggleLike(slug: string) {
    setLiked(current => ({ ...current, [slug]: !current[slug] }));
  }

  function bumpShare(slug: string) {
    setShares(current => ({ ...current, [slug]: (current[slug] ?? 0) + 1 }));
  }

  async function shareClip(clip: VideoClip) {
    const shareUrl = getClipShareUrl(clip.slug, window.location.href);
    const payload = {
      title: `${clip.title} — Rizky Maulana`,
      text: clip.description,
      url: shareUrl,
    };

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share(payload);
        bumpShare(clip.slug);
        showToast('Clip shared.');
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    const copied = await copyTextToClipboard(shareUrl);
    if (copied) {
      bumpShare(clip.slug);
      showToast('Link copied to clipboard.');
    } else {
      showToast('Could not copy the link.');
    }
  }

  function addComment(slug: string, text: string) {
    const comment: VideoComment = {
      id: `${slug}-${Date.now()}`,
      author: 'You',
      meta: 'Now',
      text,
    };

    setComments(current => ({
      ...current,
      [slug]: [comment, ...(current[slug] ?? [])],
    }));
  }

  function openPanel(mode: FeedPanelMode, clip: VideoClip, index: number) {
    setToast(null);
    setPanel({ mode, clip, index });
  }

  return (
    <section
      id="videos"
      aria-labelledby="videos-heading"
      className="relative border-t border-[var(--color-border)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[820px] overflow-hidden"
      >
        <div className="absolute top-24 -left-[14%] h-[520px] w-[520px] rounded-full bg-[var(--color-blob-2)] opacity-35 blur-[160px]" />
        <div className="absolute top-[42%] -right-[12%] h-[440px] w-[440px] rounded-full bg-[var(--color-blob-1)] opacity-25 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 pt-20 pb-12 md:px-10 md:pt-28 md:pb-16 lg:px-16 lg:pt-32">
        <header className="grid gap-8 md:grid-cols-[minmax(0,1fr)_340px] md:items-end md:gap-12 lg:gap-20">
          <div>
            <p className="text-muted-foreground flex items-center gap-2.5 text-[10px] font-medium tracking-[0.26em] uppercase">
              <span aria-hidden="true" className="bg-foreground h-1 w-1 rounded-full" />
              {videos.eyebrow}
            </p>
            <h2
              id="videos-heading"
              className="font-display mt-5 text-[clamp(3.2rem,7vw,6.2rem)] leading-[0.87] font-normal tracking-[-0.03em]"
            >
              {videos.heading[0]}
              <br />
              <em className="italic">{videos.heading[1]}</em>
            </h2>
          </div>

          <div className="flex flex-col gap-5 md:items-end md:pb-2 md:text-right">
            <p className="text-muted-foreground max-w-[38ch] text-sm leading-relaxed">
              {videos.intro}
            </p>
            <p className="text-muted-foreground/70 text-[10px] tracking-[0.18em] uppercase">
              {totalLabel} · {videos.period}
            </p>
            <p className="text-muted-foreground/60 flex items-center gap-2 text-[10px] tracking-[0.12em] uppercase">
              <ArrowDown aria-hidden="true" className="h-3 w-3" strokeWidth={1.6} />
              {videos.scrollHint}
            </p>
          </div>
        </header>
      </div>

      <div className="relative border-y border-[var(--color-border)]">
        <p className="sr-only" aria-live="polite">
          {activeClip ? `Clip ${activeIndex + 1} of ${totalClips}: ${activeClip.title}` : undefined}
        </p>

        <div
          id="videos-feed"
          ref={feedRef}
          data-lenis-prevent
          role="region"
          aria-label="Vertical video feed"
          tabIndex={0}
          onKeyDown={handleFeedKeyDown}
          className="feed-viewport bg-surface focus-visible:ring-foreground/30 relative h-[100svh] min-h-[620px] [scroll-snap-type:y_mandatory] overflow-x-hidden overflow-y-auto focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
        >
          {videos.clips.map((clip, index) => (
            <div
              key={clip.slug}
              ref={node => {
                slideRefs.current[index] = node;
              }}
              data-index={index}
              data-active={activeIndex === index ? 'true' : 'false'}
              className="feed-slide h-full w-full"
            >
              <FeedSlide
                clip={clip}
                index={index}
                total={totalClips}
                handle={videos.handle}
                liked={Boolean(liked[clip.slug])}
                likeCount={clip.likes + (liked[clip.slug] ? 1 : 0)}
                commentCount={comments[clip.slug]?.length ?? 0}
                shareCount={shares[clip.slug] ?? clip.shares}
                onLike={() => toggleLike(clip.slug)}
                onComments={() => openPanel('comments', clip, index)}
                onShare={() => void shareClip(clip)}
                onCode={() => openPanel('code', clip, index)}
              />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-30">
          <div className="mx-auto max-w-[1280px] px-5 pt-[max(1rem,env(safe-area-inset-top))] md:px-10 md:pt-6 lg:px-16">
            <div className="flex items-center gap-4">
              <p className="text-foreground/70 shrink-0 text-[9px] font-medium tracking-[0.18em] uppercase">
                Rizky° <span className="text-foreground/35">/ Feed</span>
              </p>

              <div
                role="group"
                aria-label="Feed progress"
                className="pointer-events-auto flex min-w-0 flex-1 items-center gap-1"
              >
                {videos.clips.map((clip, index) => (
                  <button
                    key={clip.slug}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-label={`Go to clip ${index + 1}: ${clip.title}`}
                    aria-current={activeIndex === index ? 'step' : undefined}
                    className="group focus-visible:ring-foreground/35 flex h-6 min-w-0 flex-1 items-center rounded-sm focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <span
                      className={cn(
                        'h-[2px] w-full transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]',
                        activeIndex === index
                          ? 'bg-foreground/70'
                          : 'bg-foreground/15 group-hover:bg-foreground/35 group-focus-visible:bg-foreground/45'
                      )}
                    />
                  </button>
                ))}
              </div>

              <p className="text-foreground/60 shrink-0 text-[9px] font-medium tracking-[0.16em]">
                {formatClipIndex(activeIndex + 1)}
                <span aria-hidden="true" className="text-foreground/30">
                  {' '}
                  / {formatClipIndex(totalClips)}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 py-8 md:px-10 md:py-10 lg:px-16">
        <div className="flex flex-col gap-3 border-b border-[var(--color-border)] pb-6 md:flex-row md:items-center md:justify-between">
          <p className="text-muted-foreground flex items-center gap-2 text-[10px] font-medium tracking-[0.18em] uppercase">
            <span aria-hidden="true" className="bg-foreground/55 h-1 w-1 rounded-full" />
            End of feed · {totalLabel} · {videos.period}
          </p>
          <p className="text-muted-foreground/65 text-[10px] tracking-[0.12em] uppercase">
            New clips appear here as they’re posted.
          </p>
        </div>
      </div>

      <FeedSheet
        mode={panel?.mode ?? null}
        clip={panel?.clip ?? null}
        index={panel?.index ?? 0}
        total={totalClips}
        comments={panel ? (comments[panel.clip.slug] ?? []) : []}
        onClose={() => setPanel(null)}
        onAddComment={text => {
          if (panel) addComment(panel.clip.slug, text);
        }}
      />

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4"
      >
        {toast ? (
          <div className="bg-foreground text-background animate-overlay-in rounded-full px-4 py-2.5 text-xs tracking-[0.02em] shadow-[0_18px_50px_-20px_rgb(0_0_0/0.6)]">
            {toast}
          </div>
        ) : null}
      </div>
    </section>
  );
}
