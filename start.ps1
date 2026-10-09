# start.ps1: Launch OfflineDoc local server
# Usage: powershell -ExecutionPolicy Bypass -File start.ps1

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  OfflineDoc: Launching Local AI BHW Assistant (127.0.0.1:8000)" -ForegroundColor Cyan
Write-Host "  Mode: 100% Air-Gapped Offline" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# Start server
python -m uvicorn server:app --host 127.0.0.1 --port 8000
