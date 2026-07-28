# Complexity

Review only unnecessary complexity. The desired outcome is a shorter diff.

## Scope

Flag dead code, unused flexibility, speculative features, one-implementation abstractions, configuration nobody sets, layers with one caller, hand-rolled standard-library behavior, dependencies or code replaced by native platform features, and logic that can express the same behavior in fewer lines.

Do not report correctness, security, or performance issues here. Do not flag a single smoke test or `assert`-based self-check.

## Evidence

Verify every finding against the diff and surrounding code. Before calling something unused or single-use, search the repository for its callers, implementations, and configuration. Prefer deletion; otherwise name the concrete standard-library, native, inline, or shorter replacement. Do not propose a new abstraction.

## Output override

Use one line per finding:

`<file>:L<line>: <tag> <what to cut>. <replacement>.`

For a single-file review, omit `<file>:`. Use these tags:

- `delete:` dead code, unused flexibility, or a speculative feature; replacement is nothing.
- `stdlib:` hand-rolled behavior; name the standard-library function.
- `native:` dependency or code replaced by a platform feature; name the feature.
- `yagni:` one-implementation abstraction, unset configuration, or one-caller layer; inline or remove it until a second use exists.
- `shrink:` equivalent logic in fewer lines; show the shorter form.

End the section with `net: -<N> lines possible.` Estimate only lines directly removed by the recommended changes. If nothing qualifies, output only `Lean already. Ship.`
