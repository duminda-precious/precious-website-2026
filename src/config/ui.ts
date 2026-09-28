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
    close: 'Close',
    label: 'Main menu',
  },
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
  reel: {
    soundOn: 'Sound on',
    soundOff: 'Sound off',
  },
  footer: {
    headline: 'Make your product feel worth paying for.',
  },
  rating: {
    /** e.g. "Clutch ★★★★★ 4.9"; the stars are decorative. */
    source: 'Clutch',
    srLabel: (rating: number, max: number) => `Rated ${rating} out of ${max} on Clutch`,
  },
} as const;
