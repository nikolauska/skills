# Error Handling

Use these rules when changing fallible control flow, failure boundaries, retries, or user-visible errors.

## Classify Failures

- Expected domain failures such as validation, authorization, and missing records: return `{:error, reason}`.
- Transient dependency failures: use a bounded retry or explicit fallback only when repeating the operation is safe.
- Programmer errors and broken invariants: allow the supervised process to crash.

Preserve existing public return shapes unless the user requests a contract change.

## Boundary Rules

- Use `with` for a linear chain and handle expected fallthrough explicitly in `else`.
- Use `case` when recovery branches diverge.
- Rescue only specific exception types at a boundary that can translate them meaningfully.
- Never use `rescue _`, broad `catch`, or silent fallback that hides defects.
- Use bang functions only where crashing is deliberate and supervision owns recovery.
- Map internal errors to stable messages or codes at LiveView, controller, API, worker, or task boundaries.
- Keep logs structured and exclude secrets, credentials, tokens, and oversized raw payloads.
- Bound retry attempts and backoff; instrument the final failure.
- In GenServer, Broadway, and Task callbacks, return an explicit error state or crash intentionally.

## Patterns

```elixir
with {:ok, user} <- fetch_user(user_id),
     {:ok, post} <- create_post(user, attrs) do
  {:ok, post}
else
  {:error, :not_found} -> {:error, :user_not_found}
  {:error, %Ecto.Changeset{} = changeset} -> {:error, changeset}
end
```

```elixir
def parse_payload(json) do
  try do
    {:ok, Jason.decode!(json)}
  rescue
    error in Jason.DecodeError ->
      {:error, {:invalid_json, Exception.message(error)}}
  end
end
```

At a UI boundary, show changeset errors directly and translate unknown internal reasons to a stable generic message; do not expose exception details.

## Validation

- Exercise one success and one expected failure path at each changed boundary.
- Confirm every branch returns the documented shape.
- Confirm rescue clauses are specific and retries terminate.
- Confirm user-facing errors are actionable without leaking internals.
