---
name: linear-axi
description: Operates Linear through the linear-axi CLI with compact TOON output. Use when listing, viewing, creating, or updating Linear issues, projects, comments, documents, teams, users, labels, cycles, milestones, or statuses, or when binding a repository to a Linear project. Do not use for direct Linear API or browser-only workflows.
---

# linear-axi

Prefer `linear-axi` over raw Linear MCP calls because its output is compact and structured for agents.

Require `linear-axi` to be installed separately and available on `PATH`. If it is missing, ask the user to install it globally before continuing. Never download or execute it through an on-demand package runner.

## Safety

- Never read, print, or modify `.env` files, tokens, OAuth credentials, or credential stores.
- If authorization is required, ask the user to run `linear-axi auth login`; do not start the interactive login. Never log out unless explicitly requested.
- Require confirmation before destructive actions, bulk mutations, or `init` unless the user already requested the exact action and scope.
- Treat `init` as a repository change because it writes `.linear-project`. Do not overwrite an existing binding without confirmation.
- Before mutating an issue, project, document, or comment, resolve the exact target ID when names or slugs are ambiguous.

## Workflow

1. Run `linear-axi` with no arguments for the current repository dashboard. If the repository is not initialized, use its setup hints instead of assuming a workspace or project.
2. Read the most specific help before composing an unfamiliar command: `linear-axi <resource> --help` or `linear-axi <resource> <action> --help`.
3. If project context is needed, run `linear-axi projects list`. Bind the repository only when requested or confirmed with `linear-axi init --project "<project>"`.
4. Drill in command-first with `issues list`, `issues view <id>`, `projects list`, `documents view <id>`, or `comments list --issue <id>`.
5. Add `--fields` for needed columns, `--cursor` for pagination, and `--full` only when complete content is required.
6. For multiline content, write a UTF-8 temporary file and use the command's supported file flag, such as `--description-file`, `--body-file`, or `--content-file`.
7. After a mutation, read the affected object back and report its ID and changed fields. After a failed mutation, verify state before retrying to avoid duplicates.
8. Follow contextual commands under `help:` when they match the user's requested scope.

## Commands

```text
commands:
  dashboard, init, auth, issues, projects, teams, users, comments,
  documents, milestones, cycles, statuses, labels, update
```

Use `linear-axi --help` for global flags and command-specific help for the installed version. Do not memorize flags from this summary.

## Output handling

- Treat stdout as TOON data, including structured errors and suggestions.
- Keep IDs from results so follow-up actions target the same objects.
- Use `--all-projects` only when the user requests workspace-wide issue or document results.
- Show executed commands only when they contain no secrets or sensitive content.
