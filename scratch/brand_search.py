import glob, re

files = ['login.html'] + glob.glob('dashboard/*.html')

for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    
    # find all occurrences of words near 'portal', 'dashboard', 'service', 'center', 'road'
    matches = re.findall(r'(?:[A-Za-z0-9&]+[\s\-\'\.]+){0,3}(?:RoadReady|Road Ready|RV Care|RV Service|Service Center|Owner Portal|Certified Portal)(?:[\s\-\'\.]+[A-Za-z0-9&]+){0,3}', c)
    unique_matches = set(m.strip() for m in matches if len(m.strip()) > 3)
    print(f"=== {f} ===")
    for u in sorted(unique_matches):
        if any(w in u for w in ['RoadReady', 'Road Ready', 'RV Care', 'Portal', 'Center']):
            print("  ", u)
