import hashlib
import glob
import re
import os

html_files = glob.glob('*.html')
used_images = set()

for html in html_files:
    with open(html, 'r', encoding='utf-8') as f:
        content = f.read()
    imgs = re.findall(r'assets/images/[a-zA-Z0-9_\-\./]+\.(?:jpg|jpeg|png|webp)', content)
    for img in imgs:
        used_images.add(img)

hashes = {}
duplicates = []

for img_rel in sorted(used_images):
    if not os.path.exists(img_rel):
        print(f"MISSING FILE: {img_rel}")
        continue
    with open(img_rel, 'rb') as f:
        h = hashlib.md5(f.read()).hexdigest()
    if h in hashes:
        duplicates.append((img_rel, hashes[h]))
    else:
        hashes[h] = img_rel

if duplicates:
    print("Found duplicate image files:")
    for d1, d2 in duplicates:
        print(f"  {d1} is identical to {d2}")
else:
    print("SUCCESS: All used image files have unique content (0 duplicates)!")
