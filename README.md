# Niko Skills

Private, Git-backed skills for Codex, Claude Code, and GitHub Copilot CLI.

The repository has one installable plugin, `niko-skills`. The skill files under
`plugins/niko-skills/skills/` are the canonical source. The Codex marketplace
catalog lives at `.agents/plugins/marketplace.json`; Claude Code and Copilot
CLI share `.claude-plugin/marketplace.json`.

## Install on a device

Authenticate to the private GitHub repository using SSH, a Git credential
helper, or `gh auth login`. Do not put tokens in repository URLs. For
non-interactive updates, use `GH_TOKEN` or `GITHUB_TOKEN` in the environment.

### Codex

```sh
codex plugin marketplace add nikolauska/skills --sparse .agents/plugins plugins
codex plugin add niko-skills@niko-skills
```

Start a new Codex session after installation.

### Claude Code

```sh
claude plugin marketplace add nikolauska/skills
claude plugin install niko-skills@niko-skills --scope user
```

Reload plugins with `/reload-plugins` after installation or an update.

### GitHub Copilot CLI

```sh
copilot plugin marketplace add nikolauska/skills
copilot plugin install niko-skills@niko-skills
```

## Update

Push a new commit after making changes, then refresh the marketplace and
update the plugin:

```sh
codex plugin marketplace upgrade niko-skills
claude plugin marketplace update niko-skills
copilot plugin update niko-skills
```

Every release must bump `1.0.0` consistently in both plugin manifests and both
marketplace entries. Use normal Git authentication for private repository
access; keep credentials outside this repository.

## Skill categories

The runtime layout stays flat so all three clients discover skills directly.
Use these categories when browsing the collection:

| Category | Skills |
| --- | --- |
| Browser and performance | `a11y-debugging`, `chrome-devtools`, `chrome-devtools-axi`, `debug-optimize-lcp` |
| Code quality and diagnosis | `architecture-review`, `diagnose`, `review`, `reviewing-skills`, `security-review`, `simplify`, `style-review`, `test-review` |
| Git, GitHub, and delivery | `axi`, `gh-axi`, `git`, `glab-axi`, `no-mistakes`, `pr`, `triage` |
| Documentation and agent authoring | `doc-review`, `grill-with-docs`, `writing-agents-md`, `writing-rubrics`, `writing-skills` |
| Workflow and tooling | `cpp-pro`, `find-skills`, `handoff`, `jupyter-notebook`, `lavish`, `tdd` |

## Validate locally

```sh
python3 -m json.tool .agents/plugins/marketplace.json >/dev/null
python3 -m json.tool .claude-plugin/marketplace.json >/dev/null
python3 -m json.tool plugins/niko-skills/.codex-plugin/plugin.json >/dev/null
python3 -m json.tool plugins/niko-skills/.claude-plugin/plugin.json >/dev/null
python3 /home/nlehto/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py plugins/niko-skills
```

When available, also run `claude plugin validate .` and install the local
plugin with `copilot plugin install ./plugins/niko-skills`.

`codebase-memory-mcp-axi` is intentionally not vendored here. It remains a
separate plugin and is only a reference for the cross-client manifest layout.
