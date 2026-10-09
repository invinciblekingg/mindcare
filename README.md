# MindCareAI — Frontend Architecture & Developer Guide

MindCareAI is an explainable adolescent mental wellness platform and counsellor portal built with Next.js (App Router), React, TypeScript, Tailwind CSS, Recharts, and lucide-react.

---

## 1. Visual Direction & Design Tokens

- **Theme Palette:**
  - Dark Charcoal Base: Background (`#14171A`), Surface (`#1B1F23`), Elevated Surface (`#22272C`), 1px Subtle Borders (`#2C3238`), Cool Grey Primary Text (`#E6E9EC`), Secondary Text (`#9AA3AB`).
  - Muted Sage Accent: Primary (`#8FAE9B`), Hover (`#A3BFAE`), Subtle Tint Backgrounds at 10–15% opacity (`rgba(143, 174, 155, 0.12)`).
  - Coral / Orange: (`#F2765A`) is **strictly reserved** for urgent help actions (the "I need help now" button, crisis modal, and critical risk flags). It is never used for routine status.
- **Typography & Grid:** Inter UI typeface, 8px spacing grid, 12–16px rounded corners, accessible focus rings, touch targets >= 44px, and `prefers-reduced-motion` compliance.

---

## 2. Directory Structure

```
mindcare-main/
├── app/
│   ├── layout.tsx                # Root layout with AppProvider, Header, Sidebar, DevRoleToolbar
│   ├── globals.css               # Dark charcoal tokens, animations, reduced motion
│   ├── page.tsx                  # Student Dashboard (or Counsellor/Admin quick view)
│   ├── onboarding/page.tsx       # 4-step onboarding (age, parent consent, teen assent, AI disclosure)
│   ├── companion/page.tsx        # 3-column Companion chat with streaming text & Safety Panel
│   ├── check-in/page.tsx         # 5-point Mood check-in, emotion chips, sliders, skip button
│   ├── journal/page.tsx          # Private journal with editor, draft save, share dialog, delete modal
│   ├── analytics/page.tsx        # Recharts 7/30/90-day trend, 90-day heatmap, accessible table view
│   ├── report/page.tsx           # Weekly reflection report (summary, highlights, suggestions)
│   ├── settings/page.tsx         # Sharing controls, consent history & withdrawal, data export & purge
│   ├── counsellor/
│   │   ├── page.tsx              # Overview (counts, referrals awaiting review, upcoming follow-ups)
│   │   ├── cases/
│   │   │   ├── page.tsx          # Assigned-case queue with status/urgency filters & search
│   │   │   └── [caseId]/page.tsx # Case detail (consented mood, journals, notes, & access denied)
│   │   ├── plans/
│   │   │   ├── page.tsx          # Intervention plans index
│   │   │   └── [planId]/page.tsx # Plan editor, status stepper, locked safety card, diff view
│   │   ├── safety-audit/page.tsx # AI Safety audit log (20 sample events), drawer, export
│   │   └── follow-ups/page.tsx   # Scheduled reviews calendar/list & completion checkboxes
│   └── admin/
│       ├── page.tsx              # Admin overview & mandatory privacy partition notice
│       ├── counsellors/page.tsx  # Counsellor verification management
│       ├── retention/page.tsx    # Retention & purge policy settings
│       └── audit/page.tsx        # Cryptographic SHA-256 audit ledger verification
├── components/
│   ├── ui/
│   │   ├── Button.tsx            # Sage, secondary, coral, loading states, >=44px touch targets
│   │   ├── Card.tsx              # Charcoal surface cards with header, title, and description
│   │   ├── Chip.tsx              # Emotion chips, signal severities, filter badges
│   │   ├── Modal.tsx             # Accessible dialog with ESC dismissal, focus trap, and ARIA tags
│   │   ├── BottomSheet.tsx       # Mobile bottom sheet (used for mobile Safety Panel)
│   │   ├── SafetyPanel.tsx       # Explainable AI safety panel (classification, signals, rationale)
│   │   ├── MoodSelector.tsx      # 5-point accessible mood selector with text labels & emojis
│   │   ├── TrendChart.tsx        # Recharts line chart (7/30/90d, prior diff, color-blind safe)
│   │   ├── DataTable.tsx         # Reusable paginated table with search & filter slots
│   │   ├── StatusStepper.tsx     # Status stepper (Draft > Pending > Active > Superseded)
│   │   ├── Skeleton.tsx          # Subtle shimmer skeleton loader
│   │   └── EmptyState.tsx        # Empty and Error states with empathetic copy
│   ├── common/
│   │   ├── Header.tsx            # Global header with brand and always-visible coral help button
│   │   ├── Sidebar.tsx           # Collapsible desktop sidebar & mobile bottom tab bar
│   │   ├── CrisisModal.tsx       # Calm 988 lifeline, text HOME to 741741, counsellor modal
│   │   ├── CrisisModalWrapper.tsx# Client connector for global crisis modal
│   │   ├── DevRoleToolbar.tsx    # Dev switcher (Student / Counsellor / Admin, offline/error test)
│   │   └── SharePermissionDialog.tsx # Explicit consent dialog for sharing journals
│   └── providers/
│       └── AppProvider.tsx       # Global state for active role, student profile, crisis modal
├── lib/
│   └── mock/
│       ├── constants.ts          # Mood definitions, emotions, prompts, emergency contacts
│       ├── safetyEventsData.ts   # 20 realistic safety events (allowed, modified, blocked, referred)
│       ├── checkInsData.ts       # 90 days of realistic adolescent mood check-in data
│       ├── journalsData.ts       # Realistic adolescent journals (private and shared)
│       ├── conversationsData.ts  # Pre-baked conversations with safety records attached
│       ├── counsellorCasesData.ts# Assigned cases, follow-ups, and intervention plans
│       └── mockService.ts        # Typed mock service layer simulating real backend calls
├── types/
│   └── index.ts                  # Strict TypeScript interfaces matching backend models
└── tailwind.config.js            # Custom design tokens, charcoal surfaces, sage, and coral
```

---

## 3. Where to Plug In Real APIs

The frontend is strictly decoupled through `/lib/mock/mockService.ts`. To swap in a live backend:

1. **AI Chat & Streaming:**
   - **Current mock:** `mockService.generateAiResponse()` simulates token-by-token streaming in `app/companion/page.tsx`.
   - **Plugging in real API:** Connect `fetch('/api/chat', { method: 'POST' })` consuming a Server-Sent Events (SSE) readable stream using standard `response.body.getReader()`. The response headers should include `x-mindcare-safety-id` or deliver the safety assessment event payload in the final SSE block.

2. **Daily Check-ins:**
   - **Current mock:** `mockService.saveCheckIn()` and `mockService.getCheckIns()`.
   - **Plugging in real API:** Replace with `GET /api/check-in` and `POST /api/check-in`.

3. **Private Journals:**
   - **Current mock:** `mockService.saveJournal()`, `mockService.deleteJournal()`, and `mockService.getJournals()`.
   - **Plugging in real API:** Replace with `GET /api/journal`, `POST /api/journal`, `PATCH /api/journal/[id]`, and `DELETE /api/journal/[id]`.

4. **Counsellor Cases & Intervention Plans:**
   - **Current mock:** `mockService.getCases()`, `mockService.getCaseById()`, and `mockService.updateInterventionPlan()`.
   - **Plugging in real API:** Replace with `GET /api/counsellor/cases`, `GET /api/counsellor/cases/[id]`, and `PUT /api/counsellor/plans/[id]`.

5. **AI Safety Audit Logs:**
   - **Current mock:** `mockService.getAuditLogs()`.
   - **Plugging in real API:** Replace with `GET /api/counsellor/safety-audit?page=1&limit=50`.

---

## 4. How to Test All Roles & Demo Scenarios

In the bottom-right corner of the application is the **Dev Role Switcher**:
- **Student Persona (Maya Lin):** Tests onboarding, dashboard, 3-column companion chat with token streaming, 5-point check-in, private journals, Recharts analytics, weekly reports, and privacy settings.
- **Counsellor Persona (Ms. Sarah Henderson):** Tests clinical overview, assigned-case queue, case detail with consented journal excerpts only, intervention plan editor with status stepper & version diff, and the AI Safety Audit trail.
- **Access-Denied Scenario:** Click "Test Unassigned Access Denied Page" in the Case Queue or navigate to `/counsellor/cases/case_unassigned_999` to see the FERPA least-privilege blocked screen.
- **Admin Persona:** Tests District IT compliance overview, counsellor licensure verification, 90-day retention rules, and SHA-256 audit ledger integrity.
- **Simulate Offline / Error:** Click the toolbar's "Offline" or "Error Sim" toggles to preview kind, reassuring fallback states.
- **Crisis Lifelines:** Tap the coral "I need help now" button anywhere in the application to inspect the calm 988 lifeline modal.
