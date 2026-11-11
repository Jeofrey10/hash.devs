import { Link } from 'react-router-dom';
import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { WORK_COPY } from './workConfig';
import { useCursor } from '@/components/ui/CursorContext';

export function WorkCollaborationCTA() {
  const { cta } = WORK_COPY;
  const { setCursor, resetCursor } = useCursor();

  return (
    <section
      id="work-cta"
      className="relative w-full bg-brand-obsidian pt-24 sm:pt-36 pb-20 sm:pb-28 overflow-hidden"
      aria-label="Work Collaboration Call to Action"
    >
      {/* Background Radial Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-brand-neon/[0.035] blur-[160px] pointer-events-none rounded-full" />

      <MainContainer className="relative z-10 w-full text-center">
        {/* Section Identifier */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <EyebrowLabel indicator index={cta.index} className="text-brand-neon font-bold">
            {cta.eyebrow}
          </EyebrowLabel>
        </div>

        {/* Monumental Headline */}
        <h2 className="font-display font-extrabold tracking-tighter text-brand-white leading-[0.94] text-[clamp(1.75rem,6.5vw,5.5rem)] max-w-5xl mx-auto uppercase break-words pr-2">
          <div>{cta.headline.line1}</div>
          <div className="text-brand-neon">{cta.headline.line2}</div>
        </h2>

        {/* Supporting Copy */}
        <p className="mt-8 max-w-2xl mx-auto font-body text-base sm:text-lg laptop:text-xl font-light text-brand-muted leading-relaxed">
          "{cta.supporting}"
        </p>

        {/* Dual Action CTAs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-5 sm:gap-6">
          <Link
            to={cta.primaryLink}
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={() => resetCursor()}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-md bg-brand-neon text-brand-obsidian font-mono text-sm font-bold tracking-wider uppercase hover:bg-brand-white transition-all duration-200 shadow-[0_0_30px_rgba(53,232,91,0.25)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{cta.primaryBtn}</span>
          </Link>

          <Link
            to={cta.secondaryLink}
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={() => resetCursor()}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-md bg-brand-surface border border-brand-border text-brand-white font-mono text-sm font-bold tracking-wider uppercase hover:border-brand-border-hover hover:bg-brand-surface-elevated transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{cta.secondaryBtn}</span>
          </Link>
        </div>

        {/* Studio Technical Metadata Footer Bar */}
        <div className="mt-16 sm:mt-24 pt-8 border-t border-brand-border/40 flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-mono text-xs text-brand-muted">
          <span className="text-brand-white font-bold">HASH.DEVS</span>
          <span className="text-brand-border">•</span>
          <span>CURATED PROJECT ARCHIVE</span>
          <span className="text-brand-border">•</span>
          <span className="text-brand-neon">ACCEPTING COMMISSIONS // Q2 2026</span>
        </div>
      </MainContainer>
    </section>
  );
}

