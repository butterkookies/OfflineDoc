"""
test_scenarios.py - Automated Verification Suite for OfflineDoc DOH TCL & ITR Engine
Tests 3 clinical vignettes against the live local backend:
1. Scenario A: Maternal Care Routine Visit (Negative edema, Ferrous sulfate)
2. Scenario B: Hypertensive Danger Sign (150/95 mmHg -> RHU Referral Alert)
3. Scenario C: Point-of-Care Gap Alert (Fever & Cough with unmeasured BP)
"""

import time
import json
import urllib.request
import urllib.parse
from pathlib import Path

BASE_URL = "http://127.0.0.1:8000"

def post_json(endpoint: str, payload: dict) -> dict:
    url = f"{BASE_URL}{endpoint}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as res:
        return json.loads(res.read().decode("utf-8"))

def get_bytes(endpoint: str) -> bytes:
    url = f"{BASE_URL}{endpoint}"
    with urllib.request.urlopen(url, timeout=30) as res:
        return res.read()

def run_tests():
    print("=" * 80)
    print("OFFLINEDOC COMPREHENSIVE CLINICAL SUITE VERIFICATION")
    print("=" * 80)

    # 1. Health check
    print("\n[TEST 1] Verifying /api/health...")
    with urllib.request.urlopen(f"{BASE_URL}/api/health") as res:
        health = json.loads(res.read())
        print("  Mode:", health["mode"])
        print("  PDF Engine:", health["pdf_engine"])
        assert health["status"] == "online_local"
        assert health["mode"] == "air_gapped_offline"
        print("  PASS: Health endpoint confirmed air-gapped offline.")

    # 2. Scenario A: Normal Maternal Visit
    print("\n[TEST 2] Scenario A -- Normal Maternal Prenatal Follow-up")
    transcript_a = (
        "Pangatlong checkup po ni Maria Santos, 28 years old, taga Purok 2. "
        "32 weeks na po ang tiyan, BP ay isang daan at dalawampu over walumpu, 54 kilos. "
        "Wala na pong manas sa paa, tuloy pa rin po ang ferrous sulfate."
    )
    t0 = time.time()
    res_a = post_json("/api/extract", {"transcript": transcript_a})
    el_a = time.time() - t0
    data_a = res_a["extracted_data"]
    
    print(f"  Extracted Name: {data_a.get('patient_name')} (Age: {data_a.get('age')}, Purok: {data_a.get('purok')})")
    print(f"  TCL Program: {data_a.get('tcl_program')}")
    print(f"  Vitals BP: {data_a.get('vitals', {}).get('blood_pressure')} (Systolic: {data_a.get('vitals', {}).get('bp_systolic')})")
    print(f"  Gestational Age: {data_a.get('visit_details', {}).get('gestational_age_weeks')} weeks")
    print(f"  Symptoms Denied: {data_a.get('symptoms_denied')}")
    print(f"  Medications: {data_a.get('medications_prescribed')}")
    print(f"  Extraction Latency: {el_a:.2f}s")
    
    # Assertions
    assert "Maria" in (data_a.get("patient_name") or "")
    assert data_a.get("vitals", {}).get("blood_pressure") == "120/80"
    assert data_a.get("visit_details", {}).get("gestational_age_weeks") == 32
    assert "manas" in str(data_a.get("symptoms_denied", []))
    assert len(res_a["gap_alerts"]) == 0 or "Pre-eclampsia" not in str(res_a["gap_alerts"])
    print("  PASS: Scenario A correctly extracted normal maternal vitals without false edema.")

    # 3. Scenario B: Hypertensive Crisis / Red Flag
    print("\n[TEST 3] Scenario B -- Hypertensive Danger Sign (150/95 mmHg)")
    transcript_b = (
        "Pasyente si Teresa Ramos, 54 anyos, Purok 4. Sobrang sakit ng batok at ulo po. "
        "Ang BP niya ay 150 over 95. Hindi nakainom ng amlodipine kahapon."
    )
    t0 = time.time()
    res_b = post_json("/api/extract", {"transcript": transcript_b})
    el_b = time.time() - t0
    data_b = res_b["extracted_data"]
    
    print(f"  Extracted Name: {data_b.get('patient_name')} (Age: {data_b.get('age')}, Purok: {data_b.get('purok')})")
    print(f"  Vitals BP: {data_b.get('vitals', {}).get('blood_pressure')}")
    print(f"  Reported Symptoms: {data_b.get('symptoms_reported')}")
    print(f"  Gap / Safety Alerts: {res_b['gap_alerts']}")
    print(f"  Extraction Latency: {el_b:.2f}s")
    
    assert data_b.get("vitals", {}).get("blood_pressure") == "150/95"
    assert any("Hypertension" in a or "140/90" in a for a in res_b["gap_alerts"])
    print("  PASS: Scenario B successfully flagged hypertensive danger alert (BP >= 140/90).")

    # 4. Scenario C: Point-of-Care Missing Vitals Gap
    print("\n[TEST 4] Scenario C -- Point-of-Care Gap Alert (Missing BP)")
    transcript_c = (
        "Si Juan Dela Cruz, 35 anyos, may mataas na lagnat at ubo tatlong araw na. "
        "Uminom ng paracetamol kaninang umaga."
    )
    res_c = post_json("/api/extract", {"transcript": transcript_c})
    data_c = res_c["extracted_data"]
    
    print(f"  Extracted Name: {data_c.get('patient_name')} (Age: {data_c.get('age')})")
    print(f"  BP Extracted: {data_c.get('vitals', {}).get('blood_pressure')}")
    print(f"  Gap Alerts: {res_c['gap_alerts']}")
    
    assert data_c.get("vitals", {}).get("blood_pressure") is None
    assert any("Blood Pressure" in a for a in res_c["gap_alerts"])
    print("  PASS: Scenario C correctly triggered gap warning for unmeasured blood pressure.")

    # 5. Encounter Save & Official DOH PDF Export
    print("\n[TEST 5] Committing Encounter & Generating Official DOH ITR Slip (PDF)...")
    save_payload = {
        "patient_id": "P-001",
        "patient_name": data_a.get("patient_name") or "Maria Santos",
        "purok": data_a.get("purok") or "Purok 2",
        "program": "Maternal Care",
        "raw_transcript": transcript_a,
        "extracted_data": data_a,
        "evidence_quotes": data_a.get("evidence_quotes", {}),
        "gap_alerts": res_a["gap_alerts"]
    }
    save_res = post_json("/api/visits", save_payload)
    visit_id = save_res["visit_id"]
    pdf_url = save_res["pdf_url"]
    print(f"  Committed Visit ID: {visit_id}")
    print(f"  PDF URL: {pdf_url}")

    # Fetch PDF bytes
    pdf_bytes = get_bytes(pdf_url)
    print(f"  Received PDF document size: {len(pdf_bytes)} bytes")
    assert len(pdf_bytes) > 2000
    assert pdf_bytes.startswith(b"%PDF-")
    print("  PASS: Official DOH ITR & TCL PDF generated and verified successfully!")

    # 6. Scenario D: Child Immunization Catch-up (EPI)
    print("\n[TEST 6] Scenario D -- Child Immunization Catch-up (Baby Joshua Bautista)")
    transcript_d = (
        "Si Baby Joshua Bautista, 9 months old, taga Purok 3. Kasama nanay Rosa Bautista. "
        "Timbang ay 8.5 kg. Binigyan ng Pentavalent 3 at Vitamin A. Walang lagnat."
    )
    res_d = post_json("/api/extract", {"transcript": transcript_d})
    data_d = res_d["extracted_data"]
    print(f"  Extracted Name: {data_d.get('patient_name')}")
    print(f"  Program: {data_d.get('tcl_program')}")
    print(f"  Weight: {data_d.get('visit_details', {}).get('weight_kg')} kg")
    print(f"  Medications / Vaccines: {data_d.get('medications_prescribed')}")
    assert "Joshua" in (data_d.get("patient_name") or "")
    assert data_d.get("tcl_program") == "Child Immunization"
    print("  PASS: Scenario D successfully extracted child immunization encounter.")

    # 7. Scenario E: 4-Cohort Patient Directory & PDF Download Verification
    print("\n[TEST 7] Scenario E -- Patient Directory & PDF Verification")
    with urllib.request.urlopen(f"{BASE_URL}/api/patients") as res:
        patients = json.loads(res.read())
        print(f"  Total Patients: {len(patients)}")
        patient_ids = [p["patient_id"] for p in patients]
        print(f"  Patient IDs: {patient_ids}")
        # Seeding is disabled (no fake data); the directory must at least contain the patient committed in TEST 5.
        assert len(patients) >= 1
        assert any(p.get("full_name", "").lower() == "maria santos" for p in patients)

        # Verify each patient has encounters and latest PDF works
        for p in patients:
            encs = p.get("encounters", [])
            assert len(encs) >= 1
            last_enc = encs[-1]
            if "visit_id" in last_enc:
                v_pdf = get_bytes(f"/api/export-pdf/{last_enc['visit_id']}")
                assert v_pdf.startswith(b"%PDF-")
                print(f"    Verified PDF for {p['patient_id']} ({p['full_name']}): {len(v_pdf)} bytes OK")
        print("  PASS: All patients verified with active histories and downloadable DOH ITR PDFs.")

    print("\n" + "=" * 80)
    print("ALL 7 VERIFICATION SUITES PASSED! ENGINE & PWA READY FOR FIELD EVALUATION.")
    print("=" * 80)

if __name__ == "__main__":
    run_tests()
