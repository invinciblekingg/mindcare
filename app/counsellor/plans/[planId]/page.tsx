'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockService } from '@/lib/mock/mockService';
import { InterventionPlan, PlanStatus } from '@/types';
import { StatusStepper } from '@/components/ui/StatusStepper';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Chip } from '@/components/ui/Chip';
import {
  FileCheck,
  ArrowLeft,
  Lock,
  GitCompare,
  Save,
  CheckCircle2,
  Clock,
  Plus,
  X,
  AlertCircle,
} from 'lucide-react';

export default function InterventionPlanEditorPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const planId = resolvedParams?.planId || 'plan_001_maya';

  const initialPlan = mockService.getInterventionPlan(planId) || mockService.getInterventionPlan('plan_001_maya')!;

  const [plan, setPlan] = useState<InterventionPlan>(initialPlan);
  const [supportGoals, setSupportGoals] = useState(plan.supportGoals);
  const [preferredResponseStyle, setPreferredResponseStyle] = useState(plan.preferredResponseStyle);
  const [approvedCopingStrategies, setApprovedCopingStrategies] = useState<string[]>(
    plan.approvedCopingStrategies
  );
  const [newStrategyInput, setNewStrategyInput] = useState('');
  const [topicsRequiringCare, setTopicsRequiringCare] = useState(plan.topicsRequiringCare);
  const [referralInstructions, setReferralInstructions] = useState(plan.referralInstructions);
  const [reviewSchedule, setReviewSchedule] = useState(plan.reviewSchedule);
  const [status, setStatus] = useState<PlanStatus>(plan.status);

  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
  const [saveBanner, setSaveBanner] = useState(false);

  const handleAddStrategy = () => {
    if (!newStrategyInput.trim()) return;
    if (!approvedCopingStrategies.includes(newStrategyInput.trim())) {
      setApprovedCopingStrategies([...approvedCopingStrategies, newStrategyInput.trim()]);
    }
    setNewStrategyInput('');
  };

  const handleRemoveStrategy = (item: string) => {
    setApprovedCopingStrategies(approvedCopingStrategies.filter((s) => s !== item));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = mockService.updateInterventionPlan(plan.id, {
      status,
      supportGoals,
      preferredResponseStyle,
      approvedCopingStrategies,
      topicsRequiringCare,
      referralInstructions,
      reviewSchedule,
    });

    if (updated) {
      setPlan({ ...updated });
      setSaveBanner(true);
      setTimeout(() => setSaveBanner(false), 3000);
    }
  };

  const v1 = plan.history.find((h) => h.version === 1) || plan.history[plan.history.length - 1];
  const v2 = plan.history.find((h) => h.version === 2) || plan.history[0];

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/70">
        <div className="flex items-center gap-3">
          <Link href="/counsellor/plans">
            <Button variant="ghost" size="sm" className="p-2" aria-label="Back to Plans">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                Intervention Plan: {plan.studentName}
              </h1>
              <span className="text-xs font-mono bg-sage-tint text-sage px-2 py-0.5 rounded border border-sage/30">
                Version {plan.currentVersion}
              </span>
            </div>
            <p className="text-xs text-foreground-secondary mt-0.5">
              Assigned Counsellor: {plan.counsellorName} • Last updated {new Date(plan.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {plan.history.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDiffModalOpen(true)}
              leftIcon={<GitCompare className="w-3.5 h-3.5" />}
            >
              Compare v{plan.currentVersion} vs v1 Diff
            </Button>
          )}

          <Link href={`/counsellor/cases/case_001_maya`}>
            <Button variant="secondary" size="sm">
              Open Case File
            </Button>
          </Link>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveBanner && (
        <div className="p-3 bg-sage-tint border border-sage/40 rounded-xl flex items-center justify-between text-xs text-sage animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              Intervention Plan v{plan.currentVersion} successfully saved and compiled to AI Companion profile!
            </span>
          </div>
        </div>
      )}

      {/* Status Stepper */}
      <Card padding="md">
        <div className="mb-2 text-xs uppercase tracking-wider text-foreground-secondary font-semibold">
          Workflow Status Progression (Click to Change)
        </div>
        <StatusStepper currentStatus={status} onStatusClick={(s) => setStatus(s)} />
      </Card>

      {/* MANDATORY LOCKED CARD: Core safety rules cannot be changed by plans */}
      <div className="p-5 bg-white rounded-2xl border border-sage/40 shadow-soft flex items-start gap-3.5">
        <Lock className="w-5 h-5 text-sage shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span>Core Safety Rules Cannot Be Changed By Plans</span>
            <span className="text-[10px] text-sage bg-sage/15 px-2 py-0.5 rounded border border-sage/30">
              Platform Invariant
            </span>
          </div>
          <p className="text-foreground-secondary leading-relaxed">
            Intervention plans customize communication style, approved coping practices, and referral reminders for this specific student. They <strong className="text-foreground">cannot disable or override platform-wide safety constraints</strong>, such as the emergency 988 crisis intercept, medical dosage deflection, or non-diagnostic boundaries.
          </p>
        </div>
      </div>

      {/* Form: Structured Intervention Parameters */}
      <form onSubmit={handleSave} className="space-y-6">
        <Card padding="lg" className="space-y-5">
          <CardHeader>
            <div>
              <CardTitle>Structured Intervention Parameters</CardTitle>
              <CardDescription>
                These fields are compiled into versioned prompt guidance for MindCareAI.
              </CardDescription>
            </div>
          </CardHeader>

          {/* 1. Support Goals */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-foreground-secondary font-semibold block">
              Support Goals
            </label>
            <p className="text-[11px] text-foreground-muted">
              Student-specific goals for supportive conversations and help-seeking.
            </p>
            <textarea
              rows={3}
              value={supportGoals}
              onChange={(e) => setSupportGoals(e.target.value)}
              className="w-full p-3 bg-surface-elevated border border-border rounded-lg text-xs md:text-sm text-foreground focus:outline-none focus:border-sage leading-relaxed resize-none"
            />
          </div>

          {/* 2. Preferred Response Style */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-foreground-secondary font-semibold block">
              Preferred Response Style
            </label>
            <p className="text-[11px] text-foreground-muted">
              e.g., gentle, brief (under 120 words), non-judgmental, validate before giving coping tips.
            </p>
            <textarea
              rows={2}
              value={preferredResponseStyle}
              onChange={(e) => setPreferredResponseStyle(e.target.value)}
              className="w-full p-3 bg-surface-elevated border border-border rounded-lg text-xs md:text-sm text-foreground focus:outline-none focus:border-sage leading-relaxed resize-none"
            />
          </div>

          {/* 3. Approved Coping Strategies */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-foreground-secondary font-semibold block">
              Approved Coping Strategies
            </label>
            <p className="text-[11px] text-foreground-muted">
              Counsellor-reviewed suggestions appropriate for this student's intervention plan.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {approvedCopingStrategies.map((item) => (
                <Chip
                  key={item}
                  variant="sage"
                  size="md"
                  onRemove={() => handleRemoveStrategy(item)}
                >
                  {item}
                </Chip>
              ))}
            </div>

            <div className="flex gap-2 pt-1 max-w-md">
              <input
                type="text"
                value={newStrategyInput}
                onChange={(e) => setNewStrategyInput(e.target.value)}
                placeholder="Add approved technique (e.g. 5-4-3-2-1 Grounding)..."
                className="flex-1 px-3 py-1.5 bg-surface-elevated border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-sage"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddStrategy}>
                Add
              </Button>
            </div>
          </div>

          {/* 4. Topics Requiring Care */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-foreground-secondary font-semibold block">
              Topics Requiring Care & Boundaries
            </label>
            <p className="text-[11px] text-foreground-muted">
              Specific conversational boundaries and triggers (e.g. limit nighttime rumination past 10 PM).
            </p>
            <textarea
              rows={2}
              value={topicsRequiringCare}
              onChange={(e) => setTopicsRequiringCare(e.target.value)}
              className="w-full p-3 bg-surface-elevated border border-border rounded-lg text-xs md:text-sm text-foreground focus:outline-none focus:border-sage leading-relaxed resize-none"
            />
          </div>

          {/* 5. Referral Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-foreground-secondary font-semibold block">
              Referral Instructions
            </label>
            <p className="text-[11px] text-foreground-muted">
              When and how the AI companion should invite reconnecting with human support.
            </p>
            <textarea
              rows={2}
              value={referralInstructions}
              onChange={(e) => setReferralInstructions(e.target.value)}
              className="w-full p-3 bg-surface-elevated border border-border rounded-lg text-xs md:text-sm text-foreground focus:outline-none focus:border-sage leading-relaxed resize-none"
            />
          </div>

          {/* 6. Review Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-foreground-secondary font-semibold block">
                Review Schedule Cadence
              </label>
              <input
                type="text"
                value={reviewSchedule}
                onChange={(e) => setReviewSchedule(e.target.value)}
                className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-sage"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-foreground-secondary font-semibold block">
                Next Review Date
              </label>
              <input
                type="date"
                value={plan.nextReviewDate}
                onChange={(e) => setPlan({ ...plan, nextReviewDate: e.target.value })}
                className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-sage"
              />
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Link href="/counsellor/plans">
            <Button variant="ghost" size="md">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="sage" size="lg" leftIcon={<Save className="w-4 h-4" />}>
            Publish & Save Version {plan.currentVersion + 1}
          </Button>
        </div>
      </form>

      {/* Version Diff Modal */}
      {isDiffModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsDiffModalOpen(false)}
          maxWidth="2xl"
          title={
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-sage" />
              <span>Version History Diff: v{v2?.version || 2} vs v{v1?.version || 1}</span>
            </div>
          }
          description="Side-by-side clinical audit comparison of intervention plan revisions."
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 pb-3 border-b border-border/70">
              <div>
                <span className="font-semibold text-foreground">v{v1?.version || 1} (Superseded)</span>
                <div className="text-[11px] text-foreground-muted">Updated: {v1?.updatedAt ? new Date(v1.updatedAt).toLocaleDateString() : 'N/A'}</div>
              </div>
              <div>
                <span className="font-semibold text-sage">v{v2?.version || 2} (Current Active)</span>
                <div className="text-[11px] text-foreground-muted">Updated: {v2?.updatedAt ? new Date(v2.updatedAt).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>

            {/* Support Goals Diff */}
            <div className="space-y-1">
              <span className="font-semibold text-foreground-secondary uppercase tracking-wider text-[11px]">
                Support Goals Comparison:
              </span>
              <div className="grid grid-cols-2 gap-4 p-3 bg-surface-elevated rounded-lg border border-border">
                <div className="text-foreground-secondary line-through opacity-75 leading-relaxed">
                  {v1?.supportGoals}
                </div>
                <div className="text-sage leading-relaxed font-medium">
                  {v2?.supportGoals}
                </div>
              </div>
            </div>

            {/* Response Style Diff */}
            <div className="space-y-1">
              <span className="font-semibold text-foreground-secondary uppercase tracking-wider text-[11px]">
                Preferred Response Style:
              </span>
              <div className="grid grid-cols-2 gap-4 p-3 bg-surface-elevated rounded-lg border border-border">
                <div className="text-foreground-secondary opacity-75">{v1?.preferredResponseStyle}</div>
                <div className="text-sage font-medium">{v2?.preferredResponseStyle}</div>
              </div>
            </div>

            {/* Coping Strategies Diff */}
            <div className="space-y-1">
              <span className="font-semibold text-foreground-secondary uppercase tracking-wider text-[11px]">
                Approved Coping Strategies:
              </span>
              <div className="grid grid-cols-2 gap-4 p-3 bg-surface-elevated rounded-lg border border-border">
                <div className="space-y-1 text-foreground-secondary opacity-75">
                  {v1?.approvedCopingStrategies.map((s, i) => (
                    <div key={i}>• {s}</div>
                  ))}
                </div>
                <div className="space-y-1 text-sage font-medium">
                  {v2?.approvedCopingStrategies.map((s, i) => (
                    <div key={i}>• {s}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <Button variant="secondary" size="sm" onClick={() => setIsDiffModalOpen(false)}>
                Close Diff View
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
