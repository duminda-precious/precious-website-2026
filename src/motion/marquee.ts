/**
 * Marquee/ticker helper (M4/M8). The CSS animation runs the loop; this module
 * pauses it while it's off-screen (data-offscreen).
 */
import type { MotionModule } from './index';

export const marquee: MotionModule = {
  name: 'marquee',
  init(root) {
    const observers = Array.from(root.querySelectorAll<HTMLElement>('[data-motion="marquee"]')).map(
      (el) => {
        const io = new IntersectionObserver(([entry]) =>
          el.toggleAttribute('data-offscreen', !entry?.isIntersecting),
        );
        io.observe(el);
        return io;
      },
    );
    return () => observers.forEach((io) => io.disconnect());
  },
};
