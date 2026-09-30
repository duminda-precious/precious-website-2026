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

/**
 * Services mega menu (Claude Design; content from the live site). Every link is a
 * placeholder ("#") until the service pages exist.
 */
export interface MegaItem {
  label: string;
  href: string;
  /** One line under the label (Services column only). */
  description?: string;
}
export interface MegaColumn {
  heading: string;
  /** 'rich' = label + description (wide column); 'plain' = label only. */
  kind: 'rich' | 'plain';
  items: MegaItem[];
}
export const megaMenu: { columns: MegaColumn[]; note: string; all: NavLink } = {
  columns: [
    {
      heading: 'Services',
      kind: 'rich',
      items: [
        {
          label: 'Product redesign',
          href: '#',
          description:
            'Untangle a product that grew feature by feature, so people reach the value you built.',
        },
        {
          label: 'Design from scratch (MVP)',
          href: '#',
          description: 'Zero to one. Brand, product and system together, so version one feels finished.',
        },
        {
          label: 'Team extension',
          href: '#',
          description: 'Drop a senior pod into your team. In your tools and shipping by the end of week one.',
        },
        {
          label: 'Hire UI/UX designer',
          href: '#',
          description: 'One senior product designer, matched to your product, without the three month search.',
        },
        {
          label: 'Design as a service',
          href: '#',
          description: 'Ongoing product design without building a design team in-house.',
        },
        {
          label: 'UX design subscription',
          href: '#',
          description: 'A pod on a flat monthly fee. Scale it up, pause it, keep the same people.',
        },
      ],
    },
    {
      heading: 'Approach',
      kind: 'plain',
      items: [
        'SaaS design',
        'UI/UX design',
        'Web design',
        'UX audit',
        'Mobile design',
        'Design system',
        'Consulting',
      ].map((label) => ({ label, href: '#' })),
    },
    {
      heading: 'Industries',
      kind: 'plain',
      items: ['Sales', 'Healthcare', 'Marketing', 'Data', 'Developer-focused', 'AI'].map((label) => ({
        label,
        href: '#',
      })),
    },
  ],
  note: "Not sure which one? Send us one screen and we'll redesign it in five working days, free.",
  all: { label: 'All services', href: '/services' },
};

/** Full-page menu: large links; Services opens an accordion of the mega menu's services. */
export const fullMenu: NavLink[] = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'Approach', href: '/approach' },
  { label: 'AI Design Agent', href: '/ai' },
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
      { label: 'Journal', href: '/journal' },
      { label: 'Contact', href: '/contact' },
      { label: 'Clutch', href: site.socials.clutch, external: true },
    ],
  },
];

/** Footer links with the showInFooter flag applied. */
export const visibleFooterNav = footerNav.map((col) => ({
  ...col,
  links: col.links.filter((l) => l.showInFooter !== false),
}));
