'use client';

import React from 'react';
import { MoodValue } from '@/types';
import { MOOD_LEVELS } from '@/lib/mock/constants';

export interface MoodSelectorProps {
  value?: MoodValue;
  onChange: (value: MoodValue) => void;
  disabled?: boolean;
}

export function MoodSelector({ value, onChange, disabled = false }: MoodSelectorProps) {
  const levels: MoodValue[] = [1, 2, 3, 4, 5];

  return (
    <div
      role="radiogroup"
      aria-label="How are you feeling today?"
      className="grid grid-cols-2 sm:grid-cols-5 gap-3"
    >
      {levels.map((lvl) => {
        const meta = MOOD_LEVELS[lvl];
        const isSelected = value === lvl;

        return (
          <button
            key={lvl}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={disabled}
            onClick={() => onChange(lvl)}
            className={`flex flex-col items-center justify-between p-4 rounded-2xl border text-center transition-all duration-200 select-none min-h-[100px] ${
              isSelected
                ? 'bg-sage/10 border-sage shadow-sm ring-2 ring-sage ring-offset-2 ring-offset-white scale-102'
                : 'bg-white border-border hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 shadow-xs'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="text-3xl mb-2 transition-transform duration-200 group-hover:scale-110" aria-hidden="true">
              {meta.emoji}
            </span>
            <span className={`text-sm font-bold ${isSelected ? 'text-sage' : 'text-foreground'}`}>
              {meta.label}
            </span>
            <span className="text-[11px] text-foreground-secondary mt-1 line-clamp-2">
              {meta.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
