/**
 * M13 pixel text: words resolve from, and now and then break back into, hard pixels
 * (the language of the butterfly mark). Ported from the parallel prototype's hero
 * effect (decision 2026-09-29) and applied to every [data-motion="pixel-text"] heading.
 *
 *  1. Resolve: the first time a heading is 40% in view, each word steps from big
 *     blocks to crisp type (--pixel-resolve), words staggered left to right.
 *  2. Glitch: every --dur-glitch-min + random(--dur-glitch-range), one word in a
 *     visible heading (sometimes two) breaks into pixels and snaps back (--pixel-glitch),
 *     with a small sideways jitter on the biggest blocks.
 *
 * How: each word is wrapped in <span class="px">. While it animates, a canvas overlay
 * draws the word at 1/block resolution, hardens the alpha to on/off pixels (blocks ≥ 3),
 * and scales it up with nearest-neighbour; the word's own text goes transparent. The
 * real text stays in the DOM (the canvas is aria-hidden), so reading, selection and
 * SEO are unaffected.
 *
 * Tokens: --pixel-resolve, --pixel-glitch, --dur-pixel-frame-in, --dur-pixel-frame-glitch,
 *         --dur-pixel-word-stagger, --dur-glitch-min, --dur-glitch-range, --pixel-glitch-double.
 * Reduced motion / no canvas: the module doesn't run; text is always crisp.
 * Hooks: data-motion="pixel-text"; .px, .pxon, .pxhide (styles in base.css).
 */
import type { MotionModule } from './index';
import { prefersReducedMotion } from './reducedMotion';
import { duration, list, ratio } from './tokens';

interface PxWord extends HTMLSpanElement {
  _busy?: boolean;
  _cs?: CSSStyleDeclaration;
  _col?: string;
  _txt?: string;
  _base?: number;
  _c?: HTMLCanvasElement | null;
  _s?: HTMLCanvasElement;
}

/** Wrap every word of el's text in <span class="px"> (whitespace stays text). */
function wrapWords(el: HTMLElement): PxWord[] {
  const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  const out: PxWord[] = [];
  let n: Node | null;
  while ((n = tw.nextNode())) if (n.nodeValue?.trim()) nodes.push(n as Text);
  nodes.forEach((t) => {
    const frag = document.createDocumentFragment();
    t.nodeValue!.split(/(\s+)/).forEach((w) => {
      if (!w) return;
      if (/^\s+$/.test(w)) {
        frag.append(document.createTextNode(w));
        return;
      }
      const sp = document.createElement('span') as PxWord;
      sp.className = 'px';
      sp.textContent = w;
      frag.append(sp);
      out.push(sp);
    });
    t.parentNode!.replaceChild(frag, t);
  });
  return out;
}

function baseline(el: HTMLElement): number {
  const i = document.createElement('i');
  i.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
  el.append(i);
  const y = i.offsetTop;
  i.remove();
  return y;
}

export const pixelText: MotionModule = {
  name: 'pixelText',
  init(root) {
    if (prefersReducedMotion() || !window.HTMLCanvasElement) return;
    const headings = Array.from(root.querySelectorAll<HTMLElement>('[data-motion="pixel-text"]'));
    if (!headings.length) return;

    const IN = list('--pixel-resolve');
    const GLITCH = list('--pixel-glitch');
    const frameIn = duration('--dur-pixel-frame-in') * 1000;
    const frameGlitch = duration('--dur-pixel-frame-glitch') * 1000;
    const stagger = duration('--dur-pixel-word-stagger') * 1000;
    const glitchMin = duration('--dur-glitch-min') * 1000;
    const glitchRange = duration('--dur-glitch-range') * 1000;
    const doubleChance = ratio('--pixel-glitch-double');
    const DPR = Math.min(2, window.devicePixelRatio || 1);

    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const t = window.setTimeout(() => {
        timers.delete(t);
        fn();
      }, ms);
      timers.add(t);
    };

    const originals = new Map(headings.map((h) => [h, h.innerHTML]));
    const words = new Map(headings.map((h) => [h, wrapWords(h)]));
    const resolved = new Set<HTMLElement>();
    const inView = new Set<HTMLElement>();

    const draw = (el: PxWord, block: number) => {
      const cs = el._cs!;
      const fs = parseFloat(cs.fontSize);
      const pad = Math.ceil(fs * 0.35);
      const W = el.offsetWidth + pad * 2;
      const H = el.offsetHeight + pad * 2;
      let c = el._c;
      if (!c) {
        c = document.createElement('canvas');
        c.setAttribute('aria-hidden', 'true');
        el.append(c);
        el._c = c;
      }
      c.style.left = `${-pad}px`;
      c.style.top = `${-pad}px`;
      c.style.width = `${W}px`;
      c.style.height = `${H}px`;
      const b = Math.max(1, block);
      const sw = Math.ceil(W / b);
      const sh = Math.ceil(H / b);
      const s = el._s ?? (el._s = document.createElement('canvas'));
      s.width = sw;
      s.height = sh;
      const x = s.getContext('2d')!;
      x.save();
      x.scale(1 / b, 1 / b);
      x.font = `${cs.fontStyle} ${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
      try {
        if ('letterSpacing' in x) (x as CanvasRenderingContext2D).letterSpacing = cs.letterSpacing;
      } catch {
        /* older canvas: no letter-spacing */
      }
      x.fillStyle = el._col!;
      x.textBaseline = 'alphabetic';
      x.fillText(el._txt!, pad, pad + el._base!);
      x.restore();
      if (b >= 3) {
        const d = x.getImageData(0, 0, sw, sh);
        const a = d.data;
        for (let i = 3; i < a.length; i += 4) a[i] = a[i]! > 80 ? 255 : 0;
        x.putImageData(d, 0, 0);
      }
      c.width = Math.ceil(W * DPR);
      c.height = Math.ceil(H * DPR);
      const g = c.getContext('2d')!;
      g.imageSmoothingEnabled = false;
      g.drawImage(s, 0, 0, sw, sh, 0, 0, sw * b * DPR, sh * b * DPR);
      c.style.transform =
        b >= 8 && Math.random() < 0.45
          ? `translateX(${(Math.random() < 0.5 ? -1 : 1) * Math.round(b / 2)}px)`
          : '';
    };

    const run = (el: PxWord, seq: number[], ms: number, delay = 0) => {
      if (el._busy) return;
      el._busy = true;
      el._cs = getComputedStyle(el);
      el._col = el._cs.color;
      el._txt = el.textContent ?? '';
      el._base = baseline(el);
      later(() => {
        let i = 0;
        el.classList.add('pxon');
        el.classList.remove('pxhide');
        const tick = () => {
          if (i >= seq.length) {
            el.classList.remove('pxon');
            el._c?.remove();
            el._c = null;
            el._busy = false;
            return;
          }
          draw(el, seq[i++]!);
          later(tick, ms);
        };
        tick();
      }, delay);
    };

    // 1. Resolve on first view. Words wait hidden until their turn.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          const h = target as HTMLElement;
          if (!isIntersecting) {
            inView.delete(h);
            return;
          }
          inView.add(h);
          if (resolved.has(h)) return;
          resolved.add(h);
          words.get(h)!.forEach((w, i) => run(w, IN, frameIn, i * stagger));
        });
      },
      { threshold: 0.4 },
    );

    let stopped = false;
    const start = () => {
      if (stopped) return;
      words.forEach((ws) => ws.forEach((w) => w.classList.add('pxhide')));
      headings.forEach((h) => io.observe(h));

      // 2. Now and then, a word in a visible heading breaks into pixels and snaps back.
      const idle = () =>
        later(
          () => {
            if (!document.hidden) {
              const pool = [...inView].filter((h) => resolved.has(h)).flatMap((h) => words.get(h)!);
              const n = Math.random() < doubleChance ? 2 : 1;
              for (let k = 0; k < n && pool.length; k++) {
                run(pool[Math.floor(Math.random() * pool.length)]!, GLITCH, frameGlitch, k * 140);
              }
            }
            idle();
          },
          glitchMin + Math.random() * glitchRange,
        );
      idle();
    };
    // Draw with the brand fonts, never the fallback.
    (document.fonts?.ready ?? Promise.resolve()).then(start);

    return () => {
      stopped = true;
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      timers.clear();
      originals.forEach((html, h) => (h.innerHTML = html));
    };
  },
};
