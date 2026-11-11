import React from 'react';
import { cn } from '@/lib/utils';
import { useCursor } from './CursorContext';

export interface HoverLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  underline?: boolean;
  external?: boolean;
  cursorLabel?: string;
}

export const HoverLink = React.forwardRef<HTMLAnchorElement, HoverLinkProps>(
  (
    {
      href,
      underline = true,
      external = false,
      cursorLabel,
      className,
      children,
      onMouseEnter,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const { setCursor, resetCursor } = useCursor();

    const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
      setCursor('hover', cursorLabel);
      if (onMouseEnter) onMouseEnter(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
      resetCursor();
      if (onMouseLeave) onMouseLeave(e);
    };

    return (
      <a
        ref={ref}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={cn(
          'group relative inline-flex items-center gap-1.5 font-medium text-brand-white transition-colors duration-200',
          'hover:text-brand-neon focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-neon',
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <span className="relative">
          <span>{children}</span>
          {underline && (
            <span
              aria-hidden="true"
              className="absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-brand-neon transition-transform duration-300 ease-out-expo group-hover:scale-x-100"
            />
          )}
        </span>

        {external && (
          <svg
            className="h-3 w-3 text-brand-neon/70 transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-neon"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </a>
    );
  }
);

HoverLink.displayName = 'HoverLink';

