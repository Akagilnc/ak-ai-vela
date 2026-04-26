# CLAUDE.md（项目级）

本项目继承全局规则与通用约定。本文件 TEMPLATE_END 上方是 schema 引导，下方放项目特有 boilerplate（设计 / 偏好 / 路径假设 / 关键架构事实等）。

## 引用层级

| 层 | 位置 | 内容 |
|---|---|---|
| 全局 hard rules + Claude 特有 | `~/.claude/CLAUDE.md` | SHARED block（违反 = 灾难的 9 条）+ Skill tool 行为 + 调用外部声音 CLI 规则 |
| 通用 dev conventions | `~/WorkSpace/vault/ak-cc-wiki/wiki/concepts/dev-conventions.md` | 角色 / 语言 / 沟通 / TDD 详细 / 实现 / Review / Git / 完成标准 / Skill routing 等 |
| Wiki 全部目录 | `~/WorkSpace/vault/ak-cc-wiki/wiki/index.md` | 概念页 / 实体页 / source / notes 完整索引 |
| 项目特有 | 本文件 TEMPLATE_END 下方 | 仅项目特定的设计 / 偏好 / 路径假设 / 架构事实 |

## 冲突优先级

用户当前对话指令 > 项目特有（本文件 TEMPLATE_END 下方）> 全局 hard rules > 通用 dev conventions > 项目 `docs/process.md`（如存在）

<!-- TEMPLATE_END — 项目特有 sections 写在下面，sync script 不会覆盖下方内容 -->


## Design System
Always read DESIGN.md before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match DESIGN.md.

## 项目累积偏好 (Project Preferences)

> 这 12 条是从 gstack 累积 learnings 里提炼出来的用户明确偏好，每次 session 都要读。
> 完整 56 条 learnings（包括 pitfalls / architectures / operationals / patterns）在
> `~/WorkSpace/vault/创业/learnings.md` 里，需要时查阅，不要全部 inline 进这个文件。
>
> 源数据：`~/.gstack/projects/Akagilnc-ak-ai-vela/learnings.jsonl`
> 刷新方式：`/gstack-learn export` 选择 "append preferences to CLAUDE.md"

### 沟通 / 交付风格

- **design-docs-are-conversation-not-engineering-artifact**：写到
  `~/.gstack/projects/` 或 `vault/创业/` 下的长文本（design doc / plan / checkpoint /
  retro / builder journey / learnings 导出 / 本地便签）属于沟通材料不属于工程产物。
  **默认中文写**，不是英文写完再翻译。英文仅限代码注释、commit message、PR 标题和
  描述。**本条已出现过多次 regression，每次都需要手动纠正。**

- **content-quality-three-standards**：内容质量有 3 条可检查的标准：
  （1）数据正确——推荐的东西必须真实存在；
  （2）推理有效——每条建议要有因果链；
  （3）无 AI slop——删掉所有信息量为零的句子。
  这是可测试的标准，不是模糊的 style preference。

- **no-user-facing-llm**：终端用户不直接接触 LLM。LLM 是创始人的 backend 工具。
  用户应该感觉自己拿到的是人工策划过的输出，不是 AI 实时生成的内容。

### 产品 / 架构偏好

- **understand-child-is-moat**：产品护城河是"深度了解孩子的能力"，不是任何单一
  功能（比如 trait assessment）。Trait assessment 是"了解"的 step 1，但"了解"还
  包括持续追踪、建立信任、demonstrated insight。不要把 moat framing 缩小到单一
  feature。

- **no-diy-trait-framework**：v0.6 不要在自造 10 题 trait quiz 基础上扩展。要用
  有学术背书的验证框架（Temperament / VIA Youth / Big Five for Children /
  Gardner MI），排除 learning style 类模型（VARK/Kolb）。原则：不要从第一性原理
  做看起来科学的东西，如果已经有被验证的研究。

- **co-maker-user-observation-asymmetry**：对于 co-maker 角色的 seed user，创始人
  倾向于**静默追踪行为**而不告诉她，保留观察的 fidelity。接受这会制造角色张力。
  Workaround 是**间接 elicit**：自然对话中用 open-ended 问题问出同样信息，**不**
  直接问 tracked metric。不要建议直接审问 co-maker 类用户。

- **no-premature-infra**：100+ 真实用户之前不考虑云部署、中国本土化托管、API key
  管理。MVP 就在本地跑。

### 工程工作流偏好

- **ai-assisted-developer**：用户主要靠 AI（Claude Code）写代码。技术栈选型优化
  AI 代码生成质量和生态成熟度。

- **ask-before-skipping-deps**：修 bug 需要引入新依赖时，**先问我**，不要自己决定
  "项目还没有这个依赖所以算了"。用户原话："rtl 该加就加，不要找借口，除非你问了我。"

- **post-merge-doc-release**：合并 PR 之前，在 feature branch 上跑
  `/gstack-document-release`（不是 main 上），抓到所有 post-ship 修复之后再 merge。
  Ship 脚本的 step 8.5 太早执行，会 miss 掉 bot review 和 QA 修复。

- **pr-review-three-rounds**：PR 的 AI review 默认 3 轮。修完第 3 轮的发现之后，
  commit + push，**不再触发**新一轮 review。3 轮是上限。

- **reply-to-review-comments**：修完 PR reviewer（Copilot / Gemini / Codex）提的
  issue 之后，对每条 inline comment 都回复：修了什么、哪个 commit、状态
  （fixed / deferred / intentional）。这样 review trail 可读、反馈闭环。

---
