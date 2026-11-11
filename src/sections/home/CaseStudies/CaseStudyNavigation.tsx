import { Link } from 'react-router-dom';
import { MainContainer } from '@/components/layout';
import { CASE_STUDIES, CaseStudyData } from './caseStudies';

interface CaseStudyNavigationProps {
  caseStudy: CaseStudyData;
}

export function CaseStudyNavigation({ caseStudy }: CaseStudyNavigationProps) {
  const prevStudy = CASE_STUDIES[caseStudy.prevProjectId];
  const nextStudy = CASE_STUDIES[caseStudy.nextProjectId];

  return (
    <nav
      aria-label="Case Study Navigation"
      className="relative w-full bg-brand-obsidian py-16 laptop:py-24 border-t border-brand-border/60"
    >
      <MainContainer>
        {/* Navigation Grid */}
        <div className="grid grid-cols-1 laptop:grid-cols-2 gap-8 laptop:gap-12 mb-16">
          {/* Previous Project Card */}
          {prevStudy && (
            <Link
              to={`/work/${prevStudy.id}`}
              className="group relative flex flex-col justify-between p-8 sm:p-10 rounded-2xl border border-brand-border/80 bg-brand-surface/40 hover:border-brand-neon/60 hover:bg-brand-surface-elevated/80 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian"
              aria-label={`Explore previous commission: ${prevStudy.title}`}
            >
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-4 font-mono text-xs text-brand-muted">
                <span className="flex items-center gap-2 group-hover:text-brand-white transition-colors">
                  <span className="text-brand-neon group-hover:-translate-x-1 transition-transform">←</span>
                  <span>PREVIOUS COMMISSION</span>
                </span>
                <span className="text-brand-neon font-bold">[{prevStudy.index}]</span>
              </div>

              <div className="my-6">
                <span className="font-mono text-[10px] text-brand-muted uppercase tracking-wider block mb-1">
                  {prevStudy.category}
                </span>
                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-white tracking-tight uppercase group-hover:text-brand-neon transition-colors">
                  {prevStudy.title}
                </h3>
                <p className="mt-2 font-body text-xs sm:text-sm text-brand-muted font-light line-clamp-2">
                  {prevStudy.heroSummary}
                </p>
              </div>

              <div className="pt-4 border-t border-brand-border/40 font-mono text-[11px] text-brand-white flex items-center gap-2">
                <span className="underline underline-offset-4 decoration-white/30 group-hover:decoration-brand-neon">
                  EXPLORE CASE STUDY
                </span>
                <span className="text-brand-neon">→</span>
              </div>
            </Link>
          )}

          {/* Next Project Card */}
          {nextStudy && (
            <Link
              to={`/work/${nextStudy.id}`}
              className="group relative flex flex-col justify-between p-8 sm:p-10 rounded-2xl border border-brand-border/80 bg-brand-surface/40 hover:border-brand-neon/60 hover:bg-brand-surface-elevated/80 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian"
              aria-label={`Explore next commission: ${nextStudy.title}`}
            >
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-4 font-mono text-xs text-brand-muted">
                <span className="flex items-center gap-2 group-hover:text-brand-white transition-colors">
                  <span>NEXT COMMISSION</span>
                  <span className="text-brand-neon group-hover:translate-x-1 transition-transform">→</span>
                </span>
                <span className="text-brand-neon font-bold">[{nextStudy.index}]</span>
              </div>

              <div className="my-6">
                <span className="font-mono text-[10px] text-brand-muted uppercase tracking-wider block mb-1">
                  {nextStudy.category}
                </span>
                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-brand-white tracking-tight uppercase group-hover:text-brand-neon transition-colors">
                  {nextStudy.title}
                </h3>
                <p className="mt-2 font-body text-xs sm:text-sm text-brand-muted font-light line-clamp-2">
                  {nextStudy.heroSummary}
                </p>
              </div>

              <div className="pt-4 border-t border-brand-border/40 font-mono text-[11px] text-brand-white flex items-center gap-2">
                <span className="underline underline-offset-4 decoration-white/30 group-hover:decoration-brand-neon">
                  EXPLORE CASE STUDY
                </span>
                <span className="text-brand-neon">→</span>
              </div>
            </Link>
          )}
        </div>

        {/* Central Prominent "Return to Selected Works" Anchor */}
        <div className="text-center pt-8 border-t border-brand-border/60">
          <Link
            to="/#work"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-brand-border hover:border-brand-neon bg-brand-surface hover:bg-brand-surface-elevated text-brand-white transition-all duration-300 font-mono text-xs font-bold tracking-widest uppercase group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian"
            aria-label="Return to selected works portfolio archive"
          >
            <span className="text-brand-neon group-hover:-translate-x-1 transition-transform">←</span>
            <span>RETURN TO SELECTED WORKS ARCHIVE</span>
          </Link>
        </div>
      </MainContainer>
    </nav>
  );
}

