import glob, os, re
from PIL import Image

html_files = glob.glob('*.html')
errors = []

for html in html_files:
    with open(html, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # check all img tags
    img_matches = re.finditer(r'<img\s+([^>]+)>', content)
    for m in img_matches:
        tag = m.group(0)
        src_m = re.search(r'src=[\"\']([^\"\']+)[\"\']', tag)
        if not src_m:
            errors.append(f"{html}: <img> without src: {tag[:60]}")
            continue
        src = src_m.group(1).split('#')[0].split('?')[0]
        if src.startswith('http'):
            continue
        if not os.path.exists(src):
            errors.append(f"{html}: Missing file: {src}")
            continue
        # check image size
        sz = os.path.getsize(src)
        if sz < 1000:
            errors.append(f"{html}: Image too small ({sz} bytes): {src}")
        # check if image can open
        if src.endswith(('.jpg', '.png', '.webp')):
            try:
                with Image.open(src) as im:
                    w, h = im.size
                    if w < 200 or h < 100:
                        errors.append(f"{html}: Low res {w}x{h}: {src}")
            except Exception as e:
                errors.append(f"{html}: Error opening {src}: {e}")

if errors:
    print(f"FAILED with {len(errors)} errors:")
    for e in errors:
        print(" ", e)
else:
    print(f"ALL CLEAR: Verified all {len(html_files)} HTML pages with 0 missing files and 0 low-res images!")
