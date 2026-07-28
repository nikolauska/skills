# Documentation

Check documentation for drift caused or exposed by the reviewed change.

## Inspect

- Canonical documentation for changed behavior, contracts, configuration, and defaults.
- Glossary or terminology drift, outdated names, duplicated concepts, and stale examples after refactors.
- New or changed documentation that describes implementation details where a stable concept is sufficient.
- On changed documentation lines only: one H1, semantic heading order, title-case H1, sentence-case H2+, capitalized phrase-led bullets, and no unnecessary fenced prose.

## Evidence threshold

Report only documentation made stale or incomplete by the change. Pre-existing debt is out of scope unless the change makes it actively wrong. Tie every finding to a specific changed behavior and affected document.

## Reject

- Generic prose polishing or unrelated documentation debt.
- Duplicate explanations across documents.
- Treating roadmap notes as shipped behavior.
