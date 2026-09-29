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
| M2 | **Theme switch.** From 760px only: while a dark stage (Work) spans the viewport (its top past 75%, its bottom above 45%), the whole page takes the dark theme: every section, heading, card and the nav flip, and all colours fade together for --dur-page. The footer and process card keep their fixed Deep Ink. Client logos invert. Below 760px the page stays white | `motion/themeSwitch.ts`, `SiteShell` (fade), `tokens.css` (dark tokens on `[data-page-theme=dark]`), `Section` (`stage`) | `data-theme-stage="dark"`, `data-page-theme`, `data-theme-fading`, `data-nav-theme` | dark theme tokens, `--client-logo-filter`, `--dur-page`, `--dur-theme`, `--ease-standard` | Colours switch instantly |
| M3 | **Row rise-in.** Cards rise 120px and fade in as their row enters, left to right | `motion/riseIn.ts` (WorkCard, RevealCard) | `data-motion="rise-in"` | `--rise-distance`, `--dur-rise`, `--dur-stagger`, `--ease-out-expo` | No movement |
| M4 | **Logo ticker.** Continuous full-bleed loop of client names; pauses on hover, focus, and off-screen | `ClientsSection` (CSS), `motion/marquee.ts` | `data-motion="marquee"` | `--dur-marquee`, `--ticker-gap`, `--ease-linear` | Stops; names wrap as a static row |
| M5 | **Gate card reveal.** Text reveals on hover and keyboard focus; shown open on touch | `ui/RevealCard.astro` (CSS only) | — | `--dur-reveal`, `--dur-base`, `--ease-out-soft` | Instant |
| M6 | **FAQ height.** Opens/closes smoothly in every browser; the pixel "+" swaps to "×" | `motion/disclosure.ts`, `ui/Disclosure.astro` | `data-motion="disclosure"` | `--dur-base`, `--dur-fast`, `--ease-standard` | Native instant toggle |
| M7 | **Case videos.** Play when 40% visible, pause out of view | `motion/videoInView.ts`, `MediaFrame` | `data-motion="video-in-view"` | — | No autoplay; native controls |
| M8 | **Reel sound toggle.** "Sound on / Sound off" with `aria-pressed` | `motion/soundToggle.ts`, `Hero` | `data-motion="sound-toggle"` | — | Same |
| M9 | **Hover + testimonial slider.** Links fade to 0.7 on hover. Testimonials: horizontal scroll-snap, ← → buttons move one card | `base.css`, `motion/slider.ts` | `data-motion="slider"` | `--hover-opacity`, `--slide-*`, `--disabled-opacity` | Slider jumps instantly |
| M10 | **Page transitions (pixel dissolve).** When a navigation starts, a full-screen Deep Ink cover pixels in (shuffled 32px cells, 6 hard steps) while the next page loads; after the swap it pixels out. The browser cross-fade is off | `motion/pageTransition.ts`, `motion/pixelClip.ts`, `SiteShell` | `data-pixel-cover` (persists across swaps) | `--pixel-cell-page`, `--pixel-reveal-steps`, `--dur-pixel-reveal`, `--pixel-cover-bg`, `--z-cover` | No cover; instant swap |
| M11 | **Nav.** Sticky; rounded backdrop fades in behind the links once scrolled. Smooth anchor scrolling lands below the nav | `layout/Nav.astro`, `motion/lenis.ts` | `data-nav`, `data-scrolled` | `--nav-*`, `--nav-height`, `--dur-fast` | Native scroll |
| M12 | **Button hover.** Mouse hover / keyboard focus: the Glasswing Sky gradient fades in over the fill (240ms in, 160ms out), the label turns Deep Ink and glitches into pixels and back (same engine as M13), and the ▸, hidden at rest, appears while the label steps left (the button never resizes). Touch: no hover state | `ui/Button.astro` (CSS), `motion/buttonGlitch.ts`, `motion/pixelWords.ts` | `data-button`, `data-pixel-label` | `--cta-hover-bg/-fg`, `--dur-fill-in/-out`, `--button-glyph-shift`, `--pixel-glitch`, `--dur-pixel-frame-glitch` | No fade, no glitch; instant swap |
| M13 | **Pixel text** (ported from the parallel prototype). Each word of a heading gets a canvas overlay: drawn at 1/block resolution, alpha hardened to on/off pixels, scaled up nearest-neighbour. Resolve on first view: 36 → 3px blocks, 70ms frames, words staggered 70ms. Idle glitch every 2.2–4.6s: one visible word (30% two) breaks 3 → 20 → 3px at 55ms, with a sideways jitter on big blocks. Real text stays in the DOM | `motion/pixelText.ts`, `base.css` (.px), `SectionHeader`, home section headings, `CtaFooter` | `data-motion="pixel-text"`, `.px`/`.pxon`/`.pxhide` | `--pixel-resolve`, `--pixel-glitch`, `--dur-pixel-frame-in/-glitch`, `--dur-pixel-word-stagger`, `--dur-glitch-min/-range`, `--pixel-glitch-double` | Off; text always crisp |
| M14 | **Logo pop.** The footer butterfly's pixels pop in, shuffled, in small batches the first time the footer logo is half in view | `motion/logoPop.ts`, `CtaFooter`, `Logo` | `data-motion="logo-pop"`, `data-logo-pixel` | `--pixel-pop-steps`, `--dur-pixel-pop` | Off; logo whole |
| M15 | **Nav logo collapse.** Once scrolled, the nav wordmark clips down to the pixel butterfly (slides to the edge, grows 1.4×); expands at the top. Phones and desktop | `layout/Nav.astro` (CSS) | `data-scrolled` | `--logo-mark-*`, `--dur-logo-collapse`, `--ease-out-expo` | Instant switch |
| M16 | **Mobile menu pixel reveal.** The menu opens through 24px pixel cells in shuffled steps; Close and Esc reverse it, then close. Following a link closes instantly (the page transition takes over) | `layout/MobileMenu.astro`, `motion/pixelClip.ts` | `data-menu-root` | `--pixel-cell-menu`, `--pixel-reveal-steps`, `--dur-pixel-reveal` | Opens and closes instantly |
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
