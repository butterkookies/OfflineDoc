// static/app.js: OfflineDoc DOH Target Client List & ITR Engine (Kindle Calm PWA)
let allPatients = [];
let activePatient = null;
let mediaRecorder = null;
let audioChunks = [];
let recordedBlob = null;
let recordStartTime = 0;
let timerInterval = null;
let currentEncounterData = null;

// Register Service Worker for Air-Gapped PWA execution
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then(reg => console.log("[OfflineDoc] ServiceWorker active:", reg.scope))
      .catch(err => console.warn("[OfflineDoc] ServiceWorker registration warning:", err));
  });
}

// Universal Add to Home Screen (beforeinstallprompt)
let deferredInstallPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  const pwaBtn = document.getElementById("pwaInstallBtn");
  if (pwaBtn) {
    pwaBtn.style.display = "inline-flex";
    pwaBtn.onclick = async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        console.log("[OfflineDoc] Install prompt outcome:", outcome);
        deferredInstallPrompt = null;
        pwaBtn.style.display = "none";
      }
    };
  }
});

window.addEventListener("appinstalled", () => {
  console.log("[OfflineDoc] Successfully installed to Home Screen");
  const pwaBtn = document.getElementById("pwaInstallBtn");
  if (pwaBtn) pwaBtn.style.display = "none";
});

// Live Online / Offline State Monitor
function updateConnectionStatus() {
  const badge = document.getElementById("offlineBadge");
  const text = document.getElementById("badgeText");
  if (!badge || !text) return;
  if (!navigator.onLine) {
    text.innerText = "100% Offline (Air-Gapped)";
    badge.style.background = "#FEF3C7";
    badge.style.color = "#92400E";
  } else {
    text.innerText = "100% Offline (Local AI)";
    badge.style.background = "var(--offline-badge-bg)";
    badge.style.color = "var(--offline-badge-text)";
  }
}
window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);

document.addEventListener("DOMContentLoaded", () => {
  updateConnectionStatus();
  initDirectory();
  initModalEvents();
  initRecorder();
});

// View Switching
function switchView(viewId) {
  document.querySelectorAll(".mobile-view").forEach(v => {
    v.classList.remove("active");
  });
  const target = document.getElementById(viewId);
  if (target) target.classList.add("active");

  const tabPatients = document.getElementById("tabPatientsBtn");
  const tabSlips = document.getElementById("tabSlipsBtn");
  if (tabPatients && tabSlips) {
    tabPatients.classList.toggle("active", viewId === "viewDirectory" || viewId === "viewDossier");
    tabSlips.classList.toggle("active", viewId === "viewSlips");
  }
}

// 1. Directory, Search & Filter
async function initDirectory() {
  const listEl = document.getElementById("patientsList");
  try {
    const res = await fetch("/api/patients");
    allPatients = await res.json();
    if (allPatients.length > 0 && !activePatient) {
      activePatient = allPatients[0];
    }
    
    // Update count badges
    const countAllEl = document.getElementById("countAll");
    if (countAllEl) countAllEl.innerText = allPatients.length;
    const countTodayEl = document.getElementById("countToday");
    if (countTodayEl) {
      const todayTotal = allPatients.reduce((sum, p) => sum + (p.encounters ? p.encounters.length : 0), 0);
      countTodayEl.innerText = todayTotal;
    }

    renderPatients(allPatients);
  } catch (err) {
    listEl.innerHTML = `<div class="gap-alert">Could not load local patient records. Ensure backend is running.</div>`;
  }

  // Live time clock in hero card
  updateLiveClock();
  setInterval(updateLiveClock, 30000);

  // Search input
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      filterPatients();
    });
  }

  // Filter chips & pills
  document.querySelectorAll(".pill-chip, .chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".pill-chip, .chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      filterPatients();
    });
  });

  // Hero Card direct actions
  const heroBtn = document.getElementById("heroStartRecordBtn");
  if (heroBtn) {
    heroBtn.addEventListener("click", () => {
      openEncounterModal(activePatient ? activePatient.patient_id : null);
    });
  }

  const heroSearchBtn = document.getElementById("heroQuickSearchBtn");
  if (heroSearchBtn) {
    heroSearchBtn.addEventListener("click", () => {
      const inp = document.getElementById("searchInput");
      if (inp) {
        inp.focus();
        inp.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
}

function updateLiveClock() {
  const el = document.getElementById("liveTimeClock");
  if (!el) return;
  const now = new Date();
  const hrs = String(now.getHours()).padStart(2, "0");
  const mins = String(now.getMinutes()).padStart(2, "0");
  el.innerText = `${hrs}:${mins} • Offline AI`;
}

function filterPatients() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const activeChip = document.querySelector(".pill-chip.active, .chip.active");
  const filterProg = activeChip ? activeChip.getAttribute("data-filter") : "all";

  const filtered = allPatients.filter(p => {
    const matchQuery = p.full_name.toLowerCase().includes(query) ||
                       p.purok.toLowerCase().includes(query) ||
                       (p.program && p.program.toLowerCase().includes(query));
    const matchProg = filterProg === "all" || filterProg === "today" || p.program === filterProg;
    return matchQuery && matchProg;
  });
  renderPatients(filtered);
}

function selectPatient(patientId) {
  const p = allPatients.find(x => x.patient_id === patientId);
  if (p) {
    activePatient = p;
    renderPatientDossier(p);
    switchView("viewDossier");
  }
}

function renderPatients(patients) {
  const listEl = document.getElementById("patientsList");
  if (!patients || !patients.length) {
    listEl.innerHTML = `
      <div class="empty-directory-card">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="19" y1="8" x2="19" y2="14"></line>
            <line x1="22" y1="11" x2="16" y2="11"></line>
          </svg>
        </div>
        <div class="empty-title">Clean Air-Gapped Ledger</div>
        <div class="empty-desc">No patients in local storage yet. Tap Record below to conduct your first clinical encounter in the field.</div>
        <button class="action-btn primary" onclick="openEncounterModal()" style="max-width: 220px; margin: 0 auto;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Record First Patient</span>
        </button>
      </div>
    `;
    return;
  }

  listEl.innerHTML = patients.map(p => {
    const totalVisits = p.encounters ? p.encounters.length : 0;
    const lastEncounter = totalVisits > 0 ? p.encounters[totalVisits - 1] : null;

    const latestPdfBtn = lastEncounter && lastEncounter.visit_id ? `
      <a class="btn-card" href="/api/export-pdf/${lastEncounter.visit_id}" target="_blank" onclick="event.stopPropagation();" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:6px;">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>ITR Slip</span>
      </a>
    ` : "";

    return `
      <div class="patient-card" data-id="${p.patient_id}" onclick="selectPatient('${p.patient_id}')">
        <div>
          <div class="card-top">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 38px; height: 38px; border-radius: 50%; background: #EBF3FF; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0055FE" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div>
                <div class="patient-name-title">${p.full_name} (${p.age || 'N/A'}, ${p.sex ? p.sex[0] : 'F'})</div>
                <div class="purok-tag">${p.purok} &bull; ID: ${p.patient_id}</div>
              </div>
            </div>
            <div class="visit-badge">${totalVisits} ${totalVisits === 1 ? 'Visit' : 'Visits'}</div>
          </div>
          <span class="program-badge">${p.program}</span>
          <div class="summary-text">${p.longitudinal_summary || "No previous encounters logged."}</div>
        </div>

        <div class="card-actions" style="margin-top: 12px;">
          ${latestPdfBtn}
          <button class="btn-card primary" onclick="event.stopPropagation(); openEncounterModal('${p.patient_id}')">+ Record Visit</button>
          <button class="btn-card danger" onclick="event.stopPropagation(); deletePatient('${p.patient_id}', '${(p.full_name || '').replace(/'/g, "\\'")}')">Delete</button>
        </div>
      </div>
    `;
  }).join("");
}

async function deletePatient(patientId, fullName) {
  if (!confirm(`Delete ${fullName || patientId} and all of their visits? This cannot be undone.`)) return;
  try {
    const res = await fetch(`/api/patients/${encodeURIComponent(patientId)}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || `Server returned HTTP ${res.status}`);
    if (activePatient && activePatient.patient_id === patientId) activePatient = null;
    await initDirectory();
    if (typeof loadSlips === "function") await loadSlips();
  } catch (err) {
    alert(`Delete failed: ${err.message}`);
  }
}

// Render Patient Longitudinal Dossier
function renderPatientDossier(p) {
  const container = document.getElementById("dossierContent");
  if (!container) return;

  const totalVisits = p.encounters ? p.encounters.length : 0;
  const encounters = p.encounters || [];

  const encountersHtml = encounters.map(enc => {
    const isElevated = enc.bp && (enc.bp.includes("150") || enc.bp.includes("140") || enc.bp.includes("160"));
    const pdfBtn = enc.visit_id ? `
      <a class="timeline-pdf-link" href="/api/export-pdf/${enc.visit_id}" target="_blank">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>Download Official DOH ITR Slip (PDF)</span>
      </a>
    ` : "";

    return `
      <div class="dossier-timeline-card">
        <div class="timeline-card-top">
          <div class="timeline-visit-title">Visit #${enc.visit_num} &bull; ${enc.date}</div>
          <span class="timeline-bp-pill ${isElevated ? 'elevated' : ''}">BP: ${enc.bp || 'N/A'}</span>
        </div>
        <div class="timeline-notes">${enc.notes || 'Routine follow-up visit.'}</div>
        ${pdfBtn}
      </div>
    `;
  }).reverse().join("");

  container.innerHTML = `
    <div class="patient-detail-card">
      <div class="detail-header">
        <div>
          <div class="detail-name">${p.full_name}</div>
          <div class="detail-meta">Age: ${p.age || 'N/A'} &bull; Sex: ${p.sex || 'Female'} &bull; ${p.purok} &bull; ID: ${p.patient_id}</div>
        </div>
        <span class="program-badge large">${p.program}</span>
      </div>

      <div class="dossier-section">
        <div class="dossier-label">LONGITUDINAL CLINICAL SUMMARY</div>
        <div class="dossier-summary-box">
          ${p.longitudinal_summary || "No previous encounters logged."}
        </div>
      </div>

      <div class="dossier-section">
        <div class="dossier-label">DOH TARGET CLIENT LIST (TCL) TIMELINE (${totalVisits} ${totalVisits === 1 ? 'VISIT' : 'VISITS'})</div>
        <div class="dossier-timeline-list">
          ${encountersHtml || '<div class="timeline-notes" style="padding: 12px; text-align: center;">No visits logged yet.</div>'}
        </div>
      </div>

      <div class="dossier-actions" style="margin-top: 14px;">
        <button class="action-btn primary" onclick="openEncounterModal('${p.patient_id}')">
          <svg class="btn-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Record Encounter for ${p.full_name.split(' ')[0]}</span>
        </button>
      </div>
    </div>
  `;
}

// ITR Slips Tab
async function loadSlips() {
  const listEl = document.getElementById("slipsList");
  try {
    const res = await fetch("/api/visits");
    const visits = await res.json();
    renderSlips(visits);
  } catch (err) {
    listEl.innerHTML = `<div class="gap-alert">Could not load slips from local storage.</div>`;
  }
}

function renderSlips(visits) {
  const listEl = document.getElementById("slipsList");
  if (!visits || !visits.length) {
    listEl.innerHTML = `
      <div class="empty-directory-card">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
          </svg>
        </div>
        <div class="empty-title">No ITR Slips Generated Yet</div>
        <div class="empty-desc">Completed clinical visits will appear here with instant offline download links for official DOH / PhilHealth ITR forms.</div>
        <button class="action-btn primary" onclick="openEncounterModal()" style="max-width: 220px; margin: 0 auto;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Record Encounter</span>
        </button>
      </div>
    `;
    return;
  }

  listEl.innerHTML = visits.map(v => {
    const ext = v.extracted_data || {};
    const bp = ext.vitals && ext.vitals.blood_pressure ? ext.vitals.blood_pressure : "N/A";
    const isElevated = ext.vitals && ext.vitals.bp_systolic && ext.vitals.bp_systolic >= 140;
    const summary = ext.clinical_summary || v.raw_transcript || "Clinical encounter documented.";

    return `
      <div class="slip-card">
        <div class="slip-card-top">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #EBF3FF; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0055FE" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <div>
              <div class="slip-name">${v.patient_name || 'Patient'}</div>
              <div class="slip-meta">${v.purok || 'Purok'} &bull; ID: ${v.patient_id || 'N/A'} &bull; ${v.program || 'General'}</div>
            </div>
          </div>
          <span class="timeline-bp-pill ${isElevated ? 'elevated' : ''}">BP: ${bp}</span>
        </div>
        <div class="slip-date">Date: ${v.created_at || 'Just now'} &bull; Ref: ${v.visit_id}</div>
        <div class="slip-summary">${summary}</div>
        <a class="slip-btn" href="/api/export-pdf/${v.visit_id}" target="_blank">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Download Official DOH ITR Slip (PDF)</span>
        </a>
      </div>
    `;
  }).join("");
}

// 2. Encounter Full-Screen Modal & Stepper
function openEncounterModal(patientId) {
  activePatient = (patientId && allPatients) ? (allPatients.find(p => p.patient_id === patientId) || null) : null;

  const nameEl = document.getElementById("modalPatientName");
  if (nameEl) nameEl.innerText = activePatient ? activePatient.full_name : "New Patient Encounter";
  const tagEl = document.getElementById("modalTag");
  if (tagEl) {
    tagEl.innerText = activePatient ? `ENCOUNTER #${(activePatient.encounters ? activePatient.encounters.length : 0) + 1}` : "NEW ENCOUNTER";
  }
  
  goToStep(1);
  resetRecordingState();
  const screen = document.getElementById("encounterFlowScreen");
  if (screen) screen.classList.add("active");
  const backdrop = document.getElementById("encounterFlowBackdrop");
  if (backdrop) backdrop.classList.add("active");
}

function closeModal() {
  const screen = document.getElementById("encounterFlowScreen");
  if (screen) screen.classList.remove("active");
  const backdrop = document.getElementById("encounterFlowBackdrop");
  if (backdrop) backdrop.classList.remove("active");
}

function goToStep(stepNum) {
  document.querySelectorAll(".step-pill").forEach((p, idx) => {
    p.classList.toggle("active", idx + 1 === stepNum);
  });
  document.querySelectorAll(".step-content").forEach((c, idx) => {
    c.classList.toggle("active", idx + 1 === stepNum);
  });
}

function initModalEvents() {
  const closeEncounterBtn = document.getElementById("closeEncounterBtn");
  if (closeEncounterBtn) closeEncounterBtn.addEventListener("click", closeModal);
  const backdrop = document.getElementById("encounterFlowBackdrop");
  if (backdrop) backdrop.addEventListener("click", closeModal);

  // Tab navigation events
  const tabPatientsBtn = document.getElementById("tabPatientsBtn");
  if (tabPatientsBtn) {
    tabPatientsBtn.addEventListener("click", () => switchView("viewDirectory"));
  }

  const tabSlipsBtn = document.getElementById("tabSlipsBtn");
  if (tabSlipsBtn) {
    tabSlipsBtn.addEventListener("click", () => {
      switchView("viewSlips");
      loadSlips();
    });
  }

  // Dossier back button
  const dossierBackBtn = document.getElementById("dossierBackBtn");
  if (dossierBackBtn) {
    dossierBackBtn.addEventListener("click", () => switchView("viewDirectory"));
  }

  // Center Record FAB
  const openFab = document.getElementById("openNewEncounterFab");
  if (openFab) {
    openFab.addEventListener("click", () => {
      openEncounterModal(activePatient ? activePatient.patient_id : null);
    });
  }

  document.getElementById("backToRecordBtn").addEventListener("click", () => goToStep(1));
  document.getElementById("doneBtn").addEventListener("click", () => {
    closeModal();
    initDirectory();
    loadSlips();
    switchView("viewDirectory");
  });

  // Mobile QR Modal events
  const qrModal = document.getElementById("qrModal");

  async function openQrModal() {
    qrModal.classList.add("active");
    const httpEl = document.getElementById("qrHttpUrl");
    const httpsEl = document.getElementById("qrHttpsUrl");
    const imgEl = document.getElementById("qrImage");
    try {
      const res = await fetch("/api/network");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const net = await res.json();
      if (httpEl) httpEl.innerText = net.http_url;
      if (httpsEl) { httpsEl.innerText = net.https_url; httpsEl.href = net.https_url; }
      if (imgEl) imgEl.src = `/api/qr.svg?url=${encodeURIComponent(net.https_url)}`;
    } catch (err) {
      if (httpEl) httpEl.innerText = "Could not detect laptop IP - use the URL printed by run_mobile.py";
    }
  }
  const openQrBtn = document.getElementById("openQrModalBtn");
  const closeQrBtn = document.getElementById("closeQrModalBtn");
  const closeQrDoneBtn = document.getElementById("closeQrDoneBtn");
  const navSettingsBtn = document.getElementById("navSettingsBtn");

  if (navSettingsBtn && qrModal) {
    navSettingsBtn.addEventListener("click", () => openQrModal());
  }

  if (openQrBtn && qrModal) {
    openQrBtn.addEventListener("click", () => openQrModal());
  }
  if (closeQrBtn && qrModal) {
    closeQrBtn.addEventListener("click", () => qrModal.classList.remove("active"));
  }
  if (closeQrDoneBtn && qrModal) {
    closeQrDoneBtn.addEventListener("click", () => qrModal.classList.remove("active"));
  }
}

// 3. Audio Recording & Offline Inference
function initRecorder() {
  const micBtn = document.getElementById("micBtn");
  const transcribeBtn = document.getElementById("transcribeBtn");

  if (micBtn) micBtn.addEventListener("click", toggleRecording);
  if (transcribeBtn) transcribeBtn.addEventListener("click", runTranscription);
  const confirmBtn = document.getElementById("confirmEncounterBtn");
  if (confirmBtn) confirmBtn.addEventListener("click", commitEncounter);
}

async function toggleRecording() {
  const micBtn = document.getElementById("micBtn");
  const micStatus = document.getElementById("micStatus");

  if (mediaRecorder && mediaRecorder.state === "recording") {
    // Stop recording
    mediaRecorder.stop();
    micBtn.classList.remove("recording");
    micStatus.innerText = "Recording stopped. Ready to transcribe.";
    clearInterval(timerInterval);
  } else {
    // Start recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks = [];
      mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        recordedBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(recordedBlob);
        const previewEl = document.getElementById("audioPreview");
        previewEl.src = audioUrl;
        document.getElementById("audioPreviewContainer").style.display = "block";
      };

      mediaRecorder.start();
      micBtn.classList.add("recording");
      micStatus.innerText = "Listening... Speak visit summary in Taglish";
      recordStartTime = Date.now();
      timerInterval = setInterval(updateTimer, 1000);
    } catch (err) {
      alert("Microphone permission not available. Please allow microphone access in your browser to record clinical audio.");
    }
  }
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - recordStartTime) / 1000);
  const m = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");
  document.getElementById("recordTimer").innerText = `${m}:${s}`;
}

function resetRecordingState() {
  recordedBlob = null;
  document.getElementById("audioPreviewContainer").style.display = "none";
  document.getElementById("recordTimer").innerText = "00:00";
  document.getElementById("micStatus").innerText = "Tap to Start Recording";
  document.getElementById("micBtn").classList.remove("recording");
  if (timerInterval) clearInterval(timerInterval);
}

async function runTranscription() {
  if (!recordedBlob) return;
  const transcribeBtn = document.getElementById("transcribeBtn");
  transcribeBtn.innerText = "Transcribing on device (faster-whisper)...";
  transcribeBtn.disabled = true;

  const formData = new FormData();
  formData.append("file", recordedBlob, "encounter.wav");

  try {
    const res = await fetch("/api/transcribe", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || `Server returned HTTP ${res.status}`);
    if (!data.transcript) throw new Error("No speech detected in the recording. Please record again, closer to the mic.");
    
    document.getElementById("transcriptDisplay").innerText = `"${data.transcript}"`;
    document.getElementById("sttStats").innerText = `STT Latency: ${data.duration_seconds}s (CTranslate2 INT8)`;

    // Immediately trigger LLM schema extraction
    await runExtractionDirect(data.transcript);
  } catch (err) {
    if (err.message && (err.message.includes("Failed to fetch") || err.message.includes("NetworkError") || err.message.includes("Edge server is unreachable"))) {
      alert(
        "Offline Connection Notice:\n\n" +
        "Could not reach the local OfflineDoc server.\n\n" +
        "• Mobile (Airplane Mode): Re-enable Wi-Fi in phone settings to stay connected to the laptop hotspot/LAN. The AI runs on the laptop edge server, so local Wi-Fi is needed (no internet required).\n" +
        "• Laptop: Use http://127.0.0.1:8000 instead of a LAN IP address."
      );
    } else {
      alert("Transcription error: " + err.message);
    }
  } finally {
    transcribeBtn.innerHTML = `
      <svg class="btn-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
      <span>Transcribe on Device</span>`;
    transcribeBtn.disabled = false;
  }
}

async function runExtractionDirect(transcript) {
  goToStep(2);
  document.getElementById("transcriptDisplay").innerText = `"${transcript}"`;
  document.getElementById("llmStats").innerText = "Running local LLM schema extraction...";

  try {
    const pId = activePatient ? activePatient.patient_id : null;
    const res = await fetch("/api/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript, patient_id: pId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || `Server returned HTTP ${res.status}`);
    currentEncounterData = data;

    const ext = data.extracted_data;
    document.getElementById("valName").innerText = ext.patient_name || (activePatient ? activePatient.full_name : "null (Not stated)");
    
    const ageVal = ext.age || (activePatient ? activePatient.age : "null");
    const sexVal = ext.sex || (activePatient ? activePatient.sex : "Female");
    const purokVal = ext.purok || (activePatient ? activePatient.purok : "Purok null");
    document.getElementById("valDemographics").innerText = `${ageVal} yo | ${sexVal} | ${purokVal}`;
    
    document.getElementById("valProgram").innerText = ext.tcl_program || ext.program || (activePatient ? activePatient.program : "General Consultation");
    
    // Blood Pressure display with high-risk warning
    const bpVal = (ext.vitals && ext.vitals.blood_pressure) || "null (Unrecorded)";
    const bpEl = document.getElementById("valBP");
    bpEl.innerText = bpVal;
    if (ext.vitals && ext.vitals.bp_systolic && ext.vitals.bp_systolic >= 140) {
      bpEl.innerHTML = `<span style="color:var(--alert-orange); font-weight:800;">${bpVal} (ELEVATED ALERT)</span>`;
    } else {
      bpEl.style.color = "var(--text-main)";
    }
    
    const visitDetails = ext.visit_details || ext.maternal_details || {};
    const gestWeeks = visitDetails.gestational_age_weeks ? `${visitDetails.gestational_age_weeks} weeks` : "N/A";
    const wtStr = (ext.vitals && ext.vitals.weight_kg) ? `${ext.vitals.weight_kg} kg` : (visitDetails.weight_kg ? `${visitDetails.weight_kg} kg` : "Wt unrecorded");
    document.getElementById("valMaternal").innerText = `${gestWeeks} | ${wtStr}`;

    const rep = ext.symptoms_reported || [];
    const den = ext.symptoms_denied || [];
    let sympText = rep.length ? rep.join(", ") : "None reported";
    if (den.length) sympText += ` (Negatives: ${den.join(", ")})`;
    document.getElementById("valSymptoms").innerText = sympText;

    const meds = ext.medications_prescribed || ext.medications_noted || [];
    document.getElementById("valMeds").innerText = meds.length ? meds.join(", ") : "None noted";

    document.getElementById("valSummary").innerText = ext.clinical_summary || "--";

    // Point-of-Care Gap Check alerts
    const alertsBox = document.getElementById("gapAlertsContainer");
    if (data.gap_alerts && data.gap_alerts.length > 0) {
      alertsBox.innerHTML = data.gap_alerts.map(a => `
        <div class="gap-alert">
          <svg class="alert-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>${a}</span>
        </div>
      `).join("");
    } else {
      alertsBox.innerHTML = `
        <div class="gap-success">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>All mandatory DOH TCL clinical fields verified</span>
        </div>`;
    }

    document.getElementById("llmStats").innerText = `LLM Latency: ${data.inference_seconds}s (Llama 3.2 1B Q4_K_M)`;
  } catch (err) {
    alert("Extraction error: " + err.message);
  }
}

async function commitEncounter() {
  if (!currentEncounterData) return;
  const btn = document.getElementById("confirmEncounterBtn");
  btn.innerText = "Committing to local JSON...";
  btn.disabled = true;

  const ext = currentEncounterData.extracted_data || {};
  const payload = {
    patient_id: activePatient ? activePatient.patient_id : null,
    patient_name: ext.patient_name || (activePatient ? activePatient.full_name : "Citizen"),
    purok: ext.purok || (activePatient ? activePatient.purok : "Purok Unspecified"),
    program: ext.tcl_program || ext.program || (activePatient ? activePatient.program : "General Consultation"),
    raw_transcript: document.getElementById("transcriptDisplay").innerText.replace(/^"|"$/g, ""),
    extracted_data: ext,
    evidence_quotes: ext.evidence_quotes || {},
    gap_alerts: currentEncounterData.gap_alerts || []
  };

  try {
    const res = await fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    
    document.getElementById("successMsg").innerText = `Encounter committed under data/visits/${result.visit_id}.json. ${result.message}`;
    
    // Wire up download PDF link
    const pdfBtn = document.getElementById("downloadPdfBtn");
    if (pdfBtn && result.pdf_url) {
      pdfBtn.href = result.pdf_url;
      pdfBtn.setAttribute("download", `DOH_ITR_${result.visit_id}.pdf`);
    }

    goToStep(3);
  } catch (err) {
    alert("Error saving encounter: " + err.message);
  } finally {
    btn.innerHTML = `
      <svg class="btn-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>Confirm & Commit to Ledger</span>`;
    btn.disabled = false;
  }
}
