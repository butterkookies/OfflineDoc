# OfflineDoc Motion Graphics & Pitch Video

This directory contains the production files, visual assets, audio tracks, scripts, and rendered deliverables for the official **OfflineDoc** motion graphic pitch video.

---

## 📽️ Deliverable Files

* **Primary Video:** [`OfflineDoc_Motion_Graphics.mp4`](./OfflineDoc_Motion_Graphics.mp4)
* **Specifications:**
  * **Resolution:** 1080p Full HD (1920 × 1080)
  * **Frame Rate:** 30 FPS
  * **Duration:** 53.63 seconds (1,608 total frames)
  * **Encoding:** H.264 (CRF 18 visually lossless) + AAC 192kbps stereo
  * **Voiceover Sync:** Aligned with `voiceover.mp3`

---

## 📁 Directory Structure

```
video/
├── OfflineDoc_Motion_Graphics.mp4     # Final rendered motion graphics pitch video
├── render_motion_graphics.py         # Self-contained Python/Pillow/ffmpeg rendering pipeline
├── README.md                          # Documentation and scene breakdown
├── assets/
│   ├── mixed_audio.aac               # Master mixed audio (voiceover + -16dB ducked ambient score)
│   ├── voiceover.mp3                 # Raw voiceover narration
│   ├── logo/
│   │   ├── OfflineDoc-new-logo.png   # Official brand logo (squircle + text)
│   │   ├── logo_icon_clean.png       # Isolated, transparent squircle icon mark
│   │   └── logo_text_clean.png       # Isolated, transparent wordmark
│   ├── screens/                      # High-res UI captures of actual working system
│   │   ├── 01_desktop_dashboard.png  # Desktop command center & cohort filters
│   │   ├── 02_mobile_home.png        # Mobile responsive PWA view
│   │   ├── 03_step1_record.png       # Step 1: Voice intake modal
│   │   ├── 04_step2_review_gaps.png  # Step 2: Structured TCL review modal
│   │   ├── 05_step2_red_flag_alert.png # Hypertensive crisis danger sign alert
│   │   └── 06_step3_success_export.png # Step 3: Confirmation & DOH ITR export
│   └── pdf_itr/
│       ├── maria_santos_itr_full.pdf # Official generated DOH ITR PDF encounter slip
│       └── maria_santos_itr_full.png # High-res rendered PDF page
├── keyframes/                        # Keyframe verification snapshots (Scenes 1–8)
│   ├── v2_scene_1_2.0s.jpg
│   ├── v2_scene_2_6.0s.jpg
│   ├── v2_scene_3_9.2s.jpg           # "Meet OfflineDoc" animated logo reveal
│   ├── v2_scene_4_13.0s.jpg
│   ├── v2_scene_5_19.0s.jpg          # Feature 01: On-Device Voice Intake
│   ├── v2_scene_6_27.0s.jpg          # Feature 02: Auditable TCL Extraction
│   ├── v2_scene_7_35.0s.jpg          # Feature 03: Red Flags & DOH PDF Slip
│   ├── v2_scene_8_44.0s.jpg          # Pitch Synthesis (Core Pillars)
│   └── v2_scene_9_51.0s.jpg          # Grand Outro
└── scripts/
    ├── capture_screens.js            # Automated Puppeteer script to capture UI
    └── seed_patients.py              # Test cohort data generator (Maria Santos, etc.)
```

---

## ⏱️ Scene Timing Map & Script Alignment

| Scene | Timestamp | Voiceover Script | Visual Showcase |
|---|---|---|---|
| **01** | `00.00s - 04.10s` | *"Healthcare workers in remote communities spend hours writing patient records by hand..."* | **The Frontline Reality:** BHW paperwork burden, ticking analog clock, manual logbook statistics. |
| **02** | `04.10s - 08.05s` | *"...where internet is unreliable, and cloud AI just isn't an option."* | **The Connectivity Wall:** Cloud AI blocked, 0 bars cellular disconnection, statutory privacy risks (RA 10173). |
| **03** | `08.05s - 10.50s` | *"Meet OfflineDoc."* | **Brand Reveal:** New animated logo entrance with rotating celestial orbital ring and radial bloom. |
| **04** | `10.50s - 16.20s` | *"An on-device clinical documentation assistant designed for offline care."* | **System Design Overview:** Desktop BHW Command Center + Responsive PWA view, Dual-Engine Stack (`faster-whisper INT8` + `Llama 3.2 1B Edge`). |
| **05** | `16.20s - 23.60s` | *"Speak naturally in Taglish—OfflineDoc captures the conversation on the device..."* | **Working Feature 01 (Voice Intake):** Live waveform, pulsing mic intake button, verbatim Taglish typewriter speech recognition. |
| **06** | `23.60s - 31.60s` | *"...and structures the information into standard health records with clear, auditable evidence."* | **Working Feature 02 (Evidence TCL Extraction):** Dynamic vector rays linking verbatim Taglish quotes directly to DOH Target Client List clinical fields with sub-second latency (0.79s). |
| **07** | `31.60s - 38.90s` | *"It automatically highlights critical details—like danger signs and protocol gaps—giving clinicians clarity at the point of care."* | **Working Feature 03 (Safety & DOH ITR Export):** Point-of-Care Red Flag Danger Sign (Teresa Ramos HTN crisis 150/95 mmHg), local atomic ledger commit, and real single-page DOH ITR PDF encounter slip preview. |
| **08** | `38.90s - 48.95s` | *"No cloud dependency, no unnecessary manual work, just practical AI designed to support efficient documentation while keeping patient information on the device."* | **The Value Pitch:** 3 Core Pillars (100% Air-Gapped, 95% Time Saved from 25 min to 30 sec, Statutory Compliance with RA 7883 & RA 10173). |
| **09** | `48.95s - 53.63s` | *(Musical swell & outro)* | **Grand Outro:** Centered clean logo, tagline *"Local intelligence for better documentation, anywhere."*, and model spec pills. |

---

## 🛠️ How to Re-render the Video

From the project root:

```powershell
.\.venv\Scripts\python.exe video/render_motion_graphics.py
```

Or from inside the `video/` directory:

```powershell
cd video
..\.venv\Scripts\python.exe render_motion_graphics.py
```
