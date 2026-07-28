# CMake Tutorial Reference

Source basis: every page in the official CMake 4.4.0 tutorial, Steps 0–11, retrieved from <https://cmake.org/cmake/help/v4.4/guide/tutorial/index.html> on 2026-07-21. Use this as a compact implementation guide; use installed `cmake --help-command`, `--help-module`, `--help-variable`, and `--help-property` documentation for exact behavior supported by the project's CMake version.

## Configure and Build

CMake generates a native build system; it is not normally the compiler or build tool.

```sh
cmake --version
cmake --help                         # includes available generators
cmake -S . -B build                 # configure out of source
cmake --build build                 # generator-independent build
```

- Select a generator with `-G` or `CMAKE_GENERATOR`. A build tree cannot switch generators.
- Single-config generators such as Ninja and Unix Makefiles select a variant at configure time, commonly with `-DCMAKE_BUILD_TYPE=Debug`.
- Multi-config generators such as Visual Studio, Xcode, and Ninja Multi-Config select it at build/test/install time with `--config Debug`, `ctest -C Debug`, and `cmake --install ... --config Debug`.
- Use presets when the repository provides them. `CMakePresets.json` is project-owned and may be committed; `CMakeUserPresets.json` is for local user settings and should not be assumed portable.

The examples follow the tutorial's CMake 3.23 minimum. For an older supported project, preserve its established compatible pattern. Key gates:

| Form | Requires | Older-version path |
| --- | --- | --- |
| `target_sources(FILE_SET HEADERS ...)` and installing file sets | 3.23 | Preserve target-scoped build/install include interfaces and compatible `install(FILES|DIRECTORY ...)` rules. |
| `ctest --test-dir` | 3.20 | Run CTest with the build tree as the working directory. |
| `cmake --install` | 3.15 | Use the project's compatible install target or workflow. |
| `cmake --install --prefix` | 3.21 | Configure a fresh validation tree with a temporary `CMAKE_INSTALL_PREFIX`, then use the compatible install workflow. |
| `CheckSourceCompiles` | 3.19 | Use the supported language-specific module, such as `CheckCXXSourceCompiles`. |
| `return(PROPAGATE ...)` | 3.25 | Use `set(... PARENT_SCOPE)` for explicit outputs. |

Validate with the oldest supported CMake when available; otherwise report that compatibility check as skipped.

## Projects, Directories, and Targets

```cmake
cmake_minimum_required(VERSION 3.23)
project(MyProject)

add_subdirectory(lib)
add_subdirectory(app)
```

`cmake_minimum_required()` establishes policy behavior. Preserve an existing project's minimum; for a new project select the oldest required and tested version.

Targets are named property collections. Model artifacts and relationships rather than assembling global flags:

```cmake
add_library(core)
target_sources(core
  PRIVATE
    src/core.cxx
  PUBLIC
    FILE_SET public_headers
    TYPE HEADERS
    BASE_DIRS include
    FILES include/core/core.h
)

target_compile_features(core PUBLIC cxx_std_20)

add_executable(app)
target_sources(app PRIVATE app/main.cxx)
target_link_libraries(app PRIVATE core)
```

Scope invariant:

| Scope | Owner uses it | Consumers inherit it |
| --- | --- | --- |
| `PRIVATE` | yes | no |
| `PUBLIC` | yes | yes |
| `INTERFACE` | no | yes |

Implementation sources are normally `PRIVATE`. A public header, compile feature, definition, or dependency is `PUBLIC` only when both the target and its consumers require it. Every requirement on an interface library is `INTERFACE`.

Prefer dedicated commands such as `target_sources()`, `target_link_libraries()`, `target_compile_features()`, and `target_compile_definitions()` over direct property mutation. Use `set_target_properties()` and `get_target_property()` when no dedicated command exists.

## CMake Language

CMake values are strings; lists are semicolon-separated strings.

```cmake
set(items Alpha Beta)
list(APPEND items Gamma)
foreach(item IN LISTS items)
  message("${item}")
endforeach()
```

- Run standalone `.cmake` scripts with `cmake -P script.cmake`. Put script inputs before `-P`: `cmake -DNAME=VALUE -P script.cmake`.
- Use `list()` operations rather than hand-building semicolon strings.
- `if()` recognizes documented true/false constants and otherwise may interpret an unquoted token as a variable name. Use consistent `ON`/`OFF` values.
- A macro runs in its caller's scope and can mutate caller variables.
- A function has its own variable scope. Return selected values with `set(name value PARENT_SCOPE)` or, when the minimum version permits, `return(PROPAGATE name)`.
- `ARGV` contains all arguments; `ARGN` contains arguments after declared parameters.
- `${name}` expands a value. `${${name}}` performs intentional indirection when `name` stores another variable's name.
- Use CMake language for build logic. Put substantial generation or transformation logic in an appropriate general-purpose tool and invoke it through the build graph.

## Options, Cache, and Presets

```cmake
option(MYPROJECT_BUILD_TOOLS "Build project tools" ON)
if(MYPROJECT_BUILD_TOOLS)
  add_subdirectory(tools)
endif()

set(MYPROJECT_BACKEND "default" CACHE STRING "Backend selection")
```

Configure values with `-DNAME=VALUE`. Cache entries are global to and persistent within a build tree in `CMakeCache.txt`; entries use `<Name>:<Type>=<Value>`, though the type is only a hint because all values are strings. A cache initializer does not overwrite an existing user value, while a later `-D` updates it. A same-named normal variable hides the cache value until `unset(NAME)` removes that normal binding; avoid this shadowing.

Guarding `add_subdirectory()` with an option excludes those targets from configuration, unlike selecting a target at build time or excluding it from the default `ALL` target. This can avoid expensive configuration and keep conditional install rules simple.

CMake-provided `CMAKE_` variables affect global configuration. Treat them as user or toolchain inputs, not project constants; overriding a packager-selected `CMAKE_<LANG>_STANDARD` can create incompatible artifacts. Presets can define generators, binary directories, cache variables, environment, and inheritance. Keep machine-specific values in user presets rather than committed project presets.

## Target Features, Definitions, and Flags

```cmake
target_compile_features(core PUBLIC cxx_std_20)
target_compile_definitions(core PRIVATE CORE_USE_FAST_PATH)
target_precompile_headers(core PRIVATE common.h)
```

Compile definitions omit `-D`; CMake supplies toolchain syntax. Prefer compile features to global standard settings. Public headers that require a language feature make it `PUBLIC`; implementation-only use is `PRIVATE`.

Use exact flags only when no higher-level CMake feature describes the requirement:

```cmake
if(CMAKE_CXX_COMPILER_FRONTEND_VARIANT STREQUAL "MSVC")
  target_compile_options(app PRIVATE /W4)
elseif(CMAKE_CXX_COMPILER_FRONTEND_VARIANT STREQUAL "GNU")
  target_compile_options(app PRIVATE -Wall -Wextra -Wpedantic)
endif()
```

`CMAKE_<LANG>_COMPILER_FRONTEND_VARIANT` is not populated consistently before CMake 3.26; preserve compatible compiler-ID logic in older projects. Avoid unconditional warnings-as-errors for downstream builds. Prefer header file sets to raw include directories and imported targets to raw link directories.

## Library Kinds

```cmake
add_library(normal)             # BUILD_SHARED_LIBS selects STATIC or SHARED
add_library(plugin MODULE)
add_library(parts OBJECT)
add_library(headers INTERFACE)
```

- Use an untyped normal library only when both static and shared forms work.
- A `MODULE` is loaded at runtime and is not linked like a normal shared library.
- An `INTERFACE` library produces no artifact and carries only usage requirements.
- An `OBJECT` library compiles objects without archiving or linking them. Its object files do not propagate transitively through another target's interface; link object libraries directly into the aggregate that needs their objects.
- An `IMPORTED` target represents a dependency defined outside the project.

A header-only target can own a header file set:

```cmake
add_library(headers INTERFACE)
target_sources(headers INTERFACE
  FILE_SET HEADERS
  BASE_DIRS include
  FILES include/project/api.h
)
```

List installable headers explicitly. Omitting the list can still build because compiler dependency scanning sees included headers, but installation and IDE metadata need known files.

## System Introspection

Probe only facilities not already represented by CMake or a discovered package.

```cmake
include(CheckIncludeFiles)
check_include_files(emmintrin.h HAVE_EMMINTRIN_H LANGUAGE CXX)

include(CheckSourceCompiles)
check_source_compiles(CXX [=[
  int main() { return __builtin_expect(0, 0); }
]=] HAVE_BUILTIN_EXPECT)
```

Use the result to select a target-scoped definition and retain a fallback. `check_source_compiles()` normally compiles and links an executable, so provide a valid `main()`. Results are cached.

```cmake
include(CheckIPOSupported)
check_ipo_supported(RESULT ipo_supported OUTPUT ipo_error)
if(ipo_supported)
  set(CMAKE_INTERPROCEDURAL_OPTIMIZATION TRUE)
endif()
```

Set initialization variables before creating affected targets. IPO on one target does not configure its dependencies; presets or toolchain files are often better for coherent whole-build optimization.

## Custom Commands and Generated Files

Declare fixed outputs and complete dependencies:

```cmake
add_executable(generator generator.cxx)
add_custom_command(
  OUTPUT "${CMAKE_CURRENT_BINARY_DIR}/generated.cxx"
  COMMAND generator -i "${CMAKE_CURRENT_SOURCE_DIR}/input.txt" -o generated.cxx
  DEPENDS generator "${CMAKE_CURRENT_SOURCE_DIR}/input.txt"
  VERBATIM
)
add_library(generated OBJECT "${CMAKE_CURRENT_BINARY_DIR}/generated.cxx")
```

Naming an executable target in `COMMAND` establishes ordering. Also list it in `DEPENDS` so rebuilding the generator reruns generation. CMake must know output paths before running the generator.

An interface library has no build step. Pull a generated header into the graph explicitly:

```cmake
add_custom_command(
  OUTPUT "${CMAKE_CURRENT_BINARY_DIR}/generated.h"
  COMMAND header_generator "${CMAKE_CURRENT_BINARY_DIR}/generated.h"
  DEPENDS header_generator
  VERBATIM
)
add_custom_target(generate_header DEPENDS "${CMAKE_CURRENT_BINARY_DIR}/generated.h")
add_library(generated_headers INTERFACE)
target_sources(generated_headers INTERFACE
  FILE_SET HEADERS
  BASE_DIRS "${CMAKE_CURRENT_BINARY_DIR}"
  FILES "${CMAKE_CURRENT_BINARY_DIR}/generated.h"
)
add_dependencies(generated_headers generate_header)
```

## Testing with CTest

```cmake
option(BUILD_TESTING "Enable testing and build tests" ON)
if(BUILD_TESTING)
  enable_testing()
  add_subdirectory(tests)
endif()
```

`include(CTest)` provides the conventional `BUILD_TESTING` option and broader integration. Call `enable_testing()` at the project root. Gate registration and test targets together.

```cmake
add_executable(core_tests core_tests.cxx)
target_link_libraries(core_tests PRIVATE core)
add_test(NAME core.add COMMAND core_tests add)
```

CTest treats exit code zero as pass and nonzero as fail. A target name in `COMMAND` lets CMake resolve its path. Register logical cases separately so `ctest -R` can select and report them independently.

```sh
ctest --test-dir build --output-on-failure
ctest --test-dir build -R core.add
ctest --test-dir build -C Debug --output-on-failure  # multi-config
```

## Installation, Exports, and Packages

Use target installation and standard destinations:

```cmake
include(GNUInstallDirs)
install(TARGETS core
  EXPORT MyProjectTargets
  FILE_SET public_headers
)
install(EXPORT MyProjectTargets
  DESTINATION "${CMAKE_INSTALL_LIBDIR}/cmake/MyProject"
  NAMESPACE MyProject::
)
```

- Preserve default destinations unless a required layout needs a subdirectory.
- Name every installed file set and list its files.
- Keep conditional target creation and installation under the same condition.
- Keep `CMAKE_INSTALL_PREFIX` user-controlled. Users can configure it or override one invocation with `cmake --install build --prefix <dir>`.
- Export every target needed to reconstruct public target relationships.

Provide a package config beside the export:

```cmake
include("${CMAKE_CURRENT_LIST_DIR}/MyProjectTargets.cmake")
```

Generate version compatibility metadata rather than hand-writing it:

```cmake
include(CMakePackageConfigHelpers)
write_basic_package_version_file(
  MyProjectConfigVersion.cmake
  COMPATIBILITY SameMajorVersion
)
```

Install `MyProjectConfig.cmake` and the generated version file beside the target export. Validate the installed package with a separate consumer; inspecting files alone does not prove relocation or dependency discovery.

## Finding Dependencies

Preferred order:

1. `find_package()`.
2. Link package-provided imported targets.
3. Fall back to `find_file()`, `find_library()`, `find_path()`, or `find_program()` only when no package model exists.

```cmake
find_package(ForeignLibrary REQUIRED)
target_link_libraries(app PRIVATE ForeignLibrary::ForeignLibrary)
```

- `REQUIRED` aborts configuration when a mandatory dependency is absent.
- `QUIET` suppresses messages for a genuinely optional lookup.
- Avoid unnecessary version constraints; let dependency management select versions when possible.
- Expose install prefixes through user configuration, presets, or `CMAKE_PREFIX_PATH`, not hard-coded project paths.

An installed package must rediscover public external dependencies before loading an export that references their targets:

```cmake
include(CMakeFindDependencyMacro)
find_dependency(TransitiveDep)
include("${CMAKE_CURRENT_LIST_DIR}/MyProjectTargets.cmake")
```

`find_dependency()` forwards relevant `QUIET` and `REQUIRED` behavior from the outer package lookup.

## Aliases and Generator Expressions

Offer one namespaced target name for installed and vendored use:

```cmake
add_library(MyProject::core ALIAS core)
```

The alias lets an `add_subdirectory()` consumer use the same name that `install(EXPORT ... NAMESPACE MyProject::)` provides after `find_package()`.

Generator expressions evaluate during build-system generation in contexts that explicitly support them:

```cmake
target_compile_definitions(app PRIVATE "APP_BUILD_CONFIG=$<CONFIG>")
```

Use them for configuration-dependent or otherwise deferred values. Do not treat `$<CONFIG>` as a configure-time value. Header file sets replace many older build-interface/install-interface include-directory expressions.

## End-to-End Validation

Use the repository's presets and commands when present. Otherwise adapt this sequence:

```sh
cmake -S . -B build
cmake --build build
ctest --test-dir build --output-on-failure
cmake --install build --prefix install
```

For packaging changes, create a separate consumer that runs `find_package(MyProject REQUIRED)` and links `MyProject::core`, configure it with the temporary prefix in `CMAKE_PREFIX_PATH`, build it, and run it. For multi-config generators, pass the same configuration consistently to build, CTest, and install.
