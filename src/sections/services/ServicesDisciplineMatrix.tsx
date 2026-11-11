import { useState, useRef } from 'react';
import { MainContainer } from '@/components/layout';
import { EyebrowLabel } from '@/components/ui/EyebrowLabel';
import { SERVICES_COPY } from './servicesConfig';
import { ServiceRow } from './ServiceRow';

export function ServicesDisciplineMatrix() {
  const { servicesMatrix } = SERVICES_COPY;
  // Expand first discipline by default to show immediate depth
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleToggle = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle(index);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % servicesMatrix.length;
      rowRefs.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (index - 1 + servicesMatrix.length) % servicesMatrix.length;
      rowRefs.current[prevIndex]?.focus();
    }
  };

  return (
    <section
      id="services-matrix"
      className="relative w-full bg-brand-obsidian py-24 sm:py-32 border-b border-brand-border/60 overflow-hidden"
      aria-label="Services Discipline Matrix"
    >
      <MainContainer className="relative z-10 w-full">
        {/* Section Header */}
        <div className="mb-12 sm:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-brand-border/60">
          <div>
            <div className="mb-4">
              <EyebrowLabel indicator index="03" className="text-brand-neon font-bold">
                [ 03 ] // DISCIPLINE MATRIX
              </EyebrowLabel>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl laptop:text-5xl tracking-tight text-brand-white">
              CORE DISCIPLINES & REPERTOIRE
            </h2>
          </div>

          <div className="font-mono text-xs text-brand-muted flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-neon animate-pulse" />
            <span>INTERACTIVE ACCORDION // SELECT ROW TO INSPECT SPEC</span>
          </div>
        </div>

        {/* 5 Substantial Expandable Service Rows */}
        <div className="border-b border-brand-border/70 rounded-lg overflow-hidden">
          {servicesMatrix.map((service, idx) => (
            <ServiceRow
              key={service.id}
              service={service}
              isExpanded={expandedIndex === idx}
              onToggle={() => handleToggle(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              rowRef={(el) => (rowRefs.current[idx] = el)}
            />
          ))}
        </div>
      </MainContainer>
    </section>
  );
}

