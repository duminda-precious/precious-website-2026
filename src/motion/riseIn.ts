/**
 * M3 row rise-in (brief): cards start --rise-distance lower and transparent, and
 * settle over --dur-rise as their row enters the viewport, staggered left to right
 * within the row. Rows are grouped by their top position. Both tokens are read per
 * element, so a section can override them (Journal: --rise-distance-soft,
 * --dur-rise-soft). Reduced motion: nothing moves.
 */
import { gsap, ScrollTrigger } from './gsap';
import { duration } from './tokens';
import { prefersReducedMotion } from './reducedMotion';
import type { MotionModule } from './index';

const own = (el: Element, name: string) => getComputedStyle(el).getPropertyValue(name).trim();
const px = (el: Element) => parseFloat(own(el, '--rise-distance')) || 0;
const secs = (el: Element) => {
  const raw = own(el, '--dur-rise');
  const n = parseFloat(raw) || 0;
  return raw.endsWith('ms') ? n / 1000 : n || duration('--dur-rise');
};

export const riseIn: MotionModule = {
  name: 'riseIn',
  init(root) {
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-motion="rise-in"]'));
    if (!items.length || prefersReducedMotion()) return;

    const stagger = duration('--dur-stagger');
    items.forEach((el) => gsap.set(el, { y: px(el), autoAlpha: 0 }));

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
            duration: secs(row[0]!),
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
