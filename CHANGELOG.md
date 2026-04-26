# Changelog

All notable changes to this project will be documented in this file.

## [0.7.0.0] - 2026-04-26

### Added
- **Path Explorer v0.2 — multi-month navigation** (`/path?month=N`). The overview pill row is now month-aware: each pill is a real `<Link>` for seeded months, a disabled `<button>` for ghost months, or a non-interactive `<span>` for the active month. The default route picks the current calendar month if seeded, else the nearest upcoming seeded month, else the most recent past one. Bad params (`?month=99`, `?month=foo`) get a branded 404; unseeded dev DBs still surface the "PathStage 未 seed" warning instead of a dead 404.
- **G1 六月内容 — 4 卡** (1 月度 baseline + 3 event 卡 covering 端午 3 天假期, 入梅家门口生态, 夏至萤火虫). Card count is content-driven, not padded to 5: 芒种节气 + World Oceans Day were evaluated and intentionally cut. Theme: 雨季观察家.
- **Per-month theme map** in the overview H1 — May = 小小动物科学家 (preserved), June = 六月雨季观察家. Future months either land in the map or render the generic G1 月度小路径 fallback. Closes the v0.1 cross-month theme leak where the May theme silently rendered on every month.
- **Block-shape walker test** (`src/__tests__/path-seed-shape.test.ts`) — recursive runtime validator that walks every block in every section across all month seeds. Asserts per-discriminator field shape so `id-table` / `steps` field-name drift fails at test time, not at render.
- **Same-shape regex guard** in `copy-quality-slice1.test.ts` — blocks any future hardcoded `[0-9]+\s*月卡` from re-entering the form copy.
- **DB integration test suite** (`src/__tests__/path-seed-integration.test.ts`) — 9 tests against a real Prisma + SQLite test DB. Covers schema drift, FK / @@unique violations, JSON column round-trip (previews / chips / sections), idempotency via row-id stability (not just count), and the multi-stage runtime guard with a no-DB-writes assertion. Catches what the static walker can't: anything that only surfaces at write time.
- **Wikipedia Commons CC-licensed photos for G1 June cards** (7 new images: snail, earthworm, frog, mugwort, sweet_flag, zongzi, firefly). Filename → license info in `public/assets/img/species-info.txt`. Tile previews now visually match May.

### Changed
- **Detail-page back button + Esc shortcut** preserve the activity's month (`/path?month=${activity.month}`) so multi-month routing doesn't strand users on a different month after returning.
- **CTA form + empty-state copy** on `/path` are now month-agnostic ("下次更新发你" / "当月卡片"). Previously hardcoded to "6 月卡出来" — accurate in v0.1 (May only) but nonsensical when the user was already on /path?month=6.
- **`error.tsx` and `not-found.tsx`** copy updated to "当月卡片" so error recovery doesn't promise a specific month it can't guarantee.
- **`prisma/seed.ts`** merges all month seeds (`G1_MAY_SEED` + `G1_JUN_SEED`) by goal slug + activity slug. Adds a runtime guard that throws when seeds reference more than one stage, so a future seed can't silently route purges under the wrong stageId.

### Fixed
- **`resolveMonth` nearest-upcoming fallback** — was returning `Math.max(...availableMonths)` when current month wasn't seeded. Today's date (April) with [May, June] seeded was defaulting to June; now correctly defaults to May (the imminent month). Three-tier fallback: current → nearest upcoming → max past.
- **`aria-current="true"` → `"page"`** on the active stage tab. `"true"` is invalid for nav landmarks per WAI-ARIA; the active stage now reads correctly to screen readers as the current item in a navigation set.
- **赤链蛇 safety advice** — was wrongly described as "无毒" (which is dangerously incorrect: Lycodon rufozonatus is rear-fanged with documented Chinese fatality cases). Updated to "有轻微毒性 + 唾液菌群易引起感染，看到立即拉开距离，被咬就医."
- **DEET 防蚊液 advice** — was inverted ("成人版别给小孩用"). DEET has child-strength formulations; the actual restriction is OLE/PMD < 3yr per CDC + AAP. Replaced with concrete concentration thresholds (DEET ≤ 30%, 派卡瑞丁 ≤ 20%).
- **雄黄 safety contradiction** — labeled it as 含砷矿物粉 but still said "让孩子摸 / 闻 / 认". Removed from the buy/touch list; new framing is "看图认识就行" with a thermal-decomposition + inhalation-accumulation explanation.
- **`resolveMonth` reads current month in Asia/Shanghai** (was server local time). On UTC-served deployments (Vercel/Cloudflare default), the previous helper had an 8-hour window each month boundary where the server returned the previous month while it was already the new month in Shanghai. The Kailing seed user opens `/path` late at night on the 30th/31st — exactly her edge case. Fixed via a `currentMonthShanghai()` helper using `Intl.DateTimeFormat`.
- **`searchParams` typed honestly as `string | string[]`** (Next 16 reality). URL like `/path?month=5&month=6` arrives as an array at runtime; previously coerced to "5,6" and 404'd. Now normalized at the call site to take the first value, matching Next.js's single-value-param convention.

### Tests
- 577/577 vitest passing (30 files, +63 net since 0.6.2.1).
  - `month-routing.test.ts`: 33 tests covering 3-tier fallback, unsorted-array safety, regex int-only validation, range [1,12], boundary months 1/12, edge cases like "00"/"01"/decimal strings.
  - `path-seed-shape.test.ts`: 29 tests including the recursive block walker. Covers per-month invariants (single month per seed, slug uniqueness, all required fields, asset-file existence) and cross-month invariants (globally unique activity slugs, identical-content shared goals, May+June both covered, single stage assertion).
  - `copy-quality-slice1.test.ts`: updated to lock the new generic copy and guard against future month-hardcode regression.
- DB verified: `bun run db:seed` → 9 activities (5 May + 4 June, all under stage `g1-to-g3-foundation` and goal `g1-g3-observation-culture-foundation`).

### Process
- v0.2 was developed under the autonomous TDD loop ([[tdd-autonomous-dev]] in the cross-project wiki): 2 slices (routing + content), each through 4 rounds of cross-model review (3 × Claude subagent + 1 × Codex per round). Each fix round ran a same-shape sweep before the next dispatch. Slice 1 closed at R3 with 4/4 APPROVE; Slice 2 closed at R4 with 4/4 APPROVE after Codex caught a routing fallback semantic bug all 3 Claude subagents (and the prior Slice 1 rounds) missed.

### Deferred
Tracked in TODOS.md under "Deferred from Path Explorer v0.2 cross-model review (2026-04-26)":
- Block-shape walker tightening for `route` / `photo-row` / `path-opts.opts[].locCards` per-item field checks (currently checks outer array shape only).
- `PathInterest.month` schema column for sign-up attribution (the in-form sourcePath approach was rolled back because `canonicalSourcePath` strips queries by design).
- `resolveMonth` cross-year fallback (Codex PR R3 P2). Today's seeded set [5, 6] doesn't trigger it; manifests when v0.3+ ships year-wrap content (e.g. December current with [1, 2] seeded). Algorithm fix recorded: replace strict `m > current` filter with min-absolute-distance-with-wrap, tie-break preferring forward.

## [0.6.2.1] - 2026-04-21

### Changed
- **Copy de-slop pass across 4 slices** — removed AI slop, zero-information filler, and overclaimed causality from user-facing Chinese strings across the trait quiz, questionnaire, gap report, and path explorer flows. Applied three quality standards: data correct, reasoning valid, no zero-information sentences.
  - **Questionnaire step subtitles** — "让我们先了解一下基本情况" (step 1), "每个孩子都有闪光点" (step 3), "我们来看看孩子的特长和爱好" (step 5) replaced with functional copy that states what the step is for. Step 3 now reads "这帮我们准确比对目标学校的成绩要求."
  - **Trait quiz UI** — "专属的分阶段规划路线图" and "了解孩子的特质" removed; quiz is a 24-route lookup table, not a bespoke plan. "学习风格" removed (VARK/Kolb excluded by project direction; quiz measures interest + learning drive, not modality preferences). Welcome subtitle now reads "了解孩子的兴趣和成长特点". Insight component transition text pinned to "接下来几个问题关于孩子的学习方式".
  - **Gap recommendations** — `recommendations.ts` rewritten for all 5 dimensions (GPA, SAT, ACT, pre-vet experience, no-data branches). SAT/ACT red-path action now goal-oriented: "建议以提至 25 分位以上为近期备考目标" (previously assumed method and frequency). Comment on `"international"` reason updated from placeholder "Phase 2 TBD" to "GPA conversion deferred."
  - **Questionnaire intro/complete/gaps pages** — "可执行的" filler adjective removed; "匹配分析" unified to "差距分析" for terminology consistency. Gaps page pill-text logic and regression fence updated for Slice 2 "非必须" copy (replaces deprecated "不要求").
  - **Result page + goal screen** — "由 Vela 提供" footer removed (zero information). Goal confirmation copy trimmed to "选择后可以让建议更具体". No-localStorage banner simplified from "想获得个性化画像？" to "想看孩子的画像？".

### Tests
- Copy-quality test suites (Slices 1–4) extended with 8 new `describe` blocks and tightened existing assertions:
  - Slice 2: yellow overclaim, section-prescription, fallback precision, threshold-copy checks, terminology consistency.
  - Slice 3: "学习风格" VARK/Kolb guard, welcome subtitle info-density check.
  - Slice 4: step-3 subtitle strengthened from weak regex to `toContain` on exact copy; `未公布` dead-branch regression fence added.
- `sat.test.ts` + `act.test.ts`: test name corrected from "不要求 copy" to "非必须 copy" to match current recommendation text.

### Notes
- All copy changes went through a 3+1 adversarial cross-review (3 Claude subagents: slop/tone A1, reasoning/causal A2, data-correctness A3; plus Codex structural). N/N PASS achieved in round 3 after 9 total fixes across rounds 1–3.
- Intentionally deferred: `r.action?.includes("非必须")` coupling in gaps/page.tsx is kept and guarded by Slice 4 tests; pre-vet threshold copy uses practical proxy benchmarks (not claimed as official undergrad standards); "可匹配" tier label is a design system decision.

## [0.6.2.0] - 2026-04-20

### Changed
- **Trait quiz copy rewritten** — both the mid-quiz insight card (shown after Q3) and the result-page portrait paragraph no longer read like AI-generated placeholders. Chinese parents now see observations that sound like a real person describing their specific child, with concrete behavioral anchors instead of generic praise.
  - Mid-quiz insights: 12 of the 12 branch-specific lines rewritten. Every line used to open with "看起来..."; now openings vary (scene / subject / object / temporal). Placeholder vocabulary ("充满了好奇心" / "很有天赋" / "独特的") replaced with observable actions ("蹲下去看半天", "拆了装、装了拆", "一关一关打过去", "翻翻书、捏捏泥、画几笔"). Length capped at 35 CJK chars, test-enforced across all 12 keys.
  - Result-page portrait descriptions: 12 interest descriptions + 3 learning-drive descriptions rewritten with the same discipline. Deficit framing removed (e.g. the earlier "线下还没找到" was premature-diagnostic and parent-alarming; now reads as a balanced "屏幕里熟、线下也在接触"). Anchor overlaps between trait branches eliminated so the 12 portraits actually feel distinct when parents compare notes.
  - Fallback paragraph (shown if an out-of-flow caller ever hits an unmapped combo): no longer "他的兴趣还在浮现，轮廓会越来越清楚" (AI metaphor slop) — now the factual "这几题还没拼出完整画像，再答几题会更清楚." The code comment around the fallback was also corrected: the previous claim that it was unreachable (implying `??` branches only existed as future-proofing) was wrong — Zod validates each trait field's enum but not the (interest, interestDetail) combination.

### Fixed
- **Insight length invariant was silently drifting.** The comment in `src/lib/traits/insights.ts` claimed "each line under 30 CJK chars (test-enforced)", but the test only spot-checked one key (`stem:builder`). After the rewrite two lines had grown to 32 chars undetected. The test now checks all 12 keys and the header comment reflects the real 35-char limit.

### Notes
- Both copy slices went through adversarial review loops before landing: Slice 1 (insights) converged in round 6, Slice 2 (portraits) in round 7. Each round was 3 Claude subagents (specialized in slop-pattern detection / tone calibration / info-density) plus Codex, all running in parallel. Reviewers found real issues every round up to convergence, including one late-round Codex catch of an "积木" overlap with a quiet-branch quiz stem in `questions.ts`.

## [0.6.1.0] - 2026-04-20

### Fixed
- **Horizontal overflow on narrow phones** — the Path Explorer overview no longer scrolls sideways on viewports where a long word or image would have pushed content past the viewport edge. Affects 320–360px widths (iPhone SE, some Androids) in particular.
- **Back-navigation scroll position** — tapping a card, reading it, and going back (browser back or the in-page "5 月" button) now returns parents to the exact scroll position they left from, not the top of the list. Important for parents scanning 5+ cards.
- **Chinese grade labels on stage tabs** — the stage tab row now reads "一~三年级 / 四~六年级 / 初中" in Chinese sans font instead of "G1–G3 / G4–G6 / G7–G9". Kailing flagged the English-prefixed version as noisy for Chinese parents.

### Changed
- **Single source of truth for the vela stylesheet** — `public/assets/vela.css` is now a symlink to the repo-root `assets/vela.css` so demo HTML files and the live Next.js app always ship the same bytes. Future CSS edits go to the repo-root copy and propagate automatically.

### Notes
- Scroll-restore (`PathOverviewScrollRestore`) went through three rounds of cross-model adversarial review (Claude subagent + Codex, parallel). Round 1 caught sessionStorage-throw deadlocks, smooth-scroll bypass leaks, and flush-on-unmount misses. Round 2 caught a too-permissive beacon (deep-link to detail then back would teleport to stale scroll) and a detached-element flush that wrote 0 to storage. Round 3 caught cmd/shift/ctrl-click leaking the departure flag when the user opens a card in a new tab and stays on /path. All converged findings fixed and verified in preview.
- A deferred P1 is recorded in `TODOS.md`: the CTA form's primary contact channel will switch from email to WeChat ID / phone for mainland parents (Kailing post-ship feedback — email opens poorly in China).

## [0.6.0.0] - 2026-04-19

### Added
- **Path Explorer v0.1** at `/path` — Chinese parents can now browse a month of hands-on activity cards for G1–G3 children under the 小小动物科学家 (little animal scientist) theme. 5 May cards: 1 baseline (月度基本盘) + 4 event cards (上海自博物馆线路 / 海洋馆线路 / 小故事 / 产出). Each card shows an intro with chips + trigger + time pacing, then 2–5 themed sections rendered from 17 block types (paragraph, triad, route, trivia, callout, callout-trio, path-opts, sub-block, list-check, list-bullets, photo-row, id-table, steps, philosophy, sources, aside-note). Deep-linkable: `/path/{slug}`.
- **Data model**: 6 new Prisma models — `PathStage`, `PathGoal`, `PathActivity`, `PathDecision`, `PathDecisionBranch`, `PathInterest`. Schema supports both monthly activity cards (current) and future college-decision cards for the same longitudinal user journey. Cuid IDs, `onDelete: Cascade`, composite uniqueness on email+sourcePath for interest dedup.
- **CTA form** — parents leave email + optional grade to get future months. POST `/api/path/interest` validates via Zod, upserts idempotently, scrubs error details in prod. Client-side email regex prevents round-trip typos.
- **Interaction polish** — sub-nav with scroll-spy across 2–5 section pills, species-photo lightbox with focus trap + safe-area-top respect, keyboard (←/→/Esc) + touch-swipe navigation between cards, Web Share API + clipboard fallback (WeChat-webview detection + iOS Safari `execCommand` legacy path), `<main>` landmarks + skip-to-content links + `:focus-visible` keyboard rings + `prefers-reduced-motion` honored throughout.
- **100 regression tests** for `canonicalSourcePath` — the security boundary that canonicalizes user-supplied `sourcePath` before it hits the `(email, sourcePath)` unique key. Covers 15 rounds of pre-ship hardening + 3 rounds of PR bot review: NFKC normalization, multi-pass percent decoding with per-segment fallback, dot-segment resolution, confusable-separator folding (backslash, full-width, FRACTION/DIVISION SLASH, math/box-drawing slashes), `\p{Default_Ignorable_Code_Point}` strip (SOFT HYPHEN, ARABIC LETTER MARK, bidi isolates, TAG characters, variation selectors, Hangul fillers, musical invisibles), DoS iteration cap (loop bounded at 10 passes — converges on legitimate nested encoding, rejects adversarial input), and in-loop strip ordering that defeats invisible-smuggled percent sequences (e.g. `%2\u200BE` can no longer slip a literal `%2E` past the decoder).
- **Brand-styled 404 + error pages** at `/path/not-found` and `/path/error` — Chinese copy ("这张卡找不到了" / "加载出了点问题") with return + retry actions, replaces Next.js's English defaults for stale share links.
- **iOS safe-area support** via `viewport-fit=cover` on the root viewport meta so `env(safe-area-inset-*)` returns non-zero on notched iPhones; detail-page toast, footer, and lightbox close all compensate for home indicator + notch/Dynamic Island.

### Changed
- **WCAG 2.5.5 AAA tap targets** across every interactive element on `/path/*` — icon buttons (34→44px), back button (+padding), lightbox close (40→44px + safe-area-top), interest form input/select/submit (+min-height 44px), trivia summary disclosure (40→44px). All meet Apple HIG + AAA.

### Notes
- Path Explorer v0.1 went through 15 rounds of pre-ship adversarial cross-model review (3 Claude subagents + Codex in parallel) and 3 rounds of PR bot review (Gemini across R1–R3 on PR #27). 12 convergent findings were fixed across the cycle: Prisma `upsert` composite-key bug (replaced with create-then-update-on-conflict pattern), missing `public/assets/img/` production assets, ShareButton unmount timer leak, path-detail-nav pinch-zoom multi-touch guard, `handleWriteFailure` prod log visibility, path-sub-nav scroll-spy DOM-lookup perf (cache sections at effect setup) + stale-key bug (include `activitySlug` in dep), and the `canonicalSourcePath` smuggling + DoS hardening.
- Deferred P2 items tracked in `TODOS.md`: `--mute-2` color contrast brand decision, `/schools` landscape safe-area edge, `error.tsx` dev-mode error display.

## [0.5.0.1] - 2026-04-18

### Added
- **Path Explorer v0.1 source manifest** (`docs/research/path-explorer-sources.md`) — internal research artifact for upcoming pre-vet literacy feature. Curated 3-school shortlist across two categories (foreign-only + bilingual) and three tiers (top / top-mid / mid), documents selection criteria, research schema for content authoring, and supplementary Shanghai-native sources. All 18 referenced URLs verified via WebFetch/WebSearch before shipping.

### Changed
- **CLAUDE.md synced from `template-workflow-base`** and extended with 12 accumulated project preferences exported from `/gstack-learn` (communication style, content quality standards, engineering workflow rules). Affects how AI agents interpret future work; no behavior change for shipped code.

### Notes
- Internal planning and meta-documentation changes only; no user-facing changes.

## [0.5.0.0] - 2026-04-14

### Added
- **Trait assessment quiz** at `/trait-quiz` — 10-question branching assessment that builds a personality portrait and staged growth roadmap for children aged G1-G9. Pure frontend (no database), localStorage draft persistence, auto-advance with back navigation
- **24 predefined routes** covering 3 age groups × 4 interest areas × 2 resource levels, each with 3 life stages of actionable recommendations and fact-check annotations
- **Mid-quiz insight card** — personalized feedback after Q3 (e.g., "看起来孩子是一个对动物很有爱的小观察者") to build trust during the assessment
- **Result page** with portrait hero, expandable stage cards, and goal confirmation (前30/前50/还没想好)
- **Homepage dual entry** — "特质测评" (NEW badge, primary) alongside existing "问卷评估" and "浏览学校"
- 49 unit tests covering route matching (24 combos), portrait generation (12 titles), insight text (12 strings), question flow (all branching paths), and route data integrity

### Changed
- Homepage layout updated from 2-button to 3-button with trait assessment as primary CTA

### Fixed
- Timer race condition: back button now cancels pending auto-advance timers and is disabled during transitions (4 rounds of bot review)
- Route lookup guards against prototype keys (`__proto__`, `constructor`)
- Result page validates localStorage answers against current routeId with Zod schema
- Draft restore validates questionId against computed flow, resets cleanly on invalid draft
- Tailwind duration classes use arbitrary value syntax (`duration-[400ms]`)
- Accessibility: aria-hidden on decorative emoji, aria-label on verified markers, contrast fixes for chevron and muted text

## [0.4.0.2] - 2026-04-13

### Fixed
- Questionnaire submission now uses `prisma.$transaction()` to make student upsert and questionnaire result creation atomic. Previously a failure on `QuestionnaireResult.create` could orphan a student record.

### Changed
- Extracted shared `studentData` object to deduplicate field lists between update and create paths in `submitQuestionnaire`

## [0.4.0.1] - 2026-04-13

### Added
- Branded error boundary pages for `/schools` and `/schools/[id]` with retry button and Chinese copy
- Loading skeleton for `/schools` list page with card grid placeholders
- Not-found pages for `/schools` and `/schools/[id]` with navigation back to list/home

### Fixed
- `current-state.md` HEAD reference updated from `26f63eb` to `d84f0ab`

## [0.4.0.0] - 2026-04-12

### Added
- **Gap analysis page** at `/questionnaire/complete/gaps` — the first user-visible surface consuming the gap engine. Server component renders school cards organized by match/reach/possible tiers with color-coded severity pills and expandable detail sections
- **5-level severity system**: new "excellent" level (gold `#E9C46A` with ★) for scores far above target. Thresholds: GPA avgGPA+0.3 (capped at normalize ceiling), SAT 75th+0.5×IQR (capped at 1600), ACT 75th+0.5×IQR (capped at 36), pre-vet ≥150h. GPA excellent guarded against collapsed threshold when avgGPA ≥ ceiling. Yellow updated to deep gold-yellow `#B5942D`, red to muted brick `#A63D40`
- **Test-free dimension branches**: SAT/ACT dimensions return "该校不要求" copy when `school.testPolicy === "free"`, via new `reason: "test-free"` in recommendation templates. Fires regardless of whether score data is populated
- **Tier classification engine** (`src/lib/gap/classify.ts`): proportion-based rules (positive/comparable ≥ 60% → match, red/comparable ≥ 50% → reach). Excludes no-data from denominator, fixing test-free school bias and dimension-count inequality
- **studentId pass-through**: gap page uses `studentId` (not `name`) as lookup key. Review page redirect now includes `studentId` in URL
- **Loading skeleton** for gap page server component
- **Partial data prompt**: banner when >50% dimensions are no-data, linking to questionnaire edit

### Changed
- `GapSeverity` type expanded from 4 to 5 levels: `"excellent" | "green" | "yellow" | "red" | "no-data"`
- Complete page: placeholder "差距分析报告将在后续版本推出" replaced with "查看差距分析 →" link
- Gap severity yellow: `#E9C46A` → `#B5942D` (deep gold-yellow). Red: `#E63946` → `#A63D40` (muted brick). All gap colors extracted to CSS theme tokens (`bg-gap-*`, `text-gap-*`)
- Tier sort uses positive ratio (not absolute count) to avoid test-free school bias in top-3 display

### For contributors
- New files: `src/lib/gap/classify.ts`, `src/lib/gap/__tests__/classify.test.ts`, `src/app/questionnaire/complete/gaps/page.tsx`, `src/app/questionnaire/complete/gaps/loading.tsx`
- Excellent thresholds and test-free branches in all 4 dimensions (sat, act, gpa, prevet-experience)
- 282 tests passing (was 255). New tests cover excellent severity (with ceiling cap regression fences), test-free branches, tier classification, GPA collapsed threshold guard
- After merging, run `npm run db:reset` to sync your local `dev.db`

## [0.3.4.0] - 2026-04-12

### Added
- 14 new AAVMC-accredited universities added to the school catalogue, covering the major US public research universities with veterinary programs: Auburn, Iowa State, UIUC, Kansas State, LSU, Minnesota, Mississippi State, Missouri, NC State, Oklahoma State, Oregon State, Tennessee, Virginia Tech, and Washington State
- School count expanded from 12 to 26, covering all Tier A (major public) AAVMC vet school host universities. Data sourced from CDS 2024-2025 PDFs where available, supplemented by CDS-derived web sources for schools with inaccessible PDFs (Oklahoma State, Mississippi State, Missouri)
- Washington State correctly identified as test-free (3rd test-free school alongside UC Davis and Colorado State). Tennessee identified as the only test-required school in the database
- Each new school includes full provenance: `dataSource`, `dataSourceUrl`, `dataSourceRetrievedAt`, `testPolicy`, `needBasedAidPct`, and AAVMC classification

### For contributors
- Seed data: 14 new school entries in `prisma/schools-data.ts` (~670 new lines)
- Test minimum count bumped from 10 to 26 in `seed-data.test.ts`
- After merging, run `npm run db:reset` to sync your local `dev.db`

## [0.3.3.0] - 2026-04-12

### Changed
- All 12 schools re-verified against CDS 2024-2025 PDFs downloaded from each university's institutional research office. Acceptance rates, SAT/ACT percentiles, GPA, international student %, and cost of attendance updated to the 2024-2025 admissions cycle
- UC Davis and Colorado State are now correctly marked as test-free (`testPolicy: "free"`). Their SAT/ACT fields are null because these schools genuinely do not consider test scores, not because we haven't collected the data
- Schools that don't report GPA in CDS (Cornell, Tufts, Texas A&M) now have `avgGPA: null` instead of estimated values. The gap engine handles this via the school-missing-data branch
- GPA values from CDS that exceed 4.0 (weighted scale) are capped to 4.0 to match the gap engine's normalization range. Original weighted values noted in source comments
- Each school now has its CDS source URL in `dataSourceUrl` (direct PDF link where available, landing page for UPenn and UW-Madison)

### Added
- `testPolicy` field on School model: "required", "optional", "free", or "blind". Distinguishes why SAT/ACT data is null (school doesn't require it vs data not yet collected)
- `needBasedAidPct` field: percentage of first-year students with financial need who received aid (CDS H2 section D/A), providing a standardized comparison metric alongside the broader `financialAidPct`

### For contributors
- 2 new schema fields: `testPolicy String?`, `needBasedAidPct Float?`
- Seed data integrity tests updated: testPolicy allowlist validation, test-free null consistency check, CDS-sourced retrieval date check. Test suite: 252 → 255
- After merging, run `npm run db:reset` to sync your local `dev.db`
- Two new TODOS tracked for M4: radar chart null-SAT rendering (#radarSAT ?? 0 bug) and recommendation copy for test-free vs data-missing distinction

## [0.3.2.0] - 2026-04-12

### Added
- Every school now tracks where its data came from: `dataSource` names the source document (e.g. "CDS 2023-2024"), `dataSourceUrl` links to it, `dataSourceRetrievedAt` records when it was fetched, `lastVerifiedAt` records when a human last eyeballed it, and `dataConfidence` rates the trust level ("verified", "partial", "estimated", "unknown")
- Schools can now be classified as AAVMC-accredited vet school hosts (`aavmcAccredited`) separately from schools that just have a strong pre-vet track (`hasPreVetTrack`). A new `hasVetSchool` boolean distinguishes universities that operate their own veterinary college from pre-vet feeder schools
- All 12 existing schools backfilled with honest provenance tags: the original 3 (Cornell, UC Davis, Colorado State) marked as "CDS 2023-2024 (unverified)", the other 9 marked as "mixed / unknown" pending re-verification against authoritative sources

### For contributors
- 7 new nullable fields on the School model in `prisma/schema.prisma`: `aavmcAccredited`, `hasVetSchool`, `dataSource`, `dataSourceUrl`, `dataSourceRetrievedAt`, `lastVerifiedAt`, `dataConfidence`. All backward-compatible (nullable or with `@default(false)`)
- 4 new seed data integrity tests (AAVMC classification, dataConfidence allowlist, dataSource presence). Test suite: 248 → 252
- After merging, run `npm run db:reset` to sync your local `dev.db` with the new schema

## [0.3.1.0] - 2026-04-10

### Fixed
- Recommendation copy no longer blames students for database gaps. Before, when our database was missing a school's GPA / SAT / ACT benchmark numbers, the report would tell the student "fill in your score" — even when they already had. Now the report names the school and flags the missing data as our problem to fix. Affects GPA, SAT, and ACT dimensions (closes #9)
- Both student-side and school-side missing-data branches are individually testable now (text assertions, not just severity), and a new regression fence in the gap engine's coverage invariant locks the new templates so a future refactor cannot silently collapse them back together

### For contributors
- `buildNoData` helper signature unified across `gpa.ts`, `sat.ts`, `act.ts` to `(school, reason, current)` (Gemini round-2 review nit)
- `pre-vet-experience` dimension audited and confirmed clean — it has no school-side benchmark field, so no conflation pattern to fix
- Test suite: 245 → 248 (two new SAT/ACT edge cases for "both student and school missing → student-missing wins" + one regression fence assertion in `engine.test.ts`)

## [0.3.0.0] - 2026-04-10

### Added
- M3 Gap Analysis Engine (`@/lib/gap`): deterministic, pure-function library that compares a student profile against a university's admission data and returns a severity (green / yellow / red / no-data) plus an actionable Chinese recommendation for each dimension
- 4 v1 dimensions: GPA, SAT, ACT, pre-vet experience. Biology / animal-science students automatically get the pre-vet experience dimension without any extra configuration
- Chinese GPA normalization with percentage path (95→3.95, 90→3.8, 85→3.6, 80→3.25, 70-79→2.8, 60-69→2.3, <60→1.8) and class-rank path using an inclusive percentile formula that handles small classes correctly (first place in a class of any size lands in the top bucket)
- `analyzeStudentVsSchool` / `analyzeStudentVsAllSchools` public API at `@/lib/gap`, with deterministic school iteration order (codepoint sort on `school.id`) and per-school dimension results
- What If simulator foundation: `AnswersOverride` type lets callers override individual fields without mutating the saved questionnaire. `undefined` means "keep base value", `null` means "explicit clear" (for score wipes)
- Dimension registry pattern — adding a new dimension only requires registering it in `src/lib/gap/dimensions/index.ts`; the engine auto-picks it up via `filter(appliesTo).map(compute)`
- 16 hardcoded recommendation templates (4 dimensions × 4 severities) in `src/lib/gap/recommendations.ts` — deterministic copy that the founder can audit in a single file
- 142 new tests covering normalize boundaries, bucket transitions, small-class rank regression fences, `AnswersOverride` type-level narrowing, and a recommendation coverage invariant that fails if any (dimension × severity) loses its template. Total test suite is now 245 passing

### Fixed
- Pre-M3 GPA double-path bug: `src/app/questionnaire/actions.ts` now calls `normalizeChineseGpa()` instead of the old linear `gpaPercentage / 25` rescale. Two regression fences lock this behavior
- Class rank percentile formula: inclusive `(total - rank + 1) / total` (was `1 - rank/total`, which mapped rank `1/1` to `0` and downgraded first-place students in small classes to the bottom GPA bucket). Flagged independently by Codex, Gemini, and Copilot on PR #7

### For contributors
- Three-round bot review pipeline on PR #7 (Codex + Gemini + Copilot) with all findings either fixed, documented as deliberate tradeoffs in-code, or tracked as follow-ups
- Inclusive rank percentile formula tradeoff documented in `src/lib/gap/normalize.ts` so the next reviewer sees the rationale directly (small-class correctness vs large-class boundary drift bounded by `1/total`)

### Out of scope (follow-ups)
- Gap dump page (`complete/gaps`) — next PR on `feat/m3-gap-dump-page`
- School-side vs student-side missing-data copy split — #9 (M3.5)
- English / Budget / Science-GPA dimensions — v2 after 陪课
- What If simulator UI — M4

## [0.2.1.0] - 2026-04-09

### Fixed
- International-school students no longer see a false-positive "缺少 GPA" warning on the review page; the missing-information rule now branches on school system so IB/AP/A-Level students are graded on curriculum type instead of a GPA their system doesn't produce
- Reloading the questionnaire immediately after clicking "下一步" or "上一步" now lands on the correct page instead of bouncing back to the previous step

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
