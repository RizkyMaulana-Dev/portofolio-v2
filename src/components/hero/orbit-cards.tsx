"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useTime } from "framer-motion";
import { cn } from "@/lib/utils";
import { OrbitCard as OrbitCardView } from "./orbit-card";
import { hero, type OrbitCard } from "@/content/hero";
import { computeCard, getCardCount, getOrbitConfig, type StageSize } from "@/lib/orbit";
import { useStageSize } from "@/lib/use-stage-size";
import { useSectionProgress } from "@/lib/use-section-progress";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

function AnimatedOrbitCard({
  card,
  i,
  containerRef,
}: {
  card: OrbitCard;
  i: number;
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const rotY = useMotionValue(0);
  const rotZ = useMotionValue(0);
  const opacity = useMotionValue(1);
  const blur = useMotionValue(0);

  const stageSize = useStageSize();
  const time = useTime();
  const smoothProgress = useSectionProgress(containerRef);

  const prefersReduced = usePrefersReducedMotion();

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cfg = getOrbitConfig(stageSize.width);
    // Mobile: bigger head (full width) puts the face lower, so drop the pivot
    const centerFactor = stageSize.width < 768 ? 0.8 : 0.66;
    cfg.centerY = stageSize.height * centerFactor;

    let lastFront: boolean | null = null;
    const apply = (res: ReturnType<typeof computeCard>) => {
      x.set(res.x);
      y.set(res.y);
      scale.set(res.scale);
      rotY.set(res.rotY);
      rotZ.set(res.rotZ);
      opacity.set(res.opacity);
      blur.set(res.blur);

      // Flip z-layer only when front/back changes (DESIGN.md §7: back z-2, front z-5)
      if (res.front !== lastFront && cardRef.current) {
        cardRef.current.style.zIndex = res.front ? "5" : "2";
        lastFront = res.front;
      }
    };

    // Reduced motion: one static pose, no animation loop. Same markup as the
    // animated version (a separate render branch breaks hydration when the
    // media query resolves during React's hydration pass).
    if (prefersReduced) {
      apply(computeCard(i, 0, 0, stageSize, cfg));
      return;
    }

    let raf: number;
    const update = () => {
      const p = smoothProgress.get();
      const t = time.get() / 1000;
      const size: StageSize = stageSize;
      apply(computeCard(i, p, t, size, cfg));
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [i, smoothProgress, time, stageSize, containerRef, prefersReduced]);

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "absolute left-0 top-0 will-change-transform z-[2]",
        // Center the card on its orbit point (mobile only; desktop keeps its tuned offset)
        "-translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0"
      )}
      style={{ x, y, scale, opacity, filter: blur }}
    >
      {/* perspective per-card (not on wrapper): keeps card z-index in the stage
          stacking context so front cards (z-5) really pass in front of the head (z-4) */}
      <div style={{ perspective: 1200 }}>
        <motion.div style={{ rotateY: rotY, rotateZ: rotZ }}>
          <OrbitCardView {...card} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function OrbitCards({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const stageSize = useStageSize();
  const cardCount = useMemo(() => getCardCount(stageSize.width), [stageSize.width]);

  const cardsToShow = hero.cards.slice(0, cardCount);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ height: "100%" }}
    >
      <div className="absolute inset-0">
        {cardsToShow.map((card, i) => (
          <AnimatedOrbitCard key={i} card={card} i={i} containerRef={containerRef as React.RefObject<HTMLElement>} />
        ))}
      </div>
    </div>
  );
}