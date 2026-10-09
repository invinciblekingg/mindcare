import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'tint-sage' | 'tint-coral' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  const variantStyles = {
    default: 'bg-white border border-border shadow-soft hover:border-slate-300 transition-all duration-300',
    elevated: 'bg-white border border-border shadow-elevated hover:shadow-card-hover transition-all duration-300',
    'tint-sage': 'bg-sage-tint border border-sage/20 shadow-soft',
    'tint-coral': 'bg-coral-tint border border-coral/20 shadow-soft',
    interactive:
      'bg-white border border-border shadow-soft hover:border-slate-300 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3.5 md:p-4',
    md: 'p-5 md:p-6',
    lg: 'p-6 md:p-8',
  };

  return (
    <div
      className={`rounded-2xl transition-all duration-300 ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex items-center justify-between pb-4 border-b border-border/60 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={`text-base font-semibold text-foreground tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-xs md:text-sm text-foreground-secondary mt-1 leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}
