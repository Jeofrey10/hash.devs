import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap, prefersReducedMotion } from '@/lib/animations';
import { useCursor } from '@/components/ui/CursorContext';
import { ProjectItem } from './projects';
import { ProjectVisual } from './ProjectVisual';

export interface FeaturedProjectProps {
  project: ProjectItem;
  className?: string;
}

export function FeaturedProject({ project, className = '' }: FeaturedProjectProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const visualWrapperRef = useRef<HTMLDivElement>(null);
  const { setCursor, resetCursor } = useCursor();

  // Subtle 3D perspective tilt (< 3 degrees) via GSAP quickTo (0 React re-renders)
  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion()) return;

    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const card = cardRef.current;
    if (!card) return;

    const rotateXTo = gsap.quickTo(card, 'rotationX', { duration: 0.45, ease: 'power2.out' });
    const rotateYTo = gsap.quickTo(card, 'rotationY', { duration: 0.45, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Strictly clamp angular deflection within +/- 2.5 degrees
      rotateYTo(x * 5);
      rotateXTo(-y * 5);
    };

    const handleMouseLeave = () => {
      rotateXTo(0);
      rotateYTo(0);
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Link
      to={`/work/${project.id}`}
      className="block h-full cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon rounded-2xl"
      aria-label={`View ${project.title} Case Study`}
    >
      <article
        ref={cardRef}
        className={`group relative flex flex-col justify-between rounded-2xl border border-brand-border/80 bg-brand-surface/85 backdrop-blur-md p-5 sm:p-7 laptop:p-8 transition-all duration-500 hover:border-brand-border-hover hover:bg-brand-surface-elevated/90 ${className}`}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1200px',
          willChange: 'transform',
        }}
        onMouseEnter={() => setCursor('view', 'VIEW PROJECT')}
        onMouseLeave={() => resetCursor()}
      >
        {/* Corner Precision Brackets */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-3 h-2.5 w-2.5 border-l border-t border-brand-border transition-colors duration-300 group-hover:border-brand-neon"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-3 h-2.5 w-2.5 border-r border-t border-brand-border transition-colors duration-300 group-hover:border-brand-neon"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-brand-border transition-colors duration-300 group-hover:border-brand-neon"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3 h-2.5 w-2.5 border-b border-r border-brand-border transition-colors duration-300 group-hover:border-brand-neon"
        />

        {/* Project Top Metadata Bar */}
        <div className="mb-4 sm:mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-brand-border/60 pb-3 sm:pb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold tracking-widest text-brand-neon">
              [{project.index}]
            </span>
            <span className="inline-block h-3.5 w-[1px] bg-brand-border" />
            <span className="font-mono text-[11px] font-semibold tracking-wider text-brand-muted uppercase">
              {project.category}
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px] text-brand-muted">
            <span className="hidden sm:inline-block text-brand-muted/70">{project.clientOrigin}</span>
            <span className="rounded border border-brand-border/80 px-2 py-0.5 text-brand-white/80">
              {project.year}
            </span>
          </div>
        </div>

        {/* Project Dedicated Visual Composition Frame with Overflow Mask */}
        <div
          ref={visualWrapperRef}
          className="relative w-full rounded-xl border border-brand-border/60 overflow-hidden shadow-2xl transition-all duration-500 group-hover:border-brand-neon/40 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.8)]"
        >
          <div className="w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-[1.02]">
            <ProjectVisual project={project} />
          </div>
        </div>

        {/* Project Content & Narrative Area */}
        <div className="mt-5 sm:mt-6 flex flex-col justify-between flex-1 gap-4 sm:gap-5">
          <div>
            {/* Project Title with Kinetic Hover Arrow */}
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-[clamp(1.4rem,4.5vw,2.6rem)] font-extrabold tracking-tight text-brand-white transition-colors duration-300 group-hover:text-brand-white break-words pr-2">
                {project.title}
              </h3>
              <span
                aria-hidden="true"
                className="inline-flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-brand-border bg-brand-surface text-brand-white transition-all duration-300 group-hover:border-brand-neon group-hover:bg-brand-neon group-hover:text-brand-obsidian group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </span>
            </div>

            {/* Project Headline / Role */}
            <p className="mt-1.5 font-mono text-xs font-semibold tracking-wider text-brand-neon/90 uppercase">
              {project.headline}
            </p>

            {/* Project Description */}
            <p className="mt-2.5 font-body text-xs sm:text-sm font-light text-brand-muted leading-relaxed max-w-2xl">
              {project.description}
            </p>
          </div>

          {/* Project Metrics & Deliverables Matrix */}
          <div className="border-t border-brand-border/60 pt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            {/* Key Verified Metrics */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {project.metrics.map((metric, idx) => (
                <div key={idx} className="font-mono">
                  <span className="block text-[9px] text-brand-muted uppercase tracking-wider">
                    {metric.label}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-brand-white tracking-tight">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Deliverables / Tags Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {project.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-brand-border/80 bg-brand-surface px-2 py-0.5 font-mono text-[9px] font-medium tracking-wider text-brand-muted transition-colors duration-200 group-hover:border-brand-border-hover group-hover:text-brand-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
