# Path Slice 4 (June Content Shape & Verification) Cross-Model Review R1

## 范围

- Slice: G1 June atom/seed shape tests and verbatim content fidelity.
- 文件范围：
  - `docs/research/data/g1-jun-atoms.ts`
  - `src/__tests__/path-jun-atoms-seed-shape.test.ts`
- 目的：确保 June atom cards 和 curated views 完美投影自 `path-explorer-sample-g1-jun.md`，100% 逐字比对且各类 metadata 正确。

## TDD 证据

- **Red (未修复前)**：`npx vitest run src/__tests__/path-jun-atoms-seed-shape.test.ts`
  - 失败于 `keeps every June atom body verbatim as a substring of the source MD`，错误提示 `g1-jun-firefly-method` body 不在 spec 中。这是因为 `FIREFLY_METHOD_BODY` 第 2 行 `适应黑暗：到了先等 5 分钟让眼睛适应黑暗。一开始什么都看不到很正常。` 相比 spec MD 的 `到了先等 5 分钟让眼睛适应黑暗。一开始什么都看不到很正常。` 多了 `适应黑暗：` 前缀。
- **Green (修复后)**：运行测试通过。
  - `Test Files 1 passed (1)`，`Tests 8 passed (8)`。

## 编队与结论

- **Diff 大小**：约 `160` 行改动，中档，按 wiki 跑 `1 Claude + 1 Codex + 1 Gemini`。
- **Claude (Opus-tier)**: `CONCERNS`
  - [P0] `FIREFLY_WINDOW_BODY` 疑似与 spec MD 的 3 点结构不一致（已复核，spec MD 确实在此处为单行，符合 spec）。
  - [P0] `家里搞艾草与粽叶` interest tag 在测试中被硬编码断言为 `["nature", "craft"]` 与 spec 声明的 `文化+手作`（`["culture", "craft"]`）自相矛盾（**已修复**）。
  - [P1] 缺乏对所有 26 个 atoms body 完整的 verbatim 比对（**已修复**，测试已加入 26-atom body 逐字 substring 比对）。
- **Codex (gpt-5.5)**: `CONCERNS`
  - [P0] `滨江/辰山/青浦` 3 个观萤点位 body 被人工加入了标题前缀，违反 verbatim 纪律（**已修复**，已去除前缀）。
  - [P0] `观萤现场规范`（`FIREFLY_METHOD_BODY`）第 2 条与 spec `到了先等 5 分钟...` 不一致（**已修复**）。
  - [P1] `g1-jun-dragon-boat-home-moxibustion` interest 错误（**已修复**）。
  - [P1] `滨江森林公园夜观` `frictionLevel` 错误，应为 `2`（**已修复**）。
- **Gemini (agy Flash)**: `CONCERNS`
  - 与 Codex/Claude 重合，重点指出 `观萤备选方案`（`FIREFLY_BACKUP_BODY`）第 2 条 `《虫师》` 句子被压缩重写了（**已修复**，恢复成 spec MD 的 verbatim）。

## 修复与验证

1. **Verbatim 修复**：
   - 修正了 `FIREFLY_METHOD_BODY` 的黑暗适应步骤，完全和 spec MD 保持 byte-identical。
   - 修正了 `FIREFLY_BACKUP_BODY` 中《虫师》的描述，完美和 spec atom 部分的 byte-identical。
   - 去除了观萤点位中的标题前缀。
2. **Metadata 修正**：
   - `g1-jun-dragon-boat-home-moxibustion` 的 interests 属性更改为 `CULTURE_CRAFT_INTEREST`，测试期望也订正为 `["culture", "craft"]`。
   - 修正 `g1-jun-firefly-spot-binjiang` 的 `frictionLevel` 为 `2`。
3. **测试加固**：
   - 编写了 `keeps every June atom body verbatim as a substring of the source MD` 测试，对 G1_JUN_ATOM_SEED 中的所有 26 个 atom 的 body 逐一进行 `SOURCE_MD.includes()` 校验，防御任何以后的改动偏离 spec。

## 最终结论

**CONVERGED**: 3/3 评审提出的所有 P0/P1 问题已全部在 Slice 4 final 中彻底修复，测试套件 100% 绿，符合合入标准。
