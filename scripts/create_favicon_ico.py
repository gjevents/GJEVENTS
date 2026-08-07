from pathlib import Path

try:
    from PIL import Image, ImageDraw
except ImportError as exc:
    raise SystemExit("Pillow is not installed. Install it with pip install Pillow.")

output = Path("dist/favicon.ico")
output.parent.mkdir(parents=True, exist_ok=True)
img = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)
draw.ellipse((4, 4, 124, 124), fill=(255, 88, 34, 255))
img.save(output, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128)])
print(f"favicon.ico created at {output.resolve()}")
