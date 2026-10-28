"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import type { HeroContent } from "@/content/hero";

export function HeroCopy({ content }: { content: HeroContent }) {
  return (
    <div className={cn(
      "relative z-[6] flex flex-col items-center text-center px-6",
      "md:px-10 lg:px-16"
    )}>
      {/* Headline - two lines, second line italic */}
      <h1 className={cn(
        "font-display text-center text-balance leading-[0.95] tracking-[-0.02em]",
        "text-5xl md:text-6xl lg:text-7xl xl:text-8xl",
        "max-[359px]:text-[2.6rem]",
        "font-light"
      )}>
        <span className="block">{content.headline[0]}</span>
        <span className="block italic">{content.headline[1]}</span>
      </h1>

      {/* Subheadline */}
      <p className={cn(
        "mt-6 max-w-[600px] text-muted-foreground",
        "max-[359px]:mt-5",
        "text-base md:text-lg leading-[1.55]",
        "font-normal"
      )}>
        {content.subheadline}
      </p>

      {/* CTA Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-[359px]:mt-7">
        <Button size="default" asChild>
          <a href={content.ctaPrimary.href}>
            {content.ctaPrimary.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </Button>
        <Button variant="outline" size="default" asChild>
          <a href={content.ctaSecondary.href} className="flex items-center gap-2">
            <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary">
              <Play className="h-3 w-3 text-primary-foreground ml-0.5" aria-hidden="true" />
            </span>
            {content.ctaSecondary.label}
          </a>
        </Button>
      </div>
    </div>
  );
}