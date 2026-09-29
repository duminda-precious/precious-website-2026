/**
 * M13 pixel text: words resolve from, and now and then break back into, hard pixels
 * (the language of the butterfly mark). The parallel prototype's hero effect, copied
 * exactly (engine in pixelWords.ts) and applied to every [data-motion="pixel-text"].
 *
 *  1. Resolve: the first time a heading is 40% in view, each word steps from big
 *     blocks to crisp type (--pixel-resolve), words staggered left to right.
 *  2. Glitch: every --dur-glitch-min + random(--dur-glitch-range), one word in a
 *     visible heading (sometimes two) breaks into pixels and snaps back (--pixel-glitch).
 *
 * Tokens: --pixel-resolve, --pixel-glitch, --dur-pixel-frame-in, --dur-pixel-frame-glitch,
 *         --dur-pixel-word-stagger, --dur-glitch-min, --dur-glitch-range, --pixel-glitch-double.
 * Reduced motion / no canvas: the module doesn't run; text is always crisp.
 */
import type { MotionModule } from './index';
import { prefersReducedMotion } from './reducedMotion';
import { duration, list, ratio } from './tokens';
import { pixelRunner, wrapWords, type PxWord } from './pixelWords';

export const pixelText: MotionModule = {
  name: 'pixelText',
  init(root) {
    if (prefersReducedMotion() || !window.HTMLCanvasElement) return;
    const headings = Array.from(root.querySelectorAll<HTMLElement>('[data-motion="pixel-text"]'));
    if (!headings.length) return;

    const IN = list('--pixel-resolve');
    const GLITCH = list('--pixel-glitch');
    const frameIn = duration('--dur-pixel-frame-in') * 1000;
    const frameGlitch = duration('--dur-pixel-frame-glitch') * 1000;
    const stagger = duration('--dur-pixel-word-stagger') * 1000;
    const glitchMin = duration('--dur-glitch-min') * 1000;
    const glitchRange = duration('--dur-glitch-range') * 1000;
    const doubleChance = ratio('--pixel-glitch-double');

    const runner = pixelRunner();
    const originals = new Map(headings.map((h) => [h, h.innerHTML]));
    const words = new Map<HTMLElement, PxWord[]>(headings.map((h) => [h, wrapWords(h)]));
    const resolved = new Set<HTMLElement>();
    const inView = new Set<HTMLElement>();
    let idleTimer = 0;
    let stopped = false;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          const h = target as HTMLElement;
          if (!isIntersecting) {
            inView.delete(h);
            return;
          }
          inView.add(h);
          if (resolved.has(h)) return;
          resolved.add(h);
          words.get(h)!.forEach((w, i) => runner.run(w, IN, frameIn, i * stagger));
        });
      },
      { threshold: 0.4 },
    );

    const idle = () => {
      idleTimer = window.setTimeout(
        () => {
          if (!document.hidden) {
            const pool = [...inView].filter((h) => resolved.has(h)).flatMap((h) => words.get(h)!);
            const n = Math.random() < doubleChance ? 2 : 1;
            for (let k = 0; k < n && pool.length; k++) {
              runner.run(
                pool[Math.floor(Math.random() * pool.length)]!,
                GLITCH,
                frameGlitch,
                k * 140,
              );
            }
          }
          idle();
        },
        glitchMin + Math.random() * glitchRange,
      );
    };

    // Draw with the brand fonts, never the fallback. Words wait hidden until their turn.
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (stopped) return;
      words.forEach((ws) => ws.forEach((w) => w.classList.add('pxhide')));
      headings.forEach((h) => io.observe(h));
      idle();
    });

    return () => {
      stopped = true;
      io.disconnect();
      window.clearTimeout(idleTimer);
      runner.stop();
      originals.forEach((html, h) => (h.innerHTML = html));
    };
  },
};
