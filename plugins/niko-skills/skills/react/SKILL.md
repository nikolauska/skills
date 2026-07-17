---
name: react
description: >
  Guides implementation, refactoring, debugging, and review of React components and Hooks in
  JavaScript or TypeScript. Use when a task touches JSX/TSX, component state, rendering, event
  handlers, Effects, custom Hooks, memoization, or React Compiler behavior. Do not use for
  framework-independent frontend work or non-React UI code.
---

# React

## Objective

- Make the smallest correct React change while preserving the target project's conventions.
- Prefer derived values and event handlers over redundant state and Effects.
- Keep code compatible with React's rules and automatic compiler optimization.

## Safety and Constraints

- Read repository instructions and existing component patterns before choosing an approach.
- Preserve public component behavior and accessibility semantics unless the user requests a change.
- Never read or expose `.env` files, credentials, keys, tokens, or private user data.
- Do not install or update packages, change React/compiler/framework versions, browse, or contact external systems unless the user requests it.
- Use project-configured commands and dependencies; report unavailable checks instead of downloading tools implicitly.

## Workflow

1. Inspect the target repository's instructions, package manifest, React and framework versions,
   compiler and lint configuration, touched components, immediate callers, and focused tests.
2. Trace each value to its source: props, state, context, external systems, or a user interaction.
3. Apply the rules and Effect decision below before changing component structure.
4. Reuse the project's framework data-loading, mutation, form, and error-handling conventions.
5. Implement the smallest coherent change at the component or Hook that owns the behavior.
6. Run the narrowest relevant formatter, lint, typecheck, and test commands already configured by
   the project. Report skipped checks and why.

## Rules of React

- Keep components and Hooks pure and idempotent during render.
- Treat props, state, Hook arguments, Hook return values, and values passed to JSX as immutable
  snapshots. Create new values instead of mutating existing ones.
- Run side effects outside render.
- Render components through JSX; never call component functions directly.
- Call Hooks unconditionally at the top level of React components or custom Hooks, before early
  returns. Never pass Hooks around as ordinary values.
- Keep state minimal. Calculate values from current props and state during render when possible.

## Props and TypeScript

- Keep component APIs small and readable. Pass one coherent object prop when the component consumes
  that object as a unit; do not split every field into a separate prop.
- Preserve a stable object reference. Pass an existing stable object directly, or memoize a newly
  assembled object with React Compiler or `useMemo` when referential stability matters.
- Pass separate props when values have independent meaning, ownership, or change frequency. Do not
  hide unrelated values inside a catch-all object merely to reduce the prop count.
- In TypeScript, always define the props object as readonly with `Readonly<Props>` or `readonly`
  properties. Make nested domain values readonly too when the component must not mutate them.

## Decide Whether to Use an Effect

Use an Effect only to synchronize with an external system because the component is rendered, such
as a browser API, network connection, subscription, timer, or non-React widget.

Before adding or retaining an Effect:

1. Calculate render-only transformations directly during render.
2. Put interaction-specific work in the event handler that caused it.
3. Use a `key` when a conceptual entity change should reset an entire subtree's state.
4. Store a stable identifier and derive the selected object instead of synchronizing duplicate
   state.
5. Share repeated event logic with a plain function.
6. Prefer the framework's data-loading mechanism over fetching directly in an Effect when one
   exists.

When an Effect is necessary, include every reactive dependency, make setup and cleanup symmetric,
and ensure repeated setup is safe. Do not silence dependency lint rules to force a lifecycle shape.

## React Compiler and Memoization

- Check whether React Compiler is enabled before adding manual memoization.
- Write straightforward rules-compliant components first; the compiler can memoize components,
  values, and functions used by components and Hooks.
- Do not add `memo`, `useMemo`, or `useCallback` speculatively. Profile first, or retain them when
  referential identity is part of an existing contract.
- Remember that compiler memoization is local to components and Hooks. It does not memoize ordinary
  functions globally or share cached results across component instances.
- Fix rule violations instead of relying on compiler bailouts or memoization directives.

## Sources

- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React Compiler introduction](https://react.dev/learn/react-compiler/introduction)
- [Rules of React](https://react.dev/reference/rules)

## Completion Check

- No state duplicates a value that can be derived cheaply during render.
- Every Effect has a real external synchronization target, complete dependencies, and cleanup when
  needed.
- Components and Hooks remain pure, immutable, and valid under the Rules of Hooks.
- Component APIs use the fewest meaningful props, and TypeScript props are readonly.
- Manual memoization is justified by project constraints or measurement.
- Focused project checks pass, or skipped validation is named with a reason.
