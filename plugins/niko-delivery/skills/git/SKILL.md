---
name: git
description: Manages commits, branches, and change history in Git repositories. Use when the user asks to commit, branch, rebase, merge, tag, or otherwise change version-control state; do not use for read-only code inspection alone.
---

# Git

Commits are save points, branches are sandboxes, history is documentation. Treat them accordingly.

## Safety

- Inspect `git status` and the relevant staged and unstaged diffs before every commit. Preserve unrelated user changes and stage only the requested scope.
- Never read, stage, or commit credential files, `.env` files, private keys, tokens, or generated secret material.
- Do not fetch, pull, push, or contact a remote unless the user requested a workflow that requires it.
- Require explicit approval before rewriting published history, force-pushing, deleting branches or tags, or discarding work. Never use plain `--force`; use `--force-with-lease` only after approval.
- Never bypass hooks. If a hook fails, fix the cause or report the blocker.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/) — `type(scope): subject`. Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `build`, `ci`, `perf`. Single-line subject, aim under 50 characters and never over 72. Do not put issue references or links in the subject (`(#123)`, `Fixes #123`) — those belong in the PR body. Defer to the repo's `AGENTS.md` or contributing guide if it overrides this.

## Commit discipline

- **Commit after each successful slice.** Don't accumulate work — a commit is a save point you can return to.
- **One logical change per commit.** A commit that refactors and adds a feature is two commits.
- **Explain intent, not mechanics.** Describe why the change matters, not what files were touched.

## Change sizing

Size commits by logical purpose, not line count. Separate refactoring from behavior changes and formatting from functional edits when they can stand alone; keep generated output or mechanical deletions with the change that requires them.

## Branch workflow

- Start from the intended base branch. Update it from a remote only when the user requested that network action.
- Use short topic branch names without type prefixes, e.g. `signal-toolkit`, not `feat/signal-toolkit`.
- Keep branches short-lived — merge within days, not weeks.
- Rewrite unpublished local history only when it improves the requested deliverable and does not discard work.
- Never amend commits already pushed to remote.
- Never force-push a shared branch.
- Never use `git -C <path>` — always `cd` into the target first. It hides the real working directory and risks operating on the wrong repo.
- Land PRs with the repo's configured merge method. When none is set, default to squash — keeps history linear, one merge commit per PR.
- After a PR merges, delete local or remote branches only when the user requested cleanup.

## Save-point pattern

When exploring uncertain changes, commit early with a clear message. If the approach doesn't work out, you can revert cleanly. Uncommitted work can't be reverted — only lost.

## Change summaries

After a set of changes, provide a structured summary:
- **What changed** — the diff in plain language
- **What was intentionally excluded** — scope discipline
- **What to watch** — potential concerns for reviewers

## Red flags

- Long-lived branches diverging from main
- Commits with "misc", "fix", "update" as the entire message
- Force-pushing to shared branches
- Mixing unrelated changes in one commit
- Working without committing for extended periods
