# Path Slice 4 Cross-Model Review

## Slice

Fix `/path/seg/[slug]` so an unknown curated-view slug returns a real HTTP 404 even with `loading.tsx` streaming enabled, while valid DB-seeded slugs still resolve without rebuild.

## Diff

- `src/app/path/seg/[slug]/layout.tsx`
- `src/app/path/seg/[slug]/page.tsx`
- `src/lib/path/curated-view-query.ts`
- `src/__tests__/path-curated-route-hardening.test.tsx`

## Verification

- Red before fix: `npx vitest run src/__tests__/path-curated-route-hardening.test.tsx` failed because `generateMetadata()` resolved `{ title: "Path Explorer · Vela" }` for an unknown slug.
- Green after fix: `npx vitest run src/__tests__/path-curated-route-hardening.test.tsx` -> 8 passed.
- `npx eslint 'src/app/path/seg/[slug]/page.tsx' 'src/app/path/seg/[slug]/layout.tsx' src/lib/path/curated-view-query.ts src/__tests__/path-curated-route-hardening.test.tsx` -> passed.
- `npx next typegen` -> passed.
- `npx tsc --noEmit --pretty false` -> passed.
- Real smoke on existing dev server: bad slug -> 404; `g1-may-lixia-solar-term` -> 200.

## Review R1

- Claude: CONCERNS. P1 conditional concern that layout and page used different existence predicates, which could reintroduce streamed 200 if the page loader later rejected a row the layout allowed.
- Codex: APPROVE.
- Gemini: APPROVE, with optional duplicate-query cleanup.

## R1 Fix

- Extracted `loadCuratedView()` into `src/lib/path/curated-view-query.ts`.
- Reused the same cached loader in layout, metadata, and page.
- Added a layout comment explaining this is the pre-loading-boundary 404 gate.

## Review R2

- Claude: APPROVE. No P0/P1; optional P3 notes only.
- Codex: APPROVE. No findings.
- Gemini: APPROVE. No P0/P1; optional notes only.

## Verdict

CONVERGED: 3/3 reviewers approved in R2.
