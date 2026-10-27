"use client";

import { useCallback, useState } from "react";
import type { SiteContent } from "@/lib/site-content";

export type AdminView = "overview" | keyof SiteContent;

export interface SectionEditorProps<T> {
  value: T;
  onSave: (value: T) => boolean;
  onReset: () => void;
}

export function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function useSectionDraft<T>(initial: T) {
  const [draft, setDraft] = useState<T>(() => cloneValue(initial));
  const [savedState, setSavedState] = useState(() => JSON.stringify(initial));

  const isDirty = JSON.stringify(draft) !== savedState;

  const markSaved = useCallback(() => {
    setSavedState(JSON.stringify(draft));
  }, [draft]);

  return { draft, setDraft, isDirty, markSaved };
}
