---
name: Use worktrees for isolated follow-up work
description: Split small independent cleanup or follow-up tasks into a separate worktree when the current checkout still contains mixed drafts
type: feedback
---

当本地已经有一个较大的草稿分支，或者刚做完一轮改动、还要顺手处理另一个独立小任务时，不要继续把无关改动堆在同一个 checkout 里。

**Rule:** 如果后续任务可以独立成一个小 PR，就优先从干净基线拉一个单独 branch/worktree 来做。

**Why:** 这样做通常更稳：

- diff 和 review 边界更清楚
- 可以先合并高优先级改动，再慢慢处理后续清理
- 不容易把历史草稿误当成当前 authoritative state

**How to apply:** 遇到“主改动已经在一个分支里，但还想补文档、memory、清理项或另一个独立修复”时：

- 从最新主分支拉一个新的小分支
- 用 worktree 给这个分支单独的工作目录
- 只在那个 worktree 里处理这一个 follow-up 任务
