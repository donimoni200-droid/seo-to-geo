#!/usr/bin/env python3
"""Prep the SEO to GEO HQ logo:
- analyze the uploaded logo (border colors, background)
- create a transparent-background version at public/assets/brand/logo.png
- create a small header variant
"""
from PIL import Image
import os

SRC = "/home/z/my-project/upload/FINAL_seotogeohq_logo.png"
OUT_DIR = "/home/z/my-project/public/assets/brand"

im = Image.open(SRC).convert("RGB")
w, h = im.size
print(f"source: {w}x{h}")

# Sample border pixels
px = im.load()
samples = []
for x in range(0, w, max(1, w // 40)):
    for y in (0, 1, 2, h - 3, h - 2, h - 1):
        samples.append(px[x, y])
for y in range(0, h, max(1, h // 40)):
    for x in (0, 1, 2, w - 3, w - 2, w - 1):
        samples.append(px[x, y])
avg = tuple(sum(c[i] for c in samples) / len(samples) for i in range(3))
near_white = sum(1 for c in samples if min(c) > 245) / len(samples)
print(f"border avg color: {tuple(round(v) for v in avg)}, near-white fraction: {near_white:.2%}")

os.makedirs(OUT_DIR, exist_ok=True)

# --- Transparent version: convert near-white background to alpha ---
rgba = im.convert("RGBA")
data = rgba.getdata()
new_data = []
for r, g, b, a in data:
    # luminance-based: pure/near white -> transparent with soft edge
    if r > 247 and g > 247 and b > 247:
        new_data.append((255, 255, 255, 0))
    elif r > 238 and g > 238 and b > 238:
        # feather zone
        t = (min(r, g, b) - 238) / (247 - 238)
        alpha = int(255 * (1 - t))
        new_data.append((r, g, b, alpha))
    else:
        new_data.append((r, g, b, a))
rgba.putdata(new_data)
rgba.save(os.path.join(OUT_DIR, "logo.png"))
print("saved:", os.path.join(OUT_DIR, "logo.png"))

# --- Auto-crop tight bounding box (ignore transparent) ---
bbox = rgba.getbbox()
print("bbox:", bbox)
if bbox:
    cropped = rgba.crop(bbox)
    cropped.save(os.path.join(OUT_DIR, "logo-tight.png"))
    print("saved:", os.path.join(OUT_DIR, "logo-tight.png"), cropped.size)

# --- Header-size variant (tight, max 200px height, crisp) ---
if bbox:
    tight = cropped
    tight.thumbnail((400, 160), Image.LANCZOS)
    tight.save(os.path.join(OUT_DIR, "logo-header.png"))
    print("saved:", os.path.join(OUT_DIR, "logo-header.png"), tight.size)
