"use client";

import { cn } from "@/lib/utils";

export function HeroHeadPlaceholder() {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-[1/1.2] w-[45%] md:w-[34%] min-w-[200px] max-w-[420px]",
        "bg-gradient-to-br from-black/15 to-black/5 rounded-[45%]"
      )}
      aria-hidden="true"
    >
      <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground/60 whitespace-nowrap">
        Ganti dengan hero-head.png
      </p>
    </div>
  );
}

// ponytail: hasImage toggled manually; switch to <img src> / astro:assets when file added
const hasImage = true;

export function HeroHead() {
  return hasImage ? (
    <img
      src="/images/hero-head.png"
      alt=""
      className="relative z-[4] mx-auto w-[65%] md:w-[52%] min-w-[240px] max-w-[600px] object-contain pointer-events-none"
      aria-hidden="true"
    />
  ) : (
    <HeroHeadPlaceholder />
  );
}