import urllib.request
import urllib.parse
import json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) RoadReadyRV/1.0'}

queries = [
    "campervan interior",
    "motorhome kitchen",
    "RV electrical panel",
    "camper battery system",
    "caravan interior modern",
    "Class A motorhome interior"
]

for q in queries:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size|mime"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            print(f"=== Query: {q} ===")
            for k, v in pages.items():
                ii = v.get('imageinfo', [{}])[0]
                if ii.get('mime') == 'image/jpeg' and ii.get('width', 0) >= 1500:
                    print(f"  {v.get('title')} ({ii.get('width')}x{ii.get('height')})")
                    print(f"    {ii.get('url')}")
    except Exception as e:
        print(f"Error for {q}: {e}")
