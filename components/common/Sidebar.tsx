'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/components/providers/AppProvider';
import {
  Home,
  MessageCircle,
  CalendarCheck,
  BookOpen,
  LineChart,
  FileText,
  Settings,
  Users,
  ShieldCheck,
  FileCheck,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Server,
  Lock,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Student Nav items
  const studentNav = [
    { label: 'Dashboard', href: '/', icon: Home },
    { label: 'Companion', href: '/companion', icon: MessageCircle },
    { label: 'Daily Check-in', href: '/check-in', icon: CalendarCheck },
    { label: 'Journal', href: '/journal', icon: BookOpen },
    { label: 'Analytics', href: '/analytics', icon: LineChart },
    { label: 'Weekly Report', href: '/report', icon: FileText },
    { label: 'Settings & Privacy', href: '/settings', icon: Settings },
  ];

  // Counsellor Nav items
  const counsellorNav = [
    { label: 'Overview', href: '/counsellor', icon: Home },
    { label: 'Case Queue', href: '/counsellor/cases', icon: Users },
    { label: 'Intervention Plans', href: '/counsellor/plans', icon: FileCheck },
    { label: 'AI Safety Audit', href: '/counsellor/safety-audit', icon: ShieldAlert },
    { label: 'Follow-ups', href: '/counsellor/follow-ups', icon: ClipboardList },
  ];

  // Admin Nav items
  const adminNav = [
    { label: 'Overview', href: '/admin', icon: Home },
    { label: 'Counsellors', href: '/admin/counsellors', icon: Users },
    { label: 'Retention Policies', href: '/admin/retention', icon: Lock },
    { label: 'Audit Operations', href: '/admin/audit', icon: Server },
  ];

  const currentNav =
    role === 'STUDENT' ? studentNav : role === 'COUNSELLOR' ? counsellorNav : adminNav;

  return (
    <>
      {/* Desktop & Tablet Collapsible Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-border transition-all duration-300 relative select-none shrink-0 shadow-[1px_0_4px_rgba(0,0,0,0.02)] ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Collapse button toggle */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          className="absolute -right-3 top-6 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center text-foreground-secondary hover:text-foreground hover:scale-110 shadow-sm z-20 transition-all duration-200"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        {/* Role Portal Header indicator */}
        <div className="p-4 border-b border-border/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-sage/10 border border-sage/20 flex items-center justify-center shrink-0 text-sage font-bold text-xs shadow-xs">
              {role[0]}
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="text-xs font-bold text-foreground tracking-tight truncate">
                  {role === 'STUDENT' ? 'Student Space' : role === 'COUNSELLOR' ? 'Counsellor Portal' : 'Admin Control'}
                </div>
                <div className="text-[11px] text-foreground-muted font-medium">
                  {role === 'STUDENT' ? 'Voluntary & Safe' : role === 'COUNSELLOR' ? 'Clinical Oversight' : 'System Compliance'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto" aria-label="Main Navigation">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-sage/10 text-sage font-bold shadow-xs border border-sage/20 translate-x-0.5'
                    : 'text-foreground-secondary hover:text-foreground hover:bg-slate-50 border border-transparent hover:translate-x-0.5'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isActive ? 'text-sage scale-110' : 'text-foreground-secondary'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom AI & Safety Note */}
        {!isCollapsed && (
          <div className="p-3.5 m-3 rounded-2xl border border-border bg-slate-50/70 text-[11px] text-foreground-muted leading-relaxed shadow-xs">
            <div className="flex items-center gap-1.5 text-foreground font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sage" />
              <span>Safety Promise</span>
            </div>
            Non-diagnostic support. All safety checks are explainable & auditable.
          </div>
        )}
      </aside>

      {/* Mobile Bottom Tab Bar (Student Experience) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border px-2 py-1.5 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.03)]"
      >
        {currentNav.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] min-w-[54px] min-h-[44px] transition-all duration-200 ${
                isActive ? 'text-sage font-bold scale-105' : 'text-foreground-secondary hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
