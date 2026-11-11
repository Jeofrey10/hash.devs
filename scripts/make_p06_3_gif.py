from PIL import Image
import os

artifact_dir = r"C:\Users\KANIMOZHI\.gemini\antigravity\brain\6ff27cec-25f0-42d6-aef4-136c2fa30198"
frames = [
    os.path.join(artifact_dir, "p06_3_01_contact_overview.png"),
    os.path.join(artifact_dir, "p06_3_02_form_validation_errors.png"),
    os.path.join(artifact_dir, "p06_3_03_form_filled_interactive.png"),
    os.path.join(artifact_dir, "p06_3_04_form_submission_success.png"),
    os.path.join(artifact_dir, "p06_3_05_footer_cta_connectivity.png"),
]

imgs = []
for f in frames:
    if os.path.exists(f):
        img = Image.open(f).convert("RGBA")
        img_resized = img.resize((960, 540), Image.Resampling.LANCZOS)
        imgs.append(img_resized.convert("P", palette=Image.Palette.ADAPTIVE))

if imgs:
    output_path = os.path.join(artifact_dir, "contact_inquiry_experience.gif")
    imgs[0].save(
        output_path,
        save_all=True,
        append_images=imgs[1:],
        duration=1400,
        loop=0,
        optimize=True,
    )
    print(f"Saved GIF: {output_path}")

