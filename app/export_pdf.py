import io
import time
import base64
from pathlib import Path
from typing import Dict, Any, Optional
from fpdf import FPDF
from fpdf.enums import XPos, YPos
from PIL import Image

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
                self.add_font("UnicodeFont", "I", str(font_path))
                self.add_font("UnicodeFont", "BI", str(font_path))
                self.font_family_name = "UnicodeFont"
            except Exception:
                self.font_family_name = "Helvetica"

    def header(self):
        self.set_font(self.font_family_name, "B", 9)
        self.set_text_color(100, 116, 139)
        self.cell(0, 4, "REPUBLIC OF THE PHILIPPINES · DEPARTMENT OF HEALTH · BARANGAY HEALTH STATION", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
        self.set_font(self.font_family_name, "", 8)
        self.cell(0, 4, "Primary Care Point-of-Care Encounter & Triage Referral Record (DOH Form 1 / Konsulta Aligned)", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
        self.ln(2)

    def footer(self):
        self.set_y(-16)
        self.set_font(self.font_family_name, "", 8)
        self.set_text_color(148, 163, 184)
        self.cell(0, 4, "OfflineDoc · 100% On-Device AI · Zero Cloud Storage · Confidential Patient Medical Document", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
        self.cell(0, 4, f"Pahina {self.page_no()}", new_x=XPos.RIGHT, new_y=YPos.TOP, align="C")

def compute_triage_alerts(visit_data: Dict[str, Any]) -> tuple[str, list[str]]:
    """
    Computes clinical triage level and explicit alert list based on vitals and referral.
    Returns (triage_level, alerts_list).
    """
    alerts = []
    level = visit_data.get("triage_level") or "routine"
    vitals = visit_data.get("vitals") or {}

    bp = str(vitals.get("bp") or "").strip()
    if "/" in bp:
        try:
            sys, dia = map(int, bp.split("/"))
            if sys >= 180 or dia >= 120:
                alerts.append(f"KRITIKAL NA BP ({bp}): Hypertensive Urgency/Crisis")
                level = "urgent"
            elif sys >= 140 or dia >= 90:
                alerts.append(f"MATAAS NA BP ({bp}): Stage 1/2 Hypertension")
                if level != "urgent":
                    level = "urgent" if visit_data.get("referral") else "monitor"
            elif sys >= 130 or dia >= 85:
                alerts.append(f"ELEVATED BP ({bp}): Bantayan")
                if level == "routine":
                    level = "monitor"
        except Exception:
            pass

    temp_c = vitals.get("temp_c")
    if temp_c is not None:
        try:
            t = float(temp_c)
            if t >= 39.0:
                alerts.append(f"MATAAS NA LAGNAT ({t}°C): High-grade fever")
                level = "urgent"
            elif t >= 38.0:
                alerts.append(f"MAY LAGNAT ({t}°C): Moderate fever")
                if level == "routine":
                    level = "monitor"
        except Exception:
            pass

    referral = visit_data.get("referral")
    if referral:
        urg = str(referral.get("urgency") or "").lower()
        if urg in ["urgent", "immediate"]:
            alerts.append(f"KAGYAT NA REFERRAL SA RHU: {referral.get('reason') or 'Clinical evaluation'}")
            level = "urgent"
        else:
            alerts.append(f"ROUTINE REFERRAL SA RHU: {referral.get('reason') or 'Consultation'}")
            if level == "routine":
                level = "monitor"

    if not alerts:
        alerts.append("Normal / Walang nakitang agarang panganib sa vital signs")

    return level.lower(), alerts

def generate_unified_report_pdf(visit_data: Dict[str, Any], output_path: Path) -> Path:
    """
    Generates unified Patient Clinical Summary & Referral Slip PDF.
    Combines primary encounter facts, triage status alerts, optional clinical photo,
    and official referral slip into a single DOH-compliant document.
    """
    pdf = BaseHealthPDF()
    pdf.add_page()
    font = pdf.font_family_name

    # Document Header Title
    pdf.set_font(font, "B", 15)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 7, "PATIENT CLINICAL SUMMARY & REFERRAL RECORD", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    pdf.set_font(font, "", 9)
    pdf.set_text_color(71, 85, 105)
    pdf.cell(0, 5, "Opisyal na Buod ng Konsultasyon at Liham ng Paglilipat sa RHU", new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C")
    pdf.ln(2)

    # Calculate Triage Level & Alerts
    triage_level, alerts = compute_triage_alerts(visit_data)

    # Top Triage Status Banner
    if triage_level == "urgent":
        banner_bg = (254, 226, 226)  # light red
        banner_border = (220, 38, 38) # red
        banner_text = (185, 28, 28)
        status_tag = "[ ! ] KAGYAT NA AKSYON / URGENT REFERRAL"
    elif triage_level == "monitor":
        banner_bg = (254, 243, 199)  # light amber
        banner_border = (217, 119, 6) # amber
        banner_text = (180, 83, 9)
        status_tag = "[ * ] BANTAYAN / MONITOR & SCHEDULE FOLLOW-UP"
    else:
        banner_bg = (240, 253, 244)  # light green
        banner_border = (22, 163, 74) # green
        banner_text = (21, 128, 61)
        status_tag = "[ v ] MAAYOS / ROUTINE & STABLE"

    pdf.set_fill_color(*banner_bg)
    pdf.set_draw_color(*banner_border)
    pdf.set_line_width(0.4)
    start_y = pdf.get_y()
    pdf.rect(10, start_y, 190, 14, "FD")
    pdf.set_xy(14, start_y + 2)
    pdf.set_font(font, "B", 10)
    pdf.set_text_color(*banner_text)
    pdf.cell(0, 5, f"TRIAGE STATUS: {status_tag}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font(font, "", 8)
    pdf.set_x(14)
    pdf.cell(0, 4, f"Alerto: {'; '.join(alerts)}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(5)

    # Patient Metadata Card
    pdf.set_fill_color(248, 250, 252)
    pdf.set_draw_color(203, 213, 225)
    pdf.rect(10, pdf.get_y(), 190, 20, "FD")
    pdf.set_xy(14, pdf.get_y() + 2)

    patient = visit_data.get("patient_label", "Unknown Patient")
    age = visit_data.get("age_years", "Not stated")
    loc = visit_data.get("location", "Not specified")
    date_str = visit_data.get("saved_at", time.strftime("%Y-%m-%d %H:%M"))

    pdf.set_font(font, "B", 10)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(90, 5, f"Pangalan (Patient): {patient}", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(90, 5, f"Petsa at Oras: {date_str}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    pdf.set_font(font, "", 9)
    pdf.set_text_color(51, 65, 85)
    pdf.set_x(14)
    pdf.cell(90, 5, f"Edad: {age} taong gulang   |   Kasarian: {visit_data.get('sex') or 'Hindi nabanggit'}", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.cell(90, 5, f"Barangay / Sitio: {loc}", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(6)

    # Section 1: Chief Complaint & Symptoms
    pdf.set_font(font, "B", 11)
    pdf.set_text_color(14, 116, 144)
    pdf.cell(0, 6, "1. CHIEF COMPLAINT & SYMPTOMS (Mga Nararamdaman)", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_draw_color(14, 116, 144)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(2)

    pdf.set_font(font, "B", 9)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(45, 5, "Pangunahing Reklamo:", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_font(font, "", 9)
    pdf.multi_cell(145, 5, str(visit_data.get("chief_complaint") or "None noted"))

    symptoms = visit_data.get("symptoms", [])
    pdf.set_font(font, "B", 9)
    pdf.cell(45, 5, "Mga Sintomas:", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_font(font, "", 9)
    pdf.cell(0, 5, ", ".join(symptoms) if symptoms else "None stated", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(3)

    # Section 2: Vital Signs
    pdf.set_font(font, "B", 11)
    pdf.set_text_color(14, 116, 144)
    pdf.cell(0, 6, "2. VITAL SIGNS (Mahahalagang Palatandaan sa Field)", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(2)

    vitals = visit_data.get("vitals", {})
    bp_val = str(vitals.get("bp") or "--")
    temp_val = f"{vitals.get('temp_c')} °C" if vitals.get("temp_c") else "--"
    pulse_val = f"{vitals.get('pulse_bpm')} bpm" if vitals.get("pulse_bpm") else "--"
    resp_val = f"{vitals.get('resp_rate')} /min" if vitals.get("resp_rate") else "--"

    # Vitals Grid
    pdf.set_fill_color(248, 250, 252)
    pdf.set_draw_color(203, 213, 225)
    pdf.set_font(font, "B", 9)
    pdf.cell(47, 7, f"BP: {bp_val}", border=1, new_x=XPos.RIGHT, new_y=YPos.TOP, align="C", fill=True)
    pdf.cell(47, 7, f"Temp: {temp_val}", border=1, new_x=XPos.RIGHT, new_y=YPos.TOP, align="C", fill=True)
    pdf.cell(47, 7, f"Pulse: {pulse_val}", border=1, new_x=XPos.RIGHT, new_y=YPos.TOP, align="C", fill=True)
    pdf.cell(47, 7, f"Resp: {resp_val}", border=1, new_x=XPos.LMARGIN, new_y=YPos.NEXT, align="C", fill=True)
    pdf.ln(3)

    # Section 3: Management & Advice Given
    pdf.set_font(font, "B", 11)
    pdf.set_text_color(14, 116, 144)
    pdf.cell(0, 6, "3. MANAGEMENT & ADVICE (Gamot at Tagubilin ng BHW)", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(2)

    meds = visit_data.get("medications_given", [])
    pdf.set_font(font, "B", 9)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(45, 5, "Gamot na Naibigay:", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_font(font, "", 9)
    pdf.cell(0, 5, ", ".join(meds) if meds else "Wala", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    advice = visit_data.get("advice_given", [])
    pdf.set_font(font, "B", 9)
    pdf.cell(45, 5, "Payo at Tagubilin:", new_x=XPos.RIGHT, new_y=YPos.TOP)
    pdf.set_font(font, "", 9)
    pdf.multi_cell(145, 5, "; ".join(advice) if advice else "Magpahinga at uminom ng tubig")

    follow_up = visit_data.get("follow_up", [])
    if follow_up:
        pdf.set_font(font, "B", 9)
        pdf.cell(45, 5, "Plano ng Pagbalik:", new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.set_font(font, "", 9)
        fu_text = "; ".join([f"{f.get('task')} ({f.get('due')})" for f in follow_up])
        pdf.multi_cell(145, 5, fu_text)
    pdf.ln(3)

    # Section 4: Clinical Photo Attachment (if present)
    image_att = visit_data.get("image_attachment")
    if image_att:
        pdf.set_font(font, "B", 11)
        pdf.set_text_color(14, 116, 144)
        pdf.cell(0, 6, "4. CLINICAL PHOTO ATTACHMENT (Litrato ng Pasyente / Kondisyon)", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.line(10, pdf.get_y(), 200, pdf.get_y())
        pdf.ln(2)

        try:
            # Decode base64 or open file path
            img_bytes = None
            if image_att.startswith("data:image"):
                base64_data = image_att.split(",", 1)[1]
                img_bytes = base64.b64decode(base64_data)
            elif Path(image_att).exists():
                with open(image_att, "rb") as f:
                    img_bytes = f.read()

            if img_bytes:
                pil_img = Image.open(io.BytesIO(img_bytes))
                # Convert RGBA to RGB for JPEG compatibility
                if pil_img.mode in ("RGBA", "P"):
                    pil_img = pil_img.convert("RGB")
                
                # Temp image in memory buffer
                buf = io.BytesIO()
                pil_img.save(buf, format="JPEG", quality=85)
                buf.seek(0)

                img_y = pdf.get_y()
                # Embed image with fixed max height 36mm
                pdf.image(buf, x=14, y=img_y, h=36)
                
                caption = visit_data.get("image_caption") or "Clinical photo captured by BHW during point-of-care visit"
                pdf.set_xy(65, img_y + 4)
                pdf.set_font(font, "B", 9)
                pdf.set_text_color(15, 23, 42)
                pdf.cell(0, 5, "Paglalarawan ng Litrato (Caption):", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
                pdf.set_x(65)
                pdf.set_font(font, "", 8)
                pdf.multi_cell(125, 4, str(caption))
                pdf.set_x(65)
                pdf.set_font(font, "", 8)
                pdf.set_text_color(100, 116, 139)
                pdf.cell(0, 4, "Kuha sa pamamagitan ng OfflineDoc PWA Camera / Gallery", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
                pdf.set_y(img_y + 38)
        except Exception as img_err:
            pdf.set_font(font, "", 8)
            pdf.set_text_color(220, 38, 38)
            pdf.cell(0, 5, f"(Hindi maipakita ang litrato: {str(img_err)})", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            pdf.ln(2)

    # Section 5: Integrated Barangay Referral Slip & Attestation
    pdf.set_font(font, "B", 11)
    pdf.set_text_color(185, 28, 28) if visit_data.get("referral") else pdf.set_text_color(14, 116, 144)
    pdf.cell(0, 6, "5. BARANGAY REFERRAL SLIP & ATTESTATION (Liham ng Paglilipat sa RHU)", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(2)

    referral = visit_data.get("referral")
    if referral:
        # Referral Card Box
        pdf.set_fill_color(254, 242, 242)
        pdf.set_draw_color(248, 113, 113)
        pdf.rect(10, pdf.get_y(), 190, 24, "FD")
        pdf.set_xy(14, pdf.get_y() + 2)

        pdf.set_font(font, "B", 9)
        pdf.set_text_color(153, 27, 27)
        pdf.cell(45, 5, "PATUNGUHAN (To Facility):", new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.set_font(font, "B", 9)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(0, 5, str(referral.get("facility") or "Rural Health Unit (RHU) Doctor"), new_x=XPos.LMARGIN, new_y=YPos.NEXT)

        pdf.set_x(14)
        pdf.set_font(font, "B", 9)
        pdf.set_text_color(153, 27, 27)
        pdf.cell(45, 5, "DAHILAN NG PAGLIPAT:", new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.set_font(font, "", 9)
        pdf.set_text_color(15, 23, 42)
        pdf.multi_cell(135, 5, str(referral.get("reason") or visit_data.get("chief_complaint") or "Medical evaluation and management"))

        pdf.set_x(14)
        pdf.set_font(font, "B", 9)
        pdf.set_text_color(153, 27, 27)
        pdf.cell(45, 5, "URGENCY LEVEL:", new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.set_font(font, "B", 9)
        urg_txt = str(referral.get("urgency") or "ROUTINE").upper()
        pdf.set_text_color(185, 28, 28) if urg_txt == "URGENT" else pdf.set_text_color(22, 101, 52)
        pdf.cell(0, 5, f"{urg_txt} REFERRAL", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(5)

        # Dual Signatures for Referral
        pdf.set_font(font, "", 8)
        pdf.set_text_color(71, 85, 105)
        pdf.cell(95, 4, "Lumagda (Referring BHW):", new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(95, 4, "Tumatanggap (Receiving RHU Personnel / MD):", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(6)
        pdf.set_font(font, "B", 9)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(95, 4, "___________________________________", new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(95, 4, "___________________________________", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    else:
        pdf.set_font(font, "", 9)
        pdf.set_text_color(71, 85, 105)
        pdf.cell(0, 5, "Walang kagyat na referral na kinakailangan sa kasalukuyang pagsusuri. Nananatiling aktibo ang home follow-up schedule.", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(4)

        # Single Attestation Signature
        pdf.set_font(font, "", 8)
        pdf.cell(95, 4, "Pinatotohanan ng Barangay Health Worker (BHW):", new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(95, 4, "Lagda ng Pasyente / Kinatawan:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(6)
        pdf.set_font(font, "B", 9)
        pdf.set_text_color(15, 23, 42)
        pdf.cell(95, 4, "___________________________________", new_x=XPos.RIGHT, new_y=YPos.TOP)
        pdf.cell(95, 4, "___________________________________", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(str(output_path))
    return output_path

# Backward-compatible helper aliases
def generate_visit_pdf(visit_data: Dict[str, Any], output_path: Path) -> Path:
    return generate_unified_report_pdf(visit_data, output_path)

def generate_referral_pdf(visit_data: Dict[str, Any], output_path: Path) -> Optional[Path]:
    if not visit_data.get("referral"):
        return None
    return generate_unified_report_pdf(visit_data, output_path)

