import glob, os, re

html_files = glob.glob('*.html')
image_usage = {}

for html in html_files:
    with open(html, 'r', encoding='utf-8') as f:
        content = f.read()
    imgs = re.findall(r'assets/images/[a-zA-Z0-9_\-\./]+\.(?:jpg|jpeg|png|webp)', content)
    for img in imgs:
        image_usage.setdefault(img, []).append(html)

for img, pages in sorted(image_usage.items()):
    print(f'{img} ({len(pages)} refs): {pages}')
