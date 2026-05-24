# PR #37 R1-fix slice — cross-model review

**Scope:** fix slice addressing 4 inline findings from Layer-3 R1 bot review on PR #37 (`path-june-content` branch, v0.11.0.0). Wiki step 4 (per-slice CMR) form, dispatched single-batch parallel before commit+push+R2 re-trigger.

**Slice diff:** 82 insertions + 48 deletions across `prisma/seed.ts` (transaction restructure + try-create+catch + dynamic month label) and `src/__tests__/path-seed-script-reset.test.ts` (derive-from-array + helper refactor). Pre-commit state: 822/822 tests green, `tsc --noEmit` exit 0, `eslint` exit 0 on changed files.

## R1 findings addressed

| # | Source | Location | Severity | Fix |
|---|--------|----------|----------|-----|
| 1 | gemini-code-assist | `seed.ts:~150` | medium | Derive month label from `slugPrefix.split("-")[1]` with `?? "unknown"` fallback (was: hardcoded ternary `MAY → "May" : "Jun"`) |
| 2 | gemini-code-assist | `seed.ts:~251` | medium | Replace composite-key `pathCuratedViewAtom.upsert({update:{}})` with `try-create + catch P2002` (Prisma v7 + better-sqlite3 known-issue avoidance; semantically equivalent — empty update has no fields to apply, "create if absent, no-op if exists" is the actual intent) |
| 3 | chatgpt-codex-connector | `seed.ts:~152` (codex self-tagged P2) | data-integrity | Wrap multi-month for-loop in ONE outer `prisma.$transaction`; rolls back EARLIER months if a later month fails (was: per-month tx, partial-seed regression on `--reset`) |
| 4 | gemini-code-assist | `test:~80` | medium | Introduce `ALL_ATOM_SEEDS` array + `EXPECTED_{ATOM,VIEW,LINK}_COUNT` reduce constants; use them in primary assertions |

## Vendor dispatch (single-message parallel, v3 default 1+1+1)

| Vendor | Role | Result |
|---|---|---|
| Claude opus (Agent subagent) | full diff, cross-section invariant | **APPROVE** (+ 2 real P2 follow-ons surfaced) |
| Codex gpt-5.5 (Bash) | full diff, depth on tx restructure + Prisma SQLite semantics | **APPROVE** (no specific new findings) |
| Gemini auto_edit (Bash) | full diff, third-vendor cross-check | **FAILED — `gemini` CLI not installed on this host** |

**Degraded form per wiki降级链:** 2-vendor + explicit "本轮缺 Gemini" flag = valid termination form for v3 default (cross-model-review.md §终止信号 "单 vendor 缺失退化 (default 1+1+1 中缺 1 → 2 reviewer): 2/2 concur + flag「缺 vendor X」"). NOT silent-degrade; the gap is flagged here for the next person running CMR on this machine to install Gemini CLI or use an alternative invocation path.

## Findings surfaced by Claude opus + handling

**Addressed in this same slice (Claude opus caught real follow-ons to Fix 4):**
- **P2 → fixed:** `expectAllSeededProseBlocks` helper still hardcoded `G1_MAY/G1_JUN` two for-loops — same brittleness Fix 4 was meant to kill. Refactored to iterate `ALL_ATOM_SEEDS`.
- **P2 → fixed:** mid-test assertions at lines ~200, ~234 still used inline `G1_MAY + G1_JUN .viewAtomLinks.length + N` instead of `EXPECTED_LINK_COUNT + N`. Both converted.
- **P2 → fixed:** `expectSeededProseBlocks` view-lookup also used hardcoded `find || find` across two seeds. Refactored to loop over `ALL_ATOM_SEEDS`.

**Deferred-with-protocol (P3/P4 — not blocking, tracked here for visibility, will be addressed if R2 re-flags or in future polish slice):**
- **P3** `seed.ts:~152` outer `$transaction` has no explicit `timeout`/`maxWait`; relies on Prisma's 5s default. Fine for current scale (better-sqlite3 is synchronous, microsecond per op, ~130 ops); revisit if seeds grow to 6+ months × 30+ atoms each.
- **P3** P2002 catch is SQLite-safe (statement-level failure inside an interactive tx) but would deadlock on Postgres/Vertex AI Postgres deployment. Per `feedback_post_merge_flow` / deploy-target memory, Postgres migration is a separate concern; deferred to that migration's review.
- **P3** Month label derivation `split("-")[1]` is OK for current `g1-may` / `g1-jun` convention. Brittleness bounded but undocumented; would benefit from a slug-shape regex or comment if naming convention isn't pinned.
- **P4** Cosmetic: extra blank line at seed.ts:~162-163 (lint-clean per current config; cosmetic only).
- **P2 (comment drift)** First Fix 1 comment says `"g1-may" → "May"` but actual slugPrefix value is `"g1-may-"` (trailing hyphen). Derivation is still correct (`"g1-may-".split("-")[1] === "may"`). Doc-only drift.

## Verdict

**APPROVE** under wiki降级链 valid termination form (2 vendors APPROVE + Gemini flagged absent).

- 4 R1 findings: all addressed at the root.
- 3 Claude-opus-found P2 follow-ons (same source-of-truth pattern Fix 4 targeted): all addressed in this slice.
- Remaining notes: 4 items deferred-with-protocol (P3/P4 + 1 doc P2). None blocking ship.

Net: slice is ready to commit + push + reply inline to R1 + trigger R2.
