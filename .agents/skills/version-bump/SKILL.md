---
name: version-bump
description: Synchronizes this repository's plugin and package versions with a bundled Node.js script. Use when preparing a patch, minor, or major release of niko-skills; do not use for dependency updates or arbitrary repositories.
---

# Version Bump

Update every versioned niko-skills manifest in one operation.

## Constraints

- Run only from the niko-skills repository root.
- Accept exactly one bump type: `patch`, `minor`, or `major`.
- Never edit version fields by hand or run `npm version`; the bundled script owns the synchronized file set.
- Do not continue if existing versions differ. Resolve the mismatch first.
- Do not commit, tag, publish, or push unless the user explicitly requests it.
- Do not access the network, credentials, or secret files; version synchronization needs none of them.

## Workflow

1. Choose the bump type from the user's request. Ask only if the requested release level is genuinely ambiguous.
2. Run:
   ```bash
   node .agents/skills/version-bump/scripts/bump-version.mjs <patch|minor|major>
   ```
3. Confirm the script reports the expected `current -> next` version.
4. Validate the changed manifests:
   ```bash
   node --test .agents/skills/version-bump/scripts/bump-version.test.mjs
   python3 -m json.tool package.json >/dev/null && python3 -m json.tool .claude-plugin/marketplace.json >/dev/null && python3 -m json.tool plugins/niko-skills/.codex-plugin/plugin.json >/dev/null && python3 -m json.tool plugins/niko-skills/.claude-plugin/plugin.json >/dev/null && python3 -m json.tool plugins/niko-skills/.github/plugin/plugin.json >/dev/null
   git diff --check
   ```
5. Report the old and new versions and the validation result.

## Script behavior

`scripts/bump-version.mjs` uses only Node.js built-ins. It validates every JSON file and requires all six version fields to match before writing. Patch increments `x.y.z` to `x.y.(z+1)`; minor to `x.(y+1).0`; major to `(x+1).0.0`.

If the script reports a missing or unexpected version field, update the script's explicit manifest list only after confirming that the repository's packaging layout intentionally changed.
