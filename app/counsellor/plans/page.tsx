'use client';

import React from 'react';
import Link from 'next/link';
import { SAMPLE_INTERVENTION_PLANS } from '@/lib/mock/counsellorCasesData';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { FileCheck, ArrowRight, Clock, Plus, Lock, CheckCircle2 } from 'lucide-react';

export default function InterventionPlansIndexPage() {
  const plans = Object.values(SAMPLE_INTERVENTION_PLANS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/70">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Intervention Plans</h1>
          <p className="text-xs md:text-sm text-foreground-secondary mt-0.5">
            Structured clinical guidelines published to the AI companion. Core safety rules remain immutable.
          </p>
        </div>

        <Link href="/counsellor/plans/plan_001_maya">
          <Button variant="sage" size="md" leftIcon={<FileCheck className="w-4 h-4" />}>
            Open Maya Lin’s Plan (v2 Active)
          </Button>
        </Link>
      </div>

      {/* Locked Safety Card */}
      <div className="p-5 bg-white rounded-2xl border border-sage/30 shadow-soft flex items-start gap-3.5">
        <Lock className="w-5 h-5 text-sage shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <h4 className="font-semibold text-foreground">
            Platform Guardrail Invariance
          </h4>
          <p className="text-foreground-secondary leading-relaxed">
            Intervention plans shape tone, coping preferences, and gentle goals. They <strong className="text-foreground">cannot disable or weaken platform-level safety rules</strong> (e.g., medical advice deflection, self-harm crisis intercept).
          </p>
        </div>
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((p) => (
          <Card key={p.id} className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                <div>
                  <h3 className="font-semibold text-sm text-foreground">{p.studentName}</h3>
                  <span className="text-xs text-foreground-secondary">Version {p.currentVersion}</span>
                </div>
                <Chip size="sm" variant={p.status === 'ACTIVE' ? 'sage' : 'blue'}>
                  {p.status}
                </Chip>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <span className="text-foreground-muted font-semibold uppercase text-[10px] block">
                    Support Goals:
                  </span>
                  <p className="text-foreground-secondary line-clamp-2 mt-0.5">
                    {p.supportGoals}
                  </p>
                </div>

                <div>
                  <span className="text-foreground-muted font-semibold uppercase text-[10px] block">
                    Approved Strategies:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {p.approvedCopingStrategies.slice(0, 3).map((st) => (
                      <Chip key={st} size="sm" variant="secondary">
                        {st}
                      </Chip>
                    ))}
                    {p.approvedCopingStrategies.length > 3 && (
                      <span className="text-[11px] text-foreground-muted self-center">
                        +{p.approvedCopingStrategies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-foreground-muted flex items-center justify-between border-t border-border/40">
                  <span>Review schedule: {p.reviewSchedule}</span>
                  <span className="font-mono">Next: {p.nextReviewDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link href={`/counsellor/plans/${p.id}`} className="block">
                <Button variant="secondary" size="sm" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Edit Plan & Version Diff
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
