# CRITIC_REVIEW.md — Adversarial Critique of OfflineDoc

**Role:** Critic Agent  
**Target:** `PROJECT_CONTRACT.md`, `IMPLEMENTATION_PLAN.md`, `RULEBOOK.md`, `playbook.md`  
**Time of Review:** October 9, 2026, ~5:06 PM PHT (T-minus 9 minutes to S0 Decision Gate)  
**Tone:** Uncompromising, adversarial, pragmatic.

---

## Executive Summary

OfflineDoc has a sharp, high-scoring narrative: **Local AI for Barangay Health Workers in connectivity-dead zones** nails both *Problem & Usefulness* (25%) and *Local AI Implementation* (25%). The premise is legitimate, and running airplane mode on stage will stand out.

**However, the project is currently in grave danger of failing the live demo (20% Technical Execution, 15% Demo Quality) due to five specific engineering illusions:**
1. **The CPU Subprocess Latency Trap:** Spawning `whisper-cli` per clip causes cold model reloads; paired with CPU LLM extraction, latency could exceed 35–45 seconds on battery power. On a 5-minute live stage pitch, 45 seconds of dead silence is fatal.
2. **The Taglish Mirage:** `.en` models completely mangle Tagalog; multilingual models are 2.5x slower. Trying to support Taglish without GPU acceleration will break the latency budget.
3. **The Silent fpdf2 Unicode Crash:** `fpdf2` will throw an unhandled exception if Tagalog/Philippine characters (ñ, peso signs, special punctuation) hit default fonts without a pre-bundled Unicode TTF.
4. **Browser Mic Permission Roulette:** Relying solely on live browser mic capture during a high-stakes demo with stage audio feedback or browser permission hiccups.
5. **Cold S0 Gate Execution:** It is 5:06 PM. The S0 gate is at 5:15 PM. If Andrei has not benchmarked actual weights on the physical demo laptop right now, the project is flying blind.

---

## 1. Scoring & Judging Rubric Audit (Against RULEBOOK.md)

| Criterion | Weight | Current Stance | Critic Verdict & Vulnerability |
|---|---|---|---|
| **Problem & Usefulness** | 25% | Strong | **PASS with warning.** "Maria the BHW" is compelling. *Risk:* Judges will ask: "Why not just take notes and sync when back in town?" Answer must be: "By nightfall, 40% of clinical details (exact vitals, dosage instructions) are forgotten or conflated across 15 home visits." |
| **Local AI Implementation** | 25% | Excellent | **PASS.** 100% on-device (whisper.cpp + llama.cpp). Running in airplane mode with a visible offline indicator is a textbook showcase of the theme. |
| **Technical Execution** | 20% | High Risk | **RISK.** Two separate C++ binary dependencies (`whisper-cli` + `llama-server`) glued with Python subprocess/HTTP calls. If either port is blocked, path is wrong, or WAV header is malformed, the entire pipeline crashes. |
| **Innovation** | 15% | Moderate | **PASS.** Interactive two-way evidence grounding (field $\leftrightarrow$ transcript quote highlight) is the differentiator that elevates this above a basic wrapper. |
| **Product & Demo Quality** | 15% | High Risk | **RISK.** 5-minute pitch window. If processing takes >20 seconds, the demo will stall. |

---

## 2. Deep Technical Stress-Test & Vulnerabilities

### V-01: Cold-Start Subprocess vs. Daemonized Whisper Server
* **The Flaw:** `IMPLEMENTATION_PLAN.md` AG-04 proposes calling `whisper-cli` via `subprocess.run()`.
* **The Reality:** Every time a recording finishes, `whisper-cli` must load the 140MB+ model from disk into RAM, initialize memory buffers, transcribe, and write output. On laptop CPU, model load alone takes 1.5–3.0 seconds per call.
* **Critique:** `llama-server` is kept persistent as an HTTP daemon on port 8081. Why is Whisper treated as a cold subprocess?
* **Recommendation:**
  * S1 must either keep Whisper daemonized (via `whisper-server` or `faster-whisper` in Python) OR pre-warm memory.
  * If sticking with `whisper-cli` subprocess for simplicity, keep the test clip under 20 seconds.

### V-02: Taglish is a Trap (S0 Decision Gate Warning)
* **The Flaw:** Contract proposes testing "Taglish dictation" in S0.
* **The Reality:**
  * `ggml-base.en.bin` will phonetically transcribe Tagalog words into bizarre English words (hallucinating clinical terms).
  * `ggml-base.bin` (multilingual) or `ggml-small.bin` are substantially slower on CPU and have much higher word error rates on code-switched speech.
* **Recommendation:** **KILL TAGLISH AT 5:15 PM.** Formally drop Taglish to the Cut List. Demo strictly in clear English (the official language of Philippine medical records and charting). State in Q&A: *"Clinical documentation in Philippine health centers is formally logged in English; multilingual Taglish expansion is planned for edge NPU deployment."*

### V-03: fpdf2 Encoding Crash Hazard
* **The Flaw:** `fpdf2` by default uses Latin-1 core fonts (Helvetica, Times). If the worker's notes contain an `ñ` (e.g., Barangay Sto. Niño), a peso sign (`₱`), or smart curly quotes from the LLM, `fpdf.output()` crashes with a fatal Unicode encoding exception.
* **Recommendation:**
  * Must bundle a clean UTF-8 font (e.g., `DejaVuSans.ttf` or `Inter.ttf`) in `web/fonts/` or `assets/fonts/`.
  * Add unit test in AG-08 explicitly asserting that `ñ`, `₱`, and curly quotes export cleanly without error.

### V-04: AudioWorklet & Sample Rate Mismatch
* **The Flaw:** AG-03 specifies capturing 16 kHz mono WAV via AudioWorklet.
* **The Reality:** Default laptop microphones capture at 44.1 kHz or 48 kHz. Naive linear downsampling in JavaScript often introduces audio clipping or aliasing artifacts that degrade Whisper transcription accuracy by 30%.
* **Recommendation:**
  * Initialize `AudioContext({ sampleRate: 16000 })` directly so the browser's native audio engine handles the hardware resample.
  * Ensure the WAV header writes `16000` sample rate, `1` channel, and `16-bit` linear PCM explicitly.

### V-05: LLM Schema Drift and Timeout
* **The Flaw:** A 3B model forced into a strict JSON schema can loop or generate tokens slowly on CPU (10–15 tokens/sec).
* **The Reality:** A visit report with 15 fields + evidence quotes is ~250 tokens. That is 18–25 seconds of generation time on CPU.
* **Recommendation:**
  * Keep the schema lean: do NOT ask for explanations, chain-of-thought, or wordy justifications.
  * System prompt must mandate: `"Extract only what was stated verbatim. Return compact JSON."`
  * Set `temperature: 0.0` and `max_tokens: 400`.

---

## 3. Demo Failure Modes & Required Safeguards

| Scenario on Stage | Probability | Disaster Level | Mandatory Safeguard |
|---|---|---|---|
| Venue mic picks up loud background hall noise / judges talking | High | P0 (Whisper outputs garbage) | Bring a wired headset mic with directional pickup; have pre-recorded synthetic demo WAV ready. |
| Laptop battery saver throttles CPU clock from 3.2GHz to 1.1GHz | High | P0 (Processing takes 90 seconds) | Ensure laptop is plugged into mains power OR Windows Power Mode is forced to "Best Performance". |
| Presenter accidentally closes browser tab during demo | Medium | P1 (Lost state) | SPA state should persist last visit in `localStorage` or `data/visits/draft.json`. |
| Judge asks: "Did it just make up that blood pressure?" | High | P0 (Credibility destroyed) | Click the BP field in the Review UI: it instantly highlights the exact sentence in the transcript: *"Blood pressure was one twenty over eighty."* |

---

## 4. Cut-List Enforcement (Defending the 19-Hour Clock)

The following items mentioned in discussions are **STRICTLY PROHIBITED** from entering `Now`:
1. **NO Android App / React Native:** Immediate death for the deadline. Stay in Chrome on `127.0.0.1`.
2. **NO SQLite / PostgreSQL:** File-based `visits/<id>.json` is 10x easier to inspect, test, and reset.
3. **NO User Login / Auth:** Health worker Maria opens the laptop, the app is open.
4. **NO Patient History Graph / Timeline:** Documenting the single visit is the entire product promise.
5. **NO Voice Commands to Edit:** Clicking and typing on a standard HTML form is 100x more reliable on stage.

---

## 5. Immediate Action Items for the S0 Gate (5:15 PM)

1. **Andrei (Build Captain):**
   * Run `whisper-cli -m models/ggml-base.en.bin -f test.wav` on the **actual demo laptop**. Time it with `Measure-Command`. If > 12s, switch to `tiny.en`.
   * Start `llama-server -m models/llama-3.2-3b-instruct-q4_k_m.gguf` on `127.0.0.1:8081` and execute one schema curl request. Measure response time.
2. **Christian (Quality Captain):**
   * Log both numbers into `eval/results/s0_smoke.md`.
3. **Brian (Product Captain):**
   * If total pipeline is $\le 25\text{s}$, issue **GO**.
   * Formally reject Taglish to lock scope to English.
