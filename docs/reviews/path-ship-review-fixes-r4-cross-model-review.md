# Path Ship Review Fixes R4 Cross-Model Review

Date: 2026-05-19
Branch: `path-atomic-curated-view`
Scope: staged ship-review fix delta after R3

## Setup

- Diff size: `149 insertions(+), 39 deletions(-)` across 8 files.
- Wiki sizing: small diff (`<200` changed lines) -> `1+1+1`.
- Reviewer batch: Claude Opus full diff + Codex `gpt-5.5` full diff + Gemini full diff.
- Claude CLI smoke passed before review: `CLAUDE_OK`.

## Verdict

`3/3 APPROVE`

- Claude: `VERDICT: APPROVE`
- Codex: `VERDICT: APPROVE`
- Gemini: `VERDICT: APPROVE`

No P0/P1/P2/P3 findings were returned for this staged delta.

## Reviewed Delta

- `PathCuratedViewPage` back link preserves `view.month` with `/path?month=N`.
- Markdown link rendering allows only `http://`, `https://`, and site-local `/...`; other schemes render as text.
- `src/lib/prisma.ts` lets `VELA_TEST_DB_URL` take precedence over ambient `DATABASE_URL` in `NODE_ENV=test`.
- Tests add selector empty/all-filtered boundaries, remove `selectSlot()` as the render-test oracle, add unsafe-link assertions, and stabilize slow tests.
- `handoff-codex-report.md` documents completion evidence and explicitly says the prior R3 review is not final for latest HEAD.

## Reviewer Notes

Claude checked the test URL precedence, markdown scheme allowlist, month-preserving link, independent render oracle, timeout-only test changes, and completion report caveat. It noted one non-blocking observation: bare relative links like `foo/bar` now render as text; current seed uses absolute `/...` internal links, so this is not a concrete bug.

Codex returned `VERDICT: APPROVE`.

Gemini returned `VERDICT: APPROVE`.

## Commands / Evidence

```text
printf 'Return exactly: CLAUDE_OK\n' | claude -p --output-format json --disable-slash-commands --tools ""
-> result: CLAUDE_OK

git diff --cached --stat
-> 8 files changed, 149 insertions(+), 39 deletions(-)

cat /tmp/path-ship-review-fixes-prompt.md | claude -p --output-format json --disable-slash-commands --tools ""
-> VERDICT: APPROVE

cat /tmp/path-ship-review-fixes-prompt.md | codex exec --model gpt-5.5 -
-> VERDICT: APPROVE

cat /tmp/path-ship-review-fixes-prompt.md | gemini --approval-mode auto_edit
-> VERDICT: APPROVE
```

## Follow-Up

This review covers only the staged R4 ship-review fix delta. Because `/ship` applied fixes during Step 9, the workflow must stop after committing these fixes; the next `/ship` run should re-run full verification and ship-pre review from the new HEAD before PR creation.
