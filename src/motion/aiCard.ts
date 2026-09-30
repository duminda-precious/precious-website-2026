/**
 * AI card (Claude Design).
 *   Window: the glow + rain layer is one viewport tall and counter-translated as the
 *   card scrolls, so it stays still on screen: the card works like a window onto it.
 *   Entrance: when 30% of the card is visible, its content rises in (--process-rise,
 *   --dur-process-rise, staggered --dur-process-stagger) and the stat counts up from
 *   0 in ten steps of --dur-count-step.
 * The pixel rain itself is pixelRain.ts.
 * Tokens: --process-rise, --dur-process-rise, --dur-process-stagger, --dur-count-step,
 *         --dur-count-delay,
 *         --ease-out-expo, --motion-tempo.
 * Reduced motion: the window still holds still (layout); no rise, no count.
 */
import type { MotionModule } from './index';
import { prefersReducedMotion } from './reducedMotion';
import { cssVar, ease, ms } from './tokens';

export const aiCard: MotionModule = {
  name: 'aiCard',
  init(root) {
    const card = root.querySelector<HTMLElement>('[data-ai]');
    if (!card) return;
    const win = card.querySelector<HTMLElement>('[data-ai-window]');
    const RM = prefersReducedMotion();
    const controller = new AbortController();
    const { signal } = controller;
    const timers: number[] = [];

    let raf = 0;
    const place = () => {
      raf = 0;
      if (!win) return;
      const r = win.parentElement!.getBoundingClientRect();
      win.style.transform = `translate3d(0,${-r.top}px,0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(place);
    };
    window.addEventListener('scroll', onScroll, { passive: true, signal });
    window.addEventListener('resize', onScroll, { signal });
    place();

    let io: IntersectionObserver | null = null;
    const items = [...card.querySelectorAll<HTMLElement>('[data-ai-rise]')];
    const stat = card.querySelector<HTMLElement>('[data-ai-stat]');
    if (!RM) {
      items.forEach((el) => (el.style.opacity = '0'));
      io = new IntersectionObserver(
        (es) => {
          if (!es.some((e) => e.isIntersecting)) return;
          io?.disconnect();
          items.forEach((el, i) =>
            el.animate([{ opacity: 0, transform: `translateY(${cssVar('--process-rise')})` }, { opacity: 1, transform: 'none' }], {
              duration: ms('--dur-process-rise'),
              delay: i * ms('--dur-process-stagger'),
              easing: ease('--ease-out-expo'),
              fill: 'forwards',
            }),
          );
          if (stat) {
            const target = Number(stat.dataset.value) || 0;
            const N = 10;
            let k = 0;
            stat.textContent = '0';
            const step = () => {
              k++;
              stat.textContent = String(Math.round((target * k) / N));
              if (k < N) timers.push(window.setTimeout(step, ms('--dur-count-step')));
            };
            timers.push(window.setTimeout(step, ms('--dur-count-delay')));
          }
        },
        { threshold: 0.3 },
      );
      io.observe(card);
    }

    return () => {
      controller.abort();
      io?.disconnect();
      cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
      if (win) win.style.transform = '';
      items.forEach((el) => {
        el.style.opacity = '';
        el.getAnimations().forEach((a) => a.cancel());
      });
      if (stat) stat.textContent = stat.dataset.value ?? stat.textContent;
    };
  },
};
