'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/components/providers/AppProvider';
import { mockService, CURRENT_WEEKLY_REPORT } from '@/lib/mock/mockService';
import { MOOD_LEVELS } from '@/lib/mock/constants';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import {
  Heart,
  CalendarCheck,
  LineChart,
  BookOpen,
  FileText,
  MessageCircle,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  Lock,
  Users,
  CheckCircle2,
  ArrowUpRight,
  GraduationCap,
  ShieldCheck,
  Activity,
  Smile,
} from 'lucide-react';
import { ErrorState } from '@/components/ui/EmptyState';

export default function DashboardPage() {
  const { role, setRole, currentUser, isSimulatedError, isOffline } = useApp();

  if (isSimulatedError) {
    return <ErrorState isOffline={isOffline} onRetry={() => {}} />;
  }

  // If viewing as Counsellor from the switcher, render their dedicated elevated dashboard view
  if (role === 'COUNSELLOR') {
    const activeCases = mockService.getCases('ACTIVE');
    const pendingCases = mockService.getCases('PENDING_ACKNOWLEDGEMENT');
    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Top Aurora Hero Header */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-border bg-white aurora-subtle-glow shadow-soft">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="puremed-pill-badge">
                <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                <span>Oakridge High School Counsellor Workspace • Fall Term 2026</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Welcome back, {currentUser.name}
              </h1>
              <p className="text-sm text-foreground-secondary leading-relaxed">
                Review active student interventions, acknowledge urgent AI safety flags, and monitor clinical case notes with explainable transparent guardrails.
              </p>
            </div>

            <Link href="/counsellor/cases" className="shrink-0">
              <Button variant="sage" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Open Case Queue ({activeCases.length + pendingCases.length})
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Counsellor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="p-6 space-y-4 hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-coral font-bold">
                Action Required
              </span>
              <span className="w-2 h-2 rounded-full bg-coral animate-ping" />
            </div>
            <div className="text-3xl font-extrabold text-coral flex items-baseline gap-2">
              <span>{pendingCases.length}</span>
              <span className="text-xs font-medium text-foreground-secondary">
                referrals awaiting acknowledgement
              </span>
            </div>
            <p className="text-xs text-foreground-secondary leading-relaxed">
              Automated safety triggers identified distress patterns requiring counsellor triage.
            </p>
            <div className="pt-2 border-t border-border/70">
              <Link href="/counsellor/cases?status=PENDING_ACKNOWLEDGEMENT" className="text-xs text-coral font-semibold hover:underline flex items-center gap-1.5">
                <span>Review urgent flags</span> <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>

          <Card className="p-6 space-y-4 hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-foreground-secondary font-bold">
                Active Interventions
              </span>
              <Users className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-3xl font-extrabold text-foreground flex items-baseline gap-2">
              <span>{activeCases.length}</span>
              <span className="text-xs font-medium text-foreground-secondary">assigned student cases</span>
            </div>
            <p className="text-xs text-foreground-secondary leading-relaxed">
              Students currently engaged with active 4-week support plans and check-in schedules.
            </p>
            <div className="pt-2 border-t border-border/70">
              <Link href="/counsellor/plans" className="text-xs text-sage font-semibold hover:underline flex items-center gap-1.5">
                <span>View intervention plans</span> <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>

          <Card className="p-6 space-y-4 hover-lift">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-sage font-bold">
                Safety Audits
              </span>
              <ShieldCheck className="w-4 h-4 text-sage" />
            </div>
            <div className="text-3xl font-extrabold text-sage flex items-baseline gap-2">
              <span>20</span>
              <span className="text-xs font-medium text-foreground-secondary">verified policy events</span>
            </div>
            <p className="text-xs text-foreground-secondary leading-relaxed">
              Every AI assistant message verified against FERPA & adolescent clinical safety policies.
            </p>
            <div className="pt-2 border-t border-border/70">
              <Link href="/counsellor/safety-audit" className="text-xs text-sage font-semibold hover:underline flex items-center gap-1.5">
                <span>Inspect AI decision logs</span> <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        </div>

        {/* Quick student preview shortcut */}
        <div className="p-5 bg-white rounded-2xl border border-border shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage/10 border border-sage/20 flex items-center justify-center text-sage shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-0.5">
              <span className="text-foreground font-bold text-sm block">Want to see Maya Lin's student view?</span>
              <span className="text-foreground-secondary">
                Use the switcher anytime to preview voluntary check-ins, journal entries, and companion dialogue.
              </span>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setRole('STUDENT')}>
            Switch to Student View
          </Button>
        </div>
      </div>
    );
  }

  // STUDENT DASHBOARD
  const todayCheckIn = mockService.getTodayCheckIn();
  const recentJournals = mockService.getJournals().slice(0, 2);
  const checkIns = mockService.getCheckIns().slice(-7); // last 7 days

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* ============================================================== */}
      {/* 1. HERO SECTION (PUREMED+ INSPIRED AURORA BANNER & ELEVATED CTA) */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border border-border aurora-hero-bg shadow-soft">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            {/* Pill Tag */}
            <div className="puremed-pill-badge">
              <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />
              <span>Voluntary • Confidential • Clinical Grade</span>
            </div>

            {/* Main PureMed+ Typography Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15]">
              Our Mission Delivering Compassionate, <span className="text-slate-900 underline decoration-sage/40 decoration-wavy">Student-Centered</span> Care
            </h1>

            <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed max-w-xl">
              Hello, Maya. Take a slow breath. We strive to provide exceptional adolescent wellness by focusing on compassion, non-diagnostic reflection, and patient well-being — ensuring you feel supported every step of the way.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/companion">
                <Button variant="sage" size="lg" leftIcon={<MessageCircle className="w-4 h-4 text-white" />}>
                  Open AI Companion
                </Button>
              </Link>

              <Link href="/check-in">
                <Button variant="secondary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  {todayCheckIn ? 'Review Today’s Check-in' : 'Start Today’s Check-in'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Floating Badge / Specialist Card (Matching Reference Image) */}
          <div className="lg:w-80 flex flex-col items-end gap-3 self-center lg:self-auto">
            <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-border shadow-elevated w-full space-y-3 hover-lift">
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-teal-100 flex items-center justify-center text-xs font-bold text-teal-800">
                    SH
                  </div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-800">
                    RC
                  </div>
                  <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-800">
                    2K
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-foreground">
                  More than 2+ Certified Counsellors
                </div>
                <div className="text-[11px] text-foreground-secondary">
                  Ready in Room 204 or via encrypted message
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-foreground-muted">
                <span className="flex items-center gap-1 text-sage font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Confidential
                </span>
                <span>Oakridge High</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. EXPLORE OUR RANGE OF HEALTHCARE & WELLNESS SERVICES */}
      {/* ============================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-coral uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-coral inline-block animate-pulse" />
              Easy Access to Trusted Support
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Explore Our Range Of Wellness Services
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-foreground-secondary max-w-md">
            Personalized tools tailored to adolescent emotional balance, academic anxiety reduction, and non-judgmental daily self-reflection.
          </p>
        </div>

        {/* 3-Card Grid Matching Reference Image Styles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Today's Reflection */}
          <Card className="flex flex-col justify-between p-6 hover-lift border-slate-200/90 shadow-soft">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-sage">
                  <CalendarCheck className="w-5 h-5 text-sage" />
                </div>
                <span className="text-[11px] font-semibold text-foreground-muted uppercase tracking-wider">
                  Always Optional
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground">Daily Self-Reflection</h3>
                <p className="text-xs text-foreground-secondary mt-1 leading-relaxed">
                  Compassionate care and gentle check-ins to help you observe emotional cadence, sleep patterns, and daily energy.
                </p>
              </div>

              {todayCheckIn && !todayCheckIn.skipped ? (
                <div className="p-4 bg-teal-50/70 border border-teal-100 rounded-2xl space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{MOOD_LEVELS[todayCheckIn.mood].emoji}</span>
                    <div>
                      <div className="text-xs font-bold text-foreground">
                        {MOOD_LEVELS[todayCheckIn.mood].label}
                      </div>
                      <div className="text-[11px] text-foreground-muted">Logged today at 7:30 PM</div>
                    </div>
                  </div>
                  {todayCheckIn.emotions.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {todayCheckIn.emotions.slice(0, 3).map((e) => (
                        <Chip key={e} size="sm" variant="sage">
                          {e}
                        </Chip>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-border text-xs text-foreground-secondary">
                  No check-in yet for today. Takes under 30 seconds to reflect.
                </div>
              )}
            </div>

            <div className="pt-4 mt-2">
              <Link href="/check-in" className="block">
                <Button variant={todayCheckIn ? 'secondary' : 'sage'} size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  {todayCheckIn ? 'Review or Update' : 'Start Today’s Check-in'}
                </Button>
              </Link>
            </div>
          </Card>

          {/* Card 2: Counsellor Connection (VIVID PURPLE CARD MATCHING REFERENCE IMAGE!) */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-700 text-white shadow-elevated flex flex-col justify-between hover-lift relative overflow-hidden">
            {/* Background shimmer */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-semibold backdrop-blur-md flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Licensed Faculty</span>
                </div>
                <span className="text-xs text-white/80 font-mono">Room 204</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Meet Your School Counsellor</h3>
                <p className="text-xs text-purple-100 mt-1 leading-relaxed">
                  Connect directly with your dedicated School Counsellor, providing warm guidance, confidential listening, and support for your student journey.
                </p>
              </div>

              <div className="p-3.5 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 space-y-1">
                <div className="text-xs font-bold text-white">School Counsellor</div>
                <div className="text-[11px] text-purple-100">
                  Campus Student Services • Professional Confidential Care
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 relative z-10">
              <Link href="/companion" className="block">
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-full bg-white text-purple-900 font-bold text-xs hover:bg-purple-50 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Connect with School Counsellor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>

          {/* Card 3: Private Journals */}
          <Card className="flex flex-col justify-between p-6 hover-lift border-slate-200/90 shadow-soft">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-[11px] font-semibold text-foreground-muted flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Private by Default
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground">Private Reflections & Journal</h3>
                <p className="text-xs text-foreground-secondary mt-1 leading-relaxed">
                  Personalized one-on-one writing space designed to untangle stressful moments and track self-growth privately.
                </p>
              </div>

              <div className="space-y-2">
                {recentJournals.map((j) => (
                  <div
                    key={j.id}
                    className="p-3 bg-slate-50 rounded-xl border border-border hover:border-slate-300 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-foreground truncate max-w-[70%]">{j.title}</span>
                      <span className="text-[10px] text-foreground-muted">
                        {j.privacy === 'SHARED_WITH_COUNSELLOR' ? 'Shared' : 'Private'}
                      </span>
                    </div>
                    <p className="text-foreground-secondary line-clamp-1 text-[11px]">{j.content}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-2">
              <Link href="/journal?new=true" className="block">
                <Button variant="secondary" size="md" className="w-full">
                  Write a New Reflection
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. KEY HEALTHCARE SERVICES & INSIGHTS GRID */}
      {/* ============================================================== */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Our Key Healthcare & Wellbeing Insights
          </h2>
          <p className="text-xs sm:text-sm text-foreground-secondary mt-0.5">
            Transparent metrics and longitudinal rhythms designed to keep you calm, safe, and heard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 7-Day Mood Rhythm Visualization */}
          <Card className="lg:col-span-2 p-6 flex flex-col justify-between space-y-4 hover-lift">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/70">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <LineChart className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
                      Past 7 Days Mood Rhythm
                    </span>
                    <span className="text-[11px] text-foreground-muted">
                      Voluntary self-reported reflections
                    </span>
                  </div>
                </div>
                <Link
                  href="/analytics"
                  className="text-xs text-sage font-semibold hover:underline flex items-center gap-1 transition-colors"
                >
                  <span>Full Analytics</span> <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 7-day pill bar visualization */}
              <div className="grid grid-cols-7 gap-2.5 my-4">
                {checkIns.map((item, idx) => {
                  const dayLabel = new Date(item.date).toLocaleDateString('en-US', { weekday: 'narrow' });
                  const meta = item.skipped ? null : MOOD_LEVELS[item.mood];

                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 border border-border text-center space-y-1.5 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <span className="text-[11px] font-bold text-foreground-secondary">{dayLabel}</span>
                      <span className="text-2xl" title={meta ? meta.label : 'Skipped'}>
                        {meta ? meta.emoji : '—'}
                      </span>
                      <span className="text-[10px] text-foreground-muted truncate max-w-full font-medium">
                        {meta ? meta.label.split(' ')[0] : 'Skipped'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-foreground-secondary leading-relaxed">
                Steady recovery toward the weekend after Thursday's midterm tension. Remember: wellbeing naturally ebbs and flows, and you are doing your best.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-border flex items-center justify-between text-xs text-foreground-secondary">
              <span>Average mood this week: <strong className="text-foreground font-bold">3.6 / 5.0</strong></span>
              <span className="text-sage font-bold bg-sage/10 px-2 py-0.5 rounded-full border border-sage/20">
                6 check-ins completed
              </span>
            </div>
          </Card>

          {/* Weekly Report Digest Card */}
          <Card className="p-6 flex flex-col justify-between space-y-4 hover-lift">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/70">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
                      Weekly Digest
                    </span>
                    <span className="text-[11px] text-foreground-muted font-mono">
                      {CURRENT_WEEKLY_REPORT.weekRange}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-border space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Summary of the Week
                </h4>
                <p className="text-xs text-foreground-secondary leading-relaxed line-clamp-3">
                  {CURRENT_WEEKLY_REPORT.reflectiveSummary}
                </p>

                <div className="pt-2 border-t border-border/70 flex items-center justify-between text-xs text-foreground-muted font-medium">
                  <span>Consistency: <strong className="text-foreground">{CURRENT_WEEKLY_REPORT.checkInRate}%</strong></span>
                  <span>Sleep: <strong className="text-foreground">{CURRENT_WEEKLY_REPORT.sleepTrend}</strong></span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/report" className="block">
                <Button variant="sage" size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Read Full Weekly Report
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. "IMPROVING HEALTH WITH INTELLIGENT TECHNOLOGY" BANNER */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-rose-50 via-purple-50 to-teal-50 border border-border shadow-soft flex flex-col md:flex-row items-center justify-between gap-6 hover-lift">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-border text-[11px] font-bold text-foreground shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-sage" />
            <span>Next-Generation Mental Care Technology</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            Improving adolescent wellbeing with transparent AI technology
          </h3>
          <p className="text-xs sm:text-sm text-foreground-secondary leading-relaxed">
            Harnessing safe, clinically supervised reflection tools that enhance resilience, identify emotional distress early, and encourage healthy self-advocacy.
          </p>
        </div>

        <Link href="/companion" className="shrink-0">
          <Button variant="sage" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Try AI Companion Now
          </Button>
        </Link>
      </section>

      {/* ============================================================== */}
      {/* 5. DARK CONTRAST FOOTER (MATCHING REFERENCE IMAGE FOOTER) */}
      {/* ============================================================== */}
      <footer className="rounded-3xl bg-puremed-dark text-white p-8 sm:p-10 shadow-elevated space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
              <span>MINDCARE</span><span className="text-teal-400 font-extrabold">+</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Helping adolescents live and reflect more independently with explainable, voluntary clinical safeguards.
            </p>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="font-bold text-white uppercase tracking-wider text-[11px]">
              School Partner Office
            </div>
            <p className="text-slate-400">Oakridge High Student Services</p>
            <p className="text-slate-400">Counseling Center, Room 204</p>
            <p className="text-slate-400">Monday – Friday: 8:00 AM – 3:30 PM</p>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="font-bold text-white uppercase tracking-wider text-[11px]">
              24/7 Immediate Help
            </div>
            <p className="text-slate-400">National Suicide & Crisis Lifeline: <strong className="text-white">988</strong></p>
            <p className="text-slate-400">Crisis Text Line: <strong className="text-white">Text HOME to 741741</strong></p>
            <p className="text-teal-400 font-semibold mt-1">Confidential & Toll-free 24/7</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>© 2026 MindCareAI Platform. Fully compliant with FERPA & COPPA.</div>
          <div className="flex items-center gap-4">
            <Link href="/settings" className="hover:text-slate-300 transition-colors">Privacy & Sovereignty</Link>
            <Link href="/settings" className="hover:text-slate-300 transition-colors">Consent Records</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
