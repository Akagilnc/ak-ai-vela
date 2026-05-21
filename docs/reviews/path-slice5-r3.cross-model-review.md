# Path Slice 5 Cross-Model Review

## Slice

Fix curated-view presentation gaps:

- Use source-authored labels for the two time-budget prose blocks (`时间占用` / `时间预算`) instead of showing them as `为什么特别`.
- Skip empty/null prose sections so the page does not render blank headings.
- Preserve multiline atom bodies with `white-space: pre-wrap`.
- Strip a promoted inline source label from the body when the stored prose still begins with that label.

## Diff

- `src/components/path/path-curated-view.tsx`
- `src/__tests__/path-curated-view-render.test.tsx`

## Verification

- Red before fix: `npx vitest run src/__tests__/path-curated-view-render.test.tsx` failed on missing `时间占用`, blank `serendipity`, and missing atom-body `pre-wrap`.
- Green R3: `npx vitest run src/__tests__/path-curated-view-render.test.tsx` -> 5 passed.
- `npx eslint src/components/path/path-curated-view.tsx src/__tests__/path-curated-view-render.test.tsx` -> passed.
- `npx tsc --noEmit --pretty false` -> passed.
- `npx vitest run src/__tests__/path-curated-view-render.test.tsx src/__tests__/path-curated-route-hardening.test.tsx` -> 13 passed.
- `git diff --check -- src/components/path/path-curated-view.tsx src/__tests__/path-curated-view-render.test.tsx` -> passed.
- Real smoke on existing dev server: `g1-may-baseline` -> 200 with `时间占用` + `white-space:pre-wrap`; `g1-may-labor-holiday` -> 200 with `时间预算` + `white-space:pre-wrap`.

## Review R1

- Setup: small diff, 1 Claude + 1 Codex + 1 Gemini, all full diff.
- Claude: CONCERNS. P2 noted promoted headings could repeat inline labels if source text still included `**时间占用**：` / `**时间预算**：`; P3 noted empty-prose test was tied to current seed nulls.
- Codex: APPROVE.
- Gemini: APPROVE.

## R1 Fix

- Added body stripping for promoted inline labels.
- Reworked empty-prose coverage to use synthetic data instead of depending on current seed nulls.

## Review R2

- Setup: medium diff, 1 Claude + 2 Codex + 1 Gemini. Claude/Gemini reviewed full diff; Codex split component and test sections.
- Claude: APPROVE with P3 notes only.
- Codex A: APPROVE.
- Codex B: CONCERNS. P2 noted the no-repeat coverage only exercised baseline, not labor.
- Gemini: APPROVE.

## R2 Fix

- Added labor-specific inline-label de-dup coverage.
- Added a component comment tying the slug overrides to the two seed rows that store source-authored time labels in `whySpecial`.

## Review R3

- Setup: medium diff, 1 Claude + 2 Codex + 1 Gemini. Claude/Gemini reviewed full diff; Codex split component and test sections.
- Claude: APPROVE. No P0/P1/P2; optional P3 note about the leading-anchor assumption.
- Codex A: APPROVE.
- Codex B: APPROVE.
- Gemini: APPROVE.

## Verdict

CONVERGED: 4/4 reviewers approved in R3.
