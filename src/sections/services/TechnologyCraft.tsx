import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { SERVICES_COPY } from './servicesConfig';

export function TechnologyCraft() {
  const { technology } = SERVICES_COPY;

  return (
    <section
      id="technology-craft"
      className="relative w-full bg-brand-obsidian py-24 sm:py-32 border-b border-brand-border/60 overflow-hidden"
      aria-label="Technology and Craft"
    >
      <MainContainer className="relative z-10 w-full">
        {/* Section Header */}
        <div className="mb-14 sm:mb-20">
          <div className="mb-6">
            <EyebrowLabel indicator index={technology.index} className="text-brand-neon font-bold">
              {technology.eyebrow}
            </EyebrowLabel>
          </div>

          <div className="grid grid-cols-1 laptop:grid-cols-12 gap-8 items-end justify-between pb-8 border-b border-brand-border/60">
            <div className="laptop:col-span-7 min-w-0">
              <h2 className="font-display font-extrabold tracking-tight text-brand-white leading-[1.0] text-3xl xs:text-4xl sm:text-5xl laptop:text-[3.75rem]">
                {technology.headline}
              </h2>
            </div>

            <div className="laptop:col-span-5 min-w-0">
              <p className="font-body text-base sm:text-lg font-light text-brand-muted leading-relaxed">
                "{technology.supporting}"
              </p>
            </div>
          </div>
        </div>

        {/* 5 Technical Category Cards in Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 laptop:grid-cols-3 gap-6">
          {technology.categories.map((cat, idx) => (
            <div
              key={cat.category}
              className="relative p-6 sm:p-8 bg-brand-surface/40 border border-brand-border/60 rounded-lg hover:border-brand-border-hover transition-colors duration-200 group flex flex-col justify-between"
            >
              {/* Top Meta */}
              <div>
                <div className="flex items-center justify-between font-mono text-xs text-brand-muted mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-neon group-hover:scale-125 transition-transform duration-200" />
                    <span className="font-bold text-brand-white tracking-wider">
                      {cat.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-brand-muted/60 select-none">
                    SPEC // 0{idx + 1}
                  </span>
                </div>

                <div className="font-mono text-[10px] text-brand-neon tracking-widest uppercase mb-6">
                  {cat.descriptor}
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-2">
                  {cat.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3 py-1.5 rounded bg-brand-obsidian/80 border border-brand-border/70 font-mono text-xs text-brand-white/90 group-hover:border-brand-neon/40 transition-colors duration-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Telemetry Status */}
              <div className="mt-8 pt-4 border-t border-brand-border/40 flex items-center justify-between font-mono text-[10px] text-brand-muted/70">
                <span>RUNTIME: COMPILED // PBR</span>
                <span className="text-brand-neon">STABLE</span>
              </div>
            </div>
          ))}

          {/* 6th Card: Engineering Ethos / Studio Quality Guarantee */}
          <div className="relative p-6 sm:p-8 bg-brand-surface-elevated/40 border border-brand-neon/30 rounded-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-brand-neon mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-neon animate-pulse" />
                  <span className="font-bold tracking-wider">STUDIO QUALITY GUARANTEE</span>
                </div>
                <span className="text-[10px] text-brand-neon/60 select-none">SLA // AOT</span>
              </div>

              <div className="font-mono text-[10px] text-brand-muted tracking-widest uppercase mb-4">
                ZERO COMPROMISE PHILOSOPHY
              </div>

              <p className="font-body text-xs sm:text-sm text-brand-muted leading-relaxed">
                We write 100% bespoke codebases optimized for high-performance browser execution. Every surface, shader, API, and interaction is engineered to eliminate runtime latency and layout thrashing.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-brand-border/40 flex items-center justify-between font-mono text-[10px] text-brand-muted/70">
              <span>LATENCY: &lt; 50MS</span>
              <span className="text-brand-white font-bold">100% BESPOKE</span>
            </div>
          </div>
        </div>
      </MainContainer>
    </section>
  );
}

