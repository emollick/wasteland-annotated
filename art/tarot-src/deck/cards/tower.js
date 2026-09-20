// CDXXX  Le Prince d'Aquitaine à la tour abolie: the ruined tower on its crag, the black sun of melancholy over it, the prince at its foot with his lute; his one star, dead.
const { Card, Path, C, INK, deg, rot, clipTo, clipPolyline, offsetPolyline, sunRings } = require('../lib');
const { tube } = require('../fig');
module.exports = function tower() {
  const c = new Card({ name: 'The Tower', numeral: 'CDXXX', seed: 430 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const all = [Path.rect(0, 0, 300, 520).polys()[0]];
  // ---------- the tower: a round keep on a crag, its top torn off, one side fallen away
  const tx = 118, tw = 56, base = 372, topY = 104;
  const shaft = Path.poly([[tx - tw / 2, base], [tx - tw / 2 + 2, 200], [tx - tw / 2 + 3, topY + 30], [tx - tw / 2 + 8, topY + 8], [tx - 14, topY + 16], [tx - 4, topY], [tx + 6, topY + 12], [tx + 14, topY - 2], [tx + 22, topY + 20], [tx + tw / 2 - 3, topY + 40], [tx + tw / 2 - 2, 200], [tx + tw / 2, base]]);
  // the fallen side: a bite out of the right-hand face high up, showing the hollow inside
  const bite = S([[tx + 10, topY + 24], [tx + tw / 2 - 2, topY + 44], [tx + tw / 2 - 2, topY + 96], [tx + 16, topY + 110], [tx + 4, topY + 80], [tx + 8, topY + 46]], 0.4);
  const door = Path.poly([[tx - 9, base], [tx - 9, base - 28], [tx - 6, base - 36], [tx, base - 39], [tx + 6, base - 36], [tx + 9, base - 28], [tx + 9, base]]);
  // the crag
  const crag = Path.poly([[px0, py1], [px0, 420], [40, 396], [64, 384], [90, 378], [tx - tw / 2 - 4, base + 2], [tx + tw / 2 + 4, base + 2], [176, 380], [200, 392], [230, 388], [256, 404], [px1, 412], [px1, py1]]);
  // ---------- the black sun of melancholy, over the sea to the right
  const sx = 226, sy = 132, sr = 24;
  const sun = Path.circle(sx, sy, sr);
  // ---------- the prince at the tower's foot, seated on a fallen stone, the lute across him, looking out to the right
  const kx = 214, ky = 372;
  const cloak = S([[kx - 16, ky - 50], [kx + 6, ky - 52], [kx + 20, ky - 36], [kx + 26, ky - 10], [kx + 30, ky + 14], [kx + 20, ky + 20], [kx - 10, ky + 20], [kx - 22, ky + 10], [kx - 24, ky - 16], [kx - 22, ky - 36]], 0.45);
  const head = S([[kx - 6, ky - 78], [kx + 6, ky - 78], [kx + 12, ky - 68], [kx + 11, ky - 56], [kx + 4, ky - 50], [kx - 6, ky - 50], [kx - 12, ky - 58], [kx - 12, ky - 70]], 0.5);
  const hair = S([[kx - 12, ky - 72], [kx - 4, ky - 82], [kx + 8, ky - 82], [kx + 14, ky - 72], [kx + 12, ky - 62], [kx + 6, ky - 70], [kx - 6, ky - 72], [kx - 12, ky - 64]], 0.45);
  const neck = S([[kx - 4, ky - 52], [kx + 6, ky - 52], [kx + 8, ky - 44], [kx - 6, ky - 44]], 0.4);
  const lute = S([[kx - 4, ky - 24], [kx + 14, ky - 26], [kx + 24, ky - 16], [kx + 22, ky - 2], [kx + 10, ky + 4], [kx - 6, ky + 2], [kx - 12, ky - 10]], 0.5);
  const luteNeck = Path.poly([[kx + 18, ky - 28], [kx + 40, ky - 46], [kx + 43, ky - 42], [kx + 22, ky - 22]]);
  const armL = tube([[kx - 14, ky - 40], [kx - 18, ky - 22], [kx - 4, ky - 8]], t => 9 - 2 * t);
  const armR = tube([[kx + 14, ky - 40], [kx + 30, ky - 32], [kx + 36, ky - 40]], t => 9 - 3 * t);
  const handL = S([[kx - 8, ky - 12], [kx + 2, ky - 12], [kx + 4, ky - 4], [kx - 4, ky - 2], [kx - 10, ky - 6]], 0.5);
  const handR = S([[kx + 32, ky - 46], [kx + 42, ky - 48], [kx + 44, ky - 40], [kx + 38, ky - 36], [kx + 30, ky - 40]], 0.5);
  const stone = S([[kx - 30, ky + 18], [kx + 34, ky + 18], [kx + 30, ky + 32], [kx - 26, ky + 34]], 0.35);
  const prince = [cloak, head, hair, neck, lute, luteNeck, armL, armR, handL, handR, stone];
  // ---------- the sky: bare in the main, with the rays of the black sun cut across it; a line of sea at the horizon
  const horizon = 300;
  const skyHoles = [shaft, sun, ...prince];
  c.hatch(Path.rect(px0, py0, px1 - px0, horizon - py0), { angle: 0, spacing: 3.2, sw: 0.2, dash: [40, 120, 10, 60], holes: skyHoles, spacingFn: t => 2.4 + 3 * t });
  // the sea: close lines from the horizon down to the crag
  const sea = Path.poly([[px0, horizon], [px1, horizon], [px1, 412], [256, 404], [230, 388], [200, 392], [176, 380], [tx + tw / 2 + 4, base + 2], [tx - tw / 2 - 4, base + 2], [90, 378], [64, 384], [40, 396], [px0, 420]]);
  c.hatch(sea, { angle: 0, spacing: 2.0, sw: 0.26, holes: [shaft, ...prince], spacingFn: t => 1.4 + 2.2 * t, jitter: 0.2 });
  c.draw(new Path().M(px0, horizon).L(px1, horizon), { sw: 0.6 });
  // the black sun: a black disc, a bare ring round it, and rays of darkness going out
  c.fill(sun);
  for (const r of sunRings(sx, sy, sr + 3, 3, 3)) c.draw(r.p, { sw: r.sw });
  const rays = []; for (let i = 0; i < 36; i++) { const a = i * Math.PI * 2 / 36 + 0.05; const r0 = sr + 16 + rnd.range(0, 6), r1 = sr + 40 + rnd.range(0, 40) * (i % 2 ? 1 : 0.5); rays.push([[sx + Math.cos(a) * r0, sy + Math.sin(a) * r0], [sx + Math.cos(a) * r1, sy + Math.sin(a) * r1]]); }
  c.lines(rays.flatMap(r => clipTo(r, [Path.rect(px0, py0, px1 - px0, horizon - py0).polys()[0]], [shaft])), { sw: 0.6 });
  // the one star, dead: gold, small, high at the left of the tower
  const star = (x, y, r) => { const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5; const rr = i % 2 ? r * 0.42 : r; pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); } return Path.poly(pts); };
  c.fill(star(52, 96, 6), C.gold); c.draw(star(52, 96, 6), { sw: 0.4 });
  // ---------- the crag: strata, dark, with a few clefts
  c.hatch(crag, { angle: 8, spacing: 1.8, sw: 0.26, holes: [door, ...prince], spacingFn: t => 1.3 + 1.6 * t, jitter: 0.3 });
  c.hatch(crag, { angle: 8, spacing: 9, sw: 0.7, holes: [door, ...prince], jitter: 0.6, phase: 4 });
  c.lines([crag.polys()[0].slice(1, 14)], { sw: 0.9 });
  for (const [x, y, h] of [[40, 404, 40], [252, 412, 44], [70, 430, 30]]) c.fill(Path.poly([[x, y], [x + 4, y + 1], [x + 2.6, y + h * 0.5], [x + 0.6, y + h], [x - 0.4, y + h * 0.5]]));
  // ---------- the tower drawn: round, so the lines crowd at both edges; courses of stone curving; slit windows; the bite; the door
  c.hatch(shaft, { angle: 90, spacing: 2, sw: 0.26, holes: [bite, door], spacingFn: t => 0.9 + 2.6 * Math.sin(Math.PI * t), jitter: 0.15 });
  const courses = []; for (let y = topY + 44; y < base - 6; y += 9) { const pts = []; for (let i = 0; i <= 12; i++) { const u = i / 12; const xx = tx - tw / 2 + tw * u; pts.push([xx, y + 3.5 * Math.sin(Math.PI * u)]); } courses.push(...clipTo(pts, shaft.polys(), [bite, door].flatMap(p => p.polys()))); }
  c.lines(courses, { sw: 0.34 });
  for (const [y, dx] of [[220, -8], [262, 10], [304, -6], [340, 8]]) c.fill(Path.poly([[tx + dx - 1.6, y], [tx + dx + 1.6, y], [tx + dx + 1.6, y + 12], [tx + dx - 1.6, y + 12]]));
  // the bite: the hollow inside is dark, cross-hatched; broken edges jagged
  c.hatch(bite, { angle: 60, spacing: 1.0, sw: 0.32 }); c.hatch(bite, { angle: 150, spacing: 1.4, sw: 0.26 }); c.draw(bite, { sw: 0.8 });
  // a torn top: the broken edge in a heavier line, and stones falling from it
  c.lines([shaft.polys()[0].slice(2, 10)], { sw: 1.2 }); c.outlineVar(shaft, { min: 0.6, max: 1.3, light: -120 });
  for (const [x, y, a] of [[tx + 30, topY - 10, 20], [tx + 40, topY + 6, -30], [tx + 46, topY + 34, 50], [tx - 30, topY + 2, 10]]) c.fill(Path.poly([[x - 3, y - 2], [x + 3, y - 3], [x + 2, y + 3], [x - 3, y + 2]]).rotate(deg(a), [x, y]));
  // stones fallen at the foot, on the crag
  for (const [x, y, w, h] of [[tx + 34, base - 4, 10, 6], [tx + 48, base + 4, 8, 5], [tx - 40, base + 8, 9, 6], [tx - 52, base + 14, 7, 5]]) { const st = S([[x, y], [x + w, y - 1], [x + w - 1, y + h], [x + 1, y + h + 1]], 0.3); c.hatch(st, { angle: 20, spacing: 1.2, sw: 0.26 }); c.draw(st, { sw: 0.6 }); }
  c.fill(door);
  // ---------- the prince drawn: the cloak dark with folds, the lute with its stars
  c.hatch(cloak, { angle: 86, spacing: 1.6, sw: 0.3, spacingFn: t => 1.1 + 1.4 * t, jitter: 0.25 });
  c.drapery(cloak, [[[kx - 8, ky - 40], [kx - 14, ky - 10], [kx - 12, ky + 18]], [[kx + 10, ky - 30], [kx + 18, ky - 4], [kx + 22, ky + 18]]], { side: 1, width: 8, spacing: 1.4, sw: 0.3, foldSw: 0.7 });
  c.outlineVar(cloak, { min: 0.6, max: 1.3, light: -120 });
  c.hatch(stone, { angle: 10, spacing: 1.3, sw: 0.26 }); c.draw(stone, { sw: 0.7 });
  for (const a of [armL, armR]) { c.hatch(a, { angle: 40, spacing: 1.6, sw: 0.26 }); c.draw(a, { sw: 0.8 }); }
  c.hatch(lute, { angle: 0, spacing: 1.4, sw: 0.24, spacingFn: t => 1 + 1.4 * t }); c.draw(lute, { sw: 0.8 }); c.draw(Path.circle(kx + 8, ky - 12, 4), { sw: 0.5 }); c.fill(Path.circle(kx + 8, ky - 12, 2.2));
  c.fill(luteNeck); c.lines([[[kx - 6, ky - 6], [kx + 40, ky - 44]], [[kx - 4, ky - 3], [kx + 41, ky - 42]], [[kx - 8, ky - 9], [kx + 39, ky - 46]]], { sw: 0.25 });
  // the lute constellated: small gold points on its belly
  for (const [x, y] of [[kx + 16, ky - 20], [kx + 20, ky - 8], [kx, ky - 18], [kx + 2, ky - 2], [kx + 14, ky + 1]]) c.fill(star(x, y, 1.8), C.gold);
  for (const h of [handL, handR]) { c.hatch(h, { angle: 30, spacing: 1.5, sw: 0.22 }); c.draw(h, { sw: 0.7 }); }
  c.hatch(neck, { angle: 90, spacing: 1.5, sw: 0.22 }); c.draw(neck, { sw: 0.7 });
  c.hatch(head, { angle: 100, spacing: 2.4, sw: 0.2, spacingFn: t => 1.6 + 2.4 * t }); c.draw(head, { sw: 0.9 });
  // a face in three-quarter, looking out to the right, the eyes low, the mouth closed
  c.fill(Path.ellipse(kx + 1, ky - 64, 1.6, 1.2)); c.fill(Path.ellipse(kx + 8, ky - 64, 1.4, 1.2)); c.draw(new Path().M(kx + 4, ky - 64).C(kx + 7, ky - 60, kx + 8, ky - 58, kx + 6, ky - 57), { sw: 0.5 }); c.draw(new Path().M(kx, ky - 54).C(kx + 3, ky - 53, kx + 6, ky - 53, kx + 9, ky - 55), { sw: 0.5 });
  c.fill(hair);
  c.frame();
  return c;
};
