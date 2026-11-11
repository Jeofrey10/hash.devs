from PIL import Image
import os

frames_dir = r"C:\hashdammi\p06_frames"
output_gif = r"C:\hashdammi\studio_process_experience.gif"

frame_files = [
    "p06_01_process_header_stage01.png",
    "p06_02_stage02_strategy.png",
    "p06_03_stage03_engineer.png",
    "p06_04_stage04_evolve.png",
    "p06_05_studio_position_manifesto.png",
    "p06_06_reverse_scroll_stage01.png",
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
    durations = [1400, 1400, 1400, 1400, 1600, 1400]
    images[0].save(
        output_gif,
        save_all=True,
        append_images=images[1:],
        duration=durations,
        loop=0,
        optimize=True,
    )
    print(f"Created GIF: {output_gif} ({os.path.getsize(output_gif)} bytes)")

