# scripts/setup_models.ps1: Download models and binaries
# Usage: powershell -ExecutionPolicy Bypass -File .\scripts\setup_models.ps1

$rootDir = Split-Path -Parent $PSScriptRoot
Set-Location $rootDir
& (Join-Path $rootDir "setup_models.ps1")
