// figure helpers: tubes, heads, hands, hats
'use strict';
const { Path, offsetPolyline, lerp, rot, deg, dist } = require('./lib');
// closed rounded shape around a polyline with width function (fraction 0..1 -> width)
function tube(pts, wFn, { capStart = true, capEnd = true, tension = 0.5 } = {}) {
  const L = [], R = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    const w = wFn(i / (pts.length - 1)) / 2;
    L.push([pts[i][0] + nx * w, pts[i][1] + ny * w]); R.push([pts[i][0] - nx * w, pts[i][1] - ny * w]);
  }
  const ring = [];
  ring.push(...L);
  if (capEnd) { const e = pts[pts.length - 1], d = pts[pts.length - 2]; const dx = e[0] - d[0], dy = e[1] - d[1], l = Math.hypot(dx, dy) || 1; const w = wFn(1) / 2; ring.push([e[0] + dx / l * w * 0.9, e[1] + dy / l * w * 0.9]); }
  ring.push(...R.slice().reverse());
  if (capStart) { const e = pts[0], d = pts[1]; const dx = e[0] - d[0], dy = e[1] - d[1], l = Math.hypot(dx, dy) || 1; const w = wFn(0) / 2; ring.push([e[0] + dx / l * w * 0.9, e[1] + dy / l * w * 0.9]); }
  return Path.smooth(ring, { closed: true, tension });
}
// sample a smooth curve through points into a polyline
function curvePts(pts, n = 24, closed = false) { return Path.smooth(pts, { closed }).pts(200 / n); }
// resample polyline to n points by arc length
function resample(pts, n) {
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + dist(pts[i - 1], pts[i]));
  const total = L[L.length - 1]; const out = []; let j = 0;
  for (let k = 0; k < n; k++) { const t = total * k / (n - 1); while (j < L.length - 2 && L[j + 1] < t) j++; const u = (t - L[j]) / Math.max(1e-9, L[j + 1] - L[j]); out.push(lerp(pts[j], pts[j + 1], Math.min(1, u))); }
  return out;
}
module.exports = { tube, curvePts, resample };
