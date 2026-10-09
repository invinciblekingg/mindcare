'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Lock, ArrowLeft, CheckCircle2, Shield, Clock } from 'lucide-react';

export default function AdminRetentionPage() {
  const [rollingDays, setRollingDays] = useState(90);
  const [archivalMode, setArchivalMode] = useState('ACADEMIC_YEAR_END');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-border/70">
        <Link href="/admin">
          <Button variant="ghost" size="sm" className="p-2" aria-label="Back to Admin">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Data Retention & Purge Rules</h1>
          <p className="text-xs md:text-sm text-foreground-secondary mt-0.5">
            Configure automated compliance purges across adolescent chat and logs.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-3 bg-sage-tint border border-sage/40 rounded-xl flex items-center gap-2 text-xs text-sage">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Retention parameters updated across district clusters.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <Card padding="lg" className="space-y-4">
          <CardHeader>
            <div>
              <CardTitle>Rolling Conversation Purge</CardTitle>
              <CardDescription>
                Routine companion chats are automatically erased after this period unless linked to an active safety referral.
              </CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
              Purge Threshold (Days):
            </label>
            <select
              value={rollingDays}
              onChange={(e) => setRollingDays(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:bg-white focus:border-slate-400 shadow-xs"
            >
              <option value={30}>30 Days (Strict Minimization)</option>
              <option value={60}>60 Days</option>
              <option value={90}>90 Days (Recommended Adolescent Baseline)</option>
              <option value={180}>180 Days (Semester Lock)</option>
            </select>
          </div>
        </Card>

        <Card padding="lg" className="space-y-4">
          <CardHeader>
            <div>
              <CardTitle>Student Archival Schedule</CardTitle>
              <CardDescription>
                When graduating seniors or departing students have their records exported and deleted.
              </CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
              Archival Mode:
            </label>
            <select
              value={archivalMode}
              onChange={(e) => setArchivalMode(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:bg-white focus:border-slate-400 shadow-xs"
            >
              <option value="ACADEMIC_YEAR_END">End of School Year (June 30)</option>
              <option value="GRADUATION_ONLY">Upon Official Graduation</option>
              <option value="MANUAL_REQUEST">On-Demand via School Registrar</option>
            </select>
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" variant="sage" size="md">
            Save Retention Policies
          </Button>
        </div>
      </form>
    </div>
  );
}
