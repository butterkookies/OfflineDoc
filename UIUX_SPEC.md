# UIUX_SPEC.md: Kindle-Style Responsive Interface Specification

**Project:** OfflineDoc  
**Design Philosophy:** "Kindle Calm" — Distraction-free, high-legibility, focused linear workflow with zero UI clutter.  
**Cross-References:** [PROJECT_CONTRACT.md](file:///c:/Users/user/Documents/ANDREI_FILES/DEVFILES/PROJECTS/OfflineDoc/PROJECT_CONTRACT.md) | [MEMORY.md](file:///c:/Users/user/Documents/ANDREI_FILES/DEVFILES/PROJECTS/OfflineDoc/MEMORY.md) | [DISCLOSURES.md](file:///c:/Users/user/Documents/ANDREI_FILES/DEVFILES/PROJECTS/OfflineDoc/DISCLOSURES.md)

---

## 1. Core Principles of "Kindle Calm" Design for Healthcare

Frontline health workers do not want bloated enterprise dashboards. Under the Philippine sun or in dimly lit rural households, they need high contrast, large touch targets, and a single obvious next action.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             THE "KINDLE CALM" RULES                              │
├──────────────────────────────────────────────────────────────────────────────────┤
│ 1. One Primary Task per Screen: Never cram Record, History, and Edit together.   │
│ 2. High Contrast & Legibility: Deep Charcoal on Crisp White & Soft Slate.        │
│ 3. Native App Feel: No browser zooming, no rubber-banding, no accidental text selection.
│ 4. Card-Based Progressive Disclosure: Summary first, click to expand history.    │
│ 5. STRICTLY NO EMOJIS: Use crisp, medical-grade SVG vector icons only.           │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Visual Tokens (`OfflineDoc-logo.jpg` Palette)
* **Background Primary:** `#FFFFFF` (Clinical White)
* **Background Surface / Cards:** `#F8FAFC` (Slate-50) with subtle `#E2E8F0` borders
* **Primary Brand / Action:** `#0066FF` (Medical Azure Blue)
* **Text High-Emphasis:** `#0F172A` (Slate-900)
* **Text Medium-Emphasis:** `#475569` (Slate-600)
* **Status Badges:**
  * Offline Active: `#0284C7` (Sky Blue) with `☁̸ Offline` pill
  * Critical Gap / Missing: `#EA580C` (Warm Amber/Orange)
  * Confirmed / Complete: `#16A34A` (Clinical Green)

---

## 2. Native App Interaction Standards (PWA Feel)

To ensure OfflineDoc feels like a genuine native iOS/Android utility rather than a sloppy web page:

```css
/* Prevent pinch-to-zoom and double-tap zoom */
html, body {
  touch-action: manipulation;
  -webkit-text-size-adjust: 100%;
  overscroll-behavior-y: none;
  height: 100dvh;
}

/* Prevent accidental text highlighting during button taps */
button, .nav-item, .card-header, .pill {
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

/* Safe area padding for device notches and home indicator bars */
.app-header {
  padding-top: max(16px, env(safe-area-inset-top));
}
.app-bottom-bar {
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}
```

---

## 3. Responsive Screen Ratio Layouts (Mobile, Tablet, Desktop)

### A. Mobile Portrait (9:16 to 9:20 — Smartphones: Android & iPhone)
* **Layout Structure:** Single vertical column with fixed top status bar and bottom action bar.
* **Header:** Logo + `☁̸ Offline` indicator + Search icon.
* **Body:** Clean scrolling list of **Patient Cards** (or single active encounter step).
* **Footer Action Bar:** Prominent circular microphone button (`+ Record Visit`) centered at thumb reach.
* **Rule:** When recording or reviewing an encounter, the screen transitions cleanly into a dedicated full-screen modal step (Kindle page turn).

### B. Tablet & Foldable (3:4 / 4:3 — iPad, Android Tablets, Foldables)
* **Layout Structure:** Master-Detail Split View (2 Columns).
  * **Left Column (35% width):** Search & filter bar + Patient Card List.
  * **Right Column (65% width):** Selected Patient's longitudinal summary, historical encounter timeline (Visits 1, 2, 3), and "Start New Encounter" card.
* **Advantage:** BHW can glance at the patient's previous encounters while dictating the new one.

### C. Desktop & Laptop (16:9 / 16:10 — Rural Health Station PC / Laptop)
* **Layout Structure:** 3-Zone Clinical Command Center.
  * **Left Navigation (240px):** Filter by Program (Maternal Care, Immunization, Hypertension, All) + Date range.
  * **Center Stage (Expanded):** Patient Directory with search and cohort badges.
  * **Slide-over Workspace (Right Panel):** Encounter Review, PDF report preview, and export controls.

---

## 4. Patient Directory & Longitudinal Summary Component

```
┌────────────────────────────────────────────────────────────────────────┐
│  [Search by Name or Purok...]               [All] [Maternal] [Hypert.] │
├────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ MARIA SANTOS (34, F) — Purok 2                     [Visit 3 of 3]│  │
│  │ Program: Maternal Care (Trimester 3)                             │  │
│  │ Last Visit: Oct 2, 2026 (BP: 120/80, FHR: 140 bpm)               │  │
│  │ AI Summary: Stable pregnancy; iron supplements dispensed.       │  │
│  │ Next Action: Pre-natal checkup due Oct 16.                       │  │
│  │ [► View Encounter History (3)]        [+ Record New Visit]       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ JUAN DELA CRUZ (62, M) — Purok 5                   [Visit 1 of 1]│  │
│  │ Program: Senior Citizen / Hypertension                           │  │
│  │ Last Visit: Oct 8, 2026 (BP: 150/95 - High)                      │  │
│  │ AI Summary: Elevated blood pressure; advised low-sodium diet.    │  │
│  │ [► View Encounter History (1)]        [+ Record New Visit]       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Structure for Multi-Visit Patients
To keep the application 100% air-gapped without needing an external SQL server, patients are organized as lightweight local JSON documents:
```json
{
  "patient_id": "P-0492",
  "full_name": "Maria Santos",
  "purok": "Purok 2",
  "age": 34,
  "sex": "Female",
  "program": "Maternal Care",
  "longitudinal_summary": "G2P1 32 weeks pregnant. Blood pressure consistently stable across 3 visits. Mild ankle edema noted in Visit 2, resolved in Visit 3.",
  "encounters": [
    { "visit_num": 1, "date": "2026-08-15", "bp": "115/75", "notes": "Initial prenatal intake" },
    { "visit_num": 2, "date": "2026-09-10", "bp": "120/80", "notes": "Follow-up; mild edema" },
    { "visit_num": 3, "date": "2026-10-02", "bp": "120/80", "notes": "Stable; iron supplement" }
  ]
}
```
