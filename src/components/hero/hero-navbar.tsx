"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { hero } from "@/content/hero";

export function HeroNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "absolute top-6 left-6 right-6 z-[7] flex items-center justify-between"
      )}
    >
      {/* Wordmark */}
      <a href="#hero" className="text-lg font-semibold text-foreground" aria-label={hero.brand}>
        {hero.brand}
      </a>

      {/* Desktop pill nav */}
      <nav
        className={cn(
          "hidden md:flex items-center gap-1",
          "rounded-full bg-white/60 backdrop-blur-md border border-[var(--color-card-border)] p-1",
          "shadow-[0_1px_2px_rgb(0_0_0/0.04)]"
        )}
        aria-label="Primary"
      >
        {hero.nav.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium text-foreground",
              "transition-colors hover:bg-white"
            )}
          >
            {item.label}
          </a>
        ))}
        <div className="w-px h-6 bg-border" aria-hidden="true" />
        <Button size="sm" className="ml-1" asChild>
          <a href={hero.navCta.href}>
            {hero.navCta.label}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </Button>
      </nav>

      {/* Mobile menu */}
      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "rounded-full p-2 bg-white/60 backdrop-blur border border-[var(--color-card-border)]",
                "hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </SheetTrigger>
          <SheetContent className="w-[300px] p-0">
            <div className="flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <span className="text-lg font-semibold">{hero.brand}</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full p-2 hover:bg-muted"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <nav className="flex flex-col gap-1 p-6 pt-4">
                {hero.nav.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="py-3 text-base font-medium text-foreground hover:text-muted-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="pt-4">
                  <Button className="w-full" asChild>
                    <a href={hero.navCta.href}>
                      {hero.navCta.label}
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </Button>
                </div>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}