# Review Mode

Review animation and motion code — a diff, a PR, or named files — against a high craft bar. Do not review non-motion code; point general reviews elsewhere. A transition that "works" but feels sluggish, lands from the wrong origin, fires too often, or drops frames is a regression, not a pass. Default to flagging; approval is earned.

The method — non-negotiable standards, escalation triggers, a remedial hierarchy, tiered output, and explicit approval criteria — is adapted from aggressive code-quality review. Take every value from `standards.md`.

## The Ten Non-Negotiable Standards

Every animation in scope is measured against these. A violation is a finding.

1. **Justified motion.** Every animation answers "why does this animate?" "It looks cool" on a frequently seen element is a block.
2. **Frequency-appropriate.** Keyboard-initiated and 100+/day actions get **no** animation. Existing tens/day motion should be removed or drastically reduced.
3. **Responsive easing.** Entering/exiting elements use a strong ease-out curve. `ease-in` on responsive UI is a block.
4. **Responsive duration.** Within the per-surface budget, including the qualified modal/drawer exception.
5. **Origin & physical correctness.** Trigger-anchored surfaces scale from their trigger; nothing animates from `scale(0)`. Modals are exempt and stay centered.
6. **Interruptibility.** Rapidly triggered or gesture-driven motion retargets from its current state instead of restarting.
7. **Performance-aware properties.** Prefer `transform` and `opacity`. Flag layout-property animation when it causes measured or likely frame-budget problems; allow justified exceptions.
8. **Accessibility.** `prefers-reduced-motion` is honored (gentler, not zero) and hover motion is gated by pointer capability.
9. **Asymmetric enter/exit.** Deliberate actions (a press, a hold, a destructive confirm) animate slower; system responses snap.
10. **Cohesion.** Motion matches the component's personality and the rest of the product. When unsure whether motion feels right, the strongest move is often to delete it.

## Escalation Triggers

Flag these on sight:

- `transition: all`
- `scale(0)` or pure-fade entrances with no initial transform
- `ease-in` on any UI interaction; weak built-in easing on a deliberate animation
- Animation on a keyboard shortcut, command-palette toggle, or 100+/day action
- Duration beyond the applicable budget without justification
- `transform-origin: center` on a trigger-anchored popover/dropdown/tooltip
- Keyframes on toasts, toggles, or anything added or triggered rapidly
- Animating layout properties (`width`/`height`/`margin`/`padding`/`top`/`left`)
- Per-frame JavaScript-driven motion on busy paths without profiling or a simpler CSS/WAAPI alternative
- Updating a CSS variable on a parent to drive a child transform (style recalc storm)
- Movement without `prefers-reduced-motion` handling, or ungated `:hover` motion
- Symmetric enter/exit timing on a press-and-release or hold interaction
- An everything-at-once entrance where a restrained stagger belongs

## Remedial Preference Hierarchy

Prefer earlier moves over later ones:

1. **Delete the animation** (high-frequency, no purpose, keyboard-triggered).
2. **Reduce it** — shorter duration, smaller transform, fewer properties.
3. **Fix the easing.**
4. **Fix the origin/physicality.**
5. **Make it interruptible** — keyframes → transitions, or a spring for gestures.
6. **Reduce main-thread work** — layout props → `transform`/`opacity` where behavior permits; profile before rewriting library transforms.
7. **Asymmetric timing** — slow the deliberate phase, snap the response.
8. **Polish** — blur-masked crossfades, stagger, `@starting-style`, springs for "alive" elements.
9. **Accessibility & cohesion** — reduced motion, hover gating, personality tuning.

## Output

### Part 1 — Findings table

One Markdown table, one row per issue, citing `file:line` in the Before or Why cell. Never a "Before:/After:" list.

| Before | After | Why |
| --- | --- | --- |
| `transition: all 300ms` | `transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1)` | Names the intended property and avoids animating unrelated changes |
| `transform: scale(0)` | `transform: scale(0.95); opacity: 0` | Nothing appears from nothing |
| `ease-in` on dropdown | `cubic-bezier(0.23, 1, 0.32, 1)` | Starts immediately and settles with a strong ease-out |

### Part 2 — Verdict

Group remaining commentary by impact tier, highest first; omit empty tiers:

1. **Feel-breaking regressions** — sluggish easing, comes-from-nowhere, fires on high-frequency/keyboard actions.
2. **Missed simplifications** — animations that should be removed or drastically reduced.
3. **Performance** — measured or likely frame-budget problems, broad invalidation, avoidable per-frame main-thread work.
4. **Interruptibility & timing.**
5. **Origin, physicality & cohesion.**
6. **Accessibility.**

Close with an explicit decision:

- **Block** — any feel-breaking regression, animation on a keyboard/high-frequency action, `scale(0)`/`ease-in` on UI, or a likely frame-budget problem with a straightforward fix.
- **Approve** — none of the above, durations and easing within bounds, interruptibility handled where needed, reduced motion respected.

When feel is uncertain, recommend a feel-check from `standards.md` rather than guessing.
