# MindCareAI — Product Requirements Document

**Version:** 1.0  
**Date:** October 2026  
**Product:** Explainable Mental Wellness & Counsellor Support Platform

## 1. Executive Summary

MindCareAI is a privacy-focused mental wellness platform for teenagers that combines an AI companion, daily emotional check-ins, private journaling, wellbeing analytics, and a dedicated counsellor portal. The platform supports reflection and early identification of concerns without diagnosing conditions or replacing qualified professionals. Its defining principle is explainability: safety classifications, policy decisions, and escalation actions should be traceable and reviewable.

## 2. Inspiration & Problem Statement

Many AI wellness tools behave like black boxes, relying on generative responses without transparent safety checks, clear escalation pathways, or meaningful human oversight. A chatbot may overlook warning signs, misread context, or offer inappropriate generic advice. Counsellors may also lack a unified view of a student's self-reported mood, check-in history, and changes over time.

MindCareAI addresses this gap through supportive AI conversations, explainable safety assessments, longitudinal wellbeing tracking, and a secure counsellor intervention workflow.

## 3. Product Vision & Goals

- Support daily wellbeing through simple, voluntary emotional check-ins.
- Provide a supportive, non-diagnostic AI companion with input and output safety checks.
- Visualize self-reported wellbeing trends in clear dashboards.
- Enable authorized counsellors to review referrals and coordinate human-led support.
- Make AI safety actions auditable through recorded classifications, policy versions, and outcomes.
- Protect sensitive information through consent, least-privilege access, secure storage, and retention controls.

## 4. Target Users & Roles

| Role | Responsibilities / Access |
|---|---|
| Teenage user / Student | Uses the companion, completes check-ins, maintains a private journal, views personal trends, and controls sharing where applicable. |
| Counsellor | Reviews assigned or authorized cases, sees relevant consented history, creates support plans, and schedules follow-ups. |
| Platform administrator | Manages accounts, counsellor verification, access configuration, retention policies, and audit operations. Administration does not automatically grant unrestricted journal access. |

## 5. Product Modules

### 5.1 AI Companion

- Streaming, empathetic, non-diagnostic conversations.
- Safety screening of incoming messages and generated responses.
- Live safety panel showing classification, confidence/uncertainty, detected signals, rationale, and action taken.
- Context-aware responses using only consented preferences and approved support-plan guidance.
- Conversation history, privacy controls, and a visible “I need help now” action.

### 5.2 Daily Check-in

- Five-point mood scale and optional emotion selection.
- Optional stress, energy, and sleep-quality ratings.
- Optional free-text reflection.
- Historical check-ins and changes over time.
- No penalties, guilt-inducing reminders, or forced completion.

### 5.3 Private Journal

- Create, edit, search, and delete entries.
- Titles, dates, optional mood tags, and free-form text.
- Draft saving and optional reflection prompts.
- Entries are private by default; sharing requires clear, recorded permission.
- Do not silently feed all journal content into AI context or counsellor views.

### 5.4 Wellbeing Dashboard & Analytics

- Mood trend charts over 7, 30, and 90 days.
- Check-in history and completion patterns.
- Stress, energy, and sleep trends when recorded.
- Weekly reflections and comparisons with prior periods.
- Clear explanations of missing data and limitations.
- Analytics are wellbeing indicators, not clinical diagnoses or validated predictions.

### 5.5 Counsellor Portal

- Assigned-case queue and referral status.
- Relevant mood trends, check-in history, consented journal excerpts, and safety-event summaries.
- Referral review, support-plan creation, revision, approval, and closure.
- Follow-up scheduling and session notes.
- Approved guidance published to the AI through versioned configuration.
- Audit panel showing recorded safety signals, rationales, decisions, and policy versions.
- Escalation to appropriate human-support pathways.

## 6. Counsellor Workflow

1. Signals arise from check-in trends, a direct request for help, or a safety-screening event.
2. The system records the source, relevant evidence, uncertainty, and reason for any referral.
3. An authorized counsellor reviews the case context and determines the next appropriate action.
4. The counsellor creates a structured support plan with goals, preferred communication style, approved strategies, referral instructions, and review date.
5. The backend compiles approved fields into a versioned AI instruction set; core safety rules cannot be overridden by an editable prompt.
6. The system records policy versions and follow-up actions for audit and review.

## 7. Intervention Plan Structure

| Field | Description |
|---|---|
| Support goals | Student-specific goals for supportive conversations and help-seeking. |
| Preferred response style | For example, gentle, brief, and non-judgmental. |
| Approved coping strategies | Counsellor-reviewed suggestions appropriate to the plan. |
| Topics requiring care | Specific guidance and boundaries set by the counsellor. |
| Referral instructions | When and how the student should reconnect with human support. |
| Review schedule | Next review date and conditions for revisiting the plan. |
| Plan status | Draft, pending approval, active, or superseded. |

Plans must be structured, versioned, and approved before activation. Counsellors must not be able to disable platform-level safety controls by editing an unrestricted system prompt.

## 8. Explainability & Safety Verdict

Each AI response should have a retrievable safety-event record containing:

- Classification or policy category assigned by the screening system.
- Confidence and uncertainty, where meaningful and properly calibrated.
- Detected signals and relevant evidence, subject to access permissions.
- Human-readable rationale explaining the actual policy decision.
- Action taken: allowed, modified, blocked, redirected, or referred for human review.
- Safety policy version and relevant model version.
- Unique audit event ID and timestamps.

The system must show evidence and recorded decision rationales, not fabricated certainty or purported access to a model's hidden chain-of-thought. If screening fails or is unavailable, the interface must not imply that the response passed safety review.

## 9. Information Architecture

### Student application
- Dashboard
- Companion
- Daily check-in
- Journal
- Analytics
- Weekly report
- Settings and privacy

### Counsellor application
- Overview
- Case management
- Intervention plans
- AI safety audit
- Follow-ups and reports
- Assigned-case queue
- Account and access settings

## 10. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Secure registration, login, and role-based access. | P0 |
| FR-02 | Daily check-in and historical records. | P0 |
| FR-03 | Streaming AI chat with input and output safety checks. | P0 |
| FR-04 | Explainable safety panel and event logging. | P0 |
| FR-05 | Private journal with create, edit, and delete. | P0 |
| FR-06 | Mood and wellbeing trend charts. | P0 |
| FR-07 | Help action with appropriate human-support options. | P0 |
| FR-08 | Consent-controlled referral workflow. | P0 |
| FR-09 | Counsellor case dashboard and relevant student history. | P0 |
| FR-10 | Versioned intervention plans and approval controls. | P0 |
| FR-11 | AI audit history linked to model and policy versions. | P0 |
| FR-12 | Weekly reflection report. | P1 |
| FR-13 | Follow-up reminders and case management. | P1 |
| FR-14 | Access-controlled audit exports. | P1 |
| FR-15 | Advanced, de-identified aggregate analytics. | P2 |

**Priority definitions:** P0 = essential initial release; P1 = next phase; P2 = later enhancement. A real-user pilot also requires safety, privacy, and safeguarding validation.

## 11. Technical Architecture

| Layer | Suggested technology / responsibility |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Charts | Recharts |
| Backend | Next.js Route Handlers; authorization, validation, streaming |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Auth.js or a suitable managed provider |
| AI | Server-side LLM API integration with streaming |
| Safety service | Separate screening, policy evaluation, response validation, and escalation |
| Validation | Zod |
| Hosting | Suitable Next.js host and managed PostgreSQL service |
| Testing | Vitest, Playwright, and dedicated AI safety evaluations |

Never expose provider keys, database credentials, or privileged counsellor operations in the browser. Enforce authorization on the server for every request, not only by hiding UI elements.

## 12. Initial Data Model

| Entity | Key fields / purpose |
|---|---|
| `User` | id, role, display name, account status |
| `ConsentRecord` | user id, consent type, status, timestamp, version |
| `MoodCheckIn` | user id, mood, stress, energy, sleep, created at |
| `JournalEntry` | user id, title, content, mood tag, sharing permission |
| `ChatConversation` | id, user id, created at, retention status |
| `ChatMessage` | conversation id, role, content, timestamp |
| `SafetyEvent` | message id, category, confidence, signals, action, policy version |
| `Referral` | student id, reason, status, assigned counsellor, timestamps |
| `CounsellorCase` | referral id, access scope, status, review date |
| `InterventionPlan` | case id, goals, structured guidance, version, approval status |
| `AuditLog` | actor id, event type, target id, timestamp, outcome |
| `FollowUp` | case id, counsellor, due date, completion status |

Consider separate relations for journal-sharing grants, counsellor assignments, prompt versions, and tamper-evident audit events. Keep journal content, chat messages, and clinical case notes logically separated.

## 13. Safety, Privacy & Safeguarding

- The AI must not diagnose or claim clinical certainty.
- Screen incoming messages and generated responses; define safe fallbacks for screening failures.
- Recognize potential urgent concerns and offer appropriate human support and locally relevant emergency options.
- Automated scores inform review but do not independently determine diagnosis or consequential outcomes.
- Clearly explain what information may be shared, with whom, and under what safeguarding circumstances.
- Restrict counsellor access to assigned or explicitly authorized cases.
- Encrypt data in transit and at rest; apply access logging, retention limits, and appropriate key management.
- Provide clear account deletion and data-retention processes.
- Do not claim continuous monitoring unless it is genuinely staffed and operational.
- Obtain qualified review of applicable child-safety, privacy, data-protection, and counselling requirements before real-user deployment.

## 14. Visual Design Requirements

- Use a dark charcoal theme with subtle borders, cool grey text, and muted sage accents.
- Use a three-column desktop Companion layout: navigation, conversation, and safety panel.
- Make navigation collapsible and layouts responsive on mobile.
- Use restrained animations and smooth streaming text.
- Reserve coral/orange for urgent help actions rather than routine status indicators.
- Make charts accessible, readable, and clearly labelled.
- Provide loading, empty, error, and offline states for all major modules.
- Keep the safety panel accessible on mobile without compromising chat usability.

## 15. Implementation Roadmap

| Phase | Deliverables |
|---|---|
| 1. Foundation | UI, authentication, student dashboard, Companion shell, check-ins, journal, database schema. |
| 2. AI safety | LLM integration, streaming, input screening, output checks, safety verdicts, event logs, failure handling. |
| 3. Analytics | Mood charts, filters, history, weekly summaries, privacy controls. |
| 4. Human support | Counsellor verification, referrals, assigned-case access, intervention plans, approvals, follow-ups, audit review. |
| 5. Validation | Safety evaluation, authorization tests, model failure tests, crisis handling, deletion tests, privacy review. |

## 16. Acceptance Criteria

- Students can register, complete check-ins, and view historical wellbeing data.
- Journal entries can be created, edited, deleted, and kept private.
- AI responses pass through the configured safety pipeline before delivery.
- Each delivered response has a retrievable safety record with classification, rationale, policy version, and action.
- Failed or unavailable safety assessment is clearly distinguished from successful review.
- The help action is accessible and offers appropriate support options.
- Referrals can be assigned, reviewed, and tracked by authorized counsellors.
- Counsellors can create, approve, and publish versioned support-plan configurations.
- Audit history reflects the configuration that actually governed a response.
- Unassigned counsellors cannot access restricted case data through direct API requests or URL manipulation.
- Sharing permissions, account deletion, and retention rules are enforced on the backend.
- Testing covers false positives, false negatives, ambiguous messages, adversarial prompts, and service outages.

## 17. Success Metrics

| Area | Metric |
|---|---|
| Adoption | Student activation and voluntary check-in completion |
| Usability | Task completion rate and user-reported ease of use |
| Reliability | Successful chat delivery and safety-service availability |
| Safety | Performance on a professionally reviewed evaluation set |
| Explainability | Share of responses with complete, valid audit records |
| Referral workflow | Time to acknowledge referrals and completion of scheduled reviews |
| Privacy | Unauthorized-access test results and deletion-request completion |
| Support quality | Counsellor feedback and appropriately reviewed case outcomes |

Do not optimize for longer conversations, increased sensitive disclosure, or higher automated risk scores. Set baselines and review metrics with qualified professionals.

## 18. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Incorrect safety classification | Layered screening, conservative fallbacks, evaluation, uncertainty display, human review. |
| Generic or inappropriate AI response | Response validation, approved guidance, safety policy, testing and feedback. |
| Unauthorized sensitive-data access | Server-side authorization, least privilege, audit logs, security testing. |
| Over-reliance on AI scores | Avoid diagnostic claims; require human review for consequential actions. |
| Prompt injection or unsafe plan changes | Structured plan fields, validation, approval, immutable core safety rules. |
| Privacy or safeguarding failure | Consent design, data minimization, retention controls, qualified legal and clinical review. |

## 19. Final Product Definition

MindCareAI is an integrated wellbeing platform rather than just a mental health chatbot. Students receive a calm space for reflection; dashboards make self-reported trends understandable; the safety panel exposes recorded decisions; and the counsellor portal connects authorized referrals to documented, reviewed intervention plans. The product should be prototyped first and progressively validated before real-world deployment.

## 20. Glossary

| Term | Meaning |
|---|---|
| Safety event | A structured record of a screening result, policy decision, and action. |
| Referral | A request for authorized human review or support. |
| Intervention plan | A counsellor-reviewed set of structured guidance and follow-up instructions. |
| Policy version | The specific safety rules/configuration used for a decision. |
| P0 / P1 / P2 | Initial release / next phase / later enhancement priorities. |
