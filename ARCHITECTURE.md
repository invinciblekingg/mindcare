# MindCareAI Architecture

This document briefly outlines the folder structure and core modules of the MindCareAI backend.

## Directory Structure

- **`app/api`**: Contains all Next.js 15 App Router API endpoints. This is the entry point for frontend interactions, handling HTTP requests, and applying authentication middleware.
- **`lib/safety`**: Houses the multi-layered safety pipeline. It includes lexical filtering, cross-turn context analysis, crisis intent detection, and output validation to ensure user well-being.
- **`lib/llm`**: Contains the provider-agnostic LLM interface. It currently integrates with Gemini via an OpenAI-compatible endpoint, supporting SSE streaming and safe generation.
- **`lib/audit`**: Manages the tamper-evident SHA-256 audit logs. This module hashes critical events and chains them to prevent undetectable modifications, ensuring clinical compliance.
- **`prisma`**: Contains the database schema (`schema.prisma`), migrations, and seed scripts. It defines 14 core models, including Users, Journals, JournalsShareGrants, and AuditLogs, with strict immutable constraints.
