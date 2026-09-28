/** Breakpoints (min-width). Mirrors the comment block in tokens.css. */
export const breakpoints = {
  sm: '30rem', // 480
  md: '47.5rem', // 760: nav switch, work grid 2 columns (prototype collapse point)
  lg: '62rem', // 992: brief structure change (12-col work grid, 3-zone headers)
  xl: '75rem', // 1200
  '2xl': '98.75rem', // 1580
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const mq = (bp: Breakpoint) => `(min-width: ${breakpoints[bp]})`;
