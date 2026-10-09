import time
import subprocess
import json

prompt = """<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are an expert clinical entity extractor for Philippine Barangay Health Workers (BHWs).
Analyze the following messy Taglish transcript. Ignore Filipino filler words ('ano', 'kuwan', 'ayun', 'wait lang', 'este'), false starts, and speech hesitations. Extract ONLY finalized clinical facts into JSON:
{
  "patient_name": string or null,
  "age": number or null,
  "vitals": {"blood_pressure": string or null},
  "symptoms": [string],
  "evidence_quote": string
}
Respond ONLY with the JSON object.<|eot_id|><|start_header_id|>user<|end_header_id|>
Transcript:
Ano po... si nanay Remedios po... kuwan... 58 years old... ang BP niya po kanina ay... 120 over... este 140 over 90 pala... tapos ano po... masakit daw ang batok at nahihilo... ayun po.
<|eot_id|><|start_header_id|>assistant<|end_header_id|>
"""

cmd = [
    "bin/llama-cli.exe",
    "-m", "models/Llama-3.2-1B-Instruct-Q4_K_M.gguf",
    "-p", prompt,
    "-n", "128",
    "--temp", "0.0",
    "-c", "1024",
    "--single-turn",
    "--no-display-prompt"
]

t0 = time.time()
res = subprocess.run(cmd, capture_output=True, text=True)
elapsed = time.time() - t0

out = res.stdout.strip()
s = out.find("{")
e = out.rfind("}")
json_str = out[s:e+1] if s != -1 and e != -1 else out

print(f"=== Total Execution Time: {elapsed:.2f} seconds ===")
print("Generated JSON:")
print(json_str)
