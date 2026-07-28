# AGENTS.md
<!-- agents-md-version: 1 -->

## CRITICAL

- MUST: Keep every focused plugin manifest and both marketplace catalogs valid JSON.
- MUST: Before committing a change under an existing `plugins/<plugin>/`, run `node scripts/bump-version.mjs <plugin> <patch|minor|major>`; the script validates the plugin before updating its versions.
- MUST: Bump each affected plugin independently: patch for fixes or instruction refinements, minor for new skills or backward-compatible capabilities, and major for removals, renames, or incompatible behavior.
- MUST: Initialize new plugins at version `1.0.0`.
- NEVER: Edit plugin or marketplace version fields manually.
- MUST: Run the plugin validator and JSON checks before committing.
- MUST: Run `node scripts/validate-plugins.mjs` after plugin changes that are not followed by a version bump, including new plugins.
- MUST: Run `git diff --check` before committing.
- MUST: Use Python 3 standard-library commands as the package-manager policy for repository validation; do not add a runtime dependency for checks.
- MUST: Treat `git diff --check` as the repository lint command.
- MUST: Treat the JSON checks, changed-plugin validator, and root script tests as the repository test suite.
- NEVER: Read, write, log, or commit `.env` files, tokens, API keys, private keys, or credential files.
- NEVER: Put private-repository credentials in Git URLs; use SSH, credential helpers, or environment variables.
- NEVER: Use `npx -y` or another implicit dependency downloader.
- NEVER: Force-push or skip commit hooks.
- PREFER: Use `apply_patch` for edits and `rg`/`rg --files` for search.
- ON FAIL: Read the complete error, check the relevant manifest path, then rerun the smallest failing validation command.

## Domain & Context

- Goal: Distribute focused, opt-in skill plugins from one Git repository to Codex, Claude Code, GitHub Copilot CLI, and Oh My Pi.
- Type: Multi-plugin marketplace repository.
- Source of truth: Each skill has one canonical home under `plugins/<plugin>/skills/`.
- Client adapters: `.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`, and each plugin's three client manifests.

## Data & State

- No database, generated source, or external service configuration is stored here.
- Credentials remain in each client’s local authentication or environment configuration.
- Existing plugins version independently. Every plugin change must update that plugin's three manifests and Claude marketplace entry through `scripts/bump-version.mjs`.

## Execution Context

- Run on: Host.
- Distribution: Git repository; install and update focused plugins through each client's marketplace commands.
- Deploys to: User-level plugin caches on Codex, Claude Code, GitHub Copilot CLI, and Oh My Pi.

## Commands

```bash
# test repository scripts
node --test scripts/*.test.mjs  # ON FAIL: fix the failing version-selection, isolation, or changed-plugin validation case, then rerun this command
# validate JSON
python3 -m json.tool .agents/plugins/marketplace.json >/dev/null && python3 -m json.tool .claude-plugin/marketplace.json >/dev/null && for manifest in plugins/*/.codex-plugin/plugin.json plugins/*/.claude-plugin/plugin.json plugins/*/.github/plugin/plugin.json; do python3 -m json.tool "$manifest" >/dev/null || exit; done  # ON FAIL: inspect the reported JSON file and rerun this command
# validate changed plugins not followed by a version bump
node scripts/validate-plugins.mjs  # ON FAIL: fix the reported manifest or SKILL.md frontmatter errors, then rerun this command
# bump and validate one existing plugin
node scripts/bump-version.mjs <plugin> <patch|minor|major>  # ON FAIL: resolve validation errors or mismatched metadata for the selected plugin, then rerun
# lint whitespace
git diff --check  # ON FAIL: fix whitespace errors in the reported files
```

## Structure

```
.agents/plugins/marketplace.json          # Codex marketplace catalog
scripts/                                # Version bump and changed-plugin validation scripts
.claude-plugin/marketplace.json           # Claude/Copilot marketplace catalog
plugins/<plugin>/.codex-plugin/           # Codex manifest
plugins/<plugin>/.claude-plugin/          # Claude manifest
plugins/<plugin>/.github/plugin/          # Copilot CLI manifest
plugins/<plugin>/skills/                  # Canonical skills owned by one plugin
README.md                                 # Installation, migration, and update guide
```

## Patterns

- **Packaging:** Keep one canonical `SKILL.md` per skill; the three client manifests and marketplace entries are thin adapters.
- **Naming:** Use lowercase kebab-case for plugin and skill directories and matching manifest/frontmatter names.
- **Organization:** Keep each plugin's runtime skill directory flat; required skill pairs stay in the same plugin and skills are never duplicated across plugins.
- **Dependencies:** Use installed CLI binaries and ask the user to install missing tools globally; never download them implicitly.

## Search

- Files: `rg --files plugins/*/skills`
- Skill metadata: `rg -n '^(name|description):' plugins/*/skills`
- Dependency-download policy: `rg -n 'npx -y' .`

## Testing Strategy

- Runner: Node.js built-in tests for version selection and changed-plugin detection, Python standard-library JSON parsing, and the Codex plugin validator.
- Coverage: Every changed plugin validates; all manifests and catalogs parse; a bump validates and changes only the selected plugin.
- Client smoke tests: When installed, run `claude plugin validate .` and `copilot plugin install ./plugins/<plugin>` for an affected plugin.
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
| ------ | -------- | ------- |
| Edit files | `apply_patch` | Shell write tricks |
| Search | `rg`, `rg --files` | Broad recursive scans |
| Validate JSON | `python3 -m json.tool` | New validation dependencies |
| Validate plugin | Bundled Codex plugin validator | Handwritten schema replacements |
| Install CLI dependencies | Global installation with user approval | `npx -y` |
