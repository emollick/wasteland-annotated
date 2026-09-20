import sys; sys.path.insert(0, '.')
from vig import *
s = SVG(seed=97)
OUT = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/vignettes/richmond.svg'
WATER = 140
# ---- Richmond Hill rising beyond, the Terrace on its crest, trees ----
hill = M(0, 110) + "C40 100 90 84 150 74 C170 71 190 66 200 62" + "L200 130 L0 130Z"
s.path(M(0, 110) + "C40 100 90 84 150 74 C170 71 190 66 200 62", sw=0.4)
s.hatch(hill, angle=-12, spacing=3.6, sw=0.2, bbox=(0, 60, 200, 130), end_jitter=30, jitter=0.5)
for (tx, ty, r_) in ((30, 104, 6), (58, 96, 8), (96, 88, 7), (130, 80, 9), (166, 72, 7)):
    s.path(circle_path(tx, ty - r_ * 0.4, r_), sw=0.45); s.hatch(circle_path(tx, ty - r_ * 0.4, r_), angle=45, spacing=1.6, sw=0.25, bbox=(tx - r_, ty - 2 * r_, tx + r_, ty + r_))
    s.path(M(tx, ty + 2) + L(tx, ty - r_ * 0.2), sw=0.5, cap="butt")
for (hx, hy) in ((150, 66), (159, 63.5), (168, 61)):
    s.path(poly([(hx, hy + 7), (hx, hy), (hx + 4, hy - 2.6), (hx + 8, hy), (hx + 8, hy + 7)], True), sw=0.4)
    s.path(M(hx + 2, hy + 7) + L(hx + 2, hy + 2.5) + M(hx + 5.5, hy + 7) + L(hx + 5.5, hy + 2.5), sw=0.3)
# ---- the bridge: five elliptical arches of Portland stone, humpbacked, balustraded ----
spans = [24, 32, 42, 32, 24]; pier = 5.5
x = 100 - (sum(spans) + 4 * pier) / 2
arches = []
for sp in spans:
    arches.append((x, x + sp)); x += sp + pier
X0, X1 = arches[0][0] - 4, arches[-1][1] + 4
def deck(xx):     # the road rises to the centre
    return 106 + 8 * ((xx - 100) / 90) ** 2
segs = []
xx = X0
prev = (xx, deck(xx))
while xx < X1:
    xx += 4; segs.append((prev[0], prev[1], xx, deck(xx))); prev = (xx, deck(xx))
s.multi(segs, sw=1.2)
segs = []; xx = X0
prev = (xx, deck(xx) + 4.2)
while xx < X1:
    xx += 4; segs.append((prev[0], prev[1], xx, deck(xx) + 4.2)); prev = (xx, deck(xx) + 4.2)
s.multi(segs, sw=0.7)
segs = []; xx = X0 + 1
while xx < X1:
    segs.append((xx, deck(xx) + 0.6, xx, deck(xx) + 3.8)); xx += 1.6
s.multi(segs, sw=0.45)
segs = []; xx = X0
prev = (xx, deck(xx) + 7)
while xx < X1:
    xx += 4; segs.append((prev[0], prev[1], xx, deck(xx) + 7)); prev = (xx, deck(xx) + 7)
s.multi(segs, sw=1.0)
for i, (a0, a1) in enumerate(arches):
    sp = a1 - a0; mid = (a0 + a1) / 2
    rise = sp * (0.42 if i == 2 else 0.36)
    spring = WATER - 2
    ring = M(a0, WATER + 2) + L(a0, spring) + f"A{f(sp / 2)} {f(rise)} 0 0 1 {f(a1)} {f(spring)}" + L(a1, WATER + 2) + "Z"
    s.hatch(ring, angle=50, spacing=1.2, sw=0.4, bbox=(a0, spring - rise - 1, a1, WATER + 3))
    s.path(ring, sw=0.7)
    s.path(M(a0 - 2, spring) + f"A{f(sp / 2 + 2)} {f(rise + 2)} 0 0 1 {f(a1 + 2)} {f(spring)}", sw=0.9)
    for k in range(1, 10):
        ang = math.pi * (1 - k / 10)
        s.path(M(mid + (sp / 2) * math.cos(ang), spring - rise * math.sin(ang)) + L(mid + (sp / 2 + 2.2) * math.cos(ang), spring - (rise + 2.2) * math.sin(ang)), sw=0.4, cap="butt")
    if i < 4:
        p0, p1 = a1, a1 + pier
        s.path(rect(p0, spring - 4, pier, WATER + 2 - spring + 4), sw=0.7)
        s.path(M(p0, spring - 4) + L(p0 + pier / 2, spring - 7) + L(p1, spring - 4), sw=0.7)
        s.hatch(rect(p0 + pier * 0.55, spring - 4, pier * 0.45, WATER + 6 - spring), angle=90, spacing=0.8, sw=0.4, bbox=(p0, spring - 6, p1, WATER + 4))
face = poly([(X0, deck(X0) + 7), (X1, deck(X1) + 7), (X1, WATER - 2), (X0, WATER - 2)], True)
s.hatch(face, angle=0, spacing=2.6, sw=0.22, bbox=(X0, 100, X1, WATER))
# ---- willows at the near bank, the river, a narrow canoe ----
s.water(WATER + 4, 182, x0=2, x1=198, sw=(0.4, 0.55), step=2.6, grow=0.06, seed_len=(5, 16), gap=(3, 9))
for (a0, a1) in arches:
    s.hatch(poly([(a0 + 3, WATER + 4), (a1 - 3, WATER + 4), (a1 - 6, WATER + 14), (a0 + 6, WATER + 14)], True), angle=90, spacing=1.8, sw=0.35, bbox=(a0, WATER, a1, WATER + 16), end_jitter=5)
wx, wy = 14, WATER + 2
s.path(M(wx, wy) + L(wx + 3, wy - 34), sw=1.2)
for k in range(9):
    x0 = wx + 3 + k * 1.2 - 4
    s.path(M(x0, wy - 34 + k * 2) + f"q{f(6 + k * 1.5)} 6 {f(4 + k * 2.2)} {f(24 + k * 1.4)}", sw=0.5)
cx, cy = 104, 160
canoe = M(cx - 36, cy - 4) + f"Q{f(cx - 10)} {f(cy + 4)} {f(cx + 12)} {f(cy + 3.6)}" + f"Q{f(cx + 30)} {f(cy + 3)} {f(cx + 38)} {f(cy - 4.5)}" + f"Q{f(cx + 12)} {f(cy - 1)} {f(cx - 36)} {f(cy - 4)}Z"
s.fill(canoe)
s.path(M(cx - 34, cy - 4.2) + f"Q{f(cx)} {f(cy - 1.8)} {f(cx + 36)} {f(cy - 4.6)}", sw=0.5, stroke=PAPER) if False else None
# a paddler kneeling aft, the paddle in the water; someone lying forward, knees up, a hat over the face
px, py = cx + 22, cy - 3.6
s.fill(poly([(px - 3, py), (px - 3.2, py - 3), (px - 4, py - 5.4), (px - 3, py - 8.4), (px - 1.6, py - 9.4), (px - 1.2, py - 10.6), (px - 2.4, py - 10.8), (px - 2.4, py - 11.3), (px - 0.6, py - 11.6),
             (px + 0.4, py - 13), (px + 2, py - 12.8), (px + 2.6, py - 11.6), (px + 2.6, py - 11.1), (px + 1.4, py - 11), (px + 1.2, py - 9.6), (px + 3.4, py - 8), (px + 3.6, py - 4.6), (px + 3, py)], True))
s.path(M(px + 3, py - 7.6) + L(px + 12, py + 8), sw=1.1, cap="round")
s.fill(poly([(px + 11, py + 6), (px + 15, py + 12.4), (px + 12.4, py + 13.4), (px + 9.4, py + 8.4)], True))
lx, ly = cx - 8, cy - 3.6
s.fill(poly([(lx - 18, ly), (lx - 18, ly - 2.4), (lx - 12, ly - 3.6), (lx - 6, ly - 3.2), (lx - 2, ly - 8.6), (lx + 1, ly - 8.6), (lx + 4, ly - 3.4), (lx + 8, ly - 2.8), (lx + 8, ly)], True))
s.path(M(lx - 20, ly - 4.8) + "q4 -3 8 0", sw=0.9)
s.hatch(poly([(cx - 32, cy + 4), (cx + 32, cy + 4), (cx + 26, cy + 12), (cx - 26, cy + 12)], True), angle=90, spacing=2.0, sw=0.35, bbox=(cx - 34, cy, cx + 34, cy + 14), end_jitter=4)
print(OUT, s.save(OUT, "A narrow canoe by Richmond"), "bytes")
