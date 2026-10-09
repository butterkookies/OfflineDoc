<#
.SYNOPSIS
    OfflineDoc - Model & Binary Setup Script
.DESCRIPTION
    Downloads the prebuilt Windows binaries (whisper.cpp, llama.cpp) and
    the on-device model weights (ggml-base.bin, Qwen2.5-1.5B-Instruct-Q4_K_M.gguf).
    NOTE: Internet connection is required ONLY during this one-time setup!
#>

[CmdletBinding()]
param(
    [switch]$SkipBinaries,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $PSScriptRoot
$BinDir = Join-Path $RootDir "bin"
$ModelsDir = Join-Path $RootDir "models"

New-Item -ItemType Directory -Force -Path $BinDir | Out-Null
New-Item -ItemType Directory -Force -Path $ModelsDir | Out-Null

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " OfflineDoc: Local AI Setup Script (One-Time Setup)" -ForegroundColor Cyan
Write-Host " Note: Internet is required ONLY now to fetch models." -ForegroundColor Yellow
Write-Host " All runtime operations run 100% offline in Airplane Mode." -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

function Download-FileWithProgress {
    param (
        [string]$Url,
        [string]$DestinationPath,
        [string]$Description
    )

    if ((Test-Path $DestinationPath) -and -not $Force) {
        $size = (Get-Item $DestinationPath).Length / 1MB
        Write-Host " [ALREADY PRESENT] $Description ($([math]::Round($size, 1)) MB)" -ForegroundColor Green
        return
    }

    Write-Host " [DOWNLOADING] $Description..." -ForegroundColor Yellow
    Write-Host "  From: $Url" -ForegroundColor DarkGray
    Write-Host "  To:   $DestinationPath" -ForegroundColor DarkGray

    try {
        $wc = New-Object System.Net.WebClient
        $wc.DownloadFile($Url, $DestinationPath)
        $size = (Get-Item $DestinationPath).Length / 1MB
        Write-Host "  -> Success ($([math]::Round($size, 1)) MB)" -ForegroundColor Green
    }
    catch {
        Write-Host "  -> Download failed: $_" -ForegroundColor Red
        throw $_
    }
}

# 1. Download Multilingual Whisper Small Model (~466 MB) - matches config.example.toml
$whisperModelUrl = "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin"
$whisperModelPath = Join-Path $ModelsDir "ggml-small.bin"
Download-FileWithProgress -Url $whisperModelUrl -DestinationPath $whisperModelPath -Description "Whisper Small Multilingual Model (ggml-small.bin)"

# 2. Download Qwen2.5 1.5B Instruct Q4_K_M GGUF (~986 MB)
$qwenModelUrl = "https://huggingface.co/Qwen/Qwen2.5-1.5B-Instruct-GGUF/resolve/main/qwen2.5-1.5b-instruct-q4_k_m.gguf"
$qwenModelPath = Join-Path $ModelsDir "Qwen2.5-1.5B-Instruct-Q4_K_M.gguf"
Download-FileWithProgress -Url $qwenModelUrl -DestinationPath $qwenModelPath -Description "Qwen2.5-1.5B Instruct Q4_K_M GGUF"

# 3. Setup Binaries if not skipped
if (-not $SkipBinaries) {
    $whisperExe = Join-Path $BinDir "whisper-cli.exe"
    $llamaExe = Join-Path $BinDir "llama-server.exe"

    if ((Test-Path $whisperExe) -and (Test-Path $llamaExe)) {
        Write-Host " [ALREADY PRESENT] Local binaries (whisper-cli.exe, llama-server.exe)" -ForegroundColor Green
    }
    else {
        Write-Host ""
        Write-Host " Binary notice: If whisper-cli.exe or llama-server.exe are not in bin/," -ForegroundColor Cyan
        Write-Host " download the prebuilt Windows x64 zip from GitHub releases:" -ForegroundColor Cyan
        Write-Host "  - whisper.cpp: https://github.com/ggerganov/whisper.cpp/releases" -ForegroundColor Gray
        Write-Host "  - llama.cpp:   https://github.com/ggerganov/llama.cpp/releases" -ForegroundColor Gray
        Write-Host " and extract whisper-cli.exe and llama-server.exe into '$BinDir'." -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host " Setup complete! Next: run .\scripts\start.ps1 to launch." -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
