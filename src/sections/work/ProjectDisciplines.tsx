import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { WORK_COPY } from './workConfig';

export function ProjectDisciplines() {
  const { disciplines } = WORK_COPY;

  return (
    <section
      id="project-disciplines"
      className="relative w-full bg-brand-obsidian py-24 sm:py-32 border-t border-b border-brand-border/60 overflow-hidden"
      aria-label="Disciplines Represented"
    >
      <MainContainer className="relative z-10 w-full">
        {/* Section Header */}
        <div className="mb-14 sm:mb-20">
          <div className="mb-6">
            <EyebrowLabel indicator index="04" className="text-brand-neon font-bold">
              [ 04 ] // DISCIPLINES REPRESENTED
            </EyebrowLabel>
          </div>

          <div className="grid grid-cols-1 laptop:grid-cols-12 gap-8 items-end justify-between pb-8 border-b border-brand-border/60">
            <div className="laptop:col-span-8 min-w-0">
              <h2 className="font-display font-extrabold tracking-tight text-brand-white leading-[1.0] text-3xl xs:text-4xl sm:text-5xl laptop:text-[3.75rem]">
                ENGINEERING EXPERTISE ACROSS THE ARCHIVE
              </h2>
            </div>

            <div className="laptop:col-span-4 min-w-0 font-mono text-xs text-brand-muted flex items-center justify-start laptop:justify-end gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-neon" />
              <span>FIVE INTEGRATED CREATIVE DISCIPLINES</span>
            </div>
          </div>
        </div>

        {/* 5 Disciplines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 laptop:grid-cols-3 gap-6">
          {disciplines.map((d, idx) => (
            <div
              key={d.index}
              className="relative p-6 sm:p-8 bg-brand-surface/40 border border-brand-border/60 rounded-lg hover:border-brand-border-hover transition-colors duration-200 group flex flex-col justify-between"
            >
              {/* Corner Brackets */}
              <span className="absolute top-2 left-2 font-mono text-[9px] text-brand-neon/40 select-none">
                ⌜
              </span>
              <span className="absolute top-2 right-2 font-mono text-[9px] text-brand-neon/40 select-none">
                ⌝
              </span>

              <div>
                <div className="flex items-center justify-between font-mono text-xs text-brand-muted mb-4">
                  <span className="text-brand-neon font-bold text-base">
                    {d.index}
                  </span>
                  <span className="text-[10px] uppercase border border-brand-border px-2 py-0.5 rounded text-brand-muted">
                    {d.projectCount}
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-xl sm:text-2xl text-brand-white tracking-tight mb-2 group-hover:text-brand-white transition-colors">
                  {d.title}
                </h3>

                <div className="font-mono text-[10px] text-brand-neon tracking-widest uppercase mb-4">
                  {d.tagline}
                </div>

                <p className="font-body text-sm font-light text-brand-muted leading-relaxed">
                  {d.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-brand-border/40 flex items-center justify-between font-mono text-[10px] text-brand-muted/70">
                <span>SPEC // 0{idx + 1}</span>
                <span className="text-brand-neon">ACTIVE REPERTOIRE</span>
              </div>
            </div>
          ))}

          {/* 6th Card: Archive Rigor & Integrity Card */}
          <div className="relative p-6 sm:p-8 bg-brand-surface-elevated/40 border border-brand-neon/30 rounded-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between font-mono text-xs text-brand-neon mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-neon animate-pulse" />
                  <span className="font-bold tracking-wider">ARCHIVE INTEGRITY</span>
                </div>
                <span className="text-[10px] text-brand-neon/60 select-none">VERIFIED</span>
              </div>

              <div className="font-mono text-[10px] text-brand-muted tracking-widest uppercase mb-3">
                ZERO TEMPLATES // ZERO DUMMY PROTOTYPES
              </div>

              <p className="font-body text-xs sm:text-sm text-brand-muted leading-relaxed">
                Every project in this archive represents actual deployed code, tailored architecture, and custom interaction mechanics. We build zero disposable agency mockups.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-brand-border/40 flex items-center justify-between font-mono text-[10px] text-brand-muted/70">
              <span>STATUS: PRODUCTION</span>
              <span className="text-brand-white font-bold">100% BESPOKE</span>
            </div>
          </div>
        </div>
      </MainContainer>
    </section>
  );
}

