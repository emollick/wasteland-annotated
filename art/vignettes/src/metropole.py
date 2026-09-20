import sys; sys.path.insert(0, '.')
from vig import *
s = SVG(seed=71)
OUT = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/vignettes/the-metropole.svg'
G = 168; HX0, HX1 = 22, 182; ST = 8.6
CORN = G - 12 - 5 * ST        # 113
ROOF = CORN - 12
# receding west end
end = side_face(HX0, CORN, G, 0, 34); s.path(end, sw=0.9); tone(s, end, 2, bbox=(4, 90, 24, 170), angle=30)
end_roof = poly([ob(HX0 - 2, CORN, 0), ob(HX0 - 2, CORN, 34), ob(HX0 + 2, ROOF - 8, 34), ob(HX0 + 2, ROOF - 8, 0)], True)
s.path(end_roof, sw=0.8); tone(s, end_roof, 3, bbox=(0, 70, 26, 120), angle=30)
# the front: red terracotta drawn as courses
front = rect(HX0, CORN, HX1 - HX0, G - CORN); s.path(front, sw=1.1)
segs = []
yy = CORN + 3
while yy < G - 1:
    segs.append((HX0, yy, HX1, yy)); yy += 2.6
s.multi(segs, sw=0.2)
# storeys, windows (fourteen bays), balconies on the first and third floors
bays = [HX0 + 7 + i * 11.4 for i in range(14)]
for k in range(5):
    yb = G - 12 - ST * k
    for bx in bays:
        w = rect(bx - 2.6, yb - ST + 2.2, 5.2, ST - 3.2); s.path(w, sw=0.5); s.hatch(w, angle=62, spacing=0.85, sw=0.45, bbox=(bx - 3, yb - ST, bx + 3, yb))
    if k in (1, 3):
        s.path(M(HX0, yb - 0.3) + L(HX1, yb - 0.3), sw=0.7, cap="butt")
        x = HX0 + 1.2; segs = []
        while x < HX1:
            segs.append((x, yb - 0.5, x, yb - 3.2)); x += 1.4
        s.multi(segs, sw=0.3)
        s.path(M(HX0, yb - 3.4) + L(HX1, yb - 3.4), sw=0.5, cap="butt")
# ground floor: an arcade, the entrance under the tower
for bx in bays:
    a = arch(bx - 3.4, G - 11, 6.8, 11); s.path(a, sw=0.6); tone(s, a, 2, bbox=(bx - 4, G - 12, bx + 4, G), angle=60)
door = arch(92, G - 13, 16, 13); s.fill(door)
s.path(rect(88, G - 15.5, 24, 3), sw=0.7); s.hatch(rect(88, G - 15.5, 24, 3), angle=0, spacing=0.9, sw=0.35, bbox=(88, G - 16, 112, G - 12))
# cornice and the French roof with dormers
s.path(M(HX0 - 3, CORN) + L(HX1 + 3, CORN), sw=1.5, cap="butt")
s.path(M(HX0 - 3, CORN + 2.4) + L(HX1 + 3, CORN + 2.4), sw=0.5, cap="butt")
mans = poly([(HX0 - 2, CORN), (HX0 + 2, ROOF), (HX1 - 2, ROOF), (HX1 + 2, CORN)], True)
s.path(mans, sw=0.9); tone(s, mans, 2, bbox=(HX0 - 2, ROOF, HX1 + 2, CORN), angle=0)
s.path(M(HX0 + 2, ROOF) + L(HX1 - 2, ROOF), sw=0.9, cap="butt")
for dx in (46, 62, 78, 122, 138, 154):
    s.path(rect(dx - 2.4, CORN - 7.5, 4.8, 7.5), sw=0.5)
    s.path(M(dx - 3.2, CORN - 7.5) + L(dx, CORN - 10) + L(dx + 3.2, CORN - 7.5), sw=0.5)
# end pavilions with steep pavilion roofs and cresting
for px0, px1 in ((HX0 - 2, HX0 + 26), (HX1 - 26, HX1 + 2)):
    top = ROOF - 9
    pav = poly([(px0, CORN), (px0 + 4, top), (px1 - 4, top), (px1, CORN)], True)
    s.path(pav, sw=0.9); tone(s, pav, 3, bbox=(px0, top, px1, CORN), angle=0)
    s.path(M(px0 + 4, top) + L(px1 - 4, top), sw=1.1, cap="butt")
    x = px0 + 5; segs = []
    while x < px1 - 4:
        segs.append((x, top, x, top - 2.2)); x += 2
    s.multi(segs, sw=0.4)
# the central tower and its spire, the tallest thing on the front
TX0, TX1 = 89, 111
tw = rect(TX0, CORN - 24, TX1 - TX0, 24 + 2); s.path(tw, sw=0.9)
s.hatch(rect(TX1 - 5, CORN - 24, 5, 26), angle=90, spacing=0.9, sw=0.35, bbox=(TX0, CORN - 26, TX1, CORN))
for wy in (CORN - 20, CORN - 10):
    w = arch(97, wy, 6, 7); s.path(w, sw=0.5); tone(s, w, 3, bbox=(96, wy - 1, 104, wy + 8), angle=60)
s.path(M(TX0 - 2.5, CORN - 24) + L(TX1 + 2.5, CORN - 24), sw=1.1, cap="butt")
spire = M(TX0 - 1, CORN - 24) + f"Q{f(TX0 + 4)} {f(CORN - 46)} 100 {f(CORN - 76)}" + f"Q{f(TX1 - 4)} {f(CORN - 46)} {f(TX1 + 1)} {f(CORN - 24)}Z"
s.path(spire, sw=0.9); s.hatch(spire, angle=80, spacing=1.2, sw=0.4, bbox=(100, CORN - 78, TX1 + 2, CORN - 22))
s.hatch(spire, angle=0, spacing=2.4, sw=0.25, bbox=(TX0 - 2, CORN - 78, TX1 + 2, CORN - 22))
s.path(rect(97.5, CORN - 40, 5, 7), sw=0.5)     # a lucarne
s.path(M(100, CORN - 76) + L(100, CORN - 82), sw=0.7, cap="butt"); s.fill(circle_path(100, CORN - 83, 1.2))
# the King's Road, the railing of the promenade, two figures out for the weekend
for i, (x0, x1, yy) in enumerate([(4, 196, G + 1.4), (12, 188, G + 3.4)]):
    s.path(s.wobble([(x0, yy), (x1, yy)], amp=0.15, seg=6), sw=0.9 if i == 0 else 0.5)
RY = G + 9
s.path(M(4, RY) + L(196, RY), sw=0.7, cap="butt"); s.path(M(4, RY + 3.4) + L(196, RY + 3.4), sw=0.45, cap="butt")
x = 6; segs = []
while x < 196:
    segs.append((x, RY, x, RY + 6)); x += 4.2
s.multi(segs, sw=0.4)
s.fill(cityman(64, G + 8.8, h=11.5, dir=1, step=0.5, bow=0.2))
lx, ly = 74, G + 8.8
s.fill(poly([(lx - 3.4, ly), (lx - 2.2, ly - 6), (lx - 1.2, ly - 8.6), (lx - 0.7, ly - 9.6), (lx - 0.7, ly - 10.8), (lx + 0.7, ly - 10.8), (lx + 0.7, ly - 9.6), (lx + 1.2, ly - 8.6), (lx + 2.2, ly - 6), (lx + 3.4, ly)], True))
s.path(M(lx + 2.8, ly - 9) + L(lx + 4.6, ly - 15.4), sw=0.5)
s.path(M(lx - 1.2, ly - 15.4) + "q5.8 -4.6 11.6 0", sw=0.8)
# the beach: shingle, then the sea
s.stipple(rect(0, RY + 7, 200, 8), 260, r=0.4, bbox=(0, RY + 7, 200, RY + 15))
s.path(M(2, RY + 17) + L(198, RY + 17), sw=0.5, cap="butt")
print(OUT, s.save(OUT, "The Metropole, Brighton"), "bytes")
