from PIL import Image
import os

frames_dir = r"C:\hashdammi\p07_frames"
output_gif = r"C:\hashdammi\contact_experience.gif"

frame_files = [
    "p07_01_contact_header_overview.png",
    "p07_02_form_idle_state.png",
    "p07_03_form_validation_errors.png",
    "p07_04_form_filled_valid.png",
    "p07_05_form_success_confirmed.png",
    "p07_06_studio_manifesto_final.png",
    "p07_07_direct_route_contact.png",
]

images = []
for fname in frame_files:
    fpath = os.path.join(frames_dir, fname)
    if os.path.exists(fpath):
        img = Image.open(fpath)
        img = img.resize((720, 450), Image.Resampling.LANCZOS)
        images.append(img.convert("RGB"))
        print(f"Loaded: {fname}")

if images:
    durations = [1400, 1200, 1400, 1400, 1800, 1600, 1400]
    images[0].save(
        output_gif,
        save_all=True,
        append_images=images[1:],
        duration=durations,
        loop=0,
        optimize=True,
    )
    print(f"Created GIF: {output_gif} ({os.path.getsize(output_gif)} bytes)")

