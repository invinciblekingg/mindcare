'use client';

import React from 'react';
import { PlanStatus } from '@/types';
import { Check, Clock, AlertCircle } from 'lucide-react';

export interface StatusStepperProps {
  currentStatus: PlanStatus;
  className?: string;
  onStatusClick?: (status: PlanStatus) => void;
}

const STEPS: { status: PlanStatus; label: string; description: string }[] = [
  { status: 'DRAFT', label: 'Draft', description: 'Under counsellor authoring' },
  { status: 'PENDING_APPROVAL', label: 'Pending Approval', description: 'Clinical supervisor review' },
  { status: 'ACTIVE', label: 'Active', description: 'Live in AI companion guidelines' },
  { status: 'SUPERSEDED', label: 'Superseded', description: 'Archived by newer version' },
];

export function StatusStepper({ currentStatus, className = '', onStatusClick }: StatusStepperProps) {
  const currentIndex = STEPS.findIndex((s) => s.status === currentStatus);

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {STEPS.map((step, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isUpcoming = idx > currentIndex;

          return (
            <div
              key={step.status}
              onClick={() => onStatusClick && onStatusClick(step.status)}
              className={`p-3 rounded-lg border transition-all text-left ${
                isCurrent
                  ? 'bg-sage/15 border-sage ring-1 ring-sage/50 text-foreground'
                  : isPassed
                  ? 'bg-surface-elevated/60 border-border text-foreground-secondary'
                  : 'bg-surface border-border/50 text-foreground-muted'
              } ${onStatusClick ? 'cursor-pointer hover:border-border-highlight' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                    isCurrent
                      ? 'bg-slate-900 text-white'
                      : isPassed
                      ? 'bg-sage text-white'
                      : 'bg-slate-100 border border-border text-foreground-muted'
                  }`}
                >
                  {isPassed ? <Check className="w-3 h-3" /> : idx + 1}
                </div>
                <span className={`text-xs font-semibold ${isCurrent ? 'text-sage' : ''}`}>
                  {step.label}
                </span>
              </div>
              <p className="text-[11px] text-foreground-muted leading-tight pl-7">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
