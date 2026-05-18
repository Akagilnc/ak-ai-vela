# Path Ship Pre-Landing Cross-Model Review R5

## Scope

- Trigger: `/ship` Step 9 pre-landing review.
- Diff reviewed: `origin/main...HEAD`.
- Diff size: about 8,572 patch lines, so the large-diff rule used 3 Codex slices plus 1 Claude full review plus 1 Gemini full review.
- Gemini result: not counted. The CLI returned `429 MODEL_CAPACITY_EXHAUSTED`, so this round is recorded as missing Gemini rather than silently degraded.

## Reviewers

| Reviewer | Scope | Verdict |
|---|---|---|
| Claude opus | full diff | APPROVE with P2 notes |
| Codex 1 | data/content slice | CONCERNS |
| Codex 2 | runtime/render slice | CONCERNS |
| Codex 3 | process/docs slice | CONCERNS |
| Gemini | full diff | unavailable: capacity exhausted |

## Findings And Resolution

| Priority | Finding | Resolution |
|---|---|---|
| P1 | `PathCuratedViewPage` rejected known-view `proseBlocks` unless keys exactly matched the hardcoded list. A persisted row or future seed with an extra valid prose section would fall back to legacy prose and drop authored sections. | Fixed. Added a regression test for extra valid authored sections and changed the guard to require expected keys in order while allowing additional valid blocks. |
| P2 | `docs/research/path-12y-overview/synthesis.md` overstated the "high school attended" evidence as "大学不在意你读哪所中学" even though the table still has limited/moderate importance buckets. | Fixed. Reworded to say school background is not the core deciding factor but can still have limited/moderate reference value. |
| P2 | `G1_MAY_VIEW_ATOM_LINKS` has no reused atom links even though the source research mentions shared concepts. | Skipped for this stop point. This is a content-model follow-up, not a release-blocking runtime defect. |
| P2 | Review gate scripts do not include staged deletions and treat all `docs/` paths as documentation even when they are executable seed data. | Skipped because this session has an explicit constraint not to touch the hook files. |
| P2 | `firstSentence()` can truncate future metadata if an English period appears before a CJK sentence terminator. | Skipped as latent only; current seeded metadata is unaffected. |
| P2 | Bare relative markdown links render as plain text. | Skipped as an intentional authoring constraint for now; current seed uses safe absolute or site-local links. |

## Verification

- Red test before fix: `npm test -- src/__tests__/path-curated-view-render.test.tsx` failed on `keeps known-view authored prose when it includes extra valid sections`.
- Target green after fix: `npm test -- src/__tests__/path-curated-view-render.test.tsx` passed with `14 passed`.
- Full suite after fix: `npm test` passed with `38 passed / 800 passed`.

## Ship Status

This Step 9 round applied fixes, so `/ship` must stop here per the skill. Re-run `/ship` from the new commit so the full pre-landing gate, version/changelog, build, push, document release, and PR creation run against the updated HEAD.
