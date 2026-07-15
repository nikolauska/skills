---
name: clockify-cli
description: Operates Clockify through the clockify-cli command-line client. Use when tracking, stopping, cloning, editing, splitting, deleting, or reporting time entries; managing Clockify projects, clients, tasks, tags, users, workspaces, or configuration; or inspecting Clockify account data from a terminal. Do not use for browser-only Clockify workflows or direct Clockify API development.
---

# Clockify CLI

Use the installed `clockify-cli` binary and its live help as the command reference.

## Safety

- Never read or display configuration files, API tokens, environment variables, or credentials.
- Never pass a token on the command line. Rely on existing configuration or environment authentication without inspecting it.
- If authentication is missing, ask the user to configure `clockify-cli`; do not run an interactive setup or request the token.
- Require confirmation immediately before any deletion, changing CLI configuration, or applying one mutation to multiple records unless the user explicitly requested that exact action and scope.
- Treat every deletion as irreversible and use exact IDs. Before deleting a time entry, identify it with `show`. Before deleting a task, identify it with `task list --project <project-id>` and warn that existing time entries will lose their task association.
- Keep web browsing out of the workflow; use the installed CLI help.

## Workflow

1. Check that `clockify-cli` is on `PATH`. If missing, ask the user to install it globally.
2. Run `clockify-cli --help` once per session or when the command is unknown. Immediately before composing a command, read its most specific help: `clockify-cli <command> --help` or `clockify-cli <command> <subcommand> --help`.
3. Resolve context with read-only commands when needed:
   - `clockify-cli workspace` for workspace IDs.
   - `clockify-cli me` for the token owner.
   - `clockify-cli project list`, `client list`, `task list`, `tag`, or `user` for resource IDs.
4. Prefer `--interactive=0` so agent-run commands never pause for input. Use `--allow-name-for-id` only when names are unambiguous.
5. Run the narrowest command that satisfies the request. Use structured output such as `--json`, `--quiet`, or `--format` when it reduces parsing ambiguity.
6. Validate mutations with the smallest read-back:
   - Time entry: `clockify-cli show <id>` or `clockify-cli show current`.
   - Project, client, or task: its corresponding `list` command with a narrow filter.
   - Start or stop: `clockify-cli show current` or `clockify-cli report today`.
7. Report what changed, including returned IDs and times. Redact any credential-like value.

## Command map

- Track time: `in`, `out`, `manual`, `clone`, `edit`, `split`, `show`, `delete`.
- Report time: `report [<start>] [<end>]`; relative ranges are available as report subcommands.
- Invoice state: `mark-invoiced`, `mark-not-invoiced`.
- Resources: `client`, `project`, `task`, `tag`, `user`, `workspace`.
- Identity and setup: `me`, `config`, `version`, `completion`.

Do not memorize flags from this map. Read the relevant `--help` because accepted flags, date formats, aliases, and required arguments vary by command.

## Failure handling

- On invalid usage, read the complete error and rerun the most specific `--help`; do not guess flags.
- On ambiguous names, list matching resources and use the exact ID.
- On missing workspace or user context, stop and tell the user which configuration is absent without exposing config contents.
- On a failed mutation, verify state with a read command before retrying to avoid duplicates.

## Output rules

- Show the exact command only when it contains no secrets.
- Distinguish planned, completed, and verified actions.
- Preserve Clockify IDs in results so later edits can target the same records.
