# Architecture

Check boundaries, design consistency, extension seams, cohesion, and indirection.

## Inspect

- Runtime import cycles, pass-through facades, aliases, wrappers, oversized dependency bags, singleton coupling, and facade chains that carry no policy, invariants, or boundary isolation.
- Hard-coded behavior that contradicts an established configuration or extension seam, and unused extension seams with no current product need.
- Contract and schema ownership, dependency direction, partial renames across boundaries, and design-pattern consistency.
- Multi-responsibility modules and unrelated concerns mixed across boundaries; boundary-local duplication is acceptable when it preserves clarity.
- Runtime or framework assumptions that violate documented portability or product goals.

## Evidence threshold

Report only issues supported by code, contracts, dependency flow, or documented architecture. Do not turn taste or a hypothetical future extension into a finding.

For each finding, name the violated boundary or pattern and all materially impacted files.

## Reject

- Speculative frameworks or plugin systems.
- Broad rewrites where a small boundary fix works.
- DRY arguments against clear boundary-local duplication.
