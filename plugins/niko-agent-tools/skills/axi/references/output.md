# Output and command behavior

Design for the agent's next decision, not a dump of backend data. Keep lists concise (identifiers and decision-making fields); put long content in detail views. Preview long fields when useful, mark truncation clearly, and give an explicit command or flag to retrieve the complete value. Expose optional fields or full detail on demand. Include cheaply available totals or summaries when they avoid otherwise necessary follow-up calls; distinguish a page count from the overall count. State empty results explicitly with their scope so success cannot be confused with missing output.

Return actionable, structured errors in the CLI's established machine-readable output channel and format; translate dependency failures without exposing raw responses, credentials, environment values, or stack traces. Keep progress and diagnostics off machine-readable stdout. Fail promptly rather than prompting for missing inputs: every operation must be possible non-interactively. Use stable exit semantics that distinguish success, usage errors, and failed operations; an already-satisfied idempotent request is success.

Provide concise subcommand help with required arguments and available flags. Suggest relevant next commands when they genuinely help, carrying forward necessary scope and using placeholders for unknown values. If a result is truncated or paginated, explain how to see the rest. Avoid unnecessary suggestions after a complete answer.

For a newly designed AXI, prefer TOON at the output boundary when an encoder is already installed, keeping internal data handling independent of presentation. Preserve an existing CLI's wire format unless migration is explicitly requested; never install an encoder or write a substitute implicitly.
