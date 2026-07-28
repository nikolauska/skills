# Modern Redux Toolkit and RTK Query Patterns

Use this reference selectively after inspecting the application's installed versions and existing
patterns. It consolidates the modern guidance from the pinned Redux Toolkit skill collection at
<https://github.com/reduxjs/redux-toolkit/tree/58e8cfe26000a2b651f497ab7c33dbf01a106fea/packages/toolkit/skills>.

## State ownership

Choose the owner before choosing an API:

| Data | Default owner |
| --- | --- |
| Editable fields used by one component tree | Component state |
| Path, route parameters, and search parameters | Router |
| Shared mutable client state | Redux slice |
| Request/response server cache | RTK Query |
| Browser or third-party authoritative data | External system, read at its boundary |

- Move data into Redux when distant consumers mutate it, action history matters, or a reducer must
  combine prior state with incoming events.
- Keep form edits local until commit. Pass router values into selectors instead of synchronizing
  them into Redux.
- Name slices for domain data, not screens or components. Split or merge slices when real access and
  update patterns justify it.

## Store and React wiring

Use one browser store for a client-only SPA. In an SSR environment, create a store per request and
keep that instance stable for the lifetime of its provider.

```ts
import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, useStore } from 'react-redux'

export const makeStore = () => configureStore({ reducer: rootReducer })
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppStore = useStore.withTypes<AppStore>()
```

- Access the store through `Provider` and typed hooks in React code. Reserve direct store imports
  for non-React integration boundaries.
- Keep store wiring under an application-level directory and feature logic beside its consumers.
- Preserve `getDefaultMiddleware()` and add middleware through its callback. Prepend listener
  middleware so its function-bearing management actions run before serializability checks.

## Slices, actions, and selectors

- Use `createSlice`; use the builder callback for `extraReducers`.
- Write concise Immer-backed updates inside reducers, but never mutate selected state or arguments
  outside an Immer recipe.
- Name actions as domain events such as `postAdded` or `checkoutCompleted`, not setters such as
  `setPosts`. Dispatch new external facts and let the reducer combine them with current state.
- Map payload fields deliberately. Do not spread untrusted payload objects over slice state.
- Define simple slice-owned selectors in `createSlice.selectors`. Use `getSelectors` when a slice is
  mounted at a non-default path.
- Use `createSelector` only when memoization is useful. Return existing references when data is
  unchanged; create a selector factory when each consumer needs independent argument memoization.
- Normalize collections with `createEntityAdapter` when frequent keyed lookup or ordered updates
  justify it. Supply `selectId` when the entity key is not `id`.
- Use `combineSlices`, `withLazyLoadedSlices`, and `injectInto` only when the application actually
  loads reducers lazily.

Keep raw state minimal and derive view data:

```ts
export const selectVisiblePosts = createSelector(
  [selectPosts, selectFilter],
  (posts, filter) =>
    filter === 'all' ? posts : posts.filter((post) => post.published),
)
```

## Choose the side-effect primitive

| Need | Default |
| --- | --- |
| Cached server data and request lifecycle | RTK Query |
| One imperative async workflow using `dispatch` or `getState` | `createAsyncThunk` or a thunk |
| React to later actions or state transitions | `createListenerMiddleware` |

- Keep network calls, timers, storage writes, and other effects out of reducers.
- Use thunk `condition` or request identifiers when duplicate dispatches or stale completions are
  possible. Reducers may also verify the current status or request identifier before accepting a
  lifecycle action.
- Use listener helpers such as `condition`, `take`, `cancelActiveListeners`, `delay`, and `fork` for
  long-running reactive workflows rather than polling inside thunks.
- Use `buildCreateSlice` with `asyncThunkCreator` only when colocating an async lifecycle inside the
  slice improves the existing structure; regular `createAsyncThunk` remains valid.

## RTK Query

Create one API slice for each base URL, register its reducer and middleware once, and extend it with
`injectEndpoints` across feature files.

```ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  tagTypes: ['Post'],
  endpoints: () => ({}),
})

export const store = configureStore({
  reducer: { [api.reducerPath]: api.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})
```

- Model queries as cached reads and mutations as writes.
- Let queries `provide` list and entity tags; let mutations invalidate the narrowest affected tags.
- Remember that invalidation refetches active subscriptions and removes inactive cache entries.
  Removed entries fetch again when a consumer subscribes later.
- Prefer invalidation over manual cache updates. For an optimistic update, dispatch
  `api.util.updateQueryData` in `onQueryStarted`, await `queryFulfilled`, and undo the patch on
  failure. Keep component code out of cache-patching details.
- Use `onCacheEntryAdded` for streaming or subscription lifecycles and `keepUnusedDataFor` to tune
  inactive cache retention only when requirements justify it.
- Do not persist browser API cache by default; persistence can preserve stale documents.
- Treat RTK Query as a document cache, not a normalized graph cache. Use an already-adopted graph
  client when normalized cross-document identity is a hard requirement.

## Rendering efficiency and diagnosis

- Select only the fields a component renders and subscribe near the usage site. Avoid selecting a
  whole slice in a parent merely to thread pieces through props.
- In `selectFromResult`, preserve cached object and array references. Do not copy data on every call.
- Diagnose in order: confirm the action or request, inspect reducer or cache state, evaluate the
  selector, then inspect the render boundary.
- For duplicate requests, check effect re-entry, thunk guards, active RTK Query subscriptions, and
  endpoint arguments.
- For stale RTK Query data, inspect cache keys, tag provision and invalidation, subscription state,
  and lifecycle patches.
- Treat serializability and immutability warnings as defects at the reported boundary. Store plain
  data such as ISO strings and arrays instead of `Date`, `Set`, class instances, or promises.
