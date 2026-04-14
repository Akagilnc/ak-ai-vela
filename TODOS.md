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

### ~~[P2] Add error/loading/not-found pages for school routes~~ DONE
- **Status:** Completed in v0.4.0.1 (PR #21). Added `error.tsx`, `loading.tsx`, `not-found.tsx` for `/schools` and `error.tsx`, `not-found.tsx` for `/schools/[id]`. Chinese copy, brand styling, retry button on error boundaries.
- **Completed:** v0.4.0.1 (2026-04-13)

## P2 — Do when the prerequisite is met

### [M2] ~~Seed script safety: split db:seed and db:reset~~ DONE
- **Status:** Completed in feat/m0-scaffold (commit a8531c2).
- **What was done:** `db:seed` now upserts schools only, `db:reset` does full wipe + reseed via `--reset` flag.

### ~~[P2] Create docs/current-state.md~~ DONE
- **Status:** Completed in `chore/docs-current-state` branch (2026-04-12).
  Covers MVP semantics, active branch/PR state, latest verification, blockers, and next-step recommendations per CLAUDE.md §长期状态文档.

### ~~[P2] Wrap student upsert + questionnaire result in Prisma transaction~~ DONE
- **Status:** Completed in v0.4.0.2 (PR #22). `submitQuestionnaire` now wraps `findFirst` + `update`/`create` + `questionnaireResult.create` in `prisma.$transaction()`. Shared `studentData` object extracted. 283 tests pass including atomicity regression test.
- **Completed:** v0.4.0.2 (2026-04-13)

## Deferred from Trait Assessment v3

### [P0] v0.6 特质测评科学化：用学术框架替换自造问题
- **What:** 当前 10 题是我们自己造的 quiz，用户反馈"看不出个所以然的个性"——不是文案问题，是问题设计深度和科学性不够。下个版本要用已验证的儿童心理学/发展心理学框架替换自造题目。调研并评估以下 4 个框架，选出最适合的组合：
  1. **气质理论（Temperament, Thomas & Chess）** — 9 维度气质模型，简化版分容易型/困难型/慢热型。美国儿科学会和 Zero to Three 用于儿童早期评估。
  2. **VIA 性格优势（VIA Youth Survey）** — 宾大积极心理学中心开发，24 个性格优势维度，青少年版 96 题，免费开放使用。
  3. **大五人格儿童版（Big Five for Children / BFI-C）** — 五大人格模型的儿童适配版，学术界标准，适合家长代评。
  5. **多元智能（Gardner Multiple Intelligences）** — 哈佛加德纳的 8 智能类型，家长认知度高，直接对应学业方向。
  （学习风格模型 VARK/Kolb 已排除：学术界对其有效性有争议。）
- **Why:** 用户明确反馈"这是一个严肃的事情，不是朋友圈传播的简单人格测评"。朋友圈的 MBTI 简化版都有 32 题，我们 10 题自造题无法建立信任。不造轮子，找已验证框架改编。气质理论 + 多元智能 的组合可能最合适（前者解决"孩子是什么类型的人"，后者解决"擅长什么方向"），但需要正式调研。
- **Scope:**
  - Phase 1：调研 4 个框架的学术文献、问卷版本、授权/license、题量、信效度数据
  - Phase 2：选定框架（或组合），设计适配 Vela 场景的问题集（保留分支逻辑）
  - Phase 3：前置维度介绍屏幕（让家长带地图答题），改欢迎页文案（去掉"2 分钟"，改成"你可以随时回来继续"），实现新问题集
  - Phase 4：重跑 CEO + design review，Kailing + 更多家长测试对比
- **When:** v0.6（下一个大版本）。现阶段先跑完 Phase 1 P1 文案池扩充，等 288 句内容稳定后再开始科学化改造。
- **Depends on:** v0.5.0.0（已完成）, Kailing + 朋友 更多反馈
- **Branch:** `feat/trait-quiz-v2-scientific`（待创建）

### [P1] Insight + portrait 文案去 AI slop，扩展为随机池
- **What:** 两件事。(1) 消灭 AI slop：insight 12 句话全部以"看起来"开头，portrait description 句式雷同，需要逐句重写，确保每句读起来像一个真人观察者说的话而不是 AI 生成的模板。(2) 扩展随机池：每个格子从 1 句扩展到 12-24 句，随机抽取。同一个孩子两次测评、或两个孩子对比时，看到不同表达。12 格 × 24 句 = 288 句文案。
- **Why:** "看起来" × 12 是最经典的 AI slop 句式。用户一眼就能感知到是机器生成的模板。这直接损害"我们懂你孩子"的核心体验。随机池的成本几乎为零，但用户感受天壤之别。
- **When:** Kailing 电话之后，Phase 2 之前。这比接 LLM 优先级高，因为 288 句好文案比一个 API 有用。
- **Depends on:** v0.5.0.0 (已完成)

### [P2] A11y: Fix muted text contrast in trait quiz
- **What:** Replace `#B8B0A0` (muted) with `#6B6560` (secondary text) for functional labels in trait quiz (step counter, feature badges, subtitles). Reserve `#B8B0A0` for purely decorative elements only.
- **Why:** `#B8B0A0` on cream `#FEFAE0` = 2.3:1 contrast ratio, fails WCAG AA (4.5:1 required for normal text). Design review flagged this.
- **When:** Phase 2 or next trait quiz iteration.
- **Depends on:** v0.5.0.0 trait quiz implementation

### [P2] Trait quiz Phase 2: Add persistence
- **What:** Prisma TraitResult model, server actions for submit + history, retake history UI, radar chart.
- **Why:** Phase 1 is pure frontend for content validation with Kailing. Phase 2 adds data persistence after content is validated.
- **When:** After Kailing feedback (4/16 call)
- **Depends on:** Resolve studentId stability (existing P2 TODO)

### [P3] WeChat share card for trait results
- **What:** Generate shareable image card from trait quiz results using html2canvas or server-side rendering.
- **Why:** WeChat is the primary distribution channel for Chinese parents. Deferred pending html2canvas spike (existing TODO).
- **When:** After html2canvas spike completed
- **Depends on:** html2canvas spike (existing P1 TODO), Phase 2 persistence

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

## Deferred from M3 Gap Engine (2026-04-10)

### ~~[M3.5] Separate school-side vs student-side missing GPA data~~ DONE
- **Status:** Completed in v0.3.1.0 (PR #11). Added `reason: "school-missing-data"` tag, new template branches in `recommendations.ts` for GPA/SAT/ACT, text-level test assertions, and a regression fence in `engine.test.ts` coverage invariant. `prevet-experience.ts` audited and confirmed clean (no school-side benchmark field).
- **Completed:** v0.3.1.0 (2026-04-10) — closes #9

### ~~[M3] Gap dump page (`/complete/gaps`)~~ DONE
- **Status:** Completed in v0.4.0.0 (PR #20). Full gap analysis page with tier classification (match/reach/possible), 5-level severity pills, expandable detail sections, mobile-first layout, loading skeleton. QA health score 98/100.
- **Completed:** v0.4.0.0 (2026-04-12)

### [M4] Radar chart: handle null radarSAT for test-free schools
- **What:** `src/app/schools/[id]/page.tsx:51` uses `school.radarSAT ?? 0`, rendering test-free schools (UC Davis, CSU) with SAT competitiveness of 0 ("worst") instead of "not applicable." Fix: skip the SAT dimension from the radar chart when `testPolicy === "free"` or `radarSAT === null`, and show 4-dimension radar instead of 5.
- **Why:** Codex adversarial review on PR #18 (v0.3.3.0) flagged this as silent visual corruption: "no data" rendered as "worst score."
- **When:** M4 interactive report, or earlier if schools page gets attention.
- **Depends on:** `testPolicy` field (added in v0.3.3.0)

### ~~[M4] Gap recommendation copy: distinguish test-free from data-missing~~ DONE
- **Status:** Completed in feat/m3-gap-dump-page. Added `reason: "test-free"` to `RecommendationContext`, test-free templates for SAT/ACT no-data, early-return branch in `sat.ts`/`act.ts` when `school.testPolicy === "free"`.
- **Completed:** v0.4.0.0 (2026-04-12)

### [M4] Gap recommendation copy polish
- **What:** Two defensive/tone improvements to `src/lib/gap/recommendations.ts` `school-missing-data` branches:
  1. **Empty `school.name` fallback** — if upstream imports ever produce `school.name === ""`, templates render `"当前数据库暂缺  的 X 平均值..."` (double space, subject gone). Add `school.name || "该学校"` fallback in the 3 school-missing templates, or enforce NOT NULL at a schema/validation layer.
  2. **Tone softening** — current copy `当前数据库暂缺 ${name} 的 GPA 平均值...` is engineering-heavy ("数据库"). Parent-facing copy should read more naturally, e.g. `我们还没收录 ${name} 的 GPA 平均值...`. Belongs with broader M4 copy/design polish, not a bug-fix PR.
- **Why:** Surfaced during PR #11 adversarial review (Claude + Codex both flagged independently). Not blocking because DB has NOT NULL on `school.name` today and current tone is understandable, but both reads as gaps worth fixing before M4 ships user-visible recommendations.
- **When:** M4 interactive report, batched with other copy/tone work.
- **Depends on:** PR #11 (merged)

## Deferred from Pre-M3 Stabilization (2026-04-09)

### [P2] Replace Student.name de-facto key with stable student identifier
- **What:** Today `submitQuestionnaire` uses `Student.name` (childName) as the upsert key and the review/complete flow keys off the same string. Rename a student → orphaned record. Add a stable `studentId` (cuid/uuid), track it in the draft, and make all lookups key off the id. Requires a Prisma migration and questionnaire-provider changes to persist the generated id.
- **Why:** Codex review P2.1 found this as a correctness risk for multi-user and for any post-submit edit flow. Deferred to its own PR because the fix touches schema, actions, provider, and complete/review pages — larger scope than the pre-M3 stabilization bundle.
- **When:** Before multi-user or before shipping a "edit submitted questionnaire" flow. Safe to keep for current single-user MVP.
- **Depends on:** Nothing. Independent PR with its own migration.
- **Partial progress (v0.4.0.0):** Gap analysis page (`/complete/gaps`) now uses `studentId` from URL params. Review page redirect passes `studentId`. Complete page "← 返回" link from gaps passes both name and studentId. Remaining: complete page URL still uses `name` as primary, review page uses `name` from context.
