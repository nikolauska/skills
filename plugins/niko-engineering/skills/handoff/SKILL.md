---
name: handoff
description: Writes forward-looking startup instructions for a fresh session. Use when context is long, work must continue in another session, or the user is switching focus; do not use for progress reports or permanent project documentation.
---

# Handoff

Create a brief work order that lets a fresh agent take the next action without conversation history.

## Safety

- Never include secrets, credentials, environment values, private customer data, or credential-bearing URLs.
- Present the handoff in chat only. Do not write files, copy to a clipboard, send it externally, or reset context.

## Handoff

Write `Next` as one executable action. Include only constraints, settled decisions, live blockers, or a brief rationale that changes that action; merge still-relevant constraints from an earlier handoff rather than copying it. Point to files, commits, tickets, or safe URLs instead of copying contents or recounting history. Keep it on one screen, around 150 words unless the action genuinely needs more. Present one fenced Markdown block, omitting empty optional sections:

```md
# Handoff — <topic or ticket>

## Next
<one concrete action in one sentence>

## What the next move needs
- <file, constraint, settled rule, live blocker, or one-line rationale whose omission could change the next decision; at most five one-line bullets>

## Pointers
- <path, safe URL, commit, or ticket ID; addresses only>

Start with Next.
```

The final imperative prompts action rather than a recap. Ask whether the handoff needs changes; once accepted, tell the user to copy it, clear context, and paste it as the first message. Do not clear context yourself.
