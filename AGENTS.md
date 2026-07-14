# AGENTS.md
<!-- agents-md-version: 1 -->

## CRITICAL

- MUST: Keep the shared plugin manifests and marketplace catalogs valid JSON.
- MUST: Run the plugin validator and JSON checks before committing.
- MUST: Run `git diff --check` before committing.
- MUST: Use Python 3 standard-library commands as the package-manager policy for repository validation; do not add a runtime dependency for checks.
- MUST: Treat `git diff --check` as the repository lint command.
- MUST: Treat the JSON checks and plugin validator as the repository test suite.
- NEVER: Read, write, log, or commit `.env` files, tokens, API keys, private keys, or credential files.
- NEVER: Put private-repository credentials in Git URLs; use SSH, credential helpers, or environment variables.
- NEVER: Use `npx -y` or another implicit dependency downloader.
- NEVER: Force-push or skip commit hooks.
- PREFER: Use `apply_patch` for edits and `rg`/`rg --files` for search.
- ON FAIL: Read the complete error, check the relevant manifest path, then rerun the smallest failing validation command.

## Domain & Context

- Goal: Distribute the `niko-skills` shared plugin from one Git repository to Codex, Claude Code, and GitHub Copilot CLI.
- Type: Plugin marketplace repository.
- Source of truth: `plugins/niko-skills/skills/` contains the canonical skill payload.
- Client adapters: `.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`, and the two plugin manifests.

## Data & State

- No database, generated source, or external service configuration is stored here.
- Credentials remain in each client’s local authentication or environment configuration.
- Version changes must stay synchronized across both plugin manifests and marketplace metadata.

## Execution Context

- Run on: Host.
- Distribution: Git repository; install and update through each client’s marketplace commands.
- Deploys to: User-level plugin caches on Codex, Claude Code, and GitHub Copilot CLI.

## Commands

```bash
# validate JSON
python3 -m json.tool .agents/plugins/marketplace.json >/dev/null && python3 -m json.tool .claude-plugin/marketplace.json >/dev/null && python3 -m json.tool plugins/niko-skills/.codex-plugin/plugin.json >/dev/null && python3 -m json.tool plugins/niko-skills/.claude-plugin/plugin.json >/dev/null  # ON FAIL: inspect the reported JSON file and rerun this command
# validate plugin
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/plugin-creator/scripts/validate_plugin.py" plugins/niko-skills  # ON FAIL: fix manifest or SKILL.md frontmatter errors, then rerun
# lint whitespace
git diff --check  # ON FAIL: fix whitespace errors in the reported files
# count skill entrypoints
test "$(find plugins/niko-skills/skills -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l)" -eq 32  # ON FAIL: inspect the plugin skills tree for missing or extra entrypoints
```

## Structure

```
.agents/plugins/              # Codex marketplace catalog
.claude-plugin/               # Claude Code and Copilot marketplace catalog
plugins/niko-skills/          # Cross-client plugin
plugins/niko-skills/.codex-plugin/   # Codex manifest
plugins/niko-skills/.claude-plugin/  # Claude/Copilot manifest
plugins/niko-skills/skills/   # Canonical skill payload
README.md                     # Installation and update guide
```

## Patterns

- **Packaging:** Keep one canonical `SKILL.md` per skill; client manifests and catalogs are thin adapters.
- **Naming:** Use lowercase kebab-case for plugin and skill directories and matching frontmatter names.
- **Organization:** Keep runtime skill directories flat; document human-facing categories in `README.md`.
- **Dependencies:** Use installed CLI binaries and ask the user to install missing tools globally; never download them implicitly.

## Search

- Files: `rg --files plugins/niko-skills/skills`
- Skill metadata: `rg -n '^(name|description):' plugins/niko-skills/skills`
- Dependency-download policy: `rg -n 'npx -y' .`

## Testing Strategy

- Runner: Python standard-library JSON parsing plus the Codex plugin validator.
- Coverage: Every skill directory must contain one valid `SKILL.md`; all four manifests/catalogs must parse.
- Client smoke tests: When installed, run `claude plugin validate .` and `copilot plugin install ./plugins/niko-skills`.
- Conventions: Validate locally before each focused commit; test marketplace add/update flows after pushing.

## Security

- NEVER read or commit `.env`, `.env.*`, credential stores, private keys, or client cache data.
- NEVER place tokens in Git URLs or marketplace source strings.
- Secrets via: SSH keys, Git credential helpers, `gh auth login`, `GH_TOKEN`, or `GITHUB_TOKEN`.
- Do not add MCP credentials or server configuration to this repository.

## Env

- `CODEX_HOME`: Optional Codex installation root; defaults to `$HOME/.codex`.
- `GH_TOKEN`: Optional GitHub token for non-interactive private marketplace access.
- `GITHUB_TOKEN`: Optional equivalent GitHub token for non-interactive private marketplace access.

## Git

- Branch: `main`.
- Commit: Conventional Commit format with one logical change per commit and a short reason.
- Hooks: Do not bypass hooks with `--no-verify`.
- Remote: GitHub repository `nikolauska/skills`.
- Push: Push normal commits; never force-push shared branches.

## Tool Preferences

| Task | Prefer | Avoid |
|------|--------|-------|
| Edit files | `apply_patch` | Shell write tricks |
| Search | `rg`, `rg --files` | Broad recursive scans |
| Validate JSON | `python3 -m json.tool` | New validation dependencies |
| Validate plugin | Bundled Codex plugin validator | Handwritten schema replacements |
| Install CLI dependencies | Global installation with user approval | `npx -y` |
