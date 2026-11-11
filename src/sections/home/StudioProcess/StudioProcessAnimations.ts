import { gsap, prefersReducedMotion } from '@/lib/animations';

export interface StudioProcessAnimationParams {
  section: HTMLElement;
  headerContainer: HTMLElement | null;
  eyebrow: HTMLElement | null;
  headlineLines: NodeListOf<HTMLElement> | HTMLElement[];
  supportingText: HTMLElement | null;
  stageItems: NodeListOf<HTMLElement> | HTMLElement[];
  onStageChange?: (index: number) => void;
}

export function initStudioProcessAnimations({
  section,
  headerContainer,
  eyebrow,
  headlineLines,
  supportingText,
  stageItems,
  onStageChange,
}: StudioProcessAnimationParams): () => void {
  if (typeof window === 'undefined') return () => {};

  const ctx = gsap.context(() => {
    const isReduced = prefersReducedMotion();

    if (isReduced) {
      if (eyebrow) gsap.set(eyebrow, { opacity: 1, y: 0 });
      if (headlineLines.length) gsap.set(headlineLines, { opacity: 1, y: 0 });
      if (supportingText) gsap.set(supportingText, { opacity: 1, y: 0 });
      if (stageItems.length) gsap.set(stageItems, { opacity: 1, y: 0 });
      return;
    }

    // 1. Editorial Header Reveal (Staggered Line Mask)
    const headerTrigger = headerContainer || section;
    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: headerTrigger,
        start: 'top 80%',
        end: 'top 30%',
        toggleActions: 'play none none reverse',
      },
    });

    if (eyebrow) {
      headerTl.fromTo(
        eyebrow,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }

    if (headlineLines.length) {
      headerTl.fromTo(
        headlineLines,
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.12,
        },
        '-=0.3'
      );
    }

    if (supportingText) {
      headerTl.fromTo(
        supportingText,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        '-=0.4'
      );
    }

    // 2. Stage-by-Stage ScrollTriggers & Stage Activation
    const mm = gsap.matchMedia();

    // Desktop: Update active visual blueprint as stages cross center
    mm.add('(min-width: 1024px)', () => {
      Array.from(stageItems).forEach((item, index) => {
        // Individual entrance
        gsap.fromTo(
          item,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Active state sync on forward and reverse scroll
        if (onStageChange) {
          gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: 'top center+=50',
              end: 'bottom center-=50',
              onEnter: () => onStageChange(index),
              onEnterBack: () => onStageChange(index),
            },
          });
        }
      });
    });

    // Mobile: Natural vertical card entrances
    mm.add('(max-width: 1023px)', () => {
      Array.from(stageItems).forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    });
  }, section);

  return () => ctx.revert();
}

