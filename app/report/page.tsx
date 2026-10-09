'use client';

import React, { useState } from 'react';
import { CURRENT_WEEKLY_REPORT } from '@/lib/mock/mockService';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  CheckCircle2,
  Lightbulb,
  ArrowLeft,
  Calendar,
  Heart,
  Shield,
  Activity,
  Info,
  Clock,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

export default function WeeklyReportPage() {
  const report = CURRENT_WEEKLY_REPORT;
  const [timeframe, setTimeframe] = useState<'7' | '30' | '90'>('7');

  // Timeframe-adapted metrics
  const timeframeStats = {
    '7': {
      label: '7-Day Week Digest',
      range: 'Oct 3 – Oct 9, 2026',
      avgMood: '3.8',
      rate: '86%',
      logged: '6 of 7 days',
      skipped: 1,
      sleepTrend: '7.5h avg • Recharging',
      dominantEmotion: 'Calm & Grounded',
    },
    '30': {
      label: '30-Day Monthly Review',
      range: 'Sep 10 – Oct 9, 2026',
      avgMood: '3.6',
      rate: '83%',
      logged: '25 of 30 days',
      skipped: 5,
      sleepTrend: '7.2h avg • Steady',
      dominantEmotion: 'Focused Resilience',
    },
    '90': {
      label: '90-Day Full Term Arc',
      range: 'Jul 12 – Oct 9, 2026',
      avgMood: '3.7',
      rate: '84%',
      logged: '76 of 90 days',
      skipped: 14,
      sleepTrend: '7.4h avg • Restorative',
      dominantEmotion: 'Self-Advocacy',
    },
  }[timeframe];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wider text-sage font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Reflection Digest
            </span>
            <span className="text-xs text-foreground-muted font-mono">{timeframeStats.range}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Your Longitudinal Wellbeing Report
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* 7, 30, 90 day range buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-full border border-border text-xs">
            <button
              type="button"
              onClick={() => setTimeframe('7')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                timeframe === '7' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-foreground'
              }`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('30')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                timeframe === '30' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-foreground'
              }`}
            >
              30 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('90')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                timeframe === '90' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-foreground'
              }`}
            >
              90 Days
            </button>
          </div>

          <Link href="/">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />} className="rounded-full">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-border shadow-soft">
          <div className="text-[11px] text-foreground-secondary uppercase tracking-wider font-bold">
            Average Mood
          </div>
          <div className="text-2xl font-extrabold text-sage mt-1 font-mono">{timeframeStats.avgMood} / 5.0</div>
          <div className="text-[11px] text-foreground-muted mt-0.5">Steady rhythm</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-border shadow-soft">
          <div className="text-[11px] text-foreground-secondary uppercase tracking-wider font-bold">
            Check-in Rate
          </div>
          <div className="text-2xl font-extrabold text-foreground mt-1 font-mono">{timeframeStats.rate}</div>
          <div className="text-[11px] text-foreground-muted mt-0.5">{timeframeStats.logged}</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-border shadow-soft">
          <div className="text-[11px] text-foreground-secondary uppercase tracking-wider font-bold">
            Primary Emotion
          </div>
          <div className="text-sm font-bold text-blue-600 mt-1.5 truncate">
            {timeframeStats.dominantEmotion}
          </div>
          <div className="text-[11px] text-foreground-muted mt-0.5">Self-advocacy</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-border shadow-soft">
          <div className="text-[11px] text-foreground-secondary uppercase tracking-wider font-bold">
            Sleep Trend
          </div>
          <div className="text-sm font-bold text-foreground mt-1.5 truncate">
            {timeframeStats.sleepTrend}
          </div>
          <div className="text-[11px] text-foreground-muted mt-0.5">Restorative</div>
        </div>
      </div>

      {/* HONEST "MISSING DATA" EXPLANATION (MANDATORY REQUIREMENT) */}
      <div className="p-5 bg-white rounded-2xl border border-border/80 shadow-soft flex items-start gap-3.5">
        <Info className="w-5 h-5 text-sage shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <span>Honest Data Policy: {timeframeStats.skipped} Missing / Voluntary Rest Days Recorded</span>
            <span className="text-[10px] text-sage bg-sage/15 px-2 py-0.5 rounded-full border border-sage/30">
              Zero Guilt Protocol
            </span>
          </div>
          <p className="text-foreground-secondary leading-relaxed">
            In MindCareAI, missing check-in days are recorded as <strong className="text-foreground">voluntary rest days</strong> with zero streak penalties. We never generate artificial interpolated data points, guilt prompts, or misleading continuity metrics. Fluctuations in reflection frequency reflect authentic teenage routines.
          </p>
        </div>
      </div>

      {/* Reflective Summary Card */}
      <Card padding="lg" className="space-y-3 rounded-2xl shadow-soft">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-sage font-bold">
          <Heart className="w-4 h-4 fill-sage" />
          <span>Warm Reflective Summary ({timeframeStats.label})</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
          {report.reflectiveSummary}
        </p>
      </Card>

      {/* Highlights List */}
      <Card padding="lg" className="space-y-4 rounded-2xl shadow-soft">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sage" />
            <span>Highlights & Small Wins</span>
          </h3>
          <p className="text-xs text-foreground-secondary mt-0.5">
            Moments during this period where you gave yourself grace or stayed grounded.
          </p>
        </div>

        <div className="space-y-2.5">
          {report.highlights.map((h, i) => (
            <div
              key={i}
              className="p-3.5 bg-slate-50 rounded-xl border border-border/70 flex items-start gap-3"
            >
              <div className="w-5 h-5 rounded-full bg-sage/15 text-sage flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                {i + 1}
              </div>
              <p className="text-xs md:text-sm text-foreground leading-relaxed">{h}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Gentle Suggestions (Non-judgmental, gentle) */}
      <Card padding="lg" className="space-y-4 rounded-2xl shadow-soft">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Gentle Suggestions</span>
          </h3>
          <p className="text-xs text-foreground-secondary mt-0.5">
            Ideas you might choose to explore without any pressure or expectation.
          </p>
        </div>

        <div className="space-y-2.5">
          {report.gentleSuggestions.map((s, i) => (
            <div
              key={i}
              className="p-3.5 bg-slate-50 rounded-xl border border-border/70 flex items-start gap-3"
            >
              <span className="text-amber-500 shrink-0 mt-0.5 text-sm font-bold">•</span>
              <p className="text-xs md:text-sm text-foreground-secondary leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Bottom Reassurance Banner */}
      <div className="p-4 bg-white rounded-2xl border border-border shadow-soft flex items-start gap-3 text-xs text-foreground-secondary">
        <Shield className="w-4 h-4 text-sage shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          These weekly and multi-week reports are automatically generated from your voluntary check-ins. They are private to your account and never shared with counsellors or parents without your explicit permission.
        </p>
      </div>
    </div>
  );
}
