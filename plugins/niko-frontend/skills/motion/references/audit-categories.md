# Audit Categories

These eight categories describe what to hunt in existing motion. Judge against `standards.md`, preferring the target repo's established tokens. This is an **existing-motion audit**, not permission to propose new tens/day motion.

## 1. Purpose & frequency

At tens/day, remove or drastically reduce gratuitous motion; existing keyboard-initiated or 100+/day motion should go entirely.

Hunt for: animations on keyboard-initiated actions, command palettes with open/close transitions (Raycast has none — correct), decorative motion on list items or hover states hit constantly. The strongest fix is often **delete the animation**.

## 2. Easing & duration

A modal/drawer longer than the usual 200–300ms is not automatically a defect if the qualified exception applies.

Hunt for: `ease-in` on UI, bare `ease`/`linear` on entrances, UI motion exceeding its budget without justification, tooltip delay + animation on every tooltip in a toolbar (after the first, they should be instant).

## 3. Physicality & origin

Do not report a correct modal center origin.

Hunt for: `scale(0)`, pure-fade entrances with no initial transform, `transform-origin: center` (or none) on trigger-anchored elements, pressable elements with no press feedback.

## 4. Interruptibility

Hunt for: `@keyframes` on toasts/toggles/rapidly triggered UI, gesture handlers that tween with fixed-duration keyframes, drags without velocity-based dismissal, hard stops at drag boundaries instead of rising friction, symmetric timing on holds.

## 5. Performance

Hunt for: `transition: all`, sustained layout-property animation, broad style invalidation in per-frame handlers, long-running JavaScript animation on busy paths, and expensive filters. Treat layout-property animation as a measured tradeoff, verify compositing instead of assuming it, and confirm performance findings with a trace when practical.

## 6. Accessibility

Hunt for: movement without reduced-motion handling, ungated `:hover` motion, or reduced-motion implementations that remove useful feedback entirely.

## 7. Cohesion & tokens

Hunt for: duplicated near-identical easings/durations, one bouncy component in a crisp app, occasional list/grid entrances with no stagger, crossfades that visibly double-expose.

## 8. Missed opportunities

The additive category — places that don't animate but should:

- State changes that teleport (content swaps, layout jumps) where a brief transition would prevent a jarring change.
- Spatially connected UI (a panel that appears from a trigger) with no motion explaining where it came from.
- Rare, high-emotion moments (first-run, success, celebration) rendered with none of the delight budget they're allowed.

Report at most a handful, grounded in actual UX seams you observed — not a wishlist.
