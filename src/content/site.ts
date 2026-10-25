export interface SocialLink {
  label: string;
  href: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

// Placeholder contact details and social URLs. Replace these with the real ones.
export const site = {
  name: "Rizky Maulana",
  email: "hello@rizkymaulana.dev",
  availability: "Open to select projects and collaborations.",
  location: "Indonesia",
  socials: [
    { label: "GitHub", href: "https://github.com/RizkyMaulana-Dev" },
    { label: "LinkedIn", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "TikTok", href: "#" },
  ] as SocialLink[],
  footerNav: [
    { label: "Work", href: "/#work" },
    { label: "About", href: "/#about" },
    { label: "Blog", href: "/blog" },
  ] as FooterLink[],
};
