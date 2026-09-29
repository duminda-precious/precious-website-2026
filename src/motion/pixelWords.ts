/**
 * Pixel words: the parallel prototype's pixel effect as a shared engine.
 * wrapWords() splits an element's text into <span class="px"> words; a runner then
 * plays a sequence of block sizes on a word through a canvas overlay: the word is
 * drawn at 1/block resolution, its alpha hardened to on/off pixels (blocks ≥ 3) and
 * scaled up nearest-neighbour, with a small sideways jitter on the biggest blocks.
 * The word's own text goes transparent meanwhile; the real text stays in the DOM.
 * Used by pixelText.ts (headings, M13) and pixelHover.ts (button labels, M12).
 * Styles: .px / .pxon / .pxhide in base.css.
 */

export interface PxWord extends HTMLSpanElement {
  _busy?: boolean;
  _cs?: CSSStyleDeclaration;
  _txt?: string;
  _base?: number;
  _c?: HTMLCanvasElement | null;
  _s?: HTMLCanvasElement;
}

/** Wrap every word of el's text in <span class="px"> (whitespace stays text). */
export function wrapWords(el: HTMLElement): PxWord[] {
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

export interface PixelRunner {
  /** Play block sizes on a word, one frame each (skipped if the word is busy). */
  run(el: PxWord, seq: number[], frameMs: number, delayMs?: number): void;
  /** Stop everything and remove overlays. */
  stop(): void;
}

export function pixelRunner(): PixelRunner {
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  const timers = new Set<number>();
  const active = new Set<PxWord>();
  const later = (fn: () => void, ms: number) => {
    const t = window.setTimeout(() => {
      timers.delete(t);
      fn();
    }, ms);
    timers.add(t);
  };

  const clear = (el: PxWord) => {
    el.classList.remove('pxon');
    el._c?.remove();
    el._c = null;
    el._busy = false;
    active.delete(el);
  };

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
      if ('letterSpacing' in x) x.letterSpacing = cs.letterSpacing;
    } catch {
      /* older canvas: no letter-spacing */
    }
    // Read the colour every frame: a button label changes colour mid-hover.
    // The word itself is transparent while on, so read it from its parent.
    x.fillStyle = getComputedStyle(el.parentElement ?? el).color;
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

  return {
    run(el, seq, frameMs, delayMs = 0) {
      if (el._busy) return;
      el._busy = true;
      active.add(el);
      el._cs = getComputedStyle(el);
      // Canvas ignores CSS text-transform, so apply it (button labels are caps).
      const raw = el.textContent ?? '';
      const tt = el._cs.textTransform;
      el._txt =
        tt === 'uppercase' ? raw.toUpperCase() : tt === 'lowercase' ? raw.toLowerCase() : raw;
      el._base = baseline(el);
      later(() => {
        let i = 0;
        el.classList.add('pxon');
        el.classList.remove('pxhide');
        const tick = () => {
          if (i >= seq.length) return clear(el);
          draw(el, seq[i++]!);
          later(tick, frameMs);
        };
        tick();
      }, delayMs);
    },
    stop() {
      timers.forEach((t) => window.clearTimeout(t));
      timers.clear();
      [...active].forEach(clear);
    },
  };
}
