"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTime } from "motion/react";
import { cn } from "@/lib/utils";
import { hero } from "@/content/hero";

export function StickerBadge() {
  const rotate = useMotionValue(0);
  const time = useTime();

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let raf: number;
    const update = () => {
      // 40 seconds per rotation = 2π/40 rad/s ≈ 0.157 rad/s
      rotate.set(time.get() / 1000 * 0.157);
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [rotate, time]);

  // Repeat text to fill circle
  const text = hero.sticker.repeat(3);

  return (
    <motion.div
      className={cn(
        "fixed z-[6] top-6 right-6 md:top-8 md:right-10 hidden lg:block",
        "w-[180px] h-[180px]"
      )}
      style={{ rotate }}
      aria-hidden="true"
    >
      <svg className="w-full h-full" viewBox="0 0 180 180">
        <defs>
          <path
            id="circlePath"
            d="M 90 90 m -75 0 a 75 75 0 1 1 150 0 a 75 75 0 1 1 -150 0"
          />
        </defs>
        <text
          className="text-xs text-muted-foreground/60"
          aria-hidden="true"
        >
          <textPath
            href="#circlePath"
            startOffset="50%"
            textAnchor="middle"
            style={{ textRendering: "optimizeLegibility" }}
          >
            {text}
          </textPath>
        </text>
        <text
          x="90"
          y="95"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-2xl text-muted-foreground/30"
          aria-hidden="true"
        >
          ✦
        </text>
      </svg>
    </motion.div>
  );
}
