# AGENTS.md（项目级）

本项目继承全局规则与通用约定。本文件 TEMPLATE_END 上方是 schema 引导，下方放项目特有 boilerplate。

## 引用层级

| 层 | 位置 | 内容 |
|---|---|---|
| 全局 hard rules + Codex 特有 | `~/.codex/AGENTS.md` | SHARED block（与 `~/.claude/CLAUDE.md` byte-identical）+ verbose 自检 |
| 通用 dev conventions | `~/WorkSpace/vault/ak-cc-wiki/wiki/concepts/dev-conventions.md` | 同 CLAUDE 引用 |
| Wiki 全部目录 | `~/WorkSpace/vault/ak-cc-wiki/wiki/index.md` | |
| 项目特有 | 本文件 TEMPLATE_END 下方 | 仅项目特定 boilerplate |

## 冲突优先级

用户当前对话指令 > 项目特有（本文件 TEMPLATE_END 下方）> 全局 hard rules > 通用 dev conventions > 项目 `docs/process.md`（如存在）

<!-- TEMPLATE_END — 项目特有 sections 写在下面，sync script 不会覆盖下方内容 -->
