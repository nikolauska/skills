---
name: chrome-devtools
description: 'Uses Chrome DevTools MCP to inspect and control live web pages for browser automation, DOM debugging, network analysis, screenshots, and performance tracing. Use when a task requires interacting with a real page or collecting browser evidence.'
license: MIT
---

# Chrome DevTools

Use this skill for real browser work:
- Open or switch tabs
- Inspect live DOM state
- Click, type, drag, upload, and submit forms
- Capture screenshots or accessibility snapshots
- Check console errors and network failures
- Record performance traces and analyze insights

Do not use this skill for:
- Static code review without a running page
- Simple HTTP requests that do not require a browser
- Accessibility-only audits when the dedicated `a11y-debugging` skill is the better fit

## Guardrails

- Treat the browser as stateful. Start by confirming which page is selected.
- Prefer `take_snapshot` over screenshots for element targeting.
- After navigation, reload, form submit, DOM mutation, or dialog handling, take a fresh snapshot before reusing `uid` values.
- Do not click destructive UI actions blindly. Verify the target in the latest snapshot first.
- Do not expose secrets from page content, storage, headers, cookies, or network payloads unless the user explicitly asks.
- Use screenshots as evidence, not discovery. A screenshot does not give stable element identifiers.

## Default Workflow

1. Establish page context.
   Use `list_pages`. If needed, use `select_page`. Use `new_page` only when no existing page should be reused.
2. Reach the state to inspect.
   Use `navigate_page`, `wait_for`, `press_key`, `fill`, or `click` as needed.
3. Inspect with a fresh snapshot.
   Use `take_snapshot` and identify the target `uid` from the current page state.
4. Interact with the latest `uid`.
   Use `click`, `fill`, `fill_form`, `hover`, `drag`, `press_key`, or `upload_file`.
5. Validate the result.
   Take another snapshot. If the outcome is visual, add `take_screenshot`. If the page misbehaves, inspect console and network next.

Stop when the requested browser evidence or interaction has been completed and verified.

## Patterns

### Browser Interaction

Use this for navigation, forms, and UI state changes.

1. `list_pages`
2. `select_page` or `new_page`
3. `navigate_page` or interact toward the target state
4. `take_snapshot`
5. Act on `uid` values from that snapshot
6. `take_snapshot` again to verify the changed state

If an action triggers a dialog, handle it with `handle_dialog`, then refresh the snapshot.

### Debugging A Broken Page

Use this when the page is not rendering, data is missing, or actions fail.

1. Reproduce the issue in the browser
2. `take_snapshot` to confirm actual DOM state
3. `list_console_messages`
4. `list_network_requests`
5. `get_console_message` or `get_network_request` for the failing entries
6. `evaluate_script` only for specific hypotheses that the snapshot, console, and network do not answer

Prefer this order: snapshot, console, network, targeted script evaluation.

### Performance Trace

Use this when the user asks why the page is slow or requests Core Web Vitals evidence.

1. Navigate to the page first
2. Start tracing with `performance_start_trace`
3. If you need page-load metrics, use `reload=true` or record a manual interaction during the trace
4. Stop the trace with `performance_stop_trace` unless `autoStop=true`
5. Run `performance_analyze_insight` on the reported insight set

Record only the flow needed to answer the question. Do not collect large traces without a clear target.

## Tool Selection Rules

- Use `take_snapshot` to find elements and verify structure.
- Use `take_screenshot` only when the user needs visual proof or layout details.
- Use `wait_for` for asynchronous UI states that expose visible text.
- Use `evaluate_script` for page-state inspection that other tools cannot expose directly.
- Use `resize_page` or `emulate` only when viewport, device, CPU, network, color scheme, or geolocation matters to the task.
- Use `list_network_requests` before `get_network_request`; use `list_console_messages` before `get_console_message`.

## Validation Checklist

- Correct page selected
- Target state reached
- Interaction used current `uid` values
- Result verified with a fresh snapshot or screenshot
- Console and network inspected when behavior did not match expectations
