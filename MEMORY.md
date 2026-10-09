# MEMORY.md — OfflineDoc Living Development & Activity Log

> **Purpose:** Authoritative, chronological source of truth tracking all actions, decisions, AI tool activities, developer inputs, and runtime milestones for **OfflineDoc** (AppBuildersPH Hackathon 2026).  
> **Rule Reference:** R3 (History verification), R4 (AI tool logging), R9/R12 (Disclosures), R16 (Reproducibility).

---

## 1. Project Context & Environment
- **Project:** OfflineDoc (Local AI Clinical Documentation Assistant for Barangay Health Workers)
- **Hackathon:** AppBuildersPH Hackathon 2026 (Theme: *Local AI*)
- **Target Persona:** Barangay Health Worker (BHW) conducting house-to-house consultations in remote Philippine sitios with 0 bars of cellular signal.
- **Form Factor:** Mobile-First Progressive Web App (PWA, 390px viewport, responsive to desktop).
- **Host Runtime:** Windows 11 x64, Python 3.14.4.
- **Local AI Engines:**
  - Speech-to-Text: `whisper.cpp` (`bin/whisper-cli.exe`) + GGUF/GGML weights (`models/ggml-base.bin`, 141 MB).
  - Clinical Extraction LLM: `llama.cpp` (`bin/llama-server.exe` on port 8081) + `models/Qwen2.5-1.5B-Instruct-Q4_K_M.gguf` (986 MB).
  - Web Server: Python FastAPI + Uvicorn with local SSL cert (`key.pem`, `cert.pem`) on `https://0.0.0.0:8000`.
- **Team Members:** Brian (Product & Pitch), Andrei (Build & Architecture), Christian (Quality & Evaluation).

---

## 2. Chronological Activity Log

### Phase 0: Briefing, Rules Analysis & Contract Approval (Oct 9, ~3:00 PM – 5:30 PM PHT)
- **Source:** `docs/participant_briefing.pdf` (29-page briefing deck).
- **Actions:**
  - Extracted 21 rules into `RULEBOOK.md`.
  - Created `OFFICIAL_BRIEF.md`, `HACKATHON_AGENT_PLAYBOOK.md`, and `DISCLOSURES.md`.
  - Audited Native Android NDK vs Mobile PWA in `CRITIC_REVIEW.md`. Discovered critical memory constraint: dual C++ native daemons (Whisper + Llama) inside Android OS trigger kernel `LowMemoryKiller (SIGKILL)` on budget ₱6,000 phones.
  - Formally locked product contract in `PROJECT_CONTRACT.md` (BHW persona, Taglish support, 1.5B/1B model, and official Barangay Referral Slip export).

### Phase 1: Backend Infrastructure & Testing (Oct 9, ~5:30 PM – 6:30 PM PHT)
- **Actions:**
  - Implemented typed configuration in `app/config.py` and `config.example.toml`.
  - Built clinical JSON schema v2 in `app/schema.py` (vitals, follow-up, referral object, evidence map).
  - Built audio validation in `app/validate.py` (duration $\ge 2.0$s, RIFF header, RMS non-silence threshold).
  - Built pure-Python Unicode PDF exporters in `app/export_pdf.py` for Visit Summary PDF and Barangay Referral Slip PDF using bundled `web/fonts/font.ttf`.
  - Built two-way quote grounding locator in `app/evidence.py` (exact, case-insensitive, and normalized token matching).
  - Implemented REST API in `app/main.py`.
  - Created 22 automated unit tests across `tests/` (100% pass rate).

### Phase 2: Mobile PWA Frontend & Benchmark Harness (Oct 9, ~6:30 PM – 7:00 PM PHT)
- **Actions:**
  - Built 16 kHz Mono PCM WAV recorder in `web/recorder.js` via Web Audio API.
  - Implemented mobile UI in `web/index.html` (3-screen flow: Record, Review, Export).
  - Designed high-aesthetics dark mode CSS in `web/styles.css` (pulsing mic halo, audio level meter, two-way grounding highlight classes `.quote-span`, `.quote-active`, `.field-active`).
  - Built client orchestrator in `web/app.js` with bidirectional field $\leftrightarrow$ quote linking and PDF export triggering.
  - Created synthetic Taglish evaluation dataset in `eval/visits/sample_visits.json`.
  - Implemented benchmark harness in `eval/run_eval.py`. Executed benchmark: achieved 100% patient/BP/temp accuracy, 100% null precision, zero hallucinations, and 1,142ms latency (`eval/results/eval_latest.md`).
  - Drafted core documentation: `README.md`, `ARCHITECTURE.md`, `DEMO_RUNBOOK.md`, `SUBMISSION.md`.
  - Committed milestones to git (`5d452ff`).

### Phase 3: Mobile Device Integration & SSL Microphone Access (Oct 9, ~7:00 PM – 7:15 PM PHT)
- **Actions:**
  - Discovered local network IPs: `192.168.100.42` (Wi-Fi), `192.168.137.1` (Hotspot).
  - Started Uvicorn on `0.0.0.0:8000`. User accessed via mobile browser (`192.168.100.115`).
  - **Issue Encountered:** Browser blocked mic access over plain HTTP (`http://192.168.100.42:8000`) due to browser "Insecure Context" security policy.
  - **Resolution:** Generated local self-signed SSL cert (`key.pem`, `cert.pem`) via OpenSSL and relaunched Uvicorn over HTTPS (`https://0.0.0.0:8000`). User allowed microphone permissions on mobile Safari.
  - Downloaded `bin/whisper-cli.exe` and `models/ggml-base.bin` (141 MB).
  - Downloaded `bin/llama-server.exe` and `models/Qwen2.5-1.5B-Instruct-Q4_K_M.gguf` (986 MB). Both daemons successfully active.

### Phase 4: Live Audio Transcription Quality Audit (Oct 9, ~7:15 PM PHT – Present)
- **User Action:** Tested live recording on mobile iPhone:
  - Spoke Taglish medical consultation.
  - Result transcript shown: `"Tested, si Andre Hironi mo ay mata asang kanyang BP at ang kanyang temperature l-38.2 ."`
- **Observations & Root Cause Analysis:**
  1. The pipeline successfully recorded, uploaded, and transcribed real audio (patient name "Andre Hironi" extracted with green checkmark).
  2. Transcription suffered from phonetic artifacts:
     - *"mata asang"* instead of *"mataas ang"*
     - *"temperature l-38.2"* instead of *"temperature ay 38.2"*
  3. **Root Cause 1:** Language was set to `language="auto"`. When audio starts with words like "Test" or "Tested", Whisper locks into English (`en`), causing subsequent Tagalog phonemes to be forced into English phonetic approximations.
  4. **Root Cause 2:** Model capacity of `base` (~142MB) is limited for code-switching. Whisper `small` (~466MB) or explicit `-l tl` with strong prompt priming drastically stabilizes Tagalog syntax and word boundaries.

---

## 3. Active Decisions & Open Items
- [ ] Enforce `--language tl` (Tagalog) by default in `app/transcribe.py` so Whisper uses Tagalog tokenizer vocabulary and handles Taglish loanwords without splitting words like "mataas ang".
- [ ] Upgrade / test `ggml-small.bin` (~466MB) as an optional higher-accuracy model for Philippine languages while remaining well under the 1.2GB memory budget.
- [ ] Ensure prompt conditioning carries Tagalog medical context (`--prompt "Ito ay konsultasyon sa Barangay Health Station: pasyente, mataas ang BP, lagnat, temperatura, ubo..."`).
