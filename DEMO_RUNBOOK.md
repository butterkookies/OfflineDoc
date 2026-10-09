# OfflineDoc — 5-Minute Demo Runbook & Pitch Guide

> **Target Audience:** Hackathon Judges & Evaluators (AppBuildersPH 2026)  
> **Presenter:** Brian (Product & Live Demo)  
> **Backup Operators:** Andrei & Christian  
> **Total Allotted Pitch Time:** 5 minutes (plus 2 minutes Q&A)  
> **Core Message:** *"Cloud AI cannot save rural healthcare when there is zero cellular signal. OfflineDoc brings clinical documentation directly to the mountain sitios."*

---

## 1. Pre-Flight Setup (Do 15 Minutes Before Pitch)

- [ ] **Airplane Mode Check:** Turn off Wi-Fi and Bluetooth on the demo laptop. Ensure the browser displays the green **"AIRPLANE MODE · LOCAL AI"** badge.
- [ ] **Launch Server:** Run `powershell scripts/start.ps1`. Verify `http://127.0.0.1:8000` is active.
- [ ] **Display Setup:** In Chrome/Edge DevTools, toggle Device Emulation to **iPhone 14 / Pixel 7 (390px x 844px)** with 100% zoom.
- [ ] **Audio Check:** Test headset mic levels. Ensure browser mic permissions are permanently granted for `127.0.0.1`.
- [ ] **Fallback Tab:** Keep a second tab open with the pre-loaded sample state in case of stage mic failure.

---

## 2. Minute-by-Minute Live Pitch Script

### ⏱️ [0:00 - 1:00] The Hook & The Real-World Problem
**Speaker:**
> *"Magandang araw sa inyong lahat. Meet Maria. Si Maria ay isang Barangay Health Worker sa isang liblib na sitio sa kabundukan.*
>
> *Araw-araw, naglalakad siya ng tatlong kilometro sa ilalim ng init ng araw para bisitahin ang mga buntis, mga bata, at mga lolo't lola na may altapresyon. Pero kapag uwian na sa gabi, hindi pa tapos ang trabaho niya. Gumugugol pa siya ng 3 hanggang 4 na oras para manu-manong kopyahin ang kanyang mga sulat-kamay na notes sa makakapal na papel na logbook at triplicate referral forms.*
>
> *Bakit hindi siya gumamit ng ChatGPT o cloud AI? Dahil sa sitio nila, **zero bars of cellular signal**. Walang internet. Cloud AI is 100% useless in 40% of rural Philippine barangays.*
>
> *Ito ang dahilan kung bakit namin ginawa ang **OfflineDoc**."*

---

### ⏱️ [1:00 - 2:30] The Live Demo (Wi-Fi is Off!)
**Action:**
Show the judges the laptop network icon: **Wi-Fi is disconnected.**
Tap the pulsing blue **Microphone Button** on the Mobile PWA.

**Speaker (Spoken clearly into the mic in Taglish):**
> *"Panoorin ninyo—naka-Airplane Mode po ang laptop. Magsasalita ako bilang si BHW Maria:*
>
> *'Si Tatay Rodrigo, 62 taong gulang taga Sitio Maligaya. Ang BP niya kanina ay 150 over 95, may lagnat din na 38.5. Masakit daw ang batok at nahihilo simula pa kahapon. Binigyan ko muna ng Paracetamol 500mg at pinagpahinga. Sinabihan ko na magpunta sa RHU bukas ng umaga para patingnan sa doktor. Babalikan ko sa Biyernes para i-follow up ang BP niya.'*"

**Action:**
Tap stop.
The screen shows:
1. `Sinusuri ang Boses... (whisper.cpp on-device)` $\rightarrow$ finishes in ~3 seconds.
2. `Kinukuha ang Medikal na Impormasyon... (llama.cpp on-device)` $\rightarrow$ finishes in ~1.5 seconds.
3. The app smoothly transitions to the **Review Screen**.

---

### ⏱️ [2:30 - 3:45] The "Aha!" Moments: Safety & Two-Way Grounding
**Speaker:**
> *"Look at what happened in just 5 seconds, completely on this device:*
>
> 1. **Zero Phonetic Hallucinations:** Dahil sa aming Taglish medical vocabulary priming sa Whisper, naintindihan nito ang halo-halong Filipino at English: 'Tatay Rodrigo', 'Sitio Maligaya', '150 over 95'.
>
> 2. **Two-Way Verbatim Grounding (Tingnan ninyo ito):** Kapag pinindot ko ang kahon ng Blood Pressure (tap BP field in UI), **umiilaw agad ang eksaktong patunay sa transcript!** Kapag pinindot ko ang transcript quote sa itaas, nagfo-focus agad ang kaukulang form field. BHWs don't have to trust a black box—they can verify every single word with one tap.
>
> 3. **Clinical Safety & Zero Hallucinations:** Pansinin ninyo: hindi binanggit ang Pulse Rate o Timbang ni Tatay Rodrigo. Sa halip na manghula ang AI, **nanatili itong walang laman (strict null)**. Walang imbento.
>
> 4. **Automatic Triage Trigger:** Dahil 150/95 ang BP at masakit ang batok, awtomatikong lumabas ang pulang **URGENT RHU Referral Card**."*

---

### ⏱️ [3:45 - 4:30] Official Export Generation
**Action:**
Tap the bottom button: **"✓ Kumpirmahin at I-export"**.
The screen immediately transitions to **Export View**.

**Speaker:**
> *"Pagka-tap ni Maria ng Confirm, tatlong opisyal na dokumento ang nabubuo sa loob ng 100 milliseconds:*
>
> 1. **Patient Visit Summary (PDF):** (Click to open). Kumpletong medikal na talaan para sa Barangay Health Station logbook, gamit ang aming bundled Unicode font—walang sirang letra kahit may 'ñ' o '₱'.
> 2. **Barangay Referral Slip (PDF):** (Click to open). Isang pormal na liham ng paglilipat na may nakatatak na 'URGENT' para sa doktor sa Rural Health Unit, kumpleto sa signature lines para sa BHW at sa receiving doctor.
> 3. **Talaan ng Gawain (Checklist TXT):** (Click to open). Actionable task list para sa follow-up visit sa Biyernes."*

---

### ⏱️ [4:30 - 5:00] Conclusion & Why Local AI Matters
**Speaker:**
> *"Ang kabuuang memory footprint ng OfflineDoc ay **mas mababa sa 1.2 Gigabytes ng RAM**. Ibig sabihin, kaya itong patakbuhin kahit sa mga mumurahing ₱6,000 na Android phone o lumang barangay laptop.*
>
> *Walang bayad sa API. Walang subscription sa cloud. Walang panganib na ma-leak ang medical records ng mga mahihirap nating kababayan sa dayuhang server.*
>
> *Ito ang tunay na kapangyarihan ng Local AI: teknolohiyang hindi lang pang-BGC o Silicon Valley, kundi teknolohiyang abot-kamay hanggang sa pinakadulong sitio ng Pilipinas.*
>
> *Maraming salamat po, at handa na po kami sa inyong mga katanungan."*

---

## 3. Anticipated Judges' Q&A

### Q1: "Bakit hindi na lang gumawa ng native Android APK gamit ang C++ NDK?"
**Answer:**
> *"Sinuri namin yan sa aming technical audit. Ang pagpapatakbo ng sabay na Whisper at Llama C++ runtimes sa loob ng restricted app memory ng budget Android phones ay nagti-trigger ng Android Linux kernel `LowMemoryKiller (SIGKILL)`. Sa pamamagitan ng aming Mobile PWA architecture, ang laptop o primary phone ay maaaring magsilbing isang local offline Wi-Fi hotspot daemon—kaya kahit 5 BHWs na may iba't ibang cellphone ay pwedeng kumonekta nang sabay-sabay nang walang internet."*

### Q2: "Paano ninyo pinipigilan ang AI na mag-imbento ng maling gamot o diagnosis?"
**Answer:**
> *"Mahigpit ang aming safety guardrails (Guardrail 6). Una, ang system prompt at JSON schema grammar ay nagbabawal sa AI na magbigay ng sariling diagnosis. Pangalawa, may rule kami: lahat ng unstated facts ay strictly `null`. Pangatlo, ang aming custom two-way grounding engine ay nagpapatunay na ang bawat extracted field ay may verbatim quote sa transcript bago ito maging 'verified'."*

### Q3: "Bakit Taglish? Hindi ba mas madali kung purong English?"
**Answer:**
> *"Sa totoong buhay sa barangay, walang BHW na nagdidikta ng purong Oxford English. Ang salita nila ay natural code-switching: 'Si Tatay, masakit ang batok, BP 140 over 90.' Kung purong English model ang gagamitin, nagiging phonetic gibberish ang Tagalog. Sa pamamagitan ng Taglish vocabulary priming sa whisper.cpp, napanatili namin ang mataas na accuracy nang hindi lumalaki ang model size."*
