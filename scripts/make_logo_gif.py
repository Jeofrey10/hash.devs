from PIL import Image
import os
import shutil

frames_dir = r"C:\hashdammi\logo_frames"
output_gif = r"C:\hashdammi\logo_integration_experience.gif"
artifact_dir = r"C:\Users\KANIMOZHI\.gemini\antigravity\brain\6ff27cec-25f0-42d6-aef4-136c2fa30198"

frame_files = [
    "logo_01_navigation_desktop.png",
    "logo_02_footer_info_badge.png",
    "logo_03_oversized_footer_logo.png",
    "logo_04_mobile_nav_drawer.png",
    "logo_05_mobile_footer_logo.png",
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
    durations = [1800, 1600, 2000, 1800, 1600]
    images[0].save(
        output_gif,
        save_all=True,
        append_images=images[1:],
        duration=durations,
        loop=0,
        optimize=True,
    )
    print(f"Created GIF: {output_gif} ({os.path.getsize(output_gif)} bytes)")
    
    # Copy to artifact directory
    dest_gif = os.path.join(artifact_dir, "logo_integration_experience.gif")
    shutil.copy2(output_gif, dest_gif)
    print(f"Copied GIF to artifact dir: {dest_gif}")

# Copy all frame screenshots and multi-viewport images to artifact directory
for fname in os.listdir(frames_dir):
    if fname.endswith(".png"):
        src = os.path.join(frames_dir, fname)
        dst = os.path.join(artifact_dir, fname)
        shutil.copy2(src, dst)
        print(f"Copied artifact: {fname}")

