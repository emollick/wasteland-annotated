import sys; sys.path.insert(0, '.')
from vig import *

s = SVG(seed=5)
OUT = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/vignettes/red-sailed-barge.svg'
WL = 141   # waterline
# ---- the far shore: Greenwich reach, the Isle of Dogs low on the horizon ----
H = 120
s.path(M(4, H) + L(196, H), sw=0.45, cap="butt")
for (wx, wy, ww) in ((150, 108, 20), (172, 112, 14), (14, 112, 22), (40, 114, 10)):
    s.path(rect(wx, wy, ww, H - wy), sw=0.4)
    s.hatch(rect(wx, wy, ww, H - wy), angle=0, spacing=1.6, sw=0.25, bbox=(wx, wy, wx + ww, H))
for cx, top in ((160, 92), (22, 98)):
    s.path(rect(cx - 1.2, top, 2.4, H - top), sw=0.45)
    s.path(M(cx, top - 1) + f"c-2 -4 2 -7 0 -11" + f"c-2 -4 1.5 -6 0.5 -9", sw=0.35)

# ---- the hull: flat-bottomed, tarred black, a straight stem, a transom stern; leeboard down ----
hull = poly([(36, 131.5), (60, 130.4), (100, 129.8), (140, 130.2), (162, 131.0), (163.5, WL + 2), (150, WL + 3), (100, WL + 3.5), (50, WL + 3), (33, WL + 1)], True)
s.fill(hull)
# a pale sheer band left open in the black
s.path(M(38, 130.4) + f"Q100 128.3 160.5 129.7", sw=0.6, stroke=PAPER) if False else None
s.path(M(37.5, 130.6) + f"Q100 128.4 160.8 129.9", sw=0.55, stroke="none") if False else None
band = M(37.5, 133.2) + "Q100 131.4 161 132.7" + "L161 133.7" + "Q100 132.4 37.5 134.2Z"
s.add(f'<path d="{band}" fill="none" stroke="currentColor" stroke-width="0.35"/>')
# rail, hatches, and the leeboard
s.path(M(36, 131.5) + L(162, 131.0), sw=0.9)
s.path(rect(70, 127.2, 22, 3.0), sw=0.6); s.hatch(rect(70, 127.2, 22, 3.0), angle=0, spacing=1.0, sw=0.4, bbox=(70, 127, 92, 131))
lee = poly([(104, 131), (112, 131), (116, 138), (113, 146), (104, 147), (99, 139)], True)
s.path(lee, sw=0.7); tone(s, lee, 2, bbox=(98, 126, 118, 148), angle=100)
s.path(M(110, 131) + L(110, 146), sw=0.4)
# rudder and transom
s.path(poly([(36, 131.5), (33, WL + 1), (30, WL + 2), (30.5, 132.5)], True), sw=0.6)
# ---- the sprit rig: mainmast, sprit, mainsail, topsail, foresail, mizzen ----
MX = 118
s.path(M(MX, 130) + L(MX, 40), sw=1.1, cap="butt")            # mast and topmast
s.path(M(MX - 1.2, 66) + L(MX + 1.2, 66), sw=0.8, cap="butt")
peak = (52, 46); clew = (58, 127); tack = (MX, 128); head = (MX, 62)
main = M(*tack) + L(*head) + L(*peak) + f"Q{f(peak[0] - 7)} {f((peak[1] + clew[1]) / 2)} {f(clew[0])} {f(clew[1])}" + f"Q{f((clew[0] + tack[0]) / 2)} {f(clew[1] + 3)} {f(tack[0])} {f(tack[1])}Z"
s.fill(main, color=RUST)
# cloths: seams running parallel to the leech
for i in range(1, 9):
    t = i / 9
    a = (head[0] + (peak[0] - head[0]) * t, head[1] + (peak[1] - head[1]) * t)
    b = (tack[0] + (clew[0] - tack[0]) * t, tack[1] + (clew[1] - tack[1]) * t)
    s.path(M(*a) + L(*b), sw=0.35, cap="butt")
s.hatch(poly([peak, (peak[0] + 16, peak[1] + 2), (clew[0] + 12, clew[1] - 2), clew], True), angle=-84, spacing=1.5, sw=0.3, bbox=(48, 44, 80, 130))
s.path(main, sw=0.9)
# the heavy spar: the sprit from the mast foot to the peak
s.path(M(MX + 1, 129) + L(peak[0] - 1.5, peak[1] - 1), sw=1.3, cap="round")
# topsail on the topmast, its clew out to the sprit end
top = poly([(MX, 42), (MX, 62), (peak[0] + 6, peak[1] + 1)], True)
s.fill(top, color=RUST)
for i in range(1, 4):
    t = i / 4
    s.path(M(MX, 42 + 20 * t) + L(MX + (peak[0] + 6 - MX) * t, 42 + 20 * t + (peak[1] + 1 - 62) * t * 0.2), sw=0.3, cap="butt") if False else None
s.path(top, sw=0.7)
s.hatch(top, angle=-60, spacing=1.7, sw=0.3, bbox=(50, 40, 120, 64))
# foresail to the stemhead
fore = poly([(160, 130.5), (MX + 0.5, 64), (MX + 6, 127)], True)
s.fill(fore, color=RUST); s.path(fore, sw=0.7)
s.hatch(fore, angle=-75, spacing=1.6, sw=0.3, bbox=(118, 62, 162, 128))
s.path(M(161, 130.5) + L(MX, 41), sw=0.35)                      # forestay
# mizzen on the rudder head, sheeted aft
s.path(M(34, 132) + L(34, 99), sw=0.8, cap="butt")
miz = poly([(34, 102), (16, 109), (20, 129), (34, 130)], True)
s.fill(miz, color=RUST); s.path(miz, sw=0.6)
s.path(M(35, 130) + L(15, 108), sw=0.8)
s.hatch(miz, angle=-70, spacing=1.6, sw=0.3, bbox=(14, 96, 36, 128))
# skipper at the wheel, and the mate forward
s.fill(cityman(46, 131.5, h=6.5, dir=1, step=0, bow=0.2))
s.path(circle_path(52, 127.5, 2.2), sw=0.6)
s.fill(cityman(150, 131, h=6, dir=1, step=0.6, bow=0.5))

# ---- the river sweats oil and tar: broken strokes, drifting logs, the hull's dark reflection ----
s.water(WL + 3.5, 182, x0=2, x1=198, sw=(0.5, 0.65), step=2.6, grow=0.06)
s.hatch(poly([(44, WL + 4), (156, WL + 4), (146, WL + 16), (56, WL + 16)], True), angle=90, spacing=1.7, sw=0.4, bbox=(40, WL, 160, WL + 18), end_jitter=6)
# an oily swirl or two beside the hull
s.path(M(168, 150) + "c4 -2 8 1 12 -1 s6 2 10 0", sw=0.4)
s.path(M(20, 156) + "c3 -1.5 6 0.5 9 -1", sw=0.4)
# drifting logs
for (lx, ly, ln, ang) in ((176, 163, 14, -4), (14, 168, 11, 3)):
    p1 = rot(lx + ln, ly, lx, ly, ang)
    s.path(M(lx, ly) + L(*p1), sw=2.2, cap="round")
    s.path(M(lx, ly) + L(*p1), sw=0.6, cap="round", stroke=PAPER) if False else None

print(OUT, s.save(OUT, "A barge with red sails on Greenwich reach"), "bytes")
