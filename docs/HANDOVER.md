# Precious Studio website: handover for phase 3 (content, pages, launch)

| | |
|---|---|
| **Audience** | AI coding agents (Claude Code) and developers continuing the build |
| **Owner / approver** | Duminda (all approvals, content sign-off and open decisions go through Duminda) |
| **Repository** | `duminda-precious/precious-website-2026` |
| **Baseline** | branch `p2-design-handoff` (PR #1 into `master`), homepage complete |
| **Version** | 1.0, 2026-09-30 |
| **Status** | Ready for phase 3. Open inputs are listed in §14 |

This is the single entry point. Read it top to bottom before your first commit, then keep §3 (reference index) open while you work. Where this document and older docs disagree, this document wins (see §2).

---

## Contents

1. Goal and definition of done
2. Sources of truth and precedence
3. Reference index (where everything lives)
4. Working rules
5. Project snapshot
6. Design system
7. Motion system
8. Content: sources, rules, placeholder inventory
9. Media: images and video
10. Pages to build
11. Links and navigation
12. SEO and production hardening
13. QA and testing
14. Open decisions and inputs from Duminda
15. Delivery workflow and phase plan
16. Known issues and tech debt
17. Design backlog (to discuss)

---

## 1. Goal and definition of done

**Goal.** Take the site from "homepage built, inner pages stubbed, placeholder content" to launch-ready:

- every route in §10 is a real page, built from the existing design system;
- every string is real content, sourced per §8 (no `[bracket]` placeholders, no lorem, no mock data, no stock photos);
- every image and video slot holds the correct, final media (§9);
- every link resolves to the right place (no `#` hrefs, no dead links, §11);
- every page passes the QA matrix in §13 on the listed devices and browsers.

**Site-level definition of done** (all must be true before launch):

- [ ] `pnpm build` passes with 0 errors and 0 warnings.
- [ ] Searching `src/` for `\[[A-Z][^\]]*\]` in content and config finds no placeholders (code matches like array indexes don't count).
- [ ] No `href: '#'`, `bookingUrl: '#'` or `picsum.photos` / `*.vercel.app` media URLs remain.
- [ ] Every page has a real `seo.title` and `seo.description`, and `noindex` is `false` on every public page.
- [ ] The link check (§13.3) reports zero broken internal or external links.
- [ ] The device matrix (§13) passes for every page.
- [ ] Every drafted string (§8.2) has been approved by Duminda in its PR.

---

## 2. Sources of truth and precedence

When two sources disagree, the higher one wins. If a source is silent, **ask Duminda; do not invent.**

| Rank | Source | Governs |
|---|---|---|
| 1 | **This document** (`docs/HANDOVER.md`) and Duminda's explicit instructions in the conversation | Scope, process, phase-3 decisions |
| 2 | **Claude Design file** `reference/claude-design/Precious Home.dc.html` ("the king") | The visual design, layout, motion and copy of the homepage. Also the visual language every new page must follow |
| 3 | `docs/PRECIOUS_WEBSITE_PLAN.md` **§0.1 Decisions log** | Decisions dated before this handover |
| 4 | `docs/tokens.md`, `docs/components.md`, `docs/motion.md`, `docs/content.md` | How the system works today |
| 5 | Rest of `docs/PRECIOUS_WEBSITE_PLAN.md`, `docs/AFTERNOW_PATTERN_BRIEF.md`, `reference/prototype-source.html` | Historical. Parts are outdated (Lenis, 400vh hero, prototype nav); use only for intent |

The other Claude Design files in `reference/claude-design/` (`Button Motion`, `ContentCard`, `Gradient System`, `Motion Explorations`, `Team Funnel`) are component explorations; `screenshots/` are captures of the design. Inner pages have **no design file**: compose them from existing components and patterns (§10.1) and get the section outline approved before building.

**Content precedence** (§8): Duminda's content doc → live site (precious.studio) → agent draft flagged for approval.

---

## 3. Reference index (where everything lives)

Quick-access map. Paths are relative to the repo root.

### 3.1 Design system

| What | Where | Notes |
|---|---|---|
| All tokens (primitive → semantic → component) | `src/styles/tokens.css` | Tier 1 primitives (Slate, washes, accents), gradients, typography, spacing, layout, motion; tier 2 themes (`light`, `dark`, `ink`); tier 3 component tokens (nav, hero, news, gates, team, process, footer …) |
| Token catalogue, one row per token, with where it's used | `docs/tokens.md` | Update it whenever you add or change a token |
| Live token and component preview | `/dev/tokens` (`src/pages/dev/tokens.astro`) | Dev-only page |
| Shared type roles | `src/styles/base.css` | `.type-statement`, `.type-subline`, `.type-title`, `.type-label`, `.type-overline` |
| Reset and layer order | `src/styles/reset.css`, `src/styles/global.css` | `@layer reset, tokens, base, components, utilities` |
| Utilities | `src/styles/utilities.css` | `.visually-hidden` etc. |
| Breakpoints | `src/styles/breakpoints.ts` (JS) and the comment block in `tokens.css` | sm 30rem · **md 47.5rem (760, "mobile" is below)** · lg 62rem (992) · xl 75rem · 2xl 98.75rem. Nav collapses below 68.75rem (1100). CSS media queries use the rem values directly; phones use `max-width: 47.49rem` |
| Grid positions for the homepage Work grid | `src/config/layout.ts` | Size and aspect follow position, not entry |
| Components map (props, variants, tokens) | `docs/components.md` + the header comment in every component | The header comment is the most detailed reference |
| Brand assets | `reference/brand/` | `logo-white.svg` |

### 3.2 Components

| Folder | Contents |
|---|---|
| `src/components/primitives/` | `Section`, `SectionHeader`, `Grid12`, `GridItem`, `Stack`, `Cluster`, `space.ts` |
| `src/components/ui/` | `Button` (one size, 40px), `IconButton`, `TextLink` (plain variant), `Tag`, `Pill`, `ContentCard`, `MediaFrame` (+ `media.ts`), `Disclosure`, `ClientLogo`, `Logo` (+ `logo.ts`), `PixelIcon` (+ `pixelIcons.ts`) |
| `src/components/layout/` | `SiteShell`, `Seo`, `Nav`, `FullMenu`, `CtaFooter`, `StubLayout`, `FontLinks` |
| `src/components/home/` | `Hero`, `NewsStack`, `ClientTicker`, `WorkSection`, `ClientsSection`, `TestimonialCard`, `TeamSection`, `ApproachSection`, `ProcessSection` (AI card), `FaqSection`, `JournalSection` |

### 3.3 Motion

| What | Where |
|---|---|
| Motion catalogue M1–M18 (behaviour, file, hooks, reduced motion) | `docs/motion.md` |
| Registry, lifecycle, module order | `src/motion/index.ts` |
| Token readers (`ms`, `duration`, `ease`, `length`, `color`, `list` …) | `src/motion/tokens.ts` |
| Reduced-motion service | `src/motion/reducedMotion.ts` |
| GSAP setup and named eases | `src/motion/gsap.ts` |
| Shared engines | `src/motion/pixelWords.ts` (pixel glitch), `wing.ts` (butterfly wing cover), `pixelRain.ts` (wash + rain) |
| Page transition | `src/motion/pageTransition.ts` |
| Motion tokens | `tokens.css`, section "MOTION" (duration palette `--t-*`, semantic `--dur-*`, eases, pixel sequences, `--motion-tempo`) |

### 3.4 Content and config

| What | Where |
|---|---|
| Collection schemas (Zod), the contract for all content | `src/content.config.ts` |
| Content loaders / queries | `src/lib/content.ts` (`getWork`, `getHomeWork`, `getServices`, `getTestimonials`, `getClients`, `getFaq`, `getJobs`, `getJournal`, `getHome`, `getPage`) |
| Homepage copy (every string) | `src/content/pages/home.json` |
| Inner page SEO + H1 | `src/content/pages/*.json` |
| Case studies | `src/content/work/*.md` |
| Services | `src/content/services/*.md` |
| Jobs, journal posts | `src/content/jobs/*.md`, `src/content/journal/*.md` |
| Testimonials, clients, FAQ | `src/content/testimonials.yaml`, `clients.yaml`, `faq.yaml` |
| Site facts (email, booking, socials, address, Clutch rating) | `src/config/site.ts` |
| Navigation (primary, mega menu, full menu, footer, Book a call) | `src/config/navigation.ts` |
| UI strings (labels, aria text) | `src/config/ui.ts` |
| Situation taxonomy (Work tags) | `src/config/taxonomy.ts` |
| Redirects (old → new URLs) | `src/config/redirects.ts` (empty) |
| How-to for editors | `docs/content.md` |
| Live content preview | `/dev/content` |

### 3.5 Pages and routing

`src/pages/`: `index`, `about`, `ai`, `approach`, `contact`, `privacy`, `404`, `services/index` + `services/[slug]`, `work/index` + `work/[slug]`, `journal/index` + `journal/[slug]`, `careers/index` + `careers/[slug]`, `dev/tokens`, `dev/content`. Every non-home page currently renders `StubLayout`.

### 3.6 Commands

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # astro check + astro build (must be clean)
pnpm preview    # serve dist/ for QA
pnpm format     # prettier
```

---

## 4. Working rules

These combine `CLAUDE.md` with the phase-3 changes. `CLAUDE.md` still applies; the two changes are marked **(phase 3)**.

1. **One phase at a time** (§15). Before building, post the intended changes (pages, sections, components, content sources) and wait for Duminda's yes. When done: summary, test checklist, open questions, deviations. Then wait.
2. **Design system only.** No hex codes, raw px/rem for colour, type, spacing, radius, duration or easing in components. Need a new value? Add a token in the right tier of `tokens.css`, document it in `docs/tokens.md`, then use it. Reuse before you create: check existing components and type roles first.
3. **Copy lives in content/config.** Components contain no display text. New page content goes into a collection or a `pages/*.json` file with a schema in `content.config.ts`.
4. **(phase 3) Placeholders are replaced, not kept.** `CLAUDE.md` rule 6 (keep placeholders visible) applies only until real content exists. Phase 3 ends with zero placeholders. While a string is still missing, keep it in `[bracket]` form so it stays visible; never replace it with plausible-looking fake content.
5. **Don't invent.** No invented clients, numbers, quotes, names, awards, results or URLs. Anything not found in the content sources (§8) is drafted and flagged, or asked about.
6. **(phase 3) Verification scripts are allowed, test suites are not.** `CLAUDE.md` rule 2 (no automated tests) stands: don't commit unit, e2e or visual tests. Throwaway QA scripts (Playwright screenshots, a link crawl) are fine if kept out of the repo.
7. **Dependencies:** ask before adding any. Current: `astro`, `gsap`, `@astrojs/sitemap`; dev: `@astrojs/check`, `prettier`, `prettier-plugin-astro`, `typescript`.
8. **Motion rules** in §7.3.
9. **Accessibility is not optional**: semantic landmarks, one H1 per page, logical headings, visible focus, AA contrast, reduced motion honoured, alt text on all meaningful media.
10. **Astro scoping gotcha:** a class passed to a child component needs `.parent :global(.child-class)` in the parent's styles. Low-specificity base rules use `:where()`.

---

## 5. Project snapshot

- **Stack:** Astro 7 static output, TypeScript strict, plain CSS with custom properties and `@layer`, GSAP + ScrollTrigger + CustomEase, WAAPI and canvas for pixel effects, Astro page router (`ClientRouter`) for transitions, `@astrojs/sitemap`. No smooth-scroll library (Lenis was removed). pnpm, Node LTS.
- **Done:** the full homepage per the Claude Design file: two-step hero with news stack and reel, client ticker, Work grid, testimonials slider, team funnel, Approach sticky panel, AI card with pixel rain, FAQ, Journal teasers, footer with rain; nav (two states, Services mega menu, full-page menu with butterfly wing transition); theme switch; butterfly page transitions; responsive down to 390px; the design-system audits.
- **Stubbed:** every inner page (`StubLayout`: H1 + "being rebuilt" line + home link, `noindex`).
- **Placeholder:** services 1–3, case study bodies, journal and job examples, hero news cards, homepage journal teasers, several links and site facts (§8.3, §11).
- **Temporary media hosts:** 21 URLs point at `precious-homepage-preview-dk3n41d0v.vercel.app` (a preview deployment, not permanent) and 4 at `picsum.photos` (stock placeholders). All must be replaced (§9).

---

## 6. Design system

### 6.1 Token architecture

Three tiers in `src/styles/tokens.css`:

1. **Primitives:** raw values: the Slate scale (25–900), wash hues (sky, lavender, rose, mint, sage, blush, peach, lilac), accents (teal, rose, violet), glows, font stacks, type scale, spacing scale (`--space-*`), radii, durations (`--t-*`). **Components never use primitives directly.**
2. **Semantic:** meaning, remapped per theme (`data-theme="light" | "dark" | "ink"`): `--surface-*`, `--text-*`, `--border-*`, and the semantic `--dur-*`, `--ease-*`.
3. **Component:** only where a component needs its own knob (`--nav-*`, `--hero-*`, `--news-*`, `--gate-*`, `--team-*`, `--process-*`, `--footer-*`, `--button-height` …).

Alpha colours use `color-mix()`. Gradients (`--wash-*`) reference primitives.

### 6.2 Key conventions

- **Grid:** full-bleed 12 columns with fluid side padding (`--gutter`), no max-width wrappers. Width is controlled by span + measure tokens (`--measure-*`). Use `Grid12` / `GridItem`.
- **Section rhythm:** `Section` + `SectionHeader` (slots: eyebrow, default heading, sub, meta, action; `align="start" | "center"`). Section padding: `--section-py`, `--section-py-tight`.
- **Type roles:** `.type-statement` (section headings), `.type-subline`, `.type-title` (card titles), `.type-label` (buttons, nav, pills, uppercase mono), `.type-overline`. Components add layout only.
- **Buttons:** one size, 40px (`--button-height`), square corners (4px). `Button` for actions and CTAs (`cta` prop adds the periodic label glitch), `IconButton` for icon-only, `TextLink` for inline links.
- **Cards:** `ContentCard` (tag, title, image, CTA; hover pixel edge). Radius `--radius-md` for media and cards.
- **Themes per section:** set `data-theme` on a section to switch palette (the Work section uses the page theme switch; the AI card and footer use `ink`).
- **Mobile:** below 760px, stack to one column; tap targets at least 44px (`--tap-min`); no horizontal scroll.

### 6.3 Adding to the system

1. Search `docs/components.md` and `/dev/tokens` for something that already fits.
2. If a new component is needed, add a header comment listing props, tokens and motion hooks (copy the format of existing components), wrap styles in `@layer components`, and add it to `docs/components.md`.
3. New tokens: right tier, a short comment, a row in `docs/tokens.md`.

---

## 7. Motion system

### 7.1 Principles

**Premium, 8-bit.** Calm, decelerating, no overshoot. Pixels are sharp squares that fade (never blur), with an LCD ghost of the previous frame. Every timing, easing and pixel size is a token, read at runtime via `src/motion/tokens.ts`. Durations come from one palette (`--t-frame-fast` 40 · `--t-frame` 55 · `--t-frame-slow` 70 · `--t-wing` 125 · `--t-instant` 120 · `--t-quick` 160 · `--t-short` 200 · `--t-base` 300 · `--t-medium` 420 · `--t-slow` 560 · `--t-slower` 900 · `--t-long` 1500 ms). Semantic `--dur-*` = palette step × `--motion-tempo` (1 by default), so CSS and JS scale together. Interaction waits (autoplay, hover intent, scroll settle) are not scaled.

### 7.2 Architecture

- **Registry** (`src/motion/index.ts`): each behaviour is a module `{ name, init(root) → cleanup }`. Boots on `astro:page-load`, tears down on `astro:before-swap`, re-inits when reduced motion changes.
- **Hooks:** elements opt in with `data-*` attributes, never styling classes.
- **Catalogue:** `docs/motion.md` lists M1–M18 with files, hooks and reduced-motion behaviour.

### 7.3 Rules for new pages

- **Reuse first.** New pages get motion by using existing components and hooks: `data-motion="rise-in"` for cards and rows, `Button`/`IconButton` (hover wash + glitch come free), `ContentCard` (edge hover), `Disclosure` (FAQ), `data-motion="video-in-view"` for autoplaying card videos, the butterfly page transition (automatic), the section theme via `data-theme`.
- **No new motion without approval.** Propose it first (what, where, why, reduced-motion branch).
- If approved: follow "Adding a behaviour" in `docs/motion.md`: module in `src/motion/`, tokens only, full cleanup (AbortController for listeners, kill tweens/ScrollTriggers/observers), reduced-motion branch, register it, and check that home → page → home logs one init and one cleanup each.
- **Reduced motion:** every behaviour has a static or instant fallback. Test with the OS setting on.
- **Performance:** animate `transform` and `opacity`; canvases pause off-screen; videos play only in view.

---

## 8. Content: sources, rules, placeholder inventory

### 8.1 Sources, in priority order

1. **Duminda's content doc.** Location: **[to be supplied, §14]**. This wins over everything else.
2. **Live site, https://precious.studio.** Use it for copy, case studies, services, team, about, careers, FAQ and facts not covered by the doc. Keep a note of the source URL for every piece you take (put it in the PR description).
3. **Agent draft.** Only for what neither source has. Rules:
   - Write in the voice of the existing homepage copy (`home.json`): short, direct, plain English, second person, no hype.
   - Never draft facts: no numbers, client names, quotes, results, awards, dates, prices, people or URLs. Those must come from sources 1–2 or stay as `[bracket]` placeholders and go on the open-inputs list.
   - List every drafted string in the PR under **"Drafted copy for approval"** (file, field, text). It doesn't merge until Duminda approves it.

### 8.2 Content rules

- Every string on a page exists in a content or config file; components render only.
- Schemas in `src/content.config.ts` are the contract. Add fields there (with a comment) before using them; keep `min(1)` and length limits (SEO description ≤ 170 chars).
- Slugs: file name = URL slug (`work/lumin-fitness.md` → `/work/lumin-fitness`). Keep the live site's slugs where a page already exists (for SEO and redirects).
- `published: false` / `draft: true` hide entries; don't delete real content to hide it.
- Alt text: describe what the image shows and why it matters; empty alt only for decorative media.

### 8.3 Placeholder inventory (baseline)

| File | Field(s) | Needed |
|---|---|---|
| `src/config/site.ts` | `email` (`[hello@precious.studio]`), `bookingUrl` (`#`), `socials.clutch` (`#`), `socials.dribbble` (`#`), `socials.linkedin` (marked TODO: confirm) | Real values (§14) |
| `src/config/navigation.ts` | Mega menu: 6 Services, 7 Approach, 6 Industries items all `href: '#'`; `[Services overview]` | Real routes (§10, §11) |
| `src/content/pages/home.json` | `hero.news` (5 cards: titles, bodies, hrefs, thumbnails); `journal.items` (tags, titles, images from picsum, hrefs) | Real news items and journal posts |
| `src/content/pages/*.json` | `seo.description` placeholders (e.g. services, approach), `noindex: true` defaults | Real SEO copy; `noindex: false` at launch |
| `src/content/services/service-1..3.md` | Title, summary, body | Replace with the real services (§10.3) |
| `src/content/work/*.md` (5) | Body `[Case study content]`; media on the preview host | Full case studies + permanent media |
| `src/content/journal/example-post.md` | All fields | Real posts (or remove) |
| `src/content/jobs/example-role.md` | All fields | Real roles (or remove; careers must handle zero roles) |
| `src/content/testimonials.yaml`, `clients.yaml` | Logos (labels only today) | Real logo files, permission to use |
| Approach gates (`home.json` → `approach.gates[].media`) | Loops/photos | Real media |

Re-run the placeholder search (§1) at the end of every phase and paste the result in the PR.

---

## 9. Media: images and video

### 9.1 Where media comes from

- **Duminda supplies a media folder** (location **[§14]**). Agents never use stock images, AI-generated images or screenshots of other sites.
- **Images live in the repo:** `src/assets/<collection>/<slug>/…`, imported through `astro:assets` (`<Image>` / `<Picture>`) so Astro outputs sized AVIF/WebP. Schemas already accept `image()` for testimonial/client logos and journal covers; extend `work`, `home.journal.items` and the gates to `image()` as you wire them.
- **Video streams from Vimeo.** Background and card videos need direct file links (MP4 or HLS) so they can autoplay muted, loop, and work with the existing `<video>` components and sound toggle. Direct file links require a Vimeo plan that exposes them (Standard or higher). If only the embed player is available, stop and ask; don't swap in iframes silently.

### 9.2 Slots and specs

| Slot | Component | Ratio | Source spec | Notes |
|---|---|---|---|---|
| Showreel | `Hero` | fills viewport (16:9 on phones) | 1920×1080 min, H.264 MP4 or HLS, ≤ 30 s loop, + poster JPG | Plays muted; sound toggle |
| Case study card video + poster | `WorkSection` | by grid position (`config/layout.ts`: 3/2, 5/4, 1/1, 4/3, 1/1) | Video 1600px on the long edge, poster same frame | Plays in view only |
| Case study page media | new | as designed per section | 2400px long edge for full-bleed | |
| Hero news thumbnails | `NewsStack` | 4:3 | 480×360 min | |
| Journal covers | `ContentCard` | 1/1 and 5/6 in the menu; card aspect on the homepage | 1600px long edge | |
| Approach gate media | `ApproachSection` | per design | loop or photo | |
| Client and testimonial logos | `ClientLogo`, `TestimonialCard` | intrinsic | **SVG**, single colour | Ticker and cards tint them via tokens |
| Team photos (About) | new | 4:5 | 1200×1500 min | |
| OG image | `Seo` | 1200×630 | PNG/JPG | One default + per page where useful |

**Rules:** every slot has fixed aspect ratios so nothing shifts on load; videos have a poster and `preload="none"` except the reel; file names are lowercase kebab-case (`lumin-fitness-card.mp4`); alt text is written for every meaningful image.

### 9.3 Replace temporary hosts

All `precious-homepage-preview-dk3n41d0v.vercel.app` and `picsum.photos` URLs must be gone by launch (`grep -rn "vercel.app\|picsum" src`).

---

## 10. Pages to build

### 10.1 How to build an inner page

1. Read the live-site version of the page (if any) and the content doc.
2. Propose a section outline built **only from existing components and homepage patterns** (hero-style title, `SectionHeader` sections, `Grid12` layouts, `ContentCard` grids, `Disclosure` lists, AI/ink card, footer CTA). Post it for approval.
3. Add the schema fields and content file(s), then the page, replacing `StubLayout`.
4. Set real SEO (`title`, `description`), `noindex: false`, canonical, and OG image.
5. Run the QA matrix (§13).

### 10.2 Route list

| Route | Source today | To build |
|---|---|---|
| `/` | Built | Fill real content and media (§8.3, §9) |
| `/services` | Stub | Services overview: all services from the mega menu, each linking to its page |
| `/services/[slug]` | Stub, 3 placeholders | One page per real service (§10.3) |
| `/work` | Stub | Index of all published case studies, optionally filterable by situation tag (`config/taxonomy.ts`) |
| `/work/[slug]` | Stub | Case study template: summary, challenge, approach, outcome, media; next-project link |
| `/ai` | Stub | **Keep this exact URL** (live AI Design Agent page). Content from the live page |
| `/approach` | Stub | The three starting points (the homepage gates) in depth |
| `/about` | Stub | Studio story, founders and team (from the live site / doc) |
| `/careers`, `/careers/[slug]` | Stub | Open roles; a clear "no open roles" state when the collection is empty |
| `/journal`, `/journal/[slug]` | Stub | Post index and article template (long-form type roles; add tokens if needed) |
| `/contact` | Stub | Booking embed or link (`site.bookingUrl`), email, location |
| `/privacy` | Stub | Real privacy policy text **supplied by Duminda** (legal copy is never drafted) |
| `/404` | Stub | Short message, home link, Book a call |
| Approach and Industries items in the mega menu | `#` links | **Open decision (§14):** pages, anchors on existing pages, or removed |

### 10.3 Services

The mega menu (`navigation.ts`) lists six services with live-site descriptions: Product redesign, Design from scratch (MVP), Team extension, Hire UI/UX designer, Design as a service, UX design subscription. The `services` collection has three placeholders. Replace them with one entry per real service (matching the menu, confirmed against the live site and content doc), and generate the mega menu's Services links from the collection so the two can't drift.

---

## 11. Links and navigation

- **All nav config** is in `src/config/navigation.ts`: `primaryNav`, `megaMenu`, `fullMenu`, `bookCall`, `footerNav` (Studio, More, Social). Never hard-code links in components.
- **Book a call** goes to `/contact` everywhere (`bookCall`); `/contact` then uses `site.bookingUrl`. Keep `data-track="book-call"`.
- **External links** set `external: true` (opens a new tab with `rel="noopener noreferrer"`).
- **Hero news and journal `href`s** must point at real pages (a post, a case study, the Clutch profile …).
- **Redirects:** fill `src/config/redirects.ts` from the live site's URL list (Duminda supplies it, §14) and wire it into Astro `redirects` and the host config. `/ai` stays as it is.
- **Anchors:** in-page links use the butterfly transition (`pageTransition.ts`); section IDs are listed in the plan §3.3.

---

## 12. SEO and production hardening

This was plan Step 11 (deferred to now). Before launch:

- Per-page title, description, canonical, Open Graph and Twitter tags (`Seo.astro`); default OG image plus per-page images where useful.
- `sitemap.xml` lists only indexable pages; `robots.txt`.
- JSON-LD: `Organization` + `LocalBusiness` (Austin) on home, `FAQPage` from the FAQ collection, `Article` on journal posts, `JobPosting` on roles. Validate with the Rich Results test.
- Analytics: `track(event, props)` wrapper stays a no-op until the provider is chosen (§14); `data-track` on Book a call and case-study links.
- Performance budgets: LCP < 2.5 s, CLS < 0.1, INP < 200 ms, homepage JS ≤ ~80 KB gzipped. Images via `astro:assets`; videos lazy with posters.
- Host config (headers, redirects, caching) once the host is chosen (§14).

---

## 13. QA and testing

Run on `pnpm build && pnpm preview`, for every page touched in the phase. Record results in the PR (a table of page × check).

### 13.1 Breakpoint widths (Chromium via Playwright, throwaway script)

390 · 768 · 1024 · 1280 · 1440 · 1920 px (plus 320 and a landscape phone as a spot check). At each width:

- [ ] no horizontal scroll (`document.documentElement.scrollWidth === innerWidth`);
- [ ] nothing overlaps or clips (headings, nav, footer columns, cards);
- [ ] media keeps its aspect ratio and is filled (no empty frames);
- [ ] nav state is right (full links ≥ 1100px, 4-dot menu below; full menu opens, traps focus, closes on Esc);
- [ ] screenshots attached to the PR for 390, 1024 and 1440.

### 13.2 Real browsers (latest two versions)

Safari iOS, Chrome Android, and Safari, Chrome, Firefox, Edge on desktop. Check:

- [ ] hero two-step and reel playback (iOS autoplay rules, muted inline), sound toggle;
- [ ] backdrop-filter (frosted news cards) in Safari;
- [ ] canvas effects (pixel glitch, rain, wing transition) render and don't stutter;
- [ ] page transitions, back/forward, deep links (`/#faq`);
- [ ] forms and booking embed (Contact);
- [ ] reduced motion (OS setting) switches every behaviour to its fallback;
- [ ] keyboard only: every control reachable, visible focus, logical order.

If a real device isn't available to the agent, say so in the PR and list the checks for Duminda to run. Never mark an unrun check as passed.

### 13.3 Link check

Crawl the preview build and check every `href` and `src`:

- [ ] zero 4xx/5xx internal links; zero `#`-only hrefs;
- [ ] external links resolve (report any the sandbox can't reach, don't guess);
- [ ] every nav, mega menu, full menu and footer link lands on the intended page;
- [ ] redirects from the old URL list resolve.

Use a throwaway Playwright crawl, or ask before adding a link-check tool (e.g. `linkinator`) as a dependency.

---

## 14. Open decisions and inputs from Duminda

| # | Item | Blocks |
|---|---|---|
| 1 | Content doc location and format | Phase P3-00 onward |
| 2 | Media folder location | P3-02 onward |
| 3 | Vimeo account/plan with direct file links; video IDs | Reel, case videos |
| 4 | Booking URL (Cal.com / Calendly), contact email | P3-01, `/contact` |
| 5 | Social URLs: Clutch profile, Dribbble, confirm LinkedIn; any others | P3-01 |
| 6 | Mega menu "Approach" and "Industries" items: pages, anchors, or removed | P3-01, P3-03 |
| 7 | Final list of services (confirm the six) | P3-03 |
| 8 | Hero news items and journal posts to feature | P3-02, P3-07 |
| 9 | Current live URL list (for redirects) | P3-09 |
| 10 | Privacy policy text | P3-08 |
| 11 | Hosting (Vercel / Netlify / Cloudflare Pages) and analytics provider | P3-09 |
| 12 | Logo usage permission for clients and testimonials | P3-02 |

Add new questions here as they come up (with the date), and record answers in the PLAN §0.1 decisions log.

---

## 15. Delivery workflow and phase plan

### 15.1 Git and PRs

- **Base:** `master` once PR #1 (`p2-design-handoff`) is merged. Until then, branch from `p2-design-handoff`.
- **One branch + one PR per phase:** `p3-01-links-and-facts`, `p3-03-services`, etc. Commit per step inside the phase (`p3-03: services collection and schema`).
- **Commits and PRs** end with the attribution lines the session provides.
- **PR description:** summary · pages/files touched · content sources used (with URLs) · **Drafted copy for approval** · placeholder search result · QA table (§13) with screenshots · open questions · deviations from the design.
- Don't merge your own PR; Duminda reviews and merges.

### 15.2 Phases

| Phase | Scope | Inputs (§14) | Done when |
|---|---|---|---|
| **P3-00 Intake** | Read the content doc, crawl the live site, inventory media. Produce a gap list (per page and field: source found / needs draft / needs Duminda). No code | 1, 2 | Gap list approved |
| **P3-01 Facts and links** | `site.ts`, socials, booking, email; nav config; decide mega menu items; Services links generated from the collection | 4, 5, 6 | No `#` in config; link check on nav/footer passes |
| **P3-02 Homepage content and media** | Hero news, reel, Work media to Vimeo/repo, journal teasers, gate media, logos | 2, 3, 8, 12 | Home has zero placeholders and zero temporary hosts |
| **P3-03 Services** | `/services` + one page per service | 7 | All service pages live and linked from the mega menu |
| **P3-04 Work** | `/work` index + case study template + all case studies | 2, 3 | Every Work card on home opens a full case study |
| **P3-05 AI** | `/ai` (same URL as live) | 1 | Content parity with the live page, in the new design |
| **P3-06 About and Approach** | `/about`, `/approach` | 1, 2 | Pages live |
| **P3-07 Journal and Careers** | Indexes and templates; real posts and roles (or empty states) | 8 | Pages live; homepage and menu teasers link to real posts |
| **P3-08 Contact, Privacy, 404** | Booking, email, legal text, 404 | 4, 10 | Pages live |
| **P3-09 Hardening** | §12: SEO, JSON-LD, redirects, analytics hook, performance, accessibility, host config | 9, 11 | Budgets met; sitemap and redirects verified |
| **P3-10 Launch QA** | Full §13 matrix across all pages, placeholder and link sweeps, final fixes | all | Site-level definition of done (§1) is fully ticked |

Each phase ends with: stop → summary → test checklist → open questions → wait for approval.

---

## 16. Known issues and tech debt

- `docs/PRECIOUS_WEBSITE_PLAN.md` still describes some superseded things (Lenis, 400vh hero, prototype nav, placeholder rule). The decisions log and this document override them.
- `home.json` keeps unused fields for reuse (`hero.problem`, `team.benefits`, `team.engineLabel`, `process.steps`). Leave them unless Duminda says to remove them.
- `src/config/redirects.ts` is empty.
- Homepage news stack: frosted on desktop, solid depth greys on phones (`--news-bg-*`); `docs/motion.md` M1b describes the desktop state.
- The sandbox used during phase 2 blocked external media and fonts, so real-media rendering (reel, logos, fonts) has not been visually verified yet. Check it first in P3-02.

---

## 17. Design backlog (to discuss)

Small design ideas from Duminda, parked for a later conversation. **Don't build any of these until Duminda has discussed and approved it.** When one comes up, propose options (with a quick prototype if useful) and wait for a decision. Record the outcome in the PLAN §0.1 decisions log and remove the row here.

| # | Idea | Where it lives today | Notes for the discussion |
|---|---|---|---|
| D1 | **Page transition starts from the trigger.** The butterfly wing cover should grow from the button or link that was clicked, not from the middle of the screen. | `src/motion/pageTransition.ts`, `src/motion/wing.ts` (M10 in `docs/motion.md`) | Take the click point (or the link's centre for keyboard use) as the origin. Decide the fallback for back/forward and programmatic navigation (centre?). The full-page menu already opens from its button (`fullMenu.ts`), which is a starting point. |
| D2 | **Subtle grid in the hero background.** A barely visible pixel grid in the hero's background layer, whose pixels react to the cursor. | `src/components/home/Hero.astro` (reel + veil layers), `src/motion/heroReveal.ts` (M1) | Decide: visible in the rest state only, or after the reveal too; what the cursor does (light up, displace, trail); off on touch and under reduced motion; canvas cost next to the reel's blur. Needs new tokens (grid size, opacity, reaction radius). |
| D3 | **Explore the personalized AI engine flow.** Experiment with more options for the Team funnel's pixel flow animation. | `src/motion/teamFlow.ts`, `src/components/home/TeamSection.astro` (M16); design reference `reference/claude-design/Team Funnel.dc.html` | Explore several directions side by side (e.g. in a `/dev` page) before picking one. Keep the roles → engine → outputs story readable on phones. |
| D4 | **AI section: a stronger window/portal.** The fixed background should be more prominent so the card reads as a window onto a fixed scene. Possibly an entirely new layout, depending on the final content. | `src/components/home/ProcessSection.astro`, `src/motion/aiCard.ts`, `src/motion/pixelRain.ts` (M17) | Settle the content first (heading, stat, points, CTA), then explore layout options. Push the fixed layer further (more visible glow, rain or imagery behind a clear frame edge). Check the scroll feel on iOS, where fixed layers behave differently. |

