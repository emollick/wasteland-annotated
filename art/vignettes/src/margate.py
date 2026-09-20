import sys; sys.path.insert(0, '.')
from vig import *

s = SVG(seed=31)
OUT = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/vignettes/margate-sands.svg'
X0, X1 = 28, 172      # the shelter is long: five columns, four bays
D = 30                # its depth
EAVE, DAIS = 116, 152
cols = [X0 + i * (X1 - X0) / 4 for i in range(5)]

# ---- the sea, seen through the shelter: an empty horizon, a gull or two ----
HZ = 128
s.path(M(4, HZ) + L(196, HZ), sw=0.5, cap="butt")
for k in range(8):
    y = HZ + 2 + k * 2.4
    x = 4
    while x < 196:
        ln = s.rng.uniform(6, 18)
        s.path(M(x, y) + L(min(x + ln, 196), y), sw=0.3, cap="butt"); x += ln + s.rng.uniform(4, 10)
for gx, gy in ((150, 78), (161, 84), (40, 74)):
    s.path(M(gx - 2.5, gy) + f"q1.2 -1.6 2.5 0 q1.3 -1.6 2.5 0", sw=0.45)

# ---- the back row of columns and the seaward railing ----
for cx in cols:
    bx, by = ob(cx, EAVE, D); bx2, by2 = ob(cx, DAIS, D)
    s.path(M(bx, by + 1) + L(bx2, by2), sw=0.8, cap="butt")
rx0, ry0 = ob(X0 - 6, DAIS - 1, D + 8); rx1, ry1 = ob(X1 + 6, DAIS - 1, D + 8)
s.path(M(rx0, ry0) + L(rx1, ry1), sw=0.5)
x = rx0
while x < rx1:
    s.path(M(x, ry0) + L(x, ry0 - 4), sw=0.4, cap="butt"); x += 4.5

# ---- the glazed timber screen down the middle, white-painted, the sea through its glass ----
SD = D / 2
sx0, sy0 = ob(X0 + 8, EAVE + 1, SD); sx1, sy1 = ob(X1 - 8, EAVE + 1, SD)
sb0 = ob(X0 + 8, DAIS - 1, SD); sb1 = ob(X1 - 8, DAIS - 1, SD)
screen = poly([(sx0, sy0), (sx1, sy1), sb1, sb0], True)
s.path(screen, sw=0.6)
glass_top = EAVE + 3; glass_bot = DAIS - 12
# boarded lower part
low = poly([ob(X0 + 8, glass_bot, SD), ob(X1 - 8, glass_bot, SD), sb1, sb0], True)
s.hatch(low, angle=0, spacing=1.3, sw=0.3, bbox=(20, 120, 165, 155))
s.path(M(*ob(X0 + 8, glass_bot, SD)) + L(*ob(X1 - 8, glass_bot, SD)), sw=0.5)
# glazing bars
xx = X0 + 12
while xx < X1 - 8:
    s.path(M(*ob(xx, glass_top, SD)) + L(*ob(xx, glass_bot, SD)), sw=0.35, cap="butt"); xx += 5.4
for gy in (glass_top + 9, glass_top + 18):
    s.path(M(*ob(X0 + 8, gy, SD)) + L(*ob(X1 - 8, gy, SD)), sw=0.35, cap="butt")
# the ends of the H: short cross-screens at each end
for ex in (X0 + 8, X1 - 8):
    e = poly([ob(ex, EAVE + 1, SD - 7), ob(ex, EAVE + 1, SD + 7), ob(ex, DAIS - 1, SD + 7), ob(ex, DAIS - 1, SD - 7)], True)
    s.path(e, sw=0.5); tone(s, e, 1, bbox=(ex - 12, 118, ex + 4, 156), angle=90)

# ---- the benches: continuous, with heavy arm rests; one man sitting on the landward side ----
BD = 5
b0 = ob(X0 + 3, DAIS - 8, BD); b1 = ob(X1 - 3, DAIS - 8, BD)
s.path(M(*b0) + L(*b1), sw=0.9)
s.path(M(*ob(X0 + 3, DAIS - 6.4, BD)) + L(*ob(X1 - 3, DAIS - 6.4, BD)), sw=0.5)
for ax in [X0 + 3 + i * (X1 - X0 - 6) / 8 for i in range(9)]:
    p = ob(ax, DAIS - 8, BD); q = ob(ax, DAIS - 12.5, BD); r_ = ob(ax, DAIS - 1, BD)
    s.path(M(*r_) + L(*q), sw=0.8, cap="butt")
    s.path(M(q[0] - 1.6, q[1]) + L(q[0] + 1.8, q[1]), sw=0.9, cap="round")
# the man in the shelter: hat, coat, hands on his knees, looking along the sands
mx, my = ob(64, DAIS - 1, BD)
def P(px, py): return (mx + px, my - py)
SC = 1.25
def Q(px, py): return P(px * SC, py * SC)
man = poly([Q(-4.2, 0), Q(-4.2, 2.6), Q(-6.2, 6.0), Q(-6.0, 11.2), Q(-4.6, 13.6), Q(-2.2, 14.6), Q(-1.6, 16.2), Q(-3.6, 16.6), Q(-3.6, 17.2), Q(-1.2, 17.6),
            Q(0.0, 19.6), Q(2.2, 19.4), Q(3.4, 17.9), Q(3.4, 17.3), Q(1.8, 17.0), Q(1.6, 15.2), Q(1.4, 14.2), Q(3.8, 12.6), Q(4.8, 9.6), Q(5.2, 6.4),
            Q(4.4, 5.6), Q(2.0, 5.4), Q(2.2, 0), Q(0.4, 0), Q(0.2, 5.0), Q(-2.4, 5.2), Q(-2.6, 0)], True)
s.fill(man)

# ---- the front row: five slender cast-iron columns, moulded capitals and plinths, fretwork brackets ----
for cx in cols:
    s.path(M(cx, EAVE + 1) + L(cx, DAIS), sw=1.3, cap="butt")
    s.path(rect(cx - 1.6, DAIS - 3, 3.2, 3), sw=0.6)
    s.path(rect(cx - 1.5, EAVE + 1, 3.0, 2.2), sw=0.6)
    for sgn in (-1, 1):
        if (cx == X0 and sgn < 0) or (cx == X1 and sgn > 0): continue
        bx = cx + sgn * 7
        br = M(cx + sgn * 1.4, EAVE + 3.2) + f"Q{f(cx + sgn * 2)} {f(EAVE + 8.6)} {f(cx + sgn * 6.8)} {f(EAVE + 3.4)}" + L(cx + sgn * 1.4, EAVE + 3.2) + "Z"
        s.path(br, sw=0.5)
        s.hatch(br, angle=45 * sgn, spacing=0.9, sw=0.35, bbox=(cx - 8, EAVE + 2, cx + 8, EAVE + 10))
        s.path(M(cx + sgn * 2.6, EAVE + 5.3) + "a0.9 0.9 0 1 0 0.01 0", sw=0.4)

# ---- the hipped zinc roof, with the fretwork awning hanging along the eaves ----
ridge0 = ob(X0 + 22, EAVE - 14, D / 2); ridge1 = ob(X1 - 22, EAVE - 14, D / 2)
back0 = ob(X0, EAVE, D); back1 = ob(X1, EAVE, D)
near = poly([(X0, EAVE), (X1, EAVE), ridge1, ridge0], True)
hipL = poly([(X0, EAVE), ridge0, back0], True)
hipR = poly([(X1, EAVE), back1, ridge1], True)
s.path(near, sw=0.9)
for face, ang in ((hipL, 30), (hipR, -30)):
    s.path(face, sw=0.9); s.hatch(face, angle=ang, spacing=1.5, sw=0.35, bbox=(4, 90, 180, 120))
# standing seams on the zinc
for k in range(1, 16):
    t = k / 16
    ex = X0 + (X1 - X0) * t
    tx = ridge0[0] + (ridge1[0] - ridge0[0]) * t; ty = ridge0[1] + (ridge1[1] - ridge0[1]) * t
    s.path(M(ex, EAVE) + L(tx, ty), sw=0.35, cap="butt")
    s.path(M(ex + 1.2, EAVE) + L(tx + 1.0, ty + 0.4), sw=0.2, cap="butt")
s.path(M(*ridge0) + L(*ridge1), sw=1.1)
s.path(M(X0 - 2, EAVE) + L(X1 + 2, EAVE), sw=1.2, cap="butt")
s.path(M(X0 - 2, EAVE) + L(*ob(X0 - 2, EAVE, D)), sw=0.9)
# the awning: a toothed timber fringe under the eaves
x = X0 - 1.5
teeth = M(X0 - 2, EAVE + 1)
while x < X1 + 1.5:
    teeth += L(x + 1, EAVE + 3.4) + L(x + 2, EAVE + 1); x += 2
s.path(teeth, sw=0.45, join="miter")
xa = ob(X0 - 2, EAVE + 1, 0); xb = ob(X0 - 2, EAVE + 1, D)
s.path(M(*xa) + L(*xb), sw=0.45)

# ---- the triple-stepped dais faced with green tiles, and the promenade ----
for k, (dy, inset) in enumerate(((0, 0), (2.2, -1.6), (4.4, -3.2))):
    y = DAIS + dy
    s.path(M(X0 - 4 + inset, y) + L(X1 + 4 - inset, y), sw=0.8 if k == 0 else 0.6, cap="butt")
    s.path(M(X0 - 4 + inset, y) + L(*ob(X0 - 4 + inset, y, D + 8)), sw=0.5)
    xx = X0 - 2 + inset
    while xx < X1 + 4 - inset:
        s.path(M(xx, y + 0.4) + L(xx, y + 1.8), sw=0.3, cap="butt"); xx += 2.4
s.path(M(X0 - 7.5, DAIS + 6.6) + L(X1 + 7.5, DAIS + 6.6), sw=0.8, cap="butt")
for i, (x0, x1, yy) in enumerate([(10, 190, DAIS + 10.5), (20, 180, DAIS + 13)]):
    s.path(s.wobble([(x0, yy), (x1, yy)], amp=0.15, seg=6), sw=0.9 if i == 0 else 0.5)

print(OUT, s.save(OUT, "The shelter on Margate Sands"), "bytes")
