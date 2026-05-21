#!/usr/bin/env bash
# review-gate :: pre-commit 硬拦（git 层，弱半边）
#
# 职责边界（重要 — 见 wiki [[claude-code-hooks]] 两层 hook 分析）：
# 本 git hook 只能拦 commit 时刻的事实。它**结构上看不见**
# "cross-model review 跑没跑/收没收敛" —— 那要靠 harness hook
# (settings.json PreToolUse) + gate marker。本 hook 的 review-report
# 检查是「软痕迹」不是真闸；真闸在 harness 层（暂未建）。
#
# 规则：staged 含「非文档」→ 必须同 commit 有 cross-model review
# 报告（.md），且报告 mtime ≥ 最新 staged 非文档文件。否则 exit 1。
# 纯文档 commit 直接放行。
#
# ── 强度（诚实，不做 silent theater）──
# 「中」：same-commit staged + mtime≥代码。挡：没报告 / 旧报告。
# 挡不住：`touch 报告.md` 伪造新鲜度。强绑 diff-hash 是 harness 层的事。
# ── --no-verify ──
# git commit --no-verify 完全跳过本 hook（git 行为）。绕过审计靠
# 配套 post-commit 写 .review-bypass.log。
# ── 持久性（实锤教训）──
# 本脚本必须 git-tracked。未 tracked 时：active 仓的并发 git
# checkout/clean、分支切换、新 clone 会令脚本消失、symlink dangling、
# hook 静默失效（vela 实测：未 tracked 期间被反复清空）。

set -e

python3 - <<'PY'
import os, re, subprocess, sys

DOC_EXT = {"md", "mdx", "markdown", "txt", "rst"}
DOC_DIR_PREFIXES = ("docs/",)
DOC_BASENAMES = {"LICENSE", "NOTICE", "CHANGELOG"}
REVIEW_RE = re.compile(r"(cross-model-review|\.cmr-review|\.review)\.md$", re.I)

def staged_files():
    out = subprocess.check_output(
        ["git", "diff", "--cached", "--name-only", "--diff-filter=ACM", "-z"]
    )
    return [f.decode("utf-8", "replace") for f in out.split(b"\0") if f]

def is_doc(path):
    base = os.path.basename(path)
    if base in DOC_BASENAMES:
        return True
    if any(path.startswith(p) for p in DOC_DIR_PREFIXES):
        return True
    ext = base.rsplit(".", 1)[-1].lower() if "." in base else ""
    return ext in DOC_EXT

def is_review_report(path):
    return bool(REVIEW_RE.search(os.path.basename(path)))

def mtime(path):
    try:
        return os.path.getmtime(path)
    except OSError:
        return -1.0

files = staged_files()
if not files:
    sys.exit(0)

non_doc = [f for f in files if not is_doc(f)]
if not non_doc:
    sys.exit(0)

reports = [f for f in files if is_review_report(f)]

def fail(msg, detail_lines):
    print("\n[review-gate] ✗ 提交被拦截：" + msg, file=sys.stderr)
    for l in detail_lines:
        print("  " + l, file=sys.stderr)
    print("", file=sys.stderr)
    print("  本次含非文档文件（需 cross-model review 报告）：", file=sys.stderr)
    for f in non_doc[:12]:
        print("    - " + f, file=sys.stderr)
    if len(non_doc) > 12:
        print(f"    ... 另 {len(non_doc) - 12} 个", file=sys.stderr)
    print("", file=sys.stderr)
    print("  合规方式（任一）：", file=sys.stderr)
    print("    1. 跑 cross-model review，把报告 md（名含 cross-model-review", file=sys.stderr)
    print("       / *.cmr-review.md / *.review.md）和代码一起 git add 再 commit", file=sys.stderr)
    print("    2. 确认报告 mtime 不早于改动的代码（旧报告=没 review 本次）", file=sys.stderr)
    print("  纯 baseline/wip 不想现在 review：`git commit --no-verify`", file=sys.stderr)
    print("    （会被 post-commit 记入 .review-bypass.log 供事后 audit）", file=sys.stderr)
    sys.exit(1)

if not reports:
    fail("非文档改动但没有 staged 的 cross-model review 报告", [])

newest_code = max((mtime(f) for f in non_doc), default=-1.0)
best_report = max((mtime(f) for f in reports), default=-1.0)

if best_report < newest_code:
    fail(
        "review 报告比改动的代码旧 —— 疑似旧报告，未 review 本次改动",
        [
            f"最新代码 mtime = {newest_code:.3f}",
            f"最新报告 mtime = {best_report:.3f}",
            "（重跑 review 并更新报告，或确认报告确实覆盖本次 diff）",
        ],
    )

print(f"[review-gate] ✓ 非文档改动 + 合规 review 报告（{len(reports)} 份，mtime OK），放行")
sys.exit(0)
PY
exit 0
