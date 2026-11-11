import { forwardRef } from 'react';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';

export interface HeroContentProps {
  eyebrowRef?: React.RefObject<HTMLDivElement>;
  headlineRef?: React.RefObject<HTMLHeadingElement>;
  supportingTextRef?: React.RefObject<HTMLParagraphElement>;
  ctaGroupRef?: React.RefObject<HTMLDivElement>;
  metaRef?: React.RefObject<HTMLDivElement>;
  mobileScene?: React.ReactNode;
}

export const HeroContent = forwardRef<HTMLDivElement, HeroContentProps>(
  ({ eyebrowRef, headlineRef, supportingTextRef, ctaGroupRef, metaRef, mobileScene }, ref) => {
    return (
      <div
        ref={ref}
        className="relative z-content flex flex-col justify-center min-h-[100svh] pt-24 xs:pt-28 sm:pt-32 laptop:pt-28 pb-12 sm:pb-16 laptop:pb-28"
      >
        <div className="w-full laptop:max-w-[56%] desktop:max-w-[52%] wide:max-w-[50%]">
          {/* Eyebrow Label */}
          <div ref={eyebrowRef} className="mb-4 sm:mb-6 overflow-hidden">
            <EyebrowLabel indicator index="01" className="text-brand-muted font-medium">
              INDEPENDENT CREATIVE TECHNOLOGY STUDIO
            </EyebrowLabel>
          </div>

          {/* Main Oversized Editorial Headline */}
          <h1
            ref={headlineRef}
            className="font-display font-extrabold tracking-tighter text-brand-white leading-[0.94] text-[clamp(1.85rem,6.8vw,3.85rem)] min-w-0 w-full break-words"
          >
            <div className="overflow-hidden mb-1">
              <span className="inline-block hero-headline-line pr-2">WE BUILD</span>
            </div>
            <div className="overflow-hidden mb-1">
              <span className="inline-block hero-headline-line text-brand-neon pr-2">DIGITAL</span>
            </div>
            <div className="overflow-hidden">
              <span className="inline-block hero-headline-line pr-2">EXPERIENCES.</span>
            </div>
          </h1>

          {/* Supporting Studio Description (Comfortable line spacing, deliberate editorial prose) */}
          <p
            ref={supportingTextRef}
            className="mt-5 sm:mt-6 font-body text-base sm:text-lg laptop:text-xl font-light text-brand-muted leading-relaxed max-w-xl"
          >
            We engineer high-performance digital products, intelligent systems, and immersive web
            experiences for ambitious brands and enterprise innovators.
          </p>

          {/* Dedicated Mobile 3D Emblem Stage (Only rendered on mobile/tablet viewports) */}
          {mobileScene && (
            <div className="block laptop:hidden my-6 xs:my-8 w-full max-w-md mx-auto">
              {mobileScene}
            </div>
          )}

          {/* Primary & Secondary CTA Buttons */}
          <div
            ref={ctaGroupRef}
            className="mt-6 sm:mt-8 laptop:mt-10 flex flex-wrap items-center gap-4 sm:gap-6"
          >
            <PrimaryButton href="/work" size="lg" className="w-full xs:w-auto text-center justify-center">
              EXPLORE OUR WORK
            </PrimaryButton>

            <SecondaryButton href="/contact" size="lg" className="w-full xs:w-auto text-center justify-center">
              LET'S TALK
            </SecondaryButton>
          </div>

          {/* Architectural Technical Metadata Footer */}
          <div
            ref={metaRef}
            className="mt-10 sm:mt-14 flex flex-wrap items-center gap-4 sm:gap-8 border-t border-brand-border-subtle pt-6 font-mono text-[11px] text-brand-subtle uppercase tracking-wider"
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-neon animate-pulse" />
              <span className="text-brand-white/80 font-semibold">EST. 2026 // STUDIO ARCHITECTURE</span>
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
