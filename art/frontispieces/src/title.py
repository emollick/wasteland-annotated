import sys; sys.path.insert(0, 'src')
from engrave import *
import math, random

OUT = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/frontispieces/title.svg'
W, H = 1200, 700
cv = Canvas(W, H, prefix="t0", seed=66)
rng = random.Random(66)
FLOOR = 540
JX = 600

# ============================================================ shapes
# --- the jar (ampulla), hanging from the keystone of the vault
neck_w, ring_y = 22, 150
jar_outline = smooth([(JX - neck_w, 152), (JX - neck_w, 190), (JX - 46, 212), (JX - 76, 250), (JX - 86, 300), (JX - 80, 356), (JX - 58, 404), (JX - 24, 424),
                      (JX + 24, 424), (JX + 58, 404), (JX + 80, 356), (JX + 86, 300), (JX + 76, 250), (JX + 46, 212), (JX + neck_w, 190), (JX + neck_w, 152)], closed=True, n=5)
lip = [(JX - neck_w - 6, 146), (JX + neck_w + 6, 146), (JX + neck_w + 6, 154), (JX - neck_w - 6, 154)]
cord = [(JX, 40), (JX, 146)]
# --- the Sibyl inside, shrunk to a handful of dust: hunched, knees up, shawl over her head
def sibyl(x, y, h):
    u = h / 100.0
    T = lambda pts: [(x + px * u, y + py * u) for px, py in pts]
    # a huddled crone facing left, shawl over her head and down her back; the face pokes out of the shawl
    shawl = T(smooth([(-26, 0), (-34, -20), (-30, -46), (-20, -66), (-12, -84), (2, -94), (18, -92), (30, -80), (36, -58), (38, -30), (36, -8), (30, 0)], closed=True, n=4))
    face = T(smooth([(-10, -86), (-16, -80), (-28, -74), (-34, -68), (-24, -66), (-30, -58), (-20, -54), (-8, -58), (-2, -70)], closed=True, n=2))
    nose = T([(-28, -74), (-36, -68), (-26, -66)])
    eye = T([(-22, -76), (-15, -77)])
    mouth = T([(-26, -60), (-17, -61)])
    knees = T(smooth([(-30, -22), (-42, -38), (-36, -50), (-22, -46), (-14, -34), (-18, -14), (-26, -6)], closed=True, n=3))
    hands = T(smooth([(-38, -42), (-30, -50), (-20, -50), (-16, -42), (-22, -36), (-32, -36)], closed=True, n=2))
    hair = [T(smooth([(-8, -90), (0, -98), (12, -96)], n=3))]
    return shawl, face, knees, hands, eye, mouth, nose, hair
SB = sibyl(JX + 12, 418, 112)
# --- the boys, seen from behind, looking up: caps, jackets, short trousers, boots
def boy(x, y, h, arm_up=False, turn=0.0, cap=True):
    u = h / 100.0
    T = lambda pts: [(x + px * u, y + py * u) for px, py in pts]
    head = T(smooth([(-10, -86), (-8, -98), (0, -102), (8, -98), (10, -86), (6, -78), (-6, -78)], closed=True, n=3))
    capp = T(smooth([(-12, -92), (-8, -104), (0, -108), (9, -104), (13, -92), (15, -90), (-12, -90)], closed=True, n=2)) if cap else []
    body = T(smooth([(-16, -76), (16, -76), (20, -70), (18, -36), (-18, -36), (-20, -70)], closed=True, n=2))
    shorts = T([(-18, -38), (18, -38), (17, -14), (2, -14), (0, -22), (-2, -14), (-17, -14)])
    legs = [T([(-15, -14), (-4, -14), (-4, 4), (-14, 4)]), T([(4, -14), (15, -14), (14, 4), (4, 4)])]
    boots = [T([(-16, 4), (-2, 4), (-2, 10), (-18, 10)]), T([(2, 4), (16, 4), (18, 10), (2, 10)])]
    if arm_up:
        arm = T(offset_polyline(smooth([(14, -72), (28, -96), (34, -126)], n=4), [5 * u * 100 / h, 4, 3]))
        hand = T([(32, -128), (38, -140), (40, -138), (36, -126)])
    else:
        arm = T(offset_polyline(smooth([(16, -72), (22, -52), (20, -34)], n=4), [5, 4, 3]))
        hand = T(circle(20, -32, 4, 10))
    arm2 = T(offset_polyline(smooth([(-16, -72), (-22, -52), (-20, -34)], n=4), [5, 4, 3]))
    collar = T([(-6, -78), (6, -78), (5, -74), (-5, -74)])
    return dict(head=head, cap=capp, body=body, shorts=shorts, legs=legs, boots=boots, arm=arm, hand=hand, arm2=arm2, collar=collar)
BOYS = [boy(470, 606, 170, arm_up=True), boy(672, 622, 184), boy(790, 596, 148, cap=False)]
def boy_polys(b):
    return [b["head"], b["cap"], b["body"], b["shorts"], b["arm"], b["hand"], b["arm2"]] + b["legs"] + b["boots"]
BOY_ALL = [ring for b in BOYS for ring in union([p for p in boy_polys(b) if p])]
# --- the vault: a great arch, pilasters, a smaller arch to each side into the dark
ARCH_C = (JX, 190); ARCH_R = 400
arch_in = arc_pts(ARCH_C[0], ARCH_C[1], ARCH_R, 180, 360, 40)
arch_out = arc_pts(ARCH_C[0], ARCH_C[1], ARCH_R + 26, 180, 360, 40)
arch_band = arch_in + arch_out[::-1]
back_wall = arch_in + [(JX + ARCH_R, FLOOR), (JX - ARCH_R, FLOOR)]
side_l = [(0, 0), (JX - ARCH_R - 26, 0), (JX - ARCH_R - 26, FLOOR), (0, FLOOR)]
side_r = [(JX + ARCH_R + 26, 0), (W, 0), (W, FLOOR), (JX + ARCH_R + 26, FLOOR)]
spandrel = [(JX - ARCH_R - 26, 0), (JX + ARCH_R + 26, 0), (JX + ARCH_R + 26, 190), (JX - ARCH_R - 26, 190)]
door_l = arc_pts(300, 330, 60, 180, 360, 20) + [(360, FLOOR), (240, FLOOR)]
door_r = arc_pts(900, 330, 60, 180, 360, 20) + [(960, FLOOR), (840, FLOOR)]
# the light: a slanting shaft from a slit high on the left, falling on the jar
def light(x, y):
    # distance from the shaft's centre line, from (150,0) toward the jar
    ax, ay = 150, 0; bx, by = JX - 20, 300
    t = max(0, min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2)))
    px, py = ax + (bx - ax) * t, ay + (by - ay) * t
    d = math.hypot(x - px, y - py)
    return min(1, max(0.12, (d - 60) / 120)) if d < 180 else 1.0

# ============================================================ the chamber
# back wall: courses of stone, dark, lit by the shaft
courses = []
y = 190 - 400
while y < FLOOR:
    courses.append(y)
    y += 34
cv.hatch([back_wall], angle=0, spacing=2.6, w=0.7, jitter=0.15, break_fn=lambda x, y: light(x, y) * 0.95, holes=[jar_outline, door_l, door_r] + BOY_ALL, piece=(16, 60))
cv.hatch([back_wall], angle=90, spacing=4.2, w=0.6, jitter=0.15, break_fn=lambda x, y: light(x, y) * 0.5, holes=[jar_outline, door_l, door_r] + BOY_ALL, piece=(10, 40))
# mortar lines: the courses, and staggered joints
stone_lines = []
for i, cy in enumerate(courses):
    stone_lines.append([(JX - ARCH_R, cy), (JX + ARCH_R, cy)])
    xoff = (i % 2) * 36
    for xx in range(int(JX - ARCH_R) + xoff, int(JX + ARCH_R), 72):
        stone_lines.append([(xx, cy), (xx, cy + 34)])
cv.hatch_lines([back_wall], stone_lines, 1.1, holes=[jar_outline, door_l, door_r] + BOY_ALL)
# the two doorways into the dark
for d in (door_l, door_r):
    cv.hatch([d], angle=0, spacing=2.0, w=1.0, holes=BOY_ALL)
    cv.hatch([d], angle=90, spacing=2.2, w=0.9, holes=BOY_ALL)
    cv.stroke(d, 1.4, closed=True)
# the arch band: voussoirs
cv.stroke(arch_in, 1.6); cv.stroke(arch_out, 1.6)
for k in range(0, 41, 2):
    a = math.radians(180 + 180 * k / 40)
    cv.stroke([(ARCH_C[0] + ARCH_R * math.cos(a), ARCH_C[1] + ARCH_R * math.sin(a)), (ARCH_C[0] + (ARCH_R + 26) * math.cos(a), ARCH_C[1] + (ARCH_R + 26) * math.sin(a))], 1.2)
cv.hatch([arch_band], angle=0, spacing=3.4, w=0.6, break_fn=lambda x, y: light(x, y) * 0.6, piece=(6, 20))
# the spandrels and sides: dark stone, ruled
for p in (spandrel, side_l, side_r):
    cv.hatch([p], angle=0, spacing=2.8, w=0.7, jitter=0.15, break_fn=lambda x, y: light(x, y) * 0.9, holes=[arch_band, back_wall, circle(JX, 40, 8, 12)], piece=(16, 60))
    cv.hatch([p], angle=90, spacing=4.0, w=0.6, jitter=0.15, break_fn=lambda x, y: light(x, y) * 0.5, holes=[arch_band, back_wall], piece=(10, 40))
# the slit of light, upper left: a bright gap with a few rays
cv.hatch([[(120, 0), (200, 0), (JX - 60, 320), (JX - 140, 330)]], angle=-58, spacing=14, w=0.6, break_fn=lambda x, y: 0.35, piece=(30, 120), holes=[jar_outline])
# the keystone and the hook
cv.fill(circle(JX, 40, 6, 12))
cv.stroke(cord, 1.4)
# the floor: flagstones, dust, a broken drum of a column
floor = [(0, FLOOR), (W, FLOOR), (W, H), (0, H)]
VP = (JX, 200)
frays = []
for k in range(-12, 13):
    x = JX + k * 80
    dx, dy = x - VP[0], FLOOR - VP[1]
    t = (H - VP[1]) / dy
    frays.append([(x, FLOOR), (VP[0] + dx * t, H)])
cv.hatch_lines([floor], frays, 0.9, holes=BOY_ALL)
for yy in [FLOOR, FLOOR + 22, FLOOR + 52, FLOOR + 92, FLOOR + 140]:
    cv.hatch_lines([floor], [[(0, yy), (W, yy)]], 0.9, holes=BOY_ALL)
cv.hatch([floor], angle=0, spacing_fn=lambda u: 5 + 8 * u, w=0.6, jitter=0.4, break_fn=lambda x, y: 0.45 * (0.5 + 0.5 * light(x, y)), holes=BOY_ALL, piece=(20, 80))
cv.stipple([floor], n=700, size=0.9, density_fn=lambda x, y: 0.5, holes=BOY_ALL)
# the boys' shadows on the floor, thrown away from the light
for b in BOYS:
    fx, fy = b["boots"][0][0]
    sh = smooth([(fx - 10, fy + 2), (fx + 40, fy + 2), (fx + 120, fy + 40), (fx + 90, fy + 52), (fx + 10, fy + 24)], closed=True, n=3)
    cv.hatch([sh], angle=0, spacing=2.6, w=0.8, holes=BOY_ALL)

# ============================================================ the jar, and the Sibyl
cv.stroke(jar_outline, 1.8, closed=True)
# glass: contour lines that follow the body, leaving a bright band on the left where the light strikes
contours = []
for k in (1, 2):
    f_ = 1 - k * 0.07
    contours.append([(JX + (x - JX) * f_, 300 + (y - 300) * f_ ** 0.5) for (x, y) in jar_outline] + [jar_outline[0]])
cv.hatch_lines([jar_outline], contours, 0.55, holes=[SB[0], SB[2]], cap="round")
# reflections: vertical lines on the right, the glass darkest at its edge; the left kept bright
cv.hatch([jar_outline], angle=90, spacing=3.6, w=0.55, jitter=0.2, break_fn=lambda x, y: min(1, max(0.0, (x - JX - 10) / 70)) ** 1.3, holes=[SB[0], SB[2]], piece=(10, 40))
cv.hatch([jar_outline], angle=90, spacing=3.6, w=0.55, jitter=0.2, break_fn=lambda x, y: min(1, max(0.0, (JX - 60 - x) / 24)) * 0.8, holes=[SB[0], SB[2]], piece=(10, 40))
# the highlight: a bright vertical band at left, cut from the contour lines (drawn as a paper-coloured gap by omission) — we drew them with the gap already via holes; reinforce with an ink edge
cv.stroke(smooth([(JX - 62, 250), (JX - 72, 300), (JX - 66, 360)], n=4), 1.0)
cv.stroke(smooth([(JX - 52, 262), (JX - 60, 300), (JX - 56, 350)], n=4), 0.7)
# lip and stopper band: the one gold on the plate
cv.fill(lip, GOLD)
cv.stroke(lip, 1.0, closed=True)
# dust at the bottom of the jar
dust = smooth([(JX - 56, 418), (JX - 40, 404), (JX, 398), (JX + 44, 404), (JX + 58, 418), (JX + 24, 424), (JX - 24, 424)], closed=True, n=3)
cv.stipple([dust], n=260, size=1.0, density_fn=lambda x, y: 0.8)
# the Sibyl: dark within the glass, only the face and hands lit
shawl, face, knees, hands, eye, mouth, nose, hair = SB
cv.stroke(shawl, 1.4, closed=True)
cv.hatch([shawl], angle=-72, spacing=2.2, w=0.8, break_fn=lambda x, y: min(1, max(0.35, (x - JX + 10) / 40 + 0.4)), holes=[face, knees, hands], piece=(4, 14))
cv.hatch([shawl], angle=15, spacing=3.0, w=0.7, break_fn=lambda x, y: min(1, max(0.1, (y - 350) / 60)), holes=[face, knees, hands], piece=(4, 14))
cv.stroke(knees, 1.2, closed=True)
cv.hatch([knees], angle=-40, spacing=2.4, w=0.7, break_fn=lambda x, y: 0.7, piece=(3, 10), holes=[hands])
cv.stroke(hands, 1.1, closed=True)
cv.hatch([hands], angle=30, spacing=2.6, w=0.5, break_fn=lambda x, y: 0.3, piece=(3, 8))
cv.stroke(face, 1.3, closed=True)
cv.hatch([face], angle=-60, spacing=2.2, w=0.55, break_fn=lambda x, y: min(1, max(0.0, (x - JX + 2) / 14)), piece=(3, 8))
cv.stroke(eye, 1.3); cv.stroke(mouth, 1.0); cv.stroke(nose, 1.1)
cv.strokes(hair, 1.0)
# ============================================================ the boys, black, with a few white lines
for b in BOYS:
    allp = union([p for p in boy_polys(b) if p])
    x0, y0, x1, y1 = bbox(allp)
    cuts = [offset_polyline([(b["collar"][0][0], b["collar"][0][1] + 2), (b["collar"][1][0], b["collar"][1][1] + 2)], 0.6),
            offset_polyline([((b["shorts"][0][0] + b["shorts"][1][0]) / 2, b["shorts"][0][1] + 1), ((b["shorts"][0][0] + b["shorts"][1][0]) / 2, b["shorts"][2][1] - 2)], 0.5),
            offset_polyline([(b["body"][0][0] + 2, b["body"][0][1] + 4), (b["body"][0][0] + 3, b["shorts"][0][1] - 2)], 0.5)]
    if b["cap"]:
        cuts.append(offset_polyline([(b["cap"][0][0] + 3, b["cap"][0][1] + 2), (b["cap"][6][0] - 3, b["cap"][6][1] + 2)], 0.7))
    for lg in b["legs"]:
        cuts.append(offset_polyline([(lg[0][0] + 1, lg[3][1] - 6), (lg[1][0] - 1, lg[3][1] - 6)], 0.6))
    cuts.append(offset_polyline([(b["body"][0][0] + 4, b["body"][0][1] + 2), (b["body"][1][0] - 4, b["body"][1][1] + 2)], 0.5))
    cv.fill_multi(diff(allp, cuts), rule="evenodd")

n = cv.save(OUT)
print('bytes', n)
