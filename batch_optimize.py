import os
from PIL import Image

def optimize_images(directory, max_size_mb=1.0, max_dimension=1920, quality=80):
    for filename in os.listdir(directory):
        if not filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            continue

        filepath = os.path.join(directory, filename)
        file_size_mb = os.path.getsize(filepath) / (1024.0 * 1024.0)

        if file_size_mb > max_size_mb:
            try:
                print("Optimizing: {} ({:.2f} MB)".format(filename, file_size_mb))
                with Image.open(filepath) as img:
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGB")
                    
                    width, height = img.size
                    if width > max_dimension or height > max_dimension:
                        if width > height:
                            new_width = max_dimension
                            new_height = int((float(max_dimension) / width) * height)
                        else:
                            new_height = max_dimension
                            new_width = int((float(max_dimension) / height) * width)
                        
                        img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                        print("  Resized from {}x{} to {}x{}".format(width, height, new_width, new_height))

                    if filename.lower().endswith('.png'):
                        img.save(filepath, optimize=True)
                    else:
                        img.save(filepath, "JPEG", optimize=True, quality=quality)
                
                new_size_mb = os.path.getsize(filepath) / (1024.0 * 1024.0)
                print("  Done: {} -> {:.2f} MB".format(filename, new_size_mb))
            except Exception as e:
                print("  Error processing {}: {}".format(filename, e))

if __name__ == "__main__":
    optimize_images(r"s:\mk lab")
