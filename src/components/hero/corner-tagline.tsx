"use client";

import { cn } from "@/lib/utils";

export function CornerTagline({ tagline }: { tagline: string[] }) {
  return (
    <div
      className={cn(
        "fixed z-[6] bottom-6 right-6 md:bottom-8 md:right-10",
        "flex flex-col items-end gap-2 text-right"
      )}
      aria-hidden="false"
    >
      <div className="flex items-center justify-end gap-2">
        <span className="text-lg text-muted-foreground" aria-hidden="true">✦</span>
        <span className="text-sm font-medium text-muted-foreground">
          {tagline[0]}
        </span>
      </div>
      <div className="flex items-center justify-end gap-2">
        <span className="text-lg text-muted-foreground" aria-hidden="true">✦</span>
        <span className="text-sm font-medium text-muted-foreground">
          {tagline[1]}
        </span>
      </div>
    </div>
  );
}