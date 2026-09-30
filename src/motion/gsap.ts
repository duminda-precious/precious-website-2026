/**
 * GSAP setup: registers plugins once and names the token easings so motion
 * modules can use `ease: 'standard'` etc. Values come from tokens.css.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { bezier, duration } from './tokens';

let ready = false;

export function setupGsap() {
  if (ready) return gsap;
  ready = true;
  gsap.registerPlugin(ScrollTrigger, CustomEase);

  const curve = (b: [number, number, number, number]) =>
    `M0,0 C${b[0]},${b[1]} ${b[2]},${b[3]} 1,1`;
  CustomEase.create('standard', curve(bezier('--ease-standard')));
  CustomEase.create('outExpo', curve(bezier('--ease-out-expo')));

  gsap.defaults({ ease: 'standard', duration: duration('--dur-base') });
  return gsap;
}

export { gsap, ScrollTrigger };
