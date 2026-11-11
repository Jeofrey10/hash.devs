from PIL import Image
import os

frames_dir = r"C:\hashdammi\qa_frames"
output_gif = r"C:\hashdammi\portfolio_qa_verification.gif"

frame_files = [f"qa_{i:02d}_{suffix}.png" for i, suffix in [
    (1, "gallery_pixwall"),
    (2, "gallery_vox_ai"),
    (3, "gallery_illora_ai"),
    (4, "gallery_experimental"),
    (5, "pixwall_curtain_transition"),
    (6, "pixwall_case_study_hero"),
    (7, "pixwall_editorial_story"),
    (8, "pixwall_visual_architecture"),
    (9, "vox_ai_case_study"),
    (10, "illora_ai_case_study"),
    (11, "experimental_case_study"),
    (12, "circular_returned_to_pixwall"),
    (13, "returned_to_home_gallery"),
]]

images = []
for fname in frame_files:
    fpath = os.path.join(frames_dir, fname)
    if os.path.exists(fpath):
        img = Image.open(fpath)
        img = img.resize((720, 450), Image.Resampling.LANCZOS)
        images.append(img.convert("RGB"))
        print(f"Loaded: {fname}")

if images:
    durations = [1200, 1000, 1000, 1200, 600, 1400, 1200, 1200, 1200, 1200, 1400, 1200, 1400]
    images[0].save(
        output_gif,
        save_all=True,
        append_images=images[1:],
        duration=durations,
        loop=0,
        optimize=True,
    )
    print(f"Created GIF: {output_gif} ({os.path.getsize(output_gif)} bytes)")

