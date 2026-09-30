/**
 * Pixel rain (Claude Design): the footer and the AI card background share it.
 * On a [data-rain] canvas:
 *   - a soft wash band of --pixel-cell-rain cells fills the bottom third; it breathes,
 *     ripples sideways as a gentle wave, and its colours drift along it; brightness
 *     is capped low so the content above stays dominant;
 *   - small clusters of cells fall straight down at a steady speed (up to five at a
 *     time, fewer on narrow canvases), fading in at the top and out near the bottom,
 *     each leaving a soft trail (cells fade up fast and down slowly: LCD ghosting).
 * Hovering or focusing the section's CTA ([data-rain-cta] in the same
 * [data-rain-scope]) brightens it all slightly.
 * Runs only while the canvas is on screen.
 * Tokens: --pixel-cell-rain, --color-wash-*, --motion-tempo.
 * Reduced motion: one still frame of the band, no drops.
 */
import type { MotionModule } from './index';
import { prefersReducedMotion } from './reducedMotion';
import { hexRgb, length, tempo, washes } from './tokens';

interface Cell {
  px: number;
  py: number;
  v: number;
  u: number;
  j: number;
  a: number;
}
interface Drop {
  x: number;
  y: number;
  v: number;
  m: number;
  col: string;
}

function rain(cv: HTMLCanvasElement, cta: HTMLElement | null): () => void {
  const RM = prefersReducedMotion();
  const S = length('--pixel-cell-rain') || 8;
  const WC = washes();
  const mix = (a: string, b: string, t: number) => {
    const A = hexRgb(a);
    const B = hexRgb(b);
    return `rgb(${A.map((v, k) => Math.round(v + (B[k]! - v) * t)).join(',')})`;
  };
  const RAMP = Array.from({ length: 32 }, (_, k) => {
    const f = k / 8;
    const j = Math.floor(f) % 4;
    return mix(WC[j]!, WC[(j + 1) % 4]!, f - Math.floor(f));
  });
  const sm = (a: number, b: number, v: number) => {
    const t = Math.max(0, Math.min(1, (v - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };
  let x: CanvasRenderingContext2D | null = null;
  let W = 0;
  let H = 0;
  let cols = 0;
  let rows = 0;
  let cells: Cell[] = [];
  let G = new Float32Array(0);
  let T = new Float32Array(0);
  let Cc: string[] = [];
  const drops: Drop[] = [];
  let boost = 0;
  let bt = 0;
  let raf = 0;
  let lt = 0;
  let spawn = 0.4;
  const t0 = performance.now();

  const size = () => {
    const d = Math.min(2, window.devicePixelRatio || 1);
    W = cv.offsetWidth;
    H = cv.offsetHeight;
    cv.width = W * d;
    cv.height = H * d;
    x = cv.getContext('2d');
    x?.setTransform(d, 0, 0, d, 0, 0);
    cols = Math.ceil(W / S);
    rows = Math.ceil(H / S);
    G = new Float32Array(cols * rows);
    T = new Float32Array(cols * rows);
    Cc = new Array(cols * rows).fill(WC[0]);
    cells = [];
    for (let r = 0; r < rows; r++) {
      const v = (r * S) / H;
      if (v < 0.66) continue;
      for (let c = 0; c < cols; c++) cells.push({ px: c * S, py: r * S, v, u: c / cols, j: Math.random(), a: 0 });
    }
  };
  const dep = (cc: number, rr: number, val: number, col: string) => {
    if (cc < 0 || cc >= cols || rr < 0 || rr >= rows) return;
    const k = rr * cols + cc;
    if (val > T[k]!) {
      T[k] = val;
      Cc[k] = col;
    }
  };
  const draw = (ts: number) => {
    if (!x) return;
    const tp = tempo();
    const t = (ts - t0) / 1000 / tp;
    const dt = (lt ? Math.min(0.05, (ts - lt) / 1000) : 0.016) / tp;
    lt = ts;
    boost += (bt - boost) * Math.min(1, dt * 2.5);
    x.clearRect(0, 0, W, H);
    const kk = RM ? 1 : 1 - Math.pow(0.95, Math.max(1, dt * 60));
    const br = 0.82 + 0.18 * Math.sin(t * 0.4);
    for (const c of cells) {
      const wv = 0.5 + 0.5 * Math.sin(c.u * 7 + t * 0.22 + c.j * 1.2) * Math.sin(c.u * 2.6 - t * 0.14);
      const m = sm(0.66, 1, c.v) * ((0.5 + 0.5 * wv) * br * (1 + 0.6 * boost));
      c.a += (m - c.a) * kk;
      if (c.a < 0.02) continue;
      x.globalAlpha = Math.min(0.2, c.a * 0.14);
      x.fillStyle = RAMP[((Math.floor((c.u * 1.4 + t * 0.025) * 32) % 32) + 32) % 32]!;
      x.fillRect(c.px, c.py, S, S);
    }
    if (!RM) {
      spawn -= dt;
      if (spawn <= 0 && drops.length < Math.max(2, Math.min(5, Math.round(W / 260)))) {
        spawn = 0.9 + Math.random() * 1.1;
        drops.push({
          x: S * 3 + Math.random() * (W - S * 6),
          y: -S * 2,
          v: 60 + Math.random() * 40,
          m: 0.7 + Math.random() * 0.5,
          col: WC[Math.floor(Math.random() * 4)]!,
        });
      }
      T.fill(0);
      for (let i = drops.length - 1; i >= 0; i--) {
        const p = drops[i]!;
        p.y += p.v * dt;
        if (p.y > H + S * 2) {
          drops.splice(i, 1);
          continue;
        }
        const env = sm(-S * 2, H * 0.15, p.y) * (1 - sm(H * 0.7, H, p.y)) * (0.62 + 0.3 * boost);
        const c0 = Math.round(p.x / S);
        const r0 = Math.floor(p.y / S);
        dep(c0, r0, env, p.col);
        dep(c0, r0 - 1, env * 0.75, p.col);
        if (p.m > 1) {
          dep(c0 + 1, r0, env * 0.55 * (p.m - 1), p.col);
          dep(c0 - 1, r0 - 1, env * 0.35 * (p.m - 1), p.col);
        }
      }
      const up = 1 - Math.pow(0.8, dt * 60);
      const down = 1 - Math.pow(0.988, dt * 60);
      for (let k = 0; k < G.length; k++) {
        const g = G[k]!;
        const tg = T[k]!;
        G[k] = g + (tg - g) * (tg > g ? up : down);
        if (G[k]! < 0.01) continue;
        x.globalAlpha = G[k]! * 0.42;
        x.fillStyle = Cc[k]!;
        x.fillRect((k % cols) * S, Math.floor(k / cols) * S, S, S);
      }
    }
    x.globalAlpha = 1;
  };
  const loop = (ts: number) => {
    raf = requestAnimationFrame(loop);
    draw(ts);
  };
  size();
  const ro = new ResizeObserver(() => {
    size();
    if (RM) draw(performance.now() + 4000);
  });
  ro.observe(cv);
  const controller = new AbortController();
  if (cta) {
    const on = () => (bt = 1);
    const off = () => (bt = 0);
    const o = { signal: controller.signal };
    cta.addEventListener('mouseenter', on, o);
    cta.addEventListener('mouseleave', off, o);
    cta.addEventListener('focus', on, o);
    cta.addEventListener('blur', off, o);
  }
  let io: IntersectionObserver | null = null;
  if (RM) draw(performance.now() + 4000);
  else {
    io = new IntersectionObserver((es) => {
      if (es[0]?.isIntersecting) {
        if (!raf) {
          lt = 0;
          raf = requestAnimationFrame(loop);
        }
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(cv);
  }
  return () => {
    io?.disconnect();
    ro.disconnect();
    controller.abort();
    cancelAnimationFrame(raf);
  };
}

export const pixelRain: MotionModule = {
  name: 'pixelRain',
  init(root) {
    const offs = [...root.querySelectorAll<HTMLCanvasElement>('canvas[data-rain]')].map((cv) =>
      rain(cv, cv.closest('[data-rain-scope]')?.querySelector<HTMLElement>('[data-rain-cta]') ?? null),
    );
    return () => offs.forEach((f) => f());
  },
};
