'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Users, ArrowLeft, CheckCircle2, Shield, UserCheck, AlertCircle } from 'lucide-react';

interface CounsellorStaff {
  id: string;
  name: string;
  email: string;
  licenseNumber: string;
  licenseType: string;
  schoolCampus: string;
  assignedCasesCount: number;
  isVerified: boolean;
  status: 'ACTIVE' | 'PENDING_VERIFICATION' | 'REVOKED';
}

const INITIAL_COUNSELLORS: CounsellorStaff[] = [
  {
    id: 'cns_sarah_henderson',
    name: 'Ms. Sarah Henderson, LPC',
    email: 's.henderson@oakridge-high.edu',
    licenseNumber: 'LPC-884920',
    licenseType: 'Licensed Professional Counselor',
    schoolCampus: 'Main Campus (Rooms 204 & 206)',
    assignedCasesCount: 5,
    isVerified: true,
    status: 'ACTIVE',
  },
  {
    id: 'cns_michael_alvarez',
    name: 'Dr. Michael Alvarez, PhD',
    email: 'm.alvarez@oakridge-high.edu',
    licenseNumber: 'PSY-559102',
    licenseType: 'Clinical Psychologist',
    schoolCampus: 'West Campus (Building C)',
    assignedCasesCount: 6,
    isVerified: true,
    status: 'ACTIVE',
  },
  {
    id: 'cns_claire_dupont',
    name: 'Ms. Claire Dupont, LCSW',
    email: 'c.dupont@oakridge-high.edu',
    licenseNumber: 'LCSW-330194',
    licenseType: 'Licensed Clinical Social Worker',
    schoolCampus: 'Oakridge Freshman Center',
    assignedCasesCount: 2,
    isVerified: false,
    status: 'PENDING_VERIFICATION',
  },
];

export default function CounsellorVerificationPage() {
  const [counsellors, setCounsellors] = useState<CounsellorStaff[]>(INITIAL_COUNSELLORS);

  const toggleVerification = (id: string) => {
    setCounsellors((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              isVerified: !c.isVerified,
              status: !c.isVerified ? 'ACTIVE' : 'PENDING_VERIFICATION',
            }
          : c
      )
    );
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
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Counsellor Licensure Verification</h1>
            <p className="text-xs md:text-sm text-foreground-secondary mt-0.5">
              Verify state clinical credentials prior to granting case assignment access.
            </p>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="space-y-3">
        {counsellors.map((c) => (
          <Card key={c.id} padding="md" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">{c.name}</span>
                <Chip size="sm" variant={c.isVerified ? 'sage' : 'amber'}>
                  {c.status.replace('_', ' ')}
                </Chip>
              </div>
              <p className="text-xs text-foreground-secondary">
                {c.licenseType} • <span className="font-mono text-foreground">{c.licenseNumber}</span>
              </p>
              <div className="text-[11px] text-foreground-muted">
                {c.schoolCampus} • {c.assignedCasesCount} assigned student cases
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Button
                variant={c.isVerified ? 'outline' : 'sage'}
                size="sm"
                onClick={() => toggleVerification(c.id)}
              >
                {c.isVerified ? 'Revoke Verification' : 'Verify Credentials'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
