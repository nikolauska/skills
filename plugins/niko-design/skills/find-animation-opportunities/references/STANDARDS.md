# New Motion Suggestion Defaults

Use only after a candidate passes the [frequency and purpose gate](../SKILL.md#the-gate). These are **new-suggestion** rules: keyboard-initiated and 100+/day actions stay instant; at tens/day, suggest only near-imperceptible, fast feedback with a clear purpose. Existing tens/day motion is judged differently in an audit: remove or drastically reduce it. Occasional motion can clarify a state change; rare moments can support restrained delight. Reuse the product's tokens and personality before proposing new ones.

| Surface | Default duration |
| --- | --- |
| Press feedback | 100–160ms |
| Tooltip / small popover | 125–200ms |
| Dropdown / select | 150–250ms |
| Modal / drawer | 200–300ms |

UI generally stays below 300ms. A justified large or gesture-driven modal/drawer may take up to 500ms **only while input remains responsive**. Use strong ease-out `cubic-bezier(0.23, 1, 0.32, 1)` for entrances/exits, ease-in-out `cubic-bezier(0.77, 0, 0.175, 1)` for on-screen movement/morphs, drawer `cubic-bezier(0.32, 0.72, 0, 1)` when appropriate, `ease` for hover/color, and `linear` for constant motion. Avoid `ease-in` on responsive UI.

Enter from `scale(0.9–0.97)` plus opacity, not `scale(0)`; subtle press feedback can use `scale(0.97)` (range 0.95–0.98). Scale trigger-anchored surfaces from the trigger; centered modals keep center origin. CSS transitions retarget rapid toggles; keyframes restart. For gesture-driven motion, an example spring is `{ type: "spring", duration: 0.5, bounce: 0.2 }`; reserve subtle bounce (0.1–0.3) for suitable playful/drag interactions and preserve gesture velocity. Keep stagger to 30–80ms between items and never block input. After the first adjacent tooltip, skip delay and animation.

Honor `prefers-reduced-motion` by removing movement while retaining useful gentle opacity/color feedback. Gate hover motion with `@media (hover: hover) and (pointer: fine)`. Prefer `transform` and `opacity` where appropriate, but measure layout/filter work rather than assuming every transform is cheap.
