"""Small toolkit for drawing the Waste Land map vignettes as SVG.
Everything is drawn in currentColor so the page can set the ink; the ground is transparent.
viewBox is 0 0 200 200. The subject stands on a ground line near y=168 with its base centred on x=100,
which is where the map pin should sit."""
import math, random

INK = "currentColor"
VIOLET = "#4A3560"; GOLD = "#A8873A"; RUST = "#A3442B"; RIVER = "#4C6E85"; PAPER = "#F3EEE3"

def f(v):
    if isinstance(v, float):
        s = f"{v:.1f}".rstrip('0').rstrip('.')
        return '0' if s in ('-0', '') else s
    return str(v)

def M(x, y): return f"M{f(x)} {f(y)}"
def L(x, y): return f"L{f(x)} {f(y)}"

def poly(points, close=False):
    d = M(*points[0]) + "".join(L(*p) for p in points[1:])
    return d + ("Z" if close else "")

def rect(x, y, w, h):
    return poly([(x, y), (x + w, y), (x + w, y + h), (x, y + h)], True)

def arch(x, y, w, h, rise=None):
    """Round-headed opening: bottom-left (x,y+h)... returns closed path of a rectangle with a semicircular top.
    (x,y) is the top-left of the bounding box; rise = radius of the head (defaults to w/2)."""
    r = w / 2 if rise is None else rise
    return (M(x, y + h) + L(x, y + r) + f"A{f(w/2)} {f(r)} 0 0 1 {f(x + w)} {f(y + r)}" + L(x + w, y + h) + "Z")

def ellipse_path(cx, cy, rx, ry):
    return (M(cx - rx, cy) + f"A{f(rx)} {f(ry)} 0 1 0 {f(cx + rx)} {f(cy)}" + f"A{f(rx)} {f(ry)} 0 1 0 {f(cx - rx)} {f(cy)}Z")

def circle_path(cx, cy, r): return ellipse_path(cx, cy, r, r)

def rot(x, y, cx, cy, deg):
    a = math.radians(deg); dx, dy = x - cx, y - cy
    return (cx + dx * math.cos(a) - dy * math.sin(a), cy + dx * math.sin(a) + dy * math.cos(a))

class SVG:
    def __init__(self, seed=1, prefix="v"):
        self.defs, self.body, self.n = [], [], 0
        self.rng = random.Random(seed); self.prefix = prefix

    def uid(self, p="c"):
        self.n += 1; return f"{self.prefix}-{p}{self.n}"

    def multi(self, segs, sw=0.5, stroke=INK, cap="butt", extra=""):
        """Many short strokes as one path element: segs is a list of (x1,y1,x2,y2)."""
        d = "".join(M(a, b) + L(c, e) for a, b, c, e in segs)
        self.path(d, sw=sw, stroke=stroke, cap=cap, extra=extra)

    def water(self, y0, y1, x0=4, x1=196, sw=(0.5, 0.65), step=2.6, grow=0.06, seed_len=(5, 16), gap=(2, 8)):
        """Broken horizontal strokes, thinning downward, as a river or sea surface."""
        y = y0; k = 0; segs = [[], []]
        while y < y1:
            x = x0 + self.rng.uniform(0, 8)
            while x < x1:
                ln = self.rng.uniform(*seed_len)
                segs[k % 2].append((x, y, min(x + ln, x1), y))
                x += ln + self.rng.uniform(*gap)
            y += step + (y - y0) * grow; k += 1
        self.multi(segs[0], sw=sw[1]); self.multi(segs[1], sw=sw[0])

    def add(self, s): self.body.append(s)

    def path(self, d, sw=0.8, fill="none", stroke=INK, cap="round", join="round", op=None, extra=""):
        a = [f'd="{d}"']
        if fill != "none": a.append(f'fill="{fill}"')
        else: a.append('fill="none"')
        if stroke and sw > 0: a.append(f'stroke="{stroke}" stroke-width="{f(sw)}"')
        if cap != "round": a.append(f'stroke-linecap="{cap}"')
        if join != "round": a.append(f'stroke-linejoin="{join}"')
        if op is not None: a.append(f'opacity="{f(op)}"')
        if extra: a.append(extra)
        self.add("<path " + " ".join(a) + "/>")

    def fill(self, d, color=INK, extra=""):
        self.add(f'<path d="{d}" fill="{color}" {extra}/>')

    def line(self, x1, y1, x2, y2, sw=0.8, **kw):
        self.path(M(x1, y1) + L(x2, y2), sw=sw, **kw)

    def clip(self, d):
        id = self.uid("k"); self.defs.append(f'<clipPath id="{id}"><path d="{d}"/></clipPath>'); return id

    def hatch(self, d, angle=45, spacing=1.6, sw=0.5, bbox=(0, 0, 200, 200), jitter=0.0, end_jitter=0.0,
              phase=0.0, stroke=INK, clip_id=None, dash=None):
        """Straight parallel lines at `angle` degrees clipped to path d. Returns the clip id so it can be reused."""
        cid = clip_id or self.clip(d)
        a = math.radians(angle)
        ux, uy = math.cos(a), math.sin(a)
        nx, ny = -uy, ux
        x0, y0, x1, y1 = bbox
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        corners = [(x0, y0), (x1, y0), (x0, y1), (x1, y1)]
        ps = [(px - cx) * nx + (py - cy) * ny for px, py in corners]
        qs = [(px - cx) * ux + (py - cy) * uy for px, py in corners]
        pmin, pmax, qmin, qmax = min(ps), max(ps), min(qs), max(qs)
        segs = []
        p = pmin + phase
        while p <= pmax:
            pp = p + (self.rng.uniform(-jitter, jitter) if jitter else 0)
            q0 = qmin - (self.rng.uniform(0, end_jitter) if end_jitter else 0)
            q1 = qmax + (self.rng.uniform(0, end_jitter) if end_jitter else 0)
            segs.append(M(cx + pp * nx + q0 * ux, cy + pp * ny + q0 * uy) + L(cx + pp * nx + q1 * ux, cy + pp * ny + q1 * uy))
            p += spacing
        extra = f'clip-path="url(#{cid})"' + (f' stroke-dasharray="{dash}"' if dash else "")
        self.path("".join(segs), sw=sw, stroke=stroke, cap="butt", extra=extra)
        return cid

    def stipple(self, d, n, r=0.45, bbox=(0, 0, 200, 200), weight=None, stroke=INK, clip_id=None):
        """Random dots clipped to d. weight(x,y)->0..1 thins the dots (rejection sampling)."""
        cid = clip_id or self.clip(d)
        x0, y0, x1, y1 = bbox
        segs = []
        tries = 0
        while len(segs) < n and tries < n * 30:
            tries += 1
            x, y = self.rng.uniform(x0, x1), self.rng.uniform(y0, y1)
            if weight and self.rng.random() > weight(x, y): continue
            segs.append(M(x, y) + f"l.01 0")
        self.path("".join(segs), sw=r * 2, stroke=stroke, cap="round", extra=f'clip-path="url(#{cid})"')
        return cid

    def wobble(self, points, amp=0.25, seg=3.0):
        """Break a polyline into short segments with a little hand-drawn wobble. Returns a path d."""
        out = []
        for (x1, y1), (x2, y2) in zip(points, points[1:]):
            L_ = math.hypot(x2 - x1, y2 - y1); n = max(1, int(L_ / seg))
            for i in range(n + 1):
                t = i / n
                x, y = x1 + (x2 - x1) * t, y1 + (y2 - y1) * t
                if 0 < i < n:
                    x += self.rng.uniform(-amp, amp); y += self.rng.uniform(-amp, amp)
                out.append((x, y))
        return poly(out)

    def out(self, title=None):
        defs = f"<defs>{''.join(self.defs)}</defs>" if self.defs else ""
        t = f"<title>{title}</title>" if title else ""
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">{t}{defs}{"".join(self.body)}</svg>')

    def save(self, path, title=None):
        import os
        if self.prefix == "v":
            slug = os.path.basename(path).rsplit(".", 1)[0]
            for d_ in range(len(self.defs)):
                self.defs[d_] = self.defs[d_].replace('id="v-', f'id="{slug}-')
            self.body = [b.replace('url(#v-', f'url(#{slug}-') for b in self.body]
        s = self.out(title)
        with open(path, "w") as fh: fh.write(s)
        return len(s)

# ---------- shared figures ----------

def bowler_man(x, y, h=8.0, dir=1, stride=0.0, coat=1.0):
    """Silhouette of a man in a bowler hat and overcoat, feet at (x,y), height h, facing dir (+1 right, -1 left).
    Returns a closed path d. Head down, 'eyes before his feet'."""
    s = h / 8.0
    def P(px, py): return (x + dir * px * s, y - py * s)
    hat_w, brim = 1.5, 2.1
    pts = [
        P(-1.6, 0), P(-1.6 + stride * 0.3, 2.6), P(-1.9, 4.8), P(-1.3, 6.0),   # back leg, coat back
        P(-0.4, 6.4),                                                          # shoulder back
        P(0.1, 6.55), P(0.0, 6.8), P(-0.9, 6.9), P(-0.7, 7.2), P(-0.2, 7.4), P(0.9, 7.9), P(1.6, 7.75),  # brim, crown (tilted forward)
        P(1.9, 7.2), P(1.6, 6.9), P(1.15, 6.75), P(1.3, 6.3), P(1.1, 5.9),     # face down, chin
        P(1.9, 5.5), P(2.3, 4.2), P(2.2, 2.6), P(1.9, 0.0), P(1.2, 0.0), P(1.1, 2.2), P(0.5, 2.3), P(0.2, 0.0),
    ]
    return poly(pts, True)

def bowler_walker(x, y, h=8.0, dir=1, step=0.0):
    """A simpler walking silhouette with legs apart; step in -1..1 moves the legs."""
    s = h / 8.0
    def P(px, py): return (x + dir * px * s, y - py * s)
    st = step * 0.9
    pts = [P(-1.2 - st, 0), P(-0.6 - st * 0.5, 2.8), P(-1.5, 3.2), P(-1.6, 5.2), P(-1.0, 6.2),
           P(-0.5, 6.5), P(-0.2, 6.7), P(-1.0, 6.85), P(-0.8, 7.15), P(-0.2, 7.35), P(0.8, 7.85), P(1.55, 7.7),
           P(1.85, 7.15), P(1.5, 6.85), P(1.1, 6.7), P(1.25, 6.25), P(1.05, 5.9),
           P(1.8, 5.5), P(2.1, 4.0), P(1.6, 3.0), P(1.2 + st, 0), P(0.5 + st, 0), P(0.4 + st * 0.5, 2.6),
           P(-0.3, 2.6), P(-0.5 - st, 0)]
    return poly(pts, True)

# ---------- oblique projection shared by the whole set ----------
# Front faces are drawn square-on; a secondary face recedes up and to the left at 30 degrees, at half scale,
# the way buildings sit on a pictorial map. Light comes from the upper left, so receding faces carry tone.
OBX, OBY = -0.866 * 0.5, -0.5 * 0.5

def ob(x, y, d):
    """A point (x,y) on the front plane pushed back d units in depth."""
    return (x + d * OBX, y + d * OBY)

def side_face(x, y0, y1, d0, d1):
    """Parallelogram on the receding plane at front x, between heights y0..y1 and depths d0..d1."""
    return poly([ob(x, y0, d0), ob(x, y0, d1), ob(x, y1, d1), ob(x, y1, d0)], True)

def top_face(y, x0, x1, d0, d1):
    """Parallelogram on the horizontal plane at height y between x0..x1 and depths d0..d1."""
    return poly([ob(x0, y, d0), ob(x1, y, d0), ob(x1, y, d1), ob(x0, y, d1)], True)

def side_arch(x, ybase, ytop, d0, d1):
    """A round-headed opening drawn on the receding plane (foreshortened arch)."""
    w = d1 - d0; r = w / 2
    # approximate the arch with a polyline of points on the receding plane
    pts = [ob(x, ybase, d0), ob(x, ytop + r, d0)]
    for i in range(1, 8):
        a = math.pi * i / 8
        pts.append(ob(x, ytop + r - r * math.sin(a), d0 + r - r * math.cos(a)))
    pts += [ob(x, ytop + r, d1), ob(x, ybase, d1)]
    return poly(pts, True)

# ---------- a better crowd figure ----------
def cityman(x, y, h=8.0, dir=1, step=0.0, bow=0.6):
    """A clerk in bowler and overcoat, feet at (x,y), height h, walking toward dir. bow tips the head forward.
    Solid silhouette; proportions chosen so a row of them reads as a crowd at 6 px tall."""
    s = h / 10.0
    def P(px, py): return (x + dir * px * s, y - py * s)
    st = step * 0.7; b = bow * 0.45
    pts = [
        P(-1.0 - st, 0.0), P(-0.55 - st * 0.4, 3.4),
        P(-1.75, 3.6), P(-1.9, 6.4), P(-1.55, 7.35), P(-0.7, 7.6),
        P(-0.3 + b, 7.85), P(-0.25 + b, 8.3),
        P(-1.15 + b, 8.45), P(-1.15 + b, 8.75),                       # brim, back
        P(-0.7 + b, 8.85), P(-0.55 + b, 9.4), P(-0.1 + b, 9.85), P(0.5 + b, 9.9), P(1.0 + b, 9.55), P(1.2 + b, 8.95),  # dome
        P(1.75 + b, 8.85), P(1.75 + b, 8.5),                          # brim, front
        P(1.0 + b, 8.35), P(1.05 + b, 7.7), P(0.75 + b * 0.7, 7.35),
        P(1.55, 7.2), P(2.0, 5.5), P(1.85, 3.6), P(1.2, 3.4),
        P(1.1 + st, 0.0), P(0.35 + st, 0.0), P(0.25 + st * 0.6, 3.0), P(-0.2, 3.0), P(-0.3 - st, 0.0),
    ]
    return poly(pts, True)

def crowd_row(s, xs, y, h=8.0, dir=1, hatched_every=3, jitter=0.5):
    """Draw a row of clerks; every nth one is hatched instead of solid so the row does not fuse into a bar."""
    for i, x in enumerate(xs):
        hh = h + s.rng.uniform(-jitter, jitter)
        d = cityman(x, y + s.rng.uniform(-0.3, 0.3), h=hh, dir=dir, step=s.rng.uniform(-1, 1), bow=s.rng.uniform(0.3, 0.9))
        if hatched_every and i % hatched_every == hatched_every - 1:
            s.path(d, sw=0.45)
            s.hatch(d, angle=70, spacing=0.45, sw=0.3, bbox=(x - 4, y - h - 2, x + 4, y + 1))
        else:
            s.fill(d)

# ---------- tone presets ----------
def tone(s, d, level, bbox=(0, 0, 200, 200), angle=45):
    """level: 1 light, 2 mid, 3 dark, 4 solid."""
    if level >= 4:
        s.fill(d); return
    if level == 1:
        s.hatch(d, angle=angle, spacing=2.0, sw=0.35, bbox=bbox)
    elif level == 2:
        s.hatch(d, angle=angle, spacing=1.3, sw=0.45, bbox=bbox)
    else:
        cid = s.hatch(d, angle=angle, spacing=1.1, sw=0.5, bbox=bbox)
        s.hatch(d, angle=angle - 80, spacing=1.3, sw=0.4, bbox=bbox, clip_id=cid)

def clip_evenodd(s, d):
    id = s.uid("k"); s.defs.append(f'<clipPath id="{id}"><path d="{d}" clip-rule="evenodd"/></clipPath>'); return id

def porter(x, y, h=9.0, dir=1, box=False, pipe=False):
    """A Billingsgate fish porter in his tarred-leather bobbin hat (flat top, upturned brim), apron over his coat."""
    s_ = h / 10.0
    def P(px, py): return (x + dir * px * s_, y - py * s_)
    pts = [P(-1.2, 0), P(-0.7, 3.2), P(-2.1, 3.4), P(-2.2, 6.6), P(-1.6, 7.5), P(-0.6, 7.7),
           P(-0.3, 8.0), P(-0.3, 8.3), P(-2.5, 8.4), P(-2.7, 9.0), P(-2.0, 9.0), P(-1.6, 9.2), P(-1.6, 10.2), P(1.7, 10.2), P(1.7, 9.2), P(2.1, 9.0), P(2.8, 9.0), P(2.6, 8.4),
           P(0.5, 8.3), P(0.6, 7.7), P(1.7, 7.5), P(2.3, 6.4), P(2.2, 3.4), P(0.9, 3.2), P(1.3, 0), P(0.4, 0), P(0.15, 2.8), P(-0.3, 2.8), P(-0.4, 0)]
    d = poly(pts, True)
    if box:
        d += poly([P(-3.2, 10.2), P(3.4, 10.2), P(3.4, 12.8), P(-3.2, 12.8)], True)
        d += poly([P(1.7, 7.5), P(3.0, 8.6), P(3.6, 10.4), P(2.7, 10.8), P(2.1, 9.4), P(1.5, 8.4)], True)
    return d

def swell(s, y0, y1, x0=4, x1=196, step=3.2, w=6.0, amp=1.4, sw=0.45):
    """Rows of little waves for a brisk swell."""
    y = y0; segs = ""
    k = 0
    while y < y1:
        x = x0 + (k % 2) * w / 2 + s.rng.uniform(0, 2)
        while x < x1 - w:
            ww = w * s.rng.uniform(0.7, 1.3)
            if s.rng.random() < 0.6:
                segs += M(x, y) + f"q{f(ww/4)} {f(-amp)} {f(ww/2)} 0"
            x += ww + s.rng.uniform(0, 5)
        y += step + (y - y0) * 0.04; k += 1
    s.path(segs, sw=sw, cap="round")
