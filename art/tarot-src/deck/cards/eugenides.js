// CCIX  Mr. Eugenides, the Smyrna merchant, unshaven, with a pocket full of currants, under the brown fog of a winter noon; the Cannon Street Hotel behind him.
const { Card, Path, C, INK, deg, rot, clipTo, clipPolyline, offsetPolyline, inside } = require('../lib');
const { tube } = require('../fig');
module.exports = function eugenides() {
  const c = new Card({ name: 'Mr. Eugenides', numeral: 'CCIX', seed: 209 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const all = [Path.rect(0, 0, 300, 520).polys()[0]];
  // ---------- the merchant: stout, three-quarter on, facing us, a homburg, a heavy coat with a fur collar; one hand out in invitation, the other holding the papers
  const ex = 150, ey = 440;
  const coat = S([[ex - 40, ey - 200], [ex + 40, ey - 200], [ex + 56, ey - 160], [ex + 62, ey - 100], [ex + 60, ey - 40], [ex + 56, ey], [ex - 56, ey], [ex - 60, ey - 40], [ex - 62, ey - 100], [ex - 56, ey - 160]], 0.45);
  const collar = S([[ex - 44, ey - 206], [ex - 22, ey - 214], [ex, ey - 200], [ex + 22, ey - 214], [ex + 44, ey - 206], [ex + 48, ey - 176], [ex + 30, ey - 168], [ex, ey - 180], [ex - 30, ey - 168], [ex - 48, ey - 176]], 0.45);
  const head = S([[ex - 2, ey - 274], [ex + 14, ey - 272], [ex + 24, ey - 258], [ex + 24, ey - 236], [ex + 16, ey - 218], [ex + 2, ey - 210], [ex - 14, ey - 214], [ex - 24, ey - 232], [ex - 24, ey - 254], [ex - 16, ey - 270]], 0.5);
  const hat = S([[ex - 34, ey - 264], [ex - 22, ey - 268], [ex - 18, ey - 292], [ex - 4, ey - 300], [ex + 14, ey - 298], [ex + 22, ey - 290], [ex + 24, ey - 268], [ex + 36, ey - 262], [ex + 30, ey - 258], [ex - 30, ey - 258]], 0.4);
  const neck = S([[ex - 12, ey - 216], [ex + 12, ey - 216], [ex + 14, ey - 196], [ex - 14, ey - 196]], 0.4);
  const armInv = tube([[ex + 44, ey - 160], [ex + 68, ey - 130], [ex + 84, ey - 96]], t => 20 - 5 * t); // out toward us, palm up
  const handInv = S([[ex + 74, ey - 104], [ex + 92, ey - 108], [ex + 106, ey - 100], [ex + 106, ey - 86], [ex + 92, ey - 78], [ex + 74, ey - 84]], 0.5);
  const armDoc = tube([[ex - 44, ey - 160], [ex - 62, ey - 120], [ex - 56, ey - 88]], t => 20 - 5 * t);
  const handDoc = S([[ex - 66, ey - 96], [ex - 50, ey - 96], [ex - 46, ey - 82], [ex - 54, ey - 72], [ex - 68, ey - 78]], 0.5);
  const papers = Path.poly([[ex - 76, ey - 100], [ex - 48, ey - 106], [ex - 40, ey - 70], [ex - 68, ey - 64]]);
  const pocket = S([[ex + 20, ey - 90], [ex + 50, ey - 92], [ex + 52, ey - 60], [ex + 22, ey - 58]], 0.3);
  const shoes = [S([[ex - 40, ey - 2], [ex - 10, ey - 2], [ex - 6, ey + 8], [ex - 44, ey + 8]], 0.4), S([[ex + 10, ey - 2], [ex + 40, ey - 2], [ex + 44, ey + 8], [ex + 6, ey + 8]], 0.4)];
  const figure = [coat, collar, head, hat, neck, armInv, handInv, armDoc, handDoc, papers, pocket, ...shoes];
  // ---------- the street: the hotel's front behind him under fog; the pavement
  const pave = 446;
  const hotel = Path.rect(px0, 130, px1 - px0, pave - 130);
  c.hatch(hotel, { angle: 90, spacing: 1.8, sw: 0.22, holes: figure, spacingFn: t => 1.4 + 1.2 * Math.abs(Math.sin(t * 6)) });
  // courses, and a row of tall windows either side of him, and the clock over the door
  for (let y = 140; y < pave; y += 12) c.lines(clipTo([[px0, y], [px1, y]], hotel.polys(), figure.flatMap(f => f.polys())), { sw: 0.28 });
  const win = (x, y, w, h) => { const p = Path.rect(x, y, w, h); c.hatch(p, { angle: 0, spacing: 1.2, sw: 0.34, holes: figure }); c.hatch(p, { angle: 90, spacing: 2.2, sw: 0.24, holes: figure }); c.lines(clipTo(p.pts(2).concat([p.pts(2)[0]]), all, figure.flatMap(f => f.polys())), { sw: 0.6 }); c.lines(clipTo([[x, y + 6], [x + w, y + 6]], all, figure.flatMap(f => f.polys())), { sw: 0.9 }); };
  for (const x of [30, 62, 220, 252]) { win(x, 176, 20, 40); win(x, 246, 20, 40); win(x, 316, 20, 40); }
  win(130, 160, 40, 46);
  // the doorway behind him: a dark arch
  const arch = Path.poly([[110, pave], [110, 260], [114, 244], [128, 232], [150, 228], [172, 232], [186, 244], [190, 260], [190, pave]]);
  c.hatch(arch, { angle: 0, spacing: 1.0, sw: 0.34, holes: figure }); c.hatch(arch, { angle: 90, spacing: 1.4, sw: 0.26, holes: figure }); c.lines(clipTo(arch.pts(2), all, figure.flatMap(f => f.polys())), { sw: 0.9 });
  // the clock over the arch: gold face, hands at noon
  const ck = [236, 150]; c.fill(Path.circle(ck[0], ck[1], 10), C.gold); c.draw(Path.circle(ck[0], ck[1], 10), { sw: 0.7 }); c.draw(new Path().M(ck[0], ck[1]).L(ck[0], ck[1] - 8).M(ck[0], ck[1]).L(ck[0] + 0.5, ck[1] - 6.5), { sw: 1.0 }); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; c.fill(Path.circle(ck[0] + Math.cos(a) * 7.6, ck[1] + Math.sin(a) * 7.6, 0.6)); }
  // the fog: brown, a winter noon: long broken lines over everything above the shoulders, thicker toward the top
  c.hatch(Path.rect(px0, py0, px1 - px0, 300), { angle: 0, spacing: 2.4, sw: 0.34, holes: figure, spacingFn: t => 1.6 + 4 * t, dash: [30, 20, 60, 14], jitter: 0.3 });
  // the pavement
  c.hatch(Path.rect(px0, pave, px1 - px0, py1 - pave), { angle: 0, spacing: 3, sw: 0.26, holes: figure, spacingFn: t => 2 + 2 * t }); c.lines(clipTo([[px0, pave], [px1, pave]], all, figure.flatMap(f => f.polys())), { sw: 0.7 });
  // ---------- the merchant drawn: the coat heavy, dark; the fur collar in short curls; the hat black; the face stubbled
  c.hatch(coat, { angle: 90, spacing: 1.6, sw: 0.3, holes: [pocket, papers, handDoc, handInv, armInv, armDoc], spacingFn: t => 1.1 + 1.4 * Math.abs(Math.cos(t * Math.PI)), jitter: 0.2 });
  c.hatch(coat, { angle: 0, spacing: 3.6, sw: 0.2, holes: [pocket, papers, handDoc, handInv, armInv, armDoc], phase: 1 });
  c.drapery(coat, [[[ex - 20, ey - 150], [ex - 24, ey - 80], [ex - 26, ey - 4]], [[ex + 16, ey - 150], [ex + 18, ey - 80], [ex + 20, ey - 4]]], { side: 1, width: 8, spacing: 1.5, sw: 0.28, foldSw: 0.7 });
  c.outlineVar(coat, { min: 0.7, max: 1.4, light: -60 });
  // buttons down the front
  for (const y of [ey - 150, ey - 122, ey - 94, ey - 66]) c.fill(Path.circle(ex + 2, y, 2.2));
  for (const a of [armInv, armDoc]) { c.hatch(a, { angle: 60, spacing: 1.6, sw: 0.3 }); c.hatch(a, { angle: 60, spacing: 3.2, sw: 0.2, phase: 0.8 }); c.draw(a, { sw: 0.9 }); }
  // the collar: astrakhan, rows of small curls
  for (let i = 0; i < 90; i++) { const [x, y] = [rnd.range(ex - 46, ex + 46), rnd.range(ey - 212, ey - 170)]; if (!inside([x, y], collar.polys())) continue; c.draw(Path.arc(x, y, 2.2, rnd.range(0, 2), rnd.range(3.6, 5.8), { move: true }), { sw: 0.45 }); }
  c.draw(collar, { sw: 0.9 });
  // the pocket: currants spilling from it, violet
  c.hatch(pocket, { angle: 0, spacing: 1.4, sw: 0.3 }); c.draw(pocket, { sw: 0.8 }); c.draw(new Path().M(ex + 20, ey - 84).L(ex + 50, ey - 86), { sw: 1.0 });
  for (const [x, y] of [[ex + 26, ey - 92], [ex + 32, ey - 95], [ex + 40, ey - 93], [ex + 46, ey - 96], [ex + 36, ey - 98], [ex + 58, ey - 60], [ex + 64, ey - 30], [ex + 60, ey + 6], [ex + 30, ey - 88]]) c.fill(Path.circle(x, y, 2.2), C.violet);
  // the papers: documents at sight, in the left hand; a few lines of writing and a seal
  c.draw(papers, { sw: 0.7 }); c.hatch(Path.poly([[ex - 70, ey - 96], [ex - 52, ey - 100], [ex - 46, ey - 74], [ex - 64, ey - 70]]), { angle: -12, spacing: 3.2, sw: 0.4, dash: [10, 3, 6, 4] }); c.fill(Path.circle(ex - 50, ey - 74, 2.6), C.violet);
  for (const h of [handDoc, handInv]) { c.hatch(h, { angle: 30, spacing: 1.6, sw: 0.22 }); c.draw(h, { sw: 0.8 }); }
  // the open hand: fingers, palm up
  c.lines([[[ex + 92, ey - 106], [ex + 96, ey - 96]], [[ex + 100, ey - 104], [ex + 100, ey - 94]], [[ex + 104, ey - 98], [ex + 102, ey - 90]]], { sw: 0.45 });
  for (const s of shoes) c.fill(s);
  c.hatch(neck, { angle: 90, spacing: 1.6, sw: 0.24 }); c.draw(neck, { sw: 0.7 });
  c.hatch(head, { angle: 100, spacing: 2.4, sw: 0.2, spacingFn: t => 1.5 + 2.4 * t }); c.draw(head, { sw: 0.9 });
  // unshaven: stipple over the jaw and upper lip
  c.stipple(S([[ex - 20, ey - 240], [ex + 20, ey - 240], [ex + 22, ey - 226], [ex + 10, ey - 212], [ex - 10, ey - 212], [ex - 22, ey - 226]], 0.5), { density: 0.4, sw: 0.5 });
  // the face: heavy-lidded eyes, a thick moustache, a wide mouth
  for (const sx of [-1, 1]) { const x = ex + sx * 8, y = ey - 250; c.draw(new Path().M(x - 4, y).C(x - 2, y - 3, x + 2, y - 3, x + 4, y), { sw: 0.6 }); c.draw(new Path().M(x - 4, y).C(x - 2, y + 2, x + 2, y + 2, x + 4, y), { sw: 0.4 }); c.fill(Path.ellipse(x, y + 0.2, 1.6, 1.1)); c.draw(new Path().M(x - 5, y - 5).C(x - 2, y - 7, x + 3, y - 7, x + 5, y - 5), { sw: 0.7 }); }
  c.draw(new Path().M(ex, ey - 248).C(ex - 1, ey - 242, ex - 3, ey - 238, ex - 4, ey - 236).C(ex - 1, ey - 235, ex + 2, ey - 235, ex + 3, ey - 236), { sw: 0.5 });
  c.fill(S([[ex - 12, ey - 232], [ex - 4, ey - 234], [ex, ey - 232], [ex + 4, ey - 234], [ex + 12, ey - 232], [ex + 8, ey - 228], [ex, ey - 229], [ex - 8, ey - 228]], 0.4));
  c.draw(new Path().M(ex - 8, ey - 222).C(ex - 3, ey - 219, ex + 3, ey - 219, ex + 8, ey - 222), { sw: 0.6 });
  c.fill(hat);
  c.frame();
  return c;
};
