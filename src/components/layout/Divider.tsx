import React from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'subtle' | 'standard' | 'accent' | 'dashed';
  label?: string;
  badge?: string;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      variant = 'standard',
      label,
      badge,
      className,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      subtle: 'border-brand-border-subtle',
      standard: 'border-brand-border',
      accent: 'border-brand-neon/30',
      dashed: 'border-brand-border border-dashed',
    };

    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="vertical"
          className={cn(
            'inline-block h-full min-h-[1.5rem] w-px self-stretch border-l',
            variantClasses[variant],
            className
          )}
          {...props}
        />
      );
    }

    if (label || badge) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="horizontal"
          className={cn('relative my-6 flex w-full items-center', className)}
          {...props}
        >
          <div className={cn('flex-grow border-t', variantClasses[variant])} />
          {label && (
            <span className="mx-4 font-mono text-[10px] tracking-widest text-brand-muted uppercase">
              {label}
            </span>
          )}
          {badge && (
            <span className="mx-3 rounded border border-brand-border bg-brand-surface px-2 py-0.5 font-mono text-[9px] tracking-wider text-brand-neon">
              {badge}
            </span>
          )}
          <div className={cn('flex-grow border-t', variantClasses[variant])} />
        </div>
      );
    }

    return (
      <hr
        ref={ref as React.Ref<HTMLHRElement>}
        className={cn('w-full my-6 border-0 border-t', variantClasses[variant], className)}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

