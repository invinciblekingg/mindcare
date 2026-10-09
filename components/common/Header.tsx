'use client';

import React from 'react';
import { useApp } from '@/components/providers/AppProvider';
import { Button } from '@/components/ui/Button';
import { Shield, Heart, LifeBuoy, User } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const { openCrisisModal, role, currentUser } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b border-border/80 px-4 sm:px-6 py-3 transition-colors duration-200 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-sage/10 border border-sage/20 flex items-center justify-center text-sage group-hover:scale-105 group-hover:bg-sage/15 transition-all duration-200 shadow-sm">
              <Shield className="w-4 h-4 text-sage" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-foreground tracking-tight group-hover:text-sage transition-colors">
                  MINDCARE<span className="text-sage font-extrabold">+</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-sage bg-sage/10 px-1.5 py-0.5 rounded-full border border-sage/20">
                  AI Care
                </span>
              </div>
              <span className="hidden sm:block text-[11px] font-normal text-foreground-muted">
                Adolescent Wellness & Clinical Oversight
              </span>
            </div>
          </Link>
        </div>

        {/* Right Actions: Persona indicator & ALWAYS-VISIBLE CORAL HELP BUTTON */}
        <div className="flex items-center gap-3">
          {/* Active Persona Tag - PureMed+ Pill Style */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-white rounded-full border border-border text-xs text-foreground-secondary shadow-sm hover:border-slate-300 transition-colors">
            <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
            <span className="font-semibold text-foreground">{currentUser.name}</span>
            <span className="text-foreground-muted capitalize">({role.toLowerCase()})</span>
          </div>

          {/* ALWAYS-VISIBLE CORAL BUTTON: Reserved for urgent human help */}
          <Button
            variant="coral"
            size="sm"
            onClick={openCrisisModal}
            leftIcon={<Heart className="w-4 h-4 fill-white" />}
            className="shadow-sm hover:shadow-coral-glow tracking-wide rounded-full font-semibold transition-all duration-200"
            title="Access 24/7 Crisis Lifelines and human counsellor"
          >
            I need help now
          </Button>
        </div>
      </div>
    </header>
  );
}
