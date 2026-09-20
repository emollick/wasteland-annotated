import sys; sys.path.insert(0, '.')
from vig import *
s = SVG(seed=113)
OUT = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/vignettes/highbury.svg'
G = 162
# ---- dusty plane trees along the road, and the dust ----
def plane(x, base, h, r_):
    trunk = poly([(x - 2.2, base), (x - 1.6, base - h * 0.55), (x + 1.6, base - h * 0.55), (x + 2.4, base)], True)
    s.path(trunk, sw=0.7)
    for k in range(6):   # the flaking bark
        yy = base - 3 - k * (h * 0.5 / 6)
        s.path(M(x - 1.2 + s.rng.uniform(-0.6, 0.6), yy) + f"l{f(s.rng.uniform(0.8, 1.8))} 0", sw=1.2, cap="butt")
    cy = base - h * 0.55 - r_ * 0.6
    can = ""
    for k in range(9):
        a = math.radians(k * 40); rr = r_ * s.rng.uniform(0.75, 1.1)
        can += (M(x + rr * math.cos(a), cy + rr * 0.85 * math.sin(a)) if k == 0 else L(x + rr * math.cos(a), cy + rr * 0.85 * math.sin(a)))
    can += "Z"
    s.path(can, sw=0.6); s.hatch(can, angle=40, spacing=1.7, sw=0.32, bbox=(x - r_ - 2, cy - r_, x + r_ + 2, cy + r_), end_jitter=3)
    s.hatch(can, angle=40, spacing=1.7, sw=0.32, bbox=(x, cy - r_, x + r_ + 2, cy + r_), phase=0.85)
    s.path(M(x, base - h * 0.55) + L(x - 4, cy + 2) + M(x, base - h * 0.5) + L(x + 5, cy + 4), sw=0.5)
TX0, TX1 = 46, 150; UP, MID, LOW = 96, 118, 142
front = side_face(TX0, UP, LOW + 4, 0, 26)
body = rect(TX0, UP, TX1 - TX0, LOW + 4 - UP)
roof = M(TX0 - 2, UP) + f"Q{f(TX0 - 1)} {f(UP - 5)} {f(TX0 + 8)} {f(UP - 5)}" + L(TX1 - 8, UP - 5) + f"Q{f(TX1 + 1)} {f(UP - 5)} {f(TX1 + 2)} {f(UP)}Z"
under = rect(TX0 - 1, LOW - 2, TX1 - TX0 + 2, 6)
sil = body + front + roof + under + rect(TX0 + 44, UP - 4, 16, 3.4) + rect(TX0 + 63, UP - 4, 8, 3.4)
kc = clip_evenodd(s, rect(0, 0, 200, 200) + sil)
s.add(f'<g clip-path="url(#{kc})">')
plane(34, G - 4, 62, 20); plane(112, G - 5, 70, 22); plane(176, G - 4, 58, 18)
s.stipple(rect(0, G - 40, 200, 40), 420, r=0.4, bbox=(0, G - 40, 200, G), weight=lambda x, y: ((y - (G - 40)) / 40) ** 1.5)
s.add('</g>')
# ---- the tram: a double-decker of the County Council's E/1 class on the conduit tracks ----
s.path(front, sw=0.9); tone(s, front, 2, bbox=(30, 80, 48, 150), angle=30)
s.path(body, sw=1.0)
roof = M(TX0 - 2, UP) + f"Q{f(TX0 - 1)} {f(UP - 5)} {f(TX0 + 8)} {f(UP - 5)}" + L(TX1 - 8, UP - 5) + f"Q{f(TX1 + 1)} {f(UP - 5)} {f(TX1 + 2)} {f(UP)}Z"
s.path(roof, sw=0.9); s.hatch(roof, angle=0, spacing=1.2, sw=0.35, bbox=(TX0 - 2, UP - 6, TX1 + 2, UP))
s.path(M(TX0, MID) + L(TX1, MID), sw=1.1, cap="butt")
s.path(M(TX0, MID - 3) + L(TX1, MID - 3), sw=0.5, cap="butt")
# windows on both decks, with heads in some of them
for k in range(7):
    wx = TX0 + 5 + k * 14.2
    for (y0, y1) in ((UP + 3, MID - 5), (MID + 4, LOW - 2)):
        w = rect(wx, y0, 10.4, y1 - y0); s.path(w, sw=0.5); s.hatch(w, angle=62, spacing=1.0, sw=0.35, bbox=(wx, y0, wx + 11, y1))
        if s.rng.random() < 0.6:
            hx = wx + s.rng.uniform(3, 7.5); hy = y1 - 2
            s.fill(poly([(hx - 2.6, hy), (hx - 2.2, hy - 3), (hx - 1, hy - 3.8), (hx - 1.2, hy - 5.2), (hx - 0.4, hy - 6), (hx + 0.9, hy - 6), (hx + 1.5, hy - 5.2), (hx + 1.2, hy - 3.8), (hx + 2.4, hy - 3), (hx + 2.8, hy)], True))
# the route number box and the destination board, blank
s.path(rect(TX0 + 44, UP - 4, 16, 3.4), sw=0.5); s.path(rect(TX0 + 63, UP - 4, 8, 3.4), sw=0.5)
# the stairs at the end, the driver's platform, the lifeguard and trucks
s.path(M(TX0 + 2, MID + 2) + L(TX0 + 10, UP + 4), sw=0.6)
s.path(rect(TX0 - 1, LOW - 2, TX1 - TX0 + 2, 6), sw=0.8); s.hatch(rect(TX0 - 1, LOW - 2, TX1 - TX0 + 2, 6), angle=0, spacing=1.0, sw=0.35, bbox=(TX0 - 1, LOW - 2, TX1 + 1, LOW + 4))
for bx in (TX0 + 20, TX1 - 20):
    s.path(rect(bx - 11, LOW + 3, 22, 4), sw=0.6)
    for wx in (bx - 6, bx + 6):
        s.path(circle_path(wx, LOW + 8, 4.2), sw=0.9); s.fill(circle_path(wx, LOW + 8, 1.4))
# the conduit track: two rails and the slot between, in the setts
s.path(M(2, G + 0.4) + L(198, G + 0.4) + M(2, G + 2.2) + L(198, G + 2.2), sw=0.8, cap="butt")
s.path(M(2, G + 1.3) + L(198, G + 1.3), sw=0.35, cap="butt", extra='stroke-dasharray="3 1.5"')
segs = []
yy = G + 5
while yy < G + 16:
    x = 2 + (int(yy) % 2) * 2
    while x < 198:
        segs.append((x, yy, x + 3.2, yy)); x += 4.6
    yy += 2.2
s.multi(segs, sw=0.3)
# the kerb, a lamp, one man waiting
s.path(M(2, G - 1.6) + L(198, G - 1.6), sw=0.6, cap="butt")
s.path(M(184, G - 2) + L(184, G - 40), sw=0.8, cap="butt")
s.path(poly([(181.5, G - 40), (186.5, G - 40), (186, G - 46), (184, G - 48), (182, G - 46)], True), sw=0.6)
s.fill(cityman(166, G - 1.6, h=13, dir=-1, step=0, bow=0.3))
print(OUT, s.save(OUT, "Trams and dusty trees at Highbury"), "bytes")
