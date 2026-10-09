# AppBuildersPH Hackathon 2026 — Official Submission Form

## 1. Project Information

- **Project Name:** OfflineDoc
- **Tagline:** 100% Offline AI Clinical Documentation Assistant for Barangay Health Workers in Remote Philippine Sitios
- **Track / Theme:** Local AI (Zero Cloud Dependencies · On-Device Inference)
- **GitHub Repository:** [https://github.com/butterkookies/OfflineDoc](https://github.com/butterkookies/OfflineDoc)
- **Demo Video URL:** *[To be inserted by Brian upon video recording]*
- **Public Post (X / LinkedIn):** *[To be inserted by Brian with tags #AppBuildersPH @Devin]*

---

## 2. Team Members (AppBuildersPH R1 Registered)

1. **Brian** — Product Lead & Pitch Presenter
2. **Andrei** — Architecture & Backend Build
3. **Christian** — Quality Engineering, Evaluation & Synthetic Benchmarks

---

## 3. Project Description

### The Problem
Across the Philippines, over 100,000 Barangay Health Workers (BHWs) provide primary community healthcare across 42,000+ barangays. In remote island and mountain sitios, BHWs conduct daily house-to-house checkups in areas with **zero cellular signal**. 

After hiking kilometers under extreme weather, BHWs spend 3 to 4 hours every evening manually transcribing scribbled notes into paper logbooks and filling out triplicate referral slips for the municipal Rural Health Unit (RHU) doctor. Cloud AI assistants (ChatGPT, Claude, Whisper Cloud API) are completely inoperable in these dead zones. When a patient presents with hypertensive crisis or dangerous fever, illegible handwriting and non-standardized notes cause severe triage delays.

### The Solution: OfflineDoc
OfflineDoc is a **Mobile-First Progressive Web App (PWA)** that runs 100% on-device on a local offline device or laptop with zero internet.

1. **Taglish Voice Dictation:** A BHW speaks 20–30 seconds of conversational Taglish or Filipino into her phone (*"Si Tatay Rodrigo, 62 anyos taga Sitio Maligaya, BP 150/95 may lagnat na 38.5..."*).
2. **On-Device Whisper.cpp:** High-speed STT with Philippine medical vocabulary priming (*lagnat, ubo, sipon, BP, reseta, paracetamol...*) avoiding phonetic corruption.
3. **On-Device Llama.cpp (1.5B/1B):** Standardizes clinical facts into a structured JSON record with schema grammar enforcement.
4. **Two-Way Verbatim Grounding:** Every extracted clinical field is bidirectionally linked to its verbatim quote in the original voice transcript. Tapping a field highlights its proof; tapping a transcript highlight focuses the field.
5. **Strict Anti-Hallucination Guardrails:** Unstated fields are strictly preserved as `null`. The system never invents vitals and does not perform autonomous diagnosis.
6. **Instant Official Exports:**
   - 📄 **Patient Visit Summary (PDF):** Standardized clinical report with bundled Unicode fonts.
   - 🏥 **Barangay Referral Slip (PDF):** Official referral document for the municipal RHU physician when triage criteria (e.g. Stage 2 hypertension, high fever) are met.
   - 📋 **Talaan ng Gawain (Checklist TXT):** Actionable task list for follow-up home visits.

---

## 4. Why Local AI? (The Core Thesis)

1. **Zero Connectivity Reality:** 40% of rural Philippine sitios have spotty or zero cellular signal. Local AI is not a gimmick; it is an absolute technical requirement.
2. **Budget Hardware Optimization ($\le 1.2$GB RAM):** The entire runtime—speech recognition, quantized LLM, backend, and PDF generator—is engineered to fit within a strict 1.2 GB RAM footprint, enabling deployment on budget ₱6,000 Android phones or older barangay laptops.
3. **Zero API Costs & Total Patient Privacy:** Indigent rural patients have their medical data protected on-device without telemetry or cloud storage risks.

---

## 5. Quantitative Evaluation & Benchmarks

Measured using the committed benchmark harness (`eval/run_eval.py`) across synthetic Taglish field consultations:

| Evaluation Metric | Target | Measured Result | Status |
|---|---|---|---|
| **Patient Identification Accuracy** | $\ge 90\%$ | **100.0%** (5/5) | ✅ PASS |
| **Age Extraction Accuracy** | $\ge 90\%$ | **100.0%** (5/5) | ✅ PASS |
| **Blood Pressure Accuracy** | $\ge 90\%$ | **100.0%** (5/5) | ✅ PASS |
| **Temperature Accuracy** | $\ge 90\%$ | **100.0%** (5/5) | ✅ PASS |
| **RHU Referral Concordance** | $\ge 90\%$ | **100.0%** (5/5) | ✅ PASS |
| **Null Precision (Guardrail 6)** | $\ge 95\%$ | **100.0%** (21/21 unstated fields kept null) | ✅ PASS |
| **Hallucination Rate** | 0% | **0 Hallucinations Detected** | ✅ PASS |
| **Verbatim Evidence Grounding** | $\ge 90\%$ | **100.0%** (31/31 verified quotes) | ✅ PASS |
| **Median Extraction Latency** | $\le 2000$ms | **1,142 ms** | ✅ PASS |

---

## 6. Technology Stack & Architecture

- **Frontend:** Mobile-First Vanilla HTML5/CSS3/JavaScript Progressive Web App (390px viewport, Web Audio API 16 kHz Mono WAV downsampler, zero external CDNs).
- **Backend:** Python 3.11+ with FastAPI & Uvicorn (bound strictly to `127.0.0.1`).
- **Speech Engine:** `whisper.cpp` (`ggml-base.bin` multilingual, 142MB) with Taglish medical vocabulary priming.
- **Inference LLM:** `llama.cpp` `llama-server` (`Qwen2.5-1.5B-Instruct-Q4_K_M`, ~980MB) with JSON schema logit constraints.
- **Document Generation:** Pure-Python `fpdf2` with bundled Unicode TrueType Font (`web/fonts/font.ttf`).
- **Test Suite:** 22 passing pytest automated tests (`tests/`).

---

## 7. AI Tooling & Asset Disclosures (Rules R9, R12)

All code and assets created during the hackathon adhere to the official rules:
- **AI Coding Assistants:** Antigravity IDE (Google DeepMind), Claude 3.5 Sonnet, Devin. Logged chronologically in `DISCLOSURES.md`.
- **Pre-trained Models:** Whisper base multilingual (MIT License), Qwen2.5-1.5B-Instruct (Apache 2.0 License).
- **Audio & Patient Data:** 100% synthetic scenarios generated for testing. Zero real patient identifiable information used.
