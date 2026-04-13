# Current State

Long-term project status document. Keeps only the current truth, not the history
of how we got here. For past context, read CHANGELOG, PR descriptions, and
retrospectives under `docs/retrospectives/` (when they exist).

**Last updated:** 2026-04-13 · `main` @ `9a599cb` (v0.4.0.2)

## MVP Semantics

Vela is an AI college planning assistant with a **pre-vet specialization** as
the seed vertical (biology / animal science students targeting veterinary
programs). The week-1 MVP flow is:

1. Parent opens the welcome page and starts a questionnaire for their child.
2. 8-step wizard captures the student's profile (scores, curriculum, target
   region, biggestConcern, etc.) with per-step validation, conditional fields
   (IB/AP/A-Level vs GPA+rank), and localStorage draft persistence.
3. Submission atomically upserts a `Student` row and writes a
   `QuestionnaireResult` via a Zod-validated server action wrapped in
   `prisma.$transaction()`.
4. The complete page shows a confirmation with a "查看差距分析 →" link.
5. The gap-analysis page (`/complete/gaps`) shows 26 schools organized by
   match/reach/possible tiers with 5-level severity (excellent/green/yellow/
   red/no-data), pill tags, expandable detail, and mobile-first layout.
   Uses `studentId` as lookup key. Test-free schools show "该校不要求" copy.
6. The interactive report (M4) does not exist yet.

The system speaks Chinese by default (labels, validation errors, hints,
recommendation templates).

## Architecture snapshot

- **Framework:** Next.js 16 (App Router), React 19, TypeScript strict.
- **Database:** Prisma 7.7.0 on SQLite (`dev.db`, empty today — 0 students, 0
  questionnaire_results). Student upsert + QR create wrapped in
  `$transaction()` for atomicity.
- **Gap engine:** `src/lib/gap/` — deterministic pure-function library, 4 v1
  dimensions (GPA, SAT, ACT, pre-vet experience), 5-level severity (excellent/
  green/yellow/red/no-data), tier classification (match/reach/possible), 20
  recommendation templates. UI consumer: `/questionnaire/complete/gaps`.
- **Tests:** 283 passing via Vitest (as of v0.4.0.2). Coverage invariant fences
  the recommendation template matrix.
- **Design system:** Tokens + rules in `DESIGN.md`. Fonts: Fraunces (display),
  Plus Jakarta Sans (body). Loaded via `<link>` with preconnect.
- **State pages:** `/schools` and `/schools/[id]` have branded error boundary,
  loading skeleton, and not-found pages (v0.4.0.1).

## Active branch / PR / review state

- **Current branch:** `main` (working tree clean).
- **HEAD:** `9a599cb Merge pull request #22 from Akagilnc/fix/p2-transaction-wrapping`
- **Version:** `0.4.0.2`
- **Open PRs:** None.
- **Open Issues:** None.
- **Recently merged:**
  - PR #21 (schools state pages, v0.4.0.1). 2 rounds bot review, all addressed.
  - PR #22 (Prisma $transaction wrapping, v0.4.0.2). 2 rounds bot review, all
    addressed. Codex gave 👍.
- **Planned but paused:** thin feedback layer v2.1 — design doc exists.
  **Deliberately not implementing.** Waiting for seed user signal.

## Most recent real verification

**2026-04-13** — post-merge test run on main.
- `npx vitest run`: 283 / 283 green (17 test files, 2.65s).
- Working tree clean, no open PRs or issues.

**2026-04-11 late night (Tokyo)** — dry run tunnel + dev server session.
- Quick tunnel via cloudflared `--protocol http2` (QUIC blocked on current
  network).
- Caught a real bug: `.env.local` had `DEV_TUNNEL_ORIGIN=https://abc.trycloudflare.com`
  with scheme, which Next.js `allowedDevOrigins` treats as invalid → page
  half-hydrates on iOS Safari → buttons don't respond. Fix: hostname-only
  (no scheme). Ground truth is in `.env.example`. `curl` does not reproduce;
  must be verified in a real browser.

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
- ~~No Prisma `$transaction`~~ **Fixed in v0.4.0.2 (PR #22).**
- ~~No state pages for `/schools`~~ **Fixed in v0.4.0.1 (PR #21).**
- `Student.name` is the de-facto lookup key across questionnaire → review →
  complete → submit. Rename breaks references. Needs a stable `studentId`
  (cuid/uuid) + Prisma migration. Independent PR, not urgent for current
  single-user.
- `recommendations.ts` has two copy nits tracked for M4: empty `school.name`
  fallback, and tone softening away from "数据库" language.

**Operational / infra:**
- Local-only deployment. No WeChat QR sharing, no calendar export (.ics),
  no html2canvas spike yet — all deferred until M4 exists.
- Pre-push hook relaxed to allow root `VERSION` (PR #13).

## Next-step recommendations

**Default while Kailing is standby:**
1. Start **M4 interactive report** (charts, What If simulator, html2canvas).
   The gap page (v0.4.0.0) is the foundation; M4 adds interactivity.
2. Replace `Student.name` de-facto key with stable `studentId` (P2, independent).
3. **Do not touch** v2.1 thin feedback layer.

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
