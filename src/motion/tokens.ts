/**
 * Motion tokens for GSAP.
 * Single source of truth is tokens.css; these helpers read the CSS custom
 * properties at runtime, so a phase-2 change in CSS flows through to JS.
 * The fallbacks match tokens.css and only apply if the stylesheet is missing.
 */

const FALLBACK = {
  '--ease-standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
  '--ease-out-soft': 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  '--ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
  '--dur-fast': '200ms',
  '--dur-base': '300ms',
  '--dur-reveal': '450ms',
  '--dur-theme': '800ms',
  '--dur-page': '900ms',
  '--dur-rise': '1s',
  '--dur-stagger': '80ms',
  '--dur-marquee': '60s',
  '--dur-pixel': '240ms',
  '--pixel-steps': '5',
  '--pixel-cell': '0.375rem',
  '--pixel-resolve': '36 28 21 15 10 6 3',
  '--pixel-glitch': '3 7 14 20 12 6 3',
  '--dur-pixel-frame-in': '70ms',
  '--dur-pixel-frame-glitch': '55ms',
  '--dur-pixel-word-stagger': '70ms',
  '--dur-glitch-min': '2.2s',
  '--dur-glitch-range': '2.4s',
  '--pixel-glitch-double': '0.3',
  '--pixel-pop-steps': '16',
  '--dur-pixel-pop': '800ms',
  '--pixel-cell-page': '2rem',
  '--pixel-cell-menu': '1.5rem',
  '--pixel-reveal-steps': '6',
  '--dur-pixel-reveal': '280ms',
  '--dur-pixel-reveal-out': '200ms',
  '--dur-pixel-out': '160ms',
  '--dur-page-cover': '220ms',
  '--dur-page-reveal': '320ms',
} as const;

type MotionVar = keyof typeof FALLBACK;

function readVar(name: MotionVar): string {
  if (typeof document === 'undefined') return FALLBACK[name];
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || FALLBACK[name];
}

/** Duration in seconds (GSAP's unit). Accepts "300ms" or "0.3s". */
export function duration(name: Extract<MotionVar, `--dur-${string}`>): number {
  const raw = readVar(name);
  const n = parseFloat(raw);
  return raw.endsWith('ms') ? n / 1000 : n;
}

/** A unitless number token, e.g. --pixel-steps. */
export function count(
  name: '--pixel-steps' | '--pixel-pop-steps' | '--pixel-reveal-steps',
): number {
  return Math.max(1, Math.round(parseFloat(readVar(name))));
}

/** A 0–1 number token, e.g. a probability. */
export function ratio(name: '--pixel-glitch-double'): number {
  return Math.min(1, Math.max(0, parseFloat(readVar(name)) || 0));
}

/** A space-separated number list token, e.g. --pixel-resolve "12 8 5 3". */
export function list(name: '--pixel-resolve' | '--pixel-glitch'): number[] {
  return readVar(name)
    .split(/\s+/)
    .map(Number)
    .filter((n) => Number.isFinite(n) && n > 0);
}

/** A length token in CSS pixels (px or rem), e.g. --pixel-cell. */
export function length(name: '--pixel-cell' | '--pixel-cell-page' | '--pixel-cell-menu'): number {
  const raw = readVar(name);
  const n = parseFloat(raw);
  if (!raw.endsWith('rem')) return n;
  const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return n * rootSize;
}

/** Cubic-bezier control points, e.g. for CustomEase or a manual curve. */
export function bezier(
  name: Extract<MotionVar, `--ease-${string}`>,
): [number, number, number, number] {
  const match = readVar(name).match(/cubic-bezier\(([^)]+)\)/);
  const parts = (match?.[1] ?? FALLBACK[name].slice(13, -1)).split(',').map(Number);
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 1, parts[3] ?? 1];
}

/** Smoothstep, the prototype's scrubbed-progress curve: k(a, b) over p. */
export function smoothstep(a: number, b: number, p: number): number {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
