# Design tokens

All values live in [`src/styles/tokens.css`](../src/styles/tokens.css). This file is generated from it; if they ever disagree, tokens.css wins. Visual check: `/dev/tokens` (theme switcher and live contrast table).

## How the system works

- **Three tiers.** Primitives (raw values) → semantic tokens (meaning, remapped per theme) → component tokens (a few component-specific settings). Components use only semantic and component tokens, never primitives or hex codes.
- **Themes.** `light` is the default. `[data-theme="dark"]` (the Work stage) and `[data-theme="ink"]` (footer, process card) remap the semantic colour tokens.
- **Rebrand = token swap.** Change the primitives and the semantic mapping; components follow. Fonts: change `--font-family-display` and `--font-family-sans` (loaded from Google Fonts in `FontLinks.astro`). Colour and type follow the Brand Identity Guidelines v1.0; the page base is white.
- **Fluid values** interpolate between 320px and 1920px viewports with `clamp()`.
- **Breakpoints** can't be tokens inside `@media`; use these literal values: sm `30rem` (480), md `47.5rem` (760), lg `62rem` (992), xl `75rem` (1200), 2xl `98.75rem` (1580). Also exported from `src/styles/breakpoints.ts`.
- **Motion** tokens are read at runtime by `src/motion/tokens.ts`, so CSS is also the source for GSAP.
- **"Used in"** lists the files that read a token (dev pages excluded). "—" means it is only referenced by other tokens or reserved.

## Primitives and global tokens

| Token | Value | Note | Used in |
|---|---|---|---|
| `--color-white` | `#ffffff` |  | buttonFx, fullMenu |

### Slate: cool neutrals, biased blue-cyan. 25 = page, 100 = containers,

| Token | Value | Note | Used in |
|---|---|---|---|
| `--color-slate-25` | `#f6f9fb` |  | — |
| `--color-slate-50` | `#f4f8fa` |  | — |
| `--color-slate-100` | `#eef3f6` |  | buttonFx |
| `--color-slate-150` | `#e3ebf0` |  | — |
| `--color-slate-200` | `#dbe4ea` |  | — |
| `--color-slate-400` | `#9fb1bc` |  | — |
| `--color-slate-600` | `#566874` |  | — |
| `--color-slate-700` | `#3c4d58` |  | — |
| `--color-slate-800` | `#26333c` |  | — |
| `--color-slate-900` | `#141c22` |  | buttonFx, pageTransition |

### Wash: the soft brand hues. Pale fills, glows and pixel tints only;

| Token | Value | Note | Used in |
|---|---|---|---|
| `--color-wash-sky` | `#9ccfe4` |  | buttonFx, logoWings |
| `--color-wash-lavender` | `#dcc8f1` |  | logoWings |
| `--color-wash-rose` | `#f6c6d2` |  | buttonFx, logoWings |
| `--color-wash-mint` | `#d6f1de` |  | buttonFx, logoWings |
| `--color-wash-sage` | `#a7c3c3` |  | logoWings |
| `--color-wash-blush` | `#f2c3c6` |  | logoWings |
| `--color-wash-peach` | `#f7d9d2` |  | — |
| `--color-wash-lilac` | `#ead9f3` |  | — |

### Accents: the deep brand tones. Links, focus, small highlights.

| Token | Value | Note | Used in |
|---|---|---|---|
| `--color-accent-teal` | `#2f6f8f` |  | logoWings |
| `--color-accent-rose` | `#a4434f` |  | logoWings |
| `--color-accent-violet` | `#6a4fa3` |  | logoWings |

### Glow: saturated sky and pink, only as low-alpha light on Deep Ink (AI card).

| Token | Value | Note | Used in |
|---|---|---|---|
| `--color-glow-sky` | `#5eb8de` |  | — |
| `--color-glow-pink` | `#f08caa` |  | — |

### Status (product UI only; always pair with an icon or label)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--color-success` | `#1e7a52` |  | — |
| `--color-warning` | `#9a5b00` |  | — |
| `--color-error` | `#c0362c` |  | — |
| `--color-info` | `#2f5d84` |  | — |

### Type families (Google Fonts, loaded in FontLinks.astro)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--font-family-display` | `'Funnel Display', 'Helvetica Neue', Arial, sans-serif` |  | — |
| `--font-family-sans` | `'Funnel Sans', Helvetica, Arial, sans-serif` |  | — |
| `--font-family-code` | `ui-monospace, Menlo, Consolas, monospace` |  | — |

### Button hover: mint top-left, sky top-right, rose from below

| Token | Value | Note | Used in |
|---|---|---|---|
| `--wash-button` | `radial-gradient(82% 82% at 0% 0%, var(--color-wash-mint) 0%, transparent 100%), radial-gradient(82% 82% at 100% 0%, var(--color-wash-sky) 0%, transparent 100%), radial-gradient(82% 82% at 50% 120%, var(--color-wash-rose) 0%, transparent 100%), var(--color-slate-100)` |  | — |

### Starting-point media (Approach)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--wash-mint-sky` | `radial-gradient(120% 90% at 0% 0%, var(--color-wash-mint) 0%, transparent 60%), radial-gradient(120% 90% at 100% 0%, var(--color-wash-sky) 0%, transparent 60%), var(--color-slate-100)` |  | — |
| `--wash-blush-rose` | `radial-gradient(120% 90% at 0% 0%, var(--color-wash-peach) 0%, transparent 60%), radial-gradient(120% 90% at 100% 0%, var(--color-wash-blush) 0%, transparent 60%), var(--color-slate-100)` |  | — |
| `--wash-lavender` | `radial-gradient(120% 90% at 0% 0%, var(--color-wash-lavender) 0%, transparent 60%), radial-gradient(120% 90% at 100% 0%, var(--color-wash-lilac) 0%, transparent 60%), var(--color-slate-100)` |  | — |

### Team hub core

| Token | Value | Note | Used in |
|---|---|---|---|
| `--wash-hub` | `radial-gradient(45% 45% at 28% 30%, var(--color-wash-mint) 0%, transparent 100%), radial-gradient(45% 45% at 72% 30%, var(--color-wash-sky) 0%, transparent 100%), radial-gradient(50% 45% at 50% 78%, var(--color-wash-rose) 0%, transparent 100%), var(--color-slate-100)` |  | — |

### Rims and edge glows (team hub, output chips)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--wash-rim` | `conic-gradient(var(--color-wash-sky), var(--color-wash-lavender), var(--color-wash-rose), var(--color-wash-mint), var(--color-wash-sky))` |  | — |
| `--wash-edge` | `linear-gradient(90deg, var(--color-wash-sky), var(--color-wash-lavender), var(--color-wash-rose), var(--color-wash-mint), var(--color-wash-sky))` |  | — |

### AI card: sky and pink light from the top corners of the dark card

| Token | Value | Note | Used in |
|---|---|---|---|
| `--glow-ai` | `radial-gradient(70% 90% at 0% 0%, color-mix(in srgb, var(--color-glow-sky) 32%, transparent) 0%, color-mix(in srgb, var(--color-glow-sky) 10%, transparent) 35%, transparent 65%), radial-gradient(70% 90% at 100% 0%, color-mix(in srgb, var(--color-glow-pink) 28%, transparent) 0%, color-mix(in srgb, var(--color-glow-pink) 8%, transparent) 35%, transparent 65%)` |  | — |

### Grain: 4–6% monochrome noise over large gradient areas (anti-banding).

| Token | Value | Note | Used in |
|---|---|---|---|
| `--grain-image` | `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")` |  | MediaFrame |
| `--grain-opacity` | `0.05` |  | MediaFrame |

### TYPOGRAPHY (theme-independent), brand guideline §05.

| Token | Value | Note | Used in |
|---|---|---|---|
| `--font-display` | `var(--font-family-display)` |  | ApproachSection, ContentCard, CtaFooter, FaqSection, FullMenu, Hero, ProcessSection, RevealCard, SectionHeader, StubLayout, TeamSection, base |
| `--font-sans` | `var(--font-family-sans)` |  | Button, CtaFooter, MediaFrame, NewsStack, Pill, SectionHeader, SiteShell, Tag, TeamSection, TextLink, base |
| `--font-code` | `var(--font-family-code)` | dev pages only | — |

### Hero keeps the prototype's large sizes (decision 2026-09-29, phase 2).

| Token | Value | Note | Used in |
|---|---|---|---|
| `--text-hero` | `clamp(2.5rem, 7.5vw, 7.5rem)` | 40–120px, two lines (Claude Design) | Hero |
| `--text-problem` | `clamp(1.375rem, 6vw, 5rem)` | proto 22–80px, Display Light | — |
| `--text-closer` | `clamp(2.75rem, 2.4rem + 1.75vw, 4.5rem)` | Display 44 → 72: footer headline | CtaFooter |
| `--text-h1` | `clamp(2.25rem, 2rem + 1.25vw, 3.5rem)` | H1 36 → 56 | — |
| `--text-menu` | `clamp(2rem, 1.4rem + 2vw, 3.25rem)` | 32 → 52: full-page menu links | FullMenu |
| `--text-statement` | `clamp(1.75rem, 1.6rem + 0.75vw, 2.5rem)` | H2 28 → 40: section headings | ApproachSection, FaqSection, ProcessSection, SectionHeader, StubLayout, TeamSection |
| `--text-figure` | `clamp(2.25rem, 2.1rem + 0.75vw, 3rem)` | Statement 48 (big numbers) | — |
| `--text-title` | `clamp(1.375rem, 1.275rem + 0.5vw, 1.875rem)` | H3 22 → 30: card titles | ContentCard, RevealCard |
| `--text-quote` | `clamp(1.5rem, 1.3rem + 1vw, 2.5rem)` | Quote 24 → 40, Sans italic | — |
| `--text-large` | `clamp(1.125rem, 1.05rem + 0.375vw, 1.5rem)` | H4 18 → 24 | ClientsSection, TeamSection |
| `--text-note` | `1.5rem` | 24: team hub label (desktop) | — |
| `--text-medium` | `clamp(1.125rem, 1.1rem + 0.125vw, 1.25rem)` | Body L 20: sublines, quotes | FullMenu, ProcessSection, SectionHeader, StubLayout, TeamSection, TestimonialCard |
| `--text-body` | `1rem` | Body 16 (never below on mobile) | CtaFooter, Disclosure, Nav, NewsStack, RevealCard, TextLink, base, contact |
| `--text-small` | `0.875rem` | Small 14 | Nav, NewsStack |
| `--text-label` | `0.875rem` | Label 14: buttons, nav, pills | Button, ContentCard, Hero, Nav, Pill, SiteShell, TextLink |
| `--text-eyebrow` | `0.75rem` | Eyebrow 12, title case: tags, legal, section eyebrows | ContentCard, CtaFooter, MediaFrame, Nav, SectionHeader, Tag, TeamSection |
| `--text-micro` | `0.625rem` | 10: placeholder labels in small thumbnails | NewsStack |

### Weights: the scale ...

| Token | Value | Note | Used in |
|---|---|---|---|
| `--weight-light` | `300` |  | — |
| `--weight-regular` | `400` |  | — |
| `--weight-medium` | `500` |  | — |
| `--weight-semibold` | `600` |  | — |
| `--weight-display` | `var(--weight-regular)` | every Funnel Display style ... | ApproachSection, ContentCard, CtaFooter, FaqSection, FullMenu, Hero, ProcessSection, RevealCard, SectionHeader, StubLayout, TeamSection, base |
| `--weight-figure` | `var(--weight-semibold)` | ... except Statement (big numbers) | — |
| `--weight-body` | `var(--weight-regular)` | every Funnel Sans style ... | Nav, ProcessSection, TestimonialCard |
| `--weight-label` | `var(--weight-medium)` | ... except labels (all caps) | Button, ContentCard, Hero, Nav, NewsStack, Pill, SiteShell, TextLink |
| `--weight-eyebrow` | `var(--weight-regular)` |  | CtaFooter, MediaFrame, SectionHeader, Tag, TeamSection |
| `--tracking-hero` | `-0.03em` |  | Hero |
| `--tracking-problem` | `-0.03em` |  | — |
| `--tracking-closer` | `-0.03em` |  | CtaFooter |
| `--tracking-heading` | `-0.015em` | H2, menu | ApproachSection, FaqSection, FullMenu, ProcessSection, SectionHeader, StubLayout, TeamSection |
| `--tracking-title` | `-0.01em` | H3, H4 | ContentCard, RevealCard |
| `--tracking-body` | `0` |  | base |
| `--tracking-label` | `0.04em` | all caps needs a little air | Button, ContentCard, Hero, Nav, NewsStack, Pill, SiteShell, TextLink |
| `--tracking-eyebrow` | `0` | title case, no caps tracking | CtaFooter, MediaFrame, SectionHeader, Tag, TeamSection |
| `--leading-hero` | `1.02` | tight two-line hero (Claude Design) | Hero |
| `--leading-none` | `1` | single-line UI, problem line | Button, ClientsSection, ContentCard, CtaFooter, Hero, Nav, Pill, SectionHeader, Tag, TeamSection, TextLink |
| `--leading-closer` | `1.06` | 76 / 72 | CtaFooter |
| `--leading-heading` | `1.15` | H2 46 / 40 | ApproachSection, ContentCard, FaqSection, ProcessSection, RevealCard, SectionHeader, StubLayout, TeamSection, base |
| `--leading-large` | `1.25` | H4 30 / 24 | TeamSection |
| `--leading-menu` | `1.1` | full-page menu links | FullMenu |
| `--leading-tight` | `1.2` | hub label | — |
| `--leading-snug` | `1.3` | list titles (mega menu, news) | FullMenu, Nav, NewsStack |
| `--leading-compact` | `1.45` | small descriptions | Nav, NewsStack |
| `--leading-quote` | `1.2` | 48 / 40 | — |
| `--leading-medium` | `1.6` | Body L 32 / 20 | ProcessSection, SectionHeader, StubLayout, TeamSection, TestimonialCard |
| `--leading-body` | `1.625` | Body 26 / 16 | Disclosure, base |

### Measure: place with the grid, constrain with ch/em (brief §2.3).

| Token | Value | Note | Used in |
|---|---|---|---|
| `--measure-statement` | `34ch` |  | ProcessSection, SectionHeader, TeamSection |
| `--measure-subline` | `44ch` |  | SectionHeader, TeamSection |
| `--measure-quote` | `36em` |  | TestimonialCard |
| `--measure-closer` | `13ch` |  | CtaFooter |
| `--measure-card` | `34ch` | mega menu descriptions | Nav |
| `--measure-gate` | `40ch` | Approach description | — |
| `--measure-point` | `26ch` | AI card points | — |

### SPACING

| Token | Value | Note | Used in |
|---|---|---|---|
| `--space-0` | `0` |  | — |
| `--space-2` | `0.125rem` |  | Nav |
| `--space-4` | `0.25rem` |  | FullMenu, Nav, NewsStack, RevealCard, TestimonialCard |
| `--space-6` | `0.375rem` |  | ContentCard, Nav, Pill, Tag |
| `--space-8` | `0.5rem` |  | ClientsSection, ContentCard, CtaFooter, FullMenu, Nav, RevealCard, SiteShell, TeamSection, TextLink, contact |
| `--space-10` | `0.625rem` |  | Button, ContentCard, FullMenu, Hero, Nav, NewsStack, Pill, Tag, TeamSection, buttonFx |
| `--space-12` | `0.75rem` |  | ContentCard, Nav, NewsStack, ProcessSection, RevealCard, SectionHeader, SiteShell, TeamSection |
| `--space-14` | `0.875rem` |  | Button, Hero, Nav, Pill, ProcessSection |
| `--space-16` | `1rem` |  | Button, ClientsSection, ContentCard, CtaFooter, Disclosure, FullMenu, Hero, Nav, NewsStack, SiteShell |
| `--space-18` | `1.125rem` |  | Disclosure, ProcessSection, TeamSection |
| `--space-20` | `1.25rem` |  | FullMenu, Nav |
| `--space-22` | `1.375rem` |  | Button, RevealCard |
| `--space-24` | `1.5rem` |  | ClientTicker, CtaFooter, FaqSection, FullMenu, Nav, SectionHeader, TeamSection, contact |
| `--space-26` | `1.625rem` |  | — |
| `--space-28` | `1.75rem` |  | TestimonialCard |
| `--space-32` | `2rem` |  | CtaFooter, Nav, ProcessSection |
| `--space-34` | `2.125rem` |  | — |
| `--space-40` | `2.5rem` |  | ProcessSection |
| `--space-48` | `3rem` |  | CtaFooter, FullMenu, TestimonialCard |
| `--space-56` | `3.5rem` |  | — |
| `--space-64` | `4rem` |  | — |
| `--space-80` | `5rem` |  | CtaFooter |
| `--space-120` | `7.5rem` |  | — |

### ... and fluid layout roles from the brief (§2.10), 320px → 1920px.

| Token | Value | Note | Used in |
|---|---|---|---|
| `--gutter` | `clamp(1rem, 0.8rem + 1vw, 2rem)` | side padding 16 → 32 | ClientTicker, ClientsSection, CtaFooter, FullMenu, Hero, Nav, NewsStack, Section, fullMenu |
| `--grid-gap-col` | `clamp(1rem, 0.9rem + 0.5vw, 1.5rem)` | 16 → 24 | ApproachSection, FullMenu, Grid12, JournalSection, Nav, ProcessSection, WorkSection |
| `--grid-gap-row` | `clamp(3.375rem, 2.85rem + 2.625vw, 6rem)` | work rows 54 → 96 | Grid12, JournalSection, WorkSection |
| `--header-gap` | `clamp(2.625rem, 2.35rem + 1.375vw, 4rem)` | section header → content 42 → 64 | ApproachSection, Grid12, SectionHeader, TeamSection |
| `--section-gap` | `clamp(7.75rem, 6.9rem + 4.25vw, 12rem)` | between sections 124 → 192 | — |

### LAYOUT

| Token | Value | Note | Used in |
|---|---|---|---|
| `--grid-columns` | `12` |  | FullMenu, Grid12, Nav, WorkSection |
| `--section-py` | `calc(var(--section-gap) / 2)` | each side; two sections meet at one gap | CtaFooter, Section |
| `--section-py-tight` | `clamp(1.25rem, 3vw, 2.5rem)` | process card wrapper (prototype) | Section |
| `--inset-card` | `clamp(1.5rem, 3vw, 2.5rem)` | testimonial (prototype) | Nav, TestimonialCard |
| `--inset-panel` | `clamp(2rem, 6vw, 4.5rem)` | process card (prototype) | ProcessSection |
| `--nav-height` | `3.875rem` | brief header height ~62px; also the anchor offset | FullMenu, Hero, Nav, base, fullMenu, heroReveal, pageTransition |
| `--tap-min` | `2.75rem` | 44px touch target | Button, ClientsSection, Disclosure, Nav, Pill |
| `--gesture-swipe` | `36px` | minimum swipe that flips a card | newsStack |
| `--gesture-wheel` | `24px` | wheel travel that flips a card | newsStack |
| `--icon-button` | `2.5rem` | 40: square icon buttons (menu, close, card CTA) | ContentCard, IconButton, Nav, fullMenu |
| `--icon-button-sm` | `2rem` | 32: news card arrow | IconButton, NewsStack |
| `--icon-glyph` | `0.75rem` | 12: dots / close glyph inside an icon button | PixelIcon |
| `--button-fly-width` | `0.9375rem` | 15: hover butterfly | buttonFx |
| `--button-fly-height` | `0.75rem` | 12 | buttonFx |
| `--news-width` | `20rem` | 320: hero news stack | NewsStack |
| `--news-height` | `5.25rem` | 84 | NewsStack |
| `--news-thumb` | `4rem` | 64 | NewsStack |
| `--news-peek` | `8px` | each card behind sits this much lower … | NewsStack |
| `--news-scale-step` | `0.06` | … and this much smaller | NewsStack |
| `--news-fade-1` | `0.8` |  | NewsStack |
| `--news-fade-2` | `0.5` |  | NewsStack |
| `--team-max` | `87.5rem` | 1400: funnel width cap | — |
| `--nav-mini-at` | `68.75rem` | 1100: below this the nav is always collapsed (doc only; use literal in @media) | — |

### Radii (guideline: soft, never sharp, never blobby)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--radius-none` | `0` |  | — |
| `--radius-xs` | `0.25rem` | 4: buttons, dropdowns, chips, skip link | Button, ContentCard, IconButton, SiteShell, TeamSection |
| `--radius-sm` | `0.5rem` | 8 | Nav, NewsStack |
| `--radius-md` | `0.75rem` | 12: cards, media, the page sheet | ContentCard, MediaFrame, Nav, NewsStack, ProcessSection, RevealCard, SiteShell, TestimonialCard, heroReveal, nav |
| `--radius-lg` | `1.25rem` | 20 | — |
| `--radius-xl` | `1.375rem` | 22: team diagram bracket (prototype shape) | — |
| `--radius-pill` | `999px` | tags, pills | ClientsSection, ContentCard, Hero, Nav, Pill, Tag |

### Elevation: tinted with Deep Ink, never black

| Token | Value | Note | Used in |
|---|---|---|---|
| `--shadow-e1` | `0 1px 2px color-mix(in srgb, var(--color-slate-900) 8%, transparent)` | cards, chips | — |
| `--shadow-e2` | `0 4px 12px color-mix(in srgb, var(--color-slate-900) 8%, transparent)` | dropdowns | — |
| `--shadow-e3` | `0 16px 40px color-mix(in srgb, var(--color-slate-900) 14%, transparent)` | modals | — |

### Logo (the footer logo is sized by its grid columns, not a token)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--logo-height-nav` | `clamp(0.875rem, calc((100vw - 52rem) * 0.0443), 1.65rem)` | 14 → 26: fills the nav, shrinks so the links fit | FullMenu, Nav |

### Pixel icons: one grid cell = one unit, so icons stay on whole pixels

| Token | Value | Note | Used in |
|---|---|---|---|
| `--pixel-unit` | `0.125rem` | 2px: inline UI glyphs | PixelIcon |
| `--pixel-unit-lg` | `0.1875rem` | 3px: slider arrows, FAQ | PixelIcon |
| `--border-width` | `1px` |  | ClientsSection, ContentCard, CtaFooter, Disclosure, Pill, ProcessSection, Section, Tag, TeamSection, TextLink |
| `--focus-width` | `2px` |  | base |
| `--focus-offset` | `3px` |  | base |

### Blur (only these amounts)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--blur-glass` | `24px` | frosted cards over video | NewsStack |
| `--blur-edge` | `14px` | pixel edge on card media | ContentCard |
| `--blur-glow` | `10px` | chip edge glow | — |
| `--blur-halo` | `16px` | hub halo | — |
| `--blur-reel-max` | `57px` | hero reel blur at veil 1 (blur = veil × this) | Hero |
| `--glass-bg` | `color-mix(in srgb, var(--color-white) 62%, transparent)` |  | NewsStack |
| `--glass-saturate` | `1.3` |  | NewsStack |
| `--edge-fill` | `color-mix(in srgb, var(--color-white) 12%, transparent)` |  | ContentCard |
| `--stripe-size` | `8px` | placeholder stripe band | ContentCard, MediaFrame |
| `--stripe-size-sm` | `6px` |  | MediaFrame |

### MOTION (mirrored for GSAP in src/motion/tokens.ts; read at runtime)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` |  | ContentCard, FullMenu, Hero, Nav, NewsStack, SiteShell, gsap |
| `--ease-out-soft` | `cubic-bezier(0.2, 0.8, 0.2, 1)` |  | RevealCard, gsap |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | brief signature entrance ease | ContentCard, Nav, NewsStack, buttonFx, fullMenu, gsap |
| `--ease-linear` | `linear` |  | ClientTicker |
| `--ease-css` | `ease` | the prototype's nav colour transition | Nav |
| `--ease-emphasized` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | mega menu open, hub burst | nav |
| `--ease-snappy` | `cubic-bezier(0.2, 0, 0, 1)` | chevrons, link fills, press | FullMenu, Nav, buttonFx, nav |
| `--ease-exit` | `cubic-bezier(0.3, 0, 1, 1)` | accelerating exits | buttonFx, nav |
| `--ease-breathe` | `cubic-bezier(0.37, 0, 0.63, 1)` | ambient loops | — |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | symmetric reveals | — |
| `--dur-press` | `120ms` | button press | buttonFx |
| `--dur-fast` | `200ms` | hovers | ContentCard, buttonFx |
| `--dur-base` | `300ms` |  | Hero, NewsStack, RevealCard, disclosure, gsap |
| `--dur-reveal` | `450ms` |  | RevealCard |
| `--dur-link` | `160ms` | link hover fill | FullMenu, Nav |
| `--dur-chevron` | `240ms` |  | FullMenu, Nav, buttonFx |
| `--dur-nav-fade` | `320ms` |  | Nav, nav |
| `--dur-mega-in` | `380ms` |  | nav |
| `--dur-mega-out` | `200ms` |  | nav |
| `--dur-cascade-start` | `80ms` | mega menu: first item delay | nav |
| `--dur-cascade-column` | `50ms` | … added per column | nav |
| `--dur-cascade-item` | `25ms` | … and per item | nav |
| `--dur-stack-fade` | `400ms` | news stack card fade | NewsStack |
| `--dur-expand` | `420ms` | accordions, card CTA pill | ContentCard, FullMenu |
| `--dur-accordion-fade` | `280ms` | accordion content fade | FullMenu |
| `--dur-hover-intent` | `160ms` | mega menu stays open this long after the pointer leaves | nav |
| `--dur-collapse` | `560ms` | nav collapse, news stack slide, gate text | Nav, NewsStack |
| `--dur-theme` | `800ms` |  | Nav |
| `--dur-page` | `900ms` |  | SiteShell, themeSwitch |
| `--dur-rise` | `1s` | brief row rise-in, 0.8–1.2s | riseIn |
| `--dur-marquee` | `60s` |  | ClientTicker |

### Button hover: the gradient fades over the fill (exits faster)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--dur-fill-in` | `240ms` |  | — |
| `--dur-fill-out` | `160ms` |  | — |

### Pixel text (M13, ported from the parallel prototype): words pixelate

| Token | Value | Note | Used in |
|---|---|---|---|
| `--pixel-resolve` | `36 28 21 15 10 6 3` | first view: coarse → crisp | heroReveal |
| `--pixel-glitch` | `3 7 14 20 12 6 3` | idle: break into pixels and snap back | buttonGlitch, heroReveal |
| `--pixel-dissolve` | `3 7 14 20 28 36` | hero title out on the first scroll | heroReveal |
| `--pixel-ghost` | `0.18` | LCD ghost: the previous frame lingers at this opacity | logoWings, wing |
| `--dur-pixel-frame-in` | `70ms` |  | heroReveal |
| `--dur-pixel-frame-glitch` | `55ms` |  | buttonGlitch, heroReveal |
| `--dur-pixel-word-stagger` | `70ms` | word to word on resolve | heroReveal |
| `--dur-cta-stagger` | `40ms` | word to word on a CTA's idle glitch | buttonGlitch |
| `--dur-glitch-min` | `2.2s` | idle glitch every min + random(range) | buttonGlitch, heroReveal |
| `--dur-glitch-range` | `2.4s` |  | buttonGlitch, heroReveal |
| `--pixel-glitch-double` | `0.3` | chance a glitch hits two words | — |

### Butterfly logo: wing flap frames (8fps) and the hover colour ripple

| Token | Value | Note | Used in |
|---|---|---|---|
| `--dur-wing-frame` | `125ms` |  | buttonFx, logoWings |
| `--dur-logo-ripple` | `1500ms` |  | logoWings |

### Button hover bloom (canvas): cell size, frame length, frames

| Token | Value | Note | Used in |
|---|---|---|---|
| `--pixel-cell-button` | `6px` |  | buttonFx |
| `--dur-bloom-frame` | `40ms` |  | buttonFx, cardEdge |
| `--bloom-steps` | `10` |  | buttonFx |
| `--dur-fly-land` | `385ms` | hover butterfly lands (7 steps) | buttonFx |
| `--dur-fly-lift` | `275ms` | lifts off vertically (5 steps) | buttonFx |
| `--dur-fly-width` | `320ms` | label makes room for it | buttonFx |

### Card media pixel edge

| Token | Value | Note | Used in |
|---|---|---|---|
| `--pixel-cell-edge` | `16px` |  | cardEdge |
| `--dur-edge-frame` | `55ms` |  | cardEdge |

### FAQ +/× pixel swap

| Token | Value | Note | Used in |
|---|---|---|---|
| `--dur-icon-frame` | `55ms` |  | — |

### Canvas scenes: team funnel, AI card + footer rain

| Token | Value | Note | Used in |
|---|---|---|---|
| `--pixel-cell-flow` | `12px` |  | — |
| `--pixel-cell-rain` | `8px` |  | — |

### Hero: veil fade and the held first scroll

| Token | Value | Note | Used in |
|---|---|---|---|
| `--dur-veil` | `900ms` |  | Hero |
| `--dur-hero-lock` | `950ms` |  | heroReveal |
| `--dur-hero-word-stagger` | `60ms` | word to word as the title dissolves | heroReveal |
| `--dur-hero-return` | `420ms` | smooth scroll back to the top before the title resolves | heroReveal |
| `--dur-news-lock` | `480ms` | news stack: minimum time between wheel flips | newsStack |
| `--hero-inset-scroll` | `320` | px of scroll over which the reel shrinks into the padding | heroReveal |

### Autoplay

| Token | Value | Note | Used in |
|---|---|---|---|
| `--dur-autoplay` | `4s` | testimonials, hero news | newsStack |

### Nav logo collapse: the wordmark clips down to the butterfly once scrolled.

| Token | Value | Note | Used in |
|---|---|---|---|
| `--logo-mark-start` | `52.9%` | 401 / 758 | Nav |
| `--logo-mark-end-inset` | `39.3%` | (758 − 460.1) / 758 | Nav |
| `--logo-mark-scale` | `1.4` |  | Nav |
| `--dur-logo-collapse` | `450ms` |  | Nav |

### Butterfly wing transition: page changes, anchors and the full-page menu

| Token | Value | Note | Used in |
|---|---|---|---|
| `--pixel-cell-page` | `2rem` | 32px cells for the full-screen cover | wing |
| `--pixel-reveal-steps` | `6` |  | wing |
| `--pixel-feather` | `0.18` | soft leading edge of the wipe | wing |
| `--dur-page-cover` | `220ms` | old page covered (exit) | pageTransition |
| `--dur-page-hold` | `160ms` | fully covered | pageTransition |
| `--dur-page-reveal` | `320ms` | new page revealed (entrance) | pageTransition |
| `--dur-menu-open` | `300ms` |  | fullMenu |
| `--dur-menu-close` | `380ms` |  | fullMenu |
| `--dur-menu-item` | `460ms` | full-page menu links rise in | fullMenu |
| `--dur-menu-card` | `520ms` | full-page menu cards rise in | fullMenu |
| `--dur-menu-item-delay` | `120ms` |  | fullMenu |
| `--dur-menu-item-stagger` | `40ms` |  | fullMenu |
| `--dur-menu-card-delay` | `220ms` |  | fullMenu |
| `--dur-menu-card-stagger` | `80ms` |  | fullMenu |
| `--menu-rise` | `24px` | rise distance for menu links | fullMenu |
| `--menu-card-rise` | `32px` | … and cards | fullMenu |
| `--rise-distance` | `120px` | brief entrance pattern (Work cards) | riseIn |
| `--rise-distance-soft` | `40px` | journal cards | JournalSection |
| `--dur-rise-soft` | `700ms` |  | JournalSection |

### Feel controls (the Claude Design "Tweaks"; defaults as designed).

| Token | Value | Note | Used in |
|---|---|---|---|
| `--motion-tempo` | `1` | multiplies every pixel-motion duration: Calm 1.5 · Standard 1 · Lively 0.65 | tokens |
| `--hero-veil` | `0.75` | white veil over the hero reel at rest (0.4–0.95); reel blur = veil × 57px | Hero |
| `--pixel-tint` | `0.3` | share of transition edge pixels tinted with washes: Ink 0 · Subtle 0.3 · Full 0.8 | wing |
| `--dur-stagger` | `80ms` | left-to-right delay within a rising row (brief: 'small') | riseIn |
| `--hover-opacity` | `0.7` |  | ClientsSection, Nav, Pill, base |
| `--disabled-opacity` | `0.3` |  | ClientsSection |

### Testimonial slider (one card per "page", next card peeks)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--slide-gap` | `var(--space-10)` |  | ClientsSection |
| `--slide-width` | `min(82vw, 56.25rem)` | 900 | TestimonialCard |
| `--slide-min-height` | `27.5rem` | 440 | TestimonialCard |

### Client logo ticker (continuous, linear, full bleed)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--ticker-gap` | `var(--space-80)` |  | ClientTicker |
| `--ticker-py` | `clamp(5rem, 4rem + 4vw, 8rem)` | 80 → 128 around the ticker | ClientTicker |
| `--ticker-logo-height` | `1.75rem` | 28: logos scale to this height | ClientTicker |
| `--testimonial-logo-height` | `1.75rem` | 28 | TestimonialCard |
| `--testimonial-logo-max-width` | `12.5rem` | 200: the logo slot | TestimonialCard |

### Z-index scale

| Token | Value | Note | Used in |
|---|---|---|---|
| `--z-footer` | `0` |  | CtaFooter |
| `--z-below` | `-1` |  | — |
| `--z-page` | `1` |  | SiteShell |
| `--z-raised` | `1` | in-component layering | ContentCard, Hero |
| `--z-float` | `2` | hero news stack | NewsStack |
| `--z-nav` | `5` |  | Nav |
| `--z-dropdown` | `10` |  | — |
| `--z-menu` | `50` |  | FullMenu |
| `--z-skip` | `100` |  | SiteShell |
| `--z-cover` | `200` | page-transition pixel cover | SiteShell |

## Semantic colours: light (default)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--surface-page` | `var(--color-slate-25)` | cool near-white | CtaFooter, Section, base |
| `--surface-raised` | `var(--color-slate-100)` | testimonial card, containers | TestimonialCard |
| `--surface-muted` | `var(--color-slate-100)` | sunken surfaces | — |
| `--surface-hover` | `var(--color-slate-150)` | link hover fill (mega menu) | Nav |
| `--surface-overlay` | `var(--color-white)` | full-page menu | FullMenu |
| `--surface-inverse` | `var(--color-slate-900)` |  | base |
| `--text-primary` | `var(--color-slate-900)` | Deep Ink, never #000 | ContentCard, CtaFooter, FullMenu, Nav, base |
| `--text-secondary` | `var(--color-slate-600)` |  | ClientTicker, ContentCard, CtaFooter, Disclosure, FullMenu, Nav, NewsStack, SectionHeader, StubLayout, contact, utilities |
| `--text-tertiary` | `var(--color-slate-600)` |  | TeamSection |
| `--text-muted` | `var(--color-slate-600)` | lightest text that passes AA on the page | CtaFooter, TestimonialCard |
| `--text-on-inverse` | `var(--color-white)` |  | base |
| `--text-strong` | `var(--color-slate-900)` |  | — |
| `--border-subtle` | `var(--color-slate-200)` |  | CtaFooter, Section |
| `--border-default` | `var(--color-slate-200)` |  | Disclosure |
| `--border-strong` | `var(--color-slate-400)` |  | ClientsSection, Pill |
| `--link` | `var(--color-accent-teal)` |  | — |
| `--cta-bg` | `var(--color-slate-900)` | Deep Ink button | Button, IconButton, SiteShell |
| `--cta-fg` | `var(--color-white)` |  | Button, IconButton, SiteShell |
| `--focus-ring` | `var(--color-accent-teal)` |  | RevealCard, base |
| `--tag-border` | `var(--border-strong)` |  | ContentCard, Tag |
| `--placeholder-stripe-a` | `var(--color-slate-100)` |  | ContentCard, MediaFrame |
| `--placeholder-stripe-b` | `var(--color-slate-50)` |  | ContentCard, MediaFrame |
| `--placeholder-fg` | `var(--color-slate-600)` |  | ContentCard, MediaFrame, NewsStack |

## Semantic colours: ink (footer, process card)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--surface-page` | `var(--color-slate-900)` |  | CtaFooter, Section, base |
| `--surface-raised` | `var(--color-slate-800)` |  | TestimonialCard |
| `--surface-muted` | `var(--color-slate-800)` |  | — |
| `--surface-hover` | `var(--color-slate-800)` |  | Nav |
| `--surface-inverse` | `var(--color-white)` |  | base |
| `--text-primary` | `var(--color-slate-50)` |  | ContentCard, CtaFooter, FullMenu, Nav, base |
| `--text-secondary` | `var(--color-slate-400)` |  | ClientTicker, ContentCard, CtaFooter, Disclosure, FullMenu, Nav, NewsStack, SectionHeader, StubLayout, contact, utilities |
| `--text-tertiary` | `var(--color-slate-400)` |  | TeamSection |
| `--text-muted` | `var(--color-slate-400)` |  | CtaFooter, TestimonialCard |
| `--text-on-inverse` | `var(--color-slate-900)` |  | base |
| `--text-strong` | `var(--color-white)` |  | — |
| `--border-subtle` | `var(--color-slate-800)` |  | CtaFooter, Section |
| `--border-default` | `var(--color-slate-800)` |  | Disclosure |
| `--border-strong` | `color-mix(in srgb, var(--color-white) 70%, transparent)` |  | ClientsSection, Pill |
| `--link` | `var(--color-wash-sky)` |  | — |
| `--cta-bg` | `var(--color-white)` |  | Button, IconButton, SiteShell |
| `--cta-fg` | `var(--color-slate-900)` |  | Button, IconButton, SiteShell |
| `--focus-ring` | `var(--color-wash-sky)` |  | RevealCard, base |
| `--tag-border` | `var(--color-slate-700)` |  | ContentCard, Tag |
| `--placeholder-stripe-a` | `var(--color-slate-800)` |  | ContentCard, MediaFrame |
| `--placeholder-stripe-b` | `var(--color-slate-900)` |  | ContentCard, MediaFrame |
| `--placeholder-fg` | `var(--color-slate-400)` |  | ContentCard, MediaFrame, NewsStack |

## Component tokens

### Nav (Claude Design): text and buttons follow the page theme. The Services

| Token | Value | Note | Used in |
|---|---|---|---|
| `--nav-dropdown-bg` | `var(--color-slate-25)` |  | Nav |
| `--nav-dropdown-fg` | `var(--color-slate-900)` |  | Nav |
| `--nav-dropdown-note-bg` | `var(--color-slate-100)` |  | Nav |
| `--nav-badge-bg` | `var(--color-slate-900)` |  | Nav |
| `--nav-links-max` | `60rem` | collapse animates max-width from this to 0 | Nav |
| `--nav-cta-max` | `12rem` |  | Nav |
| `--nav-badge-fg` | `var(--color-white)` |  | Nav |

### Page wrapper (animated by the theme switch)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--page-bg` | `var(--color-slate-25)` |  | SiteShell, pageTransition |
| `--page-bg-dark` | `var(--color-slate-900)` |  | SiteShell, pageTransition |

### Gate cards (Approach): one soft wash per card, Deep Ink titles, grey

| Token | Value | Note | Used in |
|---|---|---|---|
| `--gate-media-fg` | `var(--color-slate-900)` |  | MediaFrame |
| `--gate-1-media` | `var(--wash-mint-sky)` |  | RevealCard |
| `--gate-2-media` | `var(--wash-blush-rose)` |  | RevealCard |
| `--gate-3-media` | `var(--wash-lavender)` |  | RevealCard |
| `--gate-1-bg` | `var(--color-slate-100)` |  | RevealCard |
| `--gate-1-fg` | `var(--color-slate-900)` |  | RevealCard |
| `--gate-1-pain` | `var(--color-slate-600)` |  | RevealCard |
| `--gate-2-bg` | `var(--color-slate-100)` |  | RevealCard |
| `--gate-2-fg` | `var(--color-slate-900)` |  | RevealCard |
| `--gate-2-pain` | `var(--color-slate-600)` |  | RevealCard |
| `--gate-3-bg` | `var(--color-slate-100)` |  | RevealCard |
| `--gate-3-fg` | `var(--color-slate-900)` |  | RevealCard |
| `--gate-3-pain` | `var(--color-slate-600)` |  | RevealCard |

### Team diagram (layout from the parallel prototype): numbered role chips →

| Token | Value | Note | Used in |
|---|---|---|---|
| `--team-col-max` | `22.5rem` | 360: each chip column | TeamSection |
| `--team-gap` | `clamp(1.25rem, 3vw, 3rem)` | 20 → 48: columns ↔ hub (wire length) | TeamSection |
| `--team-chip-height` | `3.25rem` | 52 | TeamSection |
| `--team-chip-bg` | `var(--color-white)` |  | TeamSection |
| `--team-chip-fg` | `var(--color-slate-900)` |  | TeamSection |
| `--team-chip-shadow` | `var(--shadow-e1)` |  | TeamSection |
| `--team-chip-number` | `var(--color-slate-600)` |  | TeamSection |
| `--team-benefit-border` | `var(--color-slate-200)` |  | TeamSection |
| `--team-benefit-marker` | `var(--color-slate-900)` |  | TeamSection |
| `--team-hub-size` | `clamp(9.375rem, 15vw, 11.875rem)` | 150 → 190 | TeamSection |
| `--team-hub-bg` | `var(--wash-hub)` |  | TeamSection |
| `--team-hub-fg` | `var(--color-slate-900)` |  | TeamSection |
| `--team-wire` | `color-mix(in srgb, var(--color-slate-600) 35%, transparent)` |  | TeamSection |

### Button hover: the soft wash that pixels in over the fill (M12)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--cta-hover-bg` | `var(--wash-button)` |  | Button, IconButton |
| `--cta-hover-fg` | `var(--color-slate-900)` |  | Button, IconButton, buttonFx |

### ContentCard: the CTA pill in the media corner stays light on any theme

| Token | Value | Note | Used in |
|---|---|---|---|
| `--card-cta-bg` | `var(--color-white)` |  | ContentCard |
| `--card-cta-fg` | `var(--color-slate-900)` |  | ContentCard |

### AI card (process section)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--process-bg` | `var(--color-slate-900)` |  | ProcessSection |
| `--process-fg` | `var(--color-slate-50)` |  | ProcessSection |
| `--process-rule` | `color-mix(in srgb, var(--color-white) 70%, transparent)` |  | ProcessSection |

### Hero (two-step): title and news cards sit on the veiled reel

| Token | Value | Note | Used in |
|---|---|---|---|
| `--hero-fg` | `var(--color-slate-900)` |  | Hero |
| `--hero-veil-bg` | `var(--color-white)` |  | Hero |
| `--news-thumb-sky` | `var(--color-wash-sky)` |  | — |
| `--news-thumb-lavender` | `var(--color-wash-lavender)` |  | — |
| `--news-thumb-rose` | `var(--color-wash-rose)` |  | — |
| `--news-thumb-mint` | `var(--color-wash-mint)` |  | — |
| `--news-thumb-neutral` | `var(--color-slate-150)` |  | — |

### Solid pill (showreel sound control sits on the reel, always light)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--pill-solid-bg` | `var(--color-white)` |  | Hero, Pill |
| `--pill-solid-fg` | `var(--color-slate-900)` |  | Hero, Pill |

### Testimonial logo slot

| Token | Value | Note | Used in |
|---|---|---|---|
| `--logo-stripe-a` | `var(--color-slate-150)` |  | MediaFrame |
| `--logo-stripe-b` | `var(--color-slate-100)` |  | MediaFrame |

