export type VideoAccent = 'sun' | 'rose' | 'sky' | 'violet' | 'lime';

export type VideoVisual = 'horizon' | 'portal' | 'fold' | 'meter' | 'orbit';

export interface VideoEntry {
  title: string;
  category: string;
  date: string;
  duration: string;
  description: string;
  accent: VideoAccent;
  visual: VideoVisual;
}

export interface VideoClip extends VideoEntry {
  href: string;
}

export interface VideoFeedContent {
  eyebrow: string;
  heading: [string, string];
  intro: string;
  period: string;
  feedHref: string;
  feedLabel: string;
  featured: VideoEntry;
  clips: VideoClip[];
}

// Placeholder feed — swap the hrefs, thumbnails, and copy when the real TikTok feed is ready.
export const videos: VideoFeedContent = {
  eyebrow: 'Video feed — TikTok',
  heading: ['Life, in', 'vertical.'],
  intro:
    'Process notes, studio fragments, and small observations—recorded vertically and posted before I overthink them.',
  period: '2025—now',
  feedHref: '#',
  feedLabel: 'View feed',
  featured: {
    title: 'A week in the studio',
    category: 'Process note',
    date: 'May 2025',
    duration: '00:38',
    description: 'Seven days of small decisions, loose ends, and one good light.',
    accent: 'sun',
    visual: 'horizon',
  },
  clips: [
    {
      title: 'Setting type at 2am',
      category: 'Process',
      date: 'Apr 2025',
      duration: '00:27',
      description: 'A late-night type session, recorded exactly as it happened.',
      accent: 'violet',
      visual: 'portal',
      href: '#',
    },
    {
      title: 'Found objects, no. 02',
      category: 'Studio',
      date: 'Mar 2025',
      duration: '00:19',
      description: 'Small objects, soft light, and a reason to keep looking.',
      accent: 'rose',
      visual: 'fold',
      href: '#',
    },
    {
      title: 'The walk home',
      category: 'Life',
      date: 'Feb 2025',
      duration: '00:44',
      description: 'The long way home, with the camera rolling.',
      accent: 'sky',
      visual: 'orbit',
      href: '#',
    },
    {
      title: 'Notes on making',
      category: 'Thoughts',
      date: 'Jan 2025',
      duration: '00:31',
      description: "A few thoughts on making things before they're ready.",
      accent: 'lime',
      visual: 'meter',
      href: '#',
    },
  ],
};
