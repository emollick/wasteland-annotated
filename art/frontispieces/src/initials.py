import sys; sys.path.insert(0, 'src')
from engrave import *
from motifs import *
import math, random, os

OUTDIR = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/frontispieces'
S = 200          # square
SIZE = 172       # em size for the letter
BASE = 176       # baseline
WGHT = 500

def letter(cv, ch, x, size=SIZE, base=BASE):
    d, adv = glyph_path(FONT, ch, size, x, base, wght=WGHT)
    polys, _ = glyph_polys(FONT, ch, size, x, base, wght=WGHT)
    return d, polys, adv

def save(cv, name):
    n = cv.save(os.path.join(OUTDIR, name))
    print(name, n)

# ---------------------------------------------------------------- I. A — April, lilacs out of the dead land, dull roots
cv = Canvas(S, S, prefix="i1", seed=1)
d, polys, adv = letter(cv, 'A', 42)
# roots under the letter, going down into the dead land
r = random.Random(4)
roots = []
for (x0, spread) in [(58, -1), (74, -0.4), (118, 0.5), (138, 1)]:
    pts = [(x0, BASE - 2)]
    cur = pts[0]; a = math.pi / 2 + spread * 0.4
    for k in range(4):
        a += r.uniform(-0.5, 0.5)
        cur = (cur[0] + math.cos(a) * 7, cur[1] + math.sin(a) * 6)
        pts.append(cur)
    roots.append(smooth(pts, n=3))
for pts in roots:
    cv.ribbon(pts, [1.8, 0.3])
# the ground line, cracked
cv.hatch([[(20, BASE + 1), (180, BASE + 1), (180, S), (20, S)]], angle=0, spacing=4, w=0.6, jitter=0.3, break_fn=lambda x, y: 0.4, piece=(6, 20))
cv.add('<path d="%s" fill="currentColor"/>' % d)
# lilac sprig rising along the left leg, florets in violet
lilac(cv, 40, BASE, 92, seed=5, lean=0.25, leaves=True)
# a few drops of spring rain
cv.strokes([[(150, 30 + k * 9), (146, 40 + k * 9)] for k in range(3)] + [[(166, 50), (162, 60)]], 1.0)
save(cv, 'initial-1.svg')

# ---------------------------------------------------------------- II. T — The Chair: the nightingale on the bar, a knight at the foot, a candle
cv = Canvas(S, S, prefix="i2", seed=2)
d, polys, adv = letter(cv, 'T', 46)
cv.add('<path d="%s" fill="currentColor"/>' % d)
x0, y0, x1, y1 = bbox(polys)
nb = nightingale(x0 + 22, y0 - 2, 1.05)
for p in nb[:4]: cv.fill(p)
cv.strokes([[(x0 + 52 + k * 6, y0 - 12 - k * 5), (x0 + 54 + k * 6, y0 - 16 - k * 5)] for k in range(3)], 1.0)   # jug jug
cv.fill(chess_piece('knight', x1 + 6, BASE, 44))
cv.fill(chess_piece('pawn', x0 - 8, BASE, 26))
# a candle against the stem, its flame the one gold
cx = x0 + 18
cv.fill(rect(cx - 3, BASE - 60, 6, 60))
cv.fill(smooth([(cx - 4, BASE - 62), (cx - 3, BASE - 72), (cx + 1, BASE - 82), (cx + 4, BASE - 72), (cx + 4, BASE - 62)], closed=True, n=3), GOLD)
cv.stroke([(cx, BASE - 62), (cx, BASE - 66)], 1.0)
save(cv, 'initial-2.svg')

# ---------------------------------------------------------------- III. T — the river's tent: a rat along the bar, reeds at the foot
cv = Canvas(S, S, prefix="i3", seed=3)
d, polys, adv = letter(cv, 'T', 46)
x0, y0, x1, y1 = bbox(polys)
# reeds behind the stem
r = random.Random(7)
reeds = []
for k in range(12):
    x = r.uniform(x0 - 10, x1 + 10)
    h = r.uniform(30, 80); lean = r.uniform(-0.4, 0.4)
    reeds.append(smooth([(x, BASE + 2), (x + lean * h * 0.3, BASE - h * 0.5), (x + lean * h * 0.9, BASE - h)], n=3))
cv.strokes(reeds, 1.0)
# water at the base, wavy
cv.strokes([[(x, BASE + 8 + k * 6 + 1.5 * math.sin(x / 7 + k)) for x in range(20, 181, 4)] for k in range(3)], 0.8)
cv.add('<path d="%s" fill="currentColor"/>' % d)
RB, RE, RT, RL = rat(x0 + 60, y0 - 3, 0.62, flip=True)
cv.fill(RB); cv.fill(RE); cv.stroke(RT, 1.3); cv.strokes(RL, 1.1)
whiteline(cv, RB, [circle(RB[0][0] - 22 * 0.62 * 0 + (RB[0][0] - RB[0][0]) + x0 + 60 - 12, y0 - 12, 0.9, 6)])
save(cv, 'initial-3.svg')

# ---------------------------------------------------------------- IV. P — Phlebas: waves, a fish, the coins going down
cv = Canvas(S, S, prefix="i4", seed=4)
d, polys, adv = letter(cv, 'P', 52)
x0, y0, x1, y1 = bbox(polys)
# the sea: wave lines across the lower half, cut around the letter
sea = [(14, 108), (186, 108), (186, 196), (14, 196)]
lines = [[(x, 112 + k * 7 + 2.2 * math.sin(x / 11 + k * 1.3)) for x in range(10, 191, 4)] for k in range(12)]
cv.hatch_lines([sea], lines, 0.7, holes=polys)
cv.add('<path d="%s" fill="currentColor"/>' % d)
# a fish, and the coins
for p in fish(148, 150, 0.7, flip=True, angle=-15)[:2] + [fish(148, 150, 0.7, flip=True, angle=-15)[3]]:
    cv.fill(p)
coins = [ellipse(112 + k * 6, 118 + k * 18, 4.5, 2.6, 12, -20 + k * 10) for k in range(4)]
cv.fills(coins, GOLD); cv.strokes(coins, 0.7, closed=True)
# a gull above
cv.fill(bird(150, 40, 0.8))
save(cv, 'initial-4.svg')

# ---------------------------------------------------------------- V. A — After the torchlight: the cock on the apex, the flash behind
cv = Canvas(S, S, prefix="i5", seed=5)
d, polys, adv = letter(cv, 'A', 42)
x0, y0, x1, y1 = bbox(polys)
apex = ((x0 + x1) / 2 + 2, y0)
# the bolt, behind the letter, violet core with an ink edge
bolt_c = [(166, 0), (150, 40), (170, 72), (146, 118), (164, 150), (146, 200)]
bolt = offset_polyline(bolt_c, [3.5, 3.2, 3, 2.6, 2.2, 1.6])
cv.stroke(bolt, 0.7, closed=True)
cv.fill(offset_polyline(bolt_c, [1.4, 1.3, 1.2, 1.0, 0.8, 0.5]), VIOLET)
cv.add('<path d="%s" fill="currentColor"/>' % d)
CK = cock(apex[0] + 4, apex[1] + 2, 0.62, flip=True)
draw_cock(cv, CK, 1.2)
cv.strokes([[(CK["beak"][1][0] - 3 - k * 4, CK["beak"][1][1] - 5 - k * 3), (CK["beak"][1][0] - 6 - k * 4, CK["beak"][1][1] - 7 - k * 3)] for k in range(3)], 1.0)
# dry grass at the feet
r = random.Random(11)
cv.strokes([[(x, BASE + 2), (x + r.uniform(-4, 4), BASE - r.uniform(6, 16))] for x in [r.uniform(20, 180) for _ in range(16)]], 0.8)
save(cv, 'initial-5.svg')
