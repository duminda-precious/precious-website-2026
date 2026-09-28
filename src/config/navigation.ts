/**
 * Navigation model (plan §3.2). The only place link lists live.
 * Homepage anchors are written as "/#id" so they also work from inner pages.
 */
import { site } from './site';

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
  /** Analytics hook, rendered as data-track. */
  track?: string;
}

/** Primary nav (desktop inline, mobile overlay). Order as in the prototype. */
export const primaryNav: NavLink[] = [
  { label: 'Work', href: '/#work' },
  { label: 'Approach', href: '/#approach' },
  { label: 'Clients', href: '/#clients' },
  { label: 'FAQ', href: '/#faq' },
];

/** The single conversion action. In the nav it scrolls to the footer CTA, as in the prototype. */
export const navCta: NavLink = { label: 'Book a call', href: '/#call', track: 'book-call' };

/** Footer CTA goes straight to the booking tool. */
export const footerCta: NavLink = {
  label: 'Book a call',
  href: site.bookingUrl,
  external: site.bookingUrl.startsWith('http'),
  track: 'book-call',
};

export interface FooterColumn {
  heading: string;
  links: (NavLink & { showInFooter?: boolean })[];
}

export const footerNav: FooterColumn[] = [
  {
    heading: 'Studio',
    links: [
      { label: 'Work', href: '/#work' },
      { label: 'Approach', href: '/#approach' },
      { label: 'AI Design Agent', href: '/ai' },
      { label: 'About', href: '/about' },
    ],
  },
  {
    heading: 'More',
    links: [
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
      // Journal exists as a route; it appears here only once it has posts.
      { label: 'Journal', href: '/journal', showInFooter: false },
      { label: 'Clutch', href: site.socials.clutch, external: true },
    ],
  },
];

/** Footer links with the showInFooter flag applied. */
export const visibleFooterNav = footerNav.map((col) => ({
  ...col,
  links: col.links.filter((l) => l.showInFooter !== false),
}));
