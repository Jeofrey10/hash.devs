import React from 'react';
import { cn } from '@/lib/utils';

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'section';
  axis?: 'vertical' | 'horizontal';
}

export const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ size = 'md', axis = 'vertical', className, ...props }, ref) => {
    const verticalSizes = {
      xs: 'h-2',
      sm: 'h-4',
      md: 'h-8',
      lg: 'h-12 tablet:h-16',
      xl: 'h-16 tablet:h-24',
      '2xl': 'h-24 tablet:h-36',
      section: 'h-section-y',
    };

    const horizontalSizes = {
      xs: 'w-2',
      sm: 'w-4',
      md: 'w-8',
      lg: 'w-12 tablet:w-16',
      xl: 'w-16 tablet:w-24',
      '2xl': 'w-24 tablet:w-36',
      section: 'w-page-x',
    };

    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          axis === 'vertical' ? verticalSizes[size] : horizontalSizes[size],
          'pointer-events-none shrink-0',
          className
        )}
        {...props}
      />
    );
  }
);

Spacer.displayName = 'Spacer';

