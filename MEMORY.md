# MEMORY.md: Living Architecture & Project Memory Log

**Project:** OfflineDoc  
**Current Branch:** `Geronimo`  
**Repository:** `butterkookies/OfflineDoc`  
**Last Updated:** October 10, 2026

---

## 1. Project Context & North Star

* **Target User:** Maria, a Barangay Health Worker (BHW) servicing rural and GIDA (Geographically Isolated and Disadvantaged Areas) communities in the Philippines.
* **Core Pain Point:** Repetitive manual paperwork across 4 separate physical tools (spiral notebook, ITR form, Target Client List binders, and Monthly Consolidation Tables). After-hours catchup fatigue and zero cellular reception in the field.
* **Core Promise:** 100% offline, air-gapped clinical encounter documentation. The BHW records a 30-to-45-second voice summary at the bedside; local AI transcribes, extracts structured data adhering to DOH schemas with verifiable verbatim evidence quotes, alerts for missing critical vitals on the spot, and outputs ready-to-export ITR summaries and TCL records.

---

## 2. Decision Log & Architectural Pivots

| Timestamp | Decision / Pivot | Rationale / Driver | Impact on Codebase |
|---|---|---|---|
| Oct 9, 2026 (16:27 PHT) | Commit project foundation docs (`RULEBOOK.md`, `PROJECT_CONTRACT.md`, `IMPLEMENTATION_PLAN.md`, `CHECKLIST.md`). | Establish unambiguous compliance with AppBuildersPH Hackathon rules before coding. | Documents added to `main`. |
| Oct 9, 2026 (23:47 PHT) | Branch `Geronimo` created from clean `main`. | Andrei (Build Captain) convention matching teammate branches `Celon` and `Kasilag`. | Active working branch switched to `Geronimo`. |
| Oct 10, 2026 (00:05 PHT) | Visual Theme established from `OfflineDoc-logo.jpg`. | Medical white and blue aesthetic (`#0066FF`, `#FFFFFF`, `#F8FAFC`) with persistent offline indicator badge (`☁̸`). | Drives CSS styling and PWA design tokens. |
| Oct 10, 2026 (00:25 PHT) | Literature & Regulatory Grounding (2021–2026 research). | Citing *Acta Medica Philippina 2025/2026*, PIDS, DOH AO 2020-0019, RA 7883, and RA 10173 to prove real-world problem relevance (25% judging weight). | Created `REFERENCES.md`. |
| Oct 10, 2026 (00:45 PHT) | Scope Proposal: Longitudinal Patient History & Kindle-like UI. | User requested adding multi-visit patient summaries, search/filtering, and Kindle-like distraction-free minimalist UI across mobile, tablet, and PC. | Added `UIUX_SPEC.md`; Critic Agent audit triggered. |
| Oct 10, 2026 (02:30 PHT) | Critic Agent Audit: PhilHealth Annex G (50 fields) vs 30s Speech Reality Check. | Mathematically and clinically proven that 100 spoken words cannot fill a 50-field comprehensive hospital EHR. Pivoted to statutory DOH Target Client List (TCL) and single-page ITR Encounter Slips. | Updated `server.py`, `static/index.html`, `static/app.js`, created `pdf_generator.py`. |
| Oct 10, 2026 (03:00 PHT) | Option A Completed: Kindle PWA Scaffold & Multi-Cohort Master-Detail View. | Built 100% offline air-gapped PWA with Service Worker app-shell pre-caching (`sw.js`), 4 authentic community cohorts (Maternal, HTN, Senior Cough, Child EPI), Master-Detail tablet/desktop layout, touch protection, zero emojis, and verified all 7 test suites in `test_scenarios.py`. | Updated `server.py`, `static/index.html`, `static/style.css`, `static/app.js`, `README.md`, `CHECKLIST.md`. |

---

## 3. Session & Prompt History

### Session 1: Project Setup & Repository Branching
* **Prompt:** *"create a branch by pulling main"*
* **Actions:** Pulled `origin/main`, created and checked out branch `Geronimo`.

### Session 2: Idea Solidification & Grounded Research
* **Prompt:** *"now let's solidify the idea further... conduct a legit research on existing articles, studies here in the philippines about barangay health workers... research for me the best and efficient local model... /prompt-enhancer"*
* **Actions:** Inspected `OfflineDoc-logo.jpg` and briefing PDF. Performed comprehensive web and academic searches for 2021–2026 studies. Documented BHW paperwork struggles. Evaluated local STT and SLMs.

### Session 3: Problem-Solution Mapping & Documentation Architecture
* **Prompt:** *"First, based on the research studies, what is the best solution for these common issues? List at least 3 best solutions to 3 main problems."*
* **Actions:** Formulated the 3 Problem-to-Solution pairs (Quadruple Entry -> Speak Once, Populate All; Parallel Documentation Fatigue -> Zero-Cloud Local-First JSON; Night-Time Omissions -> Bedside Gap Check).

### Session 4: Documentation Hub & Scope Assessment
* **Prompt:** *"Create REFERENCES.md... DISCLOSURES.md... MEMORY.md... recommend .md files... add BHW summarized patient data... Kindle-like simple UI... assess my idea first... /prompt-enhancer /grill-me"*
* **Actions:** Generated `REFERENCES.md`, `DISCLOSURES.md`, `MEMORY.md`, and `UIUX_SPEC.md`.

### Session 5: Official Compliance Extraction & Critic Audit
* **Prompt:** *"hindi ko makita yung sense and purpose ng OfflineDoc now... run critic agent, we need to make a decision"*
* **Actions:** Analyzed PhilHealth Circular No. 2024-0013 (Annex G & H). Critic Agent proved that 30-60s voice dictation cannot satisfy 50-field EHRs from scratch, but matches 100% to DOH Target Client List (TCL) rows. Recommended pivot to TCL + ITR Encounter Slip.

### Session 6: Execution of the DOH TCL & ITR Engine
* **Prompt:** *"proceed. create a /plan"*
* **Actions:** Created [pivoting_to_doh_tcl_and_itr_engine.md](file:///C:/Users/user/.gemini/antigravity/brain/9eb5627f-be26-4e69-a616-34bf024423b9/pivoting_to_doh_tcl_and_itr_engine.md). Implemented Tagalog numeral normalization, administrative Llama 3.2 prompt, zero-fake dynamic extractor, pre-warmed `llama-server.exe` daemon, `fpdf2` DOH ITR PDF generator, and Kindle UI updates. Automated test suite in `test_scenarios.py` confirmed 100% passing across all 5 test suites.

### Session 7: Option A Frontend Scaffold & PWA Master-Detail System
* **Prompt:** *"now let's proceed with the option A"*
* **Actions:** Implemented full "Kindle Calm" PWA responsive layout per [UIUX_SPEC.md](file:///c:/Users/user/Documents/ANDREI_FILES/DEVFILES/PROJECTS/OfflineDoc/UIUX_SPEC.md). Added Service Worker app-shell pre-caching (`sw.js`) and dynamic offline badge monitor. Expanded backend to seed all 4 authentic Philippine community cohorts (`P-001` Maternal Care, `P-002` Hypertension, `P-003` General Senior Cough, `P-004` Child Immunization EPI). Added Master-Detail split view on tablet/desktop (>840px), touch gesture protection (`touch-action: manipulation; overscroll-behavior-y: none; user-select: none;`), 4 synthetic one-click test loaders in modal, and verified 100% zero emoji compliance. Automated test suite in `test_scenarios.py` expanded and verified 100% passing across all 7 verification suites. Created comprehensive [README.md](file:///c:/Users/user/Documents/ANDREI_FILES/DEVFILES/PROJECTS/OfflineDoc/README.md).

---

## 4. Current File Map & Link Graph

```
OfflineDoc/
├── README.md                      (Comprehensive hackathon judge reproduction guide & benchmarks)
├── OFFICIAL_BRIEF.md              (Hackathon organizer rules & schedule)
├── RULEBOOK.md                    (Numbered requirements R1-R21 & scoring weights)
├── PROJECT_CONTRACT.md            (User, problem, core promise, cut list)
├── REFERENCES.md                  (Authoritative 2021-2026 research & legal citations)
├── DISCLOSURES.md                 (Mandatory tools, libraries, and AI disclosures)
├── MEMORY.md                      (This file: living prompt & architecture memory)
├── UIUX_SPEC.md                   (Kindle-like responsive layout & interaction spec)
├── CHECKLIST.md                   (Phased execution checklist)
├── IMPLEMENTATION_PLAN.md         (Vertical slices S0-S4)
├── server.py                      (FastAPI backend with faster-whisper, llama.cpp & PDF routes)
├── pdf_generator.py               (Statutory DOH ITR & TCL Encounter Slip PDF generator)
├── test_scenarios.py              (End-to-end automated clinical verification suite - 7 suites)
├── static/
│   ├── index.html                 (Kindle Calm UI shell, Master-Detail split view, SVG-only)
│   ├── style.css                  (Medical azure & clean paper typography, touch protection)
│   ├── app.js                     (PWA service worker, dossier renderer, voice recorder, PDF handler)
│   ├── sw.js                      (Service Worker pre-caching app shell for air-gapped execution)
│   └── manifest.json              (Standalone PWA configuration)
└── data/
    ├── patients/                  (Patient longitudinal JSON ledgers: P-001, P-002, P-003, P-004)
    ├── visits/                    (Atomic encounter JSON records)
    └── pdf_exports/               (Generated DOH ITR encounter slips)
```
