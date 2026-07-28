---
name: elixir
description: >
  Guides implementation, refactoring, debugging, and review of Elixir and Phoenix code, including
  .ex/.exs idioms, error handling, Ecto, LiveView, uploads and static files, and Gettext .po files.
  Use when a task touches those artifacts or behaviors. Do not use for Erlang-only, general
  infrastructure, or non-Gettext translation work.
---

# Elixir

## Objective

- Make the smallest correct Elixir or Phoenix change that follows the target repository's conventions.
- Load only the topic references needed for the task.

## Safety and Constraints

- Read repository instructions and existing code before choosing a pattern.
- Preserve public behavior and return contracts unless the user requests a change.
- Never read or expose `.env` files, credentials, keys, or tokens.
- Never run destructive Git, database, or filesystem operations without explicit user approval.
- Do not browse, contact external systems, or install dependencies unless the user requests it.
- Prefer Elixir, OTP, Ecto, and Phoenix primitives already present in the project.

## Workflow

1. Discover the project shape.
   - Read repository instructions, `mix.exs`, touched modules, immediate callers, and focused tests.
   - Derive application modules, paths, task wrappers, and supported dependency versions from the repository.
   - If a running development app exposes Tidewave MCP tools, verify they belong to this checkout with `File.cwd!()` and use them for runtime discovery.
2. Classify the task and read only the matching references below.
   - Read multiple references when the behavior crosses boundaries.
   - For example, read LiveView and Phoenix files guidance for a lifecycle-sensitive upload.
3. Plan the smallest coherent change.
   - Confirm current contracts, failure behavior, persistence effects, and user-visible behavior.
   - Reuse project helpers and conventions before adding code.
4. Implement at the shared boundary that owns the behavior.
   - Keep related success and failure paths consistent.
   - Add or update one focused regression check for non-trivial logic.
5. Validate with project-local commands.
   - Run the configured formatter check and the narrowest relevant test first.
   - Expand to the repository's broader test command when the change crosses contexts or persistence boundaries.
   - On failure, read the complete error, fix the smallest failure class, and rerun the narrow check.
6. Report changed behavior, checks run, and any residual risk or skipped validation.

## Tidewave

- Prefer available Tidewave tools for exact dependency docs, source locations, Ecto schema discovery, bounded runtime evaluation, recent logs, read-only SQL, and browser inspection.
- Use Tidewave only against a local development app. Never use it in production or on a shared environment containing production data.
- Inspect schemas before SQL, default to `SELECT`, add `LIMIT`, and require explicit approval for mutations. Roll back temporary records created by smoke checks.
- Bound runtime output with `Enum.take/2` or `inspect/2` limits. Narrow the query instead of dumping process state or tables.
- After edits, inspect error logs; after a behavior change, exercise the changed path with runtime or browser evaluation. Tidewave complements rather than replaces formatter and focused test checks.
- If Tidewave is unavailable, the app is not running, or `File.cwd!()` identifies another checkout, skip it and use the normal static-analysis and Mix workflow.

## Topic References

- [Elixir patterns](references/patterns.md): pattern matching, guards, pipelines, naming, and idiomatic refactors.
- [Error handling](references/error-handling.md): tagged tuples, exceptions, retries, supervision boundaries, and user-facing errors.
- [Ecto](references/ecto.md): schemas, changesets, queries, associations, transactions, migrations, and constraints.
- [LiveView](references/liveview.md): lifecycle, callbacks, assigns, forms, streams, navigation, PubSub, and tests.
- [Phoenix files](references/phoenix-files.md): LiveView uploads, local persistence, public static serving, and private downloads.
- [Gettext](references/gettext.md): missing or fuzzy `.po` translations, plural forms, placeholders, and bulk updates.

## Gettext Helpers

- [Find missing translations](scripts/find_missing_translations.exs): print untranslated entries.
- [Find fuzzy translations](scripts/find_fuzzy_translations.exs): print fuzzy entries with context.
- [Apply translation map](scripts/apply_translation_map.exs): apply a reviewed JSON translation map to one `.po` file.

Run helpers inside the target project's Mix environment because they use its existing Expo and JSON support. If those modules are unavailable, inspect and edit `.po` files directly; do not add a dependency solely for these helpers.

## Completion Check

- Relevant references were read and unrelated references were not loaded.
- Existing project conventions and public contracts remain intact unless intentionally changed.
- Formatter and focused tests pass, or skipped checks are named with reasons.
- Database, upload, static-serving, and translation safety checks pass when applicable.
