import { Link } from 'react-router-dom';
import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { ABOUT_COPY } from './aboutConfig';

export function CreativeCapabilities() {
  const { capabilities } = ABOUT_COPY;

  return (
    <section
      id="creative-capabilities"
      className="relative w-full bg-brand-obsidian py-24 laptop:py-36 overflow-hidden border-b border-brand-border/60 scroll-mt-12"
      aria-label="Creative Capabilities"
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
        {/* Section Header */}
        <div className="mb-14 sm:mb-20 max-w-5xl">
          <div className="mb-6">
            <EyebrowLabel indicator index={capabilities.index} className="text-brand-neon font-bold">
              {capabilities.eyebrow}
            </EyebrowLabel>
          </div>

          <h2 className="font-display font-extrabold tracking-tight text-brand-white leading-tight text-3xl sm:text-4xl laptop:text-5xl">
            {capabilities.headline}
          </h2>

          <p className="mt-4 font-body text-base sm:text-lg text-brand-muted font-light leading-relaxed max-w-2xl">
            {capabilities.statement}
          </p>
        </div>

        {/* Capabilities List / Grid */}
        <div className="flex flex-col gap-6 sm:gap-8">
          {capabilities.items.map((item) => (
            <div
              key={item.index}
              className="group relative rounded-2xl border border-brand-border/70 bg-[#0E1210] p-6 sm:p-8 laptop:p-10 transition-all duration-300 hover:border-brand-neon/60 hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
            >
              {/* Corner Precision Brackets */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-3 h-2.5 w-2.5 border-l border-t border-brand-border group-hover:border-brand-neon transition-colors"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-3 h-2.5 w-2.5 border-r border-t border-brand-border group-hover:border-brand-neon transition-colors"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-brand-border group-hover:border-brand-neon transition-colors"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-3 right-3 h-2.5 w-2.5 border-b border-r border-brand-border group-hover:border-brand-neon transition-colors"
              />

              <div className="grid grid-cols-1 laptop:grid-cols-12 gap-6 laptop:gap-10 items-center">
                {/* Index & Title */}
                <div className="laptop:col-span-5 flex items-start gap-4">
                  <span className="font-mono text-sm sm:text-base font-bold text-brand-neon tracking-wider">
                    [{item.index}]
                  </span>
                  <div>
                    <h3 className="font-display text-xl sm:text-2xl laptop:text-3xl font-extrabold text-brand-white uppercase tracking-tight group-hover:text-brand-neon transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="laptop:col-span-4">
                  <p className="font-body text-sm sm:text-base font-light text-brand-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Tags & Action Link */}
                <div className="laptop:col-span-3 flex flex-col items-start laptop:items-end justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5 laptop:justify-end">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="rounded bg-white/[0.03] border border-white/5 px-2 py-0.5 font-mono text-[10px] text-brand-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-brand-white group-hover:text-brand-neon transition-colors underline underline-offset-4 decoration-brand-border group-hover:decoration-brand-neon focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon rounded py-1"
                  >
                    <span>EXPLORE IN SERVICES</span>
                    <span className="transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </MainContainer>
    </section>
  );
}

