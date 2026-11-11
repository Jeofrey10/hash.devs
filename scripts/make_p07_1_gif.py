from PIL import Image
import os
import shutil

frames_dir = r"C:\hashdammi\p07_1_frames"
output_gif = r"C:\hashdammi\footer_experience.gif"
artifact_dir = r"C:\Users\KANIMOZHI\.gemini\antigravity\brain\6ff27cec-25f0-42d6-aef4-136c2fa30198"

frame_files = [
    "p07_1_01_collaboration_banner.png",
    "p07_1_02_contact_scrolled_to.png",
    "p07_1_03_information_and_wordmark.png",
    "p07_1_04_footer_transition_overview.png",
    "p07_1_05_direct_contact_footer.png",
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
    durations = [1600, 1400, 1800, 1600, 1400]
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
    dest_gif = os.path.join(artifact_dir, "footer_experience.gif")
    shutil.copy2(output_gif, dest_gif)
    print(f"Copied GIF to artifact dir: {dest_gif}")

# Copy all frame screenshots and multi-viewport images to artifact directory
for fname in os.listdir(frames_dir):
    if fname.endswith(".png"):
        src = os.path.join(frames_dir, fname)
        dst = os.path.join(artifact_dir, fname)
        shutil.copy2(src, dst)
        print(f"Copied artifact: {fname}")

