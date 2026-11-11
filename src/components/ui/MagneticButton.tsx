import React from 'react';
import { cn } from '@/lib/utils';
import { useMagnetic } from '@/hooks/useMagnetic';
import { useCursor } from './CursorContext';

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'neon' | 'glass' | 'outline';
  cursorLabel?: string;
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (
    {
      href,
      size = 'md',
      variant = 'outline',
      cursorLabel = 'CLICK',
      className,
      children,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    forwardedRef
  ) => {
    const magneticRef = useMagnetic<HTMLButtonElement>({ strength: 0.45, duration: 0.7 });
    const { setCursor, resetCursor } = useCursor();

    const sizeClasses = {
      sm: 'h-16 w-16 text-xs',
      md: 'h-24 w-24 text-sm',
      lg: 'h-32 w-32 text-base',
      xl: 'h-40 w-40 text-lg',
    };

    const variantClasses = {
      neon: 'bg-brand-neon text-brand-obsidian border-transparent hover:bg-brand-neon-hover',
      glass: 'bg-brand-surface/80 text-brand-white border-brand-border hover:border-brand-neon backdrop-blur-md',
      outline: 'bg-transparent text-brand-white border-brand-border hover:border-brand-neon hover:text-brand-neon',
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      setCursor('magnetic', cursorLabel);
      if (onMouseEnter) onMouseEnter(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      resetCursor();
      if (onMouseLeave) onMouseLeave(e);
    };

    const commonClasses = cn(
      'group relative inline-flex items-center justify-center rounded-full border font-mono font-bold tracking-widest uppercase transition-colors duration-300',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon',
      sizeClasses[size],
      variantClasses[variant],
      className
    );

    if (href) {
      return (
        <a
          href={href}
          className={commonClasses}
          onMouseEnter={handleMouseEnter as unknown as React.MouseEventHandler<HTMLAnchorElement>}
          onMouseLeave={handleMouseLeave as unknown as React.MouseEventHandler<HTMLAnchorElement>}
        >
          <span className="relative z-10 text-center">{children}</span>
        </a>
      );
    }

    return (
      <button
        ref={(node) => {
          (magneticRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          if (typeof forwardedRef === 'function') {
            forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
        }}
        className={commonClasses}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <span className="relative z-10 text-center">{children}</span>
      </button>
    );
  }
);

MagneticButton.displayName = 'MagneticButton';

