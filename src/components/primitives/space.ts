/** Spacing token suffixes available in tokens.css (--space-<n>). */
export type SpaceToken =
  | '0'
  | '2'
  | '4'
  | '6'
  | '8'
  | '10'
  | '12'
  | '14'
  | '16'
  | '18'
  | '20'
  | '22'
  | '24'
  | '26'
  | '28'
  | '32'
  | '34'
  | '40'
  | '48'
  | '56'
  | '64'
  | '80'
  | '120';

/** Maps a flex keyword used in props to its CSS value. */
export function flexValue(v: string): string {
  if (v === 'between') return 'space-between';
  if (v === 'start' || v === 'end') return `flex-${v}`;
  return v;
}
