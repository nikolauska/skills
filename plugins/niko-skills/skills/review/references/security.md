# Security

Check for exploitable failures at trust boundaries. The categories below identify where attack paths hide; they are not a checklist to sweep without evidence.

## Inspect

- Authentication, authorization, session boundaries, endpoint exposure, and listener defaults.
- Transport security, sensitive payload handling, secret sourcing, redaction, and persistence.
- File path boundaries, traversal, shell or command execution, query parameterization, dynamic-operation allowlists, and destructive-operation guards.
- Schema validation, malformed or oversized payloads, replay, flooding, timeout, retry, cancellation, and unbounded work, logs, or memory.
- Secrets exposed through logs, errors, traces, fixtures, or private context.
- Insecure defaults, broad bypasses, unsafe opt-outs, and dependency risks supported by repository or explicitly authorized vulnerability evidence.

## Evidence threshold

Map who can reach the path and classify it as local-only, authenticated, remote-accessible, or privileged. Report only a concrete attack path, trust-boundary failure, or unsafe default with plausible confidentiality, integrity, availability, privilege, or data-loss impact.

For each finding, include **attacker or actor -> reachable path -> impact** and one targeted test idea. Set severity from both reachability and impact.

## Reject

- Fear-driven recommendations without a reachable abuse path.
- Hypothetical deployment models treated as current vulnerabilities.
- Policy-heavy rewrites instead of minimal hardening.
