---
name: skill-benchmarking
description: Measures whether a skill improves observable model behavior or compares substantive skill revisions. Use for evidence-backed skill decisions, not routine writing, refactoring, or wording-only reviews.
---

# Skill Benchmarking

Compare behavior when the value of a skill or a substantive revision is uncertain. A benchmark informs a retain, revise, shorten, or defer decision; it does not require editing files.

## Compare fairly

- Choose representative tasks, including a hard case likely to expose the behavior in question. Declare observable success and safety criteria before seeing outputs; avoid scoring compliance with incidental headings or verbosity.
- Run paired conditions with the same task, model, harness, repository context, and settings. Change only the named variable: no skill versus the exact skill for post-load value, or current versus candidate text for a revision. Give both conditions the same necessary context.
- If selection matters and real routing is available, assess activation and false activation separately from quality after loading. A description-only selection probe is a proxy, not evidence of real routing. Skip routing when irrelevant or unavailable.
- Repeat pairs or add harder tasks when outcomes are noisy or nondiscriminating; no fixed task or repetition count establishes certainty. Do not dismiss a skill because both conditions pass one easy task, and do not average away a safety regression.
- Record the prompts, variants, model/context, criteria, observed outputs, and relevant uncertainty. Compare observable failures and improvements; response length is cost evidence, not quality. Report an evidence-backed decision and limitations, not statistical certainty from small samples.

## Boundaries

Never use secrets, credentials, private or customer data, or production payloads. Do not contact external or production services, mutate repositories, install clients, or download dependencies without explicit authorization. Keep raw outputs outside the repository unless requested. Never remove safety, authorization, validation, accessibility, or data-loss safeguards merely to make a candidate shorter.

If model access is unavailable, outline the proposed comparison and criteria, state that it was not run, and do not claim a behavioral result.
