---
name: handoff
description: Writes forward-looking startup instructions for a fresh session. Use when context is long, work must continue in another session, or the user is switching focus; do not use for progress reports or permanent project documentation.
---

# Handoff

Create a brief work order that lets a fresh agent take the next action without conversation history.

## Safety

- Never include secrets, credentials, environment values, private customer data, or credential-bearing URLs.
- Present the handoff in chat only. Do not write files, copy to a clipboard, send it externally, or reset context.
- Tell the user to clear context only after they accept the handoff; the user controls that action.

## Workflow

1. Write `Next`: one concrete action specific enough to start without prior conversation.
2. Add only facts that change how `Next` must be executed: files, constraints, settled rules, and live blockers.
3. Point to repository files, commits, tickets, or safe URLs instead of copying their contents or narrating completed work.
4. If a previous handoff exists, merge its still-relevant constraints; never append it verbatim.
5. Keep the result near 150 words and on one screen unless the next action is genuinely multi-step.
6. Present one fenced Markdown block and ask whether it needs changes. After acceptance, tell the user to copy it, clear context, and paste it as the first message.

## Format

Omit empty optional sections. Use no other sections.

```md
# Handoff — <topic or ticket>

## Next
<one concrete action in one sentence>

## What the next move needs
- <file, constraint, settled rule, or live blocker; at most five one-line bullets>

## Pointers
- <path, safe URL, commit, or ticket ID; addresses only>

Start with Next.
```

The final imperative is required so the next session acts instead of summarizing the handoff.

## Quality gate

- `Next` is first, executable, and forward-looking.
- Every other line changes the next action; history, dead ends, status, and deferred-work dumps are absent.
- Rules state what to do, not the story of how they were chosen.
- The handoff appears once unless the user requests a revision.
