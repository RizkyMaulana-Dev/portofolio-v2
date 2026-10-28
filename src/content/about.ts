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
  date?: string;
  category?: string;
  image?: string;
  credentialId: string;
  href: string;
  accent: Accent;
  featured?: boolean;
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

export const about: AboutContent = {
  eyebrow: "About — Capabilities",
  heading: ["Skills &", "certificates."],
  skillGroups: [
    {
      label: "Frontend & game",
      note: "Interfaces and interactive systems",
      accent: "violet",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Phaser.js / Unity"],
    },
    {
      label: "Backend & data",
      note: "APIs, schemas, and server logic",
      accent: "lime",
      skills: ["Laravel", "PHP", "Node.js", "REST API", "MySQL"],
    },
    {
      label: "Delivery & craft",
      note: "The everyday kit",
      accent: "sky",
      skills: ["PostgreSQL", "Git & GitHub", "Linux / VPS", "Figma", "AI automation"],
    },
  ],
  skills: {
    label: "Toolkit",
  },
  certificates: {
    label: "Credentials",
    heading: ["Selected", "certificates."],
    note: "16 certificates · 2023–2026",
    items: [
      {
        title: "Program Praktik Kerja Lapangan (PKL) — Game Developer",
        issuer: "Gamelab Indonesia / Educa Studio",
        mark: "G",
        year: "2026",
        date: "Februari 2026",
        category: "Internship",
        image: "/images/certificates/gamelab-pkl-game-developer.webp",
        credentialId: "GL4855005231",
        href: "/documents/certificates/gamelab-pkl-game-developer.pdf",
        accent: "lime",
      },
      {
        title: "Go: Pemrograman Dasar",
        issuer: "Gamelab Indonesia",
        mark: "G",
        year: "2026",
        date: "Januari 2026",
        category: "Programming",
        image: "/images/certificates/gamelab-go-language.webp",
        credentialId: "GL8782423132",
        href: "/documents/certificates/gamelab-go-language.pdf",
        accent: "sky",
      },
      {
        title: "Critical Thinking: Meningkatkan Kualitas Hidup dengan Berpikir Kritis",
        issuer: "Gamelab Indonesia",
        mark: "G",
        year: "2025",
        date: "Agustus 2025",
        category: "Soft skills",
        image: "/images/certificates/gamelab-critical-thinking.webp",
        credentialId: "GL7135602310",
        href: "/documents/certificates/gamelab-critical-thinking.pdf",
        accent: "rose",
      },
      {
        title: "Computer Hardware Basics",
        issuer: "Cisco Networking Academy",
        mark: "C",
        year: "2025",
        date: "Juli 2025",
        category: "Networking",
        image: "/images/certificates/cisco-computer-hardware-basics.webp",
        credentialId: "0076806838",
        href: "/documents/certificates/cisco-computer-hardware-basics.pdf",
        accent: "sky",
      },
      {
        title: "Game 3D: C# dan Unity",
        issuer: "Gamelab Indonesia",
        mark: "G",
        year: "2025",
        date: "Juni 2025",
        category: "Game development",
        image: "/images/certificates/gamelab-unity.webp",
        credentialId: "GL3622129029",
        href: "/documents/certificates/gamelab-unity.pdf",
        accent: "peach",
        featured: true,
      },
      {
        title: "Introduction to Cybersecurity",
        issuer: "Cisco Networking Academy",
        mark: "C",
        year: "2025",
        date: "Mei 2025",
        category: "Cybersecurity",
        image: "/images/certificates/cisco-introduction-to-cybersecurity.webp",
        credentialId: "0076806838",
        href: "/documents/certificates/cisco-introduction-to-cybersecurity.pdf",
        accent: "violet",
        featured: true,
      },
      {
        title: "Game 3D: Three.js",
        issuer: "Gamelab Indonesia",
        mark: "G",
        year: "2025",
        date: "Februari 2025",
        category: "Game development",
        image: "/images/certificates/gamelab-threejs.webp",
        credentialId: "GL9643582634",
        href: "/documents/certificates/gamelab-threejs.pdf",
        accent: "sky",
      },
      {
        title: "Java: Pemrograman Dasar",
        issuer: "Gamelab Indonesia",
        mark: "G",
        year: "2024",
        date: "Desember 2024",
        category: "Programming",
        image: "/images/certificates/gamelab-java.webp",
        credentialId: "GL3804834821",
        href: "/documents/certificates/gamelab-java.pdf",
        accent: "peach",
      },
      {
        title: "Git & Version Control",
        issuer: "Gamelab Indonesia",
        mark: "G",
        year: "2024",
        date: "Desember 2024",
        category: "Tools",
        image: "/images/certificates/gamelab-git.webp",
        credentialId: "GL6446634507",
        href: "/documents/certificates/gamelab-git.pdf",
        accent: "lime",
      },
      {
        title: "Xpresso ACP Lite — Web Programming",
        issuer: "LearningX / Axioo School",
        mark: "L",
        year: "2024",
        date: "Oktober 2024",
        category: "Web",
        image: "/images/certificates/learningx-web-programming.webp",
        credentialId: "",
        href: "/documents/certificates/learningx-web-programming.pdf",
        accent: "sky",
      },
      {
        title: "Xpresso ACP Lite — Mobile Application Development",
        issuer: "LearningX / Axioo School",
        mark: "L",
        year: "2024",
        date: "Oktober 2024",
        category: "Mobile",
        image: "/images/certificates/learningx-mobile-programming.webp",
        credentialId: "",
        href: "/documents/certificates/learningx-mobile-programming.pdf",
        accent: "violet",
      },
      {
        title: "Xpresso ACP Lite — Python Programming",
        issuer: "LearningX / Axioo School",
        mark: "L",
        year: "2024",
        date: "Oktober 2024",
        category: "Programming",
        image: "/images/certificates/learningx-python-programming.webp",
        credentialId: "",
        href: "/documents/certificates/learningx-python-programming.pdf",
        accent: "lime",
      },
      {
        title: "Xpresso ACP Lite — UI/UX Design and Development",
        issuer: "LearningX / Axioo School",
        mark: "L",
        year: "2024",
        date: "Oktober 2024",
        category: "Design",
        image: "/images/certificates/learningx-ui-ux.webp",
        credentialId: "",
        href: "/documents/certificates/learningx-ui-ux.pdf",
        accent: "peach",
        featured: true,
      },
      {
        title: "Game 2D: Phaser Game Framework",
        issuer: "Gamelab Indonesia",
        mark: "G",
        year: "2024",
        date: "September 2024",
        category: "Game development",
        image: "/images/certificates/gamelab-phaser-js.webp",
        credentialId: "GL3342841917",
        href: "/documents/certificates/gamelab-phaser-js.pdf",
        accent: "lime",
      },
      {
        title: "JavaScript untuk GameDev",
        issuer: "Gamelab Indonesia",
        mark: "G",
        year: "2024",
        date: "Maret 2024",
        category: "Game development",
        image: "/images/certificates/gamelab-javascript-gamedev.webp",
        credentialId: "GL3296894831",
        href: "/documents/certificates/gamelab-javascript-gamedev.pdf",
        accent: "peach",
      },
      {
        title: "Construct Game Engine",
        issuer: "Gamelab Indonesia",
        mark: "G",
        year: "2023",
        date: "November 2023",
        category: "Game development",
        image: "/images/certificates/gamelab-construct.webp",
        credentialId: "GL5329929224",
        href: "/documents/certificates/gamelab-construct.pdf",
        accent: "violet",
      },
    ],
  },
};
