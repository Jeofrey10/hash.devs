import React from 'react';
import { cn } from '@/lib/utils';

export interface SplitLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: 'equal' | '1:2' | '2:1' | '1:3' | '3:1';
  stickyLeft?: boolean;
  reverseMobile?: boolean;
  gap?: 'sm' | 'md' | 'lg' | 'gutter';
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftClassName?: string;
  rightClassName?: string;
}

export const SplitLayout = React.forwardRef<HTMLDivElement, SplitLayoutProps>(
  (
    {
      ratio = 'equal',
      stickyLeft = false,
      reverseMobile = false,
      gap = 'gutter',
      leftContent,
      rightContent,
      leftClassName,
      rightClassName,
      className,
      ...props
    },
    ref
  ) => {
    const ratioClasses = {
      equal: 'laptop:grid-cols-2',
      '1:2': 'laptop:grid-cols-[1fr_2fr]',
      '2:1': 'laptop:grid-cols-[2fr_1fr]',
      '1:3': 'laptop:grid-cols-[1fr_3fr]',
      '3:1': 'laptop:grid-cols-[3fr_1fr]',
    };

    const gapClasses = {
      sm: 'gap-4 tablet:gap-6',
      md: 'gap-6 tablet:gap-8 laptop:gap-12',
      lg: 'gap-8 tablet:gap-12 laptop:gap-16',
      gutter: 'gap-gutter',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'grid w-full grid-cols-1 items-start',
          ratioClasses[ratio],
          gapClasses[gap],
          reverseMobile && '[&>*:first-child]:order-2 laptop:[&>*:first-child]:order-1',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'w-full',
            stickyLeft && 'laptop:sticky laptop:top-24',
            leftClassName
          )}
        >
          {leftContent}
        </div>
        <div className={cn('w-full', rightClassName)}>{rightContent}</div>
      </div>
    );
  }
);

SplitLayout.displayName = 'SplitLayout';

