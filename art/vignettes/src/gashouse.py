import sys; sys.path.insert(0, '.')
from vig import *
s = SVG(seed=83)
OUT = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/vignettes/the-gashouse.svg'
BANK = 140
CX, R = 122, 46
# ---- the retort house and its chimney, smoke going flat in the cold ----
rh = rect(30, 112, 46, BANK - 112); s.path(rh, sw=0.8); tone(s, rh, 1, bbox=(30, 112, 76, BANK), angle=0)
s.path(M(30, 112) + L(41.5, 104) + L(53, 112) + L(64.5, 104) + L(76, 112), sw=0.8)
for wx in (36, 48, 60):
    w = rect(wx, 118, 6, 9); s.path(w, sw=0.5); tone(s, w, 3, bbox=(wx, 118, wx + 6, 127), angle=60)
s.path(rect(20, 58, 6, BANK - 58), sw=0.8); s.hatch(rect(23, 58, 3, BANK - 58), angle=90, spacing=0.8, sw=0.35, bbox=(20, 58, 26, BANK))
s.path(M(19, 62) + L(27, 62), sw=0.8, cap="butt")
s.path(M(23, 57) + "c-3 -4 2 -8 -1 -12 c4 -3 12 -2 20 -3 c8 -1 16 1 26 -1", sw=0.45)
# ---- the gasholder: a cage of columns and lattice girders, the bell part-raised inside ----
cols = [CX + R * math.cos(math.radians(a)) for a in (180, 150, 120, 90, 60, 30, 0)]
TOP, BOT = 54, BANK
# the bell
bell = rect(CX - R + 6, 84, 2 * (R - 6), BOT - 84)
s.path(bell, sw=0.8)
s.hatch(bell, angle=90, spacing=1.3, sw=0.3, bbox=(CX - R + 6, 84, CX + R - 6, BOT))
s.hatch(rect(CX + R - 24, 84, 18, BOT - 84), angle=90, spacing=1.3, sw=0.4, bbox=(CX + R - 24, 84, CX + R - 6, BOT), phase=0.65)
s.path(M(CX - R + 6, 84) + f"Q{f(CX)} 74 {f(CX + R - 6)} 84", sw=0.8)
for yy in (98, 112, 126):
    s.path(M(CX - R + 6, yy) + L(CX + R - 6, yy), sw=0.4, cap="butt")
# the frame
for x in cols:
    s.path(M(x, TOP) + L(x, BOT), sw=1.0, cap="butt")
for yy in (TOP + 8, 96, BOT - 6):
    s.path(M(CX - R, yy) + f"A{R} 7 0 0 0 {f(CX + R)} {f(yy)}", sw=0.7)
    s.path(M(CX - R, yy - 5) + f"A{R} 7 0 0 0 {f(CX + R)} {f(yy - 5)}", sw=0.7)
    segs = []
    for i in range(len(cols) - 1):
        x0, x1 = cols[i], cols[i + 1]
        n = max(2, int((x1 - x0) / 5))
        for k in range(n):
            a, b = x0 + (x1 - x0) * k / n, x0 + (x1 - x0) * (k + 1) / n
            m0 = yy + 7 * math.sqrt(max(0, 1 - ((a - CX) / R) ** 2)) * (1 if True else 1)
            segs.append((a, yy - 5 + 7 * math.sqrt(max(0, 1 - ((a - CX) / R) ** 2)), b, yy + 7 * math.sqrt(max(0, 1 - ((b - CX) / R) ** 2))))
            segs.append((a, yy + 7 * math.sqrt(max(0, 1 - ((a - CX) / R) ** 2)), b, yy - 5 + 7 * math.sqrt(max(0, 1 - ((b - CX) / R) ** 2))))
    s.multi(segs, sw=0.3)
for x in cols:
    s.path(M(x - 1.5, TOP) + L(x + 1.5, TOP), sw=0.9, cap="butt")
# ---- the bank, the towpath, the dull canal ----
s.path(M(2, BANK) + L(198, BANK), sw=1.0, cap="butt")
s.path(M(2, BANK + 2.6) + L(198, BANK + 2.6), sw=0.5, cap="butt")
s.water(BANK + 6, 184, x0=2, x1=198, sw=(0.35, 0.5), step=3.6, grow=0.05, seed_len=(8, 26), gap=(6, 16))
s.hatch(poly([(CX - R, BANK + 4), (CX + R, BANK + 4), (CX + R - 6, BANK + 22), (CX - R + 6, BANK + 22)], True), angle=90, spacing=2.4, sw=0.35, bbox=(CX - R, BANK, CX + R, BANK + 24), end_jitter=8)
# reeds and a bare tree
for rx in (170, 174, 179, 184, 188):
    s.path(M(rx, BANK) + L(rx + s.rng.uniform(-2, 2), BANK - s.rng.uniform(9, 16)), sw=0.45)
s.path(M(186, BANK) + L(186, 108) + M(186, 122) + L(176, 106) + M(186, 116) + L(195, 100) + M(182, 112) + L(178, 96) + M(190, 108) + L(198, 92), sw=0.7)
# ---- the man fishing, and the rat on the bank ----
fx, fy = 46, BANK
def P(px, py): return (fx + px, fy - py)
s.fill(poly([P(-3.4, 0), P(-3.4, 2.6), P(-5.2, 6.4), P(-5.0, 11.2), P(-3.6, 13.4), P(-1.8, 14.2), P(-1.4, 15.4), P(-3.2, 15.6), P(-3.2, 16.1), P(-1.2, 16.3),
             P(0.0, 18.4), P(2.2, 18.2), P(3.2, 16.6), P(3.2, 16.1), P(1.8, 15.9), P(1.8, 14.4), P(1.6, 13.6), P(3.8, 12.4), P(4.8, 9.4), P(5.2, 6.4),
             P(4.4, 5.8), P(6.2, 5.4), P(6.4, 0), P(4.8, 0), P(4.6, 4.6), P(0.6, 4.8), P(0.4, 0)], True))
s.path(M(fx + 4, fy - 9) + L(fx + 34, fy - 30), sw=0.9, cap="round")
s.path(M(fx + 34, fy - 30) + L(fx + 40, fy + 6), sw=0.35)
s.fill(circle_path(fx + 40, fy + 6, 0.9))
rx, ry = 150, BANK - 0.6
s.fill(poly([(rx, ry), (rx + 2, ry - 3.2), (rx + 7, ry - 4.2), (rx + 11, ry - 3.4), (rx + 13.5, ry - 1.4), (rx + 15.5, ry - 2.2), (rx + 15.5, ry - 0.4), (rx + 13, ry)], True))
s.path(M(rx, ry - 0.8) + "c-4 0 -7 1.6 -11 0.4", sw=0.7)
print(OUT, s.save(OUT, "The dull canal behind the gashouse"), "bytes")
