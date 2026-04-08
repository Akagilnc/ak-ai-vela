# Project Context

## Project name
Vela

## One-line summary
AI college planning tool for Chinese families targeting US pre-vet/animal science university programs.

## Goal
Replace expensive study-abroad agencies with a data-driven decision support system. Help parents understand admissions gaps and get actionable recommendations, not just information dumps.

## Target users
Mainland Chinese parents planning their child's path to top 30 US universities. Seed user: a mom whose child wants to pursue veterinary medicine (pre-vet track).

## Core scope
- School database with CDS admissions data and international student fields
- Parent questionnaire (8 sections, static for MVP)
- Gap analysis engine (rule-driven, deterministic)
- Interactive assessment report with actionable recommendations
- School browse/filter/compare UI with radar charts
- Bilingual glossary tooltips (~20-30 US admissions terms)
- Screenshot export for WeChat sharing (html2canvas)

## Out of scope
- Cloud deployment (local-only until 100+ users)
- User auth/registration (single-user local tool)
- Payment/monetization
- Dynamic AI-generated questionnaire (Phase 2)
- Case database / Reddit pipeline (Phase 2)
- Activity scoring system (Phase 2)
- "What If" simulator (deferred to P2)

## Key constraints
- Local deployment on founder's machine only
- LLM is backend-only tool for founder to polish report content, never user-facing
- MVP targets 10-15 schools, not 50
- Chinese-first interface
- Must work offline after initial setup

## Tech assumptions
- Next.js 16 + TypeScript + Tailwind CSS 4 (App Router)
- Prisma 7 + SQLite (better-sqlite3 adapter)
- Custom SVG radar charts (5-axis school profile visualization)
- html2canvas for report screenshot export (planned for M4)
- No API keys, no external services for MVP

## External services
- Google Fonts CDN (Fraunces, Plus Jakarta Sans)
- None for core functionality

## Deployment assumptions
Local: `npm run dev` or `npm start` on founder's MacBook.

## Risks
- html2canvas + Google Fonts + SVG charts may produce rendering artifacts (spike planned for M4-POST)
- Chinese school GPA normalization to US 4.0 scale is approximate
- Seed data accuracy depends on manual CDS extraction by founder

## Open questions
- K-6 vs G7-G10 target age range (needs seed user validation)
- School list expansion beyond current 12 (needs co-designer input)
- Questionnaire wording for Chinese parents (needs co-designer conversation)
- Gap scoring model details for pre-vet track (define during M3)
