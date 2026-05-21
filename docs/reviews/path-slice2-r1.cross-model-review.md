# Path Slice 2 Cross-Model Review R1

## 范围

- Slice commit: `85b2a13 fix(path): preserve no-signal slot order`
- Review diff: `0c282fa..85b2a13`
- 文件范围：
  - `src/lib/path/curated-slot.ts`
  - `src/__tests__/curated-slot.test.ts`
- 后续 `0f4298e chore(hooks): review-gate pre/post-commit + installer (tracked)` 为受保护 hook commit，本轮只读、不纳入 review。

## 编队与结论

- Diff size: `117` 行 patch，小档，按 wiki 跑 `1 Claude + 1 Codex + 1 Gemini`。
- Claude: `CONCERNS`，其中 P1 为条件性怀疑，因 reviewer 未拿到完整源码。
- Codex: `APPROVE`，用 `git show 85b2a13:...` 验证 `ranked` 无信号路径按 `displayOrder`，并跑过目标测试。
- Gemini: `CONCERNS`，有效 finding 是 signal 分支缺少 friction 排序测试覆盖。

## 采纳项

- `[P1] Missing test coverage for signal branch friction sorting`
  - 采纳为测试缺口：原 signal 分支测试里的 unmatched explore 项 `frictionLevel` 都是默认值，无法证明有兴趣信号时 explore 会按 friction 排序。
  - 修复：把该测试改为 `displayOrder` 与 `frictionLevel` 相反的 fixture，断言 explore 输出为低 friction 优先。

## 未采纳项

- Claude `[P1] no-signal ranked may still sort by friction`
  - 不采纳：完整 `85b2a13:src/lib/path/curated-slot.ts` 显示上游 `ranked` 比较器只按 `matched`、`displayOrder`、原始 index 排序；friction 只在 `hasInterestSignal` 的 explore 分支参与。
- Gemini `[P2] overflow matched atoms should stay above unmatched in explore`
  - 不采纳为本轮 bug：当前产品语义把 explore 视为低试错成本排序面，兴趣命中负责 tight 优先，不要求 overflow matched 在 explore 中继续压过低 friction off-profile 项。
- Gemini `[P3] exploreQuota dead store`
  - 暂不修：这是低优先级清理，不影响本轮排序正确性；本次只补 review 发现的测试证明缺口。

## 验证

- `printf 'Return exactly: CLAUDE_OK\n' | claude -p --output-format json --disable-slash-commands --tools ""`
  - 输出含 `result: "CLAUDE_OK"`。
- `git diff --stat 0c282fa 85b2a13 -- src/lib/path/curated-slot.ts src/__tests__/curated-slot.test.ts`
  - `2 files changed, 41 insertions(+), 19 deletions(-)`。
- `git diff --name-only 85b2a13..HEAD -- src/lib/path/curated-slot.ts src/__tests__/curated-slot.test.ts`
  - 无输出；后续 commit 未修改 scoped files。
- `npx vitest run src/__tests__/curated-slot.test.ts`
  - `Test Files 1 passed (1)`，`Tests 8 passed (8)`。
- `npx eslint src/__tests__/curated-slot.test.ts`
  - exit 0。
- `git diff --check -- src/__tests__/curated-slot.test.ts`
  - exit 0。
