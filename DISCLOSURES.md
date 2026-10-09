# DISCLOSURES.md — OfflineDoc

**Project:** OfflineDoc  
**Event:** AppBuildersPH Hackathon 2026 (Local AI Theme)  
**Last Updated:** October 9, 2026 (Build Day)  
**Compliance Reference:** `RULEBOOK.md` (R4, R9, R11, R12), `OFFICIAL_BRIEF.md` (pp. 9, 16, 22, 24)

This document is the official, living record of all AI development tools, local models, frameworks, APIs, and existing code/assets used in OfflineDoc. Every tool and dependency is disclosed here in accordance with hackathon submission rules.

---

## 1. AI Development Tools & Coding Assistants (R4, R12)

The following AI tools and coding assistants were used for development, architecture planning, testing, and documentation assistance:

| Tool / Assistant | Provider | Primary Use & Scope | Stage Used |
|---|---|---|---|
| **Antigravity IDE** | Google DeepMind | Primary agentic coding environment, codebase navigation, task orchestration, test generation, and implementation | Planning & Build (S0–S8) |
| **Claude** (Opus 5.5 / Sonnet 3.7) | Anthropic | Architecture review, critic evaluation, tech stack tradeoff analysis, and documentation drafting | Planning & Build |
| **Devin** | Cognition | Coding agent evaluation and autonomous task execution (allowed under rule R4 / brief p. 9) | Build |
| **Gemini** (3.8 Flash / Pro) | Google | Rapid context synthesis, schema drafting, and code generation within Antigravity | Planning & Build |

> **Compliance Note (R4):** All contributions and strategic decisions are directed and owned by the registered team members (Brian, Andrei, Christian). No external human help was received.

---

## 2. Local AI Models & Runtimes (R6, R9, R12)

**Zero cloud inference is performed at runtime.** All models run directly on the host machine.

| Component | Model / Engine | Version / Checkpoint | License | Purpose | What Runs Locally |
|---|---|---|---|---|---|
| **Speech-to-Text** | `whisper.cpp` (`whisper-cli` / daemon binary) | v1.7.x / latest Windows x64 release | MIT | Audio transcription of spoken Taglish/English visit summaries | 100% on CPU (or Vulkan if enabled) |
| **STT Weights** | `ggml-base.bin` (multilingual ~142MB) | OpenAI Whisper checkpoint converted to GGML | MIT | Taglish speech transcription primed with Philippine clinical vocabulary | Fully local on disk in `models/` |
| **LLM Inference** | `llama.cpp` (`llama-server` binary) | b3900+ Windows x64 release | MIT | Local HTTP server (`127.0.0.1:8081`) serving schema-constrained extraction | 100% on-device inference |
| **LLM Weights** | 1B–1.5B Instruct GGUF (`Qwen2.5-1.5B-Instruct-Q4_K_M.gguf` ~1.0GB or `Llama-3.2-1B-Instruct-Q4_K_M.gguf` ~750MB) | Quantization: Q4_K_M | Qwen Research / Apache 2.0 / Llama 3.2 Community License | Structured JSON extraction, bilingual normalization, quote grounding, and referral triage | Fully local on disk in `models/` |
| **Combined Footprint** | STT + LLM | Strict $\le$ 1.2GB RAM | Open Source | Fits inside RAM limits of ₱5,000–₱8,000 Android phones and laptops | 100% On-Device Memory |

---

## 3. Technologies, Libraries & Frameworks (R9, R12)

All code and libraries used for building and serving the application:

| Package / Technology | Version / Spec | License | Purpose in OfflineDoc |
|---|---|---|---|
| **Python** | 3.11+ | PSF License | Core backend runtime |
| **FastAPI** | 0.115+ | MIT | Local REST API server (strictly bound to `127.0.0.1`) |
| **Uvicorn** | 0.30+ | BSD-3-Clause | ASGI web server running FastAPI locally |
| **fpdf2** | 2.8+ | LGPL-3.0 / MIT compatible | Pure-Python PDF generation for visit reports (no system binary dependencies) |
| **httpx** | 0.27+ | BSD-3-Clause | Lightweight HTTP client for calling local `llama-server` (`127.0.0.1:8081`) |
| **pytest** | 8.0+ | MIT | Automated unit and integration testing suite |
| **Web Audio API** | W3C Standard | Web Standard | In-browser 16 kHz mono WAV audio recording via `AudioWorklet` |
| **Vanilla HTML/CSS/JS** | ES2022 | N/A | Clean single-page application UI (zero NPM bundling, zero external CDNs) |
| **Bundled Fonts** | Local TTF (Inter or system sans) | SIL Open Font License / System | Packaged directly in `web/fonts/` for offline rendering in airplane mode |

---

## 4. APIs & Cloud Services (R6, R8, R12)

| Service / API | Runtime Usage | Setup Usage | Notes |
|---|---|---|---|
| **Cloud AI APIs (OpenAI, Anthropic, Gemini, etc.)** | **NONE (0%)** | **NONE** | OfflineDoc strictly prohibits any cloud AI calls during runtime. |
| **Cloud Storage / Databases** | **NONE (0%)** | **NONE** | No external database or cloud sync. All visit records are stored as local JSON files in `data/visits/`. |
| **Telemetry / Analytics / CDNs** | **NONE (0%)** | **NONE** | No external script tags, tracking pixels, or remote font CDNs. |
| **Public Model & Binary Repositories** (Hugging Face / GitHub Releases) | **NONE (0%)** | **One-time download** | Pre-downloaded via `scripts/setup_models.ps1` during initial installation only. |

---

## 5. Pre-existing Code & Reused Assets (R3, R12)

* **Codebase Origins:** The OfflineDoc project was started from scratch after the official AppBuildersPH Hackathon challenge reveal on October 9, 2026.
* **Git History:** The Git repository history begins cleanly at hackathon kickoff without pre-existing application logic.
* **Boilerplate / Reused Assets:**
  * Standard open-source `AudioWorklet` PCM WAV encoding routines adapted for 16 kHz mono capture.
  * Standard prompt formatting and JSON schema templates for clinical note summarization.
  * No proprietary, commercial, or pre-built enterprise codebases were imported or reused.

---

## 6. What Runs Locally vs. What Requires Internet (R11)

This explicit matrix directly fulfills hackathon submission requirement R11:

| Operation | Environment | Network Requirement |
|---|---|---|
| Initial repository clone & Python venv creation | Developer Machine | Internet required once |
| Downloading `whisper.cpp`, `llama-server`, and GGUF/GGML weights (`scripts/setup_models.ps1`) | Developer Machine | Internet required once |
| **Microphone recording & WAV capture** | Local Browser | **100% Offline (Airplane Mode)** |
| **Audio validation & silence detection** | Local Backend | **100% Offline (Airplane Mode)** |
| **Speech-to-text transcription via whisper.cpp** | Local CPU | **100% Offline (Airplane Mode)** |
| **Clinical schema extraction via llama.cpp** | Local CPU/GPU | **100% Offline (Airplane Mode)** |
| **Evidence verification & quote span grounding** | Local Backend | **100% Offline (Airplane Mode)** |
| **Review UI & interactive field editing** | Local Browser | **100% Offline (Airplane Mode)** |
| **Exporting visit PDF & follow-up checklist** | Local Backend | **100% Offline (Airplane Mode)** |

---

## 7. Audit & Maintenance Log

Whenever a new model, library, or tool is introduced during the hackathon, log it below immediately:

| Timestamp (PHT) | Item Added / Changed | Category | Contributor |
|---|---|---|---|
| 2026-10-09 15:30 | Antigravity IDE, Claude, Gemini | AI Dev Tools | Andrei / Brian |
| 2026-10-09 16:00 | whisper.cpp, llama.cpp, base.en, 3B GGUF | Local Models | Andrei |
| 2026-10-09 17:00 | Initialized DISCLOSURES.md | Compliance | Andrei |
| 2026-10-09 18:15 | Downsized to 1.5B/1B LLM (Qwen2.5/Llama-3.2), base multilingual STT, BHW Referral Slip | Architecture Update | Brian / Andrei |
