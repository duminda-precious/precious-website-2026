/**
 * Full-page menu (Claude Design). The nav's 4-dot button opens [data-menu].
 *   Open:  white pixels wipe out from the menu button in the butterfly wing pattern
 *          (--dur-menu-open), the menu appears, then the links rise in one after
 *          another and the cards follow (--dur-menu-item / --dur-menu-card).
 *   Close: the menu dissolves back into pixels that clear toward the button
 *          (--dur-menu-close) and reveal the page.
 * Following a link inside the menu closes it at once (the page transition takes over).
 * Services is an accordion. Focus is trapped while open; Esc closes; the page can't
 * scroll; focus returns to the menu button.
 * Tokens: --surface-overlay, --dur-menu-*, --menu-rise, --menu-card-rise, --ease-out-expo,
 *         --gutter, --icon-button, --nav-height.
 * Reduced motion: opens and closes at once.
 */
import type { MotionModule } from './index';
import { prefersReducedMotion } from './reducedMotion';
import { cssVar, ease, length, ms } from './tokens';
import * as wing from './wing';

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const fullMenu: MotionModule = {
  name: 'fullMenu',
  init(root) {
    const menu = root.querySelector<HTMLElement>('[data-menu]');
    const opener = root.querySelector<HTMLElement>('[data-menu-open]');
    if (!menu || !opener) return;
    const controller = new AbortController();
    const { signal } = controller;
    const html = root.documentElement;
    let isOpen = false;
    let busy = false;
    let anims: Animation[] = [];

    const origin = () => {
      const r = opener.getBoundingClientRect();
      return r.width
        ? { x: r.left + r.width / 2, y: r.top + r.height / 2 }
        : { x: window.innerWidth - length('--gutter') - length('--icon-button') / 2, y: length('--nav-height') / 2 };
    };
    const overlay = () => {
      const probe = getComputedStyle(menu).backgroundColor;
      return probe && probe !== 'rgba(0, 0, 0, 0)' ? probe : cssVar('--color-white');
    };
    const riseIn = () => {
      if (prefersReducedMotion()) return;
      const out = ease('--ease-out-expo');
      menu.querySelectorAll<HTMLElement>('[data-menu-item]').forEach((el, i) =>
        anims.push(
          el.animate(
            [{ opacity: 0, transform: `translateY(${cssVar('--menu-rise')})` }, { opacity: 1, transform: 'none' }],
            {
              duration: ms('--dur-menu-item'),
              delay: ms('--dur-menu-item-delay') + i * ms('--dur-menu-item-stagger'),
              easing: out,
              fill: 'both',
            },
          ),
        ),
      );
      menu.querySelectorAll<HTMLElement>('[data-menu-card]').forEach((el, i) =>
        anims.push(
          el.animate([{ opacity: 0, transform: `translateY(${cssVar('--menu-card-rise')})` }, { opacity: 1, transform: 'none' }], {
            duration: ms('--dur-menu-card'),
            delay: ms('--dur-menu-card-delay') + i * ms('--dur-menu-card-stagger'),
            easing: out,
            fill: 'both',
          }),
        ),
      );
    };
    const lock = (on: boolean) => html.classList.toggle('is-scroll-locked', on);

    const open = async () => {
      if (isOpen || busy) return;
      busy = true;
      isOpen = true;
      opener.setAttribute('aria-expanded', 'true');
      lock(true);
      menu.hidden = true;
      if (!prefersReducedMotion()) await wing.cover(overlay(), ms('--dur-menu-open'), origin());
      menu.hidden = false;
      wing.clear();
      riseIn();
      menu.querySelector<HTMLElement>('[data-menu-close]')?.focus();
      busy = false;
    };
    const close = async (instant = false) => {
      if (!isOpen || busy) return;
      busy = true;
      isOpen = false;
      opener.setAttribute('aria-expanded', 'false');
      anims.forEach((a) => a.cancel());
      anims = [];
      if (instant || prefersReducedMotion()) {
        menu.hidden = true;
        lock(false);
      } else {
        wing.coverNow(overlay(), origin());
        menu.hidden = true;
        lock(false);
        await wing.reveal(ms('--dur-menu-close'));
      }
      if (!instant) opener.focus();
      busy = false;
    };

    opener.addEventListener('click', () => void open(), { signal });
    menu.querySelector('[data-menu-close]')?.addEventListener('click', () => void close(), { signal });
    menu.querySelectorAll('[data-menu-link]').forEach((a) =>
      a.addEventListener('click', () => void close(true), { signal }),
    );
    const acc = menu.querySelector<HTMLButtonElement>('[data-menu-accordion]');
    acc?.addEventListener(
      'click',
      () => acc.setAttribute('aria-expanded', String(acc.getAttribute('aria-expanded') !== 'true')),
      { signal },
    );
    document.addEventListener(
      'keydown',
      (e) => {
        if (!isOpen) return;
        if (e.key === 'Escape') {
          e.preventDefault();
          void close();
          return;
        }
        if (e.key !== 'Tab') return;
        const f = [...menu.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
          (n) => n.offsetParent !== null && getComputedStyle(n).visibility !== 'hidden',
        );
        if (!f.length) return;
        const first = f[0]!;
        const last = f[f.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      },
      { signal },
    );

    return () => {
      controller.abort();
      anims.forEach((a) => a.cancel());
      menu.hidden = true;
      lock(false);
      opener.setAttribute('aria-expanded', 'false');
      acc?.setAttribute('aria-expanded', 'false');
    };
  },
};
