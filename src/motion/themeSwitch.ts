/**
 * M2 section theme switch. While a [data-theme-stage="dark"] section spans the
 * viewport (its top passes 75% of the viewport and its bottom is above 45%), the page
 * wrapper and the nav switch to their dark tokens; outside it they return to
 * light. Colours transition in CSS (--dur-page on the page, --dur-theme on the nav).
 * Without JS the stage section paints its own dark surface; once this module
 * runs, html[data-theme-switch] makes the stage transparent so the page colour shows.
 * From md (760px) only: on phones the page stays white (the dark theme tokens are
 * also scoped to md+ in tokens.css). gsap.matchMedia sets up / tears down on resize.
 */
import { gsap, ScrollTrigger } from './gsap';
import type { MotionModule } from './index';

const MD_UP = '(min-width: 47.5rem)';

export const themeSwitch: MotionModule = {
  name: 'themeSwitch',
  init(root) {
    const page = root.querySelector<HTMLElement>('[data-page]');
    const nav = root.querySelector<HTMLElement>('[data-nav]');
    const stages = root.querySelectorAll<HTMLElement>('[data-theme-stage="dark"]');
    if (!page || !stages.length) return;

    const html = root.documentElement;
    const mm = gsap.matchMedia();

    mm.add(MD_UP, () => {
      html.setAttribute('data-theme-switch', '');
      const active = new Set<HTMLElement>();
      const apply = () => {
        const dark = active.size > 0;
        for (const [el, attr] of [
          [page, 'data-page-theme'],
          [nav, 'data-nav-theme'],
        ] as const) {
          if (!el) continue;
          if (dark) el.setAttribute(attr, 'dark');
          else el.removeAttribute(attr);
        }
      };

      const triggers = Array.from(stages).map((stage) =>
        ScrollTrigger.create({
          trigger: stage,
          start: 'top 75%',
          end: 'bottom 45%',
          onToggle: (self) => {
            if (self.isActive) active.add(stage);
            else active.delete(stage);
            apply();
          },
        }),
      );
      apply();

      return () => {
        triggers.forEach((t) => t.kill());
        active.clear();
        page.removeAttribute('data-page-theme');
        nav?.removeAttribute('data-nav-theme');
        html.removeAttribute('data-theme-switch');
      };
    });

    return () => mm.revert();
  },
};
