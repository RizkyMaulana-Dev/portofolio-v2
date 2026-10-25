// Client-side hook for stage size - DESIGN.md §8.1
import { useState, useEffect, useCallback } from "react";

export interface StageSize {
  width: number;
  height: number;
}

export function useStageSize(): StageSize {
  // Keep the server and first client render identical (hydration), then
  // measure the real viewport in the effect below.
  const [size, setSize] = useState<StageSize>({ width: 1440, height: 900 });

  const handleResize = useCallback(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return size;
}