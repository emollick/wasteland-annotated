import sys; sys.path.insert(0, '.')
from vig import *

s = SVG(seed=23)
OUT = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/vignettes/london-bridge.svg'
ROAD = 96; SPRING = 118; WATER = 128
X0, X1 = 6, 194
# five elliptical arches of Haytor granite, the centre one widest, on piers with pointed cutwaters
spans = [30, 33, 37, 33, 30]; pier = 5.5
total = sum(spans) + pier * 4
x = (X0 + X1) / 2 - total / 2
arches = []
for sp in spans:
    arches.append((x, x + sp)); x += sp + pier
piers = [(arches[i][1], arches[i + 1][0]) for i in range(4)]

# ---- fog of a winter dawn: stipple thickening toward the far bank, and the City beyond in it ----
sky = rect(0, 10, 200, ROAD - 10)
s.stipple(sky, 1100, r=0.42, bbox=(0, 34, 200, ROAD), weight=lambda x, y: max(0.0, min(1.0, (y - 40) / 50)) ** 1.5)
# the City beyond, faint in it: roofs and chimneys, the Monument's column, St Magnus's steeple by the bridge foot
SK = 0.3
def steeple(cx, base):
    w = 7
    s.path(rect(cx - w / 2, base - 36, w, 36), sw=SK)
    s.path(M(cx - w / 2 - 0.8, base - 36) + L(cx + w / 2 + 0.8, base - 36), sw=SK)
    s.path(rect(cx - 2.4, base - 44, 4.8, 8), sw=SK)
    s.path(M(cx - 3, base - 44) + f"C{f(cx - 3)} {f(base - 49)} {f(cx + 3)} {f(base - 49)} {f(cx + 3)} {f(base - 44)}", sw=SK)
    s.path(rect(cx - 1.2, base - 52, 2.4, 3.5), sw=SK)
    s.path(M(cx - 1.2, base - 52) + L(cx, base - 60) + L(cx + 1.2, base - 52), sw=SK)
    s.path(M(cx, base - 60) + L(cx, base - 63), sw=SK)
def monument(cx, base):
    s.path(rect(cx - 3.5, base - 9, 7, 9), sw=SK)
    s.path(rect(cx - 1.9, base - 50, 3.8, 41), sw=SK)
    s.path(M(cx - 2.6, base - 50) + L(cx + 2.6, base - 50), sw=SK)
    s.path(rect(cx - 2.4, base - 55, 4.8, 5), sw=SK)
    s.path(M(cx - 1.2, base - 55) + "c0 -2 1 -2.5 1.2 -4.5c0.2 2 1.2 2.5 1.2 4.5", sw=SK)
def roofs(x0, x1, base, seed):
    r = random.Random(seed); x = x0
    while x < x1:
        w = r.uniform(8, 16); h = r.uniform(6, 14)
        s.path(M(x, base) + L(x, base - h) + L(x + w * 0.5, base - h - r.uniform(2, 5)) + L(x + w, base - h) + L(x + w, base), sw=SK)
        if r.random() < 0.7:
            cx = x + w * r.uniform(0.2, 0.8)
            s.path(M(cx - 0.8, base - h - 1) + L(cx - 0.8, base - h - 5) + L(cx + 0.8, base - h - 5) + L(cx + 0.8, base - h - 1), sw=SK)
        x += w + r.uniform(0, 3)
import random
roofs(118, 200, ROAD - 4, 2)
roofs(0, 60, ROAD - 4, 9)
monument(150, ROAD - 6)
steeple(178, ROAD - 4)
# ---- the crowd, so many, seen above the parapet ----
xs = []
x = X0 + 2
while x < X1 - 2:
    xs.append(x); x += 3.3 + s.rng.uniform(-0.6, 0.9)
above = s.clip(rect(0, 0, 200, ROAD - 3.2))
crowd = []
for i, xx in enumerate(xs):
    h = 7.6 + s.rng.uniform(-0.7, 0.7)
    d = cityman(xx, ROAD + 0.4, h=h, dir=1, step=s.rng.uniform(-1, 1), bow=s.rng.uniform(0.4, 1.0))
    crowd.append(d)
s.add(f'<g clip-path="url(#{above})">')
for i, d in enumerate(crowd):
    if i % 5 == 2:
        s.path(d, sw=0.4); s.hatch(d, angle=70, spacing=0.45, sw=0.3, bbox=(xs[i] - 4, ROAD - 12, xs[i] + 4, ROAD + 1))
    else:
        s.fill(d)
s.add('</g>')
# the open parapet of 1904 on its granite corbels: rails and a run of balusters
s.path(M(X0 - 2, ROAD - 3.2) + L(X1 + 2, ROAD - 3.2), sw=1.0, cap="butt")
s.path(M(X0 - 2, ROAD) + L(X1 + 2, ROAD), sw=0.7, cap="butt")
x = X0
while x < X1:
    s.path(M(x, ROAD - 2.6) + L(x, ROAD - 0.4), sw=0.55, cap="butt"); x += 1.5
# cornice and corbels
s.path(M(X0 - 2, ROAD + 2.2) + L(X1 + 2, ROAD + 2.2), sw=1.4, cap="butt")
x = X0 + 1
while x < X1:
    s.path(M(x, ROAD + 2.9) + L(x, ROAD + 5.2) + L(x + 1.2, ROAD + 5.2), sw=0.5, cap="butt"); x += 3
s.path(M(X0 - 2, ROAD + 5.6) + L(X1 + 2, ROAD + 5.6), sw=0.6, cap="butt")
# lamp standards cast from Peninsular War cannon, one over each pier and at the ends
for lx in [X0 + 3] + [(p0 + p1) / 2 for p0, p1 in piers] + [X1 - 3]:
    s.path(M(lx, ROAD - 3.2) + L(lx, ROAD - 12), sw=0.9, cap="butt")
    s.path(poly([(lx - 1.6, ROAD - 12), (lx + 1.6, ROAD - 12), (lx + 1.2, ROAD - 16), (lx, ROAD - 17.2), (lx - 1.2, ROAD - 16)], True), sw=0.6)
    s.path(M(lx - 1.2, ROAD - 12.6) + L(lx + 1.2, ROAD - 15.4) + M(lx + 1.2, ROAD - 12.6) + L(lx - 1.2, ROAD - 15.4), sw=0.3)

# ---- the spandrels, the arches, the piers ----
face = rect(X0, ROAD + 5.6, X1 - X0, SPRING + 8 - ROAD - 5.6)
s.path(M(X0, ROAD + 5.6) + L(X0, WATER + 4) + M(X1, ROAD + 5.6) + L(X1, WATER + 4), sw=1.0)
tone(s, face, 1, bbox=(X0, ROAD, X1, WATER + 6), angle=0)
# ashlar courses
yy = ROAD + 9.5
while yy < SPRING + 8:
    s.path(M(X0, yy) + L(X1, yy), sw=0.35, cap="butt", extra='stroke-dasharray="7 2.5"'); yy += 3.6
for i, (a0, a1) in enumerate(arches):
    rise = 0.36 * (a1 - a0) * (1.0 if i == 2 else 0.95)
    mid = (a0 + a1) / 2
    ring = (M(a0, WATER + 3) + L(a0, SPRING) + f"A{f((a1 - a0) / 2)} {f(rise)} 0 0 1 {f(a1)} {f(SPRING)}" + L(a1, WATER + 3) + "Z")
    tone(s, ring, 3, bbox=(a0, SPRING - rise - 1, a1, WATER + 4), angle=50)
    s.path(ring, sw=0.7)
    s.hatch(poly([(a0 + 2, WATER - 3), (a1 - 2, WATER - 3), (a1 - 2, WATER + 3), (a0 + 2, WATER + 3)], True), angle=0, spacing=1.4, sw=0.7, bbox=(a0, WATER - 4, a1, WATER + 4), stroke=INK) if False else None
    s.path(M(a0 - 2, SPRING) + f"A{f((a1 - a0) / 2 + 2)} {f(rise + 2)} 0 0 1 {f(a1 + 2)} {f(SPRING)}", sw=0.9)
    # voussoirs
    for k in range(1, 12):
        t = k / 12
        ang = math.pi * (1 - t)
        px, py = mid + ((a1 - a0) / 2) * math.cos(ang), SPRING - rise * math.sin(ang)
        qx, qy = mid + ((a1 - a0) / 2 + 2.4) * math.cos(ang), SPRING - (rise + 2.4) * math.sin(ang)
        s.path(M(px, py) + L(qx, qy), sw=0.4, cap="butt")
    # light through the arch, at the water: the far side seen through
    s.path(M(a0 + 3, WATER + 1.5) + L(a1 - 3, WATER + 1.5), sw=0.9, stroke=PAPER) if False else None
for p0, p1 in piers:
    s.path(rect(p0, SPRING - 6, p1 - p0, WATER + 6 - SPRING + 6), sw=0.8)
    s.path(M(p0, SPRING - 6) + L((p0 + p1) / 2, SPRING - 10) + L(p1, SPRING - 6), sw=0.8)   # cutwater cap
    s.hatch(rect(p0 + (p1 - p0) * 0.55, SPRING - 6, (p1 - p0) * 0.45, WATER + 12 - SPRING), angle=90, spacing=0.8, sw=0.4, bbox=(p0, SPRING - 8, p1, WATER + 8))
# arch soffits catch a little light: a thin unfilled crescent under each ring
for i, (a0, a1) in enumerate(arches):
    rise = 0.36 * (a1 - a0) * (1.0 if i == 2 else 0.95)
    s.path(M(a0 + 1.2, SPRING + 1) + f"A{f((a1 - a0) / 2 - 1.2)} {f(rise - 1.2)} 0 0 1 {f(a1 - 1.2)} {f(SPRING + 1)}", sw=0.5, stroke=PAPER, op=0) if False else None

# ---- the river: broken horizontal strokes, the piers' reflections ----
s.water(WATER + 6, 178, x0=4, x1=196, sw=(0.45, 0.6), step=2.4, grow=0.05, seed_len=(4, 14), gap=(2, 7))
for p0, p1 in piers:
    s.hatch(poly([(p0 + 0.5, WATER + 6), (p1 - 0.5, WATER + 6), (p1 + 1, WATER + 26), (p0 - 1, WATER + 26)], True), angle=90, spacing=1.0, sw=0.5, bbox=(p0 - 2, WATER, p1 + 2, WATER + 28), end_jitter=6)
print(OUT, s.save(OUT, "The crowd on London Bridge"), "bytes")
