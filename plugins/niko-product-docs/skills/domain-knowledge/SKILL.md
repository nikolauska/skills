---
name: domain-knowledge
description: >
  Builds and maintains a code-informed business handbook in `docs/domain/` with a `docs/domain.md` index.
  Use when discovering, documenting, reviewing, finding, or synchronizing business and product knowledge,
  including customer needs, product behavior, workflows, rules, value, improvement opportunities, positioning,
  or customer-safe explanations; do not use for code, API, architecture, or implementation documentation.
---

# Domain Knowledge

## Objective

- Explain what the business or product is, how it works for customers, why it matters, and where it can improve.
- Maintain confirmed, plain-language knowledge shared by product, sales, marketing, support, and engineering.
- Derive current product behavior from the repository before asking people to restate what the code already shows.

## Safety and constraints

- Never read `.env` files or include secrets, credentials, private keys, personal data, or customer-sensitive data.
- Read implementation details as evidence, but keep code identifiers, APIs, databases, architecture, deployment details, and internal workarounds out of domain documents.
- Treat code and tests as evidence of current observable behavior, not business intent, rationale, customer value, or sales claims.
- Publish only code-confirmed behavior or claims confirmed by the user or a domain expert. Keep unresolved questions and proposed interpretations out of the handbook.
- Do not browse the web or call external systems unless the user explicitly requests it.
- Manage only `docs/domain.md` and Markdown files under `docs/domain/`. Do not modify `CONTEXT.md`, `docs/adr/`, or migrate legacy documents unless explicitly asked.
- Show changed document drafts and obtain approval before writing them.

## Inputs and outputs

- Read relevant source, tests, existing domain documents, and human-facing project documentation.
- Maintain `docs/domain.md` as a concise, optionally grouped map of the handbook.
- Create or update coherent, kebab-case topic files under `docs/domain/`; choose file boundaries by reader need rather than a fixed taxonomy.
- For analysis or review requests, report coverage, contradictions, gaps, and proposed improvements without editing unless asked.

## Workflow

### 1. Discover from the repository

Before asking business questions:

1. Read the existing domain index, relevant topic files, and human-facing documentation.
2. Search the repository for the relevant concepts and terminology.
3. Trace the applicable behavior end to end through entrypoints, callers, rules, state transitions, tests, and customer-visible outcomes.
4. Build an evidence map separating:
   - current behavior supported by code or tests;
   - business meaning already confirmed by domain documentation;
   - conflicts, missing meaning, and claims that still need confirmation.
5. Summarize what is established and what remains unknown. Do not ask the user to repeat facts the repository already establishes.

Scale exploration to the request: inspect the relevant flow thoroughly, not every unrelated file in the repository.

### 2. Fill the important gaps

- Ask only questions that materially affect business meaning, boundaries, value, improvement, or customer communication.
- Ask questions sequentially when one answer determines the next; otherwise use a small, related batch.
- Confirm intent, rationale, canonical terminology, customer needs, value, positioning, proof, and sales claims with the user or a domain expert.
- Challenge vague terms and test rules with concrete scenarios.
- When sources disagree, present the evidence and ask which business meaning is correct. Never silently choose a source.
- Keep unknowns in the conversation or review report until resolved.

### 3. Model the business adaptively

Use only the lenses that help readers understand the subject:

- identity, purpose, scope, and terminology;
- customers, users, stakeholders, needs, and desired outcomes;
- concepts, actors, relationships, incentives, and value exchange;
- customer-visible capabilities, workflows, lifecycle, states, rules, boundaries, and exceptions;
- business model, value drivers, success measures, limitations, and risks;
- positioning, alternatives, differentiation, proof points, objections, and customer-safe explanations;
- pain points and approved improvement opportunities;
- concrete scenarios and related knowledge.

Every topic needs a clear title and short plain-language overview. Add other sections only when they improve understanding; never add empty or irrelevant sections.

Distinguish the current state from approved opportunities or future intent. Do not present a proposal as existing behavior.

### 4. Draft and approve

1. Draft complete changed topic files in language suitable for internal business readers.
2. Include reusable customer messaging only when its claims are confirmed and safe to share externally.
3. Draft the matching `docs/domain.md` navigation changes with concise descriptions and grouped links when grouping helps discovery.
4. Show the drafts and clearly identify behavior confirmed from code, human-confirmed meaning, and any excluded unresolved questions.
5. Obtain approval before writing the changed handbook files.

### 5. Write and synchronize

1. Create `docs/domain/` and `docs/domain.md` lazily when the first approved document requires them.
2. Write only the approved documents.
3. Add, update, regroup, or remove index entries so every handbook file remains discoverable and accurately described.
4. Preserve unrelated confirmed content during updates.

### 6. Find, explain, or review

- For a find or explanation request, read the index, relevant topic files, and supporting implementation when current behavior matters. Do not edit.
- For a review, compare the handbook with relevant code and tests, then report stale behavior, factual gaps, contradictions, weak explanations, unsupported claims, and improvement opportunities.
- For positioning or sales help, derive candidate explanations from confirmed knowledge, label them as proposals, and request confirmation before adding them to the handbook.

### 7. Validate

Before finishing, verify:

- Every handbook file is linked from `docs/domain.md`, every link resolves, and no entry is duplicated or stale.
- File boundaries and sections fit the subject instead of following an arbitrary template.
- Current behavior, approved opportunities, and future intent are clearly distinguished.
- Customer messaging has confirmed support and does not overstate value, proof, differentiation, or capability.
- Terminology is consistent and the content is understandable without implementation knowledge.
- No prohibited implementation details, sensitive data, or unresolved claims were published.

## Edge cases

- If the collection is missing, propose the smallest useful first document and index entry after discovery.
- If relevant knowledge exists elsewhere, use it as evidence but do not migrate it without an explicit request.
- If repository behavior cannot be determined confidently, explain the gap and ask rather than guessing.
- If a topic is primarily technical, keep only its customer-visible business behavior here and direct implementation details to technical documentation.
- If the requested improvement or sales claim is not established, report it as a proposal outside the handbook until confirmed.

## Output rules

- Lead with the discovered business understanding, not the exploration process.
- Prefer concrete behavior, outcomes, rules, and examples over slogans or implementation vocabulary.
- Report changed files, confirmations still needed, and validation performed at the end of an editing session.
