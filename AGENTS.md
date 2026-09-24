# AGENTS.md

This repository distributes independently installable skill plugins for Codex, Claude Code, GitHub Copilot CLI, and Oh My Pi. `README.md` lists the plugins and installation commands for Codex, Claude Code, and Copilot CLI. Each skill has one canonical home at `plugins/<plugin>/skills/`; the client manifests and marketplace catalogs are adapters, not copies of the skill.

## Working on plugins

- Keep plugin and skill directories lowercase kebab-case and each plugin's runtime skills flat. Keep required skill pairs in the same plugin; do not duplicate skills across plugins.
- For an existing plugin change, bump that plugin with `node scripts/bump-version.mjs <plugin> <patch|minor|major>` before committing. Use patch for fixes or instruction refinements, minor for new skills or compatible capabilities, major for removals, renames, or incompatible behavior. Bump each affected plugin separately. The script validates the plugin and synchronizes its three manifests with its `.claude-plugin/marketplace.json` entry; never edit version fields manually.
- Initialize new plugins at `1.0.0`. Run `node scripts/validate-plugins.mjs` after plugin changes not followed by a bump, including new plugins. The validator uses the installed Codex plugin validator (`PLUGIN_VALIDATOR` can override its path); do not download dependencies implicitly.
- Keep `.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`, and all three manifests under each `plugins/<plugin>/` valid JSON.

## Checking changes

Run relevant checks from the repository root; fix failures caused by the change and rerun the affected check. For a documentation-only edit, inspect the changed content rather than running the whole suite.

```sh
node --test scripts/*.test.mjs
node scripts/validate-plugins.mjs
python3 -m json.tool .agents/plugins/marketplace.json >/dev/null
python3 -m json.tool .claude-plugin/marketplace.json >/dev/null
for manifest in plugins/*/.codex-plugin/plugin.json plugins/*/.claude-plugin/plugin.json plugins/*/.github/plugin/plugin.json; do python3 -m json.tool "$manifest" >/dev/null || exit; done
git diff --check
```

The root script tests, JSON checks, and changed-plugin validator form the repository test suite; `git diff --check` is its whitespace lint. Run the validator and JSON checks before committing plugin changes, and `git diff --check` before any commit. Use Python 3's standard library for validation rather than adding a runtime dependency. If a check fails, read the complete error, correct the relevant file, and rerun the smallest affected check.

## Boundaries

- Do not read, write, log, or commit `.env` files, tokens, API keys, private keys, credential stores, or client cache data. Do not put private-repository credentials in Git URLs or marketplace source strings. Keep authentication in the client's local configuration or environment.
- Use installed CLI tools. Never use `npx -y` or another implicit dependency downloader; ask before installing a missing tool globally.
- Local edits and checks do not authorize publishing, installing plugins into a user's client, pushing, or acting under the user's identity. Ask before those external actions. Never force-push or bypass commit hooks.
- When asked to commit, use one logical Conventional Commit with a short explanation of what changed and why, without co-author trailers.
