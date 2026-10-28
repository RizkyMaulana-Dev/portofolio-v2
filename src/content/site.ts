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

export const site: SiteContentData = {
  name: 'Rizky Maulana',
  email: 'maulana.rizky.connect@gmail.com',
  availability: 'Open to full-time, freelance, and remote work.',
  location: 'Bandung, Jawa Barat · WFO / Remote',
  footerHeading: ["Let's make", 'it clear.'],
  socials: [
    { label: 'GitHub', href: 'https://github.com/RizkyMaulana-Dev' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/rzkymaulana' },
    { label: 'Instagram', href: 'https://instagram.com/rztech_dev' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@rztech_dev' },
    { label: 'WhatsApp', href: 'https://wa.me/628882125177' },
  ] as SocialLink[],
  footerNav: [
    { label: 'Work', href: '/#work' },
    { label: 'About', href: '/about' },
    { label: 'Credentials', href: '/certificates' },
    { label: 'Blog', href: '/blog' },
    { label: 'Feed', href: '/feed' },
    { label: 'Résumé', href: '/documents/cv/rizky-maulana-fullstack-en.pdf' },
  ] as FooterLink[],
};
