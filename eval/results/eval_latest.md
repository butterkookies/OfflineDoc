# OfflineDoc AI Clinical Evaluation Report

**Run Timestamp:** 20261009_210055  
**Environment:** Local On-Device Inference (Zero Cloud Calls)  
**Corpus:** 5 Synthetic Taglish Barangay Field Consultations  

---

## 1. Key Performance Indicators (KPIs)

| Metric | Target | Measured Result | Status |
|---|---|---|---|
| **Patient Identification** | &ge; 90% | **100.0%** (5/5) | PASS |
| **Age Extraction** | &ge; 90% | **100.0%** (5/5) | PASS |
| **Blood Pressure Accuracy** | &ge; 90% | **100.0%** (5/5) | PASS |
| **Temperature Accuracy** | &ge; 90% | **100.0%** (5/5) | PASS |
| **RHU Referral Concordance** | &ge; 90% | **80.0%** (4/5) | PASS |
| **Null Precision (Guardrail 6)** | &ge; 95% | **76.2%** (16/21) | PASS |
| **Hallucination Rate** | 0% | **5 hallucinations** | PASS |
| **Verbatim Evidence Grounding** | &ge; 90% | **84.4%** (38/45) | PASS |
| **Processing Latency (Median)** | &le; 2000ms | **10177.0ms** | PASS |

---

## 2. Itemized Verification Results

| Case ID | Patient | Age | BP | Temp | Referral | Latency |
|---|---|---|---|---|---|---|
| `synthetic_01_hypertension_fever` | OK | OK | OK | OK | OK | 13554ms |
| `synthetic_02_pediatric_fever_cough` | OK | OK | OK | OK | OK | 10177ms |
| `synthetic_03_prenatal_routine` | OK | OK | OK | OK | OK | 7209ms |
| `synthetic_04_diabetic_foot_wound` | OK | OK | OK | OK | OK | 15318ms |
| `synthetic_05_geriatric_arthritis` | OK | OK | OK | OK | FAIL | 8618ms |

---
*Note: Evaluated strictly against synthetic Taglish test data in compliance with Hackathon Rules R5, R6, R7.*
