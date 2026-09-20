// CCCXXXI  Here is no water but only rock: the sandy road winding up among the mountains of rock, the dead mountain mouth of carious teeth, the mudcracked houses with sullen faces at the doors.
const { Card, Path, C, INK, deg, clipTo, clipPolyline, offsetPolyline, voronoiCells } = require('../lib');
module.exports = function roadWithNoWater() {
  const c = new Card({ name: 'The Road with No Water', numeral: 'CCCXXXI', seed: 331 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const all = [Path.rect(0, 0, 300, 520).polys()[0]];
  // ---------- the road: sandy, winding up from the foreground to a gap between the two rock masses
  const vanish = [152, 236];
  const roadL = Path.smooth([[px0 + 4, py1], [64, 430], [112, 396], [108, 362], [128, 322], [144, 286], [149, 258], vanish], { tension: 0.5 });
  const roadR = Path.smooth([[px1 - 4, py1], [236, 434], [206, 400], [190, 366], [178, 326], [166, 290], [158, 260], [155, 244]], { tension: 0.5 });
  const lPts = roadL.pts(3), rPts = roadR.pts(3);
  const road = Path.poly([...lPts, ...rPts.slice().reverse()]);
  const roadPolys = road.polys();
  // ---------- the rock: two masses, left and right, angular, strata lines following their slopes
  const leftRock = Path.poly([[px0, 344], [px0, 150], [28, 132], [46, 106], [64, 118], [84, 96], [104, 120], [118, 148], [126, 190], [132, 226], [126, 262], [112, 300], [104, 340], [100, 372], [86, 400], [60, 424], [px0, 440]]);
  const rightRock = Path.poly([[px1, 470], [px1, 120], [268, 100], [246, 84], [222, 106], [204, 130], [194, 160], [178, 190], [170, 222], [168, 250], [176, 290], [190, 330], [204, 366], [218, 404], [236, 434], [262, 456]]);
  const farRange = Path.poly([[126, 236], [134, 214], [142, 226], [150, 208], [158, 220], [166, 210], [174, 226], [180, 236]]);
  // the sky: dry, high, a few far broken lines and no cloud that will rain
  c.hatch(Path.rect(px0, py0, px1 - px0, 200), { angle: 0, spacing: 4.2, sw: 0.2, dash: [30, 120, 8, 60], holes: [leftRock, rightRock, farRange], spacingFn: t => 3 + 3 * t });
  // dry sterile thunder: two thin cracks across the sky, with no rain under them
  c.lines(clipTo([[150, 60], [166, 76], [156, 92], [176, 112], [170, 130]], all, [leftRock, rightRock]), { sw: 0.4 });
  c.lines(clipTo([[196, 52], [186, 66], [200, 80], [192, 96]], all, [leftRock, rightRock]), { sw: 0.3 });
  // the far range in the gap: pale
  c.hatch(farRange, { angle: 30, spacing: 1.6, sw: 0.22 }); c.draw(farRange, { sw: 0.5 });
  // strata: lines that follow each mass's slope, thicker every fourth; black crevices
  const strata = (rock, angle, light) => {
    c.hatch(rock, { angle, spacing: 2.2, sw: 0.24, jitter: 0.25, spacingFn: t => 1.6 + 1.6 * t });
    c.hatch(rock, { angle, spacing: 9, sw: 0.7, jitter: 0.6, phase: 3 });
    c.outlineVar(rock, { min: 0.6, max: 1.3, light });
  };
  strata(leftRock, 14, -60); strata(rightRock, -12, -120);
  // crevices: black wedges in the rock faces, and ledges
  // crevices: black clefts in the rock faces, each a wedge that opens at the top and closes to a hair
  const cleft = (x, y, h, lean) => c.fill(Path.poly([[x, y], [x + 5, y + 1.5], [x + 3.2 + lean, y + h * 0.5], [x + lean * 1.6, y + h], [x - 0.4 + lean, y + h * 0.5]]));
  cleft(44, 148, 52, 2); cleft(86, 128, 48, -2); cleft(66, 248, 56, 1); cleft(36, 322, 44, 2);
  cleft(252, 110, 54, -1); cleft(220, 142, 50, 2); cleft(244, 302, 52, -2); cleft(266, 382, 50, 1);
  // ---------- the dead mountain mouth of carious teeth: a black opening in the right mass, the teeth bare and broken
  const mouth = S([[196, 190], [222, 178], [248, 182], [262, 200], [258, 224], [236, 240], [210, 238], [194, 222]], 0.45);
  const teeth = [];
  const tooth = (x0, x1, yb, tip, up) => Path.poly(up ? [[x0, yb], [x1, yb], [(x0 + x1) / 2 + 1, tip]] : [[x0, yb], [x1, yb], [(x0 + x1) / 2 - 1, tip]]);
  for (const [x0, x1, tip] of [[202, 210, 210], [214, 224, 222], [228, 238, 216], [242, 252, 206]]) teeth.push(tooth(x0, x1, 186, tip, true));
  for (const [x0, x1, tip] of [[206, 214, 220], [222, 232, 212], [240, 250, 222]]) teeth.push(tooth(x0, x1, 236, tip, false));
  // carious: two teeth broken off short
  teeth[1] = Path.poly([[214, 186], [224, 186], [222, 200], [216, 204]]); teeth[5] = Path.poly([[222, 236], [232, 236], [230, 228], [224, 226]]);
  c.fillEO([mouth, ...teeth]);
  for (const t of teeth) c.hatch(t, { angle: 90, spacing: 1.1, sw: 0.22, holes: [] });
  // ---------- the ground either side of the road: cracked earth (voronoi), nothing growing
  const ground = Path.poly([[px0, 344], [104, 340], [126, 262], [132, 226], [168, 250], [176, 290], [204, 366], [262, 456], [px1, 470], [px1, py1], [px0, py1]]);
  const groundPolys = ground.polys();
  const seeds = []; for (let i = 0; i < 70; i++) seeds.push([rnd.range(px0 - 10, px1 + 10), rnd.range(250, py1 + 10)]);
  const cells = voronoiCells(seeds, [[px0 - 20, 230], [px1 + 20, 230], [px1 + 20, py1 + 20], [px0 - 20, py1 + 20]]);
  const fissures = [];
  for (const cell of cells) { if (cell.length < 3) continue; const cx0 = cell.reduce((a, q) => a + q[0], 0) / cell.length, cy0 = cell.reduce((a, q) => a + q[1], 0) / cell.length; const shrunk = cell.map(p => [cx0 + (p[0] - cx0) * 0.92, cy0 + (p[1] - cy0) * 0.92]); fissures.push(...clipTo(shrunk.concat([shrunk[0]]), groundPolys, roadPolys.concat(leftRock.polys(), rightRock.polys()))); }
  c.lines(fissures, { sw: 0.5 });
  c.hatch(ground, { angle: 0, spacing: 4.4, sw: 0.2, holes: [road, leftRock, rightRock], jitter: 0.5, dash: [3, 22, 5, 18] });
  // ---------- the road itself: sand (stipple, denser near) and two ruts that follow it up
  c.stipple(road, { density: 0.16, sw: 0.5, densityFn: (x, y) => 0.02 + 0.2 * Math.pow((y - 240) / (py1 - 240), 2) });
  const mid = []; for (let i = 0; i < Math.min(lPts.length, rPts.length); i++) { const a = lPts[Math.floor(i * lPts.length / Math.min(lPts.length, rPts.length))], b = rPts[Math.floor(i * rPts.length / Math.min(lPts.length, rPts.length))]; mid.push([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]); }
  const widthAt = i => { const a = lPts[Math.floor(i * lPts.length / mid.length)], b = rPts[Math.floor(i * rPts.length / mid.length)]; return Math.abs(b[0] - a[0]); };
  for (const side of [-1, 1]) { const rut = mid.map((p, i) => [p[0] + side * widthAt(i) * 0.22, p[1]]); c.lines(clipTo(rut, roadPolys), { sw: 0.45 }); c.lines(clipTo(rut.map(p => [p[0] + side * 1.6, p[1] + 0.6]), roadPolys), { sw: 0.25 }); }
  c.draw(roadL, { sw: 0.9 }); c.draw(roadR, { sw: 0.9 });
  // dry grass singing: a few tufts by the road edge, brittle strokes
  const tuft = (x, y, s) => { for (let k = 0; k < 6; k++) { const dx = (k - 2.5) * 1.3 * s; c.draw(new Path().M(x + dx, y).L(x + dx * 1.8 + rnd.range(-1, 1), y - (7 + rnd.range(0, 6)) * s), { sw: 0.4 }); } };
  tuft(96, 372, 1); tuft(76, 412, 1.1); tuft(214, 384, 1); tuft(246, 444, 1.2); tuft(140, 296, 0.6);
  // ---------- the mudcracked houses: flat-roofed, small, on the slopes, each with a dark door and a red sullen face in it
  const house = (x, y, w, h, faceSide) => {
    const wall = Path.rect(x, y, w, h); const roof = Path.poly([[x - 2, y], [x + w + 2, y], [x + w + 4, y - 3], [x, y - 3]]);
    c.hatch(wall, { angle: 90, spacing: 1.6, sw: 0.22, spacingFn: t => 1.2 + 1.2 * t }); c.draw(wall, { sw: 0.7 });
    c.fill(roof); // a shadow of a roof-line
    // mudcracks in the wall
    c.lines([[[x + 3, y + 2], [x + 5, y + h * 0.4], [x + 3, y + h * 0.7]], [[x + w - 4, y + 3], [x + w - 6, y + h * 0.5], [x + w - 3, y + h - 2]], [[x + 2, y + h * 0.5], [x + w * 0.35, y + h * 0.55]]], { sw: 0.4 });
    // the door: dark, with a face looking out
    const dw = w * 0.32, dh = h * 0.7; const dx = faceSide < 0 ? x + 2.5 : x + w - dw - 2.5; const door = Path.rect(dx, y + h - dh, dw, dh);
    c.fill(door);
    const face = Path.ellipse(dx + dw / 2, y + h - dh + dh * 0.3, dw * 0.32, dw * 0.4); c.fill(face, C.rust);
    c.draw(new Path().M(dx + dw / 2 - dw * 0.16, y + h - dh + dh * 0.42).L(dx + dw / 2 + dw * 0.16, y + h - dh + dh * 0.38), { sw: 0.45 }); // the sneer
  };
  house(52, 300, 34, 26, 1); house(196, 314, 30, 24, -1); house(90, 262, 20, 16, 1);
  // a cicada on a foreground stone, small, the only living thing
  const stone = S([[214, 448], [234, 442], [244, 452], [236, 460], [216, 458]], 0.4); c.hatch(stone, { angle: 20, spacing: 1.4, sw: 0.24 }); c.draw(stone, { sw: 0.7 });
  c.fill(S([[222, 446], [232, 444], [236, 448], [230, 451], [222, 450]], 0.4)); c.draw(new Path().M(224, 446).L(220, 442).M(226, 445).L(224, 440).M(230, 444).L(236, 440).M(233, 445).L(238, 443), { sw: 0.35 });
  c.frame();
  return c;
};
