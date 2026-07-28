# Rules of React

Use this reference when reviewing component purity, mutation, component
invocation, or Hook placement.

Provenance: adapted from React's
[Rules of React](https://react.dev/reference/rules). The link is attribution,
not required reading.

These are correctness constraints, not optional style preferences. They let
React safely schedule, repeat, and optimize work. Use Strict Mode and the
project's React Hooks lint rules to expose violations.

## Components and Hooks must be pure

- **Idempotent rendering:** the same inputs must produce the same result.
- **No side effects during render:** render may run more than once. Put
  interaction work in event handlers and external synchronization in Effects.
- **Props and state are immutable snapshots:** create new values and use the
  state setter instead of mutating them.
- **Hook arguments and return values become immutable:** do not modify a value
  after passing it to a Hook or mutate a value returned by a Hook.
- **Values passed to JSX become immutable:** complete intended mutation before
  creating JSX that uses the value; do not mutate it afterward.

```jsx
function Counter({ config }) {
  const step = config.step + 1;
  return <button>{step}</button>;
}
```

Mutating `config.step` would change a prop during render and violate snapshot
semantics.

## React calls components and Hooks

React owns when component and Hook logic executes so it can coordinate
rendering and optimization.

- Render components through JSX, such as `<Card />`; do not call `Card()`.
- Do not pass Hooks around as callback values or dynamically substitute them.
- Call Hooks directly from React function components or custom Hooks.

## Rules of Hooks

- Call Hooks only at the top level of a component or custom Hook.
- Place Hook calls before early returns.
- Never call Hooks in conditions, loops, nested functions, event handlers, or
  ordinary JavaScript functions.
- Call Hooks only from React function components or custom Hooks.

```jsx
function Panel({ enabled }) {
  const value = useFeature();
  if (!enabled) return null;
  return <View value={value} />;
}
```

A stable top-level call order lets React associate Hook state with the same
call on every render.

## Review check

- Rendering is deterministic for the same props, state, and context.
- Render performs no I/O, external mutation, subscription, or timer setup.
- Props, state, Hook values, and JSX-bound values are not mutated.
- Components are rendered with JSX rather than invoked directly.
- Every Hook is called directly, unconditionally, and before early returns.
