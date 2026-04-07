---
name: Real end-to-end validation before declaring a workflow phase complete
description: Validate at least one full real path, not just unit tests and partial smoke checks, before calling a milestone done
type: feedback
---

单元测试和局部 smoke 足以证明局部正确，但不足以证明一条主链真的打通了。

**Rule:** 在宣布一个主要工作流 milestone 完成之前，至少跑一次真实端到端路径。

**Why:** 很多问题只会在真实链路的边界上暴露出来，而不是在单个模块测试里：

- 集成契约可能在拼接时才出错
- 人工 handoff 或操作入口的问题不会在纯代码测试里暴露
- 纸面方案和局部 smoke 往往会高估“已经完成”的程度

**How to apply:** milestone 收尾前：

- 先列出这次改动涉及的真实主路径
- 至少选一条完整路径跑通
- 在 PR 或状态文档里明确本次真实验证覆盖了哪一条链路
