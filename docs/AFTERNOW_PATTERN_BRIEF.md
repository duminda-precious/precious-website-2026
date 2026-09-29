# Afternow Homepage — Design Pattern Brief

A pattern study of afternow.co (homepage only), written as a handoff for Claude Code. The goal is to **rebuild the patterns** (layout logic, type hierarchy, motion and responsiveness), not to clone the site. Don't copy their copy, imagery, logo or wordmark treatment.

**Method:** live inspection at 1920px desktop (screenshots, DOM and computed styles), with mobile and tablet behavior read from their CSS media rules. The mobile screens were not visually captured, so treat section 7 as the intended behavior and verify it while rebuilding.

**Stack they use (for context only):** WordPress theme, Lenis smooth scroll, GSAP-style pinned scroll (pin-spacer), Swiper for the testimonials. The patterns map directly onto the Astro + GSAP + Lenis stack in `PRECIOUS_WEBSITE_PLAN.md`.

---

## 0. Slop check

Checked against Slop Patterns v1.1.1. Automated check: the section 10 CSS recipes were run through the checker, and only A12 (Bento Reflex) fired. The rest was reviewed by hand against the full library.

| Code | Pattern | Where | Guardrail |
|---|---|---|---|
| A12 | Bento Reflex | §2.4 Work grid | The order is an editorial ranking (strongest project in the big slot). Use the recipe only for work media, never for stats, icons or one-line tiles. |
| A35 | [name] | §6.3 Motion tokens | Ration entrances: rise-in for grid items only; headlines use the line-mask reveal; statements, buttons, hairlines and the footer stay static. |
| A22 | [name] | §4.2–4.3 Tracking | Tune tracking to the typeface: start at −2% for display, never below −4% at 40px or more, body at 0. |
| A49/A14 | [name] | §6.2 M8 Logo marquee | Visible pause control; pause on hover and focus; stop off-screen; real client logos only. |
| A64/A68 | [name] | §6.2 M1 step 4, §3 item 2 | Grey headline only once the media covers it; at rest it passes WCAG AA. The announcement card must not cover content. |
| A66 | [name] | §6.2 M5, M10 | Reveals use transform or clip-path, not height or width transitions. |
| A67 | [name] | §10 GSAP notes | Never ship opacity:0 in CSS; set hidden start states from JS so content stays visible if the script fails. |
| A23 | [name] | §2.2 Eyebrows | At most one or two eyebrows per page, and only when they add information. |
| A38 | [name] | §2.10 Section gap | Vary gaps by relationship: tighter within a section, largest between unrelated sections. |
| A8/A3 | [name] | §6.2 M4 pills, §2.5 Services | Blur only for legibility over busy media (a solid chip is equally valid). Equal peer cards only for real, distinct services with their own pages. |

Checked and clean: no gradients, glows, blobs, bounce easing (A62), centred hero (A11), italic serif swap (A9), wide-tracked body (A51), long lines (A71), single typeface (A2).

Not verifiable from the brief: mobile overflow (B34). Check it on a real phone during the rebuild.

---

## 1. Design character in one paragraph

The UI is monochrome (white, black, warm light greys) and gets all its color from the work media. Type uses one sans family for content and one mono family for everything that is UI or metadata. Layouts span the full viewport width on a 12-column grid, with no centered max-width column. Composition is asymmetric: text hugs the left edge, actions hug the right edge, and the empty columns in between are deliberate. Motion is calm and weighty: pinned media that expands, content that rises in rows, and a page that lifts off to reveal the footer underneath. Nothing bounces.

---

## 2. Layout system (the core of this brief)

### 2.1 Full-bleed 12-column grid, no max-width

- Every section uses the same `.container`: `display:grid`, 12 equal columns, a fixed 24px column gap, and **no `max-width`**. The only inset is a fluid side padding of about 16px on mobile to 32px on desktop (a `clamp()` token).
- So at 1920px the grid really is 1856px wide. Content scales with the screen instead of floating in a centered box. **This is the single most important pattern.**
- Because the grid is always full width, "narrowness" is created by **spans and measure**, never by a wrapper. Section 2.3 explains how.

**Rebuild rule:** one `Grid` primitive (12 columns, fluid padding, no max-width) is used by every section. Never add a `max-width: 1200px; margin: auto` wrapper.

### 2.2 Edge-anchored section headers (the three-zone header)

Almost every section opens with the same header anatomy on one grid row:

| Zone | Columns | Content | Alignment |
|---|---|---|---|
| Left | 1–3 | Mono uppercase eyebrow (optional) | Start |
| Middle / left | 4–9 **or** 1–9 | Statement paragraph in large sans | Start |
| Right | 10–12 | One pill button | **End** (`justify-self:end`) |

- Eyebrows are rare. Use at most one or two per page, and only when they add information rather than repeat the heading.
- With an eyebrow, the statement starts at column 4, which creates an indented "editorial" column (see Clients).
- Without an eyebrow, the statement starts at column 1 and the gap to the right-hand button is empty space (see Work, Services, Journal).
- The button sits flush to the right edge, top-aligned with the statement's first line. The eye reads left to right: what we say, then what you can do.

This header rhythm repeats across every section, which gives a long page a strong, predictable pulse without boxing anything in.

### 2.3 Span is not width: capping the measure inside a wide span

- The statement heading is placed on `span 9`, but its rendered width is only about 60% of that. A `max-width` in `ch` or `em` limits the line length while the grid placement stays generous.
- The result keeps a readable line length (about 55–65 characters) while the page still feels full width. The unused part of the span becomes breathing room that reads as intentional.

**Rebuild rule:** place with the grid and constrain with measure. Use `grid-column: 1 / span 9; max-width: 32ch` (tune per type size). Don't shrink the span to control line length.

### 2.4 The Work grid: positional span recipe and ragged bottoms

The showpiece. It's full width with a large row gap and a small column gap.

- **Mobile:** 1 column.
- **≥768:** 2 equal columns.
- **≥992:** 12 columns, with spans assigned by **position in the list** (`:nth-child`) rather than per-item settings:
  - Item 1: `span 6` (half width, the hero project)
  - Items 2–3: `span 3` each (two narrow projects beside it)
  - Items 4–9: `span 4` (two rows of three)
- **Aspect ratio is also assigned by position** through a CSS variable (`--media-aspect-ratio`). The mix of 3:2, 5:4, 1:1 and 4:3 is distributed so that neighbours never share a ratio.
- `align-items: start`, so every card keeps its own height. Rows have **ragged bottoms**, and the captions under each media sit at different heights. The grid looks curated and editorial, like a magazine spread, not a uniform card grid.
- The row gap is large (fluid, roughly 54–96px) and the column gap is small (fluid, 16–24px). The media almost touch sideways but breathe vertically, so each row reads as one strip.

The order is an editorial ranking: the big slot always goes to the strongest project, never filled by date or at random. Use this recipe only for work media, never for stats, icons or one-line tiles.

**Rebuild rule:** an ordered list with CSS `:nth-child` span and aspect maps. After item 9, repeat the 4-4-4 pattern or restart the cycle.

### 2.5 Equal-share rows with flex (Services)

- Five service cards in **one flex row** (`flex: 1 1 0`), full grid width, with a hairline gap (about 3–4px). The cards almost form one segmented panel.
- Cards are tall. The title sits at the top and the description is pushed to the bottom (`justify-content: space-between`). The empty middle is deliberate.
- **Responsive via flex-basis, not breakpoints per card:**
  - `<1200px`: `flex-wrap: wrap` with `flex: 1 1 300px`. As many cards as fit per row, and the last row stretches.
  - `<992px`: `flex: 1 1 100%` (full-width stack).

Equal peer cards only work because each is a real, distinct service with its own page. No filler features.

**Why flex here and grid elsewhere:** the grid is used where the *composition* matters (asymmetric placement). Flex is used where items are *peers* that should share space equally and reflow on their own.

### 2.6 Content hung in the gutter columns (Clients)

- The testimonial card spans columns 4–9, aligned under the indented statement above it, so there's a shared left edge at column 4.
- A small linked case-study card sits in columns 1–3, **anchored to the bottom** of the testimonial row (`align-self: end`). It uses the otherwise empty left columns without competing with the quote.
- The slider controls sit inside the card at the bottom right. Columns 10–12 stay empty on purpose.

This is the clearest example of "not framing into one column": three things on one row, each on its own column track and vertical anchor.

### 2.7 True full-bleed breakouts

Some elements ignore the side padding and run edge to edge (`grid-column: 1 / -1` plus a negative margin equal to the padding, or placed outside the container):

- **Logo marquee:** logos scroll continuously and are cut off by the viewport edges on both sides, which signals "there are more".
- **Hero media at full expansion:** fills the viewport minus the header and padding.
- **Full-width hairline separators** (`<hr>` on `1 / -1`) open the Clients, Services and Journal sections. They are the only "frame" and they're open, not boxed.

### 2.8 Journal grid

- 4 columns at desktop, 2 below 992px, 1 below 768px.
- Media heights vary (different aspect ratios per card), so the tops align and the bottoms are ragged, the same logic as Work.
- Each card: media (radius), mono tag chips, then the title in the h5 sans size. News-type cards swap the title for a longer excerpt.

### 2.9 Footer composition

- The top row uses the same three-zone logic: the largest headline on the page plus a pill CTA on the left, and a newsletter form on the right (columns 8–12).
- The bottom row is on the 12-column grid with legal links and copyright in mono on the left, and a **giant wordmark spanning about 7 columns, flush right**, with social chips under it.
- The wordmark is sized to the columns, not to a type-scale step. It's a layout element.

### 2.10 Shared layout tokens

| Token (role) | Behavior |
|---|---|
| Side padding | Fluid, about 16 → 32px |
| Column gap | 24px desktop (smaller on mobile) |
| Section gap | Very large and fluid (about 124 → 192px). Sections are separated by space, not backgrounds. Vary the gaps by relationship: tighter within a section, largest between unrelated sections. |
| Header → content gap | Medium-large, fluid (about 42 → 64px) |
| Grid row gap (work) | Large, fluid (about 54 → 96px) |
| Radius | One value (about 12px) for all media, cards and the content sheet; pills are fully rounded |
| Header height | About 62px |

All spacing is a named, fluid `clamp()` scale from 3xs to 3xl, interpolated between roughly 320px and 1920px viewports. There are no fixed breakpoint jumps for spacing.

---

## 3. Section anatomy (top to bottom)

1. **Header / nav.** The wordmark logo stands alone at the far left. On the right is a cluster of mono uppercase links, a black pill "Contact", and a dot-grid menu icon. Once scrolled, a light-grey rounded backdrop fades in behind the right cluster, turning it into a floating pill bar. The logo never gets a backdrop.
2. **Floating announcement card** (optional). A small dismissible card under the nav at the top right: thumbnail, title, one line, and a mono link. It persists while you scroll until closed. Observed issue: it covered the Work section's 'Explore our work' button and card media. If rebuilt, reserve space for it or dock it clear of content.
3. **Hero.** A short headline anchored bottom-left, and a centered 16:9 media tile that expands on scroll (see M1). The headline is small relative to the media, because the media is the message.
4. **Work.** Three-zone header (statement plus pill), then the positional grid. Each card has the media, then the title (sans h5), a one-line description (grey), and a mono result chip.
5. **Clients.** Hairline, eyebrow, indented statement, pill. Then the testimonial slider with the gutter-hung case card, and the full-bleed logo marquee.
6. **Services.** Hairline, statement, pill. A large gap, then the five-card flex strip.
7. **Journal.** Hairline, one-line statement, pill, then the four-column journal grid.
8. **Footer** (revealed underneath, see M6).
9. **Menu overlay** (dot-grid icon). A full-screen white layer. The left half shows featured case-study cards anchored to the bottom. The right half is a large sans link list, with sub-items (services) inset and in grey, and social chips at the bottom.

---

## 4. Typography hierarchy

### 4.1 Two families, strict roles

| Family | Role | Treatment |
|---|---|---|
| **Sans (grotesk)** | All content: headlines, statements, titles, body, quotes | Sentence case, weights 400 and 500 only, tight negative tracking that grows with size |
| **Mono** | All UI and metadata: nav links, buttons, eyebrows, tags/chips, form labels, legal, social links | UPPERCASE, small (12–16px), slight negative tracking, line-height 1 |

This is the key hierarchy device. You can tell "something to read" from "something to click or scan" by family alone, before size or color. It lets the sans headlines stay calm (no bold, no caps) because the mono carries all the functional signalling.

### 4.2 Scale (roles, fluid, all `clamp()`)

| Role | Approximate desktop size | Weight | Tracking | Line height | Used for |
|---|---|---|---|---|---|
| Display 1 | about 106px | 500 | about −5% | about 1.09 | Footer closer headline (the largest type on the page, saved for the end) |
| Display 2 | about 86px | 500 | about −4% | about 1.1 | Hero headline on mobile |
| H2 | about 54px | 500 | about −4% | about 1.1 | Hero headline on desktop (deliberately smaller than the media) |
| Menu | about 44px | 400 | about −4% | about 1.1 | Menu overlay links |
| H3 / statement | about 36px | 500 | about −4% | about 1.1 | Section statements (paragraph-length headlines) |
| Stat | about 36px | 400 | about −4% | about 1.1 | Testimonial numbers |
| H5 | about 28px | 500 (work) / 400 (journal) | about −3% | about 1.1 | Card titles |
| Large | about 22px | 400 | about −3% | 1.2 | Featured card titles |
| Medium | about 20px | 400 | about −2% | 1.35 | Quotes, service titles |
| Body | 16px | 400 | about −2% (rebuild at 0) | 1.45 | Descriptions |
| Mono UI | 14–16px | 400 / 500 | about −2% | 1 | Nav, buttons, eyebrows, chips |

### 4.3 Hierarchy principles to reproduce

- **Statements are headlines.** Section "headings" are full sentences or short paragraphs at H3 size. There are no short title-plus-subtitle pairs, which makes the page read like a narrative.
- **Only two weights.** Hierarchy comes from size, family and grey level, not bold.
- **Tune tracking to the typeface.** Start at −2% for display, never below −4% at 40px or more, and body at 0.
- **Line height tightens with size.** It's about 1.1 for anything 28px and up, and about 1.45 for body text.
- **Grey carries secondary information.** Descriptions and captions use a mid grey, with no extra size step.
- **Headlines are split into lines** (a `.line` wrapper per line, with a small bottom padding and negative margin so descenders aren't clipped). This enables line-mask reveals.

---

## 5. Color and surface (pattern only)

- The UI palette is white, black and two or three warm light greys (card and chip backgrounds, hover state). There is no brand accent in the UI chrome.
- Color arrives through the work media and the "echo" frames and bands (M1 and M6), so it always relates to the work.
- There are no section background bands. Sections are separated by white space and hairlines. The only dark surface is the footer.

---

## 6. Motion design

### 6.1 Personality

The motion is **Premium and editorial**: long, decelerating eases with no overshoot or bounce, large travel distances (100px or more), and slow reveals. Motion signals weight and craft rather than playfulness. Smooth scrolling (Lenis) is global and is part of the feel.

### 6.2 Motion inventory

**M1. Hero: clip reveal, then pinned expansion with echo frames** (desktop and tablet, 768px and up)
1. **On load:** the media tile starts as a clip-path collapsed to its centre (inset 50% with rounded corners) and opens outward into a small centred 16:9 tile. The headline lines rise in under a line mask at the bottom left.
2. **On scroll (pinned):** the hero is pinned for about 120vh (capped at 1200px). The tile scales from centred-small to fill the content area (viewport minus header and padding), with its corner radius preserved.
3. **Echo frames:** two or three rounded rectangles in accent colors trail behind the tile's edges as it scales, like a motion trail or onion skin. This gives a sense of depth and speed without blur.
4. The headline fades to low-contrast grey as the media takes over. Grey only once the media covers the headline. At rest it must pass WCAG AA.
5. The media cycles through several reel clips. A small "▸ PLAY" chip at the bottom right opens the full reel.
6. **On release:** the white content "sheet" scrolls up over the pinned hero.
7. **Mobile:** no pin and no scale. The headline sits at Display 2 size above a 16:9 video, with a visible play button (touch has no hover).

**M2. Section-content sheet.** All content after the hero lives on one white sheet with rounded bottom corners. It rides over the pinned hero at the top and lifts off the footer at the bottom (M6). The page reads as one physical card.

**M3. Row-based rise-in** (Work grid, Journal grid)
- Each card starts at `translateY(120px)`, opacity 0, and animates to its resting position as its **row** enters the viewport.
- It's staggered **left to right within the row**: the first column settles first and the last column lags slightly. This reads like a wave across the row rather than one block.
- The ease is a long deceleration (ease-out, roughly 0.8–1.2s). Media may show a neutral grey wash until it loads, which hides image pop-in.

**M4. Work card hover** (only on `(hover:hover) and (pointer:fine)`)
- The media scales to 1.05 inside its rounded mask (the mask stays put), and video media start playing or advance.
- Service pills appear as a stacked column in the top-left corner of the media: small mono chips on translucent white with a backdrop blur, staggered in. The blur is for legibility over busy media, not decoration. A solid chip is an equally valid rebuild.
- On touch devices the pills are always visible (`(hover:none)`). The same effect applies on `:focus-within` for keyboard users.

**M5. Services card hover.** The card background darkens one grey step. The description slides up and an "EXPLORE X ▸" mono link row is revealed at the bottom (a transform or clip-path reveal, not a height transition). The neighbouring cards don't change.

**M6. Footer reveal with echo bands**
- The footer is `position: sticky` beneath the content sheet (lower z-index).
- As the sheet's rounded bottom scrolls away, two thin colored bands, each slightly smaller than the last with the same radius, peel away with it. It's a layered-paper stack, the same "echo" idea as the hero, which bookends the page.
- Below 992px the footer becomes `position: relative`, so there's no reveal.

**M7. Nav backdrop.** At the top the right-side cluster floats with no background. Once scrolled, a light-grey rounded backdrop fades in and the actions settle (a small translate to zero). The logo is untouched. There's no hide-on-scroll.

**M8. Logo marquee.** Continuous, linear, infinite, full bleed. The logos are monochrome and evenly spaced. Visible pause control; pause on hover and focus; stop when off-screen; real client logos only.

**M9. Testimonial slider.** Cross-fade or slide between testimonials. The gutter case-study card and the stats update with the slide. The arrows are small square buttons.

**M10. Journal card hover.** The circular arrow icon in the media corner expands into a pill that reveals its label ("READ ARTICLE →"), with the width animating from the icon outwards. Rebuild with transform or clip-path, not a width transition.

**M11. Menu overlay.** A full-screen white layer. The link list fades or rises in and the featured cards appear bottom-left. Esc closes it.

**M12. Pill buttons.** Black pill, mono uppercase label, and a small ▸ glyph. The hover is subtle (a tone shift or glyph nudge), with no scale.

### 6.3 Motion tokens (principles)

- **One signature ease:** a strong decelerating curve (ease-out-expo style) for entrances, and linear only for marquees.
- **Duration palette:** quick (about 200ms) for hovers, standard (about 400–600ms) for reveals, slow (about 900ms–1.2s) for row rise-ins and the hero clip, and scrubbed for the pinned sequences.
- Entrances are rationed: the rise-in is for grid items only (Work, Journal); headlines use the line-mask reveal; statements, buttons, hairlines and the footer stay static.
- **Reduced motion** (`prefers-reduced-motion: reduce`): no pin, no scale, no rise-in; the marquee stops and content is simply present.

---

## 7. Responsiveness

Breakpoints are Bootstrap-like: 576 / 768 / 992 / 1000 (nav) / 1200 / 1580 / 1920.

| Area | ≥1200 | 992–1199 | 768–991 | <768 |
|---|---|---|---|---|
| Nav | Links + pill + menu icon | Same | Logo + menu icon (<1000) | Same |
| Hero | Pinned expansion with echoes | Same | Same | No pin; Display 2 headline above a 16:9 video with a play button |
| Section headers | 3-zone row | 3-zone row | Button wraps under the statement (flex-wrap) | Stacked |
| Work grid | 12-col positional spans | Same | 2 equal columns | 1 column |
| Clients | Card cols 4–9, case card in cols 1–3 | Same | Stacks | Stacks; controls go full width, logo moves above the author |
| Services | 5 in a row | Wrap with 300px basis | 1 per row | 1 per row |
| Journal | 4 columns | 2 columns | 2 columns | 1 column |
| Footer | Sticky reveal, 12-col bottom row | Relative, no reveal | Relative | Relative, CTA full width |

**Principles:**
- **Fluid first, breakpoints second.** Type, spacing and padding are all `clamp()`, so most screen sizes need no breakpoint at all. Breakpoints only change *structure* (column count, pinning, nav).
- **Hover effects are gated by capability,** not by width: `(hover:hover) and (pointer:fine)`. Touch devices get the "revealed" state by default.
- **Heavy motion is gated by width.** Pinning, the reveal footer and scaled media are desktop and tablet only.

---

## 8. States and components

| Component | Default | Hover / focus | Touch | Notes |
|---|---|---|---|---|
| Pill button | Black, white mono label, ▸ | Subtle tone and glyph shift; visible focus ring | Same as default | One style site-wide |
| Nav link | Mono uppercase | Opacity or underline shift | — | |
| Work card | Media + title + description + result chip | Media zoom 1.05, service pills in | Pills always visible | Whole card is a link |
| Result chip | Grey rectangle, square corners, mono | — | — | Metadata |
| Service pill | Hidden | Translucent white, blur, rounded, mono | Visible | Overlays the media |
| Service card | Light grey, title top, description bottom | One step darker, link row revealed | Link row visible | |
| Journal card | Media + tags + title | Arrow icon expands to a labelled pill | Icon only | |
| Announcement card | Floating top right | — | — | Dismissible (×) |

---

## 9. Accessibility (observed)

- A skip-to-content link (mono) is present.
- Focus states are defined for chips and links, and hover reveals also work on `:focus-within`.
- `prefers-reduced-motion` is honored.
- Watch out when rebuilding: the grey low-contrast hero headline and the grey descriptions need contrast checks, and the marquee needs a pause control.

---

## 10. Rebuild recipes (for Claude Code)

```css
/* 10.1 Full-bleed grid primitive — no max-width */
.grid { display:grid; grid-template-columns:repeat(12,minmax(0,1fr));
  column-gap:var(--gutter); padding-inline:var(--pad-x); }
.bleed { margin-inline:calc(var(--pad-x) * -1); } /* edge-to-edge breakout */

/* 10.2 Three-zone section header */
.sh__eyebrow { grid-column:1 / span 3; }
.sh__statement { grid-column:4 / span 6; max-width:34ch; }   /* or 1 / span 9 when no eyebrow */
.sh__cta { grid-column:10 / -1; justify-self:end; align-self:start; }
@media (max-width:991.98px){ .sh > * { grid-column:1 / -1; justify-self:start; } }

/* 10.3 Positional work grid */
.work { display:grid; gap:var(--space-l) var(--space-xs); align-items:start; }
@media (min-width:768px){ .work { grid-template-columns:1fr 1fr; } }
@media (min-width:992px){
  .work { grid-template-columns:repeat(12,1fr); }
  .work > * { grid-column:span 4; }
  .work > :nth-child(1) { grid-column:span 6; }
  .work > :nth-child(2), .work > :nth-child(3) { grid-column:span 3; }
}
.work > :nth-child(1), .work > :nth-child(6) { --ar:3/2; }
.work > :nth-child(2) { --ar:5/4; }
.work > :nth-child(3), .work > :nth-child(5) { --ar:1/1; }
.work > :nth-child(4), .work > :nth-child(7) { --ar:4/3; }
.card__media img, .card__media video { aspect-ratio:var(--ar,4/3); object-fit:cover; }

/* 10.4 Peer strip with flex reflow */
.strip { display:flex; gap:3px; }
.strip > * { flex:1 1 0; display:flex; flex-direction:column; justify-content:space-between; }
@media (max-width:1199.98px){ .strip { flex-wrap:wrap; } .strip > * { flex:1 1 300px; } }
@media (max-width:991.98px){ .strip > * { flex:1 1 100%; } }

/* 10.5 Capability-gated hover */
@media (hover:hover) and (pointer:fine){ .card:hover .card__pills { opacity:1; } }
@media (hover:none){ .card__pills { opacity:1; visibility:visible; } }
```

**GSAP notes:**
- **Hero:** `ScrollTrigger` with `pin:true` and `end:"+=min(120vh,1200px)"`, `scrub`. Animate the tile's `scale` (or width and height via a FLIP from the small to the full rect). The echo frames are separate absolutely-positioned rounded divs whose scale lags by stepped scrub offsets.
- Never ship opacity:0 in CSS. Set the hidden start state from JS (an html.js class) so content stays visible if the script fails.
- **Rise-in:** use `ScrollTrigger.batch` on the cards, grouped by row (same `offsetTop`), with `y:120 → 0`, `autoAlpha:0 → 1`, and a small `stagger` in DOM order.
- **Footer:** CSS sticky plus a content sheet with a bottom radius. The echo bands are two sibling divs between the sheet and the footer with decreasing inset.

---

## 11. What not to copy

- Their copy, logo, wordmark footer treatment and client imagery.
- The exact echo-frame colors and the hero composition as a whole. Reuse the *idea* (motion trails or layered sheets) with Precious's own expression in phase 2.
- The announcement card, unless Precious has a real announcement.

---

## 12. How these patterns could map to Precious (suggestions, not instructions)

| Afternow pattern | Possible Precious use |
|---|---|
| Full-bleed 12-column grid, no max-width | Replace the prototype's 1200px wrappers in phase 2 |
| Three-zone header | Work, Clients, FAQ headers (statement left, single exploration link or CTA right) |
| Positional work grid with ragged bottoms | Precious's four-project work grid (the w8/w4/w6/w3 layout is already a cousin of this) |
| Gutter-hung case card | Clients testimonial marquee paired with its case study |
| Flex peer strip | "Where are you starting from?" gates, or the team roles |
| Mono for UI and metadata | Situation tags, buttons, nav |
| Row rise-in and footer lift-off | Already close to Precious's curtain footer, so align the easing and personality |

Any of these changes the prototype, so they belong in phase 2 or need Duminda's approval first. The phase 1 rule "prototype wins" still stands.
