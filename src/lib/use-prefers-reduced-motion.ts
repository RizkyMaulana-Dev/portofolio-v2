"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe reduced-motion preference.
 * Starts as `false` so the server and the first client render agree, then
 * updates from the media query after mount (hydration mismatch otherwise).
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return prefersReduced;
}
