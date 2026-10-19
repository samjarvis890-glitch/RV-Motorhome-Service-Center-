import urllib.request
import urllib.parse
import json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) RoadReadyRV/1.0'}

url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=motorhome+recreational+vehicle&srnamespace=14&srlimit=15"
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    for s in data.get('query', {}).get('search', []):
        print(s.get('title'))
