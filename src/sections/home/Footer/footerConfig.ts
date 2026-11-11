export interface FooterLink {
  label: string;
  href: string;
  isInternal?: boolean;
}

export interface FooterSocialLink {
  label: string;
  shortLabel: string;
  url: string;
  icon?: 'linkedin' | 'instagram' | 'twitter' | 'github' | 'facebook';
}

export interface StudioHub {
  city: string;
  address: string[];
  contact: string;
}

export const FOOTER_CONFIG = {
  banner: {
    leadText: "Let's work",
    accentText: 'together',
    links: [
      { label: 'Get in Touch', href: '#contact', isInternal: true },
      { label: 'Careers', href: 'mailto:careers@hash.devs?subject=Careers%20Inquiry', isInternal: false },
    ],
  },
  info: {
    socials: [
      { label: 'LinkedIn', shortLabel: 'in', url: 'https://linkedin.com', icon: 'linkedin' as const },
      { label: 'Instagram', shortLabel: 'ig', url: 'https://instagram.com', icon: 'instagram' as const },
      { label: 'GitHub', shortLabel: 'gh', url: 'https://github.com', icon: 'github' as const },
      { label: 'X (Twitter)', shortLabel: 'x', url: 'https://twitter.com', icon: 'twitter' as const },
    ],
    hubs: [
      {
        city: 'San Francisco',
        address: ['100 Montgomery Street', 'San Francisco, CA 94104'],
        contact: 'hello@hash.devs',
      },
      {
        city: 'Tokyo',
        address: ['Roppongi Hills Mori Tower', 'Tokyo 106-6108, Japan'],
        contact: '+1 (415) 890-HASH',
      },
    ],
    contact: {
      email: 'hello@hash.devs',
      sla: 'RESPONSE TIME < 24 HOURS',
      availability: 'ACCEPTING COMMISSIONS // Q2 2026',
    },
    legal: [
      { label: 'Terms of Use', href: '#terms' },
      { label: 'Privacy Policy', href: '#privacy' },
    ],
    copyright: '©2026 HASH.DEVS',
    discipline: 'INDEPENDENT CREATIVE TECHNOLOGY & ENGINEERING STUDIO',
  },
  logo: {
    src: '/images/hashdevs-logo.png',
    darkSrc: '/images/hashdevs-logo-dark.png',
    darkMonumentalSrc: '/images/hashdevs-logo-dark-monumental.png',
    fallbackSrc: '/images/hashdevs-logo.jpg',
    alt: 'HASH.DEVS Official Logo',
    width: 1024,
    height: 384,
  },
  wordmark: 'HASH.DEVS',
};


