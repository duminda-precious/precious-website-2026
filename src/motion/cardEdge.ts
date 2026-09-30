/**
 * ContentCard hover (Claude Design). On mouse enter / keyboard focus a card gets
 * data-on (CSS expands the CTA pill) and its media edge pixelates:
 *   - cells of --pixel-cell-edge in a band 4 cells deep around the outer edge,
 *     densest at the very edge and thinning inward (never a solid border);
 *   - they step in over 4 frames of --dur-edge-frame, then each one breathes on its
 *     own slow sine (fades in and out, 1.5–5s per cycle);
 *   - on leave they step back out from wherever they are.
 * The pixels are drawn into a mask on [data-card-edge], a blurred layer, so the
 * band blurs the media behind it and the centre stays clear.
 * Tokens: --pixel-cell-edge, --dur-edge-frame, --dur-bloom-frame (breathing tick), --motion-tempo.
 * Reduced motion: the CTA still expands (CSS, instant); the edge steps in but doesn't breathe.
 */
import type { MotionModule } from './index';
import { prefersReducedMotion } from './reducedMotion';
import { length, ms } from './tokens';

const BAND = 4;
const DENSITY = [0.85, 0.55, 0.3, 0.12];
const STEPS = 4;
const MAX = BAND + 1.4;

interface Edge {
  q: number;
  r: number;
  t: number;
  a: number;
  ph: number;
  sp: number;
}

export const cardEdge: MotionModule = {
  name: 'cardEdge',
  init(root) {
    const cards = [...root.querySelectorAll<HTMLElement>('[data-card]')];
    if (!cards.length) return;
    const offs: (() => void)[] = [];
    const S = length('--pixel-cell-edge') || 16;

    cards.forEach((card) => {
      const el = card.querySelector<HTMLElement>('[data-card-edge]');
      if (!el) return;
      const seed = Number(card.dataset.seed) || 0;
      const rnd = (a: number, b: number) => {
        const s = Math.sin(a * 127.1 + b * 311.7 + seed * 17.3) * 43758.5453;
        return s - Math.floor(s);
      };
      let step = 0;
      let stepT = 0;
      let noiseT = 0;
      let on = false;
      let cells: Edge[] = [];
      let canvas: HTMLCanvasElement | null = null;
      let cols = 0;
      let rows = 0;

      const build = () => {
        const W = el.offsetWidth;
        const H = el.offsetHeight;
        cols = Math.ceil(W / S);
        rows = Math.ceil(H / S);
        canvas = document.createElement('canvas');
        canvas.width = cols * S;
        canvas.height = rows * S;
        cells = [];
        for (let r = 0; r < rows; r++)
          for (let q = 0; q < cols; q++) {
            const d = Math.min(q, r, cols - 1 - q, rows - 1 - r);
            if (d >= BAND || rnd(q + 53, r + 71) > DENSITY[d]!) continue;
            cells.push({
              q,
              r,
              t: d + rnd(q, r) * 1.4,
              a: 1,
              ph: rnd(q + 7, r + 3) * 6.28,
              sp: 0.6 + rnd(q + 11, r + 5) * 1.2,
            });
          }
      };
      const draw = (threshold: number) => {
        if (!canvas) return;
        const x = canvas.getContext('2d')!;
        x.clearRect(0, 0, canvas.width, canvas.height);
        x.fillStyle = '#000';
        for (const e of cells)
          if (e.t < threshold && e.a > 0.02) {
            x.globalAlpha = e.a;
            x.fillRect(e.q * S, e.r * S, S, S);
          }
        x.globalAlpha = 1;
        const url = `url(${canvas.toDataURL()})`;
        const size = `${cols * S}px ${rows * S}px`;
        el.style.setProperty('mask-image', url);
        el.style.setProperty('-webkit-mask-image', url);
        el.style.setProperty('mask-size', size);
        el.style.setProperty('-webkit-mask-size', size);
      };
      const breathe = () => {
        if (prefersReducedMotion()) return;
        const t0 = performance.now();
        noiseT = window.setInterval(() => {
          const t = (performance.now() - t0) / 1000;
          for (const e of cells) e.a = Math.min(1, (0.5 + 0.5 * Math.sin(e.ph + t * e.sp * 2)) * 1.4);
          draw(MAX);
        }, ms('--dur-bloom-frame'));
      };
      const go = (want: boolean) => {
        if (want === on) return;
        on = want;
        card.toggleAttribute('data-on', want);
        window.clearTimeout(stepT);
        window.clearInterval(noiseT);
        if (want && (!canvas || step === 0)) build();
        const tick = () => {
          step += want ? 1 : -1;
          draw((MAX * step) / STEPS);
          el.style.opacity = step > 0 ? '1' : '0';
          if (want ? step < STEPS : step > 0) stepT = window.setTimeout(tick, ms('--dur-edge-frame'));
          else if (want) breathe();
        };
        if (want ? step < STEPS : step > 0) tick();
        else if (want) breathe();
      };
      const enter = (e: Event) => {
        if (e instanceof PointerEvent && e.pointerType !== 'mouse') return;
        if (e.type === 'focus' && !card.matches(':focus-visible')) return;
        go(true);
      };
      const leave = (e: Event) => {
        if (e instanceof PointerEvent && e.pointerType !== 'mouse') return;
        go(false);
      };
      card.addEventListener('pointerenter', enter);
      card.addEventListener('pointerleave', leave);
      card.addEventListener('focus', enter);
      card.addEventListener('blur', leave);
      offs.push(() => {
        card.removeEventListener('pointerenter', enter);
        card.removeEventListener('pointerleave', leave);
        card.removeEventListener('focus', enter);
        card.removeEventListener('blur', leave);
        window.clearTimeout(stepT);
        window.clearInterval(noiseT);
        card.removeAttribute('data-on');
        el.style.opacity = '0';
      });
    });
    return () => offs.forEach((f) => f());
  },
};
