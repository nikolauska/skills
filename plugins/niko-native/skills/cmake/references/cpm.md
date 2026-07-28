# CPM.cmake

[CPM.cmake](https://github.com/cpm-cmake/CPM.cmake) is a thin wrapper around CMake's `FetchContent` for fetching source dependencies during configuration. Use it only when the project already uses CPM or explicitly chooses source fetching; prefer `find_package()` and imported targets when dependencies are supplied externally.

## Add CPM to a project

Vendor a reviewed, pinned CPM release as `cmake/CPM.cmake` and commit it. Verify that release supports the project's oldest CMake version. Do not download CPM or dependencies during configure without explicit approval. Keep the CPM version separate from dependency versions, and update it deliberately from an upstream release.

```cmake
include(cmake/CPM.cmake)
```

The upstream `get_cpm.cmake` release asset can bootstrap CPM, but committing the reviewed script avoids an unpinned configure-time network dependency.

## Add and use a dependency

Prefer named arguments: they make source, version, and package options reviewable.

```cmake
CPMAddPackage(
  NAME fmt
  GITHUB_REPOSITORY fmtlib/fmt
  VERSION 11.2.0
  GIT_TAG 40626af88bd7df9a5fb80be7b25ac85b122d6c21 # fmt 11.2.0
  OPTIONS
    "FMT_DOC OFF"
    "FMT_TEST OFF"
  EXCLUDE_FROM_ALL YES
  SYSTEM YES
)

target_link_libraries(app PRIVATE fmt::fmt)
```

- Pin `GIT_TAG` to an immutable commit hash for reproducible, tamper-resistant builds; a release tag is readable but can move.
- Set dependency cache options before its targets are created. With CPM, pass them through `OPTIONS` instead of mutating the dependency afterward.
- Link the dependency's documented target. Do not consume raw include or library paths when a target exists.
- Use `DOWNLOAD_ONLY YES` only when the dependency does not provide usable CMake targets; then create the minimum target needed from `<name>_SOURCE_DIR`.
- Use `EXCLUDE_FROM_ALL YES` to keep dependency targets out of the default build and `SYSTEM YES` to treat dependency include directories as system headers when supported by the project's CMake version.

CPM also supports shorthand such as `CPMAddPackage("gh:fmtlib/fmt@11.2.0")`. Prefer the named form when options, source provenance, or overrides matter.

The shell examples below use POSIX paths and quoting; use equivalent absolute paths and syntax on other platforms.

## Local packages and overrides

To prefer externally installed packages while retaining a source fallback:

```sh
cmake -S . -B build -DCPM_USE_LOCAL_PACKAGES=ON
```

Use `CPM_LOCAL_PACKAGES_ONLY=ON` for network-free configurations that must fail when a local dependency is missing. For development against a local checkout, set `CPM_<name>_SOURCE` to its absolute path, for example `-DCPM_fmt_SOURCE=/work/fmt`.

`CPMFindPackage()` performs `find_package()` first and falls back to `CPMAddPackage()`. Do not use the fallback for installed package exports: public dependencies still belong in the generated package config via `find_dependency()`.

## Cache and dependency resolution

Set `CPM_SOURCE_CACHE` outside the source and build trees to reuse downloads and support offline reconfiguration after the cache is populated:

```sh
cmake -S . -B build -DCPM_SOURCE_CACHE="$HOME/.cache/CPM"
```

CPM uses the first version added for a dependency in a diamond graph and warns when a later requirement asks for a newer version. Declare the selected version in the top-level project before transitive users.

For a large transitive graph, load a package lock immediately after CPM:

```cmake
include(cmake/CPM.cmake)
CPMUsePackageLock(package-lock.cmake)
```

Update it explicitly with `cmake --build build --target cpm-update-package-lock`, review the diff, and commit it.

## Validation

A CPM change requires a fresh, out-of-source configure because fetching and package options are resolved during configuration. With network access explicitly approved, configure, build the affected target, and run it. Also verify the intended mode:

- Default mode fetches the pinned source and exposes the documented target.
- `CPM_USE_LOCAL_PACKAGES=ON` selects a compatible installed package when present.
- `CPM_LOCAL_PACKAGES_ONLY=ON` performs no fallback download.
- A second configure using a populated `CPM_SOURCE_CACHE` succeeds without fetching again.

CPM builds dependencies from source in each build tree, depends on their CMake projects behaving correctly as subprojects, and changes several CMake policies to `NEW`. Use an external package manager when prebuilt binaries, centralized dependency resolution, or stronger package isolation are required.
