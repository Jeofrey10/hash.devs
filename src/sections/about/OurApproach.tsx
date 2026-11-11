import { useState } from 'react';
import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { ABOUT_COPY } from './aboutConfig';
import { cn } from '@/lib/utils';

export function OurApproach() {
  const { approach } = ABOUT_COPY;
  const [activeIdx, setActiveIdx] = useState<number>(0);

  return (
    <section
      id="our-approach"
      className="relative w-full bg-brand-obsidian py-24 laptop:py-36 overflow-hidden border-b border-brand-border/60 scroll-mt-12"
      aria-label="Our Approach"
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
            <EyebrowLabel indicator index={approach.index} className="text-brand-neon font-bold">
              {approach.eyebrow}
            </EyebrowLabel>
          </div>

          <h2 className="font-display font-extrabold tracking-tight text-brand-white leading-tight text-3xl sm:text-4xl laptop:text-5xl">
            {approach.title}
          </h2>
        </div>

        {/* 4 Architectural Principles Grid */}
        <div className="grid grid-cols-1 laptop:grid-cols-2 gap-6 sm:gap-8">
          {approach.principles.map((p, idx) => {
            const isActive = activeIdx === idx;
            return (
              <article
                key={p.index}
                onClick={() => setActiveIdx(idx)}
                onMouseEnter={() => setActiveIdx(idx)}
                className={cn(
                  'group relative flex flex-col justify-between rounded-2xl border p-6 sm:p-8 laptop:p-10 cursor-pointer transition-all duration-300 overflow-hidden',
                  isActive
                    ? 'border-brand-neon/70 bg-[#0E1210] shadow-[0_20px_50px_rgba(0,0,0,0.85)] ring-1 ring-brand-neon/30'
                    : 'border-brand-border/70 bg-brand-surface/30 hover:border-brand-border-hover hover:bg-brand-surface/60 opacity-80 hover:opacity-100'
                )}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveIdx(idx);
                  }
                }}
                aria-expanded={isActive}
                aria-label={`Principle ${p.index}: ${p.title}`}
              >
                {/* Corner Precision Brackets */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute left-3 top-3 h-2.5 w-2.5 border-l border-t transition-colors duration-300',
                    isActive ? 'border-brand-neon' : 'border-brand-border group-hover:border-brand-neon/50'
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute right-3 top-3 h-2.5 w-2.5 border-r border-t transition-colors duration-300',
                    isActive ? 'border-brand-neon' : 'border-brand-border group-hover:border-brand-neon/50'
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute bottom-3 left-3 h-2.5 w-2.5 border-b border-l transition-colors duration-300',
                    isActive ? 'border-brand-neon' : 'border-brand-border group-hover:border-brand-neon/50'
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute bottom-3 right-3 h-2.5 w-2.5 border-b border-r transition-colors duration-300',
                    isActive ? 'border-brand-neon' : 'border-brand-border group-hover:border-brand-neon/50'
                  )}
                />

                {/* Top Meta Bar */}
                <div className="flex items-center justify-between border-b border-brand-border/60 pb-4 mb-6">
                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span
                      className={cn(
                        'font-bold tracking-widest text-base sm:text-lg transition-colors',
                        isActive ? 'text-brand-neon' : 'text-brand-muted group-hover:text-brand-white'
                      )}
                    >
                      [{p.index}]
                    </span>
                    <span className="h-3 w-[1px] bg-brand-border" />
                    <span className="font-semibold tracking-wider text-brand-muted uppercase text-[11px]">
                      PILLAR // 0{idx + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-brand-neon bg-brand-neon/10 border border-brand-neon/30 px-2.5 py-0.5 rounded-full">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-neon animate-pulse" />
                        ACTIVE FOCUS
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-brand-muted/70 group-hover:text-brand-white transition-colors">
                        SELECT ↗
                      </span>
                    )}
                  </div>
                </div>

                {/* Principle Title & Tagline */}
                <div className="min-w-0">
                  <h3
                    className={cn(
                      'font-display text-xl sm:text-2xl laptop:text-3xl font-extrabold tracking-tight uppercase leading-tight transition-colors duration-300 break-words min-w-0',
                      isActive ? 'text-brand-white' : 'text-white/70 group-hover:text-brand-white'
                    )}
                  >
                    {p.title}
                  </h3>

                  <div className="mt-2 font-mono text-xs text-brand-neon font-medium">
                    "{p.tagline}"
                  </div>

                  <p className="mt-4 font-body text-sm sm:text-base font-light text-brand-muted leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Disciplines Matrix */}
                <div className="mt-8 pt-5 border-t border-brand-border/60">
                  <div className="font-mono text-[10px] text-brand-muted uppercase tracking-wider mb-3">
                    CORE PRACTICES:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.disciplines.map((d, dIdx) => (
                      <span
                        key={dIdx}
                        className={cn(
                          'rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors',
                          isActive
                            ? 'bg-white/[0.04] border border-brand-neon/20 text-white/90'
                            : 'bg-white/[0.02] border border-white/5 text-brand-muted'
                        )}
                      >
                        <span className="text-brand-neon mr-1.5">■</span>
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </MainContainer>
    </section>
  );
}

