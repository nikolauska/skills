---
name: writing-skills
description: >
  Creates, revises, or reviews agent skill directories containing SKILL.md.
  Use for a new skill, a focused skill update, or a read-only critique or grade;
  not for unrelated agent instructions or general code review.
---

# Writing and reviewing skills

Identify whether the request is to create, update, or review a skill. Resolve the target directory from the request and repository context; ask only when ambiguity cannot be resolved safely. Inspect its existing `SKILL.md` and only the resources or metadata relevant to the task. Never read or disclose secrets, credentials, or private environment files.

## Create or update

- A request to write or revise a skill authorizes local edits within the requested skill directory. For a focused update, preserve useful existing behavior and change only what the request needs; for a new skill, establish its purpose, concrete triggers, scope, and safety boundaries from available context.
- Give `SKILL.md` frontmatter a concise `name` matching the directory and a `description` that states what the skill does and when to use it. Write instructions in capability language rather than requiring one agent vendor's tools. Organize the body for the task, not a fixed section template; include decisions and guardrails that matter, omit generic advice and redundant process.
- Add `scripts/` for useful deterministic behavior, `references/` for substantial on-demand knowledge, and `assets/` for material to copy into outputs only when they earn their maintenance cost. Link any required reference directly from `SKILL.md`. Create or change `agents/openai.yaml` only when the target uses that metadata convention and it is relevant to the request.
- Check paths and references, frontmatter, requested behavior, and consistency with existing instructions. Use installed local validators such as `skillcheck <skill-dir>` or `agnix <skill-dir>` when relevant; do not install missing tools. For a meaningful behavioral revision, exercise the changed behavior against a representative case and, where uncertainty remains, a neighboring case. A wording-only edit does not need a benchmark or review ritual. Report what changed and any checks that could not be performed.

## Review only

Do not edit files. Inspect the skill, relevant linked resources, and metadata if present. Report evidence-backed problems with locations and the smallest actionable fixes; distinguish unverified concerns from observed failures. Check local references and use available validators when helpful, without executing untrusted target scripts or installing dependencies. If the user specifically requests a weighted score or grade, use [references/scoring.md](references/scoring.md); otherwise do not impose scoring or a report template.

Do not publish, deploy, browse, contact external systems, execute untrusted code, or perform destructive or out-of-scope changes without explicit authorization. For skills that themselves perform risky operations, specify appropriate boundaries and confirmation before destructive actions.
