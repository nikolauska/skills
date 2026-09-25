# Animation Audit Playbook

These eight categories describe what to hunt in existing motion. Prefer the target repo's established tokens; use the precise defaults below only when no suitable token exists.

## Decision defaults

Existing keyboard-initiated or 100+/day motion should be removed; at tens/day remove or drastically reduce it. Occasional motion can clarify state; rare moments may warrant restrained delight. This is an **existing-motion audit**, not permission to propose new tens/day motion (new suggestions require exceptionally subtle, fast, purposeful feedback).

| Surface | Duration |
| --- | --- |
| Press feedback | 100–160ms |
| Tooltip / small popover | 125–200ms |
| Dropdown / select | 150–250ms |
| Modal / drawer | 200–300ms |

UI generally stays below 300ms. A large or gesture-driven modal/drawer may take up to 500ms only when justified and input remains responsive. Entrances/exits: strong ease-out `cubic-bezier(0.23, 1, 0.32, 1)`; on-screen movement/morphing: ease-in-out `cubic-bezier(0.77, 0, 0.175, 1)`; drawer: `cubic-bezier(0.32, 0.72, 0, 1)`. Hover/color can use `ease`; constant motion uses `linear`. Avoid `ease-in` on responsive UI. Match existing tokens before introducing these curves.

Enter from `scale(0.9–0.97)` plus opacity, never `scale(0)`; press feedback can use `scale(0.97)` (subtle range 0.95–0.98). Anchor popovers to their trigger; center-origin modals stay centered. For gestures, preserve velocity and allow interruption: example spring `{ type: "spring", duration: 0.5, bounce: 0.2 }` or `{ type: "spring", mass: 1, stiffness: 100, damping: 10 }`; reserve subtle bounce (0.1–0.3) for suitable playful/drag interactions. CSS transitions retarget rapidly changed states; keyframes restart.

Honor `prefers-reduced-motion` by removing movement while retaining useful gentle opacity/color feedback; gate hover motion with `@media (hover: hover) and (pointer: fine)`. Prefer transform/opacity where appropriate, but measure costly layout/filter work. Subsequent adjacent tooltips should skip delay and animation. Restrained group stagger: 30–80ms per item without blocking input; transition blur, if needed, about `blur(2px)` after checking cost.

## 1. Purpose & frequency

Judge existing animations by purpose and frequency. At tens/day, remove or drastically reduce gratuitous motion; this audit is not the new-suggestion gate used by the opportunity finder.

Hunt for: animations on keyboard-initiated actions, command palettes with open/close transitions (Raycast has none — correct), decorative motion on list items or hover states hit constantly. The strongest fix is often **delete the animation**.

## 2. Easing & duration

Use the decision defaults above. A modal/drawer longer than the usual 200–300ms is not automatically a defect: up to 500ms may be justified for a large or gesture-driven surface if input stays responsive.

Hunt for: `ease-in` on UI, bare `ease`/`linear` on entrances, UI motion exceeding its applicable budget without justification, tooltip delay + animation on every tooltip in a toolbar (after the first, they should be instant).


## 3. Physicality & origin

Use the decision defaults above for scale, press feedback, and trigger-relative origins; centered modals are exempt. Do not report a correct modal center origin.

Hunt for: `scale(0)`, pure-fade entrances with no initial transform, `transform-origin: center` (or none) on trigger-anchored elements, pressable elements with no press feedback.

## 4. Interruptibility

Use the decision defaults above for retargetable transitions and springs; deliberate holds can fill over 2s linear while releasing in 200ms ease-out.


Hunt for: `@keyframes` on toasts/toggles/rapidly-triggered UI, gesture handlers that tween with fixed-duration keyframes, drags without velocity-based dismissal (dismiss on `Math.abs(distance)/elapsedMs > ~0.11`, not distance thresholds alone), hard stops at drag boundaries instead of rising friction.

## 5. Performance

- Prefer `transform` and `opacity` where appropriate, but verify compositing instead of assuming it.
- Treat layout-property animation as a measured tradeoff, including intrinsic-size transitions.
- `transition: all` can animate unintended properties; use an explicit property list.
- Do not infer acceleration from Motion API syntax; profile before rewriting library transforms.
- Prefer CSS or WAAPI for predetermined motion; dynamic/gesture-driven values may need JavaScript or springs.
- Scope high-frequency writes narrowly; parent CSS variables can invalidate descendants.
- Keep transition blur subtle and verify cost on target devices.


Hunt for: `transition: all`, sustained layout-property animation, broad style invalidation in per-frame handlers, long-running JavaScript animation on busy paths, and expensive filters. Confirm performance findings with a trace when practical.

## 6. Accessibility

Apply the reduced-motion and hover/pointer guidance above. Hunt for: movement without reduced-motion handling, ungated `:hover` motion, or implementations that remove useful feedback.


## 7. Cohesion & tokens

- Match motion to product personality; mismatched components are a finding.
- Consolidate near-identical curves and durations into the repo's existing tokens.
- Consider a restrained stagger for occasional group entrances without blocking interaction.
- A subtle blur can mask a visibly double-exposed crossfade when needed.


Hunt for: duplicated near-identical easings/durations, one bouncy component in a crisp app, list/grid entrances with no stagger, crossfades that visibly double-expose.

## 8. Missed opportunities

The additive category — places that don't animate but should:

- State changes that teleport (content swaps, layout jumps) where a brief transition would prevent a jarring change.
- Spatially-connected UI (a panel that appears from a trigger) with no motion explaining where it came from.
- Rare, high-emotion moments (first-run, success, celebration) rendered with none of the delight budget they're allowed.
- `translate` percentages (`translateY(100%)` = element's own height) and `clip-path: inset()` reveals as tools for these — no hardcoded pixel offsets.

Report at most a handful, grounded in actual UX seams you observed — not a wishlist.
