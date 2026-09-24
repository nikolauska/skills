---
name: vsdevshell
description: Loads the installed Visual Studio Developer PowerShell environment for Windows build tools such as MSBuild, CL, CMake, and Windows SDK utilities. Use when those tools are missing or a Windows build requires Visual Studio environment variables.
---

# Visual Studio Developer Shell

Use only on Windows with Visual Studio or Build Tools installed. Run discovery, initialization, and build in the same PowerShell process; if the command runner isolates commands, use one `pwsh -NoProfile -Command` invocation. Environment changes do not cross process boundaries.

Choose target architecture (`x86`, `amd64`, `arm`, or `arm64`) and machine host architecture (normally `amd64` on 64-bit Windows); both default to `amd64` below. If `$env:VSCMD_VER` is set, reuse that shell only when `$env:VSCMD_ARG_TGT_ARCH` and `$env:VSCMD_ARG_HOST_ARCH` match the requested architectures. Otherwise start a fresh PowerShell process rather than layering environments.
When already initialized with matching architectures, skip discovery and launch; verify the required tools and build in that shell. Otherwise, in a fresh process, use:

```powershell
$vswhere = Join-Path ${env:ProgramFiles(x86)} 'Microsoft Visual Studio\Installer\vswhere.exe'
if (-not (Test-Path $vswhere)) { throw 'Visual Studio Installer (vswhere.exe) was not found.' }

$vsPath = & $vswhere -latest -products * -requires Microsoft.Component.MSBuild -property installationPath
if (-not $vsPath) { throw 'No Visual Studio installation with MSBuild was found.' }

$launch = Join-Path $vsPath 'Common7\Tools\Launch-VsDevShell.ps1'
if (-not (Test-Path $launch)) { throw "Developer PowerShell launcher was not found under $vsPath." }

& $launch -Arch amd64 -HostArch amd64 -SkipAutomaticLocation
Get-Command msbuild -ErrorAction Stop
msbuild -version
```

Pass the requested target to `-Arch` and host to `-HostArch`; verify only tools needed for the task before building. Replace `-latest` only when the user or project selects a specific installation. If a build command is missing, report the likely missing workload or component; do not install or repair Visual Studio workloads or modules automatically.

Do not change PowerShell execution policy or modify the machine without user confirmation. If policy blocks the launcher, report the error and ask how to proceed; do not weaken the policy. Never dump the full environment or write it to `.env`, since it may contain secrets.
