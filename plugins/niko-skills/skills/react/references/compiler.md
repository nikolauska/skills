# React Compiler and memoization

Use this reference when React Compiler is enabled or proposed, or when adding,
retaining, or removing `memo`, `useMemo`, or `useCallback`.

Provenance: adapted from React's
[React Compiler introduction](https://react.dev/learn/react-compiler/introduction).
The link is attribution, not required reading.

## What the compiler does

React Compiler is an optional build-time tool that analyzes JavaScript
conforming to the Rules of React and inserts memoization. Application code
remains ordinary JavaScript and JSX.

Its main target is update performance:

- Reuse component and JSX work to avoid cascading child renders.
- Reuse expensive render-time calculations inside components and Hooks.
- Stabilize values and callbacks where hand-written memoization would fail.

Write direct, rules-compliant code first rather than wrapping components
throughout with `memo`, `useMemo`, and `useCallback`.

## Boundaries

- Memoization is local to React components and Hooks, not ordinary functions.
- Caches are not shared between component instances or separate Hooks.
- Repeated expensive work across callers may need application-level caching.
- Compiler optimization does not make rules-violating code correct.
- Profile before adding memoization complexity.

## Manual memoization

For new code in a compiler-enabled project, rely on compiler memoization by
default. Keep manual memoization when referential identity is an observable
contract or exact identity control is needed, such as stabilizing an Effect
dependency.

Do not remove existing manual memoization in bulk. Removing it can change
compiler output or application behavior. Remove it only with focused tests and
performance evidence.

Without the compiler, use manual memoization only when measurement identifies
costly repeated work or stable identity is required. `useMemo` skips eligible
update-time calculations; it does not make the first render faster.

## Adoption checks

Before changing compiler configuration:

1. Confirm the project's React, framework, plugin, and build-tool versions.
2. Inspect the existing compiler and lint configuration.
3. Fix Rules of React violations rather than relying on compiler bailouts.
4. Use the existing integration; do not add dependencies without approval.
5. Run focused tests and compare production performance when optimizing.

The official introduction names integrations for Babel, Vite, Metro, Rsbuild,
and supported Next.js versions, but integration details are version-sensitive.
Inspect the target project's installed tooling instead of copying setup
commands from this reference.
