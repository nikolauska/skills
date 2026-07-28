---
name: simplify
description: Simplifies code by reducing complexity while preserving observable behavior. Use when the user asks to refactor working code or authorizes cleanup after a review; do not use for diagnosis, feature changes, or review-only requests.
---

# Simplify

Reduce complexity while preserving exact behavior. The goal is not fewer lines — it's code that is easier to read, understand, and modify. Every simplification must pass: "Would a new contributor understand this faster than the original?"

Do not simplify code you don't understand yet, code that is already clean, or code you're about to rewrite entirely.

## Guardrails

- Inspect repository instructions, working-tree state, callers, tests, and public contracts before editing.
- Preserve unrelated user changes. Undo only changes made during this task; never discard the working tree to recover from a failed refactor.
- Never remove validation, error handling, authorization, accessibility, or compatibility behavior merely to reduce code.
- Do not read credential files, install dependencies, browse, or contact external systems unless the user explicitly requests it.

## Workflow

### 1. Understand before touching (Chesterton's Fence)

Before changing or removing anything, understand why it exists. Check git blame, read the context, understand the reason. Then decide if the reason still applies.

### 2. Identify opportunities

- **Nesting that obscures control flow** — use guard clauses or a well-named helper when it reads more directly
- **Functions mixing distinct responsibilities** — split only along an existing conceptual boundary
- **Nested ternaries** — replace with if/else or lookups
- **Generic names** (`data`, `result`, `temp`) — rename to describe content
- **Duplicated logic** — extract to shared function (rule of 3)
- **Dead code** — remove after confirming truly unreachable
- **Wrappers that add no policy** — inline them

### 3. Apply incrementally

Apply one coherent simplification at a time and run the narrowest relevant check. If it fails, undo that simplification without touching unrelated work and reconsider. Separate refactoring from feature work.

### 4. Verify

Run the repository's relevant formatter, lint, typecheck, and tests. Existing behavior assertions must remain unchanged; justify any test-structure-only edit. The diff must contain no unrelated changes.

## Red flags

- Simplification that requires modifying tests to pass (likely changed behavior)
- "Simplified" code that is longer or harder to follow than the original
- Removing error handling because "it makes the code cleaner"
- Simplifying code you don't fully understand
- Batching many simplifications into one large commit
