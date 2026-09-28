/**
 * M3 row rise-in (brief): cards start --rise-distance lower and transparent, and
 * settle as their row enters the viewport, staggered left to right within the
 * row. Rows are grouped by their top position. Reduced motion: nothing moves.
 */
import { gsap, ScrollTrigger } from './gsap';
import { duration } from './tokens';
import { prefersReducedMotion } from './reducedMotion';
import type { MotionModule } from './index';

function cssPx(name: string): number {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;
}

export const riseIn: MotionModule = {
  name: 'riseIn',
  init(root) {
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-motion="rise-in"]'));
    if (!items.length || prefersReducedMotion()) return;

    const distance = cssPx('--rise-distance');
    const stagger = duration('--dur-stagger');
    gsap.set(items, { y: distance, autoAlpha: 0 });

    const triggers = ScrollTrigger.batch(items, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => {
        // Group this batch into rows (same top), then stagger each row left to right.
        const rows = new Map<number, HTMLElement[]>();
        (batch as HTMLElement[]).forEach((el) => {
          const top = Math.round(el.getBoundingClientRect().top);
          rows.set(top, [...(rows.get(top) ?? []), el]);
        });
        rows.forEach((row) => {
          row.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
          gsap.to(row, {
            y: 0,
            autoAlpha: 1,
            duration: duration('--dur-rise'),
            ease: 'outExpo',
            stagger,
            overwrite: true,
          });
        });
      },
    });

    return () => {
      triggers.forEach((t) => t.kill());
      gsap.killTweensOf(items);
      gsap.set(items, { clearProps: 'transform,opacity,visibility' });
    };
  },
};
