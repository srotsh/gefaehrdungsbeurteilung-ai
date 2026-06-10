<#
.SYNOPSIS
  Sync this product's src/core/* with the master shared-core/core/*.

.DESCRIPTION
  Run this from inside a product folder (e.g. C:\...\VorstandsprotokollAI):
    pwsh ./scripts/sync-core.ps1

  Behavior:
    1. Locates shared-core via core-version.json (or -SharedCore parameter).
    2. Detects local edits in src/core/* by comparing SHA256 hashes against
       the master. Prints a warning per drifted file and refuses to overwrite
       unless -Force is passed.
    3. Otherwise, replaces src/core/* with the master copy, promotes each
       _package.json -> package.json, and updates core-version.json.
    4. Appends an entry to CORE-SYNC.log in the project root.
#>

[CmdletBinding()]
param(
  [Parameter(Mandatory = $false)] [string] $SharedCore = "",
  [switch] $Force,
  [switch] $DryRun
)

$ErrorActionPreference = "Stop"

# Resolve project root: assume this script lives at <project>/scripts/sync-core.ps1
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ProjectCore = Join-Path $ProjectRoot "src\core"
$VersionJson = Join-Path $ProjectCore "core-version.json"

if (-not (Test-Path $ProjectCore)) {
  throw "src/core not found at $ProjectCore. Run from inside a scaffolded product."
}

# Resolve shared-core path
if (-not $SharedCore) {
  if (Test-Path $VersionJson) {
    $cv = Get-Content $VersionJson -Raw | ConvertFrom-Json
    if ($cv.shared_core_path) { $SharedCore = $cv.shared_core_path }
  }
}
if (-not $SharedCore -or -not (Test-Path $SharedCore)) {
  throw "shared-core path not resolved. Pass -SharedCore <path> or fix core-version.json."
}

$MasterCore  = Join-Path $SharedCore "core"
$VersionFile = Join-Path $SharedCore "VERSION"
if (-not (Test-Path $MasterCore))  { throw "Master core not found at $MasterCore" }
if (-not (Test-Path $VersionFile)) { throw "Master VERSION file missing at $VersionFile" }

$masterVersion = (Get-Content $VersionFile -Raw).Trim()
$localVersion  = if (Test-Path $VersionJson) {
  ((Get-Content $VersionJson -Raw | ConvertFrom-Json).version)
} else { "<none>" }

Write-Host "==> Sync-Core" -ForegroundColor Cyan
Write-Host "    project : $ProjectRoot"
Write-Host "    master  : $SharedCore  (v$masterVersion)"
Write-Host "    local   : v$localVersion"

# 1. Detect drift in src/core/*
Write-Host ""
Write-Host "==> Checking for local edits in src/core/..." -ForegroundColor Cyan

function Get-RelHashes($Root) {
  $map = @{}
  Get-ChildItem -Path $Root -Recurse -File | Where-Object {
    # Skip generated artifacts
    $_.FullName -notmatch "\\node_modules\\" -and
    $_.Name -ne "core-version.json" -and
    $_.Name -ne "package.json" -and
    $_.Name -ne "_package.json"
  } | ForEach-Object {
    $rel = $_.FullName.Substring($Root.Length).TrimStart('\','/')
    $map[$rel] = (Get-FileHash -Algorithm SHA256 -Path $_.FullName).Hash
  }
  return $map
}

$masterHashes = Get-RelHashes $MasterCore
$localHashes  = Get-RelHashes $ProjectCore

$drifted = @()
foreach ($k in $localHashes.Keys) {
  if ($masterHashes.ContainsKey($k) -and $masterHashes[$k] -ne $localHashes[$k]) {
    $drifted += $k
  }
}

if ($drifted.Count -gt 0) {
  Write-Host ""
  Write-Host "    !! Local edits detected in $($drifted.Count) file(s):" -ForegroundColor Yellow
  foreach ($d in $drifted) { Write-Host "       - $d" -ForegroundColor Yellow }
  if (-not $Force) {
    Write-Host ""
    Write-Host "    Refusing to overwrite. Either:" -ForegroundColor Red
    Write-Host "      - port the changes back into shared-core/core, then re-run; OR"
    Write-Host "      - re-run with -Force to discard local edits."
    exit 2
  } else {
    Write-Host "    -Force passed: drifted files will be overwritten." -ForegroundColor Yellow
  }
} else {
  Write-Host "    OK — no drift." -ForegroundColor Green
}

if ($DryRun) {
  Write-Host ""
  Write-Host "==> Dry run: nothing written." -ForegroundColor Cyan
  exit 0
}

# 2. Replace src/core/* with master
Write-Host ""
Write-Host "==> Copying master -> src/core/..." -ForegroundColor Cyan

# Preserve core-version.json across the wipe
$preservedVersion = $null
if (Test-Path $VersionJson) { $preservedVersion = Get-Content $VersionJson -Raw }

# Remove existing core dirs (but keep the parent ProjectCore folder)
Get-ChildItem -Path $ProjectCore -Force | Where-Object { $_.Name -ne "core-version.json" } | ForEach-Object {
  Remove-Item -Path $_.FullName -Recurse -Force
}

# Copy
Copy-Item -Path (Join-Path $MasterCore "*") -Destination $ProjectCore -Recurse -Force

# Promote _package.json -> package.json
Get-ChildItem -Path $ProjectCore -Filter "_package.json" -Recurse | ForEach-Object {
  $target = Join-Path $_.Directory.FullName "package.json"
  Move-Item -Path $_.FullName -Destination $target -Force
}

# Patch each package.json with main/types -> index.ts.
# WICHTIG: ohne BOM schreiben — webpack/Node-JSON-Parser akzeptieren kein BOM.
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
Get-ChildItem -Path $ProjectCore -Directory | ForEach-Object {
  $pkgJson = Join-Path $_.FullName "package.json"
  if (Test-Path $pkgJson) {
    $json = Get-Content $pkgJson -Raw | ConvertFrom-Json
    if (-not $json.main)  { $json | Add-Member -NotePropertyName main  -NotePropertyValue "index.ts" -Force }
    if (-not $json.types) { $json | Add-Member -NotePropertyName types -NotePropertyValue "index.ts" -Force }
    [System.IO.File]::WriteAllText($pkgJson, ($json | ConvertTo-Json -Depth 32), $utf8NoBom)
  }
}

# 3. Update core-version.json
$coreVersion = [ordered]@{
  version          = $masterVersion
  synced_at        = (Get-Date).ToString("o")
  shared_core_path = $SharedCore
  previous_version = $localVersion
}
[System.IO.File]::WriteAllText($VersionJson, ($coreVersion | ConvertTo-Json), $utf8NoBom)

# 4. Append to CORE-SYNC.log
$logLine = "{0}  {1} -> {2}  {3}" -f (Get-Date).ToString("o"), $localVersion, $masterVersion, $SharedCore
Add-Content -Path (Join-Path $ProjectRoot "CORE-SYNC.log") -Value $logLine -Encoding UTF8

Write-Host ""
Write-Host "==> Synced to v$masterVersion." -ForegroundColor Green
Write-Host "    Run 'pnpm install' to refresh workspace links." -ForegroundColor DarkGray
