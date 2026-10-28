"use client";

import { cn } from "@/lib/utils";
import { withBase } from "@/lib/paths";

export function HeroHeadPlaceholder() {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-[1/1.2] w-[45%] md:w-[34%] min-w-[200px] max-w-[420px]",
        "bg-gradient-to-br from-foreground/15 to-foreground/5 rounded-[45%]"
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
      src={withBase("/images/hero-head.png")}
      alt=""
      className="relative z-[4] -mx-6 w-[calc(100%_+_3rem)] max-w-none md:mx-auto md:w-[52%] md:max-w-[600px] min-w-[240px] object-contain pointer-events-none"
      aria-hidden="true"
    />
  ) : (
    <HeroHeadPlaceholder />
  );
}