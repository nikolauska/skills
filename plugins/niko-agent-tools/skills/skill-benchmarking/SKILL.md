---
name: skill-benchmarking
description: Benchmarks an agent skill against the current model with repeated baseline and treatment tasks, observable rubrics, and instruction ablations. Use when deciding whether to remove, shorten, or revise any skill; do not use for a wording-only review without model outputs.
---

# Skill Benchmarking

Measure whether a skill changes observable model behavior before changing its instructions.

## Guardrails

- Never read secrets or include credentials, private data, production payloads, or customer data in benchmark prompts or saved outputs.
- Do not contact production or external services, mutate repositories, install model clients, or download dependencies for a benchmark without explicit authorization.
- Keep raw outputs outside the repository unless the user explicitly requests fixtures or reports in version control.
- Do not claim that an instruction is unnecessary from one easy prompt or one model run.
- Keep baseline and treatment prompts, model, repository context, and run settings identical except for the skill text.

## Inputs and outputs

Inputs:

- The canonical skill directory and exact `SKILL.md` under test.
- Three to five natural-language tasks covering normal, hard, and edge behavior.
- A rubric of observable criteria defined before running the model.

Outputs:

- Raw baseline and treatment responses kept outside the repository.
- Per-run criterion scores, mean score, full-pass count, and response length.
- A decision: retain, shorten, revise, or defer; cite the failing or improved behavior.

## Workflow

1. **Scope the contract.** Read the skill and extract its trigger, promised behavior, guardrails, and validation requirements. Turn these into binary observable criteria. Include at least one hard or adversarial task; do not copy the rubric into the user prompt.
2. **Build paired variants.** Run each task with a neutral system prompt and no skill (**baseline**), then with the same prompt plus the exact current skill (**treatment**). Use the same current model and repository context. Avoid requiring skill-specific headings or JSON fields unless that format is itself the contract.
3. **Repeat.** Run three to five repetitions per variant because model output is stochastic. Record the prompt, model identifier, variant, response, score, and response length. If a structured-output wrapper changes the behavior being measured, rerun with plain text and mark the earlier run as a confound.
4. **Score behavior.** Score each criterion independently for every run. Report mean score and full-pass count per variant. Treat output length as token-cost evidence, never as a quality score. A skill is useful when it prevents a demonstrated failure or materially improves consistency, not merely when it makes prose longer.
5. **Ablate candidates.** Compare the current skill with one compact candidate on the same tasks and repetitions. Remove duplicated explanation before removing operational steps. Never ablate secret handling, authorization, validation, accessibility, data-loss, or other safety guardrails. Keep a candidate only when quality does not regress on hard cases and its prompt cost falls.
6. **Smoke-test the edit.** After changing a skill, rerun at least two probes against the edited text, including the case that motivated the change. Re-read the output for trigger correctness, safety, and accidental scope changes before declaring the reduction successful.
7. **Validate the repository.** Follow repository instructions. For this marketplace, run the available skill linters, bump the affected plugin with `node scripts/bump-version.mjs <plugin> <patch|minor|major>`, validate changed plugins and JSON, run required tests, and run `git diff --check` before committing.

## Edge cases

- **No model access:** prepare the task matrix and rubric, mark execution as skipped, and do not infer a result.
- **Both variants pass:** the task is not discriminating; add a harder case instead of deleting the skill.
- **Baseline fails for missing context:** provide the same minimal repository context to both variants, then rerun.
- **Treatment follows the harness schema instead of the skill:** simplify the wrapper and score the skill's actual output behavior.
- **Results conflict across runs:** increase repetitions or add a targeted task; do not average away a safety regression.

## Output rules

Report:

1. Model and run count.
2. Tasks and predeclared criteria.
3. Baseline versus treatment scores and response-cost comparison.
4. The smallest evidence-backed edit or an explicit retain/defer decision.
5. Commands and checks that verified any repository change.

Do not present a benchmark as statistically conclusive. It is a decision aid for this model, task set, and repository context.
