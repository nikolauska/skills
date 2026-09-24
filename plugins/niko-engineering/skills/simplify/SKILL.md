---
name: simplify
description: Implements requested features and fixes with minimal correct changes, or simplifies working code when separately authorized to refactor. Use for minimal-code implementation or behavior-preserving cleanup; not read-only review, diagnosis, or unsolicited refactoring during implementation.
---

# Simplify

Choose the branch the user requested. Do not turn an implementation into unrelated cleanup; a review finding alone does not authorize refactoring.

## Feature or fix

Trace the affected behavior, callers, and contracts. Reuse existing code, platform features, and standard library facilities before adding code or dependencies. Make the smallest coherent change that solves the request; avoid speculative abstractions. Fix a shared root cause rather than patching symptoms in individual callers. Exercise the changed behavior with the narrowest relevant check.

## Separately authorized cleanup

Understand why the working code exists and what its callers depend on before removing or restructuring it. Prefer clearer control flow, names, and responsibility boundaries over fewer lines; leave already-clear code alone. Preserve observable behavior and existing assertions. Make coherent changes and exercise affected behavior with focused checks; if an assertion must change to pass, reconsider whether behavior changed.

## Boundary

Minimal code must not sacrifice validation, authorization, error handling, accessibility, data integrity, or required compatibility.
