import React from 'react';
import { cn } from '@/lib/utils';

export interface GridLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'sm' | 'md' | 'lg' | 'gutter' | 'none';
  asymmetric?: 'default' | 'editorial-1-2' | 'editorial-2-1' | 'golden';
}

export const GridLayout = React.forwardRef<HTMLDivElement, GridLayoutProps>(
  ({ cols = 12, gap = 'gutter', asymmetric = 'default', className, children, ...props }, ref) => {
    const colClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 tablet:grid-cols-2',
      3: 'grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 laptop:grid-cols-4',
      6: 'grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-6',
      12: 'grid-cols-4 tablet:grid-cols-8 laptop:grid-cols-12',
    };

    const gapClasses = {
      none: 'gap-0',
      sm: 'gap-3 tablet:gap-4',
      md: 'gap-4 tablet:gap-6 laptop:gap-8',
      lg: 'gap-6 tablet:gap-8 laptop:gap-12',
      gutter: 'gap-gutter',
    };

    const asymmetricClasses = {
      default: '',
      'editorial-1-2': 'grid-cols-1 laptop:grid-cols-[1fr_2fr]',
      'editorial-2-1': 'grid-cols-1 laptop:grid-cols-[2fr_1fr]',
      golden: 'grid-cols-1 laptop:grid-cols-[1.618fr_1fr]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'grid w-full',
          asymmetric === 'default' ? colClasses[cols] : asymmetricClasses[asymmetric],
          gapClasses[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GridLayout.displayName = 'GridLayout';

