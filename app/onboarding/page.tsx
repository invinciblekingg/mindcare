'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/providers/AppProvider';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Shield,
  CheckCircle,
  Info,
  Heart,
  ArrowRight,
  UserCheck,
  Lock,
  User,
  Mail,
  GraduationCap,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { studentProfile, updateStudentConsent, completeOnboarding } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Student Registration
  const [studentName, setStudentName] = useState(studentProfile.name || 'Maya Lin');
  const [studentEmail, setStudentEmail] = useState(studentProfile.email || 'maya.lin@oakridge-high.edu');
  const [grade, setGrade] = useState(studentProfile.grade || 'Grade 11 (Junior)');
  const [schoolId, setSchoolId] = useState('OHS-2026-9481');

  // Step 2: Age Gate
  const [age, setAge] = useState<number>(studentProfile.age || 16);
  const [ageBlocked, setAgeBlocked] = useState(false);

  // Step 3: Parental Consent
  const [guardianName, setGuardianName] = useState('Elena Lin');
  const [guardianRelationship, setGuardianRelationship] = useState('Parent / Legal Guardian');
  const [guardianEmail, setGuardianEmail] = useState<string>(
    studentProfile.consent.guardianEmail || 'elena.lin@gmail.com'
  );

  // Step 4: Teen's Own Assent
  const [assentUnderstood, setAssentUnderstood] = useState(false);

  // Step 5: "You're talking to an AI" Disclosure
  const [aiDisclosureAcknowledged, setAiDisclosureAcknowledged] = useState(false);

  const handleNext = () => {
    if (step === 1) {
      if (!studentName.trim() || !studentEmail.trim()) return;
      setStep(2);
    } else if (step === 2) {
      if (age < 13) {
        setAgeBlocked(true);
        return;
      }
      setAgeBlocked(false);
      setStep(3);
    } else if (step === 3) {
      if (!guardianEmail.trim()) return;
      updateStudentConsent({
        parentalConsentGranted: true,
        guardianEmail,
        parentalConsentDate: new Date().toISOString(),
      });
      setStep(4);
    } else if (step === 4) {
      if (!assentUnderstood) return;
      updateStudentConsent({
        teenAssentGranted: true,
        teenAssentDate: new Date().toISOString(),
      });
      setStep(5);
    } else if (step === 5) {
      if (!aiDisclosureAcknowledged) return;
      updateStudentConsent({
        aiDisclosureAcknowledged: true,
      });
      completeOnboarding();
      router.push('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      {/* Progress Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sage-tint border border-sage/30 rounded-full text-xs text-sage font-medium">
          <Shield className="w-3.5 h-3.5" />
          <span>MindCareAI Adolescent Onboarding & Safety Protocol</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Welcome to your personal wellness space
        </h1>
        <p className="text-xs sm:text-sm text-foreground-secondary">
          Step {step} of 5: Student Registration, Age Gate, Guardian Consent, Assent, and AI Disclosure.
        </p>

        {/* Stepper Dots */}
        <div className="flex justify-center items-center gap-2 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-sage' : i < step ? 'w-4 bg-sage/60' : 'w-4 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* Step 1: Student Registration */}
      {/* ============================================================== */}
      {step === 1 && (
        <Card padding="lg" className="space-y-6 rounded-2xl shadow-soft">
          <CardHeader>
            <div>
              <CardTitle>Step 1: Student Registration</CardTitle>
              <CardDescription>
                Confirm your student identity associated with your Oakridge High School account.
              </CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground uppercase tracking-wider block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-border rounded-xl text-foreground focus:outline-none focus:border-sage text-xs md:text-sm"
                    placeholder="Student Name"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground uppercase tracking-wider block">
                  School Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-border rounded-xl text-foreground focus:outline-none focus:border-sage text-xs md:text-sm"
                    placeholder="student@oakridge-high.edu"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground uppercase tracking-wider block">
                  Grade / Year
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-border rounded-xl text-foreground focus:outline-none focus:border-sage text-xs md:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground uppercase tracking-wider block">
                  School ID Badge
                </label>
                <input
                  type="text"
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-border rounded-xl text-foreground font-mono focus:outline-none focus:border-sage text-xs md:text-sm"
                />
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border border-border/80 rounded-xl text-foreground-secondary flex items-start gap-2.5 leading-relaxed">
              <Shield className="w-4 h-4 text-sage shrink-0 mt-0.5" />
              <span>
                Your school registration links your account with your school's authorized School Counsellor office under student record privacy standards.
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="sage"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="rounded-full"
            >
              Continue to Age Gate
            </Button>
          </div>
        </Card>
      )}

      {/* ============================================================== */}
      {/* Step 2: Age Gate */}
      {/* ============================================================== */}
      {step === 2 && (
        <Card padding="lg" className="space-y-6 rounded-2xl shadow-soft">
          <CardHeader>
            <div>
              <CardTitle>Step 2: Age Verification Gate</CardTitle>
              <CardDescription>
                MindCareAI applies strict adolescent protection protocols specifically tailored for ages 13–17.
              </CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-5">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                Select Your Current Age:
              </span>
              <div className="flex items-center justify-center gap-3 pt-1">
                {[12, 13, 14, 15, 16, 17, 18].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setAge(val);
                      if (val < 13) setAgeBlocked(true);
                      else setAgeBlocked(false);
                    }}
                    className={`w-12 h-12 rounded-xl text-base font-bold border transition-all ${
                      age === val
                        ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900 shadow-sm scale-105'
                        : 'bg-white text-foreground border-border hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            {ageBlocked ? (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                <div className="space-y-1">
                  <span className="font-bold block">Adolescent Safety Threshold (COPPA & Policy):</span>
                  <span>
                    MindCareAI is calibrated for high school students aged 13 and above. Students under 13 should speak directly with a parent, school counsellor, or pediatrician for in-person support.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-border rounded-xl text-xs text-foreground-secondary flex items-start gap-2.5">
                <Info className="w-4 h-4 text-sage shrink-0 mt-0.5" />
                <span>
                  Adolescent protections apply for age {age}. Secondary parental consent is required to activate conversational features, preserving student confidentiality while maintaining emergency safeguards.
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="rounded-full">
              Back
            </Button>
            <Button
              variant="sage"
              disabled={ageBlocked}
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="rounded-full"
            >
              Continue to Parental Consent
            </Button>
          </div>
        </Card>
      )}

      {/* ============================================================== */}
      {/* Step 3: Parental Consent */}
      {/* ============================================================== */}
      {step === 3 && (
        <Card padding="lg" className="space-y-6 rounded-2xl shadow-soft">
          <CardHeader>
            <div>
              <CardTitle>Step 3: Parent or Legal Guardian Consent</CardTitle>
              <CardDescription>
                Because you are {age}, we coordinate with your guardian for account authorization and school wellbeing safety.
              </CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-4 text-xs md:text-sm">
            <div className="p-4 bg-slate-50 rounded-xl border border-border space-y-2">
              <div className="font-semibold text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-sage" />
                <span>What your guardian sees vs. What stays private:</span>
              </div>
              <ul className="text-xs text-foreground-secondary space-y-1.5 list-disc pl-5">
                <li>
                  <strong className="text-foreground">Visible to Guardian:</strong> Confirmation of active account status with Oakridge High School, and general reflection frequency.
                </li>
                <li>
                  <strong className="text-rose-600">STRICTLY PRIVATE:</strong> The private text of your personal journal entries and confidential AI companion conversations are <strong className="text-foreground">never shown</strong> to parents (unless an urgent emergency self-harm life-safety threshold is triggered).
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                  Guardian Name
                </label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-border rounded-xl text-foreground text-xs md:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                  Relationship
                </label>
                <input
                  type="text"
                  value={guardianRelationship}
                  onChange={(e) => setGuardianRelationship(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-border rounded-xl text-foreground text-xs md:text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                Guardian Email Address:
              </label>
              <input
                type="email"
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-border rounded-xl text-foreground focus:outline-none focus:border-sage text-xs md:text-sm"
                placeholder="guardian@example.com"
              />
              <p className="text-[11px] text-foreground-muted">
                A verification link and plain-language summary was dispatched to this address.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="rounded-full">
              Back
            </Button>
            <Button
              variant="sage"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="rounded-full"
            >
              Continue to Teen Assent
            </Button>
          </div>
        </Card>
      )}

      {/* ============================================================== */}
      {/* Step 4: Teen's Own Assent */}
      {/* ============================================================== */}
      {step === 4 && (
        <Card padding="lg" className="space-y-6 rounded-2xl shadow-soft">
          <CardHeader>
            <div>
              <CardTitle>Step 4: Your Assent: Plain-Language Agreement</CardTitle>
              <CardDescription>
                What is shared, with whom, and when. You are always in control of your reflection space.
              </CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-3 text-xs text-foreground-secondary">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-border/80 space-y-1">
              <div className="font-semibold text-foreground text-sm">1. Your Journal is Private by Default</div>
              <p>
                Nothing in your journal is sent to your counsellor or parents unless you explicitly tap "Share with counsellor".
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-border/80 space-y-1">
              <div className="font-semibold text-foreground text-sm">2. Voluntary Daily Check-ins</div>
              <p>
                There are zero streak penalties, no guilt messaging, and you can take a pass anytime. Check-ins exist to support your own self-awareness.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-border/80 space-y-1">
              <div className="font-semibold text-foreground text-sm">3. Emergency Exceptions (Zero Secrets Rule)</div>
              <p>
                If you ever tell the AI that you plan to hurt yourself or someone else, we are required to connect you with caring human support (school counsellor or crisis lifelines).
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-border/80 space-y-1">
              <div className="font-semibold text-foreground text-sm">4. Review or Withdraw Anytime</div>
              <p>
                You can review, modify, or revoke your consent preferences at any time in Settings & Privacy.
              </p>
            </div>

            <label className="flex items-start gap-3 p-3.5 bg-sage-tint border border-sage/40 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={assentUnderstood}
                onChange={(e) => setAssentUnderstood(e.target.checked)}
                className="mt-0.5 rounded border-border text-sage focus:ring-sage"
              />
              <span className="text-foreground text-xs font-semibold">
                I understand what is shared, with whom, and when. I agree to participate voluntarily.
              </span>
            </label>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="ghost" size="sm" onClick={() => setStep(3)} className="rounded-full">
              Back
            </Button>
            <Button
              variant="sage"
              disabled={!assentUnderstood}
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="rounded-full"
            >
              Continue to AI Disclosure
            </Button>
          </div>
        </Card>
      )}

      {/* ============================================================== */}
      {/* Step 5: "You're talking to an AI" Disclosure */}
      {/* ============================================================== */}
      {step === 5 && (
        <Card padding="lg" className="space-y-6 rounded-2xl shadow-soft">
          <CardHeader>
            <div>
              <CardTitle>Step 5: "You're Talking to an AI" Disclosure</CardTitle>
              <CardDescription>
                Transparency is at the heart of MindCareAI. Zero black boxes.
              </CardDescription>
            </div>
          </CardHeader>

          <div className="space-y-4">
            <div className="p-5 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                <span>You are chatting with an Artificial Intelligence, not a human</span>
              </div>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                MindCareAI is a supportive computer software program. It is <strong className="text-foreground">not a doctor, clinical psychologist, or licensed therapist</strong>. It cannot diagnose mental health disorders, prescribe medications, or replace human therapeutic relationships.
              </p>
              <p className="text-xs text-foreground-secondary leading-relaxed">
                Every AI response is evaluated by an explainable 4-stage safety pipeline (Input Screening → LLM Reasoning → Output Screening → Action Enforcement) with immutable audit records.
              </p>
            </div>

            <label className="flex items-start gap-3 p-4 bg-slate-50 border border-border rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={aiDisclosureAcknowledged}
                onChange={(e) => setAiDisclosureAcknowledged(e.target.checked)}
                className="mt-0.5 rounded border-border text-sage focus:ring-sage"
              />
              <span className="text-foreground text-xs font-semibold leading-relaxed">
                I understand that MindCareAI is an artificial intelligence tool, not a human, and does not provide clinical diagnoses or medical advice.
              </span>
            </label>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="ghost" size="sm" onClick={() => setStep(4)} className="rounded-full">
              Back
            </Button>
            <Button
              variant="sage"
              disabled={!aiDisclosureAcknowledged}
              onClick={handleNext}
              leftIcon={<CheckCircle className="w-4 h-4" />}
              className="rounded-full"
            >
              Complete Onboarding & Enter Dashboard
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
