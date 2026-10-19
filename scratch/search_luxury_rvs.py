import urllib.request
import urllib.parse
import json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) RoadReadyRV/1.0'}

categories = [
    "Morelo Reisemobile",
    "Concorde Reisemobile",
    "Niesmann+Bischoff",
    "Airstream trailers",
    "Hymer motorhomes",
    "Thor Motor Coach",
    "Fleetwood RV",
    "Monaco Coach",
    "Winnebago motor homes",
    "Prevost buses"
]

for cat in categories:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=categorymembers&gcmtitle=Category:{urllib.parse.quote(cat)}&gcmnamespace=6&gcmlimit=6&prop=imageinfo&iiprop=url|size|mime"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            print(f"=== Category: {cat} ({len(pages)} items) ===")
            for k, v in pages.items():
                ii = v.get('imageinfo', [{}])[0]
                if ii.get('mime') == 'image/jpeg' and ii.get('width', 0) >= 1500:
                    print(f"  {v.get('title')} ({ii.get('width')}x{ii.get('height')})")
                    print(f"    {ii.get('url')}")
    except Exception as e:
        print(f"Error for {cat}: {e}")
