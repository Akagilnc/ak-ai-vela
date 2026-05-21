# Path curated view ship pre-landing review R7

Date: 2026-05-20
Branch: `path-atomic-curated-view`
Base: `origin/main`

## Verdict

Pre-landing review found actionable P2 issues. This commit fixes the product/runtime issues and intentionally leaves hook-script findings untouched because this run was explicitly told not to edit the hook commit/files.

## Review Coverage

- Claude full diff: APPROVE, no P0/P1.
- Codex slice 1 data/schema: CONCERNS.
- Codex slice 2 runtime/UI: CONCERNS.
- Codex slice 3 tests/process/docs: CONCERNS.
- Gemini full diff: unavailable for quorum due `MODEL_CAPACITY_EXHAUSTED`; a schema P0 emitted after the capacity error was locally disproved against `prisma/schema.prisma`.

## Fixed Findings

- P2: Curated detail pages did not mount `PathDetailExitCleanup`, so `/path` scroll restore flags could survive when a user opened `/path/seg/...` and then left the Path subtree. Added the cleanup and a regression test that fails without it.
- P2: Dongtan parent-facing prose contained stale or unreachable backup/action links. Updated the source MD first, then synced `docs/research/data/g1-may-atoms.ts` and verbatim seed tests.

## Skipped Findings

- P2/P3: `scripts/review-gate-precommit.sh` and `scripts/review-gate-postcommit.sh` classify all `docs/` paths as docs and ignore deletions via `--diff-filter=ACM`. Verified as real, but not changed here because hook files were explicitly out of scope for this run.

## Verification

- RED: `npx vitest run src/__tests__/path-curated-view-render.test.tsx` failed with `expected '123' to be null`.
- GREEN: `npx vitest run src/__tests__/path-curated-view-render.test.tsx src/__tests__/path-atoms-seed-shape.test.ts src/__tests__/path-activity-tile.test.tsx` passed `3 passed / 30 tests`.
- FULL: `npm test` passed `39 passed / 809 tests`.
- BUILD: `npm run build` completed successfully.
- Link smoke: replacement URLs for Dongping, Chenshan, Century Park, and Sheshan returned HTTP 200.
