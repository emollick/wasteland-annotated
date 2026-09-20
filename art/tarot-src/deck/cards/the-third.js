// CCCLX  Who is the third who walks always beside you? Two on the white road, seen from behind; a third gliding wrapt in a mantle, hooded; two shadows.
const { Card, Path, C, INK, deg, clipTo, clipPolyline, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function theThird() {
  const c = new Card({ name: 'The Third Who Walks', numeral: 'CCCLX', seed: 360 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const all = [Path.rect(0, 0, 300, 520).polys()[0]];
  const horizon = 150;
  // ---------- the white road: bare paper, rising to a point on the horizon; the plain either side hatched flat
  const vx = 176;
  const road = Path.poly([[px0 + 10, py1], [vx - 3, horizon], [vx + 3, horizon], [px1 - 4, py1]]);
  // ---------- the two walkers, seen from behind, and the third
  // figure parts are declared first so the ground can be hatched around them
  const walker = (x, y, s, cap, stick) => {
    const M = p => p.scale(s, s).translate(x, y);
    const coat = M(S([[-13, -62], [13, -62], [16, -30], [17, 0], [-17, 0], [-16, -30]], 0.35));
    const head = M(S([[0, -84], [8, -80], [9, -70], [5, -62], [-5, -62], [-9, -70], [-8, -80]], 0.5));
    const hat = M(cap ? S([[-9, -82], [9, -82], [9, -88], [0, -92], [-9, -88]], 0.4) : Path.poly([[-12, -80], [12, -80], [11, -83], [7, -83], [6, -94], [-6, -94], [-7, -83], [-11, -83]]));
    const legL = M(tube([[-6, -2], [-7, 14], [-9, 28]], t => 7 - 1.5 * t)); const legR = M(tube([[6, -2], [8, 14], [12, 26]], t => 7 - 1.5 * t));
    const armL = M(tube([[-12, -56], [-16, -34], [-15, -14]], t => 6 - 1.5 * t)); const armR = M(tube([[12, -56], [17, -34], [18, -14]], t => 6 - 1.5 * t));
    const pack = M(S([[-9, -58], [9, -58], [10, -36], [-10, -36]], 0.4));
    return { coat, head, hat, legL, legR, armL, armR, pack, stick, x, y, s, cap };
  };
  const A = walker(126, 336, 0.92, true, true), B = walker(158, 342, 1.0, false, false);
  // the third: a hooded mantle to the right of the two, its hem fading into the road; no feet
  const tx = 208, ty = 344, ts = 1.02;
  const T = p => p.scale(ts, ts).translate(tx, ty);
  const mantle = T(S([[0, -96], [10, -90], [14, -76], [16, -50], [20, -20], [24, 4], [-24, 4], [-20, -20], [-16, -50], [-14, -76], [-10, -90]], 0.4));
  const hood = T(S([[0, -102], [11, -96], [15, -84], [12, -70], [0, -66], [-12, -70], [-15, -84], [-11, -96]], 0.5));
  const figParts = [A.coat, A.head, A.hat, A.legL, A.legR, A.armL, A.armR, A.pack, B.coat, B.head, B.hat, B.legL, B.legR, B.armL, B.armR, mantle, hood];
  // sky: hatched, dense at the top, paling to nothing at the horizon
  c.hatch(Path.rect(px0, py0, px1 - px0, horizon - py0), { angle: 0, spacing: 2.2, sw: 0.24, spacingFn: t => 1.6 + 5 * t * t, holes: figParts, jitter: 0.15 });
  // the plain: flat, ringed by the horizon only; hatch that opens out toward the viewer
  const plainL = Path.poly([[px0, horizon], [vx - 3, horizon], [px0 + 10, py1], [px0, py1]]);
  const plainR = Path.poly([[vx + 3, horizon], [px1, horizon], [px1, py1], [px1 - 4, py1]]);
  for (const pl of [plainL, plainR]) c.hatch(pl, { angle: 0, spacing: 2, sw: 0.26, spacingFn: t => 1.2 + 4.2 * t, holes: figParts, jitter: 0.2 });
  c.draw(new Path().M(px0, horizon).L(px1, horizon), { sw: 0.5 });
  // perspective lines on the road: faint, converging, so the white reads as a road and not a blank
  for (const t of [0.3, 0.5, 0.7]) { const x0 = px0 + 10 + (px1 - 4 - px0 - 10) * t; c.lines(clipTo([[x0, py1], [vx + (t - 0.5) * 4, horizon]], road.polys(), figParts.flatMap(p => p.polys())), { sw: 0.2 }); }
  c.draw(new Path().M(px0 + 10, py1).L(vx - 3, horizon), { sw: 0.7 }); c.draw(new Path().M(px1 - 4, py1).L(vx + 3, horizon), { sw: 0.7 });
  // ---------- two shadows on the road, cast toward the viewer (the light ahead); the third casts none
  const shadow = (w, x, y, s) => { const sh = S([[x - 9 * s, y], [x + 9 * s, y], [x + 16 * s, y + 20 * s], [x + 10 * s, y + 34 * s], [x - 6 * s, y + 34 * s], [x - 14 * s, y + 20 * s]], 0.5); c.hatch(sh, { angle: 0, spacing: 1.3, sw: 0.34, holes: [w.legL, w.legR] }); };
  shadow(A, A.x, A.y + 24 * A.s, A.s); shadow(B, B.x, B.y + 24 * B.s, B.s);
  // ---------- the walkers drawn: black coats with paper seams, hatched heads
  const seam = (a, b, w) => { const pts = Path.smooth([a, [(a[0] + b[0]) / 2 + 0.6, (a[1] + b[1]) / 2], b]).pts(3); const L = [], R = []; for (let k = 0; k < pts.length; k++) { const t = k / (pts.length - 1); const ww = w * Math.sin(Math.PI * t) + 0.08; const p = pts[k], q = pts[Math.min(pts.length - 1, k + 1)], o = pts[Math.max(0, k - 1)]; let nx = -(q[1] - o[1]), ny = q[0] - o[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l; L.push([p[0] + nx * ww, p[1] + ny * ww]); R.push([p[0] - nx * ww, p[1] - ny * ww]); } return Path.poly(L.concat(R.reverse())); };
  const drawWalker = (w) => {
    const { x, y, s } = w;
    c.fillEO([w.coat, seam([x, y - 58 * s], [x, y - 2 * s], 0.6 * s), seam([x - 10 * s, y - 40 * s], [x - 12 * s, y - 4 * s], 0.4 * s), seam([x + 10 * s, y - 40 * s], [x + 12 * s, y - 4 * s], 0.4 * s), seam([x - 12 * s, y - 60 * s], [x + 12 * s, y - 60 * s], 0.4 * s)]);
    for (const l of [w.legL, w.legR]) { c.hatch(l, { angle: 80, spacing: 1.3, sw: 0.3 }); c.draw(l, { sw: 0.7 }); }
    for (const a of [w.armL, w.armR]) { c.fill(a); }
    c.hatch(w.head, { angle: 90, spacing: 1.4, sw: 0.28, spacingFn: t => 1 + 1.4 * t }); c.draw(w.head, { sw: 0.7 });
    c.fill(w.hat);
    if (w.cap) { c.hatch(w.pack, { angle: 30, spacing: 1.5, sw: 0.3 }); c.draw(w.pack, { sw: 0.8 }); c.draw(new Path().M(x - 8 * s, y - 56 * s).L(x + 8 * s, y - 56 * s), { sw: 0.5 }); }
    if (w.stick) c.draw(new Path().M(x - 16 * s, y - 16 * s).L(x - 22 * s, y + 26 * s), { sw: 1.1 });
  };
  drawWalker(A); drawWalker(B);
  // ---------- the third: the mantle hatched, its lines thinning to nothing at the hem so the road shows through; the hood empty
  c.hatch(mantle, { angle: 92, spacing: 1.6, sw: 0.3, spacingFn: t => 1.2 + 4 * t * t, jitter: 0.25 });
  c.drapery(mantle, [[[tx - 6 * ts, ty - 70 * ts], [tx - 10 * ts, ty - 30 * ts], [tx - 12 * ts, ty - 6 * ts]], [[tx + 7 * ts, ty - 72 * ts], [tx + 9 * ts, ty - 30 * ts], [tx + 12 * ts, ty - 4 * ts]]], { side: 1, width: 7, spacing: 1.4, sw: 0.26, foldSw: 0.6 });
  // the outline: full at the shoulders, breaking up toward the hem
  const mp = mantle.polys(2)[0]; const segs = [];
  for (let i = 0; i < mp.length; i++) { const a = mp[i], b = mp[(i + 1) % mp.length]; const t = (a[1] - (ty - 96 * ts)) / (100 * ts); if (t < 0.55 || rnd() > (t - 0.55) * 2.6) segs.push([a, b]); }
  c.seg(segs, { sw: 0.8 });
  c.hatch(hood, { angle: 90, spacing: 1.5, sw: 0.3 }); c.draw(hood, { sw: 0.8 });
  const hoodDark = T(S([[-3, -96], [9, -92], [12, -82], [8, -70], [0, -67], [-4, -72], [-6, -84]], 0.5)); c.hatch(hoodDark, { angle: 30, spacing: 0.9, sw: 0.34 }); c.hatch(hoodDark, { angle: 120, spacing: 1.1, sw: 0.3 });
  c.frame();
  return c;
};
