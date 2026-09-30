/**
 * M12 button hover (Claude Design "Button Motion 5a", from pixel.js btnFx).
 * For every [data-grad] element (Button, IconButton, card CTAs):
 *   - a canvas behind the label holds --pixel-cell-button cells of the soft wash
 *     (mint top-left, sky top-right, rose from below on Slate 100);
 *   - enter: cells bloom in from the pointer's entry point over --bloom-steps frames
 *     of --dur-bloom-frame, each cell fading across a soft leading edge;
 *   - hover: lighter pixels ripple out from the cursor in soft rings (fade to nothing
 *     ~75px away), smoothly, via opacity;
 *   - leave: the same wipe in reverse from the exit point;
 *   - a 5×4 pixel butterfly lands beside the label (steps), flaps at --dur-wing-frame
 *     and lifts off vertically on leave (not on data-grad-nofly);
 *   - press: scale 0.97 on pointer down, settles on release.
 * Tokens: --pixel-cell-button, --bloom-steps, --dur-bloom-frame, --dur-wing-frame,
 *         --dur-fly-land/-lift/-width, --dur-press, --ease-snappy, --ease-out-expo, --ease-exit, --color-wash-*,
 *         --color-slate-100, --color-white, --cta-hover-fg, --button-fly-width/-height, --space-10.
 * Reduced motion: the wash appears / disappears at once; no noise, no butterfly motion.
 */
import type { MotionModule } from './index';
import { prefersReducedMotion } from './reducedMotion';
import { color, count, cssVar, ease, length, ms } from './tokens';
import { pixelIcons } from '../components/ui/pixelIcons';

const NS = 'http://www.w3.org/2000/svg';
const FLY = [pixelIcons['button-fly-open'], pixelIcons['button-fly-closed']];
const flyPath = (k: number) => {
  let d = '';
  FLY[k]!.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch === '#') d += `M${x} ${y}h1v1h-1z`;
    }),
  );
  return d;
};

interface Cell {
  q: number;
  r: number;
  on: number;
  j: number;
  w: number;
  d: number;
}

function washCanvas(w: number, h: number): HTMLCanvasElement {
  const k = document.createElement('canvas');
  k.width = w;
  k.height = h;
  const c = k.getContext('2d')!;
  c.fillStyle = color('--color-slate-100');
  c.fillRect(0, 0, w, h);
  const R = Math.max(w, h) * 1.1;
  const spots: [number, number, string][] = [
    [0, 0, color('--color-wash-mint')],
    [w, 0, color('--color-wash-sky')],
    [w / 2, h * 1.2, color('--color-wash-rose')],
  ];
  spots.forEach(([cx, cy, col]) => {
    const g = c.createRadialGradient(cx, cy, 0, cx, cy, R * 0.75);
    g.addColorStop(0, col);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
  });
  return k;
}

export const buttonFx: MotionModule = {
  name: 'buttonFx',
  init(root) {
    const els = [...root.querySelectorAll<HTMLElement>('[data-grad]')];
    if (!els.length) return;
    const offs: (() => void)[] = [];
    const RM = prefersReducedMotion;
    const S = length('--pixel-cell-button') || 6;
    const N = count('--bloom-steps');
    const white = color('--color-white');

    els.forEach((b) => {
      b.setAttribute('data-fx', '');
      const c = document.createElement('canvas');
      c.setAttribute('aria-hidden', 'true');
      c.style.cssText =
        'position:absolute;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;image-rendering:pixelated';
      b.prepend(c);
      let cells: Cell[] = [];
      let x: CanvasRenderingContext2D | null = null;
      let W = 0;
      let H = 0;
      let loopT = 0;
      let stepT = 0;
      let mx = 0;
      let my = 0;
      let wash: HTMLCanvasElement | null = null;
      const t0 = performance.now();

      const fit = () => {
        W = b.offsetWidth;
        H = b.offsetHeight;
        c.width = W;
        c.height = H;
        x = c.getContext('2d');
        cells = [];
        for (let r = 0; r < Math.ceil(H / S); r++)
          for (let q = 0; q < Math.ceil(W / S); q++)
            cells.push({ q, r, on: 0, j: Math.random(), w: 0, d: 0 });
      };
      const draw = () => {
        if (!x) return;
        x.clearRect(0, 0, W, H);
        if (!wash || wash.width !== W || wash.height !== H) wash = washCanvas(W, H);
        const g = x.createPattern(wash, 'no-repeat')!;
        for (const e of cells) {
          if (e.on <= 0) continue;
          x.globalAlpha = e.on;
          x.fillStyle = g;
          x.fillRect(e.q * S, e.r * S, S, S);
          if (e.w > 0.01) {
            x.globalAlpha = e.w * e.on;
            x.fillStyle = white;
            x.fillRect(e.q * S, e.r * S, S, S);
          }
        }
        x.globalAlpha = 1;
      };
      // Light noise radiating from the cursor: rings of lighter pixels, fading out ~75px away.
      const shimmer = () => {
        if (RM()) return;
        const frame = ms('--dur-bloom-frame', true);
        loopT = window.setInterval(() => {
          const t = (performance.now() - t0) / 1000;
          for (const e of cells) {
            const d = Math.hypot(e.q * S + S / 2 - mx, e.r * S + S / 2 - my);
            const fall = Math.max(0, 1 - d / 75);
            const ring = Math.pow(Math.max(0, Math.sin(d / 5 - t * 5)), 3);
            const target = (fall * ring * 0.85 + (d < S ? 0.35 : 0)) * (0.6 + e.j * 0.4);
            e.w += (target - e.w) * 0.2;
          }
          draw();
        }, frame);
      };
      // Bloom in (dir 1) or out (dir -1) from a point, with a soft leading edge.
      const run = (px: number, py: number, dir: 1 | -1) => {
        window.clearTimeout(stepT);
        window.clearInterval(loopT);
        const D = Math.hypot(W, H) || 1;
        cells.forEach((e) => (e.d = Math.hypot(e.q * S - px, e.r * S - py) / D + e.j * 0.25));
        const F = 0.4;
        const frame = ms('--dur-bloom-frame', true);
        let s = 0;
        const tick = () => {
          s++;
          const th = (s / N) * (1.25 + F);
          cells.forEach((e) => {
            const k = Math.min(1, Math.max(0, (th - e.d) / F));
            const v = k * k * (3 - 2 * k);
            e.on = dir > 0 ? v : 1 - v;
          });
          draw();
          if (s < N) stepT = window.setTimeout(tick, frame);
          else if (dir > 0) shimmer();
          else {
            cells.forEach((e) => (e.on = 0));
            draw();
          }
        };
        tick();
      };
      const pt = (e: PointerEvent | FocusEvent): [number, number] => {
        if ('clientX' in e && e.clientX != null) {
          const r = b.getBoundingClientRect();
          return [e.clientX - r.left, e.clientY - r.top];
        }
        return [W / 2, H / 2];
      };

      // The landing butterfly
      const fly = !b.hasAttribute('data-grad-nofly');
      const svg = document.createElementNS(NS, 'svg');
      const path = document.createElementNS(NS, 'path');
      svg.setAttribute('viewBox', '0 0 5 4');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('shape-rendering', 'crispEdges');
      svg.style.cssText = `fill:${cssVar('--cta-hover-fg') || color('--color-slate-900')};flex:none;width:0;height:var(--button-fly-height);opacity:0;margin-right:0;overflow:visible`;
      svg.append(path);
      path.setAttribute('d', flyPath(0));
      const label = b.querySelector('[data-pixel-label]') ?? b.firstChild;
      if (fly) b.insertBefore(svg, label);
      let flap = 0;
      let f = 0;

      const enter = (e: PointerEvent | FocusEvent) => {
        if ('pointerType' in e && e.pointerType && e.pointerType !== 'mouse') return;
        fit();
        [mx, my] = pt(e);
        if (fly) {
          const out = ease('--ease-out-expo');
          const dw = ms('--dur-fly-width', true);
          svg.style.transition = `width ${dw}ms ${out},margin ${dw}ms ${out},opacity ${ms('--dur-fast', true)}ms`;
          svg.style.width = 'var(--button-fly-width)';
          svg.style.marginRight = 'var(--space-10)';
          svg.style.opacity = '1';
        }
        if (RM()) {
          cells.forEach((k) => (k.on = 1));
          draw();
          return;
        }
        if (fly) {
          svg.animate(
            [
              { transform: 'translateY(-14px)', opacity: 0 },
              { transform: 'translateY(2px)', opacity: 1, offset: 0.7 },
              { transform: 'none' },
            ],
            { duration: ms('--dur-fly-land', true), easing: 'steps(7,end)' },
          );
          window.clearInterval(flap);
          flap = window.setInterval(() => {
            f = 1 - f;
            path.setAttribute('d', flyPath(f));
          }, ms('--dur-wing-frame', true));
        }
        run(mx, my, 1);
      };
      const leave = (e: PointerEvent | FocusEvent) => {
        if ('pointerType' in e && e.pointerType && e.pointerType !== 'mouse') return;
        window.clearInterval(flap);
        if (fly) {
          if (!RM()) {
            const an = svg.animate(
              [
                { transform: 'none', opacity: 1 },
                { transform: 'translateY(-6px)', opacity: 1, offset: 0.4 },
                { transform: 'translateY(-18px)', opacity: 0 },
              ],
              { duration: ms('--dur-fly-lift', true), easing: 'steps(5,end)', fill: 'forwards' },
            );
            an.onfinish = () => {
              an.cancel();
              path.setAttribute('d', flyPath(0));
            };
          }
          const ex = ease('--ease-exit');
          const d = ms('--dur-chevron', true);
          svg.style.transition = `width ${d}ms ${ex} ${ms('--dur-press', true)}ms,margin ${d}ms ${ex} ${ms('--dur-press', true)}ms,opacity ${ms('--dur-press', true)}ms`;
          svg.style.width = '0';
          svg.style.marginRight = '0';
          svg.style.opacity = '0';
        }
        if (!x) return;
        if (RM()) {
          cells.forEach((k) => (k.on = 0));
          draw();
          return;
        }
        cells.forEach((k) => (k.w = 0));
        const [px, py] = pt(e);
        run(px, py, -1);
      };
      const move = (e: PointerEvent) => {
        [mx, my] = pt(e);
      };
      const press = () => {
        if (RM()) return;
        b.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.97)' }], {
          duration: ms('--dur-press', true),
          easing: ease('--ease-snappy'),
          fill: 'forwards',
        });
      };
      const release = () => {
        if (RM()) return;
        b.animate(
          [{ transform: 'scale(0.97)' }, { transform: 'scale(1.01)', offset: 0.6 }, { transform: 'scale(1)' }],
          { duration: ms('--dur-chevron', true), easing: ease('--ease-snappy'), fill: 'forwards' },
        );
      };
      const focusIn = (e: FocusEvent) => {
        if (b.matches(':focus-visible')) enter(e);
      };
      b.addEventListener('pointermove', move);
      b.addEventListener('pointerenter', enter);
      b.addEventListener('pointerleave', leave);
      b.addEventListener('focus', focusIn);
      b.addEventListener('blur', leave);
      b.addEventListener('pointerdown', press);
      b.addEventListener('pointerup', release);
      offs.push(() => {
        b.removeEventListener('pointermove', move);
        b.removeEventListener('pointerenter', enter);
        b.removeEventListener('pointerleave', leave);
        b.removeEventListener('focus', focusIn);
        b.removeEventListener('blur', leave);
        b.removeEventListener('pointerdown', press);
        b.removeEventListener('pointerup', release);
        window.clearInterval(loopT);
        window.clearTimeout(stepT);
        window.clearInterval(flap);
        c.remove();
        svg.remove();
        b.removeAttribute('data-fx');
      });
    });
    return () => offs.forEach((f) => f());
  },
};
