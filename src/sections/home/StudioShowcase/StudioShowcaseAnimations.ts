import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/animations';

export interface StudioShowcaseAnimationParams {
  section: HTMLElement;
  slats: NodeListOf<HTMLElement> | HTMLElement[];
  eyebrow: HTMLElement | null;
  headlineLines: NodeListOf<HTMLElement> | HTMLElement[];
  supportingText: HTMLElement | null;
  panelsGrid: HTMLElement | null;
  panels: NodeListOf<HTMLElement> | HTMLElement[];
}

export function animateStudioShowcase({
  section,
  slats,
  eyebrow,
  headlineLines,
  supportingText,
  panelsGrid,
  panels,
}: StudioShowcaseAnimationParams): () => void {
  if (typeof window === 'undefined' || prefersReducedMotion()) {
    // Reduced motion fallback: slats already opened, all content immediately visible
    if (slats.length) gsap.set(slats, { xPercent: 105 });
    if (eyebrow) gsap.set(eyebrow, { opacity: 1, y: 0 });
    if (headlineLines.length) gsap.set(headlineLines, { opacity: 1, y: 0, skewY: 0 });
    if (supportingText) gsap.set(supportingText, { opacity: 1, y: 0 });
    if (panelsGrid) gsap.set(panelsGrid, { opacity: 1, y: 0 });
    if (panels.length) gsap.set(panels, { opacity: 1, y: 0 });
    return () => {};
  }

  // 1. Initial states: shutter slats completely cover the showcase entrance
  if (slats.length) {
    gsap.set(slats, { xPercent: 0 });
  }

  // Keep underlying showcase header completely stationary during shutter movement
  if (eyebrow) gsap.set(eyebrow, { opacity: 1, y: 0 });
  if (headlineLines.length) gsap.set(headlineLines, { opacity: 1, y: 0, skewY: 0 });
  if (supportingText) gsap.set(supportingText, { opacity: 1, y: 0 });

  // Capability panels remain completely concealed until shutter clears and user scrolls to grid
  if (panelsGrid) gsap.set(panelsGrid, { opacity: 0, y: 35 });
  if (panels.length) gsap.set(panels, { opacity: 0, y: 35 });

  // 2. Mechanical Shutter Louvers Timeline
  // Triggers as the user scrolls out of Brand Statement into Studio Showcase
  const slatTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 55%',
      end: 'top 15%',
      toggleActions: 'play none none reverse',
    },
  });

  if (slats.length) {
    const slatsArray = Array.from(slats);
    slatsArray.forEach((slat, index) => {
      const exitDir = index % 2 === 0 ? 105 : -105;
      slatTl.to(
        slat,
        {
          xPercent: exitDir,
          duration: 0.9,
          ease: 'power3.inOut',
        },
        index * 0.12
      );
    });
  }

  // 3. Capability Panels Staggered Entrance
  // Triggers independently once the user scrolls down towards the capabilities grid
  let panelsTl: gsap.core.Timeline | null = null;
  const panelsTriggerTarget = panelsGrid || (panels.length ? panels[0] : null);

  if (panelsTriggerTarget) {
    panelsTl = gsap.timeline({
      scrollTrigger: {
        trigger: panelsTriggerTarget,
        start: 'top 80%',
        end: 'top 25%',
        toggleActions: 'play none none reverse',
      },
    });

    if (panelsGrid) {
      panelsTl.to(panelsGrid, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    }

    if (panels.length) {
      panelsTl.to(
        panels,
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
        },
        panelsGrid ? '-=0.4' : 0
      );
    }
  }

  return () => {
    slatTl.kill();
    if (panelsTl) panelsTl.kill();
    ScrollTrigger.getAll().forEach((st) => {
      if (
        st.trigger === section ||
        (panelsTriggerTarget && st.trigger === panelsTriggerTarget)
      ) {
        st.kill();
      }
    });
  };
}

