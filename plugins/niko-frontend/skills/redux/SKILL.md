---
name: redux
description: >
  Guides implementation, refactoring, debugging, and review of modern Redux Toolkit and RTK Query
  code in JavaScript or TypeScript applications. Use when a task touches configureStore,
  createSlice, selectors, entity adapters, typed React-Redux hooks, Redux side effects,
  createAsyncThunk, listener middleware, createApi endpoints, cache invalidation, optimistic
  updates, or Redux rendering performance. Do not use for legacy Redux migration or non-Redux
  state management.
---

# Redux

## Objective

- Write the smallest correct Redux Toolkit and RTK Query change that fits the target application.
- Keep state ownership explicit, transitions reducer-owned, and server data in RTK Query by default.
- Preserve serializability, narrow subscriptions, and the target project's established conventions.

## Workflow

1. Inspect repository instructions, installed Redux packages and versions, store setup, relevant
   slices or API definitions, immediate consumers, and focused tests.
2. Identify the authoritative owner of each value before editing: component, router, Redux slice,
   RTK Query cache, or another external system.
3. Trace the affected flow end to end: event or request, reducer or endpoint lifecycle, selector,
   and rendering consumer.
4. Read [modern Redux patterns](references/modern-redux.md) and apply only the sections relevant to
   the task.
5. Reuse the project's store, typed hooks, base API, endpoint injection, selector, and test patterns.
6. Implement the smallest coherent change at the owner of the behavior. Do not add abstractions,
   middleware, or dependencies for hypothetical reuse.
7. Run the narrowest configured formatter, lint, typecheck, and test commands. For data flows,
   verify pending, success, failure, and stale-request behavior where applicable.

## Non-negotiable Rules

- Use `configureStore`, `createSlice`, and React-Redux hooks for new code.
- Keep reducers pure. Use Immer mutation syntax only inside Immer-backed reducers and cache recipes.
- Dispatch domain events and let reducers combine current state with incoming data.
- Derive values with selectors instead of storing duplicate state.
- Keep state serializable unless an existing, documented integration requires otherwise.
- Use RTK Query for request/response server cache unless its document-cache model does not fit.
- Keep one `createApi` slice per base URL; split feature files with `injectEndpoints`.
- Prefer tag invalidation to manual cache patches. Keep optimistic updates in endpoint lifecycles.
- Use `createAsyncThunk` or a thunk for imperative workflows and listener middleware for reactions
  to future actions or state transitions.
- Select the smallest values a component renders, close to where they are used.

## Guardrails

- Never read or expose `.env` files, tokens, credentials, or private keys while inspecting API code.
- Do not disable serializability or immutability checks merely to silence a warning; fix the value or
  narrow an existing exception to the verified integration boundary.
- Do not change backend data, dispatch production actions, or run destructive requests to test a
  client-side change without explicit user approval.
- Do not install or upgrade Redux packages unless the user asks. Match the installed API surface.
- Do not browse documentation or call external systems unless the task requires it and user or
  repository instructions allow it. Never transmit repository source, credentials, or user data.

## Completion Check

- Each value has one authoritative owner; no router, form, derived, or server-cache state is copied
  into a slice without a concrete need.
- Actions describe events, reducers own transitions, and selectors return stable values when inputs
  are unchanged.
- When RTK Query is in scope, its reducer and middleware are registered and cache tags match
  endpoint behavior; when manual patches are used, they recover from failure.
- Async work uses the right primitive and prevents duplicate or stale completion when relevant.
- Focused project checks pass, or skipped validation is named with a reason.
