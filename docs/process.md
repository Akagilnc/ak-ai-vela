# docs/process.md

## 目的
本文件定义仓库层面的项目管理与协作规则，包括 milestone、issue、label、branch、commit、PR。

## Milestone
- Milestone 表示一个可交付的功能阶段，而不是零散任务集合。
- 重要工作应归属到对应 milestone。
- 没有明确交付目标时，不要随意新建 milestone。
- milestone 命名应清晰具体，避免使用"优化""杂项""后续"等模糊名称。

## Issue
- Issue 必须尽量切小，做到可独立完成、独立验证、独立关闭。
- 一个 issue 应只对应一个明确目标，不要混入多个无关需求。
- 如果任务过大，应先拆 issue，再实施。
- issue 至少应说明：
  - 背景 / 问题
  - 目标
  - 范围
  - 验收标准

## Sub-issue
- 当主 issue 仍然过大、需要分步推进时，再使用 sub-issue。
- sub-issue 用于拆解，不用于制造多余层级。
- 如果主 issue 已足够小，不要强行拆 sub-issue。

## Label
- 所有 issue 都应带合适的 label。
- label 只保留必要维度，避免同义重复。
- 至少应能表达任务类型；必要时再补充范围和优先级。

## Branch
- 每个功能使用独立 branch，不直接在主分支上开发。
- branch 名称应简洁明确，能体现任务意图。
- 推荐格式：
  - `feature/*`
  - `fix/*`
  - `refactor/*`
  - `chore/*`

## Commit
- commit message 使用英文。
- 每个 green checkpoint 及时 commit。
- commit 应表达清楚本次改动意图。
- 不要把大量无关改动塞进同一个 commit。

## PR
- 一个 PR 原则上对应一个 issue。
- 如果多个 issue 的改动紧密耦合且无法独立验证，可以一个 PR 关联多个 issue。
- PR 应尽量小而完整，便于 review。
- PR 描述至少应说明：
  - 改了什么
  - 为什么改
  - 如何验证
  - 风险 / 兼容性影响（如有）
  - 关联的 issue
- 在适用时使用 `closes #N` / `fixes #N` / `resolves #N`，确保合并后自动关闭 issue。

## Review 流程
- 功能完成并自测通过后，再发起 PR。
- 发起 PR 前，必须完成以下验证：
  - 单元测试全部通过。
  - 端到端测试覆盖所有主要路径（手动触发、自动触发、各平台等），确认真实 API 调用成功。
  - 不要只跑其中一条路径就认为测试完成。
- 发起 PR 前，检查 issue / label / milestone 是否完整。
- 等待 review。
- 如果 PR 更新后不会自动重新触发 review，可在确认修改完成后手动触发。

### 手动重新触发 Review
- `Gemini`：在 PR 顶层评论发送 `@gemini-code-assist please review`。
- `Codex`：在 PR 顶层评论发送 `@codex review`。
- `GitHub Copilot`：使用 request-review API 触发，不要用 `@copilot review` 评论（会被 Copilot 对话 agent 拦截，不触发代码审查）。
  ```bash
  gh api repos/OWNER/REPO/pulls/N/requested_reviewers -X POST -f 'reviewers[]=copilot-pull-request-reviewer[bot]'
  ```

## Live Smoke 验证规则
- 对于依赖真实浏览器、登录态、第三方平台、外部 API 或 LLM 实时输出的链路，能做 live smoke 就必须做 live smoke。
- 上述链路如果还没有完成 live smoke，只能说明"代码路径已实现"或"局部 smoke 已通过"，不得宣称"主线已完成""真实链路已打通"或"可以放心进入定时运行"。
- live smoke 结果必须明确标注验证语境，例如：
  - `logged_out public-feed smoke`
  - `logged_in account-context smoke`
  - `real browser save-draft smoke`
- 不允许用游客态验证结果冒充账号态验证结果，也不允许用 fixture / mock / partial smoke 冒充真实链路验证。

## Git Hooks
- 仓库包含 `.githooks/pre-push`，禁止直接 push 到 main / master。
- `package.json` 的 `postinstall` 会自动执行 `git config core.hooksPath .githooks`，clone 后 `bun install` 即生效。
- 如果 hook 未生效，手动执行 `git config core.hooksPath .githooks`。
- 此 hook 不影响 GitHub PR merge（服务端操作不经过本地 hook）。

## Agent 默认行为
- 发现任务过大时，应主动建议拆 issue。
- 发现任务属于某个阶段目标时，应建议挂到对应 milestone。
- 准备 PR 时，应提醒检查 issue、label、milestone、验证信息是否完整。
- 不要虚构不存在的 issue、milestone、label 或其状态。
- 如果当前对话中的要求与本文件冲突，优先遵循当前对话中的明确要求。

## 规则优先级
1. 当前对话中的明确要求
2. `CLAUDE.md`
3. 本文件
4. 其他通用习惯
