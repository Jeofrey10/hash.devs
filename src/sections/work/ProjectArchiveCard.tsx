import { Link } from 'react-router-dom';
import { ProjectItem } from '../home/FeaturedWorks/projects';
import { ProjectVisual } from '../home/FeaturedWorks/ProjectVisual';
import { useCursor } from '@/components/ui/CursorContext';
import { cn } from '@/lib/utils';

export interface ProjectArchiveCardProps {
  project: ProjectItem;
  index: number;
}

export function ProjectArchiveCard({ project, index }: ProjectArchiveCardProps) {
  const { setCursor, resetCursor } = useCursor();
  const isReversed = index % 2 === 1;

  return (
    <article
      id={`project-${project.id}`}
      className="relative w-full border-t border-brand-border/70 py-16 sm:py-24 laptop:py-32 group"
      aria-label={`Project: ${project.title}`}
    >
      <div className="grid grid-cols-1 laptop:grid-cols-12 gap-10 laptop:gap-16 items-center">
        {/* Project Info Column */}
        <div
          className={cn(
            'laptop:col-span-5 flex flex-col justify-between min-w-0',
            isReversed ? 'laptop:order-2' : 'laptop:order-1'
          )}
        >
          <div>
            {/* Top Meta: Number + Category */}
            <div className="flex items-center justify-between font-mono text-xs text-brand-muted mb-4 pb-3 border-b border-brand-border/40">
              <div className="flex items-center gap-3">
                <span className="font-bold text-brand-neon text-base sm:text-lg">
                  {project.index}
                </span>
                <span className="text-brand-border">•</span>
                <span className="uppercase tracking-widest text-brand-white/80">
                  {project.category}
                </span>
              </div>
              <span className="text-brand-muted/60">{project.year}</span>
            </div>

            {/* Project Title */}
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl laptop:text-[clamp(1.75rem,2.8vw,2.75rem)] tracking-tight text-brand-white uppercase mb-4 group-hover:text-brand-neon transition-colors duration-300 leading-[1.05] break-words min-w-0">
              <Link
                to={`/work/${project.id}`}
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={() => resetCursor()}
                className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon"
              >
                {project.title}
              </Link>
            </h3>

            {/* Headline Subtitle */}
            <div className="font-mono text-xs text-brand-muted uppercase tracking-wider mb-6">
              {project.headline}
            </div>

            {/* Description */}
            <p className="font-body text-base sm:text-lg font-light text-brand-muted leading-relaxed mb-8">
              {project.description}
            </p>

            {/* Deliverables / Tags Pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.deliverables.slice(0, 3).map((item, dIdx) => (
                <span
                  key={dIdx}
                  className="px-3 py-1 rounded bg-brand-surface border border-brand-border font-mono text-xs text-brand-white/80"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Performance Metrics Strip */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-brand-border/40 font-mono text-[11px] mb-8">
              {project.metrics.map((m, mIdx) => (
                <div key={mIdx}>
                  <div className="text-brand-muted text-[10px] uppercase truncate">
                    {m.label}
                  </div>
                  <div className="text-brand-white font-bold truncate">{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Link to Case Study */}
          <div>
            <Link
              to={`/work/${project.id}`}
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={() => resetCursor()}
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-md bg-brand-surface border border-brand-border text-brand-white font-mono text-xs font-bold tracking-wider uppercase group-hover:border-brand-neon group-hover:bg-brand-neon group-hover:text-brand-obsidian transition-all duration-300 shadow-sm"
              aria-label={`View ${project.title} case study`}
            >
              <span>VIEW CASE STUDY</span>
              <span className="text-brand-neon group-hover:text-brand-obsidian group-hover:translate-x-0.5 transition-transform duration-200">
                ↗
              </span>
            </Link>
          </div>
        </div>

        {/* Project Visual Composition Column */}
        <div
          className={cn(
            'laptop:col-span-7 min-w-0',
            isReversed ? 'laptop:order-1' : 'laptop:order-2'
          )}
        >
          <Link
            to={`/work/${project.id}`}
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={() => resetCursor()}
            className="block relative w-full rounded-xl border border-brand-border/80 bg-brand-surface/40 overflow-hidden group/visual transition-all duration-500 hover:border-brand-neon/60 hover:shadow-[0_8px_40px_rgba(53,232,91,0.08)]"
            aria-label={`Inspect ${project.title} project showcase`}
          >
            {/* Top Reticles */}
            <span className="absolute top-2 left-2 z-20 font-mono text-[10px] text-brand-neon/50 select-none">
              ⌜
            </span>
            <span className="absolute top-2 right-2 z-20 font-mono text-[10px] text-brand-neon/50 select-none">
              ⌝
            </span>
            <span className="absolute bottom-2 left-2 z-20 font-mono text-[10px] text-brand-neon/50 select-none">
              ⌞
            </span>
            <span className="absolute bottom-2 right-2 z-20 font-mono text-[10px] text-brand-neon/50 select-none">
              ⌟
            </span>

            {/* Render Existing Rich Project Visual with Real-Time 3D Scene */}
            <div className="w-full transform transition-transform duration-700 ease-out group-hover/visual:scale-[1.015]">
              <ProjectVisual project={project} />
            </div>

            {/* Dedicated Responsive Bottom Metadata & Action Bar */}
            <div className="relative z-10 w-full bg-brand-surface/95 border-t border-brand-border/60 px-4 py-3 sm:px-5 sm:py-3.5 flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 sm:gap-4 min-w-0">
              <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-brand-muted truncate min-w-0">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-neon animate-pulse shrink-0" />
                <span className="text-white/40 uppercase shrink-0">ARTIFACT //</span>
                <span className="text-brand-white font-medium truncate">{project.headline}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 self-start xs:self-auto font-mono text-[11px] sm:text-xs font-bold text-brand-neon group-hover/visual:text-brand-white transition-colors duration-200">
                <span>VIEW CASE STUDY</span>
                <span className="group-hover/visual:translate-x-1 transition-transform duration-200">↗</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </article>
  );
}

