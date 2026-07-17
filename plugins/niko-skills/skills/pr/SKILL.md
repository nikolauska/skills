---
name: pr
description: Creates or updates a pull request after review and verification. Use when a branch is ready for remote review or the user asks to revise its existing pull request; do not use for local-only commits or unfinished implementation.
---

# Pull Request

Use **Create mode** when the current branch has no open pull request and **Update mode** when one already exists. Read repository instructions and resolve the configured base branch, remote, and PR template instead of assuming `main` or `origin`.

## Safety

- Never read credential files or include secrets, tokens, private keys, customer data, or credential-bearing URLs in commits, PR text, commands, or logs.
- Do not push, rewrite history, rename branches, or modify a pull request until the user approves the exact title and body.
- Never rewrite published history or force-push without separate explicit approval.
- Link or close an issue only when its relationship is confirmed; do not infer `Fixes #...` from a loose keyword match.

## Conventions

- Follow repository-specific title and body rules first. Otherwise use a Conventional Commit title under 60 characters with no trailing period.
- Fill every section of `.github/pull_request_template.md` when present; do not add or remove its sections.
- Keep the body concise: reviewer-relevant behavior and motivation, validation, and confirmed issue linkage. Omit mechanical details visible in the diff.

## Workflow

### 1. Resolve mode and context

1. Confirm the current repository, branch, remote, default base branch, working-tree state, and whether an open PR exists for the branch.
2. Read repository instructions and the PR template when present.
3. Inspect the commits and full diff against the resolved base branch.
4. Check the diff and proposed PR text for sensitive data before any external action.

### 2A. Update an existing PR

1. Read the current PR title, body, URL, review state, and changed diff.
2. Draft only the requested title or body changes, preserving required template sections.
3. Show the exact final title and body and wait for approval.
4. Update the existing PR without pushing unrelated local commits.
5. Read the PR back, verify the title and body, and return its URL.

### 2B. Create a PR

1. Require a clean working tree and at least one branch commit ahead of the resolved base.
2. Run the repository's required lint, test, type-check, and build commands. Report unavailable or prohibitively large checks instead of silently skipping them.
3. Run the `review` skill when available. Stop on must-fix findings.
4. Audit commit scope and messages. If history needs rewriting, explain the exact rewrite and obtain approval before changing it; re-audit afterward.
5. Search for related issues and include closing syntax only for a relationship confirmed by the user or explicit repository evidence.
6. Draft the exact title and body, show both, and wait for approval.
7. Check tracking state, then push the current branch to the resolved remote if needed. Never force-push.
8. Create the PR against the resolved base, read it back, and verify title, body, head, and base.
9. Return the PR URL and name the validation and review gates that passed.

## Failure handling

- If verification or review fails, stop before pushing and report the smallest actionable failure.
- If a push or PR mutation returns an ambiguous transport error, read remote state before retrying.
- If the branch already has a PR after a race, switch to Update mode rather than creating a duplicate.
- If authentication is missing, ask the user to authenticate the installed GitHub client; never request or inspect a token.
