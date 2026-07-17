---
name: cpp-pro
description: Guides implementation, refactoring, debugging, and performance work in modern C++ codebases. Use for C++ source, headers, templates, CMake targets, ownership, concurrency, or measured optimization; do not use for C-only projects or generic build infrastructure.
license: MIT
---

# C++ Pro

Work with the language standard, toolchain, conventions, and performance requirements already established by the repository.

## Guardrails

- Never read credential files or expose secrets through commands, logs, crash dumps, or examples.
- Do not install dependencies, change the supported language standard, or alter public ABI without explicit user approval.
- Do not claim a performance improvement without a comparable measurement.
- Do not introduce raw owning pointers, detached threads, or custom lock-free memory reclamation without a demonstrated requirement and focused verification.
- Prefer the standard library and existing project dependencies over custom utilities or new packages.

## Workflow

1. Read repository instructions, the build configuration, and nearby code to identify the supported C++ standard, compilers, warning policy, ownership model, error model, and test commands.
2. Trace the changed interface through its callers. State any compatibility, lifetime, threading, or ABI constraints before editing.
3. Choose the smallest language or library feature supported by every target compiler. Reuse existing project patterns; use templates, concepts, coroutines, SIMD, or custom allocation only when the requirement needs them.
4. Implement with explicit ownership and lifetime:
   - Prefer values, references, and `std::unique_ptr`; use `std::shared_ptr` only for genuinely shared lifetime.
   - Use RAII for resources and scoped synchronization.
   - Preserve the project's exception, error-code, or `std::expected` convention.
   - Keep headers self-contained and minimize exposed implementation details.
5. Add or update the smallest test that fails without the change. Include boundary, lifetime, or concurrency coverage when that is the risk being changed.
6. Run the repository's narrowest relevant format, build, and test commands. Treat new compiler warnings as failures.
7. For memory or concurrency changes, run the repository's configured sanitizer when available. For optimization work, compare the same benchmark or profile before and after under equivalent conditions.

## Decision rules

- Use concepts when they improve a public template's diagnostics or express a real semantic constraint; otherwise keep the existing constraint style.
- Prefer standard algorithms and synchronization primitives. Use lock-free structures only after profiling demonstrates contention and the design includes safe reclamation.
- Prefer portable code. Isolate compiler intrinsics behind an existing platform boundary and retain a tested fallback.
- Preserve source and ABI compatibility unless the user explicitly accepts a break.
- Do not add a header, implementation file, CMake target, test framework, or benchmark unless the change requires it.

## Failure handling

- On a compiler error, read the first relevant diagnostic and its instantiation context before changing code.
- On a sanitizer failure, preserve the report, minimize the triggering input, and fix the ownership or bounds error rather than suppressing it.
- On a flaky concurrency failure, reproduce with a bounded stress case and verify the happens-before relationship; do not add sleeps as synchronization.
- If a required compiler, sanitizer, or benchmark tool is unavailable, report the skipped check instead of installing it implicitly.

## Output

Report the behavior changed, compatibility or performance implications, and exact validation run. Distinguish measured results from expectations and list any skipped checks.
