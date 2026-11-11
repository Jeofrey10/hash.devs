import { forwardRef } from 'react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';

export interface HeroContentProps {
  eyebrowRef?: React.RefObject<HTMLDivElement>;
  headlineRef?: React.RefObject<HTMLHeadingElement>;
  ctaGroupRef?: React.RefObject<HTMLDivElement>;
  metaRef?: React.RefObject<HTMLDivElement>;
}

export const HeroContent = forwardRef<HTMLDivElement, HeroContentProps>(
  ({ eyebrowRef, headlineRef, ctaGroupRef, metaRef }, ref) => {
    return (
      <div ref={ref} className="relative z-content flex flex-col justify-center min-h-[100svh] py-20 laptop:py-28">
        <div className="w-full laptop:max-w-[54%] desktop:max-w-[52%] wide:max-w-[50%]">
          {/* Eyebrow Label */}
          <div ref={eyebrowRef} className="mb-6 overflow-hidden">
            <EyebrowLabel indicator index="01" className="text-brand-muted">
              INDEPENDENT CREATIVE TECHNOLOGY STUDIO
            </EyebrowLabel>
          </div>

          {/* Main Oversized Editorial Headline */}
          <h1
            ref={headlineRef}
            className="font-display font-extrabold tracking-tighter text-brand-white leading-[0.96] text-[1.85rem] sm:text-[2.6rem] tablet:text-[3.1rem] laptop:text-[3.15rem] desktop:text-[3.5rem] wide:text-[3.85rem]"
          >
            <div className="overflow-hidden">
              <span className="inline-block whitespace-nowrap hero-headline-line">WE BUILD</span>
            </div>
            <div className="overflow-hidden">
              <span className="inline-block whitespace-nowrap hero-headline-line text-brand-neon">DIGITAL</span>
            </div>
            <div className="overflow-hidden">
              <span className="inline-block whitespace-nowrap hero-headline-line">EXPERIENCES.</span>
            </div>
          </h1>

          {/* CTA Buttons */}
          <div ref={ctaGroupRef} className="mt-8 sm:mt-10 laptop:mt-12 flex flex-wrap items-center gap-4 sm:gap-6">
            <PrimaryButton href="/work" size="lg">
              EXPLORE OUR WORK
            </PrimaryButton>

            <SecondaryButton href="/contact" size="lg">
              LET'S TALK
            </SecondaryButton>
          </div>

          {/* Small Metadata Footer */}
          <div
            ref={metaRef}
            className="mt-12 sm:mt-16 flex flex-wrap items-center gap-6 sm:gap-10 border-t border-brand-border-subtle pt-6 font-mono text-[11px] text-brand-subtle uppercase tracking-wider"
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-neon" />
              <span>EST. 2026 // STUDIO ARCHITECTURE</span>
            </div>
            <div className="hidden sm:block text-brand-border">|</div>
            <div>DESIGN × DEVELOPMENT × TECHNOLOGY</div>
            <div className="hidden sm:block text-brand-border">|</div>
            <div className="text-brand-muted">SAN FRANCISCO • LONDON • TOKYO</div>
          </div>
        </div>
      </div>
    );
  }
);

HeroContent.displayName = 'HeroContent';
