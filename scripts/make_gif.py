import os
import glob
from PIL import Image

frames_dir = 'C:/hashdammi/test_frames'
frame_files = sorted(glob.glob(os.path.join(frames_dir, 'frame_*.png')))

print(f"Found {len(frame_files)} frames.")
images = []

for f in frame_files:
    img = Image.open(f)
    # Resize down to 720x450 for compact animated recording
    img_resized = img.resize((720, 450), Image.Resampling.LANCZOS)
    images.append(img_resized)

if images:
    out_path = 'C:/hashdammi/shutter_transition_recording.gif'
    images[0].save(
        out_path,
        save_all=True,
        append_images=images[1:],
        duration=220,
        loop=0,
        optimize=True
    )
    print(f"Saved recording GIF to {out_path} ({os.path.getsize(out_path)} bytes)")

