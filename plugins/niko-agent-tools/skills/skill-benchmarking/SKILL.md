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
- For every controlled pair, keep the task prompt, harness instructions, available skill descriptions, repository context, model, and run settings identical except for the variable named in advance.

## Inputs and outputs

Inputs:

- The canonical skill directory and exact `SKILL.md` under test.
- Three to five natural-language tasks covering normal, hard, and edge behavior.
- A rubric of observable criteria defined before running the model.
- A routing probe set: one clear positive, two or three near-miss neighboring prompts, and an explicit-invocation control, each with expected skill selection or expected no-skill behavior declared in advance.

Outputs:

- Raw baseline and treatment responses kept outside the repository.
- Separate routing results (correct activation, correct non-activation, missed selection, or incorrect activation) and post-loading execution-quality results.
- Per-run criterion scores, mean score, full-pass count, and response length.
- A decision: retain, shorten, revise, or defer; cite the failing or improved behavior.

## Workflow

1. **Scope the contract.** Read the skill and extract its trigger, promised behavior, guardrails, and validation requirements. Turn these into binary observable criteria. Include at least one hard or adversarial execution task; do not copy the rubric into the user prompt. Separately predeclare expected routing for each selection probe.
2. **Benchmark execution after loading.** Run each task with a neutral system prompt and no skill text (**baseline**), then with the same prompt plus the exact current skill (**treatment**). This measures whether the skill helps once loaded, not whether the harness selects it. Use the same current model and repository context. Avoid requiring skill-specific headings or JSON fields unless that format is itself the contract.
3. **Probe selection separately.** Use one clear positive prompt, two or three plausible near-miss prompts for neighboring skills, and an explicit invocation control. Exercise normal inherited harness instructions and the target plus neighboring skill descriptions where the runtime permits. Record observable selection as **correct activation**, **correct non-activation**, **missed selection**, or **incorrect activation**, separately from execution quality. When both are meaningful, run neutral and full inherited-harness context conditions separately; do not require a redundant neutral routing run from a runtime that cannot represent one. Within each condition, keep context identical and name the current-versus-candidate description as the controlled variable. If the runtime exposes only model responses rather than actual routing, label this a **description-only probe proxy** and never report it as real selection or invocation.
4. **Repeat controlled pairs.** Run three to five repetitions per execution variant and routing condition because model output is stochastic. Record the prompt, model identifier, condition, variant, response, expected and observed selection when available, score, and response length. If a structured-output wrapper changes the behavior being measured, rerun with plain text and mark the earlier run as a confound.
5. **Score behavior.** Score each execution criterion independently for every run, and report mean score and full-pass count per variant. Summarize correct activation, correct non-activation, missed selection, and incorrect activation separately. Treat output length as token-cost evidence, never as a quality score. A skill is useful when it prevents a demonstrated failure or materially improves consistency, not merely when it makes prose longer; good execution after loading does not establish correct selection.
6. **Ablate candidates.** Compare the current skill with one compact candidate on the same tasks and repetitions. Remove duplicated explanation before removing operational steps. Never ablate secret handling, authorization, validation, accessibility, data-loss, or other safety guardrails. Keep a candidate only when quality does not regress on hard cases and its prompt cost falls.
7. **Smoke-test the edit.** After changing a skill, rerun at least two execution probes against the edited text, including the case that motivated the change. Recheck the positive, neighboring near-miss, and explicit-invocation routing probes when real routing or its labeled proxy is available. Re-read outputs for safety and accidental scope changes before declaring the reduction successful.
8. **Validate the repository.** Follow repository instructions. For this marketplace, run the available skill linters, bump the affected plugin with `node scripts/bump-version.mjs <plugin> <patch|minor|major>`, validate changed plugins and JSON, run required tests, and run `git diff --check` before committing.

## Edge cases

- **No model access:** prepare the execution task matrix, routing probes, and rubrics; mark execution as skipped and do not infer a result.
- **No routing runtime:** skip the real-selection portion. Run a description-only proxy if model access permits, label it explicitly, and continue reachable execution checks.
- **Neighbor descriptions unavailable:** record that full-context routing was skipped; do not substitute a neutral condition or compare the two as equivalent.
- **Both execution variants pass:** the task is not discriminating; add a harder case instead of deleting the skill.
- **Baseline fails for missing context:** provide the same minimal repository context to both variants, then rerun.
- **Treatment follows the harness schema instead of the skill:** simplify the wrapper and score the skill's actual output behavior.
- **Results conflict across runs:** increase repetitions or add a targeted task; do not average away a safety regression.

## Output rules

Report:

1. Model, runtime capabilities, and run count.
2. Execution tasks and predeclared quality criteria.
3. Routing probes, expected selections, context condition, and whether observations came from real routing or a description-only proxy.
4. Baseline versus treatment execution scores and response-cost comparison.
5. Correct-activation, correct-non-activation, missed-selection, and incorrect-activation counts, reported separately from execution quality.
6. The smallest evidence-backed edit or an explicit retain/defer decision.
7. Commands and checks that verified any repository change.

Do not present a benchmark as statistically conclusive. It is a decision aid for this model, task set, and repository context.
