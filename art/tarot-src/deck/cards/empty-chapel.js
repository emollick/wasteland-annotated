// CCCLXXXVI  In this decayed hole among the mountains, in the faint moonlight, the grass is singing over the tumbled graves, about the chapel: no windows, the door swings, a cock on the rooftree in a flash of lightning.
const { Card, Path, C, INK, deg, clipTo, clipPolyline, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function emptyChapel() {
  const c = new Card({ name: 'The Empty Chapel', numeral: 'CCCLXXXVI', seed: 386 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const all = [Path.rect(0, 0, 300, 520).polys()[0]];
  // ---------- the chapel: a small nave, gable end toward us, no windows; the door hangs open; the cock on the rooftree
  const cx = 150, groundY = 352;
  const gable = Path.poly([[cx - 40, groundY], [cx - 40, 268], [cx, 226], [cx + 40, 268], [cx + 40, groundY]]);
  const side = Path.poly([[cx + 40, groundY], [cx + 40, 268], [cx + 96, 288], [cx + 96, groundY]]);
  const roof = Path.poly([[cx, 226], [cx + 40, 268], [cx + 96, 288], [cx + 58, 244]]);
  const roofEdge = Path.poly([[cx - 44, 270], [cx, 222], [cx + 44, 270], [cx + 40, 268], [cx, 228], [cx - 40, 268]]);
  const doorway = Path.rect(cx - 12, groundY - 46, 24, 46);
  const door = Path.poly([[cx + 12, groundY - 46], [cx + 30, groundY - 38], [cx + 30, groundY + 4], [cx + 12, groundY]]); // swung open, out toward the right
  // the cock on the rooftree: in profile facing left, neck stretched, beak open, tail up
  const kx = cx + 2, ky = 226;
  const cockBody = S([[kx - 4, ky - 6], [kx + 8, ky - 8], [kx + 14, ky - 4], [kx + 12, ky + 1], [kx, ky + 1], [kx - 8, ky - 2]], 0.5);
  const cockNeck = tube([[kx - 4, ky - 6], [kx - 12, ky - 14], [kx - 18, ky - 22]], t => 6 - 2.5 * t);
  const cockHead = S([[kx - 22, ky - 22], [kx - 16, ky - 26], [kx - 13, ky - 22], [kx - 15, ky - 17], [kx - 21, ky - 17]], 0.5);
  const beak = Path.poly([[kx - 22, ky - 22], [kx - 31, ky - 24], [kx - 23, ky - 20]]); const beak2 = Path.poly([[kx - 22, ky - 19.5], [kx - 29, ky - 16], [kx - 22, ky - 17.5]]);
  const comb = S([[kx - 19, ky - 26], [kx - 17, ky - 32], [kx - 14, ky - 27], [kx - 11, ky - 32], [kx - 9, ky - 25], [kx - 13, ky - 24]], 0.3);
  const wattle = S([[kx - 19, ky - 17], [kx - 16, ky - 17], [kx - 16, ky - 11], [kx - 19, ky - 12]], 0.4);
  const tail = S([[kx + 12, ky - 6], [kx + 20, ky - 18], [kx + 28, ky - 30], [kx + 31, ky - 24], [kx + 26, ky - 12], [kx + 32, ky - 14], [kx + 30, ky - 6], [kx + 20, ky - 2]], 0.4);
  const legs = Path.poly([[kx + 2, ky + 1], [kx + 2, ky + 7], [kx + 8, ky + 1], [kx + 8, ky + 7]]);
  const cock = [cockBody, cockNeck, cockHead, beak, beak2, comb, wattle, tail];
  // ---------- the lightning: a flash from the top right down to behind the chapel, bare paper in the dark sky
  const flashPts = [[236, py0], [222, 92], [234, 110], [206, 150], [220, 166], [190, 206], [198, 218], [176, 246]];
  const flash = Path.poly([...flashPts, ...flashPts.slice().reverse().map((p, i) => [p[0] + 4 + (i % 2) * 2, p[1] + 1])]);
  const flashBranch = Path.poly([[206, 150], [186, 172], [196, 190], [200, 188], [192, 172], [210, 153]]);
  // ---------- the moon, faint, at the upper left behind haze
  const moon = Path.circle(58, 92, 14);
  // ---------- the mountains: two dark slopes closing the hole in
  const mtnL = Path.poly([[px0, 300], [px0, 170], [30, 150], [60, 176], [90, 196], [116, 236], [124, 268], [110, 300]]);
  const mtnR = Path.poly([[px1, 320], [px1, 148], [266, 168], [240, 182], [222, 214], [212, 256], [220, 300], [240, 320]]);
  // ---------- the night sky: dense cross-hatch, with the moon and the flash as holes; the moonlight a paler ring around the moon
  const chapelParts = [gable, side, roof, roofEdge, ...cock, legs, flash, flashBranch, moon, mtnL, mtnR];
  const sky = Path.rect(px0, py0, px1 - px0, groundY - py0);
  const moonHalo = Path.circle(58, 92, 34);
  c.hatch(sky, { angle: 0, spacing: 1.5, sw: 0.28, holes: chapelParts.concat([moonHalo]), jitter: 0.15 });
  c.hatch(sky, { angle: 90, spacing: 2.2, sw: 0.22, holes: chapelParts.concat([moonHalo]), jitter: 0.15 });
  c.hatch(moonHalo, { angle: 0, spacing: 2.4, sw: 0.22, holes: [moon], spacingFn: t => 3.4 - 1.6 * t }); c.hatch(moonHalo, { angle: 90, spacing: 4, sw: 0.18, holes: [moon] });
  c.draw(moon, { sw: 0.5 }); c.hatch(Path.circle(58, 92, 14), { angle: 30, spacing: 4.5, sw: 0.18, holes: [Path.circle(52, 88, 9)] });
  // the flash itself: a thin ink core down its middle and a hair of paper either side
  c.lines([flashPts.map(p => [p[0] + 2.4, p[1] + 0.5])], { sw: 0.5 }); c.draw(new Path().M(207, 151).L(187, 172).L(197, 190), { sw: 0.4 });
  // the mountains: strata, dark
  for (const [m, a] of [[mtnL, 20], [mtnR, -20]]) { c.hatch(m, { angle: a, spacing: 1.4, sw: 0.3, spacingFn: t => 1.1 + 1.2 * t }); c.hatch(m, { angle: a + 90, spacing: 5, sw: 0.22 }); c.draw(m, { sw: 0.8 }); }
  // ---------- the chapel drawn: blank walls (no windows), the roof's tiles, the open door and the dark inside
  c.hatch(gable, { angle: 90, spacing: 1.6, sw: 0.24, holes: [doorway], spacingFn: t => 1.2 + 1.2 * t, jitter: 0.2 });
  c.hatch(gable, { angle: 0, spacing: 6, sw: 0.24, holes: [doorway], jitter: 0.8, dash: [8, 4, 14, 6] });
  c.hatch(side, { angle: 90, spacing: 1.1, sw: 0.3, spacingFn: t => 0.9 + 0.8 * t }); c.hatch(side, { angle: 0, spacing: 6, sw: 0.2 });
  c.hatch(roof, { angle: -20, spacing: 2.4, sw: 0.3 }); c.hatch(roof, { angle: 44, spacing: 6, sw: 0.22 });
  c.fill(roofEdge);
  c.draw(gable, { sw: 0.9 }); c.draw(side, { sw: 0.8 }); c.draw(roof, { sw: 0.7 });
  // a crack in the gable, and a fallen stone or two
  c.lines([[[cx - 28, 276], [cx - 24, 300], [cx - 30, 320], [cx - 26, 350]]], { sw: 0.5 });
  c.fill(doorway); c.hatch(door, { angle: 84, spacing: 1.3, sw: 0.3 }); c.draw(door, { sw: 0.8 }); c.draw(new Path().M(cx + 15, groundY - 40).L(cx + 27, groundY - 33).M(cx + 15, groundY - 16).L(cx + 27, groundY - 12), { sw: 0.4 });
  // the cock drawn
  c.hatch(cockBody, { angle: 20, spacing: 1.1, sw: 0.3 }); c.draw(cockBody, { sw: 0.7 });
  c.hatch(cockNeck, { angle: 60, spacing: 1.0, sw: 0.3 }); c.draw(cockNeck, { sw: 0.7 });
  c.hatch(tail, { angle: 60, spacing: 1.2, sw: 0.3 }); c.draw(tail, { sw: 0.7 }); c.draw(new Path().M(kx + 14, ky - 6).L(kx + 26, ky - 26).M(kx + 16, ky - 4).L(kx + 28, ky - 12), { sw: 0.5 });
  c.hatch(cockHead, { angle: 60, spacing: 1.0, sw: 0.26 }); c.draw(cockHead, { sw: 0.7 }); c.fill(Path.circle(kx - 17, ky - 22, 1.1));
  c.fill(beak); c.fill(beak2); c.fill(comb, C.gold); c.draw(comb, { sw: 0.4 }); c.fill(wattle, C.gold); c.draw(wattle, { sw: 0.4 });
  c.draw(legs, { sw: 0.9 });
  // Co co rico: three short strokes from the open beak
  c.lines([[[kx - 34, ky - 26], [kx - 40, ky - 28]], [[kx - 34, ky - 22], [kx - 41, ky - 22]], [[kx - 33, ky - 18], [kx - 39, ky - 15]]], { sw: 0.5 });
  // ---------- the ground: tumbled graves, singing grass, dry bones
  const ground = Path.rect(px0, groundY, px1 - px0, py1 - groundY);
  const stones = [];
  const stone = (x, y, w, h, tilt, round) => { const p = (round ? S([[x - w / 2, y], [x - w / 2, y - h * 0.7], [x, y - h], [x + w / 2, y - h * 0.7], [x + w / 2, y]], 0.35) : Path.poly([[x - w / 2, y], [x - w / 2, y - h], [x + w / 2, y - h + 2], [x + w / 2, y]])).rotate(deg(tilt), [x, y]); stones.push(p); return p; };
  stone(46, 380, 14, 24, -22, true); stone(84, 400, 12, 20, 14, false); stone(232, 388, 16, 26, 26, true); stone(262, 420, 12, 18, -10, false); stone(120, 430, 15, 22, -30, true); stone(196, 444, 12, 16, 18, false);
  c.hatch(ground, { angle: 0, spacing: 3.2, sw: 0.22, holes: stones, dash: [10, 40, 4, 20], jitter: 0.5, spacingFn: t => 2.4 + 2.4 * t });
  for (const s of stones) { c.hatch(s, { angle: 90, spacing: 1.3, sw: 0.26 }); c.draw(s, { sw: 0.7 }); }
  // grass, singing: tufts everywhere, tallest about the graves
  for (let i = 0; i < 70; i++) { const x = rnd.range(px0 + 4, px1 - 4), y = rnd.range(groundY + 4, py1 - 4); if (Math.abs(x - cx) < 46 && y < groundY + 10) continue; const h = rnd.range(5, 14) * (0.6 + 0.6 * (y - groundY) / (py1 - groundY)); for (let k = 0; k < 4; k++) { const dx = (k - 1.5) * 1.4; c.draw(new Path().M(x + dx, y).C(x + dx + rnd.range(-2, 2), y - h * 0.5, x + dx * 2 + rnd.range(-3, 3), y - h * 0.8, x + dx * 2.4 + rnd.range(-4, 4), y - h), { sw: 0.38 }); } }
  // dry bones by a grave: a skull and two long bones, harmless
  c.draw(Path.circle(160, 452, 5), { sw: 0.7 }); c.fill(Path.ellipse(158, 451, 1.3, 1.7)); c.fill(Path.ellipse(163, 451, 1.3, 1.7)); c.draw(new Path().M(157, 456).L(164, 456), { sw: 0.5 });
  c.draw(new Path().M(140, 462).L(154, 458), { sw: 1.0 }); c.draw(new Path().M(168, 460).L(182, 462), { sw: 1.0 });
  // a damp gust bringing rain: the first slant lines, only at the right edge
  const rain = []; for (let i = 0; i < 26; i++) { const x = rnd.range(236, px1), y = rnd.range(py0 + 4, 300); rain.push([[x, y], [x - 5, y + 16]]); }
  c.lines(rain.flatMap(r => clipTo(r, all, [flash, mtnR])), { sw: 0.5 });
  c.frame();
  return c;
};
