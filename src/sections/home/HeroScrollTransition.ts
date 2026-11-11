import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/animations';

export interface SetupHeroScrollOptions {
  triggerElement: HTMLElement;
  contentElement: HTMLElement;
  onScrollProgress: (progress: number) => void;
}

/**
 * Binds the Hero exit scroll transition to GSAP ScrollTrigger
 */
export function setupHeroScrollTransition(options: SetupHeroScrollOptions): ScrollTrigger | null {
  if (typeof window === 'undefined' || prefersReducedMotion()) {
    return null;
  }

  const { triggerElement, contentElement, onScrollProgress } = options;

  const trigger = ScrollTrigger.create({
    trigger: triggerElement,
    start: 'top top',
    end: 'bottom top',
    scrub: 0.8, // Smooth scrub interpolation synchronized with Lenis
    onUpdate: (self) => {
      const progress = self.progress; // 0 to 1
      onScrollProgress(progress);

      // Parallax transform on headline content
      gsap.to(contentElement, {
        y: progress * 160,
        opacity: Math.max(0, 1 - progress * 1.35),
        ease: 'none',
        duration: 0.1,
        overwrite: 'auto',
      });
    },
  });

  return trigger;
}

