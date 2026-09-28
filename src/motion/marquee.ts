/**
 * M4 marquee control. The CSS animation runs the loop; this module adds the
 * pause/play button (label swap + aria-pressed) and pauses while off-screen.
 */
import type { MotionModule } from './index';

export const marquee: MotionModule = {
  name: 'marquee',
  init(root) {
    const controller = new AbortController();
    const observers: IntersectionObserver[] = [];

    root.querySelectorAll<HTMLElement>('[data-motion="marquee"]').forEach((el) => {
      const toggle = el.parentElement?.querySelector<HTMLButtonElement>('[data-marquee-toggle]');
      if (toggle) {
        const sync = () => {
          const paused = el.hasAttribute('data-paused');
          toggle.setAttribute('aria-pressed', String(paused));
          toggle.textContent =
            (paused ? toggle.dataset.labelPlay : toggle.dataset.labelPause) ?? '';
        };
        toggle.addEventListener(
          'click',
          () => {
            el.toggleAttribute('data-paused');
            sync();
          },
          { signal: controller.signal },
        );
        sync();
      }

      const io = new IntersectionObserver(([entry]) =>
        el.toggleAttribute('data-offscreen', !entry?.isIntersecting),
      );
      io.observe(el);
      observers.push(io);
    });

    return () => {
      controller.abort();
      observers.forEach((io) => io.disconnect());
    };
  },
};
