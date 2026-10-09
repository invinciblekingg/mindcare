# MindCareAI - Explainable Mental Wellness & Counsellor Support Platform

## Project Title & Vision
**MindCareAI** is an explainable mental wellness and counsellor support platform. It provides a multi-layered safety pipeline to intercept crisis situations, an immutable audit log for clinical transparency, and a privacy-first approach to journaling and sharing.

## Architecture Overview
- **Framework**: Next.js 15 App Router
- **Database**: PostgreSQL (managed via Docker)
- **ORM**: Prisma
- **Authentication**: Auth.js v5
- **Validation**: Zod
- **LLM Integration**: Gemini (via OpenAI-compatible endpoint)

## Core Features
- **Multi-layered Safety Pipeline**: Features real-time crisis interception, lexical filtering, cross-turn context analysis, and strict output validation.
- **Tamper-evident SHA-256 Audit Logs**: Ensures all clinical decisions and LLM generations are recorded immutably for compliance and transparency.
- **Strict RBAC & Journal Privacy**: Granular role-based access control and patient-driven journal share grants.
- **Provider-agnostic LLM Layer**: Designed to easily swap models, currently live with Gemini.

## Prerequisites
- Node.js 20+
- Docker (for PostgreSQL)

## Setup Instructions
1. `npm install`
2. `cp .env.example .env` (and fill in your Gemini API key)
3. `npm run db:up`
4. `npm run db:migrate`
5. `npm run db:seed`
6. `npm run dev`

## Testing
To verify the system's integrity, run:
- `npx tsx scripts/e2e-verify.ts`
- `npx tsx scripts/test-gemini-live.ts`

## Security & Privacy
- **Immutable Audit Logs**: Every critical action is hashed and chained.
- **Journal Share Grants**: Users explicitly consent to sharing entries with specific providers.
- **Safety Guardrails**: LLM outputs and user inputs are aggressively filtered for crisis intents and harmful content.
