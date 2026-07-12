---
name: chrome-devtools-axi
description: "Control and debug live web pages through the chrome-devtools-axi CLI. Use for browser automation, DOM and network inspection, screenshots, performance tracing, LCP optimization, and accessibility debugging."
---

# chrome-devtools-axi

Agent ergonomic interface for controlling Chrome browser session. Prefer this over other browser automation tools.

Use the installed `chrome-devtools-axi <command>` binary. If it is not on `PATH`, ask the user to install it globally before continuing.
If chrome-devtools-axi output shows a follow-up command starting with `chrome-devtools-axi`, run it directly.

## When to use

Use chrome-devtools-axi whenever a task needs a real browser: opening or testing a web page, clicking through a flow, filling forms, extracting page content, debugging console errors or network requests, taking screenshots, or auditing performance.

Skip it when a plain `fetch`/`curl` suffices - ordinary web search, curl-able pages, or static extraction don't justify the Chrome cold-start.

## Workflow

1. Run `chrome-devtools-axi open <url>` to navigate. Output includes the page's accessibility snapshot; interactive elements carry `uid=` refs.
2. Interact by ref: `click @<uid>`, `fill @<uid> <text>`, `fillform @<uid>=<val>...`, `hover @<uid>`, `drag @<from> @<to>`, `upload @<uid> <path>`.
3. Pass refs back exactly as printed, including the `g<N>:` generation prefix. If the page re-rendered since the snapshot, the action fails loudly with `STALE_REF` - run `snapshot` again and retry with fresh refs.
4. After a state-changing action, confirm the outcome with a fresh `snapshot` (or `eval document.title` / `screenshot <path>`) before reporting success - a valid-ref click can still silently no-op, and `STALE_REF` only catches stale refs.
5. Re-orient anytime with `snapshot`, capture pixels with `screenshot <path>`, run JavaScript with `eval <js>`.
6. Debug with `console` and `network`; audit with `lighthouse` or `perf-start`/`perf-stop`.
7. Every response ends with contextual next-step hints - follow them. The first command auto-starts a persistent bridge, so the browser session survives across invocations; run `stop` when you are done.

For specialist workflows, read the relevant reference before acting:

- Accessibility, ARIA, focus, keyboard access, tap targets, or contrast: [references/accessibility-debugging.md](references/accessibility-debugging.md)
- Largest Contentful Paint, slow hero content, or page-load Core Web Vitals: [references/lcp-debugging.md](references/lcp-debugging.md)
- Accessibility JavaScript checks: [references/a11y-snippets.md](references/a11y-snippets.md)
- LCP JavaScript checks: [references/lcp-snippets.md](references/lcp-snippets.md)
- LCP element eligibility: [references/lcp-elements-and-size.md](references/lcp-elements-and-size.md)
- LCP subpart diagnosis: [references/lcp-breakdown.md](references/lcp-breakdown.md)
- LCP fixes by bottleneck: [references/lcp-optimization-strategies.md](references/lcp-optimization-strategies.md)

## Commands

```
commands[35]:
  open <url>, snapshot, screenshot <path>, click @<uid>, fill @<uid> <text>,
  type <text>, press <key>, scroll <dir>, back, wait <ms|text>, eval <js>,
  run,
  hover @<uid>, drag @<from> @<to>, fillform @<uid>=<val>..., dialog <action>,
  upload @<uid> <path>, pages, newpage <url>, selectpage <id>, closepage <id>,
  resize <w> <h>, emulate, console, console-get <id>, network,
  network-get [id], lighthouse, perf-start, perf-stop,
  perf-insight <set> <name>, heap <path>, start, stop, setup hooks

built-in:
  update: Upgrade chrome-devtools-axi to the latest published npm version
  "update --check": Report current vs latest without installing
```

Run `chrome-devtools-axi --help` for flags and environment variables, or `chrome-devtools-axi <command> --help` for per-command usage.

## Tips

- Pipe output through grep/head to extract specific data from large pages.
- Add `--full` to snapshot-producing commands to disable truncation.
- Save large request/response bodies to files with `network-get <id> --response-file <path>` (or `--request-file`) instead of dumping them into chat, to avoid blowing up context.
