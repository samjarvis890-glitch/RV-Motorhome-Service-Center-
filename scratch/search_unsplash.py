import urllib.request, urllib.parse, json

def search_unsplash(query):
    url = f"https://unsplash.com/napi/search/photos?query={urllib.parse.quote(query)}&per_page=15"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            results = data.get("results", [])
            for r in results:
                desc = r.get("description") or r.get("alt_description") or ""
                photo_id = r.get("id")
                w = r.get("width")
                h = r.get("height")
                regular = r.get("urls", {}).get("regular")
                print(f"{photo_id} | {w}x{h} | {desc[:60]} | {regular}")
    except Exception as e:
        print("Error:", e)

print("=== rv repair mechanic ===")
search_unsplash("rv repair mechanic")
print("=== customer service reception desk ===")
search_unsplash("customer service reception desk modern")
