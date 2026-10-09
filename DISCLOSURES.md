# DISCLOSURES.md: Mandatory Hackathon Disclosures

**Project:** OfflineDoc  
**Event:** AppBuildersPH Hackathon 2026 (Local AI Theme)  
**Owners:** Andrei (Build captain), Brian (Product & Demo captain), Christian (Quality captain)  
**Compliance Rules:** [RULEBOOK.md](file:///c:/Users/user/Documents/ANDREI_FILES/DEVFILES/PROJECTS/OfflineDoc/RULEBOOK.md) (R9, R12) | [PROJECT_CONTRACT.md](file:///c:/Users/user/Documents/ANDREI_FILES/DEVFILES/PROJECTS/OfflineDoc/PROJECT_CONTRACT.md)

---

## 1. Models Used (Local AI Inference)

| Component | Model Name | Version / Quantization | Parameter Count | Execution Runtime |
|---|---|---|---|---|
| **Speech-to-Text (STT)** | `whisper-base.en` / `whisper-tiny.en` (fallback: `moonshine-tiny`) | GGUF / Q8 / FP16 | 39M – 74M | Local `whisper.cpp` binary (CPU/GPU) / Transformers.js |
| **Extraction & Structuring (SLM)** | `Llama-3.2-3B-Instruct` (fallback: `Llama-3.2-1B-Instruct` or `Qwen2.5-1.5B-Instruct`) | Q4_K_M GGUF | 1.23B – 3.21B | Local `llama.cpp` (`llama-server`) / WebGPU |

*Note: All models execute 100% locally on the device hardware. Zero weights or audio streams are transmitted over external networks.*

---

## 2. Technologies, Frameworks & Libraries

### Backend & Local Runtime
* **Runtime:** Python 3.11+
* **Local Web Framework:** FastAPI + Uvicorn (bound to `127.0.0.1`)
* **Local AI Execution Engines:**
  * `llama.cpp` / `llama-server` (C++ inference engine)
  * `whisper.cpp` (C++ speech-to-text inference engine)
* **Document Generation:** `fpdf2` (deterministic offline PDF report generation with bundled local fonts)
* **Data Validation:** `pydantic` (JSON Schema enforcement)

### Frontend & PWA
* **UI Architecture:** Responsive Single Page Application (SPA / PWA)
* **Styling & Interaction:** Clean vanilla HTML5, CSS3, modern ES6+ JavaScript
* **PWA Capabilities:** Web App Manifest (`manifest.json`), Service Worker (`sw.js`) for offline asset caching, Add-to-Home-Screen (A2HS) support for iOS & Android
* **Audio Capture:** HTML5 MediaStream Recording API (16 kHz mono WAV)

---

## 3. APIs and Cloud Services

* **External Cloud AI APIs:** **NONE** (Explicitly zero. No OpenAI, Anthropic, Gemini, or remote inference APIs used for core functionality).
* **Secondary Cloud Component ([Rule R8](file:///c:/Users/user/Documents/ANDREI_FILES/DEVFILES/PROJECTS/OfflineDoc/RULEBOOK.md)):** **Supabase** (Optional opportunistic sync for structured JSON records and PDF reports when Wi-Fi is detected at the health center. The core application functions 100% autonomously offline without this service).

---

## 4. Existing Code and Pre-Existing Assets

* **Pre-existing Boilerplate Code:** None. All application logic and pipeline code were authored during the hackathon period starting October 9, 2026.
* **Graphic Assets:** `OfflineDoc-logo.jpg` (Initial concept branding asset depicting medical document, cross, and offline cloud symbol, created prior to project coding and disclosed here per R3/R12).

---

## 5. AI Development Tools Used During Build

The team used the following AI-assisted development tools to plan, design, write code, and prepare materials:
1. **Google Antigravity IDE (Agentic Coding Pair Programmer):** Used for codebase scaffolding, architectural verification, research gathering, and prompt engineering.
2. **Claude 3.7 Sonnet / ChatGPT:** Used for early brainstorming, synthetic clinical scenario generation, and documentation drafting.
3. **CapCut / Screen Recording Tools:** Used for recording and editing the required 1-minute live demonstration video.
4. **Devin / Cognition:** Disclosed per organizer guidelines for hackathon workflow execution where applicable.

---

## 6. Local vs. Internet Statement (Submission Requirement R11)

* **What runs locally:**
  * Voice recording and microphone input
  * Speech-to-text transcription (whisper.cpp)
  * Clinical entity extraction, gap check, and evidence linking (llama.cpp)
  * Form editing, patient history synthesis, search, and filtering
  * PDF report export, follow-up checklist generation, and local JSON storage
* **What requires internet:**
  * *Nothing during runtime.* The application operates in complete Airplane Mode with zero network access. (Internet is only used during initial one-time cloning and model downloading via `setup_models.ps1`).
