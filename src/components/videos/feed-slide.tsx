import type { ReactNode } from 'react';
import { Code2, Heart, MessageCircle, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatFeedCount } from '@/lib/feed';
import type { VideoClip } from '@/content/videos';
import { FeedArt } from '@/components/videos/feed-art';

interface FeedActionProps {
  label: string;
  ariaLabel: string;
  count?: number;
  pressed?: boolean;
  hasPopup?: 'dialog';
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}

function FeedAction({
  label,
  ariaLabel,
  count,
  pressed,
  hasPopup,
  active = false,
  onClick,
  children,
}: FeedActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      aria-haspopup={hasPopup}
      className="group focus-visible:ring-foreground/40 flex min-w-11 flex-col items-center gap-1.5 rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none"
    >
      <span
        className={cn(
          'border-foreground/10 bg-surface/80 text-foreground/75 group-hover:text-foreground flex h-11 w-11 items-center justify-center rounded-full border shadow-[0_12px_30px_-22px_rgb(0_0_0/0.5)] transition-[transform,background-color,border-color,color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-0.5 group-hover:bg-[var(--color-surface)] group-active:scale-95',
          active &&
            'border-rose/40 bg-rose/15 text-rose group-hover:bg-rose/20 group-hover:text-rose'
        )}
      >
        {children}
      </span>
      <span
        className={cn(
          'text-foreground/70 text-[9px] font-medium tracking-[0.12em] uppercase transition-colors duration-300',
          active && 'text-rose'
        )}
      >
        {count === undefined ? label : formatFeedCount(count)}
      </span>
    </button>
  );
}

interface FeedSlideProps {
  clip: VideoClip;
  index: number;
  total: number;
  handle: string;
  liked: boolean;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  onLike: () => void;
  onComments: () => void;
  onShare: () => void;
  onCode: () => void;
}

export function FeedSlide({
  clip,
  index,
  total,
  handle,
  liked,
  likeCount,
  commentCount,
  shareCount,
  onLike,
  onComments,
  onShare,
  onCode,
}: FeedSlideProps) {
  return (
    <article
      id={`clip-${clip.slug}`}
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}: ${clip.title}`}
      className="relative h-full w-full overflow-hidden"
    >
      <div className="feed-art absolute inset-0">
        <FeedArt entry={clip} />
      </div>

      <span
        aria-hidden="true"
        className="font-display text-foreground/[0.065] pointer-events-none absolute top-[14%] right-[-2%] text-[clamp(7rem,22vw,21rem)] leading-none whitespace-nowrap italic select-none"
      >
        {clip.mark}
      </span>

      <div
        aria-hidden="true"
        className="from-background via-background/65 pointer-events-none absolute inset-x-0 bottom-0 h-[66%] bg-gradient-to-t to-transparent md:h-[58%]"
      />

      <div className="relative z-10 flex h-full flex-col justify-end">
        <div className="mx-auto w-full max-w-[1280px] px-5 pb-[max(1.75rem,env(safe-area-inset-bottom))] md:px-10 md:pb-10 lg:px-16 lg:pb-12">
          <div className="flex items-end justify-between gap-5">
            <div className="max-w-[calc(100%_-_4.5rem)] min-w-0 sm:max-w-[34rem] lg:max-w-[45rem]">
              <div className="text-foreground/65 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[9px] font-medium tracking-[0.18em] uppercase">
                <span className="border-foreground/10 bg-surface/80 text-foreground/75 inline-flex items-center rounded-full border px-2.5 py-1">
                  {clip.category}
                </span>
                <span aria-hidden="true" className="text-foreground/30">
                  /
                </span>
                <span>{clip.date}</span>
              </div>

              <h3 className="font-display mt-4 text-[clamp(2.35rem,5.4vw,5.4rem)] leading-[0.89] tracking-[-0.03em] text-balance">
                {clip.title}
              </h3>

              <p className="text-muted-foreground mt-3 max-w-[44ch] text-[13px] leading-relaxed md:text-[15px]">
                {clip.description}
              </p>

              <div className="text-foreground/55 mt-4 flex items-center gap-2.5 text-[9px] font-medium tracking-[0.18em] uppercase">
                <span aria-hidden="true" className="bg-foreground/55 h-1 w-1 rounded-full" />
                <span>{handle}</span>
                <span aria-hidden="true" className="text-foreground/25">
                  /
                </span>
                <span>{clip.duration}</span>
              </div>
            </div>

            <div
              role="group"
              aria-label={`Actions for ${clip.title}`}
              className="flex shrink-0 flex-col items-center gap-2.5 md:gap-3"
            >
              <FeedAction
                label="Like"
                ariaLabel={liked ? `Unlike ${clip.title}` : `Like ${clip.title}`}
                count={likeCount}
                pressed={liked}
                active={liked}
                onClick={onLike}
              >
                <Heart
                  aria-hidden="true"
                  className={cn('h-[18px] w-[18px]', liked && 'fill-current')}
                  strokeWidth={1.6}
                />
              </FeedAction>

              <FeedAction
                label="Comment"
                ariaLabel={`Open comments for ${clip.title}`}
                count={commentCount}
                hasPopup="dialog"
                onClick={onComments}
              >
                <MessageCircle aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </FeedAction>

              <FeedAction
                label="Share"
                ariaLabel={`Share ${clip.title}`}
                count={shareCount}
                onClick={onShare}
              >
                <Share2 aria-hidden="true" className="h-[17px] w-[17px]" strokeWidth={1.6} />
              </FeedAction>

              <FeedAction
                label="Code"
                ariaLabel={`Open embed code for ${clip.title}`}
                hasPopup="dialog"
                onClick={onCode}
              >
                <Code2 aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </FeedAction>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
