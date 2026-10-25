import { useEffect } from "react";
import { useMotionValue, useSpring } from "framer-motion";

/**
 * Scroll progress of a section, measured from its own rect every frame.
 * SSR-safe and immune to ref-hydration timing issues that affect
 * framer-motion's `useScroll({ target: ref })` (which measures the document
 * if the ref is still null when its layout effect runs).
 *
 * p = 0 → section top aligns with viewport top
 * p = 1 → section bottom aligns with viewport bottom (sticky pin ends)
 */
export function useSectionProgress(ref: React.RefObject<HTMLElement | null>) {
  const progress = useMotionValue(0);
  const smooth = useSpring(progress, { stiffness: 90, damping: 22, mass: 0.6 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf: number;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      progress.set(p);
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [ref, progress]);

  return smooth;
}
