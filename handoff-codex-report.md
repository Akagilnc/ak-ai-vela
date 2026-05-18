# Path Atomic Curated View Completion Report

Date: 2026-05-19
Branch: `path-atomic-curated-view`
Base: `origin/main`

## Status

The P0/P1 Path atomic-card + curated-view findings from `handoff-codex.md` are fixed on this branch. P2 items are either fixed or explicitly noted below.

## What Changed

- Restored parent-facing G1 May atom/prose fidelity from `docs/research/path-explorer-sample-g1-may.md` into `docs/research/data/g1-may-atoms.ts`.
- Added `PathAtom`, `PathCuratedView`, and `PathCuratedViewAtom` schema/storage plus seed/reset support.
- Added `/path/seg/[slug]` route, 404/error/loading states, static params, metadata, and curated-view rendering.
- Added selector behavior for tight/explore slots, including no-signal display order and interest-based promotion.
- Added tests covering seed shape, source-range fidelity, reset/idempotency, runtime DB reads, route hardening, selector rules, and renderer behavior.
- Added safety hardening found during ship review: month-preserving back link, markdown link scheme allowlist, and test DB URL precedence in `NODE_ENV=test`.

## Findings Closed

- P0 atom-body fidelity: fixed through source-derived constants and verbatim/source-range tests.
- P0 internal notes leak: fixed with negative tests for internal authoring phrases.
- P1 no-signal ordering: fixed in selector and covered by display-order tests plus empty/all-filtered boundaries.
- P1 reset FK crash: fixed by leaf-first reset deletion order.
- P1 reset atom reseed: fixed by calling atom seeding after legacy path seeding in reset.
- P1 bad slug 404: fixed through layout/page `notFound()` gating and verified by route tests/smoke.
- P1 whySpecial mislabel: fixed by source-authored `proseBlocks` labels.
- P1 atom whitespace: fixed with `whiteSpace: "pre-wrap"` and markdown block rendering.
- P1 empty prose sections: fixed by skipping null/blank prose.
- P1 interests hardcoded: fixed with multi-value interest constants and seed-shape tests.
- P2 stale join prune: fixed in atom seed reset/update flow.
- P2 invalid cadence fixture: fixed by using valid cadence values.
- P2 route hardening status: covered by layout/metadata tests and live smoke.
- P2 render test oracle: fixed by replacing `selectSlot()`-derived expectations with locked seed slugs.

## Review Evidence

- Slice reports:
  - `docs/reviews/path-slice2-r1.cross-model-review.md`
  - `docs/reviews/path-slice3-r1.cross-model-review.md`
  - `docs/reviews/path-slice4-r2.cross-model-review.md`
  - `docs/reviews/path-slice5-r3.cross-model-review.md`
  - `docs/reviews/path-slice6-r3.cross-model-review.md`
- Ship-pre reports:
  - `docs/reviews/path-ship-pre-r1-cross-model-review.md`
  - `docs/reviews/path-ship-pre-r2-cross-model-review.md`
  - `docs/reviews/path-ship-pre-r3-cross-model-review.md`

R2 recorded full cross-model approval. R3 was a timeout-only delta review: Claude and Codex approved, Gemini was unavailable due 429 and was explicitly flagged in the report.

Current caveat: the `/ship` run after R3 applied additional fixes for test isolation, markdown link safety, month-preserving curated-view navigation, selector edge coverage, and test timeout stability. That means the existing R3 ship-pre artifact is intentionally not the final review record for the latest HEAD. Re-run ship-pre review from the new commit before PR creation.

## Verification Evidence

- `npm test` passed after timeout stabilization: `38` test files, `797` tests.
- Targeted reruns after the final ship-review fixes:
  - `npm test -- src/__tests__/path-runtime-db.test.ts` -> `1 passed`, `2 tests passed`
  - `npm test -- src/__tests__/path-curated-view-render.test.tsx` -> `1 passed`, `13 tests passed`
  - `npm test -- src/__tests__/curated-slot.test.ts` -> `1 passed`, `10 tests passed`
- `npm run build` passed and generated `/path/seg/[slug]` static pages.
- `npm run lint` remains red on existing out-of-scope files, especially `src/app/trait-quiz/page.tsx`; scoped Path files were clean in the recorded review reports.

## Deferred / Known Concerns

- New review-gate hook scripts are committed but not covered by a dedicated dry-run matrix.
- `loading.tsx` exists for route-transition UI, but `layout.tsx` intentionally gates unknown slugs before streaming so missing slugs return a real 404.
- Repo-wide lint is still blocked by pre-existing trait-quiz React hook errors and unrelated local/untracked assets can add lint warnings.
- The worktree still contains unrelated dirty/untracked files. They should not be staged as part of this Path PR unless intentionally scoped later.
