---
name: Verify public contracts and runtime invariants before treating a PR as safe
description: Do not rely on unit tests and happy-path logic alone when a change exposes CLI entrypoints or stateful concurrency behavior
type: feedback
---

如果一个 PR 同时改到了对外入口和状态型基础设施，只看普通单元测试全绿，仍然可能漏掉真正的 blocker。

**Rule:** 在合并这类 PR 前，除了常规单测，还要额外检查两类东西：

- public contracts：`package.json` scripts、CLI entrypoints、配置组合是否合法
- runtime invariants：锁、调度、状态存储这类逻辑的核心不变量是否被测试表达出来

**Why:** 这次 runtime foundations PR 暴露出的两个高优先级问题，都不是普通 happy-path 测试能稳定挡住的：

- `package.json` 暴露了指向不存在 `src/cli.ts` 的脚本，`npm test` 和 `npm run build` 仍然会继续通过
- stale lock 修复只验证了"死锁可回收"，却没有同时验证"活锁不能误删""release 只能删自己的锁"，结果在 review 里很快暴露出并发语义漏洞

**How to apply:** 以后遇到类似 PR 时：

- 新增或修改 `package.json` scripts，就补一个轻量 contract test，至少验证本地脚本入口真实存在
- 对有明显关系的配置项，在 schema 层写交叉约束，不要只校验单字段范围
- 对锁��调度、状态机类逻辑，先列出核心不变量，再把每条不变量写成测试，而不是只补 reviewer 指到的那一个分支
