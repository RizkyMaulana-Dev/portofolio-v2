"use client";

import { useRef } from "react";
import { useSiteContent } from "@/lib/site-content";
import { HeroNavbar } from "./hero-navbar";
import { HeroCopy } from "./hero-copy";
import { HeroHead } from "./hero-head";
import { OrbitCards } from "./orbit-cards";
import { AmbientBackground } from "./ambient-background";
import { SectionPattern } from "@/components/ui/section-pattern";
import { SideNotes } from "./side-notes";
import { TrustBadge } from "./trust-badge";
import { CornerTagline } from "./corner-tagline";
import { StickerBadge } from "./sticker-badge";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { hero } = useSiteContent();

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative"
      style={{ height: "200vh" }}
      aria-label="Hero"
    >
      <div
        className="relative sticky top-0 h-svh overflow-hidden flex flex-col"
        style={{ willChange: "transform" }}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-[var(--color-background)]" aria-hidden="true" />
        <AmbientBackground />
        <SectionPattern edge="left" variant="grid" className="opacity-50" />

        {/* Navbar */}
        <HeroNavbar content={hero} />

        {/* Main content area - flex column to push head to bottom */}
        <div className="flex-1 flex flex-col items-center justify-between px-6 md:px-10 lg:px-16 pb-0 gap-4 mt-[92px] max-[359px]:mt-20 md:mt-[96px]">
          <HeroCopy content={hero} />
          <HeroHead />
        </div>

        {/* Orbit cards - positioned around head */}
        <OrbitCards containerRef={heroRef} cards={hero.cards} />

        {/* Fixed positioned elements */}
        <SideNotes heroRef={heroRef} notes={hero.sideNotes} />
        <TrustBadge trust={hero.trust} />
        <CornerTagline tagline={hero.tagline} />
        <StickerBadge sticker={hero.sticker} />
      </div>
    </section>
  );
}