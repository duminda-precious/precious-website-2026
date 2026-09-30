/**
 * Content collections (plan §4). Every string on the site comes from here or
 * from src/config. Loaders are local files today; a headless CMS can replace
 * a loader later without touching components.
 *
 * Conventions
 * - An entry's id (file name) is its slug, e.g. work/lumin-fitness.md → /work/lumin-fitness.
 * - Placeholder copy keeps the prototype's [bracket] form so it stays visible.
 * - `order` sorts lists ascending; `published: false` hides an entry.
 */
import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { situations } from './config/taxonomy';

const seo = z.object({
  title: z.string().min(1),
  description: z.string().min(1).max(170),
  /** Stub pages stay out of search until they have real content. */
  noindex: z.boolean().default(false),
});

/* ---------------------------------------------------------------- work */
const work = defineCollection({
  loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1),
    client: z.string().optional(),
    tag: z.enum(situations),
    /** One line: "problem → outcome". */
    summary: z.string().min(1),
    media: z.object({
      video: z.string().optional(),
      poster: z.string().optional(),
      alt: z.string().default(''),
      /** Placeholder text while there's no video. Aspect ratio comes from grid position. */
      placeholderLabel: z.string().default('Case Video'),
    }),
    /**
     * Position in the homepage Work grid (1 = the large first card). Size and
     * aspect ratio follow the position, not the entry (brief §2.4). null = not
     * on the homepage. The homepage shows the first 5.
     */
    homeOrder: z.number().int().positive().nullable().default(null),
    published: z.boolean().default(true),
    seo: seo.partial().optional(),
  }),
});

/* ---------------------------------------------------------- testimonials */
const testimonials = defineCollection({
  loader: file('./src/content/testimonials.yaml'),
  schema: ({ image }) =>
    z.object({
      /** Without surrounding quote marks; the component adds them. */
      quote: z.string().min(1),
      name: z.string().min(1),
      role: z.string().min(1),
      company: z.string().min(1),
      /** Hosted image URL (media is linked) or a local import. */
      logo: z.union([z.url(), image()]).optional(),
      /** Shown in the logo slot until a logo exists, and used as its alt text. */
      logoLabel: z.string().min(1),
      order: z.number().int(),
      published: z.boolean().default(true),
    }),
});

/* --------------------------------------------------------------- clients */
const clients = defineCollection({
  loader: file('./src/content/clients.yaml'),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1),
      /** Hosted image URL (media is linked) or a local import. */
      logo: z.union([z.url(), image()]).optional(),
      order: z.number().int(),
    }),
});

/* ------------------------------------------------------------------- faq */
const faq = defineCollection({
  loader: file('./src/content/faq.yaml'),
  schema: z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
    order: z.number().int(),
  }),
});

/* ------------------------------------------------------------------ jobs */
const jobs = defineCollection({
  loader: glob({ base: './src/content/jobs', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1),
    location: z.string().default('Remote'),
    type: z.enum(['full-time', 'part-time', 'contract']).default('full-time'),
    summary: z.string().min(1),
    order: z.number().int().default(0),
    published: z.boolean().default(true),
  }),
});

/* --------------------------------------------------------------- journal */
const journal = defineCollection({
  loader: glob({ base: './src/content/journal', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      description: z.string().min(1).max(170),
      date: z.coerce.date(),
      author: z.string().min(1),
      cover: image().optional(),
      coverAlt: z.string().default(''),
      draft: z.boolean().default(false),
    }),
});

/* -------------------------------------------------------------- services */
/** Service pages (nav dropdown + /services/[slug]). Placeholders until real services exist. */
const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    order: z.number().int(),
    published: z.boolean().default(true),
    seo: seo.partial().optional(),
  }),
});

/* ----------------------------------------------------------------- pages */
/** Inner pages (stubs for now): SEO + H1. The id is the route, e.g. "about". */
const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: ['*.json', '!home.json'] }),
  schema: z.object({
    seo: seo.extend({ noindex: z.boolean().default(true) }),
    heading: z.string().min(1),
  }),
});

/** Every homepage string, section by section, in prototype order. */
const linkSchema = z.object({ label: z.string().min(1), href: z.string().min(1) });

const home = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: 'home.json' }),
  schema: z.object({
    seo,
    hero: z.object({
      /** H1, one entry per line (lines never wrap). */
      headline: z.array(z.string().min(1)).min(1),
      /** Former second layer; not shown since the two-step hero (Claude Design). Kept for reuse. */
      problem: z.array(z.string().min(1)).min(1),
      /** Hero news stack (bottom-left): mini news / trust cards. Placeholders. */
      news: z
        .array(
          z.object({
            title: z.string().min(1),
            body: z.string().min(1),
            /** Accessible name of the arrow link. */
            cta: z.string().min(1),
            href: z.string().min(1),
            /** Thumbnail placeholder wash. */
            tint: z.enum(['sky', 'lavender', 'rose', 'mint', 'neutral']),
          }),
        )
        .min(1),
      reel: z.object({
        video: z.string().optional(),
        poster: z.string().optional(),
        alt: z.string().default('Precious Studio showreel'),
        placeholderLabel: z.string(),
      }),
    }),
    work: z.object({
      heading: z.string().min(1),
      subline: z.string().min(1),
      seeAll: linkSchema,
    }),
    clients: z.object({
      heading: z.string().min(1),
    }),
    team: z.object({
      heading: z.string().min(1),
      subline: z.string().min(1),
      coreRoles: z.array(z.string().min(1)).min(1),
      extendedRoles: z.array(z.string().min(1)).min(1),
      engine: z.string().min(1),
      benefits: z.array(z.string().min(1)).min(1),
      /** Placeholder shown instead of the diagram until the phase-2 design. */
      /** Small line above the engine in the hub, e.g. "Powered by". */
      engineLabel: z.string().min(1),
    }),
    approach: z.object({
      heading: z.string().min(1),
      /** Line under the heading (Claude Design). */
      subline: z.string().min(1),
      gates: z
        .array(
          z.object({
            situation: z.enum(situations),
            /** "Your designers are stretched thin." */
            pain: z.string().min(1),
            /** Shown after a decorative arrow: "Senior people join and ship with you." */
            result: z.string().min(1),
            /** Maps to the --gate-N-* component tokens. */
            tone: z.enum(['gate-1', 'gate-2', 'gate-3']),
            mediaLabel: z.string().default('Photo / Loop'),
            media: z.string().optional(),
            mediaAlt: z.string().default(''),
          }),
        )
        .min(1),
    }),
    process: z.object({
      heading: z.string().min(1),
      subline: z.string().min(1),
      agentPrompt: z.string().min(1),
      agentLink: linkSchema,
      steps: z.array(z.object({ title: z.string().min(1), body: z.string().min(1) })).min(1),
    }),
    faq: z.object({
      heading: z.string().min(1),
    }),
    /** Journal teasers (Claude Design): homepage section + the two cards in the full-page menu. Placeholders. */
    journal: z.object({
      heading: z.string().min(1),
      cta: linkSchema,
      cardCta: z.string().min(1),
      items: z
        .array(
          z.object({
            tag: z.string().min(1),
            title: z.string().min(1),
            /** Hosted image URL; placeholder stock photos until real posts exist. */
            image: z.string().optional(),
            href: z.string().min(1),
          }),
        )
        .min(1),
    }),
  }),
});

export const collections = {
  work,
  services,
  testimonials,
  clients,
  faq,
  jobs,
  journal,
  pages,
  home,
};
