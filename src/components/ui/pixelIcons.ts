/**
 * Pixel icon registry (brand: 8-bit iconography). Each icon is a grid of rows:
 * '#' = filled pixel, '.' = empty. Rendered by PixelIcon.astro (one merged path)
 * and, for the butterfly, by Logo.astro (one element per pixel, so they can animate).
 * Keep grids small and odd-sized where a centre line matters.
 */

export const pixelIcons = {
  /** The logo's butterfly, rasterised from reference/brand/logo-white.svg (13 × 11). */
  butterfly: [
    '#....#.#....#',
    '.##...#...##.',
    '.####...####.',
    '.#####.#####.',
    '..####.####..',
    '...###.###...',
    '..#..#.#..#..',
    '....##.##....',
    '...###.###...',
    '...#.....#...',
    '..#.......#..',
  ],
  /** Button glyph (was ▸). */
  play: ['#..', '##.', '###', '##.', '#..'],
  'arrow-right': ['....#..', '.....#.', '#######', '.....#.', '....#..'],
  'arrow-left': ['..#....', '.#.....', '#######', '.#.....', '..#....'],
  'caret-down': ['#...#', '.#.#.', '..#..'],
  plus: ['...#...', '...#...', '...#...', '#######', '...#...', '...#...', '...#...'],
  close: ['#.....#', '.#...#.', '..#.#..', '...#...', '..#.#..', '.#...#.', '#.....#'],
} as const satisfies Record<string, readonly string[]>;

export type PixelIconName = keyof typeof pixelIcons;

/** Filled cells as [column, row] pairs. */
export function pixelCells(name: PixelIconName): [number, number][] {
  const cells: [number, number][] = [];
  pixelIcons[name].forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === '#') cells.push([x, y]);
    });
  });
  return cells;
}

/** One SVG path for the whole grid, with horizontal runs merged. */
export function pixelPath(name: PixelIconName): string {
  let d = '';
  pixelIcons[name].forEach((row, y) => {
    for (const run of row.matchAll(/#+/g)) {
      d += `M${run.index} ${y}h${run[0].length}v1h-${run[0].length}z`;
    }
  });
  return d;
}

export function pixelSize(name: PixelIconName): { cols: number; rows: number } {
  const grid = pixelIcons[name];
  return { cols: grid[0]!.length, rows: grid.length };
}
