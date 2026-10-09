# OfflineDoc AI Clinical Evaluation Report

**Run Timestamp:** 20261009_183903  
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
| **RHU Referral Concordance** | &ge; 90% | **100.0%** (5/5) | PASS |
| **Null Precision (Guardrail 6)** | &ge; 95% | **100.0%** (21/21) | PASS |
| **Hallucination Rate** | 0% | **0 hallucinations** | PASS |
| **Verbatim Evidence Grounding** | &ge; 90% | **100.0%** (31/31) | PASS |
| **Processing Latency (Median)** | &le; 2000ms | **1142.0ms** | PASS |

---

## 2. Itemized Verification Results

| Case ID | Patient | Age | BP | Temp | Referral | Latency |
|---|---|---|---|---|---|---|
| `synthetic_01_hypertension_fever` | OK | OK | OK | OK | OK | 1432ms |
| `synthetic_02_pediatric_fever_cough` | OK | OK | OK | OK | OK | 1121ms |
| `synthetic_03_prenatal_routine` | OK | OK | OK | OK | OK | 1116ms |
| `synthetic_04_diabetic_foot_wound` | OK | OK | OK | OK | OK | 1142ms |
| `synthetic_05_geriatric_arthritis` | OK | OK | OK | OK | OK | 1207ms |

---
*Note: Evaluated strictly against synthetic Taglish test data in compliance with Hackathon Rules R5, R6, R7.*
