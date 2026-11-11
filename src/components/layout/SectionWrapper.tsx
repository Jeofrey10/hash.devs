import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'default';
  background?: 'obsidian' | 'surface' | 'surface-elevated' | 'graphite' | 'transparent';
  border?: 'none' | 'top' | 'bottom' | 'both';
}

export const SectionWrapper = React.forwardRef<HTMLElement, SectionWrapperProps>(
  (
    {
      as: Component = 'section',
      spacing = 'default',
      background = 'transparent',
      border = 'none',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const spacingClasses = {
      none: 'py-0',
      sm: 'py-8 tablet:py-12',
      md: 'py-12 tablet:py-16 laptop:py-24',
      lg: 'py-16 tablet:py-24 laptop:py-36',
      default: 'py-section-y',
    };

    const backgroundClasses = {
      obsidian: 'bg-brand-obsidian',
      surface: 'bg-brand-surface',
      'surface-elevated': 'bg-brand-surface-elevated',
      graphite: 'bg-brand-graphite',
      transparent: 'bg-transparent',
    };

    const borderClasses = {
      none: '',
      top: 'border-t border-brand-border',
      bottom: 'border-b border-brand-border',
      both: 'border-y border-brand-border',
    };

    return (
      <Component
        ref={ref}
        className={cn(
          'relative w-full',
          spacingClasses[spacing],
          backgroundClasses[background],
          borderClasses[border],
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

SectionWrapper.displayName = 'SectionWrapper';

// Also export alias Section
export const Section = SectionWrapper;

