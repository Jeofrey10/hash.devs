import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ProcessStage } from './processData';

interface ProcessStageItemProps {
  stage: ProcessStage;
  isActive: boolean;
  onSelect: () => void;
  className?: string;
}

export function ProcessStageItem({
  stage,
  isActive,
  onSelect,
  className = '',
}: ProcessStageItemProps) {
  return (
    <motion.article
      layout
      onClick={onSelect}
      onMouseEnter={onSelect}
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl border transition-colors duration-300 p-6 sm:p-8 laptop:p-10 cursor-pointer overflow-hidden',
        isActive
          ? 'border-brand-neon/70 bg-brand-surface-elevated/95 shadow-[0_20px_50px_rgba(0,0,0,0.85)] ring-1 ring-brand-neon/30'
          : 'border-brand-border/70 bg-brand-surface/30 hover:border-brand-border-hover hover:bg-brand-surface/60 opacity-80 hover:opacity-100',
        className
      )}
      transition={{ type: 'spring', stiffness: 350, damping: 32 }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      aria-expanded={isActive}
      aria-label={`Process Stage ${stage.index}: ${stage.title}`}
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

      {/* Stage Number & Meta Bar */}
      <div className="flex items-center justify-between border-b border-brand-border/60 pb-4 mb-5">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span
            className={cn(
              'font-bold tracking-widest text-base sm:text-lg transition-colors',
              isActive ? 'text-brand-neon' : 'text-brand-muted group-hover:text-brand-white'
            )}
          >
            [{stage.index}]
          </span>
          <span className="h-3 w-[1px] bg-brand-border" />
          <span className="font-semibold tracking-wider text-brand-muted uppercase text-[11px]">
            {stage.kicker}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isActive ? (
            <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-brand-neon bg-brand-neon/10 border border-brand-neon/30 px-2.5 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-neon animate-pulse" />
              IN VIEW
            </span>
          ) : (
            <span className="font-mono text-[10px] text-brand-muted/70 group-hover:text-brand-white transition-colors">
              EXPAND ↗
            </span>
          )}
        </div>
      </div>

      {/* Stage Title */}
      <div>
        <h3
          className={cn(
            'font-display text-2xl sm:text-3xl laptop:text-4xl font-extrabold tracking-tight uppercase leading-tight transition-colors duration-300',
            isActive ? 'text-brand-white' : 'text-white/70 group-hover:text-brand-white'
          )}
        >
          {stage.title}
        </h3>

        {/* Narrative Description */}
        <p className="mt-3 font-body text-sm sm:text-base font-light text-brand-muted leading-relaxed max-w-4xl">
          {stage.description}
        </p>
      </div>

      {/* Stage Key Details / Deliverables Matrix (Skiper52 Expanding Animation) */}
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            key="deliverables"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-5 border-t border-brand-border/60">
              <div className="font-mono text-[10px] text-brand-muted uppercase tracking-wider mb-3">
                CORE DISCIPLINES & DELIVERABLES:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 tablet:grid-cols-4 gap-3 sm:gap-4">
                {stage.details.map((detail, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 font-mono text-xs text-white/90 bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2"
                  >
                    <span className="text-brand-neon text-[10px]">■</span>
                    <span className="truncate">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
