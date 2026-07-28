---
name: grill-with-docs
description: >
  Grills plans against code and established domain knowledge, sharpens terminology, and records confirmed
  new product functionality through `$domain-knowledge`. Use when the user wants to stress-test a plan against
  the project's language, behavior, and business rules; do not use for standalone handbook work, general reviews,
  or purely technical plans.
---

# Grill with Docs

## Objective

- Challenge a plan until its product behavior, terminology, boundaries, and unresolved decisions are clear.
- Use `$domain-knowledge` as the sole workflow for documenting confirmed new functionality.
- Keep implementation decisions in the plan, not in the business handbook.

## Workflow

### 1. Ground the discussion

- Follow `$domain-knowledge` to inspect the existing handbook, relevant human-facing documentation, code, and tests.
- Separate current behavior, confirmed business meaning, planned functionality, and unresolved questions.
- Answer discoverable questions from the repository instead of asking the user.

### 2. Grill the plan

- Ask one question at a time and wait for the answer before continuing.
- Provide a recommended answer with each question.
- Resolve prerequisite decisions before dependent ones and continue until shared understanding is reached.
- Track unresolved decisions and their dependencies; record each outcome and mark deferred or unanswered decisions as blockers.
- Challenge terms that conflict with the handbook or code, and propose a precise canonical term for vague or overloaded language.
- Use concrete scenarios and edge cases to test rules, relationships, and boundaries.
- Surface contradictions between the proposed behavior, documented domain knowledge, and current code.

### 3. Record confirmed functionality

- When new product functionality is resolved, follow `$domain-knowledge` to draft the smallest coherent `docs/domain/` topic and `docs/domain.md` index change.
- Mark planned functionality as approved future intent; never present it as current behavior.
- Document customer-visible behavior, business rules, terminology, value, and boundaries—not APIs, architecture, or implementation choices.
- Show the draft and obtain approval before writing. Keep unresolved claims in the conversation.
- If `$domain-knowledge` is unavailable, continue the grilling session and report that documentation was skipped; do not create a replacement documentation structure.

### 4. Finish

- Stop when the plan is decision-complete or the remaining decisions are explicitly identified as blockers.
- Summarize the resolved decisions, remaining unknowns, and any approved domain-document changes.

## Safety and constraints

- Follow `$domain-knowledge` safety, evidence, approval, and file-ownership rules.
- Never read secrets or credentials, and do not use external systems unless the user explicitly requests it.
- Do not create or update `CONTEXT.md`, `CONTEXT-MAP.md`, or ADRs.
