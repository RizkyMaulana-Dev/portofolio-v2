import { cn } from '@/lib/utils';
import type { VideoAccent, VideoEntry } from '@/content/videos';

const FILL: Record<VideoAccent, string> = {
  sun: 'bg-sun/80',
  rose: 'bg-rose/80',
  sky: 'bg-sky/80',
  violet: 'bg-violet/80',
  lime: 'bg-lime/80',
};

export const ACCENT_HEX: Record<VideoAccent, string> = {
  sun: '#FFD36B',
  rose: '#FF9FC0',
  sky: '#8FD3FF',
  violet: '#B9A2FF',
  lime: '#D7F56B',
};

const GRID_STYLE = {
  backgroundImage:
    'linear-gradient(to right, var(--color-pattern-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--color-pattern-grid) 1px, transparent 1px)',
  backgroundSize: '40px 40px',
};

const SCANLINE_STYLE = {
  backgroundImage:
    'repeating-linear-gradient(to bottom, var(--color-pattern-scan) 0px, var(--color-pattern-scan) 1px, transparent 1px, transparent 5px)',
};

function VideoArt({ entry }: { entry: VideoEntry }) {
  const fill = FILL[entry.accent];

  if (entry.visual === 'horizon') {
    return (
      <div aria-hidden="true" className="relative h-[58%] w-[78%]">
        <span
          className={cn(
            'absolute top-[6%] left-1/2 aspect-square w-[54%] -translate-x-1/2 rounded-full shadow-[0_28px_80px_-32px_rgb(0_0_0/0.38)]',
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

export function FeedArt({ entry }: { entry: VideoEntry }) {
  const accent = ACCENT_HEX[entry.accent];

  return (
    <div aria-hidden="true" className="bg-surface absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={GRID_STYLE} />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 16% 8%, ${accent}c4 0%, ${accent}38 32%, transparent 68%), radial-gradient(circle at 92% 92%, ${accent}9e 0%, transparent 56%)`,
        }}
      />

      <div className="border-foreground/10 absolute top-1/2 left-1/2 aspect-square w-[min(78vw,620px)] -translate-x-1/2 -translate-y-1/2 rounded-full border" />
      <div className="border-foreground/[0.07] absolute top-1/2 left-1/2 aspect-square w-[min(56vw,430px)] -translate-x-1/2 -translate-y-1/2 rounded-full border" />
      <span className="bg-foreground/45 absolute top-[17%] right-[20%] h-1.5 w-1.5 rounded-full" />
      <span className="bg-foreground/25 absolute bottom-[22%] left-[17%] h-1 w-1 rounded-full" />

      <div className="absolute inset-0 flex items-center justify-center pb-[8%] md:pb-0">
        <div className="flex h-[min(64svh,640px)] w-[min(84vw,640px)] items-center justify-center">
          <VideoArt entry={entry} />
        </div>
      </div>

      <div className="absolute inset-0 opacity-30" style={SCANLINE_STYLE} />
      <div className="from-background/10 to-background/25 absolute inset-0 bg-gradient-to-b via-transparent" />
      <div className="absolute inset-0 bg-[var(--color-art-veil)]" />
    </div>
  );
}
