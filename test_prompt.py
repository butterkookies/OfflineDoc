import urllib.request, json, time

prompt = """<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are an administrative information extraction assistant for municipal health records.
Extract mentioned details from the interview transcript into the JSON format below. Do not give medical advice.

CRITICAL RULES:
1. If an item is not mentioned, set to null.
2. If "wala nang X" is said, put in symptoms_denied, not symptoms_reported.
3. Respond ONLY with valid JSON.

JSON Schema:
{
  "patient_name": "string or null",
  "age": "number or null",
  "sex": "string or null",
  "purok": "string or null",
  "tcl_program": "Maternal Care" | "Hypertension/Diabetes" | "Child Health" | "General Consultation",
  "visit_details": {
    "gestational_age_weeks": "number or null",
    "weight_kg": "number or null"
  },
  "vitals": {
    "blood_pressure": "string or null",
    "temperature_c": "number or null"
  },
  "symptoms_reported": ["string"],
  "symptoms_denied": ["string"],
  "medications_prescribed": ["string"],
  "evidence_quotes": {
    "patient_name": "string or null",
    "blood_pressure": "string or null"
  },
  "clinical_summary": "string"
}
<|eot_id|><|start_header_id|>user<|end_header_id|>
Transcript:
Pasyente si Maria Santos, 28 years old, taga Purok 2. 32 weeks na ang tiyan, BP ay 120 over 80, 54 kilos. Wala na pong manas sa paa, tuloy pa rin ang ferrous sulfate.
<|eot_id|><|start_header_id|>assistant<|end_header_id|>
"""

req_data = json.dumps({'prompt': prompt, 'n_predict': 350, 'temperature': 0.0, 'stop': ['<|eot_id|>']}).encode('utf-8')
req = urllib.request.Request('http://127.0.0.1:8080/completion', data=req_data, headers={'Content-Type': 'application/json'})
t0 = time.time()
with urllib.request.urlopen(req, timeout=15) as res:
    out = json.loads(res.read())
    print('Latency:', round(time.time() - t0, 3), 's')
    print('Content:')
    print(out.get('content'))
