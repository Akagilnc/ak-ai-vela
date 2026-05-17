# Path Slice 3 Cross-Model Review R1

## 范围

- Slice: seed reset FK order + atom reseed
- 文件范围：
  - `prisma/seed.ts`
  - `src/__tests__/path-seed-script-reset.test.ts`
- 受保护 hook commit: `0f4298e chore(hooks): review-gate pre/post-commit + installer (tracked)`，本轮只读、不修改。

## TDD 证据

- Red: `npx vitest run src/__tests__/path-seed-script-reset.test.ts`
  - 失败于 `prisma.pathStage.deleteMany()`，错误为 `P2003 Foreign key constraint violated`。
- Green: 同一命令通过。
  - `Test Files 1 passed (1)`，`Tests 1 passed (1)`。

## 编队与结论

- Diff size: 约 `103` 行 patch，小档，按 wiki 跑 `1 Claude + 1 Codex + 1 Gemini`。
- Claude: `APPROVE`，仅 P3 记录项，无阻塞 finding。
- Codex: `APPROVE`，无 findings。
- Gemini: `APPROVE`，输出为正向确认点，无需修复 finding。

## 结论

- `resetAll()` 现在先删 `PathCuratedViewAtom`，再删 `PathCuratedView` / `PathAtom`，最后删旧 Path stage/goal/activity 链，避免 atom 模型对 `PathStage` 的 FK 阻塞 reset。
- `resetAll()` 重新调用 `seedPathAtomExplorer()`，避免 `--reset` 后 `/path/seg/[slug]` 对应的 curated view / atom 数据为空。
- 新测试用独立 temp SQLite DB，并通过 `DATABASE_URL` 传给真实 `prisma/seed.ts` 子进程，不依赖本地 `prisma/dev.db`。

## P3 记录项

- Claude: reset 后计数断言证明当前行为，但不单独证明“显式删除语句存在”；当前目标是防 P2003 + 确认 reset 后数据恢复，已覆盖。
- Claude: `run()` 使用 `stdio: "pipe"`，失败时调试输出不如直通详细；红测已经保留真实 P2003 输出，本轮不扩大范围。

## 验证

- `npx vitest run src/__tests__/path-seed-script-reset.test.ts`
  - `Test Files 1 passed (1)`，`Tests 1 passed (1)`。
- `npx vitest run src/__tests__/path-seed-script-reset.test.ts src/__tests__/path-atoms-seed-shape.test.ts src/__tests__/path-seed-integration.test.ts`
  - `Test Files 3 passed (3)`，`Tests 18 passed (18)`。
- `npx tsc --noEmit`
  - exit 0。
- `npx eslint prisma/seed.ts src/__tests__/path-seed-script-reset.test.ts`
  - exit 0。
- `git diff --check -- prisma/seed.ts src/__tests__/path-seed-script-reset.test.ts`
  - exit 0。
