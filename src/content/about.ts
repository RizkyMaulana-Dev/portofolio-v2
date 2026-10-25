export type Accent = "lime" | "violet" | "peach" | "sky" | "sun" | "rose";

export interface SkillGroup {
  label: string;
  note: string;
  accent: Accent;
  skills: string[];
}

export interface Certificate {
  title: string;
  issuer: string;
  mark: string;
  year: string;
  credentialId: string;
  href: string;
  accent: Accent;
}

export interface AboutContent {
  eyebrow: string;
  heading: [string, string];
  skillGroups: SkillGroup[];
  skills: {
    label: string;
  };
  certificates: {
    label: string;
    heading: [string, string];
    note: string;
    items: Certificate[];
  };
}

// Placeholder content — replace skills, issuers, years and links with the real ones.
export const about: AboutContent = {
  eyebrow: "About — Capabilities",
  heading: ["Skills &", "certificates."],
  skillGroups: [
    {
      label: "Design",
      note: "Interface, systems, and motion",
      accent: "violet",
      skills: [
        "UI/UX Design",
        "Design Systems",
        "Interaction Design",
        "Prototyping",
        "Motion Design",
      ],
    },
    {
      label: "Frontend",
      note: "Typed, fast, and accessible",
      accent: "lime",
      skills: [
        "React",
        "TypeScript",
        "Astro",
        "Tailwind CSS",
        "Framer Motion",
      ],
    },
    {
      label: "Tooling",
      note: "The everyday kit",
      accent: "sky",
      skills: [
        "Figma",
        "Git & GitHub",
        "Vite",
        "Adobe Illustrator",
        "After Effects",
      ],
    },
  ],
  skills: {
    label: "Toolkit",
  },
  certificates: {
    label: "Credentials",
    heading: ["Selected", "certificates."],
    note: "03 certificates · 2024–2025",
    items: [
      {
        title: "Google UX Design",
        issuer: "Google",
        mark: "G",
        year: "2025",
        credentialId: "PLACEHOLDER-001",
        href: "#",
        accent: "violet",
      },
      {
        title: "Front-End Developer",
        issuer: "Meta",
        mark: "M",
        year: "2024",
        credentialId: "PLACEHOLDER-002",
        href: "#",
        accent: "lime",
      },
      {
        title: "Responsive Web Design",
        issuer: "freeCodeCamp",
        mark: "F",
        year: "2024",
        credentialId: "PLACEHOLDER-003",
        href: "#",
        accent: "peach",
      },
    ],
  },
};
