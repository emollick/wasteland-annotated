import sys; sys.path.insert(0, 'src')
from engrave import *
import math, random

OUT = sys.argv[1] if len(sys.argv) > 1 else '/mnt/project-files/art/frontispieces/part-3.svg'
W, H = 1200, 700
cv = Canvas(W, H, prefix="p3", seed=33)
rng = random.Random(33)
BANK = 330          # the far bank / waterline
NEAR = 600          # top of the near bank
SUN = (232, 292); R = 30

# ============================================================ far bank: the City at the violet hour
# --- St Magnus the Martyr: tower, octagonal lantern, cupola, spire
MX = 770
tower = rect(MX - 22, 214, 44, BANK - 214)
lantern = [(MX - 15, 214), (MX + 15, 214), (MX + 15, 168), (MX - 15, 168)]
cupola = arc_pts(MX, 168, 15, 180, 360, 12) + [(MX + 15, 168)]
spire = [(MX - 6, 154), (MX + 6, 154), (MX + 1.2, 96), (MX - 1.2, 96)]
spire_base = [(MX - 12, 168), (MX + 12, 168), (MX + 6, 154), (MX - 6, 154)]
ball = circle(MX, 92, 3.5, 12)
# --- the Monument, with its gilt urn of flames
MOX = 706
mon_ped = rect(MOX - 16, 296, 32, BANK - 296)
mon_col = rect(MOX - 8, 158, 16, 296 - 158)
mon_cap = rect(MOX - 12, 150, 24, 8)
mon_urn = smooth([(MOX - 8, 150), (MOX + 8, 150), (MOX + 6, 140), (MOX + 9, 134), (MOX + 3, 126), (MOX + 5, 118), (MOX, 112), (MOX - 5, 118), (MOX - 3, 126), (MOX - 9, 134), (MOX - 6, 140)], closed=True, n=2)
# --- London Bridge (Rennie's five arches), left of the steeple
BX0, BX1, BY = 40, 600, 296
piers = []
arches = []
n_arch = 5
span = (BX1 - BX0) / n_arch
for i in range(n_arch):
    ax = BX0 + span * i
    a = arc_pts(ax + span / 2, BANK + 2, span / 2 - 10, 180, 360, 16)
    arches.append(a + [(ax + span - 10, BANK + 2)])
    piers.append(rect(ax - 10, BY + 8, 20, BANK - BY - 6))
piers.append(rect(BX1 - 10, BY + 8, 20, BANK - BY - 6))
deck = rect(BX0 - 10, BY, BX1 - BX0 + 20, 8)
parapet = rect(BX0 - 10, BY - 6, BX1 - BX0 + 20, 6)
# --- wharves and warehouses along the bank, the gashouse far right
def warehouses(x0, x1, base, seed):
    r = random.Random(seed)
    blocks, roofs, windows, cranes = [], [], [], []
    x = x0
    while x < x1:
        w = r.uniform(30, 70); h = r.uniform(30, 80)
        b = rect(x, base - h, w, h)
        blocks.append(b)
        if r.random() < 0.5:
            roofs.append([(x - 2, base - h), (x + w / 2, base - h - w * 0.25), (x + w + 2, base - h)])
        for wy in range(int(base - h + 10), int(base - 8), 14):
            for wx in range(int(x + 6), int(x + w - 8), 12):
                windows.append(rect(wx, wy, 5, 7))
        if r.random() < 0.35:
            cranes.append([(x + w * 0.7, base - h), (x + w * 0.7, base - h - 30), (x + w * 0.7 + 40, base - h - 50)])
        x += w + r.uniform(0, 6)
    return blocks, roofs, windows, cranes
wb1 = warehouses(600, 690, BANK, 1)
wb2 = warehouses(800, 1000, BANK, 2)
wb0 = warehouses(-20, 40, BANK, 4)
# St Paul's, far off to the left, above the bridge
SPX = 120
sp_drum = rect(SPX - 20, 232, 40, 20)
sp_dome = arc_pts(SPX, 232, 20, 180, 360, 20) + [(SPX + 20, 232)]
sp_lant = rect(SPX - 4, 200, 8, 12)
sp_cross = rect(SPX - 1, 192, 2, 8)
# the gashouse: a gasholder's iron frame, far right
GX, GY = 1080, BANK
gas_cols = [rect(GX - 70 + k * 28, GY - 120 + (k in (0, 5)) * 0, 4, 120) for k in range(6)]
gas_rings = [rect(GX - 72, GY - 120 + k * 30, 144, 3) for k in range(4)]
gas_drum = rect(GX - 62, GY - 60, 124, 60)
# chimneys with smoke
chimneys = [rect(640, 236, 8, 60), rect(930, 250, 7, 50)]

city_polys = [tower, lantern, cupola, spire, spire_base, mon_ped, mon_col, mon_cap, mon_urn, deck, parapet, sp_drum, sp_dome, sp_lant, sp_cross, gas_drum] + piers + gas_cols + gas_rings + chimneys
for wb in (wb0, wb1, wb2):
    city_polys += wb[0] + wb[1]

# ============================================================ sky: the last rays, and smoke
sky = [(0, 0), (W, 0), (W, BANK), (0, BANK)]
def glow(x, y):
    d = dist((x, y), SUN)
    if d < R + 6: return 0
    if d > 260: return 1.0
    return max(0.05, (d - R - 6) / 200) ** 1.2
SAILS = None  # filled in below once the barges exist

# smoke from the chimneys, blown downstream (to the right)
for (cx, cy) in [(644, 236), (933, 250)]:
    pts = [(cx, cy)]
    for i in range(1, 12):
        pts.append((cx + i * 14 + math.sin(i * 0.8) * 6, cy - i * 9 - math.sin(i * 1.3) * 5))
    sm = smooth(pts, n=4)
    cv.stroke(sm, 0.8)
    cv.stroke([(x + 5, y - 4 + math.sin(i) * 3) for i, (x, y) in enumerate(sm)], 0.6)
# gulls
for (gx, gy, gs) in [(520, 150, 1.0), (560, 130, 0.8), (600, 165, 0.7), (420, 120, 0.6)]:
    cv.fill(bird(gx, gy, gs))

CITY_DRAW = r'''
# ============================================================ the City drawn
# bridge
for a in arches:
    cv.stroke(a[:-1], 1.0)
    cv.hatch([a], angle=0, spacing=2.4, w=0.7)      # the dark under the arches
cv.fills(piers)
cv.stroke(deck, 1.2, closed=True); cv.stroke(parapet, 1.0, closed=True)
cv.hatch([deck], angle=0, spacing=2.2, w=0.6)
# the crowd and traffic on the bridge: ticks and a bus
xs = BX0
crowd = []
while xs < BX1:
    crowd.append(figure_walking(xs, BY - 6, rng.uniform(7, 9), step=rng.random(), facing=rng.choice([-1, 1])))
    xs += rng.uniform(5, 9)
cv.fills(crowd)
cv.fill(rect(300, BY - 22, 34, 16)); cv.fill(rect(302, BY - 30, 30, 8))   # a motor-bus
# warehouses
for blocks, roofs, windows, cranes in (wb0, wb1, wb2):
    for b in blocks: cv.stroke(b, 1.0, closed=True)
    cv.hatch(blocks, angle=90, spacing=3.4, w=0.6, break_fn=lambda x, y: 0.5, piece=(6, 20), holes=windows)
    cv.fills(windows)
    for r_ in roofs: cv.stroke(r_, 1.0)
    cv.strokes(cranes, 1.2)
# St Paul's
cv.stroke(sp_dome, 1.0); cv.stroke(sp_drum, 0.9, closed=True); cv.stroke(sp_lant, 0.9, closed=True); cv.fill(sp_cross)
cv.hatch([sp_dome + [], sp_drum], angle=90, spacing=3, w=0.5, break_fn=lambda x, y: min(1, max(0.1, (x - SPX + 4) / 24)), piece=(4, 10))
# gasholder
cv.fills(gas_cols); cv.fills(gas_rings)
cv.stroke(gas_drum, 1.0, closed=True)
cv.hatch([gas_drum], angle=90, spacing=3.2, w=0.6, break_fn=lambda x, y: min(1, max(0.1, (x - GX + 40) / 70)))
cv.fills(chimneys)
# Magnus Martyr
cv.stroke(tower, 1.4, closed=True)
cv.hatch([tower], angle=90, spacing=2.8, w=0.6, break_fn=lambda x, y: min(1, max(0.08, (x - MX + 4) / 26)), piece=(6, 16))
cv.stroke(circle(MX, 240, 9, 24), 1.0, closed=True); cv.stroke([(MX, 240), (MX, 234)], 1.0); cv.stroke([(MX, 240), (MX + 5, 242)], 1.0)  # the clock
cv.stroke([(MX - 22, 262), (MX + 22, 262)], 1.0)
cv.stroke(rect(MX - 8, 268, 16, 44), 1.0, closed=True); cv.hatch([rect(MX - 8, 268, 16, 44)], angle=0, spacing=2.2, w=0.6)   # the belfry louvres
cv.stroke(lantern, 1.2, closed=True)
for k in range(3):
    ax = MX - 10 + k * 10
    cv.stroke(arc_pts(ax, 190, 3.5, 180, 360, 6) + [(ax + 3.5, 206), (ax - 3.5, 206)], 0.8, closed=True)
cv.hatch([lantern], angle=90, spacing=2.6, w=0.5, break_fn=lambda x, y: min(1, max(0, (x - MX) / 15)), piece=(4, 10))
cv.stroke(cupola, 1.2); cv.hatch([cupola], angle=60, spacing=2.4, w=0.5, break_fn=lambda x, y: min(1, max(0.1, (x - MX + 2) / 14)), piece=(3, 8))
cv.stroke(spire_base, 1.0, closed=True); cv.stroke(spire, 1.2, closed=True)
cv.hatch([spire], angle=90, spacing=2.0, w=0.5, break_fn=lambda x, y: min(1, max(0, (x - MX + 1) / 5)))
cv.fill(ball); cv.stroke([(MX, 92), (MX, 80)], 1.0); cv.stroke([(MX - 5, 84), (MX + 5, 84)], 1.0)
# the Monument
cv.stroke(mon_ped, 1.2, closed=True); cv.hatch([mon_ped], angle=90, spacing=3, w=0.6, break_fn=lambda x, y: min(1, max(0.1, (x - MOX + 6) / 20)), piece=(4, 12))
cv.stroke(mon_col, 1.2, closed=True)
cv.strokes([[(MOX - 8 + k * 3.2, 160), (MOX - 8 + k * 3.2, 294)] for k in range(1, 5)], 0.6)     # fluting
cv.hatch([mon_col], angle=90, spacing=2.0, w=0.6, break_fn=lambda x, y: min(1, max(0, (x - MOX + 1) / 8)))
cv.stroke(mon_cap, 1.0, closed=True)
cv.fill(mon_urn, GOLD)
cv.stroke(mon_urn, 0.9, closed=True)


'''
# ============================================================ the river
water = [(0, BANK), (W, BANK), (W, NEAR), (0, NEAR)]
# --- the barges, drifting: a big spritsail barge in the middle distance, another beyond
def barge(x, y, s, flip=False):
    """Thames sailing barge; (x,y) = waterline at the bow; s = scale; returns dict of polygons (local, then placed)"""
    hull = smooth([(0, 0), (12, -14), (150, -12), (166, 2), (150, 10), (10, 8)], closed=True, n=3)
    mast = [(60, -14), (65, -14), (64, -212), (61, -212)]
    sprit = [(56, -22), (60, -26), (158, -188), (155, -184)]
    main = [(65, -172), (156, -186), (150, -40), (65, -30)]
    top = [(64, -210), (65, -172), (128, -182)]
    mizzen_mast = [(140, -10), (143, -10), (142, -84), (141, -84)]
    mizzen = [(143, -80), (176, -62), (170, -18), (143, -16)]
    leeboard = smooth([(70, -8), (96, -6), (100, 12), (80, 18), (66, 8)], closed=True, n=2)
    rudder = [(160, -4), (170, -2), (170, 12), (162, 12)]
    parts = {"hull": hull, "mast": mast, "sprit": sprit, "main": main, "top": top, "mizzen_mast": mizzen_mast, "mizzen": mizzen, "leeboard": leeboard, "rudder": rudder}
    return {k: place(v, x, y, s, flip=flip) for k, v in parts.items()}
B1 = barge(360, 470, 1.15)
B2 = barge(620, 372, 0.55, flip=True)
B3 = barge(1010, 356, 0.42)
# --- Elizabeth and Leicester: the gilded shell, beating oars, in the right middle distance
def royal_barge(x, y, s):
    hull = smooth([(0, 0), (8, -10), (120, -10), (140, -6), (150, 0), (144, 8), (10, 8)], closed=True, n=3)
    canopy = [(40, -10), (110, -10), (110, -36), (40, -36)]
    canopy_top = [(36, -36), (114, -36), (110, -44), (40, -44)]
    posts = [rect(42, -36, 2, 26), rect(106, -36, 2, 26)]
    shell = smooth([(140, -6), (160, -10), (176, -22), (180, -40), (170, -52), (156, -48), (152, -36), (146, -22)], closed=True, n=3)
    oars = [[(20 + k * 14, 0), (14 + k * 14, 20)] for k in range(7)]
    figs = [circle(60, -22, 5, 12), circle(80, -22, 5, 12)]
    bodies = [smooth([(52, -18), (68, -18), (70, -10), (50, -10)], closed=True, n=2), smooth([(72, -18), (88, -18), (90, -10), (70, -10)], closed=True, n=2)]
    parts = {"hull": hull, "canopy": canopy, "canopy_top": canopy_top, "shell": shell}
    out = {k: place(v, x, y, s) for k, v in parts.items()}
    out["posts"] = [place(p, x, y, s) for p in posts]
    out["oars"] = [place(o, x, y, s) for o in oars]
    out["figs"] = [place(p, x, y, s) for p in figs]
    out["bodies"] = [place(p, x, y, s) for p in bodies]
    return out
RB = royal_barge(820, 420, 0.8)
# --- a swan, near, right of centre; the near bank; the rat; the fisher
def swan(x, y, s, flip=False):
    body = smooth([(-30, 0), (-22, -12), (0, -14), (22, -10), (30, 0), (20, 6), (-20, 6)], closed=True, n=3)
    neck = smooth([(18, -10), (22, -30), (18, -46), (24, -56), (32, -56), (34, -48), (28, -44), (30, -30), (28, -12)], closed=True, n=3)
    beak = [(32, -54), (44, -50), (32, -47)]
    wing = smooth([(-24, -8), (-10, -24), (14, -22), (20, -10)], closed=True, n=3)
    return [place(p, x, y, s, flip=flip) for p in (body, neck, beak, wing)]
SW = swan(660, 560, 0.9, flip=True)
bank = smooth([(0, NEAR + 10), (140, NEAR - 4), (300, NEAR + 6), (460, NEAR - 8), (640, NEAR + 10), (820, NEAR - 6), (1000, NEAR + 4), (W, NEAR - 10), (W, H), (0, H)], closed=False, n=3)
bank = bank + [(W, H), (0, H)]
def rat(x, y, s, flip=False):
    body = smooth([(-30, 0), (-24, -10), (-8, -16), (10, -14), (26, -8), (40, -4), (46, 0), (40, 4), (20, 6), (-10, 6), (-26, 5)], closed=True, n=3)
    ear = circle(20, -12, 4, 10)
    tail = smooth([(-30, 0), (-46, -2), (-62, 4), (-80, 0), (-92, -8)], n=4)
    legs = [[(-14, 5), (-18, 14)], [(14, 5), (12, 14)], [(30, 4), (34, 12)], [(-22, 5), (-28, 12)]]
    return place(body, x, y, s, flip=flip), place(ear, x, y, s, flip=flip), place(tail, x, y, s, flip=flip), [place(l, x, y, s, flip=flip) for l in legs]
RAT = rat(330, 648, 1.0)
def fisher(x, y, s):
    # sitting on the bank, side view facing left, rod out over the water
    body = smooth([(0, 0), (-6, -20), (-10, -44), (-2, -58), (10, -60), (18, -50), (14, -36), (22, -20), (30, -4), (26, 4), (-30, 6), (-34, 0)], closed=True, n=3)
    hat = [(-4, -60), (16, -60), (22, -58), (12, -66), (2, -70), (-8, -66), (-14, -58)]
    rod = [(6, -30), (-160, -70)]
    line = [(-160, -70), (-166, -20)]
    return place(body, x, y, s), place(hat, x, y, s), place(rod, x, y, s), place(line, x, y, s)
FI = fisher(930, 606, 1.0)

occ_water = [B1["hull"], B1["leeboard"], B1["rudder"], B2["hull"], B3["hull"], RB["hull"], RB["shell"], RB["canopy"], RB["canopy_top"], SW[0], SW[1], SW[3], bank] + RB["bodies"] + RB["figs"]
SAILS = [B[k] for B in (B1, B2, B3) for k in ("main", "top", "mizzen", "mast", "sprit", "hull")]
ruled_sky(cv, sky, 0, BANK, holes=city_polys + SAILS + [circle(SUN[0], SUN[1], R + 5, 48)], spacing_top=3.4, spacing_bot=7.5, w=0.65, jitter=0.12, break_fn=glow)
sun(cv, SUN[0], SUN[1], R, rays=22, ray_len=60, ray_w=2.2, seed=3, hatched=True, holes=[deck, parapet] + piers)
# (the sky and sun are drawn here, before the city, which we now draw over them)
exec(CITY_DRAW)
# reflections: dark broken verticals under the steeple, the Monument, the bridge piers and the barges
def reflection(poly, k=0.55, darken=1.0):
    ys = [p[1] for p in poly]
    top = min(ys)
    return [(x, BANK + (BANK - y) * k) for (x, y) in poly]
refl = [reflection(tower), reflection(lantern + [(MX + 15, 214)]), reflection(spire, 0.5), reflection(mon_col), reflection(mon_ped)] + [reflection(p) for p in piers]
# waves: fine and close far off, opening out toward us; broken more where the light strikes
def wave_layer(y0, y1, spacing, amp, wl, w, broken, seed):
    waves(cv, [water], y0, y1, 0, W, spacing=spacing, amp=amp, wl=wl, w=w, seed=seed, broken=broken, holes=occ_water)
wave_layer(BANK + 2, 380, 3.2, 0.9, 40, 0.55, 0.12, 1)
wave_layer(380, 470, 4.6, 1.6, 55, 0.65, 0.25, 2)
wave_layer(470, NEAR + 12, 7.0, 2.6, 75, 0.8, 0.4, 3)
# the reflections, as denser wave lines within the mirrored shapes
cv.hatch_lines(refl, [[(x, y + 1.5 * math.sin(x / 9)) for x in range(0, W, 6)] for y in range(BANK, 480, 3)], 0.7, holes=occ_water)
# the sun's road on the water: a light path, so lines are thinned there (drawn as gaps by hatching the surroundings darker)
cv.hatch([[(SUN[0] - 40, BANK), (SUN[0] + 40, BANK), (SUN[0] + 90, NEAR), (SUN[0] - 90, NEAR)]], angle=0, spacing=6, w=1.0, jitter=1.0,
         break_fn=lambda x, y: 0.25, piece=(3, 10), holes=occ_water)
# oil and tar: dark slicks by the barge
slick = smooth([(300, 500), (420, 496), (560, 506), (600, 530), (520, 548), (380, 546), (290, 528)], closed=True, n=3)
cv.hatch([slick], angle=0, spacing=3.4, w=0.9, jitter=0.6, break_fn=lambda x, y: 0.55, piece=(8, 30), holes=occ_water)

# --- draw the barges
def draw_barge(B, main_tone=1.0, w=1.0):
    cv.fill(B["hull"])
    whiteline(cv, B["hull"], [offset_polyline([lerp(B["hull"][2], B["hull"][20 % len(B["hull"])], 0), B["hull"][2]], 0.1)])
    cv.stroke(B["hull"], 1.0 * w, closed=True)
    cv.fill(B["leeboard"]); cv.fill(B["rudder"])
    cv.fill(B["mast"]); cv.fill(B["sprit"]); cv.fill(B["mizzen_mast"])
    for sail in ("main", "top", "mizzen"):
        S = B[sail]
        # red sails, wide: solid, with the seams cut out as white lines running with the leech
        x0, y0, x1, y1 = bbox([S])
        seams = []
        k = x0 + 9
        while k < x1:
            top_y = y0 - 5
            seams.append(offset_polyline([(k, top_y), (k - (y1 - y0) * 0.06, y1 + 5)], 0.55 * w))
            k += 10.5
        # a soft fold line or two
        seams.append(offset_polyline(smooth([(x0 + (x1 - x0) * 0.2, y1), (x0 + (x1 - x0) * 0.45, y0 + (y1 - y0) * 0.55), (x0 + (x1 - x0) * 0.62, y0)], n=4), [0.3, 0.9, 0.3]))
        cv.fill_multi(diff(S, seams), rule="evenodd")
        cv.stroke(S, 1.0 * w, closed=True)
draw_barge(B2, 0.8, 0.7)
draw_barge(B3, 0.7, 0.6)
draw_barge(B1, 1.0, 1.0)
# crew: two figures on the big barge
cv.fill(figure_walking(B1["hull"][0][0] + 168, B1["hull"][0][1] - 12, 26, step=0.2, facing=-1))
# --- Elizabeth and Leicester
cv.fill(RB["hull"]); cv.stroke(RB["hull"], 1.0, closed=True)
cv.strokes(RB["oars"], 1.6)
cv.stroke(RB["canopy"], 1.0, closed=True); cv.hatch([RB["canopy"]], angle=0, spacing=2.6, w=0.6, break_fn=lambda x, y: 0.5, piece=(6, 20))
cv.fill(RB["canopy_top"]); cv.fills(RB["posts"])
cv.fills(RB["bodies"]); cv.fills(RB["figs"])
cv.fill(RB["shell"], GOLD); cv.stroke(RB["shell"], 1.0, closed=True)
sx, sy = RB["shell"][0]
cv.strokes([[lerp(RB["shell"][0], p, 0.25), p] for p in RB["shell"][8:24:3]], 0.7)     # the ribs of the shell
# --- the swan
cv.stroke(SW[0], 1.2, closed=True); cv.stroke(SW[1], 1.2, closed=True); cv.fill(SW[2]); cv.stroke(SW[3], 1.0, closed=True)
cv.hatch([SW[0]], angle=-20, spacing=3, w=0.6, break_fn=lambda x, y: min(1, max(0, (y - 552) / 12)), piece=(3, 8))
cv.hatch([SW[3]], angle=-30, spacing=3, w=0.55, break_fn=lambda x, y: 0.35, piece=(3, 8))

# ============================================================ the near bank: wet, with the last fingers of leaf, the rat, the fisher
cv.stroke(bank[:len(bank) - 2], 1.6)
cv.hatch([bank], angle=-8, spacing=5, w=0.7, jitter=0.6, break_fn=lambda x, y: min(1, max(0.15, (y - NEAR) / 80)), piece=(10, 40), holes=[RAT[0], FI[0]])
cv.hatch([bank], angle=64, spacing=6, w=0.6, jitter=0.4, break_fn=lambda x, y: min(1, max(0.0, (y - NEAR - 30) / 80)), piece=(10, 40), holes=[RAT[0], FI[0]])
# vegetation: reeds and grasses along the top of the bank
reeds = []
heads = []
r = random.Random(9)
for cx in [30, 90, 170, 250, 330, 420, 500, 600, 700, 790, 1010, 1090, 1170]:
    if 880 < cx < 990: continue
    yb = NEAR + 4 + 6 * math.sin(cx / 60)
    for k in range(r.randint(5, 9)):
        x = cx + r.uniform(-14, 14)
        h = r.uniform(16, 64)
        lean = r.uniform(-0.5, 0.5)
        blade = smooth([(x, yb), (x + lean * h * 0.3, yb - h * 0.5), (x + lean * h * 0.9, yb - h)], n=3)
        reeds.append(blade)
        if h > 44 and r.random() < 0.35:
            heads.append(ellipse(blade[-1][0], blade[-1][1] + 4, 2.2, 6, 10, math.degrees(math.atan2(lean, -1)) + 90))
cv.strokes(reeds, 1.0)
cv.fills(heads)
# a few leaves clutching the bank
for (lx, ly, la) in [(180, 630, 20), (250, 660, -30), (520, 640, 50), (760, 660, -10), (1100, 640, 30)]:
    lf = leaf((lx, ly), (lx + 16 * math.cos(math.radians(la)), ly - 16 * math.sin(math.radians(la))), 10, curve=0.1)
    cv.stroke(lf, 0.9, closed=True)
    cv.hatch([lf], angle=la + 60, spacing=2.2, w=0.5, break_fn=lambda x, y: 0.6, piece=(2, 6))
# the rat
cv.fill(RAT[0]); cv.fill(RAT[1]); cv.stroke(RAT[2], 1.6); cv.strokes(RAT[3], 1.4)
cv.stroke([(RAT[0][8][0] + 4, RAT[0][8][1] - 1), (RAT[0][8][0] + 12, RAT[0][8][1] - 4)], 0.6)   # whiskers
# the fisher
cv.fill(FI[0]); cv.fill(FI[1]); cv.stroke(FI[2], 1.6); cv.stroke(FI[3], 0.8)

n = cv.save(OUT)
print('bytes', n)
