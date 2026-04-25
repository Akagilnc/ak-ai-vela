# TODOS

Deferred work items tracked by engineering and CEO reviews.

## P1 — Must do before or during the relevant milestone

### [PathExplorer v0.5+] CSP header + HTML sanitization for BlockRenderer
- **What:** Add a Content Security Policy header (start with `default-src 'self'; script-src 'self' 'unsafe-inline'`) AND pick a sanitization story for the 12 `dangerouslySetInnerHTML` sinks in `src/components/path/block-renderer.tsx`. Options: (a) DOMPurify at write time with an allowlist (b/em/i/a) rejecting everything else; (b) DOMPurify at render time as defense in depth; (c) migrate schema fields from raw HTML to a restricted markdown flavor.
- **Why:** v0.1 trusts the seed file as the only writer — zero untrusted paths to the Json fields. v0.5+ reintroduces 升学决策卡 which likely involves admin-editable content, importers, and possibly LLM-generated cards. Every `<b>` slot becomes a stored-XSS sink the moment any of that lands. Flagged by all 3 Claude subagents + Codex during the cross-review on 2026-04-19.
- **When:** BEFORE any non-seed write path is added to `PathActivity.sections` / `summary` / `triggerText` / `chips`. That likely lands with v0.5+ admin UI or import tooling.
- **Signal to start:** a PR adds the first non-seed writer to any field consumed by BlockRenderer.

### [PathExplorer v0.5+] PathInterest UA retention + privacy posture
- **What:** Decide + implement retention policy for `PathInterest.userAgent` (full UA strings). Options: (a) hash UA with a server-side secret, keep only digest for bot detection; (b) keep raw UA with a 30/90-day cron purge; (c) drop UA field entirely if bot filtering moves to middleware. Also add a one-line privacy disclosure under the CTA form once a privacy page exists.
- **Why:** Current form copy says "不 spam，不转售" but raw UA paired with email is PII under GDPR/PIPL. Pre-monetization so low exposure, but needs decision before any marketing push or privacy page. Flagged by Security subagent 2026-04-19.
- **When:** Before public launch of Path Explorer / any marketing campaign driving form signups.

### [PathExplorer v0.5+] PathDecisionBranch.downstreamStageSlugs FK integrity
- **What:** Replace `PathDecisionBranch.downstreamStageSlugs: Json` with a join table `PathDecisionBranchDownstream(branchId, stageId)` with proper FK to `PathStage`, OR add a seed-time validator asserting every slug in the JSON array matches a `PathStage.slug`.
- **Why:** Current schema stores an array of slug strings with no referential integrity — renames drift silently. v0.1 doesn't seed this table (0 rows) so impact is zero, but the 升学决策卡 回归 in v0.5+ will exercise it. Flagged by Correctness subagent 2026-04-19.
- **When:** Before first seed of `PathDecisionBranch` rows (v0.5+ 升学卡 回归).

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

## Deferred from Path Explorer v0.1 post-ship user feedback (Kailing, 2026-04-19)

### [P1] CTA contact channel — email → WeChat ID / phone
- **What:** Replace the CTA form's `<input type="email">` primary channel with a more China-native contact option. Options: WeChat ID (`微信号`), phone, or a QR-code-first flow where parent scans a WeChat QR to add founder account. Email can remain as optional fallback.
- **Why:** Kailing flagged that Chinese parents rarely check email — leaving an email address feels weird and probably gets low conversion. WeChat and phone are the default "how do I hear back" channels in mainland. Current form works (verified via 201/200 responses in preview) but UX-hostile for target audience.
- **When:** Alongside v0.2+ Path Explorer iteration OR whenever we pivot to real seed-user distribution. Probably after Kailing signal + before any wider launch.
- **Note:** Prisma `PathInterest` schema will need a new column (`wechatId` / `phone`) + the Zod body schema will need to accept at least one of email / wechatId / phone. Legal: phone numbers are PII — revisit UA retention policy together (already tracked as a separate v0.5+ item).

### [P2] Upgrade scroll-restore rAF re-assert to ResizeObserver + timeout
- **What:** `doRestore()` in `src/components/path/path-overview-scroll-restore.tsx` currently does a single `requestAnimationFrame` to re-assert `scrollTop` after the sync write, in case layout grew between the sync write and the next paint. If lazy-loaded images below the fold take MULTIPLE frames to stabilize (slow network), the re-assert doesn't catch late growth. Upgrade path: attach a `ResizeObserver` to `#path-main`, re-assert `scrollTop` whenever `scrollHeight` changes within a 500ms window from mount, then disconnect.
- **Why:** Today's seed user (Kailing, Shanghai 4G/WiFi) isn't on a slow enough network for this to matter. But when a real user reports "I came back and was close to where I was, but a card or two off," this is what needs to change. Flagged by Gemini R3 on PR #28.
- **When:** Only if a real user reports "returned to wrong position" drift. Speculative shipping would add complexity with no current caller.
- **Signal to start:** a seed-user feedback message mentioning "came back to wrong spot" / "not quite where I left off".

### [P2] Namespace scroll-restore keys by overview pathname
- **What:** `SCROLL_KEY` (`vela:path-overview:scroll`) and `DEPARTED_KEY` (`vela:path-overview:departed-at`) in `src/components/path/path-overview-scroll-restore.tsx` are static constants. Parameterize them by `window.location.pathname` (or a stage slug) so future parallel overview pages don't collide on scroll positions.
- **Why:** Today there is exactly one overview at `/path` (G1–G3 · May). v0.2+ or v0.5+ likely adds month navigation and eventually G4–G6 / G7–G9 stages. Each will need its own overview URL. A shared key would teleport the G1 overview to the G4 overview's last scrollTop. Flagged by Gemini R2 on PR #28.
- **When:** Same PR that adds the second overview route. One-line change: `const SCROLL_KEY = \`vela:path-overview:scroll:${pathnameKey}\``.
- **Signal to start:** first PR adding a second `page.tsx` under `src/app/path/` that renders an overview-style tile list.

### [P2] Switch public/assets/vela.css symlink → prebuild cp when we leave local-only
- **What:** Replace the `public/assets/vela.css` → `../../assets/vela.css` symlink with a `prebuild` npm script that does `cp assets/vela.css public/assets/vela.css`. OR delete `assets/vela.css` entirely and update the root demo HTML files to reference `public/assets/vela.css` directly.
- **Why:** Symlinks in `public/` are fine for local dev and for platforms that follow symlinks at build time (Vercel, Netlify). They break on: `npm pack` / `npm publish` (npm strips symlinks per spec), `git archive` (stored as symlink entry, not real content), Windows git clones without `core.symlinks=true`, and some static-deploy CI pipelines that only stat rather than read files. Today the project is local-only so none of these paths exist; this TODO catches the future migration.
- **When:** Same PR that adds cloud deployment (Vercel / Cloudflare Workers / anything non-local). Flagged by Codex adversarial review on 2026-04-20.
- **Signal to start:** first PR adding `vercel.json`, `wrangler.toml`, `netlify.toml`, or a `deploy` CI workflow.

## Deferred from Path Explorer v0.1 ship review (2026-04-19)

### ~~[P2] ShareButton `useEffect` cleanup on unmount~~ DONE (R1)
- **Status:** Completed in PR #27 round 1 (Gemini review flagged as MEDIUM). `useEffect` cleanup added at `src/components/path/share-button.tsx`.
- **Completed:** v0.6.0.0 R1 fix

### ~~[P2] Pinch-zoom multi-touch guard in path-detail-nav~~ DONE (R1)
- **Status:** Completed in PR #27 round 1 (Gemini review flagged as MEDIUM). `e.touches.length > 1` early-bail added to `onTouchStart` at `src/components/path/path-detail-nav.tsx`.
- **Completed:** v0.6.0.0 R1 fix

### [P2] `--mute-2` color contrast (brand decision)
- **What:** `--mute-2: #8F8B72` computes to ~3.1:1 on `--cream: #FBF7E4` — fails WCAG AA 4.5:1 for small text. Affected sites include ghost month pills, `.aside-note`, `.overview-foot .stamp`, and `.m-pill .zh`. Brand-compliant fix is `#6B6560` (DESIGN.md secondary text tier, ~6.0:1). Other option: keep `--mute-2` and ensure affected text is ≥18.66px or ≥14px bold to qualify for AA large-text (3:1).
- **Why:** Flagged by UX subagent R12-R15 repeatedly. Deferred because changing the brand neutral affects visual feel across the app — not a per-screen fix. Needs design decision.
- **When:** With next brand/design pass OR when adding the first non-gated public user (the affected text is mostly "ghost" / meta labels, not conversion-critical).

### [P2] `/schools` landscape safe-area edge
- **What:** With `viewport-fit=cover` now global (R14), on landscape iPhone 14/15 Pro the Dynamic Island inset can sit over the left edge of `/schools` cards (base padding `px-4` = 16px, less than the ~59px notch inset). Fix: wrap `px-4` → `px-[max(16px,env(safe-area-inset-left))]` in `src/app/schools/page.tsx:45`.
- **Why:** Introduced as side-effect of R14's root-level viewport-fit fix. `/path` compensates via `.stage-inner` + `.d-footer` env padding; `/schools` uses Tailwind container without env awareness.
- **When:** Landscape iPhone users report clipping, OR next schools design pass.

### [P2] error.tsx dev-mode error display
- **What:** In `src/app/path/error.tsx`, conditionally render `error.message` + `error.stack` when `process.env.NODE_ENV !== "production"`. Currently the error prop is discarded (`error: _error`) — production correct, but dev-mode debugging slow.
- **Why:** Flagged by UX subagent R15. Low value (Next.js logs server-side, dev rarely hits this boundary) but quick win for fast iteration.
- **When:** Next time error.tsx is touched.

## Deferred from Path Explorer v0.2 cross-model review (2026-04-26)

### [P2] Block-shape walker: tighten route / photo-row / locCards per-item field checks
- **What:** `src/__tests__/path-seed-shape.test.ts` has a `validateBlock` walker that recurses into every block in every section. It enforces full per-field shape for most discriminators, but for `route`, `photo-row`, and `path-opts.opts[].locCards` it only asserts `Array.isArray(block.steps/photos/locCards)` — does NOT validate per-item declared fields (`zone/desc/dur` for route, `src/alt/cap` for photo-row, `photo/name/desc` for locCards). A future seed could ship `step.duration` instead of `step.dur` and the walker would still pass.
- **Why:** This is the exact class of drift the walker was added for (Slice 2 R1 caught `id-table` field rename + `steps→items` only because tsc complained — the walker would have missed it without those tighter cases). Flagged by R2 Agent 2.
- **When:** Before Slice 3+ adds significant new `route` / `photo-row` payloads. Today only May seed uses `route` (c1 §3 and §4) and there's no `photo-row` usage; risk is low but real.
- **Signal to start:** any new month seed authoring a `route` or `photo-row` block, OR before merging any seed restructure.

### [P2] PathInterest schema: add `month` column for sign-up attribution
- **What:** Add `month: Int?` to `PathInterest` Prisma schema + matching field on the Zod payload + form input from `<PathInterestForm>`. Today the form uses `sourcePath="/path"` to track signup origin, but `canonicalSourcePath` strips queries (intentional, prevents `(email, sourcePath)` dedup-key drift). Result: a user signing up from `/path?month=5` is indistinguishable from one signing up from `/path?month=6`.
- **Why:** Once 2+ months ship (Slice 2 = May+June), founder needs to know which month surface drives interest signal — it informs which month seed gets prioritized next. Flagged by Codex in Slice 1 R2; deferred with TODO comment in `src/app/path/page.tsx:210`.
- **When:** Same PR that adds the third month seed, OR if seed-user feedback requests month-attributed analytics earlier. Cross-references the `PathInterest UA retention` privacy posture item above — both touch the same model and should land together.

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
- **Tracking:** #24 (详细调研方向、4 个候选框架、分阶段 scope、open questions 都记录在 issue 里)
- **TL;DR:** 用户反馈"10 题看不出个性"。v0.6 不继续造轮子，用已验证的儿童心理学框架（Temperament + VIA + Big5-C + Gardner MI 四选组合）替换自造题目。
- **When:** v0.6，v0.5 文案池扩充（P1 TODO）完成后启动。
- **Depends on:** v0.5.0.0（已完成）, 更多家长反馈

### ~~[P0] Path Explorer: 路径卡片探路器（新功能）~~ DONE (v0.1)
- **Status:** Completed in v0.6.0.0 (2026-04-19). Scope pivoted 4/18 from "17 升学决策卡" to "G1 五月 · 5 月度活动卡" per seed-user validation (Kailing + 4 peers). Shipped: 6 Prisma models, seed for 5 activity cards, overview + detail pages, CTA form + API, 17-block-type renderer, sub-nav scroll-spy, species photo lightbox, keyboard + touch nav, Web Share + WeChat UA fallback, error / not-found pages, 97 canonical-source regression tests, 15 rounds of adversarial cross-review.
- **Completed:** v0.6.0.0 (2026-04-19)

### ~~[P1] Insight + portrait 文案去 AI slop~~ DONE in v0.6.2.0
- **Status:** Slice 1（insights.ts）和 Slice 2（portraits.ts）都用自治 TDD + 13 轮 cross-model adversarial review 完成。所有 12 条 insight + 12 条 INTEREST_DESC + 3 条 DRIVE_DESC + 两条 fallback 都重写，消掉了"看起来" × 12 模板、去掉了"充满好奇"/"如鱼得水"/"沉迷其中"这类 AI slop 套话，每条都落到可观察行为锚点。具体见 v0.6.2.0 CHANGELOG。
- **Completed:** v0.6.2.0 (2026-04-20)

### [P2] Insight + portrait 扩展为随机池
- **What:** 每个 key 从 1 句扩到 3-24 句候选，按 seed（比如 session id）确定性抽取。同一孩子同次测评看到同一句；重测或对比另一孩子能看到不同表达。
- **Why:** 目前每个 key 只有 1 条手写文案（已经跑 13 轮 review 打磨到干净）。扩池能让同一用户多次访问或多孩子对比不再见到完全相同的一句话，提升"每个孩子独特"的感知。
- **When:** 等 seed user（Kailing）真实使用反馈后再决定优先级。1 条写得好的文案 > 24 条 mediocre，当前 1 条的状态可能已经够用。
- **Depends on:** v0.6.2.0（已完成的 de-slop 基础）

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
- **What:** One remaining defensive improvement to `src/lib/gap/recommendations.ts` `school-missing-data` branches:
  1. **Empty `school.name` fallback** — if upstream imports ever produce `school.name === ""`, templates render `"暂无  的 X 参考数据..."` (double space, subject gone). Add `school.name || "该学校"` fallback in the 3 school-missing templates, or enforce NOT NULL at a schema/validation layer.
- ~~**Tone softening**~~ — **DONE in v0.6.2.1**: `"当前数据库暂缺 ${name} 的..."` rewritten to `"暂无 ${name} 的... 这项跳过，其余项目的报告不受影响"` across GPA/SAT/ACT school-missing branches.
- **Why:** Surfaced during PR #11 adversarial review. Not blocking because DB has NOT NULL on `school.name` today, but worth fixing before M4 ships user-visible recommendations.
- **When:** M4 interactive report, batched with other copy/tone work.
- **Depends on:** PR #11 (merged)

## Deferred from Pre-M3 Stabilization (2026-04-09)

### [P2] Replace Student.name de-facto key with stable student identifier
- **What:** Today `submitQuestionnaire` uses `Student.name` (childName) as the upsert key and the review/complete flow keys off the same string. Rename a student → orphaned record. Add a stable `studentId` (cuid/uuid), track it in the draft, and make all lookups key off the id. Requires a Prisma migration and questionnaire-provider changes to persist the generated id.
- **Why:** Codex review P2.1 found this as a correctness risk for multi-user and for any post-submit edit flow. Deferred to its own PR because the fix touches schema, actions, provider, and complete/review pages — larger scope than the pre-M3 stabilization bundle.
- **When:** Before multi-user or before shipping a "edit submitted questionnaire" flow. Safe to keep for current single-user MVP.
- **Depends on:** Nothing. Independent PR with its own migration.
- **Partial progress (v0.4.0.0):** Gap analysis page (`/complete/gaps`) now uses `studentId` from URL params. Review page redirect passes `studentId`. Complete page "← 返回" link from gaps passes both name and studentId. Remaining: complete page URL still uses `name` as primary, review page uses `name` from context.
