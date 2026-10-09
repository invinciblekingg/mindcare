'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile } from '@/types';
import { CURRENT_STUDENT, CURRENT_COUNSELLOR, CURRENT_ADMIN, mockService } from '@/lib/mock/mockService';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile;
  isCrisisModalOpen: boolean;
  openCrisisModal: () => void;
  closeCrisisModal: () => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  isSimulatedError: boolean;
  setIsSimulatedError: (error: boolean) => void;
  studentProfile: UserProfile;
  updateStudentConsent: (updates: Partial<UserProfile['consent']>) => void;
  hasOnboarded: boolean;
  completeOnboarding: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isSimulatedError, setIsSimulatedError] = useState(false);
  const [studentProfile, setStudentProfile] = useState<UserProfile>(CURRENT_STUDENT);
  const [hasOnboarded, setHasOnboarded] = useState(true); // default true for immediate browsing; onboarding page can be visited or reset anytime

  const currentUser =
    role === 'STUDENT'
      ? studentProfile
      : role === 'COUNSELLOR'
      ? CURRENT_COUNSELLOR
      : CURRENT_ADMIN;

  const updateStudentConsent = (updates: Partial<UserProfile['consent']>) => {
    const updated = mockService.updateConsent(updates);
    setStudentProfile({ ...updated });
  };

  const completeOnboarding = () => {
    setHasOnboarded(true);
    updateStudentConsent({
      parentalConsentGranted: true,
      teenAssentGranted: true,
      aiDisclosureAcknowledged: true,
    });
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        isCrisisModalOpen,
        openCrisisModal: () => setIsCrisisModalOpen(true),
        closeCrisisModal: () => setIsCrisisModalOpen(false),
        isOffline,
        setIsOffline,
        isSimulatedError,
        setIsSimulatedError,
        studentProfile,
        updateStudentConsent,
        hasOnboarded,
        completeOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
