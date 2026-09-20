// LXXVII  The Chair she sat in, like a burnished throne: the lady at her glass, hair spread out in fiery points, the sevenbranched candelabra doubled in the mirror.
const { Card, Path, C, INK, deg, clipTo, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function ladyInTheChair() {
  const c = new Card({ name: 'The Lady in the Chair', numeral: 'LXXVII', seed: 77 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  // ---------- the mirror on the wall, tall, with a carved frame; in it, her face
  const mirrorOuter = S([[150, 70], [196, 74], [212, 100], [214, 200], [206, 236], [94, 236], [86, 200], [88, 100], [104, 74]], 0.3);
  const mirrorInner = S([[150, 84], [188, 88], [200, 108], [202, 196], [196, 224], [104, 224], [98, 196], [100, 108], [112, 88]], 0.3);
  // ---------- the chair: high back like a throne, seen from behind, she sits in it with her back to us
  const chairBack = Path.poly([[102, 256], [198, 256], [198, 420], [102, 420]]);
  const chairTop = Path.poly([[96, 258], [96, 246], [108, 246], [108, 236], [122, 236], [150, 214], [178, 236], [192, 236], [192, 246], [204, 246], [204, 258]]);
  // her head and shoulders above the chair back, hair spread in fiery points
  const head = Path.ellipse(150, 226, 12, 15);
  const shoulders = S([[150, 244], [176, 248], [188, 258], [112, 258], [124, 248]], 0.5);
  const hairMass = S([[150, 208], [162, 212], [166, 228], [164, 244], [150, 248], [136, 244], [134, 228], [138, 212]], 0.5);
  // ---------- the table: in front of the mirror between it and her (we see its top edge above the chair): candelabra either side
  // the candelabrum: seven branches, flames in gold
  const candelabrum = (x, y, s, dir) => {
    c.fill(Path.poly([[x - 2 * s, y], [x + 2 * s, y], [x + 1.4 * s, y - 40 * s], [x - 1.4 * s, y - 40 * s]]));
    c.fill(Path.ellipse(x, y, 10 * s, 3 * s));
    const arms = [[-26, 12], [-17, 6], [-8, 2], [0, 0], [8, 2], [17, 6], [26, 12]];
    for (const [dx, dy] of arms) { const tx = x + dx * s, ty = y - 40 * s + dy * s; if (dx !== 0) c.draw(new Path().M(x, y - 40 * s + 14 * s).C(x + dx * 0.5 * s, y - 40 * s + 16 * s, tx, ty + 12 * s, tx, ty + 2 * s), { sw: 1.4 * s }); c.fill(Path.poly([[tx - 2 * s, ty + 2 * s], [tx + 2 * s, ty + 2 * s], [tx + 1.6 * s, ty - 14 * s], [tx - 1.6 * s, ty - 14 * s]])); const fl = S([[tx, ty - 14 * s], [tx + 3 * s, ty - 19 * s], [tx, ty - 27 * s], [tx - 3 * s, ty - 19 * s]], 0.5); c.fill(fl, C.gold); c.draw(fl, { sw: 0.4 }); }
  };
  // ---------- the room: a wall of hatched darkness round the mirror, the mirror's glass light
  const wall = Path.rect(px0, py0, px1 - px0, 420 - py0);
  const holes = [mirrorOuter, chairBack, chairTop, head, shoulders, hairMass];
  c.hatch(wall, { angle: 90, spacing: 2.0, sw: 0.28, holes, jitter: 0.2 });
  c.hatch(wall, { angle: 0, spacing: 3.2, sw: 0.22, holes, spacingFn: t => 4 - 1.6 * t });
  // the floor: marble, bare with veins
  c.draw(new Path().M(px0, 420).L(px1, 420), { sw: 0.8 });
  for (let i = 0; i < 6; i++) c.draw(Path.smooth([[px0 + i * 46, 424], [px0 + i * 46 + 20 + rnd.range(-8, 8), 442], [px0 + i * 46 + 10, py1 - 2]]), { sw: 0.35 });
  // the mirror frame: carved vines (a wavy double line with leaf lobes), a cupidon peeping at the top
  c.hatch([mirrorOuter.polys()[0], mirrorInner.polys()[0]], { angle: 45, spacing: 1.2, sw: 0.28 });
  c.draw(mirrorOuter, { sw: 1.1 }); c.draw(mirrorInner, { sw: 0.7 });
  const vine = Path.smooth([[92, 110], [98, 130], [90, 150], [98, 170], [90, 190], [96, 210]]); c.draw(vine, { sw: 0.7 }); c.draw(vine.mirrorX(150), { sw: 0.7 });
  for (const y of [122, 158, 198]) for (const s of [-1, 1]) c.fill(Path.ellipse(150 + s * 55, y, 2.6, 4.2, deg(30 * s)));
  const cupid = [Path.circle(150, 76, 6), S([[144, 80], [156, 80], [158, 90], [142, 90]], 0.4), Path.smooth([[142, 84], [132, 74], [128, 84]]), Path.smooth([[158, 84], [168, 74], [172, 84]])];
  c.fill(cupid[0]); c.fill(cupid[1]); c.draw(cupid[2], { sw: 1.4 }); c.draw(cupid[3], { sw: 1.4 });
  // in the glass: her face, and the doubled flames
  const glass = mirrorInner;
  c.hatch(glass, { angle: 80, spacing: 3.4, sw: 0.2, jitter: 0.4 });
  const refFace = S([[150, 128], [165, 133], [171, 150], [169, 170], [160, 184], [150, 188], [140, 184], [131, 170], [129, 150], [135, 133]], 0.55);
  const refHairPts = []; for (let i = 0; i < 26; i++) { const a = deg(190 + i * 6.2); refHairPts.push([150 + 17 * Math.cos(a), 150 + 24 * Math.sin(a)]); }
  // fiery points: hair spread out from the head as sharp spikes
  const spike = (x0, y0, x1, y1, w) => Path.poly([[x0 - w, y0], [x0 + w, y0], [x1, y1]]).rotate(0);
  for (let i = 0; i < 26; i++) { const a = deg(186 + i * 6.5); const r0 = [150 + 17 * Math.cos(a), 152 + 22 * Math.sin(a)]; const L = 22 + 18 * Math.abs(Math.sin(i * 1.9)); const r1 = [150 + (17 + L) * Math.cos(a), 152 + (22 + L * 0.9) * Math.sin(a)]; const nx = -Math.sin(a) * 3.2, ny = Math.cos(a) * 3.2; c.fill(clipToPath(Path.poly([[r0[0] + nx, r0[1] + ny], [r0[0] - nx, r0[1] - ny], r1]), glass)); }
  function clipToPath(p, region) { const pts = p.polys()[0]; const keep = pts.filter(q => require('../lib').inside(q, region.polys())); return keep.length >= 3 ? Path.poly(keep) : Path.poly(pts.map(q => [Math.min(200, Math.max(100, q[0])), Math.max(86, q[1])])); }
  c.fill(S([[150, 128], [166, 134], [172, 152], [166, 150], [150, 146], [134, 150], [128, 152], [134, 134]], 0.45)); // the dark of the hair above the brow
  c.hatch(refFace, { angle: 100, spacing: 2.6, sw: 0.2, spacingFn: t => 1.6 + 2.6 * t }); c.draw(refFace, { sw: 0.85 });
  for (const x of [144, 156]) { c.draw(new Path().M(x - 4.4, 158).C(x - 2.6, 154.6, x + 2.6, 154.6, x + 4.4, 158).C(x + 2.6, 160.8, x - 2.6, 160.8, x - 4.4, 158), { sw: 0.55 }); c.fill(Path.circle(x, 157.8, 2)); }
  c.draw(new Path().M(139, 152).C(142, 149, 146, 149, 149, 151.5).M(151, 151.5).C(154, 149, 158, 149, 161, 152), { sw: 0.6 });
  c.draw(new Path().M(150.5, 159).C(149.5, 164, 149, 167, 148.5, 170).C(150, 171.5, 152, 171.5, 153.5, 170), { sw: 0.45 });
  c.fill(S([[144, 177], [150, 175.2], [156, 177], [150, 180.6]], 0.4)); c.draw(new Path().M(144, 177).C(147, 177.8, 153, 177.8, 156, 177), { sw: 0.45 });
  // the doubled flames in the glass, small, at the sides
  for (const x of [112, 188]) for (let k = 0; k < 3; k++) { const fl = S([[x + k * 6 - 6, 214], [x + k * 6 - 4, 210], [x + k * 6 - 6, 204], [x + k * 6 - 8, 210]], 0.5); c.fill(fl, C.gold); c.draw(fl, { sw: 0.35 }); }
  // ---------- the chair drawn: a tall carved back with a pointed crest, finials in gold, armrests
  const armrests = [Path.poly([[78, 332], [102, 332], [102, 338], [78, 338]]), Path.poly([[198, 332], [222, 332], [222, 338], [198, 338]]), Path.poly([[80, 338], [86, 338], [86, 420], [80, 420]]), Path.poly([[214, 338], [220, 338], [220, 420], [214, 420]])];
  c.hatch(chairBack, { angle: 90, spacing: 1.4, sw: 0.3, holes: [head, shoulders, hairMass], spacingFn: t => 1.1 + 1.6 * Math.abs(Math.sin(t * Math.PI)) });
  c.hatch(chairBack, { angle: 0, spacing: 3.0, sw: 0.22, holes: [head, shoulders, hairMass] });
  c.lines(clipTo(chairBack.pts(), [Path.rect(0, 0, 300, 520).polys()[0]], [hairMass.polys()[0], head.polys()[0], shoulders.polys()[0]]), { sw: 1.1 });
  c.hatch(chairTop, { angle: 45, spacing: 1.1, sw: 0.3, holes: [hairMass, head] }); c.lines(clipTo(chairTop.pts(), [Path.rect(0, 0, 300, 520).polys()[0]], [hairMass.polys()[0], head.polys()[0]]), { sw: 0.9 });
  for (const a of armrests) { c.hatch(a, { angle: 90, spacing: 1.3, sw: 0.3 }); c.draw(a, { sw: 0.8 }); }
  for (const [x, y] of [[102, 240], [198, 240], [150, 208]]) { c.fill(Path.circle(x, y, 4.5), C.gold); c.draw(Path.circle(x, y, 4.5), { sw: 0.7 }); }
  // an inner carved panel on the chair back, doubled lines, a lozenge in the middle below her
  c.draw(Path.rect(112, 268, 76, 140), { sw: 0.6 }); c.draw(Path.rect(118, 274, 64, 128), { sw: 0.35 });
  c.draw(Path.poly([[150, 316], [172, 340], [150, 364], [128, 340]]), { sw: 0.6 }); c.hatch(Path.poly([[150, 316], [172, 340], [150, 364], [128, 340]]), { angle: -45, spacing: 1.3, sw: 0.28 });
  // her shoulders and the back of her head: hair down her back with its ends in points
  c.hatch(shoulders, { angle: 0, spacing: 1.6, sw: 0.28 }); c.draw(shoulders, { sw: 0.9 });
  const strand = (a, b, w) => { const pts = Path.smooth([a, [(a[0] + b[0]) / 2 + 2, (a[1] + b[1]) / 2], b]).pts(3); const L = [], R = []; for (let i = 0; i < pts.length; i++) { const t = i / (pts.length - 1); const ww = w * Math.sin(Math.PI * t) + 0.1; const p = pts[i], q = pts[Math.min(pts.length - 1, i + 1)], o = pts[Math.max(0, i - 1)]; let nx = -(q[1] - o[1]), ny = q[0] - o[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l; L.push([p[0] + nx * ww, p[1] + ny * ww]); R.push([p[0] - nx * ww, p[1] - ny * ww]); } return Path.poly(L.concat(R.reverse())); };
  c.fillEO([hairMass, strand([140, 214], [132, 252], 0.6), strand([150, 210], [148, 256], 0.5), strand([160, 214], [168, 252], 0.6)]);
  for (let i = 0; i < 22; i++) { const a = deg(190 + i * 7.3); const r0 = [150 + 11 * Math.cos(a), 226 + 14 * Math.sin(a)]; const L = 12 + 14 * Math.abs(Math.sin(i * 1.7)); const r1 = [150 + (11 + L) * Math.cos(a), 226 + (14 + L) * Math.sin(a)]; const nx = -Math.sin(a) * 1.6, ny = Math.cos(a) * 1.6; c.fill(Path.poly([[r0[0] + nx, r0[1] + ny], [r0[0] - nx, r0[1] - ny], r1])); }
  // candelabra on the table either side of the chair, in front of the mirror
  candelabrum(62, 300, 0.9, 1); candelabrum(238, 300, 0.9, -1);
  // vials and cases along the table edge
  for (const [x, h] of [[40, 14], [52, 20], [92, 12], [206, 18], [258, 14], [270, 22]]) { const v = S([[x - 4, 300], [x + 4, 300], [x + 3, 300 - h], [x + 1.5, 300 - h - 5], [x - 1.5, 300 - h - 5], [x - 3, 300 - h]], 0.3); c.hatch(v, { angle: 90, spacing: 1.2, sw: 0.24 }); c.draw(v, { sw: 0.6 }); }
  c.frame();
  return c;
};
