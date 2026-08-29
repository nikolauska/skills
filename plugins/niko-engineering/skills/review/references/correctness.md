# Correctness

Check whether changed code does what it claims, including bugs that pass type-checking and linting.

## Inspect

- Inverted or off-by-one conditions, wrong comparisons, boolean operators, variables, fields, argument order, or calculations.
- Empty, null, zero, negative, maximum, first/last, and inclusive/exclusive boundaries.
- Missing `await`, unhandled rejection, incorrect fire-and-forget work, swallowed errors, false success, unreachable code, and impossible branches.
- Behavior that contradicts a name, signature, documentation, return shape, nullability, ordering, caller assumption, or state ownership contract.
- Shared state mutated without required race protection. Trace check-then-use sequences explicitly: name what can change after validation, which operation consumes the stale fact, and the resulting wrong mutation.
- Path confinement across every filesystem operation, including temporary creation and final installation. A pathname validation followed by pathname use is not confinement when a supported actor can replace a parent.
- Supported configuration combinations that change ownership or containment, such as managed storage placed inside the source tree and broad selectors that can select the tool's own state.
- Cleanup and durable state after failure at each open, close, remove, rename, hook, or persistence boundary.
- Remedies that collapse distinct adjacent states, such as missing, dangling, inaccessible, and escaping paths, into one behavior without an explicit product decision.

## Evidence threshold

Report a bug only with a concrete trigger: name the input or sequence and the wrong result it produces. If no breaking input can be stated, it is not a finding. Do not re-report behavior an existing test already proves unless the test itself encodes the wrong contract.

For each finding, include **triggering input or sequence -> wrong result**.

## Reject

- Style, naming, or structure concerns presented as correctness defects.
- "Could theoretically" or "might" without a concrete case.
- Re-deriving what a passing test already proves with no new evidence.
