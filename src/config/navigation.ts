/**
 * Navigation model (plan §0.1 decisions, 2026-09-29). The only place link lists live.
 * The top nav links to pages, not homepage sections.
 */
import { site } from './site';

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
  /** Analytics hook, rendered as data-track. */
  track?: string;
  /** Small permanent badge after the label (e.g. "New"). */
  badge?: string;
}

/** A nav entry whose label only opens a dropdown (it is not a link itself). */
export interface NavDropdown {
  label: string;
  /** Items are built from this collection plus the overview link. */
  source: 'services';
  /** Link to the overview page, shown first in the dropdown. Placeholder label. */
  overview: NavLink;
}

export type NavItem = NavLink | NavDropdown;

export const isDropdown = (item: NavItem): item is NavDropdown => 'source' in item;

/** Primary nav, in order. */
export const primaryNav: NavItem[] = [
  { label: 'Work', href: '/work' },
  {
    label: 'Services',
    source: 'services',
    overview: { label: '[Services overview]', href: '/services' },
  },
  { label: 'Approach', href: '/approach' },
  { label: 'AI Design Agent', href: '/ai', badge: 'New' },
  { label: 'About', href: '/about' },
];

/** The single conversion action. Every Book a call goes to the Contact page. */
export const bookCall: NavLink = { label: 'Book a call', href: '/contact', track: 'book-call' };

export interface FooterColumn {
  heading: string;
  links: (NavLink & { showInFooter?: boolean })[];
}

export const footerNav: FooterColumn[] = [
  {
    heading: 'Studio',
    links: [
      { label: 'Work', href: '/work' },
      { label: 'Services', href: '/services' },
      { label: 'Approach', href: '/approach' },
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
