/**
 * Pixel hover (P2-4): on mouse hover or keyboard focus, a [data-pixel-fill] element's
 * fill dissolves to its hover gradient as a grid of square cells revealed in shuffled
 * batches, with no tweening (8-bit). Leaving reverses it. While most cells are lit the
 * element gets data-pixel-lit so its label can switch colour.
 *
 * Cells live in the element's [data-pixel-layer]; each shows its slice of one gradient
 * (background-size = element size, offset per cell), so the lit grid reads as one fill.
 * The grid is (re)built lazily on first hover and whenever the element's size changes.
 *
 * Tokens: --pixel-cell (cell size), --pixel-steps (batches), --dur-pixel (total time),
 *         --cta-hover-bg (the gradient, read through the cell's CSS).
 * Reduced motion: the module doesn't run; Button's CSS fallback swaps instantly.
 * Hooks: data-pixel-fill, data-pixel-layer, data-pixel-lit; html[data-pixel-hover].
 */
import type { MotionModule } from './index';
import { prefersReducedMotion } from './reducedMotion';
import { count, duration, length } from './tokens';

function shuffled(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export const pixelHover: MotionModule = {
  name: 'pixelHover',
  init(root) {
    if (prefersReducedMotion()) return;
    const targets = root.querySelectorAll<HTMLElement>('[data-pixel-fill]');
    if (!targets.length) return;

    const html = root.documentElement;
    html.setAttribute('data-pixel-hover', '');
    const controller = new AbortController();
    const { signal } = controller;
    const timers = new Set<number>();
    const resets: (() => void)[] = [];

    const cellSize = length('--pixel-cell');
    const steps = count('--pixel-steps');
    const stepMs = (duration('--dur-pixel') * 1000) / steps;

    targets.forEach((el) => {
      const layer = el.querySelector<HTMLElement>('[data-pixel-layer]');
      if (!layer) return;

      let cells: HTMLElement[] = [];
      let order: number[] = [];
      let builtFor = '';
      let lit = 0;
      let target = 0;
      let timer = 0;

      const build = () => {
        const { width, height } = el.getBoundingClientRect();
        const key = `${Math.round(width)}x${Math.round(height)}`;
        if (key === builtFor) return;
        builtFor = key;
        const cols = Math.ceil(width / cellSize);
        const rows = Math.ceil(height / cellSize);
        const frag = document.createDocumentFragment();
        cells = [];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const cell = document.createElement('span');
            const s = cell.style;
            s.position = 'absolute';
            s.left = `${c * cellSize}px`;
            s.top = `${r * cellSize}px`;
            s.width = `${cellSize}px`;
            s.height = `${cellSize}px`;
            s.background = 'var(--cta-hover-bg)';
            s.backgroundSize = `${width}px ${height}px`;
            s.backgroundPosition = `-${c * cellSize}px -${r * cellSize}px`;
            s.opacity = '0';
            cells.push(cell);
            frag.append(cell);
          }
        }
        layer.replaceChildren(frag);
        order = shuffled(cells.length);
        lit = 0;
        el.removeAttribute('data-pixel-lit');
      };

      const step = () => {
        const batch = Math.ceil(cells.length / steps);
        if (lit < target) {
          const end = Math.min(target, lit + batch);
          for (let i = lit; i < end; i++) cells[order[i]!]!.style.opacity = '1';
          lit = end;
        } else if (lit > target) {
          const end = Math.max(target, lit - batch);
          for (let i = lit - 1; i >= end; i--) cells[order[i]!]!.style.opacity = '0';
          lit = end;
        }
        el.toggleAttribute('data-pixel-lit', lit > cells.length / 2);
        timers.delete(timer);
        if (lit !== target) {
          timer = window.setTimeout(step, stepMs);
          timers.add(timer);
        }
      };

      const run = (on: boolean) => {
        build();
        target = on ? cells.length : 0;
        window.clearTimeout(timer);
        timers.delete(timer);
        step();
      };

      el.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && run(true), {
        signal,
      });
      el.addEventListener('pointerleave', (e) => e.pointerType === 'mouse' && run(false), {
        signal,
      });
      el.addEventListener('focus', () => el.matches(':focus-visible') && run(true), { signal });
      el.addEventListener('blur', () => run(false), { signal });

      resets.push(() => {
        layer.replaceChildren();
        el.removeAttribute('data-pixel-lit');
      });
    });

    return () => {
      controller.abort();
      timers.forEach((t) => window.clearTimeout(t));
      timers.clear();
      resets.forEach((fn) => fn());
      html.removeAttribute('data-pixel-hover');
    };
  },
};
