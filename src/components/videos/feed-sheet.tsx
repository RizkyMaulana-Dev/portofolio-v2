'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, Check, Copy } from 'lucide-react';
import { copyTextToClipboard } from '@/lib/clipboard';
import { formatClipIndex, getClipEmbedCode } from '@/lib/feed';
import type { VideoClip, VideoComment } from '@/content/videos';
import { ACCENT_HEX } from '@/components/videos/feed-art';
import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetHeader,
  BottomSheetTitle,
} from '@/components/ui/bottom-sheet';

export type FeedPanelMode = 'comments' | 'code';

interface FeedSheetProps {
  mode: FeedPanelMode | null;
  clip: VideoClip | null;
  index: number;
  total: number;
  comments: VideoComment[];
  onClose: () => void;
  onAddComment: (text: string) => void;
}

export function FeedSheet({
  mode,
  clip,
  index,
  total,
  comments,
  onClose,
  onAddComment,
}: FeedSheetProps) {
  const [open, setOpen] = useState(Boolean(mode && clip));
  const [draft, setDraft] = useState('');
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const closeTimeout = useRef<number | null>(null);
  const copyTimeout = useRef<number | null>(null);
  const commentsRef = useRef<HTMLDivElement>(null);

  const embedCode = useMemo(() => {
    if (!clip) return '';
    const origin =
      typeof window === 'undefined' ? 'https://rizkymaulana.dev' : window.location.origin;
    return getClipEmbedCode(clip, origin);
  }, [clip]);

  useEffect(() => {
    setDraft('');
    setCopyState('idle');
  }, [clip?.slug, mode]);

  useEffect(() => {
    if (!mode || !clip) return;
    if (closeTimeout.current) {
      window.clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setOpen(true);
  }, [clip, mode]);

  useEffect(
    () => () => {
      if (copyTimeout.current) window.clearTimeout(copyTimeout.current);
      if (closeTimeout.current) window.clearTimeout(closeTimeout.current);
    },
    []
  );

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      if (closeTimeout.current) window.clearTimeout(closeTimeout.current);
      setOpen(true);
      return;
    }

    setOpen(false);
    if (closeTimeout.current) window.clearTimeout(closeTimeout.current);
    closeTimeout.current = window.setTimeout(onClose, 300);
  }

  function submitComment() {
    const next = draft.trim();
    if (!next) return;
    onAddComment(next);
    setDraft('');
    commentsRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleCopy() {
    if (!clip) return;
    const didCopy = await copyTextToClipboard(embedCode);
    setCopyState(didCopy ? 'copied' : 'error');

    if (copyTimeout.current) window.clearTimeout(copyTimeout.current);
    copyTimeout.current = window.setTimeout(() => setCopyState('idle'), 2400);
  }

  if (!clip || !mode) return null;

  const accent = ACCENT_HEX[clip.accent];
  const clipLabel = `${formatClipIndex(index + 1)} / ${formatClipIndex(total)}`;

  return (
    <BottomSheet open={open} onOpenChange={handleOpenChange}>
      <BottomSheetContent
        className={mode === 'comments' ? 'h-[min(82svh,680px)]' : undefined}
        aria-describedby="feed-sheet-description"
      >
        <BottomSheetHeader className="shrink-0 border-b border-[var(--color-border)] px-5 pt-6 pr-16 pb-5 sm:px-7 sm:pt-7">
          <p className="text-muted-foreground flex items-center gap-2 text-[9px] font-medium tracking-[0.2em] uppercase">
            <span aria-hidden="true" className="bg-foreground h-1 w-1 rounded-full" />
            {mode === 'comments' ? 'Clip conversation' : 'Clip embed'}
            <span aria-hidden="true" className="text-muted-foreground/30">
              /
            </span>
            {clipLabel}
          </p>

          <BottomSheetTitle className="mt-3">
            {mode === 'comments' ? 'Comments' : 'Embed this clip.'}
          </BottomSheetTitle>

          <BottomSheetDescription id="feed-sheet-description" className="mt-2 max-w-[48ch]">
            {mode === 'comments' ? (
              <>
                <span aria-live="polite">
                  {comments.length} {comments.length === 1 ? 'response' : 'responses'}
                </span>{' '}
                on <span className="text-foreground">“{clip.title}”</span>. Keep it kind.
              </>
            ) : (
              <>
                Copy the iframe and paste it into any HTML page. The clip opens in a clean,
                self-contained view.
              </>
            )}
          </BottomSheetDescription>
        </BottomSheetHeader>

        {mode === 'comments' ? (
          <>
            <div
              ref={commentsRef}
              className="feed-sheet-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain border-b border-[var(--color-border)] px-5 sm:px-7"
            >
              {comments.length === 0 ? (
                <div className="flex h-full min-h-40 flex-col items-start justify-center gap-2 py-8">
                  <p className="font-display text-foreground text-2xl">No comments yet.</p>
                  <p className="text-muted-foreground max-w-[32ch] text-sm leading-relaxed">
                    Start the conversation with a note about this clip.
                  </p>
                </div>
              ) : (
                <ul aria-label={`Comments on ${clip.title}`}>
                  {comments.map(comment => (
                    <li
                      key={comment.id}
                      className="flex gap-3 border-b border-[var(--color-border)] py-5 last:border-b-0"
                    >
                      <span
                        aria-hidden="true"
                        className="text-foreground/80 font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base italic"
                        style={{ backgroundColor: `${accent}66` }}
                      >
                        {comment.author.slice(0, 1)}
                      </span>
                      <div className="min-w-0">
                        <p className="text-muted-foreground text-[11px] tracking-[0.02em]">
                          <span className="text-foreground font-medium">{comment.author}</span>
                          <span aria-hidden="true"> · </span>
                          {comment.meta}
                        </p>
                        <p className="text-foreground/80 mt-1.5 text-sm leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <form
              onSubmit={event => {
                event.preventDefault();
                submitComment();
              }}
              className="shrink-0 px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-7 sm:pt-5"
            >
              <label htmlFor="feed-comment-input" className="sr-only">
                Add a comment
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="feed-comment-input"
                  name="comment"
                  type="text"
                  value={draft}
                  onChange={event => setDraft(event.target.value)}
                  placeholder="Add a comment..."
                  autoComplete="off"
                  className="bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-foreground/30 focus-visible:ring-foreground/15 h-11 min-w-0 flex-1 rounded-full border border-[var(--color-border)] px-4 text-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  aria-label="Post comment"
                  className="bg-foreground text-background focus-visible:ring-foreground/40 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:opacity-85 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-25"
                >
                  <ArrowUp aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="feed-sheet-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-5 pb-5 sm:px-7 sm:pt-6">
              <div className="text-muted-foreground grid gap-2 text-[11px] leading-relaxed sm:grid-cols-3 sm:gap-3">
                {[
                  ['01', 'Copy the snippet below.'],
                  ['02', 'Paste it into your HTML.'],
                  ['03', 'Set the width and height.'],
                ].map(([step, copy]) => (
                  <div
                    key={step}
                    className="bg-background/55 flex gap-2.5 rounded-xl border border-[var(--color-border)] p-3"
                  >
                    <span className="text-foreground/45 font-mono text-[9px] tracking-[0.12em]">
                      {step}
                    </span>
                    <span>{copy}</span>
                  </div>
                ))}
              </div>

              <div className="bg-foreground text-background mt-5 overflow-hidden rounded-[20px]">
                <div className="border-background/15 flex items-center justify-between gap-4 border-b px-4 py-3">
                  <span className="text-background/60 font-mono text-[9px] tracking-[0.18em] uppercase">
                    Embed / HTML
                  </span>
                  <span className="text-background/45 font-mono text-[9px] tracking-[0.12em]">
                    390 × 700
                  </span>
                </div>

                <pre className="text-background/90 overflow-x-auto px-4 py-4 font-mono text-[10.5px] leading-[1.7] whitespace-pre sm:text-[11px]">
                  <code>{embedCode}</code>
                </pre>
              </div>

              <p className="text-muted-foreground/70 mt-4 max-w-[56ch] text-[11px] leading-relaxed">
                {clip.title} · {clip.category} · {clip.duration}. The embed opens a clip-only view
                with the artwork and caption.
              </p>
            </div>

            <div className="shrink-0 border-t border-[var(--color-border)] px-5 pt-3.5 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-7">
              <button
                type="button"
                onClick={() => void handleCopy()}
                aria-label="Copy embed code"
                className="bg-foreground text-background focus-visible:ring-foreground/40 flex h-11 w-full items-center justify-center gap-2 rounded-full text-[10px] font-medium tracking-[0.14em] uppercase transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:opacity-85 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.99]"
              >
                {copyState === 'copied' ? (
                  <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
                ) : (
                  <Copy aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.7} />
                )}
                <span aria-live="polite">
                  {copyState === 'copied'
                    ? 'Copied'
                    : copyState === 'error'
                      ? 'Copy failed'
                      : 'Copy embed code'}
                </span>
              </button>
            </div>
          </>
        )}
      </BottomSheetContent>
    </BottomSheet>
  );
}
