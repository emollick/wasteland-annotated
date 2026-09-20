// CCLXVI  The Thames-daughters: three of them on the river's edge, the barges drifting with the turning tide, red sails wide.
const { Card, Path, C, INK, deg, clipTo, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function thamesDaughters() {
  const c = new Card({ name: 'The Thames-Daughters', numeral: 'CCLXVI', seed: 266 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const horizon = 200;
  // ---------- three women standing in the shallows, long hair down, seen from the front, half submerged at the thigh
  const waterline = 372;
  const daughter = (x, y, s, k) => {
    const M = p => p.scale(s, s).translate(x, y);
    const body = M(S([[0, -150], [16, -146], [22, -126], [24, -96], [28, -60], [30, -20], [28, 0], [-28, 0], [-30, -20], [-28, -60], [-24, -96], [-22, -126], [-16, -146]], 0.45));
    const face = M(S([[0, -196], [11, -192], [15, -178], [13, -162], [6, -152], [0, -150], [-6, -152], [-13, -162], [-15, -178], [-11, -192]], 0.55));
    const hair = M(S([[0, -206], [14, -202], [22, -186], [24, -150], [26, -110], [22, -96], [18, -120], [16, -160], [12, -188], [0, -184], [-12, -188], [-16, -160], [-18, -120], [-22, -96], [-26, -110], [-24, -150], [-22, -186], [-14, -202]], 0.45));
    const neck = M(S([[-6, -154], [6, -154], [8, -142], [-8, -142]], 0.4));
    const armL = M(tube([[-20, -128], [-30, -90], [-24, -56]], t => 11 - 2 * t)); const armR = M(tube([[20, -128], [30, -90], [26, -56]], t => 11 - 2 * t));
    const handL = M(S([[-32, -60], [-20, -58], [-16, -48], [-24, -40], [-34, -44]], 0.5)); const handR = M(S([[20, -58], [32, -60], [36, -46], [26, -40], [18, -48]], 0.5));
    const parts = { body, face, hair, neck, armL, armR, handL, handR };
    return parts;
  };
  const ds = [daughter(72, waterline, 0.78, 0), daughter(150, waterline + 6, 0.9, 1), daughter(228, waterline, 0.78, 2)];
  const allParts = ds.flatMap(d => Object.values(d));
  // ---------- sky: bare, a few lines; the far bank: Greenwich reach, low wharves and cranes; the barges with red sails
  c.hatch(Path.rect(px0, horizon - 40, px1 - px0, 40), { angle: 0, spacing: 3.6, sw: 0.22, dash: [40, 130, 6, 40], holes: allParts });
  const wharf = Path.poly([[px0, horizon], [px0, 186], [50, 186], [50, 176], [74, 176], [74, 190], [120, 190], [120, 180], [140, 180], [140, 192], [px1, 192], [px1, horizon]]);
  c.hatch(wharf, { angle: 90, spacing: 1.3, sw: 0.3, holes: allParts }); c.lines(clipTo(wharf.pts(), [Path.rect(0, 0, 300, 520).polys()[0]], allParts.flatMap(p => p.polys())), { sw: 0.7 });
  for (const [x, h] of [[190, 40], [252, 34]]) { c.draw(new Path().M(x, 192).L(x, 192 - h).L(x + 22, 192 - h - 8), { sw: 1.0 }); c.draw(new Path().M(x, 192 - h + 10).L(x + 18, 192 - h - 4), { sw: 0.5 }); }
  // the river: sweats oil and tar: heavy slow horizontal lines, and long slicks (bare) between
  const river = Path.poly([[px0, horizon], [px1, horizon], [px1, py1], [px0, py1]]);
  c.hatch(river, { angle: 0, spacing: 2.2, sw: 0.3, holes: allParts, spacingFn: t => 2.4 + 2.2 * Math.abs(Math.sin(t * 9)), jitter: 0.2 });
  // slicks: a few dark lens shapes
  for (const [x, y, w] of [[60, 250, 40], [190, 262, 60], [120, 300, 46], [250, 330, 30], [62, 420, 44], [226, 430, 54]]) { const sl = Path.ellipse(x, y, w, 4); c.hatch(sl, { angle: 0, spacing: 0.9, sw: 0.34, holes: allParts }); }
  // barges: two, red sails wide, on the turning tide
  const barge = (x, y, s, dir) => {
    const hull = S([[x - 30 * s, y], [x + 30 * s, y], [x + 26 * s, y + 8 * s], [x - 28 * s, y + 8 * s]], 0.3);
    c.fill(hull); c.draw(new Path().M(x - 4 * s * dir, y).L(x - 4 * s * dir, y - 60 * s), { sw: 1.2 * s });
    const sail = Path.poly([[x - 2 * s * dir, y - 58 * s], [x + 34 * s * dir, y - 44 * s], [x + 30 * s * dir, y - 4 * s], [x - 2 * s * dir, y - 2 * s]]);
    c.fill(sail, C.rust); c.draw(sail, { sw: 0.6 }); c.hatch(sail, { angle: 80, spacing: 3.2 * s, sw: 0.3 });
    const top = Path.poly([[x - 2 * s * dir, y - 58 * s], [x + 12 * s * dir, y - 70 * s], [x + 34 * s * dir, y - 44 * s]]); c.fill(top, C.rust); c.draw(top, { sw: 0.5 });
    c.draw(new Path().M(x - 4 * s * dir, y - 30 * s).L(x + 32 * s * dir, y - 24 * s), { sw: 1.0 * s }); // the heavy spar
  };
  // kept clear of the three heads: the gaps between the daughters are only 35 units wide
  barge(191, 238, 0.48, -1); barge(266, 228, 0.5, 1); barge(110, 216, 0.4, 1);
  // ---------- the daughters drawn: bare bodies to the waist, hair down, faces turned each a different way, hands at their sides in the water
  ds.forEach((d, i) => {
    const light = -120;
    c.hatch(d.body, { angle: 95, spacing: 2.6, sw: 0.22, spacingFn: t => 1.8 + 2.4 * (1 - t), jitter: 0.3 }); c.hatch(S(d.body.polys()[0].slice(0, 8), 0.4), { angle: 85, spacing: 1.3, sw: 0.28, clip: d.body });
    c.outlineVar(d.body, { min: 0.6, max: 1.2, light });
    for (const a of [d.armL, d.armR]) { c.hatch(a, { angle: 60, spacing: 2.0, sw: 0.22 }); c.draw(a, { sw: 0.8 }); }
    for (const h of [d.handL, d.handR]) { c.hatch(h, { angle: 20, spacing: 1.8, sw: 0.22 }); c.draw(h, { sw: 0.7 }); }
    c.hatch(d.neck, { angle: 90, spacing: 1.8, sw: 0.22 }); c.draw(d.neck, { sw: 0.7 });
    c.hatch(d.face, { angle: 100, spacing: 2.6, sw: 0.2, spacingFn: t => 1.6 + 2.6 * t }); c.draw(d.face, { sw: 0.8 });
    const fb = d.face.bbox(); const cx = (fb[0] + fb[2]) / 2, cy = (fb[1] + fb[3]) / 2; const s = (fb[3] - fb[1]) / 46;
    const look = [-2.4, 0, 2.4][i] * s;
    for (const sx of [-1, 1]) { const x = cx + sx * 5.5 * s, y = cy - 1 * s; c.draw(new Path().M(x - 3.6 * s, y).C(x - 2 * s, y - 2.8 * s, x + 2 * s, y - 2.8 * s, x + 3.6 * s, y).C(x + 2 * s, y + 2.2 * s, x - 2 * s, y + 2.2 * s, x - 3.6 * s, y), { sw: 0.5 }); c.fill(Path.circle(x + look, y, 1.6 * s)); }
    c.draw(new Path().M(cx, cy - 0.5 * s).C(cx - 0.8 * s, cy + 4 * s, cx - 1.2 * s, cy + 7 * s, cx - 1.6 * s, cy + 9 * s).C(cx - 0.4 * s, cy + 10 * s, cx + 0.4 * s, cy + 10 * s, cx + 1.6 * s, cy + 9 * s), { sw: 0.4 });
    c.draw(new Path().M(cx - 4 * s, cy + 14 * s).C(cx - 2 * s, cy + 12.8 * s, cx + 2 * s, cy + 12.8 * s, cx + 4 * s, cy + 14 * s), { sw: 0.6 });
    // hair: a dark mass with long paper strands
    const strand = (a, b, w) => { const pts = Path.smooth([a, [(a[0] + b[0]) / 2 + 1.5, (a[1] + b[1]) / 2], b]).pts(3); const L = [], R = []; for (let k = 0; k < pts.length; k++) { const t = k / (pts.length - 1); const ww = w * Math.sin(Math.PI * t) + 0.1; const p = pts[k], q = pts[Math.min(pts.length - 1, k + 1)], o = pts[Math.max(0, k - 1)]; let nx = -(q[1] - o[1]), ny = q[0] - o[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l; L.push([p[0] + nx * ww, p[1] + ny * ww]); R.push([p[0] - nx * ww, p[1] - ny * ww]); } return Path.poly(L.concat(R.reverse())); };
    const hb = d.hair.bbox(); const hx = (hb[0] + hb[2]) / 2;
    c.fillEO([d.hair, strand([hx - 14 * s, hb[1] + 14 * s], [hx - 20 * s, hb[3] - 8 * s], 0.7 * s), strand([hx + 14 * s, hb[1] + 14 * s], [hx + 20 * s, hb[3] - 8 * s], 0.7 * s), strand([hx - 6 * s, hb[1] + 4 * s], [hx - 16 * s, hb[1] + 40 * s], 0.5 * s), strand([hx + 6 * s, hb[1] + 4 * s], [hx + 16 * s, hb[1] + 40 * s], 0.5 * s)]);
  });
  // the water's edge over their thighs: a wavering line and a few ripples
  const wl = []; for (let x = px0; x <= px1; x += 4) wl.push([x, waterline + 2 * Math.sin(x / 9) + 1.2 * Math.sin(x / 3.7)]);
  c.lines([wl], { sw: 1.0 }); c.lines([offsetPolyline(wl, 3)], { sw: 0.4 });
  c.frame();
  return c;
};
