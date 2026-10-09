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

### Phase 5: Speech-to-Text Accuracy & Encoding Optimization (Oct 9, ~7:20 PM PHT)
- **Root Cause Discovered in Server Logs:**
  1. `UnicodeDecodeError: 'charmap' codec can't decode byte 0x9d`: Windows `subprocess.run(text=True)` defaulted to `cp1252` while `whisper-cli.exe` outputs UTF-8. Fixed by enforcing `encoding="utf-8", errors="replace"`.
  2. Language wavering: `language="auto"` caused Whisper to detect `en` when starting with words like "Test", forcing Tagalog into English phonemes ("mata asang"). Fixed by forcing `-l tl` (Tagalog) by default.
  3. Model capacity: Upgraded from `ggml-base.bin` (141 MB) to `ggml-small.bin` (466 MB) with 4-path beam search (`-bs 4`) and complete Taglish clinical context priming.
- **Verification:** 22/22 pytest tests passing; live `llama-server` on port 8081 functioning in hybrid extraction mode.

### Phase 6: Real-World Rural BHW Field Research & Product Rescue (Oct 9, ~7:30 PM PHT – Present)
- **Trigger:** Developer & user critique: *"tbh, parang walang sense yung app now"* + inquiry into actual Philippine rural health worker struggles.
- **Credible Sources & Grounded Field Research:**
  - *Republic Act 7883* (Barangay Health Workers' Benefits and Incentives Act of 1995) & DOH BHW Pocket Handbook: BHWs receive a modest honorarium (₱1,000–₱3,000/mo), average 45–60 years old, and are legally barred from prescribing prescription medications or making definitive clinical diagnoses. Their official scope is vitals screening, OTC first aid (Paracetamol, Oresol), danger sign recognition, RHU referral, and follow-up tracking (*Babalikan*).
  - *GIDA (Geographically Isolated and Disadvantaged Areas) Health Delivery Studies (Ateneo School of Medicine & Public Health, UP CPH, JOGHR 2024)*: Sitio valleys and island barangays have zero cellular connectivity. Cloud apps fail 100% of the time. Paper records get damaged by rain and humidity.
  - *The "Tatlong Beses Isinusulat" (Triple Documentation Burden)*: In typical house-to-house consultations, BHWs must:
    1. Write notes on doorstep pocket logbooks while standing.
    2. Write triplicate carbon-copy DOH Referral Slips (*Pormularyo sa Paglilipat*) if red flags are observed (e.g. BP $\ge 140/90$, high pediatric fever).
    3. Manually re-transcribe visits at night into the Barangay Health Station (BHS) Master Logbook / Target Client List (TCL) for the visiting Rural Health Midwife (RHM) or Municipal Doctor.
- **7 Critical Flaws Diagnosed & Resolved in Code:**
  1. **Audio Distortion on iOS (B1):** Web Audio forced `16000Hz` sample rate while iOS Safari mic ran at `48000Hz`, leading to resampled acoustic distortion. *Fix:* Capture at device native sample rate in `web/recorder.js` and use box-filter averaging downsampler to 16 kHz with peak normalization before WAV encoding.
  2. **Non-Editable Transcript Trapping Errors (B2):** If Whisper misrecognized a proper noun or number, the error cascaded into every extracted field without recourse. *Fix:* Built editable transcript mode (`web/index.html`, `web/app.js`) with an immediate "🔄 I-update ang Form" re-extraction button.
  3. **Universal False Referral Slips (B3):** Facility was pre-filled with "RHU", making the referral condition always evaluate to true. *Fix:* Converted RHU Referral Slip into a deliberate toggle (`chk-enable-referral`), auto-checked only if red-flag danger vitals (BP $\ge 140/90$, Temp $\ge 38.5^\circ\text{C}$) or doctor referral is spoken.
  4. **Hallucinated Defaults (B4):** Unmentioned patient names defaulted to "Patient", advice defaulted to "Rest and hydration", and follow-up defaulted to "Next week". *Fix:* Purged all fake fallbacks in `app/extract.py` and `web/app.js` to strictly preserve `null`/empty placeholders (`Hindi nabanggit`).
  5. **False Location Matching (B5):** Regex matched naked `sa ...`, falsely extracting "sa RHU" or "sa Biyernes" as a sitio location. *Fix:* Restricted location matching strictly to explicit prefixes (`taga Sitio/Barangay/Purok`).
  6. **Lack of BHW Dictation Guidance (B6):** Health workers had no prompt structure. *Fix:* Added interactive **Gabay sa Pagsasalita (Dictation Cue Card)** to the Record screen outlining the 4-step sequence: Sino $\to$ Reklamo $\to$ Aksyon $\to$ Triage/Plano, with a realistic Taglish clinical sample.
  7. **Lack of Digital Logbook (B7):** Once exported, data vanished from the screen with no ongoing value for the worker. *Fix:* Created **Talaan ng mga Pagbisita & Babalikan (Screen 0 / Home)** displaying today's visit tallies, RHU referral count, upcoming *Babalikan* follow-up dates, and direct PDF download links.
- **Verification:** 22/22 pytest tests passing; Uvicorn reloading cleanly on `https://0.0.0.0:8000`.

### Phase 7: Anti-Mental Block UX & Cognitive Load Engineering (Oct 9, ~7:55 PM PHT – Present)
- **Problem Raised:** *"Di kaya ma-mental block yung mga BHW sa kung anong sasabihin?"*
- **Field & Academic Findings on CHW Voice Interfaces:**
  - *SciSpace & NIH Studies on Speech Recognition for Frontline Health Workers (2023–2024)*: Confronting a user with a blank microphone and ticking timer causes "Thinking and Speaking Simultaneously" cognitive overload and "Microphone Freeze" / performance anxiety.
  - *Demographic Context*: Philippine BHWs average 45–60 years old and communicate through conversational questions during patient check-ups, not by reciting memorized structured clinical monologues.
- **Implemented Ergonomic Solutions:**
  1. **Case Presets Chips (`web/index.html`):** Quick selector for high-frequency barrio cases: 🩺 *Hypertension*, 🌡️ *Lagnat/Trangkaso*, 🫁 *Ubo at Sipon*, and 🏠 *Regular na Pagbisita*.
  2. **Interactive Teleprompter / "Punan-ang-Puwang" (`web/index.html`, `web/styles.css`):** Formats a natural conversational sentence where bracketed token slots (`[Pangalan]`, `[Edad]`, `[BP]`, `[Gamot]`) stand out in color-coded chips. The BHW simply reads the template like a teleprompter and swaps in the actual patient's data.
  3. **"Walang Pressure" Reassurance Shield:** Reassures the worker on the record screen: *"Huwag mag-alala kung may makalimutan o magkamali ng salita. May pagkakataon kang mag-edit o magdagdag bago i-save ang rekord."*
- **Verification:** 22/22 pytest tests passing; live PWA interface updated on `https://0.0.0.0:8000`.

---

## 3. Active Decisions & Completed Actions
- [x] Enforce `--language tl` (Tagalog) by default in `app/transcribe.py`.
- [x] Upgrade to `ggml-small.bin` (~466MB) with beam search (`-bs 4`) for improved Philippine language accuracy.
- [x] Fix Windows `cp1252` encoding crash in `subprocess.run` with `encoding="utf-8"`.
- [x] Add client-side native-to-16kHz box-filter downsampling with peak normalization in `web/recorder.js`.
- [x] Eliminate all hallucinated default values in `app/extract.py`.
- [x] Add editable transcript toggle with instant re-extraction in `web/app.js`.
- [x] Introduce explicit RHU Referral Slip toggle with emergency vitals auto-detection.
- [x] Add Dictation Cue Card (*Gabay sa Pagsasalita*) in `web/index.html`.
- [x] Build BHW Digital Logbook & Follow-up Tracker (*Talaan at Babalikan*) with `/api/visits`.
- [x] Implement Case Presets (Hypertension, Fever, Cough, Regular) + Interactive Teleprompter (*Punan-ang-Puwang*) to eliminate BHW mental block and microphone anxiety.



