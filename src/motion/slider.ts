/**
 * Testimonial slider (M9). The row is native horizontal scroll-snap; the ← → buttons
 * move one card at a time and disable at the ends. Reduced motion: instant jumps.
 */
import { prefersReducedMotion } from './reducedMotion';
import type { MotionModule } from './index';

export const slider: MotionModule = {
  name: 'slider',
  init(root) {
    const controller = new AbortController();
    const { signal } = controller;

    root.querySelectorAll<HTMLElement>('[data-motion="slider"]').forEach((el) => {
      const track = el.querySelector<HTMLElement>('[data-slider-track]');
      const prev = el.querySelector<HTMLButtonElement>('[data-slider-prev]');
      const next = el.querySelector<HTMLButtonElement>('[data-slider-next]');
      if (!track || !prev || !next) return;

      const step = () => {
        const first = track.firstElementChild as HTMLElement | null;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return first ? first.offsetWidth + gap : track.clientWidth;
      };
      const update = () => {
        const max = track.scrollWidth - track.clientWidth;
        prev.disabled = track.scrollLeft <= 1;
        next.disabled = track.scrollLeft >= max - 1;
      };
      const go = (dir: 1 | -1) =>
        track.scrollBy({
          left: dir * step(),
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });

      prev.addEventListener('click', () => go(-1), { signal });
      next.addEventListener('click', () => go(1), { signal });
      track.addEventListener('scroll', update, { passive: true, signal });
      window.addEventListener('resize', update, { passive: true, signal });
      update();
    });

    return () => controller.abort();
  },
};
