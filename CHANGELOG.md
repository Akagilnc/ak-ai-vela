# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0.0] - 2026-04-09

### Added
- 8-step questionnaire wizard with per-step validation and conditional fields
- Welcome page with draft resume: detects saved progress, shows "继续填写" or "重新开始"
- Review page with full student profile card, Chinese labels, and edit links per section
- Submission success page personalized with child's name
- localStorage draft persistence with debounced auto-save (300ms), 7-day expiry, and schema version guard
- Draft restore on provider mount (data survives page reload and browser restart)
- Progress stepper with 3 responsive breakpoints: desktop (circles+lines+labels), tablet (compact circles), mobile (progress bar+text)
- Server action for questionnaire submission with Zod validation, data canonicalization, and Prisma upsert
- Conditional field logic: international schools show IB/AP curriculum fields, public/private show GPA/rank
- Chinese-first UI: all labels, validation errors, option values, hints, and placeholders in Chinese
- Bilingual major options: "兽医预科 (Pre-Vet)", "动物科学 (Animal Science)", "生物学 (Biology)"
- Glossary tooltips on technical terms (GPA, SAT, Grade Level) with mobile-friendly tap behavior
- Auto-save timestamp indicator showing last save time
- 58 new tests: server action (7), draft persistence (9), schema validation expansion (23), component/logic tests (19)

### Fixed
- Strict mode double-initialization of activity/experience arrays (useRef guard pattern)
- Empty array entries no longer block Zod validation (canonicalizeAnswers filters blank entries)
- Experience type labels display in Chinese on review page (was showing raw enum values)
- "IB Diploma" label changed to "IB 文凭" on review page
- Fresh start now clears both localStorage and provider memory state (prevents stale data leakage)
- Stored questionnaire answers now use Zod-validated data instead of raw input (prevents extra field injection)
- GPA falsy check: `gpaPercentage != null` preserves valid 0 values in server action and review page
- childName schema now trims whitespace (prevents duplicate student records from spaces)
- canonicalizeAnswers cleans stale targetMajorOther when targetMajor is not "other"
- currentGrade select uses nullish coalescing (grade 0 = kindergarten no longer clears selection)
- saveDraft returns boolean; auto-save indicator only shows when write succeeds
- Invalid/corrupt savedAt timestamps in draft no longer bypass 7-day expiry check
- Step navigation now persists to localStorage (SET_STEP marks dirty)
- formatValue uses explicit label maps to prevent activity/experience type label collision
- FormField label-input association via useId + htmlFor for screen reader accessibility
- useRef type corrected from HTMLDivElement to HTMLSpanElement in field-hint
- Removed unused STEP_META import from review page
- @testing-library/react added for component-level tests

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
