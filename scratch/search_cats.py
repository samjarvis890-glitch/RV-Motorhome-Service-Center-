import urllib.request
import urllib.parse
import json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) RoadReadyRV/1.0'}

def get_category_files(cat_name, limit=20):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=categorymembers&gcmtitle=Category:{urllib.parse.quote(cat_name)}&gcmnamespace=6&gcmlimit={limit}&prop=imageinfo&iiprop=url|size|mime"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for k, v in pages.items():
                ii = v.get('imageinfo', [{}])[0]
                if ii.get('mime') == 'image/jpeg' and ii.get('width', 0) >= 1500:
                    print(f"{v.get('title')} ({ii.get('width')}x{ii.get('height')})")
                    print(f"  {ii.get('url')}")
    except Exception as e:
        print(f"Error in {cat_name}: {e}")

print("=== Category:Class A motorhomes ===")
get_category_files("Class A motorhomes", 20)

print("\n=== Category:Recreational vehicles ===")
get_category_files("Recreational vehicles", 20)

print("\n=== Category:Motorhomes in the United States ===")
get_category_files("Motorhomes in the United States", 20)
