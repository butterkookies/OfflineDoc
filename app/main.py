import os
import time
from pathlib import Path
from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
import httpx

from app.config import config, BASE_DIR
from app.validate import validate_wav_file
from app.transcribe import transcribe_audio
from app.extract import extract_clinical_record
from app.storage import save_visit, get_visit, list_visits
from app.checklist import generate_checklist_text
from app.export_pdf import generate_visit_pdf, generate_referral_pdf
from pydantic import BaseModel
from typing import Dict, Any

class ExtractRequest(BaseModel):
    transcript: str

class ConfirmRequest(BaseModel):
    record: Dict[str, Any]
    transcript: str

app = FastAPI(
    title="OfflineDoc Backend",
    description="Offline Local AI Clinical Documentation Assistant for Barangay Health Workers",
    version="1.0.0",
)

WEB_DIR = BASE_DIR / "web"

@app.get("/api/health")
async def health_check():
    """
    Health check endpoint reporting on-device AI engines, models, and storage availability.
    """
    whisper_bin_exists = config.models.whisper_bin.exists()
    whisper_model_exists = config.models.whisper_model.exists()
    llama_model_exists = config.models.llama_model.exists()

    llama_server_online = False
    llama_models_loaded = []
    try:
        async with httpx.AsyncClient(timeout=1.5) as client:
            resp = await client.get(f"{config.models.llama_server_url}/health")
            if resp.status_code == 200:
                llama_server_online = True
    except Exception:
        llama_server_online = False

    return JSONResponse(
        content={
            "status": "healthy" if (whisper_model_exists or whisper_bin_exists) else "degraded",
            "offline_mode": True,
            "runtime": {
                "host": config.server.host,
                "port": config.server.port,
            },
            "engines": {
                "whisper": {
                    "binary_path": str(config.models.whisper_bin),
                    "binary_present": whisper_bin_exists,
                    "model_path": str(config.models.whisper_model),
                    "model_present": whisper_model_exists,
                },
                "llama": {
                    "server_url": config.models.llama_server_url,
                    "server_online": llama_server_online,
                    "model_path": str(config.models.llama_model),
                    "model_present": llama_model_exists,
                },
            },
            "storage": {
                "visits_dir": str(config.storage.data_dir),
                "exports_dir": str(config.storage.exports_dir),
                "keep_audio": config.storage.keep_audio,
            },
        }
    )

@app.post("/api/transcribe")
async def transcribe_endpoint(file: UploadFile = File(...)):
    """
    Receives WAV audio file, validates minimum duration and non-silence,
    then executes local whisper.cpp with Philippine Taglish vocabulary priming.
    """
    if not file.filename.lower().endswith(".wav"):
        return JSONResponse(
            status_code=400,
            content={"error": "Invalid file format. OfflineDoc accepts 16 kHz WAV audio files."},
        )

    temp_id = f"temp_{int(time.time() * 1000)}"
    temp_path = config.storage.data_dir / f"{temp_id}.wav"

    try:
        # Write uploaded bytes to disk
        contents = await file.read()
        with open(temp_path, "wb") as f:
            f.write(contents)

        # 1. Validate audio file
        try:
            val_res = validate_wav_file(temp_path)
        except ValueError as ve:
            if temp_path.exists():
                temp_path.unlink()
            return JSONResponse(status_code=400, content={"error": str(ve)})

        # 2. Transcribe via Whisper
        trans_res = transcribe_audio(temp_path)

        return JSONResponse(
            content={
                "status": "success",
                "transcript": trans_res.transcript,
                "elapsed_ms": trans_res.elapsed_ms,
                "language": trans_res.language,
                "is_sample_fallback": trans_res.is_sample_fallback,
                "validation": {
                    "duration_seconds": val_res.duration_seconds,
                    "sample_rate": val_res.sample_rate,
                    "channels": val_res.channels,
                    "rms_volume": val_res.rms_volume,
                },
                "details": trans_res.details,
            }
        )
    except Exception as e:
        if temp_path.exists():
            try:
                temp_path.unlink()
            except Exception:
                pass
        return JSONResponse(status_code=500, content={"error": f"Transcription error: {str(e)}"})

@app.post("/api/extract")
async def extract_endpoint(req: ExtractRequest):
    """
    Extracts structured clinical facts and referral information from Taglish transcript
    using local llama-server, accompanied by verified transcript quote spans.
    """
    if not req.transcript or not req.transcript.strip():
        return JSONResponse(status_code=400, content={"error": "Transcript cannot be empty."})

    try:
        extraction_result = await extract_clinical_record(req.transcript)
        return JSONResponse(content=extraction_result)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Extraction error: {str(e)}"})

@app.post("/api/confirm")
async def confirm_endpoint(req: ConfirmRequest):
    """
    Saves the health-worker reviewed clinical visit record, generates:
    1. Visit Summary PDF
    2. Barangay Referral Slip PDF (if referral is indicated)
    3. Action Checklist text file
    """
    try:
        visit_data = dict(req.record)
        visit_data["transcript"] = req.transcript
        visit_id = save_visit(visit_data)

        # Generate outputs
        visit_pdf_path = config.storage.exports_dir / f"{visit_id}_visit.pdf"
        generate_visit_pdf(visit_data, visit_pdf_path)

        referral_pdf_url = None
        if visit_data.get("referral"):
            ref_pdf_path = config.storage.exports_dir / f"{visit_id}_referral.pdf"
            generate_referral_pdf(visit_data, ref_pdf_path)
            referral_pdf_url = f"/api/export/{visit_id}_referral.pdf"

        # Generate checklist
        checklist_txt = generate_checklist_text(visit_data)
        checklist_path = config.storage.exports_dir / f"{visit_id}_checklist.txt"
        with open(checklist_path, "w", encoding="utf-8") as f:
            f.write(checklist_txt)

        return JSONResponse(
            content={
                "status": "confirmed",
                "visit_id": visit_id,
                "exports": {
                    "visit_pdf": f"/api/export/{visit_id}_visit.pdf",
                    "referral_pdf": referral_pdf_url,
                    "checklist_txt": f"/api/export/{visit_id}_checklist.txt",
                },
            }
        )
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Confirmation error: {str(e)}"})

@app.get("/api/export/{filename}")
async def get_export_file(filename: str):
    """
    Securely serves generated PDF reports and checklists from data/exports/.
    """
    safe_path = config.storage.exports_dir / filename
    if not safe_path.exists() or not safe_path.is_file():
        return JSONResponse(status_code=404, content={"error": "Export file not found."})

    media_type = "application/pdf" if filename.endswith(".pdf") else "text/plain"
    return FileResponse(safe_path, media_type=media_type, filename=filename)

@app.get("/api/visits")
async def get_recent_visits():
    """
    Returns list of recently saved visits on the local device.
    """
    return JSONResponse(content={"visits": list_visits()})




# Serve web static assets
if WEB_DIR.exists():
    app.mount("/static", StaticFiles(directory=WEB_DIR), name="static")

@app.get("/manifest.json")
async def get_manifest():
    manifest_path = WEB_DIR / "manifest.json"
    if manifest_path.exists():
        return FileResponse(manifest_path, media_type="application/manifest+json")
    return JSONResponse(content={"error": "Manifest not found"}, status_code=404)

@app.get("/styles.css")
async def get_styles():
    styles_path = WEB_DIR / "styles.css"
    if styles_path.exists():
        return FileResponse(styles_path, media_type="text/css")
    return JSONResponse(content={"error": "Styles not found"}, status_code=404)

@app.get("/recorder.js")
async def get_recorder():
    recorder_path = WEB_DIR / "recorder.js"
    if recorder_path.exists():
        return FileResponse(recorder_path, media_type="application/javascript")
    return JSONResponse(content={"error": "recorder.js not found"}, status_code=404)

@app.get("/app.js")
async def get_app():
    app_path = WEB_DIR / "app.js"
    if app_path.exists():
        return FileResponse(app_path, media_type="application/javascript")
    return JSONResponse(content={"error": "app.js not found"}, status_code=404)

@app.get("/fonts/{font_name}")
async def get_font(font_name: str):
    font_path = WEB_DIR / "fonts" / font_name
    if font_path.exists() and font_path.is_file():
        return FileResponse(font_path, media_type="font/ttf")
    return JSONResponse(content={"error": "Font not found"}, status_code=404)

@app.get("/")
async def serve_index():
    index_path = WEB_DIR / "index.html"
    if index_path.exists():
        return FileResponse(index_path, media_type="text/html")
    return JSONResponse(content={"message": "OfflineDoc API running. Web frontend building..."}, status_code=200)

