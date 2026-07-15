# Niko Skills

Git-backed skills for Codex, Claude Code, and GitHub Copilot CLI.

The repository has one installable plugin, `niko-skills`. The skill files under
`plugins/niko-skills/skills/` are the canonical source. The Codex marketplace
catalog lives at `.agents/plugins/marketplace.json`; Claude Code and Copilot
CLI share `.claude-plugin/marketplace.json`.

## Install on a device

The public repository needs no authentication. For private forks or a future
private mirror, use SSH, a Git credential helper, or `gh auth login`. Do not
put tokens in repository URLs. For non-interactive private updates, use
`GH_TOKEN` or `GITHUB_TOKEN` in the environment.

### Codex

```sh
codex plugin marketplace add nikolauska/skills
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

Every release must bump the version consistently in both plugin manifests and the
marketplace metadata. Keep any credentials outside this repository.

## Skill categories

The runtime layout stays flat so all three clients discover skills directly.
Use these categories when browsing the collection:

| Category | Skills |
| --- | --- |
| Browser and performance | `chrome-devtools-axi` |
| Code quality and diagnosis | `architecture-review`, `correctness-review`, `diagnose`, `review`, `reviewing-skills`, `security-review`, `simplify`, `style-review`, `test-review` |
| Git, GitHub, and delivery | `axi`, `gh-axi`, `git`, `glab-axi`, `pr`, `triage` |
| Languages and frameworks | `cpp-pro`, `daisyui`, `elixir`, `mjml`, `react`, `redux` |
| Documentation and agent authoring | `doc-review`, `domain-knowledge`, `grill-with-docs`, `writing-agents-md`, `writing-rubrics`, `writing-skills` |
| Workflow and tooling | `clockify-cli`, `find-skills`, `handoff`, `jupyter-notebook`, `lavish`, `tdd`, `vsdevshell` |

## Validate locally

```sh
python3 -m json.tool .agents/plugins/marketplace.json >/dev/null
python3 -m json.tool .claude-plugin/marketplace.json >/dev/null
python3 -m json.tool plugins/niko-skills/.codex-plugin/plugin.json >/dev/null
python3 -m json.tool plugins/niko-skills/.claude-plugin/plugin.json >/dev/null
python3 "${CODEX_HOME:-$HOME/.codex}/skills/.system/plugin-creator/scripts/validate_plugin.py" plugins/niko-skills
```

When available, also run `claude plugin validate .` and install the local
plugin with `copilot plugin install ./plugins/niko-skills`.

`codebase-memory-mcp-axi` is intentionally not vendored here. It remains a
separate plugin and is only a reference for the cross-client manifest layout.
