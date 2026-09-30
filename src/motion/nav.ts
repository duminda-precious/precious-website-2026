/**
 * Nav states and the Services mega menu (Claude Design).
 *   data-scrolled  page scrolled at all → the wordmark clips down to the butterfly.
 *   data-mini      scrolled, or narrower than 1100px → links and Book a call tuck into
 *                  the 4-dot menu button (CSS in Nav.astro).
 * Mega menu: opens on hover (mouse) or click on the Services trigger; closes when the
 * pointer leaves for --dur-hover-intent, on Escape, on outside click, or when the
 * nav goes mini. A click that lands while a hover-open is still unfolding keeps it
 * open. Open: the panel unfolds downward (--dur-mega-in, --ease-emphasized), each
 * column's heading and first few links cascade in left to right, then the note band
 * rises in as one piece. Close: faster (--dur-mega-out, --ease-exit); items hold
 * where they are instead of snapping to full opacity.
 * Tokens: --dur-mega-in, --dur-mega-out, --dur-nav-fade, --dur-cascade-*, --dur-hover-intent, --ease-emphasized,
 *         --ease-exit, --ease-snappy, --radius-md, --mega-drop, --mega-rise.
 * Reduced motion: the panel shows and hides at once.
 */
import type { MotionModule } from './index';
import { prefersReducedMotion } from './reducedMotion';
import { cssVar, ease, ms } from './tokens';

const MINI_BELOW = '(max-width: 68.74rem)';

export const nav: MotionModule = {
  name: 'nav',
  init(root) {
    const el = root.querySelector<HTMLElement>('[data-nav]');
    if (!el) return;
    el.setAttribute('data-nav-ready', '');
    const controller = new AbortController();
    const { signal } = controller;
    const narrow = window.matchMedia(MINI_BELOW);

    const trigger = el.querySelector<HTMLButtonElement>('[data-mega-trigger]');
    const host = el.querySelector<HTMLElement>('[data-mega-host]');
    const panel = el.querySelector<HTMLElement>('[data-mega]');
    let open = false;
    let anims: Animation[] = [];
    let leaveT = 0;
    let hoverOpenedAt = 0;
    const R = () => cssVar('--radius-md');
    // Stagger caps at this many links per column, so long columns don't trail.
    const CASCADE_STEPS = 3;

    const setMega = (want: boolean) => {
      if (!panel || !trigger || want === open) return;
      open = want;
      trigger.setAttribute('aria-expanded', String(want));
      if (want) {
        anims.forEach((a) => a.cancel());
        anims = [];
        panel.setAttribute('data-open', '');
        if (prefersReducedMotion()) return;
        const drop = `translateY(calc(${cssVar('--mega-drop')} * -1))`;
        const rise = `translateY(${cssVar('--mega-rise')})`;
        anims.push(
          panel.animate(
            [
              { opacity: 0, transform: drop, clipPath: `inset(0 0 100% 0 round ${R()})` },
              { opacity: 1, transform: 'none', clipPath: `inset(0 0 0 0 round ${R()})` },
            ],
            { duration: ms('--dur-mega-in'), easing: ease('--ease-emphasized'), fill: 'forwards' },
          ),
        );
        const start = ms('--dur-cascade-start');
        const perCol = ms('--dur-cascade-column');
        const perItem = ms('--dur-cascade-item');
        const riseIn = (el: Element, delay: number) =>
          anims.push(
            el.animate([{ opacity: 0, transform: rise }, { opacity: 1, transform: 'none' }], {
              duration: ms('--dur-nav-fade'),
              delay,
              easing: ease('--ease-snappy'),
              fill: 'backwards',
            }),
          );
        const cols = panel.querySelectorAll<HTMLElement>('[data-mega-col]');
        cols.forEach((col, ci) => {
          const items = [col.firstElementChild, ...col.querySelectorAll('[data-mega-item]')].filter(
            Boolean,
          ) as Element[];
          items.forEach((it, k) => riseIn(it, start + ci * perCol + Math.min(k, CASCADE_STEPS) * perItem));
        });
        // The note band (text + button) arrives together, after the last column starts.
        const note = panel.querySelector('[data-mega-note]');
        if (note) riseIn(note, start + cols.length * perCol);
      } else {
        if (prefersReducedMotion()) {
          anims.forEach((a) => a.cancel());
          anims = [];
          panel.removeAttribute('data-open');
          return;
        }
        // Freeze the cascade where it is; the panel fades over it.
        anims.forEach((a) => a.pause());
        const a = panel.animate(
          [
            { opacity: 1, transform: 'none', clipPath: `inset(0 0 0 0 round ${R()})` },
            {
              opacity: 0,
              transform: `translateY(calc(${cssVar('--mega-rise')} * -1))`,
              clipPath: `inset(0 0 12% 0 round ${R()})`,
            },
          ],
          { duration: ms('--dur-mega-out'), easing: ease('--ease-exit'), fill: 'forwards' },
        );
        a.onfinish = () => {
          if (!open) {
            panel.removeAttribute('data-open');
            anims.forEach((x) => x.cancel());
            anims = [];
          }
        };
        anims.push(a);
      }
    };

    // Scroll / width states
    let ticking = false;
    const update = () => {
      ticking = false;
      const scrolled = window.scrollY > 0;
      const mini = scrolled || narrow.matches;
      el.toggleAttribute('data-scrolled', scrolled);
      el.toggleAttribute('data-mini', mini);
      if (mini) setMega(false);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true, signal });
    narrow.addEventListener('change', update, { signal });
    update();

    if (trigger && host && panel) {
      const hoverable = window.matchMedia('(hover: hover) and (pointer: fine)');
      // After a deliberate close (Esc, click, outside click) hover can't reopen it
      // until the pointer has left the trigger and panel.
      let suppress = false;
      const enter = () => {
        if (!hoverable.matches || el.hasAttribute('data-mini') || suppress) return;
        window.clearTimeout(leaveT);
        if (!open) hoverOpenedAt = performance.now();
        setMega(true);
      };
      const leave = (e: MouseEvent) => {
        const to = e.relatedTarget as Node | null;
        if (!to || (!host.contains(to) && !panel.contains(to))) suppress = false;
        if (!hoverable.matches) return;
        window.clearTimeout(leaveT);
        leaveT = window.setTimeout(() => setMega(false), ms('--dur-hover-intent'));
      };
      [host, panel].forEach((n) => {
        n.addEventListener('mouseenter', enter, { signal });
        n.addEventListener('mouseleave', leave, { signal });
      });
      trigger.addEventListener(
        'click',
        () => {
          window.clearTimeout(leaveT);
          // Hover opened it a moment ago: this click meant "open", so keep it.
          if (open && performance.now() - hoverOpenedAt < ms('--dur-mega-in')) return;
          if (open) suppress = true;
          setMega(!open);
        },
        { signal },
      );
      document.addEventListener(
        'keydown',
        (e) => {
          if (e.key === 'Escape' && open) {
            suppress = true;
            setMega(false);
            trigger.focus();
          }
        },
        { signal },
      );
      document.addEventListener(
        'click',
        (e) => {
          if (open && !host.contains(e.target as Node) && !panel.contains(e.target as Node)) {
            suppress = true;
            setMega(false);
          }
        },
        { signal },
      );
      panel.addEventListener(
        'focusout',
        (e) => {
          const next = e.relatedTarget as Node | null;
          if (next && !panel.contains(next) && !host.contains(next)) setMega(false);
        },
        { signal },
      );
    }

    return () => {
      controller.abort();
      window.clearTimeout(leaveT);
      anims.forEach((a) => a.cancel());
      panel?.removeAttribute('data-open');
      trigger?.setAttribute('aria-expanded', 'false');
    };
  },
};
