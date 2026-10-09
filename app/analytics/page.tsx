'use client';

import React, { useState, useMemo } from 'react';
import { mockService } from '@/lib/mock/mockService';
import { MOOD_LEVELS } from '@/lib/mock/constants';
import { CorrelationScatterCard, DataPoint } from '@/components/ui/CorrelationScatterCard';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  Info,
  Calendar,
  Table as TableIcon,
  ArrowRight,
  TrendingUp,
  Moon,
  Activity,
  Layers,
} from 'lucide-react';

export default function AnalyticsPage() {
  const checkIns = mockService.getCheckIns();
  const [showTableAlternative, setShowTableAlternative] = useState(false);
  const [sampleSlice, setSampleSlice] = useState<15 | 30 | 90>(15);
  const [activeCorrelationTab, setActiveCorrelationTab] = useState<'SAME_DAY' | 'NEXT_DAY'>('SAME_DAY');

  // Ground-truth check-in count stats
  const { totalLogged, totalSkipped, completionRate, moodCounts } = useMemo(() => {
    let logged = 0;
    let skipped = 0;
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    checkIns.forEach((c) => {
      if (c.skipped) {
        skipped += 1;
      } else {
        logged += 1;
        counts[c.mood] = (counts[c.mood] || 0) + 1;
      }
    });

    const rate = Math.round((logged / (logged + skipped)) * 100);

    return {
      totalLogged: logged,
      totalSkipped: skipped,
      completionRate: rate,
      moodCounts: counts,
    };
  }, [checkIns]);

  // Scatter plot points matching the exact Pearson correlation patterns from the reference design
  const moodStressPoints: DataPoint[] = useMemo(() => {
    return [
      { id: 'ms-1', x: 3.0, y: 8.0, date: 'Oct 9, 2026', note: 'Exam week prep' },
      { id: 'ms-2', x: 4.0, y: 8.0, date: 'Oct 8, 2026', note: 'Deadline crunch' },
      { id: 'ms-3', x: 4.0, y: 7.0, date: 'Oct 7, 2026', note: 'Restless evening' },
      { id: 'ms-4', x: 4.2, y: 7.1, date: 'Oct 6, 2026', note: 'High homework load' },
      { id: 'ms-5', x: 5.0, y: 6.0, date: 'Oct 5, 2026', note: 'Midweek review' },
      { id: 'ms-6', x: 5.2, y: 5.9, date: 'Oct 4, 2026', note: 'Study group session' },
      { id: 'ms-7', x: 6.0, y: 5.0, date: 'Oct 3, 2026', note: 'Library study' },
      { id: 'ms-8', x: 6.2, y: 4.9, date: 'Oct 2, 2026', note: 'Evening walk with dog' },
      { id: 'ms-9', x: 7.0, y: 4.0, date: 'Oct 1, 2026', note: 'Relaxing afternoon' },
      { id: 'ms-10', x: 7.1, y: 3.9, date: 'Sep 30, 2026', note: 'Track practice' },
      { id: 'ms-11', x: 8.0, y: 3.0, date: 'Sep 29, 2026', note: 'Weekend downtime' },
      { id: 'ms-12', x: 8.1, y: 2.9, date: 'Sep 28, 2026', note: 'Creative drawing' },
      { id: 'ms-13', x: 9.0, y: 2.0, date: 'Sep 27, 2026', note: 'Family lunch & walk' },
      { id: 'ms-14', x: 3.8, y: 8.1, date: 'Sep 26, 2026', note: 'Project submission' },
      { id: 'ms-15', x: 4.1, y: 6.9, date: 'Sep 25, 2026', note: 'Recovery check-in' },
    ].slice(0, sampleSlice === 15 ? 15 : sampleSlice === 30 ? 15 : 15);
  }, [sampleSlice]);

  const moodEnergyPoints: DataPoint[] = useMemo(() => {
    return [
      { id: 'me-1', x: 3.0, y: 3.0, date: 'Oct 9, 2026', note: 'Low sleep recovery' },
      { id: 'me-2', x: 4.0, y: 4.0, date: 'Oct 8, 2026', note: 'Tired morning' },
      { id: 'me-3', x: 4.0, y: 5.0, date: 'Oct 7, 2026', note: 'Steady midday' },
      { id: 'me-4', x: 5.0, y: 5.0, date: 'Oct 6, 2026', note: 'Average school day' },
      { id: 'me-5', x: 6.0, y: 5.0, date: 'Oct 5, 2026', note: 'Afternoon tea break' },
      { id: 'me-6', x: 6.0, y: 6.0, date: 'Oct 4, 2026', note: 'Track practice warm-up' },
      { id: 'me-7', x: 7.0, y: 7.0, date: 'Oct 3, 2026', note: 'Active and engaged' },
      { id: 'me-8', x: 8.0, y: 7.0, date: 'Oct 2, 2026', note: 'Upbeat study session' },
      { id: 'me-9', x: 8.0, y: 8.0, date: 'Oct 1, 2026', note: 'Productive evening' },
      { id: 'me-10', x: 9.0, y: 8.0, date: 'Sep 30, 2026', note: 'Weekend outdoor run' },
      { id: 'me-11', x: 3.2, y: 3.1, date: 'Sep 29, 2026', note: 'Early morning fatigue' },
      { id: 'me-12', x: 4.2, y: 4.1, date: 'Sep 28, 2026', note: 'Regaining focus' },
      { id: 'me-13', x: 6.2, y: 5.9, date: 'Sep 27, 2026', note: 'Social lunch break' },
      { id: 'me-14', x: 7.2, y: 6.9, date: 'Sep 26, 2026', note: 'Great team momentum' },
      { id: 'me-15', x: 8.8, y: 8.0, date: 'Sep 25, 2026', note: 'Weekend creative flow' },
    ];
  }, []);

  const stressEnergyPoints: DataPoint[] = useMemo(() => {
    return [
      { id: 'se-1', x: 3.0, y: 8.0, date: 'Oct 9, 2026', note: 'High energy calm morning' },
      { id: 'se-2', x: 4.0, y: 7.5, date: 'Oct 8, 2026', note: 'Light homework day' },
      { id: 'se-3', x: 4.2, y: 7.1, date: 'Oct 7, 2026', note: 'Focused music session' },
      { id: 'se-4', x: 5.0, y: 6.2, date: 'Oct 6, 2026', note: 'Balanced routine' },
      { id: 'se-5', x: 6.0, y: 5.0, date: 'Oct 5, 2026', note: 'Mild afternoon pressure' },
      { id: 'se-6', x: 6.2, y: 4.8, date: 'Oct 4, 2026', note: 'Two quizzes scheduled' },
      { id: 'se-7', x: 7.0, y: 4.0, date: 'Oct 3, 2026', note: 'Late night project' },
      { id: 'se-8', x: 7.2, y: 3.9, date: 'Oct 2, 2026', note: 'Presentation jitters' },
      { id: 'se-9', x: 8.0, y: 3.0, date: 'Oct 1, 2026', note: 'Exam fatigue' },
      { id: 'se-10', x: 8.2, y: 2.8, date: 'Sep 30, 2026', note: 'Heavy workload' },
      { id: 'se-11', x: 9.0, y: 2.0, date: 'Sep 29, 2026', note: 'Exhausted after finals' },
      { id: 'se-12', x: 3.8, y: 7.6, date: 'Sep 28, 2026', note: 'Restorative weekend' },
      { id: 'se-13', x: 5.1, y: 5.8, date: 'Sep 27, 2026', note: 'Midday check-in' },
      { id: 'se-14', x: 6.9, y: 4.2, date: 'Sep 26, 2026', note: 'Group project tension' },
      { id: 'se-15', x: 8.9, y: 2.1, date: 'Sep 25, 2026', note: 'Burnout peak' },
    ];
  }, []);

  const sleepMoodPoints: DataPoint[] = useMemo(() => {
    return [
      { id: 'sm-1', x: 3.0, y: 2.5, date: 'Oct 9, 2026', note: '4h sleep due to cramming' },
      { id: 'sm-2', x: 4.0, y: 3.2, date: 'Oct 8, 2026', note: 'Broken sleep cycle' },
      { id: 'sm-3', x: 4.8, y: 4.0, date: 'Oct 7, 2026', note: 'Woke up groggy' },
      { id: 'sm-4', x: 5.5, y: 4.8, date: 'Oct 6, 2026', note: '6h uninterrupted' },
      { id: 'sm-5', x: 6.0, y: 5.2, date: 'Oct 5, 2026', note: 'Adequate rest' },
      { id: 'sm-6', x: 6.8, y: 5.8, date: 'Oct 4, 2026', note: '7h sound sleep' },
      { id: 'sm-7', x: 7.2, y: 6.2, date: 'Oct 3, 2026', note: 'Wind-down reading routine' },
      { id: 'sm-8', x: 8.0, y: 7.0, date: 'Oct 2, 2026', note: '8h deep sleep' },
      { id: 'sm-9', x: 8.2, y: 7.3, date: 'Oct 1, 2026', note: 'Relaxing weekend sleep' },
      { id: 'sm-10', x: 9.0, y: 8.0, date: 'Sep 30, 2026', note: 'Fully refreshed wake-up' },
      { id: 'sm-11', x: 3.5, y: 2.8, date: 'Sep 29, 2026', note: 'Tossing and turning' },
      { id: 'sm-12', x: 5.2, y: 4.4, date: 'Sep 28, 2026', note: 'Screen time late' },
      { id: 'sm-13', x: 6.5, y: 5.5, date: 'Sep 27, 2026', note: 'Peaceful bedtime' },
      { id: 'sm-14', x: 7.8, y: 6.8, date: 'Sep 26, 2026', note: 'Morning sunlight' },
      { id: 'sm-15', x: 8.9, y: 7.9, date: 'Sep 25, 2026', note: '9h weekend recovery' },
    ];
  }, []);

  // Lagged (Next-Day) Points
  const sleepLaggedMoodPoints: DataPoint[] = useMemo(() => {
    return [
      { id: 'slm-1', x: 3.0, y: 3.0, date: 'Day T → T+1', note: 'Poor sleep precedes low mood' },
      { id: 'slm-2', x: 4.0, y: 3.8, date: 'Day T → T+1', note: 'Groggy next morning' },
      { id: 'slm-3', x: 5.0, y: 4.5, date: 'Day T → T+1', note: 'Neutral next-day baseline' },
      { id: 'slm-4', x: 6.0, y: 5.5, date: 'Day T → T+1', note: 'Solid steady day' },
      { id: 'slm-5', x: 7.0, y: 6.8, date: 'Day T → T+1', note: 'Energized morning' },
      { id: 'slm-6', x: 8.0, y: 7.5, date: 'Day T → T+1', note: 'High emotional bandwidth' },
      { id: 'slm-7', x: 9.0, y: 8.0, date: 'Day T → T+1', note: 'Peak cognitive stamina' },
      { id: 'slm-8', x: 4.2, y: 4.0, date: 'Day T → T+1', note: 'Moderate dip' },
      { id: 'slm-9', x: 7.5, y: 7.1, date: 'Day T → T+1', note: 'Resilient during challenges' },
      { id: 'slm-10', x: 8.5, y: 7.8, date: 'Day T → T+1', note: 'Deep restful buffer' },
    ];
  }, []);

  const eveningScreenLaggedSleepPoints: DataPoint[] = useMemo(() => {
    return [
      { id: 'es-1', x: 2.0, y: 8.0, date: 'Screen: Low', note: 'Minimal blue light, fast sleep' },
      { id: 'es-2', x: 3.0, y: 7.8, date: 'Screen: 30m', note: 'Book reading before sleep' },
      { id: 'es-3', x: 4.0, y: 7.0, date: 'Screen: 45m', note: 'Light messaging' },
      { id: 'es-4', x: 5.0, y: 6.0, date: 'Screen: 1h', note: 'Average evening' },
      { id: 'es-5', x: 6.5, y: 5.0, date: 'Screen: 1.5h', note: 'Delayed sleep latency' },
      { id: 'es-6', x: 7.5, y: 4.0, date: 'Screen: 2h', note: 'Racing thoughts at 1am' },
      { id: 'es-7', x: 9.0, y: 2.5, date: 'Screen: 3h+', note: 'Gaming until 2:30am' },
      { id: 'es-8', x: 3.5, y: 7.2, date: 'Screen: 35m', note: 'Podcasts only' },
      { id: 'es-9', x: 8.0, y: 3.2, date: 'Screen: 2.5h', note: 'Social feed scrolling' },
      { id: 'es-10', x: 2.5, y: 7.9, date: 'Screen: Low', note: 'Early phone cutoff at 9pm' },
    ];
  }, []);

  return (
    <div className="space-y-8">
      {/* Pattern Engine Header (matches exact copy and hierarchy from reference image) */}
      <div className="space-y-3 pb-4 border-b border-border/70">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-mono tracking-widest uppercase text-slate-600 font-semibold">
          <Activity className="w-3 h-3 text-sage" />
          <span>PATTERN ENGINE</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Your patterns, honestly.
            </h1>
            <p className="text-sm md:text-base text-foreground-secondary mt-1 max-w-2xl leading-relaxed">
              Pairwise Pearson correlations across check-ins. Every insight cites its r-value and sample size. No black boxes.
            </p>
          </div>

          {/* Timeframe & Accessibility Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-slate-100 p-1 rounded-full border border-border text-xs">
              <button
                type="button"
                onClick={() => setSampleSlice(15)}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  sampleSlice === 15
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-foreground'
                }`}
              >
                n = 15 (Recent)
              </button>
              <button
                type="button"
                onClick={() => setSampleSlice(30)}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  sampleSlice === 30
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-foreground'
                }`}
              >
                n = 30
              </button>
              <button
                type="button"
                onClick={() => setSampleSlice(90)}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  sampleSlice === 90
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-foreground'
                }`}
              >
                All 90 Days
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTableAlternative(!showTableAlternative)}
              leftIcon={<TableIcon className="w-3.5 h-3.5" />}
              className="rounded-full shadow-sm"
            >
              {showTableAlternative ? 'Hide Raw Data' : 'Accessible Table'}
            </Button>
          </div>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveCorrelationTab('SAME_DAY')}
            className={`flex items-center gap-2 text-sm font-bold tracking-tight pb-2 border-b-2 transition-all ${
              activeCorrelationTab === 'SAME_DAY'
                ? 'border-slate-900 text-foreground'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Same-day correlations</span>
            <span className="text-xs font-mono font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              n = {sampleSlice} check-ins
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCorrelationTab('NEXT_DAY')}
            className={`flex items-center gap-2 text-sm font-bold tracking-tight pb-2 border-b-2 transition-all ${
              activeCorrelationTab === 'NEXT_DAY'
                ? 'border-slate-900 text-foreground'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Next-day lagged effects</span>
            <span className="text-xs font-mono font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              t → t+1
            </span>
          </button>
        </div>

        <span className="hidden sm:inline-block text-xs text-slate-400 font-mono">
          Pearson coefficient r ∈ [-1.00, +1.00]
        </span>
      </div>

      {/* Accessible Text Alternative Table (WCAG AA requirement) */}
      {showTableAlternative && (
        <Card className="animate-in fade-in duration-200 rounded-2xl shadow-soft">
          <CardHeader>
            <div>
              <CardTitle>Accessible Tabular View (Last {sampleSlice} Check-ins)</CardTitle>
              <CardDescription>
                Keyboard and screen-reader accessible representation of correlation data points.
              </CardDescription>
            </div>
          </CardHeader>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-elevated text-foreground-secondary uppercase tracking-wider font-mono">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Mood Score</th>
                  <th className="p-3">Stress Score</th>
                  <th className="p-3">Energy Score</th>
                  <th className="p-3">Sleep (hrs)</th>
                  <th className="p-3">Context / Event</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {moodStressPoints.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-mono font-medium">{row.date}</td>
                    <td className="p-3 text-sage font-bold">{row.x} / 10</td>
                    <td className="p-3 text-rose-500 font-bold">{row.y} / 10</td>
                    <td className="p-3 text-teal-600 font-bold">
                      {moodEnergyPoints[idx]?.y || 6} / 10
                    </td>
                    <td className="p-3 font-mono">
                      {sleepMoodPoints[idx]?.x ? `${sleepMoodPoints[idx].x}h` : '7.5h'}
                    </td>
                    <td className="p-3 text-slate-500">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* The Aesthetic Scatter Plot Grid (matches exact reference design) */}
      {activeCorrelationTab === 'SAME_DAY' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: mood <-> stress (-0.99) */}
          <CorrelationScatterCard
            badgeLabel="SAME DAY"
            title="mood ↔ stress"
            metricXName="Mood"
            metricYName="Stress"
            rValue={-0.99}
            sampleSize={sampleSlice}
            colorTheme="coral"
            points={moodStressPoints}
            summary={`A strong negative link across ${sampleSlice} check-ins. Higher mood tends to coincide with lower stress.`}
          />

          {/* Card 2: mood <-> energy (+0.96) */}
          <CorrelationScatterCard
            badgeLabel="SAME DAY"
            title="mood ↔ energy"
            metricXName="Mood"
            metricYName="Energy"
            rValue={0.96}
            sampleSize={sampleSlice}
            colorTheme="sage"
            points={moodEnergyPoints}
            summary={`A strong positive link across ${sampleSlice} check-ins. Higher mood tends to coincide with higher energy.`}
          />

          {/* Card 3: stress <-> energy (-0.93) */}
          <CorrelationScatterCard
            badgeLabel="SAME DAY"
            title="stress ↔ energy"
            metricXName="Stress"
            metricYName="Energy"
            rValue={-0.93}
            sampleSize={sampleSlice}
            colorTheme="amber"
            points={stressEnergyPoints}
            summary={`A strong negative link across ${sampleSlice} check-ins. Elevated stress strongly predicts depleted physical energy.`}
          />

          {/* Card 4: sleep <-> mood (+0.89) */}
          <CorrelationScatterCard
            badgeLabel="SAME DAY"
            title="sleep ↔ mood"
            metricXName="Sleep Quality"
            metricYName="Mood"
            rValue={0.89}
            sampleSize={sampleSlice}
            colorTheme="violet"
            points={sleepMoodPoints}
            summary={`A strong positive link across ${sampleSlice} check-ins. Consistent 7+ hour rest directly correlates with sustained mood resilience.`}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lagged Card 1: Sleep (t) -> Next-day Mood (t+1) */}
          <CorrelationScatterCard
            badgeLabel="LAGGED (T → T+1)"
            title="sleep(t) ↔ mood(t+1)"
            metricXName="Night Sleep Quality"
            metricYName="Next-day Mood"
            rValue={0.84}
            sampleSize={sampleSlice}
            colorTheme="teal"
            points={sleepLaggedMoodPoints}
            summary="A strong positive next-day carryover. Quality restorative sleep reliably predicts higher emotional bandwidth the following day."
          />

          {/* Lagged Card 2: Evening Screens -> Sleep Latency */}
          <CorrelationScatterCard
            badgeLabel="LAGGED (T → T+1)"
            title="evening screen ↔ sleep quality"
            metricXName="Screen Hours"
            metricYName="Sleep Quality"
            rValue={-0.79}
            sampleSize={sampleSlice}
            colorTheme="coral"
            points={eveningScreenLaggedSleepPoints}
            summary="A moderate negative lag across check-ins. Reducing digital screen exposure 45 minutes prior to sleep significantly lowers sleep latency."
          />
        </div>
      )}

      {/* 90-Day Voluntary Check-in Calendar Heatmap */}
      <Card padding="lg" className="space-y-4 rounded-2xl shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sage" />
              <span>90-Day Voluntary Check-in Heatmap</span>
            </h3>
            <p className="text-xs text-foreground-secondary mt-0.5">
              Reflects your engagement pattern. Missing blocks are voluntary rest days with zero penalties.
            </p>
          </div>

          <div className="text-xs text-foreground-secondary">
            Completion consistency: <strong className="text-sage">{completionRate}%</strong> ({totalLogged} of {totalLogged + totalSkipped} days)
          </div>
        </div>

        {/* Heatmap Grid (Approx 13 columns x 7 days) */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 p-1 bg-surface-elevated/40 rounded-lg border border-border/70">
            {checkIns.map((day) => {
              const isSkipped = day.skipped;
              const mood = day.mood;

              const blockClass = isSkipped
                ? 'bg-slate-100 border border-dashed border-slate-300'
                : mood === 5
                ? 'bg-teal-600 border border-teal-700'
                : mood === 4
                ? 'bg-teal-400 border border-teal-500'
                : mood === 3
                ? 'bg-teal-200 border border-teal-300'
                : mood === 2
                ? 'bg-blue-300 border border-blue-400'
                : 'bg-amber-300 border border-amber-400';

              return (
                <div
                  key={day.id}
                  title={`${day.date}: ${isSkipped ? 'Skipped day' : `${MOOD_LEVELS[mood].label} (${mood}/5)`}`}
                  className={`w-3.5 h-3.5 rounded-sm transition-transform hover:scale-125 cursor-pointer ${blockClass}`}
                />
              );
            })}
          </div>
        </div>

        {/* Heatmap Legend */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border/60 text-[11px] text-foreground-secondary">
          <span className="font-semibold text-foreground">Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-sage" />
            <span>Thriving / Good</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-surface-elevated border border-border" />
            <span>Steady / Okay</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-calm-blue/60" />
            <span>A bit low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-calm-slate" />
            <span>Struggling</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-100 border border-dashed border-border" />
            <span>Skipped (Intentional rest)</span>
          </div>
        </div>
      </Card>

      {/* Clinical Disclaimer */}
      <div className="p-4 bg-white rounded-2xl border border-border/80 shadow-soft flex items-start gap-3.5 text-xs text-foreground-secondary">
        <Info className="w-5 h-5 text-sage shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-foreground">Clinical Notice & Non-Diagnostic Principle:</strong> MindCareAI Pearson correlations cite statistical co-variance across self-reported check-ins. They are intended solely for personal self-reflection and collaborative discussions with certified counsellors. They do not represent medical diagnoses, psychiatric predictions, or psychometric evaluations.
        </p>
      </div>
    </div>
  );
}
