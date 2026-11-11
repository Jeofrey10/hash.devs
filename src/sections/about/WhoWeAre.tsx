import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { ABOUT_COPY } from './aboutConfig';

export function WhoWeAre() {
  const { whoWeAre } = ABOUT_COPY;

  return (
    <section
      id="who-we-are"
      className="relative w-full bg-brand-obsidian py-24 laptop:py-36 overflow-hidden border-b border-brand-border/60 scroll-mt-12"
      aria-label="Who We Are"
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
        {/* Section Header */}
        <div className="mb-14 sm:mb-20 max-w-5xl">
          <div className="mb-6">
            <EyebrowLabel indicator index={whoWeAre.index} className="text-brand-neon font-bold">
              {whoWeAre.eyebrow}
            </EyebrowLabel>
          </div>

          <h2 className="font-display font-extrabold tracking-tight text-brand-white leading-tight text-[clamp(1.65rem,5.5vw,3.25rem)] break-words pr-2">
            {whoWeAre.heading}
          </h2>
        </div>

        {/* Asymmetric 12-Column Grid */}
        <div className="grid grid-cols-1 laptop:grid-cols-12 gap-12 laptop:gap-16 items-start">
          {/* Left Column (7 cols): Studio Prose & Engineering Blueprint */}
          <div className="laptop:col-span-7 flex flex-col gap-8 text-brand-muted font-body text-base sm:text-lg leading-relaxed">
            <p className="font-light text-brand-white/90">
              {whoWeAre.body1}
            </p>
            <p className="font-light">
              {whoWeAre.body2}
            </p>

            {/* Architectural Studio Blueprint Card */}
            <div className="mt-6 rounded-2xl border border-brand-border/80 bg-[#0E1210] p-6 sm:p-8 relative overflow-hidden">
              {/* Corner Brackets */}
              <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 h-2.5 w-2.5 border-l border-t border-brand-neon" />
              <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 h-2.5 w-2.5 border-r border-t border-brand-neon" />
              <span aria-hidden="true" className="pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l border-brand-neon" />
              <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 h-2.5 w-2.5 border-b border-r border-brand-neon" />

              <div className="flex items-center justify-between border-b border-brand-border/60 pb-3 mb-5 font-mono text-xs">
                <span className="text-brand-white font-bold tracking-widest uppercase">
                  STUDIO ARCHITECTURE // TOPOLOGY
                </span>
                <span className="text-brand-neon font-semibold">[ VERIFIED ]</span>
              </div>

              {/* Technical SVG Blueprint Visualization */}
              <div className="relative w-full h-36 flex items-center justify-center">
                <svg className="w-full h-full text-brand-neon/40" viewBox="0 0 500 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid Lines */}
                  <line x1="10" y1="60" x2="490" y2="60" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="125" y1="10" x2="125" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="250" y1="10" x2="250" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="375" y1="10" x2="375" y2="110" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Node 1: Strategy */}
                  <circle cx="125" cy="60" r="18" fill="#171A18" stroke="#35E85B" strokeWidth="2" />
                  <text x="125" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="monospace">FIRST</text>

                  {/* Node 2: Core Engineering */}
                  <rect x="220" y="36" width="60" height="48" rx="6" fill="#171A18" stroke="#35E85B" strokeWidth="2" />
                  <text x="250" y="63" textAnchor="middle" fill="#35E85B" fontSize="9" fontFamily="monospace" fontWeight="bold">ENGINE</text>

                  {/* Node 3: Experience */}
                  <circle cx="375" cy="60" r="18" fill="#171A18" stroke="#35E85B" strokeWidth="2" />
                  <text x="375" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="monospace">CRAFT</text>

                  {/* Connection Arrows */}
                  <path d="M145 60 L218 60" stroke="#35E85B" strokeWidth="1.5" markerEnd="url(#arrow)" />
                  <path d="M282 60 L355 60" stroke="#35E85B" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="mt-4 pt-3 border-t border-brand-border/60 flex items-center justify-between font-mono text-[11px] text-brand-muted">
                <span>PARADIGM: FIRST-PRINCIPLES</span>
                <span>STATE: DECOUPLED & REACTIVE</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Studio Performance Metrics */}
          <div className="laptop:col-span-5 grid grid-cols-1 sm:grid-cols-2 laptop:grid-cols-1 gap-5">
            {whoWeAre.metrics.map((metric, idx) => (
              <div
                key={idx}
                className="bg-[#0E1210] border border-brand-border/80 rounded-xl p-6 relative flex flex-col justify-between transition-colors hover:border-brand-neon/50"
              >
                <div className="flex items-baseline justify-between border-b border-brand-border/60 pb-3 mb-3">
                  <span className="font-display text-3xl sm:text-4xl font-extrabold text-brand-neon tracking-tight">
                    {metric.value}
                  </span>
                  <span className="font-mono text-[10px] text-brand-muted uppercase tracking-widest">
                    METRIC // 0{idx + 1}
                  </span>
                </div>

                <div className="font-mono text-xs font-bold text-brand-white uppercase tracking-wider mb-1">
                  {metric.label}
                </div>
                <div className="font-body text-xs text-brand-muted font-light leading-relaxed">
                  {metric.subtext}
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainContainer>
    </section>
  );
}

