# CHECKLIST.md

Master checklist for OfflineDoc. Tick boxes in commits so the history shows progress. IDs: R = `RULEBOOK.md`, S = slice in `IMPLEMENTATION_PLAN.md`, AG = agent task card.

**Deadline:** 10:00 AM PHT, Oct 10 (no extensions, no edits, no resubmission). **Internal freeze:** 8:30 AM. **Submit by:** 9:30 AM.

---

## Phase 0: Setup and compliance (now to 3:30 PM)

- [ ] Brian approves `PROJECT_CONTRACT.md` (or changes it) — Brian
- [ ] Screenshot official participant list showing all 3 members (R1) — Brian
- [ ] Post Q1 to Q5 in Telegram; log answers in `OFFICIAL_BRIEF.md` (R21) — Brian
- [x] First commit: brief, rulebook, contract, plan, checklist (R3) — Andrei
- [x] `.gitignore` for `models/`, `bin/`, `data/`, `.venv/` — Andrei
- [x] [DISCLOSURES.md](file:///c:/Users/user/Documents/ANDREI_FILES/DEVFILES/PROJECTS/OfflineDoc/DISCLOSURES.md) started; log every AI tool as it is used (R4, R12) — Andrei
- [x] [REFERENCES.md](file:///c:/Users/user/Documents/ANDREI_FILES/DEVFILES/PROJECTS/OfflineDoc/REFERENCES.md) created: 2021-2026 Philippine BHW research and legal dossier — Andrei
- [x] [MEMORY.md](file:///c:/Users/user/Documents/ANDREI_FILES/DEVFILES/PROJECTS/OfflineDoc/MEMORY.md) and [UIUX_SPEC.md](file:///c:/Users/user/Documents/ANDREI_FILES/DEVFILES/PROJECTS/OfflineDoc/UIUX_SPEC.md) created — Andrei
- [ ] Agent guardrails (plan B1) shared with every agent session — Andrei

## Phase 1: S0 offline smoke test (3:15 to 5:15 PM)

- [x] Download whisper.cpp + llama.cpp Windows binaries; note versions — Andrei
- [x] Download multilingual faster-whisper int8 model; verify CPU execution — Andrei
- [x] Download Llama-3.2-1B-Instruct-Q4_K_M GGUF model — Andrei
- [x] Record Taglish scripted clinical audio clips — Christian
- [x] Wi-Fi **off**: time transcription of each clip (< 3.0s achieved) — Christian
- [x] Wi-Fi **off**: time extraction with llama-server + JSON schema (sub-second achieved) — Christian
- [x] **Go / Adjust / Switch decision**: Pivoted from PhilHealth Annex G to DOH Target Client List (TCL) & ITR Slip — Brian & Team
- [x] Confirmed Multilingual Taglish STT + Llama 3.2 1B TCL extraction — Andrei

## Phase 2: Core build (5:15 PM to midnight)

### S1 Skeleton + Record
- [x] AG-01 Repo scaffold, `/api/health` confirmed air-gapped
- [x] AG-02 `setup_models.ps1` + `start.ps1`
- [x] AG-03 In-browser 16 kHz WAV recorder + synthetic audio test loaders
- [x] AG-04 Validation + `/api/transcribe` with Taglish vocabulary conditioning & numeral normalizer
- [x] Audio deleted after transcription by default
- [x] Milestone: speak in browser -> transcript shown (Wi-Fi off)

### S2 Extraction
- [x] AG-05 DOH Target Client List (TCL) schema; few-shot prompt, temp 0.0
- [x] Null-not-guess verified on missing fields (Scenario C verified)
- [x] AG-06 Verbatim evidence quote verification for all positive entities
- [x] Zero-fake fallback parser with dynamic regex & physiological bounds check
- [x] Milestone: 3 of 3 clinical vignettes -> valid JSON & danger sign alerts

### S3 Review
- [x] AG-07 Record / Review & Gaps / Confirm & Export screens (Kindle Calm UI)
- [x] DOH TCL fields & verbatim transcript audit box
- [x] Out-of-range (BP >= 140/90) and unrecorded vitals flagged with SVG alerts
- [x] Strictly zero emojis across all UI views (pure SVG icons only)
- [x] 100% Offline indicator prominently visible
- [x] Milestone: Record -> Review -> Confirm end to end

### S4 Export
- [x] AG-08 One JSON per visit (`data/visits/visit_*.json`) with longitudinal patient timeline update
- [x] PDF report via fpdf2: Single-page official DOH ITR & TCL Encounter Slip with dual BHW & Midwife signatures
- [x] Milestone: 1-click Download Official DOH ITR Slip (PDF) verified in browser
- [x] Export blocked before Confirm (Kindle 3-step page-turn enforcement)
- [x] Milestone: full demo flow works in airplane mode (Service Worker PWA verified)

## Phase 3: Hardening (11 PM to 2 AM)

### S5 Fallbacks
- [x] AG-09 Synthetic 1-click test scenarios for all 4 cohorts
- [x] Friendly errors: mic permissions, offline indicator, invalid inputs
- [x] Christian triggers every failure path and signs off

### S6 Eval (parallel from S2)
- [x] Synthetic visit scripts with gold labels (Maternal, HTN, Senior Cough, Child EPI)
- [x] Synthetic audio for Taglish maternal follow-up
- [x] `test_scenarios.py`: 7 automated verification suites covering STT, LLM, gap alerts, PDF exports, and directory integrity
- [x] Benchmarks measured and committed in README.md (<3.5s total latency)

### Quality gates
- [x] All 7 test suites passing in `test_scenarios.py`
- [x] Grep for remote URLs: 100% air-gapped, zero external network calls at runtime
- [x] Zero emojis policy: 100% verified clean across HTML, CSS, JS, Python
- [x] Airplane-mode run verified via service worker cache

## Phase 4: Docs and fresh clone (1 AM to 4 AM)

- [x] AG-11 `README.md`: requirements, architecture diagram, reproduction steps, offline test, benchmarks (R16)
- [x] `REFERENCES.md`: authoritative 2021-2026 Philippine research and statutory legal dossier (RA 7883, RA 10173, DOH AO 2020-0019)
- [x] `DISCLOSURES.md`: models + versions + licenses, frameworks, APIs/cloud ("none" for runtime)
- [x] `UIUX_SPEC.md`: Kindle Calm responsive spec and design tokens
- [x] `MEMORY.md`: living prompt and architectural decision history

## Phase 5: Point-of-Care Gap Check

- [x] Point-of-care gap check (unmeasured BP, missing maternal gestational age, missing patient name)
- [x] Danger signs check (Stage 2 HTN >= 140/90, pre-eclampsia risk flags)
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
