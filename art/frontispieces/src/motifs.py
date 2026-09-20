"""Small figures shared by the plates and the ornaments."""
import sys; sys.path.insert(0, 'src')
from engrave import *
import math, random

def nightingale(x, y, s, flip=False):
    body = smooth([(-14, 0), (-8, -7), (2, -9), (10, -7), (16, -2), (12, 4), (0, 6), (-10, 5)], closed=True, n=3)
    headp = smooth([(10, -8), (14, -13), (20, -12), (24, -9), (20, -5), (14, -5)], closed=True, n=3)
    beak = [(23, -10), (31, -8), (23, -6)]
    tail = [(-14, 0), (-28, 4), (-26, 8), (-12, 5)]
    wing = smooth([(-4, -7), (-2, -2), (6, -3), (12, -6)], n=3)
    return [place(p, x, y, s, flip=flip) for p in (body, headp, beak, tail, wing)]

def rat(x, y, s, flip=False):
    body = smooth([(-30, 0), (-24, -10), (-8, -16), (10, -14), (26, -8), (40, -4), (46, 0), (40, 4), (20, 6), (-10, 6), (-26, 5)], closed=True, n=3)
    ear = circle(20, -12, 4, 10)
    tail = smooth([(-30, 0), (-46, -2), (-62, 4), (-80, 0), (-92, -8)], n=4)
    legs = [[(-14, 5), (-18, 14)], [(14, 5), (12, 14)], [(30, 4), (34, 12)], [(-22, 5), (-28, 12)]]
    return place(body, x, y, s, flip=flip), place(ear, x, y, s, flip=flip), place(tail, x, y, s, flip=flip), [place(l, x, y, s, flip=flip) for l in legs]

def cock(x, y, s, flip=False):
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
    P = lambda p: place(p, x, y, s, flip=flip)
    return dict(body=P(body), neck=P(neck), head=P(head), beak=P(beak), comb=P(comb), wattle=P(wattle), tail=[P(t) for t in tail], legs=[P(l) for l in legs], eye=P(eye))

def draw_cock(cv, CK, w_legs=1.4):
    for t in CK["tail"]: cv.fill(t)
    for k in ("body", "neck", "head", "beak", "comb", "wattle"): cv.fill(CK[k])
    cv.strokes(CK["legs"], w_legs)
    whiteline(cv, CK["head"], [CK["eye"]])

def fish(x, y, s, flip=False, angle=0):
    body = smooth([(-20, 0), (-12, -7), (4, -9), (16, -4), (22, 0), (16, 4), (4, 9), (-12, 7)], closed=True, n=3)
    tail = [(-20, 0), (-32, -9), (-30, 0), (-32, 9)]
    eye = circle(12, -2, 1.6, 8)
    fin = [(0, -8), (6, -16), (12, -8)]
    return [place(p, x, y, s, angle=angle, flip=flip) for p in (body, tail, eye, fin)]

def chess_piece(kind, x, y, h):
    u = h / 40.0
    if kind == 'king':
        P = [(-7, 0), (7, 0), (5, -6), (3, -14), (5, -22), (4, -30), (2, -32), (2, -35), (5, -35), (5, -37), (2, -37), (2, -40), (-2, -40), (-2, -37), (-5, -37), (-5, -35), (-2, -35), (-2, -32), (-4, -30), (-5, -22), (-3, -14), (-5, -6)]
    elif kind == 'queen':
        P = [(-7, 0), (7, 0), (5, -6), (3, -14), (5, -24), (7, -30), (4, -30), (2, -36), (0, -30), (-2, -36), (-4, -30), (-7, -30), (-5, -24), (-3, -14), (-5, -6)]
    elif kind == 'knight':
        P = [(-7, 0), (7, 0), (5, -8), (6, -18), (9, -26), (7, -32), (1, -34), (-4, -30), (-6, -22), (-2, -20), (-3, -14), (-5, -8)]
    else:
        P = [(-5, 0), (5, 0), (3, -6), (2, -12), (4, -18), (2, -22), (-2, -22), (-4, -18), (-2, -12), (-3, -6)]
    return smooth([(x + px * u, y + py * u) for px, py in P], closed=True, n=2)

def lilac_florets(x, y, h, seed=1):
    """violet florets of a panicle whose tip is at (x, y) and which hangs down h*0.45"""
    r = random.Random(seed)
    shapes = []
    for i in range(int(h * 1.7)):
        t = r.random() ** 0.8
        yy = y + t * h * 0.48
        spread = 2.5 + t * 11
        fx, fy = x + r.uniform(-1, 1) * spread * (0.6 + 0.4 * r.random()), yy + r.uniform(-1.5, 1.5)
        s = r.uniform(1.5, 2.4)
        shapes.append([(fx, fy - s), (fx + s * 0.35, fy - s * 0.35), (fx + s, fy), (fx + s * 0.35, fy + s * 0.35), (fx, fy + s), (fx - s * 0.35, fy + s * 0.35), (fx - s, fy), (fx - s * 0.35, fy - s * 0.35)])
    return shapes

def lilac(cv, x, y, h, seed=1, lean=0.0, leaves=True):
    r = random.Random(seed)
    stem = smooth([(x, y), (x + lean * h * 0.3, y - h * 0.5), (x + lean * h * 0.5, y - h)], n=4)
    cv.stroke(stem, 1.3)
    if leaves:
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
    shapes = lilac_florets(top[0], top[1], h, seed)
    cv.fills(shapes, VIOLET)
    cv.strokes([[(p[0][0] + 1.4, p[0][1] + 2.4), (p[0][0] + 2.4, p[0][1] + 3.4)] for p in shapes[::4]], 0.8)

def bat(x, y, s, flap=0.0, flip=False):
    wing = smooth([(0, 0), (12, -10 - flap * 8), (30, -14 - flap * 10), (46, -8 - flap * 6), (40, 0), (30, 6), (20, 2), (10, 8)], closed=True, n=3)
    wing2 = [(-px, py) for px, py in wing]
    body = ellipse(0, 2, 5, 8, 12)
    face = circle(0, -6, 4.5, 12)
    ears = [[(-4, -9), (-6, -15), (-1, -10)], [(4, -9), (6, -15), (1, -10)]]
    eyes = [circle(-1.6, -7, 0.8, 6), circle(1.6, -7, 0.8, 6)]
    return dict(wings=[place(wing, x, y, s, flip=flip), place(wing2, x, y, s, flip=flip)], body=place(body, x, y, s), face=place(face, x, y, s),
                ears=[place(e, x, y, s) for e in ears], eyes=[place(e, x, y, s) for e in eyes])

def swan(x, y, s, flip=False):
    body = smooth([(-30, 0), (-22, -12), (0, -14), (22, -10), (30, 0), (20, 6), (-20, 6)], closed=True, n=3)
    neck = smooth([(18, -10), (22, -30), (18, -46), (24, -56), (32, -56), (34, -48), (28, -44), (30, -30), (28, -12)], closed=True, n=3)
    beak = [(32, -54), (44, -50), (32, -47)]
    wing = smooth([(-24, -8), (-10, -24), (14, -22), (20, -10)], closed=True, n=3)
    return [place(p, x, y, s, flip=flip) for p in (body, neck, beak, wing)]

FONT = 'fonts/EBGaramond[wght].ttf'
