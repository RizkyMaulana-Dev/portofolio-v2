// Client-side hook for stage size - DESIGN.md §8.1
import { useState, useEffect, useCallback } from "react";

export interface StageSize {
  width: number;
  height: number;
}

export function useStageSize(): StageSize {
  const [size, setSize] = useState<StageSize>({
    width: typeof window !== "undefined" ? window.innerWidth : 1440,
    height: typeof window !== "undefined" ? window.innerHeight : 900,
  });

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