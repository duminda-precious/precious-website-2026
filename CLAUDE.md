# CLAUDE.md — Precious Studio website

Full plan: `docs/PRECIOUS_WEBSITE_PLAN.md`. Read it before writing code, **starting with §0.1 Decisions log**, which overrides older parts of the plan. Layout/type/spacing/UI patterns: `docs/AFTERNOW_PATTERN_BRIEF.md`.

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

---
