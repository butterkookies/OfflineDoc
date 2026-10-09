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

  // --- DOM Elements ---
  // Views
  const viewRecord = document.getElementById("view-record");
  const viewReview = document.getElementById("view-review");
  const viewExport = document.getElementById("view-export");

  // Record Screen
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

  // Review Screen
  const btnReRecord = document.getElementById("btn-re-record");
  const transcriptDisplay = document.getElementById("transcript-display");
  const transcribeTimeBadge = document.getElementById("transcribe-time-badge");
  const btnConfirmSave = document.getElementById("btn-confirm-save");

  // Inputs
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
  const inpRefFacility = document.getElementById("inp-ref-facility");
  const inpRefReason = document.getElementById("inp-ref-reason");
  const cardReferral = document.getElementById("card-referral");
  const badgeReferral = document.getElementById("badge-referral");
  const vitalBpCard = document.getElementById("vital-bp-card");
  const vitalTempCard = document.getElementById("vital-temp-card");

  // Verified Indicators
  const vPatient = document.getElementById("v-patient");
  const vComplaint = document.getElementById("v-complaint");
  const vVitals = document.getElementById("v-vitals");

  // Export Screen
  const exportPatientSummary = document.getElementById("export-patient-summary");
  const linkDownloadVisit = document.getElementById("link-download-visit");
  const linkDownloadReferral = document.getElementById("link-download-referral");
  const linkDownloadChecklist = document.getElementById("link-download-checklist");
  const btnNewVisit = document.getElementById("btn-new-visit");

  // --- Navigation ---
  function showScreen(screen) {
    viewRecord.classList.remove("active");
    viewReview.classList.remove("active");
    viewExport.classList.remove("active");

    if (screen === "record") viewRecord.classList.add("active");
    else if (screen === "review") viewReview.classList.add("active");
    else if (screen === "export") viewExport.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // --- Format Timer ---
  function formatSeconds(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
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
      // Show processing state
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

      // Live mic recording is active: turn off sample mode
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

    if (isSampleMode) {
      setSampleBanner(true);
    } else {
      setSampleBanner(false);
    }

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

  // --- Populate Review Screen & Setup Grounding ---
  function populateReviewScreen(transcript, record, spans) {
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

    // Referral slip card
    if (record.referral) {
      cardReferral.style.display = "block";
      inpRefFacility.value = record.referral.facility || "Rural Health Unit (RHU)";
      inpRefReason.value = record.referral.reason || "";
      if (record.referral.urgency === "urgent") {
        badgeReferral.textContent = "URGENT";
        badgeReferral.className = "badge-urgent";
      } else {
        badgeReferral.textContent = "ROUTINE";
        badgeReferral.className = "badge-routine";
      }
    } else {
      inpRefFacility.value = "Rural Health Unit (RHU)";
      inpRefReason.value = "";
      badgeReferral.textContent = "ROUTINE";
      badgeReferral.className = "badge-routine";
    }

    // Vitals warning checks
    checkVitalsWarnings();

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
    if (bp && bp.includes("/")) {
      const parts = bp.split("/");
      const sys = parseInt(parts[0], 10);
      const dia = parseInt(parts[1], 10);
      if (sys >= 140 || dia >= 90) {
        vitalBpCard.classList.add("warning");
      } else {
        vitalBpCard.classList.remove("warning");
      }
    } else {
      vitalBpCard.classList.remove("warning");
    }

    const temp = parseFloat(inpTemp.value);
    if (!isNaN(temp) && temp >= 38.0) {
      vitalTempCard.classList.add("warning");
    } else {
      vitalTempCard.classList.remove("warning");
    }
  }

  inpBp.addEventListener("input", checkVitalsWarnings);
  inpTemp.addEventListener("input", checkVitalsWarnings);

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
    // Collect all valid verified spans with start_char and end_char
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

    // Sort by start index
    validSpans.sort((a, b) => a.start - b.start);

    // Disambiguate overlapping spans
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

        // Find matching field card
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

    // Reset active states
    document.querySelectorAll(".field-card").forEach((c) => c.classList.remove("field-active"));
    document.querySelectorAll(".quote-span").forEach((s) => s.classList.remove("quote-active"));

    // Activate card
    const targetCard = document.querySelector(`.field-card[data-field="${fieldName}"]`) ||
                       document.querySelector(`.field-card[data-field^="${baseField}"]`);
    if (targetCard) {
      targetCard.classList.add("field-active");
    }

    // Activate quote span in transcript
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
      btnConfirmSave.textContent = "Ipinoproseso...";

      // Build updated record from form inputs
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

      let referralObj = null;
      if (inpRefReason.value.trim() || inpRefFacility.value.trim()) {
        referralObj = {
          facility: inpRefFacility.value.trim() || "Rural Health Unit (RHU)",
          reason: inpRefReason.value.trim() || "Clinical evaluation and physician consultation",
          urgency: badgeReferral.textContent.toLowerCase() === "urgent" ? "urgent" : "routine",
        };
      }

      const confirmedRecord = {
        patient_label: inpPatientLabel.value.trim() || "Pasyente",
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
        follow_up: (currentRecord && currentRecord.follow_up) || [
          { task: "Follow-up consultation", due: "Next week" },
        ],
        referral: referralObj,
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

      // Setup Export Links
      exportPatientSummary.textContent = `Nakahanda na ang mga opisyal na dokumento para kay ${confirmedRecord.patient_label}.`;
      linkDownloadVisit.href = confData.exports.visit_pdf;
      linkDownloadChecklist.href = confData.exports.checklist_txt;

      if (confData.exports.referral_pdf) {
        linkDownloadReferral.href = confData.exports.referral_pdf;
        linkDownloadReferral.style.display = "block";
      } else {
        linkDownloadReferral.style.display = "none";
      }

      showScreen("export");
    } catch (err) {
      alert("Error sa pag-save: " + err.message);
    } finally {
      btnConfirmSave.disabled = false;
      btnConfirmSave.textContent = "✓ Kumpirmahin at I-export";
    }
  });

  // Start New Visit
  btnNewVisit.addEventListener("click", () => {
    currentTranscript = "";
    currentRecord = null;
    currentSpans = {};
    setSampleBanner(false);
    showScreen("record");
  });
});
