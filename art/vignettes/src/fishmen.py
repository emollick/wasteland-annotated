import sys; sys.path.insert(0, '.')
from vig import *

s = SVG(seed=17)
OUT = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/vignettes/lower-thames-street-bar.svg'
G = 168
PX0, PX1 = 44, 170
TOP = 84

# ---- the side of the pub receding down the lane, and a chimney ----
side = side_face(PX0, TOP, G, 0, 38); s.path(side, sw=0.9); tone(s, side, 2, bbox=(20, 60, 46, 170), angle=30)
sw_ = side_face(PX0, 96, 116, 10, 24); s.path(sw_, sw=0.5); tone(s, sw_, 3, bbox=(30, 80, 46, 120), angle=30)
s.path(top_face(TOP, PX0, PX1, 0, 38), sw=0.5)

# ---- upper storey: London stock brick, two sash windows ----
s.path(rect(PX0, TOP, PX1 - PX0, 122 - TOP), sw=1.0)
s.path(M(PX0 - 2, TOP) + L(PX1 + 2, TOP), sw=1.3, cap="butt")
s.path(M(PX0 - 2, TOP + 2.4) + L(PX1 + 2, TOP + 2.4), sw=0.5, cap="butt")
for yy in (TOP + 9, TOP + 21, TOP + 33):
    s.path(M(PX0, yy) + L(PX1, yy), sw=0.25, cap="butt", extra='stroke-dasharray="9 3"')
for px in (PX0 + 1.5, PX1 - 6.5):
    s.path(rect(px, TOP + 3, 5, 122 - TOP - 3), sw=0.5); s.hatch(rect(px, TOP + 3, 5, 122 - TOP - 3), angle=90, spacing=1.1, sw=0.3, bbox=(px, TOP, px + 5, 122))
for wx in (54, 141):
    w = rect(wx, 92, 19, 24); s.path(w, sw=0.6); s.hatch(w, angle=62, spacing=0.9, sw=0.45, bbox=(wx, 92, wx + 19, 116))
    s.path(M(wx, 104) + L(wx + 19, 104) + M(wx + 9.5, 92) + L(wx + 9.5, 116), sw=0.7, cap="butt")
    s.path(M(wx - 1.5, 116) + L(wx + 20.5, 116), sw=0.9, cap="butt")
    s.path(M(wx - 2, 91) + L(wx + 21, 91), sw=0.9, cap="butt")
    s.path(M(wx + 7.5, 91) + L(wx + 9.5, 87.5) + L(wx + 11.5, 91), sw=0.5)

# ---- the fascia, dark and glossy, with one gilt rule and no letters ----
fas = rect(PX0 - 2.5, 122, PX1 - PX0 + 5, 10)
s.path(fas, sw=0.8); s.hatch(fas, angle=0, spacing=0.8, sw=0.5, bbox=(PX0 - 3, 122, PX1 + 3, 132))
s.path(M(PX0 + 6, 129.6) + L(PX1 - 6, 129.6), sw=0.6, stroke=GOLD, cap="butt")
# corner lamp on its bracket
s.path(M(PX0, 117) + f"c-4 0 -6 1 -8 -3", sw=0.7)
s.path(poly([(PX0 - 10, 111), (PX0 - 6, 111), (PX0 - 5.4, 106), (PX0 - 8, 104), (PX0 - 10.6, 106)], True), sw=0.6)
s.path(M(PX0 - 8, 111) + L(PX0 - 8, 113.5), sw=0.6)

# ---- the public bar front: pilasters, etched-glass windows over panelled stall-risers, the door open ----
for px in (PX0, 92, 112, PX1 - 6):
    p = rect(px, 132, 6, G - 132); s.path(p, sw=0.7); s.hatch(p, angle=90, spacing=1.0, sw=0.35, bbox=(px, 132, px + 6, G))
    s.path(rect(px - 1, 132, 8, 3), sw=0.6)
for wx0, wx1 in ((50, 92), (118, 164)):
    glass = rect(wx0 + 1.5, 136, wx1 - wx0 - 3, 20)
    s.path(rect(wx0, 135, wx1 - wx0, 22), sw=0.8)
    s.hatch(glass, angle=45, spacing=1.9, sw=0.3, bbox=(wx0, 136, wx1, 156))
    # an etched band and scrolls in the glass, left clear
    band = rect(wx0 + 1.5, 144, wx1 - wx0 - 3, 4.6)
    s.fill(band, color="none", extra='stroke="none"')
    s.add(f'<path d="{band}" fill="none" stroke="currentColor" stroke-width="0.35"/>')
    for k in range(int((wx1 - wx0 - 3) / 6)):
        cx = wx0 + 4.5 + k * 6
        s.path(M(cx - 2, 146.3) + "c0.6 -1.6 1.4 -1.6 2 0 c0.6 1.6 1.4 1.6 2 0", sw=0.35)
    s.path(M(wx0, 146.3) + L(wx1, 146.3), sw=0) if False else None
    # stall-riser panels
    s.path(rect(wx0, 157, wx1 - wx0, G - 157), sw=0.7)
    for k in range(3):
        pw = (wx1 - wx0 - 8) / 3
        pnl = rect(wx0 + 2 + k * (pw + 2), 159, pw, G - 161); s.path(pnl, sw=0.4); s.hatch(pnl, angle=0, spacing=1.2, sw=0.3, bbox=(wx0, 159, wx1, G))
door = rect(98, 136, 14, G - 136); s.fill(door)
s.path(rect(97, 135, 16, 3), sw=0.6); s.hatch(rect(97, 135, 16, 3), angle=45, spacing=0.9, sw=0.3, bbox=(97, 135, 113, 138))
s.path(rect(96, 138.5, 18, 1.6), sw=0.5)

# ---- the fishmen lounging at noon; the mandoline; boxes ----
# stacked fish boxes by the right pilaster
for k, (bx, by, bw, bh) in enumerate(((146, G - 6, 17, 6), (147, G - 12, 15, 6), (148.5, G - 17, 12, 5))):
    b = rect(bx, by, bw, bh); s.path(b, sw=0.6); s.hatch(b, angle=0, spacing=1.6, sw=0.3, bbox=(bx, by, bx + bw, by + bh))
# a porter with a box on his hat, going by
s.fill(porter(140, G + 0.6, h=15.5, dir=-1, box=True))
# one leaning on the pilaster by the door, pipe
s.fill(porter(118.5, G + 0.6, h=15, dir=-1))
s.path(M(115.4, G - 12.2) + L(112.2, G - 10.8), sw=0.7)
s.path(M(111.8, G - 11.6) + "c-0.6 -1.6 0.3 -2.6 0.5 -4.4", sw=0.4)
# one standing, hands in pockets, listening
s.fill(porter(84, G + 0.6, h=15.2, dir=1))
# the mandoline player, sat on an upturned box, back to the window
bx, by = 60, G + 0.6
s.path(rect(bx - 6, by - 7, 12, 7), sw=0.6); s.hatch(rect(bx - 6, by - 7, 12, 7), angle=0, spacing=1.6, sw=0.3, bbox=(bx - 6, by - 7, bx + 6, by))
def P(px, py): return (bx + px * 1.45, by - py * 1.45)
sit = poly([P(-2.6, 0), P(-2.6, 2.4), P(-4.4, 6.2), P(-4.2, 10.4), P(-3.0, 12.4), P(-1.6, 13.2), P(-1.2, 14.4), P(-2.8, 14.6), P(-2.8, 15.1), P(-0.9, 15.3),
            P(0.1, 16.9), P(1.9, 16.8), P(2.6, 15.6), P(2.6, 15.1), P(1.6, 15.0), P(1.6, 13.6), P(1.4, 12.6), P(3.4, 11.4), P(4.4, 9.0), P(4.6, 6.2),
            P(4.0, 5.8), P(4.4, 3.2), P(4.2, 0), P(3.0, 0), P(3.0, 5.4), P(1.2, 5.6), P(0.8, 0)], True)
s.fill(sit)
# the mandoline: a round back, a short neck up to the left, held at the chest
mx_, my_ = bx + 5.6, by - 12.4
s.fill(ellipse_path(mx_, my_, 4.0, 3.1))
s.path(M(mx_ - 3.4, my_ - 1.2) + L(mx_ - 10.5, my_ - 6.8), sw=1.4, cap="round")
s.path(circle_path(mx_ + 0.4, my_ - 0.2, 1.0), sw=0.45, stroke=GOLD)
s.path(M(mx_ - 3.6, my_ - 1.4) + L(mx_ + 2.4, my_ + 1.2), sw=0.35, stroke=GOLD)
# a gull on the parapet
s.path(M(150, TOP - 1) + "c1 -3 3 -3.5 4.5 -1.5 c1 -2.5 3 -2 3.5 0", sw=0.5)

# ---- the pavement ----
for i, (x0, x1, yy) in enumerate([(14, 190, G + 1.6), (24, 184, G + 4), (34, 176, G + 6.2)]):
    s.path(s.wobble([(x0, yy), (x1, yy)], amp=0.15, seg=6), sw=0.9 if i == 0 else 0.5)

print(OUT, s.save(OUT, "A public bar in Lower Thames Street"), "bytes")
