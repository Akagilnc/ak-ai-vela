# Vela

AI college planning tool for Chinese families targeting US university admissions.

Replaces expensive study-abroad agencies with data-driven gap analysis and actionable recommendations. Built for a seed user pursuing pre-vet/animal science programs at top 30 US universities.

## Stack

- **Next.js 16** + TypeScript + Tailwind CSS 4 (App Router)
- **Prisma 7** + SQLite (better-sqlite3 adapter)
- **Recharts** for radar charts and visualizations
- **Zod** for questionnaire schema validation
- **Vitest** for testing

## Getting Started

```bash
npm install
npm run db:push        # Create database tables
npm run db:seed        # Seed 3 pre-vet schools (Cornell, UC Davis, Colorado State)
npm run dev            # Start dev server at http://localhost:3000
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm test` | Run all tests (14 tests) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run db:push` | Push Prisma schema to SQLite |
| `npm run db:seed` | Upsert school data (safe with existing student data) |
| `npm run db:reset` | Full wipe + reseed (destructive, requires `--reset` flag) |
| `npm run lint` | ESLint |

## Project Structure

```
src/
  app/           # Next.js App Router pages
  lib/
    prisma.ts    # Prisma client singleton (hot-reload safe)
    backup.ts    # SQLite backup via VACUUM INTO
    types.ts     # Zod questionnaire schema + GapResult type
  __tests__/     # Vitest tests
prisma/
  schema.prisma  # School, Student, QuestionnaireResult models
  seed.ts        # Seed script with 3 pre-vet schools
docs/
  designs/       # CEO plan and MVP design
  process.md     # Git workflow and project management rules
```

## Design System

Defined in `DESIGN.md`. Organic/Natural aesthetic with forest green, warm gold, and cream palette. Fonts: Fraunces (display), Plus Jakarta Sans (body), Geist Mono (data).

## Documentation

- `CLAUDE.md` — Shared execution rules for AI agents
- `AGENTS.md` — Codex-specific behavior rules
- `DESIGN.md` — Visual design system
- `TODOS.md` — Deferred work items by milestone
- `CHANGELOG.md` — Version history
- `docs/process.md` — Git workflow, PR review, and project management
- `docs/designs/vela-mvp.md` — CEO plan with scope decisions and milestones
- `docs/project-context.md` — Project scope and constraints

## Milestones

| Milestone | Status |
|-----------|--------|
| M0: Project setup | Done (v0.1.1.0) |
| M1: Data layer (school browse/filter UI) | Next |
| M2: Input layer (questionnaire form) | Planned |
| M3: Gap analysis engine | Planned |
| M4: Interactive report | Planned |
| M6: Browse enhancements (radar, glossary) | Planned |
| M7: Export (html2canvas) | Planned |

## Local deployment

This is a single-user tool running on the founder's machine. No cloud deployment, no auth, no API keys until 100+ real users.
