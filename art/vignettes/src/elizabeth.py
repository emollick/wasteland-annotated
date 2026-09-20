import sys; sys.path.insert(0, '.')
from vig import *

s = SVG(seed=61)
OUT = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/vignettes/elizabeth-and-leicester.svg'
WL = 138

# ---- the White Tower, left white against a toned sky, above the wharf wall ----
TX0, TX1, TY0, TY1 = 62, 150, 64, 116
TD = 70
keep = rect(TX0, TY0, TX1 - TX0, TY1 - TY0)
side = side_face(TX0, TY0, TY1, 0, TD)
tur = []
def turret(x, y, w, h, round_=False):
    body = rect(x, y, w, h)
    cap = M(x - 0.8, y) + f"C{f(x - 0.8)} {f(y - 4)} {f(x + w / 2)} {f(y - 6)} {f(x + w / 2)} {f(y - 8)}" + f"C{f(x + w / 2)} {f(y - 6)} {f(x + w + 0.8)} {f(y - 4)} {f(x + w + 0.8)} {f(y)}Z"
    return body, cap
# front turrets
tl = turret(TX0 - 1, TY0 - 8, 8, 8 + (TY1 - TY0)); tr = turret(TX1 - 7, TY0 - 8, 8, 8 + (TY1 - TY0))
bl = ob(TX0, TY0, TD)
tb = turret(bl[0] - 1, bl[1] - 6, 8, 6 + 14, round_=True)
sil = keep + side + tl[0] + tl[1] + tr[0] + tr[1] + tb[0] + tb[1]
sky = ellipse_path(104, 80, 92, 50)
cid = clip_evenodd(s, sky + sil)
s.hatch(sky, angle=0, spacing=2.4, sw=0.28, bbox=(8, 28, 200, WL), clip_id=cid, end_jitter=14)
# the tower's own lines, light: buttresses, small windows, parapet, cupolas with vanes
s.path(keep, sw=0.7); s.path(side, sw=0.6); s.hatch(side, angle=30, spacing=2.4, sw=0.3, bbox=(20, 20, 64, 118))
for bx in (TX0 + 24, TX0 + 44, TX0 + 64):
    s.path(M(bx, TY0 + 2) + L(bx, TY1), sw=0.4, cap="butt")
for k in range(3):
    yy = TY0 + 10 + k * 15
    for wx in (TX0 + 12, TX0 + 32, TX0 + 52, TX0 + 72):
        s.path(arch(wx, yy, 3.2, 6), sw=0.4)
for body, cap in (tl, tr, tb):
    s.path(body, sw=0.6); s.path(cap, sw=0.6)
for (cx, cy) in ((TX0 + 3, TY0 - 16), (TX1 - 3, TY0 - 16), (bl[0] + 3, bl[1] - 14)):
    s.path(M(cx, cy) + L(cx, cy - 4) + M(cx - 1.4, cy - 3.2) + L(cx + 1.4, cy - 3.2), sw=0.45)
s.path(M(TX0 - 1, TY0) + L(TX1 + 1, TY0), sw=0.8, cap="butt")
# the outer curtain wall along the wharf, battlemented, and the wharf itself
WY = 116
wall = rect(10, WY, 180, 12); s.path(wall, sw=0.7); s.hatch(wall, angle=0, spacing=1.7, sw=0.28, bbox=(10, WY, 190, WY + 12))
segs = ""
x = 10
while x < 190:
    segs += M(x, WY) + L(x, WY - 2.6) + L(x + 2.6, WY - 2.6) + L(x + 2.6, WY); x += 5.2
s.path(segs, sw=0.5, join="miter", cap="butt")
s.path(M(4, WY + 12) + L(196, WY + 12), sw=0.9, cap="butt")
s.path(M(4, WY + 14.5) + L(196, WY + 14.5), sw=0.4, cap="butt")

# ---- the brisk swell ----
swell(s, WL + 1, 184, step=4.2, w=7.5, amp=1.4, sw=0.42)

# ---- the barge: long and low, oars beating, the house aft under its canopy, the stern a gilded shell ----
hull = poly([(24, 128), (40, 127), (100, 126.4), (160, 126), (176, 125), (178, WL + 1.5), (160, WL + 3), (100, WL + 3.5), (40, WL + 3), (26, WL + 1)], True)
s.fill(hull)
s.path(M(26, 129.2) + "Q100 127.6 176 126.6", sw=0.5, stroke=GOLD)
# a beak at the bow with a pennant staff
s.fill(poly([(24, 128), (16, 124), (18, 128.6), (24, 130)], True))
s.path(M(18, 125) + L(18, 104), sw=0.7, cap="butt")
s.fill(poly([(18, 104), (38, 106.5), (18, 109.5)], True))
# rowers, a row of heads and shoulders above the gunwale, and the oars
for k in range(8):
    x = 38 + k * 8.4
    s.fill(poly([(x - 2.2, 126.6), (x - 1.8, 123.6), (x - 0.9, 122.6), (x - 0.9, 121.2), (x + 0.9, 121.2), (x + 0.9, 122.6), (x + 1.8, 123.6), (x + 2.2, 126.6)], True))
    dip = (k % 3 != 1)
    if dip:
        s.path(M(x + 1.5, 127) + L(x - 7, WL + 5), sw=0.9, cap="round")
    else:
        s.path(M(x + 1.5, 127) + L(x - 9, 132), sw=0.9, cap="round")
# the house: canopy on slender posts, hangings, the poop behind
HX0, HX1 = 108, 164
s.path(M(HX0 - 2, 106) + L(HX1 + 4, 105), sw=1.1, cap="butt")
s.path(poly([(HX0 - 2, 106), (HX1 + 4, 105), (HX1 + 4, 103), (HX0 - 2, 104)], True), sw=0.5)
for px in (HX0, HX0 + 14, HX0 + 28, HX0 + 42, HX1):
    s.path(M(px, 106) + L(px, 126.2), sw=0.7, cap="butt")
hang = rect(HX0 + 1, 106.5, 40, 19.5); s.hatch(hang, angle=90, spacing=1.5, sw=0.4, bbox=(HX0, 106, HX0 + 42, 126), end_jitter=3)
s.path(M(HX0 + 1, 112) + L(HX0 + 41, 112), sw=0.4, cap="butt")
# valance along the canopy
segs = ""
x = HX0 - 1
while x < HX1 + 3:
    segs += M(x, 106.2) + L(x + 1.2, 108.4) + L(x + 2.4, 106.1); x += 2.4
s.path(segs, sw=0.4, join="miter")
# the Queen and Lord Robert on the poop
qx, qy = 156, 126.4
s.fill(poly([(qx - 4.6, qy), (qx - 3.2, qy - 8), (qx - 1.5, qy - 11.6), (qx - 1.8, qy - 12.6), (qx - 0.9, qy - 13.4), (qx - 0.9, qy - 15.2), (qx + 0.9, qy - 15.2), (qx + 0.9, qy - 13.4), (qx + 1.8, qy - 12.6), (qx + 1.5, qy - 11.6), (qx + 3.2, qy - 8), (qx + 4.6, qy)], True))
s.path(M(qx - 2.6, qy - 12.4) + L(qx + 2.6, qy - 12.4), sw=0.7)        # ruff
lx, ly = 165, 126.2
s.fill(poly([(lx - 1.4, ly), (lx - 1.2, ly - 5), (lx - 3.2, ly - 6), (lx - 3.4, ly - 11.5), (lx - 1.8, ly - 13.2), (lx - 1.0, ly - 13.6), (lx - 0.8, ly - 14.8), (lx - 2.4, ly - 15.2), (lx - 2.2, ly - 15.7),
             (lx + 0.6, ly - 16.9), (lx + 2.4, ly - 15.6), (lx + 2.4, ly - 15.1), (lx + 1.0, ly - 14.8), (lx + 1.0, ly - 13.6), (lx + 2.6, ly - 12.4), (lx + 2.8, ly - 6.2), (lx + 1.6, ly - 5.4), (lx + 1.8, ly), (lx + 0.6, ly), (lx + 0.3, ly - 4.4), (lx - 0.2, ly - 4.4), (lx - 0.4, ly)], True))
s.path(M(lx + 2.2, ly - 16.4) + "c1.5 -1.5 3 -1 4 -2.5", sw=0.5)   # a feather in his hat
# the stern formed a gilded shell
sx, sy = 180, 126
shell = M(sx, sy) + f"L{f(sx + 3)} {f(sy - 12)}" + f"A9 9 0 0 1 {f(sx - 9.5)} {f(sy - 9)}" + "Z"
s.fill(shell, color=GOLD)
s.path(shell, sw=0.7)
for k in range(1, 6):
    a = math.radians(95 + k * 22)
    s.path(M(sx, sy) + L(sx + 11 * math.cos(a) * -1 + 1, sy - 11 * math.sin(a) + 1), sw=0.4)
# a second pennant aft, streaming down-stream
s.path(M(176, 125) + L(176, 100), sw=0.7, cap="butt")
s.fill(poly([(176, 100), (194, 102.5), (176, 105)], True))
# the hull's reflection
s.hatch(poly([(34, WL + 4), (172, WL + 4), (164, WL + 14), (42, WL + 14)], True), angle=90, spacing=1.8, sw=0.4, bbox=(30, WL, 176, WL + 16), end_jitter=5)

print(OUT, s.save(OUT, "Elizabeth and Leicester below the white towers"), "bytes")
