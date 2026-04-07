---
name: Validate all major end-to-end paths before opening a PR
description: Do not assume one successful path is enough when the feature has multiple real trigger modes or integration routes
type: feedback
---

如果一个功能有多条真实触发路径，只测通其中一条，不足以说明这个 PR 已经验证完整。

**Rule:** 发起 PR 前，列出并验证所有主要端到端路径，不要只跑一条最顺手的 happy path。

**Why:** 多路径系统里，不同触发方式往往会经过不同分支、不同集成点、不同数据组合：

- 手动路径和自动路径可能走不同代码
- 不同平台、渠道或模式可能有不同边界条件
- 只验证一条路径，很容易高估 PR 的真实完成度

**How to apply:** PR 前：

- 先列出这次改动涉及的主要真实路径
- 对每条路径确认是否已跑过真实验证或等价验证
- 在 PR 描述里写清楚本次覆盖了哪些路径，哪些仍未覆盖
