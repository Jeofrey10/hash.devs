import React from 'react';
import { cn } from '@/lib/utils';
import { useCursor } from './CursorContext';

export interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  showArrow?: boolean;
  arrowDirection?: 'right' | 'up-right';
  underline?: boolean;
}

export const TextButton = React.forwardRef<HTMLButtonElement, TextButtonProps>(
  (
    {
      href,
      showArrow = true,
      arrowDirection = 'up-right',
      underline = true,
      className,
      children,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const { setCursor, resetCursor } = useCursor();

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      setCursor('hover');
      if (onMouseEnter) onMouseEnter(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      resetCursor();
      if (onMouseLeave) onMouseLeave(e);
    };

    const content = (
      <>
        <span className="relative">
          <span>{children}</span>
          {underline && (
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-brand-neon transition-transform duration-300 ease-out-expo group-hover:scale-x-100"
            />
          )}
        </span>

        {showArrow && (
          <span className="shrink-0 overflow-hidden">
            <svg
              className={cn(
                'h-3.5 w-3.5 text-brand-neon transition-transform duration-300 ease-out-expo',
                arrowDirection === 'up-right'
                  ? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                  : 'group-hover:translate-x-1'
              )}
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {arrowDirection === 'up-right' ? (
                <path
                  d="M2.5 11.5L11.5 2.5M11.5 2.5H4M11.5 2.5V10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </span>
        )}
      </>
    );

    const commonClasses = cn(
      'group inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-widest text-brand-white uppercase transition-colors duration-200',
      'hover:text-brand-neon focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon',
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
        ref={ref}
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

TextButton.displayName = 'TextButton';

