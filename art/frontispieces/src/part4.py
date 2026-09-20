import sys; sys.path.insert(0, 'src')
from engrave import *
import math, random

OUT = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/frontispieces/part-4.svg'
W, H = 1200, 700
cv = Canvas(W, H, prefix="p4", seed=44)
rng = random.Random(44)
SURF = 112        # the surface, seen from below
FLOOR = 640       # the sea bed
CX, CY = 600, 400 # the eye of the whirlpool

# ============================================================ shapes
# --- Phlebas, a fortnight dead, turning in the current: head down and to the left, limbs loose
J = dict(head=(0, 0), neck=(0, 16), sh_l=(-18, 26), sh_r=(18, 26), hip_l=(-13, 92), hip_r=(13, 92),
         el_l=(-40, 56), ha_l=(-56, 88), el_r=(34, 50), ha_r=(54, 14),
         kn_l=(-20, 142), an_l=(-30, 192), kn_r=(26, 136), an_r=(50, 172))
PH = puppet(J, dict(arm=9, leg=13, neck=6), head_r=(13, 16), angle=-118, x=560, y=380, s=1.05)
PHLEBAS = PH["all"]
# hair drifting from the head, and the hollow of the eye where a pearl sits
hx, hy = PH["head"][0]
hair_pts = []
r = random.Random(3)
headc = place([J["head"]], 560, 380, 1.05, -118)[0]
for k in range(10):
    a = math.radians(r.uniform(120, 250))
    p0 = (headc[0] + 13 * math.cos(a), headc[1] + 14 * math.sin(a))
    L = r.uniform(16, 40)
    hair_pts.append(smooth([p0, (p0[0] + math.cos(a) * L * 0.5 - 3, p0[1] + math.sin(a) * L * 0.5 + 3), (p0[0] + math.cos(a) * L - 8, p0[1] + math.sin(a) * L + 8)], n=3))
PH_hair = hair_pts
# --- the profit and loss: coins spilling from his open hand toward the bed
coins = []
r2 = random.Random(8)
for k in range(11):
    t = k / 10
    x = 634 + t * 60 + r2.uniform(-22, 22)
    y = 500 + t * 120 + r2.uniform(-10, 10)
    coins.append(ellipse(x, y, r2.uniform(4, 6.5), r2.uniform(2, 5), 16, r2.uniform(-40, 40)))
# --- fish, in the current
def fish(x, y, s, flip=False, angle=0):
    body = smooth([(-20, 0), (-12, -7), (4, -9), (16, -4), (22, 0), (16, 4), (4, 9), (-12, 7)], closed=True, n=3)
    tail = [(-20, 0), (-32, -9), (-30, 0), (-32, 9)]
    eye = circle(12, -2, 1.6, 8)
    fin = [(0, -8), (6, -16), (12, -8)]
    return [place(p, x, y, s, angle=angle, flip=flip) for p in (body, tail, eye, fin)]
FISH = [fish(430, 470, 1.0, angle=-20), fish(760, 300, 0.8, flip=True, angle=15), fish(690, 560, 0.7, angle=10), fish(380, 250, 0.6, flip=True, angle=-10), fish(840, 470, 0.55, angle=-30)]
# --- the ship above, and the one who turns the wheel: a galley, hull seen from below the surface
def ship():
    ox, oy = 700, SURF
    T = lambda pts: [(ox + x, oy + y) for x, y in pts]
    above = T(smooth([(-130, 0), (-124, -12), (-100, -20), (100, -20), (126, -14), (146, -36), (150, -30), (134, -8), (132, 0)], closed=True, n=2))
    below = T(smooth([(-130, 0), (132, 0), (120, 14), (80, 26), (0, 32), (-80, 26), (-118, 12)], closed=True, n=2))
    mast = T([(-6, -20), (-2, -20), (-2, -120), (-6, -120)])
    yard = T([(-70, -104), (66, -104), (66, -100), (-70, -100)])
    sail = T(smooth([(-66, -100), (62, -100), (54, -40), (-58, -40)], closed=True, n=2))
    oars = [T([(-100 + k * 26, -8), (-112 + k * 26, 30)]) for k in range(8)]
    wheel = T(circle(112, -34, 10, 16))
    spokes = [T([(112 + 10 * math.cos(a), -34 + 10 * math.sin(a)), (112 - 10 * math.cos(a), -34 - 10 * math.sin(a))]) for a in [0, 0.785, 1.571, 2.356]]
    helmsman = figure_walking(ox + 96, oy - 20, 42, step=0.1, facing=1)
    return above, below, mast, yard, sail, oars, wheel, spokes, helmsman
SH_above, SH_below, SH_mast, SH_yard, SH_sail, SH_oars, SH_wheel, SH_spokes, SH_helm = ship()
# --- the bed: sand, a few bones, an amphora, an anchor
bed = smooth([(0, FLOOR + 10), (200, FLOOR - 8), (400, FLOOR + 6), (600, FLOOR - 4), (800, FLOOR + 8), (1000, FLOOR - 10), (W, FLOOR + 4)], n=3) + [(W, H), (0, H)]
skull = smooth([(300, 622), (312, 606), (332, 600), (352, 606), (360, 622), (352, 636), (338, 640), (322, 638), (306, 634)], closed=True, n=3)
bones = [place(rect(-30, -3, 60, 6), 250, 650, 1, 12), place(rect(-24, -2.5, 48, 5), 420, 662, 1, -20), place(rect(-18, -2, 36, 4), 880, 656, 1, 30)]
amph = smooth([(930, 600), (946, 596), (960, 606), (964, 628), (958, 650), (948, 664), (938, 664), (928, 650), (922, 628), (926, 606)], closed=True, n=3)
anchor_ring = circle(770, 596, 6, 12)
anchor_shank = rect(768, 602, 4, 44)
anchor_arms = smooth([(742, 634), (754, 650), (770, 656), (786, 650), (798, 634), (792, 632), (782, 644), (770, 648), (758, 644), (748, 632)], closed=True, n=2)
anchor_stock = place(rect(-16, -2, 32, 4), 770, 606, 1, 0)

occ = PHLEBAS + coins + [f[0] for f in FISH] + [f[1] for f in FISH] + [SH_below, amph, anchor_arms, anchor_shank] + bones

# ============================================================ the water: ruled, darkening with depth, lit by shafts from the surface
water = [(0, SURF), (W, SURF), (W, FLOOR + 10), (0, FLOOR + 10)]
def shafts(x, y):
    # light comes down slanting to the left; three shafts, brightest near the surface
    v = 1.0
    for x0 in (330, 520, 760):
        xs = x0 + (y - SURF) * 0.45
        d = abs(x - xs)
        if d < 60:
            v = min(v, 0.35 + 0.65 * (d / 60) ** 1.5 + (y - SURF) / 900)
    # the funnel of the whirlpool is lighter, its lines are drawn separately
    ex, ey = (x - CX) / 300, (y - CY) / 150
    if ex * ex + ey * ey < 1:
        v = min(v, 0.15 + 0.85 * (ex * ex + ey * ey) ** 1.2)
    return max(0.0, min(1.0, v))
cv.hatch([water], angle=0, spacing_fn=lambda u: 6.2 - 3.4 * u, w=0.7, jitter=0.25, break_fn=shafts, holes=occ + [bed], piece=(20, 70))
# a second, diagonal ruling deep down, for the dark of the bed
cv.hatch([[(0, 440), (W, 440), (W, FLOOR + 10), (0, FLOOR + 10)]], angle=18, spacing=3.6, w=0.7, jitter=0.2, break_fn=lambda x, y: min(1, max(0, (y - 440) / 150)) * shafts(x, y), holes=occ + [bed], piece=(20, 70))
cv.hatch([[(0, 540), (W, 540), (W, FLOOR + 10), (0, FLOOR + 10)]], angle=-24, spacing=4.4, w=0.6, jitter=0.2, break_fn=lambda x, y: min(1, max(0, (y - 540) / 100)) * shafts(x, y), holes=occ + [bed], piece=(20, 70))
# --- the surface from below: a wavering line, and a band of broken light
surf = [(x, SURF + 3 * math.sin(x / 38) + 1.5 * math.sin(x / 13)) for x in range(0, W + 1, 6)]
cv.stroke(surf, 1.8)
cv.stroke([(x, y - 7 + 2 * math.sin(x / 21)) for x, y in surf], 0.8)
# --- the whirlpool: spiral arms, elliptical, tightening toward the eye
arms = []
for k in range(6):
    pts = []
    th = 0.0
    ph = k * math.pi / 3
    while th < 6.5 * math.pi:
        rr = 6 + th * 15.5
        pts.append((CX + rr * math.cos(th + ph), CY + rr * 0.5 * math.sin(th + ph) + (rr * 0.03)))
        th += 0.12
    arms.append(pts)
cv.hatch_lines([water], arms, 0.9, holes=occ, cap="round")
# whispers of the current: short curved flicks along the spiral, denser near the body
flicks = []
for k in range(260):
    th = rng.uniform(1.5 * math.pi, 6.4 * math.pi)
    rr = 6 + th * 15.5 + rng.uniform(2, 9)
    p = (CX + rr * math.cos(th), CY + rr * 0.5 * math.sin(th) + rr * 0.03)
    L = rng.uniform(6, 16)
    flicks.append([p, (p[0] - math.sin(th) * L, p[1] + math.cos(th) * L * 0.5)])
cv.hatch_lines([water], flicks, 0.6, holes=occ)
# bubbles rising from his mouth
for (bx, by, br) in [(508, 342, 2), (514, 318, 2.6), (506, 292, 3.2), (516, 258, 3.8), (508, 218, 4.4), (520, 170, 5)]:
    cv.stroke(circle(bx, by, br, 12), 0.8, closed=True)

# ============================================================ the ship
cv.fill(SH_above); cv.fill(SH_mast); cv.fill(SH_yard)
cv.stroke(SH_sail, 1.0, closed=True)
cv.hatch([SH_sail], angle=90, spacing=3.2, w=0.6, break_fn=lambda x, y: 0.5, piece=(6, 20))
cv.hatch([SH_sail], angle=0, spacing=9, w=0.9)
cv.strokes(SH_oars, 1.6)
cv.stroke(SH_wheel, 1.4, closed=True); cv.strokes(SH_spokes, 1.0)
cv.fill(SH_helm)
cv.fill(SH_below)
whiteline(cv, SH_below, [offset_polyline([(600, SURF + 6), (820, SURF + 6)], 0.6), offset_polyline([(620, SURF + 16), (790, SURF + 16)], 0.6)])
# gulls above
for (gx, gy, gs) in [(560, 40, 1.0), (620, 62, 0.8), (860, 50, 0.9), (900, 30, 0.6), (420, 70, 0.7)]:
    cv.fill(bird(gx, gy, gs))
# the sky, a plain fine ruling, so the eye goes down
cv.hatch([[(0, 0), (W, 0), (W, SURF - 2), (0, SURF - 2)]], angle=0, spacing=5.5, w=0.5, jitter=0.1, holes=[SH_above, SH_sail, SH_mast, SH_yard, SH_helm], break_fn=lambda x, y: 0.6, piece=(30, 100))

# ============================================================ Phlebas: a pale body, outlined, lightly modelled, picked at by the current
cv.fill_multi(grow(PHLEBAS, 0.3), rule="evenodd") if False else None
for key in ("leg_l", "leg_r", "arm_l", "arm_r", "torso", "neck", "head"):
    cv.stroke(PH[key], 1.4, closed=True)
for hnd in PH["hands"] + PH["feet"]:
    cv.stroke(hnd, 1.2, closed=True)
# modelling: hatch on the underside of each limb (the side away from the surface light, i.e. the lower/left)
for key, ang in (("torso", -30), ("leg_l", 40), ("leg_r", 40), ("arm_l", -60), ("arm_r", -60), ("head", 20)):
    poly = PH[key]
    x0, y0, x1, y1 = bbox([poly])
    cv.hatch([poly], angle=ang, spacing=2.6, w=0.6, break_fn=lambda x, y, x0=x0, x1=x1, y0=y0, y1=y1: min(1, max(0.0, 0.1 + (y - y0) / max(1, (y1 - y0)) * 0.7 + (x1 - x) / max(1, (x1 - x0)) * 0.5 - 0.35)), piece=(4, 12))
# a jersey: its stripes cut across the torso
cv.hatch([PH["torso"]], angle=-118 + 90, spacing=7, w=1.6)
cv.strokes(PH_hair, 1.1)
# the head: hair as a dark cap on the far side, an ear, the pearl that was his eye
hd = PH["head"]
cap = inter(hd, [(headc[0] - 30, headc[1] - 30), (headc[0] + 2, headc[1] - 30), (headc[0] - 12, headc[1] + 30), (headc[0] - 30, headc[1] + 30)])
cv.fill_multi(cap, rule="evenodd")
ex, ey = headc[0] + 5, headc[1] - 1
cv.stroke(circle(ex, ey, 3.4, 12), 1.0, closed=True)
cv.fill(circle(ex - 1, ey - 1, 0.9, 6))
cv.stroke([(headc[0] + 9, headc[1] + 7), (headc[0] + 13, headc[1] + 9)], 0.9)   # the mouth, slack
# the coins: gold, with a rim
cv.fills(coins, GOLD)
cv.strokes(coins, 0.7, closed=True)

# ============================================================ the fish
for fb, ft, fe, ff in FISH:
    cv.fill(fb); cv.fill(ft); cv.fill(ff)
    cv.stroke(fe, 0.8, closed=True)

# ============================================================ the sea bed
cv.stroke(bed[:-2], 1.4)
cv.hatch([bed], angle=0, spacing=3.2, w=0.7, jitter=0.4, break_fn=lambda x, y: min(1, max(0.2, (y - FLOOR) / 40)), holes=[amph, anchor_arms] + bones, piece=(20, 80))
cv.hatch([bed], angle=-30, spacing=4.4, w=0.6, jitter=0.3, break_fn=lambda x, y: 0.5, holes=[amph, anchor_arms] + bones, piece=(10, 40))
cv.stipple([bed], n=900, size=1.0, density_fn=lambda x, y: 0.5, holes=[amph, anchor_arms] + bones)
# bones
for b in bones:
    cv.stroke(b, 1.0, closed=True)
    cv.hatch([b], angle=60, spacing=2.4, w=0.5, break_fn=lambda x, y: 0.4, piece=(3, 8))
# amphora, and the anchor
cv.stroke(amph, 1.2, closed=True)
cv.hatch([amph], angle=90, spacing=2.4, w=0.6, break_fn=lambda x, y: min(1, max(0.05, (x - 930) / 34)), piece=(4, 10))
cv.stroke([(926, 610), (960, 610)], 0.8); cv.stroke([(930, 620), (958, 620)], 0.8)
cv.stroke(anchor_ring, 1.4, closed=True); cv.fill(anchor_shank); cv.fill(anchor_arms); cv.fill(anchor_stock)

n = cv.save(OUT)
print('bytes', n)
