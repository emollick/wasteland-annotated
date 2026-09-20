import sys; sys.path.insert(0, '.')
from vig import *

s = SVG(seed=41)
OUT = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/vignettes/cannon-street-hotel.svg'
G = 168
HX0, HX1 = 24, 176         # the hotel front on Cannon Street
STOREY = 9.6
CORN = G - 5 * STOREY - 6  # cornice line
ROOF = CORN - 13

# ---- the train shed behind: the great single arch of glass and iron, 200 ft across, lost upward in the fog ----
R = 92; CY = G - 8
shed = M(100 - R, CY) + f"A{R} {R} 0 0 1 {100 + R} {CY}" + "Z"
sky_clip = s.clip(rect(0, 0, 200, ROOF + 4))
s.add(f'<g clip-path="url(#{sky_clip})">')
s.path(shed, sw=1.3)
s.path(M(100 - R + 3, CY) + f"A{R - 3} {R - 3} 0 0 1 {100 + R - 3} {CY}", sw=0.5)
# the glazed end screen: vertical iron mullions and two transoms
segs = []
xx = 100 - R + 6
while xx < 100 + R - 5:
    segs.append((xx, CY, xx, CY - math.sqrt(max(0.0, (R - 3) ** 2 - (xx - 100) ** 2))))
    xx += 5.2
s.multi(segs, sw=0.4)
for yy in (ROOF - 18, ROOF - 40):
    half = math.sqrt(max(0.0, (R - 3) ** 2 - (CY - yy) ** 2))
    s.path(M(100 - half, yy) + L(100 + half, yy), sw=0.5, cap="butt")
s.hatch(shed, angle=0, spacing=2.2, sw=0.22, bbox=(0, 0, 200, ROOF + 4))
s.add('</g>')
# the fog of a winter noon, thickening upward, eating the top of the arch
s.stipple(rect(0, 0, 200, ROOF + 8), 1500, r=0.5, bbox=(0, 0, 200, ROOF + 8), weight=lambda x, y: max(0.0, min(1.0, (ROOF + 8 - y) / 60)) ** 1.2)

# ---- the hotel: five storeys of Italianate stone, a mansard with dormers, a taller pavilion over the centre ----
CX0, CX1 = 78, 122
end_l = side_face(HX0, CORN, G, 0, 30); s.path(end_l, sw=0.9); tone(s, end_l, 2, bbox=(8, 90, 26, 170), angle=30)
end_roof = poly([ob(HX0 - 2, CORN, 0), ob(HX0 - 2, CORN, 30), ob(HX0 + 2, ROOF - 5, 30), ob(HX0 + 2, ROOF - 5, 0)], True)
s.path(end_roof, sw=0.8); tone(s, end_roof, 3, bbox=(4, 80, 28, 130), angle=30)
for k in range(4):
    yb = G - STOREY * (k + 1) - 2
    for d0 in (5, 14, 23):
        w = side_face(HX0, yb - STOREY + 4.2, yb, d0, d0 + 5)
        s.fill(w)
s.path(rect(HX0, CORN, HX1 - HX0, G - CORN), sw=1.1)
# the mansard roof, slated, with dormers; centre and end pavilions rise higher
s.path(poly([(HX0 - 2, CORN), (HX0 + 2, ROOF), (HX1 - 2, ROOF), (HX1 + 2, CORN)], True), sw=0.9)
tone(s, poly([(HX0 - 2, CORN), (HX0 + 2, ROOF), (HX1 - 2, ROOF), (HX1 + 2, CORN)], True), 2, bbox=(HX0 - 2, ROOF, HX1 + 2, CORN), angle=0)
s.path(M(HX0 + 2, ROOF) + L(HX1 - 2, ROOF), sw=1.0, cap="butt")
for px0, px1, top in ((HX0 - 2, HX0 + 22, ROOF - 5), (CX0 - 4, CX1 + 4, ROOF - 9), (HX1 - 22, HX1 + 2, ROOF - 5)):
    pav = poly([(px0, CORN), (px0 + 3, top), (px1 - 3, top), (px1, CORN)], True)
    s.path(pav, sw=0.9); tone(s, pav, 3, bbox=(px0, top, px1, CORN), angle=0)
    s.path(M(px0 + 3, top) + L(px1 - 3, top), sw=1.1, cap="butt")
    # iron cresting
    x = px0 + 4
    while x < px1 - 3:
        s.path(M(x, top) + L(x, top - 2.2), sw=0.4, cap="butt"); x += 2
for dx in (38, 52, 66, 134, 148, 162):
    s.path(rect(dx - 2.6, CORN - 8, 5.2, 8), sw=0.5)
    s.path(M(dx - 3.4, CORN - 8) + L(dx, CORN - 10.5) + L(dx + 3.4, CORN - 8), sw=0.5)
s.path(M(HX0 - 3, CORN) + L(HX1 + 3, CORN), sw=1.6, cap="butt")
s.path(M(HX0 - 3, CORN + 2.6) + L(HX1 + 3, CORN + 2.6), sw=0.5, cap="butt")
# storeys and windows: nine bays, the centre three projecting
bays = [HX0 + 8 + i * 17 for i in range(9)]
s.path(rect(CX0, CORN + 2.6, CX1 - CX0, G - CORN - 2.6), sw=0.9)
s.fill(rect(CX1, CORN + 4, 2.8, G - CORN - 4))
for k in range(4):
    yb = G - STOREY * (k + 1) - 2
    s.path(M(HX0, yb - 0.2) + L(HX1, yb - 0.2), sw=0.45, cap="butt")
    for bx in bays:
        w, h = 6.5, STOREY - 4.2
        win = rect(bx - w / 2, yb - h, w, h)
        if k == 3:     # first floor: taller, pedimented, with balconies
            win = rect(bx - w / 2, yb - h - 1.2, w, h + 1.2)
            s.path(M(bx - w / 2 - 1.2, yb - h - 1.6) + L(bx, yb - h - 3.4) + L(bx + w / 2 + 1.2, yb - h - 1.6), sw=0.5)
            s.path(M(bx - w / 2 - 1.5, yb + 0.4) + L(bx + w / 2 + 1.5, yb + 0.4), sw=0.6, cap="butt")
        elif k == 2:
            s.path(M(bx - w / 2 - 1.2, yb - h - 1.2) + L(bx + w / 2 + 1.2, yb - h - 1.2), sw=0.6, cap="butt")
        s.path(win, sw=0.5); s.hatch(win, angle=62, spacing=0.85, sw=0.5, bbox=(bx - 4, yb - h - 2, bx + 4, yb))
# ground floor: an arcade of round-headed openings; the entrance under a porch in the centre
for bx in bays:
    a = arch(bx - 4, G - STOREY - 2 + 1.6, 8, STOREY + 0.4)
    s.path(a, sw=0.6); tone(s, a, 2, bbox=(bx - 4, G - STOREY - 2, bx + 4, G), angle=60)
door = arch(94, G - STOREY - 1.5, 12, STOREY + 1.5); s.fill(door)
s.path(rect(88, G - STOREY - 4.5, 24, 3), sw=0.7)       # the porch
s.path(M(88, G - STOREY - 4.5) + L(88, G) + M(112, G - STOREY - 4.5) + L(112, G), sw=0.7)
s.hatch(rect(88, G - STOREY - 4.5, 24, 3), angle=0, spacing=0.9, sw=0.35, bbox=(88, G - STOREY - 5, 112, G - STOREY - 1))
# rusticated ground floor courses
for yy in (G - 3.2, G - 6.4, G - 9.6):
    s.path(M(HX0, yy) + L(HX1, yy), sw=0.3, cap="butt", extra='stroke-dasharray="5 2"')

# ---- Cannon Street: a taxi, a horse cab, the crowd, and one man in a soft hat at the door ----
def taxi(x, y):
    s.fill(poly([(x, y), (x, y - 6), (x + 3, y - 6), (x + 5, y - 9.5), (x + 15, y - 9.5), (x + 17, y - 6), (x + 22, y - 6), (x + 22, y)], True))
    s.path(M(x + 5.5, y - 8.5) + L(x + 14, y - 8.5), sw=0.6, stroke=PAPER) if False else None
    for wx in (x + 5, x + 17):
        s.path(circle_path(wx, y, 2.6), sw=0.9); s.fill(circle_path(wx, y, 1.0))
def horse_cab(x, y):
    # a hansom: high wheels, the cab, the driver up behind, the horse in front
    s.fill(poly([(x, y - 4), (x, y - 12), (x + 2, y - 14), (x + 9, y - 14), (x + 11, y - 11), (x + 11, y - 4)], True))
    s.path(circle_path(x + 5.5, y - 1, 4.4), sw=0.9)
    s.fill(cityman(x + 4, y - 14, h=5.2, dir=1, step=0, bow=0.2))
    s.fill(poly([(x + 11, y - 9), (x + 13, y - 9.5), (x + 21, y - 10), (x + 25, y - 12.5), (x + 27, y - 9.5), (x + 25.5, y - 8), (x + 23, y - 7.5),
                 (x + 23, y), (x + 21.5, y), (x + 21, y - 5.5), (x + 15, y - 5.5), (x + 14.5, y), (x + 13, y), (x + 12.5, y - 6), (x + 11, y - 6)], True))
taxi(128, G + 0.5)
horse_cab(30, G + 0.5)
crowd_row(s, [70, 78, 86, 118, 158, 166], G + 0.5, h=8.5, dir=1, hatched_every=0)
# the Smyrna merchant, in a soft wide hat, waiting at the door
mx, my = 100, G + 0.5
def P(px, py): return (mx + px, my - py)
s.fill(poly([P(-2.4, 0), P(-2.6, 3.6), P(-2.2, 6.4), P(-1.2, 7.4), P(-0.8, 8.1), P(-3.4, 8.4), P(-3.4, 8.9), P(-1.6, 9.2), P(-0.8, 10.4), P(0.2, 10.1),
             P(1.2, 10.5), P(2.0, 9.2), P(3.8, 8.9), P(3.8, 8.4), P(1.2, 8.1), P(1.5, 7.4), P(2.6, 6.4), P(2.9, 3.6), P(2.6, 0), P(1.2, 0), P(1.0, 2.8), P(-1.0, 2.8), P(-1.1, 0)], True))
# ground
for i, (x0, x1, yy) in enumerate([(6, 194, G + 1.4), (14, 186, G + 3.8), (26, 174, G + 6)]):
    s.path(s.wobble([(x0, yy), (x1, yy)], amp=0.15, seg=6), sw=0.9 if i == 0 else 0.5)

print(OUT, s.save(OUT, "The Cannon Street Hotel"), "bytes")
