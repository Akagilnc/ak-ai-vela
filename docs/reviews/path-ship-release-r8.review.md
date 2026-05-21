# Path curated view release review R8

Date: 2026-05-21
Branch: `path-atomic-curated-view`
Version: `0.10.0.0`

## Verdict

Release metadata commit for the Path curated segment PR. Version bump is MINOR because the branch adds new Path routes, Prisma models, seed data, runtime query code, and test suites.

## Scope Summary

- Added DB-backed `/path/seg/[slug]` curated segment pages.
- Added Path atom and curated-view schema/seed/query/render coverage.
- Linked the May overview cards to curated segment routes.
- Preserved source-authored parent prose and atom body fidelity from the G1 May source MD.
- Added tracked review-gate scripts and review evidence reports.

## Known Skips

- Copilot online review is unavailable and intentionally ignored for this run.
- Hook-gate P2 findings are recorded but not changed here: `docs/` TS seed files are classified as docs, and delete-only changes are ignored by `--diff-filter=ACM`.

## Verification Carried Forward

- `npm test` passed `39 files / 809 tests` after the pre-landing fixes.
- `npm run build` completed successfully after the pre-landing fixes.
- Replacement external links for Dongping, Chenshan, Century Park, and Sheshan returned HTTP 200.
