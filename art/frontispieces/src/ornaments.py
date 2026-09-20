import sys; sys.path.insert(0, 'src')
from engrave import *
from motifs import *
import math, random, os

OUTDIR = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/frontispieces'
LW = 1.1   # the single line weight

def save(cv, name):
    n = cv.save(os.path.join(OUTDIR, name))
    print(name, n)

def floret_outline(x, y, s):
    return [(x, y - s), (x + s * 0.35, y - s * 0.35), (x + s, y), (x + s * 0.35, y + s * 0.35), (x, y + s), (x - s * 0.35, y + s * 0.35), (x - s, y), (x - s * 0.35, y - s * 0.35)]

# ---------------------------------------------------------------- I: a lilac sprig lying along the line, root and all
cv = Canvas(120, 40, prefix="o1")
stem = smooth([(14, 26), (40, 22), (70, 20), (96, 17)], n=4)
cv.stroke(stem, LW)
cv.stroke(smooth([(14, 26), (8, 30), (4, 28)], n=3), LW)     # the root
cv.stroke(smooth([(14, 26), (10, 33)], n=2), LW)
for (bx, side) in [(38, -1), (54, 1)]:
    lf = leaf((bx, 22 - (bx - 14) * 0.08), (bx + 12 * side * 0.9, 22 - (bx - 14) * 0.08 + side * 9), 8, bulge=0.4)
    cv.stroke(lf, LW, closed=True)
r = random.Random(2)
for k in range(14):
    t = k / 13
    x = 72 + t * 30; y = 20 - t * 2 + r.uniform(-6, 6) * (0.3 + t)
    cv.stroke(floret_outline(x, y, 2.4 + r.uniform(-0.4, 0.4)), LW * 0.85, closed=True)
save(cv, 'ornament-1.svg')

# ---------------------------------------------------------------- II: the nightingale between two rules, singing
cv = Canvas(120, 40, prefix="o2")
cv.stroke([(6, 22), (40, 22)], LW); cv.stroke([(80, 22), (114, 22)], LW)
nb = nightingale(58, 24, 0.75)
for ring in union(nb[:4]): cv.stroke(ring, LW, closed=True)
cv.stroke(nb[4], LW)
cv.stroke(circle(nb[1][6][0] - 1, nb[1][6][1] + 1, 0.8, 6), LW * 0.8, closed=True)
cv.strokes([[(76 + k * 4, 12 - k * 3), (78 + k * 4, 10 - k * 3)] for k in range(3)], LW)
save(cv, 'ornament-2.svg')

# ---------------------------------------------------------------- III: the river, and a red sail on it
cv = Canvas(120, 40, prefix="o3")
for k in range(3):
    cv.stroke([(x, 24 + k * 5 + 1.6 * math.sin(x / 9 + k * 1.1)) for x in range(6, 115, 3)], LW)
hull = [(46, 24), (50, 20), (74, 20), (78, 24)]
cv.stroke(hull, LW, closed=True)
cv.stroke([(60, 20), (60, 3)], LW)
cv.stroke([(60, 4), (74, 8), (73, 18), (60, 18)], LW, closed=True)
save(cv, 'ornament-3.svg')

# ---------------------------------------------------------------- IV: the whirlpool between two waves
cv = Canvas(120, 40, prefix="o4")
sp = []
th = 0.0
while th < 4 * math.pi:
    rr = 1 + th * 1.35
    sp.append((60 + rr * math.cos(th), 20 + rr * 0.55 * math.sin(th)))
    th += 0.15
cv.stroke(sp, LW)
cv.stroke([(x, 20 + 1.6 * math.sin(x / 8)) for x in range(6, 36, 3)], LW)
cv.stroke([(x, 20 + 1.6 * math.sin(x / 8)) for x in range(86, 115, 3)], LW)
save(cv, 'ornament-4.svg')

# ---------------------------------------------------------------- V: a flash between two rules
cv = Canvas(120, 40, prefix="o5")
cv.stroke([(6, 20), (42, 20)], LW); cv.stroke([(78, 20), (114, 20)], LW)
cv.stroke([(64, 4), (56, 18), (62, 18), (54, 36)], LW)
cv.stroke([(62, 18), (70, 12)], LW * 0.9)
save(cv, 'ornament-5.svg')

# ---------------------------------------------------------------- a plain one, for anywhere: three florets, an asterism
cv = Canvas(120, 40, prefix="o0")
for (x, y) in [(52, 14), (60, 26), (68, 14)]:
    cv.stroke(floret_outline(x, y, 4), LW, closed=True)
    cv.stroke(circle(x, y, 0.9, 6), LW * 0.8, closed=True)
save(cv, 'ornament-plain.svg')

# ---------------------------------------------------------------- the tailpiece: a drop falling into still water, three rings
cv = Canvas(120, 40, prefix="tp")
cv.stroke([(4, 30), (116, 30)], LW)
for (rx, ry) in [(8, 2.4), (18, 4.8), (30, 7.5)]:
    cv.stroke(ellipse(60, 30, rx, ry, 40), LW)
# the drop, just above
cv.stroke(smooth([(60, 8), (57, 15), (57.5, 20), (60, 22), (62.5, 20), (63, 15)], closed=True, n=3), LW, closed=True)
cv.stroke([(60, 2), (60, 5)], LW)
save(cv, 'tailpiece-shantih.svg')

# ---------------------------------------------------------------- the site mark: lilacs out of the dead land, in a roundel
cv = Canvas(200, 200, prefix="mk", seed=3)
cv.stroke(circle(100, 100, 92, 96), 2.0, closed=True)
cv.stroke(circle(100, 100, 86, 96), 0.9, closed=True)
# broken ground: a few stones, a crack
stones = [smooth([(40, 150), (62, 132), (92, 138), (98, 154), (70, 162), (44, 160)], closed=True, n=3),
          smooth([(104, 156), (112, 138), (140, 134), (158, 148), (150, 162), (110, 164)], closed=True, n=3),
          smooth([(64, 128), (84, 118), (100, 124), (96, 136), (70, 138)], closed=True, n=3)]
for st in stones:
    cv.stroke(st, 1.4, closed=True)
    cv.hatch([st], angle=-30, spacing=3.2, w=0.7, break_fn=lambda x, y: min(1, max(0.1, (y - 130) / 30)), piece=(4, 12))
cv.hatch_lines([circle(100, 100, 84, 96)], [[(20, 166), (60, 168), (100, 165), (140, 169), (180, 166)]], 1.2)
cv.hatch(inter([(12, 166), (188, 166), (188, 188), (12, 188)], circle(100, 100, 84, 96)), angle=0, spacing=3.6, w=0.7, break_fn=lambda x, y: max(0, 0.7 - abs(x - 100) / 110), piece=(6, 24))
# the sprig
lilac(cv, 100, 138, 92, seed=9, lean=0.08, leaves=True)
save(cv, 'mark.svg')

# a simpler mark for very small sizes: the sprig alone over a crack
cv = Canvas(64, 64, prefix="mks", seed=4)
cv.stroke([(6, 56), (22, 57), (32, 54), (44, 57), (58, 55)], 2.2)
cv.stroke(smooth([(32, 54), (33, 40), (33, 26)], n=3), 2.2)
for side in (-1, 1):
    lf = leaf((33, 44), (33 + side * 13, 40), 9, bulge=0.45)
    cv.fill(lf)
# the panicle as one violet cone, notched like a bunch of florets
pan = []
r = random.Random(5)
for i in range(13):
    t = i / 12
    y = 6 + t * 24
    w = 2 + t * 8
    pan.append((33 - w - (1.5 if i % 2 else 0), y))
for i in range(12, -1, -1):
    t = i / 12
    y = 6 + t * 24
    w = 2 + t * 8
    pan.append((33 + w + (1.5 if i % 2 else 0), y))
cv.fill(smooth(pan, closed=True, n=3, tension=0.6), VIOLET)
save(cv, 'mark-small.svg')
