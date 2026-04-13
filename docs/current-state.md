# Current State

Long-term project status document. Keeps only the current truth, not the history
of how we got here. For past context, read CHANGELOG, PR descriptions, and
retrospectives under `docs/retrospectives/` (when they exist).

**Last updated:** 2026-04-14 · `feat/trait-assessment` @ `a686674` (v0.5.0.0)

## Product Direction (Pivot)

**v0.5.0.0 marks a product pivot.** Based on seed user feedback (Kailing):
- FROM: Pre-vet US college application planning tool (gap analysis for high schoolers)
- TO: Trait-based growth guidance system (personality assessment for all ages, gap analysis as one vertical)

The moat is the ability to **deeply understand the child**, not any single feature.
Trait assessment is step 1 of understanding.

## MVP Semantics

Vela has two independent tools:

**Tool 1: Trait Assessment** (`/trait-quiz`, v0.5.0.0, Phase 1 pure frontend)
1. Parent opens the welcome page and clicks "特质测评"
2. 10-question branching quiz captures the child's interests, learning style,
   social preferences, and environment (3 branch points, 10 questions per path)
3. Mid-quiz insight card shows personalized feedback after Q3 ("看起来孩子是一个...")
4. matchRoute() maps answers to one of 24 predefined routes
5. Result page shows personality portrait (hero) + staged roadmap (3 life stages
   with expandable action items, fact-check annotations)
6. Goal confirmation card collects target (前30/前50/还没想好) for future use
7. All client-side. localStorage for draft persistence. No database.

**Tool 2: Gap Analysis** (`/questionnaire` → `/complete/gaps`, v0.4.0.0)
1. 8-step wizard captures the student's profile (scores, curriculum, etc.)
2. Submission atomically upserts Student + QuestionnaireResult via `$transaction()`
3. Gap analysis page shows 26 schools by match/reach/possible tiers with 5-level
   severity and expandable detail

The system speaks Chinese by default.

## Architecture snapshot

- **Framework:** Next.js 16 (App Router), React 19, TypeScript strict.
- **Database:** Prisma 7.7.0 on SQLite (`dev.db`, empty today — 0 students, 0
  questionnaire_results). Student upsert + QR create wrapped in
  `$transaction()` for atomicity.
- **Gap engine:** `src/lib/gap/` — deterministic pure-function library, 4 v1
  dimensions (GPA, SAT, ACT, pre-vet experience), 5-level severity (excellent/
  green/yellow/red/no-data), tier classification (match/reach/possible), 20
  recommendation templates. UI consumer: `/questionnaire/complete/gaps`.
- **Trait engine:** `src/lib/traits/` — 24 predefined routes, matchRoute(),
  portrait generator, insight text. Pure functions, no DB. 49 tests.
- **Tests:** 332 passing via Vitest (as of v0.5.0.0). Coverage invariant fences
  the recommendation template matrix. Trait tests cover all route combos.
- **Design system:** Tokens + rules in `DESIGN.md`. Fonts: Fraunces (display),
  Plus Jakarta Sans (body). Loaded via `<link>` with preconnect.
- **State pages:** `/schools` and `/schools/[id]` have branded error boundary,
  loading skeleton, and not-found pages (v0.4.0.1).

## Active branch / PR / review state

- **Current branch:** `feat/trait-assessment`
- **HEAD:** `a686674 fix: address round-4 bot review findings`
- **Version:** `0.5.0.0`
- **Open PRs:** PR #23 (trait assessment quiz, v0.5.0.0)
- **Open Issues:** None.
- **Recently merged:**
  - PR #22 (Prisma $transaction wrapping, v0.4.0.2)
  - PR #21 (schools state pages, v0.4.0.1)
- **Plan reviews passed:** CEO v3 (SELECTIVE EXPANSION), Eng review, Design review (4→8/10)

## Most recent real verification

**2026-04-13** — trait quiz browser verification on feat/trait-assessment.
- `npx vitest run`: 332 / 332 green (22 test files, 2.8s).
- Browser walkthrough: welcome → Q1-Q10 → insight card ("看起来孩子是一个对动物
  很有爱的小观察者") → result page (portrait "温柔观察者" + 3 stage cards +
  goal confirmation). Route `lower-animal-std` verified.
- Homepage dual entry with NEW badge confirmed.

**2026-04-11 late night (Tokyo)** — dry run tunnel + dev server session.
- Quick tunnel via cloudflared `--protocol http2` (QUIC blocked).
- Hostname-only in `.env.local` (no scheme). Ground truth in `.env.example`.

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

**Immediate (before 4/16 Kailing call):**
1. Merge PR #23 (trait assessment v0.5.0.0)
2. Tunnel to Kailing for trait quiz feedback:
   `cloudflared tunnel --url http://localhost:3000 --protocol http2`
3. Content polish based on Kailing feedback

**After Kailing call (4/16):**
1. Trait Assessment Phase 2: Prisma persistence, retake history, radar chart
2. Resolve studentId stability (P2 TODO, needed for Phase 2)
3. Content direction adjustments from Kailing's meeting with study-abroad friend

**Longer term:**
- WeChat share card (blocked by html2canvas spike)
- M4 interactive report (gap analysis side)
- AI-generated personalized routes (v2, replaces hardcoded 24 routes)

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
