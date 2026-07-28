---
name: version-bump
description: Bumps one focused plugin's version across its manifests and marketplace entry. Use after changing an existing plugin in this repository or when preparing that plugin's patch, minor, or major release; do not use for new plugins, dependency updates, or arbitrary repositories.
---

# Version Bump

Update one existing plugin's version without changing unrelated plugins.

## Constraints

- Run only from the repository root.
- Accept exactly one plugin name and one bump type: `patch`, `minor`, or `major`.
- Never edit version fields by hand or run `npm version`; the bundled script owns the selected plugin's version fields.
- Do not continue if the selected plugin's existing versions differ. Resolve the mismatch first.
- New plugins start at `1.0.0` and do not use this workflow until a later change.
- Do not commit, tag, publish, or push unless the user explicitly requests it.
- Do not access the network, credentials, or secret files; version synchronization needs none of them.

## Workflow

1. Identify the changed plugin from its `plugins/<plugin>/` path.
2. Choose `patch` for fixes or instruction refinements, `minor` for new skills or backward-compatible capabilities, and `major` for removals, renames, or incompatible behavior. Ask only when the release level is genuinely ambiguous.
3. Run:
   ```bash
   node .agents/skills/version-bump/scripts/bump-version.mjs <plugin> <patch|minor|major>
   ```
4. Confirm the script reports the expected `<plugin>: <current> -> <next>` result.
5. Validate the changed manifests:
   ```bash
   node --test .agents/skills/version-bump/scripts/bump-version.test.mjs
   python3 -m json.tool .claude-plugin/marketplace.json >/dev/null
   python3 -m json.tool plugins/<plugin>/.codex-plugin/plugin.json >/dev/null
   python3 -m json.tool plugins/<plugin>/.claude-plugin/plugin.json >/dev/null
   python3 -m json.tool plugins/<plugin>/.github/plugin/plugin.json >/dev/null
   python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/plugin-creator/scripts/validate_plugin.py" plugins/<plugin>
   git diff --check
   ```
6. Report the selected plugin, old and new versions, and validation result.

## Script behavior

`scripts/bump-version.mjs` uses only Node.js built-ins. It requires the selected plugin's three manifests and Claude marketplace entry to have the same semantic version before writing. It updates only those four fields. Patch increments `x.y.z` to `x.y.(z+1)`; minor to `x.(y+1).0`; major to `(x+1).0.0`.

If the script reports a missing plugin, unexpected source, or mismatched field, fix the repository metadata rather than bypassing the check.
