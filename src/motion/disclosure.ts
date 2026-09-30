/**
 * M6 FAQ (Claude Design). Takes over the summary click:
 *   - height: opening sets [open] and animates the content 0 → auto; closing animates
 *     to 0, then removes [open]. Clicking mid-close reopens from the current height.
 *   - group: opening an item closes the open item in the same data-group.
 *   - icon: the button-label pixel glitch. The icon is redrawn on a canvas overlay
 *     through the --pixel-glitch block sizes (drawn at 1/block resolution, alpha
 *     hardened to on/off pixels, scaled up nearest-neighbour, sideways jitter on big
 *     blocks) at --dur-pixel-frame-glitch per frame; "+" swaps to "×" (and back) at
 *     the coarsest frame, then it resolves sharp.
 * Tokens: --dur-base, --ease-standard (via GSAP 'standard'), --pixel-glitch,
 *         --dur-pixel-frame-glitch, --motion-tempo.
 * Reduced motion: native instant toggle, static icons.
 */
import { gsap } from './gsap';
import { duration, list, ms } from './tokens';
import { prefersReducedMotion } from './reducedMotion';
import { pixelCells } from '../components/ui/pixelIcons';
import type { MotionModule } from './index';

const PLUS = pixelCells('plus');
const CLOSE = pixelCells('close');
const path = (cells: [number, number][]) => cells.map(([x, y]) => `M${x} ${y}h1v1h-1z`).join('');

export const disclosure: MotionModule = {
  name: 'disclosure',
  init(root) {
    if (prefersReducedMotion()) return;
    const controller = new AbortController();
    const items = Array.from(
      root.querySelectorAll<HTMLDetailsElement>('details[data-motion="disclosure"]'),
    );
    const swaps = new Map<HTMLDetailsElement, { t: number; c: HTMLCanvasElement }>();
    const DPR = Math.min(2, window.devicePixelRatio || 1);

    const stopSwap = (details: HTMLDetailsElement) => {
      const s = swaps.get(details);
      if (!s) return;
      window.clearTimeout(s.t);
      s.c.remove();
      swaps.delete(details);
    };

    const swapIcon = (details: HTMLDetailsElement, open: boolean) => {
      const svg = details.querySelector<SVGSVGElement>('[data-icon]');
      const icon = details.querySelector<SVGPathElement>('[data-icon-plus]');
      const box = svg?.parentElement;
      if (!svg || !icon || !box) return;
      stopSwap(details);
      const from = open ? PLUS : CLOSE;
      const to = open ? CLOSE : PLUS;
      const size = svg.getBoundingClientRect().width;
      const u = size / 7;
      const pad = Math.ceil(size * 0.5);
      const W = size + pad * 2;
      const seq = list('--pixel-glitch');
      const peak = seq.indexOf(Math.max(...seq));
      const color = getComputedStyle(svg).color;
      const c = document.createElement('canvas');
      c.setAttribute('aria-hidden', 'true');
      c.style.cssText = `position:absolute;left:${-pad}px;top:${-pad}px;width:${W}px;height:${W}px;pointer-events:none`;
      c.width = c.height = Math.ceil(W * DPR);
      box.append(c);
      svg.style.visibility = 'hidden';
      const small = document.createElement('canvas');
      let i = 0;
      const draw = (b: number, cells: [number, number][]) => {
        const sw = Math.ceil(W / b);
        small.width = small.height = sw;
        const x = small.getContext('2d', { willReadFrequently: true })!;
        x.save();
        x.scale(1 / b, 1 / b);
        x.fillStyle = color;
        cells.forEach(([cx, cy]) => x.fillRect(pad + cx * u, pad + cy * u, u, u));
        x.restore();
        if (b >= 3) {
          const d = x.getImageData(0, 0, sw, sw);
          for (let k = 3; k < d.data.length; k += 4) d.data[k] = d.data[k]! > 80 ? 255 : 0;
          x.putImageData(d, 0, 0);
        }
        const g = c.getContext('2d')!;
        g.clearRect(0, 0, c.width, c.height);
        g.imageSmoothingEnabled = false;
        g.drawImage(small, 0, 0, sw, sw, 0, 0, sw * b * DPR, sw * b * DPR);
        c.style.transform =
          b >= 8 && Math.random() < 0.45
            ? `translateX(${(Math.random() < 0.5 ? -1 : 1) * Math.round(b / 2)}px)`
            : '';
      };
      const tick = () => {
        if (i >= seq.length) {
          icon.setAttribute('d', path(to));
          svg.style.visibility = '';
          stopSwap(details);
          return;
        }
        draw(seq[i]!, i < peak ? from : to);
        i++;
        swaps.set(details, { t: window.setTimeout(tick, ms('--dur-pixel-frame-glitch')), c });
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
      [...swaps.keys()].forEach(stopSwap);
      items.forEach((d) => {
        const c = d.querySelector<HTMLElement>('[data-disclosure-content]');
        if (c) {
          gsap.killTweensOf(c);
          gsap.set(c, { clearProps: 'height' });
        }
        d.removeAttribute('data-closing');
        d.removeAttribute('data-icon-live');
        d.querySelector('[data-icon-plus]')?.setAttribute('d', path(PLUS));
        d.querySelector<SVGElement>('[data-icon]')?.style.removeProperty('visibility');
      });
    };
  },
};
