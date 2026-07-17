# AGENTS.md Template

Use this section order. Omit optional sections with no concrete evidence and remove every placeholder before writing.

````markdown
# AGENTS.md
<!-- agents-md-version: 1 -->

## CRITICAL

- MUST: `<exact package-manager rule>`
- MUST: Run `<lint command>` before commit.
- MUST: Run `<test command>` before PR.
- NEVER: `<evidence-backed forbidden action>`
- NEVER: Read or commit `<secret paths or patterns>`.
- NEVER: Edit generated files in `<path>`.
- PREFER: `<project-specific tool choice>` over `<alternative>`.
- ON FAIL: `<non-destructive diagnostic or narrow retry>`.

## Domain & Context

- Goal: `<one-sentence purpose>`
- Type: `<Library | Application | CLI/Tool | Both>`
- License: `<SPDX identifier>`
- Key Terms: `<term and project-specific definition>`
- Decisions: `<ADR or RFC path>`

## Data & State

- Source of Truth: `<schema path>`
- Database / ORM: `<detected values>`
- Migrations / codegen / broker: `<paths; commands belong in Commands>`

## Execution Context

- Run on: `<Host | Docker | Devcontainer | Nix | Hybrid | Serverless>`
- Prefix: `<command prefix when required>`
- Deploys to: `<target>`

## Monorepo

- Manager / root / scope / package pattern: `<detected values>`

| Type | Path | Stack |
|---|---|---|
| `<category>` | `<path>` | `<runtime and tools>` |

## Commands

```bash
# <category>
<exact command>  # ON FAIL: <non-destructive recovery>
```

## Structure

```text
<path>/  # <short purpose; mark generated output>
```

## Patterns

- **Module:** `<ESM | CJS | dual>`
- **Async:** `<dominant pattern and new-code directive>`
- **Naming:** `<file, component/type, and function conventions>`
- `<framework pattern>`: `<where it applies>`

## Search

- Files / exact text / semantic search: `<verified commands or patterns>`

## Testing Strategy

- Runner / fixtures / separation / coverage / E2E / conventions: `<detected values>`

## Security

- NEVER read, write, log, or commit: `<paths and values>`
- Secrets via / CI secrets / dependency scanning: `<detected mechanisms>`

## Env

- `<runtime>`: `<version source>`
- Required vars: `<name and description only; never values>`
- Local setup: `<safe commands>`

## Debugging

- Logs / REPL / debugger: `<verified access>`

## Git

- Branch / commit / hooks / PR / reviews / CODEOWNERS: `<verified conventions>`

## CI

- Runs / required checks / artifacts: `<verified workflow facts>`

## Tool Preferences

| Task | Prefer | Avoid |
|---|---|---|
| `<task>` | `<preferred tool>` | `<alternative>` |
````

Keep commands copy-pasteable from the repository root. Group monorepo packages with the same stack, but verify that every package is represented. Preserve only these generated comments: `agents-md-version`, `GAPS`, `REVIEW`, `REMOVED`, and an existing user-added date `version`.
