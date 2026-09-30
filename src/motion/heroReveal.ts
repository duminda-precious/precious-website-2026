/**
 * Two-step hero (Claude Design; replaces the M1 scroll sequence).
 *   Rest → reveal: the first downward scroll (wheel, touch, keys) at the very top is
 *   held; the title dissolves word by word through --pixel-dissolve, the veil lifts
 *   and the reel sharpens (CSS on data-revealed), the sound toggle appears and the
 *   news stack hides. The page is locked for --dur-hero-lock, then scrolls normally.
 *   Reveal → rest: scrolling up anywhere inside the hero glides back to the top
 *   (--dur-hero-return) and the title resolves back in through --pixel-resolve.
 *   Scroll: over the first --hero-inset-scroll px the reel shrinks from full bleed into
 *   the hero padding (nav height on top, gutter on the sides and bottom) with
 *   --radius-md corners; it grows back on the way up. The reel plays only in view.
 *   Title: hovering a word plays the pixel glitch in the text colour; a random word
 *   glitches every --dur-glitch-min + random(--dur-glitch-range) while at rest.
 * Anchor jumps (precious:jump from pageTransition.ts) switch state instantly.
 * The h1 keeps an aria-label, so screen readers get the title in both states.
 * Tokens: --pixel-dissolve, --pixel-resolve, --pixel-glitch, --dur-pixel-frame-in/-glitch,
 *         --dur-hero-word-stagger, --dur-pixel-word-stagger, --dur-hero-lock,
 *         --dur-hero-return, --dur-glitch-min/-range, --hero-inset-scroll, --nav-height,
 *         --radius-md, --motion-tempo.
 * Reduced motion: same two states, switched instantly (no pixels, no glides).
 */
import type { MotionModule } from './index';
import { prefersReducedMotion } from './reducedMotion';
import { length, list, ms, num, smoothstep } from './tokens';
import { pixelRunner, wrapWords, type PxWord } from './pixelWords';

export const heroReveal: MotionModule = {
  name: 'heroReveal',
  init(root) {
    const hero = root.querySelector<HTMLElement>('[data-hero]');
    const title = hero?.querySelector<HTMLElement>('[data-hero-title]');
    if (!hero || !title) return;
    const reel = hero.querySelector<HTMLElement>('[data-hero-reel]');
    const video = hero.querySelector<HTMLVideoElement>('[data-hero-video]');
    const sound = hero.querySelector<HTMLElement>('[data-hero-sound]');
    const html = root.documentElement;
    const RM = prefersReducedMotion();
    const controller = new AbortController();
    const { signal } = controller;
    const runner = pixelRunner();
    const original = title.innerHTML;
    title.setAttribute('aria-label', title.textContent?.replace(/\s+/g, ' ').trim() ?? '');
    let words: PxWord[] = [];
    let revealed = false;
    let lock = false;
    let idleT = 0;
    const timers = new Set<number>();
    const later = (fn: () => void, t: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, t);
      timers.add(id);
    };
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
    }

    // Reel inset on scroll + play only in view
    const gutter = () =>
      parseFloat(getComputedStyle(hero.querySelector('.hero__center') ?? hero).paddingLeft) || 16;
    const update = () => {
      if (reel) {
        const e = smoothstep(0, 1, window.scrollY / (num('--hero-inset-scroll') || 320));
        const g = gutter() * e;
        reel.style.inset = `${length('--nav-height') * e}px ${g}px ${g}px`;
        reel.style.borderRadius = `${length('--radius-md') * e}px`;
      }
      if (video) {
        const on = hero.getBoundingClientRect().bottom > 0;
        if (on && video.paused) video.play().catch(() => {});
        if (!on && !video.paused) video.pause();
      }
    };
    let raf = 0;
    const onScroll = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          update();
        });
    };
    window.addEventListener('scroll', onScroll, { passive: true, signal });
    window.addEventListener('resize', onScroll, { signal });
    update();

    const setState = (on: boolean, instant = false) => {
      lock = true;
      revealed = on;
      hero.toggleAttribute('data-revealed', on);
      sound?.setAttribute('tabindex', on ? '0' : '-1');
      const quick = instant || RM || !words.length;
      if (on) {
        const OUT = list('--pixel-dissolve');
        const frame = ms('--dur-pixel-frame-glitch');
        const stagger = ms('--dur-hero-word-stagger');
        words.forEach((w, i) => {
          if (quick) return w.classList.add('pxhide');
          runner.run(w, OUT, frame, i * stagger);
          later(() => w.classList.add('pxhide'), i * stagger + (OUT.length - 0.4) * frame);
        });
      } else {
        const IN = list('--pixel-resolve');
        words.forEach((w, i) => {
          if (quick) return w.classList.remove('pxhide');
          w.classList.add('pxhide');
          runner.run(w, IN, ms('--dur-pixel-frame-in'), i * ms('--dur-pixel-word-stagger'));
        });
      }
      if (quick) lock = false;
      else later(() => (lock = false), ms('--dur-hero-lock', true));
    };

    const interactive = (t: EventTarget | null) =>
      t instanceof Element && !!t.closest('a, button, input, textarea, select, [contenteditable]');
    const intent = (dir: number, ev?: Event) => {
      if (html.classList.contains('is-scroll-locked')) return;
      const stop = () => ev?.cancelable && ev.preventDefault();
      if (lock) return stop();
      if (!revealed && dir > 0 && window.scrollY <= 2) {
        stop();
        setState(true);
      } else if (revealed && dir < 0 && window.scrollY < hero.offsetHeight) {
        stop();
        lock = true;
        const away = window.scrollY > 0;
        window.scrollTo({ top: 0, behavior: RM ? 'instant' : 'smooth' });
        later(() => setState(false), away && !RM ? ms('--dur-hero-return', true) : 0);
      }
    };
    let ty = 0;
    window.addEventListener('wheel', (e) => intent(Math.sign(e.deltaY), e), { passive: false, signal });
    window.addEventListener('touchstart', (e) => (ty = e.touches[0]?.clientY ?? 0), { passive: true, signal });
    window.addEventListener(
      'touchmove',
      (e) => {
        const dy = ty - (e.touches[0]?.clientY ?? ty);
        if (Math.abs(dy) > 8) intent(Math.sign(dy), e);
      },
      { passive: false, signal },
    );
    window.addEventListener(
      'keydown',
      (e) => {
        if (interactive(e.target) && e.key === ' ') return;
        if (['ArrowDown', 'PageDown', ' '].includes(e.key)) intent(1, e);
        if (['ArrowUp', 'PageUp', 'Home'].includes(e.key)) intent(-1, e);
      },
      { signal },
    );
    document.addEventListener(
      'precious:jump',
      (e) => {
        const id = (e as CustomEvent<{ id: string }>).detail?.id;
        const toHero = !id || id === 'hero';
        if (!toHero && !revealed) setState(true, true);
        if (toHero && revealed) setState(false, true);
      },
      { signal },
    );

    // Title words: hover glitch + idle glitch (after fonts, so canvases match)
    const idle = () => {
      idleT = window.setTimeout(
        () => {
          const pick = words[Math.floor(Math.random() * words.length)];
          if (!revealed && !lock && pick && !document.hidden)
            runner.run(pick, list('--pixel-glitch'), ms('--dur-pixel-frame-glitch'));
          idle();
        },
        ms('--dur-glitch-min') + Math.random() * ms('--dur-glitch-range'),
      );
    };
    let alive = true;
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (!alive) return;
      words = window.HTMLCanvasElement ? wrapWords(title) : [];
      words.forEach((w) =>
        w.addEventListener(
          'pointerenter',
          () => {
            if (revealed || lock || RM) return;
            runner.run(w, list('--pixel-glitch'), ms('--dur-pixel-frame-in'));
          },
          { signal },
        ),
      );
      // Arriving mid-page (reload, back button): start revealed.
      if (window.scrollY > 2) setState(true, true);
      if (!RM) idle();
    });

    return () => {
      alive = false;
      controller.abort();
      cancelAnimationFrame(raf);
      window.clearTimeout(idleT);
      timers.forEach((t) => window.clearTimeout(t));
      runner.stop();
      title.innerHTML = original;
      hero.removeAttribute('data-revealed');
      if (reel) reel.removeAttribute('style');
    };
  },
};
