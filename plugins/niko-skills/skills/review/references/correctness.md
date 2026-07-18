# Correctness

Check whether changed code does what it claims, including bugs that pass type-checking and linting.

## Inspect

- Inverted or off-by-one conditions, wrong comparisons, boolean operators, variables, fields, argument order, or calculations.
- Empty, null, zero, negative, maximum, first/last, and inclusive/exclusive boundaries.
- Missing `await`, unhandled rejection, incorrect fire-and-forget work, swallowed errors, false success, unreachable code, and impossible branches.
- Behavior that contradicts a name, signature, documentation, return shape, nullability, ordering, caller assumption, or state ownership contract.
- Shared state mutated without required race protection.

## Evidence threshold

Report a bug only with a concrete trigger: name the input or sequence and the wrong result it produces. If no breaking input can be stated, it is not a finding. Do not re-report behavior an existing test already proves unless the test itself encodes the wrong contract.

For each finding, include **triggering input or sequence -> wrong result**.

## Reject

- Style, naming, or structure concerns presented as correctness defects.
- "Could theoretically" or "might" without a concrete case.
- Re-deriving what a passing test already proves with no new evidence.
