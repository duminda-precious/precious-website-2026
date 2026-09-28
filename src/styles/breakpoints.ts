/** Breakpoints (min-width). Mirrors the comment block in tokens.css. */
export const breakpoints = {
  sm: '30rem', // 480
  md: '47.5rem', // 760, prototype collapse point
  lg: '64rem', // 1024
  xl: '80rem', // 1280
  '2xl': '100rem', // 1600
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const mq = (bp: Breakpoint) => `(min-width: ${breakpoints[bp]})`;
