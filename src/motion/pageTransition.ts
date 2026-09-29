/**
 * M10 page transition (P2-6): a pixel dissolve between routes.
 *  1. Navigation starts (astro:before-preparation): a full-screen Deep Ink cover
 *     pixels in over the current page while the next page loads in parallel.
 *  2. After the swap (astro:after-swap): the cover pixels out over the new page.
 * The cover ([data-pixel-cover] in SiteShell) persists across swaps. The browser's
 * own view-transition cross-fade is switched off in SiteShell, so this is the only
 * animation. Set up once (not per page) because it spans the swap.
 * Tokens: --pixel-cell-page, --pixel-reveal-steps, --dur-pixel-reveal, --pixel-cover-bg.
 * Reduced motion: no cover; pages swap instantly.
 */
import { pixelClip, type PixelClip } from './pixelClip';
import { prefersReducedMotion } from './reducedMotion';

let setUp = false;

export function setupPageTransition() {
  if (setUp) return;
  setUp = true;

  let clip: PixelClip | null = null;
  let covering: Promise<void> | null = null;
  const cover = () => document.querySelector<HTMLElement>('[data-pixel-cover]');

  document.addEventListener('astro:before-preparation', (event) => {
    const el = cover();
    if (!el || prefersReducedMotion()) return;
    clip ??= pixelClip(el, '--pixel-cell-page');
    el.hidden = false;
    el.style.clipPath = "path('M0 0z')";
    covering = clip.to(true);
    const load = event.loader;
    event.loader = async () => {
      await Promise.all([covering, load()]);
    };
  });

  document.addEventListener('astro:after-swap', () => {
    const el = cover();
    if (!el || !clip || !covering) return;
    covering = null;
    clip.to(false).then(() => {
      el.hidden = true;
      el.style.clipPath = '';
    });
  });
}
