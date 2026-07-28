# Gettext Translations

Use these rules for existing non-English `.po` files, missing translations, fuzzy entries, plural forms, and locale-specific wording.

## Constraints

- Resolve requested locales; otherwise inspect available locale directories and exclude English.
- Do not create or alter `msgid`, source references, or comments unless fixing a confirmed catalog issue.
- Do not edit English defaults.
- Preserve placeholders, markup, punctuation, and whitespace-sensitive formatting exactly.
- Keep `msgid_plural` and every required `msgstr[n]` form intact.
- Do not machine-translate without user approval.

## Workflow

1. Audit each target locale for empty non-header translations and fuzzy entries.
2. Translate entries in their source and domain context.
3. Remove the `fuzzy` flag only after confirming the translation.
4. Verify placeholders, markup, punctuation, and context for every reviewed bulk update, then apply a JSON map to one `.po` file with the bundled helper.
5. Repeat both audits until no targeted missing or fuzzy entries remain.
6. Report edited files and intentionally deferred entries with reasons.

Run the bundled helpers by passing their resolved absolute path to `mix run --no-start` inside the target project's Mix environment:

- `find_missing_translations.exs [gettext-root]`
- `find_fuzzy_translations.exs [gettext-root]`
- `apply_translation_map.exs --po PO_FILE --map JSON_FILE`

Pass each resolved non-English locale directory as the audit root. Use the `priv/gettext` default only after confirming it contains no English catalog. The mapping file uses a string for singular messages and a list ordered by plural index for plural messages:

```json
{
  "Add": "Lisää",
  "%{count} lap": ["%{count} kierros", "%{count} kierrosta"]
}
```

The mapping helper rejects duplicate `msgid` values that may require context-specific translations and verifies `%{...}` placeholders before replacing the catalog atomically. Manually verify markup and punctuation. The helpers depend on Expo and JSON modules already available in the target Mix project. If unavailable, inspect and edit the catalogs directly instead of installing a dependency for the helper.

## Validation

- No targeted non-header `msgstr` remains empty.
- No reviewed fuzzy flag remains.
- Placeholders and markup match their `msgid` exactly.
- Plural forms match the locale's catalog structure.
- The `.po` files still parse through the project's Gettext tooling and focused tests.
