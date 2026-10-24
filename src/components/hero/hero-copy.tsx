"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { hero } from "@/content/hero";

export function HeroCopy() {
  return (
    <div className={cn(
      "relative z-[3] flex flex-col items-center text-center px-6",
      "md:px-10 lg:px-16"
    )}>
      {/* Headline - two lines, second line italic */}
      <h1 className={cn(
        "font-display text-center text-balance leading-[0.95] tracking-[-0.02em]",
        "text-5xl md:text-6xl lg:text-7xl xl:text-8xl",
        "font-light"
      )}>
        <span className="block">{hero.headline[0]}</span>
        <span className="block italic">{hero.headline[1]}</span>
      </h1>

      {/* Subheadline */}
      <p className={cn(
        "mt-6 max-w-[600px] text-muted-foreground",
        "text-base md:text-lg leading-[1.55]",
        "font-normal"
      )}>
        {hero.subheadline}
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button size="default" asChild>
          <a href={hero.ctaPrimary.href}>
            {hero.ctaPrimary.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </Button>
        <Button variant="outline" size="default" asChild>
          <a href={hero.ctaSecondary.href} className="flex items-center gap-2">
            <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary">
              <Play className="h-3 w-3 text-primary-foreground ml-0.5" aria-hidden="true" />
            </span>
            {hero.ctaSecondary.label}
          </a>
        </Button>
      </div>
    </div>
  );
}