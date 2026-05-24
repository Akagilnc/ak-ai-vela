# PR #37 R2-fix slice — cross-model review (small-diff form)

**Scope:** fix slice addressing 3 of 4 inline findings from Layer-3 R2 bot review on PR #37 (`path-june-content` branch). 1 finding deferred-with-protocol. Diff ~18 lines (3 files); per wiki cross-model-review.md §边界/例外, **small-diff exception (<50 lines) → 1+1 cross-family form** (Claude as author + Codex as cross-vendor reviewer). Declared in commit message.

## R2 findings (4 total — 3 fixed, 1 deferred)

| # | Source | Severity | Disposition |
|---|--------|----------|-------------|
| 1 | gemini @ `path-explorer-sample-g1-jun.md:188` | high | **Fixed (with codex-corrected wording — see below)** |
| 2 | gemini @ `g1-jun-atoms.ts:53` | high | **Fixed via same constant** |
| 3 | gemini @ `g1-jun-atoms.ts:568` | medium | **Fixed:** added `pitfalls` proseBlock to `g1-jun-rainy-season` curated view |
| 4 | gemini @ `seed.ts:158` (monthLabel explicit field) | medium | **Deferred-with-protocol** (contradicts gemini R1 advice on same code; current dynamic derivation works with safe fallback; declining as stylistic-preference-vs-stability) |

## Vendor dispatch (small-diff 1+1)

| Vendor | Role | Result |
|---|---|---|
| Claude (author / self-check) | full diff | self-applied; tests green; tsc/eslint clean |
| Codex gpt-5.5 (Bash) | cross-vendor review | **CONCERNS — snake-toxicity-wording**, evidence-grounded P2 (see below) |

**Wiki small-diff exception declared:** 1+1 cross-family, not 1+1+1. Gemini absent: not dispatched for this <50-line slice per the exception (and `gemini` CLI is missing on this host anyway, documented in path-june-r1-fixes-cross-model-review.md). NOT silent-degrade — declared per wiki.

## Critical adjudication: codex caught gemini R2 was taxonomically wrong

Gemini's R2 high-priority finding asserted 赤链蛇 (Red-banded snake) should be re-labeled from "无毒" (non-toxic) to "**轻微毒性**" (mild toxicity), citing unspecified "v0.7.0.0 safety standards" (which do not exist in CHANGELOG — verified).

I applied gemini's suggested wording in a first iteration. Codex review then surfaced a **P2 with sourced evidence**:

- 2024 中国蛇咬伤救治指南 (Chinese snakebite treatment guideline) lists `Lycodon rufozonatus` (赤链蛇) among **common non-venomous snakes** ([wjem.com.cn](https://wjem.com.cn/EN/10.5847/wjem.j.1920-8642.2024.076))
- Shanghai local reporting similarly characterizes the locally-encountered 赤链蛇 as non-venomous ([Xinmin Weekly](https://www.xinminweekly.com.cn/shehui/2025/07/01/32494.html))
- The "weak toxin" finding from newer venom-transcriptome research is for `Rhabdophis lateralis` (虎斑颈槽蛇 / 红脖颈槽蛇) — a **different species** ([Toxins paper](https://doi.org/10.3390/toxins18040167))

**Gemini conflated two species and pushed a factual regression** into parent-facing safety content for children's outdoor activities. Applying it would have made the build less accurate than the pre-R2 state.

**Cross-vendor catch was load-bearing here.** Single-vendor (gemini-only) would have shipped an incorrect taxonomic claim. Codex's grounded evidence vetoes gemini's category-confused assertion. The wiki cross-model review pattern justified its existence on this single finding.

**Final corrected wording (post-codex):**
> 属游蛇科，**2024 中国蛇咬伤救治指南列为无毒蛇**；但牙锋利且**唾液菌群易引起细菌感染**，被咬需立即就医清创。看到立即拉开距离，**不要尝试抓或赶**。

This:
- Acknowledges 赤链蛇 IS in the non-venomous classification (taxonomically grounded)
- Removes the original naked Wikipedia citation (the original concern of gemini's first sentence)
- Keeps the bacterial-infection warning (real risk supported by general snakebite first-aid)
- Keeps the medical-care directive and the "don't handle/agitate" action advice
- Cites the 2024 Chinese clinical guideline (authoritative source, not Wikipedia)

Net for the user (parent reading this in the Vela path UI): correct taxonomic classification + accurate infection risk + correct action advice. Strictly better than both the pre-R2 state AND gemini's R2 suggestion.

## Other R2 finding: pitfalls block addition

`g1-jun-rainy-season` curated view's proseBlocks was missing the `pitfalls` block. Added before `heart` using the existing `RAINY_SEASON_PITFALLS_BODY` constant (same content as the standalone `g1-jun-rainy-season-pitfalls` atom, now also surfaced in the curated-view rendering).

Test plumbing aligned (~7 lines):
- `EXPECTED_CURATED_PROSE_KEYS['g1-jun-rainy-season']` += `'pitfalls'`
- `EXPECTED_CURATED_PROSE_SOURCE_RANGES['g1-jun-rainy-season'].pitfalls` = `[startStr, endStr]` pointing at MD line 216-218 range
- `expectCopiedSnippet(rainyPitfalls, ...)` hardcoded snake-text substring updated to NEW wording (was: `被咬仍需就医清创`; now: `被咬需立即就医清创`)

## Deferred finding 4 (R2 medium): monthLabel explicit field

Gemini R2's 4th finding asks for an explicit `monthLabel` field on the seed object instead of dynamic derivation. This **contradicts gemini's own R1 advice on the same code** (R1 said "derive dynamically from slugPrefix"; R2 says "don't derive, add explicit metadata"). Same-bot self-contradiction across rounds.

Current dynamic derivation works correctly with `?? "unknown"` fallback; refactoring back to explicit field would be a stylistic-preference change with no functional improvement. **Deferred-with-protocol:** P3 stylistic. If a future month seed has a slug that breaks the `split("-")[1]` heuristic, that month's seed author should either fix their slug OR add the explicit field at that point — not pre-emptively over-engineer here.

## Verdict

**APPROVE** — slice ready to commit + push + reply to R2 inlines + trigger R3.

Baseline post-fix: 41 files / 822 tests passed, `tsc --noEmit` exit 0, `eslint` exit 0 on changed files. No regression; refactor + factual correction only.
