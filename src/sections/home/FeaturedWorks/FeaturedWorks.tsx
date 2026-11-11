import { useEffect, useRef } from 'react';
import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { FEATURED_PROJECTS } from './projects';
import { FeaturedProject } from './FeaturedProject';
import { initFeaturedWorksAnimations } from './FeaturedWorksAnimations';

export function FeaturedWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const supportingTextRef = useRef<HTMLParagraphElement>(null);
  const metaBarRef = useRef<HTMLDivElement>(null);
  const galleryContainerRef = useRef<HTMLDivElement>(null);
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const headlineLines = headlineRef.current
      ? headlineRef.current.querySelectorAll<HTMLElement>('.works-headline-line')
      : [];

    const projectCards = section.querySelectorAll<HTMLElement>('article');

    const cleanup = initFeaturedWorksAnimations({
      section,
      headerContainer: headerContainerRef.current,
      eyebrow: eyebrowRef.current,
      headlineLines,
      supportingText: supportingTextRef.current,
      metaBar: metaBarRef.current,
      galleryContainer: galleryContainerRef.current,
      galleryTrack: galleryTrackRef.current,
      projectCards,
      progressBar: progressBarRef.current,
      counterEl: counterRef.current,
    });

    return () => cleanup();
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative w-full bg-brand-obsidian pt-24 laptop:pt-36 pb-28 laptop:pb-36 overflow-hidden"
    >
      {/* Editorial Section Header */}
      <MainContainer>
        <div
          ref={headerContainerRef}
          className="mb-14 sm:mb-20 flex flex-col laptop:flex-row laptop:items-end justify-between gap-10 border-b border-brand-border/80 pb-12 sm:pb-16"
        >
          {/* Eyebrow & Monumental Syne Headline */}
          <div className="w-full laptop:w-auto laptop:flex-1 max-w-4xl wide:max-w-5xl">
            <div ref={eyebrowRef} className="mb-6 overflow-hidden">
              <EyebrowLabel indicator index="04" className="text-brand-neon font-bold">
                SELECTED WORKS / STUDIO PORTFOLIO
              </EyebrowLabel>
            </div>

            <h2
              ref={headlineRef}
              className="font-display font-extrabold tracking-tighter text-brand-white leading-[0.92] text-[clamp(2.2rem,7vw,6.25rem)] break-words pr-2"
            >
              <div className="overflow-hidden mb-1 sm:mb-2">
                <span className="inline-block works-headline-line">
                  WE MAKE
                </span>
              </div>
              <div className="overflow-hidden mb-1 sm:mb-2">
                <span className="inline-block works-headline-line text-brand-neon">
                  DIGITAL
                </span>
              </div>
              <div className="overflow-hidden">
                <span className="inline-block works-headline-line text-brand-white">
                  MATTER.
                </span>
              </div>
            </h2>
          </div>

          {/* Supporting Description & Project Metadata */}
          <div className="max-w-xs laptop:max-w-sm shrink-0 laptop:pb-2">
            <p
              ref={supportingTextRef}
              className="font-body text-base sm:text-lg laptop:text-xl font-light text-brand-muted leading-relaxed"
            >
              "We transform complex commercial ambitions and intelligent technologies into distinctive,
              high-performance digital experiences."
            </p>

            <div
              ref={metaBarRef}
              className="mt-6 pt-6 border-t border-brand-border/60 flex items-center justify-between font-mono text-xs text-brand-muted"
            >
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-neon" />
                <span>ARCHIVE // 2024 — 2026</span>
              </div>
              <span className="text-brand-white font-bold">[ 04 RELEASES ]</span>
            </div>
          </div>
        </div>
      </MainContainer>

      {/* Project Gallery Container (Horizontal Pinned on Desktop, Vertical Stack on Mobile) */}
      <div
        ref={galleryContainerRef}
        className="relative w-full laptop:h-screen laptop:min-h-[100svh] laptop:flex laptop:flex-col laptop:justify-between py-6 laptop:py-8 overflow-hidden"
      >
        {/* Pinned Scrubber Header (Desktop Only) */}
        <div className="hidden laptop:block w-full border-y border-brand-border/40 bg-brand-surface/20 backdrop-blur-sm py-3 px-8 laptop:px-16 wide:px-24">
          <div className="flex items-center justify-between font-mono text-xs text-brand-muted">
            <div className="flex items-center gap-4">
              <span className="text-brand-white font-bold tracking-wider">PROJECT INDEX:</span>
              <span ref={counterRef} className="text-brand-neon font-bold tracking-widest text-sm">
                01 / 04
              </span>
            </div>

            {/* Kinetic Hairline Scrubber Track */}
            <div className="flex-1 max-w-md mx-8 h-[2px] bg-brand-border/80 relative rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="absolute top-0 left-0 bottom-0 w-full bg-brand-neon rounded-full"
                style={{ transform: 'scaleX(0.05)', transformOrigin: 'left center' }}
              />
            </div>

            <div className="flex items-center gap-6 text-[11px]">
              <span className="hidden desktop:inline-block">INTERACTION: SCROLL TO EXPLORE</span>
              <span className="text-brand-white">HORIZONTAL FLOW ⟶</span>
            </div>
          </div>
        </div>

        {/* Center Cards Track */}
        <div className="flex-1 flex items-center w-full overflow-hidden my-auto py-4">
          <div
            ref={galleryTrackRef}
            className="flex flex-col laptop:flex-row items-stretch gap-10 sm:gap-14 laptop:gap-10 desktop:gap-12 px-4 sm:px-8 laptop:px-16 wide:px-24 w-full laptop:w-max will-change-transform"
          >
            {FEATURED_PROJECTS.map((project) => (
              <div
                key={project.id}
                className="w-full laptop:w-[74vw] desktop:w-[68vw] wide:w-[62vw] max-w-[1140px] shrink-0"
              >
                <FeaturedProject project={project} />
              </div>
            ))}
          </div>
        </div>

        {/* Pinned Bottom Telemetry Line on Desktop */}
        <div className="hidden laptop:flex items-center justify-between border-t border-brand-border/40 pt-3 px-8 laptop:px-16 wide:px-24 font-mono text-xs text-brand-muted">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-neon" />
            <span>PORTFOLIO ARCHIVE: 04 COMMISSIONS LIVE</span>
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <span className="hidden sm:inline-block">ARCHITECTURE: THREE.JS // GSAP // REACT</span>
            <span className="text-brand-neon font-bold">HASH.DEVS // CASE STUDIES</span>
          </div>
        </div>
      </div>

      {/* Bottom Technical Status Bar (Mobile & Natural Flow) */}
      <div className="laptop:hidden">
        <MainContainer>
          <div className="mt-16 sm:mt-24 pt-8 border-t border-brand-border/60 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-brand-muted">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-neon" />
              <span>PORTFOLIO ARCHIVE: 04 COMMISSIONS LIVE</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-brand-neon font-bold">HASH.DEVS // CASE STUDIES</span>
            </div>
          </div>
        </MainContainer>
      </div>
    </section>
  );
}
