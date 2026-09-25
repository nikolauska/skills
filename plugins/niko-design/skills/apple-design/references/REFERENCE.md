# Apple Design Reference

Load only the section named by the task; the [root skill](../SKILL.md) contains the core mechanics and safety rules.

## Motion mechanics

### Response and direct manipulation

An interface feels fluid when it responds immediately, follows input continuously, carries momentum, resists boundaries, and remains redirectable. Apple frames this as serving safety/predictability, understanding, achievement, and joy. Respond on pointer-down rather than waiting for release; avoid unnecessary debounce, timers, transition waits, and tap delays on the input path. During a drag, update position 1:1, respecting where the pointer grabbed the element. Use Pointer Events with `setPointerCapture`, and retain a short history of positions and timestamps for release velocity. A tap can commit on release while showing feedback on press.

```css
.button:active {
  transform: scale(0.97);
  transition: transform 100ms ease-out;
}
```

```js
el.addEventListener('pointerdown', (e) => {
  el.setPointerCapture(e.pointerId);
  const grabOffset = e.clientY - el.getBoundingClientRect().top;
  // Track position and timestamp history for velocity.
});
```

### Interruptibility and springs

A closing modal grabbed again should follow the finger immediately, not finish closing first. Never lock input during a transition. Start from the live presentation transform rather than the logical target, and carry current velocity through re-targeting so a reversal has no discontinuity. CSS transitions and keyframes are poor fits for interactions that must be grabbed mid-flight. For two-dimensional motion use independent X and Y springs when velocities differ.

Apple's designer-facing spring parameters are **damping ratio** (`1.0` is critically damped with no bounce; lower values overshoot) and **response** (how quickly it reaches its target in seconds, not a fixed duration). Start ordinary UI at damping `1.0`; use about `0.8` for a momentum-driven flick or throw, not an incidental menu entrance. Apple's examples: repositioning/PiP `1.0`, `0.4`; rotation `0.8`, `0.4`; drawer/sheet `0.8`, `0.3` (damping, response). These are physical examples, not a license to extend routine UI motion: modal/drawer transitions default to 200–300ms; a large or gesture-driven surface may take up to 500ms only when justified and input stays responsive. Motion/Framer Motion's `bounce` plus `duration` spring API is an approximate mapping, not identical physics; tune against the actual interaction.

```js
import { animate } from 'motion';

animate(el, { y: 0 }, { type: 'spring', bounce: 0, duration: 0.4 });
animate(el, { y: target }, { type: 'spring', bounce: 0.2, duration: 0.4 }); // after a flick
```

### Velocity handoff and momentum projection

The spring should start at the finger's release velocity, without a seam between drag and animation. Some APIs require relative velocity: `gestureVelocity / (targetValue − currentValue)`; for example 50px/s over 100px remaining is `0.5`. Motion/Framer Motion's `velocity` option accepts absolute px/s, so pass raw velocity there. Avoid division by zero when already at the target.

Choose the snap target nearest the *projected* resting position, not nearest the release position. Apple's exponential-decay projection (from *Designing Fluid Interfaces* sample code) uses approximately `0.998` for normal scroll feel or `0.99` for a snappier feel:

```js
function project(initialVelocity /* px/s */, decelerationRate = 0.998) {
  return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
}

const projectedEndpoint = currentPosition + project(releaseVelocity);
const target = nearestSnapPoint(projectedEndpoint);
animateSpringTo(target, { velocity: releaseVelocity });
```

This is exponential decay, not the constant-deceleration textbook `v²/(2·decel)` model. Re-target from the presentation value and preserve velocity on rapid reversals.

### Spatial paths, boundaries, and gestures

Enter and exit along the same path; anchor popovers and sheets to their source with an appropriate `transform-origin`. Intermediate frames should indicate where a gesture is going (for example, a module growing toward the finger), not merely interpolate blindly. At an edge, increase resistance progressively:

```js
function rubberband(overshoot, dimension, constant = 0.55) {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}
```

For taps, show press feedback instantly and commit on release; provide roughly 10px of hysteresis/hit padding so dragging away can cancel and dragging back can recover. For drag/swipe, wait for a small movement threshold (roughly 10px) before committing to direction, then track 1:1. Detect plausible gesture directions in parallel and cancel losing recognizers once intent is clear; final-only `swipeleft` events lose the continuous feedback. Avoid double-tap disambiguation delay where there is no double-tap action.

Frame-level smoothness depends on frame content, not just frame rate: avoid large positional jumps/strobing; subtle stretch or blur can convey very fast motion. Prefer `transform` and `opacity`; measure performance before applying `will-change`, and use it only near expensive motion.

## Visual and sensory craft

### Materials and depth

Translucency makes floating chrome legible without stealing focus. Use `backdrop-filter` and a semi-transparent background for nav, toolbars, or sheets with content scrolling beneath. Heavier materials divide structural regions; lighter ones draw attention to interactive elements. Avoid stacking light translucent surfaces because contrast collapses. Larger surfaces can use stronger blur and deeper shadows; adjust shadows for busy versus plain backgrounds. For modal tasks, pair the surface with a dimming scrim and push the background back; for parallel non-blocking panels, retain context with translucency and offset without a scrim. Stacked sheets progressively dim and push back parent layers.

Use strong, appropriately weighted text over blurred surfaces; put color on a solid layer rather than a translucent foreground. A subtle blur/gradient scroll edge can replace a hard divider where floating chrome actually overlaps content. Materialize glass by changing blur radius and scale together, rather than only fading opacity.

```css
.toolbar {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid rgba(255, 255, 255, 0.4);
}
```

### Multimodal feedback

Sound, haptics, and motion should have **causality** (fire on the actual causal event), **harmony** (visual, sound, and haptic feedback coincide), and **utility** (reserve them for meaningful success, error, commit, or snap moments). Excess feedback loses meaning. Check platform support before relying on browser vibration.

### Accessibility

Reduced motion still needs feedback: under `prefers-reduced-motion: reduce`, replace slides, springs, and parallax with short opacity cross-fades or static state changes, and remove overshoot. Under `prefers-reduced-transparency: reduce`, raise background opacity or use solid surfaces and remove blur. Under `prefers-contrast: more`, use near-solid backgrounds and defined contrasting borders. Avoid full-viewport moving backgrounds, slow looping oscillations near one cycle per five seconds, and abrupt brightness jumps. Make large moving objects semi-transparent during travel; fade large surfaces out and in for major repositioning.

```css
@media (prefers-reduced-motion: reduce) {
  .sheet { transition: opacity 200ms ease; transform: none !important; }
}
@media (prefers-reduced-transparency: reduce) {
  .toolbar { background: white; backdrop-filter: none; }
}
```

### Typography

Tracking depends on size: large display text benefits from tighter, negative letter spacing; small text may need slightly positive spacing, while body can stay near zero. Large headings need tighter leading than body copy; scripts with tall ascenders/descenders may need more. Compose hierarchy from weight, size, and leading together. Respect user text sizing by allowing layouts and `rem`/`em` spacing to grow. Start with the system font unless a custom face serves a clear purpose.

```css
:root { font: 100%/1.5 system-ui, sans-serif; }
.display {
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-optical-sizing: auto;
}
```

## Design foundations and process

Apple's eight design principles (*Principles of Great Design*, WWDC 2026) provide useful names for product decisions:

1. **Purpose:** Spend the user's time, attention, and trust intentionally; choose what not to build.
2. **Agency:** Keep people in control with choices and undo; reserve confirmation for genuinely destructive, irreversible actions.
3. **Responsibility:** Request only needed data at the right time; anticipate safety and privacy harm, including harmful AI suggestions. Use previews, confirmations, or disclaimers where warranted; remove risky features if safeguards cannot justify them.
4. **Familiarity:** Honor established metaphors, physics, and consistent placement; test departures rather than assuming they improve things.
5. **Flexibility:** Adapt to device, context, ability, age, language, and expertise; support personalization where one arrangement cannot fit everyone.
6. **Simplicity, not minimalism:** Surface the common path, reveal advanced options later, and add clarifying context when it reduces effort.
7. **Craft:** Deliberate typography, adaptable colors, clear icons, alignment, and responsive motion build trust through iteration.
8. **Delight:** Let it emerge from the other seven rather than adding decoration for its own sake.

Feedback can convey status, completion, warning, or error: expose ongoing status, confirm meaningful actions, warn ahead of problems, and validate inline. Ensure wayfinding answers where the user is, what is available, and how to leave. Group controls with what they affect, map their arrangement to their effects, and choose specific labels such as “Progress” or “Library” rather than generic umbrellas.

Prototype interactions rather than relying solely on static designs; design visuals and behavior together. Try the actual interface with people in context, and inspect motion in slow motion or frame-by-frame to catch discontinuities invisible at full speed.
