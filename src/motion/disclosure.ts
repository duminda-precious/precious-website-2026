/**
 * M6 FAQ height animation, in every browser. Takes over the summary click:
 * opening sets [open] then animates the content 0 → auto; closing animates
 * to 0 and then removes [open]. Clicking mid-close reopens from the current
 * height. Reduced motion: native instant toggle.
 */
import { gsap } from './gsap';
import { duration } from './tokens';
import { prefersReducedMotion } from './reducedMotion';
import type { MotionModule } from './index';

export const disclosure: MotionModule = {
  name: 'disclosure',
  init(root) {
    if (prefersReducedMotion()) return;
    const controller = new AbortController();
    const items = Array.from(
      root.querySelectorAll<HTMLDetailsElement>('details[data-motion="disclosure"]'),
    );

    items.forEach((details) => {
      const summary = details.querySelector('summary');
      const content = details.querySelector<HTMLElement>('[data-disclosure-content]');
      if (!summary || !content) return;
      const reset = () => gsap.set(content, { clearProps: 'height' });

      summary.addEventListener(
        'click',
        (e) => {
          e.preventDefault();
          gsap.killTweensOf(content);
          const closing = details.hasAttribute('data-closing');

          if (!details.open || closing) {
            const from = closing ? content.offsetHeight : 0;
            details.removeAttribute('data-closing');
            details.open = true;
            gsap.fromTo(
              content,
              { height: from },
              {
                height: 'auto',
                duration: duration('--dur-base'),
                ease: 'standard',
                onComplete: reset,
              },
            );
          } else {
            details.setAttribute('data-closing', '');
            gsap.fromTo(
              content,
              { height: content.offsetHeight },
              {
                height: 0,
                duration: duration('--dur-base'),
                ease: 'standard',
                onComplete: () => {
                  details.open = false;
                  details.removeAttribute('data-closing');
                  reset();
                },
              },
            );
          }
        },
        { signal: controller.signal },
      );
    });

    return () => {
      controller.abort();
      items.forEach((d) => {
        const c = d.querySelector<HTMLElement>('[data-disclosure-content]');
        if (c) {
          gsap.killTweensOf(c);
          gsap.set(c, { clearProps: 'height' });
        }
        d.removeAttribute('data-closing');
      });
    };
  },
};
