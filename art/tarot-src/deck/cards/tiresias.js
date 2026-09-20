// CCXVIII  Tiresias: old man with wrinkled dugs, blind, throbbing between two lives, at the violet hour; the two snakes at his feet.
const { Card, Path, C, INK, deg, clipTo, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function tiresias() {
  const c = new Card({ name: 'Tiresias', numeral: 'CCXVIII', seed: 218 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  // ---------- the figure: seated on a block of stone, facing us, blind eyes closed, staff in one hand, bare to the waist, a wrapped cloth below
  const tx = 150;
  const torso = S([[tx, 176], [tx + 26, 180], [tx + 40, 196], [tx + 44, 232], [tx + 40, 268], [tx + 34, 296], [tx - 34, 296], [tx - 40, 268], [tx - 44, 232], [tx - 40, 196], [tx - 26, 180]], 0.5);
  const head = S([[tx, 106], [tx + 15, 111], [tx + 20, 128], [tx + 18, 150], [tx + 9, 164], [tx, 168], [tx - 9, 164], [tx - 18, 150], [tx - 20, 128], [tx - 15, 111]], 0.55);
  const neck = S([[tx - 9, 162], [tx + 9, 162], [tx + 11, 180], [tx - 11, 180]], 0.4);
  const skirt = S([[tx - 40, 290], [tx + 40, 290], [tx + 56, 330], [tx + 58, 372], [tx - 58, 372], [tx - 56, 330]], 0.4);
  const armL = tube([[tx - 36, 198], [tx - 60, 240], [tx - 62, 290]], t => 15 - 4 * t); // holds the staff
  const handL = S([[tx - 72, 284], [tx - 58, 282], [tx - 52, 292], [tx - 58, 304], [tx - 72, 304], [tx - 78, 294]], 0.5);
  const armR = tube([[tx + 36, 198], [tx + 56, 236], [tx + 44, 272]], t => 15 - 4 * t); // rests on the knee
  const handR = S([[tx + 34, 266], [tx + 50, 264], [tx + 56, 274], [tx + 50, 286], [tx + 36, 286], [tx + 30, 276]], 0.5);
  const shins = [tube([[tx - 30, 370], [tx - 34, 410], [tx - 32, 436]], t => 18 - 3 * t), tube([[tx + 30, 370], [tx + 34, 410], [tx + 32, 436]], t => 18 - 3 * t)];
  const feet = [S([[tx - 50, 432], [tx - 20, 432], [tx - 18, 444], [tx - 54, 444]], 0.4), S([[tx + 20, 432], [tx + 50, 432], [tx + 54, 444], [tx + 18, 444]], 0.4)];
  const figure = [torso, head, neck, skirt, armL, handL, armR, handR, ...shins, ...feet];
  // ---------- the violet hour: the city's roofs and chimneys low on the horizon, a band of violet where the sky meets them, the sky hatched above
  const horizon = 300;
  const roofs = Path.poly([[px0, horizon], [px0, 272], [40, 272], [40, 258], [58, 258], [58, 280], [90, 280], [90, 262], [96, 262], [96, 250], [104, 250], [104, 262], [110, 262], [110, 280], [190, 280], [190, 266], [214, 266], [214, 276], [240, 276], [240, 256], [248, 256], [248, 276], [262, 276], [262, 268], [px1, 268], [px1, horizon]]);
  c.hatch(Path.rect(px0, py0, px1 - px0, 272 - py0), { angle: 0, spacing: 2.6, sw: 0.24, holes: figure.concat([roofs]), spacingFn: t => 5 - 3 * t, jitter: 0.3 });
  c.fill(Path.poly([[px0, 246], [px1, 246], [px1, 256], [px0, 256]]).add(new Path()), C.violet, { extra: '' });
  // (the violet band must sit behind the figure: cut the figure out of it)
  c.parts.pop(); c.hatch(Path.rect(px0, 246, px1 - px0, 10), { angle: 0, spacing: 0.9, sw: 1.0, color: C.violet, holes: figure.concat([roofs]), cap: 'butt' });
  c.hatch(roofs, { angle: 90, spacing: 1.4, sw: 0.32, holes: figure }); c.hatch(roofs, { angle: 0, spacing: 3.4, sw: 0.22, holes: figure });
  c.lines(clipTo(roofs.pts(2), [Path.rect(px0, py0, px1 - px0, horizon - py0).polys()[0]], figure.flatMap(f => f.polys())), { sw: 0.8 });
  // ground: flagstones
  c.draw(new Path().M(px0, horizon).L(px1, horizon), { sw: 0.7 });
  c.hatch(Path.rect(px0, horizon, px1 - px0, py1 - horizon), { angle: 0, spacing: 4.8, sw: 0.24, holes: figure, dash: [14, 50, 4, 16] });
  // the stone he sits on
  const stone = S([[tx - 70, 366], [tx + 70, 366], [tx + 74, 440], [tx - 74, 440]], 0.15);
  c.hatch(stone, { angle: 0, spacing: 2.6, sw: 0.26, holes: figure }); c.hatch(S([[tx + 40, 366], [tx + 70, 366], [tx + 74, 440], [tx + 44, 440]], 0.1), { angle: 60, spacing: 1.3, sw: 0.3, holes: figure, clip: stone });
  c.lines(clipTo(stone.pts(2), [Path.rect(0, 0, 300, 520).polys()[0]], figure.flatMap(f => f.polys())), { sw: 0.9 });
  // the two snakes coupling at his feet, on the ground
  const snake = (pts, w) => { const pl = Path.smooth(pts).pts(2); c.fill(tube(pl, t => w * (0.5 + 0.5 * Math.sin(Math.PI * Math.min(1, t * 1.2 + 0.1))))); };
  snake([[40, 452], [60, 442], [80, 452], [100, 444], [116, 452]], 5); snake([[126, 440], [104, 450], [82, 440], [60, 452], [44, 444]], 4.2);
  c.fill(Path.circle(40, 452, 1.2), INK); c.fill(Path.circle(126, 440, 1.2), INK);
  // ---------- the figure drawn
  c.hatch(skirt, { angle: 88, spacing: 2.2, sw: 0.26 }); c.drapery(skirt, [[[tx - 20, 296], [tx - 24, 340], [tx - 26, 372]], [[tx + 16, 296], [tx + 22, 340], [tx + 26, 372]]], { side: 1, width: 8, spacing: 1.4, sw: 0.3, foldSw: 0.7 }); c.outlineVar(skirt, { min: 0.6, max: 1.3, light: -120 });
  for (const s of shins) { c.hatch(s, { angle: 85, spacing: 2.0, sw: 0.24, spacingFn: t => 1.6 + 1.6 * t }); c.draw(s, { sw: 0.9 }); }
  for (const f of feet) { c.hatch(f, { angle: 20, spacing: 1.7, sw: 0.22 }); c.draw(f, { sw: 0.8 }); }
  // torso: old, thin; the wrinkled breasts; ribs; shading
  c.hatch(torso, { angle: 100, spacing: 2.8, sw: 0.2, spacingFn: t => 2 + 1.8 * (1 - t), jitter: 0.4 });
  c.hatch(S([[tx + 26, 180], [tx + 40, 196], [tx + 44, 232], [tx + 40, 268], [tx + 34, 296], [tx + 22, 296], [tx + 28, 260], [tx + 30, 220], [tx + 22, 196]], 0.4), { angle: 80, spacing: 1.3, sw: 0.28, clip: torso });
  c.outlineVar(torso, { min: 0.6, max: 1.3, light: -120 });
  for (const s of [-1, 1]) { c.draw(new Path().M(tx + s * 10, 210).C(tx + s * 24, 214, tx + s * 30, 232, tx + s * 20, 244).C(tx + s * 14, 250, tx + s * 8, 246, tx + s * 8, 238), { sw: 0.7 }); c.fill(Path.circle(tx + s * 18, 240, 1.4)); c.draw(new Path().M(tx + s * 12, 224).C(tx + s * 18, 226, tx + s * 22, 232, tx + s * 20, 238), { sw: 0.35 }); }
  for (let k = 0; k < 4; k++) c.draw(new Path().M(tx - 26 + k * 2, 252 + k * 8).C(tx - 10, 256 + k * 8, tx + 10, 256 + k * 8, tx + 26 - k * 2, 252 + k * 8), { sw: 0.3 });
  c.draw(new Path().M(tx, 250).L(tx, 288), { sw: 0.35 });
  for (const a of [armL, armR]) { c.hatch(a, { angle: 40, spacing: 2.0, sw: 0.24 }); c.draw(a, { sw: 0.85 }); }
  for (const h of [handL, handR]) { c.hatch(h, { angle: 20, spacing: 1.8, sw: 0.22 }); c.draw(h, { sw: 0.8 }); }
  c.draw(new Path().M(tx - 70, 302).L(tx - 68, 290).M(tx - 64, 304).L(tx - 62, 290).M(tx + 38, 284).L(tx + 40, 272).M(tx + 46, 285).L(tx + 48, 272), { sw: 0.4 });
  // the staff
  c.fill(Path.poly([[tx - 66, 150], [tx - 62, 150], [tx - 60, 440], [tx - 64, 440]]));
  c.hatch(neck, { angle: 90, spacing: 1.8, sw: 0.22 }); c.draw(neck, { sw: 0.7 });
  // the head: bald crown, long beard, blind eyes shut
  c.hatch(head, { angle: 100, spacing: 2.4, sw: 0.2, spacingFn: t => 1.6 + 2.4 * t }); c.draw(head, { sw: 0.9 });
  for (const x of [tx - 7, tx + 7]) { c.draw(new Path().M(x - 4.5, 134).C(x - 2, 137, x + 2, 137, x + 4.5, 134), { sw: 0.7 }); c.draw(new Path().M(x - 5, 130).C(x - 2, 127.5, x + 2, 127.5, x + 5, 130), { sw: 0.45 }); for (let k = -1; k <= 1; k++) c.draw(new Path().M(x + k * 2.2, 136).L(x + k * 2.6, 139), { sw: 0.3 }); }
  c.draw(new Path().M(tx, 136).C(tx - 1, 142, tx - 1.5, 146, tx - 2, 150).C(tx - 0.5, 151.5, tx + 0.5, 151.5, tx + 2, 150), { sw: 0.45 });
  const beard = S([[tx - 14, 150], [tx + 14, 150], [tx + 18, 170], [tx + 12, 200], [tx, 212], [tx - 12, 200], [tx - 18, 170]], 0.5);
  c.hatch(beard, { angle: 85, spacing: 1.4, sw: 0.3, jitter: 0.3 }); c.draw(beard, { sw: 0.6 });
  c.draw(new Path().M(tx - 6, 156).C(tx - 2, 158, tx + 2, 158, tx + 6, 156), { sw: 0.6 });
  // wrinkles on the brow, a fringe of hair round a bald crown
  for (const y of [116, 120]) c.draw(new Path().M(tx - 10, y).C(tx - 4, y - 2, tx + 4, y - 2, tx + 10, y), { sw: 0.3 });
  for (const s of [-1, 1]) for (let k = 0; k < 5; k++) c.draw(new Path().M(tx + s * (16 + k), 122 + k * 6).C(tx + s * (22 + k), 126 + k * 6, tx + s * (24 + k), 134 + k * 6, tx + s * (20 + k), 140 + k * 6), { sw: 0.5 });
  c.frame();
  return c;
};
