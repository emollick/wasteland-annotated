// XLIX  Belladonna, the Lady of the Rocks. Seated in a grotto in a black mantle; pale face, widened eyes; a sprig of nightshade.
const { Card, Path, C, INK, deg, clipPolyline, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function belladonna() {
  const c = new Card({ name: 'Belladonna, the Lady of the Rocks', numeral: 'XLIX', seed: 49 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  // ---------- the figure: seated, three-quarter to the left, face to us. One mass: hood + gown, with face and hands as holes.
  const gown = S([
    [152, 118], [166, 122], [176, 134], [180, 152], [178, 172], [172, 186], // hood, right side
    [184, 196], [196, 214], [204, 240], [206, 268], [208, 300], [214, 330], [222, 356], [228, 384], [230, 412], // back and skirt, right
    [206, 420], [176, 426], [146, 428], [116, 424], [88, 416], [76, 404], // hem
    [80, 380], [92, 356], [104, 336], [108, 316], [106, 296], [104, 272], [108, 250], [114, 232], [120, 214], [128, 196], // lap and front
    [124, 176], [122, 154], [128, 134], [140, 122]], 0.45);
  const face = S([[151, 134], [162, 139], [167, 152], [166, 170], [160, 184], [151, 189], [143, 185], [137, 171], [136, 153], [141, 139]], 0.55);
  const neck = S([[143, 186], [159, 186], [160, 198], [142, 198]], 0.4);
  const handR = S([[192, 246], [204, 240], [214, 244], [218, 254], [212, 264], [200, 268], [190, 262], [188, 252]], 0.5); // raised at her right, holds the sprig against the wall
  const handL = S([[94, 332], [110, 326], [122, 330], [126, 342], [118, 352], [102, 354], [90, 346]], 0.5); // resting on the rock ledge
  const bodyShapes = [gown, face, neck, handR, handL];
  // ---------- rocks: the grotto wall behind, boulders around, a ledge she sits on, a pool below
  const wall = Path.poly([[px0, py0], [px1, py0], [px1, 250], [px0, 250]]);
  // wall as vertical strata: long wavering lines, denser to the left, sky showing top-right through an opening
  const opening = S([[176, py0], [px1, py0], [px1, 150], [258, 168], [226, 150], [200, 112], [184, 72]], 0.4);
  const sprigHalo = S([[184, 176], [232, 172], [248, 196], [240, 226], [212, 236], [186, 226], [176, 200]], 0.5);
  const strata = []; for (let x = px0 + 2; x < px1; x += 2.2 + 3.2 * Math.pow((x - px0) / (px1 - px0), 1.5)) { const pl = []; for (let y = py0; y <= 250; y += 5) pl.push([x + 2.5 * Math.sin(y / 23 + x * 0.3) + 1.2 * Math.sin(y / 7 + x), y]); strata.push(...clipPolyline(pl, wall.polys().concat(opening.polys(), sprigHalo.polys(), bodyShapes.flatMap(b => b.polys())))); }
  c.lines(strata, { sw: 0.3 });
  // the wall's edge against the opening: a heavier broken line
  c.lines(clipPolyline(opening.pts(2), [Path.rect(px0, py0 + 1, px1 - px0, 250).polys()[0]]), { sw: 0.8 });
  // fissures in the wall: a few heavy diagonal cracks
  for (const f of [[[px0, 90], [50, 120], [70, 168], [96, 232]], [[100, py0], [112, 100], [130, 128]], [[40, py0], [62, 70], [58, 100]], [[px1, 190], [262, 200], [250, 232], [240, 250]]]) c.lines(clipPolyline(Path.smooth(f).pts(2), wall.polys().concat(bodyShapes.flatMap(b => b.polys()))), { sw: 0.9 });
  // the sea, far off, through the opening
  c.hatch(Path.poly([[230, 132], [px1, 132], [px1, 150], [258, 168], [226, 150]]), { angle: 0, spacing: 2.6, sw: 0.22, clip: opening });
  c.draw(new Path().M(214, 132).L(px1, 132), { sw: 0.5 });
  // boulders: each a rounded mass, contour-hatched over its top, black in the crevice beneath
  const boulders = [
    S([[px0, 250], [40, 236], [86, 244], [112, 262], [116, 290], [90, 302], [50, 306], [px0, 300]], 0.5),
    S([[px0, 300], [50, 306], [90, 302], [104, 322], [98, 350], [70, 364], [34, 366], [px0, 356]], 0.5),
    S([[196, 250], [230, 238], [262, 240], [px1, 252], [px1, 320], [252, 330], [228, 318], [206, 296]], 0.5),
    S([[px1, 320], [252, 330], [246, 356], [258, 388], [px1, 392]], 0.5),
    S([[px0, 356], [34, 366], [70, 364], [92, 378], [82, 404], [56, 420], [px0, 420]], 0.5),
    S([[px0, 420], [56, 420], [82, 404], [120, 420], [150, 428], [176, 426], [206, 420], [230, 412], [258, 400], [px1, 392], [px1, 436], [200, 440], [100, 442], [px0, 440]], 0.4), // the ledge and floor
  ];
  boulders.forEach((b, i) => {
    const bb = b.bbox(); const h = bb[3] - bb[1];
    // upper face: light, lines running with the stone's bedding; lower face: dark, steep hatch
    const upper = Path.poly([[bb[0] - 5, bb[1] - 5], [bb[2] + 5, bb[1] - 5], [bb[2] + 5, bb[1] + h * 0.45], [bb[0] - 5, bb[1] + h * 0.62]]);
    const lower = Path.poly([[bb[0] - 5, bb[1] + h * 0.62], [bb[2] + 5, bb[1] + h * 0.45], [bb[2] + 5, bb[3] + 5], [bb[0] - 5, bb[3] + 5]]);
    c.hatch(upper, { angle: -12 + 8 * (i % 3), spacing: 3.2, sw: 0.26, holes: bodyShapes, clip: b, jitter: 0.5, dash: [12, 60, 2, 10] });
    c.hatch(lower, { angle: 62 - 10 * (i % 2), spacing: 1.5, sw: 0.32, holes: bodyShapes, clip: b, spacingFn: t => 2.2 - 0.9 * t });
    c.hatch(lower, { angle: -30, spacing: 3.0, sw: 0.22, holes: bodyShapes, clip: b });
    c.outlineVar(b, { min: 0.5, max: 1.4, light: -110 });
  });
  // crevices between the stones: black wedges
  for (const w of [[[px0, 300], [50, 306], [90, 302], [88, 296], [50, 300], [px0, 296]], [[px0, 356], [34, 366], [70, 364], [70, 359], [34, 361], [px0, 352]], [[px1, 320], [252, 330], [254, 335], [px1, 326]], [[196, 250], [230, 238], [262, 240], [262, 245], [230, 244], [200, 256]]]) c.fill(Path.smooth(w, { closed: true, tension: 0.3 }));
  // the pool at the bottom: still water, her reflection as a dark hatched shape
  const pool = S([[px0, 440], [100, 442], [200, 440], [px1, 436], [px1, py1], [px0, py1]], 0.3);
  c.hatch(pool, { angle: 0, spacing: 2.6, sw: 0.26 });
  c.hatch(S([[88, 442], [230, 440], [214, py1], [104, py1]], 0.3), { angle: 0, spacing: 2.6, sw: 0.5, clip: pool, phase: 1.3, dash: [6, 30, 3, 12] });
  c.draw(Path.smooth([[px0, 440], [100, 442], [200, 440], [px1, 436]]), { sw: 0.6 });
  // ---------- the figure
  // white fold slivers cut into the black gown (even-odd)
  const sliver = (a, b, w) => { const pts = Path.smooth([a, [(a[0] + b[0]) / 2 + 4, (a[1] + b[1]) / 2], b]).pts(3); const L = [], R = []; for (let i = 0; i < pts.length; i++) { const t = i / (pts.length - 1); const ww = w * Math.sin(Math.PI * t) + 0.15; const p = pts[i], q = pts[Math.min(pts.length - 1, i + 1)], o = pts[Math.max(0, i - 1)]; let nx = -(q[1] - o[1]), ny = q[0] - o[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l; L.push([p[0] + nx * ww, p[1] + ny * ww]); R.push([p[0] - nx * ww, p[1] - ny * ww]); } return Path.poly(L.concat(R.reverse())); };
  const slivers = [sliver([132, 300], [104, 412], 1.1), sliver([150, 296], [134, 418], 0.9), sliver([176, 290], [178, 420], 1.0), sliver([196, 280], [214, 406], 0.9), sliver([124, 240], [116, 300], 0.7), sliver([160, 128], [172, 180], 0.6), sliver([138, 200], [124, 250], 0.7),
    sliver([172, 200], [196, 250], 0.8), sliver([182, 214], [206, 262], 0.7), sliver([128, 236], [100, 330], 0.8), sliver([120, 268], [112, 326], 0.6)];
  c.fillEO([gown, face, neck, handR, handL, ...slivers]);
  c.outlineVar(gown, { min: 0.7, max: 1.4, light: -110 });
  // the hood's inner edge round the face
  c.draw(Path.smooth([[140, 122], [136, 140], [134, 160], [137, 180], [143, 192]]), { sw: 0.5 });
  c.draw(Path.smooth([[162, 124], [168, 142], [169, 164], [166, 180], [160, 192]]), { sw: 0.5 });
  // face: light modelling on the shadow side (left), the features
  c.hatch(face, { angle: 100, spacing: 2.4, sw: 0.2, spacingFn: t => 1.4 + 2.6 * t });
  c.draw(face, { sw: 0.85 });
  c.hatch(neck, { angle: 90, spacing: 2.0, sw: 0.22 }); c.draw(neck, { sw: 0.7 });
  for (const x of [145, 158]) { c.draw(new Path().M(x - 5, 158).C(x - 3, 153.5, x + 3, 153.5, x + 5, 158).C(x + 3, 161.8, x - 3, 161.8, x - 5, 158), { sw: 0.6 }); c.fill(Path.circle(x, 157.6, 3.1)); }
  c.draw(new Path().M(139, 151).C(142, 147.5, 147, 147.5, 150, 150.5), { sw: 0.7 }); c.draw(new Path().M(153, 150.5).C(156, 147.5, 161, 147.5, 164, 151), { sw: 0.7 });
  c.draw(new Path().M(151.5, 158).C(150.5, 163, 150, 167, 149.5, 170).C(151, 171.5, 153, 171.5, 154.5, 170), { sw: 0.5 });
  // lips in violet, small and closed
  c.fill(S([[145.5, 177], [151.5, 175.2], [157.5, 177], [151.5, 180.4]], 0.4), C.violet); c.draw(new Path().M(145.5, 177).C(149, 177.6, 154, 177.6, 157.5, 177), { sw: 0.5 });
  // hands
  for (const h of [handR, handL]) { c.hatch(h, { angle: 30, spacing: 2.2, sw: 0.2 }); c.draw(h, { sw: 0.85 }); }
  c.draw(new Path().M(153, 278).L(157, 262).M(160, 279).L(163, 262).M(166, 276).L(168, 264), { sw: 0.45 });
  c.draw(new Path().M(102, 352).L(106, 338).M(110, 353).L(113, 338).M(118, 350).L(120, 340), { sw: 0.45 });
  // the sprig of deadly nightshade held upright: stem, three leaves, two bells, berries
  const stem = Path.smooth([[204, 252], [206, 234], [212, 216], [220, 200], [226, 186]]);
  c.draw(stem, { sw: 1.0 });
  const leaf = (x, y, a, L) => new Path().M(0, 0).C(L * 0.3, -L * 0.3, L * 0.75, -L * 0.24, L, 0).C(L * 0.75, L * 0.24, L * 0.3, L * 0.3, 0, 0).Z().rotate(deg(a)).translate(x, y);
  for (const [x, y, a, L] of [[207, 232, -160, 24], [212, 218, 20, 22], [219, 204, -145, 19], [224, 192, 30, 16]]) { const lf = leaf(x, y, a, L); c.hatch(lf, { angle: a + 55, spacing: 1.4, sw: 0.24 }); c.draw(lf, { sw: 0.7 }); c.draw(new Path().M(x, y).L(x + L * 0.85 * Math.cos(deg(a)), y + L * 0.85 * Math.sin(deg(a))), { sw: 0.4 }); }
  const bell = (x, y, a) => new Path().M(-3.4, -8).C(-4, -2, -5.2, 3.5, -6.6, 7.5).L(-2.5, 5.6).L(0, 8.6).L(2.5, 5.6).L(6.6, 7.5).C(5.2, 3.5, 4, -2, 3.4, -8).Z().rotate(deg(a)).translate(x, y);
  for (const [x, y, a] of [[236, 200, 30], [196, 224, -35], [232, 178, 10]]) { const b = bell(x, y, a); c.fill(b, C.violet); c.draw(b, { sw: 0.5 }); c.draw(new Path().M(x + 8 * Math.sin(deg(a)), y - 8 * Math.cos(deg(a))).L(x + 16 * Math.sin(deg(a)) - 3, y - 16 * Math.cos(deg(a)) - 2), { sw: 0.55 }); }
  for (const [x, y] of [[222, 182], [230, 190], [216, 190]]) { c.draw(new Path().M(226, 186).L(x, y), { sw: 0.5 }); c.fill(Path.circle(x, y, 3), C.violet); c.draw(Path.circle(x, y, 3), { sw: 0.45 }); }
  c.frame();
  return c;
};
