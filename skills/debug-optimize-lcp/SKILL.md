---
name: debug-optimize-lcp
description: Guides debugging and optimizing Largest Contentful Paint (LCP) with Chrome DevTools MCP or equivalent browser performance tooling. Use when a user asks why a page's main image or text renders slowly, wants an LCP breakdown, or needs concrete fixes for slow hero content or page-load Core Web Vitals.
---

## Use / Do Not Use

Use when:
- The task is about LCP, hero image/text rendering speed, or "why does the main content appear late?"
- The agent can inspect a live page in a browser and collect trace or network evidence.
- The user wants concrete, prioritized fixes tied to the LCP subparts.

Do not use when:
- The main problem is CLS, INP, backend profiling, or bundle-size work unrelated to above-the-fold render timing.
- There is no page URL or reproducible route to inspect. Ask for that first.
- The environment lacks browser tracing tools. Fall back to general guidance only and say evidence could not be collected.

## Safety / Constraints

- Prefer read-only investigation first. Do not change app code, server config, or production settings unless the user asks for fixes.
- Do not browse unrelated external sites or run external audits unless the user explicitly asks.
- If the page requires authentication, use the existing signed-in browser state when available. Do not brute-force login flows or use unknown credentials.
- Keep the test profile stable while comparing traces. Use the same URL, viewport/device, throttling, and cache assumptions before claiming improvement.

## What is LCP and why it matters

Largest Contentful Paint (LCP) measures how quickly a page's main content becomes visible. It's the time from navigation start until the largest image or text block renders in the viewport.

- **Good**: 2.5 seconds or less
- **Needs improvement**: 2.5–4.0 seconds
- **Poor**: greater than 4.0 seconds

LCP is a Core Web Vital that directly affects user experience and search ranking. On 73% of mobile pages, the LCP element is an image.

## LCP Subparts Breakdown

Every page's LCP breaks down into four sequential subparts with no gaps or overlaps. Understanding which subpart is the bottleneck is the key to effective optimization.

| Subpart                       | Ideal % of LCP | What it measures                               |
| ----------------------------- | -------------- | ---------------------------------------------- |
| **Time to First Byte (TTFB)** | ~40%           | Navigation start → first byte of HTML received |
| **Resource load delay**       | <10%           | TTFB → browser starts loading the LCP resource |
| **Resource load duration**    | ~40%           | Time to download the LCP resource              |
| **Element render delay**      | <10%           | LCP resource downloaded → LCP element rendered |

The "delay" subparts should be as close to zero as possible. If either delay subpart is large relative to the total LCP, that's the first place to optimize.

**Common Pitfall**: Optimizing one subpart (like compressing an image to reduce load duration) without checking others. If render delay is the real bottleneck, a smaller image won't help — the saved time just shifts to render delay.

## Debugging Workflow

Follow these steps in order. Each step builds on the previous one.

### Step 0: Confirm the Repro Case

Collect the exact URL or route, whether the issue is on desktop or mobile, and whether the page requires login.

- If the complaint is vague, ask for the specific page and which content is expected to be the LCP candidate.
- If browser tooling supports device emulation, pick one profile up front and keep using it for baseline and re-test.

### Step 1: Record a Performance Trace

Navigate to the page, then record a trace with reload to capture the full page load including LCP:

1. `navigate_page` to the target URL.
2. Optionally `emulate` the target device/network before tracing if the user reports a mobile or slow-device issue.
3. `performance_start_trace` with `reload: true` and `autoStop: true`.

The trace results will include LCP timing and available insight sets. Note the insight set IDs from the output — you'll need them in the next step.

### Step 2: Analyze LCP Insights

Use `performance_analyze_insight` to drill into LCP-specific insights. Look for these insight names in the trace results:

- **LCPBreakdown** — Shows the four LCP subparts with timing for each.
- **DocumentLatency** — Server response time issues affecting TTFB.
- **RenderBlocking** — Resources blocking the LCP element from rendering.
- **LCPDiscovery** — Whether the LCP resource was discoverable early.

Call `performance_analyze_insight` with the insight set ID and the insight name from the trace results.

If a specific insight is unavailable, continue with the rest of the workflow instead of stopping. The trace, network waterfall, and DOM inspection still provide enough evidence to localize the bottleneck.

### Step 3: Identify the LCP Element

Use `evaluate_script` with the **"Identify LCP Element" snippet** found in [references/lcp-snippets.md](references/lcp-snippets.md) to reveal the LCP element's tag, resource URL, and raw timing data.

The `url` field tells you what resource to look for in the network waterfall.

- If `url` is empty, the LCP is likely text-based or a CSS background image candidate.
- If the snippet reports no LCP entry, state that explicitly and rely on the trace plus visible above-the-fold candidates instead of guessing.

### Step 4: Check the Network Waterfall

Use `list_network_requests` to see when the LCP resource loaded relative to other resources:

- Call `list_network_requests` filtered by lowercase resource types such as `["image", "font", "stylesheet", "script"]` as needed for the suspected bottleneck.
- Then use `get_network_request` with the LCP resource's request ID for full details.

**Key Checks:**

- **Start Time**: Compare against the HTML document and the first resource. If the LCP resource starts much later than the first resource, there's resource load delay to eliminate.
- **Duration**: A large resource load duration suggests the file is too big or the server is slow.
- **Dependency chain**: If CSS or JS starts earlier but the LCP resource starts late, suspect hidden discovery through CSS, JS, or client rendering.

### Step 5: Inspect HTML for Common Issues

Use `evaluate_script` with the **"Audit Common Issues" snippet** found in [references/lcp-snippets.md](references/lcp-snippets.md) to check for lazy-loaded images in the viewport, missing fetchpriority, and render-blocking scripts.

If the likely LCP is text or a background image, also use [references/elements-and-size.md](references/elements-and-size.md) to sanity-check whether the candidate element type is eligible for LCP.

### Step 6: Map the Bottleneck to Fixes

Use the trace plus DOM/network evidence to assign the dominant subpart, then choose fixes from:
- [references/lcp-breakdown.md](references/lcp-breakdown.md) for diagnosing which subpart is actually large.
- [references/optimization-strategies.md](references/optimization-strategies.md) for concrete fixes matched to that bottleneck.

## Optimization Strategies

After identifying the bottleneck subpart, apply these prioritized fixes.

### 1. Eliminate Resource Load Delay (target: <10%)

The most common bottleneck. The LCP resource should start loading immediately.

- **Root Cause**: LCP image loaded via JS/CSS, `data-src` usage, or `loading="lazy"`.
- **Fix**: Use standard `<img>` with `src`. **Never** lazy-load the LCP image.
- **Fix**: Add `<link rel="preload" fetchpriority="high">` if the image isn't discoverable in HTML.
- **Fix**: Add `fetchpriority="high"` to the LCP `<img>` tag.

### 2. Eliminate Element Render Delay (target: <10%)

The element should render immediately after loading.

- **Root Cause**: Large stylesheets, synchronous scripts in `<head>`, or main thread blocking.
- **Fix**: Inline critical CSS, defer non-critical CSS/JS.
- **Fix**: Break up long tasks blocking the main thread.
- **Fix**: Use Server-Side Rendering (SSR) so the element exists in initial HTML.

### 3. Reduce Resource Load Duration (target: ~40%)

Make the resource smaller or faster to deliver.

- **Fix**: Use modern formats (WebP, AVIF) and responsive images (`srcset`).
- **Fix**: Serve from a CDN.
- **Fix**: Set `Cache-Control` headers.
- **Fix**: Use `font-display: swap` if LCP is text blocked by a web font.

### 4. Reduce TTFB (target: ~40%)

The HTML document itself takes too long to arrive.

- **Fix**: Minimize redirects and optimize server response time.
- **Fix**: Cache HTML at the edge (CDN).
- **Fix**: Ensure pages are eligible for back/forward cache (bfcache).

## Verifying Fixes & Emulation

- **Verification**: Re-run the trace (`performance_start_trace` with `reload: true`) and compare the new subpart breakdown. The bottleneck should shrink.
- **Emulation**: Lab measurements differ from real-world experience. Use `emulate` to test under constraints:
  - `emulate` with `networkConditions: "Fast 3G"` and `cpuThrottlingRate: 4`.
  - This surfaces issues visible only on slower connections/devices.
- **Stop condition**: After two trace-and-fix loops, stop and report the remaining dominant bottleneck unless the user asks for deeper iteration. Do not keep tuning without new evidence.
