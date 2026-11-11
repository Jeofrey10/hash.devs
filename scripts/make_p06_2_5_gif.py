from PIL import Image
import os

artifact_dir = r"C:\Users\KANIMOZHI\.gemini\antigravity\brain\6ff27cec-25f0-42d6-aef4-136c2fa30198"
frames = [
    os.path.join(artifact_dir, "p06_2_5_01_stage01_fullwidth.png"),
    os.path.join(artifact_dir, "p06_2_5_02_stage02_expanded.png"),
    os.path.join(artifact_dir, "p06_2_5_03_stage03_expanded.png"),
    os.path.join(artifact_dir, "p06_2_5_04_stage04_expanded.png"),
]

imgs = []
for f in frames:
    if os.path.exists(f):
        img = Image.open(f).convert("RGBA")
        # Resize to 960x540 for fast loading and crisp preview
        img_resized = img.resize((960, 540), Image.Resampling.LANCZOS)
        # Convert to P mode for GIF optimization
        imgs.append(img_resized.convert("P", palette=Image.Palette.ADAPTIVE))

if imgs:
    output_path = os.path.join(artifact_dir, "studio_process_fullwidth_expansion.gif")
    imgs[0].save(
        output_path,
        save_all=True,
        append_images=imgs[1:],
        duration=1200,
        loop=0,
        optimize=True,
    )
    print(f"Saved GIF: {output_path}")

