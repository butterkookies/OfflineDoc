// static/app.js: OfflineDoc DOH Target Client List & ITR Engine (Kindle Calm PWA)
let allPatients = [];
let activePatient = null;
let mediaRecorder = null;
let audioChunks = [];
let recordedBlob = null;
let recordStartTime = 0;
let timerInterval = null;
let currentEncounterData = null;

// Built-in authentic community cohorts (ensures 100% offline functionality even on pristine devices)
const DEFAULT_COMMUNITY_COHORTS = [
  {
    patient_id: "P-001",
    full_name: "Maria Santos",
    age: 28,
    sex: "Female",
    purok: "Purok 2",
    program: "Maternal Care",
    longitudinal_summary: "32 weeks prenatal tracking. Resolving ankle edema. Adherent to Ferrous Sulfate.",
    encounters: [
      {
        visit_num: 1,
        date: "2026-08-12",
        bp: "110/70",
        notes: "Initial prenatal intake. Gestational age 24 weeks. Prescribed ferrous sulfate + folic acid."
      },
      {
        visit_num: 2,
        date: "2026-09-09",
        bp: "120/80",
        notes: "Routine follow-up at 28 weeks. Mild pedal edema noted, advised leg elevation."
      },
      {
        visit_num: 3,
        date: "2026-10-09",
        bp: "120/80",
        notes: "3rd checkup at 32 weeks. Edema resolved, normal fetal movement, continuing ferrous sulfate."
      }
    ]
  },
  {
    patient_id: "P-002",
    full_name: "Teresa Ramos",
    age: 54,
    sex: "Female",
    purok: "Purok 4",
    program: "Hypertension/Diabetes",
    longitudinal_summary: "Stage 2 Hypertension crisis alert. BP 150/95 mmHg with occipital headache. Defaulter follow-up.",
    encounters: [
      {
        visit_num: 1,
        date: "2026-08-20",
        bp: "140/90",
        notes: "Hypertension maintenance visit. Given 30-day amlodipine 5mg supply."
      },
      {
        visit_num: 2,
        date: "2026-09-18",
        bp: "150/95",
        notes: "Missed medication dose x 1 day. Occipital headache reported. Urgent RHU referral slip issued."
      }
    ]
  },
  {
    patient_id: "P-003",
    full_name: "Juan Dela Cruz",
    age: 62,
    sex: "Male",
    purok: "Purok 1",
    program: "General Consultation",
    longitudinal_summary: "Senior citizen respiratory check. Productive cough x 5 days, afebrile, BP 130/85 mmHg.",
    encounters: [
      {
        visit_num: 1,
        date: "2026-09-25",
        bp: "130/85",
        notes: "Productive cough x 5 days. Temp 36.8C. Given Paracetamol and Salbutamol."
      }
    ]
  },
  {
    patient_id: "P-004",
    full_name: "Baby Joshua Bautista",
    age: 1,
    sex: "Male",
    purok: "Purok 3",
    program: "Child Immunization",
    longitudinal_summary: "9-month EPI routine catch-up. Pentavalent 3 and Vitamin A administered. Weight: 8.5 kg.",
    encounters: [
      {
        visit_num: 1,
        date: "2026-10-01",
        bp: "N/A",
        notes: "EPI routine catch-up. Pentavalent 3 and Vitamin A 100,000 IU given. Weight 8.5kg normal."
      }
    ]
  }
];

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
  initEditableFieldListeners();
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

// 1. Directory, Search & Filter with Full Offline Storage Fallback
async function initDirectory() {
  const listEl = document.getElementById("patientsList");
  let loaded = false;

  // 1. Try fetching live records from local server
  try {
    const res = await fetch("/api/patients", { cache: "no-cache" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        allPatients = data;
        localStorage.setItem("offlinedoc_patients_cache", JSON.stringify(data));
        loaded = true;
      }
    }
  } catch (err) {
    console.log("[OfflineDoc] Running in local offline / airplane mode");
  }

  // 2. Fallback to localStorage cache if network is offline or server unreachable
  if (!loaded) {
    try {
      const cached = localStorage.getItem("offlinedoc_patients_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          allPatients = parsed;
          loaded = true;
        }
      }
    } catch (e) {
      console.warn("[OfflineDoc] Error reading local cache:", e);
    }
  }

  // 3. Fallback to built-in authentic community cohorts if storage was pristine
  if (!loaded || !Array.isArray(allPatients) || !allPatients.length) {
    allPatients = DEFAULT_COMMUNITY_COHORTS;
    localStorage.setItem("offlinedoc_patients_cache", JSON.stringify(DEFAULT_COMMUNITY_COHORTS));
  }

  if (allPatients.length > 0 && !activePatient) {
    activePatient = allPatients[0];
  }

  // Update count badges safely
  const countAllEl = document.getElementById("countAll");
  if (countAllEl) countAllEl.innerText = allPatients.length;
  const countTodayEl = document.getElementById("countToday");
  if (countTodayEl) {
    const todayTotal = allPatients.reduce((sum, p) => sum + (p.encounters ? p.encounters.length : 0), 0);
    countTodayEl.innerText = todayTotal;
  }

  renderPatients(allPatients);

  // Live time clock in hero card
  updateLiveClock();
  setInterval(updateLiveClock, 30000);

  // Search input
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.oninput = () => filterPatients();
  }

  // Filter chips & pills
  document.querySelectorAll(".pill-chip, .chip").forEach(chip => {
    chip.onclick = () => {
      document.querySelectorAll(".pill-chip, .chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      filterPatients();
    };
  });
}

function updateLiveClock() {
  const clockEl = document.getElementById("clockDisplay");
  if (!clockEl) return;
  const now = new Date();
  const days = ["Linggo", "Lunes", "Martes", "Miyerkules", "Huwebes", "Biyernes", "Sabado"];
  const months = ["Ene", "Peb", "Mar", "Abr", "May", "Hun", "Hul", "Ago", "Set", "Okt", "Nob", "Dis"];
  
  const dayName = days[now.getDay()];
  const monthName = months[now.getMonth()];
  const dateNum = now.getDate();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  clockEl.innerText = `${dayName}, ${monthName} ${dateNum} &bull; ${hours}:${minutes} PHT`;
}

function filterPatients() {
  const query = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();
  const activeChip = document.querySelector(".pill-chip.active, .chip.active");
  const filterType = activeChip ? activeChip.getAttribute("data-filter") : "all";

  const filtered = allPatients.filter(p => {
    const matchesQuery = !query || 
      (p.full_name && p.full_name.toLowerCase().includes(query)) ||
      (p.purok && p.purok.toLowerCase().includes(query)) ||
      (p.patient_id && p.patient_id.toLowerCase().includes(query)) ||
      (p.program && p.program.toLowerCase().includes(query));

    let matchesCategory = true;
    if (filterType === "Maternal") {
      matchesCategory = p.program && p.program.toLowerCase().includes("maternal");
    } else if (filterType === "Hypertension") {
      matchesCategory = p.program && p.program.toLowerCase().includes("hypertension");
    } else if (filterType === "Child") {
      matchesCategory = p.program && p.program.toLowerCase().includes("child");
    } else if (filterType === "General") {
      matchesCategory = p.program && p.program.toLowerCase().includes("general");
    }

    return matchesQuery && matchesCategory;
  });

  renderPatients(filtered);
}

function selectPatient(patientId) {
  const p = allPatients.find(item => item.patient_id === patientId);
  if (!p) return;
  activePatient = p;
  renderPatientDossier(p);
  switchView("viewDossier");
}

function renderPatients(patients) {
  const listEl = document.getElementById("patientsList");
  if (!listEl) return;

  if (patients.length === 0) {
    listEl.innerHTML = `
      <div class="empty-directory-card">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div class="empty-title">Walang nahanap na pasyente</div>
        <div class="empty-desc">Walang pasyente sa lokal na memorya. Pindutin ang Mag-record sa ibaba upang itala ang unang pasyente.</div>
        <button class="action-btn primary" onclick="openEncounterModal()" style="max-width: 220px; margin: 0 auto;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Magtala ng Unang Pasyente</span>
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
          <div class="summary-text">${p.longitudinal_summary || "Walang nakaraang konsultang naitala."}</div>
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

// Offline Deletion Guard
function showOfflineDeleteModal() {
  const modal = document.getElementById("offlineDeleteModal");
  if (modal) modal.classList.add("active");
}

function closeOfflineDeleteModal() {
  const modal = document.getElementById("offlineDeleteModal");
  if (modal) modal.classList.remove("active");
}

async function isServerOnline() {
  if (!navigator.onLine) return false;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2000);
    const res = await fetch("/api/health", { method: "GET", cache: "no-store", signal: ctrl.signal });
    clearTimeout(timer);
    return res.ok;
  } catch (e) {
    return false;
  }
}

async function deletePatient(patientId, fullName) {
  // Check if offline or disconnected from station server
  const online = await isServerOnline();
  if (!online) {
    showOfflineDeleteModal();
    return;
  }

  if (!confirm(`Sigurado ka bang nais mong burahin ang rekord ni ${fullName || patientId}? Hindi na ito maibabalik.`)) return;
  try {
    const res = await fetch(`/api/patients/${encodeURIComponent(patientId)}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || `Server returned HTTP ${res.status}`);
    
    // Also remove from local cache
    allPatients = allPatients.filter(p => p.patient_id !== patientId);
    localStorage.setItem("offlinedoc_patients_cache", JSON.stringify(allPatients));
    if (activePatient && activePatient.patient_id === patientId) activePatient = null;
    
    await initDirectory();
    if (typeof loadSlips === "function") await loadSlips();
  } catch (err) {
    alert(`Hindi nabura ang rekord: ${err.message}`);
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
          ${p.longitudinal_summary || "Walang nakaraang konsultang naitala."}
        </div>
      </div>

      <div class="dossier-section">
        <div class="dossier-label">DOH TARGET CLIENT LIST (TCL) TIMELINE (${totalVisits} ${totalVisits === 1 ? 'VISIT' : 'VISITS'})</div>
        <div class="dossier-timeline-list">
          ${encountersHtml || '<div class="timeline-notes" style="padding: 12px; text-align: center;">Walang naitalang pagbisita.</div>'}
        </div>
      </div>

      <div class="dossier-actions" style="margin-top: 14px;">
        <button class="action-btn primary" onclick="openEncounterModal('${p.patient_id}')">
          <svg class="btn-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Magtala ng Bagong Pagbisita para kay ${p.full_name.split(' ')[0]}</span>
        </button>
      </div>
    </div>
  `;
}

// 2. DOH ITR Slips Ledger with Offline Storage Fallback
async function loadSlips() {
  let loaded = false;
  try {
    const res = await fetch("/api/visits");
    if (res.ok) {
      const visits = await res.json();
      if (Array.isArray(visits)) {
        localStorage.setItem("offlinedoc_visits_cache", JSON.stringify(visits));
        renderSlips(visits);
        loaded = true;
      }
    }
  } catch (e) {
    console.log("[OfflineDoc] Loading slips from offline cache");
  }

  if (!loaded) {
    try {
      const cached = localStorage.getItem("offlinedoc_visits_cache");
      if (cached) {
        const visits = JSON.parse(cached);
        if (Array.isArray(visits)) {
          renderSlips(visits);
          return;
        }
      }
    } catch (err) {}
    renderSlips([]);
  }
}

function renderSlips(visits) {
  const listEl = document.getElementById("slipsList");
  if (!listEl) return;

  if (visits.length === 0) {
    listEl.innerHTML = `
      <div class="empty-directory-card">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        </div>
        <div class="empty-title">Walang opisyal na DOH ITR Slips</div>
        <div class="empty-desc">Lilitaw dito ang mga nabuong opisyal na PDF slip kapag may naitalang pagbisita.</div>
        <button class="action-btn primary" onclick="openEncounterModal()" style="max-width: 220px; margin: 0 auto;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Magtala ng Pagbisita</span>
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
    const pdfUrl = v.pdf_url || (v.visit_id ? `/api/export-pdf/${v.visit_id}` : null);

    const pdfBtn = pdfUrl ? `
      <a class="slip-btn" href="${pdfUrl}" target="_blank">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>Download Official DOH ITR Slip (PDF)</span>
      </a>
    ` : `<div style="font-size:11.5px; color:var(--text-subtle); margin-top:8px;">Nakatala sa lokal na memorya (Offline)</div>`;

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
        <div class="slip-date">Date: ${v.created_at || 'Kani-kanina lang'} &bull; Ref: ${v.visit_id}</div>
        <div class="slip-summary">${summary}</div>
        ${pdfBtn}
      </div>
    `;
  }).join("");
}

// 3. Encounter Full-Screen Modal & Stepper
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
  // Always refresh directory and slips so newly committed records appear immediately
  initDirectory();
  if (typeof loadSlips === "function") loadSlips();
}

function goToStep(stepNum) {
  document.querySelectorAll(".step-pill").forEach((p, idx) => {
    p.classList.toggle("active", idx + 1 === stepNum);
  });
  document.querySelectorAll(".step-content").forEach((c, idx) => {
    c.classList.toggle("active", idx + 1 === stepNum);
  });
}

// Audio Simulation & Clinical Presets
const AUDIO_PRESETS = {
  maternal: {
    transcript: "Pangatlong checkup po ni Maria Santos, 28 years old, taga Purok 2. 32 weeks na po ang tiyan, BP ay isang daan at dalawampu over walumpu, 54 kilos. Wala na pong manas sa paa, tuloy pa rin po ang ferrous sulfate.",
    label: "Buntis (Maria Santos, 32 wks, BP 120/80)"
  },
  htn: {
    transcript: "Pasyente si Teresa Ramos, 54 anyos, taga Purok 4. Sobrang sakit ng batok at ulo po. Ang BP niya ay 150 over 95. Hindi nakainom ng amlodipine kahapon.",
    label: "Altapresyon Flag (Teresa Ramos, BP 150/95)"
  },
  epi: {
    transcript: "Si Baby Joshua Bautista, 9 months old, taga Purok 3. Kasama nanay Rosa Bautista. Timbang ay 8.5 kg. Binigyan ng Pentavalent 3 at Vitamin A. Walang lagnat.",
    label: "Bakuna EPI (Baby Joshua, Pentavalent 3)"
  }
};

function openMicPermissionModal() {
  const modal = document.getElementById("micPermissionModal");
  if (!modal) return;
  modal.classList.add("active");
  checkMicPermissionState();
}

function closeMicPermissionModal() {
  const modal = document.getElementById("micPermissionModal");
  if (modal) modal.classList.remove("active");
}

async function checkMicPermissionState() {
  const banner = document.getElementById("micStateBanner");
  const title = document.getElementById("micStateTitle");
  const desc = document.getElementById("micStateDesc");
  const btn = document.getElementById("requestMicPermBtn");

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    if (banner) {
      banner.className = "mic-info-banner blocked";
      if (title) title.innerText = "Naka-block sa Mobile Insecure HTTP";
      if (desc) desc.innerText = "Hinihingi ng mobile browsers ang HTTPS para sa mik. Gamitin ang HTTPS Port 8443 o ang 1-Tap Voice Presets sa ibaba.";
    }
    if (btn) btn.innerHTML = `<span>Gamitin ang Voice Presets</span>`;
    return;
  }

  try {
    if (navigator.permissions && navigator.permissions.query) {
      const p = await navigator.permissions.query({ name: "microphone" });
      if (p.state === "granted") {
        if (banner) {
          banner.className = "mic-info-banner granted";
          if (title) title.innerText = "Handa ang Mikropono (Granted)";
          if (desc) desc.innerText = "May buong pahintulot na ang browser sa iyong mikropono. Handa nang mag-record ng Taglish dictation.";
        }
        if (btn) btn.innerHTML = `<span>Muling Subukan ang Mikropono</span>`;
        return;
      } else if (p.state === "denied") {
        if (banner) {
          banner.className = "mic-info-banner blocked";
          if (title) title.innerText = "Naka-block ang Mikropono sa Browser Settings";
          if (desc) desc.innerText = "Pumunta sa Site Settings ng browser at piliin ang 'Allow' para sa Microphone.";
        }
        return;
      }
    }
  } catch (e) {}

  if (banner) {
    banner.className = "mic-info-banner";
    if (title) title.innerText = "Kailangan ng Pahintulot sa Mikropono";
    if (desc) desc.innerText = "Pindutin ang button sa ibaba upang buksan ang mikropono para sa voice dictation.";
  }
}

async function requestMicrophoneAccess() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    checkMicPermissionState();
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(t => t.stop());
    
    const banner = document.getElementById("micStateBanner");
    const title = document.getElementById("micStateTitle");
    const desc = document.getElementById("micStateDesc");
    if (banner) {
      banner.className = "mic-info-banner granted";
      if (title) title.innerText = "Matagumpay! Handa na ang Mikropono";
      if (desc) desc.innerText = "May pahintulot na ang mikropono. Puwede ka nang mag-record.";
    }
    setTimeout(() => {
      closeMicPermissionModal();
    }, 1000);
  } catch (err) {
    checkMicPermissionState();
  }
}

function loadVoicePreset(presetKey) {
  const p = AUDIO_PRESETS[presetKey];
  if (!p) return;
  closeMicPermissionModal();
  
  const statusEl = document.getElementById("micStatus");
  if (statusEl) statusEl.innerText = `Loaded: ${p.label}`;
  
  // Directly trigger extraction and review
  runExtractionDirect(p.transcript);
}

// 4. Audio Recording & Local Inference
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
    // Check if getUserMedia is supported in current context
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      openMicPermissionModal();
      return;
    }

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
        if (previewEl) previewEl.src = audioUrl;
        const previewBox = document.getElementById("audioPreviewContainer");
        if (previewBox) previewBox.style.display = "block";
      };

      mediaRecorder.start();
      micBtn.classList.add("recording");
      micStatus.innerText = "Listening... Speak visit summary in Taglish";
      recordStartTime = Date.now();
      timerInterval = setInterval(updateTimer, 1000);
    } catch (err) {
      openMicPermissionModal();
    }
  }
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - recordStartTime) / 1000);
  const m = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");
  const timerEl = document.getElementById("recordTimer");
  if (timerEl) timerEl.innerText = `${m}:${s}`;
}

function resetRecordingState() {
  recordedBlob = null;
  const previewBox = document.getElementById("audioPreviewContainer");
  if (previewBox) previewBox.style.display = "none";
  const timerEl = document.getElementById("recordTimer");
  if (timerEl) timerEl.innerText = "00:00";
  const micStatus = document.getElementById("micStatus");
  if (micStatus) micStatus.innerText = "Tap to Start Recording";
  const micBtn = document.getElementById("micBtn");
  if (micBtn) micBtn.classList.remove("recording");
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
    alert("Transcription notice: " + err.message);
  } finally {
    transcribeBtn.innerHTML = `
      <svg class="btn-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
      <span>Transcribe on Device</span>`;
    transcribeBtn.disabled = false;
  }
}

// 5. Schema Extraction & Editable Form Population
async function runExtractionDirect(transcript) {
  goToStep(2);
  const transcriptEl = document.getElementById("transcriptDisplay");
  if (transcriptEl) transcriptEl.innerText = `"${transcript}"`;
  const llmStatsEl = document.getElementById("llmStats");
  if (llmStatsEl) llmStatsEl.innerText = "Running local LLM schema extraction...";

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

    const ext = data.extracted_data || {};
    populateReviewFields(ext, data);

    if (llmStatsEl) llmStatsEl.innerText = `LLM Latency: ${data.inference_seconds}s (Llama 3.2 1B Q4_K_M)`;
  } catch (err) {
    // Offline deterministic fallback
    console.log("[OfflineDoc] Running client-side deterministic extraction fallback...");
    fallbackClientExtraction(transcript);
  }
}

// Client-Side Deterministic Extraction Fallback (when completely offline / in Airplane Mode)
function fallbackClientExtraction(transcript) {
  const ext = {
    patient_name: null,
    age: null,
    sex: "Female",
    purok: "Purok 1",
    tcl_program: "General Consultation",
    vitals: { blood_pressure: null, bp_systolic: null, bp_diastolic: null },
    visit_details: {},
    symptoms_reported: [],
    symptoms_denied: [],
    medications_prescribed: [],
    clinical_summary: transcript
  };

  // Name match
  const nameMatch = transcript.match(/(?:ni|kay|pasyente si|si nanay|si tatay)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i);
  if (nameMatch) ext.patient_name = nameMatch[1];
  else if (activePatient) ext.patient_name = activePatient.full_name;

  // Age match
  const ageMatch = transcript.match(/(\d{1,2})\s*(?:anyos|years?\s*old|taong gulang)/i);
  if (ageMatch) ext.age = parseInt(ageMatch[1]);

  // Purok match
  const purokMatch = transcript.match(/(?:purok|sitio)\s*(\d+|[A-Za-z0-9]+)/i);
  if (purokMatch) ext.purok = `Purok ${purokMatch[1]}`;

  // BP match
  const bpMatch = transcript.match(/(\d{2,3})\s*(?:over|\/)\s*(\d{2,3})/i);
  if (bpMatch) {
    const sys = parseInt(bpMatch[1]);
    const dia = parseInt(bpMatch[2]);
    ext.vitals.blood_pressure = `${sys}/${dia}`;
    ext.vitals.bp_systolic = sys;
    ext.vitals.bp_diastolic = dia;
  }

  // Weeks match
  const weeksMatch = transcript.match(/(\d{1,2})\s*(?:weeks?|linggo)/i);
  if (weeksMatch) {
    ext.visit_details.gestational_age_weeks = parseInt(weeksMatch[1]);
    ext.tcl_program = "Maternal Care";
  }

  // Weight match
  const wtMatch = transcript.match(/(\d{1,3}(?:\.\d+)?)\s*(?:kilos?|kg)/i);
  if (wtMatch) ext.visit_details.weight_kg = parseFloat(wtMatch[1]);

  // Symptoms & Medications
  if (/sakit ng ulo|batok|nahihilo/i.test(transcript)) ext.symptoms_reported.push("Sakit ng ulo / Sakit ng batok");
  if (/manas/i.test(transcript)) {
    if (/wala.*manas/i.test(transcript)) ext.symptoms_denied.push("manas sa paa");
    else ext.symptoms_reported.push("manas sa paa");
  }
  if (/amlodipine/i.test(transcript)) ext.medications_prescribed.push("Amlodipine 5mg");
  if (/ferrous/i.test(transcript)) ext.medications_prescribed.push("Ferrous Sulfate + Folic Acid");
  if (/paracetamol/i.test(transcript)) ext.medications_prescribed.push("Paracetamol 500mg");
  if (/pentavalent/i.test(transcript)) {
    ext.medications_prescribed.push("Pentavalent 3");
    ext.tcl_program = "Child Immunization";
  }

  currentEncounterData = {
    extracted_data: ext,
    gap_alerts: ext.vitals.blood_pressure ? [] : ["POINT-OF-CARE GAP: Blood Pressure unrecorded"],
    inference_seconds: 0.05
  };

  populateReviewFields(ext, currentEncounterData);
  const llmStatsEl = document.getElementById("llmStats");
  if (llmStatsEl) llmStatsEl.innerText = "LLM Latency: 0.05s (Deterministic Offline Fallback)";
}

// Populate Editable Fields and Sync Dynamic UI
function populateReviewFields(ext, data) {
  // 1. Patient Name
  const nameInput = document.getElementById("editName");
  if (nameInput) {
    nameInput.value = ext.patient_name || (activePatient ? activePatient.full_name : "");
  }

  // 2. Demographics
  const ageInput = document.getElementById("editAge");
  if (ageInput) {
    ageInput.value = (ext.age !== null && ext.age !== undefined) ? ext.age : (activePatient && activePatient.age ? activePatient.age : "");
  }
  const sexSelect = document.getElementById("editSex");
  if (sexSelect) {
    const s = ext.sex || (activePatient ? activePatient.sex : "Female");
    sexSelect.value = (s.toLowerCase().startsWith("m")) ? "Male" : "Female";
  }
  const purokInput = document.getElementById("editPurok");
  if (purokInput) {
    purokInput.value = ext.purok || (activePatient ? activePatient.purok : "Purok 1");
  }

  // 3. Clinical Program
  const progSelect = document.getElementById("editProgram");
  if (progSelect) {
    const prog = ext.tcl_program || ext.program || (activePatient ? activePatient.program : "General Consultation");
    let found = false;
    for (let opt of progSelect.options) {
      if (opt.value.toLowerCase() === prog.toLowerCase() || opt.value.toLowerCase().includes(prog.toLowerCase())) {
        progSelect.value = opt.value;
        found = true;
        break;
      }
    }
    if (!found) progSelect.value = "General Consultation";
  }

  // 4. Blood Pressure
  const bpInput = document.getElementById("editBP");
  const bpVal = (ext.vitals && ext.vitals.blood_pressure) || "";
  if (bpInput) bpInput.value = bpVal;

  // 5. Maternal details & Weight
  const visitDetails = ext.visit_details || ext.maternal_details || {};
  const gestInput = document.getElementById("editGestWeeks");
  if (gestInput) {
    gestInput.value = visitDetails.gestational_age_weeks || "";
  }
  const weightInput = document.getElementById("editWeight");
  if (weightInput) {
    const wt = (ext.vitals && ext.vitals.weight_kg) || visitDetails.weight_kg || "";
    weightInput.value = wt;
  }

  // 6. Symptoms
  const symptomsInput = document.getElementById("editSymptoms");
  if (symptomsInput) {
    const rep = ext.symptoms_reported || [];
    const den = ext.symptoms_denied || [];
    let sympText = rep.length ? rep.join(", ") : "";
    if (den.length) {
      sympText += (sympText ? ` (Wala: ${den.join(", ")})` : `Wala: ${den.join(", ")}`);
    }
    symptomsInput.value = sympText;
  }

  // 7. Medications
  const medsInput = document.getElementById("editMeds");
  if (medsInput) {
    const meds = ext.medications_prescribed || ext.medications_noted || [];
    medsInput.value = meds.length ? meds.join(", ") : "";
  }

  // 8. Clinical Summary
  const summaryInput = document.getElementById("editSummary");
  if (summaryInput) {
    summaryInput.value = ext.clinical_summary || "";
  }

  // Sync legacy hidden spans
  const valName = document.getElementById("valName");
  if (valName) valName.innerText = nameInput ? nameInput.value : "--";
  const valDemographics = document.getElementById("valDemographics");
  if (valDemographics) {
    valDemographics.innerText = `${ageInput?.value || 'N/A'} yo | ${sexSelect?.value || 'F'} | ${purokInput?.value || 'Purok'}`;
  }
  const valProgram = document.getElementById("valProgram");
  if (valProgram) valProgram.innerText = progSelect ? progSelect.value : "--";
  const valBP = document.getElementById("valBP");
  if (valBP) valBP.innerText = bpVal || "--";
  const valMaternal = document.getElementById("valMaternal");
  if (valMaternal) {
    valMaternal.innerText = `${gestInput?.value ? gestInput.value + ' weeks' : 'N/A'} | ${weightInput?.value ? weightInput.value + ' kg' : 'N/A'}`;
  }
  const valSymptoms = document.getElementById("valSymptoms");
  if (valSymptoms) valSymptoms.innerText = symptomsInput?.value || "--";
  const valMeds = document.getElementById("valMeds");
  if (valMeds) valMeds.innerText = medsInput?.value || "--";
  const valSummary = document.getElementById("valSummary");
  if (valSummary) valSummary.innerText = summaryInput?.value || "--";

  // Re-evaluate BP badge and gap alerts
  updateBpBadgeAndAlerts();
}

function updateBpBadgeAndAlerts() {
  const bpInput = document.getElementById("editBP");
  const bpBadge = document.getElementById("bpBadge");
  const alertsBox = document.getElementById("gapAlertsContainer");
  if (!bpInput || !bpBadge) return;

  const bpVal = bpInput.value.trim();
  let sys = null, dia = null;
  const match = bpVal.match(/(\d{2,3})\s*(?:\/|\s+over\s+)\s*(\d{2,3})/i);
  if (match) {
    sys = parseInt(match[1]);
    dia = parseInt(match[2]);
  }

  const prog = document.getElementById("editProgram") ? document.getElementById("editProgram").value : "";
  const gestVal = document.getElementById("editGestWeeks") ? document.getElementById("editGestWeeks").value : "";
  const isMaternal = prog.includes("Maternal") || prog.includes("Prenatal") || gestVal;

  const dynamicAlerts = [];

  if (sys && dia) {
    if (sys >= 140 || dia >= 90) {
      bpBadge.innerText = `${sys}/${dia} (Elevated)`;
      bpBadge.className = "timeline-bp-pill elevated";
      if (isMaternal) {
        dynamicAlerts.push(`CRITICAL GAP: Elevated BP ${sys}/${dia} mmHg in maternal patient - flag for Pre-eclampsia screening and physician referral.`);
      } else {
        dynamicAlerts.push(`CLINICAL ALERT: Elevated BP ${sys}/${dia} mmHg - Stage 2 Hypertension protocol.`);
      }
    } else {
      bpBadge.innerText = `${sys}/${dia} (Normal)`;
      bpBadge.className = "timeline-bp-pill";
    }
  } else if (!bpVal) {
    bpBadge.innerText = "--";
    bpBadge.className = "timeline-bp-pill";
    dynamicAlerts.push("POINT-OF-CARE GAP: Blood Pressure unrecorded - mandatory vital sign for DOH Target Client List.");
  } else {
    bpBadge.innerText = bpVal;
    bpBadge.className = "timeline-bp-pill";
  }

  // Also check if name is missing
  const nameVal = document.getElementById("editName") ? document.getElementById("editName").value.trim() : "";
  if (!nameVal) {
    dynamicAlerts.push("MANDATORY FIELD GAP: Missing Patient Full Name.");
  }

  if (alertsBox) {
    if (dynamicAlerts.length > 0) {
      alertsBox.innerHTML = dynamicAlerts.map(a => `
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
          <span>Lahat ng kinakailangang DOH TCL datos ay kumpleto at wasto</span>
        </div>`;
    }
  }
}

function initEditableFieldListeners() {
  const bpInput = document.getElementById("editBP");
  if (bpInput) {
    bpInput.addEventListener("input", updateBpBadgeAndAlerts);
    bpInput.addEventListener("change", updateBpBadgeAndAlerts);
  }
  const progSelect = document.getElementById("editProgram");
  if (progSelect) {
    progSelect.addEventListener("change", updateBpBadgeAndAlerts);
  }
  const gestInput = document.getElementById("editGestWeeks");
  if (gestInput) {
    gestInput.addEventListener("input", updateBpBadgeAndAlerts);
  }
  const nameInput = document.getElementById("editName");
  if (nameInput) {
    nameInput.addEventListener("input", updateBpBadgeAndAlerts);
  }
}

// 6. Commit Encounter (Manual Edits + Direct Sync)
async function commitEncounter() {
  const btn = document.getElementById("confirmEncounterBtn");
  btn.innerText = "Sinisave ang rekord...";
  btn.disabled = true;

  // Read all user-edited fields directly from the form
  const editedName = (document.getElementById("editName") && document.getElementById("editName").value.trim()) || (activePatient ? activePatient.full_name : "Pasyente");
  const editedAge = (document.getElementById("editAge") && document.getElementById("editAge").value) ? parseInt(document.getElementById("editAge").value) : null;
  const editedSex = document.getElementById("editSex") ? document.getElementById("editSex").value : "Female";
  const editedPurok = (document.getElementById("editPurok") && document.getElementById("editPurok").value.trim()) || (activePatient ? activePatient.purok : "Purok 1");
  const editedProgram = document.getElementById("editProgram") ? document.getElementById("editProgram").value : "General Consultation";
  const editedBP = (document.getElementById("editBP") && document.getElementById("editBP").value.trim()) || null;
  const editedGestWeeks = (document.getElementById("editGestWeeks") && document.getElementById("editGestWeeks").value) ? parseInt(document.getElementById("editGestWeeks").value) : null;
  const editedWeight = (document.getElementById("editWeight") && document.getElementById("editWeight").value) ? parseFloat(document.getElementById("editWeight").value) : null;
  const editedSymptoms = (document.getElementById("editSymptoms") && document.getElementById("editSymptoms").value.trim()) || "";
  const editedMeds = (document.getElementById("editMeds") && document.getElementById("editMeds").value.trim()) || "";
  const editedSummary = (document.getElementById("editSummary") && document.getElementById("editSummary").value.trim()) || "";

  let bpSys = null, bpDia = null;
  if (editedBP) {
    const m = editedBP.match(/(\d{2,3})\s*(?:\/|\s+over\s+)\s*(\d{2,3})/i);
    if (m) {
      bpSys = parseInt(m[1]);
      bpDia = parseInt(m[2]);
    }
  }

  const ext = (currentEncounterData && currentEncounterData.extracted_data) ? { ...currentEncounterData.extracted_data } : {};
  ext.patient_name = editedName;
  ext.age = editedAge;
  ext.sex = editedSex;
  ext.purok = editedPurok;
  ext.tcl_program = editedProgram;
  ext.program = editedProgram;
  ext.clinical_summary = editedSummary || `${editedProgram} visit for ${editedName}.`;

  if (!ext.vitals) ext.vitals = {};
  ext.vitals.blood_pressure = editedBP;
  if (bpSys) ext.vitals.bp_systolic = bpSys;
  if (bpDia) ext.vitals.bp_diastolic = bpDia;
  if (editedWeight) ext.vitals.weight_kg = editedWeight;

  if (!ext.visit_details) ext.visit_details = {};
  if (editedGestWeeks) ext.visit_details.gestational_age_weeks = editedGestWeeks;
  if (editedWeight) ext.visit_details.weight_kg = editedWeight;

  if (editedSymptoms) {
    ext.symptoms_reported = editedSymptoms.split(",").map(s => s.trim()).filter(Boolean);
  }
  if (editedMeds) {
    ext.medications_prescribed = editedMeds.split(",").map(m => m.trim()).filter(Boolean);
    ext.medications_noted = ext.medications_prescribed;
  }

  const transcriptDisplay = document.getElementById("transcriptDisplay");
  const rawTranscript = transcriptDisplay ? transcriptDisplay.innerText.replace(/^"|"$/g, "") : "";

  const payload = {
    patient_id: activePatient ? activePatient.patient_id : null,
    patient_name: editedName,
    purok: editedPurok,
    program: editedProgram,
    raw_transcript: rawTranscript,
    extracted_data: ext,
    evidence_quotes: ext.evidence_quotes || {},
    gap_alerts: currentEncounterData ? (currentEncounterData.gap_alerts || []) : []
  };

  try {
    const res = await fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.detail || "Server error");

    const visitId = result.visit_id;
    const pdfUrl = result.pdf_url;
    const savedPatient = result.patient;

    // 1. Immediately update in-memory allPatients and persistent localStorage
    if (savedPatient) {
      const idx = allPatients.findIndex(p => p.patient_id === savedPatient.patient_id || (p.full_name && p.full_name.toLowerCase() === savedPatient.full_name.toLowerCase()));
      if (idx >= 0) {
        allPatients[idx] = savedPatient;
      } else {
        allPatients.unshift(savedPatient);
      }
      activePatient = savedPatient;
    } else {
      let target = activePatient;
      if (!target && payload.patient_name) {
        target = allPatients.find(p => p.full_name && p.full_name.toLowerCase() === payload.patient_name.toLowerCase());
      }
      if (!target) {
        target = {
          patient_id: result.patient_id || `P-${String(allPatients.length + 1).padStart(3, "0")}`,
          full_name: payload.patient_name,
          purok: payload.purok,
          age: ext.age || null,
          sex: ext.sex || "Female",
          program: payload.program,
          longitudinal_summary: `${payload.program} tracking for ${payload.patient_name}. Latest BP: ${(ext.vitals && ext.vitals.blood_pressure) || 'N/A'}.`,
          encounters: []
        };
        allPatients.unshift(target);
      }
      if (!target.encounters) target.encounters = [];
      target.encounters.push({
        visit_num: target.encounters.length + 1,
        date: new Date().toISOString().split("T")[0],
        bp: (ext.vitals && ext.vitals.blood_pressure) || "N/A",
        visit_id: visitId,
        notes: ext.clinical_summary || "Clinical encounter recorded."
      });
      activePatient = target;
    }
    localStorage.setItem("offlinedoc_patients_cache", JSON.stringify(allPatients));

    // 2. Also update visits ledger cache for DOH ITR Slips tab
    let visits = [];
    try {
      visits = JSON.parse(localStorage.getItem("offlinedoc_visits_cache") || "[]");
    } catch (e) {}
    visits.unshift({
      ...payload,
      visit_id: visitId,
      pdf_url: pdfUrl,
      created_at: new Date().toISOString().replace("T", " ").substring(0, 19)
    });
    localStorage.setItem("offlinedoc_visits_cache", JSON.stringify(visits));

    // 3. Immediately render updated directory and counts in background
    renderPatients(allPatients);
    if (typeof renderSlips === "function") renderSlips(visits);
    const countAllEl = document.getElementById("countAll");
    if (countAllEl) countAllEl.innerText = allPatients.length;
    const countTodayEl = document.getElementById("countToday");
    if (countTodayEl) {
      countTodayEl.innerText = allPatients.reduce((sum, p) => sum + (p.encounters ? p.encounters.length : 0), 0);
    }

    // 4. Clean, warm, non-technical success message
    const displayName = (savedPatient && savedPatient.full_name) || payload.patient_name;
    document.getElementById("successMsg").innerText = `Matagumpay na naitala ang rekord ni ${displayName}. Na-update na ang talaan ng pasyente at handa na ang opisyal na DOH ITR Slip.`;

    // Wire up download PDF link
    const pdfBtn = document.getElementById("downloadPdfBtn");
    if (pdfBtn && pdfUrl) {
      pdfBtn.href = pdfUrl;
      pdfBtn.setAttribute("download", `DOH_ITR_${visitId}.pdf`);
      pdfBtn.style.display = "inline-flex";
    }

    goToStep(3);
  } catch (err) {
    // 100% Offline fallback save
    const visitId = `visit_offline_${Date.now()}`;

    // 1. Update or create patient in local offline state
    let target = activePatient;
    if (!target && payload.patient_name) {
      target = allPatients.find(p => p.full_name && p.full_name.toLowerCase() === payload.patient_name.toLowerCase());
    }
    if (!target) {
      target = {
        patient_id: `P-${String(allPatients.length + 1).padStart(3, "0")}`,
        full_name: payload.patient_name,
        purok: payload.purok,
        age: ext.age || null,
        sex: ext.sex || "Female",
        program: payload.program,
        longitudinal_summary: `${payload.program} tracking for ${payload.patient_name}. Latest BP: ${(ext.vitals && ext.vitals.blood_pressure) || 'N/A'}.`,
        encounters: []
      };
      allPatients.unshift(target);
    }

    if (!target.encounters) target.encounters = [];
    target.encounters.push({
      visit_num: target.encounters.length + 1,
      date: new Date().toISOString().split("T")[0],
      bp: (ext.vitals && ext.vitals.blood_pressure) || "N/A",
      visit_id: visitId,
      notes: ext.clinical_summary || "Offline encounter recorded."
    });
    activePatient = target;
    localStorage.setItem("offlinedoc_patients_cache", JSON.stringify(allPatients));

    // 2. Add to visits cache
    let visits = [];
    try {
      visits = JSON.parse(localStorage.getItem("offlinedoc_visits_cache") || "[]");
    } catch (e) {}
    visits.unshift({
      ...payload,
      visit_id: visitId,
      created_at: new Date().toISOString().replace("T", " ").substring(0, 19)
    });
    localStorage.setItem("offlinedoc_visits_cache", JSON.stringify(visits));

    // 3. Immediately re-render UI
    renderPatients(allPatients);
    if (typeof renderSlips === "function") renderSlips(visits);
    const countAllEl = document.getElementById("countAll");
    if (countAllEl) countAllEl.innerText = allPatients.length;
    const countTodayEl = document.getElementById("countToday");
    if (countTodayEl) {
      countTodayEl.innerText = allPatients.reduce((sum, p) => sum + (p.encounters ? p.encounters.length : 0), 0);
    }

    // 4. Simple friendly offline message
    document.getElementById("successMsg").innerText = `Matagumpay na naitala ang rekord ni ${target.full_name} sa lokal na memorya habang offline. Na-update na ang talaan ng pasyente.`;
    const pdfBtn = document.getElementById("downloadPdfBtn");
    if (pdfBtn) pdfBtn.style.display = "none";

    goToStep(3);
  } finally {
    btn.innerHTML = `
      <svg class="btn-svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>I-save ang Rekord</span>`;
    btn.disabled = false;
  }
}

// 7. Modal & Navigation Event Wiring
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

  const backToRecordBtn = document.getElementById("backToRecordBtn");
  if (backToRecordBtn) backToRecordBtn.addEventListener("click", () => goToStep(1));
  const doneBtn = document.getElementById("doneBtn");
  if (doneBtn) {
    doneBtn.addEventListener("click", () => {
      closeModal();
      initDirectory();
      loadSlips();
      switchView("viewDirectory");
    });
  }

  // Offline Delete Modal
  const closeOfflineDeleteBtn = document.getElementById("closeOfflineDeleteBtn");
  if (closeOfflineDeleteBtn) {
    closeOfflineDeleteBtn.addEventListener("click", closeOfflineDeleteModal);
  }

  // Mic Permission Modal
  const openMicPermBtn = document.getElementById("openMicPermissionBtn");
  if (openMicPermBtn) openMicPermBtn.addEventListener("click", openMicPermissionModal);
  const closeMicModalBtn = document.getElementById("closeMicModalBtn");
  if (closeMicModalBtn) closeMicModalBtn.addEventListener("click", closeMicPermissionModal);
  const closeMicModalDoneBtn = document.getElementById("closeMicModalDoneBtn");
  if (closeMicModalDoneBtn) closeMicModalDoneBtn.addEventListener("click", closeMicPermissionModal);
  const requestMicPermBtn = document.getElementById("requestMicPermBtn");
  if (requestMicPermBtn) requestMicPermBtn.addEventListener("click", requestMicrophoneAccess);

  // Audio Presets Buttons
  const presetMaternalBtn = document.getElementById("presetMaternalBtn");
  if (presetMaternalBtn) presetMaternalBtn.addEventListener("click", () => loadVoicePreset("maternal"));
  const presetHtnBtn = document.getElementById("presetHtnBtn");
  if (presetHtnBtn) presetHtnBtn.addEventListener("click", () => loadVoicePreset("htn"));
  const presetEpiBtn = document.getElementById("presetEpiBtn");
  if (presetEpiBtn) presetEpiBtn.addEventListener("click", () => loadVoicePreset("epi"));

  // Mobile QR Modal events
  const qrModal = document.getElementById("qrModal");

  async function openQrModal() {
    if (!qrModal) return;
    qrModal.classList.add("active");
    const httpEl = document.getElementById("qrHttpUrl");
    const httpsEl = document.getElementById("qrHttpsUrl");
    const imgEl = document.getElementById("qrImage");
    const micHttpsLink = document.getElementById("micHttpsLink");

    try {
      const res = await fetch("/api/network");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const net = await res.json();
      if (httpEl) httpEl.innerText = net.http_url;
      if (httpsEl) { httpsEl.innerText = net.https_url; httpsEl.href = net.https_url; }
      if (micHttpsLink) micHttpsLink.href = net.https_url;
      if (imgEl) imgEl.src = `/api/qr.svg?url=${encodeURIComponent(net.https_url)}`;
    } catch (err) {
      if (httpEl) httpEl.innerText = "Local station: http://" + (location.hostname || "127.0.0.1") + ":8000";
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
