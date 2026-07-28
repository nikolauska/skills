# Style

Check naming, coding patterns, readability, and consistency against repository evidence.

## Inspect

- Naming across types, constants, functions, files, constructors, factories, imports, and exports.
- Renamed concepts staying aligned across code, tests, docs, and exported identifiers.
- Exhaustive state handling, consistent assertions and errors, explicit state fields, guard clauses, and data-driven lookups where nearby code establishes those patterns.
- Repeated argument groups, magic values, ambiguous shapes, dead branches, unused parameters, ad-hoc fallbacks, valueless wrappers, deep nesting, and hard-to-read expressions.

## Evidence threshold

Naming, layout, and pattern findings must cite nearby code or documented rules establishing the local convention. General readability guidance may stand without repository evidence, but cap it at **Consider** unless a documented convention makes it mandatory.

For each convention finding, cite both the offending location and the establishing evidence.

## Reject

- Generic style dogma overriding local conventions.
- Formatting nits unsupported by repository rules.
- Speculative abstractions or broad rewrites.
