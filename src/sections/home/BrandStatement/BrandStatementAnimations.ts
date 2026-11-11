import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/animations';

export interface BrandStatementAnimationParams {
  section: HTMLElement;
  eyebrow: HTMLElement | null;
  headlineLines: NodeListOf<HTMLElement> | HTMLElement[];
  greenHighlight: HTMLElement | null;
  supportingText: HTMLElement | null;
  microcopy: HTMLElement | null;
  gridLines: HTMLElement | null;
}

export function animateBrandStatement({
  section,
  eyebrow,
  headlineLines,
  greenHighlight,
  supportingText,
  microcopy,
  gridLines,
}: BrandStatementAnimationParams): () => void {
  if (typeof window === 'undefined' || prefersReducedMotion()) {
    // Immediate fallback for reduced motion or SSR
    if (eyebrow) gsap.set(eyebrow, { opacity: 1, y: 0 });
    if (headlineLines.length) gsap.set(headlineLines, { opacity: 1, yPercent: 0, skewY: 0 });
    if (supportingText) gsap.set(supportingText, { opacity: 1, y: 0 });
    if (microcopy) gsap.set(microcopy, { opacity: 1, y: 0 });
    return () => {};
  }

  // Initial GSAP states before scroll trigger
  if (eyebrow) gsap.set(eyebrow, { yPercent: 100, opacity: 0 });
  if (headlineLines.length) gsap.set(headlineLines, { yPercent: 120, skewY: 2.5, opacity: 0 });
  if (supportingText) gsap.set(supportingText, { y: 35, opacity: 0 });
  if (microcopy) gsap.set(microcopy, { y: 30, opacity: 0 });
  if (gridLines) gsap.set(gridLines, { opacity: 0.05 });

  // Master ScrollTrigger timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 75%',
      end: 'top 20%',
      toggleActions: 'play none none reverse',
    },
  });

  // 1. Eyebrow Reveal
  if (eyebrow) {
    tl.to(eyebrow, {
      yPercent: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
    });
  }

  // 2. Headline Staggered Reveal
  if (headlineLines.length) {
    tl.to(
      headlineLines,
      {
        yPercent: 0,
        skewY: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.12,
        ease: 'power4.out',
      },
      '-=0.5'
    );
  }

  // 3. Neon Highlight Glow Bloom
  if (greenHighlight) {
    tl.fromTo(
      greenHighlight,
      { filter: 'drop-shadow(0 0 0px rgba(53,232,91,0))' },
      {
        filter: 'drop-shadow(0 0 16px rgba(53,232,91,0.35))',
        duration: 1.0,
        ease: 'power2.out',
      },
      '-=0.6'
    );
  }

  // 4. Supporting Text & Microcopy
  if (supportingText) {
    tl.to(
      supportingText,
      {
        y: 0,
        opacity: 1,
        duration: 1.0,
        ease: 'power3.out',
      },
      '-=0.6'
    );
  }

  if (microcopy) {
    tl.to(
      microcopy,
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
      },
      '-=0.7'
    );
  }

  if (gridLines) {
    tl.to(
      gridLines,
      {
        opacity: 0.15,
        duration: 1.2,
        ease: 'sine.out',
      },
      0
    );
  }

  return () => {
    tl.kill();
    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger === section) st.kill();
    });
  };
}

