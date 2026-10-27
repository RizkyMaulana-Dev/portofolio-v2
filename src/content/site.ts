export interface SocialLink {
  label: string;
  href: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SiteContentData {
  name: string;
  email: string;
  availability: string;
  location: string;
  footerHeading: [string, string];
  socials: SocialLink[];
  footerNav: FooterLink[];
}

// Placeholder contact details and social URLs. Replace these with the real ones.
export const site: SiteContentData = {
  name: 'Rizky Maulana',
  email: 'hello@rizkymaulana.dev',
  availability: 'Open to select projects and collaborations.',
  location: 'Indonesia',
  footerHeading: ["Let's make", 'it clear.'],
  socials: [
    { label: 'GitHub', href: 'https://github.com/RizkyMaulana-Dev' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'TikTok', href: '#' },
  ] as SocialLink[],
  footerNav: [
    { label: 'Work', href: '/#work' },
    { label: 'About', href: '/#about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Feed', href: '/feed' },
  ] as FooterLink[],
};
