/**
 * Hero news stack (Claude Design). Sets data-rel on each card (0 = front, 1, 2 =
 * peeking, last = just left, rest = hidden); NewsStack.astro turns that into the
 * deck positions. Auto-advances every --dur-autoplay; pauses on hover, keyboard focus,
 * a hidden tab, or once the hero has revealed. The wheel over the stack only flips
 * cards (down = next, up = previous, looping; at most one flip per --dur-news-lock)
 * and never scrolls the page; swipe flips on touch.
 * Tokens: --dur-autoplay, --dur-news-lock, --gesture-wheel, --gesture-swipe.
 * Reduced motion: no autoplay (wheel and swipe still flip, instantly).
 */
import type { MotionModule } from './index';
import { prefersReducedMotion } from './reducedMotion';
import { length, ms } from './tokens';

export const newsStack: MotionModule = {
  name: 'newsStack',
  init(root) {
    const stack = root.querySelector<HTMLElement>('[data-news]');
    if (!stack) return;
    const cards = [...stack.querySelectorAll<HTMLElement>('[data-news-card]')];
    const N = cards.length;
    if (N < 2) return;
    const hero = stack.closest<HTMLElement>('[data-hero]');
    const controller = new AbortController();
    const { signal } = controller;
    let cur = 0;
    let last = performance.now();
    let hover = false;

    const render = () =>
      cards.forEach((c, k) => {
        const rel = (((k - cur) % N) + N) % N;
        c.dataset.rel = rel === 0 ? '0' : rel === 1 ? '1' : rel === 2 ? '2' : rel === N - 1 ? 'last' : 'rest';
        c.style.setProperty('--news-z', String(rel === N - 1 ? N + 1 : N - rel));
        if (rel === 0) c.removeAttribute('aria-hidden');
        else c.setAttribute('aria-hidden', 'true');
        c.querySelectorAll<HTMLElement>('a, button').forEach((a) =>
          rel === 0 ? a.removeAttribute('tabindex') : a.setAttribute('tabindex', '-1'),
        );
      });
    const flip = (d: number) => {
      cur = (((cur + d) % N) + N) % N;
      last = performance.now();
      render();
    };

    let acc = 0;
    let lockUntil = 0;
    stack.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        const now = performance.now();
        acc += e.deltaY;
        if (now < lockUntil) return;
        if (Math.abs(acc) > length('--gesture-wheel')) {
          flip(acc > 0 ? 1 : -1);
          acc = 0;
          lockUntil = now + ms('--dur-news-lock');
        }
      },
      { passive: false, signal },
    );
    let sx = 0;
    let sy = 0;
    stack.addEventListener(
      'touchstart',
      (e) => {
        e.stopPropagation();
        sx = e.touches[0]?.clientX ?? 0;
        sy = e.touches[0]?.clientY ?? 0;
      },
      { passive: true, signal },
    );
    stack.addEventListener(
      'touchmove',
      (e) => {
        e.stopPropagation();
        const dx = (e.touches[0]?.clientX ?? sx) - sx;
        const dy = (e.touches[0]?.clientY ?? sy) - sy;
        if (Math.abs(dx) > Math.abs(dy) && e.cancelable) e.preventDefault();
      },
      { passive: false, signal },
    );
    stack.addEventListener(
      'touchend',
      (e) => {
        const t = e.changedTouches[0];
        if (!t) return;
        const dx = t.clientX - sx;
        const dy = t.clientY - sy;
        const min = length('--gesture-swipe');
        if (Math.abs(dx) > min && Math.abs(dx) > Math.abs(dy)) flip(dx < 0 ? 1 : -1);
        else if (Math.abs(dy) > min) flip(dy < 0 ? 1 : -1);
      },
      { signal },
    );
    stack.addEventListener('mouseenter', () => (hover = true), { signal });
    stack.addEventListener('mouseleave', () => (hover = false), { signal });
    stack.addEventListener('focusin', () => (hover = true), { signal });
    stack.addEventListener('focusout', () => (hover = false), { signal });

    const iv = prefersReducedMotion()
      ? 0
      : window.setInterval(() => {
          if (hover || document.hidden || hero?.hasAttribute('data-revealed')) return;
          if (performance.now() - last >= ms('--dur-autoplay')) flip(1);
        }, 250);
    render();

    return () => {
      controller.abort();
      window.clearInterval(iv);
    };
  },
};
