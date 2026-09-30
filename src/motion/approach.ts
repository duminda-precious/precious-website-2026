/**
 * Approach sticky text (Claude Design). From md, the left text panel follows the
 * page: it stays centred on screen (just below the nav's half-height), never rises
 * above the first card's media centre or sinks below the last one's, so it lines up
 * with each card as it passes. The card whose media is nearest the middle of the
 * screen is active: its panel fades in (data-active) while the previous one slides
 * away (data-before for panels above it). Hover or keyboard focus on a card makes it
 * active too. Only the active panel's link is in the tab order.
 * Tokens: --nav-height, --dur-expand, --dur-collapse (CSS).
 * Reduced motion: the panel still follows (it's layout), the swap is instant (CSS).
 */
import type { MotionModule } from './index';
import { length } from './tokens';

const MD_UP = '(min-width: 47.5rem)';

export const approach: MotionModule = {
  name: 'approach',
  init(root) {
    const wrap = root.querySelector<HTMLElement>('[data-gates]');
    if (!wrap) return;
    const cards = [...wrap.querySelectorAll<HTMLElement>('[data-gate]')];
    const panels = [...wrap.querySelectorAll<HTMLElement>('[data-gate-panel]')];
    const side = wrap.querySelector<HTMLElement>('[data-gate-side]');
    const text = wrap.querySelector<HTMLElement>('[data-gate-text]');
    if (!cards.length || !side || !text) return;
    const wide = window.matchMedia(MD_UP);
    const controller = new AbortController();
    const { signal } = controller;
    let active = -1;

    const setActive = (i: number) => {
      if (i === active) return;
      active = i;
      panels.forEach((p, k) => {
        p.toggleAttribute('data-active', k === i);
        p.toggleAttribute('data-before', k < i);
        p.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', k === i ? '0' : '-1'));
      });
    };
    const update = () => {
      if (!wide.matches) {
        text.style.transform = '';
        return;
      }
      const vh = window.innerHeight;
      let best = -1;
      let bd = Infinity;
      cards.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - vh / 2);
        if (d < bd && r.bottom > 0 && r.top < vh) {
          bd = d;
          best = i;
        }
      });
      const cr = side.getBoundingClientRect();
      const th = text.offsetHeight;
      const centre = (el: HTMLElement) => {
        const m = (el.firstElementChild as HTMLElement).getBoundingClientRect();
        return m.top + m.height / 2 - cr.top;
      };
      const lo = centre(cards[0]!);
      const hi = centre(cards[cards.length - 1]!);
      const y = Math.min(hi, Math.max(lo, vh / 2 + length('--nav-height') / 2 - cr.top)) - th / 2;
      text.style.transform = `translateY(${Math.round(y)}px)`;
      if (best >= 0) setActive(best);
    };
    let raf = 0;
    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          update();
        });
    };
    window.addEventListener('scroll', onScroll, { passive: true, signal });
    window.addEventListener('resize', onScroll, { signal });
    wide.addEventListener('change', onScroll, { signal });
    cards.forEach((c, i) => {
      c.addEventListener('mouseenter', () => setActive(i), { signal });
      c.addEventListener('focus', () => setActive(i), { signal });
    });
    setActive(0);
    update();

    return () => {
      controller.abort();
      cancelAnimationFrame(raf);
      text.style.transform = '';
    };
  },
};
