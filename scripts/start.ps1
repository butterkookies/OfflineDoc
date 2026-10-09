<#
.SYNOPSIS
    OfflineDoc - Master Local Startup Script
.DESCRIPTION
    Starts llama-server on 127.0.0.1:8081, checks local models,
    and launches the FastAPI backend + Mobile PWA on 127.0.0.1:8000.
    100% OFFLINE - RUNS IN AIRPLANE MODE.
#>

[CmdletBinding()]
param(
    [switch]$NoBrowser,
    [switch]$CpuOnly
)

$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $PSScriptRoot
$BinDir = Join-Path $RootDir "bin"
$ModelsDir = Join-Path $RootDir "models"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting OfflineDoc (100% Offline Local AI Mode)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Kill stale processes on ports 8000 and 8081 if any
function Stop-PortProcess {
    param([int]$Port)
    $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($connections) {
        $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($pidToKill in $pids) {
            if ($pidToKill -gt 0) {
                Write-Host " Freeing port $Port (Process ID $pidToKill)..." -ForegroundColor Yellow
                Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

Stop-PortProcess -Port 8000
Stop-PortProcess -Port 8081

# 2. Check local models
$whisperModel = Join-Path $ModelsDir "ggml-base.bin"
$qwenModel = Join-Path $ModelsDir "Qwen2.5-1.5B-Instruct-Q4_K_M.gguf"
$llamaExe = Join-Path $BinDir "llama-server.exe"

if (-not (Test-Path $whisperModel)) {
    Write-Host " [WARNING] Whisper model missing at '$whisperModel'." -ForegroundColor Yellow
    Write-Host " Run '.\scripts\setup_models.ps1' to download it." -ForegroundColor Yellow
}

$llamaProcess = $null
if ((Test-Path $llamaExe) -and (Test-Path $qwenModel)) {
    Write-Host " Launching llama-server on http://127.0.0.1:8081..." -ForegroundColor Green
    $gpuFlag = if ($CpuOnly) { "-ngl 0" } else { "-ngl 99" }
    $llamaArgs = "-m `"$qwenModel`" --port 8081 --host 127.0.0.1 -c 2048 -t 4 $gpuFlag"
    
    $llamaProcess = Start-Process -FilePath $llamaExe -ArgumentList $llamaArgs -PassThru -WindowStyle Minimized
    Write-Host " llama-server process started (PID: $($llamaProcess.Id))." -ForegroundColor DarkGray
    Start-Sleep -Seconds 2
} else {
    Write-Host " [NOTICE] llama-server or model not found in bin/ or models/." -ForegroundColor Yellow
    Write-Host " Backend will run in mock/standby mode until models are added." -ForegroundColor Gray
}

# 3. Launch FastAPI backend
Write-Host " Launching OfflineDoc Web App on http://127.0.0.1:8000..." -ForegroundColor Cyan

if (-not $NoBrowser) {
    Start-Job -ScriptBlock {
        Start-Sleep -Seconds 2
        Start-Process "http://127.0.0.1:8000"
    } | Out-Null
}

try {
    Set-Location $RootDir
    python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
}
finally {
    if ($llamaProcess -and -not $llamaProcess.HasExited) {
        Write-Host " Stopping llama-server (PID: $($llamaProcess.Id))..." -ForegroundColor DarkGray
        Stop-Process -Id $llamaProcess.Id -Force -ErrorAction SilentlyContinue
    }
}
