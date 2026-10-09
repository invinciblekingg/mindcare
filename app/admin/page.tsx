'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheck,
  Users,
  Lock,
  Server,
  ArrowRight,
  AlertCircle,
  FileText,
  CheckCircle2,
} from 'lucide-react';

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/70">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-calm-blue/15 border border-calm-blue/30 text-xs text-calm-blue font-medium mb-1.5">
            <Server className="w-3.5 h-3.5" />
            <span>District IT & Compliance Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">System Compliance & Administration</h1>
          <p className="text-xs md:text-sm text-foreground-secondary mt-0.5">
            Counsellor licensing verification, encryption retention parameters, and immutable audit operations.
          </p>
        </div>
      </div>

      {/* PROMINENT PRIVACY CARD: Admins do NOT get automatic journal access */}
      <div className="p-5 bg-amber-50/70 rounded-2xl border border-amber-200/80 shadow-soft flex items-start gap-3.5">
        <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1.5">
          <h4 className="font-bold text-foreground flex items-center gap-2">
            <span>Mandatory Privacy Partition</span>
            <span className="text-[10px] text-amber-800 bg-amber-100 font-semibold px-2 py-0.5 rounded-full border border-amber-300">
              Zero Automatic Journal Access
            </span>
          </h4>
          <p className="text-foreground-secondary leading-relaxed">
            Platform administrators manage accounts, verify credentials, and enforce data retention rules. Under strict FERPA and least-privilege architecture, <strong className="text-foreground">administrative role membership does NOT grant access to confidential student journal entries or private companion chat content</strong>.
          </p>
        </div>
      </div>

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Module 1: Counsellor Verification */}
        <Card className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <span className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-sage" /> Counsellor Verification
              </span>
              <span className="text-xs text-sage font-mono">3 Verified</span>
            </div>
            <p className="text-xs text-foreground-secondary mt-2 leading-relaxed">
              Verify state licensure (LPC / LCSW), school district credentials, and case assignment limits.
            </p>
          </div>
          <Link href="/admin/counsellors">
            <Button variant="secondary" size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Manage Verification
            </Button>
          </Link>
        </Card>

        {/* Module 2: Retention Policies */}
        <Card className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <span className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-calm-blue" /> Retention & Purge
              </span>
              <span className="text-xs text-calm-blue font-mono">90-Day Policy</span>
            </div>
            <p className="text-xs text-foreground-secondary mt-2 leading-relaxed">
              Configure automated rolling scrub rules, academic year archival, and student export policies.
            </p>
          </div>
          <Link href="/admin/retention">
            <Button variant="secondary" size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Configure Policies
            </Button>
          </Link>
        </Card>

        {/* Module 3: Audit Operations */}
        <Card className="flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <span className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Server className="w-4 h-4 text-sage" /> Audit Chain Ledger
              </span>
              <span className="text-xs text-sage font-mono">SHA-256 Valid</span>
            </div>
            <p className="text-xs text-foreground-secondary mt-2 leading-relaxed">
              Verify cryptographic hash chains on safety screening events to ensure tamper-evident clinical integrity.
            </p>
          </div>
          <Link href="/admin/audit">
            <Button variant="secondary" size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Inspect Audit Ledger
            </Button>
          </Link>
        </Card>
      </div>

      {/* System Status Indicators */}
      <Card padding="md">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-sage animate-pulse" />
            <span className="text-foreground font-semibold">Guardrail Engine Status:</span>
            <span className="text-sage">Operational (mindcare-guardian-7b-q4)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-foreground-secondary">Policy Engine:</span>
            <span className="font-mono text-foreground">v2.4.1-adolescent-baseline</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-foreground-secondary">District Compliance:</span>
            <span className="text-sage font-medium">FERPA / COPPA Compliant</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
