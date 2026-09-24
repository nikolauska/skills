---
name: axi
description: >
  Defines Agent eXperience Interface (AXI) guidance for CLI tools that agents use through
  shell execution. Use when building, modifying, or reviewing an agent-facing CLI.
---

# Agent eXperience Interface (AXI)

Make shell-driven CLIs easy for agents to inspect and operate without wasting context or risking unintended changes.

- **Reviewing:** inspect behavior and report findings; do not modify the CLI unless the user asks for fixes. Read [output and command behavior](references/output.md); read [discovery and integrations](references/integrations.md) when those surfaces are in scope.
- **Building or modifying:** read [output and command behavior](references/output.md) for data, errors, exits, and help. Read [discovery and integrations](references/integrations.md) when designing the no-argument experience, skill distribution, or session integration.

Preserve an existing CLI's wire format unless the user requests migration. Never leak secrets or raw dependency responses, mix progress into machine-readable stdout, or silently modify agent, shell, or project configuration.
