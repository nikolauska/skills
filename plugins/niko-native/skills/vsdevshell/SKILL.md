---
name: vsdevshell
description: Loads the installed Visual Studio Developer PowerShell environment for Windows build tools such as MSBuild, CL, CMake, and Windows SDK utilities. Use when those tools are missing or a Windows build requires Visual Studio environment variables.
---

# Visual Studio Developer Shell

Load Visual Studio's built-in developer environment in the same PowerShell process that runs the build.

## Constraints

- Use only on Windows with Visual Studio or Build Tools installed.
- Use the bundled `vswhere.exe` and `Launch-VsDevShell.ps1`; do not install another module.
- Never install or repair Visual Studio workloads, change PowerShell execution policy, or modify the machine without user confirmation.
- Never dump the full environment or write it to `.env`; it may contain secrets.

## Workflow

1. Default the requested target and host architectures to `amd64`. If `$env:VSCMD_VER` is set, reuse the current environment only when `$env:VSCMD_ARG_TGT_ARCH` and `$env:VSCMD_ARG_HOST_ARCH` match; otherwise start a fresh PowerShell process.
2. Locate an installation that includes MSBuild:

   ```powershell
   $vswhere = Join-Path ${env:ProgramFiles(x86)} 'Microsoft Visual Studio\Installer\vswhere.exe'
   if (-not (Test-Path $vswhere)) { throw 'Visual Studio Installer (vswhere.exe) was not found.' }

   $vsPath = & $vswhere -latest -products * -requires Microsoft.Component.MSBuild -property installationPath
   if (-not $vsPath) { throw 'No Visual Studio installation with MSBuild was found.' }
   ```

3. Enter Developer PowerShell without changing the working directory. Default to an x64 host and target unless the build requires another architecture:

   ```powershell
   $launch = Join-Path $vsPath 'Common7\Tools\Launch-VsDevShell.ps1'
   if (-not (Test-Path $launch)) { throw "Developer PowerShell launcher was not found under $vsPath." }

   & $launch -Arch amd64 -HostArch amd64 -SkipAutomaticLocation
   ```

4. Verify only the tools required by the task, then run the build:

   ```powershell
   Get-Command msbuild -ErrorAction Stop
   msbuild -version
   ```

5. If the command runner starts a fresh process for every command, put discovery, initialization, verification, and the build in one `pwsh -NoProfile -Command` invocation. Environment changes do not cross process boundaries.

## Architecture mapping

Pass the requested target to `-Arch`: `x86`, `amd64`, `arm`, or `arm64`. Pass the machine architecture to `-HostArch`, normally `amd64` on 64-bit Windows.

For a different architecture after initialization, start a fresh PowerShell process instead of layering environments.

## Failure handling

- Missing build command after initialization: report the likely missing Visual Studio workload or component; do not install it automatically.
- Multiple installations: replace `-latest` only when the user or project selects a specific version or installation.
- Script blocked by execution policy: report the policy error and ask the user how to proceed; do not weaken the policy.

Adapted from [awakecoding/VsDevShell](https://github.com/awakecoding/VsDevShell/blob/master/skills/vsdevshell/SKILL.md), using Visual Studio's native Developer PowerShell launcher.
