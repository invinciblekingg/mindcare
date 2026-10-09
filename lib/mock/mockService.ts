import {
  UserProfile,
  MoodCheckIn,
  JournalEntry,
  ChatConversation,
  ChatMessage,
  SafetyEvent,
  CounsellorCase,
  InterventionPlan,
  WeeklyReport,
  FollowUpItem,
  AuditLogItem,
} from '@/types';
import { SAMPLE_CHECK_INS } from './checkInsData';
import { SAMPLE_JOURNAL_ENTRIES } from './journalsData';
import { SAMPLE_SAFETY_EVENTS } from './safetyEventsData';
import { INITIAL_CONVERSATIONS, INITIAL_MESSAGES_BY_CONVERSATION } from './conversationsData';
import { SAMPLE_CASES, SAMPLE_FOLLOW_UPS, SAMPLE_INTERVENTION_PLANS } from './counsellorCasesData';

export const CURRENT_STUDENT: UserProfile = {
  id: 'usr_student_maya',
  name: 'Maya Lin',
  email: 'maya.lin@oakridge-high.edu',
  role: 'STUDENT',
  status: 'ACTIVE',
  age: 16,
  grade: 'Grade 11 (Junior)',
  assignedCounsellorName: 'Ms. Sarah Henderson, LPC',
  assignedCounsellorId: 'cns_sarah_henderson',
  emergencyContact: {
    name: 'Elena Lin',
    relationship: 'Parent / Legal Guardian',
    phone: '+1 (555) 234-5678',
  },
  consent: {
    parentalConsentGranted: true,
    parentalConsentDate: '2026-09-01T10:00:00Z',
    guardianEmail: 'elena.lin@gmail.com',
    teenAssentGranted: true,
    teenAssentDate: '2026-09-01T10:15:00Z',
    aiDisclosureAcknowledged: true,
    journalSharingEnabled: true,
    analyticsSharingEnabled: true,
  },
};

export const CURRENT_COUNSELLOR: UserProfile = {
  id: 'cns_sarah_henderson',
  name: 'Ms. Sarah Henderson, LPC',
  email: 's.henderson@oakridge-high.edu',
  role: 'COUNSELLOR',
  status: 'ACTIVE',
  consent: {
    parentalConsentGranted: true,
    teenAssentGranted: true,
    aiDisclosureAcknowledged: true,
    journalSharingEnabled: true,
    analyticsSharingEnabled: true,
  },
};

export const CURRENT_ADMIN: UserProfile = {
  id: 'usr_admin_oakridge',
  name: 'Oakridge IT & Compliance Admin',
  email: 'admin-privacy@oakridge-high.edu',
  role: 'ADMIN',
  status: 'ACTIVE',
  consent: {
    parentalConsentGranted: true,
    teenAssentGranted: true,
    aiDisclosureAcknowledged: true,
    journalSharingEnabled: false,
    analyticsSharingEnabled: false,
  },
};

export const CURRENT_WEEKLY_REPORT: WeeklyReport = {
  id: 'rep_2026_w41',
  userId: 'usr_student_maya',
  weekRange: 'Oct 3 – Oct 9, 2026',
  generatedDate: '2026-10-09T08:00:00Z',
  reflectiveSummary: `This week showed steady resilience through a high-stress chemistry midterm window. While midweek check-ins showed dips in sleep and elevated chest tightness, you consistently turned to grounding techniques like box breathing and outdoor walks with Bailey. Your energy bounced back toward the weekend.`,
  highlights: [
    'Completed 6 out of 7 daily check-ins without pressure',
    'Recognized early signs of academic tension and utilized 4-4-4 breathing',
    'Chose healthy boundary setting in private sketchbook reflection',
    'Preserved 8.5 hours of sleep over Saturday and Sunday',
  ],
  gentleSuggestions: [
    'Notice if late-night Discord checks tend to coincide with higher morning stress.',
    'Give yourself credit for small completions — finishing slides 1 to 4 was a solid win.',
    'Consider asking Ms. Henderson about study pacing before your next lab practical.',
  ],
  averageMood: 3.6,
  dominantEmotion: 'Grounded & Curious',
  checkInRate: 86,
  sleepTrend: 'Improving (+1.2 hrs vs mid-week)',
};

// Generate Audit Log records for Counsellor / Admin
export const SAMPLE_AUDIT_LOGS: AuditLogItem[] = SAMPLE_SAFETY_EVENTS.map((event, idx) => ({
  id: `aud_${event.id}`,
  timestamp: event.timestamp,
  eventType: event.isCrisis ? 'CRISIS_REFERRAL' : 'SAFETY_SCREENING',
  actorId: 'sys_guardrail_engine',
  actorRole: 'ADMIN',
  subjectId: 'usr_student_maya',
  details: `${event.classification} — ${event.actionTaken} (${(event.confidence * 100).toFixed(0)}% conf)`,
  safetyAction: event.actionTaken,
  policyVersion: event.policyVersion,
  modelVersion: event.modelVersion,
  hash: `sha256:7f83b1657ff${idx}a90c1c876b539c991a${idx}e57b98a002`,
  verified: true,
}));

// Client-side in-memory store helpers with localStorage hydration if available
class MockDataStore {
  private checkIns: MoodCheckIn[] = [...SAMPLE_CHECK_INS];
  private journals: JournalEntry[] = [...SAMPLE_JOURNAL_ENTRIES];
  private conversations: ChatConversation[] = [...INITIAL_CONVERSATIONS];
  private messages: Record<string, ChatMessage[]> = { ...INITIAL_MESSAGES_BY_CONVERSATION };
  private cases: CounsellorCase[] = [...SAMPLE_CASES];
  private plans: Record<string, InterventionPlan> = { ...SAMPLE_INTERVENTION_PLANS };
  private followUps: FollowUpItem[] = [...SAMPLE_FOLLOW_UPS];
  private student: UserProfile = { ...CURRENT_STUDENT };

  // Profile / Consent
  getStudentProfile(): UserProfile {
    return { ...this.student };
  }

  updateConsent(updates: Partial<UserProfile['consent']>): UserProfile {
    this.student.consent = { ...this.student.consent, ...updates };
    return { ...this.student };
  }

  // Check-ins
  getCheckIns(): MoodCheckIn[] {
    return [...this.checkIns];
  }

  getTodayCheckIn(): MoodCheckIn | undefined {
    const today = '2026-10-09';
    return this.checkIns.find(c => c.date === today);
  }

  saveCheckIn(data: Omit<MoodCheckIn, 'id' | 'createdAt' | 'userId'>): MoodCheckIn {
    const today = data.date || '2026-10-09';
    const existingIdx = this.checkIns.findIndex(c => c.date === today);
    const newEntry: MoodCheckIn = {
      ...data,
      id: `chk_${today}`,
      userId: this.student.id,
      createdAt: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      this.checkIns[existingIdx] = newEntry;
    } else {
      this.checkIns.unshift(newEntry);
    }
    return newEntry;
  }

  // Journals
  getJournals(searchQuery = '', filterPrivacy?: string): JournalEntry[] {
    return this.journals.filter(j => {
      const matchesSearch =
        !searchQuery ||
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.moodTags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPrivacy =
        !filterPrivacy ||
        filterPrivacy === 'ALL' ||
        j.privacy === filterPrivacy;

      return matchesSearch && matchesPrivacy;
    });
  }

  getJournalById(id: string): JournalEntry | undefined {
    return this.journals.find(j => j.id === id);
  }

  saveJournal(entry: Partial<JournalEntry> & { title: string; content: string }): JournalEntry {
    const now = new Date().toISOString();
    if (entry.id) {
      const idx = this.journals.findIndex(j => j.id === entry.id);
      if (idx >= 0) {
        const updated: JournalEntry = {
          ...this.journals[idx],
          ...entry,
          updatedAt: now,
          wordCount: entry.content.trim().split(/\s+/).filter(Boolean).length,
        };
        this.journals[idx] = updated;
        return updated;
      }
    }

    const newJournal: JournalEntry = {
      id: `jrn_${Date.now()}`,
      userId: this.student.id,
      title: entry.title,
      content: entry.content,
      moodTags: entry.moodTags || [],
      privacy: entry.privacy || 'PRIVATE',
      isDraft: entry.isDraft ?? false,
      createdAt: now,
      updatedAt: now,
      sharedAt: entry.privacy === 'SHARED_WITH_COUNSELLOR' ? now : undefined,
      wordCount: entry.content.trim().split(/\s+/).filter(Boolean).length,
    };
    this.journals.unshift(newJournal);
    return newJournal;
  }

  deleteJournal(id: string): boolean {
    const initLen = this.journals.length;
    this.journals = this.journals.filter(j => j.id !== id);
    return this.journals.length < initLen;
  }

  // Companion Chat
  getConversations(): ChatConversation[] {
    return [...this.conversations];
  }

  getMessages(conversationId: string): ChatMessage[] {
    return [...(this.messages[conversationId] || [])];
  }

  createNewConversation(title: string = 'New Conversation'): ChatConversation {
    const id = `conv_${Date.now()}`;
    const newConv: ChatConversation = {
      id,
      userId: this.student.id,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
    };
    this.conversations.unshift(newConv);
    this.messages[id] = [];
    return newConv;
  }

  // Pre-prepared responses with safety classifications for simulation
  generateAiResponse(
    conversationId: string,
    userText: string
  ): { reply: string; safetyEvent: SafetyEvent } {
    const textLower = userText.toLowerCase();

    // 1. Crisis / Urgent check
    if (
      textLower.includes('kill') ||
      textLower.includes('die') ||
      textLower.includes('hurt myself') ||
      textLower.includes('end it') ||
      textLower.includes('suicide')
    ) {
      return {
        reply: `Maya, I hear how deeply exhausted and heavy things feel right now. Because you matter and I am an AI, I want you to be connected with humans who care and can keep you safe right this second.\n\nPlease reach out to Tele-MANAS (call 14416 toll-free 24/7), the Vandrevala Foundation (+91 9999 666 555), or iCall (+91 9152987821). I have also alerted the School Counsellor's office so someone can reach out to you directly tomorrow morning. You do not have to carry this alone.`,
        safetyEvent: {
          id: `evt_sec_${Date.now().toString(16)}`,
          messageId: `msg_${Date.now()}`,
          timestamp: new Date().toISOString(),
          classification: 'Acute Self-Harm / Crisis Protocol Triggered',
          confidence: 0.99,
          uncertainty: 0.01,
          detectedSignals: [
            { signal: 'Explicit ideation cues', category: 'self_harm', severity: 'critical' },
            { signal: 'Acute distress keywords', category: 'emotional_distress', severity: 'high' },
          ],
          rationale: 'Self-harm / crisis threshold matched. Standard chat blocked; emergency escalation card triggered with Tele-MANAS (14416), Vandrevala (+91 9999 666 555), iCall (+91 9152987821), and counsellor referral notification.',
          actionTaken: 'CRISIS_INTERCEPTED',
          policyVersion: 'v2.4.1-adolescent-baseline',
          modelVersion: 'mindcare-guardian-7b-q4',
          isCrisis: true,
        },
      };
    }

    // 2. Medication / Medical inquiry
    if (textLower.includes('pill') || textLower.includes('mg') || textLower.includes('dose') || textLower.includes('medication')) {
      return {
        reply: `I can hear how much thought you're putting into feeling better, but as an AI wellness companion, I'm strictly not able to give advice on medications or dosages. \n\nPlease talk with your prescribing doctor, pediatrician, or school nurse about how your medication is making you feel — they can give you safe, personalized medical guidance.`,
        safetyEvent: {
          id: `evt_sec_${Date.now().toString(16)}`,
          messageId: `msg_${Date.now()}`,
          timestamp: new Date().toISOString(),
          classification: 'Medical / Prescription Advice Deflection',
          confidence: 0.95,
          uncertainty: 0.05,
          detectedSignals: [
            { signal: 'Dosage inquiry', category: 'medical_query', severity: 'high' },
          ],
          rationale: 'Medical deflection policy applied. AI companion is strictly non-diagnostic and non-pharmacological. Redirected to healthcare provider.',
          actionTaken: 'REDIRECTED',
          policyVersion: 'v2.4.1-adolescent-baseline',
          modelVersion: 'mindcare-guardian-7b-q4',
        },
      };
    }

    // 3. Testing unavailable state (explicit trigger)
    if (textLower.includes('test offline') || textLower.includes('test unavailable')) {
      return {
        reply: `I'm here with you. It looks like our safety verification service is temporarily undergoing maintenance, so I'm keeping my response gentle and simple. Let me know if you would like to pause or try a basic grounding exercise.`,
        safetyEvent: {
          id: `evt_sec_${Date.now().toString(16)}`,
          messageId: `msg_${Date.now()}`,
          timestamp: new Date().toISOString(),
          classification: 'Safety Check Unavailable',
          confidence: 0.0,
          uncertainty: 1.0,
          detectedSignals: [],
          rationale: 'Safety screening microservice returned offline status. System fallback activated. User notified that reply was not fully screened.',
          actionTaken: 'ALLOWED',
          policyVersion: 'v2.4.1-adolescent-baseline',
          modelVersion: 'mindcare-guardian-7b-q4',
          unavailableState: true,
        },
      };
    }

    // 4. Default empathetic adolescent response
    return {
      reply: `Thank you for sharing that with me. It takes courage to put what you're experiencing into words, especially when things feel tangled or busy.\n\nTake a slow, full breath. Remember that you don't have to solve everything all at once. What feels like the smallest, gentlest step you can take right now?`,
      safetyEvent: {
        id: `evt_sec_${Date.now().toString(16)}`,
        messageId: `msg_${Date.now()}`,
        timestamp: new Date().toISOString(),
        classification: 'Supportive Reflection & Empathetic Presence',
        confidence: 0.94,
        uncertainty: 0.06,
        detectedSignals: [
          { signal: 'Vulnerable self-disclosure', category: 'emotional_distress', severity: 'low' },
          { signal: 'Receptive engagement', category: 'coping_strength', severity: 'low' },
        ],
        rationale: 'Standard supportive conversation within approved intervention plan boundaries. Non-diagnostic, empathetic reinforcement permitted.',
        actionTaken: 'ALLOWED',
        policyVersion: 'v2.4.1-adolescent-baseline',
        modelVersion: 'mindcare-guardian-7b-q4',
      },
    };
  }

  addMessage(conversationId: string, message: ChatMessage): void {
    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }
    this.messages[conversationId].push(message);

    const conv = this.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.updatedAt = new Date().toISOString();
      conv.messageCount = this.messages[conversationId].length;
      conv.lastMessageSnippet = message.content.slice(0, 70) + '...';
    }
  }

  // Counsellor cases
  getCases(filterStatus = 'ALL', filterUrgency = 'ALL', search = ''): CounsellorCase[] {
    return this.cases.filter(c => {
      const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
      const matchesUrgency = filterUrgency === 'ALL' || c.urgency === filterUrgency;
      const matchesSearch =
        !search ||
        c.studentName.toLowerCase().includes(search.toLowerCase()) ||
        c.studentEmail.toLowerCase().includes(search.toLowerCase()) ||
        c.referralReason.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesUrgency && matchesSearch;
    });
  }

  getCaseById(id: string): { caseData?: CounsellorCase; isDenied?: boolean } {
    const found = this.cases.find(c => c.id === id);
    if (!found) return {};
    if (found.isAssignedToCurrentUser === false) {
      return { isDenied: true, caseData: found };
    }
    return { caseData: found, isDenied: false };
  }

  addSessionNote(caseId: string, noteText: string): void {
    const c = this.cases.find(item => item.id === caseId);
    if (c) {
      c.sessionNotes.unshift({
        id: `sn_${Date.now()}`,
        date: new Date().toISOString(),
        author: 'Ms. Sarah Henderson, LPC',
        note: noteText,
        confidentialToCounsellors: true,
      });
    }
  }

  // Intervention Plans
  getInterventionPlan(planId: string): InterventionPlan | undefined {
    return this.plans[planId];
  }

  updateInterventionPlan(planId: string, updates: Partial<InterventionPlan>): InterventionPlan | undefined {
    const current = this.plans[planId];
    if (!current) return undefined;

    const newVersionNum = current.currentVersion + 1;
    const historyItem = {
      version: newVersionNum,
      status: updates.status || current.status,
      updatedAt: new Date().toISOString(),
      author: 'Ms. Sarah Henderson, LPC',
      changesSummary: updates.supportGoals !== current.supportGoals ? 'Updated support goals & strategies' : 'Intervention parameters refreshed',
      supportGoals: updates.supportGoals || current.supportGoals,
      preferredResponseStyle: updates.preferredResponseStyle || current.preferredResponseStyle,
      approvedCopingStrategies: updates.approvedCopingStrategies || current.approvedCopingStrategies,
      topicsRequiringCare: updates.topicsRequiringCare || current.topicsRequiringCare,
      referralInstructions: updates.referralInstructions || current.referralInstructions,
    };

    const updatedPlan: InterventionPlan = {
      ...current,
      ...updates,
      currentVersion: newVersionNum,
      updatedAt: new Date().toISOString(),
      history: [historyItem, ...current.history],
    };

    this.plans[planId] = updatedPlan;
    return updatedPlan;
  }

  // Follow-ups
  getFollowUps(): FollowUpItem[] {
    return [...this.followUps];
  }

  toggleFollowUp(id: string): void {
    const item = this.followUps.find(f => f.id === id);
    if (item) {
      item.isCompleted = !item.isCompleted;
    }
  }

  // Audit Logs
  getAuditLogs(): AuditLogItem[] {
    return [...SAMPLE_AUDIT_LOGS];
  }
}

// Global Singleton
export const mockService = new MockDataStore();
