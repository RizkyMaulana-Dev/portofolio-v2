"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTime } from "framer-motion";
import { cn } from "@/lib/utils";

export function AmbientBackground() {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden",
        "-z-[1]"
      )}
      aria-hidden="true"
    >
      <AmbientBlob />
      <OrbitRings />
      <Stars />
    </div>
  );
}

// Blob: slow drift + scale pulse
function AmbientBlob() {
  const time = useTime();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  useEffect(() => {
    let raf: number;
    const update = () => {
      const t = time.get() / 1000;
      x.set(Math.sin(t * 0.04) * 60 + Math.cos(t * 0.03) * 40);
      y.set(Math.cos(t * 0.05) * 70 + Math.sin(t * 0.02) * 35);
      scale.set(1 + Math.sin(t * 0.03) * 0.1);
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [time, x, y, scale]);

  return (
    <motion.div
      className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full",
        "blur-[50px]"
      )}
      style={{
        x,
        y,
        scale,
        background:
          "radial-gradient(circle, var(--color-ambient-1), var(--color-ambient-2) 45%, transparent 70%)",
      }}
      aria-hidden="true"
    />
  );
}

// Orbit rings: two thin ellipses, counter-rotating
function OrbitRings() {
  const time = useTime();
  const rotate1 = useMotionValue(0);
  const rotate2 = useMotionValue(0);

  useEffect(() => {
    let raf: number;
    const update = () => {
      const t = time.get() / 1000;
      rotate1.set(t * 0.25); // ~25s per rotation
      rotate2.set(t * -0.2); // ~31s per rotation, opposite
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [time, rotate1, rotate2]);

  return (
    <>
      <motion.div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[500px] h-[200px] border border-foreground/5 rounded-full rotate-[72deg]"
        )}
        style={{ rotate: rotate1 }}
        aria-hidden="true"
      />
      <motion.div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-[450px] h-[180px] border border-foreground/10 rounded-full rotate-[72deg]"
        )}
        style={{ rotate: rotate2 }}
        aria-hidden="true"
      />
    </>
  );
}

// Stars: slow rotation + pulse
function Stars() {
  const time = useTime();
  const rotate = useMotionValue(0);
  const scale = useMotionValue(1);

  useEffect(() => {
    let raf: number;
    const update = () => {
      const t = time.get() / 1000;
      rotate.set(t * 0.08); // ~12s per rotation
      scale.set(1 + Math.sin(t / 3) * 0.15);
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [time, scale, rotate]);

  const starPositions = [
    { top: "15%", left: "20%" },
    { top: "25%", left: "80%" },
    { top: "60%", left: "10%" },
    { top: "70%", left: "85%" },
    { top: "40%", left: "50%" },
  ];

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]"
      style={{ rotate, scale }}
      aria-hidden="true"
    >
      {starPositions.map((pos, i) => (
        <div
          key={i}
          className={cn(
            "absolute w-1.5 h-1.5 rounded-full",
            "bg-[var(--color-foreground)]/20"
          )}
          style={{ ...pos }}
          aria-hidden="true"
        />
      ))}
    </motion.div>
  );
}