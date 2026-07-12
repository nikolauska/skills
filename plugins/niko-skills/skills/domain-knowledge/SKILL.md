---
name: domain-knowledge
description: >
  Maintains general-purpose business domain knowledge in `docs/domain/` with a concise `docs/domain.md` index.
  Use when creating, updating, reviewing, finding, or synchronizing cross-functional concepts, products, workflows,
  terminology, or business rules; do not use for code, API, architecture, or implementation documentation.
---

# Domain Knowledge

## Objective

- Maintain plain-language business knowledge that can be shared across sales, marketing, support, and engineering.
- Keep one focused topic per file under `docs/domain/` and make every topic discoverable from `docs/domain.md`.
- Confirm business meaning with the user or a domain expert instead of inferring it from implementation.

## Safety and constraints

- Treat the user or domain expert as the source of truth for business meaning. Use code and technical documentation only to surface terminology or contradictions.
- Never read or open `.env` files, and never include code, code identifiers, APIs, databases, architecture, deployment details, internal technical workarounds, secrets, credentials, private keys, personal data, or customer-sensitive data.
- Do not publish unresolved claims. If a fact cannot be confirmed, pause and ask; never fill the gap with an assumption.
- Do not browse the web or call external systems unless the user explicitly requests it.
- Manage only `docs/domain.md` and `docs/domain/*.md`. Do not modify `CONTEXT.md`, `docs/adr/`, or migrate legacy documents unless explicitly asked.
- Do not write or repair files until the user approves the confirmed draft or proposed repair.

## Inputs and outputs

- Read `docs/domain.md`, relevant files in `docs/domain/`, and relevant human-facing project documentation.
- Inspect implementation only when it helps identify a term or a possible disagreement; do not treat it as a business specification.
- Create or update one topic file at `docs/domain/<kebab-case-topic>.md`.
- Maintain `docs/domain.md` as the short, human-readable index of all topic files.

## Workflow

### 1. Discover the collection

1. Determine whether the request is to create, update, find, review, or repair the collection. If unclear, ask one question.
2. Read the existing index and the relevant topic files. If the directory or index is missing, plan to create it lazily with the first approved topic.
3. Search relevant human-facing documentation for established terminology.
4. Inspect code only to identify candidate terms or contradictions. Report those as questions; never convert them directly into domain knowledge.
5. Report missing, stale, duplicate, or orphaned index entries before proposing repairs.

### 2. Interview for a new or changed topic

Ask exactly one question at a time and include a recommended answer. Wait for the user's answer before asking the next question.

Resolve these questions in order:

1. What is the topic and what should readers understand or do after reading it?
2. Which business terms are canonical, and which aliases should be avoided?
3. What does the topic include and exclude?
4. Which people, organizations, products, or concepts are involved, and how do they relate?
5. What is the normal business flow or lifecycle?
6. Which rules, exceptions, boundaries, and customer-facing behaviors matter?
7. Which concrete scenarios or examples make the meaning unambiguous?
8. Which related topics should readers follow?

Challenge vague terms, contradictions, and unsupported assumptions with concrete scenarios. For an update, re-confirm every changed business claim and preserve unrelated confirmed content. If the user cannot answer a question, stop publication until it is resolved.

### 3. Draft and approve the topic

Draft the complete file in plain language. Every topic file must contain:

- `# Topic name`
- `## Summary`
- `## Scope and boundaries`
- `## Examples`

Add `## Business rules`, `## Lifecycle`, `## Terminology`, or `## Related concepts` only when they improve that topic. Do not add empty sections.

Show the full topic draft and its proposed index entry. The index entry must be one sentence of at most 25 words with a relative link to the matching topic file under `docs/domain/`. Ask for approval before writing either file.

### 4. Write and synchronize

1. Create `docs/domain/` and `docs/domain.md` only when an approved topic requires them.
2. Write the approved topic file using a stable kebab-case slug.
3. Add or update exactly one matching index entry.
4. Keep the index introduction clear that the collection is general business knowledge, not implementation documentation.
5. When repairing the collection, ask about each content change one at a time and apply only approved repairs.

### 5. Find or review existing knowledge

- For a find request, read the index first, then open the linked full topic files needed to answer the request. Do not edit.
- For a review request, report factual, audience, terminology, scope, link, and index problems first. Ask for approval before repairs.
- Treat a conflict between code and a domain document as a discrepancy to resolve with the user, not as permission to rewrite the document.

### 6. Validate the result

Before finishing, verify:

- Every topic file is focused on one topic and linked from `docs/domain.md`.
- Every index link resolves to an existing file, with no duplicate topic entries.
- Each index summary is one sentence and no more than 25 words.
- Required sections exist and optional sections are non-empty when present.
- The content contains no implementation details, prohibited sensitive data, unresolved questions, or unconfirmed business claims.
- The index and topic file use consistent canonical terminology and plain language.

## Edge cases

- If `docs/domain.md` is missing, create its introduction and first entry together with the first approved topic.
- If a likely domain document exists outside `docs/domain/`, mention it but do not move or rewrite it without an explicit migration request.
- If a requested topic is actually technical documentation, explain the boundary and direct it to the appropriate documentation location.
- If code, existing docs, and the user disagree, preserve no source automatically; present the conflict and ask the user to resolve it.

## Resources

This skill intentionally has no scripts, references, or assets. Its reliability comes from the explicit interview, approval gate, and structural validation checklist.

## Output rules

- Write only approved, general-purpose business knowledge.
- Prefer concrete language and examples over implementation vocabulary.
- Do not add a topic to the index until its facts are confirmed.
- Report the files changed and validation performed at the end of an editing session.
