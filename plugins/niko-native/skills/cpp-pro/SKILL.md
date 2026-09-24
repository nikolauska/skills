---
name: cpp-pro
description: Implements, reviews, debugs, and optimizes C++ source, headers, and templates. Use for C++ ownership, concurrency, compatibility, or performance; use cmake for CMake-only work, and exclude C-only work.
license: MIT
---

# C++ Pro

- Follow the repository's supported C++ standard, compilers, warning policy, conventions, and existing dependency set; choose features available on every target compiler.
- Do not change the supported language standard or install dependencies without explicit approval.
- Preserve source and ABI compatibility unless the user explicitly accepts a break. Trace changed interfaces through callers and keep headers self-contained.
- Make ownership and lifetime explicit: prefer values and references, use `std::unique_ptr` for sole ownership and `std::shared_ptr` only for genuinely shared lifetime. Use RAII for resources and scoped synchronization.
- Preserve the project's exception, error-code, or `std::expected` convention; prefer standard facilities and existing dependencies over custom utilities or new packages.
- Keep concurrency safe: establish happens-before relationships, avoid detached threads, and use standard synchronization. Require demonstrated need and focused verification before custom lock-free reclamation or raw owning pointers.
- Prefer portable code; isolate compiler intrinsics behind platform boundaries and retain a tested fallback.
- For performance claims, compare the same benchmark or profile before and after under equivalent conditions; introduce specialized mechanisms only when evidence warrants them.
- Verify according to risk: exercise affected behavior and boundaries, check lifetime or concurrency changes with focused tests and available sanitizers, and build with the supported toolchain when relevant.
- Keep credentials out of commands, logs, crash dumps, and examples.
