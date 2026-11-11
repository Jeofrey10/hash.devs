import React from 'react';
import { cn } from '@/lib/utils';

export interface TechnicalLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'subtle' | 'border' | 'neon' | 'code';
}

export const TechnicalLabel = React.forwardRef<HTMLSpanElement, TechnicalLabelProps>(
  ({ variant = 'subtle', className, children, ...props }, ref) => {
    const variantClasses = {
      subtle: 'text-brand-subtle font-mono text-[10px] tracking-widest uppercase',
      border:
        'border border-brand-border bg-brand-surface/40 px-2 py-0.5 rounded font-mono text-[10px] tracking-wider text-brand-muted uppercase',
      neon: 'border border-brand-neon/30 bg-brand-neon/5 px-2 py-0.5 rounded font-mono text-[10px] tracking-wider text-brand-neon uppercase',
      code: 'bg-brand-graphite/40 px-1.5 py-0.5 rounded font-mono text-[11px] text-brand-white',
    };

    return (
      <span ref={ref} className={cn('inline-block', variantClasses[variant], className)} {...props}>
        {children}
      </span>
    );
  }
);

TechnicalLabel.displayName = 'TechnicalLabel';

