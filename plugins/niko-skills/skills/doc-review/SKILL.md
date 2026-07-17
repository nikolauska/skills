---
name: doc-review
description: Reviews documentation for drift, missing updates, and terminology changes. Use when code changes may require matching documentation updates; do not use for general prose editing or unrelated documentation debt.
---

# Documentation Review

Review the docs the diff affects for drift — terms, contracts, and behavior the change made stale.

This is a read-only review. Do not edit files, read credentials, or contact external systems unless the user explicitly asks.

## Scope

Report only drift caused or exposed by the diff. Pre-existing doc debt untouched by the change is out of scope unless the change makes it actively wrong.

- canonical doc updates for behavior, contract, or config changes
- glossary drift when new terms are introduced
- duplicated concepts introduced or worsened by this change
- outdated names or contracts after refactors
- new or changed docs staying conceptual rather than describing implementation

## Style conventions

Apply these only to lines the change adds or modifies — never flag untouched text.

- One H1 per doc (page title). Headings follow semantic order.
- H1 title case, H2+ sentence case.
- Bullets starting with a word or phrase use a capital letter.
- No unnecessary fenced code blocks for content that reads as prose.

## Workflow

Read the diff, then the affected doc files. For changes touching many docs, use parallel readers when available, one per doc; otherwise inspect them sequentially. Verify every candidate before reporting.

## Output

For each finding: **label** (Critical = blocks release; Fix = should change; Consider = tradeoff; Nit = minor), **affected file**, **what drifted or is missing**, **fix direction**.

- Bad: "README could explain the retry architecture in more depth."
- Good: **Fix** — `docs/config.md` still says `maxRetries` defaults to 3; this diff changes it to 5 in `src/client.ts`.

Group as **Canonical updates needed** | **Optional cleanup** (max 3, each tied to a file the diff touched; omit if empty). If nothing drifted, say "No doc findings".

## See also

- `review` for cross-dimension merge decisions
- `pr` for change summaries and issue linkage

## Red flags

- Generic prose polishing
- Duplicate explanations across docs
- Implementation detail where a concept is enough
- Treating roadmap notes as shipped behavior
