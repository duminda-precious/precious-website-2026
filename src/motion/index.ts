/**
 * Motion registry (plan §6.2). Each module exports init(root) → cleanup.
 * Boot runs on astro:page-load (initial load and every client-side navigation);
 * cleanup runs on astro:before-swap, so nothing survives into the next page.
 * The registry also re-initialises everything when reduced motion changes.
 */
import { setupGsap, ScrollTrigger } from './gsap';
import { onReducedMotionChange } from './reducedMotion';
import { lenis } from './lenis';
import { hero } from './hero';
import { soundToggle } from './soundToggle';
import { themeSwitch } from './themeSwitch';
import { marquee } from './marquee';
import { videoInView } from './videoInView';
import { riseIn } from './riseIn';
import { slider } from './slider';
import { disclosure } from './disclosure';
import { pixelHover } from './pixelHover';
import { pixelText } from './pixelText';
import { logoPop } from './logoPop';
import { setupPageTransition } from './pageTransition';

export interface MotionModule {
  name: string;
  /** Set up listeners/animations for this page. Return a cleanup function. */
  init(root: Document): (() => void) | void;
}

/** Order matters: Lenis first so ScrollTriggers see the smooth-scroll proxy. */
const modules: MotionModule[] = [
  lenis,
  hero,
  soundToggle,
  themeSwitch,
  marquee,
  videoInView,
  riseIn,
  slider,
  disclosure,
  pixelHover,
  pixelText,
  logoPop,
];

let cleanups: (() => void)[] = [];
let booted = false;

function log(...args: unknown[]) {
  if (import.meta.env.DEV) console.debug('[motion]', ...args);
}

function init() {
  setupGsap();
  cleanups = modules.flatMap((m) => {
    const cleanup = m.init(document);
    return cleanup ? [cleanup] : [];
  });
  ScrollTrigger.refresh();
  log(
    `init ${modules.map((m) => m.name).join(', ')} · ScrollTriggers: ${ScrollTrigger.getAll().length}`,
  );
}

function teardown() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
  ScrollTrigger.getAll().forEach((t) => t.kill());
  log('cleanup · ScrollTriggers left:', ScrollTrigger.getAll().length);
}

export function bootMotion() {
  if (booted) return;
  booted = true;
  setupPageTransition();
  document.addEventListener('astro:page-load', init);
  document.addEventListener('astro:before-swap', teardown);
  onReducedMotionChange(() => {
    teardown();
    init();
  });
}
