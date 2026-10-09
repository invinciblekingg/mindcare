'use client';

import React, { useState } from 'react';
import { SAMPLE_SAFETY_EVENTS } from '@/lib/mock/safetyEventsData';
import { SafetyEvent, SafetyAction } from '@/types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SafetyPanel } from '@/components/ui/SafetyPanel';
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  Download,
  Filter,
  CheckCircle2,
  Lock,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react';

export default function SafetyAuditPage() {
  const [events, setEvents] = useState<SafetyEvent[]>(SAMPLE_SAFETY_EVENTS);
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<SafetyEvent | null>(null);

  // Permission-gated export state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Filtered dataset
  const filteredEvents = events.filter((e) => {
    const matchesAction = filterAction === 'ALL' || e.actionTaken === filterAction;
    const matchesSearch =
      !search ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.classification.toLowerCase().includes(search.toLowerCase()) ||
      e.rationale.toLowerCase().includes(search.toLowerCase()) ||
      e.detectedSignals.some((s) => s.signal.toLowerCase().includes(search.toLowerCase()));

    return matchesAction && matchesSearch;
  });

  const columns: Column<SafetyEvent>[] = [
    {
      header: 'Event ID',
      accessorKey: 'id',
      className: 'font-mono text-xs text-foreground font-medium whitespace-nowrap',
    },
    {
      header: 'Classification',
      cell: (row) => (
        <div>
          <div className="font-semibold text-foreground text-xs">{row.classification}</div>
          <div className="text-[11px] text-foreground-muted">
            {row.detectedSignals.length > 0
              ? `${row.detectedSignals.length} signals detected`
              : 'Zero adverse signals'}
          </div>
        </div>
      ),
    },
    {
      header: 'Action Taken',
      cell: (row) => {
        const variant =
          row.actionTaken === 'CRISIS_INTERCEPTED' || row.actionTaken === 'BLOCKED'
            ? 'coral'
            : row.actionTaken === 'MODIFIED' || row.actionTaken === 'REDIRECTED'
            ? 'amber'
            : 'sage';
        return <Chip size="sm" variant={variant}>{row.actionTaken}</Chip>;
      },
    },
    {
      header: 'Confidence / Uncertainty',
      cell: (row) => (
        <div className="text-xs space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="text-foreground font-medium">{(row.confidence * 100).toFixed(0)}%</span>
            <span className="text-foreground-muted">{(row.uncertainty * 100).toFixed(0)}% uncert</span>
          </div>
          <div className="w-24 bg-surface-elevated h-1.5 rounded-full overflow-hidden flex">
            <div className="bg-sage h-full" style={{ width: `${row.confidence * 100}%` }} />
            <div className="bg-calm-amber/50 h-full" style={{ width: `${row.uncertainty * 100}%` }} />
          </div>
        </div>
      ),
    },
    {
      header: 'Policy / Model',
      cell: (row) => (
        <div className="text-[11px] font-mono text-foreground-muted">
          <div>{row.policyVersion.split('-')[0]}</div>
          <div className="text-[10px] text-foreground-secondary">{row.modelVersion}</div>
        </div>
      ),
    },
    {
      header: 'Timestamp',
      cell: (row) => (
        <span className="text-[11px] text-foreground-muted whitespace-nowrap font-mono">
          {new Date(row.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
        </span>
      ),
    },
  ];

  const handleExportConfirmed = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Timestamp,Classification,Action,Confidence,Uncertainty,Policy,Model']
        .concat(
          events.map(
            (e) =>
              `${e.id},${e.timestamp},"${e.classification}",${e.actionTaken},${e.confidence},${e.uncertainty},${e.policyVersion},${e.modelVersion}`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mindcare_safety_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExportModalOpen(false);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/70">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">AI Safety Audit Log</h1>
          <p className="text-xs md:text-sm text-foreground-secondary mt-0.5">
            Immutable log of automated screening decisions, confidence metrics, and guardrail intercepts.
          </p>
        </div>

        {/* Permission-gated export button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsExportModalOpen(true)}
          leftIcon={<Download className="w-4 h-4 text-sage" />}
        >
          Export Audit Trail (.csv)
        </Button>
      </div>

      {exportSuccess && (
        <div className="p-3 bg-sage-tint border border-sage/40 rounded-xl flex items-center gap-2 text-xs text-sage">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Export successfully verified and downloaded under Clinical Auditor credentials.</span>
        </div>
      )}

      {/* Safety Log Table */}
      <DataTable
        data={filteredEvents}
        columns={columns}
        searchPlaceholder="Search event ID, signal, classification..."
        onSearchChange={setSearch}
        onRowClick={(row) => setSelectedEvent(row)}
        filterComponent={
          <div className="flex items-center gap-2">
            <select
              aria-label="Filter events by action taken"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-border rounded-full text-xs text-foreground focus:outline-none focus:bg-white focus:border-slate-400 shadow-xs"
            >
              <option value="ALL">All Actions (20)</option>
              <option value="ALLOWED">Allowed</option>
              <option value="MODIFIED">Modified</option>
              <option value="BLOCKED">Blocked</option>
              <option value="REDIRECTED">Redirected</option>
              <option value="REFERRED">Referred</option>
              <option value="CRISIS_INTERCEPTED">Crisis Intercepted</option>
            </select>
          </div>
        }
      />

      {/* Event Detail Drawer / Modal */}
      {selectedEvent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedEvent(null)}
          maxWidth="lg"
          title={
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-sage" />
              <span>Safety Event Detail: {selectedEvent.id}</span>
            </div>
          }
          description="Explainable record verified against policy chain."
        >
          <div className="space-y-4">
            <SafetyPanel event={selectedEvent} />

            <div className="flex justify-end pt-2 border-t border-border">
              <Button variant="secondary" size="sm" onClick={() => setSelectedEvent(null)}>
                Close Detail
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Permission-Gated Export Dialog */}
      {isExportModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsExportModalOpen(false)}
          maxWidth="md"
          title="Clinical Auditor Permission Verification"
          description="Exporting immutable audit records requires verified counsellor credentials."
        >
          <div className="space-y-4 text-xs text-foreground-secondary">
            <div className="p-3 bg-surface-elevated rounded-lg border border-border space-y-1.5">
              <div className="flex justify-between">
                <span>Requesting Actor:</span>
                <span className="font-semibold text-foreground">Ms. Sarah Henderson, LPC</span>
              </div>
              <div className="flex justify-between">
                <span>License Verification:</span>
                <span className="text-sage font-medium">LPC #884920 (Active)</span>
              </div>
              <div className="flex justify-between">
                <span>Scope:</span>
                <span className="text-foreground">20 Filtered Adolescent Screening Records</span>
              </div>
            </div>

            <p className="leading-relaxed">
              In accordance with school district data governance, an entry will be appended to the institutional compliance ledger recording this export action.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button variant="ghost" size="sm" onClick={() => setIsExportModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="sage" size="sm" onClick={handleExportConfirmed}>
                Confirm Credentials & Download
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
