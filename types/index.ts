export type UserRole = 'STUDENT' | 'COUNSELLOR' | 'ADMIN';

export type AccountStatus = 'PENDING_CONSENT' | 'ACTIVE' | 'SUSPENDED' | 'DELETED';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  age?: number;
  grade?: string;
  assignedCounsellorName?: string;
  assignedCounsellorId?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  consent: {
    parentalConsentGranted: boolean;
    parentalConsentDate?: string;
    guardianEmail?: string;
    teenAssentGranted: boolean;
    teenAssentDate?: string;
    aiDisclosureAcknowledged: boolean;
    journalSharingEnabled: boolean;
    analyticsSharingEnabled: boolean;
  };
}

export type MoodValue = 1 | 2 | 3 | 4 | 5;

export interface MoodMeta {
  value: MoodValue;
  label: string;
  description: string;
  emoji: string;
  colorName: string;
  badgeBg: string;
  badgeBorder: string;
}

export interface MoodCheckIn {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
  mood: MoodValue;
  emotions: string[];
  stressLevel: number; // 1-10
  energyLevel: number; // 1-10
  sleepQuality: number; // 1-10
  sleepHours?: number;
  notes?: string;
  skipped?: boolean;
}

export type JournalPrivacy = 'PRIVATE' | 'SHARED_WITH_COUNSELLOR';

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  moodTags: string[];
  privacy: JournalPrivacy;
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
  sharedAt?: string;
  wordCount: number;
}

export type SafetyAction = 
  | 'ALLOWED' 
  | 'MODIFIED' 
  | 'BLOCKED' 
  | 'REDIRECTED' 
  | 'REFERRED' 
  | 'CRISIS_INTERCEPTED';

export interface DetectedSignal {
  signal: string;
  category: 'emotional_distress' | 'academic_stress' | 'isolation' | 'self_harm' | 'medical_query' | 'coping_strength' | 'general';
  severity: 'low' | 'moderate' | 'high' | 'critical';
}

export interface SafetyEvent {
  id: string; // audit event ID e.g. evt_sec_...
  messageId: string;
  timestamp: string;
  classification: string;
  confidence: number; // 0.0 - 1.0
  uncertainty: number; // 0.0 - 1.0
  detectedSignals: DetectedSignal[];
  rationale: string;
  actionTaken: SafetyAction;
  policyVersion: string;
  modelVersion: string;
  unavailableState?: boolean;
  isCrisis?: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  safetyEvent?: SafetyEvent;
  isStreaming?: boolean;
}

export interface ChatConversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessageSnippet?: string;
  hasInterventions?: boolean;
}

export type PlanStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'SUPERSEDED';

export interface InterventionPlanVersion {
  version: number;
  status: PlanStatus;
  updatedAt: string;
  author: string;
  changesSummary: string;
  supportGoals: string;
  preferredResponseStyle: string;
  approvedCopingStrategies: string[];
  topicsRequiringCare: string;
  referralInstructions: string;
}

export interface InterventionPlan {
  id: string;
  studentId: string;
  studentName: string;
  counsellorId: string;
  counsellorName: string;
  status: PlanStatus;
  currentVersion: number;
  supportGoals: string;
  preferredResponseStyle: string;
  approvedCopingStrategies: string[];
  topicsRequiringCare: string;
  referralInstructions: string;
  reviewSchedule: string;
  nextReviewDate: string;
  createdAt: string;
  updatedAt: string;
  history: InterventionPlanVersion[];
}

export type CaseUrgency = 'ROUTINE' | 'ELEVATED' | 'URGENT';
export type CaseStatus = 'ACTIVE' | 'PENDING_ACKNOWLEDGEMENT' | 'IN_REVIEW' | 'CLOSED';

export interface SessionNote {
  id: string;
  date: string;
  author: string;
  note: string;
  confidentialToCounsellors: boolean;
}

export interface CounsellorCase {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAge: number;
  grade: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  urgency: CaseUrgency;
  status: CaseStatus;
  referralReason: string;
  referralEvidence: string;
  uncertaintyScore: number; // 0.0 - 1.0
  lastActivity: string;
  assignedCounsellorId: string;
  assignedCounsellorName: string;
  hasInterventionPlan: boolean;
  interventionPlanId?: string;
  sessionNotes: SessionNote[];
  consentedJournalCount: number;
  safetyIncidentCount: number;
  isAssignedToCurrentUser?: boolean;
}

export interface WeeklyReport {
  id: string;
  userId: string;
  weekRange: string;
  generatedDate: string;
  reflectiveSummary: string;
  highlights: string[];
  gentleSuggestions: string[];
  averageMood: number;
  dominantEmotion: string;
  checkInRate: number; // e.g. 85%
  sleepTrend: string;
}

export interface FollowUpItem {
  id: string;
  caseId: string;
  studentId: string;
  studentName: string;
  title: string;
  dueDate: string;
  category: 'Plan Review' | 'Referral Acknowledgement' | 'Post-Incident Check' | 'Routine Session';
  isCompleted: boolean;
  priority: 'normal' | 'high' | 'urgent';
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  eventType: 'SAFETY_SCREENING' | 'CONSENT_CHANGE' | 'PLAN_UPDATE' | 'DATA_ACCESS' | 'CRISIS_REFERRAL';
  actorId: string;
  actorRole: UserRole;
  subjectId: string;
  details: string;
  safetyAction?: SafetyAction;
  policyVersion?: string;
  modelVersion?: string;
  hash: string;
  verified: boolean;
}
