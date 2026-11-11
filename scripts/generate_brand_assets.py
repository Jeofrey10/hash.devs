import base64
import os
import shutil
from PIL import Image
import numpy as np

src_path = r'C:/Users/KANIMOZHI/.gemini/antigravity/brain/6ff27cec-25f0-42d6-aef4-136c2fa30198/.user_uploaded/media_1794399123355_22d67993.jpg'
dest_jpg = r'C:/hashdammi/public/images/hashdevs-logo.jpg'
shutil.copy2(src_path, dest_jpg)
print(f'1. Copied original logo to {dest_jpg}: {os.path.getsize(dest_jpg)} bytes')

# Generate transparent PNG
img = Image.open(src_path).convert('RGB')
arr = np.array(img, dtype=float)

max_ch = np.max(arr, axis=2)
alpha = np.zeros_like(max_ch)
mask = max_ch > 6
alpha[mask] = (max_ch[mask] - 6.0) / (255.0 - 6.0)
alpha = np.clip(alpha, 0.0, 1.0)

rgb_unmult = np.zeros_like(arr)
for c in range(3):
    rgb_c = arr[:, :, c]
    valid = alpha > 0.05
    rgb_unmult[valid, c] = np.clip(rgb_c[valid] / alpha[valid], 0, 255)
    rgb_unmult[~valid, c] = rgb_c[~valid]

rgba = np.dstack([rgb_unmult, alpha * 255.0]).astype(np.uint8)
transparent_img = Image.fromarray(rgba, 'RGBA')
dest_png = r'C:/hashdammi/public/images/hashdevs-logo.png'
transparent_img.save(dest_png, 'PNG', optimize=True)
print(f'2. Saved transparent logo to {dest_png}: {os.path.getsize(dest_png)} bytes')

# Extract emblem: X: 100 to 372, Y: 82 to 299
emblem_crop = transparent_img.crop((100, 82, 373, 300))
icon_size = 512
target_emblem_w = int(icon_size * 0.72)
scale = target_emblem_w / emblem_crop.width
target_emblem_h = int(emblem_crop.height * scale)

emblem_resized = emblem_crop.resize((target_emblem_w, target_emblem_h), Image.Resampling.LANCZOS)
emblem_square = Image.new('RGBA', (icon_size, icon_size), (0, 0, 0, 0))
paste_x = (icon_size - target_emblem_w) // 2
paste_y = (icon_size - target_emblem_h) // 2
emblem_square.paste(emblem_resized, (paste_x, paste_y), emblem_resized)
emblem_path = r'C:/hashdammi/public/images/hashdevs-emblem.png'
emblem_square.save(emblem_path, 'PNG')
print(f'3. Saved emblem icon to {emblem_path}')

# Favicon PNG (64x64 and 192x192)
fav_64 = emblem_square.resize((64, 64), Image.Resampling.LANCZOS)
fav_64.save(r'C:/hashdammi/public/favicon.png', 'PNG')

fav_192 = emblem_square.resize((192, 192), Image.Resampling.LANCZOS)
fav_192.save(r'C:/hashdammi/public/apple-touch-icon.png', 'PNG')
print('4. Generated favicon.png and apple-touch-icon.png')

# Generate favicon.svg with embedded base64
with open(r'C:/hashdammi/public/favicon.png', 'rb') as f:
    b64_str = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#050505"/>
  <image href="data:image/png;base64,{b64_str}" x="6" y="6" width="52" height="52" preserveAspectRatio="xMidYMid meet"/>
</svg>
'''
with open(r'C:/hashdammi/public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)
print('5. Generated public/favicon.svg with embedded official emblem')

# Generate Open Graph image (1200x630)
og = Image.new('RGB', (1200, 630), (5, 5, 5))
logo_w = 680
scale_logo = logo_w / transparent_img.width
logo_h = int(transparent_img.height * scale_logo)
logo_resized = transparent_img.resize((logo_w, logo_h), Image.Resampling.LANCZOS)

logo_x = (1200 - logo_w) // 2
logo_y = (630 - logo_h) // 2 - 15
og.paste(logo_resized, (logo_x, logo_y), logo_resized)
og_path = r'C:/hashdammi/public/images/hashdevs-og.jpg'
og.save(og_path, 'JPEG', quality=95)
print(f'6. Generated {og_path}')

