import { useRef } from 'react';
import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { useGsapContext } from '@/hooks/useGsapContext';
import { animateBrandStatement } from './BrandStatementAnimations';

export function BrandStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const greenHighlightRef = useRef<HTMLSpanElement>(null);
  const supportingTextRef = useRef<HTMLParagraphElement>(null);
  const microcopyRef = useRef<HTMLDivElement>(null);
  const gridLinesRef = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    if (!sectionRef.current) return;

    const headlineLines = headlineRef.current?.querySelectorAll<HTMLElement>('.brand-headline-line') || [];

    const cleanup = animateBrandStatement({
      section: sectionRef.current,
      eyebrow: eyebrowRef.current,
      headlineLines,
      greenHighlight: greenHighlightRef.current,
      supportingText: supportingTextRef.current,
      microcopy: microcopyRef.current,
      gridLines: gridLinesRef.current,
    });

    return cleanup;
  }, sectionRef);

  return (
    <section
      ref={sectionRef}
      id="brand-statement"
      className="relative w-full bg-brand-obsidian pt-20 sm:pt-28 laptop:pt-32 pb-14 sm:pb-16 laptop:pb-20 overflow-hidden border-t border-brand-border-subtle"
    >
      {/* 1. Fine Architectural Grid Background */}
      <div
        ref={gridLinesRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-10 transition-opacity duration-1000"
        style={{
          backgroundImage:
            'linear-gradient(to right, #171A18 1px, transparent 1px), linear-gradient(to bottom, #171A18 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* 2. Atmospheric Radial Glow Accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -left-48 z-0 h-[500px] w-[500px] rounded-full bg-brand-neon/5 blur-[160px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 right-0 z-0 h-[400px] w-[400px] rounded-full bg-brand-graphite/30 blur-[120px]"
      />

      <MainContainer size="default" className="relative z-content">
        {/* Top Architectural Annotation Rule */}
        <div className="mb-12 sm:mb-16 flex flex-wrap items-center justify-between gap-4 border-b border-brand-border pb-6 font-mono text-xs tracking-widest text-brand-muted">
          <div ref={eyebrowRef} className="overflow-hidden">
            <EyebrowLabel indicator index="02" className="text-brand-neon font-bold">
              OUR PHILOSOPHY
            </EyebrowLabel>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline-block text-brand-muted/70">
              PHILOSOPHY // 02.0
            </span>
            <span className="text-brand-neon/90 font-medium">
              EST. 2026 // STUDIO CORE
            </span>
          </div>
        </div>

        {/* Monumental Editorial Headline */}
        <div className="max-w-6xl min-w-0 w-full">
          <h2
            ref={headlineRef}
            className="font-display font-extrabold tracking-tighter text-brand-white leading-[0.92] text-[clamp(1.75rem,6.8vw,6.5rem)] min-w-0 w-full break-words"
          >
            <div className="overflow-hidden mb-1 sm:mb-2">
              <span className="inline-block brand-headline-line pr-2">
                WE DON'T JUST
              </span>
            </div>
            <div className="overflow-hidden mb-1 sm:mb-2">
              <span className="inline-block brand-headline-line pr-2">
                BUILD WEBSITES.
              </span>
            </div>
            <div className="overflow-hidden mb-1 sm:mb-2">
              <span className="inline-block brand-headline-line pr-2">
                WE <span className="text-brand-neon">ENGINEER</span>
              </span>
            </div>
            <div className="overflow-hidden">
              <span
                ref={greenHighlightRef}
                className="inline-block brand-headline-line text-brand-neon pr-2"
              >
                DIGITAL IMPACT.
              </span>
            </div>
          </h2>
        </div>

        {/* Lower Editorial Split: Supporting Statement & Studio Coordinates */}
        <div className="mt-14 sm:mt-20 pt-10 border-t border-brand-border/60 grid grid-cols-1 laptop:grid-cols-12 gap-10 laptop:gap-8 items-start">
          {/* Left Column: Supporting Paragraph */}
          <div className="laptop:col-span-7">
            <p
              ref={supportingTextRef}
              className="font-body text-xl sm:text-2xl laptop:text-[1.75rem] font-light text-brand-muted leading-relaxed"
            >
              "We bring design, technology and creative engineering together to transform ambitious
              ideas into extraordinary digital experiences."
            </p>
          </div>

          {/* Right Column: Technical Microcopy & Architecture Badges */}
          <div ref={microcopyRef} className="laptop:col-span-5 flex flex-col gap-6 laptop:pl-10">
            <div className="space-y-3 font-mono text-xs tracking-wider uppercase">
              <div className="flex items-center gap-3 text-brand-white font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-neon" />
                <span>INDEPENDENT BY DESIGN.</span>
              </div>
              <div className="flex items-center gap-3 text-brand-white font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-neon" />
                <span>ENGINEERED TO MAKE AN IMPACT.</span>
              </div>
            </div>

            {/* Architectural Data Metadata Card */}
            <div className="p-5 rounded-none border border-brand-border bg-brand-surface/70 backdrop-blur-sm font-mono text-xs space-y-2.5 text-brand-muted">
              <div className="flex items-center justify-between border-b border-brand-border/50 pb-2">
                <span className="text-brand-muted/70">METHODOLOGY</span>
                <span className="text-brand-white font-medium">PRECISION TECHNOLOGY</span>
              </div>
              <div className="flex items-center justify-between border-b border-brand-border/50 pb-2">
                <span className="text-brand-muted/70">DISCIPLINE</span>
                <span className="text-brand-white font-medium">EDITORIAL BRUTALISM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-muted/70">STATUS</span>
                <span className="text-brand-neon flex items-center gap-2 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-neon animate-pulse" />
                  ACTIVE PRODUCTION
                </span>
              </div>
            </div>
          </div>
        </div>
      </MainContainer>
    </section>
  );
}
