"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTime } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { hero } from "@/content/hero";
import { useSectionProgress } from "@/lib/use-section-progress";

export function SideNotes({ heroRef }: { heroRef: React.RefObject<HTMLElement | null> }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  if (isMobile) return null;

  return (
    <>
      <LeftNote heroRef={heroRef} />
      <RightNote heroRef={heroRef} />
    </>
  );
}

function LeftNote({ heroRef }: { heroRef: React.RefObject<HTMLElement | null> }) {
  const smooth = useSectionProgress(heroRef);
  const time = useTime();
  const y = useMotionValue(0);
  const x = useMotionValue(0);
  const rotate = useMotionValue(-3);
  const opacity = useMotionValue(0);
  const scale = useMotionValue(0.9);

  useEffect(() => {
    let raf: number;
    const stageHeight = window.innerHeight;
    const update = () => {
      const p = smooth.get();
      const t = time.get() / 1000;

      // Main card movement
      const scrollY = p * stageHeight * 0.05;
      const ambient = Math.sin(t / 7) * stageHeight * 0.015;
      const ambientX = Math.sin(t / 8 + 0.5) * 8;
      const ambientRotate = Math.sin(t / 6) * 1.5;

      y.set(scrollY + ambient);
      x.set(ambientX);
      rotate.set(-3 + ambientRotate);

      // Entrance animation (first 15% of scroll)
      if (p < 0.15) {
        opacity.set(p / 0.15);
        scale.set(0.9 + (p / 0.15) * 0.1);
      } else {
        opacity.set(1);
        scale.set(1);
      }

      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [smooth, y, x, rotate, opacity, scale, time]);

  const { title, caption } = hero.sideNotes[0];

  return (
    <motion.div
      className={cn(
        "fixed z-[6] hidden lg:block",
        "top-24 left-6 xl:left-8",
        "w-[320px] rounded-[28px]",
        "bg-white/80 backdrop-blur border border-[var(--color-card-border)]",
        "p-6 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.10)]",
        "-rotate-3"
      )}
      style={{ x, y, rotate, opacity, scale }}
      aria-hidden="true"
    >
      <div className="mb-3 flex h-5 w-5 items-center justify-center rounded-full bg-violet">
        <div className="h-2.5 w-2.5 rounded-full bg-white" />
      </div>
      <p className="text-sm font-medium text-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground">{caption}</p>
    </motion.div>
  );
}

function RightNote({ heroRef }: { heroRef: React.RefObject<HTMLElement | null> }) {
  const smooth = useSectionProgress(heroRef);
  const time = useTime();
  const y = useMotionValue(0);
  const x = useMotionValue(0);
  const rotate = useMotionValue(3);
  const opacity = useMotionValue(0);
  const scale = useMotionValue(0.9);

  useEffect(() => {
    let raf: number;
    const stageHeight = window.innerHeight;
    const update = () => {
      const p = smooth.get();
      const t = time.get() / 1000;

      const scrollY = p * stageHeight * 0.05;
      const ambient = Math.sin(t / 7 + 1) * stageHeight * 0.015;
      const ambientX = Math.sin(t / 8 + 1.5) * 8;
      const ambientRotate = Math.sin(t / 6 + 1) * 1.5;

      y.set(scrollY + ambient);
      x.set(ambientX);
      rotate.set(3 + ambientRotate);

      // Entrance animation (first 20% of scroll, slightly delayed)
      if (p < 0.2) {
        opacity.set(p / 0.2);
        scale.set(0.9 + (p / 0.2) * 0.1);
      } else {
        opacity.set(1);
        scale.set(1);
      }

      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [smooth, y, x, rotate, opacity, scale, time]);

  const { title, caption } = hero.sideNotes[1];

  return (
    <motion.div
      className={cn(
        "fixed z-[6] hidden lg:block",
        "top-32 right-6 xl:right-8",
        "w-[320px] rounded-[28px]",
        "bg-white/80 backdrop-blur border border-[var(--color-card-border)]",
        "p-6 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.10)]",
        "rotate-3"
      )}
      style={{ x, y, rotate, opacity, scale }}
      aria-hidden="true"
    >
      {/* Avatar group */}
      <div className="flex items-center -space-x-3 mb-3">
        {["A", "B", "C"].map((initial, idx) => (
          <Avatar key={idx} className="h-8 w-8 border-2 border-white">
            <AvatarFallback
              className="text-xs font-medium"
              style={{ backgroundColor: idx === 0 ? "var(--color-sky)" : idx === 1 ? "var(--color-lime)" : "var(--color-rose)" }}
            >
              {initial}
            </AvatarFallback>
          </Avatar>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 rounded-full"
          aria-label="Add"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <p className="text-sm font-medium text-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground">{caption}</p>
    </motion.div>
  );
}