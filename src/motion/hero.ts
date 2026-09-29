/**
 * M1 hero scroll sequence (from md). Progress p runs 0→1 across the hero track;
 * every range uses smoothstep k(a, b), exactly as the prototype.
 *   L1 over k(.02,.30): scale 1→2.6, blur 0→18px, opacity 1→0, word-spacing 0→2em, line-height .95→1.30
 *   L2 in k(.12,.36): scale .55→1, blur 14→0, opacity 0→1
 *      out k(.45,.62): scale +1.4, blur →18, opacity →0, word-spacing →2em, line-height 1→1.35
 *   L3 (brief): clip opens from the centre into a small 16:9 tile over k(.55,.68),
 *      then grows to fill the stage over k(.70,.90). Corner radius stays constant.
 * Reduced motion: no transforms/blur/clip animation; hard switch at p <.33 (L1),
 * .33–.6 (L2), ≥.6 (L3). The reel plays (muted) only while L3 is showing.
 * Below md the hero is in flow; the reel just plays while in view.
 */
import { ScrollTrigger } from './gsap';
import { smoothstep } from './tokens';
import { prefersReducedMotion } from './reducedMotion';
import type { MotionModule } from './index';

const DESKTOP = '(min-width: 47.5rem)';
const TILE_SCALE = 0.35; // small tile width as a share of the stage (prototype L3 start scale)
const BLUR_EPSILON = 0.1; // below this, filter is set to none

export const hero: MotionModule = {
  name: 'hero',
  init(root) {
    const heroEl = root.querySelector<HTMLElement>('[data-motion="hero"]');
    if (!heroEl) return;
    // Rebuild when crossing the md breakpoint (pinned stage ↔ in-flow layout).
    const mq = matchMedia(DESKTOP);
    let teardown = setup(heroEl);
    const onChange = () => {
      teardown();
      teardown = setup(heroEl);
      ScrollTrigger.refresh();
    };
    mq.addEventListener('change', onChange);
    return () => {
      mq.removeEventListener('change', onChange);
      teardown();
    };
  },
};

function setup(heroEl: HTMLElement): () => void {
  const l1 = heroEl.querySelector<HTMLElement>('[data-hero-layer="1"]')!;
  const l2 = heroEl.querySelector<HTMLElement>('[data-hero-layer="2"]')!;
  const l3 = heroEl.querySelector<HTMLElement>('[data-hero-layer="3"]')!;
  const t1 = l1.querySelector<HTMLElement>('[data-hero-text]')!;
  const t2 = l2.querySelector<HTMLElement>('[data-hero-text]')!;
  const reel = heroEl.querySelector<HTMLElement>('[data-hero-reel]')!;
  const video = reel.querySelector('video');
  const reduced = prefersReducedMotion();
  const controller = new AbortController();

  const play = (on: boolean) => {
    if (!video || reduced) return;
    if (on && video.paused) video.play().catch(() => {});
    if (!on && !video.paused) video.pause();
  };
  if (video && reduced) video.controls = true;

  // Phones: no pin; play the reel while it's in view.
  if (!matchMedia(DESKTOP).matches) {
    const io = new IntersectionObserver(
      ([e]) => play(!!e?.isIntersecting && e.intersectionRatio >= 0.4),
      {
        threshold: [0, 0.4],
      },
    );
    io.observe(reel);
    return () => {
      io.disconnect();
      controller.abort();
    };
  }

  // Cached stage size for the clip maths (updated on ScrollTrigger refresh, never in onUpdate).
  let w = 0;
  let h = 0;
  const measure = () => {
    w = reel.clientWidth;
    h = reel.clientHeight;
  };

  const set = (el: HTMLElement, scale: number, blur: number, opacity: number) => {
    el.style.transform = `scale(${scale})`;
    el.style.filter = blur > BLUR_EPSILON ? `blur(${blur}px)` : 'none';
    el.style.opacity = String(opacity);
  };
  const clip = (x: number, y: number) => {
    reel.style.clipPath = `inset(${y}px ${x}px round var(--radius-md))`;
  };

  const render = (p: number) => {
    if (reduced) {
      set(l1, 1, 0, p < 0.33 ? 1 : 0);
      set(l2, 1, 0, p >= 0.33 && p < 0.6 ? 1 : 0);
      l3.style.opacity = p >= 0.6 ? '1' : '0';
      clip(0, 0);
      return;
    }
    const k = (a: number, b: number) => smoothstep(a, b, p);

    const a = k(0.02, 0.3);
    set(l1, 1 + a * 1.6, a * 18, 1 - a);
    t1.style.wordSpacing = `${(a * 2).toFixed(3)}em`;
    t1.style.lineHeight = (0.95 + a * 0.35).toFixed(3);

    const bIn = k(0.12, 0.36);
    const bOut = k(0.45, 0.62);
    set(l2, 0.55 + 0.45 * bIn + bOut * 1.4, (1 - bIn) * 14 + bOut * 18, bIn * (1 - bOut));
    t2.style.wordSpacing = `${(bOut * 2).toFixed(3)}em`;
    t2.style.lineHeight = (1 + bOut * 0.35).toFixed(3);

    // L3: centre point → small 16:9 tile → full stage.
    const tileW = Math.min(w, w * TILE_SCALE);
    const tileH = Math.min(h, (tileW * 9) / 16);
    const tileX = (w - tileW) / 2;
    const tileY = (h - tileH) / 2;
    const open = k(0.55, 0.68);
    const grow = k(0.7, 0.9);
    const x = w / 2 + (tileX - w / 2) * open;
    const y = h / 2 + (tileY - h / 2) * open;
    clip(x * (1 - grow), y * (1 - grow));
  };

  const trigger = ScrollTrigger.create({
    trigger: heroEl,
    start: 'top top',
    end: 'bottom bottom',
    onRefresh: (self) => {
      measure();
      render(self.progress);
    },
    onUpdate: (self) => {
      render(self.progress);
      play(self.progress >= (reduced ? 0.6 : 0.55));
    },
    // will-change only while the hero is on screen.
    onToggle: (self) => {
      const hint = self.isActive && !reduced ? 'transform, filter, opacity' : '';
      [l1, l2].forEach((el) => (el.style.willChange = hint));
      if (!self.isActive) play(false);
    },
  });
  measure();
  render(trigger.progress);

  return () => {
    trigger.kill();
    controller.abort();
    play(false);
    [l1, l2, l3, t1, t2, reel].forEach((el) => el.removeAttribute('style'));
  };
}
