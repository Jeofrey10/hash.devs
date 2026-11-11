import { useState } from 'react';
import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { SERVICES_COPY } from './servicesConfig';
import { cn } from '@/lib/utils';

export function EngineeringApproach() {
  const { methodology } = SERVICES_COPY;
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section
      id="engineering-methodology"
      className="relative w-full bg-brand-obsidian py-24 sm:py-32 laptop:py-40 border-b border-brand-border/60 overflow-hidden"
      aria-label="Engineering Methodology"
    >
      {/* Background Subtle Coordinate Lines */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      <MainContainer className="relative z-10 w-full">
        {/* Section Header */}
        <div className="mb-14 sm:mb-20">
          <div className="mb-6">
            <EyebrowLabel indicator index={methodology.index} className="text-brand-neon font-bold">
              {methodology.eyebrow}
            </EyebrowLabel>
          </div>

          <div className="grid grid-cols-1 laptop:grid-cols-12 gap-8 items-end justify-between pb-8 border-b border-brand-border/60">
            <div className="laptop:col-span-8 min-w-0 pr-2">
              <h2 className="font-display font-extrabold tracking-tight text-brand-white leading-[1.0] text-[clamp(1.75rem,5.5vw,3.75rem)] break-words">
                {methodology.headline}
              </h2>
            </div>

            <div className="laptop:col-span-4 min-w-0 font-mono text-xs text-brand-muted flex items-center justify-start laptop:justify-end gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-neon animate-pulse" />
              <span>FOUR-TIER CONTINUOUS ENGINEERING LIFECYCLE</span>
            </div>
          </div>
        </div>

        {/* 4-Stage Horizontal Process Timeline & Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 laptop:grid-cols-4 gap-6 items-stretch">
          {methodology.stages.map((stage, idx) => {
            const isActive = activeStage === idx;
            return (
              <div
                key={stage.step}
                onMouseEnter={() => setActiveStage(idx)}
                className={cn(
                  'relative p-5 sm:p-6 laptop:p-6 rounded-lg border transition-all duration-300 flex flex-col justify-between group cursor-default min-w-0 w-full h-full overflow-hidden',
                  isActive
                    ? 'border-brand-neon/60 bg-brand-surface/80 shadow-[0_4px_30px_rgba(53,232,91,0.06)]'
                    : 'border-brand-border/60 bg-brand-surface/30 hover:border-brand-border-hover'
                )}
              >
                {/* Corner Brackets */}
                <span className="absolute top-2 left-2 font-mono text-[9px] text-brand-neon/40 select-none">
                  ⌜
                </span>
                <span className="absolute top-2 right-2 font-mono text-[9px] text-brand-neon/40 select-none">
                  ⌝
                </span>
                <span className="absolute bottom-2 left-2 font-mono text-[9px] text-brand-neon/40 select-none">
                  ⌞
                </span>
                <span className="absolute bottom-2 right-2 font-mono text-[9px] text-brand-neon/40 select-none">
                  ⌟
                </span>

                <div className="min-w-0 w-full">
                  {/* Stage Number & Indicator */}
                  <div className="flex items-center justify-between font-mono text-xs mb-4 min-w-0">
                    <span
                      className={cn(
                        'font-bold text-xl transition-colors duration-200',
                        isActive ? 'text-brand-neon' : 'text-brand-muted'
                      )}
                    >
                      {stage.step}
                    </span>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] tracking-wider uppercase border shrink-0',
                        isActive
                          ? 'border-brand-neon/40 bg-brand-neon/10 text-brand-neon font-bold'
                          : 'border-brand-border text-brand-muted/70'
                      )}
                    >
                      PHASE // {stage.step}
                    </span>
                  </div>

                  {/* Stage Title */}
                  <h3 className="font-display font-extrabold text-xl sm:text-2xl laptop:text-[clamp(1.25rem,1.4vw,1.65rem)] tracking-tight text-brand-white mb-2 leading-tight break-words min-w-0">
                    {stage.title}
                  </h3>

                  {/* Focus Subtitle */}
                  <div className="font-mono text-[10px] text-brand-neon tracking-widest uppercase mb-3 truncate min-w-0">
                    {stage.focus}
                  </div>

                  {/* Summary */}
                  <p className="font-body text-xs sm:text-sm font-light text-brand-muted leading-relaxed mb-4 min-w-0">
                    {stage.summary}
                  </p>
                </div>

                {/* Minimal Architectural SVG Diagram per Stage */}
                <div className="my-2 py-3 border-y border-brand-border/40 flex items-center justify-center min-w-0 overflow-hidden">
                  {idx === 0 && (
                    <svg
                      className="w-full h-12 text-brand-neon/60"
                      viewBox="0 0 200 60"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="100" cy="30" r="24" strokeDasharray="3 3" />
                      <circle cx="100" cy="30" r="14" />
                      <line x1="100" y1="6" x2="100" y2="54" />
                      <line x1="76" y1="30" x2="124" y2="30" />
                      <circle cx="100" cy="30" r="3" fill="#35E85B" />
                    </svg>
                  )}
                  {idx === 1 && (
                    <svg
                      className="w-full h-12 text-brand-neon/60"
                      viewBox="0 0 200 60"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="20" y="20" width="28" height="20" rx="2" />
                      <line x1="48" y1="30" x2="80" y2="15" />
                      <line x1="48" y1="30" x2="80" y2="45" />
                      <rect x="80" y="5" width="32" height="20" rx="2" />
                      <rect x="80" y="35" width="32" height="20" rx="2" />
                      <line x1="112" y1="15" x2="148" y2="30" />
                      <line x1="112" y1="45" x2="148" y2="30" />
                      <rect x="148" y="20" width="32" height="20" rx="2" fill="#35E85B" fillOpacity="0.2" />
                    </svg>
                  )}
                  {idx === 2 && (
                    <svg
                      className="w-full h-12 text-brand-neon/60"
                      viewBox="0 0 200 60"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M 20 45 L 60 15 L 100 45 L 140 15 L 180 45" />
                      <circle cx="60" cy="15" r="4" fill="#35E85B" />
                      <circle cx="100" cy="45" r="4" fill="#ffffff" />
                      <circle cx="140" cy="15" r="4" fill="#35E85B" />
                      <line x1="20" y1="52" x2="180" y2="52" strokeDasharray="4 4" />
                    </svg>
                  )}
                  {idx === 3 && (
                    <svg
                      className="w-full h-12 text-brand-neon/60"
                      viewBox="0 0 200 60"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M 50 30 A 20 20 0 1 1 90 30 A 20 20 0 1 1 130 30 A 20 20 0 1 1 170 30" />
                      <path d="M 165 24 L 175 30 L 165 36" />
                      <circle cx="90" cy="30" r="3" fill="#35E85B" />
                      <circle cx="130" cy="30" r="3" fill="#35E85B" />
                    </svg>
                  )}
                </div>

                {/* Deliverables List */}
                <div className="pt-2">
                  <div className="font-mono text-[10px] text-brand-muted/70 uppercase tracking-wider mb-2">
                    KEY MILESTONES:
                  </div>
                  <ul className="space-y-1.5 font-mono text-[11px] text-brand-muted">
                    {stage.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-2">
                        <span className="text-brand-neon">›</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </MainContainer>
    </section>
  );
}

