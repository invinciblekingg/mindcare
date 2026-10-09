'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockService } from '@/lib/mock/mockService';
import { MoodValue } from '@/types';
import { MOOD_LEVELS, COMMON_EMOTIONS } from '@/lib/mock/constants';
import { MoodSelector } from '@/components/ui/MoodSelector';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { CheckCircle2, Heart, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export default function DailyCheckInPage() {
  const router = useRouter();

  // Existing today's checkin if any
  const existing = mockService.getTodayCheckIn();

  const [mood, setMood] = useState<MoodValue | undefined>(existing && !existing.skipped ? existing.mood : undefined);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(existing?.emotions || []);
  const [stressLevel, setStressLevel] = useState<number>(existing?.stressLevel || 4);
  const [energyLevel, setEnergyLevel] = useState<number>(existing?.energyLevel || 6);
  const [sleepQuality, setSleepQuality] = useState<number>(existing?.sleepQuality || 7);
  const [sleepHours, setSleepHours] = useState<number>(existing?.sleepHours || 7.5);
  const [notes, setNotes] = useState<string>(existing?.notes || '');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSkipped, setIsSkipped] = useState<boolean>(false);

  const toggleEmotion = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion));
    } else {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood) return;

    mockService.saveCheckIn({
      date: '2026-10-09',
      mood,
      emotions: selectedEmotions,
      stressLevel,
      energyLevel,
      sleepQuality,
      sleepHours,
      notes: notes.trim() || undefined,
      skipped: false,
    });

    setIsSubmitted(true);
  };

  const handleSkip = () => {
    mockService.saveCheckIn({
      date: '2026-10-09',
      mood: 3,
      emotions: [],
      stressLevel: 5,
      energyLevel: 5,
      sleepQuality: 5,
      skipped: true,
    });
    setIsSkipped(true);
  };

  // Warm, brief success state
  if (isSubmitted || isSkipped) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-5 animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-sage-tint border border-sage/40 rounded-full flex items-center justify-center mx-auto text-sage">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">
            {isSkipped ? 'Took a mindful pass for today.' : 'Thank you for checking in with yourself.'}
          </h2>
          <p className="text-sm text-foreground-secondary max-w-md mx-auto leading-relaxed">
            {isSkipped
              ? 'Pausing is completely okay. Your space will be right here whenever you want to return.'
              : 'Noticing how you feel is a quiet act of self-care. Your entry has been saved privately.'}
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-4">
          <Button variant="secondary" size="md" onClick={() => router.push('/')}>
            Back to Dashboard
          </Button>
          <Button variant="sage" size="md" onClick={() => router.push('/companion')} leftIcon={<Sparkles className="w-4 h-4" />}>
            Reflect in Companion
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Daily Reflection Check-in</h1>
          <p className="text-xs md:text-sm text-foreground-secondary mt-0.5">
            Voluntary, calm, and zero streak penalties.
          </p>
        </div>

        {/* ALWAYS-AVAILABLE SKIP BUTTON */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="text-foreground-muted hover:text-foreground text-xs"
        >
          Skip for today
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: 5-point Mood Selector */}
        <Card padding="lg" className="space-y-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-sage font-semibold">Step 1 of 3</span>
            <CardTitle className="text-lg mt-1">How are you feeling overall right now?</CardTitle>
            <CardDescription>Select the option that most closely matches your mood today.</CardDescription>
          </div>

          <MoodSelector value={mood} onChange={setMood} />
        </Card>

        {/* Step 2: Emotion Chips (Optional) */}
        <Card padding="lg" className="space-y-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-foreground-secondary font-semibold">
              Step 2 of 3 (Optional)
            </span>
            <CardTitle className="text-lg mt-1">What words describe your feelings today?</CardTitle>
            <CardDescription>Pick as many or as few as feel true for you.</CardDescription>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {COMMON_EMOTIONS.map((emotion) => {
              const isSelected = selectedEmotions.includes(emotion);
              return (
                <button
                  key={emotion}
                  type="button"
                  onClick={() => toggleEmotion(emotion)}
                  className={`text-xs md:text-sm px-3.5 py-1.5 rounded-full border transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                      : 'bg-surface-elevated text-foreground-secondary border-border hover:border-border-highlight hover:text-foreground'
                  }`}
                >
                  {emotion}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Step 3: Sliders & Free Text (Optional) */}
        <Card padding="lg" className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-foreground-secondary font-semibold">
              Step 3 of 3 (Optional)
            </span>
            <CardTitle className="text-lg mt-1">Stress, Energy, and Sleep</CardTitle>
            <CardDescription>Tune these sliders to capture your physical rhythm.</CardDescription>
          </div>

          {/* Stress Level */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-foreground-secondary font-medium">Stress Level:</span>
              <span className="font-semibold text-calm-amber">{stressLevel} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="w-full accent-[#8FAE9B] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-foreground-muted">
              <span>Peaceful (1)</span>
              <span>Moderate (5)</span>
              <span>High Tension (10)</span>
            </div>
          </div>

          {/* Energy Level */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-foreground-secondary font-medium">Energy Level:</span>
              <span className="font-semibold text-sage">{energyLevel} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full accent-[#8FAE9B] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-foreground-muted">
              <span>Drained (1)</span>
              <span>Balanced (5)</span>
              <span>Energized (10)</span>
            </div>
          </div>

          {/* Sleep Hours & Quality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-foreground-secondary font-medium">Sleep Hours Last Night:</span>
                <span className="font-semibold text-foreground">{sleepHours} hrs</span>
              </div>
              <input
                type="range"
                min="3"
                max="12"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(Number(e.target.value))}
                className="w-full accent-[#8FAE9B] cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-foreground-secondary font-medium">Sleep Restfulness:</span>
                <span className="font-semibold text-foreground">{sleepQuality} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={sleepQuality}
                onChange={(e) => setSleepQuality(Number(e.target.value))}
                className="w-full accent-[#8FAE9B] cursor-pointer"
              />
            </div>
          </div>

          {/* Free text reflection */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Any personal thought you want to set down? (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Felt a bit jittery before the quiz, but took a walk afterwards..."
              className="w-full p-3 bg-surface-elevated border border-border rounded-lg text-xs md:text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-sage transition-colors resize-none"
            />
          </div>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button type="button" variant="ghost" size="md" onClick={handleSkip}>
            Skip for today
          </Button>

          <Button
            type="submit"
            variant="sage"
            size="lg"
            disabled={!mood}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Save Today’s Check-in
          </Button>
        </div>
      </form>
    </div>
  );
}
