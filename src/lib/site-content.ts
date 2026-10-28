import { useSyncExternalStore } from 'react';
import { about, type AboutContent } from '@/content/about';
import { hero, type HeroContent } from '@/content/hero';
import { site, type SiteContentData } from '@/content/site';
import { videos, type VideoFeedContent } from '@/content/videos';
import { work, type WorkContent } from '@/content/work';

export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  work: WorkContent;
  videos: VideoFeedContent;
  site: SiteContentData;
}

export type SiteSection = keyof SiteContent;

const STORAGE_KEY = 'rizky-portfolio-content-v1';
const CHANGE_EVENT = 'rizky-portfolio-content-change';

export const defaultSiteContent: SiteContent = {
  hero,
  about,
  work,
  videos,
  site,
};

let cachedContent: SiteContent = defaultSiteContent;
let hasLoaded = false;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeContent(value: unknown): SiteContent {
  if (!isRecord(value)) return defaultSiteContent;

  const readSection = <T extends object>(section: unknown, fallback: T): T => {
    if (!isRecord(section)) return fallback;
    return { ...fallback, ...section } as T;
  };

  const heroSection = readSection(value.hero, defaultSiteContent.hero);

  return {
    // `Process` was removed from the page but can still exist in older CMS
    // snapshots. Drop it so saved content cannot reintroduce a dead anchor.
    hero: {
      ...heroSection,
      nav: (Array.isArray(heroSection.nav) ? heroSection.nav : defaultSiteContent.hero.nav).filter(
        (item) => item.href !== '#process'
      ),
    },
    about: readSection(value.about, defaultSiteContent.about),
    work: readSection(value.work, defaultSiteContent.work),
    videos: readSection(value.videos, defaultSiteContent.videos),
    site: readSection(value.site, defaultSiteContent.site),
  };
}

function readStoredContent(): SiteContent {
  if (typeof window === 'undefined') return defaultSiteContent;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultSiteContent;
    return mergeContent(JSON.parse(stored) as unknown);
  } catch {
    return defaultSiteContent;
  }
}

function emitChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }
}

export function getSiteContent(): SiteContent {
  if (!hasLoaded) {
    cachedContent = readStoredContent();
    hasLoaded = true;
  }

  return cachedContent;
}

export function saveSiteContent(content: SiteContent): boolean {
  cachedContent = content;
  hasLoaded = true;

  let saved = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch {
    saved = false;
  }

  emitChange();
  return saved;
}

export function resetSiteContent(): boolean {
  cachedContent = defaultSiteContent;
  hasLoaded = true;

  let cleared = true;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    cleared = false;
  }

  emitChange();
  return cleared;
}

function subscribeSiteContent(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    cachedContent = readStoredContent();
    hasLoaded = true;
    onStoreChange();
  };

  const handleLocalChange = () => {
    cachedContent = readStoredContent();
    hasLoaded = true;
    onStoreChange();
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(CHANGE_EVENT, handleLocalChange);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(CHANGE_EVENT, handleLocalChange);
  };
}

export function useSiteContent(): SiteContent {
  return useSyncExternalStore(
    subscribeSiteContent,
    getSiteContent,
    () => defaultSiteContent
  );
}
