import { useRef } from 'react';
import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { CapabilityPanel, type CapabilityItem } from './CapabilityPanel';
import { useGsapContext } from '@/hooks/useGsapContext';
import { animateStudioShowcase } from './StudioShowcaseAnimations';

const CAPABILITIES: CapabilityItem[] = [
  {
    id: 'digital-experience',
    number: '01',
    title: 'DIGITAL EXPERIENCE',
    category: 'INTERACTIVE ARCHITECTURE',
    description:
      'Premium websites, immersive interfaces, interactive experiences and conversion-focused digital platforms engineered for cultural and commercial impact.',
    tags: ['Headless Platforms', 'Interactive 3D', 'Motion Systems', 'Design Systems'],
    visualType: 'experience',
  },
  {
    id: 'brand-identity',
    number: '02',
    title: 'BRAND & IDENTITY',
    category: 'SYSTEMIC DESIGN',
    description:
      'Visual identities, digital branding systems, creative direction and distinctive brand experiences crafted with Swiss precision and brutalist boldness.',
    tags: ['Visual Architecture', 'Type Engineering', 'Motion Guidelines', 'Brand Kernels'],
    visualType: 'identity',
  },
  {
    id: 'ai-intelligent-systems',
    number: '03',
    title: 'AI & INTELLIGENT SYSTEMS',
    category: 'COGNITIVE ENGINEERING',
    description:
      'AI-powered applications, intelligent automation, custom agent integrations and next-generation digital products built on production-grade neural pipelines.',
    tags: ['LLM Pipelines', 'Agent Architectures', 'Real-time Telemetry', 'Neural Workflows'],
    visualType: 'ai',
  },
  {
    id: 'creative-engineering',
    number: '04',
    title: 'CREATIVE ENGINEERING',
    category: 'HARDWARE-ACCELERATED WEB',
    description:
      '3D experiences, WebGL environments, motion design, advanced interactions and experimental web technologies pushing the boundaries of real-time browser execution.',
    tags: ['Three.js & GLSL', 'Custom Shaders', 'Physics Engines', 'WebGL 2.0'],
    visualType: 'engineering',
  },
];

export function StudioShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const slatsContainerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const supportingTextRef = useRef<HTMLParagraphElement>(null);
  const panelsGridRef = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    if (!sectionRef.current) return;

    const slats = slatsContainerRef.current?.querySelectorAll<HTMLElement>('.shutter-slat') || [];
    const headlineLines = headlineRef.current?.querySelectorAll<HTMLElement>('.showcase-headline-line') || [];
    const panels = panelsGridRef.current?.querySelectorAll<HTMLElement>('.capability-panel-wrapper') || [];

    const cleanup = animateStudioShowcase({
      section: sectionRef.current,
      slats,
      eyebrow: eyebrowRef.current,
      headlineLines,
      supportingText: supportingTextRef.current,
      panelsGrid: panelsGridRef.current,
      panels,
    });

    return cleanup;
  }, sectionRef);

  return (
    <section
      ref={sectionRef}
      id="studio-showcase"
      className="relative w-full bg-brand-obsidian pt-16 sm:pt-20 laptop:pt-24 pb-24 sm:pb-32 laptop:pb-40 overflow-hidden border-t border-brand-border"
    >
      {/* 1. Cinematic Horizontal Slat Shutter Transition */}
      <div
        ref={slatsContainerRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 z-30 flex flex-col h-screen min-h-[100svh] w-full overflow-hidden"
      >
        <div className="shutter-slat h-[25.2%] w-full bg-[#141715] -mb-[1px] border-b border-brand-border/40 will-change-transform shadow-[0_6px_24px_rgba(0,0,0,0.6)]" />
        <div className="shutter-slat h-[25.2%] w-full bg-[#111412] -mb-[1px] border-b border-brand-border/40 will-change-transform shadow-[0_6px_24px_rgba(0,0,0,0.6)]" />
        <div className="shutter-slat h-[25.2%] w-full bg-[#0E110F] -mb-[1px] border-b border-brand-border/40 will-change-transform shadow-[0_6px_24px_rgba(0,0,0,0.6)]" />
        <div className="shutter-slat h-[25.2%] w-full bg-[#090C0A] will-change-transform shadow-[0_6px_24px_rgba(0,0,0,0.6)]" />
      </div>

      {/* 2. Atmospheric Background Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, #171A18 1px, transparent 1px), linear-gradient(to bottom, #171A18 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <MainContainer size="default" className="relative z-content">
        {/* Top Section Header */}
        <div className="mb-16 sm:mb-24 flex flex-col laptop:flex-row laptop:items-end justify-between gap-10 border-b border-brand-border pb-12 sm:pb-16">
          <div className="w-full laptop:w-auto laptop:flex-1 max-w-4xl wide:max-w-5xl">
            <div ref={eyebrowRef} className="mb-6 overflow-hidden">
              <EyebrowLabel indicator index="03" className="text-brand-neon font-bold">
                WHAT WE DO
              </EyebrowLabel>
            </div>

            <h2
              ref={headlineRef}
              className="font-display font-extrabold tracking-tighter text-brand-white leading-[0.92] text-[clamp(1.75rem,6.8vw,5.5rem)] break-words pr-2"
            >
              <div className="overflow-hidden mb-1 sm:mb-2">
                <span className="inline-block pr-2 showcase-headline-line">
                  DESIGNING
                </span>
              </div>
              <div className="overflow-hidden">
                <span className="inline-block pr-2 showcase-headline-line text-brand-white">
                  WHAT'S <span className="text-brand-neon">NEXT.</span>
                </span>
              </div>
            </h2>
          </div>

          <div className="max-w-xs laptop:max-w-sm shrink-0 laptop:pb-2">
            <p
              ref={supportingTextRef}
              className="font-body text-base sm:text-lg laptop:text-xl font-light text-brand-muted leading-relaxed"
            >
              "We combine creative thinking, intelligent technology and precision engineering to
              build experiences that move businesses forward."
            </p>
          </div>
        </div>

        {/* Asymmetric 4-Panel Editorial Capabilities Matrix */}
        <div
          ref={panelsGridRef}
          className="grid grid-cols-1 laptop:grid-cols-2 gap-8 sm:gap-10 laptop:gap-12 items-start"
        >
          {/* Column 1: Panels 01 & 03 */}
          <div className="flex flex-col gap-8 sm:gap-10 laptop:gap-12">
            <div className="capability-panel-wrapper">
              <CapabilityPanel item={CAPABILITIES[0]} />
            </div>
            <div className="capability-panel-wrapper">
              <CapabilityPanel item={CAPABILITIES[2]} />
            </div>
          </div>

          {/* Column 2: Panels 02 & 04 (With intentional editorial top offset on desktop) */}
          <div className="flex flex-col gap-8 sm:gap-10 laptop:gap-12 laptop:pt-16">
            <div className="capability-panel-wrapper">
              <CapabilityPanel item={CAPABILITIES[1]} />
            </div>
            <div className="capability-panel-wrapper">
              <CapabilityPanel item={CAPABILITIES[3]} />
            </div>
          </div>
        </div>

        {/* Bottom Technical Status Bar */}
        <div className="mt-16 sm:mt-24 pt-8 border-t border-brand-border/60 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-brand-muted">
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-neon" />
            <span>DISCIPLINES: 04 ACTIVE VECTORS</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline-block">STANDARDS: ISO // POST-DIGITAL</span>
            <span className="text-brand-neon font-bold">HASH.DEVS // STUDIO LABS</span>
          </div>
        </div>
      </MainContainer>
    </section>
  );
}

