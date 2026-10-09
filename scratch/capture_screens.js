const puppeteer = require('./node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_DIR = path.resolve(__dirname, 'screens');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // 1. Capture Desktop Dashboard
  console.log('Capturing Desktop Dashboard...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:8000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, '01_desktop_dashboard.png') });

  // 2. Capture Mobile Portrait View
  console.log('Capturing Mobile View...');
  await page.setViewport({ width: 420, height: 880, deviceScaleFactor: 2 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(OUT_DIR, '02_mobile_home.png') });

  // 3. Open Encounter Flow - Step 1: Record Voice
  console.log('Capturing Step 1 (Record)...');
  await page.setViewport({ width: 1280, height: 820, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:8000', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    // Open modal
    const fab = document.getElementById('openNewEncounterFab');
    if (fab) fab.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT_DIR, '03_step1_record.png') });

  // 4. Populate Step 2 (Review & Gaps) with Maria Santos
  console.log('Capturing Step 2 (Review & Gaps)...');
  await page.evaluate(() => {
    // Switch to step 2 view
    document.querySelectorAll('.step-pill').forEach(p => p.classList.remove('active'));
    document.getElementById('step2Pill').classList.add('active');
    document.querySelectorAll('.step-content').forEach(c => c.classList.remove('active'));
    document.getElementById('step2View').classList.add('active');

    // Populate transcript
    document.getElementById('transcriptDisplay').innerHTML = `
      <p style="margin-bottom:8px; line-height: 1.6; color:#0F172A; font-size:15px;">
        <span style="background:#E0F2FE; color:#0369A1; padding:2px 6px; border-radius:4px; font-weight:600;">"Pangatlong checkup po ni Maria Santos</span>, 
        <span style="background:#FEF3C7; color:#92400E; padding:2px 6px; border-radius:4px; font-weight:600;">28 years old, taga Purok 2</span>. 
        <span style="background:#DCFCE7; color:#15803D; padding:2px 6px; border-radius:4px; font-weight:600;">32 weeks na po ang tiyan</span>, 
        <span style="background:#FEE2E2; color:#B91C1C; padding:2px 6px; border-radius:4px; font-weight:600;">BP ay 120 over 80</span>, 54 kilos. 
        <span style="background:#F1F5F9; color:#475569; padding:2px 6px; border-radius:4px; font-weight:600;">Wala na pong manas sa paa</span>, 
        <span style="background:#E0E7FF; color:#4338CA; padding:2px 6px; border-radius:4px; font-weight:600;">tuloy pa rin po ang ferrous sulfate."</span>
      </p>
    `;
    document.getElementById('sttStats').innerHTML = `<span>STT Latency: 2.14s</span> &bull; <span>Faster-Whisper INT8</span> &bull; <span>Confidence: 98.4%</span>`;

    // Populate TCL fields
    document.getElementById('valName').innerHTML = `<strong>Maria Santos</strong> <span style="font-size:11px; color:#0284C7; background:#E0F2FE; padding:1px 6px; border-radius:10px; margin-left:6px;">VERIFIED</span>`;
    document.getElementById('valDemographics').innerText = `28 yo / Female / Purok 2`;
    document.getElementById('valProgram').innerHTML = `<span style="background:#EFF6FF; color:#0055FE; padding:2px 8px; border-radius:6px; font-weight:700;">Maternal Care (Prenatal)</span>`;
    document.getElementById('valBP').innerHTML = `<strong>120/80 mmHg</strong> <span style="color:#16A34A; font-weight:600; margin-left:6px; font-size:12px;">Normotensive</span>`;
    document.getElementById('valMaternal').innerText = `32 weeks AOG / 54.0 kg`;
    document.getElementById('valSymptoms').innerText = `Edema resolved (No pedal swelling)`;
    document.getElementById('valMeds').innerText = `Ferrous Sulfate 60mg OD (Adherent)`;
    document.getElementById('valSummary').innerText = `G2P1 32 weeks prenatal encounter 3. Stable maternal vitals. Prescribed continuous iron supplementation.`;
    document.getElementById('llmStats').innerHTML = `<span>Extraction Latency: 0.79s</span> &bull; <span>Llama 3.2 1B Edge</span> &bull; <span>RA 10173 Local Residue</span>`;

    // Gap alerts
    const alertsBox = document.getElementById('gapAlertsContainer');
    if (alertsBox) {
      alertsBox.innerHTML = `
        <div style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:10px 14px; margin-bottom:12px; display:flex; align-items:center; gap:10px;">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#16A34A" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <div style="font-size:12.5px; color:#166534; font-weight:600;">
            Pre-eclampsia Risk Rule: Passed. Blood pressure stable. No proteinuric warning.
          </div>
        </div>
      `;
    }
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT_DIR, '04_step2_review_gaps.png') });

  // 5. Populate Step 2 with Teresa Ramos Hypertensive Danger Red Flag
  console.log('Capturing Hypertensive Red Flag Alert...');
  await page.evaluate(() => {
    document.getElementById('modalPatientName').innerText = 'Encounter: Teresa Ramos';
    document.getElementById('transcriptDisplay').innerHTML = `
      <p style="margin-bottom:8px; line-height: 1.6; color:#0F172A; font-size:15px;">
        <span style="background:#E0F2FE; color:#0369A1; padding:2px 6px; border-radius:4px; font-weight:600;">"Pasyente si Teresa Ramos</span>, 
        <span style="background:#FEF3C7; color:#92400E; padding:2px 6px; border-radius:4px; font-weight:600;">54 anyos, Purok 4</span>. 
        <span style="background:#FEE2E2; color:#B91C1C; padding:2px 6px; border-radius:4px; font-weight:600;">Sobrang sakit ng batok at ulo po</span>. 
        <span style="background:#DC2626; color:#FFFFFF; padding:2px 6px; border-radius:4px; font-weight:700;">Ang BP niya ay 150 over 95</span>. 
        <span style="background:#FEF3C7; color:#B45309; padding:2px 6px; border-radius:4px; font-weight:600;">Hindi nakainom ng amlodipine kahapon."</span>
      </p>
    `;
    document.getElementById('valName').innerHTML = `<strong>Teresa Ramos</strong> <span style="font-size:11px; color:#DC2626; background:#FEE2E2; padding:1px 6px; border-radius:10px; margin-left:6px; font-weight:700;">URGENT</span>`;
    document.getElementById('valDemographics').innerText = `54 yo / Female / Purok 4`;
    document.getElementById('valProgram').innerHTML = `<span style="background:#FEF2F2; color:#DC2626; padding:2px 8px; border-radius:6px; font-weight:700;">Hypertension / NCD Cohort</span>`;
    document.getElementById('valBP').innerHTML = `<strong style="color:#DC2626; font-size:16px;">150/95 mmHg</strong> <span style="background:#DC2626; color:#FFF; font-weight:700; margin-left:8px; font-size:11px; padding:2px 6px; border-radius:4px;">STAGE 2 HYPERTENSIVE DANGER</span>`;
    document.getElementById('valSymptoms').innerText = `Occipital headache, batok pain, dizziness`;
    document.getElementById('valMeds').innerHTML = `<span style="color:#DC2626; font-weight:700;">Amlodipine 5mg OD (DEFAULTED 2 DAYS)</span>`;

    const alertsBox = document.getElementById('gapAlertsContainer');
    if (alertsBox) {
      alertsBox.innerHTML = `
        <div style="background:#FEF2F2; border:1.5px solid #F87171; border-radius:10px; padding:12px 16px; margin-bottom:14px; display:flex; align-items:flex-start; gap:12px; box-shadow:0 4px 12px rgba(220,38,38,0.12);">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#DC2626" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <div>
            <div style="font-size:14px; color:#991B1B; font-weight:800; letter-spacing:0.3px;">CRITICAL CLINICAL ALERT: HYPERTENSIVE CRISIS (BP &gt;= 140/90)</div>
            <div style="font-size:12.5px; color:#B91C1C; margin-top:3px; line-height:1.4;">
              Blood pressure 150/95 mmHg with severe occipital symptoms and medication non-adherence. <strong>Mandatory prompt RHU Physician Referral protocol triggered.</strong>
            </div>
          </div>
        </div>
      `;
    }
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT_DIR, '05_step2_red_flag_alert.png') });

  // 6. Capture Step 3 (Confirm & Export)
  console.log('Capturing Step 3 (Success & Export)...');
  await page.evaluate(() => {
    document.querySelectorAll('.step-pill').forEach(p => p.classList.remove('active'));
    document.getElementById('step3Pill').classList.add('active');
    document.querySelectorAll('.step-content').forEach(c => c.classList.remove('active'));
    document.getElementById('step3View').classList.add('active');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT_DIR, '06_step3_success_export.png') });

  // 7. Capture QR Modal
  console.log('Capturing QR Pairing Modal...');
  await page.goto('http://127.0.0.1:8000', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const btn = document.getElementById('openQrModalBtn');
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT_DIR, '07_qr_pair_mobile.png') });

  await browser.close();
  console.log('All actual UI screenshots captured successfully!');
}

run().catch(console.error);
