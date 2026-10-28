import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

type SectionPatternEdge = 'left' | 'right';
type SectionPatternVariant = 'grid' | 'dots' | 'hatch';

const PATTERNS: Record<SectionPatternVariant, CSSProperties> = {
  grid: {
    backgroundImage:
      'linear-gradient(to right, rgb(17 17 17 / 0.055) 1px, transparent 1px), linear-gradient(to bottom, rgb(17 17 17 / 0.055) 1px, transparent 1px)',
    backgroundSize: '34px 34px',
  },
  dots: {
    backgroundImage: 'radial-gradient(circle, rgb(17 17 17 / 0.12) 1px, transparent 1.2px)',
    backgroundSize: '19px 19px',
  },
  hatch: {
    backgroundImage:
      'repeating-linear-gradient(135deg, rgb(17 17 17 / 0.055) 0 1px, transparent 1px 10px)',
  },
};

const HORIZONTAL_FADE: Record<SectionPatternEdge, string> = {
  left: 'linear-gradient(to right, #000 0%, rgb(0 0 0 / 0.68) 36%, transparent 100%)',
  right: 'linear-gradient(to left, #000 0%, rgb(0 0 0 / 0.68) 36%, transparent 100%)',
};

const VERTICAL_FADE =
  'linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)';

/** Quiet perimeter texture for section margins, kept behind the content. */
export function SectionPattern({
  edge = 'left',
  variant = 'grid',
  className,
}: {
  edge?: SectionPatternEdge;
  variant?: SectionPatternVariant;
  className?: string;
}) {
  const isLeft = edge === 'left';

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-y-0 z-0 w-[clamp(7.5rem,24vw,22rem)] overflow-hidden select-none',
        isLeft ? 'left-0' : 'right-0',
        className
      )}
      style={{ maskImage: VERTICAL_FADE, WebkitMaskImage: VERTICAL_FADE }}
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{
          ...PATTERNS[variant],
          maskImage: HORIZONTAL_FADE[edge],
          WebkitMaskImage: HORIZONTAL_FADE[edge],
        }}
      />

      <span
        aria-hidden="true"
        className={cn(
          'bg-foreground/[0.055] absolute inset-y-10 w-px md:inset-y-12',
          isLeft ? 'left-4 md:left-7' : 'right-4 md:right-7'
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          'bg-foreground/[0.08] absolute top-10 h-px w-3 md:top-12',
          isLeft ? 'left-4 md:left-7' : 'right-4 md:right-7'
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          'bg-foreground/[0.08] absolute bottom-10 h-px w-3 md:bottom-12',
          isLeft ? 'left-4 md:left-7' : 'right-4 md:right-7'
        )}
      />
    </div>
  );
}
