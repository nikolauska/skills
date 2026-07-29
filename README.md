# Niko Skills

Git-backed skill plugins for Codex, Claude Code, GitHub Copilot CLI, and Oh My Pi.

The repository distributes focused plugins so each environment loads only the
workflows it needs. Each skill has one canonical home under
`plugins/<plugin>/skills/`.

## Plugins

| Plugin | Skills |
| --- | --- |
| `niko-engineering` | `diagnose`, `review`, `simplify`, `tdd`, `handoff` |
| `niko-delivery` | `git`, `gh-axi`, `pr` |
| `niko-agent-tools` | `axi`, `writing-agents-md`, `writing-skills`, `reviewing-skills` |
| `niko-product-docs` | `domain-knowledge`, `grill-with-docs`, `lavish` |
| `niko-frontend` | `react`, `redux`, `daisyui`, `chrome-devtools-axi` |
| `niko-design` | `animation-vocabulary`, `apple-design`, `emil-design-eng`, `find-animation-opportunities`, `improve-animations`, `prototype`, `review-animations` |
| `niko-native` | `cpp-pro`, `cmake`, `vsdevshell` |
| `niko-elixir` | `elixir` |
| `niko-godot` | `godot` |
| `niko-email` | `mjml` |
| `niko-clockify` | `clockify-cli` |

Required skills stay in the same plugin. Skills are not duplicated across
plugins, and no plugin has a hidden prerequisite plugin.

## Install on a device

The public repository needs no authentication. For private forks or a future
private mirror, use SSH, a Git credential helper, or `gh auth login`. Do not
put tokens in repository URLs. For non-interactive private updates, use
`GH_TOKEN` or `GITHUB_TOKEN` in the environment.

Add the marketplace once, then install each plugin needed on that device.
Replace `<plugin>` with a name from the table above.

### Codex

```sh
codex plugin marketplace add nikolauska/skills
codex plugin add <plugin>@niko-skills
```

### Claude Code

```sh
claude plugin marketplace add nikolauska/skills
claude plugin install <plugin>@niko-skills --scope user
```

Reload plugins with `/reload-plugins` after installation or an update.

### GitHub Copilot CLI

```sh
copilot plugin marketplace add nikolauska/skills
copilot plugin install <plugin>@niko-skills
```

### Oh My Pi

```sh
omp plugin marketplace add nikolauska/skills
omp plugin install <plugin>@niko-skills
```

Start a new session after installation, or reload an existing session with
`/reload-plugins`.

Stock Pi is not supported because it does not provide the required plugin
marketplace workflow.

## Migrate from `niko-skills`

The retired `niko-skills` plugin does not receive bundle updates. Remove it and
install the focused plugins containing the skills used in each environment.
Existing pinned installations may remain on their installed version.

| Previously used skill | Replacement plugin |
| --- | --- |
| `diagnose`, `review`, `simplify`, `tdd`, `handoff` | `niko-engineering` |
| `git`, `gh-axi`, `pr` | `niko-delivery` |
| `axi`, `writing-agents-md`, `writing-skills`, `reviewing-skills` | `niko-agent-tools` |
| `domain-knowledge`, `grill-with-docs`, `lavish` | `niko-product-docs` |
| `react`, `redux`, `daisyui`, `chrome-devtools-axi` | `niko-frontend` |
| `cpp-pro`, `cmake`, `vsdevshell` | `niko-native` |
| `elixir` | `niko-elixir` |
| `godot` | `niko-godot` |
| `mjml` | `niko-email` |
| `clockify-cli` | `niko-clockify` |

## Update

Push a new commit after making changes, refresh the marketplace, then update
the affected plugin:

```sh
codex plugin marketplace upgrade niko-skills
claude plugin marketplace update niko-skills
copilot plugin update <plugin>
omp plugin upgrade <plugin>@niko-skills
```

Plugins version independently. Every change to an existing plugin must use the
repository's version script, which validates the plugin before updating its
versions:

```sh
node scripts/bump-version.mjs <plugin> <patch|minor|major>
```

Use `patch` for fixes and instruction refinements, `minor` for new skills or
backward-compatible capabilities, and `major` for removals, renames, or
incompatible behavior. New plugins start at `1.0.0`.

## Validate locally

```sh
python3 -m json.tool .agents/plugins/marketplace.json >/dev/null
python3 -m json.tool .claude-plugin/marketplace.json >/dev/null
for manifest in plugins/*/.codex-plugin/plugin.json plugins/*/.claude-plugin/plugin.json plugins/*/.github/plugin/plugin.json; do python3 -m json.tool "$manifest" >/dev/null; done
node scripts/validate-plugins.mjs
git diff --check
```

When available, also run `claude plugin validate .`, install an affected local
plugin with `copilot plugin install ./plugins/<plugin>`, and smoke-test its
marketplace add/update flow.

`codebase-memory-mcp-axi` is intentionally not vendored here. It remains a
separate plugin and is only a reference for the cross-client manifest layout.
