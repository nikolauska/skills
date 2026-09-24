# Niko Skills

Focused, opt-in skill plugins for Codex, Claude Code, and GitHub Copilot CLI. Each skill has one canonical home under `plugins/<plugin>/skills/`, and every plugin can be installed independently.

## Available plugins

| Plugin | Purpose |
| --- | --- |
| `niko-engineering` | Diagnosis, code review, minimal implementation, behavior-preserving simplification, TDD, handoff, product knowledge, and plan review |
| `niko-delivery` | Git and pull request workflows |
| `niko-agent-tools` | Agent-facing CLIs, agent instructions, skill authoring, and skill benchmarking |
| `niko-frontend` | React, Redux, and daisyUI development |
| `niko-design` | UI design, motion review, animation planning, and prototyping |
| `niko-native` | Modern C++, CMake, and Visual Studio build workflows |
| `niko-elixir` | Elixir and Phoenix development |
| `niko-godot` | Godot development |
| `niko-email` | Responsive email development with MJML |
| `niko-clockify` | Clockify time tracking and reporting |

## Install

Add the marketplace once, then install each plugin needed on the device. Replace `<plugin>` with a name from the table above.

```sh
# Codex
codex plugin marketplace add nikolauska/skills
codex plugin add <plugin>@niko-skills

# Claude Code
claude plugin marketplace add nikolauska/skills
claude plugin install <plugin>@niko-skills --scope user

# GitHub Copilot CLI
copilot plugin marketplace add nikolauska/skills
copilot plugin install <plugin>@niko-skills
```

Reload Claude Code plugins with `/reload-plugins` after installation.
