import sys; sys.path.insert(0, 'src')
from engrave import *
import math, random

OUT = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/frontispieces/part-1.svg'
W, H = 1200, 700
cv = Canvas(W, H, prefix="p1", seed=11)
rng = random.Random(11)
HOR = 440
SUN = (655, 158); R = 60

# ============================================================ shapes first (so the background can be cut around them)
# --- the red rock: a leaning crag with an overhang; the shadow is under it
ridge = [(852, 236), (842, 300), (830, 340), (820, 392), (806, 456)]
top_edge = smooth([(716, 356), (708, 330), (738, 296), (752, 286), (790, 262), (812, 256), (838, 244), (852, 236)], n=3)
right_edge = smooth([(852, 236), (880, 246), (905, 244), (930, 262), (948, 282), (958, 318), (972, 332), (975, 372), (992, 400), (990, 430), (1000, 456)], n=3)
lit_face = top_edge + ridge[1:] + [(760, 456), (742, 436), (730, 396)]
shadow_face = right_edge + [(806, 456)] + ridge[1:-1][::-1]
rock = top_edge + right_edge[1:] + [(712, 456), (742, 436), (730, 396)]
undercut = [(716, 356), (730, 396), (742, 436), (712, 456), (776, 456), (782, 420), (768, 384), (744, 362)]
ground_shadow = smooth([(800, 456), (996, 456), (1090, 476), (1096, 510), (1010, 528), (900, 522), (846, 500)], closed=True, n=3)

# --- a broken stone head, fallen on its back among the rubble
def head_polys(cx, cy, s, angle):
    prof = [(14, 0), (24, 4), (30, 16), (28, 22), (40, 34), (31, 38), (32, 42), (35, 45), (30, 47), (33, 51), (30, 58), (18, 64), (10, 64), (6, 58), (9, 52), (4, 46), (0, 32), (2, 14), (6, 4)]
    P = place(smooth(prof, closed=True, n=3), cx, cy, s, angle)
    eye = place(smooth([(23, 23), (27, 20), (32, 22), (28, 26)], closed=True, n=3), cx, cy, s, angle)
    pupil = place(circle(27.5, 23, 1.6, 10), cx, cy, s, angle)
    curls = [place(arc_pts(6 + k * 3.4, 5 + (k % 2) * 2.5, 3.0, 190, 400, 8), cx, cy, s, angle) for k in range(6)]
    brow = place([(22, 14), (30, 15)], cx, cy, s, angle)
    lip = place([(31, 47), (35, 47.5)], cx, cy, s, angle)
    return P, eye, pupil, curls, brow, lip
HEAD = (392, 452, 1.55, -70)
head, eye, pupil, curls, brow, lip = head_polys(*HEAD)

# --- a column drum, and a fallen capital
def drum_polys(cx, cy, r, L, angle):
    a = math.radians(angle)
    ux, uy = math.cos(a), math.sin(a); nx, ny = -uy, ux
    end = ellipse(cx, cy, r * 0.4, r, 32, angle)
    body = [(cx + nx * r, cy + ny * r), (cx + ux * L + nx * r, cy + uy * L + ny * r), (cx + ux * L - nx * r, cy + uy * L - ny * r), (cx - nx * r, cy - ny * r)]
    return end, body, (ux, uy, nx, ny)
DRUM = (232, 486, 24, 100, -8)
d_end, d_body, d_axes = drum_polys(*DRUM)
cap_front = [(478, 476), (548, 468), (560, 508), (492, 518)]
cap_top = [(478, 476), (548, 468), (534, 452), (466, 460)]
shards_spec = [(300, 522, 30, 12, 6), (340, 534, 20, 9, -14), (560, 528, 34, 11, 4), (470, 536, 24, 9, -8), (410, 540, 28, 10, 12), (600, 500, 16, 8, 20), (452, 500, 18, 8, -25)]
shards = [place(rect(-sw / 2, -sh / 2, sw, sh), sx, sy, 1, sa) for (sx, sy, sw, sh, sa) in shards_spec]

# --- someone sitting in under the shadow of the rock
def seated(x, y, h):
    u = h / 46.0
    P = [(2, 10), (7, 3), (20, 1), (25, 4), (28, 10), (24, 12), (25, 17), (32, 22), (34, 34), (33, 44), (30, 46), (6, 46), (2, 44), (0, 36), (3, 26), (8, 22), (10, 17), (9, 13), (5, 12)]
    return smooth([(x + px * u, y + (py - 46) * u) for px, py in P], closed=True, n=2)
FIG = seated(722, 456, 44)

# --- Stetson's garden, far right: the corpse planted last year has begun to sprout
mound = smooth([(1040, 522), (1070, 496), (1120, 492), (1160, 508), (1170, 528), (1030, 530)], closed=True, n=4)

occluders_sky = [circle(SUN[0], SUN[1], R + 6, 64), rock, head]
occluders_ground = [rock, ground_shadow, head, d_end, d_body, cap_front, cap_top, mound, FIG] + shards

# ============================================================ sky
sky = [(0, 0), (W, 0), (W, HOR), (0, HOR)]
def glow(x, y):
    d = dist((x, y), SUN)
    if d < R + 8: return 0
    if d > 320: return 1.0
    return max(0.05, (d - R - 8) / 250) ** 1.3
ruled_sky(cv, sky, 0, HOR, holes=occluders_sky, spacing_top=3.6, spacing_bot=8.5, w=0.65, jitter=0.12, break_fn=glow)
sun(cv, SUN[0], SUN[1], R, rays=30, ray_len=105, ray_w=3.0, seed=2)

# ============================================================ the far Unreal City under the brown fog (left horizon)
def city(cv, x0, y_base, s=1.0):
    blocks = []
    x = x0
    hs = [22, 34, 28, 46, 30, 26, 40, 24, 36, 30, 20, 44, 32, 26]
    for i, h in enumerate(hs):
        w = rng.uniform(14, 30) * s
        blocks.append(rect(x, y_base - h * s, w, h * s))
        if rng.random() < 0.6:
            blocks.append(rect(x + w * 0.3, y_base - h * s - 8 * s, 3 * s, 8 * s))
        x += w + rng.uniform(1, 5) * s
    cx = x0 + 150 * s
    drum_ = rect(cx - 22 * s, y_base - 56 * s, 44 * s, 20 * s)
    dome = arc_pts(cx, y_base - 56 * s, 22 * s, 180, 360, 20) + [(cx + 22 * s, y_base - 56 * s)]
    lantern = rect(cx - 4 * s, y_base - 92 * s, 8 * s, 14 * s)
    cross = rect(cx - 0.8 * s, y_base - 100 * s, 1.6 * s, 8 * s)
    towers = [rect(cx - 44 * s, y_base - 70 * s, 9 * s, 34 * s), rect(cx + 35 * s, y_base - 70 * s, 9 * s, 34 * s)]
    wx = x0 + 250 * s
    wool = [rect(wx, y_base - 48 * s, 26 * s, 48 * s), rect(wx + 2 * s, y_base - 58 * s, 7 * s, 10 * s), rect(wx + 17 * s, y_base - 58 * s, 7 * s, 10 * s)]
    allp = blocks + [drum_, dome, lantern, cross] + towers + wool
    for p in allp:
        cv.stroke(p, 0.55, closed=True)
    cv.hatch(allp, angle=90, spacing=3.2, w=0.5, break_fn=lambda X, Y: max(0.15, min(1, (y_base - Y) / (60 * s))), piece=(6, 14))
    cv.hatch(blocks, angle=0, spacing=6 * s, w=1.2, dash="2 4", break_fn=lambda X, Y: 0.5, piece=(6, 12))
city(cv, 30, HOR - 2, 1.0)
bx0, bx1, by = 60, 330, HOR + 14
cv.stroke([(bx0, by), (bx1, by)], 1.1)
cv.stroke([(bx0, by - 7), (bx1, by - 7)], 0.7)
for ax in range(bx0 + 20, bx1 - 10, 46):
    arch = arc_pts(ax + 18, by + 12, 18, 180, 360, 14)
    cv.stroke(arch, 0.8)
    cv.hatch([arch + [(ax + 36, by + 12)]], angle=0, spacing=2.4, w=0.6)
cx = bx0 + 12
crowd = []
while cx < bx1 - 8:
    crowd.append(figure_walking(cx, by - 7, rng.uniform(8, 11), step=rng.random(), facing=1))
    cx += rng.uniform(4.5, 7)
cv.fills(crowd)
fogband = rect(0, HOR - 120, 420, 150)
cv.stipple([fogband], n=1700, size=1.0, density_fn=lambda x, y: max(0, 1 - abs(y - (HOR - 10)) / 70) * max(0, 1 - x / 420) * 1.2)

# ============================================================ ground
near = [(0, HOR), (W, HOR), (W, H), (0, H)]
cv.hatch([[(0, HOR), (W, HOR), (W, HOR + 80), (0, HOR + 80)]], angle=0, spacing_fn=lambda u: 2.8 + 6 * u, w=0.6, jitter=0.2,
         break_fn=lambda x, y: 0.8 if y < HOR + 30 else 0.45, holes=occluders_ground, piece=(20, 60))
for ang, sp0, seed_shift in [(-4, 14, 0), (-8, 17, 1)]:
    cv.hatch([[(0, HOR + 70), (W, HOR + 70), (W, H), (0, H)]], angle=ang, spacing_fn=lambda u, sp0=sp0: sp0 + 14 * u, w=0.85, jitter=2.5, x_jitter=3,
             break_fn=lambda x, y: max(0.08, 0.3 - (y - HOR - 60) / 900), holes=occluders_ground, piece=(18, 90), phase=seed_shift * 5)
cracks(cv, [[(0, HOR + 100), (W, HOR + 100), (W, H), (0, H)]], n=14, seed=8, w=1.0, length=(70, 200), holes=occluders_ground)
pebbles(cv, [[(0, HOR + 30), (W, HOR + 30), (W, H), (0, H)]], n=36, seed=9, r=(1.5, 4.5), holes=occluders_ground)

# ============================================================ the red rock
cv.stroke(rock, 2.2, closed=True)
cv.stroke(ridge, 1.6)
# lit face: light, open hatching that follows the slope; darker toward the undercut
cv.hatch([lit_face], angle=-22, spacing=5.4, w=0.85, jitter=0.3, break_fn=lambda x, y: min(1, max(0.06, 0.1 + (y - 250) / 300)), piece=(14, 50))
cv.hatch([undercut], angle=-22, spacing=2.6, w=1.0, jitter=0.2)
cv.hatch([undercut], angle=60, spacing=3.2, w=0.9, jitter=0.2, break_fn=lambda x, y: min(1, max(0.2, (y - 360) / 80)))
cv.hatch([shadow_face], angle=-22, spacing=3.3, w=1.0, jitter=0.25)
cv.hatch([shadow_face], angle=58, spacing=3.8, w=0.9, jitter=0.25, break_fn=lambda x, y: min(1, max(0.15, (y - 240) / 200)))
cv.hatch([shadow_face], angle=88, spacing=4.4, w=0.8, jitter=0.25, break_fn=lambda x, y: min(1, max(0.0, (x - 900) / 90)))
# strata: cracks across both faces
for line in [[(724, 372), (780, 352), (830, 340)], [(738, 420), (790, 404), (820, 392)], [(760, 290), (818, 276), (842, 300)],
             [(842, 300), (905, 296), (948, 300)], [(830, 340), (900, 348), (966, 340)], [(820, 392), (880, 412), (990, 400)],
             [(870, 250), (890, 300), (896, 340)], [(930, 340), (944, 400), (960, 456)]]:
    pts = smooth(line, n=5)
    cv.stroke([(px, py + math.sin(px / 11) * 1.6) for px, py in pts], 1.3)
# the shadow on the ground, cast to the right
cv.hatch([ground_shadow], angle=0, spacing=2.5, w=1.0, jitter=0.15)
cv.hatch([ground_shadow], angle=64, spacing=3.0, w=0.9, jitter=0.15, break_fn=lambda x, y: min(1, max(0.2, 1.2 - (x - 900) / 200)))
# whoever came in under the shadow
cv.fill(FIG)

# ============================================================ the dead tree
gnarled_tree(cv, 585, 452, 330, seed=21, lean=0.22, spread=1.05, depth=6)

# ============================================================ the heap of broken images
# column drum
ux, uy, nx, ny = d_axes
cx, cy, r, L, ang = DRUM
cv.stroke(d_body, 1.4, closed=True)
lines = [[(cx + nx * off + ux * 2, cy + ny * off + uy * 2), (cx + ux * L + nx * off, cy + uy * L + ny * off)] for off in [k * r / 4.6 for k in range(-4, 5)]]
cv.hatch_lines([d_body], lines, 0.9, holes=[d_end])
cv.hatch([d_body], angle=ang + 90, spacing=3.2, w=0.7, break_fn=lambda x, y: min(1, max(0, (y - cy + 4) / (r * 1.3))), holes=[d_end])
far = [(cx + ux * L + nx * r * math.cos(t) * 0.4 * 0 + 0, 0) for t in []]
cv.stroke(place(arc_pts(0, 0, 1, -90, 90, 14), cx + ux * L, cy + uy * L, sx=r * 0.4, sy=r, angle=ang), 1.4)
cv.stroke(d_end, 1.4, closed=True)
cv.hatch([d_end], angle=ang + 20, spacing=3.0, w=0.7, break_fn=lambda x, y: min(1, max(0.1, (x - cx + r * 0.3) / (r * 0.8))))
# capital block
cv.stroke(cap_front, 1.4, closed=True); cv.stroke(cap_top, 1.4, closed=True)
cv.hatch([cap_front], angle=-10, spacing=3.4, w=0.8, break_fn=lambda x, y: min(1, max(0.1, (y - 470) / 34)))
cv.hatch([cap_top], angle=-10, spacing=5, w=0.6, break_fn=lambda x, y: 0.45)
# the head
cv.stroke(head, 1.7, closed=True)
cv.stroke(eye, 1.0, closed=True); cv.fill(pupil)
cv.stroke(brow, 1.1); cv.stroke(lip, 0.9)
for c in curls: cv.stroke(c, 0.9)
hx, hy = HEAD[0], HEAD[1]
cv.hatch([head], angle=-10, spacing=3.2, w=0.8, break_fn=lambda x, y: min(1, max(0.04, 0.05 + (y - hy + 14) / 46 - (x - hx) / 160)), holes=[eye], piece=(6, 18))
cv.hatch([head], angle=55, spacing=3.8, w=0.7, break_fn=lambda x, y: min(1, max(0.0, (y - hy + 2) / 34 - (x - hx) / 120)), holes=[eye], piece=(6, 18))
cv.hatch([head], angle=-70, spacing=4.6, w=0.6, break_fn=lambda x, y: min(1, max(0.0, (hx - x - 20) / 40)), holes=[eye], piece=(6, 18))
# shards
for p, (sx, sy, sw, sh, sa) in zip(shards, shards_spec):
    cv.stroke(p, 1.1, closed=True)
    cv.hatch([p], angle=sa + 90, spacing=3, w=0.7, break_fn=lambda x, y, sy=sy: min(1, max(0.05, (y - sy + 2) / 8)))
# the cricket that gives no relief
cx, cy = 606, 494
cv.fill(ellipse(cx, cy, 6, 2.6, 16, -8))
cv.stroke([(cx + 2, cy - 1), (cx + 6, cy - 8), (cx + 2, cy + 3)], 0.8)
cv.stroke([(cx - 2, cy - 1), (cx - 1, cy - 6), (cx - 5, cy + 3)], 0.7)
cv.stroke([(cx - 5, cy - 1), (cx - 14, cy - 8)], 0.6)
cv.stroke([(cx - 5, cy - 1), (cx - 13, cy - 3)], 0.6)

# ============================================================ lilacs out of the dead land (the plate's one colour)
def lilac(cv, x, y, h, seed=1, lean=0.0):
    r = random.Random(seed)
    stem = smooth([(x, y), (x + lean * h * 0.3, y - h * 0.5), (x + lean * h * 0.5, y - h)], n=4)
    cv.stroke(stem, 1.3)
    for side in (-1, 1):
        by = y - h * r.uniform(0.2, 0.45)
        bx = x + lean * (y - by) * 0.4
        L = h * 0.36
        tipp = (bx + side * L * 0.92, by - L * 0.3 + r.uniform(-4, 4))
        lf = leaf((bx, by), tipp, L * 0.62, bulge=0.4, curve=0.06 * side)
        cv.stroke(lf, 1.0, closed=True)
        cv.stroke([(bx, by), lerp((bx, by), tipp, 0.9)], 0.7)
        cv.hatch([lf], angle=side * 55, spacing=2.4, w=0.55, break_fn=lambda X, Y, bx=bx, side=side, L=L: min(1, max(0.05, 0.85 - side * (X - bx) / L)), piece=(4, 10))
    top = stem[-1]
    florets = []
    for i in range(int(h * 1.7)):
        t = r.random() ** 0.8
        yy = top[1] + t * h * 0.48
        spread = 2.5 + t * 11
        florets.append((top[0] + r.uniform(-1, 1) * spread * (0.6 + 0.4 * r.random()), yy + r.uniform(-1.5, 1.5)))
    shapes = []
    for (fx, fy) in florets:
        s = r.uniform(1.5, 2.4)
        shapes.append([(fx, fy - s), (fx + s * 0.35, fy - s * 0.35), (fx + s, fy), (fx + s * 0.35, fy + s * 0.35), (fx, fy + s), (fx - s * 0.35, fy + s * 0.35), (fx - s, fy), (fx - s * 0.35, fy - s * 0.35)])
    cv.fills(shapes, VIOLET)
    cv.strokes([[(fx + 1.4, fy + 1.4), (fx + 2.4, fy + 2.4)] for (fx, fy) in florets[::4]], 0.8)
lilac(cv, 262, 540, 70, seed=4, lean=-0.15)
lilac(cv, 296, 552, 54, seed=5, lean=0.2)
lilac(cv, 536, 556, 64, seed=6, lean=0.1)
lilac(cv, 571, 545, 46, seed=7, lean=-0.25)

# ============================================================ Stetson's garden
cv.stroke(mound, 1.2, closed=True)
cv.hatch([mound], angle=-20, spacing=3.6, w=0.7, break_fn=lambda x, y: min(1, max(0.1, (y - 496) / 30)))
cv.stroke([(1105, 510), (1104, 498), (1102, 488)], 1.4)
for leaf in [[(1102, 488), (1096, 484), (1092, 474), (1098, 472), (1104, 482)], [(1103, 492), (1110, 488), (1116, 480), (1111, 476), (1105, 484)]]:
    cv.stroke(smooth(leaf, closed=True, n=3), 1.0, closed=True)
cv.stroke([(1148, 522), (1156, 454)], 2.2)
cv.stroke(arc_pts(1157, 449, 6, 20, 340, 10), 1.6)  # D grip
cv.fill([(1140, 532), (1160, 530), (1163, 548), (1151, 558), (1138, 550)])

n = cv.save(OUT)
print('bytes', n)
cv.report()
