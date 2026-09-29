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
| `--color-white` | `#ffffff` |  | — |

### Stone: warm neutrals. 100 = Chrysalis, 200 = Cocoon, 300 = Mist,

| Token | Value | Note | Used in |
|---|---|---|---|
| `--color-stone-50` | `#faf7f2` |  | — |
| `--color-stone-100` | `#f6f1e9` |  | — |
| `--color-stone-200` | `#efe7db` |  | — |
| `--color-stone-300` | `#e3d9cb` |  | — |
| `--color-stone-400` | `#b7aa9c` |  | — |
| `--color-stone-500` | `#8a7f74` |  | — |
| `--color-stone-600` | `#6b625a` |  | — |
| `--color-stone-700` | `#4f4741` |  | — |
| `--color-stone-800` | `#3a332e` |  | — |
| `--color-stone-900` | `#1c1714` |  | — |

### Apricot: primary. Never white text on it; never 500 as text.

| Token | Value | Note | Used in |
|---|---|---|---|
| `--color-apricot-50` | `#fef6f1` |  | — |
| `--color-apricot-100` | `#fcebdf` |  | — |
| `--color-apricot-200` | `#f9dac6` |  | — |
| `--color-apricot-300` | `#f6ccaf` |  | — |
| `--color-apricot-400` | `#f2b592` |  | — |
| `--color-apricot-500` | `#ec9f74` |  | — |
| `--color-apricot-600` | `#d07f52` |  | — |
| `--color-apricot-700` | `#9a5530` |  | — |
| `--color-apricot-800` | `#6e3b21` |  | — |
| `--color-apricot-900` | `#422313` |  | — |

### Morpho: expertise. Links, data, focus.

| Token | Value | Note | Used in |
|---|---|---|---|
| `--color-morpho-50` | `#f0f6fa` |  | — |
| `--color-morpho-100` | `#e1edf5` |  | — |
| `--color-morpho-200` | `#c3dbeb` |  | — |
| `--color-morpho-300` | `#9ec4dd` |  | — |
| `--color-morpho-400` | `#72a7cc` |  | — |
| `--color-morpho-500` | `#4a89b8` |  | — |
| `--color-morpho-600` | `#3b73a0` |  | — |
| `--color-morpho-700` | `#2f5d84` |  | — |
| `--color-morpho-800` | `#234766` |  | — |
| `--color-morpho-900` | `#173045` |  | — |

### Swallowtail: calm, research. 500 is large text / icons only.

| Token | Value | Note | Used in |
|---|---|---|---|
| `--color-swallowtail-50` | `#eaf7f2` |  | — |
| `--color-swallowtail-100` | `#ddf1e9` |  | — |
| `--color-swallowtail-200` | `#b3e0cf` |  | — |
| `--color-swallowtail-300` | `#7fc9af` |  | — |
| `--color-swallowtail-400` | `#45ac8b` |  | — |
| `--color-swallowtail-500` | `#12876a` |  | — |
| `--color-swallowtail-600` | `#0f7159` |  | — |
| `--color-swallowtail-700` | `#0e5c49` |  | — |
| `--color-swallowtail-800` | `#0b4336` |  | — |
| `--color-swallowtail-900` | `#072a22` |  | — |

### Sunset Moth: feeling. Sparingly, for delight.

| Token | Value | Note | Used in |
|---|---|---|---|
| `--color-sunset-50` | `#fdeef3` |  | — |
| `--color-sunset-100` | `#fae1eb` |  | — |
| `--color-sunset-200` | `#f4bcd2` |  | — |
| `--color-sunset-300` | `#ec90b3` |  | — |
| `--color-sunset-400` | `#e26496` |  | — |
| `--color-sunset-500` | `#d63f7c` |  | — |
| `--color-sunset-600` | `#b42a64` |  | — |
| `--color-sunset-700` | `#91214f` |  | — |
| `--color-sunset-800` | `#68193a` |  | — |
| `--color-sunset-900` | `#420f25` |  | — |

### Sage 700: headline emphasis words and notes.

| Token | Value | Note | Used in |
|---|---|---|---|
| `--color-sage-700` | `#4e7a3c` |  | — |

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

### GRADIENTS (brand guideline §04). Use subtly: big surfaces, accents,

| Token | Value | Note | Used in |
|---|---|---|---|
| `--gradient-glasswing-sky` | `linear-gradient(180deg, #f4f1ee 0%, #f6ccaf 40%, #90c1c5 72%, #66bfd6 100%)` | signature | — |
| `--gradient-morpho-shimmer` | `linear-gradient(180deg, #f4f1ee 0%, #d6e6ef 38%, #9ec4dd 70%, #4a89b8 100%)` | expertise | — |
| `--gradient-swallowtail` | `linear-gradient(180deg, #f4f1ee 0%, #ddebd6 38%, #a9d0ba 70%, #62a98c 100%)` | growth | — |
| `--gradient-sunset-moth` | `linear-gradient(180deg, #f4f1ee 0%, #f2bacd 34%, #f5cb9e 64%, #7fc4c4 100%)` | celebration, rare | — |

### Meshes: base + four radial points (x/y from top-left). Radii follow the

| Token | Value | Note | Used in |
|---|---|---|---|
| `--mesh-apricot-dawn` | `radial-gradient(60% 69% at 22% 10%, #f4f1ee 0%, #f4f1ee00 100%), radial-gradient(48% 55% at 82% 30%, #ec9f74 0%, #ec9f7400 100%), radial-gradient(52% 60% at 12% 92%, #66bfd6 0%, #66bfd600 100%), radial-gradient(52% 60% at 88% 90%, #9ea871 0%, #9ea87100 100%), #f6ccaf` |  | — |
| `--mesh-morpho-iridescence` | `radial-gradient(60% 69% at 82% 12%, #d6e6ef 0%, #d6e6ef00 100%), radial-gradient(48% 55% at 30% 40%, #72a7cc 0%, #72a7cc00 100%), radial-gradient(52% 60% at 74% 90%, #2f5d84 0%, #2f5d8400 100%), radial-gradient(52% 60% at 10% 90%, #90c1c5 0%, #90c1c500 100%), #4a89b8` |  | — |
| `--mesh-swallowtail-canopy` | `radial-gradient(60% 69% at 18% 82%, #b9de8c 0%, #b9de8c00 100%), radial-gradient(48% 55% at 70% 26%, #12876a 0%, #12876a00 100%), radial-gradient(52% 60% at 94% 94%, #072a22 0%, #072a2200 100%), radial-gradient(52% 60% at 42% 6%, #7fd3ee 0%, #7fd3ee00 100%), #0e5c49` |  | — |
| `--mesh-sunset-moth` | `radial-gradient(60% 69% at 22% 6%, #f4f1ee 0%, #f4f1ee00 100%), radial-gradient(48% 55% at 78% 30%, #f2bacd 0%, #f2bacd00 100%), radial-gradient(52% 60% at 24% 64%, #f5cb9e 0%, #f5cb9e00 100%), radial-gradient(52% 60% at 80% 94%, #7fc4c4 0%, #7fc4c400 100%), #f5cb9e` |  | — |
| `--mesh-pearl-haze` | `radial-gradient(60% 69% at 14% 18%, #f6c7ae 0%, #f6c7ae00 100%), radial-gradient(48% 55% at 84% 22%, #c3dbeb 0%, #c3dbeb00 100%), radial-gradient(52% 60% at 72% 88%, #f4bcd2 0%, #f4bcd200 100%), radial-gradient(52% 60% at 16% 86%, #ddf1e9 0%, #ddf1e900 100%), #f6f1e9` |  | — |
| `--mesh-metamorphosis` | `radial-gradient(60% 69% at 24% 26%, #9ec4dd 0%, #9ec4dd00 100%), radial-gradient(48% 55% at 52% 10%, #d63f7c 0%, #d63f7c00 100%), radial-gradient(52% 60% at 70% 66%, #ec9f74 0%, #ec9f7400 100%), radial-gradient(52% 60% at 92% 92%, #f6ccaf 0%, #f6ccaf00 100%), #4a89b8` |  | — |

### Grain: 4–6% monochrome noise over large gradient areas (anti-banding).

| Token | Value | Note | Used in |
|---|---|---|---|
| `--grain-image` | `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")` |  | MediaFrame |
| `--grain-opacity` | `0.05` |  | MediaFrame |

### TYPOGRAPHY (theme-independent), brand guideline §05.

| Token | Value | Note | Used in |
|---|---|---|---|
| `--font-display` | `var(--font-family-display)` |  | ApproachSection, CtaFooter, FaqSection, Hero, MobileMenu, ProcessSection, RevealCard, SectionHeader, StubLayout, TeamSection, WorkCard, base |
| `--font-sans` | `var(--font-family-sans)` |  | Button, CtaFooter, MediaFrame, MobileMenu, Nav, Pill, SectionHeader, SiteShell, Tag, TeamSection, TextLink, base |
| `--font-code` | `var(--font-family-code)` | dev pages only | — |

### Hero keeps the prototype's large sizes (decision 2026-09-29, phase 2).

| Token | Value | Note | Used in |
|---|---|---|---|
| `--text-hero` | `clamp(2.5rem, 9vw, 7.5rem)` | proto 40–120px, Display Light | Hero |
| `--text-problem` | `clamp(1.375rem, 6vw, 5rem)` | proto 22–80px, Display Light | Hero |
| `--text-closer` | `clamp(2.75rem, 2.4rem + 1.75vw, 4.5rem)` | Display 44 → 72: footer headline | CtaFooter |
| `--text-h1` | `clamp(2.25rem, 2rem + 1.25vw, 3.5rem)` | H1 36 → 56 | — |
| `--text-menu` | `2.25rem` | H1 mobile 36: mobile menu links | MobileMenu |
| `--text-statement` | `clamp(1.75rem, 1.6rem + 0.75vw, 2.5rem)` | H2 28 → 40: section headings | ApproachSection, FaqSection, ProcessSection, SectionHeader, StubLayout, TeamSection |
| `--text-figure` | `clamp(2.25rem, 2.1rem + 0.75vw, 3rem)` | Statement 48 (big numbers) | — |
| `--text-title` | `clamp(1.375rem, 1.275rem + 0.5vw, 1.875rem)` | H3 22 → 30: card titles | RevealCard, WorkCard |
| `--text-quote` | `clamp(1.5rem, 1.3rem + 1vw, 2.5rem)` | Quote 24 → 40, Sans italic | — |
| `--text-large` | `clamp(1.125rem, 1.05rem + 0.375vw, 1.5rem)` | H4 18 → 24 | ClientsSection, MobileMenu, TeamSection |
| `--text-note` | `1.5rem` | Note 24, Sans 500 Sage | — |
| `--text-medium` | `clamp(1.125rem, 1.1rem + 0.125vw, 1.25rem)` | Body L 20: sublines, quotes | ProcessSection, SectionHeader, StubLayout, TeamSection, TestimonialCard |
| `--text-body` | `1rem` | Body 16 (never below on mobile) | CtaFooter, Disclosure, RevealCard, TextLink, WorkCard, base, contact |
| `--text-small` | `0.875rem` | Small 14 | — |
| `--text-label` | `0.875rem` | Label 14: buttons, nav, pills | Button, MobileMenu, Nav, Pill, SiteShell, TextLink |
| `--text-eyebrow` | `0.75rem` | Eyebrow 12, title case: tags, legal, section eyebrows | CtaFooter, MediaFrame, MobileMenu, Nav, SectionHeader, Tag, TeamSection |

### Weights: the scale ...

| Token | Value | Note | Used in |
|---|---|---|---|
| `--weight-light` | `300` |  | — |
| `--weight-regular` | `400` |  | — |
| `--weight-medium` | `500` |  | — |
| `--weight-semibold` | `600` |  | — |
| `--weight-display` | `var(--weight-regular)` | every Funnel Display style ... | ApproachSection, CtaFooter, FaqSection, Hero, MobileMenu, ProcessSection, RevealCard, SectionHeader, StubLayout, TeamSection, WorkCard, base |
| `--weight-figure` | `var(--weight-semibold)` | ... except Statement (big numbers) | — |
| `--weight-emphasis` | `var(--weight-regular)` | headline emphasis word (Sage colour) | base |
| `--weight-body` | `var(--weight-regular)` | every Funnel Sans style ... | ProcessSection, TestimonialCard |
| `--weight-label` | `var(--weight-medium)` | ... except labels (all caps) | Button, MobileMenu, Nav, Pill, SiteShell, TextLink |
| `--weight-eyebrow` | `var(--weight-regular)` |  | CtaFooter, MediaFrame, MobileMenu, Nav, SectionHeader, Tag, TeamSection |
| `--tracking-hero` | `-0.03em` |  | Hero |
| `--tracking-problem` | `-0.03em` |  | Hero |
| `--tracking-closer` | `-0.03em` |  | CtaFooter |
| `--tracking-heading` | `-0.015em` | H2, menu | ApproachSection, FaqSection, MobileMenu, ProcessSection, SectionHeader, StubLayout, TeamSection |
| `--tracking-title` | `-0.01em` | H3, H4 | MobileMenu, RevealCard, WorkCard |
| `--tracking-body` | `0` |  | base |
| `--tracking-label` | `0.04em` | all caps needs a little air | Button, MobileMenu, Nav, Pill, SiteShell, TextLink |
| `--tracking-eyebrow` | `0` | title case, no caps tracking | CtaFooter, MediaFrame, MobileMenu, Nav, SectionHeader, Tag, TeamSection |
| `--leading-hero` | `1.1` | 88 / 80 | Hero |
| `--leading-none` | `1` | single-line UI, problem line | Button, ClientsSection, CtaFooter, Hero, MobileMenu, Nav, Pill, SectionHeader, Tag, TeamSection, TextLink |
| `--leading-closer` | `1.06` | 76 / 72 | CtaFooter |
| `--leading-heading` | `1.15` | H2 46 / 40 | ApproachSection, FaqSection, MobileMenu, ProcessSection, RevealCard, SectionHeader, StubLayout, TeamSection, WorkCard, base |
| `--leading-large` | `1.25` | H4 30 / 24 | TeamSection |
| `--leading-quote` | `1.2` | 48 / 40 | — |
| `--leading-medium` | `1.6` | Body L 32 / 20 | ProcessSection, SectionHeader, StubLayout, TeamSection, TestimonialCard |
| `--leading-body` | `1.625` | Body 26 / 16 | Disclosure, WorkCard, base |

### Measure: place with the grid, constrain with ch/em (brief §2.3).

| Token | Value | Note | Used in |
|---|---|---|---|
| `--measure-statement` | `34ch` |  | ProcessSection, SectionHeader, TeamSection |
| `--measure-subline` | `44ch` |  | SectionHeader, TeamSection |
| `--measure-quote` | `36em` |  | TestimonialCard |
| `--measure-closer` | `13ch` |  | CtaFooter |

### SPACING

| Token | Value | Note | Used in |
|---|---|---|---|
| `--space-0` | `0` |  | — |
| `--space-2` | `0.125rem` |  | — |
| `--space-4` | `0.25rem` |  | MobileMenu, Nav, RevealCard, TestimonialCard |
| `--space-6` | `0.375rem` |  | MobileMenu, Nav, Pill, Tag, WorkCard |
| `--space-8` | `0.5rem` |  | Button, ClientsSection, CtaFooter, MobileMenu, Nav, RevealCard, SiteShell, TeamSection, TextLink, contact |
| `--space-10` | `0.625rem` |  | Button, Pill, Tag, TeamSection |
| `--space-12` | `0.75rem` |  | MobileMenu, ProcessSection, RevealCard, SectionHeader, SiteShell, TeamSection, WorkCard |
| `--space-14` | `0.875rem` |  | Button, Pill, ProcessSection |
| `--space-16` | `1rem` |  | Button, ClientsSection, CtaFooter, Disclosure, Hero, MobileMenu, Nav, SiteShell |
| `--space-18` | `1.125rem` |  | Disclosure, ProcessSection, TeamSection |
| `--space-20` | `1.25rem` |  | — |
| `--space-22` | `1.375rem` |  | Button, RevealCard |
| `--space-24` | `1.5rem` |  | ClientsSection, CtaFooter, FaqSection, MobileMenu, Nav, SectionHeader, TeamSection, contact |
| `--space-26` | `1.625rem` |  | — |
| `--space-28` | `1.75rem` |  | TestimonialCard |
| `--space-32` | `2rem` |  | CtaFooter, ProcessSection |
| `--space-34` | `2.125rem` |  | — |
| `--space-40` | `2.5rem` |  | Hero, MobileMenu, ProcessSection |
| `--space-48` | `3rem` |  | CtaFooter, TestimonialCard |
| `--space-56` | `3.5rem` |  | ClientsSection |
| `--space-64` | `4rem` |  | — |
| `--space-80` | `5rem` |  | CtaFooter |
| `--space-120` | `7.5rem` |  | — |

### ... and fluid layout roles from the brief (§2.10), 320px → 1920px.

| Token | Value | Note | Used in |
|---|---|---|---|
| `--gutter` | `clamp(1rem, 0.8rem + 1vw, 2rem)` | side padding 16 → 32 | ClientsSection, CtaFooter, Hero, MobileMenu, Nav, Section |
| `--grid-gap-col` | `clamp(1rem, 0.9rem + 0.5vw, 1.5rem)` | 16 → 24 | ApproachSection, Grid12, ProcessSection, WorkSection |
| `--grid-gap-row` | `clamp(3.375rem, 2.85rem + 2.625vw, 6rem)` | work rows 54 → 96 | Grid12, WorkSection |
| `--header-gap` | `clamp(2.625rem, 2.35rem + 1.375vw, 4rem)` | section header → content 42 → 64 | ApproachSection, Grid12, SectionHeader, TeamSection |
| `--section-gap` | `clamp(7.75rem, 6.9rem + 4.25vw, 12rem)` | between sections 124 → 192 | — |

### LAYOUT

| Token | Value | Note | Used in |
|---|---|---|---|
| `--grid-columns` | `12` |  | Grid12, WorkSection |
| `--section-py` | `calc(var(--section-gap) / 2)` | each side; two sections meet at one gap | CtaFooter, Hero, Section |
| `--section-py-tight` | `clamp(1.25rem, 3vw, 2.5rem)` | process card wrapper (prototype) | Section |
| `--inset-card` | `clamp(1.5rem, 3vw, 2.5rem)` | testimonial (prototype) | TestimonialCard |
| `--inset-panel` | `clamp(2rem, 6vw, 4.5rem)` | process card (prototype) | ProcessSection |
| `--hero-scroll` | `400vh` |  | Hero |
| `--nav-height` | `3.875rem` | brief header height ~62px; also the anchor offset | Hero, Nav, base |
| `--tap-min` | `2.75rem` | 44px touch target | Button, ClientsSection, Disclosure, MobileMenu, Nav, Pill |

### Radii (guideline: soft, never sharp, never blobby)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--radius-none` | `0` |  | — |
| `--radius-xs` | `0.25rem` | 4 | — |
| `--radius-sm` | `0.5rem` | 8: small UI details (skip link) | SiteShell |
| `--radius-md` | `0.75rem` | 12: buttons, inputs, dropdowns | Button, Nav, TeamSection |
| `--radius-lg` | `1.25rem` | 20: cards, media, the page sheet | Hero, MediaFrame, ProcessSection, RevealCard, SiteShell, TestimonialCard, hero |
| `--radius-xl` | `1.375rem` | 22: team diagram bracket (prototype shape) | — |
| `--radius-pill` | `999px` | tags, pills | ClientsSection, MobileMenu, Nav, Pill, Tag |

### Elevation: tinted with Deep Ink, never black

| Token | Value | Note | Used in |
|---|---|---|---|
| `--shadow-e1` | `0 1px 2px rgb(28 23 20 / 0.08)` | cards | — |
| `--shadow-e2` | `0 4px 12px rgb(28 23 20 / 0.08)` | dropdowns | — |
| `--shadow-e3` | `0 16px 40px rgb(28 23 20 / 0.14)` | modals | — |

### Logo (the footer logo is sized by its grid columns, not a token)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--logo-height-nav` | `clamp(0.875rem, 0.825rem + 0.25vw, 1.125rem)` | 14 → 18 | MobileMenu, Nav |

### Pixel icons: one grid cell = one unit, so icons stay on whole pixels

| Token | Value | Note | Used in |
|---|---|---|---|
| `--pixel-unit` | `0.125rem` | 2px: inline UI glyphs | PixelIcon |
| `--pixel-unit-lg` | `0.1875rem` | 3px: slider arrows, FAQ | PixelIcon |
| `--border-width` | `1px` |  | ClientsSection, CtaFooter, Disclosure, MobileMenu, Nav, Pill, ProcessSection, Section, Tag, TeamSection, TextLink, WorkCard |
| `--stripe-size` | `8px` | placeholder stripe band | MediaFrame |
| `--stripe-size-sm` | `6px` |  | MediaFrame |

### MOTION (mirrored for GSAP in src/motion/tokens.ts; read at runtime)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` |  | MobileMenu, Nav, SiteShell, gsap, tokens |
| `--ease-out-soft` | `cubic-bezier(0.2, 0.8, 0.2, 1)` |  | RevealCard, gsap, tokens |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | brief signature entrance ease | gsap, tokens |
| `--ease-linear` | `linear` |  | ClientsSection |
| `--ease-css` | `ease` | the prototype's nav colour transition | Nav |
| `--dur-fast` | `200ms` | hovers | MobileMenu, Nav, tokens |
| `--dur-base` | `300ms` |  | MobileMenu, RevealCard, SiteShell, disclosure, gsap, tokens |
| `--dur-reveal` | `450ms` |  | RevealCard, tokens |
| `--dur-theme` | `800ms` |  | Nav, tokens |
| `--dur-page` | `900ms` |  | SiteShell, tokens |
| `--dur-rise` | `1s` | brief row rise-in, 0.8–1.2s | riseIn, tokens |
| `--dur-marquee` | `60s` |  | ClientsSection, tokens |

### Pixel dissolve (8-bit motion): cells appear in shuffled batches, no tweening

| Token | Value | Note | Used in |
|---|---|---|---|
| `--dur-pixel` | `240ms` | whole dissolve | pixelHover, tokens |
| `--pixel-steps` | `5` | batches: fewer = chunkier | pixelHover, tokens |
| `--pixel-cell` | `0.375rem` | 6px cells | pixelHover, tokens |
| `--rise-distance` | `120px` | brief entrance pattern | riseIn |
| `--dur-stagger` | `80ms` | left-to-right delay within a rising row (brief: 'small') | riseIn, tokens |
| `--hover-opacity` | `0.7` |  | ClientsSection, MobileMenu, Nav, Pill, WorkCard, base |
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
| `--ticker-gap` | `var(--space-80)` |  | ClientsSection |
| `--ticker-logo-height` | `1.75rem` | 28: logos scale to this height | ClientsSection |
| `--testimonial-logo-height` | `1.75rem` | 28 | TestimonialCard |
| `--testimonial-logo-max-width` | `12.5rem` | 200: the logo slot | TestimonialCard |

### Z-index scale

| Token | Value | Note | Used in |
|---|---|---|---|
| `--z-footer` | `0` |  | CtaFooter |
| `--z-page` | `1` |  | SiteShell |
| `--z-nav` | `5` |  | Nav |
| `--z-dropdown` | `10` |  | Nav |
| `--z-menu` | `50` |  | — |
| `--z-skip` | `100` |  | SiteShell |

## Semantic colours: light (default)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--surface-page` | `var(--color-white)` | very white, minimal (Duminda) | CtaFooter, MobileMenu, Section, base |
| `--surface-raised` | `var(--color-stone-50)` | testimonial card | TestimonialCard |
| `--surface-muted` | `var(--color-stone-200)` | Cocoon: sunken surfaces, team chips | — |
| `--surface-inverse` | `var(--color-stone-900)` |  | base |
| `--text-primary` | `var(--color-stone-900)` | Deep Ink, never #000 | CtaFooter, MobileMenu, base |
| `--text-secondary` | `var(--color-stone-600)` | Stone | ClientsSection, CtaFooter, Disclosure, MobileMenu, SectionHeader, StubLayout, WorkCard, contact, utilities |
| `--text-tertiary` | `var(--color-stone-600)` |  | TeamSection |
| `--text-muted` | `var(--color-stone-600)` | lightest text that passes AA on white | CtaFooter, TestimonialCard |
| `--text-on-inverse` | `var(--color-white)` |  | base |
| `--text-strong` | `var(--color-stone-900)` |  | — |
| `--border-subtle` | `var(--color-stone-200)` |  | CtaFooter, Section |
| `--border-default` | `var(--color-stone-300)` | Mist | Disclosure |
| `--border-strong` | `var(--color-stone-400)` |  | ClientsSection, Pill |

### Headline emphasis word: Light 300 in Sage 700

| Token | Value | Note | Used in |
|---|---|---|---|
| `--accent` | `var(--color-sage-700)` |  | base |
| `--link` | `var(--color-morpho-600)` |  | — |
| `--cta-bg` | `var(--color-stone-900)` | Deep Ink button | Button, SiteShell |
| `--cta-fg` | `var(--color-white)` |  | Button, SiteShell |
| `--focus-ring` | `var(--color-morpho-600)` |  | RevealCard, WorkCard, base |
| `--tag-border` | `var(--border-strong)` |  | Tag |
| `--placeholder-stripe-a` | `var(--color-stone-100)` |  | MediaFrame |
| `--placeholder-stripe-b` | `var(--color-stone-50)` |  | MediaFrame |
| `--placeholder-fg` | `var(--color-stone-600)` |  | MediaFrame |

## Semantic colours: dark (Work stage)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--surface-page` | `var(--color-stone-900)` |  | CtaFooter, MobileMenu, Section, base |
| `--surface-raised` | `var(--color-stone-800)` |  | TestimonialCard |
| `--surface-muted` | `var(--color-stone-800)` |  | — |
| `--surface-inverse` | `var(--color-stone-50)` |  | base |
| `--text-primary` | `var(--color-stone-50)` |  | CtaFooter, MobileMenu, base |
| `--text-secondary` | `var(--color-stone-400)` |  | ClientsSection, CtaFooter, Disclosure, MobileMenu, SectionHeader, StubLayout, WorkCard, contact, utilities |
| `--text-tertiary` | `var(--color-stone-400)` |  | TeamSection |
| `--text-muted` | `var(--color-stone-400)` |  | CtaFooter, TestimonialCard |
| `--text-on-inverse` | `var(--color-stone-900)` |  | base |
| `--text-strong` | `var(--color-white)` |  | — |
| `--border-subtle` | `var(--color-stone-800)` |  | CtaFooter, Section |
| `--border-default` | `var(--color-stone-800)` |  | Disclosure |
| `--border-strong` | `var(--color-stone-700)` |  | ClientsSection, Pill |
| `--accent` | `var(--color-stone-50)` |  | base |
| `--link` | `var(--color-morpho-300)` |  | — |
| `--cta-bg` | `var(--color-stone-50)` |  | Button, SiteShell |
| `--cta-fg` | `var(--color-stone-900)` |  | Button, SiteShell |
| `--focus-ring` | `var(--color-morpho-300)` |  | RevealCard, WorkCard, base |
| `--tag-border` | `var(--color-stone-600)` |  | Tag |
| `--placeholder-stripe-a` | `var(--color-stone-800)` |  | MediaFrame |
| `--placeholder-stripe-b` | `var(--color-stone-900)` |  | MediaFrame |
| `--placeholder-fg` | `var(--color-stone-400)` |  | MediaFrame |

## Semantic colours: ink (footer, process card)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--surface-page` | `var(--color-stone-900)` |  | CtaFooter, MobileMenu, Section, base |
| `--surface-raised` | `var(--color-stone-800)` |  | TestimonialCard |
| `--surface-muted` | `var(--color-stone-800)` |  | — |
| `--surface-inverse` | `var(--color-white)` |  | base |
| `--text-primary` | `var(--color-stone-50)` |  | CtaFooter, MobileMenu, base |
| `--text-secondary` | `var(--color-stone-400)` |  | ClientsSection, CtaFooter, Disclosure, MobileMenu, SectionHeader, StubLayout, WorkCard, contact, utilities |
| `--text-tertiary` | `var(--color-stone-400)` |  | TeamSection |
| `--text-muted` | `var(--color-stone-400)` |  | CtaFooter, TestimonialCard |
| `--text-on-inverse` | `var(--color-stone-900)` |  | base |
| `--text-strong` | `var(--color-white)` |  | — |
| `--border-subtle` | `var(--color-stone-800)` |  | CtaFooter, Section |
| `--border-default` | `var(--color-stone-800)` |  | Disclosure |
| `--border-strong` | `rgb(255 255 255 / 0.7)` |  | ClientsSection, Pill |
| `--accent` | `var(--color-stone-50)` |  | base |
| `--link` | `var(--color-morpho-300)` |  | — |
| `--cta-bg` | `var(--color-white)` |  | Button, SiteShell |
| `--cta-fg` | `var(--color-stone-900)` |  | Button, SiteShell |
| `--focus-ring` | `var(--color-morpho-300)` |  | RevealCard, WorkCard, base |
| `--tag-border` | `var(--color-stone-600)` |  | Tag |
| `--placeholder-stripe-a` | `var(--color-stone-800)` |  | MediaFrame |
| `--placeholder-stripe-b` | `var(--color-stone-900)` |  | MediaFrame |
| `--placeholder-fg` | `var(--color-stone-400)` |  | MediaFrame |

## Component tokens

### Nav (brief M7): no bar background; the link cluster gets a rounded

| Token | Value | Note | Used in |
|---|---|---|---|
| `--nav-fg` | `var(--color-stone-900)` |  | Nav |
| `--nav-cluster-bg` | `var(--color-stone-100)` |  | Nav |
| `--nav-fg-dark` | `var(--color-stone-50)` |  | Nav |
| `--nav-cluster-bg-dark` | `var(--color-stone-800)` |  | Nav |
| `--nav-dropdown-bg` | `var(--color-white)` |  | Nav |
| `--nav-dropdown-fg` | `var(--color-stone-900)` |  | Nav |
| `--nav-dropdown-border` | `var(--color-stone-300)` |  | Nav |
| `--nav-dropdown-shadow` | `var(--shadow-e2)` |  | Nav |
| `--nav-badge-bg` | `var(--color-stone-900)` |  | MobileMenu, Nav |
| `--nav-badge-fg` | `var(--color-white)` |  | MobileMenu, Nav |

### Page wrapper (animated by the theme switch)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--page-bg` | `var(--color-white)` |  | SiteShell |
| `--page-bg-dark` | `var(--color-stone-900)` |  | SiteShell |

### Gate cards (Approach): light wing tints, Deep Ink text. The media area

| Token | Value | Note | Used in |
|---|---|---|---|
| `--gate-media-fg` | `var(--color-stone-900)` |  | MediaFrame |
| `--gate-1-media` | `var(--gradient-glasswing-sky)` |  | RevealCard |
| `--gate-2-media` | `var(--gradient-morpho-shimmer)` |  | RevealCard |
| `--gate-3-media` | `var(--gradient-swallowtail)` |  | RevealCard |
| `--gate-1-bg` | `var(--color-apricot-100)` |  | RevealCard |
| `--gate-1-fg` | `var(--color-stone-900)` |  | RevealCard |
| `--gate-1-pain` | `var(--color-apricot-800)` |  | RevealCard |
| `--gate-2-bg` | `var(--color-morpho-100)` |  | RevealCard |
| `--gate-2-fg` | `var(--color-stone-900)` |  | RevealCard |
| `--gate-2-pain` | `var(--color-morpho-800)` |  | RevealCard |
| `--gate-3-bg` | `var(--color-swallowtail-100)` |  | RevealCard |
| `--gate-3-fg` | `var(--color-stone-900)` |  | RevealCard |
| `--gate-3-pain` | `var(--color-swallowtail-800)` |  | RevealCard |

### Team diagram (layout from the parallel prototype): numbered role chips →

| Token | Value | Note | Used in |
|---|---|---|---|
| `--team-col-max` | `22.5rem` | 360: each chip column | TeamSection |
| `--team-gap` | `clamp(1.25rem, 3vw, 3rem)` | 20 → 48: columns ↔ hub (wire length) | TeamSection |
| `--team-chip-height` | `3.25rem` | 52 | TeamSection |
| `--team-chip-bg` | `var(--color-stone-100)` |  | TeamSection |
| `--team-chip-fg` | `var(--color-stone-900)` |  | TeamSection |
| `--team-chip-shadow` | `var(--shadow-e1)` |  | TeamSection |
| `--team-chip-number` | `var(--color-stone-600)` |  | TeamSection |
| `--team-benefit-border` | `var(--color-stone-300)` |  | TeamSection |
| `--team-benefit-marker` | `var(--color-stone-900)` |  | TeamSection |
| `--team-hub-size` | `clamp(9.375rem, 15vw, 11.875rem)` | 150 → 190 | TeamSection |
| `--team-hub-bg` | `var(--gradient-glasswing-sky)` |  | TeamSection |
| `--team-hub-fg` | `var(--color-stone-900)` |  | TeamSection |
| `--team-wire` | `rgb(107 98 90 / 0.35)` | Stone at 35% | TeamSection |

### Button hover: the fill dissolves to the gradient in pixel steps (P2-4)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--cta-hover-bg` | `var(--gradient-glasswing-sky)` |  | Button, pixelHover |
| `--cta-hover-fg` | `var(--color-stone-900)` |  | Button |

### Process card

| Token | Value | Note | Used in |
|---|---|---|---|
| `--process-bg` | `var(--color-stone-900)` |  | ProcessSection |
| `--process-fg` | `var(--color-white)` |  | ProcessSection |
| `--process-rule` | `rgb(255 255 255 / 0.7)` |  | ProcessSection |

### Solid pill (showreel sound control sits on the reel, always light)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--pill-solid-bg` | `var(--color-white)` |  | Pill |
| `--pill-solid-fg` | `var(--color-stone-900)` |  | Pill |

### Testimonial logo slot

| Token | Value | Note | Used in |
|---|---|---|---|
| `--logo-stripe-a` | `var(--color-stone-200)` |  | MediaFrame |
| `--logo-stripe-b` | `var(--color-stone-100)` |  | MediaFrame |

