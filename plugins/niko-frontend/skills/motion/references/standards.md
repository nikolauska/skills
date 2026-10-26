# Motion Standards

Shared values for Review, Audit, and Find. They are defaults, not automatic defects: prefer the target repository's existing tokens, cite evidence from the code, and check whether an exception is justified. Frequency and purpose rules live in the root skill (`SKILL.md`).

## Duration

| Surface | Duration |
| --- | --- |
| Press feedback | 100–160ms |
| Tooltip / small popover | 125–200ms |
| Dropdown / select | 150–250ms |
| Modal / drawer | 200–300ms |

UI generally stays below 300ms. A large or gesture-driven modal/drawer may take up to 500ms **only when justified and input remains responsive**; do not flag a justified exception merely for exceeding 300ms. After the first adjacent tooltip opens, skip delay and animation for the rest.

## Easing

- Entrances/exits: strong ease-out `cubic-bezier(0.23, 1, 0.32, 1)`.
- On-screen movement/morphs: ease-in-out `cubic-bezier(0.77, 0, 0.175, 1)`.
- Drawers: `cubic-bezier(0.32, 0.72, 0, 1)`.
- Hover/color can use `ease`; constant motion (spinners, marquees) uses `linear`.
- Avoid `ease-in` on responsive UI; it delays the moment the user watches most.

## Physicality and origin

- Enter from `scale(0.9–0.97)` plus opacity, never `scale(0)`. Press feedback can use `scale(0.97)` (subtle range 0.95–0.98).
- Trigger-anchored surfaces (popovers, dropdowns, tooltips) scale from the trigger (Base UI: `var(--transform-origin)`). Centered modals correctly keep `transform-origin: center`; verify which surface is actually rendered.
- Enter and exit along the same path; use `translateY(100%)` percentages rather than hardcoded pixels.

## Interruptibility and gestures

- CSS transitions retarget rapidly changed states; keyframes restart from zero. Toasts, toggles, and anything triggered rapidly need transitions or springs.
- Example gesture springs: `{ type: "spring", duration: 0.5, bounce: 0.2 }` or `{ type: "spring", mass: 1, stiffness: 100, damping: 10 }`. Reserve bounce 0.1–0.3 for suitable playful/drag interactions and preserve gesture velocity.
- Dismiss drags on velocity (`Math.abs(distance)/elapsedMs > ~0.11`), not distance thresholds alone; use rising friction at boundaries instead of hard stops.
- Deliberate actions animate slower than system responses: a 2s linear hold-to-confirm fill can snap back in 200ms ease-out. Symmetric timing on press-and-release or hold interactions is a finding.
- Pointer capture keeps a drag active when the pointer leaves bounds; ignore extra touch points after a drag begins to avoid jumps.

## Groups and polish

- Stagger occasional group entrances 30–80ms per item without ever blocking input.
- If a crossfade visibly double-exposes, try about `blur(2px)` and verify its cost.
- `clip-path: inset(t r b l)` works for reveals, hold-to-delete overlays, and tab color transitions; assess paint cost on the target device.
- `@starting-style` animates entry without JavaScript.

## Accessibility

Honor `prefers-reduced-motion` by removing movement while retaining useful gentle opacity/color feedback; gentler, not zero. Gate hover motion with `@media (hover: hover) and (pointer: fine)`.

## Performance

- Prefer `transform` and `opacity`, but measure layout and filter work rather than assuming every transform is cheap. A measured intrinsic-size transition is not automatically a problem.
- `transition: all` animates unintended properties; name them explicitly.
- Do not infer acceleration from Motion syntax: shorthand values and full `transform` strings can both update via per-frame JavaScript. Profile before recommending an API rewrite solely for performance.
- Prefer CSS or WAAPI for predetermined motion; dynamic or gesture-driven values may need JavaScript or springs.
- A parent CSS variable can invalidate every descendant; confirm recalculation cost in a trace before recommending a narrower write.

## Cohesion

Match motion to the component's personality: playful can be bouncier; a professional dashboard stays crisp and fast. Sonner feels right partly because easing, duration, design, and even the name are in harmony — slightly slower, `ease` rather than `ease-out`, to feel elegant. Opacity + height in entering/exiting lists is trial and error; adjust until it feels right. Consolidate near-identical curves and durations into the repository's existing tokens.

## Feel-checks

Recommend these when feel cannot be established from source:

- **Slow motion:** raise duration 2–5× or use the browser's animation inspector. Check that colors crossfade cleanly, easing does not stop abruptly, `transform-origin` is right, and coordinated properties stay in sync.
- **Frame-by-frame:** step through available browser animation tooling to reveal timing drift between coordinated properties.
- **Real devices:** verify drawers and swipe gestures on representative touch hardware; use the platform's remote debugging tools when available.
- **Fresh eyes:** repeat the check after a break when the interaction remains subjective.
