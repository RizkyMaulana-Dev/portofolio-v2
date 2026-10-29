"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clearRemoteDraft, saveRemoteDraft } from "@/lib/content-api";
import {
  clearLocalDraft,
  readLocalDraft,
  writeLocalDraft,
} from "@/lib/content-drafts";
import type { SiteContent, SiteSection } from "@/lib/site-content";

export type AdminView = "overview" | "media" | keyof SiteContent;

export interface SectionEditorProps<T> {
  section: SiteSection;
  value: T;
  onSave: (value: T) => Promise<boolean>;
  onReset: () => void | Promise<void>;
}

export function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function useSectionDraft<T>(
  section: SiteSection,
  initial: T,
  onSave: (value: T) => Promise<boolean>
) {
  const [restored] = useState(() => readLocalDraft<T>(section));
  const [draft, setDraft] = useState<T>(() =>
    restored ? cloneValue(restored.value) : cloneValue(initial)
  );
  const [savedState, setSavedState] = useState(() => JSON.stringify(initial));
  const [restoredAt, setRestoredAt] = useState<number | null>(
    restored?.updatedAt ?? null
  );
  const [isSaving, setIsSaving] = useState(false);
  const draftRef = useRef(draft);
  const isDirty = JSON.stringify(draft) !== savedState;
  const dirtyRef = useRef(isDirty);

  draftRef.current = draft;
  dirtyRef.current = isDirty;

  useEffect(() => {
    if (!isDirty) return;
    writeLocalDraft(section, draft);
  }, [draft, isDirty, section]);

  useEffect(() => {
    if (!isDirty) return;

    const timeout = window.setTimeout(() => {
      void saveRemoteDraft(section, draft);
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [draft, isDirty, section]);

  useEffect(() => {
    const flush = () => {
      if (dirtyRef.current) writeLocalDraft(section, draftRef.current);
    };

    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);

    return () => {
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("beforeunload", flush);
    };
  }, [section]);

  const save = useCallback(async () => {
    setIsSaving(true);

    try {
      const saved = await onSave(draft);
      if (saved) {
        setSavedState(JSON.stringify(draft));
        setRestoredAt(null);
        clearLocalDraft(section);
        void clearRemoteDraft(section);
      }
      return saved;
    } finally {
      setIsSaving(false);
    }
  }, [draft, onSave, section]);

  const discardDraft = useCallback(() => {
    setDraft(cloneValue(initial));
    setSavedState(JSON.stringify(initial));
    setRestoredAt(null);
    clearLocalDraft(section);
    void clearRemoteDraft(section);
  }, [initial, section]);

  return {
    draft,
    setDraft,
    isDirty,
    isSaving,
    restoredAt,
    save,
    discardDraft,
  };
}
