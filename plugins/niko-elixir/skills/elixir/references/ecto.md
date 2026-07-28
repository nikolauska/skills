# Ecto

Use these rules for schemas, changesets, queries, associations, transactions, migrations, and database constraints.

## Workflow

1. Locate the touched schemas, contexts, migrations, constraints, indexes, and tests.
2. Classify the change:
   - Schema behavior only: update changesets or queries without a migration.
   - Storage shape: update schema, migration, context, and tests together.
   - Repair or backfill: define batching, rollout, and rollback before editing.
3. Implement the smallest complete persistence change.
4. Run focused context tests; broaden validation when migrations or shared queries change.

## Schemas and Changesets

- Keep `cast/4` allowlists tight and validate business-required fields.
- Back application validation with database constraints.
- Match `unique_constraint/3`, `foreign_key_constraint/3`, and `check_constraint/3` names to migrations.
- Prefer recoverable non-bang Repo calls in context APIs that return tagged tuples.

```elixir
def changeset(record, attrs) do
  record
  |> cast(attrs, [:name, :manufacturer_id, :status])
  |> validate_required([:name, :manufacturer_id])
  |> foreign_key_constraint(:manufacturer_id)
  |> unique_constraint([:manufacturer_id, :name])
end
```

## Queries and Transactions

- Compose queries with `Ecto.Query`; keep optional filters explicit.
- Add deterministic ordering for paginated or user-facing lists.
- Preload intentionally instead of loading associations in loops.
- Avoid unbounded `Repo.all/2` on user-facing paths.
- Use `Ecto.Multi` with `Repo.transaction/1` for dependent multi-record writes.

```elixir
Ecto.Multi.new()
|> Ecto.Multi.insert(:device, Device.changeset(%Device{}, attrs))
|> Ecto.Multi.update(:manufacturer, Manufacturer.touch_changeset(manufacturer))
|> Repo.transaction()
```

## Migration Safety

- Never run reset, drop, truncate, or broad delete operations without explicit approval.
- Keep migrations reversible; use explicit `up/0` and `down/0` when `change/0` cannot reverse safely.
- Use `execute/2` with rollback SQL for operations outside the Ecto DSL.
- For existing large tables, stage `NOT NULL`, defaults, backfills, table rewrites, and index creation to limit locks.
- Prefer additive rename rollouts: add, transition code/data, then remove in a later migration.
- Batch large backfills and document the restart/rollback behavior.

## Validation

- Confirm schema fields, changesets, constraints, and migrations agree.
- Test the success path and at least one constraint or validation failure.
- Confirm query ordering and preload behavior are intentional.
- Run migration-aware or shared-context tests when persistence shape changes.
