import sys; sys.path.insert(0, '.')
from vig import *

s = SVG(seed=11)
OUT = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/vignettes/st-magnus-martyr.svg'
G = 168
TX0, TX1 = 52, 76          # the tower, square, at the west end
TD = 24                    # its depth
CX = (TX0 + TX1) / 2

# ---- Adelaide House going up on the west, 1921-25: a skeleton of steel and a crane, lightly ----
fx0, fx1 = 16, 46
for k in range(4):
    yy = G - 13 - k * 13
    s.path(M(fx0, yy) + L(fx1 + 1, yy), sw=0.35, cap="butt")
for xx in (fx0 + 2, fx0 + 12, fx0 + 22, fx0 + 32):
    s.path(M(xx, G - 52) + L(xx, G), sw=0.35, cap="butt")
s.path(M(fx0 + 12, G - 52) + L(fx0 + 12, G - 84) + M(fx0 + 12, G - 82) + L(fx0 + 34, G - 90) + M(fx0 + 12, G - 72) + L(fx0 + 30, G - 88.5), sw=0.45)
s.path(M(fx0 + 22, G - 87.5) + L(fx0 + 22, G - 74), sw=0.3)   # the hook

# ---- the nave, south wall along the wharves, and its roof ----
NX1 = 172; EAVE = 138
roof = poly([(TX1, EAVE), (NX1, EAVE), ob(NX1, EAVE - 5, 30), ob(TX1, EAVE - 5, 30)], True)
s.path(roof, sw=0.7); tone(s, roof, 1, bbox=(60, 110, 175, 140), angle=0)
s.path(rect(TX1, EAVE, NX1 - TX1, G - EAVE), sw=1.0)
s.path(M(TX1, EAVE + 3) + L(NX1, EAVE + 3), sw=0.5, cap="butt")
for wx in (86, 108, 130, 152):
    w = arch(wx, EAVE + 8, 10, 18); s.path(w, sw=0.7); tone(s, w, 2, bbox=(wx, EAVE + 8, wx + 10, G), angle=45)
    s.path(rect(wx - 1.5, EAVE + 6, 13, 2), sw=0.5)
# stone courses, sparse
for yy in (EAVE + 12, EAVE + 20, EAVE + 26):
    s.path(M(TX1, yy) + L(NX1, yy), sw=0.3, cap="butt", extra='stroke-dasharray="6 3"')

# ---- the tower: four square stages ----
stages = [(G, 140), (140, 118), (118, 98), (98, 70)]
west = side_face(TX0, 70, G, 0, TD); s.path(west, sw=0.9); tone(s, west, 2, bbox=(36, 55, 54, 170), angle=30)
s.path(rect(TX0, 70, TX1 - TX0, G - 70), sw=1.1)
for y0, y1 in stages[1:]:
    s.path(M(TX0 - 1.5, y0) + L(TX1 + 1.5, y0), sw=0.9, cap="butt")
    s.path(top_face(y0, TX0 - 1.5, TX1 + 1.5, 0, TD), sw=0.4)
# ground stage: the archway cut through in 1762 for the footway of old London Bridge
a = arch(CX - 6.5, G - 21, 13, 21); s.fill(a)
s.path(arch(CX - 8.5, G - 23, 17, 23), sw=0.8)
# second stage: a round-headed window under a small pediment; third: an oculus
w2 = arch(CX - 3.5, 124, 7, 12); s.path(w2, sw=0.6); tone(s, w2, 3, bbox=(CX - 4, 122, CX + 4, 137))
s.path(M(CX - 5.5, 124) + L(CX, 120.5) + L(CX + 5.5, 124), sw=0.6)
oc = circle_path(CX, 108, 3.6); s.path(oc, sw=0.6); tone(s, oc, 3, bbox=(CX - 4, 104, CX + 4, 112))
# fourth stage, the bell-chamber: louvred round-headed opening, Corinthian pilasters, pulvinated frieze
bell = arch(CX - 5, 76, 10, 18); s.path(bell, sw=0.7)
s.hatch(bell, angle=0, spacing=1.2, sw=0.55, bbox=(CX - 5, 76, CX + 5, 94))
for px in (TX0 + 1, TX1 - 4):
    s.path(rect(px, 74, 3, 20), sw=0.5)
    s.path(rect(px - 0.6, 72.5, 4.2, 1.6), sw=0.5)
s.path(M(TX0 - 2, 70) + L(TX1 + 2, 70), sw=1.3, cap="butt")
s.path(M(TX0 - 2, 72.5) + L(TX1 + 2, 72.5), sw=0.5, cap="butt")
# parapet with vases at the corners
s.path(M(TX0 - 1, 64.5) + L(TX1 + 1, 64.5) + M(TX0 - 1, 64.5) + L(TX0 - 1, 70) + M(TX1 + 1, 64.5) + L(TX1 + 1, 70), sw=0.7)
xx = TX0 + 2.2
while xx < TX1 - 1:
    s.path(M(xx, 65.6) + L(xx, 69.2), sw=0.55, cap="butt"); xx += 2.2
for ux in (TX0 - 1, TX1 + 1):
    s.fill(poly([(ux - 1.6, 64.5), (ux + 1.6, 64.5), (ux + 1.1, 61.2), (ux + 0.5, 60.4), (ux + 0.5, 59.4), (ux - 0.5, 59.4), (ux - 0.5, 60.4), (ux - 1.1, 61.2)], True))
bx, by = ob(TX0 - 1, 64.5, TD)
s.fill(poly([(bx - 1.4, by), (bx + 1.4, by), (bx + 1, by - 3), (bx + 0.4, by - 4), (bx - 0.4, by - 4), (bx - 1, by - 3)], True))
s.path(M(bx, by) + L(TX0 - 1, 64.5), sw=0.4)

# ---- the octagonal lantern, the lead dome, the little lantern, the spirelet ----
LW = 15; lx0, lx1 = CX - LW / 2, CX + LW / 2
# three visible faces of the octagon: a front face and two angled ones
fw = LW * 0.42; ax = (LW - fw) / 2
front = rect(CX - fw / 2, 46, fw, 18)
left = poly([(lx0, 48.5), (CX - fw / 2, 46), (CX - fw / 2, 64), (lx0, 64)], True)
right = poly([(CX + fw / 2, 46), (lx1, 48.5), (lx1, 64), (CX + fw / 2, 64)], True)
for face in (front, left, right): s.path(face, sw=0.7)
tone(s, right, 2, bbox=(CX, 44, lx1 + 1, 65), angle=60)
o = arch(CX - 2, 50, 4, 12); s.fill(o)
ol = poly([(lx0 + 1.5, 52), (CX - fw / 2 - 1, 51), (CX - fw / 2 - 1, 62), (lx0 + 1.5, 62)], True); s.fill(ol)
orr = poly([(CX + fw / 2 + 1, 51), (lx1 - 1.5, 52), (lx1 - 1.5, 62), (CX + fw / 2 + 1, 62)], True); s.fill(orr)
s.path(M(lx0 - 1.5, 46) + L(lx1 + 1.5, 46), sw=1.0, cap="butt")
s.path(M(lx0 - 1.5, 44) + L(lx1 + 1.5, 44), sw=0.5, cap="butt")
# the dome: lead, ribbed at the angles, small lights toward the cardinal points
dome = M(lx0 - 1, 44) + f"C{f(lx0 - 1)} 36 {f(CX - 4)} 30 {f(CX)} 30" + f"C{f(CX + 4)} 30 {f(lx1 + 1)} 36 {f(lx1 + 1)} 44Z"
s.path(dome, sw=0.9)
tone(s, dome, 1, bbox=(lx0 - 2, 29, lx1 + 2, 45), angle=15)
s.hatch(dome, angle=15, spacing=1.1, sw=0.45, bbox=(CX + 1, 29, lx1 + 2, 45))
for rx in (CX - 5, CX, CX + 5):
    s.path(M(rx, 44) + f"C{f(rx)} 38 {f(rx * 0.35 + CX * 0.65)} 32 {f(CX)} 30.2", sw=0.55)
s.path(rect(CX - 1.4, 37, 2.8, 2.6), sw=0.5)
# small lantern and the concave spirelet, ball and vane
s.path(rect(CX - 3, 23, 6, 7), sw=0.7); s.fill(rect(CX - 1.1, 24.5, 2.2, 4.5))
s.path(M(CX - 3.6, 23) + L(CX + 3.6, 23), sw=0.9, cap="butt")
spire = M(CX - 2.8, 23) + f"Q{f(CX - 0.6)} 16 {f(CX)} 9.5" + f"Q{f(CX + 0.6)} 16 {f(CX + 2.8)} 23Z"
s.path(spire, sw=0.8); s.hatch(spire, angle=75, spacing=0.9, sw=0.4, bbox=(CX, 9, CX + 3, 23))
s.fill(circle_path(CX, 8.2, 1.5), color=GOLD)
s.path(M(CX, 6.7) + L(CX, 3.5) + M(CX - 2.6, 4.2) + L(CX + 2.6, 4.2), sw=0.6)
s.fill(poly([(CX + 0.2, 3.2), (CX + 3.2, 4.2), (CX + 0.2, 5.2)], True), color=GOLD)

# ---- Duncombe's clock of 1709, out on its beam and scroll-bracket from the west face ----
bxw, byw = ob(TX0, 128, TD * 0.55)
beam_end = (bxw - 11, byw)
s.path(M(bxw, byw) + f"C{f(bxw - 4)} {f(byw - 1)} {f(bxw - 8)} {f(byw - 0.5)} {f(beam_end[0])} {f(beam_end[1])}", sw=1.0)
s.path(M(beam_end[0] + 1, byw + 0.5) + f"C{f(beam_end[0] + 2)} {f(byw + 9)} {f(bxw - 2)} {f(byw + 12)} {f(bxw)} {f(byw + 14)}", sw=0.7)
s.path(M(bxw - 2.5, byw + 11) + "a1.6 1.6 0 1 1 1.6 1.6", sw=0.5)
cx_, cy_ = beam_end[0] + 1.5, byw - 7.5
s.path(rect(cx_ - 6, cy_ - 7, 12, 14), sw=0.8)
s.path(M(cx_ - 7, cy_ - 7) + f"Q{f(cx_)} -{f(-cy_ + 11.5)} {f(cx_ + 7)} {f(cy_ - 7)}", sw=0.8)   # segmental pediment
s.path(M(cx_ - 7.2, cy_ - 7) + L(cx_ + 7.2, cy_ - 7), sw=1.0, cap="butt")
s.path(circle_path(cx_, cy_, 4.8), sw=0.7)
s.fill(circle_path(cx_, cy_, 4.8))
s.path(circle_path(cx_, cy_, 3.8), sw=0.5, stroke=GOLD)
s.path(M(cx_, cy_) + L(cx_ + 0.3, cy_ - 2.8) + M(cx_, cy_) + L(cx_ + 2.2, cy_ + 1.2), sw=0.6, stroke=GOLD)
s.path(M(cx_ - 6, cy_ + 7) + L(cx_ - 4, cy_ + 9.5) + L(cx_ + 4, cy_ + 9.5) + L(cx_ + 6, cy_ + 7), sw=0.6)

# ---- ground: Lower Thames Street and the wharf ----
for i, (x0, x1, yy) in enumerate([(10, 190, G + 1.5), (18, 184, G + 3.8), (30, 172, G + 6)]):
    s.path(s.wobble([(x0, yy), (x1, yy)], amp=0.15, seg=6), sw=0.9 if i == 0 else 0.5)
crowd_row(s, [96, 106, 117, 127, 138], G + 3.2, h=9, dir=1, hatched_every=3)

print(OUT, s.save(OUT, "St Magnus the Martyr, Lower Thames Street"), "bytes")
