# Effects and derived state

Use this reference when adding, removing, or reviewing an Effect, derived
state, data fetching, subscriptions, or state resets.

Provenance: adapted from React's
[You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).
The link is attribution, not required reading.

## Decide by cause

Ask why the code must run:

- If a user interaction caused it, run it in that event handler.
- If rendering requires synchronization with an external system, use an Effect.
- If it only computes UI data from props or state, calculate it during render.

External systems include browser APIs, network connections, subscriptions,
timers, analytics tied to visibility, and non-React widgets.

## Prefer render-time derivation

Do not store a value that can be calculated from current props or state.
Redundant state first renders stale data, then causes another render when its
Effect updates the value.

```jsx
function Name({ first, last }) {
  const fullName = `${first} ${last}`;
  return <span>{fullName}</span>;
}
```

For a genuinely expensive pure calculation, measure a production build on
representative hardware. `useMemo` can skip update-time work when dependencies
are unchanged, but it does not improve the first render. React Compiler can
often supply this memoization automatically.

## Put interaction work in event handlers

Requests, notifications, and mutations caused by a click, submit, or other
interaction belong in that handler. Do not represent the interaction as state
merely so an Effect can observe it. Extract a plain function when multiple
handlers share the work.

Display-driven work can remain in an Effect. For example, recording that a
screen became visible is caused by rendering, not by one particular event.
Make such code safe when development Strict Mode remounts the component; do
not assume a mount Effect runs only once.

## Reset and reconcile without Effects

- Change a subtree's `key` when an entity change should reset its state.
- Store a stable identifier and derive the selected object during render.
- Lift state to a shared owner when two values must mirror one another.
- Notify a parent in the same event that updates the child, or control the child.
- Fetch shared data in the parent instead of pushing child results upward.

As a last resort, a component may conditionally update its own state during
render after comparing a stored previous value. Guard against loops, never
update another component during render, and keep side effects out of render.

```jsx
function ProfilePage({ userId }) {
  return <Profile key={userId} userId={userId} />;
}
```

## Avoid chains of state-to-state Effects

Calculate related next state in the event that caused the transition instead
of creating a chain in which each Effect updates state that triggers another
Effect. Event handlers observe a snapshot of state, so compute an explicit
next value when later logic needs it.

A chain can still be valid when each step genuinely synchronizes with an
external system, such as dependent network requests.

## Subscriptions and fetching

Prefer `useSyncExternalStore` over a hand-written Effect for subscribing to an
external mutable store or browser API.

Fetching data because visible inputs changed is synchronization and may use an
Effect. Prevent an older response from overwriting a newer one:

```jsx
useEffect(() => {
  let ignore = false;

  fetchResults(query, page).then((results) => {
    if (!ignore) setResults(results);
  });

  return () => {
    ignore = true;
  };
}, [query, page]);
```

This cleanup prevents stale-response races. It does not provide caching,
server rendering, loading and error orchestration, or protection from network
waterfalls. Prefer the framework's data-loading facility when available.
Otherwise, place raw fetching Effects behind a focused custom Hook.

## Application initialization

An empty dependency array means once per mount, not once per application
lifetime. Truly application-wide initialization can run from the app entry
point or use a module-level guard. Account for server and browser environments,
and remember that module initialization runs on import even if a component
never renders.

## Effect completion check

- The Effect has a named external synchronization target.
- Interaction-specific work remains in event handlers.
- Every reactive value used by the Effect is a dependency.
- Setup and cleanup are symmetric and tolerate repetition.
- Async cleanup prevents stale results from winning races.
- No dependency lint rule is suppressed to imitate a lifecycle method.
