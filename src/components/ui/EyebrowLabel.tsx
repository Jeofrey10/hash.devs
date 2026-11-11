import React from 'react';
import { cn } from '@/lib/utils';

export interface EyebrowLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  index?: string | number;
  indicator?: boolean;
}

export const EyebrowLabel = React.forwardRef<HTMLDivElement, EyebrowLabelProps>(
  ({ index, indicator = true, className, children, ...props }, ref) => {
    // If children already includes the bracketed index (e.g. "[ 01 ] // ..."), don't prepend another [index]
    const hasBracketedIndex = typeof children === 'string' && /^\s*\[\s*\d+\s*\]/.test(children);
    const shouldRenderIndex = index && !hasBracketedIndex;

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-widest text-brand-muted uppercase flex-wrap',
          className
        )}
        {...props}
      >
        {indicator && <span className="h-1.5 w-1.5 rounded-full bg-brand-neon shrink-0" />}
        {shouldRenderIndex && <span className="text-brand-neon">[{index}]</span>}
        <span className="break-words">{children}</span>
      </div>
    );
  }
);

EyebrowLabel.displayName = 'EyebrowLabel';

