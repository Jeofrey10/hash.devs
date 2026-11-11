import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';

export interface RevealOptions {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
  yOffset?: number;
  threshold?: number;
  trigger?: Element | string;
  start?: string;
  markers?: boolean;
}

/**
 * Clean Fade Reveal Animation
 */
export function fadeReveal(
  target: gsap.DOMTarget,
  options: RevealOptions = {}
): gsap.core.Tween | null {
  if (prefersReducedMotion()) {
    gsap.set(target, { opacity: 1, visibility: 'visible' });
    return null;
  }

  const { duration = 0.8, delay = 0, ease = 'power3.out' } = options;

  return gsap.fromTo(
    target,
    { opacity: 0 },
    {
      opacity: 1,
      duration,
      delay,
      ease,
      lazy: true,
    }
  );
}

/**
 * Vertical Text Reveal Animation (Translates up from a masked container with slight skew)
 */
export function verticalTextReveal(
  target: gsap.DOMTarget,
  options: RevealOptions = {}
): gsap.core.Tween | null {
  if (prefersReducedMotion()) {
    gsap.set(target, { opacity: 1, y: 0, skewY: 0 });
    return null;
  }

  const { duration = 1.0, delay = 0, ease = 'power4.out', yOffset = 40 } = options;

  return gsap.fromTo(
    target,
    {
      opacity: 0,
      y: yOffset,
      skewY: 2,
    },
    {
      opacity: 1,
      y: 0,
      skewY: 0,
      duration,
      delay,
      ease,
      lazy: true,
    }
  );
}

/**
 * Mask Reveal Animation (Uses CSS clip-path inset to reveal contents cleanly)
 */
export function maskReveal(
  target: gsap.DOMTarget,
  options: RevealOptions = {}
): gsap.core.Tween | null {
  if (prefersReducedMotion()) {
    gsap.set(target, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 });
    return null;
  }

  const { duration = 1.2, delay = 0, ease = 'power4.inOut' } = options;

  return gsap.fromTo(
    target,
    {
      clipPath: 'inset(0% 100% 0% 0%)',
      opacity: 0.8,
    },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
      duration,
      delay,
      ease,
    }
  );
}

/**
 * Stagger Reveal Animation for lists, navigation links, or grids
 */
export function staggerReveal(
  targets: gsap.DOMTarget,
  options: RevealOptions = {}
): gsap.core.Tween | null {
  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 });
    return null;
  }

  const { duration = 0.8, delay = 0, ease = 'power3.out', stagger = 0.08, yOffset = 24 } = options;

  return gsap.fromTo(
    targets,
    {
      opacity: 0,
      y: yOffset,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease,
      stagger,
    }
  );
}

/**
 * Image Clip-Path Expansion Reveal (Editorial curtain open effect)
 */
export function clipPathReveal(
  target: gsap.DOMTarget,
  options: RevealOptions = {}
): gsap.core.Tween | null {
  if (prefersReducedMotion()) {
    gsap.set(target, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', scale: 1 });
    return null;
  }

  const { duration = 1.4, delay = 0, ease = 'expo.out' } = options;

  return gsap.fromTo(
    target,
    {
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      scale: 1.15,
    },
    {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      scale: 1,
      duration,
      delay,
      ease,
    }
  );
}

/**
 * ScrollTrigger-bound Reveal Helper
 */
export function scrollTriggerReveal(
  target: HTMLElement | string,
  animationCallback: (trigger: ScrollTrigger) => void,
  triggerElement?: HTMLElement | string,
  start = 'top 85%'
): ScrollTrigger | null {
  if (typeof window === 'undefined' || prefersReducedMotion()) {
    return null;
  }

  const trigger = triggerElement || target;

  return ScrollTrigger.create({
    trigger,
    start,
    once: true,
    onEnter: (self) => {
      animationCallback(self);
    },
  });
}

