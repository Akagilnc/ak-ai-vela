#!/usr/bin/env bash
# review-gate :: post-commit 绕过审计
#
# git commit --no-verify 完全跳过 pre-commit（pre-commit 内无法自知被
# 跳）。但 post-commit **不被 --no-verify 跳过**。用它事后侦测：刚落地
# 的 HEAD 若「含非文档文件且 commit 里没有 cross-model review 报告」→
# 绕过了 gate（--no-verify / hook 未装 / amend），追加一行
# .review-bypass.log 供事后 audit。永不阻断，只记录 + stderr 提醒。
# 本脚本必须 git-tracked（理由同 pre-commit）。

set -e

python3 - <<'PY'
import os, re, subprocess, sys, datetime

DOC_EXT = {"md", "mdx", "markdown", "txt", "rst"}
DOC_DIR_PREFIXES = ("docs/",)
DOC_BASENAMES = {"LICENSE", "NOTICE", "CHANGELOG"}
REVIEW_RE = re.compile(r"(cross-model-review|\.cmr-review|\.review)\.md$", re.I)

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

try:
    files = subprocess.check_output(
        ["git", "diff-tree", "--no-commit-id", "--name-only", "-r",
         "--diff-filter=ACM", "HEAD"]
    ).decode("utf-8", "replace").split("\n")
except subprocess.CalledProcessError:
    sys.exit(0)
files = [f for f in files if f.strip()]
if not files:
    sys.exit(0)

non_doc = [f for f in files if not is_doc(f)]
if not non_doc:
    sys.exit(0)

if any(is_review_report(f) for f in files):
    sys.exit(0)

root = subprocess.check_output(
    ["git", "rev-parse", "--show-toplevel"]).decode().strip()
sha = subprocess.check_output(
    ["git", "rev-parse", "--short", "HEAD"]).decode().strip()
subj = subprocess.check_output(
    ["git", "log", "-1", "--format=%s", "HEAD"]).decode().strip()
author = subprocess.check_output(
    ["git", "log", "-1", "--format=%an", "HEAD"]).decode().strip()
ts = datetime.datetime.now().astimezone().isoformat(timespec="seconds")

line = (f"{ts}  {sha}  非文档 commit 无 review 报告（疑似 --no-verify 绕过 "
        f"或 hook 未装）  files={len(non_doc)}  author={author}  "
        f"subj={subj[:80]}\n")

logp = os.path.join(root, ".review-bypass.log")
with open(logp, "a", encoding="utf-8") as f:
    f.write(line)

print(f"[review-gate] ⚠ 绕过已记录 → .review-bypass.log（{sha} 含 "
      f"{len(non_doc)} 个非文档文件、无 review 报告）", file=sys.stderr)
sys.exit(0)
PY
exit 0
