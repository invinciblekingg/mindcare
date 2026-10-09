'use client';

import React, { useState } from 'react';
import { useApp } from '@/components/providers/AppProvider';
import { UserRole } from '@/types';
import { Sparkles, WifiOff, AlertTriangle, UserCheck, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

export function DevRoleToolbar() {
  const { role, setRole, isOffline, setIsOffline, isSimulatedError, setIsSimulatedError } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="fixed bottom-3 right-3 z-50 flex flex-col items-end print:hidden">
      {/* Collapse Toggle */}
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label="Toggle Preview Toolbar"
        className="px-3 py-1.5 bg-white/95 hover:bg-white text-xs text-foreground-secondary border border-border rounded-t-xl backdrop-blur shadow-soft flex items-center gap-1.5 transition-all"
      >
        <Sparkles className="w-3.5 h-3.5 text-sage" />
        <span className="font-semibold text-[11px] text-foreground">Dev Role Switcher</span>
        {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* Expanded Toolbar Panel */}
      {!isCollapsed && (
        <div className="p-3.5 bg-white border border-border rounded-2xl rounded-tr-none shadow-elevated backdrop-blur-md space-y-3 max-w-sm">
          <div className="text-[11px] text-foreground-secondary uppercase tracking-wider font-bold flex items-center justify-between">
            <span>Active Preview Persona</span>
            <span className="font-semibold text-sage bg-sage/10 px-2 py-0.5 rounded-full border border-sage/20">{role}</span>
          </div>

          {/* Role Buttons */}
          <div className="grid grid-cols-3 gap-1.5">
            {(['STUDENT', 'COUNSELLOR', 'ADMIN'] as UserRole[]).map((r) => {
              const active = role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-slate-900 text-white shadow-sm scale-102'
                      : 'bg-white text-foreground-secondary hover:text-foreground hover:bg-slate-50 border border-border'
                  }`}
                >
                  {r === 'STUDENT' ? 'Student' : r === 'COUNSELLOR' ? 'Counsellor' : 'Admin'}
                </button>
              );
            })}
          </div>

          {/* State Simulators */}
          <div className="pt-2 border-t border-border/70 flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setIsOffline(!isOffline)}
              className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 border transition-colors ${
                isOffline
                  ? 'bg-calm-amber/20 text-calm-amber border-calm-amber'
                  : 'bg-surface-elevated text-foreground-secondary border-border hover:text-foreground'
              }`}
            >
              <WifiOff className="w-3 h-3" />
              <span>Offline: {isOffline ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSimulatedError(!isSimulatedError)}
              className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 border transition-colors ${
                isSimulatedError
                  ? 'bg-coral-tint text-coral border-coral'
                  : 'bg-surface-elevated text-foreground-secondary border-border hover:text-foreground'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Error Sim: {isSimulatedError ? 'ON' : 'OFF'}</span>
            </button>

            <Link
              href="/onboarding"
              className="px-2 py-1 bg-surface-elevated text-foreground-secondary hover:text-foreground border border-border rounded text-[11px] transition-colors ml-auto"
            >
              Onboarding
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
