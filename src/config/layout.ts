/**
 * Position-based layout recipes (brief §2.4). Editors only order entries;
 * size and proportion follow the position, so no "size" field is needed.
 */
import type { MediaAspect } from '../components/ui/media';

export interface GridPosition {
  /** Columns spanned in the 12-column grid (from lg, 992px). */
  span: number;
  /** Media aspect ratio at this position. Neighbours never share one. */
  aspect: MediaAspect;
}

/**
 * Homepage Work grid, 5 projects (decision 2026-09-29):
 * row 1 = 6 + 3 + 3, row 2 = 6 + 6. Below lg: 2 equal columns from md, 1 on phones.
 */
export const workGridPositions: GridPosition[] = [
  { span: 6, aspect: '3/2' },
  { span: 3, aspect: '5/4' },
  { span: 3, aspect: '1/1' },
  { span: 6, aspect: '4/3' },
  { span: 6, aspect: '1/1' },
];
