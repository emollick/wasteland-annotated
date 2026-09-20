// CCXXII  The typist home at teatime: the bedsit, the divan, the drying combinations at the window, the gramophone.
const { Card, Path, C, INK, deg, clipTo, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function typist() {
  const c = new Card({ name: 'The Typist', numeral: 'CCXXII', seed: 222 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  // ---------- the room: a window at the upper left with the washing spread across it; wallpaper; the divan at the right; a table with tins; the gramophone
  const win = Path.rect(30, 62, 96, 130);
  // wallpaper: a small repeating sprig on the wall, sparse
  const wall = Path.rect(px0, py0, px1 - px0, 330 - py0);
  const divan = S([[150, 300], [280, 300], [284, 330], [284, 380], [150, 380], [146, 330]], 0.15);
  const bolster = Path.ellipse(272, 300, 12, 20);
  // the typist: seated on the divan, facing us, one hand up smoothing her hair, the other reaching to the gramophone at the left
  const tx = 196;
  const dress = S([[tx, 214], [tx + 22, 218], [tx + 34, 236], [tx + 40, 270], [tx + 46, 300], [tx + 54, 340], [tx - 60, 340], [tx - 46, 300], [tx - 40, 270], [tx - 34, 236], [tx - 22, 218]], 0.45);
  const face = S([[tx, 162], [tx + 13, 167], [tx + 17, 182], [tx + 15, 200], [tx + 7, 210], [tx, 213], [tx - 7, 210], [tx - 15, 200], [tx - 17, 182], [tx - 13, 167]], 0.55);
  const hair = S([[tx, 150], [tx + 16, 154], [tx + 22, 170], [tx + 20, 196], [tx + 16, 174], [tx + 4, 165], [tx - 10, 168], [tx - 18, 190], [tx - 22, 172], [tx - 16, 154]], 0.45);
  const neck = S([[tx - 7, 208], [tx + 7, 208], [tx + 9, 220], [tx - 9, 220]], 0.4);
  const armUp = tube([[tx + 24, 226], [tx + 40, 200], [tx + 26, 168]], t => 13 - 3 * t);
  const handUp = S([[tx + 16, 156], [tx + 30, 156], [tx + 34, 166], [tx + 26, 174], [tx + 14, 170]], 0.5);
  const armOut = tube([[tx - 26, 228], [tx - 60, 244], [tx - 84, 250]], t => 13 - 3 * t);
  const handOut = S([[tx - 98, 242], [tx - 84, 240], [tx - 78, 250], [tx - 86, 260], [tx - 100, 258], [tx - 104, 250]], 0.5);
  const legs = [tube([[tx - 26, 336], [tx - 30, 380], [tx - 28, 412]], t => 16 - 3 * t), tube([[tx + 10, 336], [tx + 10, 380], [tx + 12, 412]], t => 16 - 3 * t)];
  const slippers = [S([[tx - 42, 410], [tx - 12, 410], [tx - 10, 420], [tx - 46, 420]], 0.4), S([[tx - 2, 410], [tx + 28, 410], [tx + 32, 420], [tx - 4, 420]], 0.4)];
  const figure = [dress, face, hair, neck, armUp, handUp, armOut, handOut, ...legs, ...slippers];
  // the gramophone on a small table at the left, horn opening toward us
  const gTable = Path.rect(28, 270, 74, 6); const gLegs = [Path.rect(32, 276, 4, 90), Path.rect(94, 276, 4, 90)];
  const gBox = Path.rect(40, 246, 50, 24);
  const horn = S([[66, 246], [58, 226], [52, 206], [54, 190], [70, 176], [96, 174], [116, 184], [122, 202], [112, 218], [94, 226], [80, 230], [74, 246]], 0.5);
  const hornMouth = Path.ellipse(88, 200, 26, 22, deg(-30));
  const gram = [gTable, ...gLegs, gBox, horn];
  // ---------- drawing: wall, window, washing
  c.hatch(wall, { angle: 90, spacing: 3.0, sw: 0.22, holes: figure.concat(gram, [win, divan, bolster]), jitter: 0.3, dash: [16, 40, 2, 5] });
  // sprigs on the wallpaper
  for (let i = 0; i < 40; i++) { const x = 20 + (i % 8) * 34 + (Math.floor(i / 8) % 2) * 17, y = 58 + Math.floor(i / 8) * 54; if (x < px0 + 4 || x > px1 - 4 || y > 320) continue; if (require('../lib').inside([x, y], win.polys()) || figure.some(f => require('../lib').inside([x, y], f.polys())) || require('../lib').inside([x, y], horn.polys())) continue; c.draw(new Path().M(x, y + 5).C(x + 1, y + 1, x + 2, y - 2, x + 1, y - 5).M(x + 1, y).C(x - 2, y - 1, x - 3, y - 3, x - 3, y - 5).M(x + 1, y - 2).C(x + 3, y - 3, x + 4, y - 5, x + 4, y - 7), { sw: 0.4 }); }
  // the window: frame, panes with the sun's last rays as gold on the lower panes; the combinations strung across it
  c.draw(win, { sw: 1.1 }); c.draw(new Path().M(78, 62).L(78, 192).M(30, 127).L(126, 127), { sw: 0.9 });
  c.hatch(Path.rect(32, 64, 92, 61), { angle: 0, spacing: 2.4, sw: 0.22 });
  c.fill(Path.rect(32, 129, 45, 61), C.gold, { op: 1 }); c.fill(Path.rect(80, 129, 44, 61), C.gold);
  c.hatch(Path.rect(32, 129, 92, 61), { angle: -30, spacing: 4, sw: 0.3 });
  // the washing line and the combinations (a one-piece undergarment) hanging, spread
  c.draw(new Path().M(22, 100).C(60, 112, 100, 112, 134, 100), { sw: 0.8 });
  const combi = S([[54, 108], [78, 110], [102, 108], [100, 130], [96, 150], [90, 170], [80, 170], [78, 150], [76, 170], [66, 170], [60, 150], [56, 130]], 0.4);
  c.hatch(combi, { angle: 85, spacing: 2.2, sw: 0.24, jitter: 0.3 }); c.draw(combi, { sw: 0.8 }); c.draw(new Path().M(78, 112).L(78, 150), { sw: 0.4 });
  for (const x of [58, 98]) c.draw(new Path().M(x - 2, 104).L(x - 2, 112).M(x + 2, 104).L(x + 2, 112), { sw: 0.7 });
  // ---------- the divan and the pile of clothes on it
  c.hatch(divan, { angle: 0, spacing: 2.2, sw: 0.26, holes: figure }); c.hatch(S([[150, 300], [280, 300], [284, 330], [146, 330]], 0.1), { angle: 90, spacing: 1.6, sw: 0.24, holes: figure, clip: divan });
  c.lines(clipTo(divan.pts(), [Path.rect(0, 0, 300, 520).polys()[0]], figure.flatMap(f => f.polys())), { sw: 0.9 });
  c.hatch(bolster, { angle: 60, spacing: 1.4, sw: 0.26 }); c.draw(bolster, { sw: 0.8 });
  const pile = [S([[232, 300], [262, 292], [278, 298], [270, 310], [240, 312]], 0.5), S([[244, 290], [268, 284], [274, 292], [256, 296]], 0.5)];
  for (const p of pile) { c.hatch(p, { angle: 30, spacing: 1.6, sw: 0.24 }); c.draw(p, { sw: 0.7 }); }
  c.draw(Path.smooth([[236, 300], [230, 320], [238, 340]]), { sw: 0.6 }); c.draw(Path.smooth([[244, 302], [248, 322], [244, 342]]), { sw: 0.6 }); // stockings hanging off the edge
  // floor: boards
  c.draw(new Path().M(px0, 380).L(px1, 380), { sw: 0.7 });
  for (let i = 1; i < 7; i++) c.draw(new Path().M(px0 + i * 40 - 20, 380).L(px0 + i * 44 - 30, py1), { sw: 0.4 });
  for (let x = 40; x < 280; x += 4) {} // (no cross lines)
  // the stove and the tins on a shelf, small, at the right of the window
  const stove = Path.rect(232, 236, 40, 40); c.hatch(stove, { angle: 90, spacing: 1.2, sw: 0.3 }); c.draw(stove, { sw: 0.8 }); c.draw(Path.circle(252, 256, 7), { sw: 0.6 }); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; c.draw(new Path().M(252 + 2 * Math.cos(a), 256 + 2 * Math.sin(a)).L(252 + 6 * Math.cos(a), 256 + 6 * Math.sin(a)), { sw: 0.6 }); }
  for (const x of [160, 176, 192]) { const tin = Path.rect(x - 6, 216, 12, 16); c.hatch(tin, { angle: 90, spacing: 1.3, sw: 0.24 }); c.draw(tin, { sw: 0.6 }); c.draw(Path.ellipse(x, 216, 6, 1.8), { sw: 0.5 }); }
  // ---------- the gramophone drawn
  for (const g of [gTable, ...gLegs]) c.fill(g);
  c.hatch(gBox, { angle: 0, spacing: 1.5, sw: 0.3 }); c.draw(gBox, { sw: 0.8 }); c.draw(new Path().M(44, 250).L(86, 250).L(86, 266).L(44, 266).Z(), { sw: 0.4 });
  c.hatch(horn, { angle: 60, spacing: 1.8, sw: 0.26, spacingFn: t => 1.2 + 2 * t }); c.hatch(hornMouth, { angle: -30, spacing: 1.4, sw: 0.3, clip: horn, spacingFn: t => 1 + 1.6 * t }); c.draw(horn, { sw: 1.0 }); c.lines(clipTo(hornMouth.pts(2), horn.polys()), { sw: 0.7 });
  c.fill(Path.circle(66, 246, 2.6)); c.draw(new Path().M(90, 258).C(98, 252, 104, 258, 100, 264), { sw: 0.8 }); // crank
  // ---------- the typist drawn
  c.hatch(dress, { angle: 88, spacing: 2.4, sw: 0.26, jitter: 0.3 });
  c.drapery(dress, [[[tx - 14, 240], [tx - 20, 300], [tx - 24, 340]], [[tx + 12, 240], [tx + 18, 300], [tx + 22, 340]]], { side: 1, width: 8, spacing: 1.5, sw: 0.3, foldSw: 0.6 });
  c.hatch(S([[tx + 22, 218], [tx + 34, 236], [tx + 40, 270], [tx + 46, 300], [tx + 54, 340], [tx + 38, 340], [tx + 32, 300], [tx + 28, 270], [tx + 22, 240]], 0.4), { angle: 84, spacing: 1.3, sw: 0.3, clip: dress });
  c.outlineVar(dress, { min: 0.6, max: 1.3, light: -120 });
  c.draw(new Path().M(tx - 36, 280).C(tx - 10, 286, tx + 10, 286, tx + 36, 280), { sw: 0.5 });
  for (const l of legs) { c.hatch(l, { angle: 85, spacing: 1.8, sw: 0.24, spacingFn: t => 1.4 + 1.6 * t }); c.draw(l, { sw: 0.85 }); }
  for (const sl of slippers) c.fill(sl);
  for (const a of [armUp, armOut]) { c.hatch(a, { angle: 40, spacing: 2.0, sw: 0.24 }); c.draw(a, { sw: 0.85 }); }
  for (const h of [handUp, handOut]) { c.hatch(h, { angle: 20, spacing: 1.8, sw: 0.22 }); c.draw(h, { sw: 0.8 }); }
  c.draw(new Path().M(tx - 96, 256).L(tx - 94, 246).M(tx - 90, 258).L(tx - 88, 246).M(tx - 84, 257).L(tx - 82, 247), { sw: 0.4 });
  c.hatch(neck, { angle: 90, spacing: 1.8, sw: 0.22 }); c.draw(neck, { sw: 0.7 });
  c.hatch(face, { angle: 100, spacing: 2.6, sw: 0.2, spacingFn: t => 1.6 + 2.6 * t }); c.draw(face, { sw: 0.85 });
  for (const x of [tx - 6, tx + 6]) { c.draw(new Path().M(x - 4, 186).C(x - 2, 183, x + 2, 183, x + 4, 186).C(x + 2, 188.6, x - 2, 188.6, x - 4, 186), { sw: 0.55 }); c.fill(Path.circle(x, 186, 1.8)); }
  c.draw(new Path().M(tx - 11, 180).C(tx - 8, 177.5, tx - 3, 177.5, tx - 1, 180).M(tx + 1, 180).C(tx + 3, 177.5, tx + 8, 177.5, tx + 11, 180), { sw: 0.6 });
  c.draw(new Path().M(tx, 187).C(tx - 1, 192, tx - 1.5, 195, tx - 2, 198).C(tx - 0.5, 199.4, tx + 0.5, 199.4, tx + 2, 198), { sw: 0.45 });
  c.draw(new Path().M(tx - 5, 204).C(tx - 2, 202.6, tx + 2, 202.6, tx + 5, 204), { sw: 0.7 });
  // bobbed hair, black, a paper sliver or two
  c.fill(hair); c.draw(hair, { sw: 0.7 });
  c.frame();
  return c;
};
