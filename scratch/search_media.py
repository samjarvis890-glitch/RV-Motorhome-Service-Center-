import urllib.request
import urllib.parse
import json

def search_commons(query, limit=10):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit={limit}&prop=imageinfo&iiprop=url|size|mime"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) RoadReadyRV/1.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for k, v in pages.items():
                ii = v.get('imageinfo', [{}])[0]
                if ii.get('mime') == 'image/jpeg' and ii.get('width', 0) >= 1200:
                    print(f"{v.get('title')} ({ii.get('width')}x{ii.get('height')})")
                    print(f"  URL: {ii.get('url')}")
    except Exception as e:
        print('Error:', e)

print("=== Query: Winnebago motorhome ===")
search_commons("Winnebago motorhome", 8)

print("\n=== Query: luxury motorhome ===")
search_commons("luxury motorhome", 8)

print("\n=== Query: RV interior ===")
search_commons("RV interior", 8)
