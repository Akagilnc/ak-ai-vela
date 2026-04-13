# Vela

AI-powered growth guidance for Chinese families planning their child's path to US universities.

Two tools: a **trait assessment quiz** that builds a personality portrait and staged roadmap (G1-G9), and a **gap analysis engine** for high schoolers targeting specific universities. Built for a seed user with a child interested in pre-vet/animal science.

## Stack

- **Next.js 16** + TypeScript + Tailwind CSS 4 (App Router)
- **Prisma 7** + SQLite (better-sqlite3 adapter)
- **Recharts** for visualizations (radar charts use custom SVG)
- **Zod** for questionnaire schema validation
- **Vitest** for testing

## Getting Started

```bash
npm install
npm run db:push        # Create database tables
npm run db:seed        # Seed 26 pre-vet-relevant schools
npm run dev            # Start dev server at http://localhost:3000
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm test` | Run all tests (332 tests) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run db:push` | Push Prisma schema to SQLite |
| `npm run db:seed` | Upsert school data (safe with existing student data) |
| `npm run db:reset` | Full wipe + reseed (destructive, requires `--reset` flag) |
| `npm run lint` | ESLint |

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    trait-quiz/           # 10-question trait assessment (v0.5.0.0)
      result/[routeId]/   # Result page with portrait + roadmap
    schools/              # School browse + detail pages
      [id]/               # Detail page with radar chart
    questionnaire/        # 8-step questionnaire wizard
      step/[step]/        # Dynamic step pages (1-8)
      review/             # Review page with profile card
      complete/           # Submission success page
        gaps/             # Gap analysis page (tier cards, severity pills)
      actions.ts          # Server action (Zod → Prisma)
    page.tsx              # Homepage (dual entry: trait quiz + questionnaire)
  components/
    trait-quiz/           # Trait assessment UI components
      trait-quiz-provider.tsx  # Context + Reducer + localStorage draft
      trait-step.tsx           # Question card with auto-advance
      trait-progress.tsx       # Gold progress bar
      trait-insight.tsx        # Mid-quiz personalized feedback card
    questionnaire/        # Questionnaire UI components
      steps/              # Per-step form components (1-8)
      questionnaire-provider.tsx  # State + localStorage draft persistence
      progress-stepper.tsx        # Responsive progress indicator
      form-field.tsx              # Shared field with a11y label association
  lib/
    prisma.ts             # Prisma client singleton (hot-reload safe)
    backup.ts             # SQLite backup via VACUUM INTO
    types.ts              # Zod questionnaire schema + GapResult type
    traits/               # Trait assessment engine (pure functions, @/lib/traits)
      types.ts            # Zod schemas for 10 trait dimensions
      questions.ts        # 19 question defs with declarative branching
      routes.ts           # 24 predefined growth routes with fact-check annotations
      match.ts            # matchRoute() — answers → route ID
      portraits.ts        # 12 personality portrait titles + descriptions
      insights.ts         # 12 mid-quiz insight strings
      __tests__/          # Trait engine tests (49 tests)
    gap/                  # M3 Gap Analysis Engine (pure functions, @/lib/gap)
      dimensions/         # 4 v1 dimensions (gpa, sat, act, prevet-experience)
      classify.ts         # Tier classification (match/reach/possible)
      __tests__/          # Gap engine tests (~170 tests)
      engine.ts           # analyzeStudentVsSchool / analyzeStudentVsAllSchools
      normalize.ts        # Chinese GPA → US 4.0 normalization
      recommendations.ts  # Hardcoded action templates (4 dims × 5 severities)
  __tests__/              # Top-level Vitest tests (questionnaire, backup, schema)
prisma/
  schema.prisma           # School, Student, QuestionnaireResult models
  seed.ts                 # Seed script with 26 pre-vet-relevant schools
docs/
  current-state.md        # Long-term project status (MVP semantics, blockers, next steps)
  process.md              # Git workflow and project management rules
  project-context.md      # Project scope and constraints
```

## Design System

Defined in `DESIGN.md`. Organic/Natural aesthetic with forest green, warm gold, and cream palette. Fonts: Fraunces (display), Plus Jakarta Sans (body), Geist Mono (data).

## Documentation

- `CLAUDE.md` — Shared execution rules for AI agents
- `AGENTS.md` — Codex-specific behavior rules
- `DESIGN.md` — Visual design system
- `TODOS.md` — Deferred work items by milestone
- `CHANGELOG.md` — Version history
- `docs/current-state.md` — Long-term project status, active work, blockers, next steps
- `docs/process.md` — Git workflow, PR review, and project management
- `docs/designs/vela-mvp.md` — CEO plan with scope decisions and milestones
- `docs/project-context.md` — Project scope and constraints

## Milestones

| Milestone | Status |
|-----------|--------|
| M0: Project setup | Done (v0.1.1.0) |
| M1: Data layer (school browse/filter UI) | Done (v0.1.2.0) |
| M2: Input layer (questionnaire form) | Done (v0.2.0.0) |
| M3: Gap analysis engine | Done (v0.3.0.0) |
| M3.5: Gap engine polish (#9) | Done (v0.3.1.0) |
| M3 Gap page | Done (v0.4.0.0) |
| Trait Assessment Phase 1 (pure frontend) | Done (v0.5.0.0) |
| Trait Assessment Phase 2 (persistence) | Planned (after seed user feedback) |
| M4: Interactive report | Planned |
| M6: Browse enhancements (radar, glossary) | Planned |
| M7: Export (html2canvas + WeChat share) | Planned |

## Local deployment

This is a single-user tool running on the founder's machine. No cloud deployment, no auth, no API keys until 100+ real users.
