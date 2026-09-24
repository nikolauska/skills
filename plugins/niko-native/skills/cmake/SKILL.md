---
name: cmake
description: Use for CMake build-system changes, packaging, testing, or diagnosis involving CMakeLists.txt, .cmake modules, presets, CTest, exports, or generators; not unrelated source-language changes.
license: MIT
---

# CMake

Model the smallest target-based build that preserves the project's supported versions, platforms, generators, and exported package contract.

## References

- Read [the CMake tutorial](references/cmake-tutorial.md) only for the relevant topic: target setup, dependencies, generated files, testing, presets, installation, exports, or generator expressions.
- Read [the CPM guide](references/cpm.md) only when changing CPM.cmake bootstrap, dependency declarations, cache behavior, local fallback, or lock files.

## Invariants

- Check the declared minimum CMake version and existing project/CI conventions before using syntax, modules, properties, or commands; do not raise the minimum or break supported generators/toolchains without approval.
- Define artifacts and dependencies as targets. Attach include paths, compile features/options, and link requirements to their owning targets; use `PRIVATE`, `PUBLIC`, and `INTERFACE` according to consumer needs instead of global flags or directory-wide state.
- Preserve the full public dependency graph for installed/exported targets, including external dependencies via package config `find_dependency()`; verify changes with a real `find_package()` consumer and keep the install prefix user-controlled.
- Declare generated outputs and their input/generator dependencies, connect outputs to consuming targets, and check that changes rebuild them without needless regeneration.
- Keep source and build trees separate. Use a fresh build tree when switching generator or toolchain; do not reuse an incompatible cache.
