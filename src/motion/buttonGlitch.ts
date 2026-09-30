/**
 * M12 label glitch (Claude Design). Every button with a text label glitches into
 * pixels and back on mouse hover in/out and keyboard focus in/out: [data-button]
 * elements and plain <button>s with text. Subtrees marked [data-no-glitch] are
 * skipped (FAQ rows, the Services nav trigger). The label is [data-pixel-label]
 * or, failing that, the button itself.
 * Section CTAs ([data-cta]) also glitch on their own every --dur-glitch-min +
 * random(--dur-glitch-range) while at least 60% visible, words staggered by
 * --dur-cta-stagger, to draw the eye.
 * Engine: pixelWords.ts. Tokens: --pixel-glitch, --dur-pixel-frame-glitch,
 * --dur-glitch-min, --dur-glitch-range, --dur-cta-stagger, --motion-tempo.
 * Reduced motion / no canvas: the module doesn't run.
 */
import type { MotionModule } from './index';
import { prefersReducedMotion } from './reducedMotion';
import { list, ms } from './tokens';
import { pixelRunner, wrapWords, type PxWord } from './pixelWords';

export const buttonGlitch: MotionModule = {
  name: 'buttonGlitch',
  init(root) {
    if (prefersReducedMotion() || !window.HTMLCanvasElement) return;
    const candidates = new Set(root.querySelectorAll<HTMLElement>('[data-button], button'));
    if (!candidates.size) return;
    const GLITCH = list('--pixel-glitch');
    const frame = () => ms('--dur-pixel-frame-glitch');
    const runner = pixelRunner();
    const controller = new AbortController();
    const { signal } = controller;
    const restores: (() => void)[] = [];
    const ctas: PxWord[][] = [];
    const visible = new Set<Element>();
    const labels = new Map<Element, PxWord[]>();

    /** The label: [data-pixel-label], or an inner span wrapped around the button's own
     *  text (so flex buttons keep their word spaces). Re-created if the text was replaced. */
    const labelOf = (el: HTMLElement): HTMLElement | null => {
      const explicit = el.querySelector<HTMLElement>('[data-pixel-label]');
      if (explicit) return explicit;
      const inner = el.querySelector<HTMLElement>(':scope > [data-glitch-label]');
      if (inner) return inner;
      if (!el.textContent?.trim() || el.children.length) return null;
      const span = document.createElement('span');
      span.setAttribute('data-glitch-label', '');
      span.append(...el.childNodes);
      el.append(span);
      return span;
    };

    candidates.forEach((el) => {
      if (el.closest('[data-no-glitch]')) return;
      const label = labelOf(el);
      if (!label) return;
      let words = wrapWords(label);
      if (!words.length) return;
      // Text swapped by another script (e.g. Sound on/off): wrap the new words.
      const current = () => {
        if (!words[0]?.isConnected) {
          const l = labelOf(el);
          words = l ? wrapWords(l) : [];
        }
        return words;
      };
      const glitch = () => current().forEach((w) => runner.run(w, GLITCH, frame()));
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
      // Unwrap the words again (keeps whatever text is current).
      restores.push(() =>
        el.querySelectorAll('.px').forEach((sp) => sp.replaceWith(sp.textContent ?? '')),
      );
      if (el.hasAttribute('data-cta')) {
        ctas.push(words);
        labels.set(label, words);
      }
    });

    // Section CTAs: idle glitch while in view.
    let idle = 0;
    let io: IntersectionObserver | null = null;
    if (labels.size) {
      io = new IntersectionObserver(
        (es) => es.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target))),
        { threshold: 0.6 },
      );
      labels.forEach((_, l) => io!.observe(l));
      const loop = () => {
        idle = window.setTimeout(
          () => {
            if (!document.hidden) {
              const pool = [...visible].map((l) => labels.get(l)!).filter(Boolean);
              const pick = pool[Math.floor(Math.random() * pool.length)];
              pick?.forEach((w, i) => runner.run(w, GLITCH, frame(), i * ms('--dur-cta-stagger')));
            }
            loop();
          },
          ms('--dur-glitch-min') + Math.random() * ms('--dur-glitch-range'),
        );
      };
      loop();
    }

    return () => {
      controller.abort();
      window.clearTimeout(idle);
      io?.disconnect();
      runner.stop();
      restores.forEach((fn) => fn());
    };
  },
};
