/**
 * Site-wide facts. Anything in [brackets] is a placeholder waiting on Duminda
 * (see plan §10). Components read from here; nothing is hard-coded elsewhere.
 */
export const site = {
  name: 'Precious Studio',
  legalName: '[Legal company name]',
  wordmark: 'PRECIOUS ✕ STUDIO',
  url: 'https://precious.studio',
  location: 'Austin, TX',
  foundingYear: 2015,
  email: '[hello@precious.studio]',
  /** Cal.com / Calendly link. "#" until provided. */
  bookingUrl: '#',
  socials: {
    clutch: '#',
    linkedin: '#',
    dribbble: '#',
  },
  clutchRating: 4.9,
  clutchRatingMax: 5,
  /** Off by default; the provider is chosen later (plan §8). */
  analytics: {
    enabled: false,
    provider: null as string | null,
  },
  locale: 'en',
} as const;

export type Site = typeof site;
