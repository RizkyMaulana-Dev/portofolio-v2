"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, ArrowUpRight } from "lucide-react";
import type { HeroContent } from "@/content/hero";

const MENU_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const menuList: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.055, delayChildren: 0.1 },
  },
};

const menuItem: Variants = {
  hidden: { opacity: 0, x: 18 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, ease: MENU_EASE },
  },
};

export function HeroNavbar({ content }: { content: HeroContent }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "absolute top-6 left-6 right-6 z-[7] flex items-center justify-between"
      )}
    >
      {/* Wordmark */}
      <a href="#hero" className="text-lg font-semibold text-foreground" aria-label={content.brand}>
        {content.brand}
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
        {content.nav.map((item, index) => (
          <a
            key={`${item.label}-${index}`}
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
          <a href={content.navCta.href}>
            {content.navCta.label}
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

          <SheetContent
            showClose={false}
            className="w-[300px] max-w-[85vw] border-0 bg-transparent p-0 shadow-none"
          >
            <SheetTitle className="sr-only">Menu</SheetTitle>

            {/* The whole panel is draggable: swipe right to dismiss. */}
            <motion.div
              className="flex h-full w-full flex-col bg-background shadow-xl"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0, right: 0.55 }}
              dragDirectionLock
              onDragEnd={(_, info) => {
                if (info.offset.x > 90 || info.velocity.x > 550) {
                  setMobileOpen(false);
                }
              }}
            >
              <div className="flex justify-center pt-3" aria-hidden="true">
                <span className="h-1 w-10 rounded-full bg-foreground/15" />
              </div>

              <div className="flex items-center justify-between p-6 pt-3 border-b border-border">
                <span className="text-lg font-semibold">{content.brand}</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-full p-2 hover:bg-muted transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  )}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <motion.nav
                className="flex flex-col gap-1 p-6 pt-4"
                variants={menuList}
                initial="hidden"
                animate="show"
              >
                {content.nav.map((item, index) => (
                  <motion.a
                    key={`${item.label}-${index}`}
                    variants={menuItem}
                    href={item.href}
                    className="py-3 text-base font-medium text-foreground hover:text-muted-foreground"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </motion.a>
                ))}
                <motion.div variants={menuItem} className="pt-4">
                  <Button className="w-full" asChild>
                    <a href={content.navCta.href} onClick={() => setMobileOpen(false)}>
                      {content.navCta.label}
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </Button>
                </motion.div>
              </motion.nav>
            </motion.div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
