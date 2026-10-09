import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'sage' | 'secondary' | 'outline' | 'ghost' | 'coral' | 'coral-outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'sage',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed select-none min-h-[42px] min-w-[42px] active:scale-[0.98]';

    const sizeStyles = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5 min-h-[36px]',
      md: 'text-sm px-5 py-2.5 gap-2 min-h-[42px]',
      lg: 'text-base px-7 py-3 gap-2.5 min-h-[48px]',
    };

    const variantStyles = {
      sage: 'bg-slate-900 text-white hover:bg-black font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all',
      secondary: 'bg-white text-foreground hover:bg-slate-50 border border-border shadow-xs hover:border-slate-300 hover:shadow-sm transition-all',
      outline: 'bg-transparent text-foreground border border-border hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all',
      ghost: 'bg-transparent text-foreground-secondary hover:text-foreground hover:bg-slate-100/70 transition-colors',
      coral: 'bg-coral text-white font-semibold hover:bg-coral-hover shadow-sm hover:shadow-coral-glow hover:-translate-y-0.5 transition-all',
      'coral-outline': 'bg-transparent text-coral border border-coral/30 hover:bg-coral-tint hover:border-coral transition-colors',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
