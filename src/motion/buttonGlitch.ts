/**
 * M12 button label glitch. On mouse hover in/out and keyboard focus in/out, a
 * [data-button]'s label ([data-pixel-label]) breaks into pixels and snaps back with
 * the same effect as headings (M13, engine in pixelWords.ts). The gradient fade,
 * colour change and ▸ are CSS in Button.astro.
 * Tokens: --pixel-glitch, --dur-pixel-frame-glitch.
 * Reduced motion / no canvas: the module doesn't run.
 */
import type { MotionModule } from './index';
import { prefersReducedMotion } from './reducedMotion';
import { duration, list } from './tokens';
import { pixelRunner, wrapWords } from './pixelWords';

export const buttonGlitch: MotionModule = {
  name: 'buttonGlitch',
  init(root) {
    if (prefersReducedMotion() || !window.HTMLCanvasElement) return;
    const buttons = root.querySelectorAll<HTMLElement>('[data-button]');
    if (!buttons.length) return;

    const GLITCH = list('--pixel-glitch');
    const frame = duration('--dur-pixel-frame-glitch') * 1000;
    const runner = pixelRunner();
    const controller = new AbortController();
    const { signal } = controller;
    const restores: (() => void)[] = [];

    buttons.forEach((el) => {
      const label = el.querySelector<HTMLElement>('[data-pixel-label]');
      if (!label) return;
      const original = label.innerHTML;
      const words = wrapWords(label);
      const glitch = () => words.forEach((w) => runner.run(w, GLITCH, frame));

      el.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && glitch(), { signal });
      el.addEventListener('pointerleave', (e) => e.pointerType === 'mouse' && glitch(), { signal });
      let keyboard = false;
      el.addEventListener(
        'focus',
        () => {
          keyboard = el.matches(':focus-visible');
          if (keyboard) glitch();
        },
        { signal },
      );
      el.addEventListener(
        'blur',
        () => {
          if (keyboard) glitch();
          keyboard = false;
        },
        { signal },
      );
      restores.push(() => (label.innerHTML = original));
    });

    return () => {
      controller.abort();
      runner.stop();
      restores.forEach((fn) => fn());
    };
  },
};
