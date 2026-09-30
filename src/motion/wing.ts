/**
 * Butterfly wing transition (Claude Design). A full-screen canvas of
 * --pixel-cell-page cells fills in a butterfly shape first, then outward from an
 * origin, with a soft leading edge (--pixel-feather) over --pixel-reveal-steps LCD
 * frames; the previous frame ghosts at --pixel-ghost. Faint cells at the leading
 * edge outside the butterfly pick up a wash tint (share: --pixel-tint).
 * The cover colour is the destination's background, so the butterfly carries
 * through into the next view.
 *   cover(bg, origin?, dur)  wipe in until the screen is covered
 *   reveal(dur)              wipe back out from covered, then clear
 * Used by the full-page menu (origin = menu button, butterfly at 35%) and the page
 * transition / in-page anchors (centre, butterfly at 90%).
 * The canvas is [data-wing-cover] in SiteShell (persists across page swaps).
 * Tokens: --pixel-cell-page, --pixel-reveal-steps, --pixel-feather, --pixel-ghost,
 *         --pixel-tint, --color-wash-*.
 */
import { color, count, length, ratio } from './tokens';
import { pixelIcons } from '../components/ui/pixelIcons';

interface Cell {
  q: number;
  r: number;
  inW: boolean;
  o: number;
  lucky: boolean;
  tint: string;
}
interface State {
  canvas: HTMLCanvasElement;
  x: CanvasRenderingContext2D;
  cells: Cell[];
  maxO: number;
  bg: string;
  buf: HTMLCanvasElement;
  prev: HTMLCanvasElement;
  S: number;
}

let st: State | null = null;
let timer = 0;

const canvasEl = () => document.querySelector<HTMLCanvasElement>('[data-wing-cover]');
const rnd = (i: number, k: number) => {
  const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

function build(bg: string, origin?: { x: number; y: number }): State | null {
  const canvas = canvasEl();
  if (!canvas) return null;
  const CW = window.innerWidth;
  const CH = window.innerHeight;
  canvas.width = CW;
  canvas.height = CH;
  const x = canvas.getContext('2d')!;
  const S = length('--pixel-cell-page') || 32;
  const BF = pixelIcons.butterfly;
  const bw = 13;
  const bh = 11;
  const OX = origin ? origin.x : CW / 2;
  const OY = origin ? origin.y : CH / 2;
  const scale = Math.min(CW / bw, CH / bh) * (origin ? 0.35 : 0.9);
  const ox = OX - (bw * scale) / 2;
  const oy = OY - (bh * scale) / 2;
  const DMAX = Math.max(
    ...[
      [0, 0],
      [CW, 0],
      [0, CH],
      [CW, CH],
    ].map(([a, b]) => Math.hypot(a! - OX, (b! - OY) * 1.4)),
  );
  const TINTS = ['rose', 'sky', 'sage', 'blush', 'lavender', 'mint'].map((k) =>
    color(`--color-wash-${k}`),
  );
  const tintP = ratio('--pixel-tint');
  const cols = Math.ceil(CW / S);
  const rows = Math.ceil(CH / S);
  const cells: Cell[] = [];
  for (let r = 0; r < rows; r++)
    for (let q = 0; q < cols; q++) {
      const cx = q * S + S / 2;
      const cy = r * S + S / 2;
      const gx = Math.floor((cx - ox) / scale);
      const gy = Math.floor((cy - oy) / scale);
      const inW = gy >= 0 && gy < bh && gx >= 0 && gx < bw && BF[gy]![gx] === '#';
      const d = Math.hypot(cx - OX, (cy - OY) * 1.4) / DMAX;
      cells.push({
        q,
        r,
        inW,
        o: (inW ? 0 : 0.45) + d * 0.55 + rnd(q * 99 + r, 7) * 0.12,
        lucky: rnd(q * 17 + r, 11) < tintP,
        tint: TINTS[Math.floor(rnd(q * 31 + r, 9) * TINTS.length)]!,
      });
    }
  const mk = () => {
    const k = document.createElement('canvas');
    k.width = CW;
    k.height = CH;
    return k;
  };
  return { canvas, x, cells, maxO: Math.max(...cells.map((e) => e.o)), bg, buf: mk(), prev: mk(), S };
}

function paint(s: State, f: number) {
  const FEATHER = ratio('--pixel-feather') || 0.18;
  const ghost = ratio('--pixel-ghost');
  const { x, buf, prev, S } = s;
  const W = buf.width;
  const H = buf.height;
  const bx = buf.getContext('2d')!;
  const px = prev.getContext('2d')!;
  bx.clearRect(0, 0, W, H);
  const th = f * (s.maxO + FEATHER);
  for (const e of s.cells) {
    const a = Math.min(1, Math.max(0, (th - e.o) / FEATHER));
    if (a <= 0) continue;
    bx.globalAlpha = a;
    bx.fillStyle = !e.inW && a < 0.55 && e.lucky ? e.tint : s.bg;
    bx.fillRect(e.q * S, e.r * S, S, S);
  }
  bx.globalAlpha = 1;
  x.clearRect(0, 0, W, H);
  x.globalAlpha = ghost;
  x.drawImage(prev, 0, 0);
  x.globalAlpha = 1;
  x.drawImage(buf, 0, 0);
  if (f >= 1) {
    x.fillStyle = s.bg;
    x.fillRect(0, 0, W, H);
  }
  px.clearRect(0, 0, W, H);
  px.drawImage(buf, 0, 0);
}

function run(s: State, dur: number, dir: 1 | -1): Promise<void> {
  const STEPS = count('--pixel-reveal-steps');
  window.clearTimeout(timer);
  return new Promise((done) => {
    let k = 0;
    const tick = () => {
      k++;
      paint(s, dir > 0 ? k / STEPS : 1 - k / STEPS);
      if (k < STEPS) timer = window.setTimeout(tick, dur / STEPS);
      else done();
    };
    tick();
  });
}

/** Wipe the cover in. Resolves once the screen is fully covered. */
export function cover(bg: string, dur: number, origin?: { x: number; y: number }): Promise<void> {
  st = build(bg, origin);
  if (!st) return Promise.resolve();
  st.canvas.hidden = false;
  return run(st, dur, 1);
}

/** Paint the cover fully at once (e.g. before a close wipe). */
export function coverNow(bg: string, origin?: { x: number; y: number }) {
  st = build(bg, origin);
  if (!st) return;
  st.canvas.hidden = false;
  paint(st, 1);
}

/** Wipe the cover back out, then clear it. */
export async function reveal(dur: number): Promise<void> {
  if (!st) return;
  const s = st;
  await run(s, dur, -1);
  clear();
}

/** Remove the cover immediately. */
export function clear() {
  window.clearTimeout(timer);
  const c = st?.canvas ?? canvasEl();
  if (c) {
    c.getContext('2d')?.clearRect(0, 0, c.width, c.height);
    c.hidden = true;
  }
  st = null;
}
