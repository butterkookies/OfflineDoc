import time
from pathlib import Path
from typing import Dict, Any, Optional
from fpdf import FPDF
from fpdf.enums import XPos, YPos

from app.config import BASE_DIR

class BaseHealthPDF(FPDF):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.font_family_name = "Helvetica"
        font_path = BASE_DIR / "web" / "fonts" / "font.ttf"
        if font_path.exists():
            try:
                self.add_font("UnicodeFont", "", str(font_path))
                self.add_font("UnicodeFont", "B", str(font_path))
                self.font_family_name = "UnicodeFont"
            except Exception:
                self.font_family_name = "Helvetica"

    def header(self):
        self.set_font(self.font_family_name, "B", 10)
        self.set_text_color(100, 116, 139)
        self.cell(0, 5, "BARANGAY HEALTH STATION · CLINICAL DOCUMENTATION", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
        self.ln(2)

    def footer(self):
        self.set_y(-18)
        self.set_font(self.font_family_name, "", 8)
        self.set_text_color(148, 163, 184)
        self.cell(0, 4, "OfflineDoc · 100% On-Device AI · Zero Cloud Storage · Confidential Patient Record", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
        self.cell(0, 4, f"Page {self.page_no()}", new_x=XPos.RIGHT, new_y=YPos.TOP, align="C")

def generate_visit_pdf(visit_data: Dict[str, Any], output_path: Path) -> Path:
    """
    Generates official Patient Visit Summary PDF.
    """
    pdf = BaseHealthPDF()
    pdf.add_page()
    font = pdf.font_family_name

    # Document Title
    pdf.set_font(font, "B", 16)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 10, "PATIENT VISIT SUMMARY", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    pdf.set_font(font, "", 10)
    pdf.set_text_color(71, 85, 105)
    pdf.cell(0, 6, "Talaan ng Konsultasyon at Pagbisita sa Tahanan", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    pdf.ln(5)

    # Patient Metadata Card
    pdf.set_fill_color(241, 245, 249)
    pdf.rect(10, pdf.get_y(), 190, 24, "F")
    pdf.set_xy(14, pdf.get_y() + 4)

    patient = visit_data.get("patient_label", "Unknown")
    age = visit_data.get("age_years", "Not stated")
    loc = visit_data.get("location", "Not specified")
    date_str = visit_data.get("saved_at", time.strftime("%Y-%m-%d %H:%M"))

    pdf.set_font(font, "B", 11)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(90, 6, f"Patient: {patient}", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(90, 6, f"Date / Time: {date_str}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_font(font, "", 10)
    pdf.set_text_color(51, 65, 85)
    pdf.set_x(14)
    pdf.cell(90, 6, f"Age: {age}   |   Sex: {visit_data.get('sex') or 'Not stated'}", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(90, 6, f"Barangay / Sitio: {loc}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(8)

    # Section 1: Chief Complaint & Symptoms
    pdf.set_font(font, "B", 12)
    pdf.set_text_color(14, 116, 144)
    pdf.cell(0, 7, "1. CHIEF COMPLAINT & SYMPTOMS (Mga Nararamdaman)", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)

    pdf.set_font(font, "B", 10)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(45, 6, "Chief Complaint:", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_font(font, "", 10)
    pdf.multi_cell(0, 6, str(visit_data.get("chief_complaint") or "None noted"))

    symptoms = visit_data.get("symptoms", [])
    pdf.set_font(font, "B", 10)
    pdf.cell(45, 6, "Reported Symptoms:", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_font(font, "", 10)
    pdf.cell(0, 6, ", ".join(symptoms) if symptoms else "None stated", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(4)

    # Section 2: Vital Signs
    pdf.set_font(font, "B", 12)
    pdf.set_text_color(14, 116, 144)
    pdf.cell(0, 7, "2. VITAL SIGNS (Mahahalagang Palatandaan)", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)

    vitals = visit_data.get("vitals", {})
    bp_val = vitals.get("bp") or "--"
    temp_val = f"{vitals.get('temp_c')} °C" if vitals.get("temp_c") else "--"
    pulse_val = f"{vitals.get('pulse_bpm')} bpm" if vitals.get("pulse_bpm") else "--"
    resp_val = f"{vitals.get('resp_rate')} /min" if vitals.get("resp_rate") else "--"

    # Vitals Grid
    pdf.set_fill_color(248, 250, 252)
    pdf.set_font(font, "B", 10)
    pdf.cell(47, 8, f"BP: {bp_val}", border=1, new_x=XPos.RIGHT, new_y=YPos.TOP, align="C", fill=True)
    pdf.cell(47, 8, f"Temp: {temp_val}", border=1, new_x=XPos.RIGHT, new_y=YPos.TOP, align="C", fill=True)
    pdf.cell(47, 8, f"Pulse: {pulse_val}", border=1, new_x=XPos.RIGHT, new_y=YPos.TOP, align="C", fill=True)
    pdf.cell(47, 8, f"Resp: {resp_val}", border=1, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C", fill=True)
    pdf.ln(4)

    # Section 3: Management & Guidance
    pdf.set_font(font, "B", 12)
    pdf.set_text_color(14, 116, 144)
    pdf.cell(0, 7, "3. MANAGEMENT & ADVICE (Gamot at Payo)", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)

    meds = visit_data.get("medications_given", [])
    pdf.set_font(font, "B", 10)
    pdf.cell(45, 6, "Medications Verified:", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_font(font, "", 10)
    pdf.cell(0, 6, ", ".join(meds) if meds else "None", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    advice = visit_data.get("advice_given", [])
    pdf.set_font(font, "B", 10)
    pdf.cell(45, 6, "Advice Given:", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_font(font, "", 10)
    pdf.multi_cell(0, 6, "; ".join(advice) if advice else "Rest and hydration")
    pdf.ln(4)

    # Section 4: Follow-up & Referral
    pdf.set_font(font, "B", 12)
    pdf.set_text_color(14, 116, 144)
    pdf.cell(0, 7, "4. FOLLOW-UP PLAN (Plano ng Pagbalik)", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)

    follow_up = visit_data.get("follow_up", [])
    for fu in follow_up:
        pdf.set_font(font, "", 10)
        pdf.cell(0, 6, f"• {fu.get('task')} (Target: {fu.get('due')})", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    referral = visit_data.get("referral")
    if referral:
        pdf.set_font(font, "B", 10)
        pdf.set_text_color(220, 38, 38)
        pdf.cell(0, 6, f"REFERRAL ISSUED: {referral.get('facility')} (Reason: {referral.get('reason')})", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.set_text_color(15, 23, 42)

    # Signature Block
    pdf.ln(12)
    pdf.set_font(font, "", 9)
    pdf.cell(100, 5, "Attested and verified by Barangay Health Worker:", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(90, 5, "Patient / Representative Signature:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(8)
    pdf.set_font(font, "B", 9)
    pdf.cell(100, 5, "___________________________________", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(90, 5, "___________________________________", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(output_path))
    return output_path

def generate_referral_pdf(visit_data: Dict[str, Any], output_path: Path) -> Optional[Path]:
    """
    Generates official Barangay Health Station Referral Slip (Liham ng Paglilipat sa RHU).
    Returns None if no referral is indicated.
    """
    referral = visit_data.get("referral")
    if not referral:
        return None

    pdf = BaseHealthPDF()
    pdf.add_page()
    font = pdf.font_family_name

    # Header / Title
    pdf.set_font(font, "B", 16)
    pdf.set_text_color(185, 28, 28)
    pdf.cell(0, 10, "BARANGAY HEALTH STATION REFERRAL SLIP", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    pdf.set_font(font, "", 10)
    pdf.set_text_color(71, 85, 105)
    pdf.cell(0, 6, "Liham ng Paglilipat sa Rural Health Unit (RHU) / Ospital", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    pdf.ln(4)

    # Urgency Badge
    urgency = str(referral.get("urgency") or "routine").upper()
    pdf.set_fill_color(254, 242, 242) if urgency in ["URGENT", "IMMEDIATE"] else pdf.set_fill_color(240, 253, 244)
    pdf.rect(10, pdf.get_y(), 190, 10, "F")
    pdf.set_xy(14, pdf.get_y() + 2)
    pdf.set_font(font, "B", 11)
    pdf.set_text_color(185, 28, 28) if urgency in ["URGENT", "IMMEDIATE"] else pdf.set_text_color(22, 101, 52)
    pdf.cell(0, 6, f"TRIAGE STATUS: {urgency} REFERRAL", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    pdf.ln(6)

    # Referral Routing
    pdf.set_font(font, "B", 10)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(45, 6, "TO (Patunguhan):", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_font(font, "", 10)
    pdf.cell(0, 6, str(referral.get("facility") or "Rural Health Unit Doctor"), new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_font(font, "B", 10)
    pdf.cell(45, 6, "FROM (Pinagmulan):", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_font(font, "", 10)
    pdf.cell(0, 6, f"Barangay Health Station ({visit_data.get('location') or 'Local Station'})", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(4)

    # Patient Details Box
    pdf.set_fill_color(248, 250, 252)
    pdf.rect(10, pdf.get_y(), 190, 22, "F")
    pdf.set_xy(14, pdf.get_y() + 3)

    patient = visit_data.get("patient_label", "Patient")
    age = visit_data.get("age_years", "Not stated")
    pdf.set_font(font, "B", 11)
    pdf.cell(90, 6, f"Patient Name: {patient}", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(90, 6, f"Date: {time.strftime('%Y-%m-%d')}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_font(font, "", 10)
    pdf.set_x(14)
    pdf.cell(90, 6, f"Age: {age}   |   Sex: {visit_data.get('sex') or 'Not stated'}", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(90, 6, f"Location: {visit_data.get('location') or 'Not stated'}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(8)

    # Clinical Reason for Referral
    pdf.set_font(font, "B", 11)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 6, "REASON FOR REFERRAL (Dahilan ng Paglipat):", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font(font, "", 10)
    pdf.multi_cell(0, 6, str(referral.get("reason") or visit_data.get("chief_complaint") or "Medical evaluation required"))
    pdf.ln(4)

    # Recorded Vitals
    vitals = visit_data.get("vitals", {})
    pdf.set_font(font, "B", 11)
    pdf.cell(0, 6, "PERTINENT VITAL SIGNS MEASURED IN FIELD:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font(font, "", 10)
    vitals_text = f"BP: {vitals.get('bp') or 'Not taken'}   |   Temp: {vitals.get('temp_c') or '--'} °C   |   Pulse: {vitals.get('pulse_bpm') or '--'} bpm"
    pdf.cell(0, 6, vitals_text, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(4)

    # Initial Aid Given
    pdf.set_font(font, "B", 11)
    pdf.cell(0, 6, "INITIAL ACTION / CARE GIVEN BY BHW:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font(font, "", 10)
    meds = visit_data.get("medications_given", [])
    advice = visit_data.get("advice_given", [])
    action_text = f"Medications: {', '.join(meds) if meds else 'None'}. Advice: {'; '.join(advice) if advice else 'Rest'}"
    pdf.multi_cell(0, 6, action_text)
    pdf.ln(8)

    # Signatures
    pdf.set_font(font, "", 9)
    pdf.cell(95, 5, "Referring BHW Signature:", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(95, 5, "Receiving RHU Personnel Signature:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(8)
    pdf.set_font(font, "B", 9)
    pdf.cell(95, 5, "___________________________________", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(95, 5, "___________________________________", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(output_path))
    return output_path
