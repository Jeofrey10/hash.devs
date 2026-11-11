from PIL import Image
import os

artifact_dir = r"C:\Users\KANIMOZHI\.gemini\antigravity\brain\6ff27cec-25f0-42d6-aef4-136c2fa30198"
frames = [
    os.path.join(artifact_dir, "p06_3_1_fixed_header_1440.png"),
    os.path.join(artifact_dir, "p06_3_1_vp_1920x1080.png"),
    os.path.join(artifact_dir, "p06_3_1_vp_1440x900.png"),
    os.path.join(artifact_dir, "p06_3_1_vp_1280x800.png"),
    os.path.join(artifact_dir, "p06_3_1_vp_390x844.png"),
]

imgs = []
for f in frames:
    if os.path.exists(f):
        img = Image.open(f).convert("RGBA")
        img_resized = img.resize((960, 540), Image.Resampling.LANCZOS)
        imgs.append(img_resized.convert("P", palette=Image.Palette.ADAPTIVE))

if imgs:
    output_path = os.path.join(artifact_dir, "contact_typography_fixed.gif")
    imgs[0].save(
        output_path,
        save_all=True,
        append_images=imgs[1:],
        duration=1400,
        loop=0,
        optimize=True,
    )
    print(f"Saved GIF: {output_path}")

