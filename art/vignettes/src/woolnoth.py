import sys; sys.path.insert(0, '.')
from vig import *

s = SVG(seed=7)
OUT = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/vignettes/st-mary-woolnoth.svg'
DEPTH = 62           # the church is nearly square in plan; this is its depth along Lombard Street
TD = 22              # the tower is broad and shallow
G = 168              # ground line

# ---- the north side, receding along Lombard Street (Hawksmoor's blind arcade) ----
BX0, BX1, BY0 = 50, 150, 100
north = side_face(BX0, BY0, G, 0, DEPTH)
s.path(north, sw=1.0)
tone(s, north, 2, bbox=(15, 80, 52, 170), angle=30)
# five great round-headed rusticated frames along the north wall, foreshortened
for k in range(5):
    d0 = 5 + k * 11.2; d1 = d0 + 9.4
    a = side_arch(BX0, G - 2, BY0 + 10, d0, d1)
    s.path(a, sw=0.7)
    tone(s, a, 3, bbox=(15, 80, 52, 170), angle=30)
    # the low blind aperture under each, a dark slot
    slot = side_face(BX0, G - 14, G - 4, d0 + 2, d1 - 2)
    s.fill(slot)

# ---- the west front: rusticated lower body ----
s.path(rect(BX0, BY0, BX1 - BX0, G - BY0), sw=1.1)
tone(s, rect(BX0, BY0, BX1 - BX0, G - BY0), 1, bbox=(BX0, BY0, BX1, G), angle=45)
CX0, CX1, CY0 = 78, 122, 96
s.path(rect(CX0, CY0, CX1 - CX0, G - CY0), sw=1.0)
# the banded rustication: nine heavy channels
y = BY0 + 7
while y < G - 3:
    s.path(M(BX0, y) + L(BX1, y), sw=0.9, cap="butt")
    s.path(M(BX0, y + 1.5) + L(BX1, y + 1.5), sw=0.35, cap="butt")
    y += 7.5
# shadow thrown by the projecting central bay
s.fill(rect(CX1, CY0 + 2.5, 3.6, G - CY0 - 2.5))
# banded Tuscan columns at the angles of the front
for cx in (BX0 + 7, BX1 - 7):
    w = 8
    shaft = rect(cx - w / 2, BY0 + 4, w, G - BY0 - 4)
    s.path(shaft, sw=0.9)
    yy = BY0 + 7; k = 0
    while yy < G - 3:
        if k % 2 == 0:
            blk = rect(cx - w / 2 - 1.5, yy, w + 3, 7.5)
            s.path(blk, sw=0.8)
        yy += 7.5; k += 1
    s.hatch(rect(cx + 0.8, BY0 + 4, w / 2 + 1.6, G - BY0 - 4), angle=90, spacing=0.75, sw=0.45, bbox=(cx - 2, BY0, cx + w, G))
    s.hatch(rect(cx - 1.2, BY0 + 4, 2.4, G - BY0 - 4), angle=90, spacing=1.5, sw=0.3, bbox=(cx - 2, BY0, cx + w, G))
# the doorway: a black round-headed mouth with voussoirs and a keystone
DX, DY, DW, DH = 90, 128, 20, 40
door = arch(DX, DY, DW, DH)
s.fill(door)
s.path(arch(DX - 3.5, DY - 3.5, DW + 7, DH + 3.5), sw=0.8)
s.path(rect(DX + DW / 2 - 2.4, DY - 5.5, 4.8, 6.5), sw=0.8)
s.fill(rect(DX + DW / 2 - 2.4, DY - 5.5, 4.8, 6.5), color=PAPER) if False else None
# the semicircular window over the door, glazing bars fanning
LX, LY, LR = 100, 121, 14
lun = M(LX - LR, LY) + f"A{LR} {LR} 0 0 1 {LX + LR} {LY}" + "Z"
tone(s, lun, 2, bbox=(LX - LR, LY - LR, LX + LR, LY), angle=45)
s.path(lun, sw=0.9)
for a in (30, 60, 90, 120, 150):
    x, yv = rot(LX + LR - 0.8, LY, LX, LY, -a)
    s.path(M(LX, LY - 0.4) + L(x, yv), sw=0.5)
s.path(M(LX - 8, LY) + f"A8 8 0 0 1 {LX + 8} {LY}", sw=0.5)
# cornices
s.path(M(BX0 - 3, BY0) + L(BX1 + 3, BY0), sw=1.6, cap="butt")
s.path(M(BX0 - 3, BY0 + 2.6) + L(BX1 + 3, BY0 + 2.6), sw=0.5, cap="butt")
s.path(M(CX0 - 2, CY0 - 1.5) + L(CX1 + 2, CY0 - 1.5), sw=1.3, cap="butt")
# the ledge on top of the body recedes too
s.path(top_face(BY0, BX0, BX1, 0, DEPTH), sw=0.6)

# ---- the broad shallow tower ----
TX0, TX1 = 56, 144
# north face of the tower
tn = side_face(TX0, 52, BY0, 0, TD); s.path(tn, sw=0.9); tone(s, tn, 2, bbox=(40, 40, 60, 100), angle=30)
# base stage with three unmoulded square windows
s.path(rect(TX0, 88, TX1 - TX0, 12), sw=0.9)
for wx in (68, 96, 124):
    s.fill(rect(wx, 90.5, 8, 7.5))
# principal storey: three bays, engaged Composite columns
PY0, PY1 = 54, 88
s.path(rect(TX0, PY0, TX1 - TX0, PY1 - PY0), sw=0.9)
for cx in (62, 87.5, 112.5, 138):
    s.path(rect(cx - 2.8, PY0 + 4.5, 5.6, PY1 - PY0 - 8), sw=0.7)
    s.path(rect(cx - 3.9, PY0 + 2.5, 7.8, 2.4), sw=0.6)
    s.path(M(cx - 3.4, PY0 + 5) + "a1.5 1.5 0 1 0 3 0" + M(cx + 0.4, PY0 + 5) + "a1.5 1.5 0 1 0 3 0", sw=0.5)
    s.path(rect(cx - 3.6, PY1 - 3.5, 7.2, 2.6), sw=0.6)
    s.hatch(rect(cx - 0.4, PY0 + 6.5, 3.2, PY1 - PY0 - 11), angle=90, spacing=0.7, sw=0.4, bbox=(cx - 3, PY0, cx + 3, PY1))
mid = arch(94.5, 60, 11, 22)
s.path(mid, sw=0.8)
s.hatch(mid, angle=0, spacing=1.15, sw=0.55, bbox=(94, 60, 106, 82))
for px in (70, 120):
    p = rect(px, 62, 10, 18); s.path(p, sw=0.6); tone(s, p, 2, bbox=(px, 62, px + 10, 80))
s.path(M(TX0 - 3, PY0) + L(TX1 + 3, PY0), sw=1.5, cap="butt")
s.path(M(TX0 - 3, PY0 - 2.6) + L(TX1 + 3, PY0 - 2.6), sw=0.5, cap="butt")
def balustrade(x0, x1, y0, y1, step=2.4):
    s.path(M(x0, y0) + L(x1, y0), sw=0.9, cap="butt"); s.path(M(x0, y1) + L(x1, y1), sw=0.6, cap="butt")
    x = x0 + step / 2
    while x < x1:
        s.path(M(x, y0 + 0.7) + L(x, y1 - 0.4), sw=0.75, cap="butt"); x += step
balustrade(84, 116, 45, 51)
s.path(top_face(PY0 - 2.6, TX0 - 3, TX1 + 3, 0, TD), sw=0.5)
# ---- the twin turrets ----
for tx0 in (60, 116):
    tx1 = tx0 + 24
    tf = side_face(tx0, 22, 51, 0, 24) if tx0 == 60 else None
    if tf: s.path(tf, sw=0.8); tone(s, tf, 3, bbox=(44, 8, 62, 52), angle=30)
    s.path(rect(tx0, 24, 24, 27), sw=0.9)
    for cx in (tx0 + 4, tx0 + 9.4, tx0 + 14.6, tx0 + 20):
        s.path(rect(cx - 1.7, 28, 3.4, 20), sw=0.55)
        s.path(rect(cx - 2.4, 26.8, 4.8, 1.8), sw=0.5)
        s.hatch(rect(cx - 0.2, 29, 1.9, 18), angle=90, spacing=0.65, sw=0.35, bbox=(cx - 2, 28, cx + 2, 48))
    # the bays between the columns are dark openings
    for bx in (tx0 + 6.2, tx0 + 11.6, tx0 + 16.8):
        s.fill(rect(bx, 30, 2.4, 17))
    s.path(M(tx0 - 2, 24) + L(tx1 + 2, 24), sw=1.2, cap="butt")
    balustrade(tx0 - 1, tx1 + 1, 17.5, 23.5, step=2.2)
    s.path(top_face(17.5, tx0 - 1, tx1 + 1, 0, 24), sw=0.5)
    # cast shadow down the right of each turret onto what stands behind
    s.fill(rect(tx1, 26, 2.2, 25))

# ---- ground, and the crowd flowing past ----
for i, (x0, x1, yy) in enumerate([(18, 182, G + 1.5), (24, 176, G + 3.8), (34, 166, G + 6)]):
    s.path(s.wobble([(x0, yy), (x1, yy)], amp=0.15, seg=6), sw=0.9 if i == 0 else 0.5)
xs = [26, 33.5, 41, 49.5, 57, 64, 72.5, 80, 88, 95.5, 103, 111.5, 119, 127, 134.5, 142, 150.5, 158, 166, 174]
crowd_row(s, xs, G + 3.2, h=9.2, dir=-1, hatched_every=4)

print(OUT, s.save(OUT, "St Mary Woolnoth, Lombard Street"), "bytes")
