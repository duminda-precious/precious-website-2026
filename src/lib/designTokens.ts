/**
 * Design tokens read from src/styles/tokens.css at build time, for the pages that
 * document the system (/brand). tokens.css stays the single source of truth: every
 * value, note and group here is parsed from it, never copied, so the documentation
 * follows any token change (including the phase-2 rebrand).
 *
 *   value  the declaration as written (whitespace collapsed)
 *   note   the comment on the same line, after the declaration
 *   group  the nearest comment above it (section banners excluded)
 *   scope  root (:root), or the theme block it sits in: light | dark
 */
import css from '../styles/tokens.css?raw';

export type Scope = 'root' | 'light' | 'dark' | 'other';

export interface Token {
  /** Name without the leading dashes, e.g. "color-slate-25". */
  name: string;
  value: string;
  note: string;
  group: string;
  scope: Scope;
}

const clean = (comment: string) =>
  comment
    .split('\n')
    .map((line) => line.replace(/^\s*\*?\s?/, ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Section banners are drawn with rules of dashes or equals signs. */
const isBanner = (comment: string) => /-{5,}|={5,}/.test(comment);

function scopeOf(selector: string | undefined): Scope {
  if (!selector) return 'other';
  if (selector.includes("data-theme='dark'") || selector.includes('data-page-theme')) return 'dark';
  if (selector.includes("data-theme='light'")) return 'light';
  if (selector.trim() === ':root') return 'root';
  return 'other';
}

function parse(src: string): Token[] {
  const out: Token[] = [];
  const selectors: string[] = [];
  let buffer = '';
  let group = '';
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      const text = src.slice(i + 2, end);
      group = isBanner(text) ? '' : clean(text);
      i = end + 2;
      continue;
    }
    if (ch === '{') {
      selectors.push(buffer.trim());
      buffer = '';
      group = '';
      i++;
      continue;
    }
    if (ch === '}') {
      selectors.pop();
      buffer = '';
      i++;
      continue;
    }
    if (ch === ';') {
      buffer = '';
      i++;
      continue;
    }
    if (ch === '-' && src[i + 1] === '-' && buffer.trim() === '') {
      const colon = src.indexOf(':', i);
      const name = src.slice(i + 2, colon).trim();
      // The value runs to the first ";" outside brackets and quotes.
      let j = colon + 1;
      let depth = 0;
      let quote = '';
      for (; j < src.length; j++) {
        const c = src[j];
        if (quote) {
          if (c === quote) quote = '';
        } else if (c === '"' || c === "'") quote = c;
        else if (c === '(') depth++;
        else if (c === ')') depth--;
        else if (c === ';' && depth === 0) break;
      }
      const value = src
        .slice(colon + 1, j)
        .replace(/\s+/g, ' ')
        .replace(/\( /g, '(')
        .replace(/ \)/g, ')')
        .trim();
      i = j + 1;
      const trailing = /^[ \t]*\/\*([\s\S]*?)\*\//.exec(src.slice(i));
      let note = '';
      if (trailing) {
        note = clean(trailing[1] ?? '');
        i += trailing[0].length;
      }
      out.push({ name, value, note, group, scope: scopeOf(selectors.at(-1)) });
      continue;
    }
    buffer += ch;
    i++;
  }
  return out;
}

export const allTokens = parse(css);

const byScope = (scope: Scope) =>
  new Map(allTokens.filter((t) => t.scope === scope).map((t) => [t.name, t]));
const root = byScope('root');
const themes = { light: byScope('light'), dark: byScope('dark') };
export type Theme = keyof typeof themes;
export const themeNames = Object.keys(themes) as Theme[];

/** A theme-independent token (root), falling back to the light theme. */
export function token(name: string): Token {
  const t = root.get(name) ?? themes.light.get(name);
  if (!t) throw new Error(`Token --${name} is not defined in tokens.css.`);
  return t;
}

/** Root tokens whose name matches, in file order. */
export function tokensMatching(pattern: RegExp): Token[] {
  return [...root.values()].filter((t) => pattern.test(t.name));
}

/** The semantic tokens a theme defines, in file order. */
export function themeTokens(theme: Theme): Token[] {
  return [...themes[theme].values()];
}

/** The value a theme gives a token. A theme that doesn't set it inherits the light value, as in CSS. */
export function themeValue(name: string, theme: Theme): string | undefined {
  return themes[theme].get(name)?.value ?? themes.light.get(name)?.value ?? root.get(name)?.value;
}

/** The note on a theme's declaration; a theme that doesn't set the token inherits the light one. */
export function themeNote(name: string, theme: Theme): string {
  const own = themes[theme].get(name);
  return own ? own.note : (themes.light.get(name)?.note ?? '');
}

/** Replace every var(--x) with its value, recursively, so the CSS works outside the site. */
export function resolve(value: string, theme: Theme = 'light', depth = 0): string {
  if (depth > 8) return value;
  return value.replace(/var\(--([\w-]+)\)/g, (match, name: string) => {
    const next = themeValue(name, theme);
    return next === undefined ? match : resolve(next, theme, depth + 1);
  });
}

/** The primitive a semantic value points at, e.g. "var(--color-slate-25)" → "color-slate-25". */
export function reference(value: string): string | undefined {
  return /^var\(--([\w-]+)\)$/.exec(value)?.[1];
}

/** Every token a value references, in order, without duplicates. */
export function references(value: string): string[] {
  return [...new Set([...value.matchAll(/var\(--([\w-]+)\)/g)].map((m) => m[1]!))];
}

const ROOT_PX = 16;

/** A single length in px ("0.875rem" → 14, "8px" → 8); null for anything else. */
export function px(value: string): number | null {
  const m = /^(-?[\d.]+)(rem|px)$/.exec(value.trim());
  if (!m) return null;
  const n = parseFloat(m[1]!) * (m[2] === 'rem' ? ROOT_PX : 1);
  return Math.round(n * 100) / 100;
}

/** Fixed or fluid size in px: "1rem" → { min: 16, max: 16 }; clamp(a, b, c) → { min: a, max: c }. */
export function sizeRange(value: string): { min: number; max: number } | null {
  const single = px(value);
  if (single !== null) return { min: single, max: single };
  const m = /^clamp\(([^,]+),.+,([^,]+)\)$/.exec(value.trim());
  if (!m) return null;
  const min = px(m[1]!);
  const max = px(m[2]!);
  return min === null || max === null ? null : { min, max };
}

/** "16 → 32px", or "14px" when the size is fixed. */
export function formatRange(value: string): string {
  const r = sizeRange(value);
  if (!r) return value;
  return r.min === r.max ? `${r.min}px` : `${r.min} → ${r.max}px`;
}

/** Duration in ms from "300ms" or "0.3s". */
export function ms(value: string): number | null {
  const m = /^([\d.]+)(ms|s)$/.exec(value.trim());
  if (!m) return null;
  return parseFloat(m[1]!) * (m[2] === 's' ? 1000 : 1);
}

const ACRONYMS = ['ai', 'ui', 'ux', 'svg', 'cta'];

/** A readable name from a token suffix: "slate-25" → "Slate 25", "mint-sky" → "Mint Sky". */
export function label(suffix: string): string {
  return suffix
    .split('-')
    .map((w) =>
      ACRONYMS.includes(w)
        ? w.toUpperCase()
        : /^\d/.test(w)
          ? w
          : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(' ');
}
