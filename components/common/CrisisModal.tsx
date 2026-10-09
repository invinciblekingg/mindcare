'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Phone, Heart, ExternalLink, Check, School } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTalkToCounsellor?: () => void;
}

export function CrisisModal({ isOpen, onClose, onTalkToCounsellor }: CrisisModalProps) {
  const primaryCallNumber = 'tel:14416';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="space-y-1">
          <div className="text-[10px] font-mono tracking-widest uppercase text-coral font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-coral inline-block" />
            <span>SESSION PAUSED • SAFETY FIRST</span>
          </div>
          <div className="flex items-center gap-2.5 text-foreground text-xl md:text-2xl font-extrabold tracking-tight">
            <span>We noticed something important.</span>
          </div>
        </div>
      }
      description="What you shared sounded serious to us. You matter, and support is one call away. If you're in immediate danger, please reach out now."
    >
      <div className="space-y-3.5">
        {/* Indian Emergency Helplines List */}
        <div className="space-y-2">
          {/* 1. iCall (India) */}
          <a
            href="https://icallhelpline.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl shadow-xs hover:shadow-sm transition duration-150 ease-out flex items-center justify-between group cursor-pointer"
          >
            <div className="space-y-1">
              <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>iCall (India)</span>
                <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  TISS Helpline
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-700">+91 9152987821</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-sans">Mon-Sat 8am-10pm</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150 ease-out shrink-0" />
          </a>

          {/* 2. Vandrevala Foundation */}
          <a
            href="https://www.vandrevalafoundation.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl shadow-xs hover:shadow-sm transition duration-150 ease-out flex items-center justify-between group cursor-pointer"
          >
            <div className="space-y-1">
              <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Vandrevala Foundation</span>
                <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  24/7 Available
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-700">+91 9999 666 555</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-sans">24/7 Free Counseling</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150 ease-out shrink-0" />
          </a>

          {/* 3. AASRA */}
          <a
            href="http://www.aasra.info/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl shadow-xs hover:shadow-sm transition duration-150 ease-out flex items-center justify-between group cursor-pointer"
          >
            <div className="space-y-1">
              <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>AASRA</span>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  Crisis & Suicide Prevention
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-700">+91 9820466726</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-sans">24/7 Helpline</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150 ease-out shrink-0" />
          </a>

          {/* 4. Tele-MANAS (Govt of India National Mental Health Helpline) */}
          <a
            href="https://telemanas.mohfw.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl shadow-xs hover:shadow-sm transition duration-150 ease-out flex items-center justify-between group cursor-pointer"
          >
            <div className="space-y-1">
              <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Tele-MANAS (National Govt Helpline)</span>
                <span className="text-[10px] font-mono text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full border border-teal-300">
                  Govt of India Toll-Free
                </span>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5 font-mono">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                <span className="font-bold text-coral text-xs sm:text-sm">+91 14416 / 1800-891-4416</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-sans">Toll-free 24/7 (20+ Languages)</span>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-150 ease-out shrink-0" />
          </a>
        </div>

        {/* Talk to School Counsellor CTA (Generic school counsellor) */}
        <div className="p-3 sm:p-3.5 bg-sage-tint border border-sage/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="space-y-0.5 text-left">
            <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
              <School className="w-4 h-4 text-sage" />
              <span>Talk directly with your School Counsellor</span>
            </h4>
            <p className="text-[11px] sm:text-xs text-foreground-secondary">
              Your School Counsellor is available on campus or via confidential platform message.
            </p>
          </div>
          <Button
            variant="sage"
            size="sm"
            onClick={() => {
              onClose();
              if (onTalkToCounsellor) onTalkToCounsellor();
            }}
            className="shrink-0 w-full sm:w-auto rounded-full text-xs"
          >
            Connect with School Counsellor
          </Button>
        </div>

        {/* Bottom Dual Action Buttons (Matches Reference Image) */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            leftIcon={<Check className="w-4 h-4" />}
            className="rounded-full"
          >
            I'm safe right now
          </Button>

          <a
            href="https://telemanas.mohfw.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Button
              type="button"
              variant="coral"
              size="md"
              leftIcon={<Phone className="w-4 h-4 fill-white" />}
              className="rounded-full shadow-sm"
            >
              I need help
            </Button>
          </a>
        </div>
      </div>
    </Modal>
  );
}
