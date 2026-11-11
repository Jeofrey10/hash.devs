import { MainContainer } from '@/components/layout';
import { CaseStudyData } from './caseStudies';
import { ProjectVisual } from '../FeaturedWorks/ProjectVisual';
import { FEATURED_PROJECTS } from '../FeaturedWorks/projects';

interface CaseStudyVisualProps {
  caseStudy: CaseStudyData;
}

export function CaseStudyVisual({ caseStudy }: CaseStudyVisualProps) {
  const { technicalArchitecture, closingStatement, id } = caseStudy;

  // Resolve matching project item
  const projectItem = FEATURED_PROJECTS.find((p) => p.id === id) || FEATURED_PROJECTS[0];

  return (
    <div className="relative w-full bg-brand-obsidian py-20 laptop:py-32 border-t border-brand-border/60">
      <MainContainer>
        {/* Top Kicker */}
        <div className="mb-8 flex items-center justify-between border-b border-brand-border/60 pb-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-brand-neon animate-pulse" />
            <span className="text-brand-white font-bold tracking-widest uppercase">
              [02] VISUAL SHOWCASE // DEEP DIVE
            </span>
          </div>
          <span className="text-brand-muted uppercase hidden sm:inline">
            CINEMATIC ARTIFACT INSPECTION
          </span>
        </div>

        {/* Cinematic Full-Width Project Visual Composition Frame */}
        <div className="relative w-full rounded-2xl border border-brand-border/80 overflow-hidden shadow-2xl bg-brand-surface/60 mb-20 laptop:mb-32">
          {/* Outer Hairline Highlights */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-neon/60 to-transparent z-10" />

          {/* Render dedicated project visual */}
          <div className="w-full">
            <ProjectVisual project={projectItem} />
          </div>
        </div>

        {/* Technology & Architectural Layers Section */}
        <div className="mb-24 laptop:mb-36">
          <div className="mb-10 max-w-3xl">
            <div className="font-mono text-xs font-bold tracking-widest text-brand-neon uppercase mb-3">
              [03] ARCHITECTURAL SPECIFICATIONS & RUNTIMES
            </div>
            <h2 className="font-display text-2xl xs:text-3xl sm:text-4xl laptop:text-5xl font-extrabold text-brand-white tracking-tight uppercase leading-tight min-w-0 w-full break-words">
              {technicalArchitecture.title}
            </h2>
            <p className="mt-4 font-body text-base sm:text-lg font-light text-brand-muted leading-relaxed">
              {technicalArchitecture.description}
            </p>
          </div>

          {/* Architectural Stack Layers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {technicalArchitecture.layers.map((layer, idx) => (
              <div
                key={idx}
                className="bg-brand-surface/40 border border-brand-border/80 rounded-xl p-6 hover:border-brand-border-hover transition-colors duration-300 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] text-brand-neon mb-2">
                    <span>LAYER {idx + 1}</span>
                    <span className="text-white/40">{layer.tech}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-brand-white tracking-tight">
                    {layer.name}
                  </h3>
                </div>
                <p className="font-body text-xs sm:text-sm text-brand-muted font-light leading-relaxed">
                  {layer.description}
                </p>
              </div>
            ))}
          </div>

          {/* Architectural Telemetry Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-brand-border/60 pt-8">
            {technicalArchitecture.metrics.map((metric, idx) => (
              <div key={idx} className="border-l-2 border-brand-neon/60 pl-4 font-mono">
                <span className="block text-[10px] text-brand-muted uppercase tracking-wider mb-1">
                  {metric.label}
                </span>
                <span className="text-2xl font-bold text-brand-white tracking-tight">
                  {metric.value}
                </span>
                <span className="block text-[10px] text-brand-muted/70 mt-1 leading-snug">
                  {metric.detail}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Project Statement */}
        <div className="border-t border-brand-border/60 pt-16 laptop:pt-24 pb-8 text-center">
          <div className="font-mono text-xs font-semibold text-brand-neon tracking-widest uppercase mb-4">
            STUDIO POSITION
          </div>
          <h2 className="font-display text-[clamp(1.5rem,5.5vw,4.5rem)] font-extrabold tracking-tighter text-brand-white uppercase leading-[0.98] max-w-5xl mx-auto break-words pr-2">
            {closingStatement}
          </h2>
        </div>
      </MainContainer>
    </div>
  );
}

