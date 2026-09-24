---
name: diagnose
description: Diagnoses hard, flaky, or regressed behavior through reproducible evidence and targeted probes. Use when the cause of a bug or performance regression is unknown; not when only an established fix is requested.
---

# Diagnose

Establish the failure before claiming its cause.

## Guardrails

- Never read credential files or retain secrets, personal data, or production payloads in fixtures, logs, or traces; sanitize captured artifacts first.
- Do not contact external or production systems, add production instrumentation, or mutate production data without explicit authorization.
- Do not install missing browsers, profilers, fuzzers, or test dependencies implicitly; report the unavailable check.
- Diagnosis alone is read-only. Apply a fix only when the user requested implementation or authorized it after the root cause is established.

## Investigation

- Build an isolated feedback loop that captures the user-visible symptom: a failing test, local harness, sanitized replay, differential run, or bisection. Control randomness and time where relevant; avoid network access. Reproduce and record the exact failure, repeating or improving the reproduction rate for flaky cases. If reproduction is unavailable, report attempts and request a safe artifact, environment, or authorization for temporary instrumentation; static evidence is not certainty.
- Form falsifiable hypotheses from the evidence and probe distinguishing predictions one at a time. Prefer a debugger or REPL to targeted temporary logs; measure a baseline for performance regressions.
- Only if fixing is authorized, add a regression test at the appropriate seam when feasible, confirm it fails for the intended reason, apply the smallest fix, and rerun the minimized loop and original scenario. Remove temporary instrumentation and artifacts. Report the cause supported by evidence, remaining uncertainty, and checks performed.
