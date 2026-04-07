---
name: Separate internal outputs, operator handoff, and export-specific prep
description: Keep canonical outputs, human-facing handoff directories, and platform-specific preparation logic at clear boundaries
type: feedback
---

在带有人工作业环节的内容流水线里，系统内部产物、人类操作入口、平台特定处理不应该混在一起。

**Rule:** 设计这类流程时，至少区分三层职责：

- internal canonical outputs：机器可追踪、可版本化、可保留历史
- operator-facing handoff outputs：给人快速打开和继续操作的浅层入口
- export / adapter-specific preparation：平台特定的尺寸、格式、目录或发布前处理

**Why:** 在实际项目中，几个关键结论都来自这条边界的澄清：

- 操作员真正需要的是浅层输出目录，而不是深层内部目录
- 只要人工可能修改或复用导出结果，就不能只靠覆盖式幂等；内部版本历史要保留
- 平台特定的尺寸准备职责属于 exporter，不应该污染共享生成阶段

**How to apply:** 以后遇到"系统生成 -> 人工挑选 / 修改 -> 平台导出 / 上传"的链路时：

- 先定义哪一层是系统 canonical source
- 再定义哪一层是给人使用的 shallow handoff
- 把平台或渠道特有的准备逻辑压在 export / publish 边界，而不是提前塞进共享核心流程
