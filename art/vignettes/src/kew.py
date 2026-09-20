import sys; sys.path.insert(0, '.')
from vig import *
s = SVG(seed=131)
OUT = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/vignettes/kew.svg'
G = 168; CX = 100
# ---- the Great Pagoda: ten storeys, octagonal, each roof smaller than the last; no dragons in 1922 ----
y = G
for k in range(10):
    w = 46 - k * 2.6; h = 15.5 - k * 0.6
    fw = w * 0.42
    top = y - h
    front = rect(CX - fw / 2, top, fw, h)
    left = poly([(CX - w / 2, top + 1.2), (CX - fw / 2, top), (CX - fw / 2, y), (CX - w / 2, y)], True)
    right = poly([(CX + fw / 2, top), (CX + w / 2, top + 1.2), (CX + w / 2, y), (CX + fw / 2, y)], True)
    for face in (front, left, right): s.path(face, sw=0.6)
    s.hatch(right, angle=70, spacing=1.2, sw=0.35, bbox=(CX, top, CX + w / 2 + 1, y))
    s.hatch(left, angle=110, spacing=2.0, sw=0.25, bbox=(CX - w / 2 - 1, top, CX, y))
    # an arched opening on the front, a balcony rail at the foot of every storey but the first
    aw = fw * 0.42; ah = h * 0.55
    a = arch(CX - aw / 2, y - 2.2 - ah, aw, ah); s.path(a, sw=0.5); tone(s, a, 3, bbox=(CX - aw, y - 3 - ah, CX + aw, y), angle=60)
    if k > 0:
        ry0 = y - 2.6
        s.path(M(CX - w / 2 - 1.5, ry0) + L(CX + w / 2 + 1.5, ry0), sw=0.6, cap="butt")
        segs = []; xx = CX - w / 2 - 0.5
        while xx < CX + w / 2 + 1:
            segs.append((xx, ry0 + 0.4, xx, y - 0.2)); xx += 1.5
        s.multi(segs, sw=0.3)
    # the roof: eaves wider than the body, the corners lifting a little
    ew = w + 9; eh = 4.2 - k * 0.15
    roof = (M(CX - ew / 2, top + 1.6) + f"Q{f(CX - ew / 2 + 3)} {f(top - eh + 1.2)} {f(CX - w / 2 + 3)} {f(top - eh)}"
            + L(CX + w / 2 - 3, top - eh) + f"Q{f(CX + ew / 2 - 3)} {f(top - eh + 1.2)} {f(CX + ew / 2)} {f(top + 1.6)}"
            + f"Q{f(CX)} {f(top + 3.2)} {f(CX - ew / 2)} {f(top + 1.6)}Z")
    s.path(roof, sw=0.8); s.hatch(roof, angle=90, spacing=1.1, sw=0.3, bbox=(CX - ew / 2, top - eh - 1, CX + ew / 2, top + 4))
    s.hatch(roof, angle=0, spacing=1.6, sw=0.25, bbox=(CX - ew / 2, top - eh - 1, CX + ew / 2, top + 4))
    y = top - eh + 0.6
# the finial
s.path(M(CX, y) + L(CX, y - 7), sw=0.9, cap="butt"); s.fill(circle_path(CX, y - 8.2, 1.4))
s.path(M(CX - 2.4, y - 3.5) + L(CX + 2.4, y - 3.5), sw=0.6, cap="butt")
# the steps, the ground, and a couple of Kew's dark conifers
s.path(M(CX - 30, G) + L(CX + 30, G) + M(CX - 34, G + 2.6) + L(CX + 34, G + 2.6) + M(CX - 38, G + 5.2) + L(CX + 38, G + 5.2), sw=0.7, cap="butt")
for i, (x0, x1, yy) in enumerate([(8, 192, G + 8), (18, 182, G + 10.4)]):
    s.path(s.wobble([(x0, yy), (x1, yy)], amp=0.15, seg=6), sw=0.9 if i == 0 else 0.5)
def conifer(x, base, h, w):
    d = M(x, base - h)
    for k in range(5):
        t0, t1 = k / 5, (k + 1) / 5
        d += L(x + w * t1 * 0.55, base - h + h * t1 - 2) + L(x + w * t1 * 0.38, base - h + h * t1)
    d += L(x, base)
    for k in range(5, 0, -1):
        t1 = k / 5
        d += L(x - w * t1 * 0.38, base - h + h * t1) + L(x - w * t1 * 0.55, base - h + h * t1 - 2)
    d += "Z"
    s.path(d, sw=0.6); s.hatch(d, angle=70, spacing=0.9, sw=0.4, bbox=(x - w, base - h - 2, x + w, base))
conifer(36, G + 6, 34, 24); conifer(158, G + 6, 28, 20); conifer(176, G + 6, 40, 26)
print(OUT, s.save(OUT, "The Pagoda at Kew"), "bytes")
