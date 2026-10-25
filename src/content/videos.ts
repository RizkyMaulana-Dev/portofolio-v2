export type VideoAccent = 'sun' | 'rose' | 'sky' | 'violet' | 'lime';

export type VideoVisual = 'horizon' | 'portal' | 'fold' | 'meter' | 'orbit';

export interface VideoComment {
  id: string;
  author: string;
  meta: string;
  text: string;
}

export interface VideoEntry {
  slug: string;
  title: string;
  category: string;
  date: string;
  duration: string;
  description: string;
  accent: VideoAccent;
  visual: VideoVisual;
  mark: string;
  likes: number;
  shares: number;
  comments: VideoComment[];
}

export type VideoClip = VideoEntry;

export interface VideoFeedContent {
  eyebrow: string;
  heading: [string, string];
  intro: string;
  period: string;
  handle: string;
  scrollHint: string;
  clips: VideoClip[];
}

// Placeholder feed. Swap the clip URLs and copy when the real TikTok posts are ready.
export const videos: VideoFeedContent = {
  eyebrow: 'Video feed — TikTok',
  heading: ['Life, in', 'vertical.'],
  intro:
    'Process notes, studio fragments, and small observations—recorded vertically and posted before I overthink them.',
  period: '2025—now',
  handle: '@rizkymaulana',
  scrollHint: 'Scroll inside the frame. Each clip snaps into place.',
  clips: [
    {
      slug: 'a-week-in-the-studio',
      title: 'A week in the studio',
      category: 'Process note',
      date: 'May 2025',
      duration: '00:38',
      description: 'Seven days of small decisions, loose ends, and one good light.',
      accent: 'sun',
      visual: 'horizon',
      mark: 'Studio',
      likes: 248,
      shares: 14,
      comments: [
        {
          id: 'studio-1',
          author: 'Mira',
          meta: '2d',
          text: 'The light change at 00:12 is the whole film.',
        },
        {
          id: 'studio-2',
          author: 'Adnan',
          meta: '3d',
          text: 'This is the pace I want my week to have.',
        },
        {
          id: 'studio-3',
          author: 'Nadia',
          meta: '4d',
          text: 'The last frame made me keep the tab open.',
        },
      ],
    },
    {
      slug: 'setting-type-at-2am',
      title: 'Setting type at 2am',
      category: 'Process',
      date: 'Apr 2025',
      duration: '00:27',
      description: 'A late-night type session, recorded exactly as it happened.',
      accent: 'violet',
      visual: 'portal',
      mark: 'Type',
      likes: 186,
      shares: 9,
      comments: [
        {
          id: 'type-1',
          author: 'Bima',
          meta: '1d',
          text: 'The kerning pass at the end is quietly satisfying.',
        },
        {
          id: 'type-2',
          author: 'Lena',
          meta: '5d',
          text: '2am typography is a different genre.',
        },
      ],
    },
    {
      slug: 'found-objects-no-02',
      title: 'Found objects, no. 02',
      category: 'Studio',
      date: 'Mar 2025',
      duration: '00:19',
      description: 'Small objects, soft light, and a reason to keep looking.',
      accent: 'rose',
      visual: 'fold',
      mark: 'Found',
      likes: 129,
      shares: 4,
      comments: [
        {
          id: 'found-1',
          author: 'Sara',
          meta: '6d',
          text: 'Object two has such a good shadow.',
        },
        {
          id: 'found-2',
          author: 'Theo',
          meta: '1w',
          text: 'I would frame that small frame on the left.',
        },
      ],
    },
    {
      slug: 'the-walk-home',
      title: 'The walk home',
      category: 'Life',
      date: 'Feb 2025',
      duration: '00:44',
      description: 'The long way home, with the camera rolling.',
      accent: 'sky',
      visual: 'orbit',
      mark: 'Walk',
      likes: 312,
      shares: 21,
      comments: [
        {
          id: 'walk-1',
          author: 'Rani',
          meta: '2d',
          text: 'The long way home is usually the right one.',
        },
        {
          id: 'walk-2',
          author: 'Dimas',
          meta: '4d',
          text: 'That sky at the crossing. No notes.',
        },
      ],
    },
    {
      slug: 'notes-on-making',
      title: 'Notes on making',
      category: 'Thoughts',
      date: 'Jan 2025',
      duration: '00:31',
      description: "A few thoughts on making things before they're ready.",
      accent: 'lime',
      visual: 'meter',
      mark: 'Make',
      likes: 97,
      shares: 6,
      comments: [
        {
          id: 'making-1',
          author: 'Ari',
          meta: '1w',
          text: 'The line about making before it is ready stuck with me.',
        },
        {
          id: 'making-2',
          author: 'Jo',
          meta: '1w',
          text: 'Saving this for the next unfinished thing.',
        },
      ],
    },
  ],
};
