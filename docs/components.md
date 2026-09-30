# Components

Every component lives in `src/components/` and has a header comment listing its props, the tokens it reads and its motion hooks. That comment is the most detailed reference; this page is the map. Live examples: `/dev/tokens`.

**Rules for all components**
- Styles use tokens only (see [tokens.md](tokens.md)). No hex codes, no raw pixel values for colour, type, spacing, duration or easing.
- Copy comes from content or config (see [content.md](content.md)). Components never contain display text.
- Styles are wrapped in `@layer components` so the layer order (reset → tokens → base → components → utilities) holds.
- Motion is attached with `data-*` attributes, never styling classes (see [motion.md](motion.md)).
- Type roles are shared classes in `base.css`: `.type-statement` (section headings), `.type-subline`, `.type-title` (card titles), `.type-label` (buttons, nav, pills), `.type-overline` (small caps). Components add layout only.
- One button size: every button and icon button is 40px (`--button-height`), 4px corners.

## Primitives (`src/components/primitives/`)

| Component | What it does | Props |
|---|---|---|
| `Section` | A page band: side gutter, vertical padding, optional theme | `id`, `theme` (`light` \| `dark` \| `ink`), `padding` (`default` \| `tight` \| `none`), `surface` (paint the theme background), `stage` (dark-section trigger for the theme switch), `divider`, `as`, `labelledby`, `class` |
| `Grid12` | The one layout grid: 12 columns, full width, no max-width | `rowGap` (`none` \| `grid` \| `header`), `as`, `class` |
| `GridItem` | A cell in `Grid12`; full width below its breakpoint | `span`, `start`, `from` (`md` \| `lg` \| `always`), `justify` (`start` \| `end`), `measure` (`statement` \| `subline` \| `quote`), `as`, `class` |
| `SectionHeader` | Three-zone header: optional eyebrow · statement (+ sub, + meta) · action on the right. Stacks below 992px | `headingId`, `headingLevel` (2 \| 3), `align` (`start` \| `center`), `class`, any attribute. Slots: `eyebrow`, default (statement), `sub`, `meta`, `action` |
| `Stack` | Vertical flow with a token gap | `gap` (space token, e.g. `"16"`), `align`, `as`, `class` |
| `Cluster` | Wrapping horizontal row with a token gap | `gap`, `rowGap`, `justify`, `align`, `wrap`, `as`, `class` |

Layout principle (from the Afternow brief): place things with grid spans, and control line length with `measure`, never with a centred max-width wrapper.

## UI (`src/components/ui/`)

| Component | What it does | Props / variants |
|---|---|---|
| `Button` | The one button: 40px (`--button-height`), 4px corners, `.type-label`, theme colours (`--cta-bg/-fg`; override them locally for a light button on video). Hover: pixel wash bloom + cursor noise + landing butterfly (buttonFx), label glitch; `cta` adds the idle glitch in view | `cta`, `fly`, `href`, `type`, `track`, `external`, `class` |
| `IconButton` | Square 40px icon-only button in the Button style: menu, close, slider and news arrows | `icon`, `label`, `href`, `type` |
| `ContentCard` | The one card for Work, Journal and the menu: media (video/image/placeholder), Tag, title, summary; pixel-edge hover and expanding CTA | `href`, `tag`, `title`, `summary`, `cta`, `video`, `poster`, `image`, `alt`, `placeholder`, `aspect`, `seed`, `headingLevel` |
| `TextLink` | Exploration link with a pixel arrow | `href`, `variant` (`underline` \| `label` \| `plain`: body text, arrow first), `arrow`, `track`, `external`, `class` |
| `Tag` | Outlined Eyebrow-style label for metadata (case study situation) | `as`, `class` |
| `Pill` | Rounded Label-style badge or small control | `variant` (`outline` \| `solid`), `as` (`span` \| `a` \| `button`), `href`, `class`, any attribute |
| `MediaFrame` | Video, image, or striped placeholder at a locked aspect ratio | `aspect` (`3/2`, `5/4`, `1/1`, `4/3`, `16/9`, `16/10`, `4/5`, `3/4`, `fill`), `tone` (`auto` \| `gradient` \| `logo`; `gradient` reads `--mf-gradient` from the parent), `label`, `video`, `poster`, `image`, `alt`, `rounded`. Slot: overlays |
| `Disclosure` | FAQ item on native `<details>`; height animates, + and × trade pixels (disclosure.ts); `group` opens one at a time | `question`, `answer`, `group` |
| `ClientLogo` | A client logo at a fixed height (`--client-logo-height`, set by the parent), never cropped; hosted URL or local import | `src`, `alt`, `class` |
| `Logo` | The logo in `currentColor`; the butterfly is one merged pixel path that flaps and ripples on hover (logoWings.ts, `data-logo-hover` on the parent) | `variant` (`wordmark` \| `mark`), `label`, `class` |
| `PixelIcon` | 8-bit icon from `pixelIcons.ts` (butterfly, play, arrow-right/-left, caret-down, plus, close); crisp edges, `currentColor`, whole-pixel sizes | `name`, `size` (`md` \| `lg`), `label`, `class` |

Aspect ratios accepted by `MediaFrame` are listed in `src/components/ui/media.ts`.

## Layout (`src/components/layout/`)

| Component | What it does |
|---|---|
| `SiteShell` | The document for every public page: layer order, brand fonts (`FontLinks`), `Seo`, skip link, page wrapper (`Nav` + `<main>`), `CtaFooter`, page router, motion boot. Props: SEO props. Slots: default, `head`, `jsonld` |
| `Seo` | Title, description, canonical, robots (`noindex`), Open Graph and Twitter tags |
| `Nav` | Sticky header, two states (rest / mini: butterfly + 4-dot button, always mini below 1100px), Services mega menu from `megaMenu` config. Renders `FullMenu` |
| `FullMenu` | Full-page menu: big links, Services accordion, Book a call + LinkedIn, two journal cards; butterfly wing open/close from the menu button |
| `CtaFooter` | Two-line closing headline + Book a call over the pixel rain, footer link columns, legal line, flapping wordmark. Sticky reveal from 992px |
| `StubLayout` | Placeholder page: H1, "being rebuilt" line, link home. Props: `seo`, `heading`, `message`, `showBookCall` |

## Homepage sections (`src/components/home/`)

In page order. Each takes its copy from `src/content/pages/home.json` or a collection.

| Component | Content source | Notes |
|---|---|---|
| `Hero` + `NewsStack` | `home.hero` (headline, reel, news) | Two-step hero (title → reel), news card stack bottom-left |
| `ClientTicker` | `clients` | Logo loop between the hero and Work |
| `WorkSection` | `home.work`, `work` collection (first 5 by `homeOrder`) | Dark stage. ContentCards sized by position (`src/config/layout.ts`); See our work button |
| `ClientsSection` + `TestimonialCard` | `home.clients`, `testimonials` | Clutch rating under the heading, Book a call top-right, endless testimonial loop with autoplay |
| `TeamSection` | `home.team` (roles, engine, outputs) | Funnel 2a: role chips → Personalised AI Engine → outputs, pixel flow canvas |
| `ApproachSection` | `home.approach` | Heading + line; sticky text panel left, stacked wash media cards right |
| `ProcessSection` (AI card) | `home.process` | Full-bleed Deep Ink band: heading, 50% stat, three points, AI Design Agent button, fixed glow + pixel rain |
| `FaqSection` | `home.faq`, `faq` collection | Heading cols 1–3, questions cols 4–12 |
| `JournalSection` | `home.journal` | What's Happening?: four ContentCards (placeholders) |

## Adding a component

1. Put it in the folder that matches its role (primitive, ui, layout, home).
2. Start with a header comment: purpose, props, tokens, motion hooks.
3. Use only tokens; add a component token in `tokens.css` if a colour needs its own setting.
4. Wrap styles in `@layer components { … }`.
5. Add it to `/dev/tokens` if it's reusable.
