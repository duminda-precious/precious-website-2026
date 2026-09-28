/**
 * M8 reel sound toggle. The button unmutes/mutes the reel, swaps its label
 * ("Sound on" / "Sound off", from data-label-on/-off) and sets aria-pressed.
 */
import type { MotionModule } from './index';

export const soundToggle: MotionModule = {
  name: 'soundToggle',
  init(root) {
    const controller = new AbortController();
    root.querySelectorAll<HTMLButtonElement>('[data-motion="sound-toggle"]').forEach((btn) => {
      const video = btn.parentElement?.querySelector('video');
      if (!video) return;
      const sync = () => {
        const soundOn = !video.muted;
        btn.setAttribute('aria-pressed', String(soundOn));
        btn.textContent = (soundOn ? btn.dataset.labelOff : btn.dataset.labelOn) ?? '';
      };
      btn.addEventListener(
        'click',
        () => {
          video.muted = !video.muted;
          if (!video.muted && video.paused) video.play().catch(() => {});
          sync();
        },
        { signal: controller.signal },
      );
      sync();
    });
    return () => controller.abort();
  },
};
