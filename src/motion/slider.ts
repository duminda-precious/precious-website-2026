/**
 * Testimonial slider (M9, Claude Design). The row is native horizontal scroll-snap
 * holding three copies of the cards; it starts on the middle copy and, once scrolling
 * settles (--dur-scroll-settle), silently re-centres onto the middle copy, so it loops
 * endlessly in both directions. ← → move one card. Every --dur-autoplay it advances
 * one card on its own, paused on hover, keyboard focus and a hidden tab.
 * Arrow hover: the arrow glitches (sideways jumps and slices in 6 hard steps,
 * --dur-icon-glitch); the solid fill is CSS.
 * Tokens: --dur-autoplay, --dur-scroll-settle, --dur-icon-glitch.
 * Reduced motion: no autoplay, no glitch; buttons jump instantly.
 */
import { prefersReducedMotion } from './reducedMotion';
import { ms } from './tokens';
import type { MotionModule } from './index';

export const slider: MotionModule = {
  name: 'slider',
  init(root) {
    const controller = new AbortController();
    const { signal } = controller;
    const timers: number[] = [];
    const RM = prefersReducedMotion();

    root.querySelectorAll<HTMLElement>('[data-motion="slider"]').forEach((el) => {
      const track = el.querySelector<HTMLElement>('[data-slider-track]');
      const prev = el.querySelector<HTMLButtonElement>('[data-slider-prev]');
      const next = el.querySelector<HTMLButtonElement>('[data-slider-next]');
      if (!track || !prev || !next) return;
      const looping = !!track.querySelector('[data-slide-copy]');
      const step = () => {
        const first = track.firstElementChild as HTMLElement | null;
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return first ? first.offsetWidth + gap : track.clientWidth;
      };
      const setW = () => track.scrollWidth / 3;
      const jump = (x: number) => {
        track.style.scrollBehavior = 'auto';
        track.style.scrollSnapType = 'none';
        track.scrollLeft = x;
        requestAnimationFrame(() => {
          track.style.scrollSnapType = '';
          track.style.scrollBehavior = '';
        });
      };
      const go = (dir: 1 | -1) =>
        track.scrollBy({ left: dir * step(), behavior: RM ? 'auto' : 'smooth' });

      if (looping) {
        requestAnimationFrame(() => jump(setW()));
        let settle = 0;
        track.addEventListener(
          'scroll',
          () => {
            window.clearTimeout(settle);
            settle = window.setTimeout(() => {
              const w = setW();
              if (track.scrollLeft < w * 0.5) jump(track.scrollLeft + w);
              else if (track.scrollLeft > w * 1.5) jump(track.scrollLeft - w);
            }, ms('--dur-scroll-settle'));
          },
          { passive: true, signal },
        );
        timers.push(settle);
      }
      prev.addEventListener('click', () => go(-1), { signal });
      next.addEventListener('click', () => go(1), { signal });

      if (!RM) {
        // Arrow glitch
        [prev, next].forEach((b) =>
          b.addEventListener(
            'mouseenter',
            () => {
              b.querySelector('svg')?.animate(
                [
                  { transform: 'translate(0,0)', clipPath: 'inset(0)' },
                  { transform: 'translate(-3px,0)', clipPath: 'inset(0 0 60% 0)' },
                  { transform: 'translate(3px,1px)', clipPath: 'inset(40% 0 0 0)' },
                  { transform: 'translate(-1px,-1px)', clipPath: 'inset(20% 0 30% 0)' },
                  { transform: 'translate(2px,0)', clipPath: 'inset(0)' },
                  { transform: 'none', clipPath: 'inset(0)' },
                ],
                { duration: ms('--dur-icon-glitch'), easing: 'steps(6,end)' },
              );
            },
            { signal },
          ),
        );
        // Autoplay
        let paused = false;
        el.addEventListener('mouseenter', () => (paused = true), { signal });
        el.addEventListener('mouseleave', () => (paused = false), { signal });
        el.addEventListener('focusin', () => (paused = true), { signal });
        el.addEventListener('focusout', () => (paused = false), { signal });
        timers.push(
          window.setInterval(() => {
            if (!paused && !document.hidden) go(1);
          }, ms('--dur-autoplay')),
        );
      }
    });
    return () => {
      controller.abort();
      timers.forEach((t) => {
        window.clearInterval(t);
        window.clearTimeout(t);
      });
    };
  },
};
