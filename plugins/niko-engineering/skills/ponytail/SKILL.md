---
name: ponytail
description: Favors the smallest correct change during a requested coding implementation by reusing existing code and avoiding speculative complexity. Use when implementing a feature or fix with minimal code, a small diff, YAGNI, or avoiding over-engineering; not for standalone review or separately authorized behavior-preserving refactoring.
license: MIT
---

# Ponytail

Be lazy without being careless. Prefer the smallest correct change over code that someone must decode later.

Apply this approach only to the current requested implementation task. Do not carry it into later tasks unless requested again.

## The ladder

Stop at the first rung that solves the request:

1. Does this need to exist? Skip speculative work.
2. Does the repository already provide it? Reuse it.
3. Does the standard library provide it? Use it.
4. Does the platform provide it? Prefer the native feature.
5. Does an installed dependency provide it? Use it; never add a dependency for a small equivalent.
6. Can it be one line? Use one line.
7. Otherwise, write the minimum code that works.

Apply the ladder after understanding the request and its real call path. The first rung that holds wins.

## Guardrails

- Read repository instructions, working-tree state, callers, contracts, and relevant tests before editing.
- Preserve unrelated user changes. Undo only changes made during this task.
- Do not read or expose `.env` files, credentials, API keys, tokens, or private keys. Redact secrets in output.
- Do not destructively delete or overwrite unrelated work, force-push, contact external systems, browse, or install dependencies unless the user explicitly requests it. Editing files within the requested task is authorized.
- Never remove input validation, authorization, error handling, data-loss protections, accessibility, or required compatibility behavior to save lines.
- Do not add abstractions, configuration, wrappers, or scaffolding without a concrete current caller.

## Workflow

1. **Understand.** Trace the affected path and every caller of code you may change. Identify the observable contract and the narrowest relevant check.
2. **Choose.** Apply the ladder. For a bug, fix the shared root cause rather than adding guards to individual callers.
3. **Implement.** Make one smallest coherent diff. Leave unrelated cleanup alone. If a deliberate shortcut has a known ceiling, mark it with a `ponytail:` comment naming the upgrade trigger.
4. **Verify.** Run the narrowest check that exercises the changed behavior. Non-trivial logic needs one runnable assertion or existing test; a trivial one-liner needs no new test. Stop when the relevant check passes.
5. **Report.** State what changed, what was intentionally skipped, and the exact verification performed. Match the user's requested output format.

## Rules

- Deletion beats addition; boring beats clever.
- Extract shared logic only at an existing conceptual boundary or after the third repetition.
- Do not batch unrelated simplifications into one change.
- Do not change tests merely to make a simplification pass; that usually signals changed behavior.
- Do not simplify code you do not understand or code that is already clear.

## When not to simplify

Do not optimize for fewer lines when correctness, security, accessibility, data integrity, or compatibility requires the existing behavior. Hardware and other real-world systems retain calibration or safety controls when a minimal model cannot represent drift or error.

## Output

Keep the response concise: lead with the result, then the decision, verification, and skipped scope. Do not turn an implementation request into a standalone review or refactor.

The shortest path to done is the right path.
