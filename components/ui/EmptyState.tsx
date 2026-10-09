import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`p-8 md:p-12 text-center bg-surface rounded-xl border border-border flex flex-col items-center justify-center max-w-md mx-auto ${className}`}
    >
      {icon && <div className="p-3 bg-surface-elevated rounded-full mb-4 text-sage">{icon}</div>}
      <h3 className="text-base font-semibold text-foreground tracking-tight">{title}</h3>
      <p className="text-xs md:text-sm text-foreground-secondary mt-1.5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="sage" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isOffline?: boolean;
}

export function ErrorState({
  title = 'Something feels off right now',
  message = "We ran into an unexpected hiccup loading this section. Your data is safe and untouched.",
  onRetry,
  isOffline = false,
}: ErrorStateProps) {
  return (
    <div className="p-6 md:p-8 bg-surface rounded-xl border border-calm-amber/30 text-center max-w-md mx-auto my-6 space-y-3">
      <div className="w-10 h-10 rounded-full bg-calm-amber/15 text-calm-amber flex items-center justify-center mx-auto">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="text-sm md:text-base font-semibold text-foreground">{title}</h3>
      <p className="text-xs md:text-sm text-foreground-secondary leading-relaxed">{message}</p>
      {isOffline && (
        <p className="text-xs text-calm-amber/90 italic">
          You appear to be offline. Any local drafts will remain safe on your device.
        </p>
      )}
      {onRetry && (
        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Try again gently
          </Button>
        </div>
      )}
    </div>
  );
}
