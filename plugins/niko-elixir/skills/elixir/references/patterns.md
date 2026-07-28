# Elixir Patterns

Use these rules for idiomatic `.ex` and `.exs` implementation or refactoring.

## Decision Order

1. Match in function heads when clauses express distinct input shapes.
2. Add guards for simple guard-safe type or value constraints.
3. Use `with` for linear fallible flows with compatible tagged-tuple contracts.
4. Use `case` for explicit branches with divergent outcomes.
5. Use `if` or `unless` only for straightforward boolean checks.
6. Use a pipeline only when every step clearly transforms the preceding value.

## Core Patterns

Prefer matching over field-access branching:

```elixir
def process(%{status: :ok, data: data}), do: data
def process(_), do: nil
```

Keep fallible flows linear:

```elixir
with {:ok, params} <- validate_params(params),
     {:ok, changeset} <- build_changeset(params),
     {:ok, record} <- Repo.insert(changeset) do
  {:ok, record}
end
```

Return tagged tuples for expected failures:

```elixir
def fetch_user(id) do
  case Repo.get(User, id) do
    nil -> {:error, :not_found}
    user -> {:ok, user}
  end
end
```

- Avoid single-step pipelines and long mixed-responsibility pipelines.
- Use `for` when it replaces multiple enumeration passes and remains readable; otherwise use explicit `Enum` steps.
- Order clauses from specific to general and add a catch-all only when the contract permits it.
- Keep guards side-effect free and limited to allowed guard functions.
- Use `PascalCase` modules, `snake_case` functions and variables, `?` predicates, and `!` only for intentional crash semantics.
- Add `@doc` to public functions whose contract is not obvious from name and types.
- Do not extract helpers or abstractions without a second use or a clear readability gain.

## Validation

- Confirm all clauses return compatible shapes.
- Confirm the change reduces nesting without hiding branches.
- Compare behavior at immediate callers before and after the refactor.
- Run formatter and focused tests for the touched modules.
