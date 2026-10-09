'use client';

import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { MoodCheckIn } from '@/types';
import { MOOD_LEVELS } from '@/lib/mock/constants';
import { Info, AlertCircle } from 'lucide-react';

export interface TrendChartProps {
  checkIns: MoodCheckIn[];
  className?: string;
}

export function TrendChart({ checkIns, className = '' }: TrendChartProps) {
  const [rangeDays, setRangeDays] = useState<7 | 30 | 90>(30);
  const [showSecondaryMetrics, setShowSecondaryMetrics] = useState(true);

  // Filter & format data for Recharts based on selected timeframe
  const { chartData, missingCount, averageMood, priorAverageMood } = useMemo(() => {
    const sorted = [...checkIns].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const currentSlice = sorted.slice(-rangeDays);
    const priorSlice = sorted.slice(-rangeDays * 2, -rangeDays);

    let missing = 0;
    const formatted = currentSlice.map((item) => {
      if (item.skipped) {
        missing += 1;
        return {
          date: item.date.slice(5), // MM-DD
          fullDate: item.date,
          mood: null,
          stress: null,
          energy: null,
          sleep: null,
          isSkipped: true,
        };
      }
      return {
        date: item.date.slice(5),
        fullDate: item.date,
        mood: item.mood,
        stress: item.stressLevel,
        energy: item.energyLevel,
        sleep: item.sleepQuality,
        sleepHours: item.sleepHours,
        isSkipped: false,
      };
    });

    const validCurrentMoods = currentSlice.filter((c) => !c.skipped).map((c) => c.mood);
    const avg =
      validCurrentMoods.length > 0
        ? validCurrentMoods.reduce((a, b) => a + b, 0) / validCurrentMoods.length
        : 0;

    const validPriorMoods = priorSlice.filter((c) => !c.skipped).map((c) => c.mood);
    const priorAvg =
      validPriorMoods.length > 0
        ? validPriorMoods.reduce((a, b) => a + b, 0) / validPriorMoods.length
        : 0;

    return {
      chartData: formatted,
      missingCount: missing,
      averageMood: avg,
      priorAverageMood: priorAvg,
    };
  }, [checkIns, rangeDays]);

  const moodDiff = priorAverageMood > 0 ? averageMood - priorAverageMood : 0;

  return (
    <div className={`p-5 md:p-6 bg-white rounded-2xl border border-border shadow-soft ${className}`}>
      {/* Top Header & Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              Self-Reported Wellbeing Trends
            </h3>
            <span className="text-xs bg-sage/15 text-sage px-2 py-0.5 rounded-full border border-sage/30">
              {rangeDays}-Day View
            </span>
          </div>
          <p className="text-xs text-foreground-secondary mt-0.5">
            Voluntary indicators comparing your daily reflection check-ins.
          </p>
        </div>

        {/* Range Pill Selector */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-full border border-border self-start sm:self-auto">
          {([7, 30, 90] as const).map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => setRangeDays(days)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                rangeDays === days
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-foreground-secondary hover:text-foreground hover:bg-white'
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 bg-surface-elevated rounded-lg border border-border">
          <div className="text-[11px] text-foreground-secondary uppercase tracking-wider">
            Average Mood
          </div>
          <div className="text-xl font-bold text-foreground mt-0.5 flex items-baseline gap-1.5">
            <span>{averageMood.toFixed(1)}</span>
            <span className="text-xs font-normal text-foreground-muted">/ 5.0</span>
          </div>
          <div className="text-[11px] text-foreground-muted mt-1">
            {moodDiff > 0 ? (
              <span className="text-sage">↑ +{moodDiff.toFixed(1)} vs prior</span>
            ) : moodDiff < 0 ? (
              <span className="text-calm-blue">↓ {moodDiff.toFixed(1)} vs prior</span>
            ) : (
              <span>Same as prior period</span>
            )}
          </div>
        </div>

        <div className="p-3 bg-surface-elevated rounded-lg border border-border">
          <div className="text-[11px] text-foreground-secondary uppercase tracking-wider">
            Data Completeness
          </div>
          <div className="text-xl font-bold text-foreground mt-0.5">
            {Math.round(((rangeDays - missingCount) / rangeDays) * 100)}%
          </div>
          <div className="text-[11px] text-foreground-muted mt-1">
            {missingCount > 0 ? `${missingCount} skipped days` : 'Complete record'}
          </div>
        </div>

        <div className="p-3 bg-surface-elevated rounded-lg border border-border">
          <div className="text-[11px] text-foreground-secondary uppercase tracking-wider">
            Stress Trend
          </div>
          <div className="text-xl font-bold text-calm-amber mt-0.5">Moderate</div>
          <div className="text-[11px] text-foreground-muted mt-1">Stabilizing toward weekends</div>
        </div>

        <div className="p-3 bg-surface-elevated rounded-lg border border-border">
          <div className="text-[11px] text-foreground-secondary uppercase tracking-wider">
            Average Sleep
          </div>
          <div className="text-xl font-bold text-sage mt-0.5">7.4 hrs</div>
          <div className="text-[11px] text-foreground-muted mt-1">Healthy adolescent baseline</div>
        </div>
      </div>

      {/* Metric Toggles */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <label className="flex items-center gap-2 cursor-pointer text-foreground-secondary hover:text-foreground">
          <input
            type="checkbox"
            checked={showSecondaryMetrics}
            onChange={(e) => setShowSecondaryMetrics(e.target.checked)}
            className="rounded border-border text-sage focus:ring-sage"
          />
          <span>Include Stress, Energy, and Sleep Quality lines</span>
        </label>
        <span className="text-[11px] text-foreground-muted hidden sm:inline">
          Dotted gaps represent intentionally skipped check-in days
        </span>
      </div>

      {/* Recharts Canvas */}
      <div className="w-full h-[260px] md:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" opacity={0.8} />
            <XAxis
              dataKey="date"
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              interval={rangeDays === 7 ? 0 : rangeDays === 30 ? 4 : 12}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              stroke="#94A3B8"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => MOOD_LEVELS[v as 1 | 2 | 3 | 4 | 5]?.label.split(' ')[0] || String(v)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                if (d.isSkipped) {
                  return (
                    <div className="p-3 bg-white border border-border rounded-xl text-xs shadow-elevated">
                      <div className="font-bold text-foreground">{d.fullDate}</div>
                      <div className="text-foreground-secondary mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-calm-amber" />
                        <span>Skipped / Mindful pause</span>
                      </div>
                    </div>
                  );
                }
                const meta = d.mood ? MOOD_LEVELS[d.mood as 1 | 2 | 3 | 4 | 5] : null;
                return (
                  <div className="p-3 bg-white border border-border rounded-xl text-xs shadow-elevated space-y-1">
                    <div className="font-bold text-foreground border-b border-border pb-1">
                      {d.fullDate}
                    </div>
                    {meta && (
                      <div className="text-sage font-semibold flex items-center gap-1.5">
                        <span>{meta.emoji}</span>
                        <span>
                          Mood: {meta.label} ({d.mood}/5)
                        </span>
                      </div>
                    )}
                    {d.stress && (
                      <div className="text-amber-600 font-medium">Stress Level: {d.stress}/10</div>
                    )}
                    {d.energy && (
                      <div className="text-blue-600 font-medium">Energy Level: {d.energy}/10</div>
                    )}
                    {d.sleep && (
                      <div className="text-foreground-secondary font-medium">
                        Sleep: {d.sleep}/10 {d.sleepHours ? `(${d.sleepHours}h)` : ''}
                      </div>
                    )}
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="mood"
              name="Mood (1-5)"
              stroke="#0D9488"
              strokeWidth={3}
              dot={{ r: rangeDays === 7 ? 4 : 2, fill: '#0D9488' }}
              activeDot={{ r: 6, fill: '#0F766E' }}
              connectNulls={false}
            />
            {showSecondaryMetrics && (
              <>
                <Line
                  type="monotone"
                  dataKey="stress"
                  name="Stress (scaled)"
                  stroke="#D1A153"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  name="Energy (scaled)"
                  stroke="#7DA0B5"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                  dot={false}
                  connectNulls={false}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Clinical Disclaimer & Missing Data Note */}
      <div className="mt-4 p-3 bg-surface-elevated/60 border border-border/70 rounded-lg flex items-start gap-2.5 text-xs text-foreground-secondary">
        <Info className="w-4 h-4 text-sage shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-foreground">Clinical Notice:</strong> These self-reported trends are personal wellbeing indicators to assist reflection and voluntary conversation. They are{' '}
          <strong className="text-foreground">not</strong> clinical assessments, diagnostic evaluations, or validated medical predictions.
        </p>
      </div>
    </div>
  );
}
