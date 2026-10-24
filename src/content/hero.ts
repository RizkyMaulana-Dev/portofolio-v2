export const hero = {
  brand: "Rizky°",
  nav: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" },
  ],
  navCta: { label: "Hire me", href: "#contact" },
  headline: ["A clearer mind", "for a brighter you."],
  subheadline:
    "Designer & developer yang membuat pengalaman digital yang tenang, fokus, dan berkesan.",
  ctaPrimary: { label: "View work", href: "#work" },
  ctaSecondary: { label: "Watch showreel", href: "#showreel" },
  cards: [
    { title: "Focus", caption: "Deep work, bigger results.", accent: "lime", icon: "Target" },
    { title: "Ideas", caption: "Capture everything.", accent: "violet", icon: "MessageCircle" },
    { title: "Plan", caption: "Turn ideas into action.", accent: "peach", icon: "Layers" },
    { title: "Work", caption: "Selected projects.", accent: "sky", icon: "Briefcase" },
    { title: "Notes", caption: "Think in public.", accent: "sun", icon: "NotebookPen" },
    { title: "Craft", caption: "Details that matter.", accent: "rose", icon: "PenTool" },
  ],
  sideNotes: [
    { title: "Turn thoughts into progress.", caption: "Capture, organise and do more." },
    { title: "Ideas, anytime, anywhere.", caption: "Sync across all your devices." },
  ],
  trust: "Dipercaya 50+ klien di seluruh dunia.",
  tagline: ["Less chaos.", "More clarity."],
  sticker: "A MORE FOCUSED YOU • EVERYDAY • ",
} as const;

export type HeroContent = typeof hero;
export type OrbitCard = typeof hero.cards[0];
export type SideNote = typeof hero.sideNotes[0];