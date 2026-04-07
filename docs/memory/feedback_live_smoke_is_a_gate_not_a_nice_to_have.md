---
name: Live smoke is a release gate, not a nice-to-have
description: For browser, login, third-party, and live LLM workflows, real smoke validation is mandatory before claiming the path is complete
type: feedback
---

单元测试、fixture 测试、局部 integration test、甚至一次"看起来成功"的真实运行，都不足以说明涉及外部系统的主线真的通了。

**Rule:** 只要链路依赖真实浏览器、登录态、第三方平台、外部 API 或 LLM 实时输出，能做 live smoke 就必须做；未完成 live smoke，不得宣称主线完成。

**Why:** 这类链路最危险的地方在于：

- 系统会给人一种"已经可以用了"的错觉
- 日志和结果字段可能在撒谎（例如状态返回成功，但实际上下文并未正确接入）
- fixture、mock、partial smoke 会高估真实完成度
- 浏览器形态差异（例如 `headless`）和脆弱 selector 只会在 live 场景里暴露

**How to apply:** 后续凡是碰到类似链路：

- 在 PR 或阶段总结里明确写出本次 smoke 的语境
- 不同语境分别记，不得混写：
  - `logged_out public-feed`
  - `logged_in account-context`
  - `real browser fallback`
- 如果 live smoke 只证明了部分语境，就只能声称该语境已验证，不能扩大成"真实链路已完成"
- 如果 live smoke 暴露字段误判、语境误判、平台差异或行为差异，先修真实链路，再决定能不能宣称完成
