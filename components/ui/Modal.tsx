'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 md:p-6 flex min-h-full items-center justify-center"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} my-auto max-h-[92vh] flex flex-col bg-white border border-border rounded-2xl shadow-elevated z-10 overflow-hidden`}
      >
        {(title || showCloseButton) && (
          <div className="shrink-0 flex items-start justify-between p-4 sm:p-5 md:p-6 border-b border-border/70 bg-slate-50/50">
            <div>
              {title && <div className="text-lg font-bold text-foreground tracking-tight">{title}</div>}
              {description && (
                <p className="text-xs md:text-sm text-foreground-secondary mt-1">{description}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1.5 text-foreground-muted hover:text-foreground hover:bg-slate-100 rounded-full transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center -mr-1 shrink-0 ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6">{children}</div>
      </div>
    </div>
  );
}
