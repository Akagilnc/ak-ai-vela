# Current State

Long-term project status document. Keeps only the current truth, not the history
of how we got here. For past context, read CHANGELOG, PR descriptions, and
retrospectives under `docs/retrospectives/` (when they exist).

**Last updated:** 2026-04-18 · `feat/path-explorer-v01` @ `a3c073a` (v0.5.0.1)

## Product Direction (Pivot)

**v0.5.0.0 marks a product pivot.** Based on seed user feedback (Kailing):
- FROM: Pre-vet US college application planning tool (gap analysis for high schoolers)
- TO: Trait-based growth guidance system (personality assessment for all ages, gap analysis as one vertical)

The moat is the ability to **deeply understand the child**, not any single feature.
Trait assessment is step 1 of understanding; Path Explorer (v0.6 research track) is
the upstream literacy layer that precedes matching.

## MVP Semantics

Vela has two shipped tools plus one research track in progress:

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

**Research track: Path Explorer v0.1** (v0.5.0.1, docs only — no UI yet)
- `docs/research/path-explorer-sources.md` — source manifest for upcoming
  pre-vet literacy cards (Shanghai G4-G7 小升初 audience).
- 3-school shortlist across foreign-only + bilingual categories and top /
  top-mid / mid tiers. Selection philosophy + criteria + research schema
  + supplementary sources all documented. URLs verified via WebFetch/WebSearch.
- Day 0 (manifest) shipped. Day 1 content authoring has not started.

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
- **Tests:** 332 passing via Vitest (as of v0.5.0.0, unchanged in v0.5.0.1
  because v0.5.0.1 is docs-only). Coverage invariant fences the recommendation
  template matrix. Trait tests cover all route combos.
- **Design system:** Tokens + rules in `DESIGN.md`. Fonts: Fraunces (display),
  Plus Jakarta Sans (body). Loaded via `<link>` with preconnect.
- **State pages:** `/schools` and `/schools/[id]` have branded error boundary,
  loading skeleton, and not-found pages (v0.4.0.1).

## Active branch / PR / review state

- **Current branch:** `feat/path-explorer-v01`
- **HEAD:** `a3c073a docs(research): add https:// protocol prefix to all supplementary URLs`
- **Version:** `0.5.0.1`
- **Open PRs:** PR #26 (Path Explorer v0.1 source manifest, docs-only).
  3-round bot review complete: Gemini 3 轮 all COMMENTED (replies posted),
  Codex round 2 👍 (round 3 no response, likely usage limit), Copilot silent.
  Mergeable, no approval / no changes-requested.
- **Open Issues:** #24 (v0.6 scientific trait quiz direction, P0),
  #25 (Path Explorer feature, P0).
- **Recently merged:**
  - PR #23 (trait assessment quiz, v0.5.0.0, merged 2026-04-13)
  - PR #22 (Prisma $transaction wrapping, v0.4.0.2)
  - PR #21 (schools state pages, v0.4.0.1)
- **Plan reviews passed** (for shipped features):
  CEO v3 (SELECTIVE EXPANSION), Eng review, Design review (4→8/10) on trait quiz.

## Most recent real verification

**2026-04-17** — PR #26 URL verification pass.
- Every `[待访问]` URL in the Path Explorer source manifest ran through
  WebFetch. 7 URLs with errors/typos surfaced and were corrected
  (自然博物馆, 东滩, 博物, 英才, 丘奖, 2 个 B 站 UID, 观鸟会) plus
  2 Gemini-flagged items (SSBS https, zoo typo). All 15 URLs now carry
  `https://` protocol prefix.
- Still `[待访问]` per entry — URL reachability verified, but Day 1 content
  authors must still consume each page before citing.

**2026-04-13** — trait quiz browser verification on feat/trait-assessment
(last real end-to-end product verification).
- `npx vitest run`: 332 / 332 green (22 test files, 2.8s).
- Browser walkthrough: welcome → Q1-Q10 → insight card → result page.
  Route `lower-animal-std` verified.

## Blockers and risks

**Product-level (seed user):**
- Kailing 4/16 call status: **unverified in this snapshot** — session owner
  should update this block after the call. Prior rule: no nudging, one light
  check-in allowed ~1 week after 4/11 stand-by.

**Correctness gaps tracked in `TODOS.md`:**
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

**Immediate:**
1. Merge PR #26 (Path Explorer v0.1 source manifest, v0.5.0.1). Docs-only,
   low merge risk, 3-round review cap reached.
2. Post-merge: delete `feat/path-explorer-v01`, pull `main`.
3. Sync Kailing 4/16 call outcome into this file (new branch / PR / issue
   depending on what surfaced).

**Path Explorer next (issue #25):**
1. Run `/gstack-office-hours` to pressure-test the Path Explorer direction
   before Day 1 content authoring.
2. Day 1: content authoring against the 3 shortlisted schools, using the
   per-school research matrix schema already defined in the manifest.
3. Decide Tier 1 SHSID vs SAS/Dulwich after Ethan passport confirmation.

**Trait quiz next (issue #24):**
1. v0.5 insight + portrait copy de-slop + random pool expansion (P1 TODO).
2. v0.6 scientific trait quiz: replace DIY 10-q with Temperament / VIA /
   Big5-C / Gardner MI hybrid. Not blocked by Path Explorer — independent
   track.
3. Phase 2 persistence (Prisma TraitResult) after content is validated.

**Longer term:**
- WeChat share card (blocked by html2canvas spike).
- M4 interactive report (gap analysis side).
- AI-generated personalized routes (v2, replaces hardcoded 24 routes).

## Conventions enforced by this repo

- Feature work happens on feature branches. `main` only receives merges via
  PR, and every PR gets at minimum one round of bot review (Codex + Gemini +
  Copilot) before merge. 3-round cap. Trivial infra PRs (like gitignore
  changes) can skip bot review with a note.
- Version in root `VERSION` file. Changelog follows Keep a Changelog format.
- Commit messages in English. User-facing UI in Chinese. PR titles in English
  unless otherwise requested.
- Design docs / plans / checkpoints / retros (under `~/.gstack/projects/` or
  `vault/创业/`) are **communication material, not engineering artifacts** —
  default to Chinese. English stays in code comments, commits, PRs.
- Retrospective snapshots live under `.context/retros/` (gitignored). They
  are consumed by `/gstack-retro` for trend analysis — do not hand-edit.
- Skill routing rules are encoded in `CLAUDE.md` for consistent gstack
  behavior across sessions.
