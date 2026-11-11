import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { ABOUT_COPY } from './aboutConfig';

export function StudioPhilosophy() {
  const { philosophy } = ABOUT_COPY;

  return (
    <section
      id="studio-philosophy"
      className="relative w-full bg-brand-obsidian py-24 laptop:py-36 overflow-hidden border-b border-brand-border/60 scroll-mt-12"
      aria-label="Studio Philosophy"
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

      <MainContainer>
        <div className="max-w-5xl mx-auto">
          {/* Eyebrow */}
          <div className="mb-8">
            <EyebrowLabel indicator index={philosophy.index} className="text-brand-neon font-bold">
              {philosophy.eyebrow}
            </EyebrowLabel>
          </div>

          {/* Monumental Editorial Headline */}
          <h2 className="font-display font-extrabold tracking-tight text-brand-white leading-[1.04] text-2xl xs:text-3xl sm:text-4xl tablet:text-5xl laptop:text-[3.75rem] desktop:text-[4.25rem]">
            "{philosophy.statement}"
          </h2>

          {/* Explanatory Editorial Body */}
          <p className="mt-8 sm:mt-12 font-body text-base sm:text-lg laptop:text-xl font-light text-brand-muted leading-relaxed max-w-4xl">
            {philosophy.body}
          </p>

          {/* Technical Metadata Matrix */}
          <div className="mt-14 sm:mt-20 pt-8 sm:pt-10 border-t border-brand-border/60 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {philosophy.meta.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#0E1210] border border-brand-border/80 rounded-xl p-5 relative flex flex-col justify-between"
              >
                {/* Micro corner brackets */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-2 top-2 h-2 w-2 border-l border-t border-brand-border"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-2 top-2 h-2 w-2 border-r border-t border-brand-border"
                />

                <span className="font-mono text-[10px] text-brand-muted tracking-widest uppercase mb-2">
                  {item.key}
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-brand-white tracking-wide">
                  {item.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </MainContainer>
    </section>
  );
}

