export type WorkAccent = "violet" | "sky" | "peach" | "lime";

export type WorkVisual = "halo" | "arch" | "stack" | "bars";

export interface Project {
  title: string;
  category: string;
  year: string;
  summary: string;
  tags: string[];
  mark: string;
  href: string;
  accent: WorkAccent;
  visual: WorkVisual;
}

export interface WorkContent {
  eyebrow: string;
  heading: [string, string];
  intro: string;
  period: string;
  projects: Project[];
}

// Placeholder projects — replace names, copy, tags, covers, and links when the real work is ready.
export const work: WorkContent = {
  eyebrow: "Selected work — 2024–2025",
  heading: ["Work worth", "a closer look."],
  intro:
    "Placeholder projects across product, brand, and the web. Swap in real case studies, covers, and links when they are ready.",
  period: "2024–2025",
  projects: [
    {
      title: "Luma Health",
      category: "Product design",
      year: "2025",
      summary:
        "A calmer booking flow for a care platform that needed to feel human at every step.",
      tags: ["UX/UI", "Design system", "Web app"],
      mark: "L",
      href: "#",
      accent: "violet",
      visual: "halo",
    },
    {
      title: "Northline Studio",
      category: "Brand identity",
      year: "2025",
      summary:
        "A restrained visual language for an architecture studio working between city and landscape.",
      tags: ["Identity", "Art direction", "Web"],
      mark: "N",
      href: "#",
      accent: "sky",
      visual: "arch",
    },
    {
      title: "Quiet Hours",
      category: "Editorial design",
      year: "2024",
      summary:
        "A slow-reading journal for people who do their best thinking after dark.",
      tags: ["Editorial", "Typography", "Motion"],
      mark: "Q",
      href: "#",
      accent: "peach",
      visual: "stack",
    },
    {
      title: "Common Ground",
      category: "Community platform",
      year: "2024",
      summary:
        "A neighborhood app that makes small, real-world connections feel effortless.",
      tags: ["Product", "Research", "Frontend"],
      mark: "C",
      href: "#",
      accent: "lime",
      visual: "bars",
    },
  ],
};
