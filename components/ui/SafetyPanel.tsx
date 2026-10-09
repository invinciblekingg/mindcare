'use client';

import React, { useState } from 'react';
import { SafetyEvent } from '@/types';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, Copy, Check, Info } from 'lucide-react';
import { Chip } from './Chip';

export interface SafetyPanelProps {
  event?: SafetyEvent;
  isLoading?: boolean;
  className?: string;
}

export function SafetyPanel({ event, isLoading = false, className = '' }: SafetyPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    if (!event) return;
    navigator.clipboard.writeText(event.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className={`p-4 bg-surface rounded-xl border border-border space-y-3 ${className}`}>
        <div className="flex items-center gap-2 text-sm text-foreground-secondary animate-pulse">
          <Shield className="w-4 h-4 text-sage" />
          <span>Evaluating response safety...</span>
        </div>
        <div className="h-2 bg-surface-elevated rounded-full overflow-hidden animate-pulse" />
        <div className="h-14 bg-surface-elevated rounded-md animate-pulse" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className={`p-6 bg-white rounded-2xl border border-border text-center shadow-soft ${className}`}>
        <Shield className="w-8 h-8 text-foreground-muted mx-auto mb-2 opacity-50" />
        <p className="text-xs text-foreground-secondary">
          Select an AI response to view its explainable safety assessment.
        </p>
      </div>
    );
  }

  // Edge case: Unavailable screening state
  if (event.unavailableState) {
    return (
      <div
        role="region"
        aria-live="polite"
        className={`p-5 bg-white rounded-2xl border border-amber-300 shadow-soft space-y-4 ${className}`}
      >
        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-amber-800">
              Safety Verification Unavailable
            </h4>
            <p className="text-xs text-foreground-secondary mt-1 leading-relaxed">
              The automated safety screening microservice did not respond in time. This reply has{' '}
              <strong className="text-foreground">not</strong> been verified against clinical policies. A restricted fallback model was used.
            </p>
          </div>
        </div>

        <div className="text-xs space-y-2 border-t border-border pt-3">
          <div className="flex justify-between text-foreground-secondary">
            <span>Status:</span>
            <span className="font-semibold text-amber-700">UNVERIFIED_FALLBACK</span>
          </div>
          <div className="flex justify-between text-foreground-secondary">
            <span>Event ID:</span>
            <span className="font-mono text-foreground">{event.id}</span>
          </div>
          <div className="flex justify-between text-foreground-secondary">
            <span>Audit Policy:</span>
            <span className="font-mono text-foreground">{event.policyVersion}</span>
          </div>
        </div>
      </div>
    );
  }

  const actionConfig = {
    ALLOWED: {
      label: 'Allowed (Normal)',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: ShieldCheck,
      description: 'Response complies with adolescent mental health safety policies.',
    },
    MODIFIED: {
      label: 'Modified by Guardrail',
      bg: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: Shield,
      description: 'System rewrote or softened language to preserve healthy emotional boundaries.',
    },
    BLOCKED: {
      label: 'Blocked Output',
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: ShieldAlert,
      description: 'Generated text failed safe communication rules and was safely intercepted.',
    },
    REDIRECTED: {
      label: 'Redirected',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Shield,
      description: 'Topic is outside AI scope (e.g., medical advice); safely pivoted to licensed providers.',
    },
    REFERRED: {
      label: 'Human Referral Offered',
      bg: 'bg-teal-50 text-teal-800 border-teal-200',
      icon: ShieldCheck,
      description: 'Longitudinal distress patterns detected. Direct connection to counsellor offered.',
    },
    CRISIS_INTERCEPTED: {
      label: 'Emergency Crisis Intercept',
      bg: 'bg-rose-600 text-white border-rose-600 font-semibold',
      icon: ShieldAlert,
      description: 'Immediate safety threshold met. Crisis resources (988) and human notification deployed.',
    },
  }[event.actionTaken];

  const ActionIcon = actionConfig.icon;
  const confidencePercent = Math.round(event.confidence * 100);
  const uncertaintyPercent = Math.round(event.uncertainty * 100);

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="AI Safety Assessment"
      className={`p-5 bg-white rounded-2xl border border-border shadow-soft space-y-4 ${className}`}
    >
      {/* Top Banner / Classification */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs uppercase tracking-wider text-foreground-muted font-medium">
            Explainable Safety Assessment
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-foreground-secondary">
            <Info className="w-3 h-3 text-sage" />
            Audited Policy
          </span>
        </div>

        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          {event.classification}
        </h4>
      </div>

      {/* Action Taken Badge */}
      <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 text-xs ${actionConfig.bg}`}>
        <ActionIcon className="w-4 h-4 shrink-0" />
        <div className="flex-1">
          <div className="font-semibold">{actionConfig.label}</div>
          <div className="text-[11px] opacity-85 mt-0.5">{actionConfig.description}</div>
        </div>
      </div>

      {/* Calibrated Confidence & Uncertainty */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-foreground-secondary">Safety Model Confidence:</span>
          <span className="font-medium text-foreground">{confidencePercent}%</span>
        </div>
        <div className="w-full bg-surface-elevated h-2 rounded-full overflow-hidden flex">
          <div
            className="bg-sage h-full transition-all duration-300"
            style={{ width: `${confidencePercent}%` }}
            title={`Confidence: ${confidencePercent}%`}
          />
          <div
            className="bg-calm-amber/60 h-full transition-all duration-300"
            style={{ width: `${uncertaintyPercent}%` }}
            title={`Uncertainty: ${uncertaintyPercent}%`}
          />
        </div>
        <div className="flex justify-between text-[11px] text-foreground-muted">
          <span>Certainty: {confidencePercent}%</span>
          <span>Calibrated Uncertainty: {uncertaintyPercent}%</span>
        </div>
      </div>

      {/* Detected Signals Chips */}
      {event.detectedSignals.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-foreground-secondary font-medium">
            Detected Signals ({event.detectedSignals.length}):
          </div>
          <div className="flex flex-wrap gap-1.5">
            {event.detectedSignals.map((sig, i) => {
              const chipVariant =
                sig.severity === 'critical'
                  ? 'coral'
                  : sig.severity === 'high'
                  ? 'amber'
                  : sig.severity === 'moderate'
                  ? 'blue'
                  : 'secondary';
              return (
                <Chip key={i} size="sm" variant={chipVariant}>
                  {sig.signal}
                </Chip>
              );
            })}
          </div>
        </div>
      )}

      {/* Human-Readable Decision Rationale */}
      <div className="p-3 bg-surface-elevated rounded-lg border border-border/80 space-y-1">
        <div className="text-[11px] uppercase tracking-wider text-foreground-muted font-medium">
          Policy Decision Rationale
        </div>
        <p className="text-xs text-foreground-secondary leading-relaxed">
          {event.rationale}
        </p>
      </div>

      {/* Metadata & Audit Event ID */}
      <div className="pt-2 border-t border-border/60 text-[11px] text-foreground-muted space-y-1.5 font-mono">
        <div className="flex justify-between items-center">
          <span>Audit Event ID:</span>
          <button
            type="button"
            onClick={handleCopyId}
            className="inline-flex items-center gap-1 text-foreground hover:text-sage transition-colors p-1 rounded"
            title="Copy Event ID"
          >
            <span>{event.id}</span>
            {copied ? <Check className="w-3 h-3 text-sage" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
        <div className="flex justify-between">
          <span>Policy Engine:</span>
          <span className="text-foreground">{event.policyVersion}</span>
        </div>
        <div className="flex justify-between">
          <span>Model:</span>
          <span className="text-foreground">{event.modelVersion}</span>
        </div>
      </div>
    </div>
  );
}
