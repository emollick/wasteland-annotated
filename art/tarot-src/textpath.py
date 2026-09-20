#!/usr/bin/env python3
"""Set a string in a font and return it as an SVG path (no font dependency).
usage: textpath.py --font F --size S [--tracking T] [--smallcaps] [--sc-scale 0.78] "TEXT"
prints JSON {"d": "...", "width": w, "ascent": a, "descent": d}
Coordinates: baseline at y=0, x from 0; y grows downward (SVG)."""
import sys, json, argparse
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import RecordingPen

def shape(fontpath, text, size, tracking=0.0, features=None):
    blob = hb.Blob.from_file_path(fontpath)
    face = hb.Face(blob)
    font = hb.Font(face)
    upm = face.upem
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf, features or {"kern": True, "liga": False})
    tt = TTFont(fontpath)
    gs = tt.getGlyphSet()
    order = tt.getGlyphOrder()
    scale = size / upm
    x = 0.0
    paths = []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        gname = order[info.codepoint]
        pen = SVGPathPen(gs, ntos=lambda v: ("%.2f" % v).rstrip('0').rstrip('.'))
        tpen = TransformPen(pen, (scale, 0, 0, -scale, x + pos.x_offset*scale, -pos.y_offset*scale))
        gs[gname].draw(tpen)
        d = pen.getCommands()
        if d:
            paths.append(d)
        x += pos.x_advance*scale + tracking
    if text:
        x -= tracking
    return " ".join(paths), x

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--font', required=True)
    ap.add_argument('--size', type=float, required=True)
    ap.add_argument('--tracking', type=float, default=0.0)
    ap.add_argument('--smallcaps', action='store_true')
    ap.add_argument('--sc-scale', type=float, default=0.78)
    ap.add_argument('text')
    a = ap.parse_args()
    if not a.smallcaps:
        d, w = shape(a.font, a.text, a.size, a.tracking)
        print(json.dumps({"d": d, "width": round(w, 3)}))
        return
    # synthesized small caps: runs of caps at full size, runs of lowercase as caps at sc-scale
    runs = []
    for ch in a.text:
        kind = 'small' if ch.islower() else 'full'
        if runs and runs[-1][0] == kind:
            runs[-1][1] += ch
        else:
            runs.append([kind, ch])
    x = 0.0
    parts = []
    for kind, s in runs:
        size = a.size if kind == 'full' else a.size * a.sc_scale
        d, w = shape(a.font, s.upper(), size, a.tracking)
        if d:
            parts.append((x, d))
        x += w + a.tracking
    x -= a.tracking
    # combine by translating each run: wrap in path with transform is heavier; instead re-shape with offsets
    # simple approach: emit as group of paths with transforms
    out = []
    for ox, d in parts:
        out.append({"x": round(ox, 3), "d": d})
    print(json.dumps({"runs": out, "width": round(x, 3)}))

if __name__ == '__main__':
    main()
