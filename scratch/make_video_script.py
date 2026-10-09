import os
from pathlib import Path

with open('scratch/render_motion_graphics.py', 'r', encoding='utf-8') as f:
    code = f.read()

replacement_top = '''from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent
ASSETS_DIR = BASE_DIR / 'assets'

# Load visual assets
img_logo_full = Image.open(ASSETS_DIR / 'logo' / 'OfflineDoc-new-logo.png').convert('RGBA')
img_logo_icon = Image.open(ASSETS_DIR / 'logo' / 'logo_icon_clean.png').convert('RGBA')
img_logo_text = Image.open(ASSETS_DIR / 'logo' / 'logo_text_clean.png').convert('RGBA')
img_dashboard = Image.open(ASSETS_DIR / 'screens' / '01_desktop_dashboard.png').convert('RGBA')
img_mobile = Image.open(ASSETS_DIR / 'screens' / '02_mobile_home.png').convert('RGBA')
img_step1 = Image.open(ASSETS_DIR / 'screens' / '03_step1_record.png').convert('RGBA')
img_step2 = Image.open(ASSETS_DIR / 'screens' / '04_step2_review_gaps.png').convert('RGBA')
img_red_flag = Image.open(ASSETS_DIR / 'screens' / '05_step2_red_flag_alert.png').convert('RGBA')
img_step3 = Image.open(ASSETS_DIR / 'screens' / '06_step3_success_export.png').convert('RGBA')
img_pdf = Image.open(ASSETS_DIR / 'pdf_itr' / 'maria_santos_itr_full.png').convert('RGBA')
'''

old_asset_block = '''# Load visual assets
img_logo_full = Image.open('OfflineDoc-new-logo.png').convert('RGBA')
img_logo_icon = Image.open('scratch/logo_icon_clean.png').convert('RGBA')
img_logo_text = Image.open('scratch/logo_text_clean.png').convert('RGBA')
img_dashboard = Image.open('scratch/screens/01_desktop_dashboard.png').convert('RGBA')
img_mobile = Image.open('scratch/screens/02_mobile_home.png').convert('RGBA')
img_step1 = Image.open('scratch/screens/03_step1_record.png').convert('RGBA')
img_step2 = Image.open('scratch/screens/04_step2_review_gaps.png').convert('RGBA')
img_red_flag = Image.open('scratch/screens/05_step2_red_flag_alert.png').convert('RGBA')
img_step3 = Image.open('scratch/screens/06_step3_success_export.png').convert('RGBA')
img_pdf = Image.open('scratch/maria_santos_itr_full.png').convert('RGBA')'''

code = code.replace(old_asset_block, replacement_top)

old_main = '''def main():
    out_video = "OfflineDoc_Motion_Graphics.mp4"
    audio_track = "scratch/mixed_audio.aac"'''

new_main = '''def main():
    out_video = str(BASE_DIR / "OfflineDoc_Motion_Graphics.mp4")
    audio_track = str(ASSETS_DIR / "mixed_audio.aac")'''

code = code.replace(old_main, new_main)
code = code.replace("open('scratch/ffmpeg_render.log', 'w')", "open(str(BASE_DIR / 'ffmpeg_render.log'), 'w')")

with open('video/render_motion_graphics.py', 'w', encoding='utf-8') as f:
    f.write(code)

print("video/render_motion_graphics.py created successfully")
