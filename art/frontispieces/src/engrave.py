"""
engrave.py — a small engine for drawing wood-engraving / etching style SVG by code.

Everything is polygons in, compact SVG path strings out.  All linework is
`currentColor` so the page can invert it for dark mode.  No gradients, no
filters, no clipPaths: hatching is clipped in Python and written as one
compact path per layer.
"""
import math, random

INK = "currentColor"
# the accents fall back to the site's fixed values, but an inlined SVG lets the page override them
# (for instance a lighter violet in dark mode) by setting --violet / --gold on an ancestor.
VIOLET = "var(--violet, #4A3560)"
GOLD = "var(--gold, #A8873A)"
RUST = "#A3442B"
RIVER = "#4C6E85"
PAPER = "#F3EEE3"

# ---------------------------------------------------------------- geometry

def rot(p, a, c=(0, 0)):
    ca, sa = math.cos(a), math.sin(a)
    x, y = p[0] - c[0], p[1] - c[1]
    return (c[0] + x * ca - y * sa, c[1] + x * sa + y * ca)

def place(pts, x=0, y=0, s=1.0, angle=0.0, sx=None, sy=None, flip=False):
    """scale (optionally non-uniform), optionally mirror in x, rotate (degrees), translate."""
    sx = s if sx is None else sx
    sy = s if sy is None else sy
    a = math.radians(angle)
    out = []
    for px, py in pts:
        if flip:
            px = -px
        px, py = px * sx, py * sy
        if a:
            px, py = rot((px, py), a)
        out.append((px + x, py + y))
    return out

def lerp(a, b, t):
    return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)

def dist(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])

def bbox(polys):
    xs = [p[0] for poly in polys for p in poly]
    ys = [p[1] for poly in polys for p in poly]
    return min(xs), min(ys), max(xs), max(ys)

def point_in_polys(pt, polys):
    """even-odd rule across a list of polygons (so holes just work)."""
    x, y = pt
    inside = False
    for poly in polys:
        n = len(poly)
        j = n - 1
        for i in range(n):
            xi, yi = poly[i]
            xj, yj = poly[j]
            if (yi > y) != (yj > y):
                xint = (xj - xi) * (y - yi) / (yj - yi) + xi
                if x < xint:
                    inside = not inside
            j = i
    return inside

def circle(cx, cy, r, n=48, a0=0.0):
    return [(cx + r * math.cos(a0 + 2 * math.pi * i / n), cy + r * math.sin(a0 + 2 * math.pi * i / n)) for i in range(n)]

def ellipse(cx, cy, rx, ry, n=48, angle=0.0):
    pts = [(rx * math.cos(2 * math.pi * i / n), ry * math.sin(2 * math.pi * i / n)) for i in range(n)]
    return place(pts, cx, cy, 1, angle)

def rect(x, y, w, h):
    return [(x, y), (x + w, y), (x + w, y + h), (x, y + h)]

def arc_pts(cx, cy, r, a0, a1, n=24):
    """arc polyline, angles in degrees, y-down screen convention."""
    a0, a1 = math.radians(a0), math.radians(a1)
    return [(cx + r * math.cos(a0 + (a1 - a0) * i / n), cy + r * math.sin(a0 + (a1 - a0) * i / n)) for i in range(n + 1)]

def catmull_rom(pts, closed=False, tension=0.5):
    """Return cubic bezier control points [(p0,c1,c2,p3), ...] through pts."""
    n = len(pts)
    if n < 2:
        return []
    segs = []
    P = list(pts)
    if closed:
        P = [pts[-1]] + pts + [pts[0], pts[1]]
    else:
        P = [pts[0]] + pts + [pts[-1]]
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        c1 = (p1[0] + (p2[0] - p0[0]) * tension / 3, p1[1] + (p2[1] - p0[1]) * tension / 3)
        c2 = (p2[0] - (p3[0] - p1[0]) * tension / 3, p2[1] - (p3[1] - p1[1]) * tension / 3)
        segs.append((p1, c1, c2, p2))
    return segs

def bez_pt(p0, c1, c2, p3, t):
    mt = 1 - t
    return (mt ** 3 * p0[0] + 3 * mt * mt * t * c1[0] + 3 * mt * t * t * c2[0] + t ** 3 * p3[0],
            mt ** 3 * p0[1] + 3 * mt * mt * t * c1[1] + 3 * mt * t * t * c2[1] + t ** 3 * p3[1])

def smooth(pts, closed=False, tension=0.5, n=6):
    """Flatten a smoothed (Catmull-Rom) polyline back to a denser polygon/polyline."""
    segs = catmull_rom(pts, closed, tension)
    out = []
    for (p0, c1, c2, p3) in segs:
        for k in range(n):
            out.append(bez_pt(p0, c1, c2, p3, k / n))
    if not closed:
        out.append(pts[-1])
    return out

def f(v):
    """compact number formatting"""
    if abs(v - round(v)) < 0.05:
        return str(int(round(v)))
    return ("%.1f" % v).rstrip("0").rstrip(".")

def path_d(pts, closed=True, smooth_curve=False, tension=0.5):
    """SVG path data for polygon / polyline; if smooth_curve, emits cubic beziers through the points."""
    if not pts:
        return ""
    if smooth_curve:
        segs = catmull_rom(pts, closed, tension)
        d = "M%s %s" % (f(pts[0][0]), f(pts[0][1]))
        for (p0, c1, c2, p3) in segs:
            d += "C%s %s %s %s %s %s" % (f(c1[0]), f(c1[1]), f(c2[0]), f(c2[1]), f(p3[0]), f(p3[1]))
        if closed:
            d += "Z"
        return d
    d = "M%s %s" % (f(pts[0][0]), f(pts[0][1]))
    px, py = pts[0]
    for (x, y) in pts[1:]:
        dx, dy = x - px, y - py
        if abs(dy) < 0.05:
            d += "h%s" % f(dx)
        elif abs(dx) < 0.05:
            d += "v%s" % f(dy)
        else:
            d += "l%s %s" % (f(dx), f(dy))
        px, py = x, y
    if closed:
        d += "Z"
    return d

def offset_polyline(pts, widths):
    """Build a filled ribbon polygon around a polyline with per-point half-widths (list or scalar)."""
    n = len(pts)
    if isinstance(widths, (int, float)):
        widths = [widths] * n
    elif len(widths) != n:
        # treat widths as keyframes spread evenly along the polyline
        kf = list(widths)
        widths = []
        for i in range(n):
            t = i / max(1, n - 1) * (len(kf) - 1)
            k = min(int(t), len(kf) - 2)
            widths.append(kf[k] + (kf[k + 1] - kf[k]) * (t - k))
    left, right = [], []
    for i in range(n):
        if i == 0:
            dx, dy = pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]
        elif i == n - 1:
            dx, dy = pts[-1][0] - pts[-2][0], pts[-1][1] - pts[-2][1]
        else:
            dx, dy = pts[i + 1][0] - pts[i - 1][0], pts[i + 1][1] - pts[i - 1][1]
        L = math.hypot(dx, dy) or 1
        nx, ny = -dy / L, dx / L
        w = widths[i]
        left.append((pts[i][0] + nx * w, pts[i][1] + ny * w))
        right.append((pts[i][0] - nx * w, pts[i][1] - ny * w))
    return left + right[::-1]

def taper(p0, p1, w, ends=(0.0, 0.0), k=0.18):
    """Burin stroke: a lens-ish polygon along p0->p1, max half-width w, tapering to ends[] at each end."""
    n = 5
    pts = [lerp(p0, p1, i / (n - 1)) for i in range(n)]
    ws = []
    for i in range(n):
        t = i / (n - 1)
        # trapezoid profile
        if t < k:
            ws.append(ends[0] + (w - ends[0]) * (t / k))
        elif t > 1 - k:
            ws.append(ends[1] + (w - ends[1]) * ((1 - t) / k))
        else:
            ws.append(w)
    return offset_polyline(pts, ws)

# ---------------------------------------------------------------- clipping

def _spans(y, polys_r):
    xs = []
    for poly in polys_r:
        n = len(poly)
        j = n - 1
        for i in range(n):
            xi, yi = poly[i]
            xj, yj = poly[j]
            if (yi > y) != (yj > y):
                xs.append((xj - xi) * (y - yi) / (yj - yi) + xi)
            j = i
    xs.sort()
    return [(xs[k], xs[k + 1]) for k in range(0, len(xs) - 1, 2)]

def _subtract(spans, cuts):
    if not cuts:
        return spans
    out = []
    for (a, b) in spans:
        cur = [(a, b)]
        for (c, d) in cuts:
            nxt = []
            for (p, q) in cur:
                if d <= p or c >= q:
                    nxt.append((p, q))
                else:
                    if c > p:
                        nxt.append((p, c))
                    if d < q:
                        nxt.append((d, q))
            cur = nxt
        out.extend(cur)
    return out

def _clip_scanline(y, x0, x1, polys_r, holes_r=()):
    """Intersect horizontal line y from x0..x1 with polys (even-odd), minus holes -> list of (xa, xb) spans."""
    spans = _spans(y, polys_r)
    if holes_r:
        spans = _subtract(spans, _spans(y, holes_r))
    out = []
    for (a, b) in spans:
        a, b = max(a, x0), min(b, x1)
        if b > a + 0.3:
            out.append((a, b))
    return out

def inside(pt, polys, holes=()):
    return point_in_polys(pt, polys) and not (holes and point_in_polys(pt, holes))

def clip_polyline(pts, polys, holes=()):
    """Clip a polyline to polys (even-odd) minus holes; returns list of polylines (segments kept where inside)."""
    out = []
    cur = []
    allp = list(polys) + list(holes)
    for i in range(len(pts) - 1):
        a, b = pts[i], pts[i + 1]
        # find crossing params
        ts = [0.0, 1.0]
        for poly in allp:
            n = len(poly)
            j = n - 1
            for k in range(n):
                p, q = poly[k], poly[j]
                j = k
                d1 = (b[0] - a[0], b[1] - a[1])
                d2 = (q[0] - p[0], q[1] - p[1])
                den = d1[0] * d2[1] - d1[1] * d2[0]
                if abs(den) < 1e-9:
                    continue
                t = ((p[0] - a[0]) * d2[1] - (p[1] - a[1]) * d2[0]) / den
                u = ((p[0] - a[0]) * d1[1] - (p[1] - a[1]) * d1[0]) / den
                if 0 <= t <= 1 and 0 <= u <= 1:
                    ts.append(t)
        ts.sort()
        for k in range(len(ts) - 1):
            t0, t1 = ts[k], ts[k + 1]
            if t1 - t0 < 1e-6:
                continue
            mid = lerp(a, b, (t0 + t1) / 2)
            if inside(mid, polys, holes):
                pa, pb = lerp(a, b, t0), lerp(a, b, t1)
                if cur and dist(cur[-1], pa) < 0.01:
                    cur.append(pb)
                else:
                    if len(cur) > 1:
                        out.append(cur)
                    cur = [pa, pb]
            else:
                if len(cur) > 1:
                    out.append(cur)
                cur = []
    if len(cur) > 1:
        out.append(cur)
    return out

# ---------------------------------------------------------------- canvas

class Canvas:
    def __init__(self, w, h, prefix="e", seed=1):
        self.w, self.h = w, h
        self.prefix = prefix
        self.defs = []
        self.body = []
        self.pats = {}
        self.rng = random.Random(seed)

    # --- raw
    def add(self, s):
        self.body.append(s)

    def group(self, inner, **attrs):
        a = " ".join('%s="%s"' % (k.replace("_", "-"), v) for k, v in attrs.items())
        self.body.append("<g %s>%s</g>" % (a, "".join(inner)))

    # --- primitives
    def fill(self, pts, color=INK, smooth_curve=False, closed=True, opacity=None, tension=0.5, extra=""):
        d = path_d(pts, closed, smooth_curve, tension)
        op = ' fill-opacity="%s"' % opacity if opacity is not None else ""
        self.body.append('<path d="%s" fill="%s"%s%s/>' % (d, color, op, extra))

    def fills(self, polys, color=INK, smooth_curve=False):
        """many small separate shapes in one path (nonzero)"""
        d = "".join(path_d(p, True, smooth_curve) for p in polys)
        self.body.append('<path d="%s" fill="%s"/>' % (d, color))

    def fill_multi(self, polys, color=INK, smooth_curve=False, tension=0.5, rule="evenodd"):
        d = "".join(path_d(p, True, smooth_curve, tension) for p in polys)
        self.body.append('<path d="%s" fill="%s" fill-rule="%s"/>' % (d, color, rule))

    def stroke(self, pts, w=1.0, color=INK, closed=False, smooth_curve=False, tension=0.5, cap="round", join="round", dash=None):
        d = path_d(pts, closed, smooth_curve, tension)
        ds = ' stroke-dasharray="%s"' % dash if dash else ""
        self.body.append('<path d="%s" fill="none" stroke="%s" stroke-width="%s" stroke-linecap="%s" stroke-linejoin="%s"%s/>' % (d, color, f(w), cap, join, ds))

    def strokes(self, polylines, w=1.0, color=INK, cap="round", smooth_curve=False, closed=False, dash=None):
        if not polylines:
            return
        d = "".join(path_d(p, closed, smooth_curve) for p in polylines if len(p) > 1)
        ds = ' stroke-dasharray="%s"' % dash if dash else ""
        self.body.append('<path d="%s" fill="none" stroke="%s" stroke-width="%s" stroke-linecap="%s" stroke-linejoin="round"%s/>' % (d, color, f(w), cap, ds))

    def ribbon(self, pts, widths, color=INK):
        """tapered brush stroke along a polyline (widths = half-widths per point or scalar)"""
        self.fill(offset_polyline(pts, widths), color)

    def burin(self, p0, p1, w, ends=(0, 0), color=INK):
        self.fill(taper(p0, p1, w, ends), color)

    def burins(self, segs, w, ends=(0, 0), color=INK):
        d = "".join(path_d(taper(a, b, w, ends), True) for a, b in segs)
        self.body.append('<path d="%s" fill="%s"/>' % (d, color))

    # --- hatching (clipped in python, written compactly in a rotated group)
    def hatch(self, polys, angle=0.0, spacing=4.0, w=0.8, jitter=0.0, color=INK, cap="butt",
              spacing_fn=None, break_fn=None, dash=None, x_jitter=0.0, phase=0.0, holes=(), piece=(8, 22)):
        """
        Parallel lines at `angle` degrees, clipped to polys (even-odd).
        spacing_fn(u) may return spacing as a function of the perpendicular coordinate u (0..1 across bbox).
        break_fn(x, y) -> probability [0,1] that a segment is kept at this point (for fading tones):
           lines are chopped into short pieces and dropped stochastically.
        """
        if not polys:
            return
        a = math.radians(angle)
        # rotate polygons into hatch frame (lines horizontal)
        polys_r = [[rot(p, -a) for p in poly] for poly in polys]
        holes_r = [[rot(p, -a) for p in poly] for poly in holes]
        x0, y0, x1, y1 = bbox(polys_r)
        rng = self.rng
        d = []
        y = y0 + phase
        while y <= y1:
            yy = y + (rng.uniform(-jitter, jitter) if jitter else 0)
            spans = _clip_scanline(yy, x0 - 1, x1 + 1, polys_r, holes_r)
            if break_fn:
                new = []
                for (xa, xb) in spans:
                    x = xa
                    while x < xb:
                        seg = min(xb - x, rng.uniform(*piece))
                        mx, my = rot(((x + x + seg) / 2, yy), a)
                        if rng.random() < break_fn(mx, my):
                            if new and abs(new[-1][1] - x) < 0.01:
                                new[-1] = (new[-1][0], x + seg)
                            else:
                                new.append((x, x + seg))
                        x += seg
                spans = new
            prev_end = None
            for (xa, xb) in spans:
                if x_jitter:
                    xa += rng.uniform(-x_jitter, x_jitter)
                    xb += rng.uniform(-x_jitter, x_jitter)
                if prev_end is None:
                    d.append("M%s %sH%s" % (f(xa), f(yy), f(xb)))
                else:
                    d.append("m%s 0h%s" % (f(xa - prev_end), f(xb - xa)))
                prev_end = xb
            if spacing_fn:
                u = (y - y0) / max(1e-6, (y1 - y0))
                y += max(0.8, spacing_fn(u))
            else:
                y += spacing
        if not d:
            return
        ds = ' stroke-dasharray="%s"' % dash if dash else ""
        self.body.append('<g transform="rotate(%s)"><path d="%s" fill="none" stroke="%s" stroke-width="%s" stroke-linecap="%s"%s/></g>'
                         % (f(angle), "".join(d), color, f(w), cap, ds))

    def hatch_lines(self, polys, lines, w=0.8, color=INK, cap="round", smooth_curve=False, holes=()):
        """Clip arbitrary polylines (contour hatching, waves, arcs) to polys and stroke them as one path."""
        out = []
        for ln in lines:
            out.extend(clip_polyline(ln, polys, holes))
        self.strokes(out, w, color, cap, smooth_curve)

    def stipple(self, polys, n=400, size=1.0, color=INK, density_fn=None, tries_factor=6, holes=()):
        """Random dots inside polys. density_fn(x,y)->[0,1] thins the dots."""
        x0, y0, x1, y1 = bbox(polys)
        rng = self.rng
        d = []
        got, tries = 0, 0
        while got < n and tries < n * tries_factor:
            tries += 1
            x, y = rng.uniform(x0, x1), rng.uniform(y0, y1)
            if not inside((x, y), polys, holes):
                continue
            if density_fn and rng.random() > density_fn(x, y):
                continue
            d.append("M%d %dh.1" % (round(x), round(y)))
            got += 1
        if d:
            self.body.append('<path d="%s" stroke="%s" stroke-width="%s" stroke-linecap="round" fill="none"/>' % ("".join(d), color, f(size)))

    # --- cheap pattern tones for large areas
    def pattern(self, angle=45, spacing=5, w=0.7, color=INK):
        key = (round(angle, 1), round(spacing, 2), round(w, 2), color)
        if key in self.pats:
            return self.pats[key]
        pid = "%s-p%d" % (self.prefix, len(self.pats))
        self.pats[key] = pid
        s = spacing
        self.defs.append('<pattern id="%s" patternUnits="userSpaceOnUse" width="%s" height="%s" patternTransform="rotate(%s)">'
                         '<path d="M0 %sH%s" stroke="%s" stroke-width="%s"/></pattern>' % (pid, f(s), f(s), f(angle), f(s / 2), f(s), color, f(w)))
        return pid

    def tone(self, pts, angle=45, spacing=5, w=0.7, color=INK, smooth_curve=False, tension=0.5, polys=None):
        pid = self.pattern(angle, spacing, w, color)
        if polys is not None:
            d = "".join(path_d(p, True, smooth_curve, tension) for p in polys)
            self.body.append('<path d="%s" fill="url(#%s)" fill-rule="evenodd"/>' % (d, pid))
        else:
            self.body.append('<path d="%s" fill="url(#%s)"/>' % (path_d(pts, True, smooth_curve, tension), pid))

    # --- output
    def report(self, top=8):
        sizes = sorted(((len(b), i, b[:60]) for i, b in enumerate(self.body)), reverse=True)[:top]
        for n, i, head in sizes:
            print("  %6d  #%d  %s" % (n, i, head.replace("\n", " ")))

    def svg(self, extra_attrs=""):
        defs = "<defs>%s</defs>" % "".join(self.defs) if self.defs else ""
        return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %s %s" %s>%s%s</svg>'
                % (f(self.w), f(self.h), extra_attrs, defs, "".join(self.body)))

    def save(self, path, extra_attrs=""):
        s = self.svg(extra_attrs)
        with open(path, "w") as fh:
            fh.write(s)
        return len(s)

# ---------------------------------------------------------------- motifs shared between plates

def dead_tree(cv, x, y, h, seed=3, lean=0.0, spread=1.0, depth=5, hatched=True, color=INK):
    """A bare tree, drawn as tapered ribbons. (x,y) is the base of the trunk, h its rough height."""
    rng = random.Random(seed)
    def branch(p, ang, length, w, d):
        # slightly crooked polyline
        pts = [p]
        a = ang
        cur = p
        n = 4
        for i in range(n):
            a += rng.uniform(-0.18, 0.18)
            step = length / n
            cur = (cur[0] + math.cos(a) * step, cur[1] + math.sin(a) * step)
            pts.append(cur)
        ws = [w * (1 - 0.55 * i / n) for i in range(n + 1)]
        cv.ribbon(pts, ws, color)
        if d < depth and length > 6:
            k = 2 if rng.random() < 0.8 else 3
            for j in range(k):
                na = a + rng.uniform(-0.9, 0.9) * spread + (0.25 if j == 0 else -0.25)
                branch(cur, na, length * rng.uniform(0.5, 0.75), ws[-1] * 0.9, d + 1)
            # a broken stub now and then
            if rng.random() < 0.3:
                sa = a + rng.uniform(-1.4, 1.4)
                branch(cur, sa, length * 0.25, ws[-1] * 0.7, depth)
    # trunk
    trunk = [(x, y), (x + lean * 0.15 * h, y - 0.32 * h), (x + lean * 0.35 * h, y - 0.5 * h)]
    trunk = smooth(trunk, n=4)
    cv.ribbon(trunk, [h * 0.055, h * 0.04, h * 0.03], color)
    top = trunk[-1]
    base_ang = -math.pi / 2 + lean * 0.5
    branch(top, base_ang - 0.55 * spread, h * 0.36, h * 0.028, 1)
    branch(top, base_ang + 0.35 * spread, h * 0.42, h * 0.03, 1)
    branch(top, base_ang + 0.0, h * 0.3, h * 0.022, 1)
    # roots
    for k, (dx, dy) in enumerate([(-0.09, 0.02), (0.08, 0.025), (-0.03, 0.03), (0.04, 0.03)]):
        r = [(x, y - h * 0.02), (x + dx * h * 0.6, y + dy * h * 0.4), (x + dx * h, y + dy * h)]
        cv.ribbon(smooth(r, n=3), [h * 0.03, h * 0.015, h * 0.004], color)
    return top

def sun(cv, cx, cy, r, rays=24, ray_len=None, ray_w=None, hatched=True, color=INK, seed=5, rays_from=0, rays_to=360, ring=True, holes=()):
    """A beating sun: concentric contour rings inside, burin rays outside. holes: things in front of it."""
    rng = random.Random(seed)
    big = [circle(cx, cy, r * 4 + (ray_len or r), 32)]
    rings_ = []
    if ring:
        rings_.append((circle(cx, cy, r, 64) + [circle(cx, cy, r, 64)[0]], 1.6))
    if hatched:
        rr = r - 4
        while rr > r * 0.35:
            c = circle(cx, cy, rr, 64)
            rings_.append((c + [c[0]], 0.7))
            rr -= 3.2 + (r - rr) * 0.045
    for c, w in rings_:
        if holes:
            cv.hatch_lines(big, [c], w, color, cap="round", holes=list(holes))
        else:
            cv.stroke(c[:-1], w, color, closed=True)
    ray_len = ray_len or r * 0.9
    ray_w = ray_w or r * 0.05
    polys = []
    for i in range(rays):
        a = math.radians(rays_from + (rays_to - rays_from) * (i + 0.5) / rays)
        L = ray_len * (1.0 if i % 2 == 0 else 0.62) * rng.uniform(0.9, 1.1)
        p0 = (cx + math.cos(a) * (r + 5), cy + math.sin(a) * (r + 5))
        p1 = (cx + math.cos(a) * (r + 5 + L), cy + math.sin(a) * (r + 5 + L))
        polys.append(taper(p0, p1, ray_w, ends=(ray_w * 0.9, 0)))
    if holes:
        polys = diff(polys, list(holes))
        cv.fill_multi(polys, color, rule="evenodd")
    else:
        cv.fills(polys, color)

def ruled_sky(cv, poly, y_top, y_bot, holes=(), spacing_top=3.2, spacing_bot=9.0, w=0.7, jitter=0.15, break_fn=None, angle=0):
    """Engraver's sky: horizontal rules, close together high up, opening out toward the horizon."""
    def sp(u):
        return spacing_top + (spacing_bot - spacing_top) * u
    cv.hatch([poly], angle, spacing_fn=sp, w=w, jitter=jitter, break_fn=break_fn, holes=list(holes), piece=(14, 40))

def waves(cv, polys, y0, y1, x0, x1, spacing=6, amp=2.2, wl=60, w=0.7, seed=2, jitter=0.6, broken=0.0, color=INK, holes=()):
    """Water: wavy horizontal lines, broken here and there like light on the river."""
    rng = random.Random(seed)
    lines = []
    y = y0
    while y < y1:
        ph = rng.uniform(0, 6.28)
        a = amp * rng.uniform(0.6, 1.3)
        pts = []
        x = x0
        while x <= x1:
            pts.append((x, y + a * math.sin(x / wl * 2 * math.pi + ph) + rng.uniform(-jitter, jitter) * 0.3))
            x += wl / 8
        if broken:
            # chop into pieces and drop some
            piece = []
            for p in pts:
                piece.append(p)
                if rng.random() < broken and len(piece) > 3:
                    lines.append(piece)
                    piece = [p] if rng.random() < 0.5 else []
            if len(piece) > 1:
                lines.append(piece)
        else:
            lines.append(pts)
        y += spacing * rng.uniform(0.85, 1.15)
    cv.hatch_lines(polys, lines, w, color, holes=holes)

def flame(cx, base_y, h, w, lean=0.0, seed=0, tongues=1):
    """A flame silhouette polygon (smoothed)."""
    rng = random.Random(seed)
    pts = [(cx - w / 2, base_y)]
    pts.append((cx - w * 0.55, base_y - h * 0.25))
    pts.append((cx - w * 0.35 + lean * h * 0.15, base_y - h * 0.55))
    pts.append((cx - w * 0.1 + lean * h * 0.4, base_y - h * 0.8))
    pts.append((cx + lean * h * 0.55 + rng.uniform(-w * 0.1, w * 0.1), base_y - h))
    pts.append((cx + w * 0.2 + lean * h * 0.35, base_y - h * 0.72))
    pts.append((cx + w * 0.45 + lean * h * 0.12, base_y - h * 0.45))
    pts.append((cx + w * 0.5, base_y - h * 0.18))
    return smooth(pts, closed=True, n=5)

# ---------------------------------------------------------------- type (outlined, no font dependency)

_FONTS = {}

def _font(path, wght=None):
    from fontTools.ttLib import TTFont
    key = (path, wght)
    if key in _FONTS:
        return _FONTS[key]
    font = TTFont(path)
    if wght is not None and "fvar" in font:
        from fontTools.varLib import instancer
        font = instancer.instantiateVariableFont(font, {"wght": wght})
    _FONTS[key] = font
    return font

def glyph_polys(path, text, size, x, y, wght=None, tracking=0.0, curve_steps=8, features_smcp=False):
    """
    Outline `text` at baseline (x,y) in font `path` at `size` (em height in user units).
    Returns (list of polygons in user space, advance width).  Curves are flattened so
    the letters can be hatched and clipped like any other shape.
    """
    from fontTools.pens.recordingPen import RecordingPen
    font = _font(path, wght)
    cmap = font.getBestCmap()
    gs = font.getGlyphSet()
    upem = font["head"].unitsPerEm
    sc = size / upem
    polys = []
    cx = x
    for ch in text:
        gname = cmap.get(ord(ch))
        if gname is None:
            cx += size * 0.3
            continue
        if features_smcp:
            alt = gname + ".sc"
            if alt in gs:
                gname = alt
        g = gs[gname]
        pen = RecordingPen()
        g.draw(pen)
        cur = []
        last = None
        def tr(p):
            return (cx + p[0] * sc, y - p[1] * sc)
        for op, args in pen.value:
            if op == "moveTo":
                if len(cur) > 2:
                    polys.append(cur)
                cur = [tr(args[0])]
                last = args[0]
            elif op == "lineTo":
                cur.append(tr(args[0]))
                last = args[0]
            elif op == "curveTo":
                c1, c2, p3 = args
                for k in range(1, curve_steps + 1):
                    cur.append(tr(bez_pt(last, c1, c2, p3, k / curve_steps)))
                last = p3
            elif op == "qCurveTo":
                pts = list(args)
                if pts[-1] is None:
                    pts = pts[:-1]
                # implied on-curve points between consecutive off-curve points
                prev = last
                for i in range(len(pts) - 1):
                    c = pts[i]
                    nxt = pts[i + 1]
                    end = nxt if i == len(pts) - 2 else ((c[0] + nxt[0]) / 2, (c[1] + nxt[1]) / 2)
                    for k in range(1, curve_steps + 1):
                        t = k / curve_steps
                        mt = 1 - t
                        px = mt * mt * prev[0] + 2 * mt * t * c[0] + t * t * end[0]
                        py = mt * mt * prev[1] + 2 * mt * t * c[1] + t * t * end[1]
                        cur.append(tr((px, py)))
                    prev = end
                last = prev
            elif op in ("closePath", "endPath"):
                if len(cur) > 2:
                    polys.append(cur)
                cur = []
        if len(cur) > 2:
            polys.append(cur)
        cx += g.width * sc + tracking
    return polys, cx - x

def glyph_path(path, text, size, x, y, wght=None, tracking=0.0, features_smcp=False):
    """Exact bezier outline path data (for crisp lettering), plus advance."""
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen
    font = _font(path, wght)
    cmap = font.getBestCmap()
    gs = font.getGlyphSet()
    upem = font["head"].unitsPerEm
    sc = size / upem
    d = ""
    cx = x
    for ch in text:
        gname = cmap.get(ord(ch))
        if gname is None:
            cx += size * 0.3
            continue
        if features_smcp and gname + ".sc" in gs:
            gname = gname + ".sc"
        g = gs[gname]
        pen = SVGPathPen(gs, ntos=lambda v: f(v))
        tp = TransformPen(pen, (sc, 0, 0, -sc, cx, y))
        g.draw(tp)
        d += pen.getCommands()
        cx += g.width * sc + tracking
    return d, cx - x

# ---------------------------------------------------------------- more helpers

def whiteline(cv, mass, ribbons, color=INK):
    """White-line engraving: a solid mass with thin ribbons cut out of it (evenodd holes).
    ribbons: list of polygons that lie inside the mass."""
    cv.fill_multi([mass] + list(ribbons), color, rule="evenodd")

def gnarled_tree(cv, x, y, h, seed=3, lean=0.0, spread=1.0, depth=6, color=INK, grain=True, base_w=None):
    """A dead, wind-bent tree. Trunk drawn in dense contour hatching (wood-engraving grain),
    branches as tapered ribbons. Returns list of branch tip points."""
    rng = random.Random(seed)
    tips = []
    base_w = base_w or h * 0.06
    # trunk centreline
    t_pts = [(x, y), (x + lean * 0.05 * h, y - 0.18 * h), (x + lean * 0.16 * h, y - 0.36 * h), (x + lean * 0.3 * h, y - 0.52 * h)]
    t_pts = smooth(t_pts, n=6)
    ws = [base_w, base_w * 0.85, base_w * 0.7, base_w * 0.55]
    trunk = offset_polyline(t_pts, ws)
    if grain:
        # near-solid contour hatching following the trunk
        lines = []
        k = -base_w * 1.1
        while k < base_w * 1.1:
            lines.append([(px + k, py) for (px, py) in t_pts])
            k += 1.9 if k < base_w * 0.15 else 2.6  # a shade lighter on the lit (right) side
        cv.hatch_lines([trunk], lines, 1.1, color, cap="butt")
        cv.stroke(trunk, 1.2, color, closed=True)
    else:
        cv.fill(trunk, color)
    top = t_pts[-1]
    def branch(p, ang, length, w, d):
        pts = [p]
        a = ang
        cur = p
        n = 4
        for i in range(n):
            a += rng.uniform(-0.22, 0.22) + (0.05 if a < -math.pi / 2 else -0.05) * 0  # slight sag
            step = length / n
            cur = (cur[0] + math.cos(a) * step, cur[1] + math.sin(a) * step)
            pts.append(cur)
        wend = w * (0.55 if d < depth else 0.2)
        cv.ribbon(pts, [w, wend], color)
        if d >= depth or length < 7 or w < 0.7:
            tips.append(cur)
            return
        k = 2 if rng.random() < 0.7 else 3
        for j in range(k):
            na = a + (rng.uniform(0.25, 0.85) if j == 0 else rng.uniform(-0.85, -0.25)) * spread
            if j == 2:
                na = a + rng.uniform(-0.2, 0.2)
            branch(cur, na, length * rng.uniform(0.55, 0.8), wend * rng.uniform(0.75, 0.95), d + 1)
        if rng.random() < 0.35:
            # a snapped stub
            sa = a + rng.uniform(-1.6, 1.6)
            branch(cur, sa, length * 0.22, wend * 0.6, depth)
    base_ang = -math.pi / 2 + lean * 0.6
    branch(top, base_ang - 0.7 * spread, h * 0.34, base_w * 0.5, 1)
    branch(top, base_ang + 0.45 * spread, h * 0.4, base_w * 0.55, 1)
    branch(top, base_ang - 0.1, h * 0.3, base_w * 0.4, 1)
    # a low bough off the trunk
    mid = t_pts[len(t_pts) // 2]
    branch(mid, base_ang - 1.3 * spread, h * 0.22, base_w * 0.35, 2)
    # roots
    for (dx, dy) in [(-0.12, 0.012), (0.1, 0.02), (-0.05, 0.03), (0.04, 0.03)]:
        r = [(x, y - h * 0.03), (x + dx * h * 0.5, y + dy * h * 0.3), (x + dx * h, y + dy * h)]
        cv.ribbon(smooth(r, n=3), [base_w * 0.42, base_w * 0.18, base_w * 0.03], color)
    return tips

def cracks(cv, polys, n=12, seed=4, w=0.9, color=INK, length=(40, 140), holes=()):
    """Dry earth: a few branching cracks."""
    rng = random.Random(seed)
    x0, y0, x1, y1 = bbox(polys)
    lines = []
    for i in range(n):
        for _ in range(30):
            p = (rng.uniform(x0, x1), rng.uniform(y0, y1))
            if point_in_polys(p, polys):
                break
        a = rng.uniform(0, math.pi)
        L = rng.uniform(*length)
        pts = [p]
        cur = p
        for k in range(6):
            a += rng.uniform(-0.6, 0.6)
            cur = (cur[0] + math.cos(a) * L / 6, cur[1] + math.sin(a) * L / 6 * 0.45)
            pts.append(cur)
        lines.append(pts)
        if rng.random() < 0.6:
            j = rng.randint(1, 4)
            b = a + rng.choice([-1, 1]) * rng.uniform(0.7, 1.4)
            q = pts[j]
            sub = [q]
            for k in range(3):
                b += rng.uniform(-0.5, 0.5)
                q = (q[0] + math.cos(b) * L / 9, q[1] + math.sin(b) * L / 9 * 0.45)
                sub.append(q)
            lines.append(sub)
    cv.hatch_lines(polys, lines, w, color, holes=holes)

def pebbles(cv, polys, n=30, seed=5, r=(1.5, 4), color=INK, holes=()):
    rng = random.Random(seed)
    x0, y0, x1, y1 = bbox(polys)
    out = []
    got = 0
    while got < n:
        p = (rng.uniform(x0, x1), rng.uniform(y0, y1))
        if not inside(p, polys, holes):
            continue
        rr = rng.uniform(*r)
        pts = [(p[0] + rr * (1 + 0.3 * math.cos(3 * t)) * math.cos(t) * 1.4, p[1] + rr * 0.6 * (1 + 0.2 * math.sin(2 * t)) * math.sin(t)) for t in [2 * math.pi * i / 10 for i in range(10)]]
        cv.stroke(pts, 0.7, color, closed=True)
        # shadow flick
        cv.stroke([(p[0] - rr * 1.2, p[1] + rr * 0.7), (p[0] + rr * 1.0, p[1] + rr * 0.75)], 0.9, color)
        got += 1

def figure_walking(x, y, h, step=0.5, hat=True, coat=True, facing=1):
    """Silhouette polygon of a 1922 figure walking, seen from the side. (x,y)=feet, h=height. facing=1 right."""
    u = h / 100.0
    pts = []
    # build the right-facing figure then mirror if needed
    P = [(-8, -100 + 6), (-6, -100), (6, -100), (10, -94), (16, -92), (12, -90),   # hat crown & brim
         (10, -84), (12, -80), (11, -74), (14, -70),                               # face
         (18, -66), (20, -55), (20, -40), (17, -30), (14, -8), (18, -2), (17, 0),  # front of coat/leg
         (8, 0), (7, -6), (4, -22), (2, -36),                                      # front leg back edge
         (-4, -10 * step - 20), (-12, -4 * step - 4), (-14, 0), (-22, 0), (-20, -6), (-14, -20), (-12, -34),  # back leg
         (-14, -50), (-16, -66), (-12, -76), (-10, -86), (-14, -90), (-12, -92)]
    for (px, py) in P:
        pts.append((x + px * u * facing, y + py * u))
    return pts

def bird(x, y, s=1.0, spread=1.0, flip=False):
    """a gull / crow in flight, as a thin ribbon-ish polygon"""
    pts = [(-16, -2), (-9, -6), (-3, -3), (0, 0), (3, -3), (9, -6), (16, -2), (10, -1), (4, 2), (0, 4), (-4, 2), (-10, -1)]
    return place([(px * spread, py) for px, py in pts], x, y, s, flip=flip)


def leaf(base, tip, width, bulge=0.5, n=8, curve=0.0):
    """A pointed leaf polygon from base to tip. width = full width at the widest; bulge = where along (0..1) it is widest;
    curve bends the midrib sideways."""
    L = dist(base, tip) or 1
    ux, uy = (tip[0] - base[0]) / L, (tip[1] - base[1]) / L
    nx, ny = -uy, ux
    left, right = [], []
    for i in range(n + 1):
        t = i / n
        # midrib with a bend
        bend = curve * L * math.sin(t * math.pi)
        mx, my = base[0] + ux * L * t + nx * bend, base[1] + uy * L * t + ny * bend
        # width profile: rises fast, tapers to a point
        if t < bulge:
            w = width / 2 * math.sin((t / bulge) * math.pi / 2)
        else:
            w = width / 2 * math.cos(((t - bulge) / (1 - bulge)) * math.pi / 2) ** 0.8
        left.append((mx + nx * w, my + ny * w))
        right.append((mx - nx * w, my - ny * w))
    return left + right[::-1]


def flame2(cx, base_y, h, w, lean=0.0, seed=0):
    """A flame with a swelling body and a whipped tip: returns a list of polygons (main tongue + a side lick)."""
    rng = random.Random(seed)
    j = lambda a: rng.uniform(-a, a)
    main = smooth([(cx - w * 0.5, base_y), (cx - w * 0.62, base_y - h * 0.22), (cx - w * 0.42 + lean * h * 0.1, base_y - h * 0.5),
                   (cx - w * 0.12 + lean * h * 0.3, base_y - h * 0.78), (cx + lean * h * 0.5 + j(w * 0.1), base_y - h),
                   (cx + w * 0.14 + lean * h * 0.3, base_y - h * 0.74), (cx + w * 0.42 + lean * h * 0.1, base_y - h * 0.48),
                   (cx + w * 0.6, base_y - h * 0.2), (cx + w * 0.5, base_y)], closed=True, n=4)
    side = rng.choice([-1, 1])
    lick = smooth([(cx + side * w * 0.35, base_y - h * 0.1), (cx + side * w * 0.7, base_y - h * 0.3), (cx + side * w * 0.6 + lean * h * 0.1, base_y - h * 0.55),
                   (cx + side * w * 0.3, base_y - h * 0.4), (cx + side * w * 0.2, base_y - h * 0.15)], closed=True, n=3)
    return [main, lick]

# ---------------------------------------------------------------- booleans (shapely)

def _shp(polys):
    from shapely.geometry import Polygon, MultiPolygon
    from shapely.ops import unary_union
    if polys and isinstance(polys[0], tuple):
        polys = [polys]
    geoms = []
    for p in polys:
        if len(p) >= 3:
            g = Polygon(p)
            if not g.is_valid:
                g = g.buffer(0)
            geoms.append(g)
    return unary_union(geoms) if geoms else Polygon()

def rings(geom):
    """shapely geometry -> list of rings (exteriors and holes) usable with even-odd clipping / fill_multi."""
    out = []
    if geom.is_empty:
        return out
    gs = list(geom.geoms) if hasattr(geom, "geoms") else [geom]
    for g in gs:
        if g.geom_type != "Polygon" or g.is_empty:
            continue
        out.append([(x, y) for x, y in g.exterior.coords][:-1])
        for hole in g.interiors:
            out.append([(x, y) for x, y in hole.coords][:-1])
    return out

def diff(a, b):
    """polygon(s) a minus polygon(s) b -> rings"""
    return rings(_shp(a).difference(_shp(b)))

def union(*ps):
    return rings(_shp([q for p in ps for q in (p if (p and isinstance(p[0], list)) else [p])]))

def inter(a, b):
    return rings(_shp(a).intersection(_shp(b)))

def grow(a, d):
    return rings(_shp(a).buffer(d, join_style=2))

def puppet(joints, widths, head_r=(12, 15), angle=0.0, x=0, y=0, s=1.0):
    """
    A human figure built from a skeleton. joints: dict with keys head, neck, sh_l, sh_r, hip_l, hip_r,
    el_l, ha_l, el_r, ha_r, kn_l, an_l, kn_r, an_r (local coords, y down, upright).
    Returns dict of polygons (already placed): head, torso, arms, legs, hands, feet and their union.
    """
    J = {k: (v[0], v[1]) for k, v in joints.items()}
    P = lambda pts: place(pts, x, y, s, angle)
    head = P(ellipse(J["head"][0], J["head"][1], head_r[0], head_r[1], 24))
    neck = P(offset_polyline([J["head"], J["neck"]], widths.get("neck", 5)))
    torso = P(smooth([J["sh_l"], J["sh_r"], J["hip_r"], J["hip_l"]], closed=True, n=3, tension=0.3))
    def limb(a, b, c, w1, w2):
        return P(offset_polyline(smooth([a, b, c], n=4), [w1, w2 * 0.95, w2]))
    arm_l = limb(J["sh_l"], J["el_l"], J["ha_l"], widths["arm"], widths["arm"] * 0.75)
    arm_r = limb(J["sh_r"], J["el_r"], J["ha_r"], widths["arm"], widths["arm"] * 0.75)
    leg_l = limb(J["hip_l"], J["kn_l"], J["an_l"], widths["leg"], widths["leg"] * 0.7)
    leg_r = limb(J["hip_r"], J["kn_r"], J["an_r"], widths["leg"], widths["leg"] * 0.7)
    hands = [P(ellipse(J["ha_l"][0], J["ha_l"][1], 5, 7, 12)), P(ellipse(J["ha_r"][0], J["ha_r"][1], 5, 7, 12))]
    feet = [P(ellipse(J["an_l"][0], J["an_l"][1] + 6, 5, 9, 12)), P(ellipse(J["an_r"][0], J["an_r"][1] + 6, 5, 9, 12))]
    parts = dict(head=head, neck=neck, torso=torso, arm_l=arm_l, arm_r=arm_r, leg_l=leg_l, leg_r=leg_r, hands=hands, feet=feet)
    parts["all"] = union([head, neck, torso, arm_l, arm_r, leg_l, leg_r] + hands + feet)
    return parts
