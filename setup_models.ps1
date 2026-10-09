# setup_models.ps1: Download the local LLM binary and model for OfflineDoc
# Usage: powershell -ExecutionPolicy Bypass -File setup_models.ps1
#
# Speech-to-text uses faster-whisper (installed via requirements.txt); its Whisper
# "small" model is downloaded automatically on the first transcription, so no
# whisper.cpp binary is needed here.

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  OfflineDoc: Local AI Engine Setup (llama.cpp + Llama 3.2 1B)" -ForegroundColor Cyan
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

# 1. Download llama.cpp Windows x64 CPU binaries (llama-server.exe + llama-cli.exe)
$llamaServerExe = Join-Path $binDir "llama-server.exe"
if (-not (Test-Path $llamaServerExe)) {
    Write-Host "`n[1/2] Downloading llama.cpp Windows CPU binaries..." -ForegroundColor Yellow
    $llamaZip = Join-Path $binDir "llama-bin-win-cpu-x64.zip"

    # Pinned, verified build. llama.cpp publishes a new tag almost daily and
    # removes old ones, so if this 404s we fall back to the latest release.
    $pinnedTag = "b11538"
    $llamaUrl = "https://github.com/ggml-org/llama.cpp/releases/download/$pinnedTag/llama-$pinnedTag-bin-win-cpu-x64.zip"

    try {
        Invoke-WebRequest -Uri $llamaUrl -OutFile $llamaZip -UserAgent "OfflineDoc-Installer"
    } catch {
        Write-Warning "Pinned build $pinnedTag not available, resolving latest llama.cpp release..."
        $latest = Invoke-WebRequest -Uri "https://github.com/ggml-org/llama.cpp/releases/latest" -MaximumRedirection 0 -ErrorAction SilentlyContinue -UserAgent "OfflineDoc-Installer"
        $latestTag = ($latest.Headers.Location -split "/")[-1]
        if (-not $latestTag) { throw "Could not resolve latest llama.cpp release tag." }
        $llamaUrl = "https://github.com/ggml-org/llama.cpp/releases/download/$latestTag/llama-$latestTag-bin-win-cpu-x64.zip"
        Write-Host "Using $llamaUrl" -ForegroundColor Gray
        Invoke-WebRequest -Uri $llamaUrl -OutFile $llamaZip -UserAgent "OfflineDoc-Installer"
    }

    Expand-Archive -Path $llamaZip -DestinationPath $binDir -Force
    Remove-Item -Path $llamaZip -Force

    # Some archives nest files in a subfolder; flatten so bin\llama-server.exe exists.
    if (-not (Test-Path $llamaServerExe)) {
        $nested = Get-ChildItem -Path $binDir -Recurse -Filter "llama-server.exe" | Select-Object -First 1
        if ($nested) {
            Get-ChildItem -Path $nested.DirectoryName | Move-Item -Destination $binDir -Force
        }
    }
    if (-not (Test-Path $llamaServerExe)) { throw "llama-server.exe not found after extraction." }
    Write-Host "llama.cpp binaries ready in: $binDir" -ForegroundColor Green
} else {
    Write-Host "`n[1/2] llama-server.exe already exists." -ForegroundColor Green
}

# 2. Download Llama 3.2 1B Instruct GGUF (must match LLM_MODEL_PATH in server.py)
$llmModel = Join-Path $modelsDir "Llama-3.2-1B-Instruct-Q4_K_M.gguf"
if (-not (Test-Path $llmModel)) {
    Write-Host "`n[2/2] Downloading Llama 3.2 1B Instruct Q4_K_M GGUF (~0.8 GB)..." -ForegroundColor Yellow
    $llmUrl = "https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf"
    Invoke-WebRequest -Uri $llmUrl -OutFile $llmModel -UserAgent "OfflineDoc-Installer"
    Write-Host "Llama 3.2 1B model ready at: $llmModel" -ForegroundColor Green
} else {
    Write-Host "`n[2/2] Llama 3.2 1B model already exists." -ForegroundColor Green
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "  Local AI binaries & model ready!" -ForegroundColor Green
Write-Host "  Terminal 1: bin\llama-server.exe -m models\Llama-3.2-1B-Instruct-Q4_K_M.gguf --port 8080 -c 2048 --host 127.0.0.1" -ForegroundColor Cyan
Write-Host "  Terminal 2: python run_mobile.py   (or: powershell -File start.ps1)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
