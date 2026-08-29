# Tests

Check whether tests adequately guard changed observable behavior.

## Inspect

- Each changed behavior, branch, error path, and compatibility contract mapped to a test that proves it.
- Boundary inputs, missing data, parse failures, recovery paths, cleanup failures, and supported configuration combinations—not only each setting in isolation.
- Assertions and fixtures that would fail for the named regression, remain deterministic, clean up shared state, and use names and filesystem features valid on every platform where the test runs.
- Tests coupled to implementation details, timing, ordering, absolute paths, or internal mocks instead of observable behavior and established boundary seams.
  Cross-compilation proves build compatibility only; do not count it as runtime evidence for platform-specific paths, permissions, symlinks, process behavior, or filenames.
- Duplicate tests, trivial pass-through coverage, type-system duplication, and tests for behavior that no longer exists.
- Fix tests that prove only the reported state while omitting adjacent states the remedy can break, such as escaping versus dangling symlinks or an existing versus concurrently replaced parent.

## Evidence threshold

Report a gap only when a concrete bug or regression the test would catch can be named. Never demand 100% coverage or tests for trivial behavior.

For each finding, include the changed source, relevant test file or missing test location, the untested behavior, and the concrete regression the test would catch.

## Reject

- Coverage-percentage goals without a behavior risk.
- Tests that only verify the type system.
- Broad test rewrites where one targeted scenario is sufficient.
