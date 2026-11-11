import { useRef, useState } from 'react';
import { MainContainer } from '@/components/layout';
import { HeroScene } from './HeroScene';
import { HeroContent } from './HeroContent';
import { playHeroIntro } from '@/components/animations/HeroIntro';
import { setupHeroScrollTransition } from './HeroScrollTransition';
import { useGsapContext } from '@/hooks/useGsapContext';

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const supportingTextRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);

  // GSAP Context for both entrance sequence and scroll transition
  useGsapContext(() => {
    if (!sectionRef.current || !contentWrapperRef.current) return;

    // 1. Play entrance intro timeline
    const headlineLines = headlineRef.current?.querySelectorAll<HTMLElement>('.hero-headline-line') || [];
    playHeroIntro({
      container: sectionRef.current,
      eyebrow: eyebrowRef.current,
      headlineLines,
      supportingText: supportingTextRef.current,
      ctaGroup: ctaGroupRef.current,
      meta: metaRef.current,
    });

    // 2. Setup scroll-linked exit scrub
    const trigger = setupHeroScrollTransition({
      triggerElement: sectionRef.current,
      contentElement: contentWrapperRef.current,
      onScrollProgress: (progress) => {
        setScrollProgress(progress);
      },
    });

    return () => {
      trigger?.kill();
    };
  }, sectionRef);

  return (
    <section
      ref={sectionRef}
      id="hero-section"
      className="relative w-full min-h-[100svh] overflow-hidden bg-brand-obsidian"
    >
      {/* 1. Subtle Architectural Grid Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-15"
        style={{
          backgroundImage:
            'linear-gradient(to right, #171A18 1px, transparent 1px), linear-gradient(to bottom, #171A18 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* 2. Atmospheric Radial Glow (Controlled depth & contrast, no purple/blue gradients) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-1/4 z-0 h-[650px] w-[650px] rounded-full bg-brand-neon/5 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-1/3 z-0 h-[450px] w-[450px] rounded-full bg-brand-graphite/40 blur-[100px]"
      />

      {/* 3. Three.js 3D Emblem Canvas Scene — Desktop Full-Screen Canvas (laptop: and up) */}
      <div className="hidden laptop:block">
        <HeroScene scrollProgress={scrollProgress} />
      </div>

      {/* 4. Foreground Hero Typography & Interactive Content */}
      <MainContainer size="default" className="relative z-content">
        <HeroContent
          ref={contentWrapperRef}
          eyebrowRef={eyebrowRef}
          headlineRef={headlineRef}
          supportingTextRef={supportingTextRef}
          ctaGroupRef={ctaGroupRef}
          metaRef={metaRef}
          mobileScene={<HeroScene scrollProgress={scrollProgress} isMobileInline />}
        />
      </MainContainer>

      {/* 5. Minimalist Scroll Indicator */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-content hidden tablet:flex flex-col items-center gap-2 font-mono text-[10px] tracking-widest text-brand-subtle uppercase transition-opacity duration-300"
        style={{ opacity: Math.max(0, 1 - scrollProgress * 3) }}
      >
        <span>SCROLL TO EXPLORE</span>
        <div className="h-6 w-[1.5px] bg-brand-border overflow-hidden">
          <div className="h-3 w-full bg-brand-neon animate-bounce" />
        </div>
      </div>
    </section>
  );
}
