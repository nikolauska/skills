# Phoenix LiveView

Use these rules for LiveViews, LiveComponents, lifecycle callbacks, forms, streams, navigation, PubSub, and LiveView tests.

## Lifecycle Model

1. Disconnected `mount/3` and optional `handle_params/3` produce static HTML.
2. The WebSocket connects and runs `mount/3` and optional `handle_params/3` again.
3. Events and messages continue through `handle_event/3` and `handle_info/2`.

Initialize every template assign before the disconnected render. Gate PubSub subscriptions, timers, process messages, and asynchronous work behind `connected?(socket)`. Make repeated `handle_params/3` work idempotent or explicitly gated.

## Workflow

1. List the touched callbacks, assigns, domain calls, and side effects.
2. Stabilize lifecycle behavior before changing events or rendering.
3. Use one canonical path for URL-driven state and assign updates.
4. Implement explicit event and message patterns, including expected failures.
5. Choose the narrowest state and navigation primitive.
6. Add focused LiveView tests for the changed behavior and a failure or invalid path.

## Decision Rules

- Use plain assigns for scalar state and explicit defaults for every template access.
- Use streams for identity-based insert, prepend, append, or delete operations on changing collections.
- Use `to_form/1`; set the changeset action for validation events.
- Use `handle_params/3` with `push_patch` for URL state in the same LiveView.
- Use `push_navigate` when moving to another LiveView.
- Subscribe once during connected mount and process PubSub messages in `handle_info/2`.
- Make `handle_info/2` tolerate messages that arrive before optional state is ready.
- Return `{:noreply, socket}` from every non-crashing event and message branch.
- Convert expected domain failures to form, assign, or flash updates at meaningful boundaries.
- Defer expensive work until connected mount only when static HTML does not require it.

```elixir
def mount(_params, _session, socket) do
  socket = assign(socket, count: 0, items: [], loading: false, error: nil)

  if connected?(socket) do
    Phoenix.PubSub.subscribe(MyApp.PubSub, "items")
  end

  {:ok, socket}
end
```

Avoid direct `socket.assigns.key` reads unless initialization is guaranteed. For genuinely optional values, use `Map.get/3` in helpers.

## Validation

- Render once through the disconnected path and once connected.
- Confirm no missing assigns, duplicated subscriptions, timers, or expensive work.
- Exercise changed events with `render_click/2`, `render_change/2`, or `render_submit/2` as appropriate.
- Assert DOM changes after stream or PubSub updates.
- Confirm navigation uses patch versus navigate intentionally.
