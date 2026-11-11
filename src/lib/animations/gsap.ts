import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Register GSAP plugins safely (idempotent in SSR/client)
 */
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Standard studio animation easings mapped to brand motion identity
 */
export const EASINGS = {
  expoOut: 'expo.out',
  expoInOut: 'expo.inOut',
  power3Out: 'power3.out',
  power4Out: 'power4.out',
  cinematic: 'power4.out',
  smooth: 'power2.out',
} as const;

/**
 * Checks whether user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Safely refreshes ScrollTrigger after DOM or layout changes
 */
export const refreshScrollTrigger = (): void => {
  if (typeof window !== 'undefined') {
    ScrollTrigger.refresh();
  }
};

export { gsap, ScrollTrigger };

