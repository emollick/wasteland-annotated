// Engraving toolkit for the Waste Land tarot. All ink is currentColor; ground is transparent.
'use strict';
const { execFileSync } = require('child_process');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const W = 300, H = 520;
const INK = 'currentColor';
const C = { paper: '#F3EEE3', ink: '#1B1917', violet: '#4A3560', night: '#1A1424', gold: '#A8873A', rust: '#A3442B', river: '#4C6E85' };

// ---------- numbers ----------
const f1 = n => { const s = (Math.round(n * 10) / 10).toString(); return s === '-0' ? '0' : s; };
const f2 = n => { const s = (Math.round(n * 100) / 100).toString(); return s === '-0' ? '0' : s; };

// ---------- seeded random ----------
function rng(seed) {
  let a = seed >>> 0;
  const r = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  r.range = (lo, hi) => lo + (hi - lo) * r();
  r.pick = arr => arr[Math.floor(r() * arr.length)];
  return r;
}

// ---------- geometry ----------
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const rot = (p, ang, c = [0, 0]) => { const s = Math.sin(ang), co = Math.cos(ang), x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * co - y * s, c[1] + x * s + y * co]; };
const deg = d => d * Math.PI / 180;

function cubicPts(p0, p1, p2, p3, n) {
  const out = [];
  for (let i = 1; i <= n; i++) { const t = i / n, u = 1 - t;
    out.push([u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0], u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1]]); }
  return out;
}

// A Path records commands (for SVG d) and flattens to polygons (for hatching/clipping).
class Path {
  constructor() { this.cmds = []; }
  M(x, y) { this.cmds.push(['M', x, y]); return this; }
  L(x, y) { this.cmds.push(['L', x, y]); return this; }
  C(x1, y1, x2, y2, x, y) { this.cmds.push(['C', x1, y1, x2, y2, x, y]); return this; }
  Q(x1, y1, x, y) { this.cmds.push(['Q', x1, y1, x, y]); return this; }
  Z() { this.cmds.push(['Z']); return this; }
  // append another path's commands
  add(p) { this.cmds.push(...p.cmds.map(c => c.slice())); return this; }
  // transform: fn([x,y]) -> [x,y]
  map(fn) { const p = new Path(); for (const c of this.cmds) { const o = [c[0]]; for (let i = 1; i < c.length; i += 2) { const q = fn([c[i], c[i + 1]]); o.push(q[0], q[1]); } p.cmds.push(o); } return p; }
  translate(dx, dy) { return this.map(p => [p[0] + dx, p[1] + dy]); }
  scale(sx, sy = sx, c = [0, 0]) { return this.map(p => [c[0] + (p[0] - c[0]) * sx, c[1] + (p[1] - c[1]) * sy]); }
  rotate(a, c = [0, 0]) { return this.map(p => rot(p, a, c)); }
  mirrorX(cx) { return this.map(p => [2 * cx - p[0], p[1]]); }
  get d() {
    let s = '';
    for (const c of this.cmds) {
      if (c[0] === 'Z') { s += 'Z'; continue; }
      s += c[0] + c.slice(1).map(f2).join(' ');
    }
    return s;
  }
  // flatten to polygons (array of point arrays). Each M starts a new poly. Open subpaths are treated as closed for fill/hatch.
  polys(seg = 6) {
    const out = []; let cur = null, last = null;
    for (const c of this.cmds) {
      if (c[0] === 'M') { cur = [[c[1], c[2]]]; out.push(cur); last = [c[1], c[2]]; }
      else if (c[0] === 'L') { cur.push([c[1], c[2]]); last = [c[1], c[2]]; }
      else if (c[0] === 'C') { const p3 = [c[5], c[6]]; const n = Math.max(3, Math.ceil(dist(last, p3) / seg) + 2); cur.push(...cubicPts(last, [c[1], c[2]], [c[3], c[4]], p3, n)); last = p3; }
      else if (c[0] === 'Q') { const p2 = [c[3], c[4]], c1 = [last[0] + 2/3*(c[1]-last[0]), last[1] + 2/3*(c[2]-last[1])], c2 = [p2[0] + 2/3*(c[1]-p2[0]), p2[1] + 2/3*(c[2]-p2[1])]; const n = Math.max(3, Math.ceil(dist(last, p2) / seg) + 2); cur.push(...cubicPts(last, c1, c2, p2, n)); last = p2; }
      else if (c[0] === 'Z') { /* closed */ }
    }
    return out.filter(p => p.length > 1);
  }
  // the polyline of the first subpath (for open curves)
  pts(seg = 4) { return this.polys(seg)[0] || []; }
  bbox() { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const p of this.polys()) for (const q of p) { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); } return [x0, y0, x1, y1]; }

  static circle(cx, cy, r) { return Path.ellipse(cx, cy, r, r); }
  static ellipse(cx, cy, rx, ry, ang = 0) {
    const k = 0.5523; const p = new Path();
    p.M(cx + rx, cy).C(cx + rx, cy + ry * k, cx + rx * k, cy + ry, cx, cy + ry).C(cx - rx * k, cy + ry, cx - rx, cy + ry * k, cx - rx, cy)
      .C(cx - rx, cy - ry * k, cx - rx * k, cy - ry, cx, cy - ry).C(cx + rx * k, cy - ry, cx + rx, cy - ry * k, cx + rx, cy).Z();
    return ang ? p.rotate(ang, [cx, cy]) : p;
  }
  static rect(x, y, w, h) { return new Path().M(x, y).L(x + w, y).L(x + w, y + h).L(x, y + h).Z(); }
  static poly(pts, closed = true) { const p = new Path(); pts.forEach((q, i) => i ? p.L(q[0], q[1]) : p.M(q[0], q[1])); if (closed) p.Z(); return p; }
  // smooth curve through points (Catmull-Rom -> cubic), tension 0..1 (0.5 default)
  static smooth(pts, { closed = false, tension = 0.5 } = {}) {
    const p = new Path(); const n = pts.length; if (n < 2) return p;
    const P = i => pts[closed ? ((i % n) + n) % n : Math.max(0, Math.min(n - 1, i))];
    p.M(pts[0][0], pts[0][1]);
    const m = closed ? n : n - 1;
    for (let i = 0; i < m; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const t = tension;
      p.C(p1[0] + (p2[0] - p0[0]) * t / 3, p1[1] + (p2[1] - p0[1]) * t / 3, p2[0] - (p3[0] - p1[0]) * t / 3, p2[1] - (p3[1] - p1[1]) * t / 3, p2[0], p2[1]);
    }
    if (closed) p.Z();
    return p;
  }
  // arc as cubic beziers: centre, radius, start/end angle (radians), appended with L or M
  static arc(cx, cy, r, a0, a1, { move = true, ry = r } = {}) {
    const p = new Path(); const n = Math.max(1, Math.ceil(Math.abs(a1 - a0) / (Math.PI / 2)));
    const da = (a1 - a0) / n; const k = 4 / 3 * Math.tan(da / 4);
    let a = a0; const s = [cx + r * Math.cos(a), cy + ry * Math.sin(a)]; move ? p.M(s[0], s[1]) : p.L(s[0], s[1]);
    for (let i = 0; i < n; i++) {
      const b = a + da; const c0 = Math.cos(a), s0 = Math.sin(a), c1 = Math.cos(b), s1 = Math.sin(b);
      p.C(cx + r * (c0 - k * s0), cy + ry * (s0 + k * c0), cx + r * (c1 + k * s1), cy + ry * (s1 - k * c1), cx + r * c1, cy + ry * s1); a = b;
    }
    return p;
  }
}

// point in polygons (even-odd over all polys)
function inside(pt, polys) {
  let c = false; const [x, y] = pt;
  for (const poly of polys) {
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
  }
  return c;
}

// Clip a polyline to the inside of polys (even-odd). Returns array of polylines.
function clipPolyline(pts, polys) {
  const out = []; let cur = [];
  const edges = []; for (const poly of polys) for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) edges.push([poly[j], poly[i]]);
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1]; const ts = [0, 1];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    for (const [p, q] of edges) {
      const ex = q[0] - p[0], ey = q[1] - p[1]; const den = dx * ey - dy * ex; if (Math.abs(den) < 1e-12) continue;
      const t = ((p[0] - a[0]) * ey - (p[1] - a[1]) * ex) / den; const u = ((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / den;
      if (t > 0 && t < 1 && u >= 0 && u < 1) ts.push(t);
    }
    ts.sort((x, y) => x - y);
    for (let k = 0; k < ts.length - 1; k++) {
      const t0 = ts[k], t1 = ts[k + 1]; if (t1 - t0 < 1e-9) continue;
      const mid = lerp(a, b, (t0 + t1) / 2);
      if (inside(mid, polys)) { const s = lerp(a, b, t0), e = lerp(a, b, t1); if (cur.length && dist(cur[cur.length - 1], s) < 1e-6) cur.push(e); else { if (cur.length > 1) out.push(cur); cur = [s, e]; } }
      else { if (cur.length > 1) out.push(cur); cur = []; }
    }
  }
  if (cur.length > 1) out.push(cur);
  return out;
}

// Hatch: parallel lines at angle (degrees) with spacing; polys = region (+ holes) even-odd.
// spacing may be a function of the perpendicular offset in [0,1] across the region (for gradients).
function hatchLines(polys, { angle = 45, spacing = 2, spacingFn = null, phase = 0, jitter = 0, rnd = null, minLen = 0.6, dash = null } = {}) {
  const a = deg(angle); const inv = p => rot(p, -a); const fwd = p => rot(p, a);
  const R = polys.map(poly => poly.map(inv));
  let y0 = 1e9, y1 = -1e9, x0 = 1e9, x1 = -1e9; for (const p of R) for (const q of p) { y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); }
  const segs = []; const r = rnd || rng(7);
  let y = y0 + phase + 0.01;
  while (y < y1) {
    const xs = [];
    for (const poly of R) for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > y) !== (yj > y)) xs.push(xi + (y - yi) / (yj - yi) * (xj - xi));
    }
    xs.sort((p, q) => p - q);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      let xa = xs[k], xb = xs[k + 1]; if (xb - xa < minLen) continue;
      if (dash) { // broken line: random gaps
        let x = xa; while (x < xb) { const len = r.range(dash[0], dash[1]); const e = Math.min(xb, x + len); if (e - x > minLen) segs.push([fwd([x, y]), fwd([e, y])]); x = e + r.range(dash[2], dash[3]); }
      } else segs.push([fwd([xa, y]), fwd([xb, y])]);
    }
    const t = (y - y0) / Math.max(1e-9, y1 - y0);
    const sp = spacingFn ? spacingFn(t) : spacing;
    y += Math.max(0.35, sp + (jitter ? r.range(-jitter, jitter) : 0));
  }
  return segs;
}

function segsToD(segs) {
  let s = '';
  for (const [a, b] of segs) s += `M${f1(a[0])} ${f1(a[1])}l${f1(b[0] - a[0])} ${f1(b[1] - a[1])}`;
  return s;
}
// Ramer-Douglas-Peucker
function simplify(pts, tol = 0.12) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop(); const A = pts[a], B = pts[b]; const dx = B[0] - A[0], dy = B[1] - A[1]; const L = Math.hypot(dx, dy) || 1e-9;
    let imax = -1, dmax = 0;
    for (let i = a + 1; i < b; i++) { const d = Math.abs((pts[i][0] - A[0]) * dy - (pts[i][1] - A[1]) * dx) / L; if (d > dmax) { dmax = d; imax = i; } }
    if (dmax > tol && imax > 0) { keep[imax] = 1; stack.push([a, imax], [imax, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
function polylineD(pts, closed = false) {
  pts = simplify(pts);
  if (!pts.length) return '';
  let s = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) s += `l${f1(pts[i][0] - pts[i - 1][0])} ${f1(pts[i][1] - pts[i - 1][1])}`;
  return s + (closed ? 'Z' : '');
}

// offset a polyline along its normals by d (positive = left of direction)
function offsetPolyline(pts, d) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    out.push([pts[i][0] + nx * d, pts[i][1] + ny * d]);
  }
  return out;
}

// stipple dots in polys; density = dots per unit area (or fn(x,y) -> density)
function stipple(polys, { density = 0.05, densityFn = null, rnd = null } = {}) {
  const r = rnd || rng(11); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const p of polys) for (const q of p) { x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); }
  const area = (x1 - x0) * (y1 - y0); const dmax = densityFn ? Math.max(density, 0.3) : density;
  const n = Math.ceil(area * dmax); const pts = [];
  for (let i = 0; i < n; i++) {
    const x = r.range(x0, x1), y = r.range(y0, y1);
    if (!inside([x, y], polys)) continue;
    if (densityFn && r() * dmax > densityFn(x, y)) continue;
    pts.push([x, y]);
  }
  return pts;
}
function dotsD(pts) { let s = ''; for (const p of pts) s += `M${f1(p[0])} ${f1(p[1])}h.01`; return s; }

// tapered stroke: polygon around a polyline with width w(t) (t in 0..1)
function taper(pts, wFn) {
  const L = [], R = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    const w = wFn(i / (pts.length - 1)) / 2;
    L.push([pts[i][0] + nx * w, pts[i][1] + ny * w]); R.push([pts[i][0] - nx * w, pts[i][1] - ny * w]);
  }
  return Path.poly(L.concat(R.reverse()), true);
}

// ---------- lettering ----------
const FONTS = { ebg400: 'fonts/ebg400.ttf', ebg500: 'fonts/ebg500.ttf', ebg600: 'fonts/ebg600.ttf', ebg400i: 'fonts/ebg400i.ttf', corm300: 'fonts/corm300.ttf', corm400: 'fonts/corm400.ttf' };
const _tcache = new Map();
function textPaths(text, { font = 'ebg500', size = 11, tracking = 1.4, smallcaps = true, scScale = 0.78 } = {}) {
  const key = JSON.stringify([text, font, size, tracking, smallcaps, scScale]);
  if (_tcache.has(key)) return _tcache.get(key);
  const args = [path.join(ROOT, 'textpath.py'), '--font', path.join(ROOT, FONTS[font]), '--size', String(size), '--tracking', String(tracking)];
  if (smallcaps) args.push('--smallcaps', '--sc-scale', String(scScale));
  args.push(text);
  const out = JSON.parse(execFileSync('python3', args, { encoding: 'utf8' }));
  const res = smallcaps ? out : { runs: [{ x: 0, d: out.d }], width: out.width };
  _tcache.set(key, res); return res;
}
// returns svg for text centred at (cx, baseline y)
function textSVG(text, cx, y, opts = {}, fill = INK) {
  const t = textPaths(text, opts); const x0 = cx - t.width / 2;
  return t.runs.map(r => `<path transform="translate(${f2(x0 + r.x)} ${f2(y)})" fill="${fill}" stroke="none" d="${r.d}"/>`).join('');
}

// ---------- the card ----------
class Card {
  constructor({ name = '', numeral = '', accent = null, seed = 1 } = {}) {
    this.name = name; this.numeral = numeral; this.accent = accent; this.rnd = rng(seed);
    this.parts = []; this.defs = []; this.id = 0;
    // picture area
    this.px0 = 16; this.px1 = 284; this.py0 = 44; this.py1 = 466;
  }
  uid(p = 'i') { return p + (++this.id); }
  raw(s) { this.parts.push(s); return this; }
  // draw segments as one path
  seg(segs, { sw = 0.35, cap = 'round', color = INK, op = 1, extra = '' } = {}) {
    if (!segs.length) return this;
    this.parts.push(`<path d="${segsToD(segs)}" stroke="${color}" stroke-width="${f2(sw)}"${cap !== 'round' ? ` stroke-linecap="${cap}"` : ''}${op !== 1 ? ` opacity="${op}"` : ''}${extra}/>`); return this;
  }
  hatch(pathOrPolys, opts = {}) {
    const polys = Array.isArray(pathOrPolys) ? pathOrPolys : pathOrPolys.polys();
    const holes = (opts.holes || []).flatMap(h => Array.isArray(h) ? h : h.polys());
    let segs = hatchLines(polys.concat(holes), Object.assign({ rnd: this.rnd }, opts));
    if (opts.clip) { const cp = (Array.isArray(opts.clip) ? opts.clip : opts.clip.polys()); const out = []; for (const s of segs) for (const pl of clipPolyline(s, cp)) out.push([pl[0], pl[pl.length - 1]]); segs = out; }
    return this.seg(segs, opts);
  }
  cross(pathOrPolys, opts = {}) { // two-direction hatch
    this.hatch(pathOrPolys, opts); return this.hatch(pathOrPolys, Object.assign({}, opts, { angle: (opts.angle || 45) + (opts.cross || 90), phase: (opts.phase || 0) + 0.7 }));
  }
  stipple(pathOrPolys, opts = {}) {
    const polys = Array.isArray(pathOrPolys) ? pathOrPolys : pathOrPolys.polys();
    const holes = (opts.holes || []).flatMap(h => Array.isArray(h) ? h : h.polys());
    const pts = stipple(polys.concat(holes), Object.assign({ rnd: this.rnd }, opts));
    if (!pts.length) return this;
    this.parts.push(`<path d="${dotsD(pts)}" stroke="${opts.color || INK}" stroke-width="${f2(opts.sw || 0.7)}"${opts.op && opts.op !== 1 ? ` opacity="${opts.op}"` : ''}/>`); return this;
  }
  // draw a Path: stroke and/or fill
  draw(p, { sw = 0.8, fill = 'none', stroke = INK, cap = 'round', join = 'round', op = 1, dash = null, extra = '' } = {}) {
    this.parts.push(`<path d="${p.d}"${fill !== 'none' ? ` fill="${fill}"` : ''}${stroke !== INK ? ` stroke="${stroke}"` : ''}${stroke !== 'none' ? ` stroke-width="${f2(sw)}"` : ''}${cap !== 'round' ? ` stroke-linecap="${cap}"` : ''}${join !== 'round' ? ` stroke-linejoin="${join}"` : ''}${op !== 1 ? ` opacity="${op}"` : ''}${dash ? ` stroke-dasharray="${dash}"` : ''}${extra}/>`); return this;
  }
  fill(p, color = INK, extra = {}) { return this.draw(p, Object.assign({ fill: color, stroke: 'none' }, extra)); }
  line(p, sw = 0.8, extra = {}) { return this.draw(p, Object.assign({ sw }, extra)); }
  // polyline(s) as strokes
  lines(polylines, { sw = 0.4, color = INK, op = 1, closed = false } = {}) {
    const d = polylines.map(pl => polylineD(pl, closed)).join('');
    if (!d) return this;
    this.parts.push(`<path d="${d}" stroke="${color}" stroke-width="${f2(sw)}"${op !== 1 ? ` opacity="${op}"` : ''}/>`); return this;
  }
  // contour lines: successive offsets of a base polyline, clipped to polys (+holes)
  contours(basePts, { count = 10, spacing = 2.5, sw = 0.4, clip = null, holes = [], start = 0, color = INK, both = false } = {}) {
    const polys = clip ? (Array.isArray(clip) ? clip : clip.polys()).concat(holes.flatMap(h => Array.isArray(h) ? h : h.polys())) : null;
    const pls = [];
    const ks = []; for (let i = 0; i < count; i++) ks.push(start + i * spacing); if (both) for (let i = 1; i < count; i++) ks.push(start - i * spacing);
    for (const k of ks) { const o = offsetPolyline(basePts, k); if (polys) pls.push(...clipPolyline(o, polys)); else pls.push(o); }
    return this.lines(pls, { sw, color });
  }
  tapered(pts, wFn, color = INK) { return this.fill(taper(pts, wFn), color); }
  text(text, cx, y, opts, fill) { this.parts.push(textSVG(text, cx, y, opts, fill)); return this; }

  // the frame: border band ~10 units in, numeral tab at top, name band at bottom
  frame({ numeralSize = 21 } = {}) {
    const g = [];
    // outer rule and inner rule with a fine hatched band between
    g.push(`<rect x="10" y="10" width="280" height="500" stroke="${INK}" stroke-width="1.1" fill="none"/>`);
    g.push(`<rect x="13.5" y="13.5" width="273" height="493" stroke="${INK}" stroke-width="0.4" fill="none"/>`);
    // band hatch between the two rules: a pattern-filled ring (cheap)
    this.defs.push(`<pattern id="bandhatch" patternUnits="userSpaceOnUse" width="1.6" height="1.6" patternTransform="rotate(45)"><path d="M0 0.8H1.6" stroke="${INK}" stroke-width="0.32"/></pattern>`);
    g.push(`<path d="M10.55 10.55H289.45V509.45H10.55ZM13.3 13.3V506.7H286.7V13.3Z" fill="url(#bandhatch)" stroke="none"/>`);
    // name band rule
    g.push(`<path d="M13.5 ${this.py1}H286.5" stroke="${INK}" stroke-width="0.6"/>`);
    // numeral rule under the top band
    g.push(`<path d="M13.5 ${this.py0}H286.5" stroke="${INK}" stroke-width="0.6"/>`);
    // small corner marks inside the picture: a tiny square at each corner of the inner rule
    for (const [x, y] of [[13.5, 13.5], [286.5, 13.5], [13.5, 506.5], [286.5, 506.5]]) g.push(`<rect x="${x - 1.6}" y="${y - 1.6}" width="3.2" height="3.2" fill="${INK}" stroke="none"/>`);
    if (this.numeral) g.push(textSVG(this.numeral, 150, 35, { font: 'corm300', size: numeralSize, tracking: 1.2, smallcaps: false }));
    if (this.name) g.push(textSVG(this.name, 150, 491.5, { font: 'ebg500', size: 11.2, tracking: 1.5, smallcaps: true, scScale: 0.78 }));
    this.frameSVG = `<g stroke-linecap="round">${g.join('')}</g>`;
    return this;
  }
  svg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${this.name.replace(/"/g, '&quot;')}">` +
      `<title>${this.name}</title>` + (this.defs.length ? `<defs>${this.defs.join('')}</defs>` : '') +
      `<g fill="none" stroke="${INK}" stroke-linecap="round" stroke-linejoin="round">${this.parts.join('')}${this.frameSVG || ''}</g></svg>`;
  }
}

module.exports = { simplify, W, H, INK, C, Path, Card, rng, hatchLines, segsToD, polylineD, offsetPolyline, clipPolyline, inside, stipple, taper, textPaths, textSVG, lerp, rot, deg, dist, f1, f2 };

// ---------- additions: compound fills, voronoi crackle, variable-weight outline, engraver's sun, drapery
Card.prototype.fillEO = function (paths, color = INK, extra = {}) { // even-odd compound fill: paths[0] minus the others (holes/slivers)
  const p = new Path(); for (const q of paths) p.add(q);
  return this.draw(p, Object.assign({ fill: color, stroke: 'none', extra: ' fill-rule="evenodd"' }, extra));
};
// polygon clipped by half-plane (keep side where (p - a)·n <= 0)
function clipHalf(poly, a, n) {
  const out = []; const side = p => (p[0] - a[0]) * n[0] + (p[1] - a[1]) * n[1];
  for (let i = 0; i < poly.length; i++) {
    const P = poly[i], Q = poly[(i + 1) % poly.length]; const sp = side(P), sq = side(Q);
    if (sp <= 0) out.push(P);
    if ((sp < 0 && sq > 0) || (sp > 0 && sq < 0)) { const t = sp / (sp - sq); out.push(lerp(P, Q, t)); }
  }
  return out;
}
function voronoiCells(seeds, bounds) {
  return seeds.map((s, i) => { let cell = bounds.slice();
    for (let j = 0; j < seeds.length; j++) { if (j === i || cell.length < 3) continue; const o = seeds[j]; const m = lerp(s, o, 0.5); const n = [o[0] - s[0], o[1] - s[1]]; cell = clipHalf(cell, m, n); }
    return cell; });
}
function sunRings(cx, cy, r, count = 5, gap = 3) { const out = []; for (let i = 1; i <= count; i++) out.push({ p: Path.circle(cx, cy, r + i * gap), sw: 0.55 - i * 0.07 }); return out; }
// outline with weight varying by the light direction (angle in degrees where light comes from)
Card.prototype.outlineVar = function (path, { min = 0.5, max = 1.4, light = -60, seg = 2.5 } = {}) {
  const L = [Math.cos(deg(light)), Math.sin(deg(light))]; const classes = [[], [], [], []];
  for (const poly of path.polys(seg)) {
    for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; if (i === poly.length - 1 && dist(a, b) > seg * 4) break;
      let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
      const d = (nx * L[0] + ny * L[1]); // 1 = facing light, -1 = away
      const k = Math.min(3, Math.max(0, Math.floor((1 - d) / 2 * 3.999)));
      classes[k].push([a, b]); }
  }
  classes.forEach((segs, k) => { if (segs.length) this.seg(segs, { sw: min + (max - min) * k / 3, cap: 'round' }); });
  return this;
};
// drapery: fold lines with a hatched shadow band on one side (side=+1 right/below of the fold direction)
Card.prototype.drapery = function (region, folds, { side = 1, width = 7, spacing = 1.5, sw = 0.3, foldSw = 0.7, taperEnd = true } = {}) {
  const reg = region.polys();
  for (const f of folds) {
    const pts = Path.smooth(f).pts(3);
    this.lines(clipPolyline(pts, reg), { sw: foldSw });
    const band = taper(pts, t => (taperEnd ? width * (0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, t * 1.15))) : width));
    const shifted = band.map(p => p); // band centred on fold; shift by half width to one side
    const off = offsetPolyline(pts, side * width * 0.5);
    const band2 = taper(off, t => (taperEnd ? width * (0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, t * 1.15))) : width));
    const pls = []; for (let k = 1; k * spacing < width; k++) { const o = offsetPolyline(pts, side * k * spacing); for (const seg of clipPolyline(o, band2.polys().concat(reg))) pls.push(seg); }
    this.lines(pls, { sw });
  }
  return this;
};
Object.assign(module.exports, { clipHalf, voronoiCells, sunRings });

// ---------- union-of-holes clipping (overlapping holes no longer cancel each other)
function clipOutside(pts, holes) {
  if (!holes.length) return [pts];
  const edges = []; for (const poly of holes) for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) edges.push([poly[j], poly[i]]);
  const insideAny = p => { for (const h of holes) if (inside(p, [h])) return true; return false; };
  const out = []; let cur = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1]; const ts = [0, 1]; const dx = b[0] - a[0], dy = b[1] - a[1];
    for (const [p, q] of edges) { const ex = q[0] - p[0], ey = q[1] - p[1]; const den = dx * ey - dy * ex; if (Math.abs(den) < 1e-12) continue; const t = ((p[0] - a[0]) * ey - (p[1] - a[1]) * ex) / den; const u = ((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / den; if (t > 0 && t < 1 && u >= 0 && u < 1) ts.push(t); }
    ts.sort((x, y) => x - y);
    for (let k = 0; k < ts.length - 1; k++) { const t0 = ts[k], t1 = ts[k + 1]; if (t1 - t0 < 1e-9) continue; const mid = lerp(a, b, (t0 + t1) / 2);
      if (!insideAny(mid)) { const s = lerp(a, b, t0), e = lerp(a, b, t1); if (cur.length && dist(cur[cur.length - 1], s) < 1e-6) cur.push(e); else { if (cur.length > 1) out.push(cur); cur = [s, e]; } }
      else { if (cur.length > 1) out.push(cur); cur = []; } }
  }
  if (cur.length > 1) out.push(cur);
  return out;
}
// clip to a region (even-odd) then remove anything inside any hole (union)
function clipTo(pts, region, holes = []) { const r = clipPolyline(pts, region); if (!holes.length) return r; const out = []; for (const pl of r) out.push(...clipOutside(pl, holes)); return out; }
const toPolys = x => x == null ? [] : (Array.isArray(x) ? x.flatMap(e => Array.isArray(e) ? [e] : e.polys()) : x.polys());
// override hatch/contours/stipple to use union holes
Card.prototype.hatch = function (pathOrPolys, opts = {}) {
  const polys = toPolys(pathOrPolys); const holes = toPolys(opts.holes);
  let segs = hatchLines(polys, Object.assign({ rnd: this.rnd }, opts));
  if (opts.clip) { const cp = toPolys(opts.clip); const out = []; for (const s of segs) for (const pl of clipPolyline(s, cp)) out.push([pl[0], pl[pl.length - 1]]); segs = out; }
  if (holes.length) { const out = []; for (const s of segs) for (const pl of clipOutside(s, holes)) out.push([pl[0], pl[pl.length - 1]]); segs = out; }
  return this.seg(segs, opts);
};
Card.prototype.contours = function (basePts, { count = 10, spacing = 2.5, sw = 0.4, clip = null, holes = [], start = 0, color = INK, both = false } = {}) {
  const region = clip ? toPolys(clip) : null; const hp = toPolys(holes);
  const pls = []; const ks = []; for (let i = 0; i < count; i++) ks.push(start + i * spacing); if (both) for (let i = 1; i < count; i++) ks.push(start - i * spacing);
  for (const k of ks) { const o = offsetPolyline(basePts, k); if (region) pls.push(...clipTo(o, region, hp)); else pls.push(...clipOutside(o, hp)); }
  return this.lines(pls, { sw, color });
};
Card.prototype.stipple = function (pathOrPolys, opts = {}) {
  const polys = toPolys(pathOrPolys); const holes = toPolys(opts.holes);
  let pts = stipple(polys, Object.assign({ rnd: this.rnd }, opts));
  if (holes.length) pts = pts.filter(p => !holes.some(h => inside(p, [h])));
  if (!pts.length) return this;
  this.parts.push(`<path d="${dotsD(pts)}" stroke="${opts.color || INK}" stroke-width="${f2(opts.sw || 0.7)}"${opts.op && opts.op !== 1 ? ` opacity="${opts.op}"` : ''}/>`); return this;
};
// a black silhouette figure built from parts (all filled ink) -- used for small crowd figures
Object.assign(module.exports, { clipOutside, clipTo, toPolys });
