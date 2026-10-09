# Project Contract: OfflineDoc

**Status:** DRAFT for approval by Brian (Product captain). Items labeled RECOMMENDED need a decision; nothing marked RECOMMENDED is `Now` until approved.

**Team roles:** Brian is Product captain and Demo captain. Andrei is Build captain. Christian is Quality captain.

---

## Confirmed

- **Theme and required integrations:** Local AI (R6). No organizer-required API or integration. Cloud is optional and secondary (R8); OfflineDoc plans to use none. Any model, framework, OS, or hardware is allowed (R9).
- **Target user:** Maria, a health worker visiting patients in areas with no mobile signal.
- **Painful moment:** She writes up each visit by hand at night and forgets details by then. Cloud dictation needs a connection and sends patient data off the device.

## Chosen promise

For health workers facing no signal and strict patient privacy, we turn a spoken visit summary into a reviewed, structured visit report and follow-up checklist, with one recording and one review step.

**RECOMMENDED refinement:** frame the user as a **barangay health worker** to make the setting unmistakably Philippine. Needs Brian's approval.

## Core workflow

1. The user provides: a voice recording of the visit (fallback: typed notes or an uploaded audio file).
2. The system validates: the recording is at least about 2 seconds and not silent; the transcript is not empty.
3. The AI turns it into: a transcript (whisper.cpp), then a structured visit record (llama.cpp with a 3B-class model and a fixed JSON schema). Values not stated are `null`, never guessed. Each field carries the transcript quote it came from.
4. The user takes: reviews and edits the form, checking fields against the highlighted transcript, then taps **Confirm**.
5. The user sees: a finished visit report (PDF) and a plain-text follow-up checklist.

## Demo moment

Airplane mode on. Speak a roughly 30-second visit summary. The transcript appears, the visit form fills in with each field linked to its source sentence, the user confirms, and the report and checklist export. Everything happens on the laptop.

## Technical approach (from the Solution Architect plan)

- Python backend with a single-page local web UI, bound to `127.0.0.1`.
- Responsive Kindle-style interface (Mobile, Tablet, Desktop) per `UIUX_SPEC.md`.
- Primary storage: Local JSON standard aligned with HL7 FHIR clinical format (`data/visits/` and `data/patients/`). Atomic file writes guarantee zero corruption on power loss.
- Secondary cloud component: Optional opportunistic sync to Supabase (PostgreSQL JSONB + S3 Storage for PDFs) when Wi-Fi is detected at the health center (Rule R8).
- Audio deleted after transcription by default to preserve device storage and patient privacy.
- Fallbacks are labeled in the UI. A cached or replayed result must never be presented as a live run (R5, R7).

## Proposed additions (RECOMMENDED, status: Next until Brian approves)

| Item | What it adds | Cost | Depends on |
|---|---|---|---|
| Point-of-care gap check | After dictation, the app lists missing required fields and the worker fills them by voice before leaving the patient | About 1.5 h | Slices S0 to S3 working |
| Confidence-guided review | Flags only fields that are out of range, lack evidence in the transcript, or came from low-confidence speech | About 1.5 h | S2, S3 |
| Taglish dictation | Supports Tagalog-English speech | Test only, in S0 | Five scripted clips transcribing acceptably on the demo laptop |
| Patient Directory & Multi-Visit History | Kindle-style card directory with search, filtering, and longitudinal encounter summaries | About 2.0 h | Local JSON schema, UIUX_SPEC.md |

## Decision gate

**S0 go/no-go (owner: Brian, evidence from Christian, executed by Andrei):** at the end of the offline smoke test, judge speech transcription speed and accuracy **on the demo laptop**. If it fails, decide immediately whether to continue or switch concepts. A switch gets more expensive with every hour.

## Non-goals / Cut list

- Native Android/iOS compiled binaries (Delivered via installable PWA instead)
- Heavy external database server, cloud sync, or remote user authentication
- Streaming (live) transcription and speaker separation
- Fine-tuning, external RAG pipelines, autonomous agent loops
- Reminder SMS notifications to patients
- Voice-commanded editing
- Automated clinical diagnosis, prescription advice, or danger-sign treatment recommendations
- Audio playback sync and desktop packaging

## Verified Research Grounding (formerly assumptions; now proven in REFERENCES.md)

- **Field signal absence:** Confirmed by Hamoy et al. (2026) in upland Philippine municipalities.
- **Privacy restrictions:** Confirmed by Republic Act No. 10173 (Data Privacy Act of 2012) restricting patient identifiable health records.
- **Documentation burden:** Confirmed by Hartigan-Go et al. (2025) and PIDS (2021-2024), documenting extensive unpaid after-hours catchup and transcription fatigue.

See [REFERENCES.md](file:///c:/Users/user/Documents/ANDREI_FILES/DEVFILES/PROJECTS/OfflineDoc/REFERENCES.md) for complete academic citations and [UIUX_SPEC.md](file:///c:/Users/user/Documents/ANDREI_FILES/DEVFILES/PROJECTS/OfflineDoc/UIUX_SPEC.md) for responsive design standards.

## Responsible-AI statement

OfflineDoc is a documentation aid, not a diagnostic tool. Every extracted field is reviewed and confirmed by the worker before export. Patient data stays on the device. Demo and eval data are synthetic.

## Evidence of rule compliance

| Rule | Evidence |
|---|---|
| R3 | Public repo history starting after the confirmed building start; list of reused code and assets |
| R5 | Eval script and raw results in the repo; synthetic data described honestly |
| R6, R8 | Demo in airplane mode; visible offline indicator; architecture note showing no cloud AI calls |
| R7 | Live demo and fresh-clone run |
| R9, R12 | Disclosure list: whisper.cpp and its model, llama.cpp and its model, libraries, Devin, Claude |
| R11, R13 | Local-vs-internet statement (internet only for install and model download) and the "why local" answer |
| R16 | README tested from a clean clone by Christian |
| R17, R18 | Named on-site presenter, timed 5-minute pitch rehearsal |

NEXT OWNER: Brian (approve or change), then Compliance Guardian (first audit).
