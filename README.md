# Vela

AI-powered growth guidance for Chinese families planning their child's path to US universities.

Three tools:
- **Path Explorer** (v0.2) — month-at-a-glance activity cards that show parents what a G1–G3 child's path actually looks like. May = 小小动物科学家 (5 cards). June = 雨季观察家 (4 cards). Multi-month nav via `/path?month=N` with current-month default and nearest-upcoming fallback. `/path`.
- **Trait assessment quiz** — 10-question branching assessment that builds a personality portrait + staged roadmap (G1–G9). `/trait-quiz`.
- **Gap analysis engine** — for high schoolers targeting specific universities. `/questionnaire`.

Built for a seed user (Kailing) with a child interested in pre-vet/animal science, living in Shanghai with US citizenship.

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
| `npm test` | Run all tests (577 tests, 30 files) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run db:push` | Push Prisma schema to SQLite |
| `npm run db:seed` | Upsert school data (safe with existing student data) |
| `npm run db:reset` | Full wipe + reseed (destructive, requires `--reset` flag) |
| `npm run lint` | ESLint |

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    path/                 # Path Explorer (v0.2)
      [activitySlug]/     # Detail page per activity card
        loading.tsx       # Skeleton for route transitions
      layout.tsx          # Loads vela.css + skip-to-content links
      page.tsx            # Overview: month-aware (?month=N) tile list, theme map per month
      not-found.tsx       # Chinese brand-styled 404
      error.tsx           # Chinese brand-styled error boundary
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
    api/
      path/interest/      # POST endpoint for CTA form (create-then-update on conflict)
    page.tsx              # Homepage (dual entry: trait quiz + questionnaire)
  components/
    path/                 # Path Explorer UI components (10 files)
      path-activity-tile.tsx    # Overview tile (preview images + chips)
      path-activity-detail.tsx  # Detail page chrome + <main id="detail-body">
      block-renderer.tsx        # 17 block types (paragraph, triad, route, trivia, etc.)
      share-button.tsx          # Web Share API + WeChat clipboard fallback (+ iOS execCommand)
      path-detail-nav.tsx       # Keyboard (←/→/Esc) + touch swipe nav, multi-touch guard
      path-sub-nav.tsx          # Sticky scroll-spy with cached section refs
      path-lightbox.tsx         # Species-photo lightbox with focus trap + safe-area-top
      path-interest-form.tsx    # CTA form with client-side email regex
      path-overview-scroll-restore.tsx  # Restores #path-main scrollTop on back-nav from a tile-opened card
      path-icons.tsx            # Inline SVG icons
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
    path/                 # Path Explorer library (@/lib/path)
      canonical-source.ts # sourcePath canonicalizer — NFKC + Default_Ignorable strip + dot-segment resolve + percent decode (15 rounds of Unicode smuggling hardening)
      month-routing.ts    # resolveMonth() — current → nearest upcoming → max past, validateMonthParam() for ?month=N
      parse.ts            # Runtime Prisma Json shape guards (parseChips, parseSections)
      types.ts            # Block/section type discriminated unions
      __tests__/          # Regression tests: canonical-source smuggling vectors + month-routing fallback ladder
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
  __tests__/              # Top-level Vitest tests (questionnaire, backup, schema, path seed shape, path seed integration, copy quality)
prisma/
  schema.prisma           # Path (6 models) + School + Student + QuestionnaireResult
  seed.ts                 # Seed: 26 schools + G1 month seeds merged by goal+activity slug (May 5 + June 4 = 9 activities, single-stage guard)
public/assets/
  img/                    # 31 species + location photos (Wikipedia Commons, CC-licensed) — covers May (24) + June (7 new: snail, earthworm, frog, mugwort, sweet_flag, zongzi, firefly)
  vela.css                # Brand styles for /path scope (loaded via path/layout.tsx)
docs/
  current-state.md        # Long-term project status (MVP semantics, blockers, next steps)
  process.md              # Git workflow and project management rules
  project-context.md      # Project scope and constraints
  research/               # Path Explorer content drafts + source manifest
    data/g1-may-seed.ts   # Single source of truth for May card content (5 cards, 小小动物科学家)
    data/g1-jun-seed.ts   # Single source of truth for June card content (4 cards, 雨季观察家)
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
- `docs/research/` — Internal research artifacts (e.g., Path Explorer v0.1 source manifest)

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
| Path Explorer v0.1 (G1 May activity cards) | Done (v0.6.0.0) |
| Path Explorer v0.2 (multi-month routing + G1 June seed) | Done (v0.7.0.0) |
| Path Explorer v0.3+ (additional months, second stage G4–G6) | Planned (after Kailing feedback) |
| Trait Assessment v0.6 (scientific framework) | Planned — issue #24 |
| Trait Assessment Phase 2 (persistence) | Planned (after seed user feedback) |
| M4: Interactive report | Planned |
| M6: Browse enhancements (radar, glossary) | Planned |
| M7: Export (html2canvas + WeChat share) | Planned |

## Local deployment

This is a single-user tool running on the founder's machine. No cloud deployment, no auth, no API keys until 100+ real users.
