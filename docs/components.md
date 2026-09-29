# Components

Every component lives in `src/components/` and has a header comment listing its props, the tokens it reads and its motion hooks. That comment is the most detailed reference; this page is the map. Live examples: `/dev/tokens`.

**Rules for all components**
- Styles use tokens only (see [tokens.md](tokens.md)). No hex codes, no raw pixel values for colour, type, spacing, duration or easing.
- Copy comes from content or config (see [content.md](content.md)). Components never contain display text.
- Styles are wrapped in `@layer components` so the layer order (reset → tokens → base → components → utilities) holds.
- Motion is attached with `data-motion="…"` attributes, never styling classes (see [motion.md](motion.md)).

## Primitives (`src/components/primitives/`)

| Component | What it does | Props |
|---|---|---|
| `Section` | A page band: side gutter, vertical padding, optional theme | `id`, `theme` (`light` \| `dark` \| `ink`), `padding` (`default` \| `tight` \| `none`), `surface` (paint the theme background), `stage` (dark-section trigger for the theme switch), `divider`, `as`, `labelledby`, `class` |
| `Grid12` | The one layout grid: 12 columns, full width, no max-width | `rowGap` (`none` \| `grid` \| `header`), `as`, `class` |
| `GridItem` | A cell in `Grid12`; full width below its breakpoint | `span`, `start`, `from` (`md` \| `lg` \| `always`), `justify` (`start` \| `end`), `measure` (`statement` \| `subline` \| `quote`), `as`, `class` |
| `SectionHeader` | Three-zone header: optional eyebrow · statement (+ sub) · action on the right. Stacks below 992px | `headingId`, `headingLevel` (2 \| 3), `class`. Slots: `eyebrow`, default (statement), `sub`, `action` |
| `Stack` | Vertical flow with a token gap | `gap` (space token, e.g. `"16"`), `align`, `as`, `class` |
| `Cluster` | Wrapping horizontal row with a token gap | `gap`, `rowGap`, `justify`, `align`, `wrap`, `as`, `class` |

Layout principle (from the Afternow brief): place things with grid spans, and control line length with `measure`, never with a centred max-width wrapper.

## UI (`src/components/ui/`)

| Component | What it does | Props / variants |
|---|---|---|
| `Button` | Label-style text (Funnel Sans 500, all caps) and pixel ▸, 12px corners. Colours come from the theme (`--cta-bg/-fg`); on hover/focus the fill dissolves to the gradient in pixel steps (`pixelHover.ts`) | `size` (`sm` \| `md`), `glyph`, `href` (renders `<a>`), `type`, `track` (→ `data-track`), `external`, `class` |
| `TextLink` | Exploration link with a decorative → | `href`, `variant` (`underline` \| `label`), `arrow`, `track`, `external`, `class` |
| `Tag` | Outlined Eyebrow-style label for metadata (case study situation) | `as`, `class` |
| `Pill` | Rounded Label-style badge or small control | `variant` (`outline` \| `solid`), `as` (`span` \| `a` \| `button`), `href`, `class`, any attribute |
| `MediaFrame` | Video, image, or striped placeholder at a locked aspect ratio | `aspect` (`3/2`, `5/4`, `1/1`, `4/3`, `16/9`, `16/10`, `4/5`, `3/4`, `fill`), `tone` (`auto` \| `gradient` \| `logo`; `gradient` reads `--mf-gradient` from the parent), `label`, `video`, `poster`, `image`, `alt`, `rounded`. Slot: overlays |
| `RevealCard` | Gate card: media (brand gradient until videos arrive) + tinted panel; text reveals on hover/focus, shown open on touch | `tone` (`gate-1` \| `gate-2` \| `gate-3`), `title`, `pain`, `result`, `mediaLabel`, `media`, `mediaAlt` |
| `Disclosure` | FAQ item on native `<details>`; height animates via `disclosure.ts`; the pixel + swaps to × when open | `question`, `answer` |
| `ClientLogo` | A client logo at a fixed height (`--client-logo-height`, set by the parent), never cropped; hosted URL or local import | `src`, `alt`, `class` |
| `Logo` | The supplied logo, coloured by `currentColor`. The butterfly is drawn pixel by pixel (`data-logo-pixel`) for motion. Size it from the parent | `variant` (`wordmark` \| `mark`), `label`, `class` |
| `PixelIcon` | 8-bit icon from `pixelIcons.ts` (butterfly, play, arrow-right/-left, caret-down, plus, close); crisp edges, `currentColor`, whole-pixel sizes | `name`, `size` (`md` \| `lg`), `label`, `class` |

Aspect ratios accepted by `MediaFrame` are listed in `src/components/ui/media.ts`.

## Layout (`src/components/layout/`)

| Component | What it does |
|---|---|
| `SiteShell` | The document for every public page: layer order, brand fonts (`FontLinks`), `Seo`, skip link, page wrapper (`Nav` + `<main>`), `CtaFooter`, page router, motion boot. Props: SEO props. Slots: default, `head`, `jsonld` |
| `Seo` | Title, description, canonical, robots (`noindex`), Open Graph and Twitter tags |
| `Nav` | Sticky header: logo left; page links, Services dropdown (hover on mouse, click/keyboard everywhere), `New` badge, Book a call. Backdrop appears behind the links once scrolled. Links come from `src/config/navigation.ts`; dropdown items from the `services` collection |
| `MobileMenu` | Below 760px: Menu button + full-screen modal dialog. Services is an accordion. Focus trap, Esc, scroll lock, focus return |
| `CtaFooter` | Closing headline + Book a call, footer link columns, legal line, wordmark. Sticky reveal from 992px |
| `StubLayout` | Placeholder page: H1, "being rebuilt" line, link home. Props: `seo`, `heading`, `message`, `showBookCall` |

## Homepage sections (`src/components/home/`)

In page order. Each takes its copy from `src/content/pages/home.json` or a collection.

| Component | Content source | Notes |
|---|---|---|
| `Hero` | `home.hero` (headline, problem, reel) | Scroll sequence from 760px; in-flow stack on phones |
| `WorkSection` + `WorkCard` | `home.work`, `work` collection (first 5 by `homeOrder`) | Dark stage. Card size/aspect by position (`src/config/layout.ts`). Whole card clickable |
| `ClientsSection` + `TestimonialCard` | `home.clients`, `testimonials`, `clients` | Rating pill, testimonial slider with arrows, logo ticker, Book a call |
| `TeamSection` | `home.team` | Diagram (parallel prototype layout): 5 numbered role chips → Glasswing Sky hub with the pixel butterfly ("Powered by" + engine) → 3 outlined benefit chips with pixel markers; wires from lg; stacks below lg |
| `ApproachSection` | `home.approach.gates` | Three `RevealCard`s |
| `ProcessSection` | `home.process` | Black card, steps on the right |
| `FaqSection` | `home.faq`, `faq` collection | Heading cols 1–3, questions cols 4–12 |

## Adding a component

1. Put it in the folder that matches its role (primitive, ui, layout, home).
2. Start with a header comment: purpose, props, tokens, motion hooks.
3. Use only tokens; add a component token in `tokens.css` if a colour needs its own setting.
4. Wrap styles in `@layer components { … }`.
5. Add it to `/dev/tokens` if it's reusable.
