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
  let editingVisitId = null;
  let allLoadedVisits = [];
  let cameraStream = null;
  let currentFacingMode = "environment";
  let activeFollowupRecord = null;

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
  const inpSearchVisits = document.getElementById("inp-search-visits");
  const btnClearSearch = document.getElementById("btn-clear-search");
  const searchStatusBar = document.getElementById("search-status-bar");
  const searchMatchCount = document.getElementById("search-match-count");
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

  // Teleprompter
  const teleprompterHeaderTitle = document.getElementById("teleprompter-header-title");
  const teleprompterInstruction = document.getElementById("teleprompter-instruction");
  const teleprompterText = document.getElementById("teleprompter-text");
  const presetChips = document.querySelectorAll(".preset-chip");

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
  const btnOpenLiveCam = document.getElementById("btn-open-live-cam");
  const inpCameraPhoto = document.getElementById("inp-camera-photo");
  const inpGalleryPhoto = document.getElementById("inp-gallery-photo");
  const photoPreviewContainer = document.getElementById("photo-preview-container");
  const photoPreviewImg = document.getElementById("photo-preview-img");
  const btnRemovePhoto = document.getElementById("btn-remove-photo");
  const inpPhotoCaption = document.getElementById("inp-photo-caption");

  // Live Camera Modal Elements
  const modalCameraCapture = document.getElementById("modal-camera-capture");
  const cameraVideoPreview = document.getElementById("camera-video-preview");
  const cameraSnapshotCanvas = document.getElementById("camera-snapshot-canvas");
  const btnCameraSwitch = document.getElementById("btn-camera-switch");
  const btnCameraShutter = document.getElementById("btn-camera-shutter");
  const btnCameraCancel = document.getElementById("btn-camera-cancel");
  const btnCloseCameraModal = document.getElementById("btn-close-camera-modal");

  // Follow-Up Details Modal Elements
  const modalFollowupDetails = document.getElementById("modal-followup-details");
  const followupModalContent = document.getElementById("followup-modal-content");
  const btnCloseFollowupModal = document.getElementById("btn-close-followup-modal");
  const btnModalCloseAction = document.getElementById("btn-modal-close-action");
  const btnModalOpenRecord = document.getElementById("btn-modal-open-record");

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
  navBtnRecord.addEventListener("click", () => {
    editingVisitId = null;
    btnConfirmSave.textContent = "✓ Kumpirmahin at I-save sa Logbook";
    showScreen("record");
  });
  navBrand.addEventListener("click", () => showScreen("home"));
  btnHomeStartRecord.addEventListener("click", () => {
    editingVisitId = null;
    btnConfirmSave.textContent = "✓ Kumpirmahin at I-save sa Logbook";
    showScreen("record");
  });

  // --- Case Presets & Teleprompter Switching (Anti-Mental Block) ---
  const presetTemplates = {
    hypertension: `"Si <span class="slot slot-patient">[Pangalan]</span>, <span class="slot slot-age">[Edad] anyos</span>, taga <span class="slot slot-loc">[Sitio o Purok / Lungsod]</span>. Masakit ang batok at nahihilo. Ang BP niya <span class="slot slot-bp">[150 over 95]</span>, may temperatura na <span class="slot slot-temp">[37.8]</span>. Binigyan ko ng <span class="slot slot-meds">[paracetamol]</span> at pinagpahinga. Sinabihan ko na magpunta sa <span class="slot slot-plan">[RHU bukas]</span>. Babalikan ko sa <span class="slot slot-plan">[Biyernes]</span>."`,
    fever: `"Si <span class="slot slot-patient">[Pangalan]</span>, <span class="slot slot-age">[Edad] anyos</span>, taga <span class="slot slot-loc">[Sitio o Purok / Lungsod]</span>. May mataas na lagnat na <span class="slot slot-temp">[38.5]</span> simula pa kahapon at giniginaw. Ang BP niya <span class="slot slot-bp">[120 over 80]</span>. Binigyan ko ng <span class="slot slot-meds">[paracetamol]</span> at pinainom ng maraming tubig. Sinabihan na pumunta sa <span class="slot slot-plan">[RHU]</span> kapag hindi nawala ang lagnat. Babalikan ko <span class="slot slot-plan">[bukas]</span>."`,
    cough: `"Si <span class="slot slot-patient">[Pangalan]</span>, <span class="slot slot-age">[Edad] anyos</span>, taga <span class="slot slot-loc">[Sitio o Purok / Lungsod]</span>. May ubo at sipon na <span class="slot slot-complaint">[tatlong araw na]</span>, pero walang hirap sa paghinga. Normal ang temperatura na <span class="slot slot-temp">[36.8]</span>, BP ay <span class="slot slot-bp">[110 over 70]</span>. Pinayuhang magpahinga at uminom ng maraming tubig. Babalikan ko sa <span class="slot slot-plan">[Lunes]</span>."`,
    diarrhea: `"Si <span class="slot slot-patient">[Pangalan]</span>, <span class="slot slot-age">[Edad] anyos</span>, taga <span class="slot slot-loc">[Sitio o Purok / Lungsod]</span>. Masakit ang tiyan at nagtatae ng <span class="slot slot-complaint">[matubig na dumi apat na beses]</span> simula kaninang umaga. Ang BP ay <span class="slot slot-bp">[110 over 70]</span>, temp <span class="slot slot-temp">[37.2]</span>. Binigyan ng <span class="slot slot-meds">[Oresol sa 1 litrong tubig]</span>. Sinabihang mag-ingat sa dehydration at pumunta sa <span class="slot slot-plan">[RHU]</span> kapag nanghina. Babalikan <span class="slot slot-plan">[bukas]</span>."`,
    wound: `"Si <span class="slot slot-patient">[Pangalan]</span>, <span class="slot slot-age">[Edad] anyos</span>, taga <span class="slot slot-loc">[Sitio o Purok / Lungsod]</span>. May <span class="slot slot-complaint">[sugat sa binti dahil sa pagkakadapa]</span>. Nilinis ang sugat gamit ang <span class="slot slot-meds">[betadine at sterile gauze]</span>. Normal ang BP <span class="slot slot-bp">[120 over 80]</span>. Pinayuhang panatilihing tuyo at malinis ang sugat. Sinabihan na pumunta sa <span class="slot slot-plan">[RHU para sa anti-tetanus shot]</span>. Babalikan sa <span class="slot slot-plan">[Miyerkules]</span>."`,
    prenatal: `"Si <span class="slot slot-patient">[Pangalan]</span>, <span class="slot slot-age">[Edad] anyos</span>, taga <span class="slot slot-loc">[Sitio o Purok / Lungsod]</span>. Buntis sa kanyang <span class="slot slot-complaint">[ika-6 na buwan]</span> para sa regular na prenatal check. Ang BP niya ay <span class="slot slot-bp">[110 over 70]</span>, walang pamamanas o pagkahilo. Binigyan ng <span class="slot slot-meds">[ferrous sulfate at folic acid]</span>. Pinayuhang kumain ng masusustansyang pagkain. Sinabihang magpa-check sa <span class="slot slot-plan">[RHU midwife sa susunod na linggo]</span>. Babalikan sa <span class="slot slot-plan">[isang buwan]</span>."`,
    immunization: `"Si <span class="slot slot-patient">[Pangalan ng Bata]</span>, <span class="slot slot-age">[Buwan o Edad]</span>, anak ni <span class="slot slot-patient">[Nanay]</span>, taga <span class="slot slot-loc">[Sitio o Purok / Lungsod]</span>. Dinala para sa <span class="slot slot-complaint">[regular na bakuna at timbang]</span>. Normal ang temperatura na <span class="slot slot-temp">[36.6]</span>, walang ubo o sipon. Nabigyan ng nararapat na bakuna at <span class="slot slot-meds">[paracetamol drops kung sakaling lagnatin]</span>. Babalikan sa <span class="slot slot-plan">[susunod na buwan]</span> para sa susunod na dose."`,
    general: `"Si <span class="slot slot-patient">[Pangalan]</span>, <span class="slot slot-age">[Edad] anyos</span>, taga <span class="slot slot-loc">[Sitio o Purok / Lungsod]</span>. Nagpa-check ng blood pressure. Ang BP niya <span class="slot slot-bp">[120 over 80]</span>, walang iniindang sakit. Pinayuhang ituloy ang regular na ehersisyo at bawas sa maaalat na pagkain. Babalikan sa <span class="slot slot-plan">[susunod na buwan]</span>."`,
    custom: `<div class="slot-custom-bullet"><strong>1. Pagkakakilanlan:</strong> Sabihin ang Pangalan, Edad, at Purok/Sitio o Lungsod.</div>
<div class="slot-custom-bullet"><strong>2. Reklamo:</strong> Ikuwento ang pangunahing sakit o nararamdaman at kung kailan nagsimula.</div>
<div class="slot-custom-bullet"><strong>3. Vital Signs:</strong> Sabihin ang BP (blood pressure), Temperatura (°C), o Pulse kung nasukat.</div>
<div class="slot-custom-bullet"><strong>4. Aksyon ng BHW:</strong> Sabihin ang gamot na naibigay (hal. Paracetamol, Oresol) at payo sa pasyente.</div>
<div class="slot-custom-bullet"><strong>5. Referral at Balik:</strong> Sabihin kung kailan babalikan o kung pinapupunta sa RHU/doktor.</div>`,
  };

  presetChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      presetChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const pKey = chip.dataset.preset;
      if (pKey === "custom") {
        if (teleprompterHeaderTitle) teleprompterHeaderTitle.textContent = "MALAYANG PAGTATALA: GABAY NA BALANGKAS";
        if (teleprompterInstruction) teleprompterInstruction.textContent = "Sundin ang sumusunod na mga gabay na punto sa iyong pagsasalita:";
      } else {
        if (teleprompterHeaderTitle) teleprompterHeaderTitle.textContent = "TELEPROMPTER: BASAHIN HABANG NAGRE-RECORD";
        if (teleprompterInstruction) teleprompterInstruction.textContent = "I-palit lamang ang mga may kulay na salita sa totoong detalye ng pasyente:";
      }
      if (presetTemplates[pKey] && teleprompterText) {
        teleprompterText.innerHTML = presetTemplates[pKey];
      }
    });
  });

  // --- Format Date & Time Badge ---
  function formatDateBadge(dateStr) {
    if (!dateStr) return '<span class="visit-date-badge"><span class="date-icon">📅</span> Kamakailan</span>';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) {
        return `<span class="visit-date-badge"><span class="date-icon">📅</span> ${escapeHtml(dateStr)}</span>`;
      }
      const monthNames = ["Ene", "Peb", "Mar", "Abr", "May", "Hun", "Hul", "Ago", "Set", "Okt", "Nob", "Dis"];
      const m = monthNames[d.getMonth()];
      const day = d.getDate();
      const yr = d.getFullYear();
      let h = d.getHours();
      const min = d.getMinutes().toString().padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      return `<span class="visit-date-badge"><span class="date-icon">📅</span> ${m} ${day}, ${yr} · ${h}:${min} ${ampm}</span>`;
    } catch (e) {
      return `<span class="visit-date-badge"><span class="date-icon">📅</span> ${escapeHtml(dateStr)}</span>`;
    }
  }

  function formatSeconds(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  // --- Search Bar Real-Time Filtering ---
  function filterVisitsList() {
    const query = (inpSearchVisits ? inpSearchVisits.value : "").trim().toLowerCase();
    
    if (btnClearSearch) {
      btnClearSearch.style.display = query.length > 0 ? "flex" : "none";
    }

    if (!query) {
      if (searchStatusBar) searchStatusBar.style.display = "none";
      renderVisitsList(allLoadedVisits);
      return;
    }

    const filtered = allLoadedVisits.filter((v) => {
      const name = (v.patient_label || "").toLowerCase();
      const loc = (v.location || "").toLowerCase();
      const complaint = (v.chief_complaint || "").toLowerCase();
      const date = (v.saved_at || "").toLowerCase();
      const triage = (v.triage_level || "").toLowerCase();
      const bp = (v.bp || "").toLowerCase();
      const temp = (v.temp_c ? String(v.temp_c) : "");
      return (
        name.includes(query) ||
        loc.includes(query) ||
        complaint.includes(query) ||
        date.includes(query) ||
        triage.includes(query) ||
        bp.includes(query) ||
        temp.includes(query)
      );
    });

    if (searchStatusBar && searchMatchCount) {
      searchStatusBar.style.display = "block";
      searchMatchCount.textContent = `${filtered.length} rekord ang nahanap sa "${query}"`;
    }

    renderVisitsList(filtered);
  }

  if (inpSearchVisits) {
    inpSearchVisits.addEventListener("input", filterVisitsList);
  }
  if (btnClearSearch) {
    btnClearSearch.addEventListener("click", () => {
      inpSearchVisits.value = "";
      filterVisitsList();
      inpSearchVisits.focus();
    });
  }

  // --- Render Visits List ---
  function renderVisitsList(visits) {
    visitsList.innerHTML = "";
    if (visits.length === 0) {
      emptyVisitsState.style.display = "block";
      visitsList.appendChild(emptyVisitsState);
      return;
    }

    emptyVisitsState.style.display = "none";

    visits.forEach((v) => {
      const card = document.createElement("div");
      card.className = "visit-card";

      // Vitals & Triage tags
      let vitalsHtml = "";
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
      const dateBadgeHtml = formatDateBadge(v.saved_at);

      card.innerHTML = `
        <div class="visit-card-header">
          <div>
            <span class="visit-patient-name">${escapeHtml(v.patient_label)}</span>
            ${v.location ? `<span style="font-size:0.75rem; color:#94a3b8; margin-left:6px;">· ${escapeHtml(v.location)}</span>` : ""}
          </div>
          ${dateBadgeHtml}
        </div>
        ${vitalsHtml ? `<div class="visit-meta-row">${vitalsHtml}</div>` : ""}
        ${v.chief_complaint ? `<div class="visit-complaint-preview">"${escapeHtml(v.chief_complaint)}"</div>` : ""}
        <div class="visit-actions-row">
          <button type="button" class="btn-visit-dl" style="flex:1; background:rgba(30,41,59,0.8); color:#f8fafc;">✏️ I-edit / Buksan</button>
          <a href="${pdfLink}" target="_blank" class="btn-visit-dl btn-pdf-link" style="flex:1; text-align:center;">📄 Buksan ang PDF</a>
        </div>
      `;

      // Click card (or edit button) to open in Review/Edit mode
      card.addEventListener("click", (e) => {
        if (e.target.closest(".btn-pdf-link")) return; // Don't trigger edit if opening PDF
        loadVisitIntoReview(v.visit_id);
      });

      visitsList.appendChild(card);
    });
  }

  // --- Load Single Visit Record for Editing ---
  async function loadVisitIntoReview(visitId) {
    try {
      processingIndicator.style.display = "block";
      procStepTitle.textContent = "Binubuksan ang Rekord...";
      procStepDesc.textContent = "Kinukuha ang kumpletong detalye ng pasyente...";

      let visit = null;
      try {
        const resp = await fetch(`/api/visits/${visitId}`);
        if (resp.ok) {
          const data = await resp.json();
          visit = data.visit;
        }
      } catch (e) {
        console.warn("Fetch /api/visits/{id} failed, attempting local cache fallback:", e);
      }

      if (!visit) {
        // Fallback to cached visit in allLoadedVisits
        visit = allLoadedVisits.find((x) => x.visit_id === visitId);
      }

      if (!visit) {
        throw new Error("Hindi matagpuan ang rekord ng pasyente.");
      }

      editingVisitId = visit.visit_id;
      currentTranscript = visit.transcript || "";
      currentRecord = visit;
      currentSpans = {};
      currentPhotoDataUrl = visit.image_attachment || null;

      btnConfirmSave.textContent = "✓ I-update at I-save ang Rekord";
      populateReviewScreen(currentTranscript, visit, {});

      if (currentPhotoDataUrl && photoPreviewImg && photoPreviewContainer) {
        photoPreviewImg.src = currentPhotoDataUrl;
        photoPreviewContainer.style.display = "flex";
        if (inpPhotoCaption && visit.image_caption) {
          inpPhotoCaption.value = visit.image_caption;
        }
      }

      showScreen("review");
    } catch (err) {
      alert("Error sa pagbubukas ng rekord: " + err.message);
    } finally {
      processingIndicator.style.display = "none";
    }
  }

  // --- Logbook Loader (Home Screen) ---
  async function loadLogbook() {
    try {
      const resp = await fetch("/api/visits");
      if (!resp.ok) return;
      const data = await resp.json();
      allLoadedVisits = data.visits || [];

      // Update counters
      statTotalVisits.textContent = allLoadedVisits.length;
      badgeVisitsCount.textContent = allLoadedVisits.length;

      let referralCount = 0;
      let allFollowups = [];

      allLoadedVisits.forEach((v) => {
        if (v.has_referral) referralCount++;
        if (Array.isArray(v.follow_up) && v.follow_up.length > 0) {
          v.follow_up.forEach((fu) => {
            allFollowups.push({
              visit_id: v.visit_id,
              patient: v.patient_label,
              location: v.location || "Hindi nabanggit",
              task: fu.task || "Follow-up consultation",
              due: fu.due || "TBD",
              complaint: v.chief_complaint || "Walang iniindang reklamo",
              bp: v.bp || "--",
              temp_c: v.temp_c || "--",
              triage_level: v.triage_level || "routine",
              advice: Array.isArray(v.advice_given) ? v.advice_given.join("; ") : "Wala",
            });
          });
        }
      });

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
          fDiv.addEventListener("click", () => openFollowupDetailsModal(item));
          followupList.appendChild(fDiv);
        });
      } else {
        sectionFollowups.style.display = "none";
      }

      // Render visits (respecting active search query)
      filterVisitsList();
    } catch (err) {
      console.error("Failed to load logbook:", err);
    }
  }

  // --- Follow-Up Details Modal ---
  function openFollowupDetailsModal(fuItem) {
    activeFollowupRecord = fuItem;
    if (!modalFollowupDetails || !followupModalContent) return;

    let triageBadge = '<span class="vital-tag triage-tag-routine">🟢 STABLE</span>';
    if (fuItem.triage_level === "urgent") triageBadge = '<span class="vital-tag triage-tag-urgent">🔴 URGENT</span>';
    else if (fuItem.triage_level === "monitor") triageBadge = '<span class="vital-tag triage-tag-monitor">🟡 MONITOR</span>';

    followupModalContent.innerHTML = `
      <div class="fu-detail-row">
        <span class="fu-detail-label">Pasyente at Lugar</span>
        <span class="fu-detail-val">${escapeHtml(fuItem.patient)} · ${escapeHtml(fuItem.location)}</span>
      </div>
      <div class="fu-detail-row">
        <span class="fu-detail-label">Takdang Araw / Oras</span>
        <span class="fu-detail-val" style="color:#f59e0b;">🗓️ ${escapeHtml(fuItem.due)}</span>
      </div>
      <div class="fu-detail-row">
        <span class="fu-detail-label">Gawain / Dahilan ng Follow-Up</span>
        <span class="fu-detail-val">${escapeHtml(fuItem.task)}</span>
      </div>
      <div class="fu-detail-row">
        <span class="fu-detail-label">Reklamo at Status</span>
        <span class="fu-detail-val">${escapeHtml(fuItem.complaint)} (${triageBadge})</span>
      </div>
      <div class="fu-detail-row">
        <span class="fu-detail-label">Huling Naitalang Vital Signs</span>
        <span class="fu-detail-val">BP: ${escapeHtml(fuItem.bp)} · Temp: ${escapeHtml(String(fuItem.temp_c))}°C</span>
      </div>
      <div class="fu-detail-row">
        <span class="fu-detail-label">Naunang Payo / Tagubilin</span>
        <span class="fu-detail-val" style="font-size:0.8rem; color:#cbd5e1;">${escapeHtml(fuItem.advice)}</span>
      </div>
    `;

    modalFollowupDetails.style.display = "flex";
  }

  function closeFollowupDetailsModal() {
    if (modalFollowupDetails) modalFollowupDetails.style.display = "none";
    activeFollowupRecord = null;
  }

  if (btnCloseFollowupModal) btnCloseFollowupModal.addEventListener("click", closeFollowupDetailsModal);
  if (btnModalCloseAction) btnModalCloseAction.addEventListener("click", closeFollowupDetailsModal);
  if (btnModalOpenRecord) {
    btnModalOpenRecord.addEventListener("click", () => {
      if (activeFollowupRecord && activeFollowupRecord.visit_id) {
        const targetId = activeFollowupRecord.visit_id;
        closeFollowupDetailsModal();
        loadVisitIntoReview(targetId);
      }
    });
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
    editingVisitId = null;
    btnConfirmSave.textContent = "✓ Kumpirmahin at I-save sa Logbook";
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
      "Si Tatay Rodrigo, 62 taong gulang taga Purok 4, Brgy. San Jose, Lipa City. Ang BP niya kanina ay 150 over 95, may lagnat din na 38.5. Masakit daw ang batok at nahihilo simula pa kahapon. Binigyan ko muna ng Paracetamol 500mg at pinagpahinga. Sinabihan ko na magpunta sa RHU bukas ng umaga para patingnan sa doktor. Babalikan ko sa Biyernes para i-follow up ang BP niya.";

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

  // --- Live Camera Engine (HTML5 WebRTC) ---
  async function startLiveCamera() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (inpCameraPhoto) inpCameraPhoto.click();
        return;
      }
      stopLiveCamera();
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: currentFacingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      if (cameraVideoPreview) {
        cameraVideoPreview.srcObject = cameraStream;
      }
      if (modalCameraCapture) {
        modalCameraCapture.style.display = "flex";
      }
    } catch (err) {
      console.warn("Camera getUserMedia error, falling back to native file input:", err);
      if (inpCameraPhoto) inpCameraPhoto.click();
    }
  }

  function stopLiveCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      cameraStream = null;
    }
    if (cameraVideoPreview) {
      cameraVideoPreview.srcObject = null;
    }
    if (modalCameraCapture) {
      modalCameraCapture.style.display = "none";
    }
  }

  function captureSnapshot() {
    if (!cameraVideoPreview || !cameraSnapshotCanvas) return;
    const video = cameraVideoPreview;
    const canvas = cameraSnapshotCanvas;
    if (!video.videoWidth) return;

    const maxDim = 800;
    let w = video.videoWidth;
    let h = video.videoHeight;
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
    ctx.drawImage(video, 0, 0, w, h);
    currentPhotoDataUrl = canvas.toDataURL("image/jpeg", 0.85);

    if (photoPreviewImg) photoPreviewImg.src = currentPhotoDataUrl;
    if (photoPreviewContainer) photoPreviewContainer.style.display = "flex";
    stopLiveCamera();
  }

  if (btnOpenLiveCam) btnOpenLiveCam.addEventListener("click", startLiveCamera);
  if (btnCameraShutter) btnCameraShutter.addEventListener("click", captureSnapshot);
  if (btnCameraCancel) btnCameraCancel.addEventListener("click", stopLiveCamera);
  if (btnCloseCameraModal) btnCloseCameraModal.addEventListener("click", stopLiveCamera);
  if (btnCameraSwitch) {
    btnCameraSwitch.addEventListener("click", async () => {
      currentFacingMode = currentFacingMode === "environment" ? "user" : "environment";
      await startLiveCamera();
    });
  }

  // --- Photo File Picker Handlers ---
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
    // Reset photo preview unless already set
    if (!currentPhotoDataUrl) {
      if (photoPreviewImg) photoPreviewImg.src = "";
      if (photoPreviewContainer) photoPreviewContainer.style.display = "none";
      if (inpPhotoCaption) inpPhotoCaption.value = "";
    }
    if (inpCameraPhoto) inpCameraPhoto.value = "";
    if (inpGalleryPhoto) inpGalleryPhoto.value = "";

    // Fill fields
    inpPatientLabel.value = record.patient_label || "";
    inpAge.value = record.age_years !== null && record.age_years !== undefined ? record.age_years : "";
    inpLocation.value = record.location || "";
    inpComplaint.value = record.chief_complaint || "";
    inpSymptoms.value = Array.isArray(record.symptoms) ? record.symptoms.join(", ") : (record.symptoms || "");

    const vitals = record.vitals || {};
    inpBp.value = vitals.bp || record.bp || "";
    inpTemp.value = vitals.temp_c !== null && vitals.temp_c !== undefined ? vitals.temp_c : (record.temp_c !== null && record.temp_c !== undefined ? record.temp_c : "");
    inpPulse.value = vitals.pulse_bpm !== null && vitals.pulse_bpm !== undefined ? vitals.pulse_bpm : (record.pulse_bpm !== null && record.pulse_bpm !== undefined ? record.pulse_bpm : "");

    inpMeds.value = Array.isArray(record.medications_given) ? record.medications_given.join(", ") : (record.medications_given || "");
    inpAdvice.value = Array.isArray(record.advice_given) ? record.advice_given.join(", ") : (record.advice_given || "");

    // Follow-up
    if (Array.isArray(record.follow_up) && record.follow_up.length > 0) {
      inpFollowUp.value = record.follow_up.map((f) => `${f.task || "Follow-up"} (${f.due || ""})`).join("; ");
    } else {
      inpFollowUp.value = typeof record.follow_up === "string" ? record.follow_up : "";
    }

    // Referral slip card logic (strictly conditional)
    const isBpDanger = isHighBp(vitals.bp || record.bp);
    const tempVal = vitals.temp_c !== null && vitals.temp_c !== undefined ? vitals.temp_c : record.temp_c;
    const isTempDanger = tempVal !== null && tempVal !== undefined && tempVal >= 38.5;
    const shouldAutoRefer = Boolean(record.referral || record.has_referral || isBpDanger || isTempDanger);

    if (shouldAutoRefer) {
      chkEnableReferral.checked = true;
      referralFieldsContainer.style.display = "block";
      inpRefFacility.value = (record.referral && record.referral.facility) || record.referral_facility || "Rural Health Unit (RHU)";
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
    if (!transcript) {
      transcriptDisplay.innerHTML = '<span style="color:#64748b; font-style:italic;">(Walang orihinal na boses o na-edit nang manu-mano)</span>';
      return;
    }

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
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // --- Two-Way Grounding Interactions (No disruptive window jumping) ---
  function setupGroundingInteractions() {
    const cards = document.querySelectorAll(".field-card");
    const quoteSpans = document.querySelectorAll(".quote-span");

    // Focus / click on field -> highlight quote in transcript WITHOUT jumping screen
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        activateField(card.dataset.field, false);
      });
      const inputs = card.querySelectorAll("input");
      inputs.forEach((inp) => {
        inp.addEventListener("focus", () => {
          activateField(card.dataset.field, false);
        });
      });
    });

    // Click on quote span in transcript -> highlight card and scroll card into view
    quoteSpans.forEach((span) => {
      span.addEventListener("click", (e) => {
        e.stopPropagation();
        const fieldName = span.dataset.field;
        activateField(fieldName, true);
      });
    });
  }

  function activateField(fieldName, scrollTargetCard = false) {
    if (!fieldName) return;
    const baseField = fieldName.split(".")[0];

    document.querySelectorAll(".field-card").forEach((c) => c.classList.remove("field-active"));
    document.querySelectorAll(".quote-span").forEach((s) => s.classList.remove("quote-active"));

    const targetCard = document.querySelector(`.field-card[data-field="${fieldName}"]`) ||
                       document.querySelector(`.field-card[data-field^="${baseField}"]`);
    if (targetCard) {
      targetCard.classList.add("field-active");
      if (scrollTargetCard) {
        targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
        const firstInp = targetCard.querySelector("input");
        if (firstInp) firstInp.focus();
      }
    }

    const matchingSpan = document.querySelector(`.quote-span[data-field="${fieldName}"]`) ||
                         document.querySelector(`.quote-span[data-field^="${baseField}"]`);
    if (matchingSpan) {
      matchingSpan.classList.add("quote-active");
      // Note: We intentionally do NOT call matchingSpan.scrollIntoView() so typing in bottom fields doesn't jerk the viewport upward!
    }
  }

  // --- Confirm & Export (Supports New Visit and Update Existing Visit) ---
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
        visit_id: editingVisitId || undefined,
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
      btnConfirmSave.textContent = editingVisitId ? "✓ I-update at I-save ang Rekord" : "✓ Kumpirmahin at I-save sa Logbook";
    }
  });

  // Export Screen Navigation
  btnViewLogbook.addEventListener("click", () => {
    showScreen("home");
  });

  btnNewVisit.addEventListener("click", () => {
    editingVisitId = null;
    currentTranscript = "";
    currentRecord = null;
    currentSpans = {};
    currentPhotoDataUrl = null;
    setSampleBanner(false);
    btnConfirmSave.textContent = "✓ Kumpirmahin at I-save sa Logbook";
    showScreen("record");
  });

  // Initial load
  loadLogbook();
});
