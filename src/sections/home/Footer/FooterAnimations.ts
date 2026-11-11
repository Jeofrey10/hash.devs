import { gsap, prefersReducedMotion } from '@/lib/animations';

export interface FooterAnimationParams {
  footerElement: HTMLElement;
  bannerElement: HTMLElement | null;
  wordmarkElement: HTMLElement | null;
}

export function initFooterAnimations({
  footerElement,
  bannerElement,
  wordmarkElement,
}: FooterAnimationParams): () => void {
  if (typeof window === 'undefined') return () => {};

  const ctx = gsap.context(() => {
    if (prefersReducedMotion()) return;

    // Subtle entrance for the collaboration banner
    if (bannerElement) {
      gsap.fromTo(
        bannerElement,
        { opacity: 0.85, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: bannerElement,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Subtle rise for the oversized wordmark
    if (wordmarkElement) {
      gsap.fromTo(
        wordmarkElement,
        { opacity: 0.9, yPercent: 4 },
        {
          opacity: 1,
          yPercent: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: wordmarkElement,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }, footerElement);

  return () => ctx.revert();
}

