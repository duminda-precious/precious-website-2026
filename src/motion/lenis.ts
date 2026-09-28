/**
 * Smooth scroll (Lenis) driven by GSAP's ticker and synced to ScrollTrigger.
 * - Off under reduced motion (native scroll).
 * - Touch keeps native scrolling (Lenis default), so iOS behaves normally.
 * - Same-page anchor links scroll smoothly and land below the sticky nav.
 * - Pauses while the mobile menu locks scroll ("scroll:lock"/"scroll:unlock" events).
 */
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';
import { prefersReducedMotion } from './reducedMotion';
import type { MotionModule } from './index';

let instance: Lenis | null = null;

export function getLenis() {
  return instance;
}

function navOffset(): number {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  return nav ? nav.offsetHeight : 0;
}

/** Scroll to an element, via Lenis when active, natively otherwise. */
export function scrollToTarget(target: HTMLElement, immediate = false) {
  if (instance) {
    instance.scrollTo(target, { offset: -navOffset(), immediate });
  } else {
    target.scrollIntoView({ behavior: immediate || prefersReducedMotion() ? 'auto' : 'smooth' });
  }
}

export const lenis: MotionModule = {
  name: 'lenis',
  init() {
    const controller = new AbortController();
    const { signal } = controller;

    if (!prefersReducedMotion()) {
      instance = new Lenis({ autoRaf: false });
      instance.on('scroll', ScrollTrigger.update);
      const raf = (time: number) => instance?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      signal.addEventListener('abort', () => gsap.ticker.remove(raf));

      document.addEventListener('scroll:lock', () => instance?.stop(), { signal });
      document.addEventListener('scroll:unlock', () => instance?.start(), { signal });
    }

    // Same-page anchors: smooth, with the nav offset. Cross-page links are left to the router.
    document.addEventListener(
      'click',
      (e) => {
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey
        )
          return;
        const link = (e.target as Element).closest<HTMLAnchorElement>('a[href*="#"]');
        if (!link) return;
        const url = new URL(link.href, location.href);
        if (url.pathname !== location.pathname || !url.hash) return;
        const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (!target) return;
        e.preventDefault();
        history.pushState(null, '', url.hash);
        scrollToTarget(target);
        if (target.id === 'main') target.focus({ preventScroll: true });
      },
      { signal },
    );

    // Deep link on load (e.g. /#faq): correct the landing for the nav offset.
    if (location.hash) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) requestAnimationFrame(() => scrollToTarget(target, true));
    }

    return () => {
      controller.abort();
      instance?.destroy();
      instance = null;
    };
  },
};
