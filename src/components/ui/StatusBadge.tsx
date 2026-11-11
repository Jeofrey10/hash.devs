import React from 'react';
import { cn } from '@/lib/utils';

export type StatusType = 'active' | 'live' | 'idle' | 'warning' | 'error' | 'offline';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: StatusType;
  pulse?: boolean;
  label?: string;
}

export const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status = 'active', pulse = true, label, className, children, ...props }, ref) => {
    const statusConfig = {
      active: {
        dotBg: 'bg-brand-neon',
        border: 'border-brand-neon/30',
        text: 'text-brand-neon',
        defaultLabel: 'AVAILABLE FOR Q1/Q2',
      },
      live: {
        dotBg: 'bg-brand-neon',
        border: 'border-brand-neon/30',
        text: 'text-brand-neon',
        defaultLabel: 'SYSTEM OPERATIONAL',
      },
      idle: {
        dotBg: 'bg-brand-muted',
        border: 'border-brand-border',
        text: 'text-brand-muted',
        defaultLabel: 'STANDBY',
      },
      warning: {
        dotBg: 'bg-semantic-warning',
        border: 'border-semantic-warning/30',
        text: 'text-semantic-warning',
        defaultLabel: 'LIMITED CAPACITY',
      },
      error: {
        dotBg: 'bg-semantic-error',
        border: 'border-semantic-error/30',
        text: 'text-semantic-error',
        defaultLabel: 'OFFLINE',
      },
      offline: {
        dotBg: 'bg-brand-subtle',
        border: 'border-brand-border',
        text: 'text-brand-subtle',
        defaultLabel: 'MAINTENANCE',
      },
    };

    const current = statusConfig[status];
    const displayLabel = label || children || current.defaultLabel;

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2.5 rounded-full border bg-brand-surface/80 px-3 py-1 backdrop-blur-xs',
          current.border,
          className
        )}
        {...props}
      >
        <span className="relative flex h-2 w-2">
          {pulse && status !== 'offline' && status !== 'idle' && (
            <span
              className={cn(
                'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                current.dotBg
              )}
            />
          )}
          <span className={cn('relative inline-flex h-2 w-2 rounded-full', current.dotBg)} />
        </span>
        <span className={cn('font-mono text-[10px] font-bold tracking-widest uppercase', current.text)}>
          {displayLabel}
        </span>
      </div>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

