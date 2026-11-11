import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

export interface HorizontalOverflowContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  snap?: boolean;
  itemGap?: 'sm' | 'md' | 'lg' | 'none';
  showFadeEdges?: boolean;
}

export const HorizontalOverflowContainer = React.forwardRef<
  HTMLDivElement,
  HorizontalOverflowContainerProps
>(
  (
    {
      snap = false,
      itemGap = 'md',
      showFadeEdges = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const containerRef = (ref || internalRef) as React.RefObject<HTMLDivElement>;

    const gapClasses = {
      none: 'gap-0',
      sm: 'gap-4',
      md: 'gap-6 tablet:gap-8',
      lg: 'gap-8 tablet:gap-12',
    };

    return (
      <div className="relative w-full overflow-hidden" data-lenis-prevent>
        {showFadeEdges && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-brand-obsidian to-transparent tablet:w-16"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-brand-obsidian to-transparent tablet:w-16"
            />
          </>
        )}

        <div
          ref={containerRef}
          className={cn(
            'flex w-full overflow-x-auto py-4 px-page-x scrollbar-none',
            snap && 'snap-x snap-mandatory scroll-smooth',
            gapClasses[itemGap],
            className
          )}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);

HorizontalOverflowContainer.displayName = 'HorizontalOverflowContainer';

