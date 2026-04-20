# Current State

Long-term project status document. Keeps only the current truth, not the history
of how we got here. For past context, read CHANGELOG, PR descriptions, and
retrospectives under `docs/retrospectives/` (when they exist).

**Last updated:** 2026-04-20 · `fix/path-explorer-horizontal-overflow` @ `a3dd303` (v0.6.1.0)

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

- **Current branch:** `fix/path-explorer-horizontal-overflow`
- **HEAD:** `a3dd303 chore: bump version and changelog (v0.6.1.0)`
- **Version:** `0.6.1.0`
- **Open PR:** pending — parent `/ship` will create the PR for v0.6.1.0
  (Path Explorer post-ship UX from Kailing seed-user feedback + scroll-restore
  hardening + narrow-phone overflow fix). 4 fix commits on branch:
  - `bf6dac8` horizontal overflow on narrow phone viewports
  - `30b2a9d` post-ship UX from Kailing seed-user feedback
  - `c2bc3ff` scroll-restore pre-landing adversarial review (round 1)
  - `2cfd4a1` scroll-restore round-2+3 adversarial findings
  - `a3dd303` VERSION + CHANGELOG bump
- **Open Issues:** #24 (v0.6 scientific trait quiz direction, P0),
  #25 (Path Explorer feature — v0.1 shipped, v0.2+ tracked for more months).
- **Recently merged:**
  - PR #27 (Path Explorer v0.1 implementation, v0.6.0.0, merged 2026-04-19)
  - PR #26 (Path Explorer v0.1 source manifest, v0.5.0.1, merged 2026-04-18)
  - PR #23 (trait assessment quiz, v0.5.0.0, merged 2026-04-13)
  - PR #22 (Prisma $transaction wrapping, v0.4.0.2)
  - PR #21 (schools state pages, v0.4.0.1)

## Most recent real verification

**2026-04-20** — Path Explorer v0.6.1.0 hardening pass verified in preview:
- Scroll-restore: tap tile on `/path` scrolled to y=800 → detail loads → tap
  "5 月" back → `#path-main.scrollTop === 800` on return (browser back + in-app
  back + BFCache all covered). Deep-link `/path/{slug}` → back does not
  teleport (beacon gated on tile-click timestamp).
- Narrow-viewport CSS: DevTools 320px iPhone SE profile — overview tiles
  no longer push horizontal scrollbar; long words break within tiles.
- Stage tabs: "一~三年级 / 四~六年级 / 初中" render in Chinese sans.
- Symlink: `public/assets/vela.css → ../../assets/vela.css` verified; demo
  HTML files and `/path` layout both serve identical bytes.
- `bun run test`: 432 / 432 green (23 test files, 2.8s). No new tests
  added in v0.6.1.0 — scroll-restore is verified by adversarial cross-review
  + preview E2E rather than unit tests (React useEffect + sessionStorage
  + pageshow lifecycle not cleanly unit-testable in jsdom).
- 3 rounds of adversarial cross-model review (Claude subagents + Codex,
  parallel) converged on:
  - R1: sessionStorage-throw deadlocks, smooth-scroll bypass leaks,
    flush-on-unmount misses → fixed.
  - R2: too-permissive beacon (deep-link then back teleported to stale
    scroll), detached-element flush writing 0 to storage → fixed.
  - R3: cmd/shift/ctrl-click leaking the departure flag (new-tab opens
    with modifier keys should NOT set the beacon) → fixed.

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
1. Ship v0.6.1.0 via `/gstack-ship` — PR creation, bot review rounds, merge.
2. Post-merge: delete `fix/path-explorer-horizontal-overflow`, pull `main`.
3. Act on the Kailing-flagged P1 CTA channel TODO (email → WeChat ID / phone)
   before any wider distribution push.
4. Decide on Path Explorer v0.2 scope (June cards? Different stage?) based
   on Kailing signal.

**Path Explorer v0.2+ (issue #25, new branch):**
1. Decide which month ships next. June is natural if Kailing tests v0.1
   in May/June window.
2. Decide whether to add a second stage (G4–G6) or go deeper on G1–G3.
3. Address deferred P2 items as they become blocking (see above).

**Trait quiz next (issue #24, independent track):**
1. v0.5 insight + portrait copy de-slop + random pool expansion (P1 TODO).
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
