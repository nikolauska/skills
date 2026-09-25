---
name: writing-skills
description: >
  Create, revise, or review agent skill directories when the task concerns a skill's
  instructions, resources, or metadata.
---

# Writing and reviewing skills

Resolve whether the request is to create, revise, or review a skill and identify its directory from the request and repository context. Ask only if ambiguity cannot be resolved safely. Inspect its `SKILL.md` and only resources or metadata relevant to the task; never read secrets, credentials, or private environment files.

- **Create or revise:** Follow [authoring guidance](references/authoring.md). Local edits within the requested skill directory need no extra approval. Finish the requested behavior and its relevant checks before reporting back; a first draft is not an automatic review gate.
- **Review only:** Follow [review guidance](references/review.md). Do not edit files. Load [scoring guidance](references/scoring.md) only if the user requests a weighted score or grade.

Specify authorization boundaries only for concrete risks such as destructive changes, production access, or external side effects. Do not turn routine local work into an approval loop.
