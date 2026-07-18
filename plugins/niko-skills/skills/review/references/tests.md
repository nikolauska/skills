# Tests

Check whether tests adequately guard changed observable behavior.

## Inspect

- Each changed behavior, branch, error path, and compatibility contract mapped to a test that proves it.
- Boundary inputs, missing data, parse failures, recovery paths, and supported configuration variants.
- Assertions and fixtures that would fail for the named regression, remain deterministic, and clean up shared state.
- Tests coupled to implementation details, timing, ordering, absolute paths, or internal mocks instead of observable behavior and established boundary seams.
- Duplicate tests, trivial pass-through coverage, type-system duplication, and tests for behavior that no longer exists.

## Evidence threshold

Report a gap only when a concrete bug or regression the test would catch can be named. Never demand 100% coverage or tests for trivial behavior.

For each finding, include the changed source, relevant test file or missing test location, the untested behavior, and the concrete regression the test would catch.

## Reject

- Coverage-percentage goals without a behavior risk.
- Tests that only verify the type system.
- Broad test rewrites where one targeted scenario is sufficient.
