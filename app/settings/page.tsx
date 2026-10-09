'use client';

import React, { useState } from 'react';
import { useApp } from '@/components/providers/AppProvider';
import { mockService } from '@/lib/mock/mockService';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  ShieldCheck,
  Lock,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  FileText,
  UserX,
  RefreshCw,
} from 'lucide-react';

export default function SettingsPage() {
  const { studentProfile, updateStudentConsent } = useApp();

  const [journalSharing, setJournalSharing] = useState(
    studentProfile.consent.journalSharingEnabled
  );
  const [analyticsSharing, setAnalyticsSharing] = useState(
    studentProfile.consent.analyticsSharingEnabled
  );

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [exportNotice, setExportNotice] = useState(false);

  const handleToggleJournalSharing = () => {
    const val = !journalSharing;
    setJournalSharing(val);
    updateStudentConsent({ journalSharingEnabled: val });
  };

  const handleToggleAnalyticsSharing = () => {
    const val = !analyticsSharing;
    setAnalyticsSharing(val);
    updateStudentConsent({ analyticsSharingEnabled: val });
  };

  const handleExportData = () => {
    const dataToExport = {
      profile: studentProfile,
      checkIns: mockService.getCheckIns(),
      journals: mockService.getJournals(),
      conversations: mockService.getConversations(),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindcare_export_maya_lin_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  const handleWithdrawConsentConfirm = () => {
    updateStudentConsent({
      teenAssentGranted: false,
      journalSharingEnabled: false,
      analyticsSharingEnabled: false,
    });
    setIsWithdrawModalOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="pb-3 border-b border-border/70">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Settings & Privacy Controls</h1>
        <p className="text-xs md:text-sm text-foreground-secondary mt-0.5">
          Your data sovereignty, consent records, and export options.
        </p>
      </div>

      {/* Sharing Controls Card */}
      <Card padding="lg" className="space-y-5">
        <CardHeader>
          <div>
            <CardTitle>Counsellor Sharing Preferences</CardTitle>
            <CardDescription>
              Control what information your assigned School Counsellor can access.
            </CardDescription>
          </div>
        </CardHeader>

        <div className="space-y-4 text-sm">
          {/* Toggle 1: Journal sharing */}
          <div className="flex items-start justify-between gap-4 p-3.5 bg-surface-elevated rounded-xl border border-border">
            <div className="space-y-1">
              <div className="font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-sage" />
                <span>Consented Journal Sharing</span>
              </div>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                Allow your School Counsellor to read only entries where you individually selected "Share with counsellor". (Unshared entries remain strictly private).
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={journalSharing}
              onClick={handleToggleJournalSharing}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                journalSharing ? 'bg-sage' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                  journalSharing ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Toggle 2: Analytics sharing */}
          <div className="flex items-start justify-between gap-4 p-3.5 bg-surface-elevated rounded-xl border border-border">
            <div className="space-y-1">
              <div className="font-semibold text-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sage" />
                <span>Wellbeing Rhythm Trends</span>
              </div>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                Include your self-reported 5-point mood patterns and sleep hours in counsellor summary dashboards to coordinate care.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={analyticsSharing}
              onClick={handleToggleAnalyticsSharing}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                analyticsSharing ? 'bg-sage' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-xs ${
                  analyticsSharing ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Consent History & Withdrawal */}
      <Card padding="lg" className="space-y-5">
        <CardHeader>
          <div>
            <CardTitle>Consent & Assent History</CardTitle>
            <CardDescription>
              Recorded verifiable agreements under adolescent healthcare policies.
            </CardDescription>
          </div>
        </CardHeader>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-surface-elevated rounded-lg border border-border flex items-center justify-between">
            <div>
              <div className="font-semibold text-foreground">Parental Authorization</div>
              <div className="text-foreground-secondary mt-0.5">
                Granted by Elena Lin ({studentProfile.consent.guardianEmail}) on Sep 1, 2026
              </div>
            </div>
            <span className="text-sage bg-sage/15 px-2.5 py-1 rounded-full border border-sage/30 font-medium">
              Active / Verified
            </span>
          </div>

          <div className="p-3 bg-surface-elevated rounded-lg border border-border flex items-center justify-between">
            <div>
              <div className="font-semibold text-foreground">Teen Assent & AI Disclosure</div>
              <div className="text-foreground-secondary mt-0.5">
                Voluntary assent acknowledged by Maya Lin on Sep 1, 2026
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full border font-medium ${
                studentProfile.consent.teenAssentGranted
                  ? 'text-sage bg-sage/15 border-sage/30'
                  : 'text-calm-amber bg-calm-amber/15 border-calm-amber/30'
              }`}
            >
              {studentProfile.consent.teenAssentGranted ? 'Active / Granted' : 'Withdrawn'}
            </span>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsWithdrawModalOpen(true)}
              leftIcon={<UserX className="w-4 h-4 text-calm-amber" />}
            >
              Withdraw My Consent
            </Button>
          </div>
        </div>
      </Card>

      {/* Data Retention Information */}
      <Card padding="lg" className="space-y-4">
        <CardHeader>
          <div>
            <CardTitle>Data Retention & School Policy</CardTitle>
            <CardDescription>
              How your information is kept secure and when it is automatically cleared.
            </CardDescription>
          </div>
        </CardHeader>

        <div className="space-y-2 text-xs text-foreground-secondary leading-relaxed">
          <p>
            • <strong className="text-foreground">Rolling 90-Day Purge:</strong> Daily conversation messages older than 90 days are automatically scrubbed unless attached to a documented safety escalation.
          </p>
          <p>
            • <strong className="text-foreground">End of Academic Year:</strong> All student accounts undergo annual archival review. Graduating students have their personal journals exported to them and purged from school infrastructure.
          </p>
          <p>
            • <strong className="text-foreground">Zero AI Training:</strong> Your private entries and conversations are never used to train global commercial language models.
          </p>
        </div>
      </Card>

      {/* Data Export & Danger Zone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Export Data */}
        <Card padding="md" className="space-y-3">
          <div className="font-semibold text-sm text-foreground flex items-center gap-2">
            <Download className="w-4 h-4 text-sage" />
            <span>Export All My Data</span>
          </div>
          <p className="text-xs text-foreground-secondary leading-relaxed">
            Download a portable JSON archive of your check-in history, journal reflections, and chat messages.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportData}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            {exportNotice ? 'Export Downloaded!' : 'Download Archive (.json)'}
          </Button>
        </Card>

        {/* Account Deletion */}
        <Card padding="md" className="space-y-3 border-coral/30">
          <div className="font-semibold text-sm text-coral flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-coral" />
            <span>Delete Account & Data</span>
          </div>
          <p className="text-xs text-foreground-secondary leading-relaxed">
            Permanently erase all check-ins, journals, and companion conversation logs from this device.
          </p>
          <Button
            variant="coral-outline"
            size="sm"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Request Account Erasure
          </Button>
        </Card>
      </div>

      {/* Consent Withdrawal Confirmation Modal */}
      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        maxWidth="md"
        title="Withdraw Consent & Assent?"
        description="Withdrawing assent is always your right as an adolescent user."
      >
        <div className="space-y-4 text-xs text-foreground-secondary">
          <p>
            If you withdraw assent, your AI Companion chat will be temporarily paused, and no new data will be collected or shared with your counsellor until you re-activate consent.
          </p>
          <p className="text-foreground font-medium">
            Your existing journal entries will remain safe on your device.
          </p>
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" size="sm" onClick={() => setIsWithdrawModalOpen(false)}>
              Keep My Active Consent
            </Button>
            <Button variant="secondary" size="sm" onClick={handleWithdrawConsentConfirm}>
              Confirm Withdrawal
            </Button>
          </div>
        </div>
      </Modal>

      {/* Account Deletion Flow Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        maxWidth="md"
        title="Permanently Delete Account"
        description="This action is irreversible and erases all your records."
      >
        <div className="space-y-4 text-xs text-foreground-secondary">
          <div className="p-3 bg-coral-tint border border-coral/30 rounded-lg text-coral">
            <AlertTriangle className="w-4 h-4 inline-block mr-1.5" />
            <span>Warning: All 90 days of check-ins and journal reflections will be erased.</span>
          </div>

          <p>
            To confirm permanent deletion, please type <strong className="text-foreground">DELETE</strong> below:
          </p>

          <input
            type="text"
            value={deleteConfirmationText}
            onChange={(e) => setDeleteConfirmationText(e.target.value)}
            placeholder="Type DELETE"
            className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-lg text-foreground focus:outline-none focus:border-coral text-xs"
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" size="sm" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="coral"
              size="sm"
              disabled={deleteConfirmationText !== 'DELETE'}
              onClick={() => {
                alert('Account deletion request queued under school privacy policy.');
                setIsDeleteModalOpen(false);
              }}
            >
              Permanently Erase Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
