# Animation Review Standards

These values are review defaults, not automatic defects: cite evidence from the code under review, preserve existing product tokens, and check whether an exception is justified.

## Motion decision values

Existing keyboard-initiated or 100+/day motion should be removed; tens/day motion should be removed or drastically reduced. This review judges **existing** motion, unlike suggestions of new motion at tens/day, which require exceptionally subtle, fast, purposeful feedback. Occasional surfaces can use standard motion; rare moments can use restrained delight.

| Surface | Duration |
| --- | --- |
| Press feedback | 100–160ms |
| Tooltip / small popover | 125–200ms |
| Dropdown / select | 150–250ms |
| Modal / drawer | 200–300ms |

UI generally stays below 300ms. Up to 500ms is an exception for a justified large or gesture-driven modal/drawer **only while input remains responsive**. Entrances/exits: ease-out `cubic-bezier(0.23, 1, 0.32, 1)`; on-screen motion/morphs: ease-in-out `cubic-bezier(0.77, 0, 0.175, 1)`; drawers: `cubic-bezier(0.32, 0.72, 0, 1)`. Hover/color can use `ease`, constant motion `linear`; `ease-in` delays responsive UI. Prefer existing tokens over new curves.

Enter from `scale(0.9–0.97)` plus opacity rather than `scale(0)`; press feedback can use `scale(0.97)` (subtle range 0.95–0.98). Trigger-anchored surfaces use trigger origin; centered modals use center. Transitions retarget rapidly changed states; keyframes restart. For gesture springs, an example is `{ type: "spring", duration: 0.5, bounce: 0.2 }` or `{ type: "spring", mass: 1, stiffness: 100, damping: 10 }`; reserve bounce 0.1–0.3 for suitable playful/drag interactions. A deliberate 2s linear hold can snap back in 200ms ease-out. Stagger occasional group entrances 30–80ms per item without blocking input; if needed, try `blur(2px)` on a crossfade and verify cost.

Honor `prefers-reduced-motion`: remove movement but retain useful gentle opacity/color feedback. Gate hover motion with `@media (hover: hover) and (pointer: fine)`. Prefer transform/opacity, measure layout/filter costs, and skip delay/animation for subsequent adjacent tooltips.

## Review-specific checks

- An existing animation on a keyboard action or 100+/day path should be removed; tens/day motion should be removed or drastically reduced. Unlike a new-opportunity suggestion, review judges whether the existing motion earns its place.
- For a modal/drawer exceeding the usual 200–300ms, check whether a large or gesture-driven surface justifies up to 500ms **and** input remains responsive. Do not flag a justified exception merely for exceeding 300ms.
- `transform-origin: center` is correct for a centered modal, not a trigger-anchored popover. Verify which surface is actually rendered.
- Review interruptibility of rapidly triggered toasts/toggles and gesture interactions; keyframes that restart can be a problem where a transition or spring would retarget.
- A deliberate hold and its release should have asymmetric timing. A measured intrinsic-size transition is not automatically a performance issue.

## Review-specific performance and gesture evidence

- Do not infer acceleration from Motion syntax: shorthand values and full `transform` strings can both update via per-frame JavaScript. Profile before recommending an API rewrite solely for performance.
- A parent CSS variable can invalidate descendants; confirm recalculation cost in a trace before recommending a leaf write.
- `clip-path: inset(t r b l)` can reveal content, hold-to-delete overlays, or transition tab colors; assess paint cost on the target device.
- Pointer capture keeps a drag active when the pointer leaves bounds; ignore extra touch points after a drag begins to avoid jumps.

## Debugging (recommend in reviews when feel is uncertain)

- **Slow motion**: bump duration 2–5× or use the browser's animation inspector. Check colors crossfade cleanly, easing does not stop abruptly, `transform-origin` is right, and coordinated properties stay in sync.
- **Frame-by-frame**: use available browser animation tooling to reveal timing drift between coordinated properties.
- **Real devices**: verify drawers and swipe gestures on representative touch hardware; use the platform's remote debugging tools when available.
- **Fresh eyes**: repeat the feel-check after a break when the interaction remains subjective.

## Cohesion

Match motion to the component's personality: playful can be bouncier; a professional dashboard should be crisp and fast. Sonner feels right partly because easing, duration, design, and even the name are in harmony — slightly slower, `ease` rather than `ease-out`, to feel elegant. Opacity + height in entering/exiting lists is trial and error; there's no formula — adjust until it feels right.
