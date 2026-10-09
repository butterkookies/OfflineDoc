/**
 * OfflineDoc - Client-Side Orchestrator & Two-Way Grounding Engine
 * 100% On-Device. Zero External CDNs or Cloud Calls.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- State ---
  let recorder = null;
  let isRecording = false;
  let currentTranscript = "";
  let currentRecord = null;
  let currentSpans = {};
  let isSampleMode = false;
  let currentPhotoDataUrl = null;

  // --- DOM Elements ---
  // Header & Nav
  const navBtnHome = document.getElementById("nav-btn-home");
  const navBtnRecord = document.getElementById("nav-btn-record");
  const navBrand = document.getElementById("nav-brand");

  // Views
  const viewHome = document.getElementById("view-home");
  const viewRecord = document.getElementById("view-record");
  const viewReview = document.getElementById("view-review");
  const viewExport = document.getElementById("view-export");

  // Home Screen Elements
  const statTotalVisits = document.getElementById("stat-total-visits");
  const statTotalReferrals = document.getElementById("stat-total-referrals");
  const statTotalFollowups = document.getElementById("stat-total-followups");
  const btnHomeStartRecord = document.getElementById("btn-home-start-record");
  const sectionFollowups = document.getElementById("section-followups");
  const badgeFollowupCount = document.getElementById("badge-followup-count");
  const followupList = document.getElementById("followup-list");
  const badgeVisitsCount = document.getElementById("badge-visits-count");
  const visitsList = document.getElementById("visits-list");
  const emptyVisitsState = document.getElementById("empty-visits-state");

  // Record Screen Elements
  const recordTimer = document.getElementById("record-timer");
  const btnRecord = document.getElementById("btn-record");
  const micHalo = document.getElementById("mic-halo");
  const micIcon = document.getElementById("mic-icon");
  const recordStatusText = document.getElementById("record-status-text");
  const audioLevelBar = document.getElementById("audio-level-bar");
  const processingIndicator = document.getElementById("processing-indicator");
  const procStepTitle = document.getElementById("proc-step-title");
  const procStepDesc = document.getElementById("proc-step-desc");
  const btnLoadSample = document.getElementById("btn-load-sample");
  const fileUploadWav = document.getElementById("file-upload-wav");
  const sampleBanner = document.getElementById("sample-banner");

  // Review Screen Elements
  const btnReRecord = document.getElementById("btn-re-record");
  const reviewTriageAlert = document.getElementById("review-triage-alert");
  const triageAlertIcon = document.getElementById("triage-alert-icon");
  const triageAlertTitle = document.getElementById("triage-alert-title");
  const triageAlertDesc = document.getElementById("triage-alert-desc");
  const transcriptDisplay = document.getElementById("transcript-display");
  const transcribeTimeBadge = document.getElementById("transcribe-time-badge");
  const btnEditTranscript = document.getElementById("btn-edit-transcript");
  const transcriptEditContainer = document.getElementById("transcript-edit-container");
  const transcriptEditTextarea = document.getElementById("transcript-edit-textarea");
  const btnCancelEditTranscript = document.getElementById("btn-cancel-edit-transcript");
  const btnSaveEditTranscript = document.getElementById("btn-save-edit-transcript");
  const btnConfirmSave = document.getElementById("btn-confirm-save");

  // Review Form Inputs
  const inpPatientLabel = document.getElementById("inp-patient-label");
  const inpAge = document.getElementById("inp-age");
  const inpLocation = document.getElementById("inp-location");
  const inpComplaint = document.getElementById("inp-complaint");
  const inpSymptoms = document.getElementById("inp-symptoms");
  const inpBp = document.getElementById("inp-bp");
  const inpTemp = document.getElementById("inp-temp");
  const inpPulse = document.getElementById("inp-pulse");
  const inpMeds = document.getElementById("inp-meds");
  const inpAdvice = document.getElementById("inp-advice");
  const inpFollowUp = document.getElementById("inp-follow-up");

  // Clinical Photo Attachment Elements
  const inpCameraPhoto = document.getElementById("inp-camera-photo");
  const inpGalleryPhoto = document.getElementById("inp-gallery-photo");
  const photoPreviewContainer = document.getElementById("photo-preview-container");
  const photoPreviewImg = document.getElementById("photo-preview-img");
  const btnRemovePhoto = document.getElementById("btn-remove-photo");
  const inpPhotoCaption = document.getElementById("inp-photo-caption");

  // Referral Card & Toggle
  const cardReferral = document.getElementById("card-referral");
  const chkEnableReferral = document.getElementById("chk-enable-referral");
  const referralFieldsContainer = document.getElementById("referral-fields-container");
  const inpRefFacility = document.getElementById("inp-ref-facility");
  const inpRefReason = document.getElementById("inp-ref-reason");
  const badgeReferral = document.getElementById("badge-referral");

  // Vitals cards for warning borders
  const vitalBpCard = document.getElementById("vital-bp-card");
  const vitalTempCard = document.getElementById("vital-temp-card");

  // Verified Indicators
  const vPatient = document.getElementById("v-patient");
  const vComplaint = document.getElementById("v-complaint");
  const vVitals = document.getElementById("v-vitals");

  // Export Screen Elements
  const exportPatientSummary = document.getElementById("export-patient-summary");
  const linkDownloadUnified = document.getElementById("link-download-unified");
  const btnViewLogbook = document.getElementById("btn-view-logbook");
  const btnNewVisit = document.getElementById("btn-new-visit");

  // --- Screen Navigation ---
  function showScreen(screen) {
    viewHome.classList.remove("active");
    viewRecord.classList.remove("active");
    viewReview.classList.remove("active");
    viewExport.classList.remove("active");

    navBtnHome.classList.remove("active");
    navBtnRecord.classList.remove("active");

    if (screen === "home") {
      viewHome.classList.add("active");
      navBtnHome.classList.add("active");
      loadLogbook();
    } else if (screen === "record") {
      viewRecord.classList.add("active");
      navBtnRecord.classList.add("active");
    } else if (screen === "review") {
      viewReview.classList.add("active");
    } else if (screen === "export") {
      viewExport.classList.add("active");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navBtnHome.addEventListener("click", () => showScreen("home"));
  navBtnRecord.addEventListener("click", () => showScreen("record"));
  navBrand.addEventListener("click", () => showScreen("home"));
  btnHomeStartRecord.addEventListener("click", () => showScreen("record"));

  // --- Case Presets & Teleprompter Switching (Anti-Mental Block) ---
  const teleprompterText = document.getElementById("teleprompter-text");
  const presetChips = document.querySelectorAll(".preset-chip");

  const presetTemplates = {
    hypertension: `"Si <span class="slot slot-patient">[Pangalan]</span>, <span class="slot slot-age">[Edad] anyos</span>, taga <span class="slot slot-loc">[Sitio o Purok]</span>. Masakit ang batok at nahihilo. Ang BP niya <span class="slot slot-bp">[150 over 95]</span>, may temperatura na <span class="slot slot-temp">[37.8]</span>. Binigyan ko ng <span class="slot slot-meds">[paracetamol]</span> at pinagpahinga. Sinabihan ko na magpunta sa <span class="slot slot-plan">[RHU bukas]</span>. Babalikan ko sa <span class="slot slot-plan">[Biyernes]</span>."`,
    fever: `"Si <span class="slot slot-patient">[Pangalan]</span>, <span class="slot slot-age">[Edad] anyos</span>, taga <span class="slot slot-loc">[Sitio o Purok]</span>. May mataas na lagnat na <span class="slot slot-temp">[38.5]</span> simula pa kahapon at giniginaw. Ang BP niya <span class="slot slot-bp">[120 over 80]</span>. Binigyan ko ng <span class="slot slot-meds">[paracetamol]</span> at pinainom ng maraming tubig. Sinabihan na pumunta sa <span class="slot slot-plan">[RHU]</span> kapag hindi nawala ang lagnat. Babalikan ko <span class="slot slot-plan">[bukas]</span>."`,
    cough: `"Si <span class="slot slot-patient">[Pangalan]</span>, <span class="slot slot-age">[Edad] anyos</span>, taga <span class="slot slot-loc">[Sitio o Purok]</span>. May ubo at sipon na <span class="slot slot-complaint">[tatlong araw na]</span>, pero walang hirap sa paghinga. Normal ang temperatura na <span class="slot slot-temp">[36.8]</span>, BP ay <span class="slot slot-bp">[110 over 70]</span>. Pinayuhang magpahinga at uminom ng maraming tubig. Babalikan ko sa <span class="slot slot-plan">[Lunes]</span>."`,
    general: `"Si <span class="slot slot-patient">[Pangalan]</span>, <span class="slot slot-age">[Edad] anyos</span>, taga <span class="slot slot-loc">[Sitio o Purok]</span>. Nagpa-check ng blood pressure. Ang BP niya <span class="slot slot-bp">[120 over 80]</span>, walang iniindang sakit. Pinayuhang ituloy ang regular na ehersisyo at bawas sa maaalat na pagkain. Babalikan sa <span class="slot slot-plan">[susunod na buwan]</span>."`,
  };

  presetChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      presetChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const pKey = chip.dataset.preset;
      if (presetTemplates[pKey] && teleprompterText) {
        teleprompterText.innerHTML = presetTemplates[pKey];
      }
    });
  });

  // --- Format Timer ---
  function formatSeconds(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  // --- Logbook Loader (Home Screen) ---
  async function loadLogbook() {
    try {
      const resp = await fetch("/api/visits");
      if (!resp.ok) return;
      const data = await resp.json();
      const visits = data.visits || [];

      // Update counters
      statTotalVisits.textContent = visits.length;
      badgeVisitsCount.textContent = visits.length;

      let referralCount = 0;
      let allFollowups = [];

      // Render visits
      visitsList.innerHTML = "";
      if (visits.length === 0) {
        emptyVisitsState.style.display = "block";
        visitsList.appendChild(emptyVisitsState);
      } else {
        emptyVisitsState.style.display = "none";
        visits.forEach((v) => {
          if (v.has_referral) referralCount++;
          if (Array.isArray(v.follow_up) && v.follow_up.length > 0) {
            v.follow_up.forEach((fu) => {
              allFollowups.push({
                patient: v.patient_label,
                task: fu.task || "Follow-up consultation",
                due: fu.due || "TBD",
              });
            });
          }

          const card = document.createElement("div");
          card.className = "visit-card";

          // Format time
          let timeDisplay = "";
          if (v.saved_at) {
            try {
              const d = new Date(v.saved_at);
              timeDisplay = d.toLocaleDateString("tl-PH", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
            } catch (e) {
              timeDisplay = v.saved_at;
            }
          }

          // Vitals & Triage tags
          let vitalsHtml = "";
          
          // Triage status tag
          const tLevel = v.triage_level || (v.has_referral ? "urgent" : "routine");
          if (tLevel === "urgent") {
            vitalsHtml += `<span class="vital-tag triage-tag-urgent">🔴 URGENT</span>`;
          } else if (tLevel === "monitor") {
            vitalsHtml += `<span class="vital-tag triage-tag-monitor">🟡 MONITOR</span>`;
          } else {
            vitalsHtml += `<span class="vital-tag triage-tag-routine">🟢 STABLE</span>`;
          }

          if (v.bp) {
            const isBpHigh = isHighBp(v.bp);
            vitalsHtml += `<span class="vital-tag ${isBpHigh ? "vital-tag-warn" : ""}">BP: ${escapeHtml(v.bp)}</span>`;
          }
          if (v.temp_c) {
            const isFever = v.temp_c >= 38.0;
            vitalsHtml += `<span class="vital-tag ${isFever ? "vital-tag-warn" : ""}">T: ${v.temp_c}°C</span>`;
          }
          if (v.has_photo) {
            vitalsHtml += `<span class="vital-tag" style="background:rgba(56,189,248,0.18);color:#38bdf8;border:1px solid rgba(56,189,248,0.4);">📸 Litrato</span>`;
          }

          const pdfLink = v.pdf_url || v.visit_pdf;

          card.innerHTML = `
            <div class="visit-card-header">
              <div>
                <span class="visit-patient-name">${escapeHtml(v.patient_label)}</span>
                ${v.location ? `<span style="font-size:0.75rem; color:#94a3b8; margin-left:6px;">· ${escapeHtml(v.location)}</span>` : ""}
              </div>
              <span class="visit-time">${escapeHtml(timeDisplay)}</span>
            </div>
            ${vitalsHtml ? `<div class="visit-meta-row">${vitalsHtml}</div>` : ""}
            ${v.chief_complaint ? `<div class="visit-complaint-preview">"${escapeHtml(v.chief_complaint)}"</div>` : ""}
            <div class="visit-actions-row">
              <a href="${pdfLink}" target="_blank" class="btn-visit-dl" style="width:100%;text-align:center;">📄 Buksan ang Opisyal na PDF</a>
            </div>
          `;
          visitsList.appendChild(card);
        });
      }

      statTotalReferrals.textContent = referralCount;

      // Render Follow-ups
      statTotalFollowups.textContent = allFollowups.length;
      badgeFollowupCount.textContent = allFollowups.length;
      if (allFollowups.length > 0) {
        sectionFollowups.style.display = "block";
        followupList.innerHTML = "";
        allFollowups.slice(0, 5).forEach((item) => {
          const fDiv = document.createElement("div");
          fDiv.className = "followup-item";
          fDiv.innerHTML = `
            <div>
              <span class="followup-patient">${escapeHtml(item.patient)}</span>
              <div class="followup-task">${escapeHtml(item.task)}</div>
            </div>
            <span class="followup-due-badge">${escapeHtml(item.due)}</span>
          `;
          followupList.appendChild(fDiv);
        });
      } else {
        sectionFollowups.style.display = "none";
      }
    } catch (err) {
      console.error("Failed to load logbook:", err);
    }
  }

  function isHighBp(bpStr) {
    if (!bpStr || !bpStr.includes("/")) return false;
    const parts = bpStr.split("/");
    const sys = parseInt(parts[0], 10);
    const dia = parseInt(parts[1], 10);
    return sys >= 140 || dia >= 90;
  }

  // --- Mic Recording Setup ---
  async function initRecorder() {
    if (!recorder) {
      recorder = new window.WavAudioRecorder();
      recorder.onTick = (elapsed) => {
        recordTimer.textContent = formatSeconds(elapsed);
      };
      recorder.onLevelChange = (level) => {
        audioLevelBar.style.width = `${Math.min(100, Math.round(level * 100))}%`;
      };
    }
  }

  btnRecord.addEventListener("click", async () => {
    if (!isRecording) {
      try {
        await initRecorder();
        await recorder.start();
        isRecording = true;

        btnRecord.classList.add("recording");
        micHalo.classList.add("recording");
        micIcon.textContent = "⏹️";
        recordStatusText.textContent = "Nirerekord... I-tap para ihinto";
        recordStatusText.style.color = "#f43f5e";
      } catch (err) {
        alert("Hindi mabuksan ang mikropono. Siguraduhing binigyan ng pahintulot ang browser.\n\nError: " + err.message);
      }
    } else {
      // Stop recording
      btnRecord.classList.remove("recording");
      micHalo.classList.remove("recording");
      micIcon.textContent = "🎙️";
      recordStatusText.textContent = "I-tap ang mikropono para magsalita";
      recordStatusText.style.color = "";
      audioLevelBar.style.width = "0%";
      isRecording = false;

      const result = await recorder.stop();
      if (!result) return;

      if (result.durationSeconds < 2.0) {
        alert("Napakabilis ng boses (kailangan ng higit sa 2 segundo). Paki-ulit po ang pagrekord.");
        recordTimer.textContent = "00:00";
        return;
      }

      await processAudioFile(result.blob);
    }
  });

  // --- Audio Processing & AI Pipeline ---
  async function processAudioFile(audioBlob) {
    try {
      processingIndicator.style.display = "block";
      procStepTitle.textContent = "Sinusuri ang Boses...";
      procStepDesc.textContent = "Whisper.cpp on-device transcription running...";

      const formData = new FormData();
      formData.append("file", audioBlob, "bhw_dictation.wav");

      const transResp = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!transResp.ok) {
        const errJson = await transResp.json();
        throw new Error(errJson.error || "Nabigo ang transkripsyon.");
      }

      const transData = await transResp.json();
      currentTranscript = transData.transcript;

      if (!currentTranscript || !currentTranscript.trim()) {
        alert("Walang narinig na salita o boses mula sa mikropono.\n\nPaki-lakasan po ang boses o ilapit ang mikropono habang nagsasalita, at subukang muli.");
        return;
      }

      setSampleBanner(false);
      transcribeTimeBadge.textContent = `${(transData.elapsed_ms / 1000).toFixed(1)}s local`;

      // Step 2: Extract clinical fields
      procStepTitle.textContent = "Kinukuha ang Medikal na Impormasyon...";
      procStepDesc.textContent = "Llama.cpp local structured extraction...";

      await runExtraction(currentTranscript);
    } catch (err) {
      alert("Error sa pagproseso: " + err.message);
    } finally {
      processingIndicator.style.display = "none";
      recordTimer.textContent = "00:00";
    }
  }

  // --- Run Clinical Extraction ---
  async function runExtraction(transcriptText) {
    const extResp = await fetch("/api/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: transcriptText }),
    });

    if (!extResp.ok) {
      const errJson = await extResp.json();
      throw new Error(errJson.error || "Nabigo ang extraction.");
    }

    const extData = await extResp.json();
    currentRecord = extData.data;
    currentSpans = extData.verified_spans || {};

    setSampleBanner(isSampleMode);
    populateReviewScreen(transcriptText, currentRecord, currentSpans);
    showScreen("review");
  }

  // --- Sample Demo Mode ---
  function setSampleBanner(show) {
    isSampleMode = show;
    sampleBanner.style.display = show ? "block" : "none";
  }

  btnLoadSample.addEventListener("click", async () => {
    setSampleBanner(true);
    processingIndicator.style.display = "block";
    procStepTitle.textContent = "Nilo-load ang Sample Visit...";
    procStepDesc.textContent = "Taglish consultation with high BP and fever...";

    const sampleTranscript =
      "Si Tatay Rodrigo, 62 taong gulang taga Sitio Maligaya. Ang BP niya kanina ay 150 over 95, may lagnat din na 38.5. Masakit daw ang batok at nahihilo simula pa kahapon. Binigyan ko muna ng Paracetamol 500mg at pinagpahinga. Sinabihan ko na magpunta sa RHU bukas ng umaga para patingnan sa doktor. Babalikan ko sa Biyernes para i-follow up ang BP niya.";

    currentTranscript = sampleTranscript;
    transcribeTimeBadge.textContent = "0.8s sample";

    try {
      await runExtraction(sampleTranscript);
    } catch (err) {
      alert("Error sa sample: " + err.message);
    } finally {
      processingIndicator.style.display = "none";
    }
  });

  // File Upload fallback
  fileUploadWav.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await processAudioFile(file);
    e.target.value = "";
  });

  // Re-record
  btnReRecord.addEventListener("click", () => {
    showScreen("record");
  });

  // --- Editable Transcript Interactions ---
  btnEditTranscript.addEventListener("click", () => {
    transcriptDisplay.style.display = "none";
    transcriptEditContainer.style.display = "block";
    transcriptEditTextarea.value = currentTranscript;
    btnEditTranscript.style.display = "none";
    transcriptEditTextarea.focus();
  });

  btnCancelEditTranscript.addEventListener("click", () => {
    transcriptEditContainer.style.display = "none";
    transcriptDisplay.style.display = "block";
    btnEditTranscript.style.display = "inline-block";
  });

  btnSaveEditTranscript.addEventListener("click", async () => {
    const updatedText = transcriptEditTextarea.value.trim();
    if (!updatedText) {
      alert("Hindi maaaring walang laman ang salaysay.");
      return;
    }
    currentTranscript = updatedText;
    transcriptEditContainer.style.display = "none";
    transcriptDisplay.style.display = "block";
    btnEditTranscript.style.display = "inline-block";

    btnSaveEditTranscript.disabled = true;
    btnSaveEditTranscript.textContent = "Ina-update...";
    try {
      await runExtraction(updatedText);
    } catch (err) {
      alert("Error sa re-extraction: " + err.message);
    } finally {
      btnSaveEditTranscript.disabled = false;
      btnSaveEditTranscript.textContent = "🔄 I-update ang Form";
    }
  });

  // --- Clinical Photo Capture & Compression ---
  function handlePhotoFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 800;
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);
        currentPhotoDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        if (photoPreviewImg) photoPreviewImg.src = currentPhotoDataUrl;
        if (photoPreviewContainer) photoPreviewContainer.style.display = "flex";
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  if (inpCameraPhoto) {
    inpCameraPhoto.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) handlePhotoFile(e.target.files[0]);
    });
  }
  if (inpGalleryPhoto) {
    inpGalleryPhoto.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) handlePhotoFile(e.target.files[0]);
    });
  }
  if (btnRemovePhoto) {
    btnRemovePhoto.addEventListener("click", () => {
      currentPhotoDataUrl = null;
      if (photoPreviewImg) photoPreviewImg.src = "";
      if (photoPreviewContainer) photoPreviewContainer.style.display = "none";
      if (inpPhotoCaption) inpPhotoCaption.value = "";
      if (inpCameraPhoto) inpCameraPhoto.value = "";
      if (inpGalleryPhoto) inpGalleryPhoto.value = "";
    });
  }

  // --- Dynamic Triage Calculation & Notifications ---
  function calculateTriageStatus() {
    const bp = inpBp ? inpBp.value.trim() : "";
    const temp = inpTemp ? parseFloat(inpTemp.value) : NaN;
    const isRef = chkEnableReferral ? chkEnableReferral.checked : false;
    const alerts = [];
    let level = "routine";

    if (bp && bp.includes("/")) {
      const parts = bp.split("/");
      const sys = parseInt(parts[0], 10);
      const dia = parseInt(parts[1], 10);
      if (sys >= 180 || dia >= 120) {
        alerts.push(`Kritikal na BP (${bp}) - Hypertensive Urgency`);
        level = "urgent";
      } else if (sys >= 140 || dia >= 90) {
        alerts.push(`Mataas na BP (${bp}) - Stage 1/2 Hypertension`);
        if (level !== "urgent") level = isRef ? "urgent" : "monitor";
      } else if (sys >= 130 || dia >= 85) {
        alerts.push(`Elevated BP (${bp})`);
        if (level === "routine") level = "monitor";
      }
    }

    if (!isNaN(temp)) {
      if (temp >= 39.0) {
        alerts.push(`Mataas na Lagnat (${temp}°C)`);
        level = "urgent";
      } else if (temp >= 38.0) {
        alerts.push(`May Lagnat (${temp}°C)`);
        if (level === "routine") level = "monitor";
      }
    }

    if (isRef) {
      alerts.push("Isasama ang RHU Referral Slip");
      if (level === "routine") level = "monitor";
    }

    return { level, alerts };
  }

  function updateTriageStatusAlert() {
    if (!reviewTriageAlert) return;
    const { level, alerts } = calculateTriageStatus();

    reviewTriageAlert.classList.remove("triage-urgent", "triage-monitor", "triage-routine");

    if (level === "urgent") {
      reviewTriageAlert.classList.add("triage-urgent");
      if (triageAlertIcon) triageAlertIcon.textContent = "🔴";
      if (triageAlertTitle) triageAlertTitle.textContent = "KAGYAT NA AKSYON / URGENT REFERRAL";
      if (triageAlertDesc) {
        triageAlertDesc.textContent = alerts.length
          ? alerts.join(" · ")
          : "May kritikal na palatandaan na nangangailangan ng agarang atensyon ng doktor sa RHU.";
      }
    } else if (level === "monitor") {
      reviewTriageAlert.classList.add("triage-monitor");
      if (triageAlertIcon) triageAlertIcon.textContent = "🟡";
      if (triageAlertTitle) triageAlertTitle.textContent = "BANTAYAN / MONITOR & SCHEDULE FOLLOW-UP";
      if (triageAlertDesc) {
        triageAlertDesc.textContent = alerts.length
          ? alerts.join(" · ")
          : "Bantayan ang mga sintomas at sundin ang plano sa pagbalik.";
      }
    } else {
      reviewTriageAlert.classList.add("triage-routine");
      if (triageAlertIcon) triageAlertIcon.textContent = "🟢";
      if (triageAlertTitle) triageAlertTitle.textContent = "MAAYOS / ROUTINE & STABLE";
      if (triageAlertDesc) {
        triageAlertDesc.textContent = "Normal ang mga vital signs at walang kagyat na panganib.";
      }
    }
  }

  // --- Populate Review Screen & Setup Grounding ---
  function populateReviewScreen(transcript, record, spans) {
    // Reset photo
    currentPhotoDataUrl = null;
    if (photoPreviewImg) photoPreviewImg.src = "";
    if (photoPreviewContainer) photoPreviewContainer.style.display = "none";
    if (inpPhotoCaption) inpPhotoCaption.value = "";
    if (inpCameraPhoto) inpCameraPhoto.value = "";
    if (inpGalleryPhoto) inpGalleryPhoto.value = "";

    // Fill fields
    inpPatientLabel.value = record.patient_label || "";
    inpAge.value = record.age_years !== null ? record.age_years : "";
    inpLocation.value = record.location || "";
    inpComplaint.value = record.chief_complaint || "";
    inpSymptoms.value = Array.isArray(record.symptoms) ? record.symptoms.join(", ") : "";

    const vitals = record.vitals || {};
    inpBp.value = vitals.bp || "";
    inpTemp.value = vitals.temp_c !== null ? vitals.temp_c : "";
    inpPulse.value = vitals.pulse_bpm !== null ? vitals.pulse_bpm : "";

    inpMeds.value = Array.isArray(record.medications_given) ? record.medications_given.join(", ") : "";
    inpAdvice.value = Array.isArray(record.advice_given) ? record.advice_given.join(", ") : "";

    // Follow-up
    if (Array.isArray(record.follow_up) && record.follow_up.length > 0) {
      inpFollowUp.value = record.follow_up.map((f) => `${f.task || "Follow-up"} (${f.due || ""})`).join("; ");
    } else {
      inpFollowUp.value = "";
    }

    // Referral slip card logic (strictly conditional)
    const isBpDanger = isHighBp(vitals.bp);
    const isTempDanger = vitals.temp_c !== null && vitals.temp_c >= 38.5;
    const shouldAutoRefer = Boolean(record.referral || isBpDanger || isTempDanger);

    if (shouldAutoRefer) {
      chkEnableReferral.checked = true;
      referralFieldsContainer.style.display = "block";
      inpRefFacility.value = (record.referral && record.referral.facility) || "Rural Health Unit (RHU)";
      inpRefReason.value = (record.referral && record.referral.reason) ||
        (isBpDanger ? "High blood pressure / hypertension triage" : "Clinical evaluation and physician care");

      if (isBpDanger || isTempDanger || (record.referral && record.referral.urgency === "urgent")) {
        badgeReferral.textContent = "URGENT";
        badgeReferral.className = "badge-urgent";
      } else {
        badgeReferral.textContent = "ROUTINE";
        badgeReferral.className = "badge-routine";
      }
    } else {
      chkEnableReferral.checked = false;
      referralFieldsContainer.style.display = "none";
      inpRefFacility.value = "";
      inpRefReason.value = "";
      badgeReferral.textContent = "ROUTINE";
      badgeReferral.className = "badge-routine";
    }

    // Checkbox toggle listener
    chkEnableReferral.onchange = () => {
      if (chkEnableReferral.checked) {
        referralFieldsContainer.style.display = "block";
        if (!inpRefFacility.value.trim()) inpRefFacility.value = "Rural Health Unit (RHU)";
        if (!inpRefReason.value.trim()) inpRefReason.value = inpComplaint.value.trim() || "Clinical consultation";
      } else {
        referralFieldsContainer.style.display = "none";
      }
      updateTriageStatusAlert();
    };

    // Vitals warning checks & Triage Banner update
    checkVitalsWarnings();
    updateTriageStatusAlert();

    // Field verified badges
    updateVerifiedIndicators(spans);

    // Render interactive transcript spans
    renderTranscriptWithSpans(transcript, spans);

    // Setup interactive card / span grounding listeners
    setupGroundingInteractions();
  }

  // --- Range & Alert Checks ---
  function checkVitalsWarnings() {
    const bp = inpBp.value.trim();
    if (isHighBp(bp)) {
      vitalBpCard.classList.add("warning");
    } else {
      vitalBpCard.classList.remove("warning");
    }

    const temp = parseFloat(inpTemp.value);
    if (!isNaN(temp) && temp >= 38.0) {
      vitalTempCard.classList.add("warning");
    } else {
      vitalTempCard.classList.remove("warning");
    }

    updateTriageStatusAlert();
  }

  inpBp.addEventListener("input", checkVitalsWarnings);
  inpTemp.addEventListener("input", checkVitalsWarnings);
  inpComplaint.addEventListener("input", updateTriageStatusAlert);

  // --- Verified Indicators ---
  function updateVerifiedIndicators(spans) {
    function setBadge(el, spanObj) {
      if (!el) return;
      if (spanObj && spanObj.status === "verified") {
        el.innerHTML = '<span class="v-verified">✓ Patunay sa Boses</span>';
      } else if (spanObj && spanObj.status === "unverified") {
        el.innerHTML = '<span class="v-unverified">⚠️ Manu-manong Suriin</span>';
      } else {
        el.innerHTML = "";
      }
    }

    setBadge(vPatient, spans["patient_label"] || spans["age_years"] || spans["location"]);
    setBadge(vComplaint, spans["chief_complaint"] || spans["symptoms"]);
    setBadge(vVitals, spans["vitals.bp"] || spans["vitals.temp_c"]);
  }

  // --- Render Transcript with Grounding Spans ---
  function renderTranscriptWithSpans(transcript, spans) {
    const validSpans = [];
    for (const [field, span] of Object.entries(spans)) {
      if (span.status === "verified" && typeof span.start_char === "number" && typeof span.end_char === "number") {
        validSpans.push({
          field: field,
          start: span.start_char,
          end: span.end_char,
          quote: span.quote,
        });
      }
    }

    validSpans.sort((a, b) => a.start - b.start);

    const nonOverlapping = [];
    let lastEnd = 0;
    for (const sp of validSpans) {
      if (sp.start >= lastEnd) {
        nonOverlapping.push(sp);
        lastEnd = sp.end;
      }
    }

    let html = "";
    let cursor = 0;

    for (const sp of nonOverlapping) {
      if (sp.start > cursor) {
        html += escapeHtml(transcript.slice(cursor, sp.start));
      }
      const segment = escapeHtml(transcript.slice(sp.start, sp.end));
      html += `<span class="quote-span" data-field="${escapeHtml(sp.field)}">${segment}</span>`;
      cursor = sp.end;
    }

    if (cursor < transcript.length) {
      html += escapeHtml(transcript.slice(cursor));
    }

    transcriptDisplay.innerHTML = html;
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // --- Two-Way Grounding Interactions ---
  function setupGroundingInteractions() {
    const cards = document.querySelectorAll(".field-card");
    const quoteSpans = document.querySelectorAll(".quote-span");

    // Click on card / inputs -> highlight quote in transcript
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        activateField(card.dataset.field);
      });
      const inputs = card.querySelectorAll("input");
      inputs.forEach((inp) => {
        inp.addEventListener("focus", () => {
          activateField(card.dataset.field);
        });
      });
    });

    // Click on quote span -> highlight card and scroll into view
    quoteSpans.forEach((span) => {
      span.addEventListener("click", (e) => {
        e.stopPropagation();
        const fieldName = span.dataset.field;
        activateField(fieldName);

        const targetCard = document.querySelector(`.field-card[data-field="${fieldName}"]`) ||
                           document.querySelector(`.field-card[data-field^="${fieldName.split('.')[0]}"]`);
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
          const firstInp = targetCard.querySelector("input");
          if (firstInp) firstInp.focus();
        }
      });
    });
  }

  function activateField(fieldName) {
    if (!fieldName) return;
    const baseField = fieldName.split(".")[0];

    document.querySelectorAll(".field-card").forEach((c) => c.classList.remove("field-active"));
    document.querySelectorAll(".quote-span").forEach((s) => s.classList.remove("quote-active"));

    const targetCard = document.querySelector(`.field-card[data-field="${fieldName}"]`) ||
                       document.querySelector(`.field-card[data-field^="${baseField}"]`);
    if (targetCard) {
      targetCard.classList.add("field-active");
    }

    const matchingSpan = document.querySelector(`.quote-span[data-field="${fieldName}"]`) ||
                         document.querySelector(`.quote-span[data-field^="${baseField}"]`);
    if (matchingSpan) {
      matchingSpan.classList.add("quote-active");
      matchingSpan.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  // --- Confirm & Export ---
  btnConfirmSave.addEventListener("click", async () => {
    try {
      btnConfirmSave.disabled = true;
      btnConfirmSave.textContent = "Ipinoproseso at Isinesave...";

      const symptomsList = inpSymptoms.value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const medsList = inpMeds.value
        .split(",")
        .map((m) => m.trim())
        .filter((m) => m.length > 0);

      const adviceList = inpAdvice.value
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      // Follow-up parsing
      let followUpList = [];
      const followUpRaw = inpFollowUp.value.trim();
      if (followUpRaw) {
        followUpList = followUpRaw.split(";").map((item) => ({
          task: item.trim(),
          due: "Follow-up schedule",
        }));
      } else if (currentRecord && Array.isArray(currentRecord.follow_up) && currentRecord.follow_up.length > 0) {
        followUpList = currentRecord.follow_up;
      }

      // Referral logic (STRICTLY tied to the checkbox toggle)
      let referralObj = null;
      if (chkEnableReferral.checked && (inpRefFacility.value.trim() || inpRefReason.value.trim())) {
        referralObj = {
          facility: inpRefFacility.value.trim() || "Rural Health Unit (RHU)",
          reason: inpRefReason.value.trim() || "Clinical consultation and physician evaluation",
          urgency: badgeReferral.textContent.toLowerCase() === "urgent" ? "urgent" : "routine",
        };
      }

      // Calculate Triage Level & Alerts
      const { level: triageLevel, alerts: triageAlerts } = calculateTriageStatus();

      const confirmedRecord = {
        patient_label: inpPatientLabel.value.trim() || "Hindi pinangalanan",
        visit_date: new Date().toISOString().split("T")[0],
        location: inpLocation.value.trim() || null,
        age_years: inpAge.value ? parseInt(inpAge.value, 10) : null,
        sex: (currentRecord && currentRecord.sex) || null,
        chief_complaint: inpComplaint.value.trim() || null,
        symptoms: symptomsList,
        vitals: {
          bp: inpBp.value.trim() || null,
          temp_c: inpTemp.value ? parseFloat(inpTemp.value) : null,
          pulse_bpm: inpPulse.value ? parseInt(inpPulse.value, 10) : null,
          resp_rate: null,
          weight_kg: null,
        },
        medications_given: medsList,
        advice_given: adviceList,
        follow_up: followUpList,
        referral: referralObj,
        triage_level: triageLevel,
        alerts: triageAlerts,
        image_attachment: currentPhotoDataUrl || null,
        image_caption: inpPhotoCaption && inpPhotoCaption.value.trim() ? inpPhotoCaption.value.trim() : null,
        evidence: (currentRecord && currentRecord.evidence) || {},
      };

      const resp = await fetch("/api/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          record: confirmedRecord,
          transcript: currentTranscript || "",
        }),
      });

      if (!resp.ok) {
        const errJson = await resp.json();
        throw new Error(errJson.error || "Nabigo ang pag-confirm.");
      }

      const confData = await resp.json();

      // Setup Export Links (Unified PDF)
      exportPatientSummary.textContent = `Nakahanda na ang opisyal na dokumento para kay ${confirmedRecord.patient_label}.`;
      const finalPdfUrl = confData.exports.pdf_url || confData.exports.visit_pdf;
      if (linkDownloadUnified) {
        linkDownloadUnified.href = finalPdfUrl;
      }

      showScreen("export");
    } catch (err) {
      alert("Error sa pag-save: " + err.message);
    } finally {
      btnConfirmSave.disabled = false;
      btnConfirmSave.textContent = "✓ Kumpirmahin at I-save sa Logbook";
    }
  });

  // Export Screen Navigation
  btnViewLogbook.addEventListener("click", () => {
    showScreen("home");
  });

  btnNewVisit.addEventListener("click", () => {
    currentTranscript = "";
    currentRecord = null;
    currentSpans = {};
    currentPhotoDataUrl = null;
    setSampleBanner(false);
    showScreen("record");
  });

  // Initial load
  loadLogbook();
});
