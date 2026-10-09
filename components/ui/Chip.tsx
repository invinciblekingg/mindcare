import React from 'react';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'sage' | 'secondary' | 'coral' | 'blue' | 'amber' | 'outline';
  size?: 'sm' | 'md';
  selected?: boolean;
  onRemove?: () => void;
}

export function Chip({
  children,
  variant = 'secondary',
  size = 'md',
  selected = false,
  onRemove,
  className = '',
  ...props
}: ChipProps) {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 gap-1',
    md: 'text-xs md:text-sm px-3.5 py-1.5 gap-1.5 min-h-[36px]',
  };

  const variantStyles = {
    sage: 'bg-sage-tint text-sage border border-sage/20 font-medium',
    secondary: 'bg-white text-foreground-secondary border border-border hover:text-foreground hover:border-slate-300 shadow-xs',
    coral: 'bg-coral-tint text-coral border border-coral/20 font-medium',
    blue: 'bg-blue-50 text-blue-700 border border-blue-200/60 font-medium',
    amber: 'bg-amber-50 text-amber-700 border border-amber-200/60 font-medium',
    outline: 'bg-white text-foreground-secondary border border-border hover:border-slate-300',
  };

  const selectedStyles = selected
    ? '!bg-slate-900 !text-white !border-slate-900 font-semibold shadow-sm'
    : '';

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-normal transition-all duration-smooth select-none ${
        sizeStyles[size]
      } ${variantStyles[variant]} ${selectedStyles} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:text-foreground transition-colors focus:outline-none rounded-full"
          aria-label="Remove item"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}
    </span>
  );
}
