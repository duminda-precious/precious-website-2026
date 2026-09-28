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
  '--dur-marquee': '60s',
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
