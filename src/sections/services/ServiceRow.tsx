import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ServiceItem } from './servicesConfig';
import { cn } from '@/lib/utils';
import { useCursor } from '@/components/ui/CursorContext';

export interface ServiceRowProps {
  service: ServiceItem;
  isExpanded: boolean;
  onToggle: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  rowRef: (el: HTMLDivElement | null) => void;
}

export function ServiceRow({
  service,
  isExpanded,
  onToggle,
  onKeyDown,
  rowRef,
}: ServiceRowProps) {
  const { setCursor, resetCursor } = useCursor();
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={rowRef}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-controls={`service-content-${service.id}`}
      id={`service-header-${service.id}`}
      onClick={onToggle}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setCursor('hover')}
      onMouseLeave={() => resetCursor()}
      className={cn(
        'group relative w-full border-t border-brand-border/70 transition-all duration-300 cursor-pointer select-none outline-none',
        'focus-visible:ring-1 focus-visible:ring-brand-neon focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian',
        isExpanded
          ? 'bg-brand-surface/60 border-brand-neon/40 shadow-[0_4px_30px_rgba(53,232,91,0.04)]'
          : 'bg-brand-obsidian hover:bg-brand-surface/30'
      )}
    >
      {/* Left Neon Active Indicator Accent */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1 transition-all duration-300',
          isExpanded ? 'bg-brand-neon opacity-100' : 'bg-transparent opacity-0 group-hover:opacity-40 group-hover:bg-brand-border-hover'
        )}
      />

      {/* Main Row Header Header (Always Visible) */}
      <div className="py-8 sm:py-10 laptop:py-12 px-4 sm:px-8 laptop:px-12 flex flex-col tablet:flex-row tablet:items-center justify-between gap-6">
        {/* Left: Number + Title + Category */}
        <div className="flex items-start tablet:items-center gap-6 sm:gap-10 min-w-0">
          {/* Large Numbered Identifier */}
          <span
            className={cn(
              'font-mono font-bold text-2xl sm:text-3xl laptop:text-4xl transition-colors duration-200 shrink-0',
              isExpanded ? 'text-brand-neon' : 'text-brand-muted/60 group-hover:text-brand-white'
            )}
          >
            {service.index}
          </span>

          <div className="min-w-0">
            {/* Technical Category Label */}
            <div className="font-mono text-xs text-brand-muted/70 tracking-widest uppercase mb-1 flex items-center gap-2">
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full transition-colors duration-200',
                  isExpanded ? 'bg-brand-neon animate-pulse' : 'bg-brand-border group-hover:bg-brand-neon/60'
                )}
              />
              <span>{service.category}</span>
            </div>

            {/* Service Title */}
            <h3
              className={cn(
                'font-display font-extrabold text-2xl sm:text-3xl laptop:text-4xl tracking-tight transition-colors duration-200',
                isExpanded ? 'text-brand-white' : 'text-brand-white/90 group-hover:text-brand-white'
              )}
            >
              {service.title}
            </h3>
          </div>
        </div>

        {/* Right: Expand Toggle Indicator Icon */}
        <div className="flex items-center gap-4 self-end tablet:self-center shrink-0">
          <span className="hidden laptop:inline-block font-mono text-xs text-brand-muted tracking-wider uppercase group-hover:text-brand-white transition-colors duration-200">
            {isExpanded ? 'COLLAPSE' : 'EXPAND SPEC'}
          </span>
          <div
            className={cn(
              'h-10 w-10 rounded-full border flex items-center justify-center font-mono text-base transition-all duration-300',
              isExpanded
                ? 'border-brand-neon bg-brand-neon/10 text-brand-neon rotate-45'
                : 'border-brand-border bg-brand-surface text-brand-muted group-hover:border-brand-border-hover group-hover:text-brand-white'
            )}
            aria-hidden="true"
          >
            +
          </div>
        </div>
      </div>

      {/* Expanded Accordion Body Content */}
      <div
        id={`service-content-${service.id}`}
        role="region"
        aria-labelledby={`service-header-${service.id}`}
        className={cn(
          'grid transition-all duration-300 ease-in-out',
          isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
        )}
      >
        <div ref={contentRef} className="overflow-hidden">
          <div className="px-4 sm:px-8 laptop:px-12 pb-10 sm:pb-12 pt-2 border-t border-brand-border/40">
            <div className="grid grid-cols-1 laptop:grid-cols-12 gap-8 laptop:gap-12 items-start pt-6">
              {/* Left Column (Laptop: 6 cols): Description & Capabilities Pills */}
              <div className="laptop:col-span-6 min-w-0">
                <div className="font-mono text-xs text-brand-neon tracking-widest uppercase mb-3 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-brand-neon" />
                  <span>DISCIPLINE SCOPE & MANDATE</span>
                </div>

                <p className="font-body text-base sm:text-lg font-light text-brand-muted leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Capabilities Pills List */}
                <div className="font-mono text-xs text-brand-white font-semibold tracking-wider uppercase mb-3">
                  CORE CAPABILITIES
                </div>
                <div className="flex flex-wrap gap-2">
                  {service.capabilities.map((cap, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-3 py-1.5 rounded-full border border-brand-border/80 bg-brand-surface/60 font-mono text-xs text-brand-white/90 hover:border-brand-neon/50 transition-colors duration-200"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Middle Column (Laptop: 3 cols): Deliverables Checklist */}
              <div className="laptop:col-span-3 min-w-0">
                <div className="font-mono text-xs text-brand-neon tracking-widest uppercase mb-3 flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-brand-neon" />
                  <span>KEY DELIVERABLES</span>
                </div>

                <ul className="space-y-2.5">
                  {service.deliverables.map((deliv, dIdx) => (
                    <li
                      key={dIdx}
                      className="flex items-center gap-2.5 font-mono text-xs text-brand-muted"
                    >
                      <span className="text-brand-neon text-[10px]">✔</span>
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>

                {/* Performance SLA Metrics */}
                <div className="mt-6 pt-4 border-t border-brand-border/40 space-y-1.5 font-mono text-[11px]">
                  {service.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="flex items-center justify-between text-brand-muted">
                      <span>{m.label}:</span>
                      <span className="text-brand-white font-bold">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column (Laptop: 3 cols): Action CTA */}
              <div className="laptop:col-span-3 min-w-0 flex flex-col justify-between h-full pt-4 laptop:pt-0 laptop:border-l laptop:border-brand-border/40 laptop:pl-8">
                <div>
                  <div className="font-mono text-xs text-brand-muted uppercase tracking-wider mb-2">
                    ENGAGEMENT MODEL
                  </div>
                  <div className="font-mono text-xs text-brand-white font-semibold mb-4">
                    EMBEDDED POD // FIXED SPRINT
                  </div>
                  <p className="font-body text-xs text-brand-muted leading-relaxed">
                    Commission HASH.DEVS to architect and engineer this discipline for your product.
                  </p>
                </div>

                <div className="mt-6">
                  <Link
                    to="/contact"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-md bg-brand-white text-brand-obsidian font-mono text-xs font-bold tracking-wider uppercase hover:bg-brand-neon hover:text-brand-obsidian transition-colors duration-200 shadow-sm"
                  >
                    <span>EXPLORE DISCIPLINE ↗</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

