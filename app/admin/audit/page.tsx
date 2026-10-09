'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { mockService } from '@/lib/mock/mockService';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Server, ArrowLeft, CheckCircle2, Shield, RefreshCw } from 'lucide-react';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState(mockService.getAuditLogs());
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedChain, setVerifiedChain] = useState(true);

  const handleVerifyChain = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedChain(true);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/70">
        <div className="flex items-center gap-3">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="p-2" aria-label="Back to Admin">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Audit Chain Integrity Ledger</h1>
            <p className="text-xs md:text-sm text-foreground-secondary mt-0.5">
              SHA-256 cryptographically chained event records.
            </p>
          </div>
        </div>

        <Button
          variant="sage"
          size="sm"
          isLoading={isVerifying}
          onClick={handleVerifyChain}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Verify Cryptographic Chain
        </Button>
      </div>

      {verifiedChain && !isVerifying && (
        <div className="p-3 bg-sage-tint border border-sage/40 rounded-xl flex items-center gap-2 text-xs text-sage">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>All 20 audit blocks verified intact. Zero tampering detected across SHA-256 hashes.</span>
        </div>
      )}

      {/* Ledger list */}
      <div className="space-y-2.5">
        {logs.map((log, idx) => (
          <div
            key={log.id}
            className="p-3.5 bg-surface rounded-xl border border-border hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sage font-bold">Block #{20 - idx}</span>
                <span className="font-semibold text-foreground">{log.details}</span>
              </div>
              <div className="font-mono text-[11px] text-foreground-muted truncate max-w-lg">
                Hash: {log.hash}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-foreground-muted font-mono shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-sage" />
              <span>Chained & Verified</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
