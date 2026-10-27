"use client";

import { motion, useInView, useReducedMotion, type Transition } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const REVEAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface RevealOptions {
  delay?: number;
  distance?: number;
  amount?: number;
  margin?: string;
}

/**
 * Shared entrance motion for section content.
 *
 * Uses only opacity + transform so scrolling stays cheap. The `data-reveal`
 * attribute lets the no-script and reduced-motion CSS fallbacks restore the
 * content without waiting for hydration.
 */
export function useReveal({
  delay = 0,
  distance = 24,
  amount = 0.2,
  margin = "0px 0px -8% 0px",
}: RevealOptions = {}) {
  const reduceMotion = useReducedMotion() ?? false;

  const transition: Transition = {
    duration: reduceMotion ? 0.2 : 0.72,
    ease: REVEAL_EASE,
    delay: reduceMotion ? 0 : delay,
  };

  return {
    "data-reveal": "",
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: distance },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount, margin },
    transition,
  };
}

export function Reveal({
  children,
  className,
  delay = 0,
  distance = 24,
  amount = 0.2,
}: RevealOptions & { children: ReactNode; className?: string }) {
  const reveal = useReveal({ delay, distance, amount });

  return (
    <motion.div className={className} {...reveal}>
      {children}
    </motion.div>
  );
}

/**
 * Masked display-type line. The extra padding keeps serif descenders visible
 * while the inner span slides in from below the line box.
 */
export function RevealLine({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const lineRef = useRef<HTMLSpanElement>(null);
  // Observe the visible wrapper, not the translated inner span: the parent
  // clips the span before it enters, so observing the span itself would never
  // register an intersection.
  const inView = useInView(lineRef, {
    once: true,
    amount: 0.6,
    margin: "0px 0px -6% 0px",
  });

  const hidden = reduceMotion ? { opacity: 0 } : { y: "115%" };
  const shown = reduceMotion ? { opacity: 1 } : { y: "0%" };

  return (
    <span
      ref={lineRef}
      className={cn(
        "block overflow-hidden pt-[0.08em] pb-[0.12em] -mt-[0.08em] -mb-[0.12em]",
        className
      )}
    >
      <motion.span
        data-reveal=""
        className="block"
        initial={hidden}
        animate={inView ? shown : hidden}
        transition={{
          duration: reduceMotion ? 0.2 : 0.85,
          ease: REVEAL_EASE,
          delay: reduceMotion ? 0 : delay,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}
