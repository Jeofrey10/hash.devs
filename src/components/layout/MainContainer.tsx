import React from 'react';
import { cn } from '@/lib/utils';

export interface MainContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  size?: 'default' | 'editorial' | 'narrow' | 'text' | 'full';
  noPadding?: boolean;
}

export const MainContainer = React.forwardRef<HTMLDivElement, MainContainerProps>(
  ({ as: Component = 'div', size = 'default', noPadding = false, className, children, ...props }, ref) => {
    const sizeClasses = {
      default: 'max-w-container',
      editorial: 'max-w-editorial',
      narrow: 'max-w-narrow',
      text: 'max-w-text',
      full: 'max-w-full',
    };

    return (
      <Component
        ref={ref}
        className={cn(
          'w-full mx-auto',
          sizeClasses[size],
          !noPadding && 'px-page-x',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

MainContainer.displayName = 'MainContainer';

// Also export alias Container
export const Container = MainContainer;

