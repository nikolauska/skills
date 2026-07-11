---
name: a11y-debugging
description: Uses browser accessibility tooling to debug semantic HTML, accessible names, focus order, keyboard access, tap targets, and contrast issues on live pages. Use when inspecting rendered UI behavior in a browser, not for static code review alone.
---

# Accessibility Debugging

## Use When

- The task requires checking a rendered page with browser tooling.
- The user mentions semantics, ARIA, labels, focus, keyboard navigation, tap targets, or contrast.
- You need evidence from the accessibility tree, native browser issues, or Lighthouse.

## Do Not Use When

- The request is only about source-code review without a running page.
- The task is primarily visual design critique rather than accessibility behavior.
- The task requires formal compliance certification; provide findings, not legal/compliance claims.

## Inputs

- A URL, route, or reproducible browser state to inspect.
- Optional target scope: specific component, dialog, form, page section, or regression report.

## Safety And Constraints

- Prefer browser-local inspection. Do not browse external documentation unless the user asks for it or the task is blocked without it.
- Do not sign in, submit destructive forms, change production data, or trigger irreversible actions unless the user explicitly asks.
- Do not claim WCAG compliance from screenshots alone.
- If a check depends on JS evaluation, use small read-only snippets and report limitations.

## Workflow

### 1. Establish Scope

1. Confirm the target page or interaction to test.
2. If the page is not already open, navigate to it.
3. Note whether the task is page-wide or limited to a component such as a modal or form.

### 2. Capture A Baseline

1. Run a Lighthouse accessibility audit first when the issue may be page-wide or unknown.
2. Use `mode: "navigation"` when page-load issues matter; use `mode: "snapshot"` for the current state.
3. Save the report to disk if the audit is large, then extract only failing audits with a local JSON filter. Do not paste the full report into context.
4. Record the score and the failing audit titles before drilling into individual elements.

### 3. Check Native Browser Issues

1. Call `list_console_messages` with `types: ["issue"]`.
2. Use `includePreservedMessages: true` when load-time issues may matter.
3. Treat browser-reported missing labels, invalid ARIA, and contrast warnings as high-signal starting points.

### 4. Inspect The Accessibility Tree

1. Call `take_snapshot`; treat that output as the source of truth for what assistive tech can reach.
2. Check semantic landmarks, heading order, accessible names, and whether the expected controls appear at all.
3. If visual order may differ from reading order, compare the snapshot with `take_screenshot`.

### 5. Run Targeted Checks

- Forms and labels:
  Use the "Find Orphaned Form Inputs" snippet in [references/a11y-snippets.md](references/a11y-snippets.md). Report each unlabeled control with enough page context to locate it.
- Interactive names:
  Verify buttons, links, toggles, and icon-only controls have stable accessible names in the snapshot.
- Keyboard flow:
  Use `press_key` with `Tab` and `Shift+Tab`, then re-run `take_snapshot` to confirm focus order and modal focus trapping.
- Tap targets:
  Use the "Measure Tap Target Size" snippet from [references/a11y-snippets.md](references/a11y-snippets.md) on the target element `uid`. Compare the measured size against the 48x48 px guidance.
- Contrast:
  Check browser issues first. If needed, run the "Check Color Contrast" snippet from [references/a11y-snippets.md](references/a11y-snippets.md) and state that it is an approximation.
- Global page checks:
  Run the "Global Page Checks" snippet from [references/a11y-snippets.md](references/a11y-snippets.md) for `lang`, `title`, viewport, and reduced-motion signals.

### 6. Validate Fixes Or Reproduce The Failure Loop

1. After a change or when verifying an existing bug, rerun the smallest relevant subset:
   Lighthouse or browser issues for page-level problems; snapshot plus keyboard steps for component issues.
2. Stop when the original failure is either reproduced with evidence or no longer appears in the rerun checks.

### 7. Report Findings

For each issue, include:

- What failed.
- Evidence source: Lighthouse, browser issue, snapshot, keyboard step, or JS snippet.
- Exact element or UI context.
- Why it matters to users.
- Recommended fix, plus any uncertainty.

## Notes

- `take_snapshot` exposes the accessibility tree, not the raw DOM. Hidden DOM nodes may be absent there even if they still exist in markup.
- If you must consult web.dev guidance, the `.md.txt` variant can reduce noise, but only fetch external docs when needed for the task.
