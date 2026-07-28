---
name: tdd
description: Implements features and bug fixes through a red-green-refactor loop. Use when the user asks for test-first development, TDD, or red-green-refactor; do not use when only test coverage or a review is requested.
---

# Test-Driven Development

Build one observable behavior at a time: write a focused failing test, make it pass with the smallest production change, then improve the code while it stays green.

## Guardrails

- Read repository instructions, the existing test framework, nearby tests, and public behavior before adding a test or dependency seam.
- Never read credential files or use production credentials, services, databases, queues, or destructive fixtures in tests.
- Do not install test packages, start external systems, or download tools unless the user explicitly requests it.
- Keep tests deterministic and isolated from wall-clock time, randomness, network access, and shared persistent state through existing project seams.
- Do not change an existing behavior assertion merely to make a production change pass unless the requested behavior itself changed.

## Choose the first behavior

List the requested observable behaviors and start with the smallest one that proves the end-to-end path. Infer interface details from repository conventions and the request; ask the user only when a missing product decision materially changes behavior.

Use [test examples](references/tests.md) to choose an observable seam and [mocking guidance](references/mocking.md) only when the behavior crosses a slow, nondeterministic, destructive, or external boundary.

## Cycle

### Red

1. Add one focused test for one observable behavior through the narrowest stable interface.
2. Run that test and confirm it fails for the expected missing or incorrect behavior, not because of syntax, setup, or unrelated failures.
3. If it passes immediately, strengthen or replace it so it proves the requested change before touching production code.

### Green

1. Make the smallest coherent production change that passes the failing test.
2. Run the focused test, then the nearest related tests.
3. Do not add speculative options, abstractions, or behavior for later cycles.

### Refactor

1. Refactor only when the green code or test has concrete duplication or readability cost.
2. Keep observable behavior and assertions unchanged.
3. Run the focused test after each coherent refactor slice and return to green before starting another behavior.

Repeat Red → Green → Refactor for the next prioritized behavior. Never write the entire test suite before implementing the first slice.

## Completion

- Every new test was observed failing for the intended reason before its production change.
- Tests assert observable results or effects and are not coupled unnecessarily to internal call order or private structure.
- The repository's required formatter, lint, typecheck, focused tests, and broader test command pass, or skipped checks are named with reasons.
- Report the behaviors covered and the commands that demonstrated red and green.
