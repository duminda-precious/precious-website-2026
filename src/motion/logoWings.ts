/**
 * Butterfly logo motion (Claude Design, from the uploaded Butterfly Grid file).
 * Every [data-logo-mark] on the page (nav, full-page menu, footer):
 *   - Flap: open → mid → closed → mid → open … on one shared clock, one frame per
 *     --dur-wing-frame (8fps), holding "open" longest. The open frame is the logo,
 *     unchanged. The previous frame lingers at --pixel-ghost opacity for 60% of a
 *     frame (LCD ghosting). Frames are merged paths, so no seams.
 *   - Hover ripple: hovering the mark's [data-logo-hover] ancestor sends brand colours
 *     outward from the body through the pixels over --dur-logo-ripple, each pixel
 *     blending from its own ink colour into the colour and back.
 * Tokens: --dur-wing-frame, --dur-logo-ripple, --pixel-ghost, --motion-tempo,
 *         --color-wash-*, --color-accent-*.
 * Reduced motion: the logo stays open; no ghost, no ripple.
 */
import type { MotionModule } from './index';
import { prefersReducedMotion } from './reducedMotion';
import { color, hexRgb, ms, ratio } from './tokens';
import { pixelIcons } from '../components/ui/pixelIcons';

const NS = 'http://www.w3.org/2000/svg';
type Frame = 'butterfly' | 'butterfly-mid' | 'butterfly-closed';
/** [frame, how many ticks it holds] */
const SEQ: [Frame, number][] = [
  ['butterfly', 6],
  ['butterfly-mid', 1],
  ['butterfly-closed', 2],
  ['butterfly-mid', 1],
  ['butterfly', 2],
  ['butterfly-mid', 1],
  ['butterfly-closed', 2],
  ['butterfly-mid', 1],
];
const COLS = 13;
const ROWS = 11;

const framePath = (k: Frame) => {
  let d = '';
  pixelIcons[k].forEach((row, y) => {
    for (let x = 0; x < row.length; x++) if (row[x] === '#') d += `M${x} ${y}h1v1h-1z`;
  });
  return d;
};

interface Mark {
  ghost: SVGPathElement;
  layer: SVGGElement;
  original: string;
  g: SVGGElement;
  k: Frame;
  prev: string;
  col: string[] | null;
  busy: boolean;
}

export const logoWings: MotionModule = {
  name: 'logoWings',
  init(root) {
    if (prefersReducedMotion()) return;
    const groups = [...root.querySelectorAll<SVGGElement>('[data-logo-mark]')];
    if (!groups.length) return;
    const ghostOpacity = String(ratio('--pixel-ghost'));
    const marks: Mark[] = groups.map((g) => {
      const original = g.innerHTML;
      g.textContent = '';
      const ghost = document.createElementNS(NS, 'path');
      ghost.setAttribute('opacity', ghostOpacity);
      const layer = document.createElementNS(NS, 'g');
      g.append(ghost, layer);
      return { ghost, layer, original, g, k: 'butterfly', prev: '', col: null, busy: false };
    });

    const draw = (m: Mark) => {
      m.layer.textContent = '';
      if (!m.col) {
        const p = document.createElementNS(NS, 'path');
        p.setAttribute('d', framePath(m.k));
        m.layer.append(p);
        return;
      }
      const by: Record<string, string> = {};
      pixelIcons[m.k].forEach((r, y) => {
        for (let x = 0; x < r.length; x++)
          if (r[x] === '#') {
            const c = m.col![y * COLS + x] ?? '';
            by[c] = (by[c] ?? '') + `M${x} ${y}h1v1h-1z`;
          }
      });
      for (const [c, d] of Object.entries(by)) {
        const p = document.createElementNS(NS, 'path');
        p.setAttribute('d', d);
        if (c) p.setAttribute('fill', c);
        m.layer.append(p);
      }
    };

    // Flap clock (shared, so every logo flaps in step)
    let i = 0;
    let wt = 0;
    let wg = 0;
    const show = (k: Frame) =>
      marks.forEach((m) => {
        m.ghost.setAttribute('d', m.prev);
        m.k = k;
        draw(m);
        m.prev = framePath(k);
      });
    const step = () => {
      const tick = ms('--dur-wing-frame');
      const [k, hold] = SEQ[i]!;
      show(k);
      wg = window.setTimeout(() => marks.forEach((m) => m.ghost.setAttribute('d', '')), tick * 0.6);
      i = (i + 1) % SEQ.length;
      wt = window.setTimeout(step, tick * hold);
    };
    step();

    // Hover ripple
    const PAL = [
      '--color-wash-sky',
      '--color-accent-teal',
      '--color-wash-blush',
      '--color-accent-rose',
      '--color-wash-lavender',
      '--color-accent-violet',
      '--color-wash-sage',
      '--color-wash-mint',
      '--color-wash-rose',
      '--color-wash-sky',
    ].map((t) => hexRgb(color(t as `--${string}`)));
    const rafs = new Set<number>();
    const morph = (m: Mark) => {
      if (m.busy) return;
      m.busy = true;
      const sv = m.g.ownerSVGElement!;
      const ink = (getComputedStyle(sv).color.match(/\d+/g) ?? ['20', '28', '34']).slice(0, 3).map(Number);
      const T = ms('--dur-logo-ripple');
      const t0 = performance.now();
      const f = (now: number) => {
        const p = (now - t0) / T;
        const front = p * 14 - 2;
        const alive = p < 1;
        const col: string[] = new Array(COLS * ROWS).fill('');
        if (alive)
          for (let y = 0; y < ROWS; y++)
            for (let x = 0; x < COLS; x++) {
              const d = Math.hypot(x - 6, (y - 5) * 1.1);
              const z = (d - front) / 1.6;
              const k = Math.exp(-z * z);
              if (k < 0.03) continue;
              const P = PAL[(Math.round(d) + (y >> 1) * 2) % PAL.length]!;
              col[y * COLS + x] = `rgb(${ink.map((v, j) => Math.round(v + (P[j]! - v) * k)).join(',')})`;
            }
        m.col = alive ? col : null;
        draw(m);
        if (alive) rafs.add(requestAnimationFrame(f));
        else m.busy = false;
      };
      rafs.add(requestAnimationFrame(f));
    };
    const offs = marks.map((m) => {
      const host = m.g.closest<HTMLElement>('[data-logo-hover]');
      if (!host) return () => {};
      const on = () => morph(m);
      host.addEventListener('mouseenter', on);
      return () => host.removeEventListener('mouseenter', on);
    });

    return () => {
      window.clearTimeout(wt);
      window.clearTimeout(wg);
      rafs.forEach(cancelAnimationFrame);
      offs.forEach((f) => f());
      marks.forEach((m) => (m.g.innerHTML = m.original));
    };
  },
};
