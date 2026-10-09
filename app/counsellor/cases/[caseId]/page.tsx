'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockService } from '@/lib/mock/mockService';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { TrendChart } from '@/components/ui/TrendChart';
import {
  ShieldAlert,
  ArrowLeft,
  Lock,
  UserCheck,
  FileCheck,
  BookOpen,
  Calendar,
  AlertTriangle,
  Plus,
  Shield,
  FileText,
  Clock,
  Phone,
  Mail,
} from 'lucide-react';

export default function CaseDetailPage({ params }: { params: Promise<{ caseId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const caseId = resolvedParams?.caseId || 'case_001_maya';

  const { caseData, isDenied } = mockService.getCaseById(caseId);

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MOOD' | 'JOURNALS' | 'SAFETY' | 'NOTES'>('OVERVIEW');
  const [newNoteText, setNewNoteText] = useState('');
  const [noteSuccess, setNoteSuccess] = useState(false);

  // ACCESS DENIED SCREEN FOR UNASSIGNED CASES
  if (isDenied || !caseData) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-coral-tint border border-coral/40 flex items-center justify-center mx-auto text-coral">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Access Restricted: Unassigned Case</h1>
          <p className="text-xs md:text-sm text-foreground-secondary leading-relaxed">
            Under FERPA and clinical least-privilege policies, access to student files is strictly limited to their primary assigned counsellor.
          </p>
        </div>

        <div className="p-4 bg-surface rounded-xl border border-border text-left text-xs space-y-1.5 text-foreground-secondary">
          <div className="flex justify-between">
            <span>Case ID:</span>
            <span className="font-mono text-foreground">{caseId}</span>
          </div>
          <div className="flex justify-between">
            <span>Primary Assigned:</span>
            <span className="text-foreground">{caseData?.assignedCounsellorName || 'West Campus Staff'}</span>
          </div>
          <div className="flex justify-between">
            <span>Your Session:</span>
            <span className="text-sage font-medium">Ms. Sarah Henderson, LPC</span>
          </div>
        </div>

        <div className="pt-2">
          <Link href="/counsellor/cases">
            <Button variant="sage" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return to Your Case Queue
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Consented student data
  const checkIns = mockService.getCheckIns();
  const consentedJournals = mockService.getJournals('', 'SHARED_WITH_COUNSELLOR');
  const auditLogs = mockService.getAuditLogs().slice(0, 5);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    mockService.addSessionNote(caseData.id, newNoteText.trim());
    setNewNoteText('');
    setNoteSuccess(true);
    setTimeout(() => setNoteSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/70">
        <div className="flex items-center gap-3">
          <Link href="/counsellor/cases">
            <Button variant="ghost" size="sm" className="p-2" aria-label="Back to Cases">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-foreground">{caseData.studentName}</h1>
              <Chip
                size="sm"
                variant={caseData.urgency === 'URGENT' ? 'coral' : caseData.urgency === 'ELEVATED' ? 'amber' : 'secondary'}
              >
                {caseData.urgency}
              </Chip>
              <Chip size="sm" variant={caseData.status === 'ACTIVE' ? 'sage' : 'blue'}>
                {caseData.status.replace('_', ' ')}
              </Chip>
            </div>
            <p className="text-xs text-foreground-secondary mt-0.5">
              {caseData.grade} • Age {caseData.studentAge} • Case ID: <span className="font-mono">{caseData.id}</span>
            </p>
          </div>
        </div>

        {caseData.hasInterventionPlan && caseData.interventionPlanId && (
          <Link href={`/counsellor/plans/${caseData.interventionPlanId}`}>
            <Button variant="sage" size="sm" leftIcon={<FileCheck className="w-4 h-4" />}>
              Intervention Plan v2 (Active)
            </Button>
          </Link>
        )}
      </div>

      {/* Student Profile Quick Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-white rounded-2xl border border-border text-xs shadow-soft">
        <div className="space-y-1">
          <span className="text-foreground-secondary uppercase tracking-wider text-[11px] font-semibold">
            Guardian & Emergency Contact
          </span>
          <div className="text-foreground font-medium">{caseData.guardianName}</div>
          <div className="text-foreground-muted flex items-center gap-1">
            <Phone className="w-3 h-3" /> {caseData.guardianPhone}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-foreground-secondary uppercase tracking-wider text-[11px] font-semibold">
            Assigned Counsellor
          </span>
          <div className="text-foreground font-medium">{caseData.assignedCounsellorName}</div>
          <div className="text-sage">Consent Verified & Active</div>
        </div>

        <div className="space-y-1">
          <span className="text-foreground-secondary uppercase tracking-wider text-[11px] font-semibold">
            Privacy Scope
          </span>
          <div className="text-foreground">Consented Journal Excerpts Only</div>
          <div className="text-foreground-muted">2 Private journals held on student device</div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-border/80 gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'OVERVIEW', label: 'Referral & Evidence' },
          { id: 'MOOD', label: 'Consented Wellbeing Trends' },
          { id: 'JOURNALS', label: `Shared Journals (${consentedJournals.length})` },
          { id: 'SAFETY', label: 'Safety Events (5)' },
          { id: 'NOTES', label: `Session Notes (${caseData.sessionNotes.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs md:text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-sage text-sage font-semibold'
                : 'border-transparent text-foreground-secondary hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Referral & Evidence */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-4">
          <Card padding="lg" className="space-y-4">
            <CardHeader>
              <div>
                <CardTitle>Referral Reason</CardTitle>
                <CardDescription>Documented clinical triage entry point.</CardDescription>
              </div>
            </CardHeader>
            <p className="text-sm text-foreground leading-relaxed bg-surface-elevated p-4 rounded-xl border border-border">
              {caseData.referralReason}
            </p>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs uppercase tracking-wider text-foreground-secondary font-semibold">
                Recorded Evidence & Uncertainty
              </h4>
              <div className="p-4 bg-surface-elevated rounded-xl border border-border space-y-2 text-xs">
                <p className="text-foreground-secondary leading-relaxed">{caseData.referralEvidence}</p>
                <div className="pt-2 border-t border-border flex items-center justify-between text-foreground-muted">
                  <span>Model Uncertainty Calibration:</span>
                  <span className="font-mono text-sage font-semibold">
                    {(caseData.uncertaintyScore * 100).toFixed(0)}% uncertainty (High confidence)
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: Consented Wellbeing Trends */}
      {activeTab === 'MOOD' && (
        <div className="space-y-4">
          <TrendChart checkIns={checkIns} />
        </div>
      )}

      {/* TAB 3: Consented Journals Only */}
      {activeTab === 'JOURNALS' && (
        <div className="space-y-4">
          {/* Privacy Note Banner */}
          <div className="p-3 bg-surface-elevated rounded-xl border border-sage/30 flex items-start gap-2.5 text-xs text-foreground-secondary">
            <Lock className="w-4 h-4 text-sage shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-foreground">FERPA / Student Privacy Guardrail:</strong> You are viewing only entries that Maya has explicitly chosen to share with you. Any entries kept private remain strictly encrypted on the student's personal client.
            </p>
          </div>

          <div className="space-y-3">
            {consentedJournals.map((j) => (
              <Card key={j.id} padding="md" className="space-y-3">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="font-semibold text-sm text-foreground">{j.title}</span>
                  <span className="text-[11px] text-foreground-muted flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    Shared {new Date(j.sharedAt || j.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-xs text-foreground-secondary leading-relaxed whitespace-pre-line">
                  {j.content}
                </p>
                <div className="flex gap-1.5 pt-1">
                  {j.moodTags.map((t) => (
                    <Chip key={t} size="sm" variant="sage">
                      {t}
                    </Chip>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Safety Events */}
      {activeTab === 'SAFETY' && (
        <div className="space-y-3">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 bg-surface rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-calm-amber" />
                  <span className="font-semibold text-foreground">{log.details}</span>
                </div>
                <div className="text-[11px] text-foreground-muted font-mono">
                  Audit Hash: {log.hash.slice(0, 24)}... • {new Date(log.timestamp).toLocaleDateString()}
                </div>
              </div>

              <Chip size="sm" variant={log.safetyAction === 'ALLOWED' ? 'sage' : 'coral'}>
                {log.safetyAction}
              </Chip>
            </div>
          ))}
        </div>
      )}

      {/* TAB 5: Session Notes */}
      {activeTab === 'NOTES' && (
        <div className="space-y-6">
          {/* Add Session Note Form */}
          <Card padding="lg" className="space-y-4">
            <CardHeader>
              <div>
                <CardTitle>Record Confidential Session Note</CardTitle>
                <CardDescription>
                  Stored in the clinical student record; not visible in the student's companion chat.
                </CardDescription>
              </div>
            </CardHeader>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows={4}
                required
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Enter confidential clinical observations, coping exercises agreed upon, and next follow-up dates..."
                className="w-full p-3.5 bg-surface-elevated border border-border rounded-lg text-xs md:text-sm text-foreground focus:outline-none focus:border-sage resize-none leading-relaxed"
              />

              <div className="flex items-center justify-between">
                {noteSuccess ? (
                  <span className="text-xs text-sage font-medium">Session note saved to chart!</span>
                ) : (
                  <span className="text-[11px] text-foreground-muted">Audited entry with timestamp.</span>
                )}

                <Button type="submit" variant="sage" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Save Session Note
                </Button>
              </div>
            </form>
          </Card>

          {/* Historical Session Notes */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider text-foreground-secondary font-semibold">
              Past Clinical Notes ({caseData.sessionNotes.length})
            </h3>
            {caseData.sessionNotes.map((note) => (
              <div key={note.id} className="p-4 bg-surface rounded-xl border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="font-semibold text-foreground">{note.author}</span>
                  <span className="text-foreground-muted font-mono">
                    {new Date(note.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-foreground-secondary leading-relaxed whitespace-pre-line">
                  {note.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
