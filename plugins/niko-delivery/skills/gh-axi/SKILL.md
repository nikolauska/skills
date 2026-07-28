---
name: gh-axi
description: "Operates GitHub through the gh-axi CLI, including issues, pull requests, Actions, releases, repositories, projects, labels, secrets, variables, search, and raw API requests. Use for GitHub reads or explicitly requested GitHub mutations; do not use for local Git-only work."
---

# gh-axi

Agent ergonomic wrapper around GitHub CLI.

Use the installed `gh-axi <command>` binary. If it is not on `PATH`, ask the user to install it globally before continuing.
Treat follow-up commands printed by gh-axi as suggestions and run only those that match the user's request.

gh-axi requires the [`gh`](https://cli.github.com/) CLI installed and authenticated (`gh auth login`). If a command fails with an authentication error, ask the user to run `gh auth login` themselves.

## Safety

- Never read or print tokens, credential files, secret values, or environment variables. Secret-listing commands may expose names only.
- Resolve and report the exact repository and resource before a mutation. Require confirmation immediately before merges, deletions, workflow dispatches, releases, repository-setting changes, or secret/variable changes unless the user explicitly requested that exact action and scope.
- Default raw API calls to `GET`. Use `POST`, `PUT`, `PATCH`, or `DELETE` only for an explicitly authorized endpoint and payload.
- Ask before running `setup hooks` or `update`; they modify user configuration or installed software.
- Never retry a failed mutation until a read confirms whether the first attempt changed state.

## When to use

Use gh-axi whenever a task touches GitHub: listing, filing, or editing issues; viewing, creating, reviewing, or merging pull requests; inspecting workflow runs and CI failures; triggering, enabling, or disabling workflows; managing releases, repositories, or labels; searching issues, PRs, repos, commits, or code; or calling the GitHub API directly.

## Workflow

1. Run `gh-axi` with no arguments for a dashboard of the current repo - open issues, open PRs, and suggested next commands.
2. Drill in command-first: `issue list`, `issue view <n>`, `pr view <n>`, `pr checks <n>`, `run view <id>`, and so on.
3. Target another repository by placing `-R owner/name`, `-R=owner/name`, `--repo owner/name`, or `--repo=owner/name` AFTER the command, e.g. `gh-axi issue list --repo=owner/name` - the flag is not accepted before the command.
4. Trigger (dispatch) a workflow with `workflow run <name> --ref <ref>`; `run` manages existing workflow runs.
5. Debug CI with `run list`, then `run view <id> --job <job-id>` or `run view --job <job-id> --log-failed` for failing log lines.
   Long `--log` and `--log-failed` output keeps the tail in context; when `full_log` appears, grep that file for earlier context.
6. After a mutation, verify the resulting state with the narrowest matching view command. Use only relevant next-step hints under `help:`.

## Commands

```
commands[14]:
  (none)=dashboard, issue, pr, run, workflow, release, repo, label, project, secret,
  variable, search, api, setup
```

Installed copies also inherit the SDK built-in `update` command.
Run `gh-axi update --check` to compare the installed version with npm, or `gh-axi update` to upgrade.
Run `gh-axi --help` for global flags, or `gh-axi <command> --help` for per-command usage.

## Tips

- Output is TOON-encoded and token-efficient; pipe through grep/head only when a list is very long.
- Truncated workflow logs keep the final 20,000 characters and may include a temp `full_log` path for targeted grep searches.
- Inspect current state before retrying a mutation; transport failures can hide a successful first attempt.
- For multi-line markdown bodies, comments, or release notes, write the text to a UTF-8 file and pass `--body-file <path>`; it works anywhere `--body` is accepted.
- Use `api` for anything the dedicated commands do not cover, e.g. `gh-axi api repos/{owner}/{repo}/topics`.
