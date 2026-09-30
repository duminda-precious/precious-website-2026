/**
 * Page transitions (Claude Design): the butterfly wing transition.
 *  - Between routes: when navigation starts (astro:before-preparation) the cover
 *    wipes in over --dur-page-cover while the next page loads in parallel; after the
 *    swap it holds for --dur-page-hold, then wipes out over --dur-page-reveal.
 *  - In-page anchors (<a href="#id">): same wipe; the jump happens while covered.
 * The cover takes the destination's background (--page-bg; Deep Ink for dark
 * targets such as the footer), so the butterfly carries through into the next view.
 * Set up once (not per page) because it spans the swap. The browser's own
 * view-transition cross-fade is off (SiteShell).
 * Tokens: --dur-page-cover, --dur-page-hold, --dur-page-reveal, --page-bg, --page-bg-dark,
 *         --nav-height.
 * Reduced motion: no cover; instant.
 */
import * as wing from './wing';
import { prefersReducedMotion } from './reducedMotion';
import { color, cssVar, length, ms } from './tokens';

let setUp = false;
const wait = (t: number) => new Promise((r) => window.setTimeout(r, t));

/** Background of the view we're going to: dark for dark-themed targets. */
function bgFor(target: Element | null): string {
  const dark =
    target?.closest('[data-theme="ink"], [data-theme="dark"]') ||
    target?.querySelector(':scope > [data-theme="ink"]');
  return dark ? cssVar('--page-bg-dark') || color('--color-slate-900') : cssVar('--page-bg');
}

export function setupPageTransition() {
  if (setUp) return;
  setUp = true;
  let covering: Promise<void> | null = null;

  document.addEventListener('astro:before-preparation', (event) => {
    if (prefersReducedMotion()) return;
    covering = wing.cover(cssVar('--page-bg'), ms('--dur-page-cover'));
    const load = event.loader;
    event.loader = async () => {
      await Promise.all([covering, load()]);
    };
  });
  document.addEventListener('astro:after-swap', () => {
    if (!covering) return;
    covering = null;
    void wait(ms('--dur-page-hold')).then(() => wing.reveal(ms('--dur-page-reveal')));
  });

  // In-page anchors
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const a = (e.target as Element).closest?.('a[href^="#"]');
    if (!a || a.closest('[data-menu]')) return;
    const id = a.getAttribute('href')!.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (id && !target) return;
    e.preventDefault();
    const jump = () => {
      const y = target ? target.getBoundingClientRect().top + window.scrollY - length('--nav-height') : 0;
      document.dispatchEvent(new CustomEvent('precious:jump', { detail: { id } }));
      window.scrollTo({ top: y, behavior: 'instant' });
      history.replaceState(null, '', id ? `#${id}` : location.pathname);
    };
    if (prefersReducedMotion()) return jump();
    void wing
      .cover(bgFor(target), ms('--dur-page-cover'))
      .then(() => {
        jump();
        return wait(ms('--dur-page-hold'));
      })
      .then(() => wing.reveal(ms('--dur-page-reveal')));
  });
}
