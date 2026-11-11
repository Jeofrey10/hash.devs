import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { WORK_COPY } from './workConfig';

export function ExperimentationStatement() {
  const { experimentation } = WORK_COPY;

  return (
    <section
      id="experimentation-statement"
      className="relative w-full bg-brand-obsidian py-24 sm:py-36 laptop:py-44 border-b border-brand-border/60 overflow-hidden"
      aria-label="Studio Experimentation Statement"
    >
      {/* Background Subtle Architectural Grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #35e85b 1px, transparent 1px), linear-gradient(to bottom, #35e85b 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-neon/[0.03] blur-[150px] pointer-events-none rounded-full" />

      <MainContainer className="relative z-10 w-full">
        <div className="max-w-5xl mx-auto">
          {/* Eyebrow Label */}
          <div className="mb-8">
            <EyebrowLabel indicator index={experimentation.index} className="text-brand-neon font-bold">
              {experimentation.eyebrow}
            </EyebrowLabel>
          </div>

          {/* Monumental Headline */}
          <h2 className="font-display font-extrabold tracking-tighter text-brand-white leading-[0.94] text-4xl xs:text-5xl sm:text-6xl tablet:text-7xl laptop:text-[5.5rem] uppercase mb-10">
            <div>{experimentation.headline.line1}</div>
            <div>
              <span>{experimentation.headline.line2} </span>
              <span className="text-brand-neon">{experimentation.headline.line3}</span>
            </div>
          </h2>

          {/* Supporting Copy */}
          <p className="font-body text-lg sm:text-xl laptop:text-2xl font-light text-brand-muted leading-relaxed max-w-3xl mb-14">
            "{experimentation.supporting}"
          </p>

          {/* Precision Abstract SVG Topology & 3 Research Principles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-brand-border/60">
            {experimentation.principles.map((item, idx) => (
              <div
                key={idx}
                className="p-6 bg-brand-surface/30 border border-brand-border/40 rounded-lg relative"
              >
                <div className="font-mono text-xs text-brand-neon font-bold tracking-widest uppercase mb-2">
                  // {item.tag}
                </div>
                <p className="font-body text-xs sm:text-sm text-brand-muted leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </MainContainer>
    </section>
  );
}

