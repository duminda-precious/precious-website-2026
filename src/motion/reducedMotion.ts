/**
 * Live prefers-reduced-motion. Every motion module branches on this; the
 * registry re-initialises all modules when the OS setting changes.
 */
const query =
  typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

export function prefersReducedMotion(): boolean {
  return query?.matches ?? false;
}

/** Calls `cb` when the setting changes. Returns an unsubscribe function. */
export function onReducedMotionChange(cb: (reduced: boolean) => void): () => void {
  if (!query) return () => {};
  const handler = (e: MediaQueryListEvent) => cb(e.matches);
  query.addEventListener('change', handler);
  return () => query.removeEventListener('change', handler);
}
