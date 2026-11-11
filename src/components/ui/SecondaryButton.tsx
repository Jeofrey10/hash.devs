import React from 'react';
import { cn } from '@/lib/utils';
import { useCursor } from './CursorContext';
import { useMagnetic } from '@/hooks/useMagnetic';

export interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  magnetic?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  showArrow?: boolean;
}

export const SecondaryButton = React.forwardRef<HTMLButtonElement, SecondaryButtonProps>(
  (
    {
      href,
      size = 'md',
      magnetic = true,
      icon,
      iconPosition = 'right',
      showArrow = true,
      className,
      children,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    forwardedRef
  ) => {
    const magneticRef = useMagnetic<HTMLButtonElement>({ disabled: !magnetic, strength: 0.25 });
    const { setCursor, resetCursor } = useCursor();

    const sizeClasses = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3.5 text-sm',
      lg: 'px-8 py-4 text-base',
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      setCursor('magnetic');
      if (onMouseEnter) onMouseEnter(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      resetCursor();
      if (onMouseLeave) onMouseLeave(e);
    };

    const content = (
      <>
        {/* Hover surface background glow */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-brand-neon/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <span className="relative z-10 flex items-center gap-2.5">
          {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="shrink-0">{icon}</span>}
          {showArrow && !icon && (
            <svg
              className="h-3.5 w-3.5 shrink-0 text-brand-neon transition-transform duration-300 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-0.5"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 11.5L11.5 2.5M11.5 2.5H4M11.5 2.5V10"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </>
    );

    const commonClasses = cn(
      'group relative inline-flex items-center justify-center overflow-hidden rounded-full font-mono font-medium tracking-wider uppercase',
      'border border-brand-border bg-brand-surface/60 text-brand-white backdrop-blur-sm',
      'transition-all duration-300 hover:border-brand-neon hover:text-brand-white',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian',
      'disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
      sizeClasses[size],
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
          {content}
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
        {content}
      </button>
    );
  }
);

SecondaryButton.displayName = 'SecondaryButton';

