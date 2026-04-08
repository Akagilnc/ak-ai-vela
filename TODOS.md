# TODOS

Deferred work items tracked by engineering and CEO reviews.

## P1 — Must do before or during the relevant milestone

### [M4-POST] html2canvas spike
- **What:** Test html2canvas screenshot with Google Fonts (Fraunces, Plus Jakarta Sans) + Recharts SVG charts on the actual report page.
- **Why:** WeChat sharing is the MVP's core distribution channel. html2canvas + CDN fonts + SVG is the combo most likely to produce rendering artifacts. CEO review flagged html2canvas silent failure as a gap. Codex independently flagged the same risk.
- **When:** Immediately after M4 (interactive report) is complete.
- **Fallback:** If html2canvas fails, evaluate: browser print CSS, Puppeteer server-side screenshot, or manual screenshot instruction.
- **Depends on:** M4 (report UI must exist to test against)

### ~~[M1] Add target range fields to School schema~~ DONE
- **Status:** Completed in v0.1.2.0. SAT 25th/75th, ACT 25th/75th, avgGPA added to schema and seeded for all 12 schools.
- **Completed:** v0.1.2.0 (2026-04-08)

### ~~[M1] Use `next/link` for internal navigation~~ DONE
- **Status:** Completed in v0.1.2.0. All internal navigation uses Next.js `<Link>` component.
- **Completed:** v0.1.2.0 (2026-04-08)

### ~~[M1] Switch Google Fonts from CSS @import to `<link>` tag~~ DONE
- **Status:** Completed in v0.1.2.0. Root layout uses `<link>` tags with preconnect for Google Fonts.
- **Completed:** v0.1.2.0 (2026-04-08)

### ~~[M1] Use Prisma `Json` type for JSON string fields~~ DONE
- **Status:** Completed in v0.2.0.0. `QuestionnaireResult.answers` uses `Json` type. Prisma 7.7.0 + SQLite confirmed working.
- **Completed:** v0.2.0.0 (2026-04-09)

### [P2] Add error/loading/not-found pages for school routes
- **What:** Create `src/app/schools/error.tsx`, `src/app/schools/loading.tsx`, `src/app/schools/not-found.tsx`, `src/app/schools/[id]/error.tsx`, `src/app/schools/[id]/not-found.tsx`.
- **Why:** Design review identified missing technical state pages. Currently uses default Next.js error/404 pages which break brand continuity. Plan specifies warm Chinese-language empty states and branded error messages.
- **When:** P2, next PR or when building M2 pages.
- **Depends on:** None (can be done anytime)

## P2 — Do when the prerequisite is met

### [M2] ~~Seed script safety: split db:seed and db:reset~~ DONE
- **Status:** Completed in feat/m0-scaffold (commit a8531c2).
- **What was done:** `db:seed` now upserts schools only, `db:reset` does full wipe + reseed via `--reset` flag.

### [P2] Create docs/current-state.md
- **What:** Create and maintain `docs/current-state.md` as long-term project status document per CLAUDE.md rules.
- **Why:** Codex outside voice flagged it missing. Helps cross-session context recovery.
- **When:** After M2 ships.

### [P2] Wrap student upsert + questionnaire result in Prisma transaction
- **What:** Use `prisma.$transaction()` to make student create/update and QuestionnaireResult.create atomic.
- **Why:** Adversarial review (Claude + Codex) found non-atomic writes: if student create succeeds but QuestionnaireResult.create fails, student record is orphaned.
- **When:** Before multi-user deployment. Acceptable for MVP single-user.

## Deferred from CEO Review

- "What If" simulator — P2, wait for seed user feedback to confirm demand (~50 min when gap engine exists)
- WeChat QR code sharing — blocked by local-only deployment
- Calendar export (.ics) — blocked by incomplete deadline data
- Define failure exit criteria — do before seed user conversation

## Deferred from M2 Design Review

### [P2] Progressive student profile anchor during questionnaire fill
- **What:** Add a persistent visual element in the questionnaire layout that progressively reveals student info as steps complete (e.g., a mini dossier header or summary strip).
- **Why:** Codex design review found that the "design highlight" is deferred to the review page, leaving the 8 form steps feeling like a generic form. A persistent anchor builds trust and differentiation during fill, not just after.
- **When:** P2, after M2 ships and seed user feedback confirms the form feels too generic.
- **Depends on:** M2 complete

## Deferred from M2 CEO Review

- Smart target school suggestions (needs M3 gap engine)
- Real-time profile card sidebar (P2 enhancement)
- Voice/dictation input for biggestConcern (P2)
- AI-powered field auto-fill from uploaded transcript (Phase 2)
- Multi-tab draft sync via BroadcastChannel (single-user, overkill for MVP)
