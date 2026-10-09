with open('scratch/render_motion_graphics.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace assets
text = text.replace("img_logo_icon = Image.open('scratch/logo_icon.png').convert('RGBA')", "img_logo_icon = Image.open('scratch/logo_icon_clean.png').convert('RGBA')")
text = text.replace("img_logo_text = Image.open('scratch/logo_text.png').convert('RGBA')", "img_logo_text = Image.open('scratch/logo_text_clean.png').convert('RGBA')")

# Replace unicode glyphs that caused missing font boxes
replacements = [
    ('● RECORDING LIVE AUDIO', '[REC] RECORDING LIVE AUDIO (16 kHz)'),
    ('⚡ FASTER-WHISPER INT8', 'SPEED • FASTER-WHISPER INT8'),
    ('✓ PRIVACY BY DESIGN', 'VERIFIED • PRIVACY BY DESIGN'),
    ('⚡ LLAMA 3.2 1B EDGE', 'SUB-SECOND • LLAMA 3.2 1B EDGE'),
    ('✓ CLINICAL SAFETY RULE', 'VERIFIED • CLINICAL SAFETY RULE'),
    ('⚠️ CRITICAL ALERT', 'ALERT • HYPERTENSIVE CRISIS'),
    ('✓ MATERNAL PROTOCOL', 'VERIFIED • MATERNAL PROTOCOL'),
    ('✓ CONFIRM & COMMIT', 'CONFIRM & COMMIT TO LOCAL LEDGER'),
    ('📥 1-CLICK DOH ITR SLIP', 'GENERATE OFFICIAL DOH ITR SLIP (PDF)'),
    ('✓ CLINICALLY VERIFIED IN THE FIELD', 'VERIFIED IN THE FIELD (RA 10173)')
]

for old, new in replacements:
    text = text.replace(old, new)

# Refine Scene 8 outro to use clean icon + text
old_scene8_logo = '''    # Full new logo centered
    logo_w, logo_h = int(580 * e_p), int(580 * e_p)
    if logo_w > 10:
        res_logo = img_logo_full.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
        draw_shadow(img, [cx - logo_w//2, cy - logo_h//2, cx + logo_w//2, cy + logo_h//2], radius=40, offset=16, blur=24, alpha=45)
        img.paste(res_logo, (cx - logo_w//2, cy - logo_h//2), res_logo)'''

new_scene8_logo = '''    # Clean icon + text centered without white box
    icon_sz = int(320 * e_p)
    if icon_sz > 10:
        res_icon = img_logo_icon.resize((icon_sz, icon_sz), Image.Resampling.LANCZOS)
        draw_shadow(img, [cx - icon_sz//2, cy - icon_sz//2 - 60, cx + icon_sz//2, cy + icon_sz//2 - 60], radius=50, offset=14, blur=20, alpha=40)
        img.paste(res_icon, (cx - icon_sz//2, cy - icon_sz//2 - 60), res_icon)
        
        tw = int(480 * e_p)
        th = int(110 * e_p)
        res_txt = img_logo_text.resize((tw, th), Image.Resampling.LANCZOS)
        img.paste(res_txt, (cx - tw//2, cy + 130), res_txt)'''

text = text.replace(old_scene8_logo, new_scene8_logo)

# Also fix Scene 3 logo reveal position and shadow
old_scene3 = '''        # Draw the new logo icon with smooth scale
        logo_w = int(360 * e_scale)
        logo_h = int(360 * e_scale)
        if logo_w > 10:
            res_icon = img_logo_icon.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
            # Add soft shadow
            draw_shadow(img, [cx - logo_w//2, cy - logo_h//2, cx + logo_w//2, cy + logo_h//2], radius=30, offset=12, blur=18, alpha=45)
            img.paste(res_icon, (cx - logo_w//2, cy - logo_h//2), res_icon)'''

new_scene3 = '''        # Draw the new logo icon with smooth scale
        logo_w = int(340 * e_scale)
        logo_h = int(340 * e_scale)
        if logo_w > 10:
            res_icon = img_logo_icon.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
            draw_shadow(img, [cx - logo_w//2, cy - logo_h//2 - 20, cx + logo_w//2, cy + logo_h//2 - 20], radius=55, offset=14, blur=22, alpha=40)
            img.paste(res_icon, (cx - logo_w//2, cy - logo_h//2 - 20), res_icon)'''

text = text.replace(old_scene3, new_scene3)

with open('scratch/render_motion_graphics.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated render_motion_graphics.py successfully!')
