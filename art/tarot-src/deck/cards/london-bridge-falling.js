// CDXXVII  London Bridge is falling down falling down falling down: the middle arch gone into the river, the parapet broken, the stones still in the air.
const { Card, Path, C, INK, deg, rot, clipTo, clipPolyline, offsetPolyline } = require('../lib');
module.exports = function londonBridgeFalling() {
  const c = new Card({ name: 'London Bridge Falling Down', numeral: 'CDXXVII', seed: 427 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const all = [Path.rect(0, 0, 300, 520).polys()[0]];
  // ---------- the bridge: five arches across the card; the middle one broken, its roadway sagging into the gap
  const roadY = 250, springY = 300, footY = 360;
  const piers = [px0 + 14, 74, 128, 172, 226, px1 - 14]; // pier centres; the spans between them
  const pierW = 12;
  // the roadway: left half still level, the middle fallen, the right half tilted down toward the gap
  const roadL = Path.poly([[px0, roadY - 10], [118, roadY - 10], [124, roadY - 6], [118, roadY], [112, roadY + 6], [px0, roadY + 6]]);
  const roadR = Path.poly([[184, roadY + 4], [192, roadY - 2], [186, roadY - 8], [px1, roadY - 10], [px1, roadY + 6], [190, roadY + 12]]);
  const fallen = Path.poly([[124, roadY - 6], [180, roadY + 14], [176, roadY + 30], [150, roadY + 24], [126, roadY + 4]]); // the middle roadway, going down
  const parapetL = Path.rect(px0, roadY - 22, 118 - px0, 12); const parapetR = Path.poly([[186, roadY - 20], [px1, roadY - 22], [px1, roadY - 10], [186, roadY - 8]]);
  // the arches: each a span between two piers, the middle one collapsed
  const archShapes = []; const spandrels = [];
  for (let i = 0; i < piers.length - 1; i++) {
    const x0 = piers[i] + pierW / 2, x1 = piers[i + 1] - pierW / 2; const cx = (x0 + x1) / 2, r = (x1 - x0) / 2;
    const p = new Path().M(x0, footY).L(x0, springY).C(x0, springY - r * 1.2, x1, springY - r * 1.2, x1, springY).L(x1, footY).Z();
    archShapes.push({ p, x0, x1, cx, r, broken: i === 2 });
  }
  const bridgeMass = Path.poly([[px0, roadY + 6], [px1, roadY + 6], [px1, footY], [px0, footY]]);
  // the stones in the air: blocks from the fallen arch, tumbling, and in the water
  const stones = []; for (let i = 0; i < 14; i++) { const x = 130 + rnd.range(0, 44), y = 270 + rnd.range(0, 130); const w = rnd.range(5, 11), h = rnd.range(4, 8); stones.push(Path.rect(x - w / 2, y - h / 2, w, h).rotate(deg(rnd.range(-60, 60)), [x, y])); }
  // ---------- the sky and the fog above; the river below with the splash where the arch went in
  const holes = [roadL, roadR, fallen, parapetL, parapetR, ...stones];
  c.hatch(Path.rect(px0, py0, px1 - px0, roadY - 22 - py0), { angle: 0, spacing: 2.6, sw: 0.24, spacingFn: t => 1.6 + 3 * t, dash: [40, 30, 80, 20], jitter: 0.25, holes });
  // blast lines from the break, out through the fog
  const bx = 152, by = 262; const rays = []; for (let i = 0; i < 26; i++) { const a = deg(190 + i * 160 / 25 + rnd.range(-2, 2)); const r0 = 30 + rnd.range(0, 16), r1 = 80 + rnd.range(0, 90); rays.push([[bx + Math.cos(a) * r0, by + Math.sin(a) * r0], [bx + Math.cos(a) * r1, by + Math.sin(a) * r1]]); }
  c.lines(rays.flatMap(r => clipTo(r, [Path.rect(px0, py0, px1 - px0, roadY - 22 - py0).polys()[0]], holes.flatMap(h => h.polys()))), { sw: 0.45 });
  const river = Path.rect(px0, footY, px1 - px0, py1 - footY);
  const riverHoles = stones.concat(archShapes.filter(a => !a.broken).map(a => a.p));
  c.hatch(river, { angle: 0, spacing: 2.4, sw: 0.28, spacingFn: t => 1.8 + 2 * t, jitter: 0.2, holes: riverHoles });
  // the splash: rings and thrown water where the arch went in
  for (const r of [10, 20, 32, 46]) c.draw(Path.ellipse(152, 392, r * 1.9, r * 0.55), { sw: 0.5 - r * 0.006 });
  for (let i = 0; i < 24; i++) { const a = deg(-150 + i * 120 / 23 + rnd.range(-3, 3)); const r0 = 6 + rnd.range(0, 10), r1 = 20 + rnd.range(0, 40); c.draw(new Path().M(152 + Math.cos(a) * r0, 392 + Math.sin(a) * r0 * 0.6).L(152 + Math.cos(a) * r1, 392 + Math.sin(a) * r1 * 0.6), { sw: 0.5 }); }
  // ---------- the bridge drawn: the piers and the arches, stone by stone; the broken arch's ends jagged
  for (const a of archShapes) {
    if (a.broken) {
      // the stubs: two short jagged fragments still clinging to the piers
      const stubL = Path.poly([[a.x0, springY + 4], [a.x0, springY - 6], [a.x0 + 10, springY - 16], [a.x0 + 16, springY - 12], [a.x0 + 10, springY - 4], [a.x0 + 12, springY + 4]]);
      const stubR = Path.poly([[a.x1, springY + 4], [a.x1, springY - 4], [a.x1 - 8, springY - 14], [a.x1 - 16, springY - 10], [a.x1 - 10, springY - 2], [a.x1 - 12, springY + 4]]);
      for (const s of [stubL, stubR]) { c.hatch(s, { angle: 90, spacing: 1.3, sw: 0.28 }); c.draw(s, { sw: 0.9 }); }
      continue;
    }
    // the spandrel wall above the arch: coursed stone, the arch opening dark to the water
    const wall = Path.poly([[a.x0 - pierW / 2, roadY + 6], [a.x1 + pierW / 2, roadY + 6], [a.x1 + pierW / 2, footY], [a.x0 - pierW / 2, footY]]);
    c.hatch(wall, { angle: 90, spacing: 1.6, sw: 0.24, holes: [a.p], spacingFn: t => 1.2 + 1 * t });
    for (let y = roadY + 12; y < footY; y += 7) c.lines(clipTo([[a.x0 - pierW / 2, y], [a.x1 + pierW / 2, y]], wall.polys(), a.p.polys()), { sw: 0.3 });
    // the arch: dark inside, voussoirs round the edge
    c.hatch(a.p, { angle: 0, spacing: 1.2, sw: 0.32, clip: Path.poly([[a.x0, springY - a.r * 0.2], [a.x1, springY - a.r * 0.2], [a.x1, footY], [a.x0, footY]]) });
    c.hatch(a.p, { angle: 90, spacing: 1.8, sw: 0.24 });
    c.draw(a.p, { sw: 0.8 });
    const vs = []; for (let i = 0; i <= 8; i++) { const t = i / 8; const ang = Math.PI * (1 - t); const ox = a.cx + Math.cos(ang) * a.r, oy = springY - Math.sin(ang) * a.r * 0.9; const ix = a.cx + Math.cos(ang) * (a.r + 5), iy = springY - Math.sin(ang) * (a.r * 0.9 + 5); vs.push([[ox, oy], [ix, iy]]); } c.lines(vs, { sw: 0.4 });
  }
  // the piers: dark, with cutwaters
  for (const x of piers) { const p = Path.poly([[x - pierW / 2, springY - 4], [x + pierW / 2, springY - 4], [x + pierW / 2, footY + 14], [x, footY + 22], [x - pierW / 2, footY + 14]]); c.hatch(p, { angle: 90, spacing: 1.0, sw: 0.32 }); c.hatch(p, { angle: 0, spacing: 6, sw: 0.4 }); c.draw(p, { sw: 0.8 }); }
  // the roadway and parapets
  for (const r of [roadL, roadR]) { c.hatch(r, { angle: 0, spacing: 1.3, sw: 0.3 }); c.draw(r, { sw: 0.8 }); }
  for (const p of [parapetL, parapetR]) { c.hatch(p, { angle: 90, spacing: 2.2, sw: 0.26 }); c.draw(p, { sw: 0.7 }); for (let x = px0 + 6; x < px1; x += 8) { if (x > 112 && x < 190) continue; c.draw(new Path().M(x, roadY - 22).L(x, roadY - 10), { sw: 0.3 }); } }
  c.hatch(fallen, { angle: -20, spacing: 1.3, sw: 0.3 }); c.draw(fallen, { sw: 0.9 });
  // cracks running from the break into the standing halves
  c.lines([[[118, roadY - 20], [110, roadY - 8], [100, roadY + 2], [96, roadY + 20]], [[190, roadY - 18], [200, roadY - 4], [206, roadY + 10], [214, roadY + 30]], [[74, roadY + 6], [80, roadY + 30], [72, roadY + 50]]], { sw: 0.5 });
  // the stones drawn
  for (const s of stones) { c.hatch(s, { angle: 30, spacing: 1.2, sw: 0.28 }); c.draw(s, { sw: 0.7 }); }
  // three small figures on the left half, running from the break, black
  for (const [x, s] of [[96, 0.7], [80, 0.66], [56, 0.62]]) { const y = roadY - 22; c.fill(S([[x - 4 * s, y], [x - 3 * s, y - 14 * s], [x, y - 18 * s], [x + 3 * s, y - 14 * s], [x + 5 * s, y], [x + 2 * s, y - 2 * s], [x - 1 * s, y - 6 * s]], 0.4)); c.fill(Path.circle(x, y - 21 * s, 3 * s)); c.draw(new Path().M(x - 6 * s, y - 12 * s).L(x - 12 * s, y - 16 * s), { sw: 1.2 * s }); }
  c.frame();
  return c;
};
