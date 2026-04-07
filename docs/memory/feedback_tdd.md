---
name: Treat tests as part of implementation
description: Write tests before or alongside implementation instead of adding them as a later cleanup step
type: feedback
---

测试不是实现完成后的补票动作，而应该是功能实现的一部分。

**Rule:** 行为变更默认走 TDD，至少也要做到测试和实现同步落地，不要等功能堆完了再统一“补测试”。

**Why:** 测试如果总是在最后补，通常会带来几个问题：

- 需求边界没有被及时固定
- 实现更容易先跑偏，再回头硬修
- “补测试” 往往会被压到最后，最终变成漏测

**How to apply:** 开始实现前：

- 先想清楚需要什么测试来锁住行为
- 能先写失败测试时，就先写失败测试
- 如果场景不适合严格红绿重构，也至少让测试和实现在同一个变更里完成
