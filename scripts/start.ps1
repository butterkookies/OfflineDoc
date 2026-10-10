# scripts/start.ps1: Launch OfflineDoc local server
# Usage: powershell -ExecutionPolicy Bypass -File .\scripts\start.ps1

$rootDir = Split-Path -Parent $PSScriptRoot
Set-Location $rootDir

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  OfflineDoc: Launching Local AI BHW Assistant (127.0.0.1:8000)" -ForegroundColor Cyan
Write-Host "  Mode: 100% Air-Gapped Offline" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# Start server
py -m uvicorn server:app --host 127.0.0.1 --port 8000
