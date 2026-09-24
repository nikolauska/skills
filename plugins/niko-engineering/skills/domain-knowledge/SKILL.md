---
name: domain-knowledge
description: >
  Discover, find, review, or edit the code-informed product handbook, and stress-test product plans
  against the handbook and code. Use for customer-visible behavior, business rules, terminology,
  value, positioning, and proposed product changes; not for implementation documentation or purely technical plans.
---

# Domain Knowledge

## Ground claims

Read the relevant `docs/domain.md` entries, topic files, human-facing documentation, code, and tests. Trace only the flows needed to establish customer-visible behavior. Separate code-supported current behavior, human-confirmed business meaning, approved functionality awaiting implementation, and unresolved claims while investigating. Code and tests do not establish intent, value, or sales claims. Resolve discoverable facts from the repository before asking product questions; present conflicting evidence rather than guessing.

Never read secrets, credentials, `.env` files, personal data, or customer-sensitive data. Do not browse or contact external systems unless explicitly requested. Local history is useful only when a boundary or rationale is contested or relevant behavior was reversed: inspect pertinent commits, distinguish recorded decisions from inferred rationale, and confirm inferred plan constraints with the user.

## Find, review, and edit the handbook

For a find or explanation request, use the index and relevant topics; consult code when current behavior matters. For review, compare relevant handbook claims with code and tests and report stale behavior, contradictions, unsupported claims, gaps, and useful improvements without editing unless asked.

For edits, draft the smallest coherent, plain-language topic changes and matching `docs/domain.md` navigation. Cover customer-visible behavior, rules, boundaries, needs, value, or safe explanations only where evidence supports them. Confirm business intent, positioning, and customer-facing claims with the user or a domain expert; leave unresolved interpretations out. When approved functionality is being documented for implementation, write it as current behavior in the present tense so the handbook ships with the implementation. Show complete changed drafts and obtain approval before writing. Then write only approved Markdown under `docs/domain/` and `docs/domain.md`; keep every topic discoverable and preserve unrelated confirmed content. Keep code identifiers, APIs, architecture, databases, deployment, and internal workarounds out of customer-facing documents.

## Stress-test a product plan

Compare proposed behavior and terminology with the handbook and current code. Challenge contradictions and vague terms using concrete scenarios, boundaries, and edge cases. Ask only questions that affect product decisions, with a recommended answer; resolve prerequisites before dependent choices. Record agreed decisions and explicitly identify deferred or unanswered blockers. Keep implementation choices in the plan, not the handbook. Once the user approves new functionality and implementation is next, draft its handbook changes as current product behavior under the handbook workflow; show the draft and obtain approval before writing.
