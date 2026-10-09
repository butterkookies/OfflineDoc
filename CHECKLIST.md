# CHECKLIST.md

Master checklist for OfflineDoc. Tick boxes in commits so the history shows progress. IDs: R = `RULEBOOK.md`, S = slice in `IMPLEMENTATION_PLAN.md`, AG = agent task card.

**Deadline:** 10:00 AM PHT, Oct 10 (no extensions, no edits, no resubmission). **Internal freeze:** 8:30 AM. **Submit by:** 9:30 AM.

---

## Phase 0: Setup and compliance (now to 3:30 PM)

- [ ] Brian approves `PROJECT_CONTRACT.md` (or changes it) — Brian
- [ ] Screenshot official participant list showing all 3 members (R1) — Brian
- [ ] Post Q1 to Q5 in Telegram; log answers in `OFFICIAL_BRIEF.md` (R21) — Brian
- [ ] First commit: brief, rulebook, contract, plan, checklist (R3) — Andrei
- [ ] `.gitignore` for `models/`, `bin/`, `data/`, `.venv/` — Andrei
- [ ] `DISCLOSURES.md` started; log every AI tool as it is used (R4, R12) — Andrei
- [ ] Agent guardrails (plan B1) shared with every agent session — Andrei

## Phase 1: S0 offline smoke test (3:15 to 5:15 PM)

- [ ] Download whisper.cpp + llama.cpp Windows binaries; note versions — Andrei
- [ ] Download `ggml-base.en.bin` and `tiny.en` fallback; note SHA256 — Andrei
- [ ] Download two 3B-class instruct GGUF candidates (Q4_K_M) — Andrei
- [ ] Record 5 English + 5 Taglish scripted clips (synthetic) — Christian
- [ ] Wi-Fi **off**: time transcription of each clip — Christian
- [ ] Wi-Fi **off**: time extraction with llama-server + JSON schema — Christian
- [ ] Write raw timings to `eval/results/s0_smoke.md` — Christian
- [ ] **Go / Adjust / Switch decision at 5:15 PM** — Brian
- [ ] Decide whisper model, LLM, and Taglish in/out; update contract — Brian

## Phase 2: Core build (5:15 PM to midnight)

### S1 Skeleton + Record
- [ ] AG-01 Repo scaffold, `/api/health`
- [ ] AG-02 `setup_models.ps1` + `start.ps1`
- [ ] AG-03 In-browser 16 kHz WAV recorder
- [ ] AG-04 Validation (≥ 2 s, not silent, non-empty transcript) + `/api/transcribe`
- [ ] Audio deleted after transcription by default
- [ ] Milestone: speak in browser → transcript shown (Wi-Fi off)

### S2 Extraction
- [ ] AG-05 Schema in one place; schema-constrained extraction, temp 0
- [ ] Null-not-guess verified on a transcript with missing fields
- [ ] AG-06 Evidence quote verification with spans; unverified flag
- [ ] Milestone: 5 of 5 sample transcripts → valid JSON

### S3 Review
- [ ] AG-07 Record / Review / Export screens
- [ ] Field ↔ transcript highlight both ways
- [ ] Out-of-range and unverified fields flagged
- [ ] Edit any field; Confirm gated on reviewing flagged fields
- [ ] Offline indicator visible
- [ ] Brian UX pass
- [ ] Milestone: Record → Review → Confirm end to end

### S4 Export
- [ ] AG-08 One JSON per visit (transcript, extraction, edits, confirmed time, model versions)
- [ ] PDF report via fpdf2 with bundled font; "reviewed and confirmed" line; synthetic-data footer
- [ ] Plain-text follow-up checklist
- [ ] Export blocked before Confirm
- [ ] Milestone: full demo flow works in airplane mode

## Phase 3: Hardening (11 PM to 2 AM)

### S5 Fallbacks
- [ ] AG-09 Typed-notes path
- [ ] WAV upload path (ffmpeg optional, clear message if missing)
- [ ] Sample mode with persistent **SAMPLE / NOT LIVE** banner (R5, R7)
- [ ] Friendly errors: no mic, llama-server down, model missing, timeout
- [ ] Christian triggers every failure path and signs off

### S6 Eval (parallel from S2)
- [ ] 10 to 20 synthetic visit scripts with gold labels (no real data)
- [ ] Synthetic audio for a subset (team voices)
- [ ] AG-10 `eval/run_eval.py`: field accuracy, null precision, hallucination rate, evidence-verified rate, latency
- [ ] Raw per-item results + summary + hardware/model info committed (R5)
- [ ] Only these numbers appear in README, pitch, or submission

### Quality gates
- [ ] `pytest` green
- [ ] Grep `app/` and `web/` for `http` / remote URLs: only `127.0.0.1` allowed (R6)
- [ ] Airplane-mode run after every slice merge
- [ ] Test on battery power

## Phase 4: Docs and fresh clone (1 AM to 4 AM)

- [ ] AG-11 `README.md`: requirements, setup, model download, run, offline test, troubleshooting (R16)
- [ ] `ARCHITECTURE.md`: diagram, what runs where, "no cloud AI calls" (R6, R8)
- [ ] `DISCLOSURES.md`: models + versions + licenses, frameworks, APIs/cloud ("none" for runtime), existing code/assets, AI dev tools incl. Devin, Claude, Antigravity (R9, R12)
- [ ] "What runs locally / what requires internet" (internet only for install + model download) (R11)
- [ ] "Why does this product benefit from running AI locally?" (R13)
- [ ] `DEMO_RUNBOOK.md`: 5-minute script, fallbacks, preflight
- [ ] `SUBMISSION.md`: every form field pre-written
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
