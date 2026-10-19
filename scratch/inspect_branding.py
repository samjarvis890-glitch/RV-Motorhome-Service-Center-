import glob, os, re

files = ['login.html', 'register.html'] + glob.glob('dashboard/*.html') + glob.glob('admin-dashboard/*.html')

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check <title>
    title_m = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE | re.DOTALL)
    title = title_m.group(1).strip() if title_m else 'No title'
    
    # Check logo alt text and brand elements
    logos = re.findall(r'<img[^>]+(?:brand|logo)[^>]+>', content, re.IGNORECASE)
    brand_texts = re.findall(r'class=[\"\'][^\"\']*(?:brand|logo|app-name|site-name)[^\"\']*[\"\'][^>]*>(.*?)<', content, re.IGNORECASE)
    
    print(f"=== {fpath} ===")
    print(f"  Title: {title}")
    for l in logos[:2]:
        alt = re.search(r'alt=[\"\']([^\"\']+)[\"\']', l)
        src = re.search(r'src=[\"\']([^\"\']+)[\"\']', l)
        print(f"  Logo: src={src.group(1) if src else ''} | alt={alt.group(1) if alt else ''}")
    if brand_texts:
        print(f"  Brand elements: {brand_texts[:3]}")
