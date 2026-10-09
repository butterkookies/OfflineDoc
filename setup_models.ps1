# setup_models.ps1: Download binaries and models for OfflineDoc
# Usage: powershell -ExecutionPolicy Bypass -File setup_models.ps1

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  OfflineDoc: Local AI Engine Setup (whisper.cpp + llama.cpp)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Create directories
$binDir = Join-Path $PSScriptRoot "bin"
$modelsDir = Join-Path $PSScriptRoot "models"
$dataDir = Join-Path $PSScriptRoot "data"
$visitsDir = Join-Path $dataDir "visits"
$patientsDir = Join-Path $dataDir "patients"

New-Item -ItemType Directory -Force -Path $binDir | Out-Null
New-Item -ItemType Directory -Force -Path $modelsDir | Out-Null
New-Item -ItemType Directory -Force -Path $visitsDir | Out-Null
New-Item -ItemType Directory -Force -Path $patientsDir | Out-Null

# 1. Download whisper.cpp Windows x64 binary
$whisperExe = Join-Path $binDir "whisper-cli.exe"
if (-not (Test-Path $whisperExe)) {
    Write-Host "`n[1/4] Downloading whisper.cpp Windows binary..." -ForegroundColor Yellow
    $whisperZip = Join-Path $binDir "whisper-bin-x64.zip"
    $whisperUrl = "https://github.com/ggerganov/whisper.cpp/releases/download/v1.7.4/whisper-bin-x64.zip"
    
    Invoke-WebRequest -Uri $whisperUrl -OutFile $whisperZip -UserAgent "OfflineDoc-Installer"
    Expand-Archive -Path $whisperZip -DestinationPath $binDir -Force
    Remove-Item -Path $whisperZip -Force
    
    # Check if extracted file is named main.exe or whisper-cli.exe
    if (Test-Path (Join-Path $binDir "main.exe")) {
        Copy-Item (Join-Path $binDir "main.exe") $whisperExe -Force
    }
    Write-Host "whisper.cpp binary ready at: $whisperExe" -ForegroundColor Green
} else {
    Write-Host "`n[1/4] whisper.cpp binary already exists." -ForegroundColor Green
}

# 2. Download Whisper Multilingual Base Model (ggml-base.bin ~142MB)
$whisperModel = Join-Path $modelsDir "ggml-base.bin"
if (-not (Test-Path $whisperModel)) {
    Write-Host "`n[2/4] Downloading Whisper Multilingual Base model (ggml-base.bin ~142MB)..." -ForegroundColor Yellow
    $whisperModelUrl = "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin"
    Invoke-WebRequest -Uri $whisperModelUrl -OutFile $whisperModel -UserAgent "OfflineDoc-Installer"
    Write-Host "Whisper base model ready at: $whisperModel" -ForegroundColor Green
} else {
    Write-Host "`n[2/4] Whisper base model already exists." -ForegroundColor Green
}

# 3. Download llama.cpp Windows x64 binary
$llamaServerExe = Join-Path $binDir "llama-server.exe"
if (-not (Test-Path $llamaServerExe)) {
    Write-Host "`n[3/4] Downloading llama.cpp Windows binary..." -ForegroundColor Yellow
    $llamaZip = Join-Path $binDir "llama-bin-win-x64.zip"
    # Using official release with AVX2 support
    $llamaUrl = "https://github.com/ggerganov/llama.cpp/releases/download/b4780/llama-b4780-bin-win-avx2-x64.zip"
    
    try {
        Invoke-WebRequest -Uri $llamaUrl -OutFile $llamaZip -UserAgent "OfflineDoc-Installer"
        Expand-Archive -Path $llamaZip -DestinationPath $binDir -Force
        Remove-Item -Path $llamaZip -Force
        Write-Host "llama.cpp binary ready at: $llamaServerExe" -ForegroundColor Green
    } catch {
        Write-Warning "Could not fetch specific build b4780, falling back to latest release pointer..."
        $latestLlamaUrl = "https://github.com/ggerganov/llama.cpp/releases/download/b4700/llama-b4700-bin-win-avx2-x64.zip"
        Invoke-WebRequest -Uri $latestLlamaUrl -OutFile $llamaZip -UserAgent "OfflineDoc-Installer"
        Expand-Archive -Path $llamaZip -DestinationPath $binDir -Force
        Remove-Item -Path $llamaZip -Force
    }
} else {
    Write-Host "`n[3/4] llama-server.exe already exists." -ForegroundColor Green
}

# 4. Download Llama 3.2 3B Instruct GGUF or Qwen 2.5 1.5B GGUF
$llmModel = Join-Path $modelsDir "Llama-3.2-3B-Instruct-Q4_K_M.gguf"
if (-not (Test-Path $llmModel)) {
    Write-Host "`n[4/4] Downloading Llama 3.2 3B Instruct Q4_K_M GGUF (~2.0 GB)..." -ForegroundColor Yellow
    Write-Host "Note: This provides high-accuracy Taglish clinical entity extraction." -ForegroundColor Gray
    $llmUrl = "https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf"
    Invoke-WebRequest -Uri $llmUrl -OutFile $llmModel -UserAgent "OfflineDoc-Installer"
    Write-Host "Llama 3.2 3B model ready at: $llmModel" -ForegroundColor Green
} else {
    Write-Host "`n[4/4] Llama 3.2 model already exists." -ForegroundColor Green
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "  All Offline AI Binaries & Models Ready!" -ForegroundColor Green
Write-Host "  Run 'powershell -File start.ps1' to launch OfflineDoc." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
