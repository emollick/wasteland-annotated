// CXXXIX  Lil, at closing time. Two women at a pub table; the barman's call; the clock says it is time.
const { Card, Path, C, INK, deg, clipTo, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function closingTime() {
  const c = new Card({ name: 'Lil, at Closing Time', numeral: 'CXXXIX', seed: 139 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  // ---------- the bar behind: a counter with bottles on shelves, the clock, the barman
  const barTop = 262;
  const shelves = Path.rect(px0, py0, px1 - px0, 200 - py0);
  c.hatch(shelves, { angle: 90, spacing: 2.2, sw: 0.26, jitter: 0.2 });
  for (const y of [104, 150, 196]) c.draw(new Path().M(px0, y).L(px1, y), { sw: 1.2 });
  const bottle = (x, y, h, w) => { const b = S([[x - w, y], [x + w, y], [x + w, y - h * 0.6], [x + w * 0.35, y - h * 0.8], [x + w * 0.35, y - h], [x - w * 0.35, y - h], [x - w * 0.35, y - h * 0.8], [x - w, y - h * 0.6]], 0.2); c.hatch(b, { angle: 90, spacing: 1.1, sw: 0.3, spacingFn: t => 0.9 + 1.4 * Math.abs(Math.sin(t * Math.PI)) }); c.draw(b, { sw: 0.7 }); };
  for (const [x, h, w] of [[30, 36, 5], [44, 30, 4.5], [60, 40, 5.5], [76, 28, 4], [98, 34, 5], [118, 38, 5], [232, 32, 5], [250, 40, 5.5], [268, 30, 4.5], [282, 36, 5]]) bottle(x, 104, h, w);
  for (const [x, h, w] of [[26, 30, 4.5], [46, 38, 5], [64, 26, 4], [86, 34, 5], [104, 30, 4.5], [236, 36, 5], [258, 28, 4.5], [278, 34, 5]]) bottle(x, 150, h, w);
  // the clock, central, high: it is time
  c.fill(Path.circle(150, 146, 26), C.gold); c.draw(Path.circle(150, 146, 26), { sw: 1.4 }); c.draw(Path.circle(150, 146, 22), { sw: 0.5 });
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; c.draw(new Path().M(150 + 19 * Math.cos(a), 146 + 19 * Math.sin(a)).L(150 + 22 * Math.cos(a), 146 + 22 * Math.sin(a)), { sw: i % 3 ? 0.6 : 1.2 }); }
  c.draw(new Path().M(150, 146).L(150 + 12 * Math.cos(deg(-60)), 146 + 12 * Math.sin(deg(-60))).M(150, 146).L(150 + 18 * Math.cos(deg(-90)), 146 + 18 * Math.sin(deg(-90))), { sw: 1.6 }); c.fill(Path.circle(150, 146, 1.8));
  // the barman behind the counter, in an apron, mouth open, calling
  const bm = 150;
  const barman = [S([[bm, 178], [bm + 12, 182], [bm + 16, 198], [bm + 14, 214], [bm + 6, 224], [bm, 226], [bm - 6, 224], [bm - 14, 214], [bm - 16, 198], [bm - 12, 182]], 0.55), S([[bm - 34, 232], [bm + 34, 232], [bm + 40, barTop], [bm - 40, barTop]], 0.4)];
  c.hatch(barman[0], { angle: 100, spacing: 2.4, sw: 0.2, spacingFn: t => 1.6 + 2.2 * t }); c.draw(barman[0], { sw: 0.9 });
  c.fill(S([[bm - 12, 182], [bm, 176], [bm + 12, 182], [bm + 10, 190], [bm, 186], [bm - 10, 190]], 0.4)); // hair, slicked
  for (const x of [bm - 5, bm + 5]) { c.draw(new Path().M(x - 3, 198).C(x - 1.5, 196, x + 1.5, 196, x + 3, 198), { sw: 0.6 }); c.fill(Path.circle(x, 198.6, 1.3)); }
  c.fill(Path.ellipse(bm, 214, 3.6, 4.2)); // open mouth
  c.draw(new Path().M(bm - 7, 208).C(bm - 3, 206, bm + 3, 206, bm + 7, 208), { sw: 0.7 }); // moustache
  c.hatch(barman[1], { angle: 88, spacing: 2.0, sw: 0.26 }); c.draw(barman[1], { sw: 0.9 }); c.draw(new Path().M(bm - 20, 240).L(bm - 22, barTop).M(bm + 20, 240).L(bm + 22, barTop), { sw: 0.5 });
  const neck = S([[bm - 7, 224], [bm + 7, 224], [bm + 9, 236], [bm - 9, 236]], 0.4); c.hatch(neck, { angle: 90, spacing: 1.6, sw: 0.22 }); c.draw(neck, { sw: 0.6 });
  // the counter
  c.draw(new Path().M(px0, barTop).L(px1, barTop), { sw: 1.3 }); c.draw(new Path().M(px0, barTop + 6).L(px1, barTop + 6), { sw: 0.6 });
  c.hatch(Path.rect(px0, barTop + 6, px1 - px0, 40), { angle: 90, spacing: 1.6, sw: 0.3 }); c.hatch(Path.rect(px0, barTop + 6, px1 - px0, 40), { angle: 0, spacing: 4, sw: 0.24 });
  // ---------- the two women at a round table in front: Lil at the left (hand to her mouth), her friend at the right in a cloche, telling
  const tableY = 392;
  const table = Path.ellipse(150, tableY, 84, 16);
  // Lil: facing us, hatless, hair drawn back, hand to her mouth
  const lx = 84;
  const lil = { face: S([[lx, 300], [lx + 14, 305], [lx + 19, 322], [lx + 17, 342], [lx + 8, 354], [lx, 358], [lx - 8, 354], [lx - 17, 342], [lx - 19, 322], [lx - 14, 305]], 0.55),
    hair: S([[lx, 292], [lx + 16, 296], [lx + 22, 314], [lx + 20, 330], [lx + 14, 306], [lx, 302], [lx - 14, 306], [lx - 20, 330], [lx - 22, 314], [lx - 16, 296]], 0.45),
    body: S([[lx, 356], [lx + 30, 364], [lx + 40, 380], [lx + 46, tableY], [lx - 46, tableY], [lx - 40, 380], [lx - 30, 364]], 0.45),
    hand: S([[lx - 4, 338], [lx + 8, 334], [lx + 14, 342], [lx + 10, 354], [lx, 356], [lx - 8, 350]], 0.5),
    arm: tube([[lx + 36, 376], [lx + 28, 360], [lx + 12, 348]], t => 12 - 3 * t) };
  const fx = 216;
  const friend = { face: S([[fx, 306], [fx + 13, 311], [fx + 17, 326], [fx + 15, 344], [fx + 7, 354], [fx, 357], [fx - 7, 354], [fx - 15, 344], [fx - 17, 326], [fx - 13, 311]], 0.55),
    cloche: S([[fx, 292], [fx + 20, 298], [fx + 24, 316], [fx + 22, 326], [fx + 16, 318], [fx, 314], [fx - 16, 318], [fx - 24, 328], [fx - 24, 312], [fx - 18, 298]], 0.45),
    body: S([[fx, 356], [fx + 30, 364], [fx + 40, 380], [fx + 46, tableY], [fx - 46, tableY], [fx - 40, 380], [fx - 30, 364]], 0.45),
    arm: tube([[fx - 36, 376], [fx - 44, 364], [fx - 60, 358]], t => 12 - 3 * t), hand: S([[fx - 72, 356], [fx - 60, 352], [fx - 54, 360], [fx - 60, 368], [fx - 72, 368], [fx - 78, 362]], 0.5) };
  // floor
  c.draw(new Path().M(px0, barTop + 46).L(px1, barTop + 46), { sw: 0.5 });
  c.hatch(Path.rect(px0, barTop + 46, px1 - px0, py1 - barTop - 46), { angle: 0, spacing: 5.5, sw: 0.24, dash: [12, 40, 4, 14], holes: [lil.body, friend.body, table] });
  // the women drawn
  for (const w of [lil, friend]) {
    c.hatch(w.body, { angle: 88, spacing: 1.6, sw: 0.3, jitter: 0.2 }); c.hatch(w.body, { angle: 20, spacing: 2.8, sw: 0.22 }); c.outlineVar(w.body, { min: 0.7, max: 1.3, light: -120 });
    c.hatch(w.arm, { angle: 60, spacing: 1.6, sw: 0.26 }); c.draw(w.arm, { sw: 0.8 });
    c.hatch(w.hand, { angle: 20, spacing: 1.9, sw: 0.22 }); c.draw(w.hand, { sw: 0.8 });
    c.hatch(w.face, { angle: 100, spacing: 2.4, sw: 0.2, spacingFn: t => 1.6 + 2.4 * t }); c.draw(w.face, { sw: 0.9 });
  }
  // Lil's face: tired eyes, the hand covering the mouth (her teeth); her hair pulled back, dark
  c.fill(lil.hair);
  for (const x of [lx - 6, lx + 6]) { c.draw(new Path().M(x - 4, 324).C(x - 2, 320.8, x + 2, 320.8, x + 4, 324).C(x + 2, 326.4, x - 2, 326.4, x - 4, 324), { sw: 0.55 }); c.fill(Path.circle(x, 324, 1.8)); c.draw(new Path().M(x - 5, 327).C(x - 2, 328.5, x + 2, 328.5, x + 5, 327), { sw: 0.35 }); }
  c.draw(new Path().M(lx - 11, 318).C(lx - 8, 315.5, lx - 3, 315.5, lx - 1, 318).M(lx + 1, 318).C(lx + 3, 315.5, lx + 8, 315.5, lx + 11, 318), { sw: 0.6 });
  c.draw(new Path().M(lx - 2, 352).L(lx + 2, 340).M(lx + 4, 354).L(lx + 7, 342).M(lx + 9, 352).L(lx + 11, 344), { sw: 0.4 });
  // the friend: cloche, a talking mouth, one hand out on the table
  c.hatch(friend.cloche, { angle: 20, spacing: 1.2, sw: 0.32 }); c.hatch(friend.cloche, { angle: 110, spacing: 2, sw: 0.26 }); c.draw(friend.cloche, { sw: 0.9 });
  for (const x of [fx - 6, fx + 6]) { c.draw(new Path().M(x - 4, 328).C(x - 2, 324.8, x + 2, 324.8, x + 4, 328).C(x + 2, 330.4, x - 2, 330.4, x - 4, 328), { sw: 0.55 }); c.fill(Path.circle(x, 328, 1.8)); }
  c.draw(new Path().M(fx, 330).C(fx - 1, 335, fx - 1.5, 338, fx - 2, 341).C(fx - 0.5, 342, fx + 0.5, 342, fx + 2, 341), { sw: 0.45 });
  c.draw(new Path().M(fx - 5, 348).C(fx - 2, 351, fx + 2, 351, fx + 5, 348).C(fx + 2, 346.5, fx - 2, 346.5, fx - 5, 348), { sw: 0.6 }); c.fill(S([[fx - 4, 348], [fx + 4, 348], [fx + 2, 350.5], [fx - 2, 350.5]], 0.3));
  c.draw(new Path().M(fx - 70, 366).L(fx - 68, 356).M(fx - 64, 367).L(fx - 62, 356).M(fx - 58, 366).L(fx - 57, 358), { sw: 0.4 });
  // the table and the glasses
  c.hatch(table, { angle: 0, spacing: 1.5, sw: 0.26 }); c.draw(table, { sw: 0.9 });
  c.draw(new Path().M(150, tableY + 16).L(150, py1 - 4), { sw: 2.2 }); c.draw(new Path().M(120, py1 - 6).C(130, py1 - 12, 170, py1 - 12, 180, py1 - 6), { sw: 1.2 });
  const glass = (x, y, s) => { const g = S([[x - 5 * s, y], [x + 5 * s, y], [x + 6 * s, y - 16 * s], [x - 6 * s, y - 16 * s]], 0.2); c.hatch(g, { angle: 90, spacing: 1.6 * s, sw: 0.22 }); c.draw(g, { sw: 0.6 }); c.draw(Path.ellipse(x, y - 16 * s, 6 * s, 1.6 * s), { sw: 0.5 }); c.hatch(S([[x - 4.6 * s, y - 1], [x + 4.6 * s, y - 1], [x + 5.2 * s, y - 7 * s], [x - 5.2 * s, y - 7 * s]], 0.2), { angle: 0, spacing: 1.0, sw: 0.3 }); };
  glass(118, tableY - 2, 1.0); glass(178, tableY - 4, 1.0); glass(150, tableY - 6, 0.85);
  c.frame();
  return c;
};
