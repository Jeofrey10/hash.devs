import { Link } from 'react-router-dom';
import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { ABOUT_COPY } from './aboutConfig';

export function AboutCollaborationCTA() {
  const { cta } = ABOUT_COPY;

  return (
    <section
      id="about-cta"
      className="relative w-full bg-brand-obsidian py-24 laptop:py-36 overflow-hidden border-b border-brand-border/60 scroll-mt-12 text-center"
      aria-label="Collaboration Invitation"
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
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Eyebrow */}
          <div className="mb-8">
            <EyebrowLabel indicator index={cta.index} className="text-brand-neon font-bold">
              {cta.eyebrow}
            </EyebrowLabel>
          </div>

          {/* Monumental Headline */}
          <h2 className="font-display font-extrabold tracking-tighter text-brand-white leading-[0.94] text-3xl xs:text-4xl sm:text-5xl tablet:text-6xl laptop:text-7xl desktop:text-[5rem] uppercase">
            <div>{cta.headline.line1}</div>
            <div className="text-brand-neon mt-1">{cta.headline.line2}</div>
          </h2>

          <p className="mt-8 font-body text-base sm:text-lg laptop:text-xl font-light text-brand-muted leading-relaxed max-w-2xl text-center">
            {cta.statement}
          </p>

          {/* Action CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to={cta.buttonLink}
              className="px-10 py-4 rounded-full font-mono text-xs font-bold tracking-widest uppercase bg-brand-neon hover:bg-[#2ED150] text-brand-obsidian shadow-[0_0_20px_rgba(53,232,91,0.35)] hover:shadow-[0_0_30px_rgba(53,232,91,0.55)] transition-all transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian"
            >
              {cta.buttonText}
            </Link>

            <Link
              to={cta.secondaryLink}
              className="font-mono text-xs font-semibold text-brand-white hover:text-brand-neon transition-colors underline underline-offset-4 decoration-brand-border hover:decoration-brand-neon px-4 py-2"
            >
              {cta.secondaryText}
            </Link>
          </div>

          <div className="mt-16 pt-8 border-t border-brand-border/40 w-full flex items-center justify-center gap-4 font-mono text-xs text-brand-muted">
            <span className="text-brand-neon">■</span>
            <span>NEXT DISCIPLINE: EDITORIAL PERSPECTIVE // LET'S WORK TOGETHER</span>
          </div>
        </div>
      </MainContainer>
    </section>
  );
}

