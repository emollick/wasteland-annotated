#!/usr/bin/env python3
"""Search inside the scanned books on archive.org through Open Library.
usage: ol.py "phrase" [--in IDENT_SUBSTR] [--limit N]
Prints: identifier | title | creator | year | leaf(s) | snippet
The leaf number is the scan's page index, not the printed page number."""
import sys, json, time, urllib.parse, urllib.request, argparse
ap = argparse.ArgumentParser()
ap.add_argument("q")
ap.add_argument("--in", dest="inid", default=None, help="only hits whose identifier contains this")
ap.add_argument("--limit", type=int, default=20)
ap.add_argument("--raw", action="store_true")
a = ap.parse_args()
q = a.q
url = "https://openlibrary.org/search/inside.json?" + urllib.parse.urlencode({"q": q, "limit": a.limit})
data = None
for i in range(4):
    try:
        with urllib.request.urlopen(url, timeout=60) as r:
            data = json.load(r)
        break
    except Exception as e:
        err = e; time.sleep(2 + 2*i)
if data is None:
    print("FAILED:", err); sys.exit(1)
hits = data.get("hits", {}).get("hits", [])
print(f"total hits: {data.get('hits',{}).get('total')}  (showing {len(hits)})")
for h in hits:
    f = h.get("fields", {})
    ident = (f.get("identifier") or [""])[0]
    if a.inid and a.inid not in ident:
        continue
    title = (f.get("meta_title") or [""])[0]
    creator = (f.get("meta_creator") or [""])[0]
    year = (f.get("meta_year") or [""])[0]
    pages = f.get("page_num") or []
    pages = [p[0] if isinstance(p, list) else p for p in pages]
    snips = h.get("highlight", {}).get("text", [])
    print(f"--- {ident} | {title} | {creator} | {year} | leaf {pages}")
    for s in snips[:3]:
        print("    ", s.replace("\n", " ")[:400])
    if a.raw:
        print(json.dumps(h)[:1500])
