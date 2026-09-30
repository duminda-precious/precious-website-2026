/**
 * Motion tokens for scripts.
 * Single source of truth is tokens.css: these helpers read the CSS custom
 * properties at runtime, so a change in CSS flows through to every script.
 * There is no duplicated fallback table; the stylesheet always ships with the page.
 */

type Token = `--${string}`;

function style(): CSSStyleDeclaration | null {
  if (typeof document === 'undefined') return null;
  return getComputedStyle(document.documentElement);
}

/** Raw token value (trimmed). Custom properties resolve their var() references. */
export function cssVar(name: Token): string {
  return style()?.getPropertyValue(name).trim() ?? '';
}

/** Duration in seconds (GSAP's unit). Accepts "300ms" or "0.3s". */
export function duration(name: Token): number {
  const raw = cssVar(name);
  const n = parseFloat(raw) || 0;
  return raw.endsWith('ms') ? n / 1000 : n;
}

/** Duration in milliseconds, scaled by --motion-tempo unless `raw` is set. */
export function ms(name: Token, raw = false): number {
  return duration(name) * 1000 * (raw ? 1 : tempo());
}

/** A unitless number token. */
export function num(name: Token): number {
  return parseFloat(cssVar(name)) || 0;
}

/** A positive whole-number token, e.g. a step count. */
export function count(name: Token): number {
  return Math.max(1, Math.round(num(name)));
}

/** A 0–1 number token, e.g. a probability or an opacity. */
export function ratio(name: Token): number {
  return Math.min(1, Math.max(0, num(name)));
}

/** A space-separated number list token, e.g. --pixel-resolve "12 8 5 3". */
export function list(name: Token): number[] {
  return cssVar(name)
    .split(/\s+/)
    .map(Number)
    .filter((n) => Number.isFinite(n) && n > 0);
}

/** A length token in CSS pixels (px or rem). */
export function length(name: Token): number {
  const raw = cssVar(name);
  const n = parseFloat(raw) || 0;
  if (!raw.endsWith('rem')) return n;
  const rootSize = parseFloat(style()?.fontSize ?? '') || 16;
  return n * rootSize;
}

/** An easing token as a CSS string, for WAAPI and inline transitions. */
export function ease(name: `--ease-${string}`): string {
  return cssVar(name) || 'ease';
}

/** Cubic-bezier control points, e.g. for CustomEase. */
export function bezier(name: `--ease-${string}`): [number, number, number, number] {
  const match = cssVar(name).match(/cubic-bezier\(([^)]+)\)/);
  const parts = (match?.[1] ?? '0.4, 0, 0.2, 1').split(',').map(Number);
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 1, parts[3] ?? 1];
}

/** A colour token (as written in tokens.css, e.g. #rrggbb). */
export function color(name: Token): string {
  return cssVar(name);
}

/** A colour token as [r, g, b]. */
export function rgb(name: Token): [number, number, number] {
  return hexRgb(color(name));
}

export function hexRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) || 0) as [number, number, number];
}

/** Motion tempo: multiply pixel-motion durations by this (Calm 1.5 · Standard 1 · Lively 0.65). */
export function tempo(): number {
  const n = parseFloat(cssVar('--motion-tempo'));
  return Number.isFinite(n) && n > 0 ? n : 1;
}

/** The four core wash hues: sky, lavender, rose, mint. */
export function washes(): string[] {
  return ['sky', 'lavender', 'rose', 'mint'].map((k) => color(`--color-wash-${k}`));
}

/** Smoothstep, the prototype's scrubbed-progress curve: k(a, b) over p. */
export function smoothstep(a: number, b: number, p: number): number {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
