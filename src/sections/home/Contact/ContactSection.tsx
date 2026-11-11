import { useEffect, useRef } from 'react';
import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { CONTACT_COPY } from './contactConfig';
import { DirectContactInfo } from './DirectContactInfo';
import { ProjectInquiryForm } from './ProjectInquiryForm';
import { initContactAnimations } from './ContactAnimations';

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const supportingTextRef = useRef<HTMLParagraphElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const headlineLines = headlineRef.current
      ? headlineRef.current.querySelectorAll<HTMLElement>('.contact-headline-line')
      : [];

    const cleanup = initContactAnimations({
      section,
      headerContainer: headerContainerRef.current,
      eyebrow: eyebrowRef.current,
      headlineLines,
      supportingText: supportingTextRef.current,
      sidebar: sidebarRef.current,
      formContainer: formRef.current,
      manifesto: manifestoRef.current,
    });

    return () => cleanup();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full bg-brand-obsidian pt-24 laptop:pt-36 pb-28 laptop:pb-36 overflow-hidden border-t border-brand-border/60 scroll-mt-12"
      aria-label="Contact and Project Initiation"
    >
      {/* Background Architectural Grid Lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <MainContainer>
        {/* Section Introduction — Minimal Responsive 2-Column Header */}
        <div
          ref={headerContainerRef}
          className="mb-12 sm:mb-16 grid grid-cols-1 laptop:grid-cols-12 gap-8 laptop:gap-12 items-end border-b border-brand-border/60 pb-10 sm:pb-14 max-w-7xl mx-auto w-full"
        >
          {/* Left Column: Eyebrow & Monumental Syne Display Headline */}
          <div className="laptop:col-span-8 min-w-0 w-full">
            <div ref={eyebrowRef} className="mb-6 overflow-hidden">
              <EyebrowLabel indicator index={CONTACT_COPY.index} className="text-brand-neon font-bold">
                {CONTACT_COPY.identifier}
              </EyebrowLabel>
            </div>

            <h2
              ref={headlineRef}
              className="font-display font-extrabold tracking-tighter text-brand-white leading-[0.92] text-[clamp(1.5rem,3.5vw,3.75rem)] min-w-0 w-full break-words"
            >
              <div className="overflow-hidden mb-1 sm:mb-2">
                <span className="inline-block contact-headline-line pr-2">
                  {CONTACT_COPY.headline.line1}
                </span>
              </div>
              <div className="overflow-hidden mb-1 sm:mb-2">
                <span className="inline-block contact-headline-line text-brand-neon pr-2">
                  {CONTACT_COPY.headline.line2}
                </span>
              </div>
              <div className="overflow-hidden">
                <span className="inline-block contact-headline-line text-brand-neon pr-2">
                  {CONTACT_COPY.headline.line3}
                </span>
              </div>
            </h2>
          </div>

          {/* Right Column: Short Studio Introduction */}
          <div className="laptop:col-span-4 min-w-0 w-full flex flex-col justify-end laptop:pb-1">
            <p
              ref={supportingTextRef}
              className="font-body text-base sm:text-lg laptop:text-xl font-light text-brand-muted leading-relaxed"
            >
              "{CONTACT_COPY.supporting}"
            </p>
          </div>
        </div>

        {/* Clean 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 laptop:grid-cols-12 gap-8 laptop:gap-12 items-stretch mb-24 laptop:mb-32 max-w-7xl mx-auto">
          {/* Left Column (Laptop: col-span-5): Direct Contact Channels */}
          <div ref={sidebarRef} className="laptop:col-span-5 h-full">
            <DirectContactInfo />
          </div>

          {/* Right Column (Laptop: col-span-7): Compact Project Inquiry Form */}
          <div ref={formRef} className="laptop:col-span-7 h-full">
            <ProjectInquiryForm />
          </div>
        </div>

        {/* Final Studio Statement & Manifesto */}
        <div
          ref={manifestoRef}
          className="pt-16 laptop:pt-24 border-t border-brand-border/60 text-center max-w-5xl mx-auto"
        >
          <div className="font-mono text-xs font-semibold text-brand-neon tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-neon" />
            <span>STUDIO MANIFESTO // FINAL POSITION</span>
          </div>

          <h3 className="font-display text-[clamp(1.25rem,4.5vw,3.5rem)] font-extrabold tracking-tight text-brand-white uppercase leading-[1.08] break-words pr-2 max-w-4xl mx-auto">
            {CONTACT_COPY.manifesto}
          </h3>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-mono text-xs text-brand-muted">
            <span className="text-brand-white font-bold">HASH.DEVS</span>
            <span className="text-brand-border">•</span>
            <span>INDEPENDENT CREATIVE TECHNOLOGY STUDIO</span>
            <span className="text-brand-border">•</span>
            <span className="text-brand-neon">SAN FRANCISCO // LONDON // TOKYO</span>
          </div>
        </div>
      </MainContainer>
    </section>
  );
}
