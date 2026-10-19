import os
import re
import hashlib

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
dashboard_files = [os.path.join('dashboard', f) for f in os.listdir('dashboard') if f.endswith('.html')]
admin_files = [os.path.join('admin-dashboard', f) for f in os.listdir('admin-dashboard') if f.endswith('.html')]
all_files = html_files + dashboard_files + admin_files

img_pattern = re.compile(r'<img[^>]+src=["\']([^"\']+)["\']')

missing = []
used_images = {}

for f in all_files:
    folder = os.path.dirname(f)
    with open(f, encoding='utf-8') as fh:
        content = fh.read()
    for m in img_pattern.finditer(content):
        src = m.group(1)
        if src.startswith('http') or src.startswith('data:'):
            continue
        clean_src = src.split('?')[0]
        actual_path = os.path.normpath(os.path.join(folder, clean_src))
        if not os.path.exists(actual_path):
            missing.append((f, src, actual_path))
        else:
            used_images.setdefault(actual_path, []).append(f)

print(f"Total HTML files checked: {len(all_files)}")
print(f"Total distinct image files referenced: {len(used_images)}")
print(f"Missing images: {len(missing)}")
if missing:
    for m in missing:
        print("  MISSING:", m)
else:
    print("ALL 100% OF IMAGE REFERENCES EXIST ON DISK!")

# Check MD5 duplicates among photographic images (exclude logos and avatars)
md5_dict = {}
for p in used_images:
    if p.endswith('.svg') or 'avatar' in p or 'brand' in p:
        continue
    with open(p, 'rb') as f:
        h = hashlib.md5(f.read()).hexdigest()
    md5_dict.setdefault(h, []).append(p)

dupes = {h: paths for h, paths in md5_dict.items() if len(paths) > 1}
print(f"Duplicate image files across content: {len(dupes)}")
if dupes:
    for h, paths in dupes.items():
        print(f"  DUPLICATE MD5 {h}: {paths}")
else:
    print("ZERO DUPLICATES! ALL CONTENT IMAGES ARE 100% UNIQUE!")
