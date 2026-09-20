// LX  Unreal City: the crowd flowing over London Bridge under the brown fog, each man's eyes before his feet; St Mary Woolnoth keeping the hours.
const { Card, Path, C, INK, deg, clipTo, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function londonBridge() {
  const c = new Card({ name: 'The Crowd on London Bridge', numeral: 'LX', seed: 60 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  // ---------- fog: fine horizontal lines over everything above the river, thinning upward
  const fog = Path.rect(px0, py0, px1 - px0, 330 - py0);
  // ---------- the City beyond: St Mary Woolnoth's tower (two square turrets), a dome, chimneys, in the fog
  const church = S([[150, 112], [176, 112], [176, 130], [186, 130], [186, 232], [116, 232], [116, 130], [126, 130], [126, 112]], 0.15);
  const turrets = [Path.rect(128, 92, 12, 22), Path.rect(162, 92, 12, 22)];
  const dome = new Path().M(208, 232).C(208, 176, 272, 176, 272, 232).Z();
  const domeLantern = Path.rect(236, 160, 8, 18);
  const blocks = [Path.rect(px0, 196, 60, 40), Path.rect(64, 180, 40, 56), Path.rect(196, 206, 12, 30), Path.rect(274, 200, 10, 36)];
  const skyline = [church, ...turrets, dome, domeLantern, ...blocks];
  // ---------- the bridge: parapet across the card at y 280-300, arches below, the river at the bottom
  const parapetTop = 268, parapetBot = 290;
  const roadway = Path.poly([[px0, parapetBot], [px1, parapetBot], [px1, 312], [px0, 312]]);
  // ---------- the crowd: heads and shoulders packed along the parapet, bowler after bowler, all looking down, flowing right
  const crowd = []; const men = [];
  const rows = [[254, 1.0, 0], [242, 0.8, 10]];
  for (const [base, s, off] of rows) {
    for (let x = px0 - 6 + off; x < px1 + 8; x += 21 * s) {
      const xx = x + rnd.range(-2, 2), yy = base + rnd.range(-1.5, 1.5);
      const parts = [Path.circle(xx, yy - 10 * s, 5.2 * s), // head, bowed: slightly forward (right)
        Path.poly([[-8.5, -13], [8.5, -13], [8.5, -14.5], [5.5, -14.5], [5, -20], [0, -22], [-5, -20], [-5.5, -14.5], [-8.5, -14.5]]).scale(s).rotate(deg(18)).translate(xx + 1.5 * s, yy - 4 * s),
        S([[xx - 8 * s, yy - 4 * s], [xx + 8 * s, yy - 4 * s], [xx + 10 * s, yy + 14 * s], [xx - 10 * s, yy + 14 * s]], 0.35)];
      men.push(...parts);
    }
  }
  const menPolys = men.flatMap(m => m.polys());
  // fog and skyline
  c.hatch(fog, { angle: 0, spacing: 2.6, sw: 0.24, holes: skyline.concat(men), spacingFn: t => 4.4 - 2.4 * t, jitter: 0.25 });
  for (const b of skyline) { c.hatch(b, { angle: 90, spacing: 1.5, sw: 0.3, holes: men }); c.hatch(b, { angle: 0, spacing: 3, sw: 0.22, holes: men }); c.lines(clipTo(b.pts(2), [Path.rect(0, 0, 300, 520).polys()[0]], menPolys), { sw: 0.7 }); }
  // the church clock, at nine, in gold
  c.fill(Path.circle(151, 160, 12), C.gold); c.draw(Path.circle(151, 160, 12), { sw: 0.8 }); c.draw(new Path().M(151, 160).L(151, 152).M(151, 160).L(143, 160), { sw: 1.2 }); c.fill(Path.circle(151, 160, 1.2));
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; c.fill(Path.circle(151 + 10 * Math.cos(a), 160 + 10 * Math.sin(a), 0.6)); }
  // the parapet: a stone balustrade the crowd passes behind
  c.draw(new Path().M(px0, parapetTop).L(px1, parapetTop), { sw: 1.0 }); c.draw(new Path().M(px0, parapetBot).L(px1, parapetBot), { sw: 0.8 });
  c.hatch(Path.rect(px0, parapetTop, px1 - px0, parapetBot - parapetTop), { angle: 0, spacing: 1.6, sw: 0.26 });
  for (let x = px0 + 8; x < px1; x += 22) c.draw(new Path().M(x, parapetTop + 1).L(x, parapetBot - 1), { sw: 0.5 });
  // the crowd drawn: black
  for (const m of men) c.fill(m);
  // the road under the parapet, then the arches and the river
  c.hatch(roadway, { angle: 90, spacing: 1.4, sw: 0.32 }); c.hatch(roadway, { angle: 0, spacing: 2.2, sw: 0.24 });
  c.draw(new Path().M(px0, 312).L(px1, 312), { sw: 1.0 });
  // Rennie's bridge of 1831, the one the crowd walks over: five semi-elliptical arches, the centre one the widest and highest, stepping down to the banks
  const spring = 358;
  const arch = (x, w, rise) => new Path().M(x - w / 2, 400).L(x - w / 2, spring).C(x - w / 2, spring - rise * 1.333, x + w / 2, spring - rise * 1.333, x + w / 2, spring).L(x + w / 2, 400).Z();
  const piers = Path.poly([[px0, 312], [px1, 312], [px1, 400], [px0, 400]]);
  const spans = [[42, 20], [48, 24], [56, 28], [48, 24], [42, 20]]; const pierW = 8; // widths and rises; 236 + 4 piers of 8 = the picture's full 268
  const archShapes = []; let ax = px0; const pierX = [];
  spans.forEach(([w, rise], i) => { archShapes.push(arch(ax + w / 2, w, rise)); ax += w; if (i < 4) { pierX.push(ax + pierW / 2); ax += pierW; } });
  c.hatch(piers, { angle: 0, spacing: 4.2, sw: 0.4, holes: archShapes, dash: [10, 30, 3, 8] }); c.hatch(piers, { angle: 90, spacing: 9, sw: 0.4, holes: archShapes, dash: [4, 4.2, 4, 4.2] });
  for (const a of archShapes) { c.hatch(a, { angle: 0, spacing: 3.0, sw: 0.24, clip: Path.rect(px0, 312, px1 - px0, 88), spacingFn: t => 4 - 2 * t }); c.lines(clipTo(a.pts(2), [Path.rect(px0, 312, px1 - px0, 88).polys()[0]]), { sw: 1.0 }); c.lines(clipTo(offsetPolyline(a.pts(2), 3), [Path.rect(px0, 312, px1 - px0, 88).polys()[0]]), { sw: 0.4 }); }
  // the piers' cutwaters, pointed, breaking the water line
  for (const x of pierX) { const cw = Path.poly([[x - pierW / 2, 396], [x + pierW / 2, 396], [x + pierW / 2, 402], [x, 410], [x - pierW / 2, 402]]); c.hatch(cw, { angle: 90, spacing: 1.1, sw: 0.32 }); c.draw(cw, { sw: 0.7 }); }
  // the river: horizontal lines, a barge with a black sail
  c.draw(new Path().M(px0, 400).L(px1, 400), { sw: 0.7 });
  const river = Path.rect(px0, 400, px1 - px0, py1 - 400);
  const barge = S([[100, 442], [150, 440], [156, 452], [96, 454]], 0.3); const sail = Path.poly([[124, 440], [124, 404], [146, 438]]);
  c.hatch(river, { angle: 0, spacing: 2.6, sw: 0.26, holes: [barge, sail], spacingFn: t => 2 + 1.6 * t, jitter: 0.3 });
  c.fill(barge); c.fill(sail); c.draw(new Path().M(124, 440).L(124, 402), { sw: 0.8 });
  c.frame();
  return c;
};
