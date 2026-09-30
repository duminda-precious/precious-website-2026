/**
 * Nav states and the Services mega menu (Claude Design).
 *   data-scrolled  page scrolled at all → the wordmark clips down to the butterfly.
 *   data-mini      scrolled, or narrower than 1100px → links and Book a call tuck into
 *                  the 4-dot menu button (CSS in Nav.astro).
 * Mega menu: opens on hover (mouse) or click on the Services trigger; closes when the
 * pointer leaves for --dur-hover-intent, on Escape, on outside click, or when the
 * nav goes mini. Open: the panel unfolds downward (--dur-mega-in, --ease-emphasized)
 * and the columns cascade in left to right. Close: faster (--dur-mega-out, --ease-exit).
 * Tokens: --dur-mega-in, --dur-mega-out, --dur-nav-fade, --dur-cascade-*, --dur-hover-intent, --ease-emphasized,
 *         --ease-exit, --ease-snappy, --radius-md.
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
    const R = () => cssVar('--radius-md');

    const setMega = (want: boolean) => {
      if (!panel || !trigger || want === open) return;
      open = want;
      trigger.setAttribute('aria-expanded', String(want));
      anims.forEach((a) => a.cancel());
      anims = [];
      if (want) {
        panel.setAttribute('data-open', '');
        if (prefersReducedMotion()) return;
        anims.push(
          panel.animate(
            [
              { opacity: 0, transform: 'translateY(-8px)', clipPath: `inset(0 0 100% 0 round ${R()})` },
              { opacity: 1, transform: 'none', clipPath: `inset(0 0 0 0 round ${R()})` },
            ],
            { duration: ms('--dur-mega-in'), easing: ease('--ease-emphasized'), fill: 'forwards' },
          ),
        );
        panel.querySelectorAll<HTMLElement>('[data-mega-col]').forEach((col, ci) => {
          const items = [col.firstElementChild, ...col.querySelectorAll('[data-mega-item]')].filter(
            Boolean,
          ) as HTMLElement[];
          items.forEach((it, k) =>
            anims.push(
              it.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], {
                duration: ms('--dur-nav-fade'),
                delay:
                  ms('--dur-cascade-start') +
                  ci * ms('--dur-cascade-column') +
                  Math.min(k, 6) * ms('--dur-cascade-item'),
                easing: ease('--ease-snappy'),
                fill: 'backwards',
              }),
            ),
          );
        });
      } else {
        if (prefersReducedMotion()) {
          panel.removeAttribute('data-open');
          return;
        }
        const a = panel.animate(
          [
            { opacity: 1, transform: 'none', clipPath: `inset(0 0 0 0 round ${R()})` },
            { opacity: 0, transform: 'translateY(-6px)', clipPath: `inset(0 0 12% 0 round ${R()})` },
          ],
          { duration: ms('--dur-mega-out'), easing: ease('--ease-exit'), fill: 'forwards' },
        );
        a.onfinish = () => {
          if (!open) {
            panel.removeAttribute('data-open');
            a.cancel();
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
        setMega(true);
      };
      const leave = (e: MouseEvent) => {
        const to = e.relatedTarget as Node | null;
        if (!to || (!host.contains(to) && !panel.contains(to))) suppress = false;
        if (!hoverable.matches) return;
        window.clearTimeout(leaveT);
        leaveT = window.setTimeout(() => setMega(false), ms('--dur-hover-intent', true));
      };
      [host, panel].forEach((n) => {
        n.addEventListener('mouseenter', enter, { signal });
        n.addEventListener('mouseleave', leave, { signal });
      });
      trigger.addEventListener(
        'click',
        () => {
          window.clearTimeout(leaveT);
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
