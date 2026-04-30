# Current State

Long-term project status document. Keeps only the current truth, not the history
of how we got here. For past context, read CHANGELOG, PR descriptions, and
retrospectives under `docs/retrospectives/` (when they exist).

**Last updated:** 2026-05-01 · `fix/polish-sprint-p2` @ `512577d` (v0.9.0.0, polish sprint + IDOR closure, PR pending)

## Product Direction

The moat is the ability to **deeply understand the child**, not any single feature.
Vela has three layered tools aimed at different stages of that understanding:

1. **Path literacy** — help parents see what a path actually looks like before
   they worry about matching (Path Explorer).
2. **Trait reading** — capture who the child is today (Trait assessment).
3. **Gap closing** — for high schoolers with known targets, diagnose distance
   to selective US universities (Gap analysis).

v0.5 marked the pivot from "gap analysis only" to "growth guidance." v0.6
extends upstream with Path Explorer v0.1 — the literacy layer. v0.7 makes
Path Explorer multi-month: routing + theme map + G1 June seed. v0.8 replaces
the v0.5 DIY trait quiz with a Thomas & Chess 9-dimension temperament
framework (30-Q Likert, URL-encoded score), closing issue #24.

## MVP Semantics

**Tool 1: Path Explorer** (`/path`, v0.7.0.0, ready to ship)
1. Parent opens `/path` and lands on the current calendar month if seeded
   (April→May fallback today via three-tier resolveMonth: current → nearest
   upcoming → max past). May = 小小动物科学家 (5 cards). June = 雨季观察家 (4 cards).
2. Month pill row is a real navigation surface: each pill is a `<Link>` for
   seeded months, a disabled `<button>` for ghost months, and a non-interactive
   `<span>` for the active month. `aria-current="page"` on the active item.
3. Overview shows N activity tiles per month (May: 1 baseline + 4 event cards;
   June: 1 baseline + 3 event cards covering 端午 3-day holiday, 入梅 backyard
   ecology, 夏至 fireflies). Card count is content-driven, not padded to a
   fixed number.
4. Each tile → detail page `/path/{slug}` with chips, trigger, time pacing,
   and 2–5 themed sections rendered from 17 block types (paragraph / triad /
   route / trivia / callout / callout-trio / path-opts / sub-block / list-
   check / list-bullets / photo-row / id-table / steps / philosophy /
   sources / aside-note / callout).
5. Detail-page back button + Esc shortcut preserve the activity's month
   (`/path?month=${activity.month}`) so multi-month routing doesn't strand
   users on a different month after returning.
6. Sticky sub-nav scroll-spy + species-photo lightbox + keyboard (←/→/Esc)
   and touch-swipe navigation between cards within the same month.
7. CTA form at bottom of overview: email + optional grade → future months.
   Copy is now month-agnostic ("下次更新发你" / "当月卡片"); error.tsx and
   not-found.tsx match.
8. WeChat share button: native share sheet outside WeChat, clipboard copy
   inside WeChat webview (+ iOS Safari `execCommand` legacy fallback).
9. Brand-styled 404 (`/path/not-found`) for invalid `?month=99`/`?month=foo`
   and error boundary (`/path/error`).

**Tool 2: Trait Assessment** (`/trait-quiz`, v0.8.0.0 / v0.6 trait quiz, Phase 1 pure frontend)
1. Parent opens the welcome page and clicks "特质测评"
2. 30-question Likert assessment based on Thomas & Chess 1956 NYU 9-dimension
   temperament framework (activity / rhythmicity / approach / adaptability /
   intensity / threshold / mood / distractibility / persistence). Roughly 3.3
   items per dimension, mix of forward + reverse-keyed.
3. Auto-advance: first-time pick on a question auto-advances after 250ms.
   Re-pick after 上一题 navigation does NOT auto-advance — user came back
   deliberately. Last question never auto-advances. Bottom 上一题 / 下一题
   nav remains as manual override.
4. Score engine (`src/lib/traits/temperament/`): per-dim mean → quantize to
   integer 1-5, then 4-class hero (灵活型 / 慎重型 / 慢热型 / 平衡型) with
   academic Thomas & Chess aliases preserved underneath. attentionPole
   (low/high) per dim, no neutral.
5. Score URL encoding: 6-byte payload → 8 base64url characters with CRC-8
   checksum, schemaVersion + cutoffVersion + lowConfidenceFlag baked in.
   `cutoffHistory` append-only ledger lets old links re-classify under newer
   cutoffs without breaking shareability.
6. Result page (`/trait-quiz/result/[score]`): 4-class hero card + 9-dim
   profile bars + drift CTA ("月度活动通知"). All decoded from URL — pure
   client-side, no database.
7. localStorage draft persistence during quiz fill. No backend writes.

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
  at 10 for DoS resistance). v0.7 adds `month-routing.ts` —
  `resolveMonth(current, available)` (3-tier: current → nearest upcoming
  → max past) + `validateMonthParam` (regex int-only, range [1,12], no
  decimals / leading zeros beyond "01"–"09"). 33 routing tests.
- **Gap engine:** `src/lib/gap/` — deterministic pure-function library, 4
  v1 dimensions (GPA / SAT / ACT / pre-vet experience), 5-level severity,
  tier classification, 20 recommendation templates.
- **Trait engine v0.6:** `src/lib/traits/temperament/` — Thomas & Chess
  1956 9-dimension framework. 30 Likert items, per-dim quantize-to-int-1-5,
  4-class hero classification, URL-encoded score (6-byte payload → 8 base64url
  chars with CRC-8 checksum + schemaVersion + cutoffVersion + lowConfidenceFlag).
  `cutoffHistory` append-only ledger preserves backward-compat re-classification.
  `quantizeDimScores` invariant: live-result and URL-decoded paths converge on
  identical integer profiles. 159 tests across 7 files.
- **Tests:** 733 passing via Vitest (31 files). Coverage invariant
  fences the recommendation template matrix. canonical-source suite pins
  every Unicode smuggling vector (U+00AD SOFT HYPHEN, U+061C ARABIC LETTER
  MARK, U+202A-E bidi, U+E0000-U+E01EF TAG + variation selectors, etc.).
  v0.7 adds `month-routing.test.ts` (33 tests) and `path-seed-shape.test.ts`
  (29 tests including a recursive block walker that fails at test time
  on per-discriminator field-name drift across all month seeds). v0.8 adds
  7 new test files in `src/lib/traits/temperament/__tests__/` covering score
  encoding round-trips, CRC-8 tamper detection, dimension polarity, hero
  classification cutoffs, lowConfidenceFlag thresholds, and the
  quantizeDimScores live↔URL invariant.
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

- **Current branch:** `fix/polish-sprint-p2`
- **HEAD:** `512577d` (v0.9.0.0, PR pending creation)
- **Version:** `0.9.0.0`
- **Branch summary (7 commits, +1055 / -137 LOC across 25 files, 753 tests passing):**
  Polish sprint covering 6 deferred items (radar dimension skip-reason,
  `/path` dev-mode error display, `/schools` landscape safe-area, gap
  recommendation school-name fallback, `Student.name` → stable studentId,
  block-shape walker tightening) plus a 7-round cross-model adversarial
  review trail that surfaced and closed both write-side and read-side IDOR
  on the questionnaire flow. Net new file: `src/lib/auth/student-token.ts`
  (HMAC-signed studentId cookie, `timingSafeEqual` constant-time compare,
  fail-fast `STUDENT_TOKEN_SECRET` probe in production). New env var
  `STUDENT_TOKEN_SECRET` (≥32 chars, generate via `openssl rand -hex 32`).
- **Open Issues:** #25 (Path Explorer feature — v0.1 + v0.2 shipped, v0.3+
  tracked for more months / additional stage).
- **Previously open PR (now reflected in CHANGELOG / "Recently merged" once landed):**
  PR #33 (Trait Quiz v0.6, v0.8.0.0). 3 rounds of bot review (Codex + Gemini),
  all 7 findings addressed: 1 Critical (quantize math drift between live + URL
  paths), 1 High (dimension polarity inversion), 1 P1, 4 medium / P2.
- **v0.8.0.0 branch summary (16 commits, +4825 / -2800 LOC across 44 files):**
  - Slice 1: dimension framework — `dimensions.ts` (Thomas & Chess 9
    dims, attentionPole low/high, no neutral) + `questions.ts` (30
    Likert items, ~3.3 per dim, mix of forward + reverse-keyed).
  - Slice 2: scoring engine — `score.ts` (per-dim mean → quantize int
    1-5, then 4-class hero classification with cutoff thresholds).
  - Slice 3: URL encoding — `score-encoding.ts` (6-byte payload → 8
    base64url chars, CRC-8 checksum, schemaVersion + cutoffVersion +
    lowConfidenceFlag).  `cutoffHistory` append-only ledger so old
    score URLs re-classify correctly under newer cutoffs.
  - Slice 4: result page — `/trait-quiz/result/[score]` decodes URL,
    renders 4-class hero card with academic + consumer aliases (灵活/
    慎重/慢热/平衡), 9-dim profile bars, drift CTA.
  - Slice 5: quiz UI — `quiz-provider.tsx`, `quiz-step.tsx`,
    `likert-options.tsx`, `dim-progress.tsx`. Auto-advance after
    first-time Likert pick (250ms `setTimeout` + `useRef`-guarded
    cancel-on-上一题).
  - Slice 6: removed v0.5 — deleted `trait-quiz-provider.tsx`,
    `trait-step.tsx`, `trait-progress.tsx`, `trait-insight.tsx`,
    `src/lib/traits/{types,questions,routes,match,portraits,insights}.ts`,
    24-route matchRoute, all v0.5 tests. Net -2800 LOC.
  - Bot review R1 (Codex): caught Critical math drift — live result
    used floor; URL-decoded path used round → off-by-one classifications
    on edge scores. Fixed via shared `quantizeDimScores` helper + invariant
    test.
  - Bot review R2 (Gemini): polarity inversion on adaptability and
    distractibility (reverse-keyed items not flipped). Fixed + test.
  - Bot review R3: 4 P2 items addressed (label affordance, error
    boundary copy, share button race, severity scale tokens).
  - Real-device E2E via `vela.akbot.top` named tunnel: user surfaced
    2 UX gaps — manual 下一题 click feels heavy after each pick (fixed
    with auto-advance, `7d51a01`), redundant dim transition banner
    above progress bar (`86f339d`).
  - Tunnel infra (`e0f2c51`): permanent dev tunnel host
    `vela.akbot.top` baked into `next.config.ts allowedDevOrigins`.
    `DEV_TUNNEL_ORIGIN` env var still supported for ad-hoc parallel
    quick tunnels via `Set` deduplication.
  - DESIGN.md severity scale token swap: trait severity now uses
    forest green / deep gold / burnt orange (replaces v0.5 terracotta
    on dark which failed contrast).
  - WCAG AA: muted text `#B8B0A0` → `#6B6560` (5.45:1 on cream),
    closes the `[P2] A11y muted text contrast` TODO.
- **Recently merged:**
  - PR #31 (Path Explorer v0.2 — multi-month routing + G1 June seed, v0.7.0.0, merged 2026-04-26). 16 commits, +1700 LOC. resolveMonth 3-tier fallback + month-routing.ts + path-seed-shape walker + DB integration suite. 2 slices × 4 rounds cross-model review + 3 rounds PR bot.
  - PR #30 (copy de-slop Slices 1–4 + GPA recovery bug fixes, v0.6.2.1, merged 2026-04-22).
    28 files, 1000+ insertions. Questionnaire step subtitles, trait quiz UI, gap
    recommendations, gaps/complete page terminology. Added 4 copy-quality test suites
    (514 tests total). Fixed 3 GPA no-data recovery correctness bugs found during bot
    review rounds: rank students getting wrong field guidance, international students
    directed to nonexistent 备注 field, unknown-gpaType fallthrough implying only
    百分制 accepted. 4 bot review rounds (Gemini R1–R4 + Codex R1–R4, N/N PASS R4).
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

**2026-05-01** — Polish sprint + IDOR closure (v0.9.0.0), branch
`fix/polish-sprint-p2` @ `512577d`, ready to ship:
- `npm test`: 753 / 753 green (31 files, +20 net since v0.8.0.0). New
  coverage on `radar-utils` `buildRadarDimensions` (skip-reason branching),
  `student-token` round-trip integration via `questionnaire-actions`,
  block-shape walker per-item field validation (`route.steps[]`,
  `photo-row.photos[]`, `path-opts.opts[].locCards[]`), and the
  `clearStudentSession` server action.
- 7 rounds of cross-model adversarial review: R1 (3 Claude subagents +
  Gemini outside voice), R2 (regression fence + saveStudentId logging),
  R3 (Codex caught 4 cross-section findings — including 1 R1-introduced
  drift), R4 verification, R5 (Codex + Claude adversarial converged on
  the write-side IDOR; closed with HMAC-signed cookie), R6 (3 reviewers
  converged on read-side IDOR at `/complete/gaps`; closed with
  cookie-only studentId read), R7 (Codex final clean PASS).
- Trust boundary moved server-side: questionnaire write authorization is
  no longer "client claims studentId" but "server's HMAC verifies cookie".
  URL leakage of `?studentId=X` is now harmless. `STUDENT_TOKEN_SECRET`
  required in prod (server refuses to boot without it); dev falls back
  to a banner-warned constant.
- Cross-system consistency fix: `sat.ts` and `act.ts` gap dimensions now
  skip both `testPolicy === "free"` and `"blind"` (matched what the radar
  page already did, closing a R3 cross-section finding).

**2026-04-30** — Trait Quiz v0.6 (30-Q Likert, Thomas & Chess 9 dims),
branch `feat/trait-quiz-v06` @ `86f339d`, ready to ship:
- `npm test`: 733 / 733 green (31 files, +156 net since 0.7.0.0). 7 new
  test files in `src/lib/traits/temperament/__tests__/` covering: 30-Q
  schema + reverse-key polarity, score-encoding round-trip + CRC-8
  tamper detection, hero classification cutoff boundaries (incl.
  lowConfidenceFlag thresholds), `quantizeDimScores` invariant
  (live profile === decoded URL profile for every reachable answer set).
- Real-device E2E across `vela.akbot.top` (named cloudflared tunnel
  `vela-mba`) on iPhone Safari — Reality TUN MITM previously broke
  cloudflared TLS to argotunnel edge; resolved with `--edge IP:7844`
  flags + Clash IP-CIDR DIRECT rule for `198.41.192.0/24` (logged in
  `reference_cloudflared_clash_mitm_workaround.md`).
- UX surfaced from real-device run: (a) auto-advance after first-time
  Likert pick (250ms) — re-pick after 上一题 nav does NOT auto-advance,
  last question never auto-advances; (b) redundant dim transition
  banner removed (DimProgress already shows the dim).
- Bot review: 3 rounds Codex + Gemini. R1 caught Critical math drift
  (live result used `Math.floor`, URL-decoded path used `Math.round` →
  off-by-one hero on edge scores). R2 caught polarity inversion on
  adaptability + distractibility (reverse-keyed items not flipped).
  R3 closed with 4 P2 items addressed.
- Score URL invariant verified: `/trait-quiz/result/<8-char-code>`
  decodes deterministically across schema/cutoff version bumps via
  `cutoffHistory` ledger. CRC-8 mismatch → branded error boundary, not
  a silent wrong profile.

**2026-04-25** — Path Explorer v0.2 (multi-month routing + G1 June seed),
branch `feat/path-v0.2` @ `02596b5`, ready to ship:
- `npm test`: 577 / 577 green (30 files, +63 net since 0.6.2.1). New:
  `month-routing.test.ts` (33 tests covering 3-tier fallback,
  unsorted-array safety, range [1,12], boundary 1/12, decimal /
  leading-zero / `"foo"` rejection), `path-seed-shape.test.ts` (29
  tests including the recursive block walker), and
  `path-seed-integration.test.ts` (9 DB-level tests catching schema
  drift, JSON round-trip, idempotency by row-id stability, and the
  multi-stage runtime guard with a no-DB-writes assertion).
- DB verified: `bun run db:seed` → 9 activities total (5 May + 4 June),
  all under stage `g1-to-g3-foundation` and goal
  `g1-g3-observation-culture-foundation`. seed.ts now merges month
  seeds by goal+activity slug and throws on multi-stage drift.
- Routing verified manually:
  - `/path` (today is April) → falls through to nearest upcoming = May.
  - `/path?month=5` → May (5 cards), `/path?month=6` → June (4 cards).
  - `/path?month=99` and `/path?month=foo` → branded 404.
  - June pill renders as `<Link>` (seeded), other months as disabled
    `<button>` (ghost). Active pill is `<span>` with `aria-current="page"`.
- Review process: 2 slices, each 4 rounds of cross-model review (3 ×
  Claude subagent + 1 × Codex per round, parallel dispatch). Slice 1
  closed at R3 with 4/4 APPROVE; Slice 2 closed at R4 with 4/4 APPROVE
  after Codex caught a `resolveMonth` semantic bug (returning
  `Math.max(...availableMonths)` when current month wasn't seeded —
  meant April→June instead of April→May) all 3 Claude subagents missed.
- Real safety bugs caught + fixed during review: 赤链蛇 wrongly labeled
  "无毒" (Lycodon rufozonatus is rear-fanged with documented Chinese
  fatality cases — fixed to "有轻微毒性 + 唾液菌群"). DEET advice was
  inverted ("成人版别给小孩用" — actually DEET has child-strength
  formulations; restriction is OLE/PMD < 3yr per CDC + AAP).
  雄黄 contradiction: labeled as 含砷矿物粉 yet still in the buy/touch
  list — moved to "看图认识就行" with a thermal-decomposition rationale.

**2026-04-22** — Full-app Chinese copy de-slop across 4 slices, merged to main (PR #30):
- 514 / 514 tests green (27 files, 2.6s). 4 new test files created
  (`copy-quality-slice1-4.test.ts`), 3 pre-existing dimension unit test
  files updated to sync with new recommendation copy.
- **Slice 1** (landing, path, interest form, error page): replaced AI 驱动
  subtitle with specific value prop; fixed baseline ·/活动卡 label in tally;
  removed 点击进入 no-op CTA; fixed 单独联系你 → concrete success copy;
  replaced generic 卡片列表 with 5 月卡片.
- **Slice 2** (gap recommendations): replaced 优势项/加分项 slop tails on
  all excellent/green templates with actionable dimension-specific copy;
  removed 数据库/后续版本/Phase 2 backend leaks from school-missing-data
  and international no-data branches; fixed gpa:red vague 升学规划调整;
  fixed sat/act test-free "不影响你的申请" claim; removed 年级排名 dead end
  from gpa:no-data default; anchored prevet 100h with 主流兽医学院申请建议.
- **Slice 3** (trait quiz UI): removed 专属的/专属 buzzwords; replaced 了解
  孩子的特质 (over-promises trait theory) with 兴趣和学习风格; replaced
  规划路线图 (implies deep custom generation) with 活动建议; replaced 由
  Vela 提供 footer with Vela · 特质测评.
- **Slice 4** (questionnaire steps + regression fix): replaced 每个孩子都有
  闪光点 slop subtitle on academic step; replaced filler step 1 and step 5
  subtitles with functional copy; fixed intro 可执行的 → specific 各学校的
  录取差距报告; fixed complete page presumptuousness. Regression: gaps/page
  was checking r.action.includes("不要求") which Slice 2 changed to "非必须"
  — test fence added, fix deployed.

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
- `recommendations.ts` copy nits from M4 resolved in v0.6.2.1 PR #30
  (数据库 + tone softening addressed in Slice 2).

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
  Awaiting brand decision. Note: trait quiz v0.6 already migrated muted
  text to `#6B6560` (5.45:1); Path Explorer scope still pending.
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

**Path Explorer v0.3+ (issue #25, future branch):**
1. v0.2 already ships May + June. Next: decide whether to extend G1–G3
   into July/August (summer break has different observation surface) or
   to start a second stage (G4–G6) earlier — depends on whether Kailing
   tests v0.2 against the same child or shifts to peer feedback.
2. Address v0.2 cross-review deferrals tracked in TODOS.md:
   - Tighten the block-shape walker for `route` / `photo-row` /
     `path-opts.opts[].locCards` per-item field checks (currently outer-array only).
   - `PathInterest.month` schema column for sign-up attribution. Today
     `canonicalSourcePath` strips queries, so `/path?month=5` vs
     `/path?month=6` signups are indistinguishable. Land with the third
     month seed or alongside the v0.5+ UA retention privacy posture work.
3. Address remaining v0.5+ deferred items as they become blocking
   (CSP + sanitization for BlockRenderer, PathInterest UA retention,
   PathDecisionBranch FK integrity).

**Trait quiz next (issue #24 closed by v0.8.0.0):**
1. ~~v0.5 insight + portrait copy de-slop~~ DONE in v0.6.2.0.
2. ~~v0.6 scientific trait quiz: replace DIY 10-q with Temperament~~ DONE
   in v0.8.0.0. Thomas & Chess 9-dim Likert + 4-class hero shipped.
3. Phase 2 persistence (Prisma TemperamentResult) after Kailing real-use
   feedback. Score URL is already self-contained, so persistence is
   strictly additive (history list, retake comparison, parent-side dashboard).
4. Optional v0.6.x: 4-class hero copy expansion to 3-N variants per class,
   seeded selection by score. Same pattern as the deferred trait insight
   pool. Wait for signal before investing.

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
