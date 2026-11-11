import { useRef } from 'react';
import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { WORK_COPY } from './workConfig';

export function WorkHero() {
  const { hero } = WORK_COPY;
  const sectionRef = useRef<HTMLElement>(null);

  const handleScrollDown = () => {
    const targetEl = document.getElementById('archive-intro');
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="work-hero"
      ref={sectionRef}
      className="relative w-full min-h-[100svh] bg-brand-obsidian flex flex-col justify-between pt-28 sm:pt-36 pb-12 sm:pb-16 overflow-hidden border-b border-brand-border/60"
      aria-label="Selected Works Hero // HASH.DEVS"
    >
      {/* Background Architectural Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Ambient Depth Illumination */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-brand-neon/[0.025] blur-[160px] pointer-events-none rounded-full" />

      {/* Main Hero Content Area */}
      <MainContainer className="relative z-10 my-auto w-full">
        {/* Eyebrow Label & Status */}
        <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-4">
          <EyebrowLabel indicator index={hero.index} className="text-brand-neon font-bold">
            {hero.eyebrow}
          </EyebrowLabel>

          <div className="flex items-center gap-2 font-mono text-xs text-brand-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-neon animate-pulse" />
            <span>{hero.status}</span>
          </div>
        </div>

        {/* Monumental Syne Display Headline */}
        <div className="grid grid-cols-1 laptop:grid-cols-12 gap-8 laptop:gap-12 items-end">
          <div className="laptop:col-span-8 min-w-0">
            <h1 className="font-display font-extrabold tracking-tighter text-brand-white leading-[0.92] text-[2.75rem] xs:text-[3.25rem] sm:text-6xl tablet:text-[5rem] laptop:text-[6rem] desktop:text-[7rem] wide:text-[8rem]">
              <div className="overflow-hidden mb-1">
                <span className="inline-block">{hero.headline.line1}</span>
              </div>
              <div className="overflow-hidden mb-1">
                <span className="inline-block text-brand-neon">{hero.headline.line2}</span>
              </div>
              <div className="overflow-hidden">
                <span className="inline-block">{hero.headline.line3}</span>
              </div>
            </h1>
          </div>

          {/* Right Supporting Column */}
          <div className="laptop:col-span-4 min-w-0 flex flex-col justify-end laptop:pb-3">
            <p className="font-body text-base sm:text-lg laptop:text-xl font-light text-brand-muted leading-relaxed">
              "{hero.supporting}"
            </p>

            <div className="mt-6 pt-6 border-t border-brand-border/60 flex flex-col gap-2 font-mono text-xs text-brand-muted">
              <div className="flex items-center justify-between">
                <span>PROJECT SELECTION:</span>
                <span className="text-brand-white font-bold">04 CASE STUDIES</span>
              </div>
              <div className="flex items-center justify-between">
                <span>STUDIO DISCIPLINE:</span>
                <span className="text-brand-neon font-bold">CREATIVE ENGINEERING</span>
              </div>
            </div>
          </div>
        </div>

        {/* Architectural 3-Column Metadata Strip */}
        <div className="mt-14 sm:mt-20 pt-8 border-t border-brand-border/60 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {hero.metrics.map((m, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-6 bg-brand-surface/40 border border-brand-border/60 rounded-lg flex items-center justify-between font-mono text-xs"
            >
              <span className="text-brand-muted uppercase">{m.label}:</span>
              <span className="text-brand-white font-bold tracking-wider">{m.value}</span>
            </div>
          ))}
        </div>
      </MainContainer>

      {/* Bottom Architectural Bar & Scroll Trigger */}
      <MainContainer className="relative z-10 w-full pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-brand-border/40 font-mono text-xs text-brand-muted">
          <div className="flex items-center gap-3">
            <span className="text-brand-white font-bold">HASH.DEVS</span>
            <span className="text-brand-border">•</span>
            <span className="text-brand-neon">CURATED ARCHIVE</span>
          </div>

          <button
            onClick={handleScrollDown}
            className="group flex items-center gap-2 text-brand-muted hover:text-brand-white transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon"
            aria-label="Scroll to project archive"
          >
            <span className="tracking-widest uppercase">SCROLL TO ARCHIVE</span>
            <span className="text-brand-neon group-hover:translate-y-0.5 transition-transform duration-200">
              ↓
            </span>
          </button>
        </div>
      </MainContainer>
    </section>
  );
}

