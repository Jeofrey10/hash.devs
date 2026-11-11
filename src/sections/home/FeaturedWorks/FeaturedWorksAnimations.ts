import { gsap, prefersReducedMotion } from '@/lib/animations';

export interface FeaturedWorksAnimationParams {
  section: HTMLElement;
  headerContainer: HTMLElement | null;
  eyebrow: HTMLElement | null;
  headlineLines: NodeListOf<HTMLElement> | HTMLElement[];
  supportingText: HTMLElement | null;
  metaBar: HTMLElement | null;
  galleryContainer: HTMLElement | null;
  galleryTrack: HTMLElement | null;
  projectCards: NodeListOf<HTMLElement> | HTMLElement[];
  progressBar: HTMLElement | null;
  counterEl: HTMLElement | null;
}

export function initFeaturedWorksAnimations({
  section,
  headerContainer,
  eyebrow,
  headlineLines,
  supportingText,
  metaBar,
  galleryContainer,
  galleryTrack,
  projectCards,
  progressBar,
  counterEl,
}: FeaturedWorksAnimationParams): () => void {
  if (typeof window === 'undefined') return () => {};

  // Clean GSAP Context to allow 100% safe revert on unmount
  const ctx = gsap.context(() => {
    const isReduced = prefersReducedMotion();

    if (isReduced) {
      if (eyebrow) gsap.set(eyebrow, { opacity: 1, y: 0 });
      if (headlineLines.length) gsap.set(headlineLines, { opacity: 1, y: 0 });
      if (supportingText) gsap.set(supportingText, { opacity: 1, y: 0 });
      if (metaBar) gsap.set(metaBar, { opacity: 1, y: 0 });
      if (projectCards.length) gsap.set(projectCards, { opacity: 1, y: 0 });
      if (progressBar) gsap.set(progressBar, { scaleX: 1 });
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

    if (metaBar) {
      headerTl.fromTo(
        metaBar,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      );
    }

    // 2. Responsive Gallery Choreography using matchMedia
    const mm = gsap.matchMedia();

    // DESKTOP: >= 1024px (Smooth Pinned Horizontal Scroll)
    mm.add('(min-width: 1024px)', () => {
      if (!galleryContainer || !galleryTrack) return;

      // Set initial transform
      gsap.set(galleryTrack, { x: 0 });
      if (progressBar) gsap.set(progressBar, { scaleX: 0.05, transformOrigin: 'left center' });

      const calculateScroll = () => {
        return Math.max(0, galleryTrack.scrollWidth - window.innerWidth);
      };

      const horizontalTween = gsap.to(galleryTrack, {
        x: () => -calculateScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: galleryContainer,
          pin: true,
          scrub: 0.85,
          start: 'top top',
          end: () => `+=${calculateScroll()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressBar) {
              gsap.set(progressBar, { scaleX: Math.max(0.05, self.progress) });
            }
            if (counterEl) {
              const activeIndex = Math.min(3, Math.floor(self.progress * 4));
              counterEl.textContent = `0${activeIndex + 1} / 04`;
            }
          },
        },
      });

      return () => {
        horizontalTween.kill();
      };
    });

    // TABLET & MOBILE: < 1024px (Natural Vertical Scroll Stack)
    mm.add('(max-width: 1023px)', () => {
      if (galleryTrack) gsap.set(galleryTrack, { x: 0, clearProps: 'transform' });

      if (projectCards.length) {
        Array.from(projectCards).forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }
    });
  }, section);

  return () => ctx.revert();
}
