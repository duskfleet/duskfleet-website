#!/usr/bin/env bash
# Creates or reuses a build-ready git worktree for one branch, under .claude/worktrees/<name>
# of the MAIN checkout (even when run from inside another worktree).
# Used by the developer agent; handy by hand too.
#
#   bash scripts/pr-worktree.sh <name> <branch> <base>
#   bash scripts/pr-worktree.sh issue-12 site/12-pricing-table main
#
# - Branch already checked out somewhere (main checkout or another worktree): that path is
#   reused; no second worktree is created.
# - Existing worktree at the target path: reused only if it has <branch> checked out.
# - Branch exists locally or on origin: checked out, then fast-forwarded to origin/<branch>
#   when origin has it (the script fails if the local branch has diverged: fix that by hand,
#   agents never rebase or force-push).
# - Otherwise: new branch from <base> (local branch if present, else origin/<base>).
# node_modules is linked from the main checkout when it exists there (one symlink, never
# committed: .claude/ is git-ignored); run `npm ci` in the worktree instead if that fails.
# Prints the worktree path on the last line.
set -euo pipefail

[ $# -eq 3 ] || { echo "usage: $0 <name> <branch> <base>" >&2; exit 2; }
name=$(printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | tr -c 'a-z0-9._\n-' '-')
branch=$2
base=$3

# The main checkout is the parent of the common .git directory, whatever the cwd is.
root=$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")
wt="$root/.claude/worktrees/$name"

git -C "$root" fetch origin --quiet || echo "warning: git fetch failed, using local refs" >&2

# Where is the branch checked out already, if anywhere?
existing=$(git -C "$root" worktree list --porcelain | awk -v b="refs/heads/$branch" '
  /^worktree / { path = substr($0, 10) }
  /^branch / && $2 == b { print path; exit }')

if [ -n "$existing" ]; then
  echo "branch $branch is already checked out at $existing, reusing it" >&2
  wt=$existing
elif [ -d "$wt" ]; then
  current=$(git -C "$wt" rev-parse --abbrev-ref HEAD)
  if [ "$current" != "$branch" ]; then
    echo "error: $wt exists but has $current checked out, not $branch" >&2
    exit 1
  fi
  echo "reusing $wt" >&2
elif git -C "$root" show-ref --verify --quiet "refs/heads/$branch"; then
  git -C "$root" worktree add "$wt" "$branch"
elif git -C "$root" show-ref --verify --quiet "refs/remotes/origin/$branch"; then
  git -C "$root" worktree add --track -b "$branch" "$wt" "origin/$branch"
else
  ref=$base
  git -C "$root" show-ref --verify --quiet "refs/heads/$base" || ref="origin/$base"
  git -C "$root" worktree add --no-track -b "$branch" "$wt" "$ref"
fi

# Bring the branch up to date with origin when origin has it; refuse a diverged branch.
if git -C "$root" show-ref --verify --quiet "refs/remotes/origin/$branch"; then
  if ! git -C "$wt" merge --ff-only --quiet "origin/$branch"; then
    echo "error: $branch has diverged from origin/$branch in $wt; reconcile it by hand" >&2
    exit 1
  fi
fi
if [ -n "$(git -C "$wt" status --porcelain)" ]; then
  echo "warning: $wt has uncommitted changes from an earlier run" >&2
fi

# Dependencies: one symlink to the main checkout's node_modules (same lockfile, pure JS deps).
if [ ! -e "$wt/node_modules" ] && [ -d "$root/node_modules" ]; then
  ln -s "$root/node_modules" "$wt/node_modules"
fi

echo "$wt"
