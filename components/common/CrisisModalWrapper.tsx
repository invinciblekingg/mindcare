'use client';

import React from 'react';
import { useApp } from '@/components/providers/AppProvider';
import { CrisisModal } from './CrisisModal';
import { useRouter } from 'next/navigation';

export function CrisisModalWrapper() {
  const { isCrisisModalOpen, closeCrisisModal, setRole } = useApp();
  const router = useRouter();

  return (
    <CrisisModal
      isOpen={isCrisisModalOpen}
      onClose={closeCrisisModal}
      onTalkToCounsellor={() => {
        closeCrisisModal();
        router.push('/companion');
      }}
    />
  );
}
