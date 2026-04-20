# Current State

Long-term project status document. Keeps only the current truth, not the history
of how we got here. For past context, read CHANGELOG, PR descriptions, and
retrospectives under `docs/retrospectives/` (when they exist).

**Last updated:** 2026-04-20 · `main` @ `af48eb4` (v0.6.2.0, post-merge)

## Product Direction

The moat is the ability to **deeply understand the child**, not any single feature.
Vela has three layered tools aimed at different stages of that understanding:

1. **Path literacy** — help parents see what a path actually looks like before
   they worry about matching (Path Explorer).
2. **Trait reading** — capture who the child is today (Trait assessment).
3. **Gap closing** — for high schoolers with known targets, diagnose distance
   to selective US universities (Gap analysis).

v0.5 marked the pivot from "gap analysis only" to "growth guidance." v0.6
extends upstream with Path Explorer v0.1 — the literacy layer.

## MVP Semantics

**Tool 1: Path Explorer** (`/path`, v0.6.0.0, shipped 2026-04-19)
1. Parent opens `/path` and sees 小小动物科学家 theme for G1–G3, May month.
2. Overview shows 5 activity tiles (1 baseline 月度节奏 + 4 event cards:
   上海自博物馆 · 海洋馆 · 小故事 · 产出).
3. Each tile → detail page `/path/{slug}` with chips, trigger, time pacing,
   and 2–5 themed sections rendered from 17 block types (paragraph / triad /
   route / trivia / callout / callout-trio / path-opts / sub-block / list-
   check / list-bullets / photo-row / id-table / steps / philosophy /
   sources / aside-note / callout).
4. Sticky sub-nav scroll-spy + species-photo lightbox + keyboard (←/→/Esc)
   and touch-swipe navigation between cards.
5. CTA form at bottom of overview: email + optional grade → future months.
6. WeChat share button: native share sheet outside WeChat, clipboard copy
   inside WeChat webview (+ iOS Safari `execCommand` legacy fallback).
7. Brand-styled 404 (`/path/not-found`) and error boundary (`/path/error`).

**Tool 2: Trait Assessment** (`/trait-quiz`, v0.5.0.0, Phase 1 pure frontend)
1. Parent opens the welcome page and clicks "特质测评"
2. 10-question branching quiz captures the child's interests, learning style,
   social preferences, and environment (3 branch points, 10 questions per path)
3. Mid-quiz insight card shows personalized feedback after Q3
4. matchRoute() maps answers to one of 24 predefined routes
5. Result page shows personality portrait + staged roadmap (3 life stages
   with expandable action items, fact-check annotations)
6. All client-side, localStorage for draft persistence, no database.

**Tool 3: Gap Analysis** (`/questionnaire` → `/complete/gaps`, v0.4.0.0)
1. 8-step wizard captures student profile (scores, curriculum, etc.)
2. Submission atomically upserts Student + QuestionnaireResult via `$transaction()`
3. Gap page shows 26 schools by match/reach/possible tier with 5-level severity.

The system speaks Chinese by default.

## Architecture Snapshot

- **Framework:** Next.js 16 (App Router), React 19, TypeScript strict.
- **Database:** Prisma 7.7.0 on SQLite (`dev.db`). Path Explorer adds 6 new
  models: PathStage / PathGoal / PathActivity / PathDecision /
  PathDecisionBranch / PathInterest. Existing: School / Student /
  QuestionnaireResult.
- **Path Explorer engine:** `src/lib/path/` — pure utilities. The key
  security-boundary function is `canonicalSourcePath` (100 regression
  tests covering NFKC normalization, multi-pass percent decoding with
  per-segment fallback, `\p{Default_Ignorable_Code_Point}` strip,
  confusable-separator folding, dot-segment resolution, iteration cap
  at 10 for DoS resistance).
- **Gap engine:** `src/lib/gap/` — deterministic pure-function library, 4
  v1 dimensions (GPA / SAT / ACT / pre-vet experience), 5-level severity,
  tier classification, 20 recommendation templates.
- **Trait engine:** `src/lib/traits/` — 24 predefined routes, matchRoute(),
  portrait generator, insight text. 49 tests.
- **Tests:** 432 passing via Vitest (23 files, 2.8s). Coverage invariant
  fences the recommendation template matrix. canonical-source suite pins
  every Unicode smuggling vector (U+00AD SOFT HYPHEN, U+061C ARABIC LETTER
  MARK, U+202A-E bidi, U+E0000-U+E01EF TAG + variation selectors, etc.).
- **Design system:** Tokens + rules in `DESIGN.md` for the trait-quiz +
  gap flows. Path Explorer uses `vela.css` (scoped via `<link>` in
  `src/app/path/layout.tsx`) with its own warm palette layered on the
  shared brand. Fonts: Fraunces (display), Plus Jakarta Sans (body).
- **Accessibility (Path Explorer v0.6.0.0):** WCAG 2.5.5 AAA tap targets
  (44px min across every interactive element), 2.4.7 AA focus-visible
  rings (gold 2px on cream), 2.3.3 AAA `prefers-reduced-motion`, `<main>`
  landmarks + skip-to-content links, iOS `viewport-fit=cover` + safe-
  area-aware toast / footer / lightbox positioning.
- **State pages:** `/schools`, `/schools/[id]`, `/path`, `/path/*` all
  have branded error boundary + not-found + loading skeleton.

## Active branch / PR / review state

- **Current branch:** `main`
- **HEAD:** `af48eb4 refactor(trait-quiz): v0.6.2.0 — de-slop insight + portrait copy (13-round cross-model review) (#29)`
- **Version:** `0.6.2.0`
- **Open PR:** none. `feat/trait-v05-deslop` squash-merged as PR #29.
- **Open Issues:** #24 (v0.6 scientific trait quiz direction, P0),
  #25 (Path Explorer feature — v0.1 shipped, v0.2+ tracked for more months).
- **Recently merged:**
  - PR #29 (trait-quiz copy de-slop, v0.6.2.0, merged 2026-04-20). Content-only:
    insights.ts (12 mid-quiz lines + fallback) + portraits.ts (12 INTEREST_DESC +
    3 DRIVE_DESC + fallback) + insights length test. Zero schema / routing / data
    flow changes. Squash commit includes 7 pre-squash commits: 2 slice refactors
    (aff3520 insights, 6f1eec8 portraits), 1 /ship length-invariant fix (47a23c4),
    1 version bump (1bda9e8), and 3 post-review fixes from PR bot rounds
    (a07f66b Gemini R1 fallback-comment consistency, 457eb82 Gemini R2 career
    list parallelism + 户外待不住 semantic contradiction, 9ef1e48 Gemini R3
    portraits fallback copy for result-page context vs mid-quiz context).
  - PR #28 (Path Explorer v0.6.1.0 UX + scroll-restore hardening, merged 2026-04-20)
  - PR #27 (Path Explorer v0.1 implementation, v0.6.0.0, merged 2026-04-19)
  - PR #26 (Path Explorer v0.1 source manifest, v0.5.0.1, merged 2026-04-18)
  - PR #23 (trait assessment quiz, v0.5.0.0, merged 2026-04-13)
  - PR #22 (Prisma $transaction wrapping, v0.4.0.2)
  - PR #21 (schools state pages, v0.4.0.1)

## Most recent real verification

**2026-04-20** — Trait-quiz copy de-slop (v0.6.2.0) shipped and merged:
- `npm test`: 432 / 432 green (23 test files, ~2.6s). The insights length
  test was widened from a single-key spot check (`stem:builder`) to all 12
  keys — caught two lines that had silently drifted to 32 chars post-Slice-1
  rewrite. Ceiling is 35 CJK chars, test-enforced across every combo.
- Scope is content-only: `src/lib/traits/insights.ts` (12 branch-specific
  lines rewritten, openings varied past the 看起来 × 12 template),
  `src/lib/traits/portraits.ts` (12 INTEREST_DESC + 3 DRIVE_DESC + fallback
  paragraph rewritten; deficit framing removed; anchor overlaps between
  trait branches eliminated), and the insights test file. Zero changes to
  routing, schema, data flow, or any non-copy surface.
- Review depth: 13 rounds of local cross-model adversarial review before
  PR — Slice 1 insights converged in round 6, Slice 2 portraits in round 7.
  Each round fanned out to 3 Claude subagents (slop-pattern detection / tone
  calibration / info-density) + Codex in parallel. Late-round Codex catches
  included a "积木" anchor overlap with a quiet-branch quiz stem in
  `questions.ts`. `/ship` adversarial pass then caught a cross-file length
  invariant violation (insights.ts header claimed 30-char ceiling but two
  lines had drifted to 32; fixed the test + raised the declared ceiling to
  the real 35-char 2-line-wrap budget).
- PR #29 bot review: 3 rounds, each surfaced a distinct real issue the
  local loops had missed — R1 Gemini: insights.ts fallback-reachability
  comment was inconsistent with portraits.ts (both files had the same
  claim; portraits.ts had been corrected, insights.ts lagged). R2 Gemini:
  two same-shape slips the slice-by-slice loop structurally couldn't catch
  — `animal-science:career` list parallelism broke in insights.ts
  (`救助` verb next to noun siblings `兽医` / `饲养员`; Codex had fixed
  the same shape in portraits.ts Slice 2 R6, the fix didn't propagate) —
  and `exploring:physical` said `他在户外待不住`, which in Chinese reads
  "can't bear being outdoors" and contradicts the active-outdoor trait.
  R3 Gemini: portraits.ts fallback `再答几题会更清楚` is correct mid-quiz
  but wrong on the result page (user already finished all 5 questions);
  rewritten to `多观察他的日常会看得更清楚`. All three rounds fixed and
  merged.
- Fallback prose correction: both files now explicitly note that the `??`
  branch IS reachable — Zod validates each trait field's enum independently
  but not the `(interest, interestDetail)` combination, so an out-of-flow
  caller hitting an unmapped combo lands on the fallback. Earlier claim of
  "unreachable future-proofing" was wrong.

## Blockers and Risks

**Product-level (seed user):**
- Kailing 4/16 call outcome: still unverified in this snapshot. Session
  owner should update this block after the call. Prior rule: no nudging,
  one light check-in allowed ~1 week after 4/11 stand-by.

**Correctness gaps tracked in `TODOS.md`:**
- `Student.name` de-facto lookup key across questionnaire flow. Rename
  would break references. Needs stable `studentId` (cuid/uuid) + Prisma
  migration. Independent PR, not urgent for current single-user.
- `recommendations.ts` has two copy nits tracked for M4: empty `school.name`
  fallback, and tone softening away from "数据库" language.

**Path Explorer v0.5+ deferred (architectural, not urgent for v0.1):**
- CSP header + HTML sanitization for `BlockRenderer` — v0.1 trusts the
  seed file as the only writer. Must land BEFORE any non-seed write path
  opens up.
- `PathInterest.userAgent` retention policy — full UA + email is PII.
  Needs decision before public launch.
- `PathDecisionBranch.downstreamStageSlugs: Json` → proper FK join table.
  v0.1 doesn't seed this model (0 rows) so impact is zero.

**Path Explorer v0.6.0.0 P2 deferred (polish, not shipping blockers):**
- `--mute-2` (#8F8B72) on cream is 3.1:1 (fails WCAG AA 4.5:1 for small
  text). Brand-compliant fix exists (DESIGN.md #6B6560 secondary tier).
  Awaiting brand decision.
- `/schools` landscape safe-area edge — side-effect of global
  `viewport-fit=cover`. `px-4` < notch inset in landscape.
- `error.tsx` dev-mode error display — currently discards error prop.

**Operational / infra:**
- Local-only deployment. No WeChat QR sharing beyond the share button's
  clipboard copy, no calendar export (.ics), no html2canvas spike yet.
- Pre-push hook relaxed to allow root `VERSION` (PR #13).

## Next-step recommendations

**Immediate:**
1. Act on the Kailing-flagged P1 CTA channel TODO (email → WeChat ID / phone)
   before any wider distribution push.
2. Decide on Path Explorer v0.2 scope (June cards? Different stage?) based
   on Kailing signal.

**Path Explorer v0.2+ (issue #25, new branch):**
1. Decide which month ships next. June is natural if Kailing tests v0.1
   in May/June window.
2. Decide whether to add a second stage (G4–G6) or go deeper on G1–G3.
3. Address deferred P2 items as they become blocking (see above).

**Trait quiz next (issue #24, independent track):**
1. ~~v0.5 insight + portrait copy de-slop~~ DONE in v0.6.2.0. Next:
   random-pool expansion (every key 1 → 3-24 hand-written variants with
   seeded selection) is tracked as a P2 TODO, waiting for Kailing signal
   — one good line may already be enough.
2. v0.6 scientific trait quiz: replace DIY 10-q with Temperament / VIA /
   Big5-C / Gardner MI hybrid. Not blocked by Path Explorer.
3. Phase 2 persistence (Prisma TraitResult) after content is validated.

**Longer term:**
- WeChat share card polish (html2canvas spike still unrun).
- M4 interactive report (gap analysis side).
- AI-generated personalized routes (v2, replaces hardcoded 24 routes).

## Conventions enforced by this repo

- Feature work happens on feature branches. `main` only receives merges via
  PR, and every PR gets at minimum one round of bot review before merge.
  3-round cap. Trivial infra PRs can skip with a note.
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
