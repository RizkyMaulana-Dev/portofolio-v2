import type { RemoteDraft } from '@/lib/content-api';
import type { SiteSection } from '@/lib/site-content';

const DRAFT_KEY_PREFIX = 'rizky-portfolio-draft-v1:';
const SECTIONS: SiteSection[] = ['hero', 'about', 'work', 'videos', 'site'];

export interface DraftStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface LocalDraft<T = unknown> {
  value: T;
  updatedAt: number;
}

export interface DraftStore {
  read<T = unknown>(section: SiteSection): LocalDraft<T> | null;
  write<T>(section: SiteSection, value: T, updatedAt?: number): LocalDraft<T> | null;
  clear(section: SiteSection): void;
}

function isSiteSection(value: string): value is SiteSection {
  return SECTIONS.includes(value as SiteSection);
}

function isLocalDraft(value: unknown): value is LocalDraft {
  return (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    typeof (value as { updatedAt?: unknown }).updatedAt === 'number'
  );
}

export function draftStorageKey(section: SiteSection): string {
  return `${DRAFT_KEY_PREFIX}${section}`;
}

export function createDraftStore(storage: DraftStorage): DraftStore {
  return {
    read<T = unknown>(section: SiteSection): LocalDraft<T> | null {
      try {
        const raw = storage.getItem(draftStorageKey(section));
        if (!raw) return null;

        const parsed: unknown = JSON.parse(raw);
        if (!isLocalDraft(parsed)) return null;

        return parsed as LocalDraft<T>;
      } catch {
        return null;
      }
    },

    write<T>(section: SiteSection, value: T, updatedAt = Date.now()): LocalDraft<T> | null {
      const draft: LocalDraft<T> = { value, updatedAt };

      try {
        storage.setItem(draftStorageKey(section), JSON.stringify(draft));
        return draft;
      } catch {
        return null;
      }
    },

    clear(section: SiteSection): void {
      try {
        storage.removeItem(draftStorageKey(section));
      } catch {
        // Storage can be unavailable in private browsing or after quota errors.
      }
    },
  };
}

function browserDraftStore(): DraftStore | null {
  if (typeof window === 'undefined') return null;

  try {
    return createDraftStore(window.localStorage);
  } catch {
    return null;
  }
}

export function readLocalDraft<T = unknown>(section: SiteSection): LocalDraft<T> | null {
  return browserDraftStore()?.read<T>(section) ?? null;
}

export function writeLocalDraft<T>(
  section: SiteSection,
  value: T,
  updatedAt = Date.now()
): LocalDraft<T> | null {
  return browserDraftStore()?.write(section, value, updatedAt) ?? null;
}

export function clearLocalDraft(section: SiteSection): void {
  browserDraftStore()?.clear(section);
}

export function seedDraftsFromServer(
  drafts: Partial<Record<SiteSection, RemoteDraft>> | null | undefined,
  store: DraftStore | null = browserDraftStore()
): void {
  if (!drafts || !store) return;

  for (const [section, draft] of Object.entries(drafts)) {
    if (!isSiteSection(section) || !draft) continue;

    const serverTime = Date.parse(draft.savedAt);
    if (!Number.isFinite(serverTime)) continue;

    const local = store.read(section);
    if (local && local.updatedAt >= serverTime) continue;

    store.write(section, draft.content, serverTime);
  }
}
