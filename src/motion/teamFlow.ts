/**
 * Team funnel flow (Claude Design 2a, port of the design's flow() in its pixel style).
 * One open funnel shape, not wired to the chips: the inbound side narrows from the
 * roles into the engine; the outbound side fans out toward the outputs.
 *   Cells: --pixel-cell-flow squares, no gaps, each fading smoothly toward its target
 *          (soft falloff, a Bayer-dithered density, wash colours drifting through).
 *   Accents: full-strength wash cells step along the flow with a short fading trail.
 *   Halo: a pixel ring around the engine that breathes; a pixel burst travels out
 *         from it each time a pulse reaches the engine.
 *   Entrance (on first view): the engine appears; the chips pop out of it and slide
 *         to their places; the flow draws in (inbound, then outbound, each output
 *         lighting up with a gradient edge glow as the flow reaches it).
 *   Loop: a gentle pulse every few seconds runs through the flow and pings each output.
 * Runs only while the stage is on screen. The canvas bleeds --team-flow-bleed past
 * the stage so the soft edges and the burst aren't clipped.
 * Tokens: --pixel-cell-flow, --team-flow-bleed, --color-wash-*, --wash-rim, --wash-edge,
 *         --blur-halo, --blur-glow, --team-hub-wash, --team-hub-glow, --team-chip-dim,
 *         --team-chip-rest-scale, --ease-out-expo, --ease-standard, --ease-emphasized,
 *         --ease-breathe, --dur-flow-*, --dur-hub-*, --motion-tempo.
 * The funnel timeline (reveal, loop period, pulse length; constant F) is the design's
 * choreography and scales with --motion-tempo.
 * Reduced motion: one still frame of the full flow; chips and outputs shown lit.
 */
import type { MotionModule } from './index';
import { prefersReducedMotion } from './reducedMotion';
import { color, cssVar, ease, hexRgb, length, ms, num, tempo } from './tokens';

type RGB = [number, number, number];
const C = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const IO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const SM = (a: number, b: number, v: number) => {
  const t = C((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const INV = (v: number) => {
  let lo = 0;
  let hi = 1;
  for (let k = 0; k < 24; k++) {
    const m = (lo + hi) / 2;
    if (IO(m) < v) lo = m;
    else hi = m;
  }
  return lo;
};
const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const MX = (a: RGB, b: RGB, t: number): RGB => a.map((v, i) => v + (b[i]! - v) * t) as RGB;
const CS = (c: RGB, al = 1) => `rgba(${c.map((v) => Math.round(v)).join(',')},${C(al).toFixed(3)})`;
/** Timeline (seconds): inbound reveal start/duration, outbound start/duration, loop start, period, pulse length. */
const F = { RI0: 0.75, RID: 1.3, RO0: 1.75, ROD: 1.4, LOOP: 3.6, PER: 4, PB: 1.1 };
const I = { str: 1, rate: 1, pulse: 0.8 };

interface Cell {
  px: number;
  py: number;
  d: number;
  u: number;
  side: number;
  a: number;
  ramp: string[];
}
interface Halo {
  px: number;
  py: number;
  a: number;
  dr: number;
  ang: number;
  h: number;
  col: string;
}
interface Part {
  side: number;
  v: number;
  p: number;
  dur: number;
  col: string;
  tr: [number, number][];
}

function flow(stage: HTMLElement) {
  const vert = stage.dataset.layout === 'v';
  const RM = prefersReducedMotion();
  const cv = stage.querySelector('canvas')!;
  const x = cv.getContext('2d')!;
  const roles = [...stage.querySelectorAll<HTMLElement>('[data-role]')];
  const outs = [...stage.querySelectorAll<HTMLElement>('[data-out]')];
  const eng = stage.querySelector<HTMLElement>('[data-engine]')!;
  const ring = eng.querySelector<HTMLElement>('[data-ring]');
  const wash = eng.querySelector<HTMLElement>('[data-wash]')!;
  const P = length('--pixel-cell-flow') || 12;
  const PD = length('--team-flow-bleed') || 120;
  const w = (k: string) => hexRgb(color(`--color-wash-${k}`));
  const pal = {
    inA: w('mint'),
    inB: w('sky'),
    inC: w('sky'),
    outA: w('lavender'),
    outB: w('rose'),
    outC: w('lavender'),
    parts: ['sky', 'lavender', 'rose', 'sage'].map((k) => color(`--color-wash-${k}`)),
  };
  const dim = cssVar('--team-chip-dim') || '0.45';
  const rest = `scale(${cssVar('--team-chip-rest-scale') || '0.985'})`;
  const EM = ease('--ease-out-expo');
  const PREM = ease('--ease-standard');

  // Output chips get a gradient glow + edge (lit later)
  outs.forEach((o) => {
    if (o.querySelector('[data-glow]')) return;
    const mk = (k: string, css: string) => {
      const s = document.createElement('span');
      s.setAttribute(k, '');
      s.style.cssText = `${css};pointer-events:none;background:var(--wash-edge);background-size:200% 100%`;
      return s;
    };
    o.prepend(
      mk('data-glow', 'position:absolute;inset:-4px;z-index:-1;border-radius:var(--radius-sm);opacity:0;filter:blur(var(--blur-glow))'),
      mk('data-edge', 'position:absolute;inset:-1px;z-index:-1;border-radius:calc(var(--radius-xs) + 1px);opacity:0'),
    );
  });

  let W = 0;
  let H = 0;
  let E = { s: 0, c: 0 };
  let R = 0;
  const G = { s0: 0, s1: 0, o0: 0, o1: 0, c0: 0, W0: 0, cO: 0, W1: 0, n: 0 };
  let inBox: (cx: number, cy: number) => boolean = () => false;
  let cells: Cell[] = [];
  let halo: Halo[] = [];
  let anc: { s: number; c: number; end: number }[] = [];
  let ancU: number[] = [];
  let parts: Part[] = [];
  let tt = 0;
  let last = 0;
  let raf = 0;
  let started = false;
  let anims: Animation[] = [];
  const loops: Animation[] = [];
  const fired = new Set<string>();
  const acc = [0, 0];
  let evIn = 0;
  let evOut: number[] = [];
  let bursts: number[] = [];

  const A = (el: Element, k: Keyframe[], o: KeyframeAnimationOptions) => {
    const a = el.animate(k, o);
    anims.push(a);
    if (!o.fill || o.fill === 'none')
      a.onfinish = () => {
        const i = anims.indexOf(a);
        if (i >= 0) anims.splice(i, 1);
      };
    return a;
  };
  const pos = (el: HTMLElement) => {
    let X = 0;
    let Y = 0;
    let e: HTMLElement | null = el;
    while (e && e !== stage) {
      X += e.offsetLeft;
      Y += e.offsetTop;
      e = e.offsetParent as HTMLElement | null;
    }
    return { x: X, y: Y, w: el.offsetWidth, h: el.offsetHeight };
  };
  const XY = (s: number, c: number): [number, number] => (vert ? [c, s] : [s, c]);
  const SC = (px: number, py: number): [number, number] => (vert ? [py, px] : [px, py]);
  const uIn = (s: number) => C((s - G.s0) / (G.s1 - G.s0));
  const uOut = (s: number) => C((s - G.o0) / (G.o1 - G.o0));
  const cIn = (s: number) => G.c0 + (E.c - G.c0) * SM(0, 1, uIn(s));
  const hwIn = (s: number) => G.n + (G.W0 - G.n) * (1 - SM(0.08, 1, uIn(s)));
  const cOut = (s: number) => G.cO + (E.c - G.cO) * SM(0, 1, 1 - uOut(s));
  const hwOut = (s: number) => G.n + (G.W1 - G.n) * (1 - SM(0.08, 1, 1 - uOut(s)));
  const dens = (s: number, c: number): [number, number, number] | null => {
    if (s < E.s) {
      if (s < G.s0 - 60) return null;
      const q = Math.abs(c - cIn(s)) / hwIn(s);
      const d = (1 - SM(0.4, 1, q)) * SM(G.s0 - 60, G.s0 + 70, s);
      return d > 0.02 ? [d, uIn(s), 0] : null;
    }
    const q = Math.abs(c - cOut(s)) / hwOut(s);
    const d = (1 - SM(0.4, 1, q)) * (1 - SM(G.o1 - 70, G.o1 + 60, s));
    return d > 0.02 ? [d, uOut(s), 1] : null;
  };

  const build = () => {
    W = stage.offsetWidth;
    H = stage.offsetHeight;
    if (!W) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.style.top = `${-PD}px`;
    cv.style.height = `${H + 2 * PD}px`;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round((H + 2 * PD) * dpr);
    x.setTransform(dpr, 0, 0, dpr, 0, PD * dpr);
    const e = pos(eng);
    const ex = e.x + e.w / 2;
    const ey = e.y + e.h / 2;
    const se = SC(ex, ey);
    E = { s: se[0], c: se[1] };
    R = e.w / 2;
    let rs = 1e9;
    let c0 = 1e9;
    let c1 = -1e9;
    roles.forEach((el) => {
      const p = pos(el);
      const a = SC(p.x, p.y);
      const b = SC(p.x + p.w, p.y + p.h);
      rs = Math.min(rs, a[0]);
      c0 = Math.min(c0, a[1]);
      c1 = Math.max(c1, b[1]);
    });
    let oc0 = 1e9;
    let oc1 = -1e9;
    outs.forEach((el) => {
      const p = pos(el);
      const a = SC(p.x, p.y);
      const b = SC(p.x + p.w, p.y + p.h);
      oc0 = Math.min(oc0, a[1]);
      oc1 = Math.max(oc1, b[1]);
    });
    anc = outs.map((el) => {
      const p = pos(el);
      return vert ? { s: p.y, c: p.x + p.w / 2, end: p.y + p.h } : { s: p.x, c: p.y + p.h / 2, end: p.x + p.w };
    });
    Object.assign(G, {
      s0: rs - 24,
      s1: E.s - R * 0.5,
      o0: E.s + R * 0.5,
      o1: Math.max(...anc.map((a) => a.end)) + 24,
      c0: (c0 + c1) / 2,
      W0: (c1 - c0) / 2 + 56,
      cO: (oc0 + oc1) / 2,
      W1: (oc1 - oc0) / 2 + 56,
      n: R * 0.42,
    });
    ancU = anc.map((a) => uOut(a.s));
    evIn = F.RI0 + F.RID;
    evOut = ancU.map((u) => F.RO0 + F.ROD * INV(u));
    const boxes = roles.concat(outs).map((el) => {
      const p = pos(el);
      return [p.x, p.y, p.x + p.w, p.y + p.h] as const;
    });
    const bb = (L: HTMLElement[]) => {
      const r = L.map(pos);
      return [
        Math.min(...r.map((p) => p.x)),
        Math.min(...r.map((p) => p.y)),
        Math.max(...r.map((p) => p.x + p.w)),
        Math.max(...r.map((p) => p.y + p.h)),
      ];
    };
    const cl = [bb(roles), bb(outs)];
    const clF = (cx: number, cy: number) =>
      Math.min(
        ...cl.map((b) => {
          const dx = Math.max(b[0]! - cx, 0, cx - b[2]!);
          const dy = Math.max(b[1]! - cy, 0, cy - b[3]!);
          return 0.5 + 0.5 * SM(0, 48, Math.hypot(dx, dy));
        }),
      );
    inBox = (cx, cy) => boxes.some((b) => cx > b[0] && cx < b[2] && cy > b[1] && cy < b[3]);
    const RP = (a: RGB, b: RGB) =>
      Array.from({ length: 32 }, (_, k) => CS(MX(a, b, 0.5 - 0.5 * Math.cos((6.283 * k) / 32))));
    const RI = RP(pal.inA, pal.inB);
    const RO = RP(pal.outA, pal.outB);
    cells = [];
    halo = [];
    for (let py = -PD; py < H + PD; py += P)
      for (let px = 0; px < W; px += P) {
        const cx = px + P / 2;
        const cy = py + P / 2;
        const dr = Math.hypot(cx - ex, cy - ey);
        const sc = SC(cx, cy);
        if (dr < R + 170)
          halo.push({
            px,
            py,
            a: 0,
            dr,
            ang: Math.atan2(cy - ey, cx - ex),
            h: 1 - SM(R + 2, R + 40, dr),
            col: CS(MX(pal.inB, pal.outA, SM(-R, R, sc[0] - E.s))),
          });
        const D = dens(sc[0], sc[1]);
        if (!D) continue;
        cells.push({ px, py, d: D[0] * clF(cx, cy), u: D[1], side: D[2], a: 0, ramp: D[2] ? RO : RI });
      }
    if (RM) draw(0, 0);
  };

  const revIn = (t: number) => (RM ? 1 : IO(C((t - F.RI0) / F.RID)));
  const revOut = (t: number) => (RM ? 1 : IO(C((t - F.RO0) / F.ROD)));
  const rf = (u: number, rev: number) => (rev >= 1 ? 1 : 1 - SM(rev - 0.12, rev, u));
  const bands = (t: number) => {
    const B: { k: number; pb: number; ui: number | null; uo: number | null }[] = [];
    if (RM || t < F.LOOP) return B;
    const c = Math.floor((t - F.LOOP) / F.PER);
    for (let k = Math.max(0, c - 1); k <= c; k++) {
      const pb = F.LOOP + k * F.PER;
      const pi = (t - pb) / F.PB;
      const po = (t - pb - F.PB - 0.1) / F.PB;
      B.push({ k, pb, ui: pi > 0 && pi < 1 ? IO(pi) : null, uo: po > 0 && po < 1 ? IO(po) : null });
    }
    return B;
  };

  const draw = (t: number, dt: number) => {
    if (!W) return;
    x.globalAlpha = 1;
    x.clearRect(0, -PD, W, H + 2 * PD);
    const ri = revIn(t);
    const ro = revOut(t);
    const B = bands(t);
    const kk = RM ? 1 : 1 - Math.pow(0.9, Math.max(1, dt * 60));
    for (const q of cells) {
      const f = rf(q.u, q.side ? ro : ri);
      let m = 0;
      if (f > 0) {
        let bo = 0;
        for (const bd of B) {
          const up = q.side ? bd.uo : bd.ui;
          if (up !== null) {
            const z = (q.u - up) / 0.07;
            bo += Math.exp(-z * z) * I.pulse;
          }
        }
        m = C(q.d * (0.8 + 0.2 * Math.sin(6.283 * (q.u * 2.2 - t * 0.45))) * I.str * f + bo * Math.sqrt(q.d) * 0.6);
      }
      q.a += (m * 0.9 - q.a) * kk;
      if (q.a < 0.02) continue;
      x.globalAlpha = q.a;
      const idx = Math.floor((q.u * 0.7 - t * 0.06 + 0.12 * Math.sin(q.px * 0.01 + q.py * 0.013 + t * 0.5)) * 32);
      x.fillStyle = q.ramp[((idx % 32) + 32) % 32]!;
      x.fillRect(q.px, q.py, P, P);
    }
    const hp = RM ? 1 : SM(evIn - 0.3, evIn + 0.6, t);
    if (hp > 0 || bursts.length)
      for (const q of halo) {
        const n = 0.5 + 0.5 * Math.sin(q.ang * 5 + t * 0.8) * Math.cos(q.ang * 3 - t * 0.55);
        let bo = 0;
        for (const bt of bursts) {
          const p = (t - bt) / 1.5;
          if (p > 0 && p < 1) {
            const z = (q.dr - (R + 4 + 150 * (1 - Math.pow(1 - p, 3)))) / (14 + 12 * p);
            bo += Math.exp(-z * z) * Math.pow(1 - p, 2) * 1.2;
          }
        }
        q.a += (C(q.h * hp * (0.55 + 0.45 * n) * 0.75 + bo) - q.a) * (bo > 0.05 ? Math.max(kk, 0.3) : kk);
        if (q.a < 0.02) continue;
        x.globalAlpha = q.a * 0.9;
        x.fillStyle = q.col;
        x.fillRect(q.px, q.py, P, P);
      }
    x.globalAlpha = 1;
  };

  const spawn = (side: number) => {
    if (!anc.length) return;
    const col = pal.parts[Math.floor(Math.random() * pal.parts.length)]!;
    parts.push({
      side,
      v: (Math.random() * 2 - 1) * (side ? 0.85 : 0.8),
      p: 0,
      dur: side ? 1.5 + Math.random() * 0.6 : 1.7 + Math.random() * 0.6,
      col,
      tr: [],
    });
  };
  const ppos = (q: Part): [number, number] => {
    if (q.side === 0) {
      const s = -8 + (G.s1 + 8) * Math.pow(q.p, 1.7);
      return XY(s, cIn(s) + q.v * hwIn(s) * 0.72);
    }
    const se = (vert ? H : W) + 8;
    const s = G.o0 + (se - G.o0) * (1 - Math.pow(1 - q.p, 1.7));
    return XY(s, cOut(s) + q.v * hwOut(s) * 0.72);
  };
  const stepParts = (t: number, dt: number) => {
    if (RM) return;
    if (revIn(t) > 0.4) {
      acc[0]! += dt * 1.6 * I.rate;
      while (acc[0]! > 1) {
        acc[0]!--;
        spawn(0);
      }
    }
    if (revOut(t) > 0.4) {
      acc[1]! += dt * 1.6 * I.rate;
      while (acc[1]! > 1) {
        acc[1]!--;
        spawn(1);
      }
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]!;
      q.p += dt / q.dur;
      if (q.p >= 1) {
        parts.splice(i, 1);
        continue;
      }
      const pp = ppos(q);
      const gx = Math.floor(pp[0] / P) * P;
      const gy = Math.floor(pp[1] / P) * P;
      const l = q.tr[0];
      if (!l || l[0] !== gx || l[1] !== gy) {
        q.tr.unshift([gx, gy]);
        if (q.tr.length > 4) q.tr.pop();
      }
      const fa = SM(0, 0.18, q.p) * (1 - SM(0.72, 1, q.p));
      x.fillStyle = q.col;
      for (let k = 0; k < q.tr.length; k++) {
        const [tx, ty] = q.tr[k]!;
        if (inBox(tx + 2, ty + 2)) continue;
        x.globalAlpha = fa * [1, 0.4, 0.15, 0.05][k]!;
        x.fillRect(tx, ty, P, P);
      }
    }
    x.globalAlpha = 1;
  };

  const pulse = (first: boolean) => {
    bursts = bursts.filter((b) => tt - b < 1.6);
    bursts.push(tt);
    if (first) A(wash, [{ opacity: cssVar('--team-hub-wash') || 0.55 }, { opacity: 1 }], { duration: ms('--dur-hub-wash'), easing: PREM, fill: 'forwards' });
  };
  const light = (j: number) => {
    const o = outs[j]!;
    const g = o.querySelector('[data-glow]')!;
    const e = o.querySelector('[data-edge]')!;
    A(o.querySelector('[data-cc]')!, [{ opacity: dim }, { opacity: 1 }], { duration: ms('--dur-flow-light'), easing: PREM, fill: 'forwards' });
    A(o.querySelector('[data-chip]')!, [{ transform: rest }, { transform: 'none' }], { duration: ms('--dur-flow-light'), easing: PREM, fill: 'forwards' });
    A(e, [{ opacity: 0 }, { opacity: 1 }], { duration: ms('--dur-flow-light'), easing: PREM, fill: 'forwards' });
    A(g, [{ opacity: 0 }, { opacity: 1, offset: 0.35 }, { opacity: 0.55 }], { duration: ms('--dur-flow-glow'), easing: PREM, fill: 'forwards' });
    [g, e].forEach((el) =>
      A(el, [{ backgroundPosition: '0% 50%' }, { backgroundPosition: '200% 50%' }], { duration: ms('--dur-flow-shimmer'), iterations: Infinity, fill: 'both' }),
    );
  };
  const ping = (j: number) =>
    A(outs[j]!.querySelector('[data-glow]')!, [{ opacity: 0.55 }, { opacity: 1, offset: 0.35 }, { opacity: 0.55 }], { duration: ms('--dur-flow-glow'), easing: PREM });
  const events = (t: number) => {
    if (!fired.has('e') && t >= evIn) {
      fired.add('e');
      pulse(true);
    }
    evOut.forEach((et, j) => {
      if (!fired.has('o' + j) && t >= et) {
        fired.add('o' + j);
        light(j);
      }
    });
    for (const bd of bands(t)) {
      const k = bd.k;
      if (!fired.has(k + 'e') && t >= bd.pb + F.PB) {
        fired.add(k + 'e');
        pulse(false);
      }
      ancU.forEach((u, j) => {
        if (!fired.has(k + 'o' + j) && t >= bd.pb + F.PB + 0.1 + F.PB * INV(u)) {
          fired.add(k + 'o' + j);
          ping(j);
        }
      });
    }
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const real = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    const d = real / tempo();
    tt += d;
    draw(tt, d);
    stepParts(tt, d);
    events(tt);
  };
  const start = () => {
    anims.forEach((a) => a.cancel());
    anims = [];
    fired.clear();
    tt = 0;
    last = 0;
    parts = [];
    bursts = [];
    acc[0] = acc[1] = 0;
    cells.forEach((q) => (q.a = 0));
    halo.forEach((q) => (q.a = 0));
    const ep = pos(eng);
    const ecx = ep.x + ep.w / 2;
    const ecy = ep.y + ep.h / 2;
    A(eng, [{ opacity: 0, transform: 'scale(0.85)' }, { opacity: 1, transform: 'none' }], { duration: ms('--dur-flow-engine'), easing: EM, fill: 'both' });
    [roles, outs].forEach((L) =>
      L.forEach((el, k) => {
        const p = pos(el);
        const dx = ecx - (p.x + p.w / 2);
        const dy = ecy - (p.y + p.h / 2);
        A(
          el,
          [
            { opacity: 0, transform: `translate(${dx}px,${dy}px) scale(0.5)` },
            { opacity: 1, offset: 0.2 },
            { opacity: 1, transform: 'none' },
          ],
          {
            duration: ms('--dur-flow-chip'),
            delay: ms('--dur-flow-chip-delay') + k * ms('--dur-flow-chip-stagger'),
            easing: EM,
            fill: 'both',
          },
        );
      }),
    );
  };

  build();
  document.fonts?.ready.then(build);
  const ro = new ResizeObserver(() => build());
  ro.observe(stage);
  let io: IntersectionObserver | null = null;
  const decor: HTMLElement[] = [];
  if (RM) {
    outs.forEach((o) => {
      (o.querySelector('[data-cc]') as HTMLElement).style.opacity = '1';
      (o.querySelector('[data-chip]') as HTMLElement).style.transform = 'none';
      (o.querySelector('[data-edge]') as HTMLElement).style.opacity = '1';
      (o.querySelector('[data-glow]') as HTMLElement).style.opacity = '0.55';
    });
    wash.style.opacity = '1';
  } else {
    eng.style.opacity = '0';
    // Engine rim + breathing halo
    const mk = (css: string) => {
      const s = document.createElement('span');
      s.setAttribute('aria-hidden', 'true');
      s.style.cssText = `position:absolute;border-radius:50%;z-index:-1;pointer-events:none;background:var(--wash-rim);${css}`;
      eng.prepend(s);
      decor.push(s);
      return s;
    };
    const gl = mk(`inset:-6px;filter:blur(var(--blur-halo));opacity:${num('--team-hub-glow') || 0.5}`);
    const ed = mk('inset:-1.5px');
    loops.push(
      gl.animate(
        [
          { opacity: 0.4, transform: 'scale(0.97) rotate(0deg)' },
          { opacity: 0.9, transform: 'scale(1.07) rotate(180deg)' },
          { opacity: 0.4, transform: 'scale(0.97) rotate(360deg)' },
        ],
        { duration: ms('--dur-hub-breathe'), iterations: Infinity, easing: ease('--ease-breathe') },
      ),
    );
    loops.push(ed.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: ms('--dur-hub-spin'), iterations: Infinity }));
    roles.concat(outs).forEach((el) => (el.style.opacity = '0'));
    // Drifting wash blobs inside the core
    wash.style.background = 'transparent';
    ['mint', 'sky', 'rose', 'lavender', 'sky'].forEach((k) => {
      const b = document.createElement('span');
      const sz = 55 + Math.random() * 25;
      b.style.cssText = `position:absolute;left:${10 + Math.random() * 40}%;top:${10 + Math.random() * 40}%;width:${sz}%;height:${sz}%;border-radius:50%;background:radial-gradient(closest-side,var(--color-wash-${k}) 0%,transparent 100%)`;
      wash.append(b);
      decor.push(b);
      const kf: Keyframe[] = Array.from({ length: 6 }, () => ({
        transform: `translate(${((Math.random() * 2 - 1) * 45).toFixed(1)}%,${((Math.random() * 2 - 1) * 45).toFixed(1)}%) scale(${(0.8 + Math.random() * 0.5).toFixed(2)})`,
      }));
      kf.push(kf[0]!);
      loops.push(
        b.animate(kf, {
          duration: 14000 + Math.random() * 10000,
          delay: -Math.random() * 8000,
          iterations: Infinity,
          easing: ease('--ease-breathe'),
        }),
      );
    });
    io = new IntersectionObserver(
      (es) => {
        if (es[0]?.isIntersecting) {
          if (!started) {
            started = true;
            start();
          }
          if (!raf) {
            last = 0;
            raf = requestAnimationFrame(frame);
          }
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0.35 },
    );
    io.observe(stage);
  }
  void ring;

  return () => {
    io?.disconnect();
    ro.disconnect();
    cancelAnimationFrame(raf);
    anims.concat(loops).forEach((a) => a.cancel());
    decor.forEach((d) => d.remove());
    outs.forEach((o) => o.querySelectorAll('[data-glow],[data-edge]').forEach((n) => n.remove()));
    [eng, wash, ...roles, ...outs].forEach((el) => el.removeAttribute('style'));
    outs.forEach((o) => {
      o.querySelector<HTMLElement>('[data-cc]')?.removeAttribute('style');
      o.querySelector<HTMLElement>('[data-chip]')?.removeAttribute('style');
    });
    x.clearRect(0, -PD, W, H + 2 * PD);
  };
}

export const teamFlow: MotionModule = {
  name: 'teamFlow',
  init(root) {
    const stages = [...root.querySelectorAll<HTMLElement>('[data-flow]')];
    if (!stages.length) return;
    const offs = stages.map(flow);
    return () => offs.forEach((f) => f());
  },
};
