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

const LEGACY_WORK_TITLES = new Set([
  'Luma Health',
  'Northline Studio',
  'Quiet Hours',
  'Common Ground',
]);

const LEGACY_CERTIFICATE_TITLES = new Set([
  'Google UX Design',
  'Front-End Developer',
  'Responsive Web Design',
]);

const FULLSTACK_PROOF_TITLES = new Set([
  'Xpresso ACP Lite — UI/UX Design and Development',
  'Xpresso ACP Lite — Web Programming',
  'Git & Version Control',
]);

function isLegacyWork(content: SiteContent['work']): boolean {
  return (
    Array.isArray(content.projects) &&
    content.projects.length > 0 &&
    content.projects.every((project) => LEGACY_WORK_TITLES.has(project.title))
  );
}

function isLegacyAbout(content: SiteContent['about']): boolean {
  const items = content.certificates?.items;
  return (
    Array.isArray(items) &&
    items.length > 0 &&
    items.every((certificate) => LEGACY_CERTIFICATE_TITLES.has(certificate.title))
  );
}

function curateFullstackProof(content: SiteContent['about']): SiteContent['about'] {
  const certificates = content.certificates;
  if (!certificates || !Array.isArray(certificates.items)) return content;

  const hasOldAboutHeading =
    content.heading?.[0] === 'Skills &' && content.heading?.[1] === 'certificates.';
  const hasOldCertificateHeading =
    certificates.heading?.[0] === 'Selected' && certificates.heading?.[1] === 'certificates.';

  return {
    ...content,
    ...(hasOldAboutHeading ? { heading: ['Skills &', 'full stack.'] as [string, string] } : {}),
    certificates: {
      ...certificates,
      ...(hasOldCertificateHeading
        ? { heading: ['Every', 'certificate.'] as [string, string] }
        : {}),
      items: certificates.items.map((certificate) => ({
        ...certificate,
        featured: FULLSTACK_PROOF_TITLES.has(certificate.title),
      })),
    },
  };
}

function isLegacyHero(content: SiteContent['hero']): boolean {
  return (
    content.headline?.[0] === 'A clearer mind' &&
    content.headline?.[1] === 'for a brighter you.'
  );
}

function isLegacySite(content: SiteContent['site']): boolean {
  return content.email === 'hello@rizkymaulana.dev';
}

function mergeContent(value: unknown): SiteContent {
  if (!isRecord(value)) return defaultSiteContent;

  const readSection = <T extends object>(section: unknown, fallback: T): T => {
    if (!isRecord(section)) return fallback;
    return { ...fallback, ...section } as T;
  };

  const heroSection = readSection(value.hero, defaultSiteContent.hero);
  const aboutSection = readSection(value.about, defaultSiteContent.about);
  const workSection = readSection(value.work, defaultSiteContent.work);
  const siteSection = readSection(value.site, defaultSiteContent.site);
  const aboutHasFullstack = isRecord(value.about) && isRecord(value.about.fullstack);

  return {
    // `Process` was removed from the page but can still exist in older CMS
    // snapshots. Drop it so saved content cannot reintroduce a dead anchor.
    hero: isLegacyHero(heroSection)
      ? defaultSiteContent.hero
      : {
          ...heroSection,
          nav: (
            Array.isArray(heroSection.nav) ? heroSection.nav : defaultSiteContent.hero.nav
          ).filter((item) => item.href !== '#process'),
        },
    // The previous build shipped placeholder case studies. Replace only when
    // the saved section is still entirely those placeholders, so real edits
    // made in the CMS are never silently discarded.
    about: isLegacyAbout(aboutSection)
      ? defaultSiteContent.about
      : aboutHasFullstack
        ? aboutSection
        : curateFullstackProof(aboutSection),
    work: isLegacyWork(workSection) ? defaultSiteContent.work : workSection,
    videos: readSection(value.videos, defaultSiteContent.videos),
    site: isLegacySite(siteSection) ? defaultSiteContent.site : siteSection,
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
