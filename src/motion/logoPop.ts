/**
 * Logo pop (P2-5). The first time a [data-motion="logo-pop"] logo is half in view,
 * its butterfly's pixels (data-logo-pixel) pop in one small batch at a time, in
 * shuffled order. The letters are already there. Once per page view.
 * Without JS the logo is simply whole; the pixels are only hidden once this runs.
 * Tokens: --pixel-pop-steps, --dur-pixel-pop.
 * Reduced motion: the module doesn't run (logo whole).
 */
import type { MotionModule } from './index';
import { prefersReducedMotion } from './reducedMotion';
import { count, duration } from './tokens';

export const logoPop: MotionModule = {
  name: 'logoPop',
  init(root) {
    if (prefersReducedMotion()) return;
    const logos = root.querySelectorAll<HTMLElement>('[data-motion="logo-pop"]');
    if (!logos.length) return;

    const steps = count('--pixel-pop-steps');
    const stepMs = (duration('--dur-pixel-pop') * 1000) / steps;
    const timers = new Set<number>();
    const all: SVGElement[] = [];

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          io.unobserve(target);
          const pixels = Array.from(target.querySelectorAll<SVGElement>('[data-logo-pixel]'));
          for (let i = pixels.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pixels[i], pixels[j]] = [pixels[j]!, pixels[i]!];
          }
          const batch = Math.ceil(pixels.length / steps);
          for (let s = 0; s < steps; s++) {
            const t = window.setTimeout(() => {
              timers.delete(t);
              pixels.slice(s * batch, (s + 1) * batch).forEach((p) => (p.style.opacity = ''));
            }, s * stepMs);
            timers.add(t);
          }
        });
      },
      { threshold: 0.5 },
    );

    logos.forEach((logo) => {
      logo.querySelectorAll<SVGElement>('[data-logo-pixel]').forEach((p) => {
        p.style.opacity = '0';
        all.push(p);
      });
      io.observe(logo);
    });

    return () => {
      io.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
      timers.clear();
      all.forEach((p) => (p.style.opacity = ''));
    };
  },
};
