"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, useMotionValue, useSpring, useTime, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import { OrbitCard as OrbitCardView } from "./orbit-card";
import { hero, type OrbitCard } from "@/content/hero";
import { computeCard, getCardCount, getOrbitConfig, type StageSize } from "@/lib/orbit";
import { useStageSize } from "@/lib/use-stage-size";

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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.6 });

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReduced || !containerRef.current) return;

    const cfg = getOrbitConfig(stageSize.width);
    cfg.centerY = stageSize.height * 0.66;

    let lastFront: boolean | null = null;
    let raf: number;
    const update = () => {
      const p = smoothProgress.get();
      const t = time.get() / 1000;
      const size: StageSize = stageSize;
      const res = computeCard(i, p, t, size, cfg);

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

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [i, smoothProgress, time, stageSize, containerRef, prefersReduced]);

  if (prefersReduced) {
    return (
      <motion.div
        className={cn(
          "absolute left-1/2 top-[66%] -translate-x-1/2 -translate-y-1/2",
          "w-[clamp(9.5rem,15vw,14rem)]"
        )}
        style={{ opacity: 1 }}
      >
        <OrbitCardView {...card} />
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "absolute left-0 top-0 will-change-transform z-[2]"
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
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const cardsToShow = prefersReduced
    ? hero.cards.slice(0, 6)
    : hero.cards.slice(0, cardCount);

  return (
    <div
      ref={containerRef as React.Ref<HTMLDivElement>}
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