import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

WIDTH, HEIGHT = 1920, 1080

FONT_BOLD_PATH = 'C:/Windows/Fonts/segoeuib.ttf'
FONT_REG_PATH = 'C:/Windows/Fonts/segoeui.ttf'

font_kicker = ImageFont.truetype(FONT_BOLD_PATH, 18)
font_title = ImageFont.truetype(FONT_BOLD_PATH, 54)
font_subtitle = ImageFont.truetype(FONT_REG_PATH, 24)
font_card_title = ImageFont.truetype(FONT_BOLD_PATH, 22)
font_card_body = ImageFont.truetype(FONT_REG_PATH, 16)
font_small = ImageFont.truetype(FONT_BOLD_PATH, 14)

def create_base_canvas():
    # Subtle medical gradient background #F8FAFC to #EEF2F6
    img = Image.new('RGB', (WIDTH, HEIGHT), (248, 250, 252))
    draw = ImageDraw.Draw(img)
    # Draw subtle grid dots
    for x in range(40, WIDTH, 60):
        for y in range(40, HEIGHT, 60):
            draw.ellipse([x, y, x+2, y+2], fill=(226, 232, 240))
    return img

def draw_card(draw, box, fill=(255, 255, 255), outline=(226, 232, 240), radius=16, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)

# Test render
canvas = create_base_canvas()
draw = ImageDraw.Draw(canvas)

# Kicker
draw.text((100, 70), "• THE FRONTLINE REALITY • BARANGAY HEALTH WORKERS", font=font_kicker, fill=(0, 102, 255))
draw.text((100, 110), "DOCUMENTING PAPERS TAKES TIME.", font=font_title, fill=(15, 23, 42))
draw.text((100, 180), "For health workers, every visit means another record to write in DOH logbooks.", font=font_subtitle, fill=(71, 85, 105))

canvas.save('scratch/sample_rendered_frame.png')
print('Sample frame saved!')
