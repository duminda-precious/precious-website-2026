/**
 * Shared interface strings used across pages (labels, controls, a11y text).
 * Page-specific copy lives in src/content/pages/*.json.
 */
export const ui = {
  skipLink: 'Skip to content',
  brandHomeLabel: 'Precious Studio, home',
  primaryNavLabel: 'Primary',
  footerNavLabel: 'Footer',
  clientsListLabel: 'Clients',
  menu: {
    open: 'Menu',
    close: 'Close menu',
    label: 'Menu',
    linkedin: 'LinkedIn',
  },
  megaLabel: 'Services',
  viewCaseStudy: 'View case study',
  stub: {
    message: 'This page is being rebuilt.',
    backHome: 'Back to the homepage',
  },
  /** 404 body line; the heading and SEO live in src/content/pages/404.json. */
  notFound: {
    message: "This page doesn't exist, or it moved.",
  },
  contact: {
    email: 'Email',
    location: 'Location',
  },
  slider: {
    label: 'Testimonials',
    prev: 'Previous testimonial',
    next: 'Next testimonial',
  },
  team: {
    roles: 'The team',
    outputs: 'What the team delivers',
  },
  news: {
    label: 'News',
    /** Placeholder label in the thumbnail until images exist. */
    thumb: 'Image',
  },
  reel: {
    soundOn: 'Sound on',
    soundOff: 'Sound off',
  },
  footer: {
    /** Two lines; each stays on one line. */
    headline: ['Make Your Product Feel', 'Worth Paying For.'],
  },
  rating: {
    /** e.g. "Clutch ★★★★★ 4.9"; the stars are decorative. */
    source: 'Clutch',
    srLabel: (rating: number, max: number) => `Rated ${rating} out of ${max} on Clutch`,
  },
} as const;
