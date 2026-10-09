'use client';

import React, { useState } from 'react';
import { mockService } from '@/lib/mock/mockService';
import { FollowUpItem } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  Plus,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUpItem[]>(mockService.getFollowUps());
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  const handleToggle = (id: string) => {
    mockService.toggleFollowUp(id);
    setFollowUps(mockService.getFollowUps());
  };

  const filteredItems = followUps.filter((item) => {
    if (filter === 'PENDING') return !item.isCompleted;
    if (filter === 'COMPLETED') return item.isCompleted;
    return true;
  });

  const pendingCount = followUps.filter((f) => !f.isCompleted).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/70">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Follow-ups & Scheduled Reviews</h1>
          <p className="text-xs md:text-sm text-foreground-secondary mt-0.5">
            Clinical case reminders, intake acknowledgements, and intervention check-ins.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-surface p-1 rounded-lg border border-border">
          {[
            { id: 'ALL', label: 'All Items' },
            { id: 'PENDING', label: `Pending (${pendingCount})` },
            { id: 'COMPLETED', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                filter === tab.id
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-foreground-secondary hover:text-foreground hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isUrgent = item.priority === 'urgent';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.isCompleted
                  ? 'bg-surface/50 border-border/50 opacity-60'
                  : isUrgent
                  ? 'bg-surface border-coral/40 shadow-soft'
                  : 'bg-surface border-border hover:border-border-highlight'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <input
                  type="checkbox"
                  checked={item.isCompleted}
                  onChange={() => handleToggle(item.id)}
                  aria-label={`Mark ${item.title} as completed`}
                  className="mt-1 w-4 h-4 rounded border-border text-sage focus:ring-sage cursor-pointer"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        item.isCompleted ? 'line-through text-foreground-secondary' : 'text-foreground'
                      }`}
                    >
                      {item.title}
                    </span>
                    <Chip size="sm" variant={isUrgent ? 'coral' : 'secondary'}>
                      {item.category}
                    </Chip>
                  </div>

                  <div className="text-xs text-foreground-secondary flex items-center gap-2">
                    <span>Student: <strong className="text-foreground">{item.studentName}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono text-[11px] text-foreground-muted">
                      <Clock className="w-3 h-3" />
                      Due: {new Date(item.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <Link href={`/counsellor/cases/${item.caseId}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    View Case File
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
