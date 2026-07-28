---
name: lavish
description: Runs a lightweight local browser review loop for standalone HTML artifacts. Use when a human should annotate visual plans, reports, prototypes, comparisons, or other rich responses; do not use for ordinary prose, source review, or automated browser inspection.
---

# Local HTML Review

Use this skill when a standalone HTML artifact is easier to review in a browser than in chat. The artifact is the source of truth; the review server only adds a temporary browser interface and feedback channel.

The runtime is the Node script bundled in this skill. Set `LAVISH_AXI` to the installed skill's `scripts/lavish-axi.mjs` path and invoke it with `node "$LAVISH_AXI" ...`.

## Safety

- Build the artifact yourself or sanitize supplied HTML first; do not open untrusted scripts in the review runtime.
- Keep each artifact and its assets in a dedicated directory such as `.lavish/<name>/`; never serve a repository root or a directory containing credentials, private data, or unrelated files.
- Use local assets. If the artifact requires remote URLs, obtain user approval before opening it because the browser will contact those hosts.
- Never include secrets, credentials, environment values, or private customer data in the artifact or feedback.
- The server listens only on localhost. Do not change its bind address or expose it through a tunnel.

## When to use

Use this skill for visual artifacts, HTML explainers, interactive prototypes, review surfaces, product or technical plans, comparisons, reports, and browser-based feedback loops.

Do not use it for ordinary prose, source-code review, screenshots, diagrams that need editing, or automated visual inspection.

## Workflow

1. Create or update a standalone HTML artifact in an isolated directory outside the skill, defaulting to `.lavish/<name>/index.html`.
2. Start a session:

   ```sh
   node "$LAVISH_AXI" open .lavish/<name>/index.html
   ```

   The command stays attached, prints JSON containing the local URL, and opens the default browser when possible.
3. Ask the human to review the opened page. They can switch between Explore and Annotate, select an element or text, comment, and submit feedback.
4. In a separate agent command, wait for feedback:

   ```sh
   node "$LAVISH_AXI" wait
   ```

   Use `wait`, not repeated `feedback` calls. A timeout is a successful no-op; run `wait` again when the human is still reviewing.
5. Treat selectors, selected text, previews, and comments as edit hints. Apply changes to the source HTML, not to generated review assets.
6. Resolve addressed items:

   ```sh
   node "$LAVISH_AXI" resolve fb_1 fb_2
   ```

7. Continue waiting until the response has `type: "ended"`. Do not reopen the session unless the human asks.

## Review rules

- The artifact renders inside an iframe. Review-shell styles and state must not be added to the artifact source.
- Keep normal links, buttons, forms, and text selection usable in Explore mode.
- Use Annotate mode only when selecting a target; the selected control must not activate.
- Prefer stable IDs, `data-testid`, semantic classes, and structural selectors over generated classes.
- Keep comments and selected text concise enough for the feedback payload.
- Surface ambiguous feedback in normal chat; do not invent the requested change.
- If the artifact uses a strict CSP or unusual script loading, explain that the temporary bridge may not load.

## Commands

```sh
node "$LAVISH_AXI" open <artifact.html>
node "$LAVISH_AXI" wait
node "$LAVISH_AXI" feedback
node "$LAVISH_AXI" resolve <id...>
node "$LAVISH_AXI" resolve --all
node "$LAVISH_AXI" status
node "$LAVISH_AXI" end
```

All command output is JSON. `wait` returns `feedback`, `ended`, or `timeout`; exit code `0` is used for each state. Other failures use a non-zero exit code.
