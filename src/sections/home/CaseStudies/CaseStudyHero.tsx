import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { MainContainer } from '@/components/layout';
import { CaseStudyData } from './caseStudies';
import { ProjectVisual } from '../FeaturedWorks/ProjectVisual';
import { FEATURED_PROJECTS } from '../FeaturedWorks/projects';

interface CaseStudyHeroProps {
  caseStudy: CaseStudyData;
}

export function CaseStudyHero({ caseStudy }: CaseStudyHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  // Find corresponding project data for visual composition
  const projectItem = FEATURED_PROJECTS.find((p) => p.id === caseStudy.id) || {
    id: caseStudy.id,
    index: caseStudy.index,
    title: caseStudy.title,
    category: caseStudy.category,
    headline: caseStudy.heroHeadline,
    description: caseStudy.heroSummary,
    clientOrigin: caseStudy.clientOrigin,
    year: caseStudy.year,
    deliverables: [],
    tags: [],
    accentHue: caseStudy.accentHue,
    metrics: [],
    visualType: caseStudy.visualType,
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen bg-brand-obsidian pt-28 sm:pt-36 pb-20 laptop:pb-28 overflow-hidden border-b border-brand-border/60"
    >
      {/* Background Architectural Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <MainContainer>
        {/* Top Back Navigation & Index Bar */}
        <div className="mb-10 sm:mb-14 flex items-center justify-between border-b border-brand-border/60 pb-5 font-mono text-xs">
          <Link
            to="/#work"
            className="group flex items-center gap-2.5 text-brand-muted transition-colors duration-200 hover:text-brand-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon rounded px-1.5 py-0.5"
            aria-label="Return to selected works portfolio archive"
          >
            <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1 text-brand-neon">
              ←
            </span>
            <span className="tracking-wider uppercase font-semibold">RETURN TO SELECTED WORKS</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-brand-muted/70">{caseStudy.clientOrigin}</span>
            <span className="rounded border border-brand-border/80 px-2 py-0.5 text-brand-white font-bold tracking-widest text-brand-neon">
              {caseStudy.index} / 04
            </span>
          </div>
        </div>

        {/* Editorial Headline & Category Kicker */}
        <div className="mb-10 sm:mb-14 max-w-5xl">
          <div className="mb-4 flex items-center gap-3 font-mono text-xs font-semibold text-brand-neon tracking-widest uppercase">
            <span className="h-2 w-2 rounded-full bg-brand-neon animate-pulse" />
            <span>CASE STUDY // {caseStudy.category}</span>
            <span className="text-brand-border">•</span>
            <span className="text-white/60">{caseStudy.year}</span>
          </div>

          <h1 className="font-display text-[clamp(1.75rem,6.8vw,5.75rem)] font-extrabold tracking-tighter text-brand-white leading-[0.92] break-words pr-2">
            {caseStudy.title}
          </h1>

          <p className="mt-6 font-body text-base sm:text-lg laptop:text-xl font-light text-brand-muted leading-relaxed max-w-3xl">
            {caseStudy.heroSummary}
          </p>
        </div>

        {/* Dominant Project Visual Composition (Occupies 65–75% of Initial Desktop Viewport) */}
        <div className="relative w-full rounded-2xl border border-brand-border/80 overflow-hidden shadow-2xl bg-brand-surface/40 my-8 laptop:my-12">
          {/* Corner Precision Machined Brackets */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-brand-border z-20"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-brand-border z-20"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-brand-border z-20"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-brand-border z-20"
          />

          <div className="w-full">
            <ProjectVisual project={projectItem} />
          </div>
        </div>

        {/* Bottom Hero Telemetry & Scroll Indicator */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-brand-muted">
          <div className="flex items-center gap-6">
            <span>DIRECTION: HASH.DEVS STUDIO</span>
            <span className="hidden sm:inline-block text-brand-border">•</span>
            <span className="hidden sm:inline-block">STATUS: VERIFIED PRODUCTION ARCHIVE</span>
          </div>

          <div className="flex items-center gap-2 text-brand-neon animate-bounce">
            <span className="tracking-widest uppercase text-[10px]">SCROLL TO EXPLORE</span>
            <span>↓</span>
          </div>
        </div>
      </MainContainer>
    </section>
  );
}

