import React from 'react';
import { cn } from '@/lib/utils';

export interface FullViewportSectionProps extends React.HTMLAttributes<HTMLElement> {
  align?: 'center' | 'start' | 'end' | 'between';
  justify?: 'center' | 'start' | 'end' | 'between';
}

export const FullViewportSection = React.forwardRef<HTMLElement, FullViewportSectionProps>(
  ({ align = 'center', justify = 'center', className, children, ...props }, ref) => {
    const alignClasses = {
      center: 'items-center',
      start: 'items-start',
      end: 'items-end',
      between: 'items-stretch',
    };

    const justifyClasses = {
      center: 'justify-center',
      start: 'justify-start',
      end: 'justify-end',
      between: 'justify-between',
    };

    return (
      <section
        ref={ref}
        className={cn(
          'relative flex min-h-screen w-full flex-col overflow-hidden',
          alignClasses[align],
          justifyClasses[justify],
          className
        )}
        style={{ minHeight: '100svh' }}
        {...props}
      >
        {children}
      </section>
    );
  }
);

FullViewportSection.displayName = 'FullViewportSection';

