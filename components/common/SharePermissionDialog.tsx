'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export interface SharePermissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmShare: () => void;
  entryTitle: string;
}

export function SharePermissionDialog({
  isOpen,
  onClose,
  onConfirmShare,
  entryTitle,
}: SharePermissionDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Share journal entry with counsellor?"
      description="You have full ownership of what you share and can revoke access anytime in Settings."
    >
      <div className="space-y-4">
        <div className="p-3.5 bg-slate-50 rounded-xl border border-border">
          <div className="text-xs text-foreground-secondary font-medium">Selected entry:</div>
          <div className="text-sm font-bold text-foreground mt-0.5">"{entryTitle}"</div>
        </div>

        {/* Clear What Gets Shared breakdown */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase tracking-wider text-foreground-secondary font-bold">
            What will be shared:
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-border">
              <CheckCircle2 className="w-4 h-4 text-sage shrink-0 mt-0.5" />
              <div className="text-foreground-secondary">
                <strong className="text-foreground">Only this specific entry:</strong> Your other private entries remain strictly hidden and encrypted on your device.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-border">
              <CheckCircle2 className="w-4 h-4 text-sage shrink-0 mt-0.5" />
              <div className="text-foreground-secondary">
                <strong className="text-foreground">Assigned counsellor only:</strong> Only your assigned School Counsellor will have access to read this reflection during support sessions.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/80 border border-border">
              <CheckCircle2 className="w-4 h-4 text-sage shrink-0 mt-0.5" />
              <div className="text-foreground-secondary">
                <strong className="text-foreground">No automatic AI training:</strong> Your shared journal text is not used to train global AI models.
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Keep Private
          </Button>
          <Button
            variant="sage"
            size="sm"
            onClick={() => {
              onConfirmShare();
              onClose();
            }}
          >
            Confirm & Share with Counsellor
          </Button>
        </div>
      </div>
    </Modal>
  );
}
