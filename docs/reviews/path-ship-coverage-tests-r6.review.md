# Path Ship Coverage Tests R6

## Scope

- Trigger: `/ship` Step 7 coverage audit after the latest pre-landing fix.
- Diff reviewed: test-only additions in:
  - `src/__tests__/curated-slot.test.ts`
  - `src/__tests__/path-curated-route-hardening.test.tsx`
  - `src/__tests__/path-curated-view-render.test.tsx`
- Runtime code changed: none.

## Coverage Gaps Addressed

- Added a deterministic tie-break assertion for equal `displayOrder` atoms in `selectSlot()`.
- Added metadata fallback tests for missing `leadLine` and empty description fields.
- Added production error-boundary coverage to ensure raw error details are hidden.
- Added curated-view render coverage for `month = null` overview fallback links.
- Added malformed atom `interests` JSON coverage to ensure rendering does not crash or treat invalid data as a signal.

## Verification

- Target tests: `npm test -- src/__tests__/curated-slot.test.ts src/__tests__/path-curated-route-hardening.test.tsx src/__tests__/path-curated-view-render.test.tsx` passed with `3 passed / 38 passed`.
- Full suite: `npm test` passed with `38 passed / 806 passed`.

## Remaining Gaps

- Review-gate shell scripts still do not have fixture-based automated tests. This commit intentionally does not touch hook scripts because the session has an explicit constraint not to modify that hook work.
- A real browser E2E flow for `/path/seg/[slug]` remains better suited to a future Playwright/Cypress layer; this ship run covers it with local HTTP smoke instead.
