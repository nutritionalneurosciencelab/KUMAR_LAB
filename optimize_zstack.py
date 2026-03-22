from PIL import Image, ImageEnhance, ImageSequence
import os

input_path = "lab_glia_zstack.gif"
output_path = "lab_glia_zstack_opt.gif"

print(f"Original size: {os.path.getsize(input_path) / 1024 / 1024:.2f} MB")

with Image.open(input_path) as im:
    frames = []
    
    # Extract duration from info if available
    duration = im.info.get('duration', 100)
    
    for i, frame in enumerate(ImageSequence.Iterator(im)):
        # Convert to RGBA to ensure consistent processing
        f = frame.convert("RGBA")
        
        # Increase brightness
        f = ImageEnhance.Brightness(f).enhance(1.3)
        
        # Resize to 75% to reduce file size significantly
        w, h = f.size
        new_w, new_h = int(w * 0.75), int(h * 0.75)
        f = f.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Determine number of colors to reduce size further (quantize)
        # Using fast octree quantization for gifs
        f = f.convert("P", palette=Image.ADAPTIVE, colors=128)
        
        frames.append(f)

    print(f"Processed {len(frames)} frames. Original dimensions: {w}x{h}, New dimensions: {new_w}x{new_h}")
    
    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        optimize=True,
        duration=duration,
        loop=0
    )

print(f"Optimized size: {os.path.getsize(output_path) / 1024 / 1024:.2f} MB")
