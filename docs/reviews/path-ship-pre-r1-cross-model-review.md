# Path Atomic Curated View Ship-Pre R1 Review

## Verdict

CONCERNS -> fixed locally; re-review required after commit.

## Scope

- Branch: `path-atomic-curated-view`
- Base: `main`
- Cumulative diff size: >500 lines, so ship-pre review uses N=3 Codex + 1 Claude + 1 Gemini.
- Protected hook files remain read-only for this fix.

## R1 Finding

P1: route/runtime DB tests depended on the developer's local `prisma/dev.db`.

Evidence from reviewer + local repro:

- `src/lib/prisma.ts` used `DATABASE_URL || prisma/dev.db`.
- Vitest global setup publishes `VELA_TEST_DB_URL`, not a seeded production `prisma/dev.db`.
- `src/__tests__/path-curated-route-hardening.test.tsx`, `src/__tests__/path-curated-view-render.test.tsx`, and `src/__tests__/path-runtime-db.test.ts` imported app Prisma or route modules that hit app Prisma.
- Repro with an empty `DATABASE_URL=file:/tmp/vela-review-empty-route.db` failed before the fix with missing `path_curated_views` / `path_stages` or empty static params.

## Fix

- `src/lib/prisma.ts` now honors `VELA_TEST_DB_URL` in `NODE_ENV=test`, while production/local fallback still uses `prisma/dev.db`.
- Route hardening tests mock curated-view query/prisma at the module boundary instead of relying on local DB state.
- Curated-view render tests read the committed seed projection directly instead of querying app Prisma.
- Runtime DB smoke test creates its own temporary SQLite database, applies schema, seeds the one stage it asserts, and imports app Prisma only after setting `DATABASE_URL`.
- Removed the trailing blank line that made `git diff --check main...HEAD` fail on the previous committed review report.

## Verification

```bash
DATABASE_URL='file:/tmp/vela-review-empty-route.db' npx vitest run src/__tests__/path-curated-route-hardening.test.tsx src/__tests__/path-curated-view-render.test.tsx src/__tests__/path-runtime-db.test.ts --reporter=dot
npx vitest run src/__tests__/path-curated-route-hardening.test.tsx src/__tests__/path-curated-view-render.test.tsx src/__tests__/path-runtime-db.test.ts src/__tests__/path-seed-script-reset.test.ts src/__tests__/path-atoms-seed-shape.test.ts src/__tests__/curated-slot.test.ts --reporter=dot
npx eslint src/lib/prisma.ts src/__tests__/path-curated-route-hardening.test.tsx src/__tests__/path-curated-view-render.test.tsx src/__tests__/path-runtime-db.test.ts
npx tsc --noEmit --pretty false
npm test
npm run build
```

Results:

- Empty-DB repro command: 3 files passed, 17 tests passed.
- Path targeted suite: 6 files passed, 36 tests passed.
- Scoped ESLint: passed.
- TypeScript: passed.
- Full Vitest: 38 files passed, 790 tests passed.
- Build: passed, with existing `metadataBase` warning.
