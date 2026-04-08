# Changelog

All notable changes to this project will be documented in this file.

## [0.1.2.0] - 2026-04-08

### Added
- School browse page with 3-column card grid, filtering by state, sorting by ranking/name/acceptance rate/cost, and Pre-Vet toggle
- School detail page with admissions, financial, international, and Pre-Vet sections in a 2:1 responsive layout
- Five-axis radar chart showing acceptance friendliness, international friendliness, SAT competitiveness, cost affordability, and scholarship strength
- 12 pre-vet-relevant schools seeded with full admissions, financial, and program data
- SAT/ACT score ranges (25th-75th percentile) and average GPA fields for all schools
- Chinese-first UI across all pages: navigation, labels, filter controls, empty states, metadata
- Radar chart mobile optimization (shown first on small screens, sticky sidebar on desktop)
- Accessibility: prefers-reduced-motion support, SVG role=img, Chinese aria-labels
- 19 new tests: radar chart geometry (6), seed data integrity (7), school filtering/sorting (6)

### Fixed
- Ranking display uses null check instead of falsy check (rank 0 no longer hidden)
- Cost formatting uses explicit en-US locale (prevents SSR/client hydration mismatch)
- Filter changes use router.replace instead of router.push (no browser history pollution)

## [0.1.1.0] - 2026-04-08

### Changed
- Database backup now uses SQLite VACUUM INTO for consistent snapshots (safe during writes)
- All database paths (prisma client, seed script, backup utility) now read DATABASE_URL with fallback
- Removed hard grade/birthYear constraints from questionnaire schema (no longer enforces range)
- Seed script split into safe upsert mode (db:seed) and destructive reset mode (db:reset --reset)

### Fixed
- .env.example pointed to wrong database path (./dev.db → ./prisma/dev.db)
- Backup tests now properly isolate DATABASE_URL environment variable
- Backup tests verify data integrity using real SQLite databases instead of fake files

### Added
- 3 new Zod schema edge-case tests (activities, animalExperience, budgetRange) — 14 tests total
- TODOS.md for tracking deferred work items (next/link, Prisma Json type, schema range fields, Google Fonts loading)

## [0.1.0.0] - 2026-04-08

### Added
- Next.js + TypeScript + Tailwind CSS project scaffold with App Router
- Prisma + SQLite database with School, Student, and QuestionnaireResult models
- Design system (DESIGN.md) with Organic/Natural aesthetic: forest green, warm gold, cream palette
- Fraunces serif + Plus Jakarta Sans + Geist Mono typography stack
- Tailwind design tokens integrated via CSS custom properties with dark mode support
- Prisma Client singleton pattern with better-sqlite3 adapter (hot-reload safe)
- SQLite backup utility with automatic cleanup (keeps latest 5)
- Zod schema for 8-section parent questionnaire with validation
- GapResult type for gap analysis engine
- Seed script with 3 pre-vet schools (Cornell, UC Davis, Colorado State)
- Vitest test framework with 14 passing tests (schema validation + backup utility)
- Homepage placeholder with design system styling
