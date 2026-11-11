import { useState, useRef, useEffect } from 'react';
import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { CursorDrivenParticleTypography } from '@/components/ui/cursor-driven-particle-typography';
import { PROCESS_STAGES, PROCESS_SECTION_HEADER } from './processData';
import { ProcessStageItem } from './ProcessStageItem';
import { initStudioProcessAnimations } from './StudioProcessAnimations';

export function StudioProcess() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const supportingTextRef = useRef<HTMLParagraphElement>(null);
  const stagesListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const headlineLines = headlineRef.current
      ? headlineRef.current.querySelectorAll<HTMLElement>('.process-headline-line')
      : [];

    const stageItems = stagesListRef.current
      ? stagesListRef.current.querySelectorAll<HTMLElement>('article')
      : [];

    const cleanup = initStudioProcessAnimations({
      section,
      headerContainer: headerContainerRef.current,
      eyebrow: eyebrowRef.current,
      headlineLines,
      supportingText: supportingTextRef.current,
      stageItems,
      onStageChange: (index) => setActiveStageIndex(index),
    });

    return () => cleanup();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative w-full bg-brand-obsidian pt-24 laptop:pt-36 pb-28 laptop:pb-36 overflow-hidden border-t border-brand-border/60"
    >
      {/* Background Architectural Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Editorial Section Header */}
      <MainContainer>
        <div
          ref={headerContainerRef}
          className="mb-14 sm:mb-20 flex flex-col laptop:flex-row laptop:items-end justify-between gap-10 border-b border-brand-border/80 pb-12 sm:pb-16 max-w-5xl mx-auto"
        >
          {/* Eyebrow & Monumental Syne Display Headline */}
          <div className="w-full laptop:w-auto laptop:flex-1">
            <div ref={eyebrowRef} className="mb-6 overflow-hidden">
              <EyebrowLabel indicator index={PROCESS_SECTION_HEADER.index} className="text-brand-neon font-bold">
                {PROCESS_SECTION_HEADER.eyebrow}
              </EyebrowLabel>
            </div>

            <h2
              ref={headlineRef}
              className="font-display font-extrabold tracking-tighter text-brand-white leading-[0.92] text-[2.2rem] xs:text-[2.6rem] sm:text-5xl tablet:text-[4rem] laptop:text-[4.75rem] desktop:text-[5.5rem] wide:text-[6.25rem]"
            >
              <div className="overflow-hidden mb-1 sm:mb-2">
                <span className="inline-block whitespace-nowrap process-headline-line">
                  {PROCESS_SECTION_HEADER.headline.line1}
                </span>
              </div>
              <div className="overflow-hidden">
                <span className="inline-block whitespace-nowrap process-headline-line text-brand-neon">
                  {PROCESS_SECTION_HEADER.headline.line2}
                </span>
              </div>
            </h2>
          </div>

          {/* Supporting Statement & Engineering Metadata */}
          <div className="max-w-xs laptop:max-w-sm shrink-0 laptop:pb-2">
            <p
              ref={supportingTextRef}
              className="font-body text-base sm:text-lg laptop:text-xl font-light text-brand-muted leading-relaxed"
            >
              "{PROCESS_SECTION_HEADER.statement}"
            </p>

            <div className="mt-6 pt-6 border-t border-brand-border/60 flex items-center justify-between font-mono text-xs text-brand-muted">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-neon" />
                <span>FRAMEWORK // 04 PHASES</span>
              </div>
              <span className="text-brand-white font-bold">[ SYSTEMIC CRAFT ]</span>
            </div>
          </div>
        </div>

        {/* Process Stages: Clean, Monumental, Full-Width Focus Layout */}
        <div
          ref={stagesListRef}
          className="max-w-5xl mx-auto w-full flex flex-col gap-6 sm:gap-8"
        >
          {PROCESS_STAGES.map((stage, index) => (
            <ProcessStageItem
              key={stage.id}
              stage={stage}
              isActive={activeStageIndex === index}
              onSelect={() => setActiveStageIndex(index)}
            />
          ))}
        </div>

        {/* Monumental Closing Statement / Studio Position */}
        <div id="studio-manifesto-block" className="mt-24 laptop:mt-36 pt-16 laptop:pt-24 border-t border-brand-border/60 text-center">
          <div className="font-mono text-xs font-semibold text-brand-neon tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-neon" />
            <span>STUDIO POSITION // ENGINEERING ETHOS</span>
          </div>

          {/* Interactive Cursor-Driven Particle Typographic Headline */}
          <div className="max-w-5xl mx-auto w-full">
            <CursorDrivenParticleTypography
              text={`GREAT PRODUCTS ARE\nNOT ACCIDENTAL. THEY\nARE THE RESULT OF\nRIGOROUS ARCHITECTURE,\nRESTRAINED AESTHETICS,\nAND UNCOMPROMISING\nENGINEERING.`}
              particleSize={1.25}
              particleDensity={5}
              dispersionStrength={10}
              returnSpeed={0.08}
              className="w-full"
            />
          </div>

          <div className="mt-8 flex items-center justify-center gap-4 font-mono text-xs text-brand-muted">
            <span>HASH.DEVS STUDIO</span>
            <span className="text-brand-border">·</span>
            <span>PRECISION ENGINEERING</span>
            <span className="text-brand-border">·</span>
            <span className="text-brand-neon">EST. 2024</span>
          </div>
        </div>
      </MainContainer>
    </section>
  );
}
