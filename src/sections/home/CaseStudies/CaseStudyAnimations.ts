import { gsap, prefersReducedMotion } from '@/lib/animations';

export function initCaseStudyAnimations(container: HTMLElement): () => void {
  if (typeof window === 'undefined') return () => {};

  const ctx = gsap.context(() => {
    if (prefersReducedMotion()) return;

    // Staggered chapter fade-ins as user scrolls
    const chapters = container.querySelectorAll<HTMLElement>('article');
    if (chapters.length) {
      chapters.forEach((chapter) => {
        gsap.fromTo(
          chapter,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: chapter,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }
  }, container);

  return () => ctx.revert();
}

