---
name: tdd
description: Implements features and bug fixes through a red-green-refactor loop. Use when the user asks for test-first development, TDD, or red-green-refactor; do not use when only test coverage or a review is requested.
---

# Test-Driven Development

For each requested observable behavior, add one focused test through a stable interface and run it **before** changing production code. Confirm it fails for the intended missing behavior, not setup or syntax; a test that already passes does not establish red. Make the smallest production change, run the focused and related tests to reach green, then refactor concrete duplication or readability problems while keeping behavior and assertions unchanged. Repeat for the next behavior.

Follow existing test conventions. Use [test examples](references/tests.md) for observable seams and [mocking guidance](references/mocking.md) only for slow, nondeterministic, destructive, or external boundaries. Tests must be deterministic and isolated from time, randomness, network, shared state, and production credentials or services. Do not install packages or start external systems without authorization; do not weaken existing assertions unless the requested behavior changed.

Report the behaviors tested, observed red and green commands, and any required checks not run.
