import type { VideoClip } from '@/content/videos';
import { withBase } from '@/lib/paths';

export function formatFeedCount(value: number): string {
  if (value < 1_000) return String(value);
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatClipIndex(index: number): string {
  return String(index).padStart(2, '0');
}

export function getClipShareUrl(slug: string, currentUrl: string): string {
  const url = new URL(currentUrl);
  url.search = '';
  url.hash = 'videos-feed';
  url.searchParams.set('clip', slug);
  return url.toString();
}

export function getClipEmbedCode(clip: VideoClip, origin: string): string {
  const base = origin.replace(/\/$/, '');
  const embedPath = withBase(`/embed/${clip.slug}`);
  const title = clip.title.replaceAll('"', '&quot;');

  return `<iframe
  src="${base}${embedPath}"
  title="${title} — Rizky Maulana"
  width="390"
  height="700"
  style="border:0"
  loading="lazy"
  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
  allowfullscreen
></iframe>`;
}
