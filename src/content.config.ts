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
  loader: glob({ base: './src/content/pages', pattern: ['*.json', '!home.json', '!brand.json'] }),
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
      /** What the one team produces: the chips on the funnel's output side (Claude Design). */
      outputs: z.array(z.string().min(1)).min(1),
      /** Not shown since the funnel redesign; kept for reuse. */
      benefits: z.array(z.string().min(1)).min(1),
      /** Not shown since the funnel redesign (no "Powered by"); kept for reuse. */
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
    /** The AI card (Claude Design). */
    process: z.object({
      heading: z.string().min(1),
      subline: z.string().min(1),
      /** Big number top-right; counts up from 0 when the card enters. */
      stat: z.object({ value: z.number(), suffix: z.string(), caption: z.string().min(1) }),
      /** Three numbered points. */
      points: z.array(z.string().min(1)).min(1),
      agentLink: linkSchema,
      /** Not shown since the AI card redesign; kept for reuse. */
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

/* ----------------------------------------------------------------- brand */
/**
 * /brand: the hidden brand and design-system page (decision 2026-09-30c).
 * Story and voice copy comes from the Brand Identity Guidelines PDF (pages 2 and 5);
 * design-system values are never written here, they are read from tokens.css.
 */
const brandSection = z.object({
  /** "04" */
  number: z.string().min(1),
  /** Short name, used in the eyebrow and the index: "Colour". */
  name: z.string().min(1),
  /** The section statement. */
  title: z.string().min(1),
  intro: z.string().optional(),
});
const labelled = z.object({ label: z.string().min(1), text: z.string().min(1) });

const brand = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: 'brand.json' }),
  schema: z.object({
    seo: seo.extend({ noindex: z.literal(true) }),
    title: z.string().min(1),
    tagline: z.string().min(1),
    story: brandSection.extend({
      lead: z.string().min(1),
      body: z.array(z.string().min(1)).min(1),
      positioning: labelled,
      facts: z.array(labelled).min(1),
    }),
    voice: brandSection.extend({
      voice: z.object({ label: z.string(), qualifier: z.string(), text: z.string() }),
      tone: z.object({
        label: z.string(),
        qualifier: z.string(),
        rows: z.array(z.object({ context: z.string(), tone: z.string() })).min(1),
      }),
      say: z.object({
        sayLabel: z.string(),
        dontLabel: z.string(),
        rows: z.array(z.tuple([z.string(), z.string()])).min(1),
      }),
      rules: z
        .array(
          z.object({
            title: z.string(),
            text: z.string().optional(),
            /** Words to cut, shown in italics after "Delete:". */
            cut: z.string().optional(),
            after: z.string().optional(),
          }),
        )
        .min(1),
      /** Prefix for the rules' word lists: "Delete:". */
      deleteLabel: z.string(),
      closing: z.object({ lead: z.string(), text: z.string() }),
      taglines: z.object({
        label: z.string(),
        primary: z.string(),
        alternatesLabel: z.string(),
        alternates: z.array(z.string()).min(1),
      }),
    }),
    logo: brandSection.extend({
      onPage: z.string(),
      onDark: z.string(),
      onWashes: z.string(),
      animated: labelled,
      downloads: z.object({
        label: z.string(),
        wordmark: z.string(),
        mark: z.string(),
        ink: z.string(),
        white: z.string(),
      }),
    }),
    colour: brandSection.extend({
      primitives: z.string(),
      /** Primitive groups, in order; `tokens` is the token-name prefix after "color-". */
      groups: z.array(z.object({ title: z.string(), tokens: z.array(z.string()).min(1) })).min(1),
      semantic: labelled,
      themes: z.object({ light: z.string(), dark: z.string() }),
    }),
    gradients: brandSection.extend({
      uses: z.string(),
    }),
    type: brandSection.extend({
      /** The large specimen glyphs: "Aa". */
      glyph: z.string(),
      families: z.object({ display: z.string(), sans: z.string() }),
      specimen: z.array(z.string()).min(1),
      weightsLabel: z.string(),
      rolesLabel: z.string(),
      /** Sample text per type role, keyed by the --text-* suffix. */
      samples: z.record(z.string(), z.string()),
    }),
    layout: brandSection.extend({
      grid: z.string(),
      breakpoints: z.string(),
      fluid: z.string(),
      spacing: z.string(),
      radius: z.string(),
      elevation: z.string(),
    }),
    components: brandSection.extend({
      buttons: z.string(),
      links: z.string(),
      tags: z.string(),
      card: z.string(),
      media: z.string(),
      icons: z.string(),
      disclosure: z.string(),
      samples: z.object({
        button: z.string(),
        textLink: z.string(),
        labelLink: z.string(),
        plainLink: z.string(),
        pill: z.string(),
        pillSolid: z.string(),
        cardTitle: z.string(),
        cardSummary: z.string(),
        cardCta: z.string(),
        media: z.string(),
        question: z.string(),
        answer: z.string(),
        iconLabels: z.object({ menu: z.string(), close: z.string(), next: z.string() }),
      }),
    }),
    motion: brandSection.extend({
      durations: z.string(),
      easings: z.string(),
      play: z.string(),
    }),
    ui: z.object({
      index: z.string(),
      theme: z.string(),
      copied: z.string(),
      copyHex: z.string(),
      copyToken: z.string(),
      copyCss: z.string(),
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
  brand,
};
