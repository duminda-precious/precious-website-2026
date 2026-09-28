/**
 * M7 case video playback: muted videos play when at least 40% visible and pause
 * when out of view. Reduced motion: no autoplay; native controls instead.
 * The hero reel is handled by hero.ts and skipped here.
 */
import { prefersReducedMotion } from './reducedMotion';
import type { MotionModule } from './index';

export const videoInView: MotionModule = {
  name: 'videoInView',
  init(root) {
    const videos = Array.from(
      root.querySelectorAll<HTMLVideoElement>('video[data-motion="video-in-view"]'),
    ).filter((v) => !v.closest('[data-hero-reel]'));
    if (!videos.length) return;

    if (prefersReducedMotion()) {
      videos.forEach((v) => (v.controls = true));
      return () => videos.forEach((v) => (v.controls = false));
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(({ target, isIntersecting, intersectionRatio }) => {
          const v = target as HTMLVideoElement;
          if (isIntersecting && intersectionRatio >= 0.4) v.play().catch(() => {});
          else v.pause();
        }),
      { threshold: [0, 0.4] },
    );
    videos.forEach((v) => io.observe(v));
    return () => {
      io.disconnect();
      videos.forEach((v) => v.pause());
    };
  },
};
