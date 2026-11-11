import React from 'react';
import { cn } from '@/lib/utils';

export interface EyebrowLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  index?: string | number;
  indicator?: boolean;
}

export const EyebrowLabel = React.forwardRef<HTMLDivElement, EyebrowLabelProps>(
  ({ index, indicator = true, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 font-mono text-[11px] font-bold tracking-widest text-brand-muted uppercase',
          className
        )}
        {...props}
      >
        {indicator && <span className="h-1.5 w-1.5 rounded-full bg-brand-neon shrink-0" />}
        {index && <span className="text-brand-neon">[{index}]</span>}
        <span>{children}</span>
      </div>
    );
  }
);

EyebrowLabel.displayName = 'EyebrowLabel';

