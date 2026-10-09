# Project Contract: OfflineDoc

**Status:** APPROVED (Oct 9, 2026). Approved by Brian (Product & Demo captain), Andrei (Build captain), and Christian (Quality captain).

**Team roles:** Brian is Product captain and Demo captain. Andrei is Build captain. Christian is Quality captain.

---

## Confirmed

- **Theme and required integrations:** Local AI (R6). No organizer-required API or integration. Cloud is optional and secondary (R8); OfflineDoc uses none (0% cloud at runtime). Any model, framework, OS, or hardware is allowed (R9).
- **Target user:** Maria, an accredited **Barangay Health Worker (BHW)** conducting house-to-house patient visits in off-grid rural Philippine sitios with zero cellular connectivity.
- **Painful moment:** She jots down vitals and symptoms in a worn spiral notebook while walking between houses. At night, exhausted, she spends 1.5 to 2 hours manually copying notes into official DOH logbooks and summary sheets, often forgetting critical details. Cloud dictation apps require expensive mobile data and send sensitive patient data off-device.

## Chosen promise

For Barangay Health Workers facing zero cellular signal and strict patient privacy, we turn a 20–30 second spoken **Taglish visit summary** into a reviewed clinical record, a follow-up action checklist (*Talaan ng Gawain*), and an official **Barangay Referral Slip**, with one recording and one touch-friendly review step.

## Core workflow

1. **The user provides:** A voice recording of the visit spoken in natural Taglish or English (fallback: typed notes or an uploaded audio file).
2. **The system validates:** The recording is at least 2 seconds, not silent, and produces a valid non-empty transcript.
3. **The AI turns it into:** 
   - A transcript via `whisper.cpp` (multilingual `base` model primed with Philippine medical terms).
   - A structured clinical visit record via `llama.cpp` using a fast 1B–1.5B model (`Qwen2.5-1.5B-Instruct` or `Llama-3.2-1B-Instruct` at Q4_K_M) with strict JSON-schema-constrained output. Values not stated are strictly `null`, never guessed. Each field carries the verbatim Taglish transcript quote as evidence.
4. **The user takes:** Reviews and edits the form on a mobile-friendly UI, tapping fields to see interactive two-way quote highlighting against the transcript, then taps **Confirm**.
5. **The user sees:** 
   - A formatted Patient Visit Report (PDF).
   - A plain-text follow-up action checklist (*Talaan ng Gawain*).
   - An official **Barangay Referral Slip** (PDF) if the patient requires Rural Health Unit (RHU) / physician attention.

## Demo moment

Airplane mode enabled on an Android phone. Speak a 25-second Taglish visit summary (*"Si Tatay Ruben, 65, masakit ang batok at nahihilo, BP 150/95..."*). In under 10 seconds, the Taglish transcript and structured English clinical form appear, high BP is flagged, evidence quotes highlight interactively, the user confirms, and the Visit PDF, Checklist, and Barangay Referral Slip export immediately.

## Technical approach

- **Frontend:** Mobile-First Responsive PWA (Progressive Web App) styled for 390px mobile viewports, touch-first UI, and offline caching.
- **Backend:** Python 3.11+ (FastAPI + Uvicorn) bound strictly to loopback `127.0.0.1`.
- **Memory Footprint:** Strict $\le$ 1.2GB RAM budget (Whisper-base ~142MB + 1.5B LLM ~800MB) engineered specifically to run comfortably on standard ₱5,000–₱8,000 Android phones and laptops.
- **Storage:** No database. One JSON file per visit in `data/visits/`, with audio deleted after transcription by default.
- **Outputs:** Pure-Python `fpdf2` with bundled Unicode TrueType font, producing clean PDFs and plain-text checklists.
- **Integrity:** A cached or replayed result must always display a visible **SAMPLE / NOT LIVE** badge (R5, R7).

## Confirmed Additions (Status: Approved for Build)

| Item | What it adds | Decision |
|---|---|---|
| **Taglish dictation** | Understands mixed Filipino-English dictation via vocabulary-primed multilingual Whisper; LLM standardizes into clinical English schema while preserving verbatim quotes. | **APPROVED** |
| **Barangay Referral Slip** | When a patient requires doctor attention, exports an official printable RHU referral slip alongside the visit log. | **APPROVED** |
| **Mobile-First PWA Layout** | 390px smartphone layout with bottom action bar, touch targets, and installable manifest for Android Chrome. | **APPROVED** |

## Non-goals / Cut list

- Native Kotlin/Java Android APK compilation (Mobile PWA on local runtime instead).
- Database (SQLite/Postgres), authentication, accounts, multi-user permissions, cloud sync.
- Streaming (live word-by-word) transcription and diarization / speaker separation.
- Fine-tuning, external RAG vector databases, multi-agent loops.
- Cross-visit multi-year patient timeline graphs.
- Voice-commanded form editing (manual touch/keyboard edit is faster and safer).
- Autonomous clinical diagnosis or drug prescribing (documentation aid only).

## Responsible-AI statement

OfflineDoc is strictly a documentation aid, not a diagnostic or prescribing tool. Every extracted field is grounded in verbatim transcript evidence and confirmed by the human health worker before export. All patient data stays on the local device. Demo and test data are completely synthetic.

## Evidence of rule compliance

| Rule | Evidence |
|---|---|
| R3 | Public repo history starting after confirmed building start; list of reused code and assets |
| R5 | Eval script and raw results in the repo; synthetic data described honestly |
| R6, R8 | Demo in airplane mode; visible offline indicator; architecture note showing 0% cloud AI calls |
| R7 | Live demo and fresh-clone run |
| R9, R12 | Full disclosure list: whisper.cpp, llama.cpp, Qwen/Llama models, libraries, Devin, Claude, Antigravity |
| R11, R13 | Local-vs-internet statement (internet only for setup) and the "why local" answer |
| R16 | README tested from a clean clone by Christian |
| R17, R18 | Named on-site presenter (Brian), timed 5-minute pitch rehearsal |

NEXT OWNER: Andrei (proceed with S1 implementation task cards).
