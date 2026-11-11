import React from 'react';
import { useMagnetic, UseMagneticOptions } from '@/hooks/useMagnetic';
import { useCursor } from './CursorContext';
import { cn } from '@/lib/utils';

export interface MagneticElementProps extends React.HTMLAttributes<HTMLDivElement> {
  options?: UseMagneticOptions;
  cursorLabel?: string;
  cursorVariant?: 'magnetic' | 'hover' | 'view';
}

export const MagneticElement = React.forwardRef<HTMLDivElement, MagneticElementProps>(
  (
    {
      options,
      cursorLabel,
      cursorVariant = 'magnetic',
      className,
      children,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    forwardedRef
  ) => {
    const magneticRef = useMagnetic<HTMLDivElement>(options);
    const { setCursor, resetCursor } = useCursor();

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      setCursor(cursorVariant, cursorLabel);
      if (onMouseEnter) onMouseEnter(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      resetCursor();
      if (onMouseLeave) onMouseLeave(e);
    };

    return (
      <div
        ref={(node) => {
          (magneticRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof forwardedRef === 'function') {
            forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
        }}
        className={cn('inline-block', className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MagneticElement.displayName = 'MagneticElement';

