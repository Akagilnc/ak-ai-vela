---
name: Wait for explicit confirmation before modifying repository contents
description: Do not treat discussion, agreement, or self-assessment as authorization to edit files
type: feedback
---

讨论方案、认可分析、或者模型自己判断“这个方向对”，都不等于已经获得了开工授权。

**Rule:** 只有用户明确表达“开始改 / 动手 / 可以实现 / 做 / 写 / proceed / go”之类的意思，才算允许修改仓库内容。

**Why:** 很多越界修改不是因为技术判断错了，而是把“讨论阶段”和“执行阶段”混在了一起：

- 用户可能只是认可分析，不代表要立刻动手
- 模型容易把自己的判断当成继续执行的理由
- 一旦跨过这条线，后面的 diff 和信任成本都会升高

**How to apply:** 提完方案或分析后：

- 默认停在方案 / review / 验证阶段
- 如果用户只是表示“有道理”“这个方向可以”，仍然不要开始改
- 在准备修改前，再确认一次是否已有明确授权
