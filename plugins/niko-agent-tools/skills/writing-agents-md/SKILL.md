---
name: writing-agents-md
description: >
  Create or revise requested AGENTS.md, CLAUDE.md, or other coding-agent context files.
  Use for writing repository instructions, not read-only audits.
compatibility: "Codex CLI, Claude Code/Desktop, Cursor, Windsurf, Gemini, GitHub Copilot (no dependencies)"
---

# Writing agent context

Write only the context files the user requested and files required by their requested imports. Local edits within that scope need no extra approval.

- Read existing instructions, then inspect only the repository evidence relevant to the change (for example, build scripts, CI, or nearby code). Do not read secrets, credentials, or private environment files; do not browse unless requested.
- Reassess each inherited instruction: keep useful project decisions, correct stale facts with evidence, and remove redundant or model-specific scaffolding that no longer helps. Resolve substantive conflicts with the user rather than silently discarding an unclear decision. Avoid repeating applicable ancestor instructions or imports.
- Keep always-loaded context lean. Name the relevant document *and when to read it* instead of requiring a full repo map or a stack of docs before every edit. If describing skills, give them narrow task triggers; avoid mandates to load unrelated skills or follow elaborate recipes. Write for agents on different models without assuming one model's habits.
- Give actionable project-specific paths, conventions, boundaries, and commands with their working directory when evidenced. Distinguish safe local work from actions requiring authorization: if tests use disposable fixtures and have no production access, say agents may run them, fix failures caused by their change, and rerun affected checks without pausing. Do not assume unknown commands are safe, impose exhaustive checks for trivial edits, or ask for approval at each routine step.
- Where a workflow needs an explicit finish line, state the observable result and relevant check: implement, run or inspect the changed behavior, and fix failures caused by the change. Do not make a first draft an automatic review gate unless the project actually requires one. Omit unsupported bans, invented commands, stack inventories, and fixed section templates.
- For a requested `CLAUDE.md` import, preserve existing content and imports and check each `@` target. Create a referenced `AGENTS.md` only if necessary and in scope; do not generate extra copies.
- Check that edited paths and imports resolve, commands and claims match repository evidence, and instructions do not contradict each other or expose secrets. Report what changed and any unresolved evidence gaps.

Do not run destructive commands, publish, deploy, or take other out-of-scope or external actions without authorization. Ask before destructive overwrites or edits outside the requested scope.
