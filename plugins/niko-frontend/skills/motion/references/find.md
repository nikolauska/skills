# Find Mode

Sweep an interface for moments that would genuinely benefit from new motion and propose a precise recipe for each. Do not review existing animations (Review mode, `review.md`), audit them (Audit mode, `audit.md`), or implement suggestions.

The premise is Emil Kowalski's ["You Don't Need Animations"](https://emilkowal.ski/ui/you-dont-need-animations). An opportunity finder that suggests motion everywhere produces the sluggish, over-animated interfaces this skill exists to prevent, so this mode is a filter as much as a finder. Expect to reject most candidates.

## Rules

- Every suggestion must pass the full gate below. No exceptions for "it would look cool."
- Cap the output at 5–7 suggestions for a whole app, fewer for a single view, ordered by leverage.
- If asked to build a suggestion, hand it off as `plan <suggestion>` in Audit mode, or let the user take the recipe to any agent.

## The Gate

Every candidate must survive all four questions, in order. Record each answer for the report. The gate judges **new suggestions**, not whether existing motion should be removed.

1. **Frequency.** 100+ times/day or keyboard-initiated: **reject, always** (Raycast's instant command palette is the reference). Tens of times/day: usually reject; allow only near-imperceptible, fast feedback with a clear purpose. Occasional: eligible. Rare/first-time: eligible for restrained delight.
2. **Purpose.** Name one: feedback, spatial consistency, state indication, preventing a jarring change, explanation (marketing/onboarding only), or delight (rare tier only). Otherwise reject.
3. **Speed.** The suggestion must fit the duration budget in `standards.md`. If the moment only works as a slow, showy animation, reject it.
4. **Function.** Decoration on functional, information-dense UI hinders. A mouse-tracking effect is fine on a marketing page; on a banking app's functional graph, no animation is better. Data the user is reading or acting on should not move for style.

## Where to Hunt

Each seam is a known class of genuine opportunity:

- **Feedback gaps:** pressable elements with no `:active` state → `transform: scale(0.97)` with `transition: transform 160ms ease-out`. Destructive actions confirmed with a plain click where a hold-to-confirm fill would prevent slips → `clip-path: inset(0 100% 0 0)` overlay, 2s linear on press, 200ms ease-out snap-back.
- **Teleporting state:** content that swaps, appears, or vanishes instantly → fade/scale entrances from `scale(0.95–0.97)` + `opacity: 0`, `@starting-style` for entry without JavaScript. Accordions that snap open → height + opacity. Lists that add/remove items with no bridge (and aren't high-frequency) → CSS transitions, not keyframes.
- **Missing spatial story:** panels, popovers, menus with no connection to their trigger → scale from the trigger origin (modals exempt). Dismissable surfaces that exit differently than they entered → symmetric paths with percentage translates.
- **Group entrances:** a grid or list on an occasionally visited page that pops in all at once → 30–80ms stagger that never blocks interaction.
- **Gesture seams:** draggable/swipeable elements that snap with no physics → springs, velocity-based dismissal, rubber-banding at boundaries.
- **The delight budget:** rare, high-emotion moments rendered flat — first-run, empty states, success, celebration. The only places bounce, generous stagger, or a longer beat are welcome.

Useful sweeps: conditional renders with no transition (`{isOpen &&`, `display: none` toggles), `onClick` handlers on elements with no `:active`/transition styles, `details`/accordion markup, drag handlers, `.map(` renders of entering lists, empty-state and success components.

Sweep every seam class until it has either yielded candidates with `file:line` evidence or been explicitly cleared, then gate every candidate. If nothing survives, say so plainly — that is a good result.

## Output

### Part 1 — Opportunities table

| # | Location | Today | Purpose | Frequency | Suggested motion |
| --- | --- | --- | --- | --- | --- |
| 1 | `Toast.tsx:41` | New toasts appear instantly | Preventing a jarring change | Occasional | Enter via `@starting-style`: `opacity: 0; translateY(100%)` → settled, `transition: transform 200ms var(--ease-out), opacity 200ms var(--ease-out)`, exit same edge |
| 2 | `Button.tsx:18` | No press feedback | Feedback | Tens/day | `:active { transform: scale(0.97) }`, `transition: transform 160ms var(--ease-out)` — subtle enough for the frequency tier |

Every "Suggested motion" cell carries exact properties, duration, and easing, reusing the repository's motion tokens. If none exist, use the fallbacks in `standards.md` and state that any shared token belongs alongside existing design tokens. Prefer `transform` and `opacity`; justify layout or paint exceptions. Include reduced-motion handling and pointer-gated hover motion.

### Part 2 — Rejected candidates (required)

List 2–5 places you considered and deliberately did **not** suggest, each with the gate question that killed it:

- `CommandMenu.tsx:12` — command palette open/close. **Rejected: keyboard-initiated, 100+/day.**
- `Chart.tsx:88` — animated line drawing on the analytics graph. **Rejected: functional data the user is reading.**

This section is what separates the mode from an animation wishlist.

### Part 3 — Verdict

One short paragraph: how much motion this interface actually needs, whether it is already close to right, and which suggestion has the highest leverage. Point to `plan <suggestion>` in Audit mode to turn any row into a self-contained implementation plan. Daily use argues for less motion, not more.
