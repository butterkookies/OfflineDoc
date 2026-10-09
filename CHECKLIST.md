# CHECKLIST.md

Master checklist for OfflineDoc. Tick boxes in commits so the history shows progress. IDs: R = `RULEBOOK.md`, S = slice in `IMPLEMENTATION_PLAN.md`, AG = agent task card.

**Deadline:** 10:00 AM PHT, Oct 10 (no extensions, no edits, no resubmission). **Internal freeze:** 8:30 AM. **Submit by:** 9:30 AM.

---

## Phase 0: Setup and compliance (now to 3:30 PM)

- [x] Brian approves `PROJECT_CONTRACT.md` (BHW scope, Taglish, Referral Slip confirmed) — Brian
- [ ] Screenshot official participant list showing all 3 members (R1) — Brian
- [ ] Post Q1 to Q5 in Telegram; log answers in `OFFICIAL_BRIEF.md` (R21) — Brian
- [x] First commit: brief, rulebook, contract, plan, checklist (R3) — Andrei
- [x] `.gitignore` for `models/`, `bin/`, `data/`, `.venv/` — Andrei
- [x] `DISCLOSURES.md` started; log every AI tool as it is used (R4, R12) — Andrei
- [x] Agent guardrails (`playbook.md` / plan B1) shared with every agent session — Andrei

## Phase 1: S0 offline smoke test (5:15 to 6:30 PM)

- [ ] Download whisper.cpp + llama.cpp Windows binaries; note versions — Andrei
- [ ] Download `ggml-base.bin` (multilingual ~142MB); note SHA256 — Andrei
- [ ] Download 1.5B / 1B GGUF (`Qwen2.5-1.5B-Instruct` or `Llama-3.2-1B-Instruct` Q4_K_M ~800MB) — Andrei
- [ ] Record 5 Taglish scripted clips (synthetic) with Philippine medical terms — Christian
- [ ] Wi-Fi **off**: time transcription of each clip using `--initial-prompt` — Christian
- [ ] Wi-Fi **off**: time extraction with llama-server + JSON schema v2 — Christian
- [ ] Write raw timings to `eval/results/s0_smoke.md` — Christian
- [x] **Go / Adjust / Switch decision**: Taglish IN, 1.5B model IN, Referral Slip IN — Brian

## Phase 2: Core build (6:30 PM to midnight)

### S1 Skeleton + Mobile Record
- [x] AG-01 Repo scaffold, `/api/health`
- [x] AG-02 `setup_models.ps1` + `start.ps1` (downloads whisper, llama-server, base.bin, 1.5B GGUF)
- [x] AG-03 Mobile-friendly 16 kHz WAV recorder in browser (`recorder.js`, touch button)
- [x] AG-04 Validation (≥ 2 s, not silent, non-empty) + `/api/transcribe` with Taglish priming
- [x] Audio deleted after transcription by default
- [x] Milestone: speak Taglish on mobile UI → accurate transcript shown (Wi-Fi off)

### S2 Taglish Clinical Extraction
- [x] AG-05 Schema v2 in one place (vitals, follow_up, referral object); temp 0.0 extraction
- [x] Bilingual prompt: Taglish input → English clinical schema + verbatim Taglish evidence quotes
- [x] Null-not-guess verified on a transcript with missing fields
- [x] AG-06 Evidence quote verification with character spans; unverified flag
- [x] Milestone: 5 of 5 Taglish sample transcripts → valid schema JSON

### S3 Mobile Review
- [x] AG-07 Mobile PWA Record / Review / Export screens (390px viewport, touch cards)
- [x] Two-way interactive highlighting: field ↔ Taglish transcript span
- [x] Out-of-range (high BP/fever) and unverified fields visually flagged
- [x] Edit any field; bottom **Confirm & Sign** bar gated on review
- [x] Offline indicator visible
- [x] Brian UX pass
- [x] Milestone: Record → Review → Confirm end to end on mobile viewport

### S4 Export & Barangay Referral Slip
- [x] AG-08 One JSON per visit (transcript, extraction, edits, confirmed time, model versions)
- [x] PDF visit report via fpdf2 with bundled TTF font (UTF-8 safe for `ñ`, `₱`, quotes)
- [x] **Barangay Health Station Referral Slip (PDF)** generated when patient is referred to RHU/doctor
- [x] Plain-text follow-up checklist (*Talaan ng Gawain*)
- [x] Export blocked before Confirm
- [x] Milestone: full mobile demo flow works in airplane mode

## Phase 3: Hardening (11 PM to 2 AM)

### S5 Fallbacks
- [x] AG-09 Typed-notes path
- [x] WAV upload path (ffmpeg optional, clear message if missing)
- [x] Sample mode with persistent **SAMPLE / NOT LIVE** banner (R5, R7)
- [x] Friendly errors: no mic, llama-server down, model missing, timeout
- [x] Christian triggers every failure path and signs off

### S6 Eval (parallel from S2)
- [x] 10 to 20 synthetic visit scripts with gold labels (no real data)
- [ ] Synthetic audio for a subset (team voices)
- [x] AG-10 `eval/run_eval.py`: field accuracy, null precision, hallucination rate, evidence-verified rate, latency
- [x] Raw per-item results + summary + hardware/model info committed (R5)
- [x] Only these numbers appear in README, pitch, or submission

### Quality gates
- [x] `pytest` green (22/22 tests passing)
- [x] Grep `app/` and `web/` for `http` / remote URLs: only `127.0.0.1` allowed (R6)
- [x] Airplane-mode run after every slice merge
- [ ] Test on battery power

## Phase 4: Docs and fresh clone (1 AM to 4 AM)

- [x] AG-11 `README.md`: requirements, setup, model download, run, offline test, troubleshooting (R16)
- [x] `ARCHITECTURE.md`: diagram, what runs where, "no cloud AI calls" (R6, R8)
- [x] `DISCLOSURES.md`: models + versions + licenses, frameworks, APIs/cloud ("none" for runtime), existing code/assets, AI dev tools incl. Devin, Claude, Antigravity (R9, R12)
- [x] "What runs locally / what requires internet" (internet only for install + model download) (R11)
- [x] "Why does this product benefit from running AI locally?" (R13)
- [x] `DEMO_RUNBOOK.md`: 5-minute script, fallbacks, preflight
- [x] `SUBMISSION.md`: every form field pre-written
- [ ] Christian fresh-clone test passes; fixes merged (R16)

## Phase 5: Optional S8 (only if all above green by 2 AM and Brian approves)

- [ ] Point-of-care gap check
- [ ] Confidence-guided review
- [ ] Feature flag to disable for demo; re-run eval if extraction changed

## Phase 6: Demo assets (6 AM to 8 AM)

- [ ] Rehearse 5-minute pitch + demo, timed, at least twice (R18)
- [ ] Prepare likely Q&A answers (why local, accuracy, privacy, failure modes, next steps)
- [ ] Record ~1-minute demo video in airplane mode, offline indicator visible (R11)
- [ ] Post video on X or LinkedIn, tag Devin / Cognition, include **#AppBuildersPH**; copy URL (R11)

## Phase 7: Freeze and submit (8:30 to 9:30 AM)

- [ ] Final commit before 8:30 AM; write down the hash (R15)
- [ ] Repo **public**; opens in a logged-out browser (R15)
- [ ] All team members on official list; team name matches (R1, R2)
- [ ] Project name, short description, members entered (R10)
- [ ] Demo video + post URL included (R11)
- [ ] Local vs internet statement included (R11)
- [ ] Disclosures complete (R9, R12)
- [ ] "Why local" answered (R13)
- [ ] Every number matches `eval/results/` (R5)
- [ ] Two people review the form, then submit **once** on Cerebral Valley (R14)
- [ ] Reopen page to confirm submission
- [ ] **No commits after 10:00 AM** (R15)

## Phase 8: Demo Day (Oct 10, Cyberzone SM Makati)

- [ ] Named on-site presenter (Brian) + backup (R17)
- [ ] Arrive by 12:00 PM; AV check at 12:15 PM
- [ ] Laptop with models, binaries, venv preinstalled; tested offline that morning
- [ ] Charger, HDMI + USB-C adapters, headset or external mic
- [ ] Backup WAV + typed fallback ready (labeled)
- [ ] Do not rely on venue Wi-Fi
- [ ] Finalists announced 1:00 PM; pitching from 1:40 PM
- [ ] People's Choice: share the voting QR with guests
