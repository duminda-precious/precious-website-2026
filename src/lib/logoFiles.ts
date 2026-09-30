/**
 * Logo downloads for /brand: the wordmark and the butterfly mark in Deep Ink and
 * white, as static SVG files built by src/pages/brand/[file].ts. The geometry comes
 * from src/components/ui/logo.ts and pixelIcons.ts, the colours from tokens.css.
 */
import { LOGO_LETTERS, LOGO_VIEWBOX, MARK_ORIGIN, MARK_UNIT } from '../components/ui/logo';
import { pixelPath, pixelSize } from '../components/ui/pixelIcons';
import { site } from '../config/site';
import { token } from './designTokens';

export const logoFiles = [
  { file: 'precious-studio-wordmark-deep-ink.svg', variant: 'wordmark', tone: 'ink' },
  { file: 'precious-studio-mark-deep-ink.svg', variant: 'mark', tone: 'ink' },
  { file: 'precious-studio-wordmark-white.svg', variant: 'wordmark', tone: 'white' },
  { file: 'precious-studio-mark-white.svg', variant: 'mark', tone: 'white' },
] as const;

export type LogoFile = (typeof logoFiles)[number];

/** Deep Ink is Slate 900 (tokens.css: "--text-primary … Deep Ink, never #000"). */
const toneColour = { ink: 'color-slate-900', white: 'color-white' } as const;

/** Pixels in the downloaded mark (the 13 × 11 grid drawn at this many units per pixel). */
const MARK_SCALE = 10;

export function logoSvg({ variant, tone }: LogoFile): string {
  const fill = token(toneColour[tone]).value;
  const butterfly = `<path d="${pixelPath('butterfly')}" fill="${fill}" shape-rendering="crispEdges"/>`;
  if (variant === 'mark') {
    const { cols, rows } = pixelSize('butterfly');
    const w = cols * MARK_SCALE;
    const h = rows * MARK_SCALE;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${cols} ${rows}"><title>${site.name}</title>${butterfly}</svg>\n`;
  }
  const { width, height } = LOGO_VIEWBOX;
  const letters = LOGO_LETTERS.map((d) => `<path d="${d}" fill="${fill}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><title>${site.name}</title>${letters}<g transform="translate(${MARK_ORIGIN.x} ${MARK_ORIGIN.y}) scale(${MARK_UNIT})">${butterfly}</g></svg>\n`;
}
