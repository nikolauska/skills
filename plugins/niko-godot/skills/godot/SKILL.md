---
name: godot
description: >
  Guides implementation, refactoring, debugging, and review of Godot projects using GDScript,
  scenes, resources, shaders, editor plugins, exports, physics, UI, animation, navigation, or
  networking. Use when a task touches project.godot, .gd, .tscn, .tres, .res, .gdshader, or Godot
  editor/runtime behavior; do not use for engine-independent game design or another game engine.
---

# Godot

## Objective

Make the smallest correct change for the project's actual Godot version and conventions. Prefer
Godot's nodes, resources, signals, and editor/runtime APIs over custom infrastructure.

## Workflow

### 1. Establish project context

1. Find `project.godot`; treat its directory as the project root.
2. Read repository instructions and inspect version-control status before editing.
3. Determine the Godot version from project metadata, lock files, CI, or the installed executable.
   Do not assume a specific minor version.
4. Inspect the affected scene, script, resource, and every caller or owner involved in the behavior.
5. Reuse existing project patterns for node ownership, signals, autoloads, input actions, tests, and
   formatting.

If there is no Godot project or the requested engine version cannot be established, state the
assumption that affects the change instead of inventing version-specific API details.

### 2. Choose the smallest native solution

- Keep state with the node or resource that owns it.
- Use direct method calls for commands and signals for notifications; add an autoload only for
  genuinely project-wide state or services.
- Use a `Resource` for Inspector-editable or serializable data, `RefCounted` for non-scene logic,
  and a `Node` only when scene-tree lifecycle or spatial behavior is required.
- Prefer existing input actions, scene composition, animation tracks, themes, and engine APIs.
- Profile before adding caches, pools, threading, server APIs, or data-oriented rewrites.

Do not introduce a framework, global event bus, service locator, base class, or abstraction for one
call site.

### 3. Implement carefully

- Match the project's GDScript typing and formatting conventions.
- Respect lifecycle boundaries: tree-dependent work belongs after a node enters the tree, physics
  movement belongs in the physics step, and editor-time behavior requires an explicit `@tool` need.
- Preserve scene/resource ownership, UIDs, `NodePath` values, exported properties, signal
  connections, and `res://` references when editing text resources.
- Prefer focused changes to `.tscn` and `.tres` files; do not reserialize unrelated sections.
- Keep gameplay authority and validation on the authoritative peer in multiplayer code.
- Make save-format changes backward compatible or add a deliberate migration.
- Handle node/resource lifetime explicitly when retaining callables, tweens, RIDs, or asynchronous
  work.

Do not hand-edit binary `.res` files or imported assets. Use source assets or the Godot editor when
the format is not safely text-editable.

### 4. Diagnose before fixing

For bugs or regressions:

1. Reproduce the smallest failing path and capture the exact Godot error or incorrect state.
2. Trace ownership and lifecycle before adding deferred calls or null guards.
3. Check scene-tree paths, signal connections, collision layers/masks, input consumption, resource
   sharing, and frame-loop choice where relevant.
4. Use the debugger and profiler for runtime or performance claims.
5. Fix the shared cause, then verify the original reproduction.

Treat `call_deferred()`, process-loop polling, and duplicated state as hypotheses to justify, not
default fixes.

### 5. Validate

Run the narrowest project-provided checks first. Then, when the matching Godot executable is
installed and running the project is safe:

1. Import and parse the project headlessly with the project's documented command or equivalent.
2. Run the smallest relevant automated test or scene-level reproduction.
3. Check the debugger output for parser errors, invalid paths, orphaned nodes, and leaked resources.
4. For visual, physics, input, audio, or timing changes, report the manual editor/runtime check still
   required if it cannot be performed headlessly.
5. Review the diff for accidental scene/resource churn and ensure generated `.godot/` cache content
   is not committed.

Do not claim a runtime or visual behavior passed when only static parsing was performed.

## Guardrails

- Never read or expose `.env` files, credentials, signing keys, export secrets, or platform tokens.
- Do not run untrusted projects, addons, editor plugins, `@tool` scripts, or exports without explicit
  user authorization; opening a project in the editor can execute code.
- Do not browse, install addons, download assets, or contact external services unless the user asks.
- Do not delete or convert scenes, resources, saves, imports, or source assets without confirmation
  when the operation can lose data.
- Do not edit `.godot/` caches or generated import artifacts as source files.
- Verify version-sensitive APIs against documentation for the project's Godot version when local
  evidence is insufficient and web access is authorized.

## Output

Report the changed behavior, checks run, and any editor/runtime verification still needed. Mention
the assumed Godot version only when it materially affects the result.
