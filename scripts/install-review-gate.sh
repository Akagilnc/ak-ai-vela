#!/usr/bin/env bash
# 安装 review-gate（pre-commit 硬拦 + post-commit 绕过审计）。
# 不覆盖已有 hook：若已存在且非本 gate symlink → 警告并跳过那一个。
# 前提：scripts/ 三脚本必须已 git-tracked，否则 active 仓并发 git
# checkout/clean / 新 clone 会令 hook 静默失效（vela 实测反复发生）。
# 新机器 / 新 clone 跑一次：bash scripts/install-review-gate.sh

set -euo pipefail

ROOT=$(git rev-parse --show-toplevel)
HOOKS=$(git rev-parse --git-path hooks)
mkdir -p "$HOOKS"
chmod +x "$ROOT/scripts/review-gate-precommit.sh" "$ROOT/scripts/review-gate-postcommit.sh"

if [ "$(git ls-files scripts/review-gate-precommit.sh | wc -l | tr -d ' ')" = "0" ]; then
  echo "  ⚠ scripts/ 尚未 git-tracked —— 先 git add scripts/ && commit，否则 hook 会静默失效"
fi

link_one() {
  local name="$1" target="$2" dst="$HOOKS/$1"
  if [ -L "$dst" ]; then
    local cur; cur=$(readlink "$dst")
    if [ "$cur" = "$target" ]; then echo "  = $name 已是本 gate symlink"; return; fi
    echo "  ! $name 是别的 symlink（$cur）—— 不覆盖，手动 chain"; return
  fi
  if [ -e "$dst" ]; then
    echo "  ! $name 已存在（非 symlink）—— 不覆盖；手动在其末尾调用 \"$target\""
    return
  fi
  ln -s "$target" "$dst"; echo "  + $name → $target"
}

echo "[review-gate] 安装到 $HOOKS"
link_one pre-commit  "$ROOT/scripts/review-gate-precommit.sh"
link_one post-commit "$ROOT/scripts/review-gate-postcommit.sh"

GI="$ROOT/.gitignore"
if [ ! -f "$GI" ] || ! grep -qxF ".review-bypass.log" "$GI" 2>/dev/null; then
  printf '\n# review-gate 本地绕过审计（不入库）\n.review-bypass.log\n' >> "$GI"
  echo "  + .gitignore 追加 .review-bypass.log"
else
  echo "  = .gitignore 已含 .review-bypass.log"
fi
echo "[review-gate] 完成。"
