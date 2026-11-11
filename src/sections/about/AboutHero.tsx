import { useRef } from 'react';
import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { ABOUT_COPY } from './aboutConfig';
import { AboutHero3DScene } from './AboutHero3DScene';

export function AboutHero() {
  const { hero } = ABOUT_COPY;
  const sectionRef = useRef<HTMLElement>(null);

  const handleScrollDown = () => {
    const philosophyEl = document.getElementById('studio-philosophy');
    if (philosophyEl) {
      philosophyEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="about-hero"
      ref={sectionRef}
      className="relative w-full min-h-[100svh] bg-brand-obsidian flex flex-col justify-between pt-28 sm:pt-36 pb-12 sm:pb-16 overflow-hidden border-b border-brand-border/60"
      aria-label="About HASH.DEVS Hero"
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
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[600px] h-[400px] bg-brand-neon/[0.02] blur-[140px] pointer-events-none rounded-full" />

      {/* Main Hero Content Area */}
      <MainContainer className="relative z-10 my-auto w-full">
        <div className="grid grid-cols-1 laptop:grid-cols-12 gap-8 laptop:gap-12 items-center">
          {/* Left Column: Eyebrow, Monumental Typography & Statement */}
          <div className="laptop:col-span-7 wide:col-span-7 min-w-0 flex flex-col justify-center">
            <div className="mb-6 sm:mb-8">
              <EyebrowLabel indicator index={hero.index} className="text-brand-neon font-bold">
                {hero.eyebrow}
              </EyebrowLabel>
            </div>

            <h1 className="font-display font-extrabold tracking-tighter text-brand-white leading-[0.92] text-[clamp(1.6rem,4.2vw,4.75rem)] min-w-0 w-full break-words">
              <div className="overflow-hidden mb-1">
                <span className="inline-block pr-2">{hero.headline.line1}</span>
              </div>
              <div className="overflow-hidden mb-1">
                <span className="inline-block pr-2">{hero.headline.line2}</span>
              </div>
              <div className="overflow-hidden mb-1">
                <span className="inline-block pr-2">{hero.headline.line3}</span>
              </div>
              <div className="overflow-hidden mb-1">
                <span className="inline-block text-brand-neon pr-2">
                  {hero.headline.line4}
                </span>
              </div>
              <div className="overflow-hidden">
                <span className="inline-block text-brand-neon pr-2">
                  {hero.headline.line5}
                </span>
              </div>
            </h1>

            <p className="mt-8 sm:mt-10 font-body text-base sm:text-lg laptop:text-xl font-light text-brand-muted leading-relaxed max-w-2xl">
              {hero.statement}
            </p>

            {/* Technical HUD Coordinates */}
            <div className="mt-8 pt-6 border-t border-brand-border/60 flex flex-wrap items-center gap-6 font-mono text-xs text-brand-muted">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-neon animate-pulse" />
                <span>{hero.coordinates}</span>
              </div>
              <span className="text-brand-border">|</span>
              <span className="text-brand-white font-semibold">{hero.status}</span>
            </div>
          </div>

          {/* Right Column: Original 3D Kinetic Chrome Sculpture */}
          <div className="laptop:col-span-5 wide:col-span-5 min-w-0 h-[380px] xs:h-[420px] sm:h-[480px] laptop:h-[580px] desktop:h-[640px] relative flex items-center justify-center">
            {/* Corner Precision Brackets */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-brand-border/60"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-brand-border/60"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b border-l border-brand-border/60"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r border-brand-border/60"
            />

            {/* Top Right Technical Tag */}
            <div className="absolute top-4 right-4 font-mono text-[10px] text-brand-muted tracking-widest uppercase z-10 flex items-center gap-2 bg-[#050505]/70 px-2 py-0.5 rounded border border-brand-border/40">
              <span className="h-1 w-1 rounded-full bg-brand-neon" />
              <span>PBR SCULPTURE // 3D CANVAS</span>
            </div>

            {/* Real-Time Interactive Three.js Scene */}
            <AboutHero3DScene className="w-full h-full" />
          </div>
        </div>
      </MainContainer>

      {/* Bottom Architectural Bar & Scroll Trigger */}
      <MainContainer className="relative z-10 mt-8 pt-6 border-t border-brand-border/40">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-brand-muted">
          <div className="flex items-center gap-3">
            <span className="text-brand-neon">■</span>
            <span>HASH.DEVS CORE MANIFESTO // 2026 EDITION</span>
          </div>

          <button
            type="button"
            onClick={handleScrollDown}
            className="group inline-flex items-center gap-2 text-brand-white hover:text-brand-neon transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon rounded px-2 py-1"
            aria-label="Scroll down to studio philosophy"
          >
            <span>SCROLL TO EXPLORE</span>
            <span className="transform transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
          </button>
        </div>
      </MainContainer>
    </section>
  );
}

