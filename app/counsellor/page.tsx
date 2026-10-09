'use client';

import React from 'react';
import Link from 'next/link';
import { mockService } from '@/lib/mock/mockService';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import {
  Users,
  AlertTriangle,
  ClipboardList,
  ShieldAlert,
  ArrowRight,
  Clock,
  Calendar,
  CheckCircle2,
  FileText,
  UserCheck,
} from 'lucide-react';

export default function CounsellorOverviewPage() {
  const allCases = mockService.getCases();
  const pendingCases = allCases.filter((c) => c.status === 'PENDING_ACKNOWLEDGEMENT');
  const activeCases = allCases.filter((c) => c.status === 'ACTIVE');
  const followUps = mockService.getFollowUps().filter((f) => !f.isCompleted);
  const auditLogs = mockService.getAuditLogs();

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/70">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-sage-tint border border-sage/30 text-xs text-sage font-medium mb-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Oakridge High School • Counsellor Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Clinical Support Overview</h1>
          <p className="text-xs md:text-sm text-foreground-secondary mt-0.5">
            Oversight of assigned adolescent cases, intervention parameters, and safety audits.
          </p>
        </div>

        <Link href="/counsellor/cases">
          <Button variant="sage" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            View Assigned Cases ({allCases.filter((c) => c.isAssignedToCurrentUser).length})
          </Button>
        </Link>
      </div>

      {/* Key Counts Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Active Cases */}
        <Card className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-foreground-secondary font-semibold flex items-center justify-between">
            <span>Active Cases</span>
            <Users className="w-4 h-4 text-sage" />
          </div>
          <div className="text-2xl font-bold text-foreground">{activeCases.length}</div>
          <div className="text-[11px] text-foreground-muted">Assigned student cases</div>
        </Card>

        {/* Referrals Awaiting Acknowledgement */}
        <Card className="space-y-2 border-coral/30 bg-coral-tint/20">
          <div className="text-xs uppercase tracking-wider text-coral font-bold flex items-center justify-between">
            <span>Awaiting Review</span>
            <AlertTriangle className="w-4 h-4 text-coral" />
          </div>
          <div className="text-2xl font-bold text-coral">{pendingCases.length}</div>
          <div className="text-[11px] text-foreground-secondary">
            {pendingCases.length > 0 ? 'Urgent triage required' : 'All referrals cleared'}
          </div>
        </Card>

        {/* Upcoming Reviews */}
        <Card className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-foreground-secondary font-semibold flex items-center justify-between">
            <span>Upcoming Reviews</span>
            <Calendar className="w-4 h-4 text-calm-blue" />
          </div>
          <div className="text-2xl font-bold text-calm-blue">{followUps.length}</div>
          <div className="text-[11px] text-foreground-muted">Scheduled for this week</div>
        </Card>

        {/* Safety Intercepts */}
        <Card className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-foreground-secondary font-semibold flex items-center justify-between">
            <span>Safety Events</span>
            <ShieldAlert className="w-4 h-4 text-calm-amber" />
          </div>
          <div className="text-2xl font-bold text-foreground">{auditLogs.length}</div>
          <div className="text-[11px] text-foreground-muted">Audited & immutable</div>
        </Card>
      </div>

      {/* Main Grid: Referrals awaiting acknowledgement & Upcoming Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Referrals Awaiting Acknowledgement */}
        <div className="lg:col-span-7 space-y-4">
          <Card padding="lg" className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/70">
              <div>
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-coral" />
                  <span>Referrals Awaiting Acknowledgement</span>
                </h3>
                <p className="text-xs text-foreground-secondary mt-0.5">
                  High-priority student escalations generated from screening triggers or self-referrals.
                </p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-coral/20 text-coral font-semibold">
                {pendingCases.length} Pending
              </span>
            </div>

            <div className="space-y-3">
              {pendingCases.map((c) => (
                <div
                  key={c.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-coral/30 space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{c.studentName}</span>
                        <span className="text-xs text-foreground-muted font-medium">({c.grade})</span>
                        <Chip size="sm" variant="coral">
                          {c.urgency}
                        </Chip>
                      </div>
                      <p className="text-xs text-foreground-secondary mt-1">
                        Reason: <strong className="text-foreground">{c.referralReason}</strong>
                      </p>
                    </div>

                    <span className="text-[11px] text-foreground-muted font-mono shrink-0">
                      {c.lastActivity}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-border text-xs text-foreground-secondary space-y-1 shadow-xs">
                    <span className="font-bold text-foreground text-[11px] uppercase tracking-wider block">
                      Screening Evidence:
                    </span>
                    <p className="leading-relaxed">{c.referralEvidence}</p>
                    <div className="pt-1 text-[11px] text-foreground-muted">
                      Calibrated Uncertainty Score: {(c.uncertaintyScore * 100).toFixed(0)}%
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Link href={`/counsellor/cases/${c.id}`}>
                      <Button variant="sage" size="sm">
                        Review & Open Case Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (5 cols): Upcoming Reviews & Quick Case Jump */}
        <div className="lg:col-span-5 space-y-4">
          <Card padding="lg" className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/70">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-sage" />
                <span>Upcoming Case Reviews</span>
              </h3>
              <Link href="/counsellor/follow-ups" className="text-xs text-sage hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-2.5">
              {followUps.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-border space-y-1 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">{item.studentName}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        item.priority === 'urgent'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-teal-50 text-teal-700 border-teal-200'
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-foreground-secondary">{item.title}</p>
                  <div className="text-[11px] text-foreground-muted flex items-center gap-1 pt-1 font-medium">
                    <Clock className="w-3 h-3" />
                    Due: {new Date(item.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Core Safety Principle Card */}
          <div className="p-5 bg-white rounded-2xl border border-sage/30 shadow-soft space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-sage uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Explainable AI Guarantee</span>
            </div>
            <p className="text-xs text-foreground-secondary leading-relaxed">
              All AI interactions follow structured adolescent safety guidelines. You have transparent visibility into every classification rationale, signal confidence level, and applied policy version.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
