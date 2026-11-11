import { gsap, prefersReducedMotion } from '@/lib/animations';

export interface ContactAnimationParams {
  section: HTMLElement;
  headerContainer: HTMLElement | null;
  eyebrow: HTMLElement | null;
  headlineLines: NodeListOf<HTMLElement> | HTMLElement[];
  supportingText: HTMLElement | null;
  sidebar: HTMLElement | null;
  formContainer: HTMLElement | null;
  manifesto: HTMLElement | null;
}

export function initContactAnimations({
  section,
  headerContainer,
  eyebrow,
  headlineLines,
  supportingText,
  sidebar,
  formContainer,
  manifesto,
}: ContactAnimationParams): () => void {
  if (typeof window === 'undefined') return () => {};

  const ctx = gsap.context(() => {
    const isReduced = prefersReducedMotion();

    if (isReduced) {
      if (eyebrow) gsap.set(eyebrow, { opacity: 1, y: 0 });
      if (headlineLines.length) gsap.set(headlineLines, { opacity: 1, y: 0 });
      if (supportingText) gsap.set(supportingText, { opacity: 1, y: 0 });
      if (sidebar) gsap.set(sidebar, { opacity: 1, y: 0 });
      if (formContainer) gsap.set(formContainer, { opacity: 1, y: 0 });
      if (manifesto) gsap.set(manifesto, { opacity: 1, y: 0 });
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

    // 2. Main Content Split Layout Reveal
    if (sidebar) {
      gsap.fromTo(
        sidebar,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sidebar,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    if (formContainer) {
      gsap.fromTo(
        formContainer,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: formContainer,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // 3. Manifesto Closing Statement Reveal
    if (manifesto) {
      gsap.fromTo(
        manifesto,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: manifesto,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }, section);

  return () => ctx.revert();
}

