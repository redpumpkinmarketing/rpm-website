$ErrorActionPreference = 'Stop'
$env:ASTRO_TELEMETRY_DISABLED = '1'
$rpmBundledNode = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$rpmNode = (Get-Command node -ErrorAction SilentlyContinue).Source
if (Test-Path -LiteralPath $rpmBundledNode) { $rpmNode = $rpmBundledNode }
if (-not $rpmNode) { throw 'Install Node.js 22.19 or newer before starting the preview.' }
Set-Location (Split-Path -Parent $PSScriptRoot)
& $rpmNode node_modules/astro/bin/astro.mjs dev --host 127.0.0.1
