/**
 * M6 FAQ (Claude Design). Takes over the summary click:
 *   - height: opening sets [open] and animates the content 0 → auto; closing animates
 *     to 0, then removes [open]. Clicking mid-close reopens from the current height.
 *   - group: opening an item closes the open item in the same data-group.
 *   - icon: the pixel "+" and "×" trade pixels in shuffled batches over
 *     --icon-swap-steps frames of --dur-icon-frame; the previous frame ghosts at
 *     --pixel-ghost (CSS). Kept pixels (the centre) never flicker.
 * Tokens: --dur-base, --ease-standard (via GSAP 'standard'), --icon-swap-steps,
 *         --dur-icon-frame, --motion-tempo.
 * Reduced motion: native instant toggle, static icons.
 */
import { gsap } from './gsap';
import { count, duration, ms } from './tokens';
import { prefersReducedMotion } from './reducedMotion';
import { pixelCells } from '../components/ui/pixelIcons';
import type { MotionModule } from './index';

const key = ([x, y]: [number, number]) => `${x},${y}`;
const PLUS = pixelCells('plus').map(key);
const CLOSE = pixelCells('close').map(key);
const path = (cells: string[]) =>
  cells
    .map((k) => {
      const [x, y] = k.split(',');
      return `M${x} ${y}h1v1h-1z`;
    })
    .join('');

/** Pixels on screen at step k of a swap (deterministic shuffle, as in the design). */
function frame(open: boolean, k: number): string[] {
  const from = open ? PLUS : CLOSE;
  const to = open ? CLOSE : PLUS;
  return [
    ...new Set([
      ...from.filter((c, j) => to.includes(c) || ((j * 7) % 11) / 11 >= k),
      ...to.filter((c, j) => from.includes(c) || ((j * 5) % 11) / 11 < k),
    ]),
  ];
}

export const disclosure: MotionModule = {
  name: 'disclosure',
  init(root) {
    if (prefersReducedMotion()) return;
    const controller = new AbortController();
    const items = Array.from(
      root.querySelectorAll<HTMLDetailsElement>('details[data-motion="disclosure"]'),
    );
    const swaps = new Map<HTMLDetailsElement, number>();

    const swapIcon = (details: HTMLDetailsElement, open: boolean) => {
      const icon = details.querySelector<SVGPathElement>('[data-icon-plus]');
      const ghost = details.querySelector<SVGPathElement>('[data-icon-ghost]');
      if (!icon || !ghost) return;
      window.clearTimeout(swaps.get(details));
      const STEPS = count('--icon-swap-steps');
      let step = 0;
      let prev: string[] | null = null;
      const tick = () => {
        const cur = step >= STEPS ? (open ? CLOSE : PLUS) : frame(open, step / STEPS);
        icon.setAttribute('d', path(cur));
        ghost.setAttribute('d', prev ? path(prev.filter((c) => !cur.includes(c))) : '');
        prev = cur;
        step++;
        if (step <= STEPS + 1) swaps.set(details, window.setTimeout(tick, ms('--dur-icon-frame')));
        else ghost.setAttribute('d', '');
      };
      tick();
    };

    const setOpen = (details: HTMLDetailsElement, want: boolean) => {
      const content = details.querySelector<HTMLElement>('[data-disclosure-content]');
      if (!content) return;
      const reset = () => gsap.set(content, { clearProps: 'height' });
      const closing = details.hasAttribute('data-closing');
      const isOpen = details.open && !closing;
      if (want === isOpen) return;
      gsap.killTweensOf(content);
      swapIcon(details, want);
      if (want) {
        const from = closing ? content.offsetHeight : 0;
        details.removeAttribute('data-closing');
        details.open = true;
        gsap.fromTo(
          content,
          { height: from },
          { height: 'auto', duration: duration('--dur-base'), ease: 'standard', onComplete: reset },
        );
      } else {
        details.setAttribute('data-closing', '');
        gsap.fromTo(
          content,
          { height: content.offsetHeight },
          {
            height: 0,
            duration: duration('--dur-base'),
            ease: 'standard',
            onComplete: () => {
              details.open = false;
              details.removeAttribute('data-closing');
              reset();
            },
          },
        );
      }
    };

    items.forEach((details) => {
      const summary = details.querySelector('summary');
      if (!summary) return;
      details.setAttribute('data-icon-live', '');
      details
        .querySelector('[data-icon-plus]')
        ?.setAttribute('d', path(details.open ? CLOSE : PLUS));
      summary.addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          const want = !details.open || details.hasAttribute('data-closing');
          const group = details.dataset.group;
          if (want && group)
            items.forEach((o) => o !== details && o.dataset.group === group && setOpen(o, false));
          setOpen(details, want);
        },
        { signal: controller.signal },
      );
    });

    return () => {
      controller.abort();
      swaps.forEach((t) => window.clearTimeout(t));
      items.forEach((d) => {
        const c = d.querySelector<HTMLElement>('[data-disclosure-content]');
        if (c) {
          gsap.killTweensOf(c);
          gsap.set(c, { clearProps: 'height' });
        }
        d.removeAttribute('data-closing');
        d.removeAttribute('data-icon-live');
        d.querySelector('[data-icon-ghost]')?.setAttribute('d', '');
        d.querySelector('[data-icon-plus]')?.setAttribute('d', path(PLUS));
      });
    };
  },
};
