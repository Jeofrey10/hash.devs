import { useRef, useState } from 'react';
import {
  MainContainer,
  SectionWrapper,
  GridLayout,
  SplitLayout,
  HorizontalOverflowContainer,
  Divider,
  Spacer,
} from '@/components/layout';
import {
  PrimaryButton,
  SecondaryButton,
  TextButton,
  MagneticButton,
  StatusBadge,
  EyebrowLabel,
  TechnicalLabel,
  HoverLink,
  ImageContainer,
  MagneticElement,
  useCursor,
} from '@/components/ui';
import {
  verticalTextReveal,
  maskReveal,
  staggerReveal,
  clipPathReveal,
  fadeReveal,
} from '@/lib/animations';

export default function DesignSystemLab() {
  const { setCursor, resetCursor } = useCursor();
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Animation test targets
  const textRevealRef = useRef<HTMLHeadingElement>(null);
  const maskRevealRef = useRef<HTMLDivElement>(null);
  const staggerContainerRef = useRef<HTMLDivElement>(null);
  const clipRevealRef = useRef<HTMLDivElement>(null);
  const fadeRevealRef = useRef<HTMLDivElement>(null);

  const colors = [
    { name: 'Obsidian Black', hex: '#050505', token: '--color-obsidian', role: 'Primary Canvas' },
    { name: 'Hash Neon Green', hex: '#35E85B', token: '--color-neon', role: 'Accent / Interactive' },
    { name: 'Pure White', hex: '#FFFFFF', token: '--color-white', role: 'Headline / High Contrast' },
    { name: 'Graphite', hex: '#171A18', token: '--color-graphite', role: 'Structural Grid & Cards' },
    { name: 'Surface Elevated', hex: '#111412', token: '--color-surface-elevated', role: 'Modals / Floating' },
    { name: 'Border Standard', hex: '#1E2420', token: '--color-border', role: 'Component Outlines' },
    { name: 'Muted Slate', hex: '#8E9490', token: '--color-muted', role: 'Body Copy / Labels' },
    { name: 'Subtle Slate', hex: '#4D534F', token: '--color-subtle', role: 'Timestamps / Meta' },
  ];

  const handleCopy = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1800);
  };

  return (
    <div className="relative min-h-screen w-full bg-brand-obsidian pb-32 pt-16 text-brand-white">
      {/* Background Architectural Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-behind opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, #171A18 1px, transparent 1px), linear-gradient(to bottom, #171A18 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <MainContainer size="editorial">
        {/* Lab Header */}
        <header className="mb-16 border-b border-brand-border pb-12">
          <div className="flex flex-col justify-between gap-6 tablet:flex-row tablet:items-end">
            <div>
              <div className="flex items-center gap-3">
                <StatusBadge status="live" label="DESIGN LAB // SPEC-02" />
                <span className="font-mono text-xs text-brand-subtle">HASH.DEVS // COMPONENT SYSTEM</span>
              </div>
              <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tighter text-brand-white tablet:text-6xl laptop:text-7xl">
                DESIGN SYSTEM <span className="text-brand-neon">&amp;</span> UI LAB
              </h1>
              <p className="mt-4 max-w-2xl font-body text-base text-brand-muted">
                Architectural design tokens, fluid typographic hierarchy, physics-based magnetic interactions,
                and reusable UI components engineered for HASH.DEVS.
              </p>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs text-brand-muted">
              <a
                href="/"
                className="rounded border border-brand-border bg-brand-surface px-4 py-2 hover:border-brand-neon hover:text-brand-neon transition-colors"
              >
                &larr; BACK TO CORE PREVIEW
              </a>
            </div>
          </div>
        </header>

        {/* ==========================================================================
            01. COLOR MATRIX
            ========================================================================== */}
        <SectionWrapper spacing="sm">
          <EyebrowLabel index="01">COLOR SYSTEM &amp; PALETTE TOKENS</EyebrowLabel>
          <h2 className="mt-3 text-h2 font-bold text-brand-white">Color Matrix</h2>
          <p className="mt-2 text-body-reg text-brand-muted">
            Strict brand tokens: Obsidian, Hash Neon Green, Pure White, and Graphite. Click any card to copy its hex.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 tablet:grid-cols-4 laptop:grid-cols-4">
            {colors.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => handleCopy(c.hex)}
                className="group relative flex flex-col justify-between rounded-lg border border-brand-border bg-brand-surface p-4 text-left transition-all duration-300 hover:border-brand-neon hover:bg-brand-surface-elevated"
              >
                <div
                  className="h-16 w-full rounded border border-brand-border-subtle transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{ backgroundColor: c.hex }}
                />
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand-white">{c.name}</span>
                    <span className="font-mono text-[11px] text-brand-neon">
                      {copiedColor === c.hex ? 'COPIED!' : c.hex}
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-brand-muted">{c.token}</div>
                  <div className="mt-2 font-mono text-[10px] text-brand-subtle uppercase">{c.role}</div>
                </div>
              </button>
            ))}
          </div>
        </SectionWrapper>

        <Divider label="TYPOGRAPHY" badge="FLUID SCALING" />

        {/* ==========================================================================
            02. TYPOGRAPHY HIERARCHY
            ========================================================================== */}
        <SectionWrapper spacing="sm">
          <EyebrowLabel index="02">EDITORIAL TYPOGRAPHY</EyebrowLabel>
          <h2 className="mt-3 text-h2 font-bold text-brand-white">Fluid Typographic Scale</h2>
          <p className="mt-2 text-body-reg text-brand-muted">
            Display: <span className="text-brand-white font-semibold">Syne</span> | Body:{' '}
            <span className="text-brand-white font-semibold">Manrope</span> | Technical:{' '}
            <span className="text-brand-white font-semibold">Space Mono</span>. Responsive clamp() scaling across all screens.
          </p>

          <div className="mt-10 space-y-10 border border-brand-border bg-brand-surface/40 p-6 tablet:p-10">
            <div>
              <TechnicalLabel variant="neon">[DISPLAY XL // SYNE 800]</TechnicalLabel>
              <div className="mt-2 text-display-xl tracking-tighter text-brand-white">
                DIGITAL CREATIVE
              </div>
            </div>

            <Divider variant="subtle" />

            <div>
              <TechnicalLabel variant="neon">[DISPLAY LARGE // SYNE 700]</TechnicalLabel>
              <div className="mt-2 text-display-lg tracking-tighter text-brand-white">
                ENGINEERED EXPERIENCE
              </div>
            </div>

            <Divider variant="subtle" />

            <div className="grid grid-cols-1 gap-8 laptop:grid-cols-2">
              <div>
                <TechnicalLabel variant="border">[HEADING 1 // 40px - 64px]</TechnicalLabel>
                <h1 className="mt-2 text-h1 text-brand-white">Aesthetic Rigor</h1>
              </div>
              <div>
                <TechnicalLabel variant="border">[HEADING 2 // 30px - 48px]</TechnicalLabel>
                <h2 className="mt-2 text-h2 text-brand-white">Kinetic Precision</h2>
              </div>
              <div>
                <TechnicalLabel variant="border">[HEADING 3 // 24px - 36px]</TechnicalLabel>
                <h3 className="mt-2 text-h3 text-brand-white">Modular Architecture</h3>
              </div>
              <div>
                <TechnicalLabel variant="border">[HEADING 4 // 20px - 28px]</TechnicalLabel>
                <h4 className="mt-2 text-h4 text-brand-white">Decoupled 3D Ecosystem</h4>
              </div>
            </div>

            <Divider variant="subtle" />

            <div className="grid grid-cols-1 gap-8 laptop:grid-cols-3">
              <div>
                <TechnicalLabel variant="subtle">[BODY LARGE // 18px - 20px]</TechnicalLabel>
                <p className="mt-3 text-body-lg text-brand-muted">
                  We engineer avant-garde digital flagships, web applications and interactive 3D ecosystems
                  for high-velocity technology brands.
                </p>
              </div>
              <div>
                <TechnicalLabel variant="subtle">[BODY REGULAR // 16px]</TechnicalLabel>
                <p className="mt-3 text-body-reg text-brand-muted">
                  Every interaction is calibrated for inertia and physics. Motion is not an afterthought,
                  it is the primary structural material of the experience.
                </p>
              </div>
              <div>
                <TechnicalLabel variant="subtle">[BODY SMALL // 14px]</TechnicalLabel>
                <p className="mt-3 text-body-sm text-brand-subtle">
                  Rendered in Manrope with strict optical balancing. Supports low-contrast graphite
                  dividers and high-performance WebGL overlays.
                </p>
              </div>
            </div>
          </div>
        </SectionWrapper>

        <Divider label="INTERACTIVE BUTTONS" badge="MAGNETIC PHYSICS" />

        {/* ==========================================================================
            03. BUTTONS & MAGNETIC PHYSICS
            ========================================================================== */}
        <SectionWrapper spacing="sm">
          <EyebrowLabel index="03">INTERACTIVE CONTROLS</EyebrowLabel>
          <h2 className="mt-3 text-h2 font-bold text-brand-white">Buttons &amp; Magnetic Triggers</h2>
          <p className="mt-2 text-body-reg text-brand-muted">
            All buttons support magnetic physics on non-touch screens, keyboard focus outlines, and arrow choreography.
          </p>

          <div className="mt-8 space-y-8 rounded-lg border border-brand-border bg-brand-surface/40 p-6 tablet:p-10">
            {/* Primary Buttons */}
            <div>
              <div className="mb-4 font-mono text-xs uppercase tracking-wider text-brand-muted">
                Primary Button (Sizes: sm, md, lg)
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <PrimaryButton size="sm">Explore Work</PrimaryButton>
                <PrimaryButton size="md">Start Project</PrimaryButton>
                <PrimaryButton size="lg">Initialize Studio</PrimaryButton>
                <PrimaryButton size="md" disabled>
                  Disabled
                </PrimaryButton>
              </div>
            </div>

            <Divider variant="subtle" />

            {/* Secondary Buttons */}
            <div>
              <div className="mb-4 font-mono text-xs uppercase tracking-wider text-brand-muted">
                Secondary Button (Graphite Outline &amp; Glow)
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <SecondaryButton size="sm">Capabilities</SecondaryButton>
                <SecondaryButton size="md">View Case Studies</SecondaryButton>
                <SecondaryButton size="lg">Download Deck</SecondaryButton>
              </div>
            </div>

            <Divider variant="subtle" />

            {/* Text Buttons & Links */}
            <div>
              <div className="mb-4 font-mono text-xs uppercase tracking-wider text-brand-muted">
                Text Button &amp; Hover Links (Underline sweep)
              </div>
              <div className="flex flex-wrap items-center gap-8">
                <TextButton arrowDirection="up-right">Schedule Discovery Call</TextButton>
                <TextButton arrowDirection="right">View All Archives</TextButton>
                <HoverLink href="#" external>
                  GitHub Repository
                </HoverLink>
                <HoverLink href="#" external cursorLabel="TWITTER">
                  @hash_devs
                </HoverLink>
              </div>
            </div>

            <Divider variant="subtle" />

            {/* Circular Magnetic Triggers */}
            <div>
              <div className="mb-4 font-mono text-xs uppercase tracking-wider text-brand-muted">
                Magnetic Circular Action Triggers (Trionn-style inertia attraction)
              </div>
              <div className="flex flex-wrap items-center gap-8">
                <MagneticButton size="sm" variant="neon" cursorLabel="PLAY">
                  PLAY
                </MagneticButton>
                <MagneticButton size="md" variant="outline" cursorLabel="EXPLORE">
                  EXPLORE
                </MagneticButton>
                <MagneticButton size="lg" variant="glass" cursorLabel="DISCOVER">
                  DISCOVER
                </MagneticButton>
              </div>
            </div>
          </div>
        </SectionWrapper>

        <Divider label="LABELS & STATUS" badge="SEMANTIC DATA" />

        {/* ==========================================================================
            04. STATUS BADGES & TECHNICAL LABELS
            ========================================================================== */}
        <SectionWrapper spacing="sm">
          <EyebrowLabel index="04">SEMANTIC LABELS</EyebrowLabel>
          <h2 className="mt-3 text-h2 font-bold text-brand-white">Status Badges &amp; Metadata</h2>

          <div className="mt-8 space-y-6 rounded-lg border border-brand-border bg-brand-surface/40 p-6 tablet:p-10">
            <div>
              <div className="mb-3 font-mono text-xs uppercase tracking-wider text-brand-muted">
                Studio Status Indicators (Pulse &amp; Non-pulse)
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status="active" label="AVAILABLE FOR Q1/Q2" />
                <StatusBadge status="live" label="CORE ENGINE 60FPS" />
                <StatusBadge status="warning" label="BOOKED THROUGH MARCH" />
                <StatusBadge status="error" label="MAINTENANCE WINDOW" />
                <StatusBadge status="idle" label="STANDBY MODE" />
              </div>
            </div>

            <Divider variant="subtle" />

            <div>
              <div className="mb-3 font-mono text-xs uppercase tracking-wider text-brand-muted">
                Eyebrow Section Kickers
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <EyebrowLabel index="01">CAPABILITIES MATRIX</EyebrowLabel>
                <EyebrowLabel index="02">FEATURED ARCHIVE</EyebrowLabel>
                <EyebrowLabel index="03">ENGINEERING PRINCIPLES</EyebrowLabel>
                <EyebrowLabel indicator={false}>CLIENT ROSTER</EyebrowLabel>
              </div>
            </div>

            <Divider variant="subtle" />

            <div>
              <div className="mb-3 font-mono text-xs uppercase tracking-wider text-brand-muted">
                Technical Data Readouts
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <TechnicalLabel variant="neon">[LAT: 37.7749 // LNG: -122.4194]</TechnicalLabel>
                <TechnicalLabel variant="border">BUILD: v0.2.0-STABLE</TechnicalLabel>
                <TechnicalLabel variant="code">const studio = new HashDevs();</TechnicalLabel>
                <TechnicalLabel variant="subtle">FRAME_TIME: 16.6ms // VSYNC</TechnicalLabel>
              </div>
            </div>
          </div>
        </SectionWrapper>

        <Divider label="LAYOUT ARCHITECTURE" badge="ASYMMETRIC GRIDS" />

        {/* ==========================================================================
            05. LAYOUT GRIDS & ASYMMETRIC SPLIT
            ========================================================================== */}
        <SectionWrapper spacing="sm">
          <EyebrowLabel index="05">EDITORIAL LAYOUT ENGINE</EyebrowLabel>
          <h2 className="mt-3 text-h2 font-bold text-brand-white">Asymmetric Grids &amp; Containers</h2>
          <p className="mt-2 text-body-reg text-brand-muted">
            Flexible, non-generic layouts. Avoids repetitive centered card templates.
          </p>

          <div className="mt-8 space-y-8">
            {/* Split Layout Demo */}
            <div className="rounded-lg border border-brand-border bg-brand-surface/40 p-6 tablet:p-8">
              <div className="mb-4 font-mono text-xs text-brand-neon">[SPLIT LAYOUT // 1:2 EDITORIAL RATIO]</div>
              <SplitLayout
                ratio="1:2"
                stickyLeft
                leftContent={
                  <div className="border border-brand-border-subtle bg-brand-surface p-6">
                    <span className="font-mono text-xs text-brand-neon">// STICKY LEFT COLUMN</span>
                    <h3 className="mt-2 text-h3 font-bold text-brand-white">Creative Manifesto</h3>
                    <p className="mt-3 text-body-sm text-brand-muted">
                      This left sidebar pins cleanly on laptops while the right column scrolls freely.
                    </p>
                  </div>
                }
                rightContent={
                  <div className="space-y-4">
                    <div className="border border-brand-border-subtle bg-brand-surface p-6">
                      <h4 className="text-h4 font-bold text-brand-white">01 / Motion Engineering</h4>
                      <p className="mt-2 text-body-sm text-brand-muted">
                        Centralizing GSAP ticker with Lenis scroll engine eliminates conflicting requestAnimationFrame loops.
                      </p>
                    </div>
                    <div className="border border-brand-border-subtle bg-brand-surface p-6">
                      <h4 className="text-h4 font-bold text-brand-white">02 / Editorial Brutalism</h4>
                      <p className="mt-2 text-body-sm text-brand-muted">
                        Using high typographic contrast to communicate digital authority without neon clutter.
                      </p>
                    </div>
                  </div>
                }
              />
            </div>

            {/* 12-Column Grid Demonstration */}
            <div className="rounded-lg border border-brand-border bg-brand-surface/40 p-6 tablet:p-8">
              <div className="mb-4 font-mono text-xs text-brand-neon">[12-COLUMN EDITORIAL GRID]</div>
              <GridLayout cols={12} gap="sm">
                <div className="col-span-4 rounded border border-brand-border bg-brand-surface p-4 text-center font-mono text-xs text-brand-muted">
                  COL-SPAN 4 (1/3)
                </div>
                <div className="col-span-8 rounded border border-brand-border bg-brand-surface p-4 text-center font-mono text-xs text-brand-muted">
                  COL-SPAN 8 (2/3)
                </div>
                <div className="col-span-3 rounded border border-brand-border bg-brand-surface p-4 text-center font-mono text-xs text-brand-muted">
                  COL 3
                </div>
                <div className="col-span-6 rounded border border-brand-border bg-brand-surface p-4 text-center font-mono text-xs text-brand-muted">
                  COL 6 (CENTER STAGE)
                </div>
                <div className="col-span-3 rounded border border-brand-border bg-brand-surface p-4 text-center font-mono text-xs text-brand-muted">
                  COL 3
                </div>
              </GridLayout>
            </div>

            {/* Horizontal Overflow Container */}
            <div className="rounded-lg border border-brand-border bg-brand-surface/40 p-6 tablet:p-8">
              <div className="mb-4 font-mono text-xs text-brand-neon">
                [HORIZONTAL OVERFLOW CONTAINER // CASE STUDY TICKER]
              </div>
              <HorizontalOverflowContainer itemGap="md">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="h-44 w-72 shrink-0 rounded border border-brand-border bg-brand-surface p-6 transition-all duration-300 hover:border-brand-neon"
                  >
                    <span className="font-mono text-xs text-brand-neon">PROJECT 0{item}</span>
                    <h4 className="mt-2 text-h4 font-bold text-brand-white">NEXUS PROTOCOL</h4>
                    <p className="mt-2 text-xs text-brand-muted">Interactive 3D Web Platform</p>
                  </div>
                ))}
              </HorizontalOverflowContainer>
            </div>
          </div>
        </SectionWrapper>

        <Divider label="INTERACTION & CURSOR" badge="STATE ENGINE" />

        {/* ==========================================================================
            06. CURSOR STATES & IMAGE SCALING
            ========================================================================== */}
        <SectionWrapper spacing="sm">
          <EyebrowLabel index="06">CURSOR &amp; MEDIA INTERACTION</EyebrowLabel>
          <h2 className="mt-3 text-h2 font-bold text-brand-white">Cursor Hover Zones &amp; Media Scaling</h2>
          <p className="mt-2 text-body-reg text-brand-muted">
            Move your mouse over the zones below to trigger dynamic cursor states. (Disabled on touch devices).
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 tablet:grid-cols-3">
            {/* Zone 1: View State */}
            <div
              className="flex h-52 flex-col items-center justify-center rounded-lg border border-brand-border bg-brand-surface p-6 text-center transition-colors hover:border-brand-neon"
              onMouseEnter={() => setCursor('view', 'VIEW')}
              onMouseLeave={() => resetCursor()}
            >
              <span className="font-mono text-xs text-brand-neon">// HOVER ZONE A</span>
              <h4 className="mt-2 text-h4 font-bold text-brand-white">View Mode</h4>
              <p className="mt-1 text-xs text-brand-muted">Expands cursor to VIEW capsule</p>
            </div>

            {/* Zone 2: Drag State */}
            <div
              className="flex h-52 flex-col items-center justify-center rounded-lg border border-brand-border bg-brand-surface p-6 text-center transition-colors hover:border-brand-neon"
              onMouseEnter={() => setCursor('drag', 'DRAG')}
              onMouseLeave={() => resetCursor()}
            >
              <span className="font-mono text-xs text-brand-neon">// HOVER ZONE B</span>
              <h4 className="mt-2 text-h4 font-bold text-brand-white">Drag Mode</h4>
              <p className="mt-1 text-xs text-brand-muted">Expands cursor to DRAG capsule</p>
            </div>

            {/* Zone 3: Magnetic Element */}
            <div className="flex h-52 flex-col items-center justify-center rounded-lg border border-brand-border bg-brand-surface p-6 text-center">
              <span className="font-mono text-xs text-brand-neon">// HOVER ZONE C</span>
              <div className="mt-4">
                <MagneticElement cursorLabel="PULL">
                  <div className="rounded-full border border-brand-neon bg-brand-neon/10 px-6 py-3 font-mono text-xs font-bold text-brand-neon">
                    MAGNETIC ELEMENT
                  </div>
                </MagneticElement>
              </div>
            </div>
          </div>

          {/* Media Frame Demo */}
          <div className="mt-8">
            <div className="mb-2 font-mono text-xs text-brand-muted">[MEDIA FRAME WITH HOVER SCALE]</div>
            <ImageContainer aspectRatio="21/9" cursorLabel="EXPLORE">
              <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-graphite to-brand-surface">
                <div className="text-center">
                  <span className="font-mono text-xs text-brand-neon">[SHOWREEL VIEWPORT]</span>
                  <div className="mt-1 text-h3 font-bold text-brand-white">CINEMATIC FRAMEWORK</div>
                </div>
              </div>
            </ImageContainer>
          </div>
        </SectionWrapper>

        <Divider label="REVEAL ENGINE" badge="GSAP UTILITIES" />

        {/* ==========================================================================
            07. ANIMATION REVEAL ENGINE
            ========================================================================== */}
        <SectionWrapper spacing="sm">
          <EyebrowLabel index="07">ANIMATION ARCHITECTURE</EyebrowLabel>
          <h2 className="mt-3 text-h2 font-bold text-brand-white">Reusable Reveal Utilities</h2>
          <p className="mt-2 text-body-reg text-brand-muted">
            Test the GSAP reveal primitives with immediate trigger execution and automatic reduced-motion handling.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 laptop:grid-cols-2">
            {/* Vertical Text Reveal */}
            <div className="rounded-lg border border-brand-border bg-brand-surface p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-brand-neon">// VERTICAL TEXT REVEAL</span>
                <button
                  type="button"
                  onClick={() => verticalTextReveal(textRevealRef.current)}
                  className="rounded border border-brand-border px-3 py-1 font-mono text-xs hover:border-brand-neon hover:text-brand-neon"
                >
                  RE-PLAY
                </button>
              </div>
              <div className="mt-6 overflow-hidden border-t border-brand-border-subtle pt-4">
                <h3 ref={textRevealRef} className="text-h3 font-bold text-brand-white">
                  Kinetic Skew &amp; Translation
                </h3>
              </div>
            </div>

            {/* Mask Reveal */}
            <div className="rounded-lg border border-brand-border bg-brand-surface p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-brand-neon">// MASK CLIP REVEAL</span>
                <button
                  type="button"
                  onClick={() => maskReveal(maskRevealRef.current)}
                  className="rounded border border-brand-border px-3 py-1 font-mono text-xs hover:border-brand-neon hover:text-brand-neon"
                >
                  RE-PLAY
                </button>
              </div>
              <div className="mt-6 border-t border-brand-border-subtle pt-4">
                <div
                  ref={maskRevealRef}
                  className="rounded bg-brand-graphite p-4 font-mono text-sm text-brand-neon"
                >
                  clip-path: inset(0% 0% 0% 0%)
                </div>
              </div>
            </div>

            {/* Stagger List Reveal */}
            <div className="rounded-lg border border-brand-border bg-brand-surface p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-brand-neon">// STAGGER REVEAL</span>
                <button
                  type="button"
                  onClick={() => {
                    if (staggerContainerRef.current) {
                      staggerReveal(staggerContainerRef.current.children);
                    }
                  }}
                  className="rounded border border-brand-border px-3 py-1 font-mono text-xs hover:border-brand-neon hover:text-brand-neon"
                >
                  RE-PLAY
                </button>
              </div>
              <div
                ref={staggerContainerRef}
                className="mt-6 flex flex-wrap gap-2 border-t border-brand-border-subtle pt-4"
              >
                {['WebGL', 'GSAP', 'Lenis', 'React 18', 'Tailwind', 'Three.js'].map((t) => (
                  <span
                    key={t}
                    className="rounded border border-brand-border bg-brand-surface-elevated px-3 py-1 font-mono text-xs text-brand-white"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Fade & Scale Clip Reveal */}
            <div className="rounded-lg border border-brand-border bg-brand-surface p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-brand-neon">// CURTAIN CLIP-PATH REVEAL</span>
                <button
                  type="button"
                  onClick={() => {
                    clipPathReveal(clipRevealRef.current);
                    fadeReveal(fadeRevealRef.current);
                  }}
                  className="rounded border border-brand-border px-3 py-1 font-mono text-xs hover:border-brand-neon hover:text-brand-neon"
                >
                  RE-PLAY
                </button>
              </div>
              <div className="mt-6 border-t border-brand-border-subtle pt-4">
                <div
                  ref={clipRevealRef}
                  className="flex h-24 items-center justify-center rounded bg-gradient-to-r from-brand-neon to-brand-graphite font-mono font-bold text-brand-obsidian"
                >
                  EXPANDING CURTAIN
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>

        <Spacer size="2xl" />
      </MainContainer>
    </div>
  );
}

