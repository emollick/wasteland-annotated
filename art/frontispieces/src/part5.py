import sys; sys.path.insert(0, 'src')
from engrave import *
import math, random

OUT = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/frontispieces/part-5.svg'
W, H = 1200, 700
cv = Canvas(W, H, prefix="p5", seed=55)
rng = random.Random(55)

# ============================================================ shapes
# --- mountains: three ranges. far (light), middle, near crags (dark). Himavant far right under the black clouds.
far_ridge = smooth([(0, 330), (60, 300), (140, 316), (220, 282), (300, 306), (380, 270), (440, 296), (520, 262), (600, 288), (700, 250), (780, 280), (860, 236), (940, 262), (1020, 210), (1100, 246), (1160, 224), (W, 240)], n=3)
far = far_ridge + [(W, 420), (0, 420)]
mid_ridge = smooth([(0, 400), (80, 352), (150, 372), (230, 330), (300, 360), (360, 322), (420, 350), (480, 336), (560, 372), (640, 340), (700, 352), (760, 322), (820, 352), (900, 330), (980, 366), (1060, 342), (1140, 372), (W, 350)], n=3)
mid = mid_ridge + [(W, 520), (0, 520)]
# the dead mountain mouth of carious teeth: a near crag at the left with broken teeth along its top
teeth_top = []
x = 30
while x < 340:
    h = rng.uniform(18, 60)
    teeth_top += [(x, 478 - h * 0.3), (x + rng.uniform(8, 18), 478 - h), (x + rng.uniform(20, 34), 478 - h * 0.5)]
    x += rng.uniform(34, 52)
near_l = [(0, 452)] + teeth_top + [(372, 476), (410, 524), (0, 524)]
near_r = smooth([(W, 420), (1120, 396), (1040, 430), (980, 412), (930, 440), (900, 470), (960, 500), (1100, 486), (W, 470)], closed=True, n=3)
# --- the road: winding up from the foreground into the mountains
road_c = smooth([(140, 700), (300, 610), (430, 560), (560, 540), (640, 500), (700, 470), (760, 440), (820, 420), (900, 405), (980, 400)], n=6)
road_w = [70, 52, 40, 30, 24, 18, 14, 11, 9, 7]
road = offset_polyline(road_c, road_w)
# --- the chapel on its knoll, and the tumbled graves
KX, KY = 760, 430
knoll = smooth([(640, 470), (690, 436), (740, 420), (800, 418), (860, 432), (900, 462), (860, 478), (700, 484)], closed=True, n=4)
CH_wall = [(716, 386), (716, 430), (804, 430), (804, 386)]
CH_gable = [(716, 386), (760, 348), (804, 386)]
CH_roof = [(712, 390), (760, 344), (808, 390), (802, 390), (760, 352), (718, 390)]
CH_door = [(748, 430), (748, 398), (770, 398), (770, 430)]
CH_door_leaf = [(770, 400), (786, 392), (786, 428), (770, 430)]
CH_bellcote = [(752, 350), (752, 334), (760, 326), (768, 334), (768, 350)]
graves = [place([(-3, 0), (3, 0), (3, -14), (8, -14), (8, -18), (3, -18), (3, -24), (-3, -24), (-3, -18), (-8, -18), (-8, -14), (-3, -14)], gx, gy, 1, ga) for (gx, gy, ga) in [(690, 466, -18), (836, 452, 22), (860, 470, -8), (700, 448, 8)]]
graves += [place(smooth([(-7, 0), (7, 0), (7, -16), (0, -22), (-7, -16)], closed=True, n=2), 826, 470, 1, 12)]
# --- the cock on the rooftree
def cock(x, y, s):
    body = smooth([(-16, 0), (-12, -10), (-2, -16), (10, -14), (18, -6), (16, 2), (6, 6), (-8, 6)], closed=True, n=3)
    neck = smooth([(8, -14), (12, -24), (14, -36), (20, -42), (18, -30), (16, -20), (16, -12)], closed=True, n=2)
    head = smooth([(14, -44), (16, -50), (24, -52), (30, -48), (28, -42), (22, -38), (16, -40)], closed=True, n=2)
    beak = [(30, -49), (42, -46), (30, -44)]
    comb = [(14, -50), (16, -58), (20, -54), (24, -62), (26, -54), (30, -58), (28, -50)]
    wattle = smooth([(22, -40), (26, -32), (30, -38)], closed=True, n=2)
    tail = [smooth([(-14, -8), (-30, -30), (-48, -44), (-56, -40), (-40, -26), (-22, -6)], closed=True, n=3),
            smooth([(-16, -4), (-34, -18), (-58, -26), (-62, -20), (-40, -12), (-20, 0)], closed=True, n=3),
            smooth([(-12, -10), (-22, -36), (-30, -54), (-38, -52), (-26, -34), (-16, -12)], closed=True, n=3)]
    legs = [[(-2, 6), (-4, 16)], [(6, 6), (6, 16)]]
    eye = circle(22, -47, 1.5, 8)
    parts = dict(body=place(body, x, y, s), neck=place(neck, x, y, s), head=place(head, x, y, s), beak=place(beak, x, y, s), comb=place(comb, x, y, s),
                 wattle=place(wattle, x, y, s), tail=[place(t, x, y, s) for t in tail], legs=[place(l, x, y, s) for l in legs], eye=place(eye, x, y, s))
    return parts
CK = cock(772, 344, 0.72)
# --- the lightning: a jagged bolt from the cloud to the chapel roof, with a branch
bolt_c = [(690, 0), (704, 60), (676, 96), (722, 150), (698, 206), (748, 262), (736, 300), (766, 340)]
bolt = offset_polyline(bolt_c, [7, 6, 6, 5, 5, 4, 3.5, 2])
branch_c = [(722, 150), (760, 180), (748, 224), (790, 250)]
branch = offset_polyline(branch_c, [3, 2.5, 2, 1.2])
bolt_core = offset_polyline(bolt_c, [2.4, 2.2, 2.0, 1.8, 1.6, 1.4, 1.2, 0.8])
# --- black clouds gathering over Himavant (upper right) and across the top
def cloud(cx, cy, w, h, seed):
    r = random.Random(seed)
    pts = []
    n = 14
    for i in range(n):
        a = 2 * math.pi * i / n
        rr = 1 + 0.18 * math.sin(a * 3 + r.random()) + r.uniform(-0.06, 0.06)
        pts.append((cx + w / 2 * rr * math.cos(a), cy + h / 2 * rr * math.sin(a) * (0.7 if math.sin(a) > 0 else 1.0)))
    return smooth(pts, closed=True, n=4)
clouds = [cloud(1000, 80, 420, 160, 1), cloud(760, 40, 360, 130, 2), cloud(1120, 170, 300, 120, 3), cloud(470, 30, 300, 100, 4), cloud(920, 150, 220, 90, 5)]
CLOUD = union(clouds)
# --- upside down in air were towers: an inverted skyline hanging from the cloud, upper left
def inv_towers(x0, y0, s):
    """an upside-down skyline hanging from the cloud: towers, spires, a dome, drawn as a thin mirage"""
    polys = []
    x = x0
    for (w, h, kind) in [(26, 40, 'sq'), (14, 48, 'spire'), (36, 30, 'sq'), (18, 60, 'spire'), (30, 34, 'dome'), (12, 40, 'spire'), (40, 26, 'sq'), (16, 52, 'spire')]:
        base = [(x, y0), (x + w * s, y0), (x + w * s, y0 + h * s), (x, y0 + h * s)]
        polys.append(base)
        if kind == 'spire':
            polys.append([(x + 2, y0 + h * s), (x + w * s - 2, y0 + h * s), (x + w * s / 2, y0 + (h + 36) * s)])
        elif kind == 'dome':
            polys.append(arc_pts(x + w * s / 2, y0 + h * s, w * s / 2, 0, 180, 12) + [(x + w * s / 2, y0 + h * s)])
        else:
            # battlements, upside down
            for k in range(3):
                polys.append(rect(x + 2 + k * (w * s - 4) / 3, y0 + h * s, (w * s - 4) / 6, 4 * s))
        x += (w + 5) * s
    return polys
INV = inv_towers(236, 92, 0.9)
# --- bats with baby faces, in the violet light
def bat(x, y, s, flap=0.0, flip=False):
    wing = smooth([(0, 0), (12, -10 - flap * 8), (30, -14 - flap * 10), (46, -8 - flap * 6), (40, 0), (30, 6), (20, 2), (10, 8)], closed=True, n=3)
    wing2 = [(-px, py) for px, py in wing]
    body = ellipse(0, 2, 5, 8, 12)
    face = circle(0, -6, 4.5, 12)
    ears = [[(-4, -9), (-6, -15), (-1, -10)], [(4, -9), (6, -15), (1, -10)]]
    eyes = [circle(-1.6, -7, 0.8, 6), circle(1.6, -7, 0.8, 6)]
    return dict(wings=[place(wing, x, y, s, flip=flip), place(wing2, x, y, s, flip=flip)], body=place(body, x, y, s), face=place(face, x, y, s),
                ears=[place(e, x, y, s) for e in ears], eyes=[place(e, x, y, s) for e in eyes])
BATS = [bat(880, 250, 1.1, 0.3), bat(940, 200, 0.9, -0.2, flip=True), bat(1010, 280, 0.8, 0.5), bat(560, 130, 0.7, 0.1)]
# --- the three on the white road: two walking, and the third, gliding wrapt in a brown mantle, hooded
def hooded(x, y, h):
    u = h / 100.0
    P = smooth([(-14, 0), (14, 0), (16, -30), (12, -60), (10, -84), (4, -100), (-6, -100), (-12, -84), (-16, -60), (-18, -30)], closed=True, n=3)
    return [(x + px * u, y + py * u) for px, py in P]
WALK = [figure_walking(452, 566, 40, step=0.7, facing=1), figure_walking(478, 562, 38, step=0.2, facing=1)]
THIRD = hooded(516, 556, 42)
# --- the city over the mountains: falling towers on the far left ridge, cracking
def falling_towers(x0, y0):
    polys, cracks_ = [], []
    specs = [(0, 16, 44, -8), (22, 10, 66, 6), (38, 18, 36, -3), (62, 12, 58, 12), (80, 14, 32, -10), (100, 9, 50, 4)]
    for (dx, w, h, tilt) in specs:
        polys.append(place(rect(-w / 2, -h, w, h), x0 + dx, y0, 1, tilt))
        cracks_.append(place([(-w / 2, -h * 0.4), (0, -h * 0.5), (w / 2, -h * 0.35)], x0 + dx, y0, 1, tilt))
    return polys, cracks_
FT, FT_cracks = falling_towers(150, 296)
# --- the well, exhausted, foreground right
WELL = ellipse(1000, 596, 44, 14, 32)
WELL_in = ellipse(1000, 596, 34, 9, 32)
WELL_wall = [(956, 596), (1044, 596), (1044, 640), (956, 640)]
WELL_frame = [rect(962, 540, 4, 56), rect(1034, 540, 4, 56), rect(958, 536, 84, 4)]
WELL_hole = [(956, 640), (1044, 640), (1044, 620), (956, 620)]

sky = [(0, 0), (W, 0), (W, 420), (0, 420)]
occ_sky = [far] + [bolt] + CLOUD + [CH_roof, CH_gable, CH_wall, CH_bellcote] + INV + [b["wings"][0] for b in BATS] + [b["wings"][1] for b in BATS]

# ============================================================ sky: dark, ruled, darkest around the flash; the clouds; the bolt
def bolt_d(x, y):
    return min(abs(x - px) + abs(y - py) * 0.5 for px, py in bolt_c)
def halo(x, y):
    d = bolt_d(x, y)
    if d < 10: return 0.0
    if d > 150: return 1.0
    return ((d - 10) / 140) ** 1.6
cv.hatch([sky], angle=0, spacing_fn=lambda u: 2.6 + 3.0 * u, w=0.7, jitter=0.12, break_fn=lambda x, y: min(halo(x, y) * 1.2, 1.0) if bolt_d(x, y) < 150 else 1.0, holes=occ_sky, piece=(16, 60))
cv.hatch([sky], angle=-32, spacing=3.6, w=0.6, jitter=0.15, break_fn=lambda x, y: halo(x, y) * max(0.35, 1 - y / 500), holes=occ_sky, piece=(10, 40))
# clouds: black, massed, with a lit rim on the underside toward the flash
for c in clouds:
    cv.stroke(c, 1.6, closed=True)
cv.hatch(CLOUD, angle=0, spacing=2.0, w=1.0, jitter=0.15, holes=[bolt, branch], break_fn=lambda x, y: min(1, 0.4 + halo(x, y)), piece=(8, 30))
cv.hatch(CLOUD, angle=60, spacing=2.4, w=0.9, jitter=0.2, break_fn=lambda x, y: min(1, max(0.3, (y - 10) / 100)) * min(1, 0.4 + halo(x, y)), holes=[bolt, branch], piece=(8, 30))
cv.hatch(CLOUD, angle=-50, spacing=3.0, w=0.8, jitter=0.2, break_fn=lambda x, y: min(1, max(0.1, (x - 700) / 300)), holes=[bolt, branch], piece=(8, 30))
# the bolt: a bright gap in everything, a violet core, a fine ink edge
cv.stroke(bolt, 0.8, closed=True)
cv.stroke(branch, 0.7, closed=True)
cv.fill(bolt_core, VIOLET)
cv.fill(offset_polyline(branch_c, [1.0, 0.9, 0.7, 0.4]), VIOLET)
# the inverted towers, tolling: a thin mirage
cv.strokes(INV, 0.75, closed=True, dash="3 2.2")
cv.hatch(INV, angle=90, spacing=4.0, w=0.5, break_fn=lambda x, y: min(1, max(0.0, (y - 96) / 70)) * 0.6, piece=(3, 9))
# tiny windows
cv.hatch(INV, angle=0, spacing=7, w=1.4, dash="1.6 3.4", break_fn=lambda x, y: 0.5, piece=(3, 8))
# their bells
for bx in (286, 350, 420):
    bell = smooth([(bx - 4, 92 + 74), (bx + 4, 92 + 74), (bx + 3, 92 + 82), (bx, 92 + 86), (bx - 3, 92 + 82)], closed=True, n=2)
    cv.stroke([(bx, 92), (bx, 166)], 0.5, dash="2 2")
    cv.fill(bell)
# bats
for b in BATS:
    cv.fills(b["wings"]); cv.fill(b["body"])
    cv.stroke(b["face"], 0.9, closed=True)
    cv.fills(b["ears"]); cv.fills(b["eyes"])

# ============================================================ the mountains
cv.stroke(far_ridge, 1.2)
cv.hatch([far], angle=-35, spacing=4.4, w=0.6, jitter=0.2, break_fn=lambda x, y: min(1, max(0.1, (y - 240) / 160)), holes=[mid, near_l, near_r] + FT, piece=(10, 40))
cv.hatch([far], angle=70, spacing=5.5, w=0.5, jitter=0.2, break_fn=lambda x, y: 0.35, holes=[mid, near_l, near_r] + FT, piece=(6, 20))
# the city over the mountains, falling
for p, c in zip(FT, FT_cracks):
    cv.stroke(p, 1.0, closed=True)
    cv.stroke(c, 1.0)
cv.hatch(FT, angle=90, spacing=3.2, w=0.6, break_fn=lambda x, y: 0.55, piece=(4, 14))
cv.stroke(mid_ridge, 1.4)
cv.hatch([mid], angle=-42, spacing=3.4, w=0.7, jitter=0.25, break_fn=lambda x, y: min(1, max(0.15, (y - 320) / 160)), holes=[near_l, near_r, knoll, road] + graves, piece=(10, 40))
cv.hatch([mid], angle=25, spacing=4.2, w=0.6, jitter=0.25, break_fn=lambda x, y: min(1, max(0.0, (y - 380) / 140)), holes=[near_l, near_r, knoll, road] + graves, piece=(10, 40))
# strata lines on the middle range
for k in range(3):
    yy = 396 + k * 34
    cv.hatch_lines([mid], [[(x, yy + 8 * math.sin(x / 90 + k)) for x in range(0, W, 8)]], 0.8, holes=[near_l, near_r, knoll, road])
# the near crags
cv.stroke(near_l, 1.5, closed=True)
cv.hatch([near_l], angle=-62, spacing=2.6, w=0.85, jitter=0.2, break_fn=lambda x, y: min(1, max(0.25, (y - 430) / 60)))
cv.hatch([near_l], angle=20, spacing=3.6, w=0.7, jitter=0.2, break_fn=lambda x, y: min(1, max(0.0, (y - 470) / 50)))
cv.hatch_lines([near_l], [[(x, 492 + 5 * math.sin(x / 26)) for x in range(0, 420, 6)], [(x, 508 + 4 * math.sin(x / 31 + 1)) for x in range(0, 420, 6)]], 1.0)
cv.stroke(near_r, 1.4, closed=True)
cv.hatch([near_r], angle=-55, spacing=2.8, w=0.8, jitter=0.2)
cv.hatch([near_r], angle=30, spacing=3.4, w=0.7, jitter=0.2, break_fn=lambda x, y: min(1, max(0.1, (y - 420) / 70)))

# ============================================================ the ground: sand, cracked earth, dry grass; the road is bare
ground = [(0, 520), (W, 520), (W, H), (0, H)]
g_holes = [road, knoll, WELL_wall, WELL] + WELL_frame + [near_l]
cv.hatch([ground], angle=-4, spacing_fn=lambda u: 4 + 8 * u, w=0.7, jitter=0.5, x_jitter=2, break_fn=lambda x, y: max(0.15, 0.6 - (y - 520) / 400), holes=g_holes, piece=(12, 60))
cracks(cv, [ground], n=18, seed=6, w=1.0, length=(50, 160), holes=g_holes)
pebbles(cv, [ground], n=30, seed=7, r=(1.5, 4), holes=g_holes)
# the road's edges, broken; wheel-ruts
edges = []
for side in (1, -1):
    pts = []
    for i, p in enumerate(road_c):
        w = road_w[min(len(road_w) - 1, int(i / len(road_c) * len(road_w)))]
        nxt = road_c[min(i + 1, len(road_c) - 1)]; prv = road_c[max(i - 1, 0)]
        dx, dy = nxt[0] - prv[0], nxt[1] - prv[1]
        L = math.hypot(dx, dy) or 1
        pts.append((p[0] - dy / L * w * side, p[1] + dx / L * w * side))
    edges.append(pts)
cv.strokes(edges, 1.0, dash="14 6")
cv.stipple([road], n=500, size=0.9, density_fn=lambda x, y: min(1, max(0.1, (y - 400) / 300)))
# dry grass singing: tufts
tufts = []
r = random.Random(12)
for k in range(70):
    x = r.uniform(0, W); y = r.uniform(525, 690)
    if inside((x, y), [road]) or inside((x, y), [WELL_wall]) or inside((x, y), [near_l]): continue
    for j in range(r.randint(3, 6)):
        h = r.uniform(6, 20); lean = r.uniform(-0.7, 0.7)
        tufts.append([(x + j * 2 - 5, y), (x + j * 2 - 5 + lean * h, y - h)])
cv.strokes(tufts, 0.8)
# the knoll and the chapel
cv.stroke(knoll, 1.2, closed=True)
cv.hatch([knoll], angle=-10, spacing=3.6, w=0.6, jitter=0.4, break_fn=lambda x, y: min(1, max(0.1, (y - 430) / 50)), holes=[CH_wall, CH_door, CH_door_leaf] + graves, piece=(8, 30))
# grass over the tumbled graves
kt = []
for k in range(60):
    x = r.uniform(650, 895); y = r.uniform(432, 480)
    if not inside((x, y), [knoll]) or inside((x, y), [CH_wall]): continue
    h = r.uniform(5, 14); lean = r.uniform(-0.6, 0.6)
    kt.append([(x, y), (x + lean * h, y - h)])
cv.strokes(kt, 0.8)
cv.fills(graves)
cv.stroke(CH_wall, 1.4, closed=True)
cv.hatch([CH_wall], angle=0, spacing=6, w=0.7, break_fn=lambda x, y: 0.5, piece=(6, 20), holes=[CH_door])
cv.hatch([CH_wall], angle=90, spacing=3.2, w=0.6, break_fn=lambda x, y: min(1, max(0.05, (x - 716) / 60)), piece=(6, 20), holes=[CH_door])
cv.stroke(CH_gable, 1.4)
cv.fill(CH_roof)
cv.hatch([[(716, 386), (760, 348), (804, 386)]], angle=-40, spacing=3.2, w=0.7, break_fn=lambda x, y: 0.55, piece=(4, 14))
cv.hatch([CH_door], angle=0, spacing=2.0, w=1.0)   # the dark inside; no windows
cv.stroke(CH_door_leaf, 1.2, closed=True)
cv.hatch([CH_door_leaf], angle=90, spacing=2.6, w=0.6)
cv.stroke(CH_bellcote, 1.2)
# the cock, in a flash of lightning
for t in CK["tail"]: cv.fill(t)
cv.fill(CK["body"]); cv.fill(CK["neck"]); cv.fill(CK["head"]); cv.fill(CK["beak"]); cv.fill(CK["comb"]); cv.fill(CK["wattle"])
cv.strokes(CK["legs"], 1.4)
whiteline(cv, CK["head"], [CK["eye"]])
whiteline(cv, CK["body"], [offset_polyline([lerp(CK["body"][2], CK["body"][14], 0.3), lerp(CK["body"][2], CK["body"][14], 0.7)], 0.6)])
# co co rico: the cry, a few short strokes from the beak
cv.strokes([[(CK["beak"][1][0] + 4 + k * 5, CK["beak"][1][1] - 6 - k * 4), (CK["beak"][1][0] + 8 + k * 5, CK["beak"][1][1] - 9 - k * 4)] for k in range(3)], 1.0)
# the walkers on the road, and the third
cv.fills(WALK)
cv.fill(THIRD)
whiteline(cv, THIRD, [offset_polyline([(516 - 4, 556 - 30), (516 - 2, 556 - 6)], 0.5), offset_polyline([(516 + 5, 556 - 34), (516 + 6, 556 - 8)], 0.5)])
# the well
cv.stroke(WELL_wall, 1.2, closed=True)
cv.hatch([WELL_wall], angle=0, spacing=5.5, w=0.7, break_fn=lambda x, y: 0.7, piece=(6, 22), holes=[WELL])
cv.hatch([WELL_wall], angle=90, spacing=3.4, w=0.6, break_fn=lambda x, y: min(1, max(0.05, (x - 960) / 70)), piece=(6, 22), holes=[WELL])
cv.stroke(WELL, 1.2, closed=True); cv.stroke(WELL_in, 1.0, closed=True)
cv.hatch([WELL_in], angle=0, spacing=2.0, w=1.0)
cv.fills(WELL_frame)
cv.stroke([(1000, 540), (1000, 570)], 1.0)   # the rope, hanging, with an empty bucket
cv.stroke(rect(994, 570, 12, 10), 1.0, closed=True)
# a dead thorn bush, left foreground
gnarled_tree(cv, 120, 600, 90, seed=9, lean=0.4, spread=1.2, depth=4, grain=False, base_w=3.5)

n = cv.save(OUT)
print('bytes', n)
