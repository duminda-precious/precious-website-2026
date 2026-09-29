/**
 * Pixel clip: show or hide an element through a grid of square cells, revealed in
 * shuffled batches with no tweening (8-bit). The element's clip-path is a single
 * path() made of the lit cells. Used by the page transition (M10) and the mobile
 * menu reveal (M16).
 */
import { count, duration, length } from './tokens';

type CellToken = '--pixel-cell-page' | '--pixel-cell-menu';
type DurToken =
  '--dur-pixel-reveal' | '--dur-pixel-reveal-out' | '--dur-page-cover' | '--dur-page-reveal';

export interface PixelClip {
  /** Animate to all cells lit (show) or none (hide). Resolves when done. */
  to(show: boolean): Promise<void>;
  /** Stop any running animation and clear the clip. */
  reset(): void;
}

/** showDur: time to light every cell; hideDur: time to clear them. */
export function pixelClip(
  el: HTMLElement,
  cellToken: CellToken,
  showDur: DurToken,
  hideDur: DurToken,
): PixelClip {
  const cell = length(cellToken);
  const steps = count('--pixel-reveal-steps');
  const showStep = (duration(showDur) * 1000) / steps;
  const hideStep = (duration(hideDur) * 1000) / steps;

  let cells: string[] = [];
  let lit = 0;
  let timer = 0;
  let done: (() => void) | null = null;

  const build = () => {
    const { width, height } = el.getBoundingClientRect();
    const cols = Math.ceil(width / cell);
    const rows = Math.ceil(height / cell);
    cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push(`M${c * cell} ${r * cell}h${cell}v${cell}h-${cell}z`);
      }
    }
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j]!, cells[i]!];
    }
  };

  const apply = () => {
    el.style.clipPath =
      lit >= cells.length ? '' : `path('${cells.slice(0, lit).join('') || 'M0 0z'}')`;
  };

  const finish = () => {
    done?.();
    done = null;
  };

  return {
    to(show) {
      window.clearTimeout(timer);
      finish();
      if (!cells.length || show) build();
      if (show) lit = 0;
      const target = show ? cells.length : 0;
      const batch = Math.ceil(cells.length / steps);
      return new Promise<void>((resolve) => {
        done = resolve;
        const step = () => {
          lit = show ? Math.min(target, lit + batch) : Math.max(target, lit - batch);
          apply();
          if (lit === target) finish();
          else timer = window.setTimeout(step, show ? showStep : hideStep);
        };
        step();
      });
    },
    reset() {
      window.clearTimeout(timer);
      finish();
      el.style.clipPath = '';
    },
  };
}
