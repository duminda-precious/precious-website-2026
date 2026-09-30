# Motion

**Personality: Premium, 8-bit.** Calm, decelerating, no overshoot. Pixels are sharp squares that fade (never blur), with an LCD ghost of the previous frame. The source of truth is the Claude Design file `Precious Home.dc.html` (decision 2026-09-30). Every timing, easing and pixel size is a token (see [tokens.md](tokens.md)), read at runtime through `src/motion/tokens.ts`. Durations come from one palette (`--t-frame-fast` 40 · `--t-frame` 55 · `--t-frame-slow` 70 · `--t-wing` 125 · `--t-instant` 120 · `--t-quick` 160 · `--t-short` 200 · `--t-base` 300 · `--t-medium` 420 · `--t-slow` 560 · `--t-slower` 900 · `--t-long` 1500ms, plus ambient loops). Every animation token is a palette step × `--motion-tempo` (Calm 1.5 · Standard 1 · Lively 0.65), so CSS transitions and scripts follow the tempo alike; interaction waits (autoplay, hover intent, wheel lock, scroll settle) stay unscaled.

## Architecture

- **Stack:** GSAP + ScrollTrigger + CustomEase (theme switch, rise-in, FAQ height), the Web Animations API and canvas for pixel work, Astro's page router for transitions. Lenis for smooth wheel scroll only (M19); it defers to the two-step hero, which holds the first scroll natively.
- **Registry** (`src/motion/index.ts`): each behaviour is a module with `init(root) → cleanup`. It boots on `astro:page-load`, tears everything down on `astro:before-swap`, and re-initialises when the reduced-motion setting changes.
- **Hooks:** elements opt in with `data-*` attributes, never styling classes.
- **Shared engines:** `pixelWords.ts` (per-word canvas pixelation), `wing.ts` (butterfly wing cover), `pixelRain.ts` (wash band + falling clusters).
- **Reduced motion:** every module has a reduced branch (see the table).

## Inventory

| # | Behaviour | Where | Hook | Reduced motion |
|---|---|---|---|---|
| M1 | **Two-step hero.** Title over the reel under a white veil (`--hero-veil`, blur = veil × `--blur-reel-max`). First scroll is held: title dissolves word by word (`--pixel-dissolve`), veil lifts, reel sharpens, sound toggle appears, news stack hides. Scrolling up inside the hero glides back and the title resolves (`--pixel-resolve`). Reel shrinks into the section padding over `--hero-inset-scroll`. Hover and idle word glitches | `heroReveal.ts`, `Hero.astro` | `data-hero*` | Same two states, instant |
| M1b | **Hero news stack.** Frosted cards, deck of 3, autoplay `--dur-autoplay`, wheel flips (page doesn't scroll), swipe | `newsStack.ts`, `NewsStack.astro` | `data-news`, `data-rel` | No autoplay |
| M2 | **Theme switch.** At every width, while Work spans the viewport (`--theme-enter` / `--theme-exit`) the page takes the dark theme; colours fade together | `themeSwitch.ts`, `SiteShell`, `Section` (`stage`) | `data-theme-stage`, `data-page-theme` | Instant |
| M3 | **Rise-in.** Cards rise and fade in row by row. Distance and duration read per element (Work 120px/1s; Journal `--rise-distance-soft`/`--dur-rise-soft`) | `riseIn.ts` | `data-motion="rise-in"` | No movement |
| M4 | **Client ticker.** Full-bleed logo loop between hero and Work; pauses off-screen and on keyboard focus | `ClientTicker.astro`, `marquee.ts` | `data-motion="marquee"` | Static row |
| M5 | **Approach sticky text.** One panel follows the page, lines up with each card, crossfades to the card nearest the centre | `approach.ts`, `ApproachSection.astro` | `data-gate*` | Instant swap |
| M6 | **FAQ.** Height animates; + and × trade pixels over `--icon-swap-steps` with a ghost; one open at a time | `disclosure.ts`, `Disclosure.astro` | `data-motion="disclosure"`, `data-group` | Native toggle |
| M7 | **Videos.** Card videos play in view | `videoInView.ts` | `data-motion="video-in-view"` | No autoplay |
| M8 | **Reel sound toggle** | `soundToggle.ts` | `data-motion="sound-toggle"` | Same |
| M9 | **Testimonials.** Endless loop (three copies, re-centres), autoplay `--dur-autoplay`, arrows fill and glitch on hover | `slider.ts`, `ClientsSection.astro` | `data-motion="slider"` | No autoplay |
| M10 | **Butterfly wing transition.** Page changes and in-page anchors: cells fill a butterfly shape first, then outward, in the destination's colour, with tinted edge cells (`--pixel-tint`) | `pageTransition.ts`, `wing.ts`, `SiteShell` | `data-wing-cover` | Instant |
| M11 | **Nav states + mega menu.** Scrolled: wordmark clips to the butterfly; scrolled or <1100px: links and Book a call tuck into the 4-dot button. Services mega menu unfolds, columns cascade | `nav.ts`, `Nav.astro` | `data-nav`, `data-mini`, `data-scrolled`, `data-mega*` | Instant |
| M12 | **Button hover.** Wash blooms in as pixels from the entry point, light noise radiates from the cursor, a pixel butterfly lands and flaps (lifts off vertically on leave), press scale; label glitches. Section CTAs (`data-cta`) also glitch every few seconds in view | `buttonFx.ts`, `buttonGlitch.ts`, `Button`, `IconButton` | `data-grad`, `data-button`, `data-cta` | Wash appears at once; no glitch |
| M13 | **Butterfly logo.** Wings flap at 8fps (`--dur-wing-frame`) with an LCD ghost; brand-colour ripple on hover | `logoWings.ts`, `Logo.astro` | `data-logo-mark`, `data-logo-hover` | Static |
| M14 | **Card hover.** Ragged pixel band blurs the media edge and breathes; CTA expands from the corner | `cardEdge.ts`, `ContentCard.astro` | `data-card` | CTA only |
| M15 | **Full-page menu.** Opens with white wing pixels from the menu button, links and cards rise in; closes back into pixels toward the button. Focus trap, Esc, scroll lock | `fullMenu.ts`, `FullMenu.astro` | `data-menu*` | Instant |
| M16 | **Team funnel.** Pixel flow from roles through the engine to the outputs; entrance, then a pulse loop | `teamFlow.ts`, `TeamSection.astro` | `data-flow` | Still frame, lit |
| M17 | **AI card.** Fixed window of glow + pixel rain; content rises, stat counts up | `aiCard.ts`, `pixelRain.ts`, `ProcessSection.astro` | `data-ai*`, `data-rain` | Still frame |
| M18 | **Footer pixel rain.** Wash band + falling clusters; Book a call brightens it | `pixelRain.ts`, `CtaFooter.astro` | `data-rain`, `data-rain-cta` | Still frame |
| M19 | **Smooth wheel scroll.** Lenis eases mouse wheel and trackpad (`--scroll-lerp`, `--scroll-wheel-multiplier`) on GSAP's ticker, updating ScrollTrigger. Touch, keys and anchors stay native. Hands the wheel to the hero while it owns the scroll (`claimWheel`); skips `[data-lenis-prevent]` panels and sideways slider swipes; stops under the full menu's lock | `smoothScroll.ts` | `data-lenis-prevent`, `data-lenis-prevent-horizontal` | Off (native scroll) |
| — | **Footer reveal.** From 992px the footer is sticky behind the page | `CtaFooter.astro` | `data-motion="footer-reveal"` | Same |

## Adding a behaviour

1. Create `src/motion/<name>.ts` exporting a `MotionModule` (`{ name, init(root) { …; return cleanup } }`).
2. Select elements by `data-*` hooks; read every value with `ms()`, `ease()`, `length()`, `color()` … from `tokens.ts` (add a token first; no literals).
3. Kill every ScrollTrigger, tween, observer and listener in the cleanup (an `AbortController` makes listeners easy).
4. Add a reduced-motion branch using `prefersReducedMotion()`.
5. Register it in the `modules` list in `src/motion/index.ts`.
6. Check in the console that home → another page → home logs one init and one cleanup each time.

## Not built yet

- Starting-point (Approach) loops and the hero news images: placeholders until the media arrives.
