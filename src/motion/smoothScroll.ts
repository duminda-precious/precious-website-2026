/**
 * Smooth wheel scroll (M19, decision 2026-09-30b): Lenis eases mouse-wheel and
 * trackpad scrolling. Only the wheel: touch and keys stay native, and anchor jumps
 * keep the butterfly wing transition. Native scroll stays underneath, so position:
 * sticky (nav, Approach panel, footer reveal) and ScrollTrigger work as before;
 * Lenis runs on GSAP's ticker and updates ScrollTrigger on every scroll.
 * Hand-offs:
 *   Hero      heroReveal registers a wheel claim; while it holds the first scroll or
 *             glides back to the top, Lenis lets the event through untouched and
 *             drops any momentum.
 *   Nested    [data-lenis-prevent] regions scroll themselves (mega menu, full menu);
 *             [data-lenis-prevent-horizontal] keeps sideways swipes native (slider).
 *   Lock      while the full menu locks the page (html.is-scroll-locked) Lenis stops.
 *   Jumps     precious:jump drops momentum before the instant anchor scroll.
 * Tokens: --scroll-lerp, --scroll-wheel-multiplier.
 * Reduced motion: not started; the wheel scrolls natively.
 */
import Lenis from 'lenis';
import type { MotionModule } from './index';
import { gsap, ScrollTrigger } from './gsap';
import { prefersReducedMotion } from './reducedMotion';
import { num } from './tokens';

/** Returns true when the wheel event belongs to someone else (dir: 1 down, -1 up). */
type WheelClaim = (dir: number) => boolean;
let claim: WheelClaim | null = null;

/** Let a module take the wheel from Lenis while it needs it. Returns a release function. */
export function claimWheel(fn: WheelClaim): () => void {
  claim = fn;
  return () => {
    if (claim === fn) claim = null;
  };
}

export const smoothScroll: MotionModule = {
  name: 'smoothScroll',
  init(root) {
    if (prefersReducedMotion()) return;
    const html = root.documentElement;
    const lenis = new Lenis({
      lerp: num('--scroll-lerp') || 0.1,
      wheelMultiplier: num('--scroll-wheel-multiplier') || 1,
      virtualScroll: ({ deltaY }) => {
        if (!claim?.(Math.sign(deltaY))) return true;
        halt();
        return false;
      },
    });
    // Drop momentum without moving: stop() resets to the current position.
    function halt() {
      if (!lenis.isScrolling || lenis.isStopped) return;
      lenis.stop();
      lenis.start();
    }

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    lenis.on('scroll', ScrollTrigger.update);

    const syncLock = () => {
      if (html.classList.contains('is-scroll-locked')) lenis.stop();
      else lenis.start();
    };
    const lockObserver = new MutationObserver(syncLock);
    lockObserver.observe(html, { attributes: true, attributeFilter: ['class'] });
    syncLock();

    const controller = new AbortController();
    document.addEventListener('precious:jump', halt, { signal: controller.signal });

    return () => {
      controller.abort();
      lockObserver.disconnect();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  },
};
