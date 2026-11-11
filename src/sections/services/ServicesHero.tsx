import { useRef } from 'react';
import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { SERVICES_COPY } from './servicesConfig';
import { ServicesHero3DScene } from './ServicesHero3DScene';

export function ServicesHero() {
  const { hero } = SERVICES_COPY;
  const sectionRef = useRef<HTMLElement>(null);

  const handleScrollDown = () => {
    const targetEl = document.getElementById('our-capabilities');
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id="services-hero"
      ref={sectionRef}
      className="relative w-full min-h-[100svh] bg-brand-obsidian flex flex-col justify-between pt-28 sm:pt-36 pb-12 sm:pb-16 overflow-hidden border-b border-brand-border/60"
      aria-label="Services Hero // HASH.DEVS"
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
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[400px] bg-brand-neon/[0.025] blur-[150px] pointer-events-none rounded-full" />

      {/* Main Hero Content Area */}
      <MainContainer className="relative z-10 my-auto w-full">
        <div className="grid grid-cols-1 laptop:grid-cols-12 gap-8 laptop:gap-12 items-center">
          {/* Left Column: Eyebrow, Monumental Syne Typography & Supporting Statement */}
          <div className="laptop:col-span-7 wide:col-span-7 min-w-0 flex flex-col justify-center">
            <div className="mb-6 sm:mb-8">
              <EyebrowLabel indicator index={hero.index} className="text-brand-neon font-bold">
                {hero.eyebrow}
              </EyebrowLabel>
            </div>

            <h1 className="font-display font-extrabold tracking-tighter text-brand-white leading-[0.92] text-[clamp(2.2rem,4.2vw,4.75rem)] min-w-0 w-full break-words">
              <div className="overflow-hidden mb-1">
                <span className="inline-block transform-gpu">{hero.headline.line1}</span>
              </div>
              <div className="overflow-hidden mb-1">
                <span className="inline-block text-brand-neon transform-gpu">
                  {hero.headline.line2}
                </span>
              </div>
              <div className="overflow-hidden">
                <span className="inline-block transform-gpu">{hero.headline.line3}</span>
              </div>
            </h1>

            <p className="mt-6 sm:mt-8 max-w-xl font-body text-base sm:text-lg laptop:text-xl font-light text-brand-muted leading-relaxed">
              "{hero.supporting}"
            </p>

            <div className="mt-8 pt-6 border-t border-brand-border/40 flex flex-wrap items-center gap-4 sm:gap-8 font-mono text-xs text-brand-muted">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-neon animate-pulse" />
                <span>{hero.status}</span>
              </div>
              <div className="hidden sm:block text-brand-border">•</div>
              <div className="text-brand-muted/70">{hero.coordinates}</div>
            </div>
          </div>

          {/* Right Column: Interactive 3D WebGL Mechanical Sculpture */}
          <div className="laptop:col-span-5 wide:col-span-5 min-w-0 flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[540px] border border-brand-border/40 bg-brand-surface/30 backdrop-blur-sm rounded-lg p-2 sm:p-4 flex items-center justify-center group overflow-hidden">
              {/* Corner Architectural Reticles */}
              <span className="absolute top-2 left-2 font-mono text-[10px] text-brand-neon/60 select-none">
                ⌜
              </span>
              <span className="absolute top-2 right-2 font-mono text-[10px] text-brand-neon/60 select-none">
                ⌝
              </span>
              <span className="absolute bottom-2 left-2 font-mono text-[10px] text-brand-neon/60 select-none">
                ⌞
              </span>
              <span className="absolute bottom-2 right-2 font-mono text-[10px] text-brand-neon/60 select-none">
                ⌟
              </span>

              {/* Technical Sculpture HUD Metadata */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 font-mono text-[10px] tracking-widest text-brand-muted uppercase">
                <span className="h-1 w-1 rounded-full bg-brand-neon" />
                <span>PBR SCULPTURE // 3D CANVAS</span>
              </div>

              <div className="absolute bottom-4 right-4 z-10 font-mono text-[10px] tracking-widest text-brand-muted/80">
                <span>KINETIC CHROME // GYRO RING</span>
              </div>

              {/* 3D Scene Container */}
              <ServicesHero3DScene className="w-full h-full" />
            </div>
          </div>
        </div>
      </MainContainer>

      {/* Bottom Architectural Bar & Scroll Trigger */}
      <MainContainer className="relative z-10 w-full pt-8 sm:pt-12">
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-brand-border/60 font-mono text-xs text-brand-muted">
          <div className="flex items-center gap-3">
            <span className="text-brand-white font-bold">HASH.DEVS</span>
            <span className="text-brand-border">•</span>
            <span className="text-brand-neon">CAPABILITY ATELIER</span>
          </div>

          <button
            onClick={handleScrollDown}
            className="group flex items-center gap-2 text-brand-muted hover:text-brand-white transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon"
            aria-label="Scroll to capabilities overview"
          >
            <span className="tracking-widest uppercase">SCROLL TO EXPLORE</span>
            <span className="text-brand-neon group-hover:translate-y-0.5 transition-transform duration-200">
              ↓
            </span>
          </button>
        </div>
      </MainContainer>
    </section>
  );
}

