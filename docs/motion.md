# Motion

**Personality: Premium.** Calm, decelerating, no overshoot or bounce. All timings and easings are tokens (see [tokens.md](tokens.md), Motion group), read by GSAP at runtime through `src/motion/tokens.ts`.

## Architecture

- **Stack:** GSAP + ScrollTrigger + CustomEase, Lenis for smooth scroll, Astro's page router for transitions.
- **Registry** (`src/motion/index.ts`): each behaviour is a module with `init(root) → cleanup`. The registry boots on `astro:page-load` (first load and every page change), tears everything down on `astro:before-swap`, and re-initialises when the OS reduced-motion setting changes. In dev, the console logs `[motion] init …` / `[motion] cleanup …`.
- **Hooks:** elements opt in with `data-motion="…"`. Nothing is tied to styling classes.
- **Named GSAP easings** (`gsap.ts`): `standard`, `outSoft`, `outExpo`, built from the CSS tokens.
- **Reduced motion:** every module has a reduced branch (see the table). Smooth scroll is off.
- **Performance:** animate transform, opacity, filter and clip-path only. Blur is only used in the hero. No layout reads inside scroll callbacks (sizes are cached on ScrollTrigger refresh).

## Inventory

| # | Behaviour | Where | Hook | Tokens | Reduced motion |
|---|---|---|---|---|---|
| M1 | **Hero scroll sequence.** L1 headline zoom/blur out and L2 problem line in/out (prototype ranges, smoothstep). L3 reel: clip opens from the centre to a small 16:9 tile, then grows to fill the stage with constant rounded corners (brief). Rebuilds when crossing 760px. Phones: no pin | `motion/hero.ts`, `home/Hero.astro` | `data-motion="hero"`, `data-hero-layer`, `data-hero-reel` | `--hero-scroll`, `--radius-md` | Hard switch between layers at 33% / 60%, no transforms or blur |
| M2 | **Theme switch.** From 760px only: page and nav turn dark while a dark stage is in view (starts when its top reaches 75% of the viewport, ends when its bottom passes 45%). Below 760px the page stays white and the stage uses light colours | `motion/themeSwitch.ts`, `Section` (`stage`) | `data-theme-stage="dark"`, `data-page-theme`, `data-nav-theme` | `--page-bg(-dark)`, `--nav-*-dark`, `--dur-page`, `--dur-theme`, `--ease-standard` | Colours switch instantly |
| M3 | **Row rise-in.** Cards rise 120px and fade in as their row enters, left to right | `motion/riseIn.ts` (WorkCard, RevealCard) | `data-motion="rise-in"` | `--rise-distance`, `--dur-rise`, `--dur-stagger`, `--ease-out-expo` | No movement |
| M4 | **Logo ticker.** Continuous full-bleed loop of client names; pauses on hover, focus, and off-screen | `ClientsSection` (CSS), `motion/marquee.ts` | `data-motion="marquee"` | `--dur-marquee`, `--ticker-gap`, `--ease-linear` | Stops; names wrap as a static row |
| M5 | **Gate card reveal.** Text reveals on hover and keyboard focus; shown open on touch | `ui/RevealCard.astro` (CSS only) | — | `--dur-reveal`, `--dur-base`, `--ease-out-soft` | Instant |
| M6 | **FAQ height.** Opens/closes smoothly in every browser; the pixel "+" swaps to "×" | `motion/disclosure.ts`, `ui/Disclosure.astro` | `data-motion="disclosure"` | `--dur-base`, `--dur-fast`, `--ease-standard` | Native instant toggle |
| M7 | **Case videos.** Play when 40% visible, pause out of view | `motion/videoInView.ts`, `MediaFrame` | `data-motion="video-in-view"` | — | No autoplay; native controls |
| M8 | **Reel sound toggle.** "Sound on / Sound off" with `aria-pressed` | `motion/soundToggle.ts`, `Hero` | `data-motion="sound-toggle"` | — | Same |
| M9 | **Hover + testimonial slider.** Links fade to 0.7 on hover. Testimonials: horizontal scroll-snap, ← → buttons move one card | `base.css`, `motion/slider.ts` | `data-motion="slider"` | `--hover-opacity`, `--slide-*`, `--disabled-opacity` | Slider jumps instantly |
| M10 | **Page transitions.** Cross-fade between routes; nav and footer don't animate | `SiteShell` (View Transitions) | `transition:name` on nav/footer | `--dur-base`, `--ease-standard` | No animation |
| M11 | **Nav.** Sticky; rounded backdrop fades in behind the links once scrolled. Smooth anchor scrolling lands below the nav | `layout/Nav.astro`, `motion/lenis.ts` | `data-nav`, `data-scrolled` | `--nav-*`, `--nav-height`, `--dur-fast` | Native scroll |
| M12 | **Pixel hover.** Buttons: on mouse hover or keyboard focus the fill dissolves from Deep Ink to the Glasswing Sky gradient in shuffled pixel batches (no tweening); the label turns Deep Ink once most cells are lit. Reverses on leave | `motion/pixelHover.ts`, `ui/Button.astro` | `data-pixel-fill`, `data-pixel-layer`, `data-pixel-lit`, `html[data-pixel-hover]` | `--pixel-cell`, `--pixel-steps`, `--dur-pixel`, `--cta-hover-bg/-fg` | Module off; CSS swaps the gradient in instantly |
| M13 | **Pixel text.** Section headings and the footer headline resolve from coarse pixel blocks to crisp type the first time they enter view. Then every few seconds one visible heading gently pixelates and settles back (breathing). Real text throughout: an SVG pixelate filter via CSS `filter` | `motion/pixelText.ts`, `SectionHeader`, home section headings, `CtaFooter` | `data-motion="pixel-text"` | `--pixel-resolve`, `--pixel-breathe`, `--dur-pixel-frame`, `--dur-breathe` | Off; text always crisp |
| M14 | **Logo pop.** The footer butterfly's pixels pop in, shuffled, in small batches the first time the footer logo is half in view | `motion/logoPop.ts`, `CtaFooter`, `Logo` | `data-motion="logo-pop"`, `data-logo-pixel` | `--pixel-pop-steps`, `--dur-pixel-pop` | Off; logo whole |
| M15 | **Nav logo collapse.** Once scrolled, the nav wordmark clips down to the pixel butterfly (slides to the edge, grows 1.4×); expands at the top. Phones and desktop | `layout/Nav.astro` (CSS) | `data-scrolled` | `--logo-mark-*`, `--dur-logo-collapse`, `--ease-out-expo` | Instant switch |
| — | **Footer reveal.** From 992px the footer is sticky behind the page, which lifts off with rounded bottom corners; normal flow if it's taller than the viewport | `layout/CtaFooter.astro`, `SiteShell` | `data-motion="footer-reveal"`, `data-footer-static` | `--radius-md`, `--z-footer`, `--z-page` | Same (no animation involved) |
| — | **Smooth scroll.** Lenis on GSAP's ticker, synced to ScrollTrigger; touch keeps native scrolling; paused while the mobile menu is open | `motion/lenis.ts` | — | — | Off |

## Adding a behaviour

1. Create `src/motion/<name>.ts` exporting a `MotionModule` (`{ name, init(root) { …; return cleanup } }`).
2. Select elements by `data-motion="<name>"`; read timings with `duration()` / `bezier()` from `tokens.ts`.
3. Kill every ScrollTrigger, tween, observer and listener in the cleanup (an `AbortController` makes listeners easy).
4. Add a reduced-motion branch using `prefersReducedMotion()`.
5. Register it in the `modules` list in `src/motion/index.ts` (order matters: Lenis first).
6. Check in the console that home → another page → home logs one init and one cleanup each time.

## Not built in phase 1

- The brief's echo frames/bands (hero and footer). They need phase-2 colours.
- Work card hover (media zoom + service pills) from the brief.
- Nav "settle" translate when the backdrop appears (no value given).
