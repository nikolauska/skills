---
name: writing-agents-md
description: >
  Write or update AGENTS.md, CLAUDE.md, or another requested coding-agent context file.
  Use when the user asks to create, revise, or onboard agents with repository instructions;
  not for a read-only review of existing instructions.
compatibility: "Codex CLI, Claude Code/Desktop, Cursor, Windsurf, Gemini, GitHub Copilot (no dependencies)"
---

# Writing agent context

Write only the context files the user requested and any files required by their requested imports. An explicit request to create or update these files authorizes local edits within that scope; do not pause for routine approval.

- Read existing instructions first, then inspect only relevant repository evidence: README, build scripts, configuration, nearby source, tests, or CI as needed for the requested change. For a targeted update, investigate the affected guidance rather than reanalyzing everything. Do not read secrets, credentials, or private environment files; templates may establish variable names but should not be copied as secret values. Do not browse or contact external systems unless requested.
- Preserve useful curated decisions and existing instructions. Correct stale facts using project evidence, but resolve substantive conflicts with the user rather than silently overwriting an unclear decision. Avoid duplicating instructions already available through an import or an applicable ancestor context file.
- Write concise, actionable guidance for this repository and its agents: where to work, relevant conventions and boundaries, and exact commands with their working directory when evidenced. Include project-specific permissions and safety boundaries where they matter (for example, whether local tests are safe or deployments need approval). Do not infer generic bans from a tool's mere presence, invent commands, mandate a section layout, or pad the file with a stack inventory. Organize around what an agent needs to do; omit unsupported or redundant material.
- If the user requests a `CLAUDE.md` import, check that each `@` target resolves and preserve existing content and imports. Create a referenced `AGENTS.md` only when needed for the requested import and within scope; otherwise do not create additional agent files or derived copies. Respect existing context-file conventions instead of imposing an AGENTS.md schema.
- Before finishing, check that edited paths and imports resolve, included commands and paths match the repository, and the requested output is complete without contradictions or secrets. Run a relevant safe check when useful, not a mandatory test suite or fixed review ritual. Report what changed and any unresolved evidence gaps.

Do not run destructive commands, publish, deploy, or perform other out-of-scope or external actions without explicit authorization. Seek a decision before destructive overwrites or edits outside the requested scope.
