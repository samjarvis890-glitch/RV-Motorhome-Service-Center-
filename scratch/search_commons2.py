import urllib.request, urllib.parse, json

def search_commons(query, limit=20):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrlimit={limit}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers={"User-Agent": "RoadReadyRV/1.0 (info@roadready.com)"})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        pages = data.get("query", {}).get("pages", {})
        for pid, p in pages.items():
            title = p.get("title", "")
            ii = p.get("imageinfo", [{}])[0]
            url = ii.get("url", "")
            w = ii.get("width", 0)
            h = ii.get("height", 0)
            mime = ii.get("mime", "") or ""
            if "image" in mime and w >= 1200 and (title.lower().endswith(".jpg") or title.lower().endswith(".jpeg")):
                print(f"{title} | {w}x{h} | {url}")

print("=== SEARCH: mechanic vehicle inspection bay ===")
search_commons("mechanic vehicle inspection bay")
print("=== SEARCH: reception desk customer service ===")
search_commons("reception desk customer service office")
