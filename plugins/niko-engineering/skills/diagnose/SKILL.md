---
name: diagnose
description: Diagnoses hard bugs and performance regressions through reproducible evidence, ranked hypotheses, and targeted instrumentation. Use when a user asks to diagnose or debug broken, failing, throwing, flaky, or regressed behavior; do not use when the root cause is already established and only implementation is requested.
---

# Diagnose

Build evidence before explaining a hard bug. Skip a phase only with an explicit reason.

## Guardrails

- Never read credential files or retain secrets, personal data, or production payloads in fixtures, logs, or traces; sanitize captured artifacts first.
- Do not contact external or production systems, add production instrumentation, or mutate production data without explicit authorization.
- Do not install missing browsers, profilers, fuzzers, or test dependencies implicitly; report the unavailable check.
- Diagnosis alone is read-only. Apply a fix only when the user requested implementation or authorized it after the root cause is established.

## Workflow

1. **Build a feedback loop.** Prefer a failing test. Otherwise use a local HTTP/CLI harness, sanitized trace replay, throwaway harness, property loop, bisection, or differential run. Make it deterministic, isolated, and sharp: assert the user-visible symptom, pin time and randomness, and avoid network access.
2. **Reproduce.** Confirm the loop shows the reported failure, capture the exact symptom, and repeat it. For flaky bugs, raise the reproduction rate until it is useful. If no loop can be built, stop; report what was tried and request a safe artifact, a reproducible environment, or authorized temporary instrumentation.
3. **Hypothesize.** Before probing, write 3–5 ranked, falsifiable hypotheses. For each, state the observation that would support or reject it. Show the list to the user, but continue if they are unavailable.
4. **Instrument one prediction at a time.** Prefer a debugger or REPL, then targeted boundary logs. Tag temporary logs with a unique prefix and remove them. For performance regressions, measure a baseline before changing code.
5. **Fix only when authorized.** Add a regression test at the correct seam, watch it fail for the intended reason, make the smallest fix, then rerun both the minimized loop and the original scenario. If no correct seam exists, document that limitation.
6. **Clean up.** Remove tagged instrumentation and throwaway artifacts. State the confirmed cause, evidence, and checks. Static evidence may suggest a cause, but never claim certainty without reproduction.
