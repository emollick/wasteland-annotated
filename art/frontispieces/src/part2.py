import sys; sys.path.insert(0, 'src')
from engrave import *
import math, random

OUT = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/frontispieces/part-2.svg'
W, H = 1200, 700
cv = Canvas(W, H, prefix="p2", seed=22)
rng = random.Random(22)
VP = (600, 380)   # vanishing point
CEIL = 118        # bottom edge of the coffered ceiling on the back wall
FLOOR = 560       # where the back wall meets the floor

# ============================================================ the room: laquearia above, floorboards below, wall between
# coffered ceiling in one-point perspective: beams converge on VP; cross beams are horizontals
def persp(x, y, depth):
    """move a point on the back wall plane toward the viewer: depth 0 = wall, 1 = picture plane"""
    return (VP[0] + (x - VP[0]) / (1 - depth * 0.85), VP[1] + (y - VP[1]) / (1 - depth * 0.85))
ceiling = [(0, 0), (W, 0), (W, 0), (W, 60), (1000, CEIL), (200, CEIL), (0, 60)]
ceiling = [(0, 0), (W, 0), (W, 0), (1080, CEIL), (120, CEIL), (0, 0)]
# beams from wall to viewer
beams = []
for k in range(-6, 7):
    x = VP[0] + k * 85
    p0 = (x, CEIL)
    # extend the ray from VP through p0 to the top edge
    dx, dy = p0[0] - VP[0], p0[1] - VP[1]
    t = (0 - VP[1]) / dy
    p1 = (VP[0] + dx * t, 0)
    beams.append([p0, p1])
cv.strokes(beams, 1.4)
# cross beams: horizontals at receding depths
ys = [CEIL]
d = 0.0
for i in range(7):
    d += 0.09 + i * 0.02
    y = VP[1] + (CEIL - VP[1]) / (1 - d * 0.85)
    if y < 0: break
    ys.append(y)
    xl = VP[0] + (120 - VP[0]) / (1 - d * 0.85); xr = VP[0] + (1080 - VP[0]) / (1 - d * 0.85)
    cv.stroke([(max(0, xl), y), (min(W, xr), y)], 1.4)
# coffers: shade the inside of each coffer with a darker band (a second inner rectangle, hatched on two sides)
coffer_polys = []
for i in range(len(ys) - 1):
    for k in range(-6, 6):
        # corners along two rays
        def on_ray(x_wall, y):
            dx, dy = x_wall - VP[0], CEIL - VP[1]
            t = (y - VP[1]) / dy
            return VP[0] + dx * t
        y0, y1 = ys[i], ys[i + 1]
        xa0, xb0 = on_ray(VP[0] + k * 85, y0), on_ray(VP[0] + (k + 1) * 85, y0)
        xa1, xb1 = on_ray(VP[0] + k * 85, y1), on_ray(VP[0] + (k + 1) * 85, y1)
        quad = [(xa0, y0), (xb0, y0), (xb1, y1), (xa1, y1)]
        # inset
        c = ((xa0 + xb0 + xa1 + xb1) / 4, (y0 + y1) / 2)
        inset = [lerp(p, c, 0.28) for p in quad]
        coffer_polys.append((quad, inset))
for quad, inset in coffer_polys:
    if all(0 <= p[0] <= W for p in inset):
        cv.stroke(inset, 0.8, closed=True)
        # shadow on the top and right inner faces of the coffer
        cv.hatch([[quad[0], quad[1], inset[1], inset[0]]], angle=0, spacing=2.6, w=0.7)
        cv.hatch([[quad[1], quad[2], inset[2], inset[1]]], angle=90, spacing=2.8, w=0.7)
# the wall: fine vertical rules, close and even, darker toward the corners
wall = [(0, 0), (W, 0), (W, FLOOR), (0, FLOOR)]
# (drawn later, with holes for everything in front of it)

# ============================================================ the fireplace, centre: antique mantel, and above it the sylvan scene
MX0, MX1 = 560, 830
SHELF = 400
pilasters = [rect(MX0, SHELF + 14, 34, FLOOR - SHELF - 14), rect(MX1 - 34, SHELF + 14, 34, FLOOR - SHELF - 14)]
shelf = rect(MX0 - 14, SHELF, MX1 - MX0 + 28, 14)
lintel = rect(MX0, SHELF + 14, MX1 - MX0, 30)
opening = rect(MX0 + 34, SHELF + 44, MX1 - MX0 - 68, FLOOR - SHELF - 44)
# the picture above the mantel: a window on the sylvan scene
PIC = rect(MX0 + 18, 150, MX1 - MX0 - 36, SHELF - 176)
PIC_IN = rect(PIC[0][0] + 14, PIC[0][1] + 14, (PIC[1][0] - PIC[0][0]) - 28, (PIC[2][1] - PIC[0][1]) - 28)

# ============================================================ the dressing table at right: the glass held up by standards wrought with fruited vines
TX0, TX1, TY = 860, 1090, 430
table_top = [(TX0, TY), (TX1, TY), (TX1 + 16, TY + 18), (TX0 - 16, TY + 18)]
MIRC = (975, 300); MRX, MRY = 78, 112
mirror = ellipse(MIRC[0], MIRC[1], MRX, MRY, 64)
mirror_frame = ellipse(MIRC[0], MIRC[1], MRX + 12, MRY + 12, 64)

# ============================================================ the woman in the chair, hair spread out in fiery points
# chair (a burnished throne seen from the side, facing the glass), and the figure sitting in it, in profile
CH = (300, 470)  # seat front-left corner-ish reference
def chair():
    back = smooth([(258, 236), (270, 226), (286, 234), (296, 300), (300, 470), (270, 470), (262, 300)], closed=True, n=3)
    seat = [(262, 440), (420, 440), (430, 470), (256, 470)]
    legs = [rect(262, 470, 12, 90), rect(414, 470, 12, 90)]
    arm = smooth([(296, 350), (400, 344), (416, 352), (404, 362), (300, 366)], closed=True, n=3)
    finial = circle(272, 222, 10, 20)
    return back, seat, legs, arm, finial
back, seat, legs, arm, finial = chair()

def woman():
    # local coords: hip at (0,0); facing right (toward the glass); y up is negative
    ox, oy = 372, 440
    T = lambda pts: [(ox + x, oy + y) for x, y in pts]
    dress = T(smooth([(-8, -100), (-30, -92), (-36, -40), (-42, 0), (-46, 60), (-42, 120), (0, 128), (60, 126), (120, 122), (152, 104),
                      (142, 62), (122, 22), (98, 6), (62, -4), (32, -12), (34, -42), (38, -70), (30, -90), (10, -100)], closed=True, n=4))
    head = T(smooth([(10, -116), (18, -128), (16, -134), (26, -144), (18, -152), (16, -162), (12, -176), (2, -186), (-12, -184), (-22, -172),
                     (-24, -150), (-20, -130), (-8, -116)], closed=True, n=3))
    neck = T([(-10, -118), (8, -118), (10, -100), (-8, -100)])
    face_line = T([(12, -176), (17, -164), (15, -152), (27, -143), (18, -138), (20, -132), (16, -128), (19, -124), (14, -117), (2, -112)])
    eye = T([(4, -156), (13, -158)])
    brow = T([(2, -164), (15, -166)])
    arm_ = T(smooth([(-2, -196), (8, -206), (20, -204), (26, -196), (18, -188), (6, -188)], closed=True, n=3))   # the hand, seen over the crown
    brush = T([(-4, -206), (-22, -224), (-16, -230), (2, -212), (30, -198), (26, -190)])
    mass = T(smooth([(-24, -150), (-26, -174), (-14, -188), (4, -190), (14, -180), (6, -184), (-10, -180), (-18, -166), (-20, -146), (-14, -128), (-20, -128)], closed=True, n=3))
    strands = []
    r = random.Random(7)
    for i in range(30):
        t = i / 29
        # fan from straight back (left) round to straight up; the strands sweep up and back, then their points whip forward
        a0 = math.radians(-180 + t * 118 + r.uniform(-6, 6))
        L = r.uniform(90, 250) * (1.2 if 0.25 < t < 0.8 else 0.8)
        p0 = (ox - 16 + 18 * math.cos(a0), oy - 160 + 22 * math.sin(a0))
        p1 = (p0[0] + math.cos(a0) * L * 0.45, p0[1] + math.sin(a0) * L * 0.45)
        a1 = a0 + r.uniform(0.25, 0.7)
        p2 = (p1[0] + math.cos(a1) * L * 0.35, p1[1] + math.sin(a1) * L * 0.35)
        a2 = a1 + r.uniform(0.3, 0.8)
        p3 = (p2[0] + math.cos(a2) * L * 0.2, p2[1] + math.sin(a2) * L * 0.2)
        strands.append((smooth([p0, p1, p2, p3], n=6), r.uniform(1.8, 4.6)))
    return dress, head, neck, face_line, eye, brow, arm_, brush, mass, strands
dress, head, neck, face_line, eye, brow, arm_, brush, hair_mass, strands = woman()

# ============================================================ chess table, foreground
CT = (600, 640)
def chessboard(cx, cy, w=170, depth=52, skew=0.18):
    # a parallelogram board in perspective
    tl = (cx - w / 2 + w * skew, cy - depth); tr = (cx + w / 2 - w * skew * 0.2, cy - depth)
    bl = (cx - w / 2, cy); br = (cx + w / 2, cy)
    board = [tl, tr, br, bl]
    squares = []
    for i in range(8):
        for j in range(8):
            if (i + j) % 2 == 1:
                a = lerp(lerp(tl, tr, i / 8), lerp(bl, br, i / 8), j / 8)
                b = lerp(lerp(tl, tr, (i + 1) / 8), lerp(bl, br, (i + 1) / 8), j / 8)
                c = lerp(lerp(tl, tr, (i + 1) / 8), lerp(bl, br, (i + 1) / 8), (j + 1) / 8)
                d = lerp(lerp(tl, tr, i / 8), lerp(bl, br, i / 8), (j + 1) / 8)
                squares.append([a, b, c, d])
    return board, squares, (tl, tr, bl, br)
board, squares, corners = chessboard(*CT)
def piece(kind, x, y, h):
    u = h / 40.0
    if kind == 'king':
        P = [(-7, 0), (7, 0), (5, -6), (3, -14), (5, -22), (4, -30), (2, -32), (2, -35), (5, -35), (5, -37), (2, -37), (2, -40), (-2, -40), (-2, -37), (-5, -37), (-5, -35), (-2, -35), (-2, -32), (-4, -30), (-5, -22), (-3, -14), (-5, -6)]
    elif kind == 'queen':
        P = [(-7, 0), (7, 0), (5, -6), (3, -14), (5, -24), (7, -30), (4, -30), (2, -36), (0, -30), (-2, -36), (-4, -30), (-7, -30), (-5, -24), (-3, -14), (-5, -6)]
    elif kind == 'bishop':
        P = [(-6, 0), (6, 0), (4, -6), (2, -12), (5, -22), (2, -30), (0, -34), (-2, -30), (-5, -22), (-2, -12), (-4, -6)]
    elif kind == 'knight':
        P = [(-7, 0), (7, 0), (5, -8), (6, -18), (9, -26), (7, -32), (1, -34), (-4, -30), (-6, -22), (-2, -20), (-3, -14), (-5, -8)]
    else:  # pawn
        P = [(-5, 0), (5, 0), (3, -6), (2, -12), (4, -18), (2, -22), (-2, -22), (-4, -18), (-2, -12), (-3, -6)]
    return smooth([(x + px * u, y + py * u) for px, py in P], closed=True, n=2)
pieces = []
tl, tr, bl, br = corners
def sq_center(i, j):
    return lerp(lerp(lerp(tl, tr, (i + 0.5) / 8), lerp(bl, br, (i + 0.5) / 8), (j + 0.5) / 8), (0, 0), 0)
for kind, i, j, h in [('king', 4, 6, 44), ('queen', 3, 5, 40), ('bishop', 5, 4, 34), ('knight', 1, 6, 34), ('pawn', 2, 4, 24), ('pawn', 6, 5, 25), ('pawn', 4, 2, 20), ('king', 4, 0, 34), ('knight', 6, 1, 26), ('pawn', 1, 2, 18)]:
    c = sq_center(i, j)
    pieces.append(piece(kind, c[0], c[1] + 2, h))

# ============================================================ now draw, back to front
occ_wall = [PIC, shelf, lintel] + pilasters + [opening, back, seat, dress, head, neck, arm_, hair_mass, mirror_frame, table_top] + legs + [arm]
# wall: even vertical rules (the paper of the wall), fading toward the centre so the eye rests there
cv.hatch([[(0, CEIL), (W, CEIL), (W, FLOOR), (0, FLOOR)]], angle=90, spacing=4.6, w=0.55, jitter=0.1, holes=occ_wall,
         break_fn=lambda x, y: min(1, max(0.12, abs(x - 640) / 520)), piece=(30, 90))
# dado line
cv.hatch([[(0, FLOOR - 12), (W, FLOOR - 12), (W, FLOOR), (0, FLOOR)]], angle=0, spacing=2.6, w=0.7, holes=occ_wall)
# floorboards: rays from VP, and a couple of horizontals; darker under things
floor = [(0, FLOOR), (W, FLOOR), (W, H), (0, H)]
occ_floor = [seat, dress] + legs + [board] + pieces + [opening] + pilasters
rays = []
for k in range(-14, 15):
    x = VP[0] + k * 62
    dx, dy = x - VP[0], FLOOR - VP[1]
    t = (H - VP[1]) / dy
    rays.append([(x, FLOOR), (VP[0] + dx * t, H)])
cv.hatch_lines([floor], rays, 0.9, holes=occ_floor)
cv.hatch([floor], angle=0, spacing_fn=lambda u: 6 + 18 * u, w=0.6, jitter=0.3, holes=occ_floor, break_fn=lambda x, y: 0.5, piece=(30, 120))
# shadow under the chair and table
cv.hatch([[(250, 560), (440, 560), (470, 600), (230, 600)]], angle=0, spacing=2.4, w=0.8, holes=legs + [dress])
cv.hatch([[(560, FLOOR), (830, FLOOR), (860, 600), (530, 600)]], angle=0, spacing=2.4, w=0.8, holes=[board] + pieces)

# ---- fireplace
for p in pilasters + [shelf, lintel]:
    cv.stroke(p, 1.6, closed=True)
cv.hatch(pilasters, angle=90, spacing=3.2, w=0.7, break_fn=lambda x, y: 0.55, piece=(20, 60))
cv.hatch([lintel], angle=0, spacing=3.0, w=0.7, break_fn=lambda x, y: min(1, max(0.2, (y - SHELF - 14) / 30)))
# fluting on the pilasters, and the carvèd dolphin swimming in the coloured stone of the lintel
for p in pilasters:
    x0 = p[0][0]
    for k in range(1, 4):
        cv.stroke([(x0 + k * 8.5, SHELF + 24), (x0 + k * 8.5, FLOOR - 10)], 1.1)
def dolphin(cx, cy, s):
    body = smooth([(-30, 4), (-22, -6), (-8, -10), (8, -8), (20, -2), (30, 6), (36, 0), (38, 8), (30, 12), (18, 8), (4, 10), (-10, 8), (-22, 10)], closed=True, n=3)
    fin = [(-4, -8), (2, -20), (10, -8)]
    return place(body, cx, cy, s), place(fin, cx, cy, s)
dbody, dfin = dolphin((MX0 + MX1) / 2, SHELF + 29, 0.9)
cv.stroke(dbody, 1.2, closed=True); cv.stroke(dfin, 1.0, closed=True)
cv.hatch([dbody], angle=20, spacing=2.6, w=0.6, break_fn=lambda x, y: 0.7)
# the opening: dark, with the grate and the sea-wood burning green and orange; the flames are cut out of the dark
grate_y = FLOOR - 40
fl = []
for k, (fx, fh, fw, lean) in enumerate([(636, 44, 20, -0.15), (662, 66, 26, 0.05), (690, 58, 24, 0.2), (716, 72, 26, -0.1), (742, 40, 18, 0.15), (676, 34, 16, 0.3), (704, 30, 14, -0.3)]):
    fl.extend(flame2(fx, grate_y - 4, fh, fw, lean, seed=k))
fire = union(fl)
cv.hatch([opening], angle=0, spacing=2.2, w=1.0, holes=grow(fire, 1.5))
cv.hatch([opening], angle=90, spacing=3.0, w=0.8, holes=grow(fire, 1.5))
cv.stroke([(MX0 + 50, grate_y), (MX1 - 50, grate_y)], 2.4)
for gx in range(MX0 + 60, MX1 - 50, 18):
    cv.stroke([(gx, grate_y), (gx, grate_y + 30)], 1.6)
# the flames themselves: a light contour inside, so they read as light against the dark grate
cv.strokes(fire, 0.9, closed=True)
cv.hatch(fire, angle=84, spacing=3.2, w=0.6, break_fn=lambda x, y: min(1, max(0.0, (y - grate_y + 34) / 40)), piece=(4, 10))
for (lx, ly, ll, la) in [(628, grate_y - 4, 120, 5), (664, grate_y - 12, 100, -7)]:
    log = place(rect(0, -6, ll, 12), lx, ly, 1, la)
    cv.stroke(log, 1.2, closed=True)
    cv.hatch([log], angle=la, spacing=2.2, w=0.7)
    cv.stroke(place(ellipse(0, 0, 3, 6, 12), lx, ly, 1, la), 1.0, closed=True)

# ---- the picture: as though a window gave upon the sylvan scene
cv.stroke(PIC, 2.0, closed=True)
cv.stroke(PIC_IN, 1.2, closed=True)
cv.hatch([PIC, PIC_IN], angle=45, spacing=3.0, w=0.7)   # the frame, a dark moulding (PIC minus PIC_IN by even-odd)
# inside: a wood at dusk, a nightingale on a bough, and far off the barbarous king's tower
px0, py0 = PIC_IN[0]; px1, py1 = PIC_IN[2]
scene = [PIC_IN]
# sky in the picture: fine horizontals with a moon
moon = circle(px0 + 60, py0 + 40, 16, 32)
cv.hatch(scene, angle=0, spacing_fn=lambda u: 2.6 + 3 * u, w=0.5, holes=[moon], break_fn=lambda x, y: 1 if y < py0 + 90 else 0)
cv.stroke(moon, 1.0, closed=True)
# ground of the picture
cv.hatch([[(px0, py1 - 40), (px1, py1 - 40), (px1, py1), (px0, py1)]], angle=0, spacing=3.2, w=0.6, break_fn=lambda x, y: 0.7)
# trees: three dark trunks with foliage as stippled masses
for (tx, th, sd) in [(px0 + 30, 120, 1), (px1 - 44, 140, 2), (px0 + 118, 90, 3)]:
    t = gnarled_tree(cv, tx, py1 - 30, th, seed=sd, lean=0.1, spread=0.9, depth=3, grain=False, base_w=th * 0.05)
    canopy = smooth([(tx - th * 0.36, py1 - 30 - th * 0.55), (tx - th * 0.3, py1 - 30 - th * 0.95), (tx, py1 - 30 - th * 1.05), (tx + th * 0.32, py1 - 30 - th * 0.9), (tx + th * 0.38, py1 - 30 - th * 0.55), (tx, py1 - 30 - th * 0.45)], closed=True, n=3)
    cv.stipple([canopy], n=int(th * 6), size=1.2, holes=[], density_fn=lambda x, y, tx=tx: 0.5 + 0.5 * max(0, (x - tx) / 40))
    cv.hatch([canopy], angle=30, spacing=3.4, w=0.6, break_fn=lambda x, y, tx=tx: min(1, max(0.1, (x - tx + 10) / 40)), piece=(4, 12))
# the nightingale on a bough, mid-air between the trees, filling the desert with inviolable voice
bough = [(px0 + 60, py0 + 120), (px0 + 120, py0 + 112), (px0 + 170, py0 + 118)]
cv.stroke(smooth(bough, n=4), 2.2)
def nightingale(x, y, s, flip=False):
    body = smooth([(-14, 0), (-8, -7), (2, -9), (10, -7), (16, -2), (12, 4), (0, 6), (-10, 5)], closed=True, n=3)
    headp = smooth([(10, -8), (14, -13), (20, -12), (24, -9), (20, -5), (14, -5)], closed=True, n=3)
    beak = [(23, -10), (31, -8), (23, -6)]
    tail = [(-14, 0), (-28, 4), (-26, 8), (-12, 5)]
    wing = smooth([(-4, -7), (-2, -2), (6, -3), (12, -6)], n=3)
    return [place(p, x, y, s, flip=flip) for p in (body, headp, beak, tail, wing)]
nb = nightingale(px0 + 116, py0 + 104, 1.05)
cv.fill(nb[0]); cv.fill(nb[1]); cv.fill(nb[2]); cv.fill(nb[3])
# the song: little ticks rising from the beak
cv.strokes([[(px0 + 146 + k * 6, py0 + 92 - k * 5), (px0 + 148 + k * 6, py0 + 88 - k * 5)] for k in range(4)], 1.0)

# ---- the chair and the woman
cv.fill(back); cv.fill(seat); cv.fills(legs); cv.fill(arm); cv.fill(finial)
# burnished: a highlight cut out of the chair back and seat front (white line)
whiteline(cv, back, [offset_polyline([(268, 250), (272, 300), (276, 440)], 1.4)])
# the gown: black, with folds and the raised arm cut out of it (white line)
folds = [offset_polyline(smooth([(372 + 30, 440 - 20), (372 + 70, 440 + 20), (372 + 110, 440 + 60), (372 + 130, 440 + 110)], n=4), [0.5, 1.4, 1.6, 0.7]),
         offset_polyline(smooth([(372 + 10, 440 - 10), (372 + 40, 440 + 30), (372 + 74, 440 + 80), (372 + 80, 440 + 122)], n=4), [0.5, 1.3, 1.5, 0.7]),
         offset_polyline(smooth([(372 - 14, 440 - 20), (372 + 2, 440 + 40), (372 + 22, 440 + 124)], n=4), [0.4, 1.2, 0.7]),
         offset_polyline(smooth([(372 - 30, 440 - 30), (372 - 30, 440 + 30), (372 - 26, 440 + 122)], n=4), [0.4, 1.0, 0.7]),
         offset_polyline(smooth([(372 + 2, 440 - 96), (372 + 14, 440 - 60), (372 + 10, 440 - 20)], n=4), [0.3, 0.9, 0.4])]
cv.fill_multi(diff(dress, [arm_] + folds), rule="evenodd")
cv.fill_multi(diff(hair_mass, arm_), rule="evenodd")
cv.stroke(head, 1.4, closed=True)
cv.stroke(neck, 1.1, closed=True)
cv.stroke(face_line, 1.6)
cv.stroke(eye, 1.2); cv.stroke(brow, 1.0)
cv.hatch([head], angle=-70, spacing=3.0, w=0.6, break_fn=lambda x, y: min(1, max(0.0, (352 - x) / 30)), piece=(4, 10), holes=[arm_])
cv.hatch([neck], angle=-70, spacing=3.0, w=0.6, break_fn=lambda x, y: min(1, max(0, (372 - x) / 16)), piece=(4, 10))
cv.stroke(arm_, 1.2, closed=True)
cv.hatch([arm_], angle=70, spacing=2.8, w=0.6, break_fn=lambda x, y: 0.4, piece=(4, 12))
cv.fill(brush)
# bristles
cv.strokes([[(372 - 8 - k * 3, 440 - 214 - k * 3), (372 - 12 - k * 3, 440 - 206 - k * 3)] for k in range(4)], 1.0)
strand_polys = [offset_polyline(pts, [wdt, wdt * 0.85, wdt * 0.5, 0.15]) for pts, wdt in strands]
cv.fill_multi(diff(strand_polys, arm_), rule="evenodd")

# ---- dressing table, the glass, the standards wrought with fruited vines, the Cupidons, the candelabra doubled
cv.stroke(table_top, 1.6, closed=True)
cv.hatch([table_top], angle=0, spacing=2.6, w=0.6, break_fn=lambda x, y: 0.6)
cv.strokes([[(TX0 - 6, TY + 18), (TX0 - 6, FLOOR + 30)], [(TX1 + 6, TY + 18), (TX1 + 6, FLOOR + 30)]], 3.0)
# marble veining on the table front
cv.stroke(rect(TX0 - 16, TY + 18, TX1 - TX0 + 32, 26), 1.2, closed=True)
cv.hatch([rect(TX0 - 16, TY + 18, TX1 - TX0 + 32, 26)], angle=0, spacing=2.4, w=0.6)
# the mirror: the reflection is a lighter world, the glass ruled diagonally
cv.stroke(mirror_frame, 2.0, closed=True)
cv.stroke(mirror, 1.2, closed=True)
cv.hatch([mirror_frame, mirror], angle=0, spacing=2.4, w=0.8)
# vines on the frame: a twining line with leaves and bunches
vine = [p for p in ellipse(MIRC[0], MIRC[1], MRX + 6, MRY + 6, 80)]
cv.stroke([(x + 3 * math.sin(i * 0.9), y + 3 * math.cos(i * 0.9)) for i, (x, y) in enumerate(vine)], 1.0, closed=True)
grapes = []
for i in range(0, 80, 5):
    x, y = vine[i]
    a = math.atan2(y - MIRC[1], x - MIRC[0])
    for k in range(3):
        grapes.append(circle(x + math.cos(a) * (2 + k * 2.2), y + math.sin(a) * (2 + k * 2.2) + (k % 2) * 2 - 1, 1.6, 8))
cv.fills(grapes)
# Cupidons: one peeping out from the top left, another hiding his eyes behind his wing at the top right
def cupidon(x, y, s, hiding=False, flip=False):
    headp = smooth([(-9, -14), (-6, -24), (2, -28), (10, -24), (12, -14), (8, -6), (0, -4), (-7, -7)], closed=True, n=3)
    curls = [arc_pts(-4 + k * 5, -26, 3, 180, 360, 6) for k in range(3)]
    body = smooth([(-8, -6), (8, -6), (11, 6), (8, 16), (-6, 16), (-11, 6)], closed=True, n=3)
    wing = smooth([(6, -6), (20, -24), (36, -22), (34, -8), (20, 2), (10, 4)], closed=True, n=3)
    wing2 = smooth([(-6, -6), (-20, -24), (-36, -22), (-34, -8), (-20, 2), (-10, 4)], closed=True, n=3)
    hands = [circle(-12, 4, 3.5, 10), circle(12, 4, 3.5, 10)]
    eye = [(2, -18), (5, -18)]
    parts = [place(p, x, y, s, flip=flip) for p in (body, headp, wing, wing2, hands[0], hands[1], eye)] + [place(c, x, y, s, flip=flip) for c in curls]
    return parts
def draw_cupidon(parts, hide=False):
    body, headp, wing, wing2, h1, h2, eye = parts[:7]
    curls = parts[7:]
    cv.stroke(wing2, 1.0, closed=True)
    cv.hatch([wing2], angle=-40, spacing=2.4, w=0.5, break_fn=lambda x, y: 0.6, piece=(3, 8))
    cv.stroke(body, 1.1, closed=True)
    cv.hatch([body], angle=30, spacing=2.4, w=0.5, break_fn=lambda x, y: 0.45, piece=(3, 8))
    cv.stroke(headp, 1.1, closed=True)
    for c in curls: cv.stroke(c, 0.8)
    if hide:
        cv.fill(wing)   # the wing pulled over his eyes
        cv.stroke(h1, 0.9, closed=True)
    else:
        cv.stroke(wing, 1.0, closed=True)
        cv.hatch([wing], angle=40, spacing=2.4, w=0.5, break_fn=lambda x, y: 0.6, piece=(3, 8))
        cv.stroke(eye, 1.2)
        cv.stroke(h1, 0.9, closed=True); cv.stroke(h2, 0.9, closed=True)
draw_cupidon(cupidon(MIRC[0] - MRX - 14, MIRC[1] - MRY + 10, 1.0))
draw_cupidon(cupidon(MIRC[0] + MRX + 12, MIRC[1] - MRY + 14, 1.0, flip=True), hide=True)
# the sevenbranched candelabra on the table, and its double in the glass
def candelabra(cv, cx, base_y, s, w=1.0, ghost=False):
    stem_w = 2.2 * s * w
    cv.stroke([(cx, base_y), (cx, base_y - 46 * s)], stem_w * 1.6)
    cv.stroke(ellipse(cx, base_y, 16 * s, 4 * s, 24), 1.4 * w, closed=True)
    flames = []
    for k in range(-3, 4):
        if k == 0:
            top = (cx, base_y - 96 * s)
            cv.stroke([(cx, base_y - 46 * s), top], stem_w)
        else:
            r = abs(k) * 15 * s
            arc = arc_pts(cx, base_y - 46 * s, r, 180 if k < 0 else 0, 270 if k < 0 else 270, 12)
            top = (cx + k * 15 * s, base_y - 46 * s - r - (3 - abs(k)) * 0 * s)
            # an arc from the stem out and up, then a short vertical to the same height as the centre
            pts = arc + [(cx + k * 15 * s, base_y - 46 * s - r)]
            cv.stroke(pts, stem_w * (0.9 - abs(k) * 0.08))
            cv.stroke([(cx + k * 15 * s, base_y - 46 * s - r), (cx + k * 15 * s, base_y - 96 * s)], stem_w * 0.8)
            top = (cx + k * 15 * s, base_y - 96 * s)
        # candle cup and candle
        cv.stroke([(top[0] - 4 * s, top[1]), (top[0] + 4 * s, top[1])], 2.0 * w)
        cv.stroke([(top[0], top[1]), (top[0], top[1] - 18 * s)], 3.4 * s * w)
        flames.append(flame(top[0], top[1] - 19 * s, 15 * s, 7 * s, 0.05 * k, seed=k + 10))
    cv.fills(flames, GOLD)
    cv.strokes(flames, 0.7, closed=True)
    return flames
# the double first (in the glass), then the real one in front
cv.hatch([mirror], angle=-55, spacing=3.6, w=0.55, break_fn=lambda x, y: 0.55, piece=(12, 40))
candelabra(cv, MIRC[0] - 6, MIRC[1] + 90, 0.72, w=0.7, ghost=True)
candelabra(cv, MIRC[0] - 40, TY - 2, 0.95)
# vials of ivory and coloured glass, unstoppered, on the table
for (vx, vh, vw) in [(TX1 - 60, 34, 12), (TX1 - 38, 26, 10), (TX1 - 82, 22, 16), (TX0 + 30, 30, 11)]:
    vial = smooth([(vx - vw / 2, TY), (vx - vw / 2, TY - vh * 0.55), (vx - 2, TY - vh * 0.8), (vx - 2, TY - vh), (vx + 2, TY - vh), (vx + 2, TY - vh * 0.8), (vx + vw / 2, TY - vh * 0.55), (vx + vw / 2, TY)], closed=True, n=2)
    cv.stroke(vial, 1.0, closed=True)
    cv.hatch([vial], angle=80, spacing=2.4, w=0.5, break_fn=lambda x, y, vx=vx: min(1, max(0.1, (vx - x + 3) / 8)), piece=(3, 8))
# smoke from the candles flung into the laquearia
sm = []
for k in range(3):
    x = MIRC[0] - 40 + (k - 1) * 30
    pts = [(x, TY - 118)]
    for i in range(1, 14):
        pts.append((x + math.sin(i * 0.9 + k) * (6 + i * 1.5), TY - 118 - i * 24))
    sm.append(smooth(pts, n=4))
cv.strokes(sm, 0.7)

# ---- chess table
cv.stroke(board, 1.6, closed=True)
cv.hatch(squares, angle=0, spacing=2.2, w=0.9)
# the table under the board: a short pedestal
cv.stroke([(CT[0] - 100, CT[1]), (CT[0] - 110, H)], 2.0); cv.stroke([(CT[0] + 100, CT[1]), (CT[0] + 110, H)], 2.0)
cv.stroke([(CT[0] - 100, CT[1] + 12), (CT[0] + 100, CT[1] + 12)], 1.6)
cv.fills(pieces)
# a rim of light on each piece (white line)
cv.fill_multi(pieces + [offset_polyline([lerp(p[0], p[len(p) // 2], 0.5), p[len(p) // 2]], 0.7) for p in pieces], rule="evenodd")

n = cv.save(OUT)
print('bytes', n)

