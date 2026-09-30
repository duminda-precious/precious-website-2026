# Adding and editing content

All text on the site lives in `src/content/` and `src/config/`. Edit those files; never edit components to change words.

**Check your work:** run `pnpm dev` and open `/dev/content` (every entry, raw) and the page itself. If a required field is missing or wrong, the dev server and `pnpm build` show an error naming the file and field.

**Conventions**
- The file name is the URL. `src/content/work/acme-app.md` → `/work/acme-app`. Use lowercase and hyphens.
- `order` sorts lists (1 first). `published: false` (or `draft: true` for journal posts) hides an entry everywhere.
- Placeholders stay in `[brackets]` so they're easy to spot.
- Text fields that contain `:`, `#`, `[` or start with a quote need quotes around them: `title: '[Project]'`.

## Add a case study

Create `src/content/work/<slug>.md`:

```md
---
title: Acme App
client: Acme
tag: redesign            # extend-my-team | redesign | build-from-zero
summary: A clunky onboarding → a first week people finish.
media:
  video: /media/acme.mp4 # optional; put the file in public/media/
  poster: /media/acme.jpg # optional, shown before the video plays
  alt: Acme app onboarding screens
homeOrder: 1             # 1–5 = position on the homepage; leave out to keep it off the homepage
published: true
---

Case study text goes here (shown on /work/<slug> once that page is designed).
```

- **Homepage:** the Work grid shows the 5 entries with the lowest `homeOrder`. Position sets the card size and shape: 1 is the large card, then 2 and 3 beside it, then 4 and 5 on the second row. Just change the numbers to reorder.
- **Its own page:** `/work/<slug>` is created automatically.
- **No video yet?** Keep the `media:` line anyway, as `media: {}`. The card shows the striped placeholder.
- **Tag labels** ("Redesign" etc.) come from `src/config/taxonomy.ts`.

## Add a testimonial

Add an entry to `src/content/testimonials.yaml`:

```yaml
- id: jane-doe
  quote: >-
    The quote, without quote marks. Long quotes can wrap
    over several lines like this.
  name: Jane Doe
  role: CTO
  company: Acme
  logoLabel: Acme          # shown until a logo exists; also the logo's alt text
  # logo: https://…/acme.png         # optional: a hosted URL, or a local file (../assets/logos/acme.svg)
  order: 4
```

## Add or change an FAQ

Edit `src/content/faq.yaml`:

```yaml
- id: timezones
  question: Do you work across time zones?
  answer: Yes. …
  order: 7
```

FAQs also feed the search-engine FAQ data later (Step 11).

## Client names (logo ticker)

Edit `src/content/clients.yaml` (`name`, `order`, optional `logo`). A logo is a hosted URL or a local file; it scales to the ticker height and is never cropped. `name` is its alt text, and shows as text when there is no logo.

**Media is linked, not copied.** Homepage videos, posters and logos currently point at the parallel prototype's deployment (`precious-homepage-preview-…vercel.app`). If that deployment goes away, the media breaks: move the files to a permanent host before launch.

**Fictional project:** `src/content/work/tidewell.md` is not a real client. It fills the fifth homepage slot until a real case study exists. Replace it before launch.

## Services (nav dropdown)

Each file in `src/content/services/` is one dropdown item and one page at `/services/<slug>`. Copy `service-1.md`, then change `title`, `summary` and `order`. Delete the `[Service N]` placeholders when real ones exist.

## Jobs and journal posts

- Jobs: copy `src/content/jobs/example-role.md` and set `published: true`. Pages appear at `/careers/<slug>`.
- Journal: copy `src/content/journal/example-post.md` and set `draft: false`. Pages appear at `/journal/<slug>`. To show Journal in the footer, set `showInFooter` to `true` (or remove it) for Journal in `src/config/navigation.ts`.

## Homepage copy

Every homepage string is in `src/content/pages/home.json`, section by section in page order: `hero`, `work`, `clients`, `team`, `approach`, `process`, `faq`. The hero headline and problem line are lists, one item per line.

## Page titles and descriptions (SEO)

Each page has a file in `src/content/pages/` (`about.json`, `contact.json`, …) with:

```json
{
  "seo": {
    "title": "About · Precious Studio",
    "description": "Under 170 characters.",
    "noindex": true
  },
  "heading": "About"
}
```

Set `"noindex": false` once the page has real content, so search engines index it.

## Site settings and navigation

- `src/config/site.ts`: name, location, **booking URL**, **email**, social links, Clutch rating. The booking URL and email are still placeholders.
- `src/config/navigation.ts`: top nav, the Services dropdown label, the `New` badge, Book a call (goes to `/contact`), footer columns.
- `src/config/ui.ts`: shared labels (menu, slider buttons, sound toggle, 404 message, footer headline).

## The brand page (`/brand`)

A hidden page (not linked, not indexed) that presents the brand and the design system. Its copy is in `src/content/pages/brand.json`: the story and voice text from the brand guidelines, each section's number, name, title and intro, the labels, and the sample text for type and components. Colours, gradients, type sizes, spacing and motion values are **not** in that file; the page reads them from `src/styles/tokens.css`, so changing a token updates the page.

## When to restart the dev server

Adding or editing entries updates live. After changing `src/content.config.ts` (the schemas) or `astro.config.mjs`, stop `pnpm dev` and start it again.
