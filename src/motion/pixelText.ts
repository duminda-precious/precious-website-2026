/**
 * Pixel text (P2-5). Headings marked data-motion="pixel-text":
 *  1. Resolve: the first time a heading enters the viewport it steps from coarse
 *     pixel blocks to crisp type (--pixel-resolve, one frame per size).
 *  2. Breathe: every --dur-breathe, one heading currently in view gently pixelates
 *     and settles back (--pixel-breathe), so the page feels alive, not glitchy.
 *
 * The text stays real HTML the whole time: pixelation is an SVG filter
 * (sample one pixel per block, then dilate it into a square) applied through CSS
 * `filter: url(#…)`. One filter per block size is injected into the page.
 * Browsers without SVG filters on HTML simply show crisp text.
 *
 * Tokens: --pixel-resolve, --pixel-breathe, --dur-pixel-frame, --dur-breathe.
 * Reduced motion: the module doesn't run (text is always crisp).
 */
import type { MotionModule } from './index';
import { prefersReducedMotion } from './reducedMotion';
import { duration, list } from './tokens';

const SVG_NS = 'http://www.w3.org/2000/svg';
const idFor = (b: number) => `pixel-text-${b}`;

function filterDefs(blocks: number[]): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.innerHTML = blocks
    .map((b) => {
      const h = Math.floor(b / 2);
      return `<filter id="${idFor(b)}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feFlood x="${h}" y="${h}" width="1" height="1" />
        <feComposite width="${b}" height="${b}" />
        <feTile result="grid" />
        <feComposite in="SourceGraphic" in2="grid" operator="in" />
        <feMorphology operator="dilate" radius="${h}" />
      </filter>`;
    })
    .join('');
  return svg;
}

export const pixelText: MotionModule = {
  name: 'pixelText',
  init(root) {
    if (prefersReducedMotion()) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-motion="pixel-text"]'));
    if (!targets.length) return;

    const resolve = list('--pixel-resolve');
    const breathe = list('--pixel-breathe');
    const frameMs = duration('--dur-pixel-frame') * 1000;
    const breatheMs = duration('--dur-breathe') * 1000;

    const defs = filterDefs([...new Set([...resolve, ...breathe])]);
    root.body.append(defs);

    const timers = new Set<number>();
    const busy = new Set<HTMLElement>();
    const inView = new Set<HTMLElement>();
    const resolved = new WeakSet<HTMLElement>();

    const setBlock = (el: HTMLElement, b: number | null) => {
      el.style.filter = b ? `url(#${idFor(b)})` : '';
    };

    /** Play block sizes one frame each, then clear. */
    const play = (el: HTMLElement, blocks: number[]) => {
      busy.add(el);
      blocks.forEach((b, i) => {
        const t = window.setTimeout(() => {
          timers.delete(t);
          setBlock(el, b);
        }, i * frameMs);
        timers.add(t);
      });
      const end = window.setTimeout(() => {
        timers.delete(end);
        setBlock(el, null);
        busy.delete(el);
      }, blocks.length * frameMs);
      timers.add(end);
    };

    // Headings wait coarse until they're seen, then resolve once.
    targets.forEach((el) => setBlock(el, resolve[0] ?? null));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          const el = target as HTMLElement;
          if (isIntersecting) {
            inView.add(el);
            if (!resolved.has(el)) {
              resolved.add(el);
              play(el, resolve.slice(1));
            }
          } else {
            inView.delete(el);
          }
        });
      },
      { threshold: 0.4 },
    );
    targets.forEach((el) => io.observe(el));

    // Breathe: one visible, idle heading at a time, only while the tab is visible.
    const interval = window.setInterval(() => {
      if (document.hidden) return;
      const idle = [...inView].filter((el) => resolved.has(el) && !busy.has(el));
      const pick = idle[Math.floor(Math.random() * idle.length)];
      if (pick) play(pick, breathe);
    }, breatheMs);

    return () => {
      io.disconnect();
      window.clearInterval(interval);
      timers.forEach((t) => window.clearTimeout(t));
      timers.clear();
      targets.forEach((el) => setBlock(el, null));
      defs.remove();
    };
  },
};
