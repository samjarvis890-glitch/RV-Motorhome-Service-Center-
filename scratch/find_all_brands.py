import os, glob, re

patterns = [
    r'alt=[\"\']([^\"\']*(?:logo|brand)[^\"\']*)[\"\']',
    r'class=[\"\'][^\"\']*(?:brand|logo)[^\"\']*[\"\'][^>]*>(.*?)<',
    r'<title>(.*?)</title>',
    r'ROADREADY[^\<\n\r]+',
    r'RoadReady[^\<\n\r]+',
    r'Road Ready[^\<\n\r]+'
]

html_files = glob.glob('*.html') + glob.glob('*/*.html')

for h in sorted(html_files):
    with open(h, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Check for any other brand names or mismatches
    found = []
    for p in patterns:
        for m in re.finditer(p, text, re.IGNORECASE):
            s = m.group(0).strip()
            if len(s) < 80:
                found.append(s)
    
    # Print distinct
    print(f"=== {h} ===")
    for u in sorted(set(found))[:6]:
        print(" ", u)
