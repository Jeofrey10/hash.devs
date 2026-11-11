import React from 'react';
import { cn } from '@/lib/utils';
import { useCursor } from './CursorContext';

export interface ImageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: '16/9' | '4/3' | '1/1' | '9/16' | '21/9' | 'auto';
  cursorLabel?: string;
  cursorVariant?: 'view' | 'drag' | 'hover';
  scaleOnHover?: boolean;
}

export const ImageContainer = React.forwardRef<HTMLDivElement, ImageContainerProps>(
  (
    {
      aspectRatio = '16/9',
      cursorLabel = 'VIEW',
      cursorVariant = 'view',
      scaleOnHover = true,
      className,
      children,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const { setCursor, resetCursor } = useCursor();

    const aspectClasses = {
      '16/9': 'aspect-[16/9]',
      '4/3': 'aspect-[4/3]',
      '1/1': 'aspect-square',
      '9/16': 'aspect-[9/16]',
      '21/9': 'aspect-[21/9]',
      auto: '',
    };

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
        ref={ref}
        className={cn(
          'group relative w-full overflow-hidden border border-brand-border bg-brand-surface',
          aspectClasses[aspectRatio],
          scaleOnHover && '[&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-out-expo group-hover:[&_img]:scale-105',
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ImageContainer.displayName = 'ImageContainer';

