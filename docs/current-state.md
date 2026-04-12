# Current State

Long-term project status document. Keeps only the current truth, not the history
of how we got here. For past context, read CHANGELOG, PR descriptions, and
retrospectives under `docs/retrospectives/` (when they exist).

**Last updated:** 2026-04-12 · `main` @ `e197d98` (v0.3.2.0 pending merge of PR #17)

## MVP Semantics

Vela is an AI college planning assistant with a **pre-vet specialization** as
the seed vertical (biology / animal science students targeting veterinary
programs). The week-1 MVP flow is:

1. Parent opens the welcome page and starts a questionnaire for their child.
2. 8-step wizard captures the student's profile (scores, curriculum, target
   region, biggestConcern, etc.) with per-step validation, conditional fields
   (IB/AP/A-Level vs GPA+rank), and localStorage draft persistence.
3. Submission upserts a `Student` row and writes a `QuestionnaireResult` via a
   Zod-validated server action.
4. The complete page shows a confirmation. The gap-analysis UI
   (`/complete/gaps`) is **not yet wired** — gap engine lives as a lib.
5. The interactive report (M4) does not exist yet.

The system speaks Chinese by default (labels, validation errors, hints,
recommendation templates).

## Architecture snapshot

- **Framework:** Next.js 15 (App Router), React 19, TypeScript strict.
- **Database:** Prisma 7.7.0 on SQLite (`dev.db`, empty today — 0 students, 0
  questionnaire_results).
- **Gap engine:** `src/lib/gap/` — deterministic pure-function library, 4 v1
  dimensions (GPA, SAT, ACT, pre-vet experience), 16 hardcoded recommendation
  templates, dimension registry pattern. Lib-only — no UI consumers yet.
- **Tests:** 252 passing via Vitest (as of v0.3.2.0). Coverage invariant fences
  the recommendation template matrix.
- **Design system:** Tokens + rules in `DESIGN.md`. Fonts: Fraunces (display),
  Plus Jakarta Sans (body). Loaded via `<link>` with preconnect.

## Active branch / PR / review state

- **Current branch:** `main` (working tree clean before this doc landed).
- **HEAD:** `e197d98 docs: add long-term project status document (#16)`
- **Version:** `0.3.2.0`
- **Open PRs:** #17 `feat/db-schema-attribution` (data provenance + AAVMC classification).
- **In-flight feature branches:** `feat/db-schema-attribution` (this PR).
- **Planned but paused:** thin feedback layer v2.1 — 487-line design doc exists
  at `~/.gstack/projects/Akagilnc-ak-ai-vela/akagilnc-main-design-pause-await-audience-signal-*.md`
  (status: APPROVED + ROUTING COMPLETE). **Deliberately not implementing.**
  Waiting for seed user (Kailing, Shanghai) to return a real signal before
  building any feedback-layer UI.

## Most recent real verification

**2026-04-11 late night (Tokyo)** — dry run tunnel + dev server session.
- Quick tunnel via cloudflared `--protocol http2` (QUIC blocked on current
  network).
- Caught a real bug: `.env.local` had `DEV_TUNNEL_ORIGIN=https://abc.trycloudflare.com`
  with scheme, which Next.js `allowedDevOrigins` treats as invalid → page
  half-hydrates on iOS Safari → buttons don't respond. Fix: hostname-only
  (no scheme). Ground truth is in `.env.example`. `curl` does not reproduce;
  must be verified in a real browser.
- `pnpm test` green: 248 / 248.
- Main is unchanged since PR #15 merge.

## Blockers and risks

**Product-level (seed user):**
- Kailing is the only seed user and is currently **standby**. She is on a
  business trip (Ningbo), cannot fill the questionnaire tonight, and said
  "later when I have time." Founder rule: no nudging, no chasing. One light
  check-in allowed after ~1 week.
- Path 3 routing: her upcoming meeting with a study-abroad friend is a domain
  interview, tool is not on the table. No product direction can be triggered
  off that signal.

**Correctness gaps tracked in `TODOS.md`:**
- No Prisma `$transaction` around student upsert + `QuestionnaireResult.create`
  → non-atomic writes can orphan a student row if the second call fails.
  Acceptable for single-user MVP; must fix before multi-user.
- `Student.name` is the de-facto lookup key across questionnaire → review →
  complete → submit. Rename breaks references. Needs a stable `studentId`
  (cuid/uuid) + Prisma migration. Independent PR, not urgent for current
  single-user.
- No `error.tsx` / `loading.tsx` / `not-found.tsx` for `/schools` or
  `/schools/[id]`. Default Next.js fallbacks break brand continuity; design
  review already flagged.
- `recommendations.ts` has two copy nits tracked for M4: empty `school.name`
  fallback, and tone softening away from "数据库" language.

**Operational / infra:**
- Local-only deployment. No WeChat QR sharing, no calendar export (.ics),
  no html2canvas spike yet — all deferred until M4 exists.
- Pre-push hook relaxed to allow root `VERSION` (PR #13).

## Next-step recommendations

**Default while Kailing is standby:**
1. Write / maintain `docs/current-state.md` (this file — self-fulfilling).
2. Ship P2 small fixes that are independent and testable:
   - Error/loading/not-found pages for `/schools` routes
   - Prisma `$transaction` wrapping student upsert + questionnaire result
3. Build **M3 gap dump page** (`/complete/gaps`) on `feat/m3-gap-dump-page`.
   Minimum UI to surface `analyzeStudentVsAllSchools` output for founder
   eyeballing. No chart, no polish. Listed in `TODOS.md` as the next PR after
   #7. This is the natural bridge to M4.
4. **Do not touch** v2.1 thin feedback layer. Do not open
   `feat/thin-feedback-layer`. Do not run additional bot-review rounds on the
   paused doc.

**When Kailing signals "ready":**
- Run the restart playbook in the pause doc §14.5: tunnel → capture URL →
  write `.env.local` (hostname only) → start dev server → curl sanity →
  founder phone sanity → send link. ~20 seconds AI + ~1 minute founder.

**When Kailing returns survey + questions:**
- Founder answers in his own voice (not via AI). AI stays out until founder
  explicitly requests a short debrief with raw material attached.

## Conventions enforced by this repo

- Feature work happens on feature branches. `main` only receives merges via
  PR, and every PR gets at minimum one round of bot review (Codex + Gemini +
  Copilot) before merge. Trivial infra PRs (like gitignore changes) can skip
  bot review with a note.
- Version in root `VERSION` file. Changelog follows Keep a Changelog format.
- Commit messages in English. User-facing UI in Chinese. PR titles in English
  unless otherwise requested.
- Retrospective snapshots live under `.context/retros/` (gitignored). They
  are consumed by `/gstack-retro` for trend analysis — do not hand-edit.
- Skill routing rules are encoded in `CLAUDE.md` for consistent gstack
  behavior across sessions.
