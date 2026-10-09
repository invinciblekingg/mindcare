'use client';

import React, { useState } from 'react';

export interface DataPoint {
  id: string;
  x: number;
  y: number;
  date?: string;
  note?: string;
}

export interface CorrelationScatterCardProps {
  badgeLabel?: string;
  title: string;
  metricXName: string;
  metricYName: string;
  rValue: number;
  sampleSize: number;
  summary: string;
  colorTheme?: 'coral' | 'sage' | 'amber' | 'violet' | 'teal';
  points: DataPoint[];
  domainX?: [number, number];
  domainY?: [number, number];
  ticksX?: number[];
  ticksY?: number[];
  className?: string;
}

const THEME_STYLES = {
  coral: {
    statColor: 'text-rose-500',
    dotFill: '#F43F5E',
    dotGlow: 'rgba(244, 63, 94, 0.22)',
    lineStroke: 'rgba(244, 63, 94, 0.45)',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200/60',
  },
  sage: {
    statColor: 'text-teal-600',
    dotFill: '#0D9488',
    dotGlow: 'rgba(13, 148, 136, 0.22)',
    lineStroke: 'rgba(13, 148, 136, 0.45)',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200/60',
  },
  amber: {
    statColor: 'text-amber-600',
    dotFill: '#F59E0B',
    dotGlow: 'rgba(245, 158, 11, 0.22)',
    lineStroke: 'rgba(245, 158, 11, 0.45)',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/60',
  },
  violet: {
    statColor: 'text-indigo-600',
    dotFill: '#6366F1',
    dotGlow: 'rgba(99, 102, 241, 0.22)',
    lineStroke: 'rgba(99, 102, 241, 0.45)',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
  },
  teal: {
    statColor: 'text-emerald-600',
    dotFill: '#10B981',
    dotGlow: 'rgba(16, 185, 129, 0.22)',
    lineStroke: 'rgba(16, 185, 129, 0.45)',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  },
};

export function CorrelationScatterCard({
  badgeLabel = 'SAME DAY',
  title,
  metricXName,
  metricYName,
  rValue,
  sampleSize,
  summary,
  colorTheme = 'coral',
  points,
  domainX = [0, 12],
  domainY = [0, 8],
  ticksX = [0, 3, 6, 9, 12],
  ticksY = [0, 2, 4, 6, 8],
  className = '',
}: CorrelationScatterCardProps) {
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  const theme = THEME_STYLES[colorTheme] || THEME_STYLES.coral;

  // Chart dimensions in SVG coordinates
  const svgWidth = 520;
  const svgHeight = 230;
  const paddingLeft = 44;
  const paddingRight = 24;
  const paddingTop = 18;
  const paddingBottom = 34;

  const plotWidth = svgWidth - paddingLeft - paddingRight;
  const plotHeight = svgHeight - paddingTop - paddingBottom;

  // Mapping functions
  const scaleX = (val: number) => {
    const [min, max] = domainX;
    return paddingLeft + ((val - min) / (max - min)) * plotWidth;
  };

  const scaleY = (val: number) => {
    const [min, max] = domainY;
    return paddingTop + plotHeight - ((val - min) / (max - min)) * plotHeight;
  };

  // Calculate linear regression (trend line)
  let trendLine = null;
  if (points.length >= 2) {
    const n = points.length;
    const sumX = points.reduce((acc, p) => acc + p.x, 0);
    const sumY = points.reduce((acc, p) => acc + p.y, 0);
    const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
    const sumX2 = points.reduce((acc, p) => acc + p.x * p.x, 0);

    const denominator = n * sumX2 - sumX * sumX;
    if (Math.abs(denominator) > 0.0001) {
      const slope = (n * sumXY - sumX * sumY) / denominator;
      const intercept = (sumY - slope * sumX) / n;

      const minX = Math.min(...points.map((p) => p.x));
      const maxX = Math.max(...points.map((p) => p.x));

      const y1 = slope * minX + intercept;
      const y2 = slope * maxX + intercept;

      trendLine = {
        x1: scaleX(minX),
        y1: scaleY(Math.min(Math.max(y1, domainY[0]), domainY[1])),
        x2: scaleX(maxX),
        y2: scaleY(Math.min(Math.max(y2, domainY[0]), domainY[1])),
      };
    }
  }

  // Format rValue string (+0.96 or -0.99)
  const formattedR = rValue > 0 ? `+${rValue.toFixed(2)}` : rValue.toFixed(2);

  return (
    <div
      className={`p-5 md:p-6 bg-white rounded-2xl border border-border/80 shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group ${className}`}
    >
      <div>
        {/* Card Header: Category & Stat */}
        <div className="flex items-start justify-between gap-4 pb-2">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 font-semibold">
              {badgeLabel}
            </span>
            <h3 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
              {title}
            </h3>
          </div>

          <div className="text-right">
            <div className={`text-2xl md:text-3xl font-extrabold font-mono tracking-tight ${theme.statColor}`}>
              {formattedR}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
              n = {sampleSize}
            </div>
          </div>
        </div>

        {/* SVG Scatter Plot */}
        <div className="relative my-2 w-full select-none">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible"
            aria-label={`Scatter plot for ${title}`}
          >
            {/* Horizontal Grid lines */}
            {ticksY.map((tick) => {
              const yPos = scaleY(tick);
              return (
                <g key={`y-${tick}`}>
                  <line
                    x1={paddingLeft}
                    y1={yPos}
                    x2={paddingLeft + plotWidth}
                    y2={yPos}
                    stroke="#F1F5F9"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                  <text
                    x={paddingLeft - 10}
                    y={yPos + 4}
                    textAnchor="end"
                    className="text-[11px] font-mono fill-slate-400 select-none font-medium"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* Vertical Grid lines & X Ticks */}
            {ticksX.map((tick) => {
              const xPos = scaleX(tick);
              return (
                <g key={`x-${tick}`}>
                  <line
                    x1={xPos}
                    y1={paddingTop}
                    x2={xPos}
                    y2={paddingTop + plotHeight}
                    stroke="#F1F5F9"
                    strokeWidth="1"
                    strokeDasharray="2 3"
                  />
                  <text
                    x={xPos}
                    y={paddingTop + plotHeight + 18}
                    textAnchor="middle"
                    className="text-[11px] font-mono fill-slate-400 select-none font-medium"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* Solid Axes Borders */}
            <line
              x1={paddingLeft}
              y1={paddingTop}
              x2={paddingLeft}
              y2={paddingTop + plotHeight}
              stroke="#CBD5E1"
              strokeWidth="1.25"
            />
            <line
              x1={paddingLeft}
              y1={paddingTop + plotHeight}
              x2={paddingLeft + plotWidth}
              y2={paddingTop + plotHeight}
              stroke="#CBD5E1"
              strokeWidth="1.25"
            />

            {/* Trend regression line */}
            {trendLine && (
              <line
                x1={trendLine.x1}
                y1={trendLine.y1}
                x2={trendLine.x2}
                y2={trendLine.y2}
                stroke={theme.lineStroke}
                strokeWidth="2"
                strokeDasharray="4 4"
                className="transition-all duration-300"
              />
            )}

            {/* Scatter Points */}
            {points.map((pt) => {
              const cx = scaleX(pt.x);
              const cy = scaleY(pt.y);
              const isHovered = hoveredPoint?.id === pt.id;

              return (
                <g
                  key={pt.id}
                  className="cursor-pointer transition-transform duration-200"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Subtle outer glow circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 12 : 7}
                    fill={theme.dotGlow}
                    className="transition-all duration-200 pointer-events-none"
                  />
                  {/* Center Dot */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 6 : 4.5}
                    fill={theme.dotFill}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    className="transition-all duration-200 drop-shadow-sm"
                  />
                </g>
              );
            })}
          </svg>

          {/* Floating Tooltip when hovered */}
          {hoveredPoint && (
            <div
              className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 bg-slate-900 text-white px-2.5 py-1.5 rounded-lg text-xs shadow-elevated font-mono whitespace-nowrap animate-in fade-in zoom-in-95 duration-150"
              style={{
                left: `${(scaleX(hoveredPoint.x) / svgWidth) * 100}%`,
                top: `${(scaleY(hoveredPoint.y) / svgHeight) * 100}%`,
              }}
            >
              <div className="font-semibold text-slate-200 text-[10px] pb-0.5">
                {hoveredPoint.date || 'Check-in'}
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-slate-400">{metricXName}:</span>
                <span className="font-bold text-white">{hoveredPoint.x}</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">{metricYName}:</span>
                <span className="font-bold text-teal-300">{hoveredPoint.y}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Insight Summary at bottom */}
      <div className="pt-3 border-t border-border/50 text-xs text-foreground-secondary leading-relaxed">
        {summary}
      </div>
    </div>
  );
}
