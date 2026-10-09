# DISCLOSURES.md: Mandatory Hackathon Disclosures

**Project:** OfflineDoc  
**Event:** AppBuildersPH Hackathon 2026 (Local AI Theme)  
**Owners:** Andrei (Build captain), Brian (Product & Demo captain), Christian (Quality captain)  
**Compliance Rules:** [RULEBOOK.md](RULEBOOK.md) (R9, R12) | [PROJECT_CONTRACT.md](PROJECT_CONTRACT.md)

---

## 1. Models Used (Local AI Inference)

| Component | Model Name | Version / Quantization | Parameter Count | Execution Runtime |
|---|---|---|---|---|
| **Speech-to-Text (STT)** | OpenAI Whisper `small` multilingual (fallback: `base`), via `faster-whisper` (Systran CTranslate2 conversion) | CTranslate2 INT8 | 244M (`small`) / 74M (`base`) | Local `faster-whisper` / CTranslate2 on CPU, language forced to `tl` |
| **Extraction & Structuring (SLM)** | `Llama-3.2-1B-Instruct` (bartowski GGUF) | Q4_K_M GGUF | 1.23B | Local `llama.cpp` (`llama-server` on 127.0.0.1:8080, fallback `llama-cli.exe`) |
| **Extraction fallback (no model)** | Deterministic regex extractor (`deterministic_clinical_extractor` in `server.py`) | n/a | 0 | Pure Python; used only when no local LLM is available |

*Note: All models execute 100% locally on the device hardware. Zero weights or audio streams are transmitted over external networks.*

---

## 2. Technologies, Frameworks & Libraries

### Backend & Local Runtime
* **Runtime:** Python 3.10+ (3.12 recommended; dependencies pinned in `requirements.txt`)
* **Local Web Framework:** FastAPI + Uvicorn + `python-multipart` (`start.ps1` binds to `127.0.0.1:8000`; `run_mobile.py` binds to `0.0.0.0` on 8000/HTTP and 8443/HTTPS for same-Wi-Fi phone access)
* **Local AI Execution Engines:**
  * `faster-whisper` 1.2.x + `ctranslate2` (speech-to-text) with `av` / PyAV 17.1.0 (audio decoding)
  * `llama.cpp` / `llama-server` (C++ inference engine for the GGUF SLM)
* **Document Generation:** `fpdf2` (deterministic offline PDF report generation)
* **Data Validation:** `pydantic` (request/response schema enforcement)
* **Transport Security:** `cryptography` (generates a self-signed certificate `cert.pem`/`key.pem` so phone browsers allow microphone access over LAN HTTPS)

### Frontend & PWA
* **UI Architecture:** Responsive Single Page Application (SPA / PWA)
* **Styling & Interaction:** Clean vanilla HTML5, CSS3, modern ES6+ JavaScript
* **PWA Capabilities:** Web App Manifest (`manifest.json`), Service Worker (`sw.js`) for offline asset caching, Add-to-Home-Screen (A2HS) support for iOS & Android
* **Audio Capture:** HTML5 `MediaRecorder` API (browser-native container, typically WebM/Opus; decoded server-side by PyAV)

---

## 3. APIs and Cloud Services

* **External Cloud AI APIs:** **NONE** (Explicitly zero. No OpenAI, Anthropic, Gemini, or remote inference APIs used for core functionality).
* **Secondary Cloud Component ([Rule R8](RULEBOOK.md)):** None in the current build. (Supabase opportunistic sync was planned but is **not implemented**; all records stay in the local `data/` folder as JSON + PDF.)

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
4. **Devin (Cognition):** Used for debugging the mobile/LAN setup, pinning dependencies (`requirements.txt`), fixing the regex fallback extractor and verification suite, and keeping this disclosure in sync with the code.

---

## 6. Local vs. Internet Statement (Submission Requirement R11)

* **What runs locally:**
  * Voice recording and microphone input
  * Speech-to-text transcription (faster-whisper / CTranslate2, CPU INT8)
  * Clinical entity extraction, gap check, and evidence linking (llama.cpp; regex fallback when no model is present)
  * Form editing, patient history synthesis, search, and filtering
  * PDF report export, follow-up checklist generation, and local JSON storage
* **What requires internet:**
  * *Nothing during runtime.* The application operates in complete Airplane Mode with zero network access.
  * One-time setup only: cloning the repo, `pip install -r requirements.txt`, `setup_models.ps1` (llama.cpp binary + Llama 3.2 1B GGUF), and the **first** transcription, which makes `faster-whisper` download the Whisper `small` model (~460 MB) from Hugging Face into the local cache (`~/.cache/huggingface`). After that first run the model is served from disk with no network access.
