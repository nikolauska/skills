# Discovery and optional integrations

For a stateful CLI, a no-argument invocation can show concise live, workspace-relevant content and a useful next command instead of only a usage manual. For other CLIs, choose the no-argument behavior that best helps users discover the available operation. Keep explicit help available regardless.

An installable agent skill can provide on-demand discovery without adding context to every session. Keep its trigger specific and its instructions static; do not embed transient state. Offer it only when distribution to an agent host is in scope.

Session hooks or plugins are optional, not a default requirement. Consider them only when the user's task calls for ambient context and the target host actually supports the proposed mechanism. Install or modify host configuration only through explicit user consent and an opt-in setup action, never as a side effect of normal CLI use. Keep injected state brief, relevant to the current workspace, and sourced from live data. Collect only the minimum metadata explicitly authorized; do not capture transcripts, secrets, or file contents without separate informed consent and a retention policy. Make repeated setup safe and provide a clear way to remove the integration. Verify host-specific installation details against current documentation rather than assuming paths or hook capabilities.
