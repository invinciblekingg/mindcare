'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockService } from '@/lib/mock/mockService';
import { CounsellorCase } from '@/types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { Users, Filter, ArrowRight, AlertTriangle, ShieldCheck, Lock } from 'lucide-react';
import Link from 'next/link';

export default function CounsellorCaseQueuePage() {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterUrgency, setFilterUrgency] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const cases = mockService.getCases(filterStatus, filterUrgency, searchQuery);

  const columns: Column<CounsellorCase>[] = [
    {
      header: 'Student',
      cell: (row) => (
        <div>
          <div className="font-semibold text-foreground flex items-center gap-1.5">
            <span>{row.studentName}</span>
            {!row.isAssignedToCurrentUser && (
              <span className="text-[10px] text-coral bg-coral-tint px-1.5 py-0.5 rounded border border-coral/30">
                Unassigned
              </span>
            )}
          </div>
          <div className="text-xs text-foreground-secondary">{row.grade} • Age {row.studentAge}</div>
        </div>
      ),
    },
    {
      header: 'Urgency',
      cell: (row) => {
        const variant =
          row.urgency === 'URGENT' ? 'coral' : row.urgency === 'ELEVATED' ? 'amber' : 'secondary';
        return <Chip size="sm" variant={variant}>{row.urgency}</Chip>;
      },
    },
    {
      header: 'Status',
      cell: (row) => {
        const variant =
          row.status === 'ACTIVE'
            ? 'sage'
            : row.status === 'PENDING_ACKNOWLEDGEMENT'
            ? 'coral'
            : 'blue';
        return (
          <Chip size="sm" variant={variant}>
            {row.status.replace('_', ' ')}
          </Chip>
        );
      },
    },
    {
      header: 'Referral Reason',
      cell: (row) => (
        <span className="text-xs text-foreground-secondary line-clamp-1 max-w-xs" title={row.referralReason}>
          {row.referralReason}
        </span>
      ),
    },
    {
      header: 'Last Activity',
      accessorKey: 'lastActivity',
      className: 'text-xs text-foreground-muted whitespace-nowrap',
    },
    {
      header: 'Consented Content',
      cell: (row) => (
        <span className="text-xs text-foreground-secondary">
          {row.consentedJournalCount} journals • {row.safetyIncidentCount} events
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          className="text-xs py-1 px-2.5 min-h-[32px]"
          rightIcon={<ArrowRight className="w-3 h-3" />}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/counsellor/cases/${row.id}`);
          }}
        >
          Open Case
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/70">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Assigned-Case Queue</h1>
          <p className="text-xs md:text-sm text-foreground-secondary mt-0.5">
            Active adolescent caseload assigned to Ms. Sarah Henderson, LPC.
          </p>
        </div>

        {/* Demo Link: Unassigned case access test */}
        <Link href="/counsellor/cases/case_unassigned_999">
          <Button variant="outline" size="sm" leftIcon={<Lock className="w-3.5 h-3.5 text-coral" />}>
            Test Unassigned Access Denied Page
          </Button>
        </Link>
      </div>

      {/* Data Table with Filters */}
      <DataTable
        data={cases}
        columns={columns}
        searchPlaceholder="Search student name, email, or reason..."
        onSearchChange={setSearchQuery}
        onRowClick={(row) => router.push(`/counsellor/cases/${row.id}`)}
        filterComponent={
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              aria-label="Filter cases by status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-border rounded-full text-xs text-foreground focus:outline-none focus:bg-white focus:border-slate-400 shadow-xs"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING_ACKNOWLEDGEMENT">Pending Acknowledgement</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="CLOSED">Closed</option>
            </select>

            {/* Urgency Filter */}
            <select
              aria-label="Filter cases by urgency"
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-border rounded-full text-xs text-foreground focus:outline-none focus:bg-white focus:border-slate-400 shadow-xs"
            >
              <option value="ALL">All Urgencies</option>
              <option value="URGENT">Urgent</option>
              <option value="ELEVATED">Elevated</option>
              <option value="ROUTINE">Routine</option>
            </select>
          </div>
        }
      />
    </div>
  );
}
