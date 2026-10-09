import os, sys, math, time, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import imageio_ffmpeg

WIDTH, HEIGHT = 1920, 1080
FPS = 30
TOTAL_DURATION = 53.63
TOTAL_FRAMES = int(TOTAL_DURATION * FPS) # 1608 frames

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()

# Font setup
FONT_BOLD_PATH = 'C:/Windows/Fonts/segoeuib.ttf'
FONT_REG_PATH = 'C:/Windows/Fonts/segoeui.ttf'

font_kicker = ImageFont.truetype(FONT_BOLD_PATH, 17)
font_title = ImageFont.truetype(FONT_BOLD_PATH, 48)
font_title_lg = ImageFont.truetype(FONT_BOLD_PATH, 58)
font_subtitle = ImageFont.truetype(FONT_REG_PATH, 22)
font_card_head = ImageFont.truetype(FONT_BOLD_PATH, 20)
font_card_sub = ImageFont.truetype(FONT_REG_PATH, 16)
font_body = ImageFont.truetype(FONT_REG_PATH, 16)
font_body_bold = ImageFont.truetype(FONT_BOLD_PATH, 16)
font_badge = ImageFont.truetype(FONT_BOLD_PATH, 14)
font_stat = ImageFont.truetype(FONT_BOLD_PATH, 38)
font_stat_lbl = ImageFont.truetype(FONT_REG_PATH, 15)

# Load visual assets
img_logo_full = Image.open('OfflineDoc-new-logo.png').convert('RGBA')
img_logo_icon = Image.open('scratch/logo_icon_clean.png').convert('RGBA')
img_logo_text = Image.open('scratch/logo_text_clean.png').convert('RGBA')
img_dashboard = Image.open('scratch/screens/01_desktop_dashboard.png').convert('RGBA')
img_mobile = Image.open('scratch/screens/02_mobile_home.png').convert('RGBA')
img_step1 = Image.open('scratch/screens/03_step1_record.png').convert('RGBA')
img_step2 = Image.open('scratch/screens/04_step2_review_gaps.png').convert('RGBA')
img_red_flag = Image.open('scratch/screens/05_step2_red_flag_alert.png').convert('RGBA')
img_step3 = Image.open('scratch/screens/06_step3_success_export.png').convert('RGBA')
img_pdf = Image.open('scratch/maria_santos_itr_full.png').convert('RGBA')

# Pre-render background with dots
bg_base = Image.new('RGB', (WIDTH, HEIGHT), (248, 250, 252))
draw_bg = ImageDraw.Draw(bg_base)
for x in range(30, WIDTH, 50):
    for y in range(30, HEIGHT, 50):
        draw_bg.ellipse([x, y, x+2, y+2], fill=(226, 232, 240))

# Colors
C_BG_CARD = (255, 255, 255)
C_BORDER = (226, 232, 240)
C_TEXT_MAIN = (15, 23, 42)
C_TEXT_MUTED = (71, 85, 105)
C_PRIMARY = (0, 102, 255)
C_PRIMARY_LIGHT = (239, 246, 255)
C_DANGER = (220, 38, 38)
C_DANGER_BG = (254, 242, 242)
C_SUCCESS = (22, 163, 74)
C_SUCCESS_BG = (240, 253, 244)
C_AMBER = (217, 119, 6)
C_AMBER_BG = (254, 243, 199)

def ease_out_cubic(t):
    return 1 - (1 - t) ** 3

def ease_in_out(t):
    return 3 * t**2 - 2 * t**3

def clamp(val, low=0.0, high=1.0):
    return max(low, min(high, val))

def draw_header(draw, kicker, title, subtitle):
    # Kicker pill
    kw = int(draw.textlength(kicker, font=font_kicker))
    draw.rounded_rectangle([90, 48, 90 + kw + 24, 78], radius=15, fill=C_PRIMARY_LIGHT, outline=(191, 219, 254), width=1)
    draw.text((102, 53), kicker, font=font_kicker, fill=C_PRIMARY)
    
    # Title
    draw.text((90, 88), title, font=font_title, fill=C_TEXT_MAIN)
    # Subtitle
    draw.text((90, 150), subtitle, font=font_subtitle, fill=C_TEXT_MUTED)

def draw_card(draw, box, fill=C_BG_CARD, outline=C_BORDER, radius=14, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)

def draw_shadow(img, box, radius=14, offset=8, blur=12, alpha=35):
    x1, y1, x2, y2 = box
    s_w = (x2 - x1) + blur * 4
    s_h = (y2 - y1) + blur * 4
    mask = Image.new('L', (s_w, s_h), 0)
    d = ImageDraw.Draw(mask)
    pad = blur * 2
    d.rounded_rectangle([pad, pad + offset, pad + (x2 - x1), pad + offset + (y2 - y1)], radius=radius, fill=alpha)
    mask = mask.filter(ImageFilter.GaussianBlur(blur))
    shadow_img = Image.new('RGBA', (s_w, s_h), (15, 23, 42, 0))
    shadow_img.putalpha(mask)
    img.paste(shadow_img, (x1 - pad, y1 - pad), shadow_img)

def render_scene_1(t, frame_idx):
    # 0.00s to 4.10s: "For health workers, documenting every patient visit takes time."
    img = bg_base.copy()
    draw = ImageDraw.Draw(img)
    
    draw_header(
        draw,
        "• THE FRONTLINE REALITY • BARANGAY HEALTH WORKERS",
        "DOCUMENTING EVERY VISIT TAKES TIME.",
        "Under RA 7883, BHWs spend 3 to 4 hours every evening manually writing paper logs."
    )
    
    progress = clamp(t / 4.10)
    
    # Left Card: Stacking Paper Records
    card_l = [90, 220, 1020, 940]
    draw_shadow(img, card_l)
    draw_card(draw, card_l)
    
    draw.text((130, 255), "MANUAL DOH TARGET CLIENT LIST (TCL) LOGBOOKS", font=font_card_head, fill=C_PRIMARY)
    draw.text((130, 290), "Community home visits yield piles of handwritten encounter sheets.", font=font_body, fill=C_TEXT_MUTED)
    
    # 3 Stacking Paper Forms
    forms = [
        ("FORM 01: MATERNAL CARE TCL LOG", "Maria Santos • 28yo • Purok 2 • Prenatal Visit 3 • BP 120/80", -2),
        ("FORM 02: HYPERTENSION MONITORING LOG", "Teresa Ramos • 54yo • Purok 4 • BP 150/95 • Headache noted", 3),
        ("FORM 03: CHILD IMMUNIZATION (EPI) REGISTER", "Baby Joshua Bautista • 9mo • Purok 3 • Pentavalent 3 & Vit A", -1)
    ]
    
    for i, (f_title, f_sub, rot) in enumerate(forms):
        appear_t = clamp((progress - i * 0.2) / 0.3)
        if appear_t > 0:
            fy = int(350 + i * 140 - (1 - appear_t) * 40)
            f_box = [130, fy, 980, fy + 115]
            draw.rounded_rectangle(f_box, radius=10, fill=(248, 250, 252), outline=(203, 213, 225), width=1)
            # Medical folder tab
            draw.rounded_rectangle([150, fy + 14, 280, fy + 38], radius=6, fill=C_PRIMARY_LIGHT)
            draw.text((160, fy + 18), f"DOH FORM 0{i+1}", font=font_badge, fill=C_PRIMARY)
            draw.text((295, fy + 17), f_title, font=font_body_bold, fill=C_TEXT_MAIN)
            draw.text((150, fy + 55), f_sub, font=font_body, fill=C_TEXT_MUTED)
            # Status badge
            draw.rounded_rectangle([820, fy + 18, 960, fy + 44], radius=6, fill=C_AMBER_BG)
            draw.text((832, fy + 22), "MANUAL PENDING", font=font_badge, fill=C_AMBER)
            # Ruled lines
            draw.line([150, fy + 88, 960, fy + 88], fill=(226, 232, 240), width=1)
    
    # Right Side: Clock & Overtime Meter
    card_r = [1060, 220, 1830, 940]
    draw_shadow(img, card_r)
    draw_card(draw, card_r)
    
    # Clock graphic
    cx, cy = 1445, 420
    draw.ellipse([cx - 130, cy - 130, cx + 130, cy + 130], fill=(248, 250, 252), outline=C_BORDER, width=4)
    # Hour markers
    for hr in range(12):
        ang = hr * (math.pi / 6)
        x_m = cx + math.sin(ang) * 110
        y_m = cy - math.cos(ang) * 110
        draw.ellipse([x_m-3, y_m-3, x_m+3, y_m+3], fill=C_TEXT_MUTED)
    
    # Animated clock hands spinning fast
    minute_angle = progress * math.pi * 12
    hour_angle = progress * math.pi * 2
    
    mx = cx + math.sin(minute_angle) * 85
    my = cy - math.cos(minute_angle) * 85
    draw.line([cx, cy, mx, my], fill=C_PRIMARY, width=5)
    
    hx = cx + math.sin(hour_angle) * 55
    hy = cy - math.cos(hour_angle) * 55
    draw.line([cx, cy, hx, hy], fill=C_TEXT_MAIN, width=7)
    draw.ellipse([cx-10, cy-10, cx+10, cy+10], fill=C_PRIMARY)
    
    draw.text((cx - 100, cy + 155), "TIME KEEPS MOVING", font=font_badge, fill=C_TEXT_MUTED)
    
    # Overtime hours stat
    hours_acc = min(3.8, progress * 4.2)
    draw.rounded_rectangle([1120, 640, 1770, 780], radius=12, fill=C_DANGER_BG, outline=(254, 202, 202), width=1)
    draw.text((1150, 660), f"{hours_acc:.1f} Hours / Evening", font=font_stat, fill=C_DANGER)
    draw.text((1150, 715), "Wasted on manual transcription and paper double-documentation.", font=font_body, fill=C_DANGER)
    
    # Statutory citation
    draw.rounded_rectangle([1120, 810, 1770, 900], radius=10, fill=C_PRIMARY_LIGHT, outline=(191, 219, 254), width=1)
    draw.text((1150, 825), "LEGAL CONTEXT (REPUBLIC ACT 7883):", font=font_badge, fill=C_PRIMARY)
    draw.text((1150, 852), "BHWs are frontline volunteers mandated to monitor community primary care.", font=font_body, fill=C_TEXT_MUTED)

    return img

def render_scene_2(t, frame_idx):
    # 4.10s to 8.05s: "And when there's no internet, cloud-based tools may not be an option."
    img = bg_base.copy()
    draw = ImageDraw.Draw(img)
    
    draw_header(
        draw,
        "• THE CONNECTIVITY & PRIVACY BARRIER • ZERO CELLULAR COVERAGE",
        "NO INTERNET IN RURAL HEALTH STATIONS.",
        "Cloud AI fails with zero signal — and uploading patient health records violates RA 10173 data privacy."
    )
    
    progress = clamp((t - 4.10) / (8.05 - 4.10))
    
    # Left Card: Disconnected Cloud Graphic
    card_l = [90, 220, 960, 940]
    draw_shadow(img, card_l)
    draw_card(draw, card_l)
    
    draw.text((130, 255), "RURAL BARANGAY SIGNAL REALITY", font=font_card_head, fill=C_DANGER)
    draw.text((130, 290), "Sitios and island health stations lack cellular infrastructure.", font=font_body, fill=C_TEXT_MUTED)
    
    # Disconnected Cloud Illustration
    ccx, ccy = 525, 480
    pulse = math.sin(progress * 10) * 8
    draw.ellipse([ccx - 170 - pulse, ccy - 120 - pulse, ccx + 170 + pulse, ccy + 120 + pulse], fill=(254, 226, 226, 100), outline=(252, 165, 165), width=2)
    
    # Cloud body in center
    draw.ellipse([ccx - 90, ccy - 50, ccx + 10, ccy + 50], fill=(226, 232, 240))
    draw.ellipse([ccx - 40, ccy - 90, ccx + 70, ccy + 20], fill=(226, 232, 240))
    draw.ellipse([ccx + 20, ccy - 50, ccx + 110, ccy + 50], fill=(226, 232, 240))
    draw.rounded_rectangle([ccx - 80, ccy, ccx + 100, ccy + 50], radius=10, fill=(226, 232, 240))
    
    # Red Slash through cloud
    draw.line([ccx - 110, ccy + 70, ccx + 120, ccy - 80], fill=C_DANGER, width=8)
    
    # Signal Bar Graphic (0 Bars)
    draw.rounded_rectangle([200, 660, 850, 750], radius=12, fill=C_DANGER_BG, outline=(248, 113, 113), width=2)
    draw.text((230, 680), "CELLULAR SIGNAL: ✕ NO SERVICE (0 BARS)", font=font_card_head, fill=C_DANGER)
    draw.text((230, 712), "Cloud speech APIs & LLMs timeout immediately.", font=font_body, fill=C_DANGER)
    
    # Privacy warning box
    draw.rounded_rectangle([200, 780, 850, 890], radius=12, fill=(255, 251, 235), outline=(252, 211, 77), width=1)
    draw.text((230, 798), "STATUTORY COMPLIANCE: DATA PRIVACY ACT (RA 10173)", font=font_badge, fill=C_AMBER)
    draw.text((230, 825), "Transmitting identifiable patient health info over cloud channels", font=font_body, fill=C_TEXT_MAIN)
    draw.text((230, 848), "without enterprise DPO infrastructure is legally non-compliant.", font=font_body, fill=C_TEXT_MUTED)
    
    # Right Side: Cloud Failure Comparison Cards
    card_r = [1000, 220, 1830, 940]
    draw_shadow(img, card_r)
    draw_card(draw, card_r)
    
    draw.text((1040, 255), "WHY CLOUD-BASED HEALTH TOOLS FAIL", font=font_card_head, fill=C_TEXT_MAIN)
    draw.text((1040, 290), "Every dependency on external servers becomes a point of total failure.", font=font_body, fill=C_TEXT_MUTED)
    
    comparisons = [
        ("Cloud Speech Recognition (Google/OpenAI)", "Requires 200kbps+ upstream audio streaming. Fails completely offline.", C_DANGER),
        ("Cloud LLM Extractions (ChatGPT/Gemini)", "Exposes patient names and diagnoses to 3rd-party servers; illegal under RA 10173.", C_DANGER),
        ("Cloud Electronic Medical Records (EMR)", "Locks BHW out of patient history during rural power or cell tower outages.", C_DANGER)
    ]
    
    for idx, (head, desc, col) in enumerate(comparisons):
        y_c = 360 + idx * 170
        draw.rounded_rectangle([1040, y_c, 1790, y_c + 140], radius=12, fill=(255, 255, 255), outline=C_BORDER, width=1)
        # Red X icon
        draw.ellipse([1070, y_c + 30, 1120, y_c + 80], fill=C_DANGER_BG)
        draw.line([1085, y_c + 45, 1105, y_c + 65], fill=C_DANGER, width=3)
        draw.line([1105, y_c + 45, 1085, y_c + 65], fill=C_DANGER, width=3)
        
        draw.text((1145, y_c + 32), head, font=font_card_head, fill=C_TEXT_MAIN)
        draw.text((1145, y_c + 72), desc, font=font_body, fill=C_TEXT_MUTED)
        
        # Pill
        draw.rounded_rectangle([1620, y_c + 30, 1760, y_c + 60], radius=6, fill=C_DANGER_BG)
        draw.text((1635, y_c + 36), "✕ UNUSABLE", font=font_badge, fill=C_DANGER)
        
    return img

def render_scene_3(t, frame_idx):
    # 8.05s to 16.20s:
    # 8.05 - 10.50: "Meet OfflineDoc:" (Big Animated Logo Presentation)
    # 10.50 - 16.20: "A local AI documentation assistant designed to work directly on your device..."
    img = bg_base.copy()
    draw = ImageDraw.Draw(img)
    
    sc_t = t - 8.05
    
    if sc_t < 2.8: # LOGO HERO REVEAL PHASE
        p = clamp(sc_t / 2.0)
        e_scale = ease_out_cubic(p)
        
        # Radiant expanding ambient radial glow behind logo
        glow_rad = int(220 + math.sin(sc_t * 6) * 20)
        cx, cy = WIDTH // 2, HEIGHT // 2 - 40
        draw.ellipse([cx - glow_rad, cy - glow_rad, cx + glow_rad, cy + glow_rad], fill=(224, 242, 254), outline=(186, 230, 253), width=2)
        
        # Kicker above
        kicker_text = "• INTRODUCING OFFLINEDOC •"
        kw = int(draw.textlength(kicker_text, font=font_kicker))
        draw.rounded_rectangle([cx - kw//2 - 16, cy - 310, cx + kw//2 + 16, cy - 275], radius=15, fill=C_PRIMARY_LIGHT, outline=(191, 219, 254))
        draw.text((cx - kw//2, cy - 305), kicker_text, font=font_kicker, fill=C_PRIMARY)
        
        # Animated Rotating Blue Orbital Ring
        ring_rad = int(210 * e_scale)
        for step in range(36):
            ang = step * (math.pi / 18) + sc_t * 2.5
            px = cx + math.cos(ang) * ring_rad
            py = cy + math.sin(ang) * (ring_rad * 0.45) # Elliptical orbit
            alpha_step = int(180 + math.sin(ang) * 75)
            draw.ellipse([px-4, py-4, px+4, py+4], fill=(0, 102, 255))
        
        # Draw the new logo icon with smooth scale
        logo_w = int(340 * e_scale)
        logo_h = int(340 * e_scale)
        if logo_w > 10:
            res_icon = img_logo_icon.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
            draw_shadow(img, [cx - logo_w//2, cy - logo_h//2 - 20, cx + logo_w//2, cy + logo_h//2 - 20], radius=55, offset=14, blur=22, alpha=40)
            img.paste(res_icon, (cx - logo_w//2, cy - logo_h//2 - 20), res_icon)
        
        # Text "OfflineDoc" slides up smoothly
        text_p = clamp((sc_t - 0.5) / 1.0)
        if text_p > 0:
            e_text = ease_out_cubic(text_p)
            tw = int(460 * e_text)
            th = int(105 * e_text)
            ty = int(cy + 220 - (1 - e_text) * 30)
            res_text = img_logo_text.resize((tw, th), Image.Resampling.LANCZOS)
            img.paste(res_text, (cx - tw//2, ty), res_text)
            
            tagline = "LOCAL INTELLIGENCE FOR BETTER DOCUMENTATION, ANYWHERE."
            tag_w = int(draw.textlength(tagline, font=font_badge))
            draw.text((cx - tag_w//2, ty + 120), tagline, font=font_badge, fill=C_TEXT_MUTED)

    else: # SYSTEM DESIGN PRESENTATION PHASE
        draw_header(
            draw,
            "• MEET OFFLINEDOC • 100% AIR-GAPPED SYSTEM DESIGN",
            "LOCAL AI. DIRECTLY ON YOUR DEVICE.",
            "Designed to work entirely on local hardware with zero cloud calls and zero internet required."
        )
        
        p2 = clamp((sc_t - 2.8) / 1.5)
        e2 = ease_out_cubic(p2)
        
        # Left Panel: Actual Desktop UI Screenshot with browser frame
        card_l = [90, 220, 1160, 950]
        draw_shadow(img, card_l)
        draw_card(draw, card_l)
        
        # Browser mockup header
        draw.rounded_rectangle([90, 220, 1160, 265], radius=14, fill=(241, 245, 249))
        draw.ellipse([110, 238, 122, 250], fill=(239, 68, 68))
        draw.ellipse([130, 238, 142, 250], fill=(245, 158, 11))
        draw.ellipse([150, 238, 162, 250], fill=(16, 185, 129))
        # Address bar
        draw.rounded_rectangle([190, 232, 700, 256], radius=6, fill=(255, 255, 255))
        draw.text((210, 235), "🔒 http://127.0.0.1:8000 — 100% Air-Gapped Local Station", font=font_badge, fill=C_TEXT_MUTED)
        
        # Paste actual dashboard screenshot
        dash_w, dash_h = 1068, 675
        res_dash = img_dashboard.resize((dash_w, dash_h), Image.Resampling.LANCZOS)
        img.paste(res_dash, (91, 266), res_dash)
        
        # Right Panel: System Architecture & Engine Callouts
        card_r = [1200, 220, 1830, 950]
        draw_shadow(img, card_r)
        draw_card(draw, card_r)
        
        draw.text((1235, 255), "AIR-GAPPED SYSTEM ARCHITECTURE", font=font_card_head, fill=C_PRIMARY)
        draw.text((1235, 290), "Every component runs on standard x86_64 or mobile CPU.", font=font_body, fill=C_TEXT_MUTED)
        
        specs = [
            ("STT ENGINE: Faster-Whisper (INT8)", "Conditions on Taglish BHW clinical vocabulary. Transcribes 20-45s audio in ~2.1s.", C_PRIMARY),
            ("LLM ENGINE: Llama 3.2 1B Instruct (Edge)", "Strict 'Null-Not-Guess' entity extraction into DOH Target Client List format in ~0.79s.", (16, 185, 129)),
            ("DOCUMENT ENGINE: Instant DOH ITR PDF", "Compiles single-page Individual Treatment Record encounter slips with dual signatures.", (14, 165, 233)),
            ("STATUTORY SECURITY: RA 7883 & RA 10173", "Zero external network calls. 100% patient data residency on barangay hardware.", (99, 102, 241))
        ]
        
        for idx, (title_s, desc_s, col_s) in enumerate(specs):
            sy = 345 + idx * 145
            draw.rounded_rectangle([1235, sy, 1795, sy + 125], radius=10, fill=(248, 250, 252), outline=C_BORDER, width=1)
            draw.rounded_rectangle([1250, sy + 15, 1256, sy + 110], radius=3, fill=col_s)
            draw.text((1275, sy + 20), title_s, font=font_card_head, fill=C_TEXT_MAIN)
            draw.text((1275, sy + 58), desc_s, font=font_body, fill=C_TEXT_MUTED)

    return img

def render_scene_4(t, frame_idx):
    # 16.20s to 23.60s:
    # "Simply record a patient visit summary, and OfflineDoc transforms speech into text using on-device speech recognition."
    img = bg_base.copy()
    draw = ImageDraw.Draw(img)
    
    draw_header(
        draw,
        "• WORKING FEATURE 01 • ON-DEVICE VOICE RECOGNITION",
        "SPEAK NATURALLY IN TAGLISH.",
        "Simply record a patient visit summary. OfflineDoc transforms speech into text using faster-whisper INT8."
    )
    
    progress = clamp((t - 16.20) / (23.60 - 16.20))
    
    # Left Card: Mobile Phone Mockup with Step 1 Dictation UI
    card_l = [90, 220, 800, 950]
    draw_shadow(img, card_l)
    draw_card(draw, card_l)
    
    draw.text((130, 255), "KINDLE CALM INTAKE MODAL (STEP 1: RECORD)", font=font_card_head, fill=C_PRIMARY)
    
    # Render phone-style card inside
    phone_box = [130, 295, 760, 915]
    draw.rounded_rectangle(phone_box, radius=20, fill=(255, 255, 255), outline=(203, 213, 225), width=2)
    
    # Step indicator pill
    draw.rounded_rectangle([170, 325, 330, 360], radius=8, fill=C_PRIMARY)
    draw.text((195, 332), "1. Record", font=font_badge, fill=(255, 255, 255))
    draw.rounded_rectangle([345, 325, 520, 360], radius=8, fill=(241, 245, 249))
    draw.text((360, 332), "2. Review & Gaps", font=font_badge, fill=C_TEXT_MUTED)
    draw.rounded_rectangle([535, 325, 720, 360], radius=8, fill=(241, 245, 249))
    draw.text((545, 332), "3. Confirm & Export", font=font_badge, fill=C_TEXT_MUTED)
    
    # Dictation instructions
    draw.text((170, 395), "Speak a 20-45s summary in Taglish or English:", font=font_card_sub, fill=C_TEXT_MAIN)
    draw.rounded_rectangle([170, 430, 720, 510], radius=10, fill=(248, 250, 252), outline=C_BORDER)
    draw.text((190, 445), '"State patient name, age, purok, vitals (BP/weight),', font=font_body, fill=C_TEXT_MUTED)
    draw.text((190, 472), 'symptoms, and medications. 100% on device."', font=font_body, fill=C_TEXT_MUTED)
    
    # Animated Pulsing Microphone Button
    mic_cx, mic_cy = 445, 630
    pulse = math.sin(t * 8) * 12
    draw.ellipse([mic_cx - 65 - pulse, mic_cy - 65 - pulse, mic_cx + 65 + pulse, mic_cy + 65 + pulse], fill=(219, 234, 254, 120))
    draw.ellipse([mic_cx - 50, mic_cy - 50, mic_cx + 50, mic_cy + 50], fill=C_PRIMARY)
    
    # Mic vector icon
    draw.rounded_rectangle([mic_cx - 10, mic_cy - 20, mic_cx + 10, mic_cy + 10], radius=8, fill=(255, 255, 255))
    draw.arc([mic_cx - 16, mic_cy - 12, mic_cx + 16, mic_cy + 16], start=0, end=180, fill=(255, 255, 255), width=3)
    draw.line([mic_cx, mic_cy + 16, mic_cx, mic_cy + 26], fill=(255, 255, 255), width=3)
    draw.line([mic_cx - 10, mic_cy + 26, mic_cx + 10, mic_cy + 26], fill=(255, 255, 255), width=3)
    
    # Timer & Recording badge
    timer_secs = int(14 + progress * 14)
    draw.text((mic_cx - 40, mic_cy + 75), f"00:{timer_secs:02d}", font=font_card_head, fill=C_TEXT_MAIN)
    draw.text((mic_cx - 85, mic_cy + 110), "[REC] RECORDING LIVE AUDIO (16 kHz)", font=font_badge, fill=C_DANGER)
    
    # Dynamic Live Waveform Bars
    wb_x = 170
    for b in range(26):
        h = int(12 + math.sin(t * 12 + b * 0.8) * 22 + math.cos(t * 7 + b * 1.4) * 16)
        h = max(6, h)
        bx = wb_x + b * 21
        draw.rounded_rectangle([bx, 840 - h//2, bx + 12, 840 + h//2], radius=4, fill=C_PRIMARY)
    
    # Right Card: Real-time Transcript Typing & Model Stats
    card_r = [840, 220, 1830, 950]
    draw_shadow(img, card_r)
    draw_card(draw, card_r)
    
    draw.text((880, 255), "VERBATIM CLINICAL TRANSCRIPTION (WHISPER INT8)", font=font_card_head, fill=C_TEXT_MAIN)
    draw.text((880, 290), "Recognizes authentic rural Philippine Taglish clinical terminology.", font=font_body, fill=C_TEXT_MUTED)
    
    # Full spoken transcript
    full_transcript = (
        '"Pangatlong checkup po ni Maria Santos, 28 years old, taga Purok 2. '
        '32 weeks na po ang tiyan, BP ay isang daan at dalawampu over walumpu (120/80), 54 kilos. '
        'Wala na pong manas sa paa, tuloy pa rin po ang ferrous sulfate."'
    )
    
    # Reveal transcript character by character
    chars_to_show = int(len(full_transcript) * clamp(progress * 1.2))
    visible_transcript = full_transcript[:chars_to_show]
    
    # Transcript Display Box
    draw.rounded_rectangle([880, 340, 1790, 600], radius=14, fill=(248, 250, 252), outline=C_BORDER, width=2)
    
    # Wrap text in transcript box
    words = visible_transcript.split(' ')
    lines = []
    curr = ""
    for w in words:
        test = curr + (" " if curr else "") + w
        if draw.textlength(test, font=font_subtitle) < 840:
            curr = test
        else:
            lines.append(curr)
            curr = w
    if curr:
        lines.append(curr)
        
    for li, ltext in enumerate(lines[:6]):
        draw.text((910, 375 + li * 42), ltext, font=font_subtitle, fill=C_PRIMARY if li == 0 else C_TEXT_MAIN)
        
    # Flashing cursor at end
    if int(t * 3) % 2 == 0 and chars_to_show < len(full_transcript):
        last_y = 375 + (len(lines) - 1) * 42 if lines else 375
        last_x = 910 + int(draw.textlength(lines[-1], font=font_subtitle)) if lines else 910
        draw.rectangle([last_x + 4, last_y, last_x + 8, last_y + 30], fill=C_PRIMARY)
        
    # Engine Latency & Processing Metrics Box
    draw.rounded_rectangle([880, 640, 1790, 780], radius=12, fill=C_PRIMARY_LIGHT, outline=(191, 219, 254), width=1)
    draw.text((910, 665), "SPEED • FASTER-WHISPER INT8 INFERENCE BENCHMARK", font=font_card_head, fill=C_PRIMARY)
    draw.text((910, 705), "• Speech Recognition Latency: 2.14s on standard laptop CPU (Zero GPU required)", font=font_body_bold, fill=C_TEXT_MAIN)
    draw.text((910, 735), "• Taglish Number Normalizer: 'isang daan at dalawampu' -> automatically converted to 120", font=font_body, fill=C_TEXT_MUTED)

    # Privacy Guarantee
    draw.rounded_rectangle([880, 810, 1790, 915], radius=12, fill=C_SUCCESS_BG, outline=(187, 247, 208), width=1)
    draw.text((910, 835), "VERIFIED • PRIVACY BY DESIGN: TEMPORARY AUDIO WIPED", font=font_badge, fill=C_SUCCESS)
    draw.text((910, 865), "Audio buffer is processed in RAM and automatically purged immediately after transcription.", font=font_body, fill=C_TEXT_MAIN)

    return img

def render_scene_5(t, frame_idx):
    # 23.60s to 31.60s:
    # "With local AI, information is organized into a structured visit record, with details linked to their original transcript for verification."
    img = bg_base.copy()
    draw = ImageDraw.Draw(img)
    
    draw_header(
        draw,
        "• WORKING FEATURE 02 • AUDITABLE CLINICAL EXTRACTION",
        "STRUCTURED DOH RECORDS. VERIFIED EVIDENCE.",
        "Llama 3.2 1B maps Taglish phrases into Target Client List fields — with every detail linked to verbatim quotes."
    )
    
    progress = clamp((t - 23.60) / (31.60 - 23.60))
    
    # Left Card: Verbatim Transcript with Highlighted Evidence Spans
    card_l = [90, 220, 880, 950]
    draw_shadow(img, card_l)
    draw_card(draw, card_l)
    
    draw.text((130, 255), "VERBATIM TRANSCRIPT (INPUT)", font=font_card_head, fill=C_PRIMARY)
    draw.text((130, 290), "Every extracted entity is grounded in a specific spoken quote.", font=font_body, fill=C_TEXT_MUTED)
    
    quotes = [
        ("Maria Santos", "Pangatlong checkup po ni Maria Santos", (224, 242, 254), C_PRIMARY),
        ("28yo, Purok 2", "28 years old, taga Purok 2", (254, 243, 199), C_AMBER),
        ("32 wks AOG", "32 weeks na po ang tiyan", (220, 252, 231), C_SUCCESS),
        ("BP 120/80", "BP ay 120 over 80", (254, 226, 226), C_DANGER),
        ("No Edema", "Wala na pong manas sa paa", (241, 245, 249), C_TEXT_MUTED),
        ("Iron Supps", "tuloy pa rin po ang ferrous sulfate", (238, 242, 255), (79, 70, 229))
    ]
    
    for qi, (tag, text_q, bg_col, txt_col) in enumerate(quotes):
        qy = 345 + qi * 85
        draw.rounded_rectangle([130, qy, 840, qy + 68], radius=8, fill=bg_col, outline=C_BORDER, width=1)
        draw.rounded_rectangle([145, qy + 12, 260, qy + 38], radius=6, fill=(255, 255, 255))
        draw.text((155, qy + 16), tag, font=font_badge, fill=txt_col)
        draw.text((275, qy + 18), f'"{text_q}"', font=font_body_bold, fill=C_TEXT_MAIN)
        draw.text((155, qy + 44), "Source Quote linked for statutory audit trail", font=font_stat_lbl, fill=C_TEXT_MUTED)
        
    draw.rounded_rectangle([130, 870, 840, 925], radius=8, fill=C_PRIMARY_LIGHT)
    draw.text((150, 888), "SUB-SECOND • LLAMA 3.2 1B EDGE LATENCY: 0.79s (SUB-SECOND ON CPU)", font=font_badge, fill=C_PRIMARY)

    # Right Card: Structured DOH Target Client List Fields
    card_r = [920, 220, 1830, 950]
    draw_shadow(img, card_r)
    draw_card(draw, card_r)
    
    draw.text((960, 255), "DOH TARGET CLIENT LIST (TCL) CLINICAL FIELDS", font=font_card_head, fill=C_TEXT_MAIN)
    draw.text((960, 290), "Strict 'Null-Not-Guess' rule: unmentioned fields stay null.", font=font_body, fill=C_TEXT_MUTED)
    
    fields = [
        ("Patient Name", "Maria Santos", "VERIFIED MATCH", C_PRIMARY),
        ("Age / Sex / Purok", "28 yo / Female / Purok 2", "CONFIRMED", C_AMBER),
        ("TCL Category", "Maternal Care (Prenatal Follow-up 3)", "ACTIVE COHORT", C_PRIMARY),
        ("Blood Pressure", "120/80 mmHg (Systolic 120, Diastolic 80)", "NORMOTENSIVE", C_SUCCESS),
        ("Gestational Age", "32 Weeks AOG • Weight: 54.0 kg", "ON SCHEDULE", C_SUCCESS),
        ("Pertinent Negatives", "No pedal edema (manas sa paa resolved)", "RESOLVED", C_TEXT_MUTED),
        ("Prescribed Medicine", "Ferrous sulfate 60mg OD (oral iron)", "ADHERENT", (79, 70, 229))
    ]
    
    for fi, (lbl, val, badge_txt, b_col) in enumerate(fields):
        fy = 340 + fi * 76
        draw.rounded_rectangle([960, fy, 1790, fy + 65], radius=8, fill=(248, 250, 252), outline=C_BORDER, width=1)
        draw.text((980, fy + 12), f"{lbl}:", font=font_badge, fill=C_TEXT_MUTED)
        draw.text((1150, fy + 10), val, font=font_card_sub, fill=C_TEXT_MAIN)
        
        # Pill badge
        bw = int(draw.textlength(badge_txt, font=font_badge))
        draw.rounded_rectangle([1640, fy + 14, 1640 + bw + 20, fy + 46], radius=6, fill=(255, 255, 255), outline=C_BORDER)
        draw.text((1650, fy + 22), badge_txt, font=font_badge, fill=b_col)

    # Dynamic Glowing Evidence Trace Lines connecting left to right
    trace_alpha = int(180 + math.sin(t * 10) * 70)
    for i in range(min(4, int(progress * 5) + 1)):
        sy = 380 + i * 85
        ey = 370 + i * 76
        draw.line([840, sy, 880, sy, 920, ey, 960, ey], fill=(0, 102, 255), width=2)
        draw.ellipse([838, sy - 4, 846, sy + 4], fill=(0, 102, 255))
        draw.ellipse([956, ey - 4, 964, ey + 4], fill=(0, 102, 255))

    # Pre-eclampsia safety check banner
    draw.rounded_rectangle([960, 880, 1790, 930], radius=8, fill=C_SUCCESS_BG, outline=(187, 247, 208))
    draw.text((980, 895), "VERIFIED • CLINICAL SAFETY RULE PASSED: Normal maternal blood pressure. No danger signs flagged.", font=font_badge, fill=C_SUCCESS)

    return img

def render_scene_6(t, frame_idx):
    # 31.60s to 38.90s:
    # "Health workers can review, edit, and confirm the information before generating a PDF visit report and follow-up checklist."
    img = bg_base.copy()
    draw = ImageDraw.Draw(img)
    
    draw_header(
        draw,
        "• WORKING FEATURE 03 • POINT-OF-CARE RED FLAGS & PDF EXPORT",
        "REVIEW, CONFIRM & GENERATE DOH ITR SLIPS.",
        "Automatic danger sign red flag checker + instant single-page Department of Health encounter slips."
    )
    
    progress = clamp((t - 31.60) / (38.90 - 31.60))
    
    # Left Card: Point-of-Care Red Flag Danger Alert & Commit Button
    card_l = [90, 220, 920, 950]
    draw_shadow(img, card_l)
    draw_card(draw, card_l)
    
    draw.text((130, 255), "POINT-OF-CARE CLINICAL SAFETY CHECKER", font=font_card_head, fill=C_DANGER)
    draw.text((130, 290), "Automatically detects hypertensive crises and pre-eclampsia risks.", font=font_body, fill=C_TEXT_MUTED)
    
    # Red Flag Alert Box (Teresa Ramos Scenario)
    draw.rounded_rectangle([130, 340, 880, 520], radius=14, fill=C_DANGER_BG, outline=(248, 113, 113), width=2)
    draw.text((160, 365), "ALERT • DANGER SIGN: HYPERTENSIVE CRISIS (BP >= 140/90)", font=font_card_head, fill=C_DANGER)
    draw.text((160, 405), "Patient: Teresa Ramos (54yo, Purok 4)", font=font_body_bold, fill=C_TEXT_MAIN)
    draw.text((160, 435), "Blood Pressure: 150/95 mmHg with severe occipital headache.", font=font_body, fill=C_TEXT_MAIN)
    draw.text((160, 465), "Protocol Triggered: Mandatory prompt RHU Physician Referral.", font=font_body_bold, fill=C_DANGER)
    
    # Normal Case Badge (Maria Santos)
    draw.rounded_rectangle([130, 545, 880, 645], radius=12, fill=C_SUCCESS_BG, outline=(187, 247, 208), width=2)
    draw.text((160, 565), "VERIFIED • MATERNAL PROTOCOL: Maria Santos (28yo, Purok 2)", font=font_card_head, fill=C_SUCCESS)
    draw.text((160, 600), "Trimester 3 prenatal vitals normal (120/80 mmHg). No proteinuric alert.", font=font_body, fill=C_TEXT_MAIN)
    
    # Commit Action Button
    btn_y = 680
    draw.rounded_rectangle([130, btn_y, 880, btn_y + 80], radius=14, fill=C_PRIMARY)
    btn_commit_text = "CONFIRM & COMMIT TO LOCAL LEDGER"
    btn_commit_w = draw.textlength(btn_commit_text, font=font_card_head)
    draw.text((130 + (750 - btn_commit_w) // 2, btn_y + 24), btn_commit_text, font=font_card_head, fill=(255, 255, 255))
    
    # Success Confirmation Card
    draw.rounded_rectangle([130, 785, 880, 920], radius=12, fill=(248, 250, 252), outline=C_BORDER, width=1)
    draw.text((160, 810), "LOCAL JSON LEDGER ATOMIC COMMIT", font=font_badge, fill=C_PRIMARY)
    draw.text((160, 840), "• Encounter saved to data/visits/visit_1791578264.json", font=font_body, fill=C_TEXT_MAIN)
    draw.text((160, 870), "• Patient longitudinal timeline updated in data/patients/P-001.json", font=font_body, fill=C_TEXT_MUTED)

    # Right Card: The Actual Generated DOH ITR Encounter Slip (PDF Preview)
    card_r = [960, 220, 1830, 950]
    draw_shadow(img, card_r)
    draw_card(draw, card_r)
    
    draw.text((1000, 255), "OFFICIAL DOH INDIVIDUAL TREATMENT RECORD (ITR)", font=font_card_head, fill=C_PRIMARY)
    draw.text((1000, 290), "Single-page printable PDF generated locally on device via fpdf2.", font=font_body, fill=C_TEXT_MUTED)
    
    # Render PDF preview image inside
    pdf_w, pdf_h = 440, 620
    res_pdf = img_pdf.resize((pdf_w, pdf_h), Image.Resampling.LANCZOS)
    
    # PDF Card frame with shadow
    pdf_x = 1175
    pdf_y = 330
    draw_shadow(img, [pdf_x, pdf_y, pdf_x + pdf_w, pdf_y + pdf_h], radius=8, offset=8, blur=14, alpha=40)
    draw.rounded_rectangle([pdf_x - 4, pdf_y - 4, pdf_x + pdf_w + 4, pdf_y + pdf_h + 4], radius=10, fill=(255, 255, 255), outline=C_BORDER)
    img.paste(res_pdf, (pdf_x, pdf_y))
    
    # Download badge
    btn_pdf_text = "GENERATE OFFICIAL DOH ITR SLIP (PDF)"
    btn_pdf_w = draw.textlength(btn_pdf_text, font=font_badge)
    draw.rounded_rectangle([1175, 960 - 5, 1615, 960 + 35], radius=8, fill=C_PRIMARY)
    draw.text((1175 + (440 - btn_pdf_w) // 2, 962), btn_pdf_text, font=font_badge, fill=(255, 255, 255))

    return img

def render_scene_7(t, frame_idx):
    # 38.90s to 48.95s:
    # "No cloud dependency, no unnecessary manual work, just practical AI designed to support efficient documentation while keeping patient information on the device."
    img = bg_base.copy()
    draw = ImageDraw.Draw(img)
    
    draw_header(
        draw,
        "• THE OFFLINEDOC PROMISE • BUILT FOR FRONTLINE REALITY",
        "NO CLOUD. NO MANUAL LOGS. 100% PRIVATE.",
        "Practical on-device AI engineered specifically for 42,000+ Philippine Barangay Health Stations."
    )
    
    progress = clamp((t - 38.90) / (48.95 - 38.90))
    
    # 3 Big Value Proposition Cards
    cards_data = [
        ("01", "100% AIR-GAPPED", "0 KB Cloud Data Sent",
         "Faster-Whisper and Llama 3.2 run entirely on the device's CPU. Operates seamlessly in deep rural sitios and islands with zero internet connection.",
         C_PRIMARY, C_PRIMARY_LIGHT),
        ("02", "95% TIME SAVED", "< 4 Sec vs 4 Hours",
         "Transforms 3 to 4 hours of tedious handwritten evening paperwork into a 30-second Taglish voice dictation and instant official PDF export.",
         C_SUCCESS, C_SUCCESS_BG),
        ("03", "STATUTORY PRIVACY", "RA 10173 & RA 7883",
         "Full compliance with the Philippine Data Privacy Act. Patient health records never leave the local barangay health station.",
         (79, 70, 229), (238, 242, 255))
    ]
    
    cw = 540
    for idx, (num, title_c, stat_c, desc_c, col_c, bg_col_c) in enumerate(cards_data):
        c_appear = clamp((progress - idx * 0.2) / 0.4)
        e_c = ease_out_cubic(c_appear)
        
        cx1 = int(90 + idx * 600)
        cy1 = int(240 + (1 - e_c) * 40)
        cx2 = cx1 + cw
        cy2 = cy1 + 680
        
        box_c = [cx1, cy1, cx2, cy2]
        draw_shadow(img, box_c, radius=18, offset=10, blur=16, alpha=40)
        draw_card(draw, box_c, radius=18)
        
        # Color top banner
        draw.rounded_rectangle([cx1, cy1, cx2, cy1 + 100], radius=18, fill=bg_col_c)
        draw.rectangle([cx1, cy1 + 80, cx2, cy1 + 100], fill=bg_col_c)
        
        # Number badge
        draw.rounded_rectangle([cx1 + 30, cy1 + 25, cx1 + 90, cy1 + 75], radius=10, fill=(255, 255, 255), outline=C_BORDER)
        draw.text((cx1 + 45, cy1 + 35), num, font=font_card_head, fill=col_c)
        
        draw.text((cx1 + 110, cy1 + 38), title_c, font=font_card_head, fill=col_c)
        
        # Big Stat
        draw.text((cx1 + 30, cy1 + 140), stat_c, font=font_stat, fill=C_TEXT_MAIN)
        draw.line([cx1 + 30, cy1 + 210, cx2 - 30, cy1 + 210], fill=C_BORDER, width=2)
        
        # Description text wrapped
        words = desc_c.split(' ')
        lines = []
        curr = ""
        for w in words:
            test = curr + (" " if curr else "") + w
            if draw.textlength(test, font=font_subtitle) < (cw - 60):
                curr = test
            else:
                lines.append(curr)
                curr = w
        if curr:
            lines.append(curr)
            
        for li, ltext in enumerate(lines):
            draw.text((cx1 + 30, cy1 + 240 + li * 38), ltext, font=font_subtitle, fill=C_TEXT_MUTED)
            
        # Verified Badge at bottom
        draw.rounded_rectangle([cx1 + 30, cy2 - 70, cx2 - 30, cy2 - 25], radius=10, fill=bg_col_c)
        draw.text((cx1 + 50, cy2 - 55), "VERIFIED IN THE FIELD (RA 10173)", font=font_badge, fill=col_c)

    return img

def render_scene_8(t, frame_idx):
    # 48.95s to 53.63s:
    # "OfflineDoc: local intelligence for better documentation, anywhere."
    img = bg_base.copy()
    draw = ImageDraw.Draw(img)
    
    progress = clamp((t - 48.95) / (53.63 - 48.95))
    e_p = ease_out_cubic(progress)
    
    # Ambient glowing radial bloom
    cx, cy = WIDTH // 2, HEIGHT // 2 - 60
    glow_rad = int(320 + math.sin(progress * 8) * 15)
    draw.ellipse([cx - glow_rad, cy - glow_rad, cx + glow_rad, cy + glow_rad], fill=(224, 242, 254), outline=(186, 230, 253), width=2)
    
    # Rotating outer cyan orbit dots
    for step in range(30):
        ang = step * (math.pi / 15) + progress * 3
        px = cx + math.cos(ang) * 280
        py = cy + math.sin(ang) * 160
        draw.ellipse([px-4, py-4, px+4, py+4], fill=(0, 102, 255))
        
    # Clean icon + text centered without white box
    icon_sz = int(320 * e_p)
    if icon_sz > 10:
        res_icon = img_logo_icon.resize((icon_sz, icon_sz), Image.Resampling.LANCZOS)
        draw_shadow(img, [cx - icon_sz//2, cy - icon_sz//2 - 60, cx + icon_sz//2, cy + icon_sz//2 - 60], radius=50, offset=14, blur=20, alpha=40)
        img.paste(res_icon, (cx - icon_sz//2, cy - icon_sz//2 - 60), res_icon)
        
        tw = int(480 * e_p)
        th = int(110 * e_p)
        res_txt = img_logo_text.resize((tw, th), Image.Resampling.LANCZOS)
        img.paste(res_txt, (cx - tw//2, cy + 130), res_txt)
        
    # Tagline Banner below
    slogan = "LOCAL INTELLIGENCE FOR BETTER DOCUMENTATION, ANYWHERE."
    sw = int(draw.textlength(slogan, font=font_title))
    draw.text((cx - sw//2, cy + 320), slogan, font=font_title, fill=C_TEXT_MAIN)
    
    # Subtitle
    sub = "Engineered for 42,000+ Barangay Health Workers across the Philippines."
    sub_w = int(draw.textlength(sub, font=font_subtitle))
    draw.text((cx - sub_w//2, cy + 395), sub, font=font_subtitle, fill=C_TEXT_MUTED)
    
    # Feature Badges
    badges = [
        "100% ON-DEVICE",
        "FASTER-WHISPER (INT8)",
        "LLAMA 3.2 1B (EDGE)",
        "OFFICIAL DOH ITR & TCL",
        "RA 7883 & RA 10173"
    ]
    total_w = sum(int(draw.textlength(b, font=font_badge)) + 30 for b in badges)
    cur_x = cx - total_w // 2
    for b in badges:
        bw = int(draw.textlength(b, font=font_badge)) + 24
        draw.rounded_rectangle([cur_x, cy + 450, cur_x + bw, cy + 482], radius=8, fill=C_PRIMARY_LIGHT, outline=(191, 219, 254))
        draw.text((cur_x + 12, cy + 458), b, font=font_badge, fill=C_PRIMARY)
        cur_x += bw + 10

    # Smooth fade out at the very end (last 0.8s)
    if t > 52.8:
        fade = clamp((t - 52.8) / 0.8)
        mask = Image.new('RGB', (WIDTH, HEIGHT), (255, 255, 255))
        img = Image.blend(img, mask, fade)

    return img

def render_frame(frame_idx):
    t = frame_idx / FPS
    if t < 4.10:
        return render_scene_1(t, frame_idx)
    elif t < 8.05:
        return render_scene_2(t, frame_idx)
    elif t < 16.20:
        return render_scene_3(t, frame_idx)
    elif t < 23.60:
        return render_scene_4(t, frame_idx)
    elif t < 31.60:
        return render_scene_5(t, frame_idx)
    elif t < 38.90:
        return render_scene_6(t, frame_idx)
    elif t < 48.95:
        return render_scene_7(t, frame_idx)
    else:
        return render_scene_8(t, frame_idx)

def main():
    out_video = "OfflineDoc_Motion_Graphics.mp4"
    audio_track = "scratch/mixed_audio.aac"
    
    print(f"Rendering {TOTAL_FRAMES} frames ({TOTAL_DURATION:.2f}s at {FPS}fps) to {out_video}...")
    
    cmd = [
        FFMPEG_EXE, '-y',
        '-f', 'rawvideo',
        '-vcodec', 'rawvideo',
        '-s', f'{WIDTH}x{HEIGHT}',
        '-pix_fmt', 'rgb24',
        '-r', str(FPS),
        '-i', '-',
        '-i', audio_track,
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '18',
        '-pix_fmt', 'yuv420p',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest',
        out_video
    ]
    
    stderr_log = open('scratch/ffmpeg_render.log', 'w')
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stderr=stderr_log)
    
    t0 = time.time()
    for f in range(TOTAL_FRAMES):
        frame_img = render_frame(f)
        proc.stdin.write(frame_img.tobytes())
        if f % 150 == 0 or f == TOTAL_FRAMES - 1:
            elapsed = time.time() - t0
            fps_speed = (f + 1) / max(0.001, elapsed)
            print(f"Rendered frame {f+1}/{TOTAL_FRAMES} ({((f+1)/TOTAL_FRAMES)*100:.1f}%) -- Speed: {fps_speed:.1f} fps", flush=True)
            
    proc.stdin.close()
    proc.wait()
    stderr_log.close()
    print("Video encoding complete!", flush=True)
    print(f"Saved: {out_video}", flush=True)

if __name__ == '__main__':
    main()
