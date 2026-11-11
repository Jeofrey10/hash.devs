import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { WORK_COPY } from './workConfig';

export function ArchiveIntro() {
  const { archiveIntro } = WORK_COPY;

  return (
    <section
      id="archive-intro"
      className="relative w-full bg-brand-obsidian py-24 sm:py-32 border-b border-brand-border/60 overflow-hidden"
      aria-label="Archive Introduction"
    >
      <MainContainer className="relative z-10 w-full">
        {/* Section Identifier */}
        <div className="mb-8">
          <EyebrowLabel indicator index={archiveIntro.index} className="text-brand-neon font-bold">
            {archiveIntro.eyebrow}
          </EyebrowLabel>
        </div>

        {/* Monumental Headline & Supporting Statement */}
        <div className="grid grid-cols-1 laptop:grid-cols-12 gap-8 laptop:gap-16 items-start">
          <div className="laptop:col-span-8 min-w-0">
            <h2 className="font-display font-extrabold tracking-tight text-brand-white leading-[1.0] text-3xl xs:text-4xl sm:text-5xl tablet:text-6xl laptop:text-[4.25rem]">
              {archiveIntro.headline}
            </h2>
          </div>

          <div className="laptop:col-span-4 min-w-0 flex flex-col justify-end">
            <p className="font-body text-base sm:text-lg laptop:text-xl font-light text-brand-muted leading-relaxed">
              "{archiveIntro.supporting}"
            </p>
          </div>
        </div>

        {/* Thin Horizontal Divider with Reticles */}
        <div className="relative my-14 sm:my-20 w-full border-t border-brand-border/80">
          <span className="absolute -top-[5px] left-0 h-2 w-2 rounded-full bg-brand-neon" />
          <span className="absolute -top-[5px] right-0 h-2 w-2 rounded-full bg-brand-border" />
        </div>

        {/* 3 Technical Archive Metadata Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {archiveIntro.metadata.map((item, idx) => (
            <div
              key={idx}
              className="relative p-6 sm:p-8 bg-brand-surface/40 border border-brand-border/60 rounded-lg group hover:border-brand-border-hover transition-colors duration-200"
            >
              <span className="absolute top-2 right-2 font-mono text-[9px] text-brand-muted/40 select-none">
                SPEC // 0{idx + 1}
              </span>
              <div className="font-mono text-xs text-brand-neon font-semibold tracking-wider uppercase mb-2">
                {item.key}
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-brand-white tracking-tight">
                {item.val}
              </div>
            </div>
          ))}
        </div>
      </MainContainer>
    </section>
  );
}

