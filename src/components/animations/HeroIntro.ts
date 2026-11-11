import { gsap, prefersReducedMotion } from '@/lib/animations';

export interface HeroIntroElements {
  container: HTMLElement | null;
  eyebrow: HTMLElement | null;
  headlineLines: HTMLElement[] | NodeListOf<HTMLElement>;
  supportingText: HTMLElement | null;
  ctaGroup: HTMLElement | null;
  meta: HTMLElement | null;
}

/**
 * Creates and plays the art-directed cinematic Hero entrance animation sequence
 */
export function playHeroIntro(elements: HeroIntroElements): gsap.core.Timeline | null {
  if (prefersReducedMotion()) {
    // If user prefers reduced motion, immediately apply final visible state
    if (elements.eyebrow) gsap.set(elements.eyebrow, { opacity: 1, y: 0 });
    if (elements.headlineLines) gsap.set(elements.headlineLines, { opacity: 1, y: 0, skewY: 0 });
    if (elements.supportingText) gsap.set(elements.supportingText, { opacity: 1, y: 0 });
    if (elements.ctaGroup) gsap.set(elements.ctaGroup, { opacity: 1, y: 0 });
    if (elements.meta) gsap.set(elements.meta, { opacity: 1, y: 0 });
    return null;
  }

  const { eyebrow, headlineLines, supportingText, ctaGroup, meta } = elements;

  const tl = gsap.timeline({
    defaults: {
      ease: 'power4.out',
    },
    delay: 0.2, // Small breathing pause after page load
  });

  // 1. Eyebrow fades into view from slight negative Y
  if (eyebrow) {
    tl.fromTo(
      eyebrow,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8 }
    );
  }

  // 2. Headline reveals line by line through overflow-hidden masks
  if (headlineLines && headlineLines.length > 0) {
    tl.fromTo(
      headlineLines,
      {
        yPercent: 120,
        skewY: 3,
        opacity: 0,
      },
      {
        yPercent: 0,
        skewY: 0,
        opacity: 1,
        duration: 1.25,
        stagger: 0.12,
        ease: 'power4.out',
      },
      '-=0.4'
    );
  }

  // 3. Supporting text appears smoothly
  if (supportingText) {
    tl.fromTo(
      supportingText,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
      '-=0.7'
    );
  }

  // 4. CTA buttons enter smoothly
  if (ctaGroup) {
    tl.fromTo(
      ctaGroup,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    );
  }

  // 5. Small metadata line reveals at bottom
  if (meta) {
    tl.fromTo(
      meta,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
      '-=0.5'
    );
  }

  return tl;
}

