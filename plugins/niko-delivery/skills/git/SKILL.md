---
name: git
description: Manages commits, branches, and change history in Git repositories. Use when the user asks to commit, branch, rebase, merge, tag, or otherwise change version-control state; do not use for read-only code inspection alone.
---

# Git

## Safety

- Inspect `git status` and the relevant staged and unstaged diffs before every commit. Preserve unrelated user changes and stage only the requested scope.
- Never read, stage, or commit credential files, `.env` files, private keys, tokens, or generated secret material.
- Do not fetch, pull, push, or contact a remote unless the user requested a workflow that requires it.
- Require explicit approval before rewriting published history, force-pushing, deleting branches or tags, or discarding work. Never use plain `--force`; use `--force-with-lease` only after approval.
- Never bypass hooks. If a hook fails, fix the cause or report the blocker.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/) — `type(scope): subject`. Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `build`, `ci`, `perf`. Single-line subject, aim under 50 characters and never over 72. Do not put issue references or links in the subject (`(#123)`, `Fixes #123`) — those belong in the PR body. Defer to the repo's `AGENTS.md` or contributing guide if it overrides this.

## Branch workflow

- Start from the intended base branch. Update it from a remote only when the user requested that network action.
- Use short topic branch names without type prefixes, e.g. `signal-toolkit`, not `feat/signal-toolkit`.
- Rewrite unpublished local history only when it improves the requested deliverable and does not discard work.
- Never amend commits already pushed to remote.
- Never force-push a shared branch.
- Never use `git -C <path>` — always `cd` into the target first. It hides the real working directory and risks operating on the wrong repo.
- Land PRs with the repo's configured merge method. When none is set, default to squash — keeps history linear, one merge commit per PR.
- After a PR merges, delete local or remote branches only when the user requested cleanup.
