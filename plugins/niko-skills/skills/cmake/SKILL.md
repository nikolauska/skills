---
name: cmake
description: Guides creation, maintenance, packaging, testing, and diagnosis of target-based CMake build systems. Use for CMakeLists.txt, .cmake modules, CMakePresets.json, CTest, install/export rules, find_package integration, generated files, or generator and toolchain behavior; do not use for source-language changes unrelated to the build system.
license: MIT
---

# CMake

Build the smallest target-based model that preserves the repository's supported CMake versions, generators, platforms, and packaging contract.

## Guardrails

- Never read `.env` files, credential stores, private keys, tokens, or other secret material. Redact possible secret values from diagnostics while preserving the variable name and error context.
- Do not install CMake, compilers, generators, packages, or other dependencies without explicit approval.
- Do not delete a build tree, cache, install prefix, or generated artifact unless the user confirms it is disposable. Prefer a new build directory when changing generators or toolchains.
- Do not raise `cmake_minimum_required()`, change generator/toolchain support, hard-code an install prefix, or alter exported target names without checking every consumer and obtaining approval for compatibility breaks.
- Treat configure and generation as code execution. Do not run a preset, `cmake -S`, toolchain file, included module, build, test, install, package hook, code generator, or downloaded binary from an untrusted project without explicit approval.
- Do not permit network access or dependency fetching through `FetchContent`, `ExternalProject`, package managers, URLs, or project scripts without explicit approval.
- Keep source and build trees separate. Never configure into the source tree unless the repository explicitly requires it.

## Workflow

0. Classify the request as review, diagnosis, or implementation. In review mode, do not edit; return evidence-backed findings and proposed validation commands.
1. Discover the contract before editing:
   - Read repository instructions, root and affected `CMakeLists.txt` files, included `.cmake` modules, presets, toolchain files, CI configuration, and packaging tests.
   - Record the declared minimum CMake version, versions exercised by CI, and locally available version. Verify every syntax, module, property, and CLI option against the oldest supported version; use an existing compatible pattern or stop for approval before raising the minimum.
   - Run `cmake --version` and `cmake --help` when tool availability or generators matter. Do not install missing tools.
   - Trace affected targets, aliases, exported names, install rules, and downstream consumers. Preserve the existing minimum CMake version and local style.
2. Plan the target graph:
   - Define artifacts with `add_executable()` or `add_library()` and connect them with `target_link_libraries()`.
   - Put requirements on the target that owns them. Choose `PRIVATE` for implementation, `INTERFACE` for consumers, and `PUBLIC` only when both need the requirement.
   - Prefer target commands, header file sets, imported targets, and compile features over directory-wide state, raw paths, and global flags.
3. Implement the smallest change. Read [references/cmake-tutorial.md](references/cmake-tutorial.md) only for the relevant topic:
   - Project structure, language, variables, presets, and scopes.
   - Libraries, feature checks, generated files, testing, installation, exports, dependency discovery, aliases, or generator expressions.
4. Configure in a new out-of-source tree using an existing preset when available. Otherwise use:

   ```sh
   cmake -S . -B build
   ```

   Use `build` only when it is new or explicitly known to be disposable; otherwise choose a fresh path. Never reuse a tree with a different generator or toolchain.
5. Build through CMake's generator-independent interface:

   ```sh
   cmake --build build
   ```

   Add `--config <config>` for multi-configuration generators. Build the narrowest affected target first when supported.
6. Exercise the changed contract:
   - Run the produced program for build-graph changes.
   - Run `ctest --test-dir build --output-on-failure` on CMake 3.20+; on older supported versions, run `ctest --output-on-failure` with the build tree as the working directory. Add `-C <config>` for multi-configuration generators.
   - For install/export/package changes, use `cmake --install` on CMake 3.15+ or the project's compatible install target, install to a temporary prefix, and configure a minimal real consumer with `find_package()` and the exported namespaced target. `cmake --install --prefix` requires CMake 3.21+.
   - For generated files, verify a no-change rebuild does not regenerate and changing an input or generator does.
7. On failure, read the first relevant configure, compile, link, test, or package diagnostic. Make one targeted correction to the declared requirement and re-run the smallest failing command, then the full affected workflow. Stop and report evidence if the same diagnostic persists or proceeding requires a missing prerequisite, network access, destructive action, or compatibility break; do not suppress the error or keep guessing.

## Decision Rules

- New project: put `cmake_minimum_required()` first and `project()` near the top; choose the oldest version whose behavior the project requires and can test.
- C++ standard: prefer `target_compile_features(target PRIVATE|PUBLIC cxx_std_XX)` over globally forcing `CMAKE_CXX_STANDARD`.
- Headers: on CMake 3.23+, model public or installable headers with `target_sources(FILE_SET ... TYPE HEADERS ...)`; on older supported versions, preserve the project's target-scoped include and header-install pattern.
- Libraries: omit the type when the library genuinely supports user selection through `BUILD_SHARED_LIBS`; specify `STATIC`, `SHARED`, `MODULE`, `OBJECT`, or `INTERFACE` only when semantics require it.
- Dependencies: prefer `find_package()` and imported targets. Use `find_file()`, `find_library()`, `find_path()`, or `find_program()` only when no package target exists.
- Compiler and linker flags: use target-scoped options only when no feature-level abstraction exists. Guard frontend-specific flags and do not impose warnings-as-errors on downstream builds.
- Introspection: use a built-in `Check...` module only for a facility CMake or a discovered dependency does not already describe. On CMake before 3.19, preserve language-specific modules such as `CheckCXXSourceCompiles`. Preserve a tested fallback.
- Generated files: declare fixed `OUTPUT`, every input and generator in `DEPENDS`, and `VERBATIM`; connect the output to a consuming target.
- Installation: on CMake 3.23+, prefer `install(TARGETS ... EXPORT ... FILE_SET ...)`; on older supported versions, preserve compatible target and header install rules. Use `GNUInstallDirs`, a namespaced export, and package config/version files. Keep the prefix user-controlled.
- Generator expressions: use only in documented generator-expression contexts and only when the value is unavailable at configure time.

## Failure Handling

- Generator or toolchain changed in an existing build tree: configure a fresh tree; do not delete the old one without confirmation.
- A corrected feature check does not rerun: use a fresh build tree or remove only the relevant cache entry with approval; results are cached.
- An exported target references a missing target: export the full public dependency graph and use `find_dependency()` in the package config for external transitive dependencies.
- Single-config succeeds but multi-config fails: remove configure-time assumptions about `$<CONFIG>`, artifact paths, and `CMAKE_BUILD_TYPE`; validate with `--config` and `ctest -C`.
- A tool is unavailable: report the skipped check and exact missing prerequisite; never download it implicitly.

## Output

Report changed target relationships, compatibility or packaging effects, exact configure/build/test/install commands run, and skipped checks. Distinguish observed results from expectations.
