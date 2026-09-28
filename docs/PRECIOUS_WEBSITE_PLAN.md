# Precious Studio Website — Build Plan (Phase 1: Working Prototype)

Handoff document for Claude Code (Opus 5.5). Read this whole file before writing any code.

---

## 0. How to work (read first, follow always)

1. **One step at a time.** Build only the step you are asked for. When it's done, stop, then post:
   - a short summary of what changed (files touched, decisions made),
   - the **Test checklist** for that step (copy it from this plan and add anything new you introduced),
   - any open questions or deviations.
     Then wait. Do not start the next step until Duminda says it is approved.
2. **No automated tests.** Don't write unit, e2e or visual tests. Duminda tests manually.
3. **The prototype is the reference, not a pixel spec.** `reference/prototype-source.html` (a basic prototype supplied 2026-09-29) defines the section order, copy, and the layout of each section. Keep sections and layouts similar and keep the copy, but build it as a proper, fully responsive site on the design system (tokens + components) so it can scale. Refinements to spacing, type and detail are allowed when they come from the design system; list anything that visibly departs from the prototype under "deviations".
4. **Phase 2 (rebrand) comes later.** Every visual value must flow through tokens and every piece of copy through content files, so the rebrand is a token and content swap, not a rewrite. No hard-coded colors, font sizes, durations or easings inside components.
5. **Commit per step** with a message like `step-04: homepage static sections`. Use one branch per step if helpful.
6. **Keep placeholders visible.** Placeholder content stays in the prototype's bracket form (`[Project]`, `[Client logo]`), so it's obvious what still needs real content.
7. Ask before adding any dependency not listed in section 2.
8. **Don't assume, don't invent, ask.** If a source is silent or sources conflict, ask Duminda. Don't implement anything without approval: list the intended changes first and wait for a yes. Describe screenshots as observations, never as specs.

## 0.1 Decisions log (overrides the rest of this plan where they differ)

**2026-09-29: layout and IA revision** (Duminda). The Afternow brief (`docs/AFTERNOW_PATTERN_BRIEF.md`) is the reference for **layout, typography hierarchy, spacing and UI treatment**. The prototype remains the reference for **section order, section content and copy**. The nav screenshot was reference only; take no design from it.

- **Sitemap / nav:** the top nav links to pages, not homepage sections: Work → `/work`, Services ▾ (placeholder dropdown; the label only opens the dropdown), Approach → `/approach`, AI Design Agent + permanent `New` badge → `/ai`, About → `/about`, and a Book a call button (placeholder styling) → `/contact`. Clients and FAQ are removed from the nav. New routes: `/services`, `/services/[slug]` (placeholder `services` collection), `/approach`. Every Book a call goes to `/contact`. Contact stays footer-only in the nav sense. Footer Studio column: Work, Services, Approach, AI Design Agent, About (all pages).
- **Nav behaviour (brief M7):** logo alone at the left; the right-hand cluster floats with no background at the top, and a light rounded backdrop fades in once scrolled. No hide-on-scroll. Mobile menu breakpoint stays at 760px.
- **Grid:** full-bleed 12-column grid with fluid side padding, no max-width wrappers anywhere. Width is controlled by span + measure.
- **Section headers:** three-zone headers where content suits (Work, Clients, FAQ); Team and Approach stay centred as in the prototype.
- **Work grid:** 5 projects on the homepage, sized and proportioned **by position** (1: span 6, 2–3: span 3, 4–5: span 6; aspects 3/2, 5/4, 1/1, 4/3, 1/1). 1 column on phones, 2 from md, 12 from lg (992px). The `homeSlot` field is removed; `homeOrder` selects and orders home projects.
- **Type:** brief hierarchy: sans for content (weights 400/500 only), uppercase mono for UI and metadata (nav, buttons, tags, labels, legal). Brief type scale, except the hero H1 and problem line keep the prototype's large sizes. Fonts stay Helvetica Neue stack + system mono in phase 1.
- **UI:** buttons are pills with a mono label and ▸; radius 12px for all media and cards; pills fully rounded. Monochrome UI: no orange accent in phase 1 (FAQ "+" and the footer button go monochrome).
- **Colour/sections:** the dark Work section stays.
- **Hero (M1):** a mix: keep the prototype's text layers (L1 zoom/blur out, L2 problem line in/out); the showreel layer (L3) follows the brief (clip reveal from centre, then grows to fill the content area with rounded corners, play chip). No echo frames in phase 1. Mobile: no pin; headline above a 16:9 video with a play button.
- **Rise-in:** cards rise 120px + fade in, per row, left to right; off under reduced motion.
- **Colours and final visual design** come in phase 2 and will differ from the screenshot.

**2026-09-29: review of the revision** (Duminda).

- **Services dropdown** opens on hover on mouse devices (`(hover: hover) and (pointer: fine)`); click and keyboard still work.
- **Mobile menu:** Services is a collapsible accordion (closed by default).
- **Footer reveal (brief M6) is built now, not in Step 8:** the footer is sticky at the bottom behind the page, which lifts off it with rounded bottom corners (`--radius-md`). From lg (992px) only; below lg, or whenever the footer is taller than the viewport, it's in normal flow. The brief's echo bands are not built (they need phase-2 colours).
- **Buttons:** the pill style is placeholder and may change; keep Button's styling fully token-driven and variant-ready.

**2026-09-29: Step 5 decisions** (Duminda).

- Hero is one screen tall until Step 7 adds the 400vh scroll sequence.
- Work cards: the whole card is clickable.
- Gate cards: hover/focus reveal and the touch fallback are built in Step 5 (not Step 9).
- Client names: plain text for now; real logos come later.
- Team diagram: placeholder only (`[Team diagram]`); the design comes in phase 2.
- Communication: keep replies and questions short.

**2026-09-29: Step 7 defaults** (no answer given; Claude's defaults, easy to change).

- Reel: `https://www.precious.studio/assets/hero.mp4` (supplied). Corner control = Sound toggle (prototype M8), not the brief's Play chip.
- Phones: the problem line shows between the headline and the reel.
- Hero track stays 400vh (prototype).

**2026-09-29: Step 11 moved** (Duminda).

- **Step 11 (production hardening) is deferred to the very end of phase 2.** Run it as the last step of phase 2, after the rebrand, not in phase 1. Phase 1 ends with Step 12 (handoff docs).

---

## 1. Context

**Who:** Precious Studio, a senior product design studio in Austin (founded 2015). It works as an embedded team for startups, covering product design, motion and front-end code.

**Tagline:** "We design how your product feels." Everything comes back to feel: how a product moves, responds, and makes people feel.

**Audience:** early-stage founders and startup teams (often AI companies), arriving pre-researched via referrals or Clutch. They're verifying quality and relevance, not discovering what a design studio is.

**Goal of this site:** replace the current precious.studio. There is one conversion action, **Book a call**. "View case study" and "Meet the AI Design Agent" are exploration links, not CTAs.

**Voice:** plain, founder-to-founder, one idea per sentence. (Copy is fixed for this phase; this is just for context.)

**This phase:** a production-grade, fully responsive, fully animated working template of the homepage, with the rest of the sitemap scaffolded as stub pages.

**Not this phase:** brand colors, typography, iconography, final layouts, final micro-interactions, real content, and designing the inner pages.

---

## 2. Tech stack

| Concern                          | Choice                                                                                                                               | Why                                                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Framework                        | **Astro** (latest stable), TypeScript strict, static output                                                                          | Ships near-zero JS by default, content collections give typed content, and islands allow React, Three.js or Rive later only where needed |
| Styling                          | **Plain CSS with custom properties** and `@layer` (reset, tokens, base, components, utilities), scoped `<style>` in Astro components | Tokens stay the single source of truth for the phase-2 rebrand; no utility-class lock-in                                                 |
| Motion engine                    | **GSAP** + **ScrollTrigger** (SplitText available later)                                                                             | Industry standard for scroll-scrubbed timelines, robust on mobile, handles future complex choreography                                   |
| Smooth scroll                    | **Lenis**, synced to GSAP's ticker and ScrollTrigger                                                                                 | Consistent scroll feel and precise anchor offsets                                                                                        |
| Page transitions                 | **Astro View Transitions** (`<ClientRouter />`)                                                                                      | Native cross-page transitions; a hook for phase-2 transitions                                                                            |
| Content                          | **Astro Content Collections** with Zod schemas                                                                                       | Typed, CMS-ready (a headless CMS can replace the loaders later without touching components)                                              |
| SEO                              | `@astrojs/sitemap`, a custom `<Seo>` component, JSON-LD                                                                              | Needed to replace a live site                                                                                                            |
| Future-ready (don't install yet) | Three.js, Rive or Lottie as islands; `@astrojs/react` if ever needed                                                                 | Phase 2 motion or 3D                                                                                                                     |
| Hosting                          | Static; Vercel, Netlify or Cloudflare Pages (to be decided)                                                                          | Keep the adapter-agnostic `dist/` output                                                                                                 |

Package manager: pnpm (or npm if pnpm is unavailable). Node LTS.

**Lifecycle rule (important with View Transitions):** all motion code must initialise on `astro:page-load` and fully tear down (kill ScrollTriggers, timelines, observers and listeners) on `astro:before-swap`. Build this into the motion registry in Step 5.

---

## 3. Information architecture

### 3.1 Sitemap

| Route             | Status this phase                                           | Notes                                                            |
| ----------------- | ----------------------------------------------------------- | ---------------------------------------------------------------- |
| `/`               | **Build fully**                                             | Homepage from the prototype                                      |
| `/work`           | Stub                                                        | Work index (all case studies, filterable by situation tag later) |
| `/work/[slug]`    | Stub (template route, generated from the `work` collection) | Case study template                                              |
| `/ai`             | Stub                                                        | **Keep this exact URL**: it's the live AI Design Agent page      |
| `/about`          | Stub                                                        | Founders live here, not on the homepage                          |
| `/careers`        | Stub                                                        |                                                                  |
| `/careers/[slug]` | Stub (from `jobs` collection, may be empty)                 |                                                                  |
| `/journal`        | Stub                                                        |                                                                  |
| `/journal/[slug]` | Stub (from `journal` collection, may be empty)              |                                                                  |
| `/contact`        | Stub                                                        | Email, location, booking link                                    |
| `/privacy`        | Stub                                                        | Needed for the analytics and booking embed later                 |
| `/404`            | Build simply                                                | Uses the shell, with a link home and a Book a call link          |

Homepage anchors stay as in the prototype: `#work`, `#clients`, `#approach`, `#faq`, `#call`.

**Stub page spec:** the shared `StubLayout` contains the page H1, one line "This page is being rebuilt", a link back home, and the full nav and footer, plus real `<title>` and meta description from content. Stub pages are indexable only once real content exists (default `noindex` via a frontmatter flag).

### 3.2 Navigation model

- **Primary nav (desktop, as in the prototype):** Work · Approach · Clients · FAQ · [Book a call]. These are homepage anchors. On inner pages they resolve to `/#work` and so on.
- **Mobile nav (added, required for a working site):** below the `md` breakpoint, show the brand and a menu button that opens a full-screen overlay with the same links and Book a call. Needs a focus trap, Esc to close, scroll lock, `aria-expanded`, and returning focus to the button on close. Visual treatment is minimal and uses tokens (phase 2 will style it).
- **Footer nav (as in the prototype):** STUDIO: Work, Approach, AI Design Agent, About · MORE: Careers, Contact, Clutch (external).
- **Journal:** not in the prototype nav or footer. Route exists; add it to the footer MORE column only when it has posts (`showInFooter` config flag, default false).
- Nav config lives in `src/config/navigation.ts`; no link list is hard-coded in components.

### 3.3 Labels

Keep the prototype's labels exactly. The internal section IDs used in code are listed below.

| Order | Section ID      | Heading (prototype)                          |
| ----- | --------------- | -------------------------------------------- |
| 1     | `hero`          | We design how your product feels.            |
| 2     | `work`          | The proof is in how it moves.                |
| 3     | `clients`       | What working with us feels like.             |
| 4     | `team`          | One team instead of five hires.              |
| 5     | `approach`      | Where are you starting from?                 |
| 6     | `process`       | Different starting points. The same process. |
| 7     | `faq`           | Asked, answered.                             |
| 8     | `call` (footer) | Make your product feel worth paying for.     |

---

## 4. Content model (content strategy)

All copy and data comes from `src/content/` or `src/config/`. Components only render.

### 4.1 Config

`src/config/site.ts`:

- `name`, `legalName`, `url`, `location: "Austin, TX"`, `email`
- `bookingUrl`: placeholder `"#"` until Duminda provides it (Cal.com, Calendly or similar)
- `socials`: Clutch, LinkedIn, Dribbble
- `clutchRating: 4.9`
- `analytics`: an off-by-default hook

### 4.2 Collections (Zod schemas)

- **`work`** (Markdown with frontmatter): `title`, `slug`, `tag` (enum `redesign | extend-my-team | build-from-zero`, with display labels in a map), `summary` (the one line "problem → outcome"), `media` { `video?`, `poster?`, `aspect` (`16/10 | 4/5 | 4/3 | 3/4`) }, `homeSlot` (`w8 | w4 | w6 | w3 | null`), `homeOrder`, `published`. Seed four entries from the prototype, including Lumin Fitness and three `[Project]` placeholders.
- **`testimonials`**: `quote`, `name`, `role`, `company`, `logo?`, `logoLabel`, `order`. Seed from the prototype (Ramesh Balan plus the placeholders).
- **`clients`**: `name`, `logo?`, `order`. Seed: ENDEAVOR, QBE, Xoogler, XSELL, KnomadixAI, Mitsubishi.
- **`faq`**: `question`, `answer`, `order`. Seed all six from the prototype, verbatim.
- **`jobs`**, **`journal`**: schemas only, empty collections allowed.
- **`pages`** (JSON or YAML, one per page): SEO title and description, plus section copy. `home.json` holds every homepage string: hero lines, section headings and sublines, team diagram labels (including the placeholder "Some benefit"), gate cards (title, pain line, result line, card color token), process steps, AI agent link text, footer headline, and the "SEE OUR WORK →" label.

**Rule:** if a string appears on the page, it must exist in a content file. Search the components for literal copy before finishing Step 4.

---

## 5. Design system (structure now, brand later)

### 5.1 Token architecture

`src/styles/tokens.css`, in three tiers:

1. **Primitives:** raw values extracted from the prototype (for example `--color-ink-900: #141414`, `--color-maroon-950: #160a0a`, `--color-orange-500: #ee6a3c`, `--color-lime-300: #d9f07a`, `--color-forest-800: #1f3d30`, and the greys `#eee`, `#e4e4e4`, `#f0f0f0`, `#b9aeae`, `#555`, `#666`, `#777`, `#888`, `#aaa`).
2. **Semantic:** `--surface-page`, `--surface-inverse`, `--surface-muted`, `--text-primary`, `--text-secondary`, `--text-on-inverse`, `--border-subtle`, `--accent`, `--cta-bg`, `--cta-fg`, and so on.
3. **Component:** only where needed, for example `--nav-bg`, `--nav-fg`, `--gate-1-bg`.

Themes: `[data-theme="light"]` and `[data-theme="dark"]` remap semantic tokens. Sections declare their theme via the attribute; the dark Work stage is `data-theme="dark"`.

**Typography tokens:**

- Font family: `"Helvetica Neue", Helvetica, Arial, sans-serif`
- Mono for placeholders: `ui-monospace, Menlo, monospace`
- Fluid sizes copied from the prototype's `clamp()` values:
  - Hero: `clamp(48px,9vw,120px)`
  - Problem line: `clamp(36px,6vw,80px)`
  - Section H2: `clamp(32px,4.5vw,56px)`
  - Secondary H2: `clamp(28px,3.5vw,44px)`
  - Footer H2: `clamp(36px,5vw,64px)`
  - Quote: `clamp(18px,1.9vw,26px)`
  - H3: 22px; body sizes 18, 17, 16, 15, 14, 13, 12, 11
- Weights 500, 600, 700. Tracking values: `-.035em`, `-.03em`, `-.025em`, `-.02em`, `.03em`, `.04em`, `.05em`, `.06em`. Line heights `.95`, `1`, `1.05`, `1.45`, `1.5`.

**Spacing and layout:**

- Section padding: `clamp(64px,9vw,120px)` vertical and `clamp(20px,4vw,48px)` horizontal (`--section-py`, `--gutter`)
- Content max width 1200px (1100px for the team section)
- 12-column grid with a `56px 28px` gap
- Radii: 4px (buttons), 6px (media and cards), 14px and 22px (team diagram), 99px (pills)

**Motion tokens:** see 6.1.

**Breakpoints:** `sm 480`, `md 760` (the prototype's collapse point), `lg 1024`, `xl 1280`, `2xl 1600`. Stay mobile-first where practical, but reproduce the prototype's desktop exactly.

**Z-index scale:** footer 0, page 1, nav 5, mobile menu 50, skip link 100.

### 5.2 Components (atomic, prop-driven)

- **Primitives:** `Container`, `Section` (props: `id`, `theme`, `padding`), `Grid12`, `Stack`, `Cluster`.
- **UI:** `Button` (variants `solid-ink`, `solid-accent`; sizes `sm` (nav) and `md`), `TextLink` (underlined arrow link), `Tag` (outlined pill), `Pill` (Clutch badge), `MediaFrame` (renders a video, image, or the striped placeholder with a mono label, and locks the aspect ratio), `Marquee`, `Disclosure` (FAQ item), `RevealCard` (gate card).
- **Layout:** `SiteShell` (head, skip link, nav, main, footer, motion boot), `Nav`, `MobileMenu`, `CtaFooter`, `StubLayout`, `Seo`.
- **Home sections:** `Hero`, `WorkGrid`, `Clients`, `TeamDiagram`, `Gates`, `Process`, `Faq`.

Each component gets a short header comment listing its props, the tokens it uses, and its motion hooks (`data-motion="..."`).

### 5.3 Dev-only pages

`/dev/tokens` (the swatches, type scale, spacing and components on one page) and `/dev/content` (every collection rendered raw). Both `noindex` and excluded from the sitemap. These make the phase-2 rebrand easy to verify.

---

## 6. Motion system

### 6.1 Motion tokens and personality

The personality is **Premium**: calm, no overshoot. The values come from the prototype:

- Easing: `--ease-standard: cubic-bezier(.4,0,.2,1)`, `--ease-out-soft: cubic-bezier(.2,.8,.2,1)`, linear for marquees, and smoothstep for scrubbed progress.
- Durations: `--dur-fast: 200ms`, `--dur-base: 300ms`, `--dur-reveal: 450ms`, `--dur-theme: 800ms`, `--dur-page: 900ms`, `--dur-marquee: 60s`.
- Mirror these in `src/motion/tokens.ts` for GSAP use (one source of truth; read the CSS variables at runtime or generate both from one file).

### 6.2 Architecture

`src/motion/`:

- `index.ts`: a registry. Each module exports `init(root): cleanup`. The boot runs on `astro:page-load` and cleanup runs on `astro:before-swap`.
- `gsap.ts`: registers plugins and sets defaults.
- `lenis.ts`: Lenis instance, `lenis.on('scroll', ScrollTrigger.update)`, GSAP ticker drive, and anchor links with offset equal to the nav height.
- `reducedMotion.ts`: a live `matchMedia` listener. Every module must have a reduced-motion branch.
- One file per behavior: `hero.ts`, `themeSwitch.ts`, `footerReveal.ts`, `marquee.ts`, `gates.ts`, `videoInView.ts`, `soundToggle.ts`, `pageTransition.ts`.
- Elements opt in with `data-motion="hero"` and similar, with no selectors tied to styling classes.

### 6.3 Motion inventory (reproduce the prototype exactly)

**M1. Hero scroll sequence** (`hero.ts`, GSAP ScrollTrigger, `scrub`)

- The header is `400vh` tall, with a sticky inner of `100vh`, `overflow:hidden` and `perspective:1000px`. Put the height in a token (`--hero-scroll: 400vh`).
- Progress `p` runs 0→1 across (header height − viewport). All ranges use smoothstep `k(a,b)`.
- **Layer 1 (H1, three stacked lines),** over `a = k(.02,.30)`: scale `1 → 2.6`, blur `0 → 18px`, opacity `1 → 0`, word-spacing `0 → 2em`, line-height `.95 → 1.30`.
- **Layer 2 ("Most products look fine. / Few feel good.").**
  - In, over `k(.12,.36)`: scale `.55 → 1`, blur `14 → 0`, opacity `0 → 1`.
  - Out, over `k(.45,.62)`: scale adds `+1.4`, blur `0 → 18`, opacity `→ 0`, word-spacing `0 → 2em`, line-height `1 → 1.35`.
- **Layer 3 (showreel frame, 16:9, max 1200px),** over `k(.55,.85)`: scale `.35 → 1`, blur `12 → 0`, opacity `0 → 1`.
- **Reduced motion:** no transforms or blur. Hard switch at `p < .33` (L1), `.33–.6` (L2), `≥ .6` (L3).
- Blur is set to `none` when below 0.1px. Use `will-change` only while the hero is in view.
- Implementation note: build it as one GSAP timeline with the exact keyframes above mapped to progress positions. Keep the smoothstep curve with a custom ease, so the feel matches the prototype.

**M2. Section theme switch** (`themeSwitch.ts`)

- When the Work section's rect satisfies `top < 55% vh` and `bottom > 45% vh`, the page background becomes `#160a0a` (via a token) and the nav switches to its dark tokens (bg `rgba(22,10,10,.9)`, fg `#f2eeee`, border `#2a1c1c`). Otherwise it returns to light.
- Transitions: page `background-color 0.9s var(--ease-standard)`; nav `0.8s ease` on bg, color and border.
- Make it generic: any section with `data-theme-stage="dark"` triggers it. Use ScrollTrigger `onToggle` with equivalent start and end values instead of polling.

**M3. Footer curtain reveal** (`footerReveal.ts`)

- The page wrapper has `z-index:1` and an opaque background, with the fixed footer (`z-index:0`) behind it. A spacer after the page equals the footer's height.
- If the footer is taller than the viewport, it switches to `position:relative` and the spacer is hidden.
- Recalculate with a `ResizeObserver` on the footer and on viewport resize. The mobile address-bar resize must not cause jumps (use `svh` or `lvh` where needed).

**M4. Testimonial marquee** (`marquee.ts` plus CSS)

- `translateX(0 → calc(-50% - 5px))`, 60s linear, infinite; cards are `min(82vw,900px)` wide with a 10px gap.
- Pauses on hover, and also on `focus-within`.
- Content is rendered twice; the duplicate set gets `aria-hidden="true"` and `inert`.
- **Added for WCAG 2.2.2:** a visible pause/play control, styled minimally.
- Reduced motion: no animation, and the row becomes horizontally scrollable with scroll-snap.
- Pause the marquee when it's off-screen (IntersectionObserver).

**M5. Gate cards reveal** (`RevealCard`, CSS-first)

- The reveal body uses `grid-template-rows: 0fr → 1fr` over .45s `var(--ease-out-soft)`, with opacity over .3s, on `:hover` and `:focus-within`.
- **Touch fix:** on `@media (hover: none)`, show the content expanded by default.
- Keyboard: the card stays focusable (`tabindex="0"`) with a visible focus ring. The reveal text must be in the DOM for screen readers at all times; don't use `display:none`.

**M6. FAQ disclosure**

- Native `<details>` and `<summary>`; the "+" rotates 45° over 0.2s when open.
- Progressive enhancement: animate the height with `::details-content` and `interpolate-size` where supported, falling back to an instant toggle.

**M7. Case video playback** (`videoInView.ts`)

- When a `MediaFrame` has a video: `muted`, `playsinline`, `loop`, `preload="none"` and a poster. Play when at least 40% visible and pause when out of view.
- Reduced motion: don't autoplay; show the poster with a play button.
- With no video, the striped placeholder shows.

**M8. Showreel sound toggle** (`soundToggle.ts`)

- The "Sound on" pill toggles `muted`, with a label swap ("Sound on" / "Sound off") and `aria-pressed`.
- The reel autoplays muted only once Layer 3 is visible.

**M9. Global hover:** links use `opacity .7` on hover, exactly as in the prototype. Keep it as the default hover token (`--hover-opacity`).

**M10. Page transitions:** a minimal cross-fade between routes via View Transitions (`--dur-base`). Phase 2 will replace it.

**M11. Nav:** sticky, with `backdrop-filter: blur(8px)`. No hide-on-scroll (not in the prototype). Anchor clicks scroll smoothly through Lenis with the nav offset.

**Motion performance rules:**

- Animate only transform, opacity and filter. The hero is the only place blur is allowed.
- No layout-thrashing reads inside scroll callbacks; use the GSAP and ScrollTrigger cached values.
- Target 60fps on a mid-range phone.

---

## 7. Responsive spec

Test widths: 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920, plus landscape phone.

| Section | Desktop (prototype)                                                                 | ≤ md (760)                                                                          | Notes and fixes                                                                                                                                                                                                                          |
| ------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nav     | Inline links + button, wraps                                                        | Brand + menu button → overlay                                                       | Mobile menu is an addition                                                                                                                                                                                                               |
| Hero    | Three-line H1 and two-line problem line, both `nowrap`                              | Same                                                                                | **Check overflow at 320px:** "product feels." at 48px may exceed the width. If so, lower only the clamp minimum (for example to 40px). Don't allow wrapping. Keep 400vh; if it feels too long on phones, flag it rather than changing it |
| Work    | 12-col asymmetric: 8/4, then 6/3 with the w3 item offset 120px                      | Single column, no offset                                                            | As in the prototype                                                                                                                                                                                                                      |
| Clients | Title + Clutch pill; marquee; logo row (space-between, wraps); centered Book a call | Cards 82vw; logo row wraps                                                          |                                                                                                                                                                                                                                          |
| Team    | 4-col diagram (roles → gradient group → "Personalized AI engine" bar → benefits)    | **Stack vertically:** roles → a vertical connector with the engine label → benefits | The prototype has no mobile version; this is the minimum readable adaptation. Flag it for Duminda's review                                                                                                                               |
| Gates   | `auto-fit, minmax(min(100%,280px),1fr)`, 4:5 cards                                  | 1 column                                                                            | On touch, content shows expanded                                                                                                                                                                                                         |
| Process | Dark card, `auto-fit minmax(min(100%,320px),1fr)`                                   | Stacks                                                                              |                                                                                                                                                                                                                                          |
| FAQ     | Heading + list, `auto-fit minmax(min(100%,340px),1fr)`                              | Stacks                                                                              |                                                                                                                                                                                                                                          |
| Footer  | CTA spanning 2 cols + 2 link columns; big wordmark row                              | Stacks; the wordmark scales via its clamp                                           | The curtain reveal falls back to relative when the footer is taller than the viewport                                                                                                                                                    |

Also: no horizontal page scroll at any width, tap targets at least 44px, and `svh` for the sticky hero inner on mobile.

---

## 8. Quality baseline (a working website, not a mockup)

- **Accessibility:** semantic landmarks, skip link, one H1, logical heading order, visible `:focus-visible` styles, color contrast AA (report any failing pairs from the prototype palette rather than changing them), `prefers-reduced-motion` honored everywhere, marquee pause control, mobile menu focus management, alt text fields in the schemas.
- **Performance budgets:** LCP under 2.5s, CLS under 0.1, INP under 200ms, homepage JS under ~80KB gzipped (GSAP, ScrollTrigger and Lenis included). Images via `astro:assets` (AVIF/WebP, sized). Videos via poster with `preload="none"`. No layout shift from media (aspect ratios are locked).
- **SEO:** per-page title, description and canonical; Open Graph and Twitter tags with a placeholder OG image; `sitemap.xml`; `robots.txt`; JSON-LD `Organization` + `LocalBusiness` (Austin) on the home page and `FAQPage` generated from the FAQ collection.
- **Migration:** `src/config/redirects.ts` is an old URL → new URL map, applied via Astro `redirects` and the host config. `/ai` must stay unchanged. Duminda will provide the list of current URLs.
- **Analytics:** a `track(event, props)` no-op wrapper; `data-track="book-call"` on every Book a call and `data-track="case-study"` on case study links. The provider is chosen later.
- **Browsers:** latest two versions of Chrome, Safari (macOS and iOS), Firefox and Edge.

---

## 9. Build steps

Each step ends with **stop → summary → test checklist → wait for approval.**

### Step 1: Project setup and reference

- Scaffold Astro (TypeScript strict). Add GSAP, Lenis and `@astrojs/sitemap`. Set up the folder structure from sections 4–6 (empty modules are fine), a `CLAUDE.md` containing section 0 of this plan, `.editorconfig`, Prettier, and the `dev`, `build` and `preview` scripts.
- Put `prototype-source.html` in `/reference/`. It isn't served.
- **Test:**
  - [ ] `dev` runs and `build` + `preview` succeed with no errors or warnings
  - [ ] The folder structure matches the plan
  - [ ] `CLAUDE.md` exists and contains the working rules

### Step 2: Tokens, base styles and layout primitives

- Extract every value from the prototype into `tokens.css` (primitive, semantic and theme tiers), along with the reset, base typography, layer order, and the motion tokens (CSS and TS).
- Build `Container`, `Section`, `Grid12`, `Stack`, `Cluster`, `Button`, `TextLink`, `Tag`, `Pill` and `MediaFrame`.
- Build `/dev/tokens`.
- **Test:**
  - [ ] `/dev/tokens` shows every color, type size, spacing, radius and both button variants
  - [ ] Toggling `data-theme="dark"` on the dev page remaps the colors correctly
  - [ ] `MediaFrame` placeholders match the prototype stripes at each aspect ratio
  - [ ] Searching `src/components` for hex codes finds nothing

### Step 3: Content model

- Collections, schemas and `site.ts` / `navigation.ts`, seeded with prototype content verbatim. Build `/dev/content`.
- **Test:**
  - [ ] `/dev/content` lists all work items, testimonials, clients and FAQs, plus the home copy
  - [ ] All copy matches the prototype word for word
  - [ ] Breaking a required field in one entry makes the build fail with a clear error (then revert it)

### Step 4: Site shell and all routes

- `SiteShell`, `Seo`, the desktop `Nav`, `MobileMenu`, and a static `CtaFooter` (no curtain yet), plus `StubLayout`, every route from 3.1, and 404.
- **Test:**
  - [ ] Every route in the sitemap loads, including a generated `/work/lumin-fitness`
  - [ ] The nav and footer are identical to the prototype on desktop
  - [ ] Nav anchors from inner pages land on the homepage sections
  - [ ] Mobile menu opens and closes, traps focus, closes on Esc and locks scroll
  - [ ] The skip link works
  - [ ] Each page has its own title and description (check the page source)
  - [ ] A wrong URL shows the 404 page

### Step 5: Homepage static build (no motion)

- All eight sections in prototype order, fully responsive per section 7, all content from collections. Show the hero statically with Layer 1 visible (the motion comes in Step 7).
- **Test:**
  - [ ] Side-by-side with the prototype at 1440px: layout, spacing, colors and copy match
  - [ ] Check at every width listed in section 7; there's no horizontal scroll
  - [ ] The hero H1 fits on one line per row at 320px
  - [ ] The Work grid collapses at 760px
  - [ ] The team diagram's mobile stack is readable (review the adaptation)
  - [ ] FAQ items open and close
  - [ ] The whole page works with the keyboard alone
  - [ ] Every Book a call and case study link has its `data-track` attribute

### Step 6: Motion foundation

- Motion registry, GSAP setup, Lenis, reduced-motion service, anchor scrolling with the nav offset, and the View Transitions lifecycle (init and cleanup).
- **Test:**
  - [ ] Scrolling feels smooth on trackpad, mouse wheel and touch; native scroll isn't broken on iOS
  - [ ] Nav anchor clicks land with the section heading just below the nav
  - [ ] Browser back and forward and deep links (`/#faq`) work
  - [ ] Navigating home → about → home doesn't duplicate animations or listeners (check the console)
  - [ ] Turning on OS reduced motion disables smooth scroll

### Step 7: Hero scroll sequence (M1) and sound toggle (M8)

- **Test:**
  - [ ] The sequence matches the prototype frame for frame when scrubbing slowly and fast
  - [ ] Scrolling back up reverses it cleanly
  - [ ] There's no jank on a mid-range phone and in Safari (blur performance)
  - [ ] Resizing mid-sequence recalculates correctly
  - [ ] Reduced motion hard-switches between the three layers
  - [ ] The reel starts muted and plays only when visible
  - [ ] Sound on and off works, and the label updates
  - [ ] Landscape phone works

### Step 8: Theme switch (M2) and footer curtain reveal (M3)

- **Test:**
  - [ ] The page and nav turn dark as Work reaches the viewport center, and light again after it, in both scroll directions
  - [ ] The transition timing matches the prototype
  - [ ] The footer is revealed from behind the page at the end
  - [ ] On short viewports, or when the footer is taller than the screen, the footer is fully reachable
  - [ ] The iOS address bar showing or hiding causes no jump

### Step 9: Interactions (M4–M7, M9)

- Marquee with its pause control, gate reveals with the touch fallback, FAQ height animation, case video playback, and hover states.
- **Test:**
  - [ ] The marquee loops seamlessly with no visible jump, pauses on hover and focus, and the pause button works
  - [ ] Screen readers don't read the duplicated quotes (VoiceOver quick check)
  - [ ] Gate cards reveal on hover and keyboard focus, and show expanded on phone and tablet
  - [ ] FAQ opens smoothly in Chrome and instantly (no errors) in older browsers
  - [ ] With a test MP4 dropped into one work item, it plays only in view, and the poster shows first
  - [ ] Reduced motion stops the marquee (it becomes scrollable) and autoplay

### Step 10: Page transitions (M10) and stub page polish

- **Test:**
  - [ ] Route changes cross-fade
  - [ ] The nav doesn't flash
  - [ ] Scroll position resets on new pages and is restored on back
  - [ ] Hero and theme motion still work after navigating away and back

### Step 11: Production hardening (**deferred: run at the end of phase 2**, see §0.1)

- SEO (sitemap, robots, JSON-LD, OG), the redirects map, the analytics wrapper, image and video optimisation, an accessibility pass, a performance pass against the budgets, and host config files.
- **Test:**
  - [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO 100 on home
  - [ ] `sitemap.xml` lists only indexable pages
  - [ ] JSON-LD validates (Rich Results test)
  - [ ] A sample redirect works in preview
  - [ ] `/ai` resolves
  - [ ] Clicking Book a call logs a `track` event in the console (dev mode)

### Step 12: Phase-2 handoff docs

- `docs/tokens.md` (every token and where it's used), `docs/components.md` (props and variants), `docs/motion.md` (the M1–M11 catalog with the files and tokens involved), and `docs/content.md` (how to add a case study, testimonial or FAQ).
- **Test:**
  - [ ] Following `docs/content.md`, Duminda can add a case study that shows up on the homepage and at `/work/[slug]`
  - [ ] Changing one semantic color token changes the whole site consistently

---

## 10. Inputs needed from Duminda (placeholders are used until provided)

| Input                                          | Needed by                               |
| ---------------------------------------------- | --------------------------------------- |
| Booking URL (Cal.com, Calendly or similar)     | Step 4 (placeholder `#` until then)     |
| Contact email for the footer and Contact page  | Step 4                                  |
| Showreel file and case study videos or posters | Step 7 and Step 9 (test files are fine) |
| List of current precious.studio URLs           | Step 11 (redirects)                     |
| Hosting choice                                 | Step 11                                 |
| Analytics provider                             | Later                                   |

## 11. Known differences from earlier planning (intentionally not built, since the prototype wins)

These came up in the earlier strategy session but aren't in the prototype, so they're **excluded** unless Duminda asks for them:

- A trust mark line under the hero
- The "Send a screen" fallback in the footer CTA
- One quote and the Clutch rating under the final Book a call
- AI Agent and About links in the top nav
- Hero headline readable on load without scrolling (the prototype uses the pinned sequence as the first read)
- Section order (the prototype puts Clients before the Gates and Process)
