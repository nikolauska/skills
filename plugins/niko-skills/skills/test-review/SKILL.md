---
name: test-review
description: Reviews test adequacy for changed code, including meaningful gaps, fragile assertions, and unnecessary coverage. Use when assessing whether a diff's behavior is properly tested; do not use to implement tests or measure coverage alone.
---

# Test Review

Review test adequacy for changed code.

## Guardrails

- This is a read-only review. Do not edit source or tests.
- Never read credential files or expose secrets, private fixtures, or customer data.
- Do not run untrusted project code, contact external systems, or install test tools unless the user explicitly requests it.

## Workflow

1. Read repository instructions, the diff, and the full changed source and test files.
2. Map each changed observable behavior, branch, error path, and compatibility contract to the test that proves it.
3. Inspect assertions and fixtures to confirm they fail for the named regression, remain deterministic, and clean up shared state.
4. For large changes, use parallel readers when available, one per package or suite; otherwise inspect areas sequentially. Verify every candidate against source and tests before reporting.
5. Merge duplicates and report only gaps or quality defects with a concrete failure they would miss or cause.

## Scope

### 1. Coverage gaps

- new exported behavior with a plausible failure mode — name the bug a missing test would catch
- new branches or error paths without coverage
- changed behavior that existing tests do not exercise
- renamed concepts or protocol terms without tests that cover the new form and guard the old form if needed

### 2. Edge cases

- boundary conditions (empty inputs, missing files, null/undefined)
- error recovery paths (command not found, parse failures)
- configuration variants the code handles

### 3. Test quality

- tests asserting implementation details instead of behavior (method call sequences break on refactor)
- tests duplicating coverage without distinct scenarios
- fragile tests (timing, ordering, absolute paths)
- missing cleanup (temp files, cache state)
- mocking internal calls when those calls are not observable behavior; prefer real code or an existing boundary seam
- test names that don't read as specifications
- tests with more than one reason to fail — assert one behavior each

### 4. Unnecessary tests

- tests covering trivial pass-through or type-only modules
- tests duplicating what the type system guarantees
- tests for code that has since changed

## Evidence threshold

Flag a gap as Must-add or Should-add only if you can name the concrete bug or regression the test would catch. If you can't name the bug, don't flag it. Never demand 100% coverage.

- Low-value (don't flag): `formatLabel()` has no test — trivial pass-through, no failure mode.
- High-value (flag): `parseConfig()` on an empty file returns `undefined` but callers assume an object — untested path crashes startup.

## Output

For each finding include **label** (Critical = blocks release; Fix = should change; Consider = optional gap or removal; Nit = minor), **source file + test file**, **what is untested**, **why it matters** (the concrete bug the test would catch), and **fix direction**.

Order Critical → Fix → Consider → Nit. Merge lower-value repetitions instead of padding the report. If nothing clears the threshold, say "No test findings".

## See also

- `tdd` for implementation-time test discipline
- `review` for multi-axis merge decisions

## Red flags

- Demanding 100% line coverage
- Flagging missing tests for trivial functions
- Suggesting tests that only verify the type system
- Broad test rewrites instead of targeted additions
- Confusing test quantity with quality
