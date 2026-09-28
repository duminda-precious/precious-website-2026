# Design tokens

All values live in [`src/styles/tokens.css`](../src/styles/tokens.css). This file is generated from it; if they ever disagree, tokens.css wins. Visual check: `/dev/tokens` (theme switcher and live contrast table).

## How the system works

- **Three tiers.** Primitives (raw values) → semantic tokens (meaning, remapped per theme) → component tokens (a few component-specific settings). Components use only semantic and component tokens, never primitives or hex codes.
- **Themes.** `light` is the default. `[data-theme="dark"]` (the Work stage) and `[data-theme="ink"]` (footer, process card) remap the semantic colour tokens.
- **Rebrand = token swap.** Change the primitives and the semantic mapping; components follow. Fonts: change `--font-family-sans` and `--font-family-mono`.
- **Fluid values** interpolate between 320px and 1920px viewports with `clamp()`.
- **Breakpoints** can't be tokens inside `@media`; use these literal values: sm `30rem` (480), md `47.5rem` (760), lg `62rem` (992), xl `75rem` (1200), 2xl `98.75rem` (1580). Also exported from `src/styles/breakpoints.ts`.
- **Motion** tokens are read at runtime by `src/motion/tokens.ts`, so CSS is also the source for GSAP.
- **"Used in"** lists the files that read a token (dev pages excluded). "—" means it is only referenced by other tokens or reserved.

## Primitives and global tokens

### Neutrals (numbered light → dark)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--color-white` | `#ffffff` |  | — |
| `--color-black` | `#000000` |  | — |
| `--color-grey-25` | `#f6f6f6` |  | — |
| `--color-grey-50` | `#f0f0f0` |  | — |
| `--color-grey-75` | `#eeeeee` |  | — |
| `--color-grey-100` | `#ececec` |  | — |
| `--color-grey-125` | `#ebebeb` |  | — |
| `--color-grey-150` | `#e4e4e4` |  | — |
| `--color-grey-175` | `#e2e2e2` |  | — |
| `--color-grey-200` | `#dddddd` |  | — |
| `--color-grey-300` | `#c4c4c4` |  | — |
| `--color-grey-350` | `#bdbdbd` |  | — |
| `--color-grey-400` | `#aaaaaa` |  | — |
| `--color-grey-450` | `#888888` |  | — |
| `--color-grey-500` | `#777777` |  | — |
| `--color-grey-550` | `#666666` |  | — |
| `--color-grey-600` | `#555555` |  | — |
| `--color-grey-650` | `#444444` |  | — |
| `--color-grey-800` | `#333333` |  | — |
| `--color-ink-900` | `#141414` |  | — |
| `--color-ink-950` | `#111111` |  | — |

### Maroon (the dark Work stage)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--color-maroon-50` | `#f2eeee` |  | — |
| `--color-maroon-300` | `#b9aeae` |  | — |
| `--color-maroon-500` | `#8a7c7c` |  | — |
| `--color-maroon-700` | `#6a5a5a` |  | — |
| `--color-maroon-850` | `#2a1c1c` |  | — |
| `--color-maroon-900` | `#221616` |  | — |
| `--color-maroon-950` | `#160a0a` |  | — |

### Forest (gate cards)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--color-forest-50` | `#eef2ef` |  | — |
| `--color-forest-300` | `#b5c7bd` |  | — |
| `--color-forest-400` | `#7d978a` |  | — |
| `--color-forest-800` | `#1f3d30` |  | — |
| `--color-forest-850` | `#1d3a2d` |  | — |
| `--color-forest-900` | `#183226` |  | — |

### Accents

| Token | Value | Note | Used in |
|---|---|---|---|
| `--color-orange-500` | `#ee6a3c` |  | — |
| `--color-lime-300` | `#d9f07a` |  | — |
| `--color-olive-800` | `#3a4a20` |  | — |
| `--color-stone-50` | `#f2f2ee` |  | — |

### Type families

| Token | Value | Note | Used in |
|---|---|---|---|
| `--font-family-sans` | `'Helvetica Neue', Helvetica, Arial, sans-serif` |  | — |
| `--font-family-mono` | `ui-monospace, Menlo, monospace` |  | — |

### TYPOGRAPHY (theme-independent)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--font-sans` | `var(--font-family-sans)` |  | base |
| `--font-mono` | `var(--font-family-mono)` |  | Button, CtaFooter, MediaFrame, MobileMenu, Nav, Pill, SectionHeader, SiteShell, Tag, TextLink |

### Hero keeps the prototype's large sizes (they drive the scroll sequence).

| Token | Value | Note | Used in |
|---|---|---|---|
| `--text-hero` | `clamp(2.5rem, 9vw, 7.5rem)` | H1, proto 48–120px | Hero |
| `--text-problem` | `clamp(1.375rem, 6vw, 5rem)` | problem line, proto 36–80px | Hero |
| `--text-closer` | `clamp(2.75rem, 1.975rem + 3.875vw, 6.625rem)` | brief Display 1, 106px: footer headline | CtaFooter |
| `--text-menu` | `clamp(2rem, 1.85rem + 0.75vw, 2.75rem)` | brief Menu, 44px | MobileMenu |
| `--text-statement` | `clamp(1.625rem, 1.5rem + 0.625vw, 2.25rem)` | brief H3/statement, 36px | ApproachSection, FaqSection, ProcessSection, SectionHeader, StubLayout, TeamSection |
| `--text-title` | `clamp(1.375rem, 1.3rem + 0.375vw, 1.75rem)` | brief H5, 28px: card titles | RevealCard, WorkCard |
| `--text-large` | `clamp(1.125rem, 1.075rem + 0.25vw, 1.375rem)` | brief Large, 22px | ClientsSection, Disclosure, MobileMenu |
| `--text-medium` | `clamp(1.0625rem, 1.025rem + 0.1875vw, 1.25rem)` | brief Medium, 20px: quotes, sublines | MobileMenu, Nav, ProcessSection, SectionHeader, StubLayout, TeamSection, TestimonialCard |
| `--text-body` | `1rem` | brief Body, 16px | CtaFooter, Disclosure, RevealCard, TextLink, WorkCard, base, contact |
| `--text-mono` | `0.875rem` | brief Mono UI, 14px: nav, buttons, labels | Button, MobileMenu, Nav, Pill, SectionHeader, SiteShell, TextLink |
| `--text-mono-sm` | `0.75rem` | 12px: tags, legal, placeholder labels | CtaFooter, MediaFrame, MobileMenu, Nav, Tag |

### Footer wordmark is a layout element sized to its columns (brief §2.9):

| Token | Value | Note | Used in |
|---|---|---|---|
| `--text-wordmark` | `7.5vw` |  | CtaFooter |
| `--text-wordmark-lg` | `5.2vw` |  | CtaFooter |
| `--weight-regular` | `400` |  | Button, MobileMenu |
| `--weight-medium` | `500` |  | CtaFooter, Hero, ProcessSection, SectionHeader, TestimonialCard, WorkCard, base |
| `--weight-wordmark` | `700` | the logo mark only; type hierarchy uses 400/500 | CtaFooter, MobileMenu, Nav |
| `--tracking-hero` | `-0.035em` | prototype | Hero |
| `--tracking-problem` | `-0.03em` | prototype | Hero |
| `--tracking-closer` | `-0.05em` |  | CtaFooter |
| `--tracking-heading` | `-0.04em` | statements, menu | ApproachSection, FaqSection, MobileMenu, ProcessSection, SectionHeader, StubLayout, TeamSection |
| `--tracking-title` | `-0.03em` | card titles, large | MobileMenu, RevealCard, WorkCard |
| `--tracking-body` | `-0.02em` | medium, body | base |
| `--tracking-mono` | `-0.02em` |  | Button, CtaFooter, MobileMenu, Nav, Pill, SectionHeader, SiteShell, Tag, TextLink |
| `--tracking-wordmark` | `0.02em` | prototype wordmark | CtaFooter |
| `--tracking-brand` | `0.04em` | prototype nav logo | MobileMenu, Nav |
| `--leading-hero` | `0.95` | prototype | Hero |
| `--leading-none` | `1` | mono UI, problem line | Button, ClientsSection, CtaFooter, Disclosure, Hero, MobileMenu, Nav, Pill, SectionHeader, Tag, TextLink |
| `--leading-closer` | `1.09` |  | CtaFooter |
| `--leading-heading` | `1.1` | 28px and up | ApproachSection, FaqSection, MobileMenu, ProcessSection, RevealCard, SectionHeader, StubLayout, TeamSection, WorkCard, base |
| `--leading-large` | `1.2` |  | — |
| `--leading-medium` | `1.35` |  | ProcessSection, SectionHeader, StubLayout, TeamSection, TestimonialCard |
| `--leading-body` | `1.45` |  | Disclosure, WorkCard, base |

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
| `--space-8` | `0.5rem` |  | Button, ClientsSection, CtaFooter, MobileMenu, Nav, RevealCard, SiteShell, contact |
| `--space-10` | `0.625rem` |  | Button, Pill, Tag |
| `--space-12` | `0.75rem` |  | MobileMenu, ProcessSection, RevealCard, SectionHeader, SiteShell, TeamSection, WorkCard |
| `--space-14` | `0.875rem` |  | Button, Pill, ProcessSection |
| `--space-16` | `1rem` |  | Button, ClientsSection, CtaFooter, Disclosure, Hero, MobileMenu, Nav, SiteShell |
| `--space-18` | `1.125rem` |  | Disclosure, ProcessSection |
| `--space-20` | `1.25rem` |  | — |
| `--space-22` | `1.375rem` |  | Button, RevealCard |
| `--space-24` | `1.5rem` |  | ClientsSection, CtaFooter, FaqSection, MobileMenu, Nav, SectionHeader, contact |
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

### Radii (brief: one value for media, cards and sheets; pills fully round)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--radius-none` | `0` |  | — |
| `--radius-sm` | `0.25rem` | small UI details (skip link) | SiteShell |
| `--radius-md` | `0.75rem` | 12: all media and cards | Hero, MediaFrame, Nav, ProcessSection, RevealCard, SiteShell, TestimonialCard, hero |
| `--radius-xl` | `1.375rem` | 22: team diagram bracket (prototype shape) | — |
| `--radius-pill` | `999px` |  | Button, ClientsSection, MobileMenu, Nav, Pill, Tag |
| `--border-width` | `1px` |  | ClientsSection, CtaFooter, Disclosure, MobileMenu, Nav, Pill, ProcessSection, Section, Tag, TextLink, WorkCard |
| `--stripe-size` | `8px` | placeholder stripe band | MediaFrame |
| `--stripe-size-sm` | `6px` |  | MediaFrame |

### MOTION (mirrored for GSAP in src/motion/tokens.ts; read at runtime)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` |  | Disclosure, MobileMenu, Nav, SiteShell, gsap, tokens |
| `--ease-out-soft` | `cubic-bezier(0.2, 0.8, 0.2, 1)` |  | RevealCard, gsap, tokens |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | brief signature entrance ease | gsap, tokens |
| `--ease-linear` | `linear` |  | ClientsSection |
| `--ease-css` | `ease` | the prototype's nav colour transition | Nav |
| `--dur-fast` | `200ms` | hovers | Disclosure, MobileMenu, Nav, tokens |
| `--dur-base` | `300ms` |  | MobileMenu, RevealCard, SiteShell, disclosure, gsap, tokens |
| `--dur-reveal` | `450ms` |  | RevealCard, tokens |
| `--dur-theme` | `800ms` |  | Nav, tokens |
| `--dur-page` | `900ms` |  | SiteShell, tokens |
| `--dur-rise` | `1s` | brief row rise-in, 0.8–1.2s | riseIn, tokens |
| `--dur-marquee` | `60s` |  | ClientsSection, tokens |
| `--rise-distance` | `120px` | brief entrance pattern | riseIn |
| `--dur-stagger` | `80ms` | left-to-right delay within a rising row (brief: 'small') | riseIn, tokens |
| `--hover-opacity` | `0.7` |  | Button, ClientsSection, MobileMenu, Nav, Pill, WorkCard, base |
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
| `--surface-page` | `var(--color-white)` |  | CtaFooter, MobileMenu, Section, base |
| `--surface-raised` | `var(--color-grey-50)` | testimonial card | TestimonialCard |
| `--surface-muted` | `var(--color-grey-175)` | team chips | — |
| `--surface-inverse` | `var(--color-ink-900)` |  | base |
| `--text-primary` | `var(--color-ink-900)` |  | CtaFooter, MobileMenu, base |
| `--text-secondary` | `var(--color-grey-600)` |  | ClientsSection, CtaFooter, Disclosure, MobileMenu, SectionHeader, StubLayout, WorkCard, contact, utilities |
| `--text-tertiary` | `var(--color-grey-550)` |  | TeamSection |
| `--text-muted` | `var(--color-grey-450)` |  | CtaFooter, TestimonialCard |
| `--text-on-inverse` | `var(--color-white)` |  | base |
| `--text-strong` | `var(--color-black)` |  | — |
| `--border-subtle` | `var(--color-grey-75)` |  | CtaFooter, Section |
| `--border-default` | `var(--color-grey-150)` |  | Disclosure |
| `--border-strong` | `var(--color-grey-200)` |  | ClientsSection, Pill |

### Monochrome UI in phase 1: no brand accent (decision 2026-09-29).

| Token | Value | Note | Used in |
|---|---|---|---|
| `--accent` | `var(--text-primary)` |  | — |
| `--cta-bg` | `var(--color-ink-900)` |  | Button, SiteShell |
| `--cta-fg` | `var(--color-white)` |  | Button, SiteShell |
| `--focus-ring` | `var(--text-primary)` |  | RevealCard, WorkCard, base |
| `--tag-border` | `var(--border-strong)` |  | Tag |
| `--placeholder-stripe-a` | `var(--color-grey-100)` |  | MediaFrame |
| `--placeholder-stripe-b` | `var(--color-grey-25)` |  | MediaFrame |
| `--placeholder-fg` | `var(--color-grey-500)` |  | MediaFrame |

## Semantic colours: dark (Work stage)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--surface-page` | `var(--color-maroon-950)` |  | CtaFooter, MobileMenu, Section, base |
| `--surface-raised` | `var(--color-maroon-900)` |  | TestimonialCard |
| `--surface-muted` | `var(--color-maroon-850)` |  | — |
| `--surface-inverse` | `var(--color-maroon-50)` |  | base |
| `--text-primary` | `var(--color-maroon-50)` |  | CtaFooter, MobileMenu, base |
| `--text-secondary` | `var(--color-maroon-300)` |  | ClientsSection, CtaFooter, Disclosure, MobileMenu, SectionHeader, StubLayout, WorkCard, contact, utilities |
| `--text-tertiary` | `var(--color-maroon-300)` |  | TeamSection |
| `--text-muted` | `var(--color-maroon-500)` |  | CtaFooter, TestimonialCard |
| `--text-on-inverse` | `var(--color-maroon-950)` |  | base |
| `--text-strong` | `var(--color-white)` |  | — |
| `--border-subtle` | `var(--color-maroon-850)` |  | CtaFooter, Section |
| `--border-default` | `var(--color-maroon-850)` |  | Disclosure |
| `--border-strong` | `var(--color-maroon-700)` |  | ClientsSection, Pill |
| `--accent` | `var(--text-primary)` |  | — |
| `--cta-bg` | `var(--color-maroon-50)` |  | Button, SiteShell |
| `--cta-fg` | `var(--color-maroon-950)` |  | Button, SiteShell |
| `--focus-ring` | `var(--text-primary)` |  | RevealCard, WorkCard, base |
| `--tag-border` | `var(--color-maroon-700)` |  | Tag |
| `--placeholder-stripe-a` | `var(--color-maroon-850)` |  | MediaFrame |
| `--placeholder-stripe-b` | `var(--color-maroon-900)` |  | MediaFrame |
| `--placeholder-fg` | `var(--color-maroon-500)` |  | MediaFrame |

## Semantic colours: ink (footer, process card)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--surface-page` | `var(--color-ink-950)` |  | CtaFooter, MobileMenu, Section, base |
| `--surface-raised` | `var(--color-black)` |  | TestimonialCard |
| `--surface-muted` | `var(--color-grey-800)` |  | — |
| `--surface-inverse` | `var(--color-white)` |  | base |
| `--text-primary` | `var(--color-grey-75)` |  | CtaFooter, MobileMenu, base |
| `--text-secondary` | `var(--color-grey-400)` |  | ClientsSection, CtaFooter, Disclosure, MobileMenu, SectionHeader, StubLayout, WorkCard, contact, utilities |
| `--text-tertiary` | `var(--color-grey-400)` |  | TeamSection |
| `--text-muted` | `var(--color-grey-500)` |  | CtaFooter, TestimonialCard |
| `--text-on-inverse` | `var(--color-ink-900)` |  | base |
| `--text-strong` | `var(--color-white)` |  | — |
| `--border-subtle` | `var(--color-grey-800)` |  | CtaFooter, Section |
| `--border-default` | `var(--color-grey-800)` |  | Disclosure |
| `--border-strong` | `rgb(255 255 255 / 0.7)` |  | ClientsSection, Pill |
| `--accent` | `var(--text-primary)` |  | — |
| `--cta-bg` | `var(--color-white)` |  | Button, SiteShell |
| `--cta-fg` | `var(--color-ink-900)` |  | Button, SiteShell |
| `--focus-ring` | `var(--text-primary)` |  | RevealCard, WorkCard, base |
| `--tag-border` | `var(--color-grey-500)` |  | Tag |
| `--placeholder-stripe-a` | `var(--color-grey-800)` |  | MediaFrame |
| `--placeholder-stripe-b` | `var(--color-ink-900)` |  | MediaFrame |
| `--placeholder-fg` | `var(--color-grey-400)` |  | MediaFrame |

## Component tokens

### Nav (brief M7): no bar background; the link cluster gets a rounded

| Token | Value | Note | Used in |
|---|---|---|---|
| `--nav-fg` | `var(--color-ink-900)` |  | Nav |
| `--nav-cluster-bg` | `var(--color-grey-50)` |  | Nav |
| `--nav-fg-dark` | `var(--color-maroon-50)` |  | Nav |
| `--nav-cluster-bg-dark` | `var(--color-maroon-900)` |  | Nav |
| `--nav-dropdown-bg` | `var(--color-white)` |  | Nav |
| `--nav-dropdown-fg` | `var(--color-ink-900)` |  | Nav |
| `--nav-dropdown-border` | `var(--color-grey-150)` |  | Nav |
| `--nav-badge-bg` | `var(--color-ink-900)` |  | MobileMenu, Nav |
| `--nav-badge-fg` | `var(--color-white)` |  | MobileMenu, Nav |

### Page wrapper (animated by the theme switch)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--page-bg` | `var(--color-white)` |  | SiteShell |
| `--page-bg-dark` | `var(--color-maroon-950)` |  | SiteShell |

### Gate cards (Approach)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--gate-media-stripe-a` | `var(--color-forest-850)` |  | MediaFrame |
| `--gate-media-stripe-b` | `var(--color-forest-900)` |  | MediaFrame |
| `--gate-media-fg` | `var(--color-forest-400)` |  | MediaFrame |
| `--gate-1-bg` | `var(--color-lime-300)` |  | RevealCard |
| `--gate-1-fg` | `var(--color-ink-900)` |  | RevealCard |
| `--gate-1-pain` | `var(--color-olive-800)` |  | RevealCard |
| `--gate-2-bg` | `var(--color-forest-800)` |  | RevealCard |
| `--gate-2-fg` | `var(--color-forest-50)` |  | RevealCard |
| `--gate-2-pain` | `var(--color-forest-300)` |  | RevealCard |
| `--gate-3-bg` | `var(--color-stone-50)` |  | RevealCard |
| `--gate-3-fg` | `var(--color-ink-900)` |  | RevealCard |
| `--gate-3-pain` | `var(--color-grey-600)` |  | RevealCard |

### Team diagram

| Token | Value | Note | Used in |
|---|---|---|---|
| `--team-chip-bg` | `var(--color-grey-175)` |  | — |
| `--team-chip-fg` | `var(--color-grey-650)` |  | — |
| `--team-group-from` | `var(--color-white)` |  | — |
| `--team-group-to` | `var(--color-grey-350)` |  | — |
| `--team-bar` | `var(--color-grey-300)` |  | — |

### Process card

| Token | Value | Note | Used in |
|---|---|---|---|
| `--process-bg` | `var(--color-black)` |  | ProcessSection |
| `--process-fg` | `var(--color-white)` |  | ProcessSection |
| `--process-rule` | `rgb(255 255 255 / 0.7)` |  | ProcessSection |

### Solid pill (showreel sound control sits on the reel, always light)

| Token | Value | Note | Used in |
|---|---|---|---|
| `--pill-solid-bg` | `var(--color-white)` |  | Pill |
| `--pill-solid-fg` | `var(--color-ink-900)` |  | Pill |

### Testimonial logo slot

| Token | Value | Note | Used in |
|---|---|---|---|
| `--logo-stripe-a` | `var(--color-grey-175)` |  | MediaFrame |
| `--logo-stripe-b` | `var(--color-grey-125)` |  | MediaFrame |

