// CCCLXVII  What is the city over the mountains: cracks and reforms and bursts in the violet air; falling towers; hooded hordes swarming over endless plains, stumbling in cracked earth.
const { Card, Path, C, INK, deg, rot, clipTo, clipPolyline, offsetPolyline, voronoiCells } = require('../lib');
module.exports = function fallingTowers() {
  const c = new Card({ name: 'The Falling Towers', numeral: 'CCCLXVII', seed: 367 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const all = [Path.rect(0, 0, 300, 520).polys()[0]];
  // ---------- the mountains: a ridge across the card; the plain below it, ringed by the flat horizon
  const ridgePts = [[px0, 318], [36, 300], [62, 308], [90, 288], [118, 302], [146, 292], [176, 306], [206, 290], [236, 304], [262, 296], [px1, 312]];
  const ridge = Path.poly([...ridgePts, [px1, 336], [px0, 336]]);
  const plain = Path.poly([[px0, 336], [px1, 336], [px1, py1], [px0, py1]]);
  // ---------- the towers: each a leaning block or two, standing on the ridge; one bursting
  const towers = []; // {blocks:[Path], lean, x, base, w}
  const towerSpec = [[42, 18, 120, -9, false], [82, 22, 176, 5, true], [124, 16, 140, -4, false], [160, 26, 214, 12, 'burst'], [204, 18, 160, -15, true], [244, 22, 118, 7, false], [274, 12, 96, -6, false]];
  const rectRot = (x, y0, w, h, ang, pivot) => Path.poly([[x - w / 2, y0], [x + w / 2, y0], [x + w / 2, y0 + h], [x - w / 2, y0 + h]]).rotate(deg(ang), pivot);
  for (const [x, w, h, lean, broken] of towerSpec) {
    const base = 312; const pivot = [x, base]; const blocks = [];
    if (!broken) blocks.push({ p: rectRot(x, base - h, w, h, lean, pivot), ang: lean, x, y0: base - h, w, h, pivot });
    else {
      const hb = h * 0.56; // lower block stands; the upper block has come away and leans further
      blocks.push({ p: rectRot(x, base - hb, w, hb, lean, pivot), ang: lean, x, y0: base - hb, w, h: hb, pivot });
      const extra = broken === 'burst' ? 16 : 9; const gap = broken === 'burst' ? 10 : 4; const top = base - hb - gap - (h - hb);
      const p2 = [x, base - hb - gap];
      blocks.push({ p: rectRot(x, top, w, h - hb, lean, pivot).rotate(deg(extra), rot(p2, deg(lean), pivot)), ang: lean + extra, x, y0: top, w, h: h - hb, pivot, pivot2: rot(p2, deg(lean), pivot), lean });
    }
    towers.push({ blocks, x, w, h, lean, broken });
  }
  const towerPaths = towers.flatMap(t => t.blocks.map(b => b.p));
  const towerPolys = towerPaths.flatMap(p => p.polys());
  // ---------- the sky: the violet air, hatched ink, dense at the top and paling down to the ridge
  const sky = Path.poly([[px0, py0], [px1, py0], [px1, 312], ...ridgePts.slice().reverse().map(p => [p[0], p[1]]), [px0, 318]]);
  c.hatch(sky, { angle: 0, spacing: 2.4, sw: 0.24, spacingFn: t => 1.6 + 3.4 * t, holes: towerPaths, jitter: 0.2 });
  // the burst: rays out of the fourth tower's break, straight, broken, through the air
  const burst = towers[3]; const bp = burst.blocks[1].pivot2; const bx = bp[0], by = bp[1] - 4;
  const rays = []; for (let i = 0; i < 40; i++) { const a = (i / 40) * Math.PI * 2 + 0.07; const r0 = 22 + rnd.range(0, 10), r1 = 70 + rnd.range(0, 70); rays.push([[bx + Math.cos(a) * r0, by + Math.sin(a) * r0], [bx + Math.cos(a) * r1, by + Math.sin(a) * r1]]); }
  const rayLines = rays.flatMap(r => clipTo(r, sky.polys(), towerPolys)); c.lines(rayLines, { sw: 0.5 });
  const rays2 = []; for (let i = 0; i < 40; i++) { const a = ((i + 0.5) / 40) * Math.PI * 2; const r0 = 40 + rnd.range(0, 20), r1 = 120 + rnd.range(0, 60); rays2.push([[bx + Math.cos(a) * r0, by + Math.sin(a) * r0], [bx + Math.cos(a) * r1, by + Math.sin(a) * r1]]); }
  c.lines(rays2.flatMap(r => clipTo(r, sky.polys(), towerPolys)), { sw: 0.24 });
  // shards in the violet air: flat, small, flying outward
  const shards = [[bx - 44, by - 40, 6, -30], [bx + 38, by - 52, 5, 20], [bx - 26, by - 78, 4, 60], [bx + 60, by - 20, 5, -10], [bx + 20, by - 96, 4, 40], [bx - 70, by - 12, 4, 15], [bx + 82, by - 70, 3.5, 70], [bx - 58, by - 62, 3.5, -50]];
  for (const [x, y, s, a] of shards) { const sh = Path.poly([[x, y - s * 1.6], [x + s, y + s * 0.9], [x - s * 0.9, y + s * 0.6]]).rotate(deg(a), [x, y]); c.fill(sh, C.violet); }
  // ---------- the towers drawn: courses of stone, windows, cracks; the break edges jagged
  for (const t of towers) {
    t.blocks.forEach((b, k) => {
      const P = p => rot(p, deg(b.ang), b.pivot2 ? b.pivot2 : b.pivot);
      // for the upper block of a broken tower, rotate first by the lean about the base and then by the extra about the break
      const Q = b.pivot2 ? (p => rot(rot(p, deg(b.lean), b.pivot), deg(b.ang - b.lean), b.pivot2)) : P;
      c.hatch(b.p, { angle: 90 + b.ang, spacing: 1.4, sw: 0.24, spacingFn: tt => 1.0 + 1.8 * tt });
      // courses of stone
      const courses = []; for (let y = b.y0 + 6; y < b.y0 + b.h - 3; y += 7) courses.push([Q([b.x - b.w / 2, y]), Q([b.x + b.w / 2, y])]);
      c.lines(courses, { sw: 0.32 });
      // windows: two columns of dark slits
      for (let y = b.y0 + 10; y < b.y0 + b.h - 10; y += 14) for (const dx of [-b.w * 0.24, b.w * 0.24]) { const win = Path.poly([Q([b.x + dx - 1.6, y]), Q([b.x + dx + 1.6, y]), Q([b.x + dx + 1.6, y + 6]), Q([b.x + dx - 1.6, y + 6])]); c.fill(win); }
      c.outlineVar(b.p, { min: 0.6, max: 1.3, light: -70 });
      // cracks: jagged lines down the face
      const cr = []; let x = b.x + rnd.range(-b.w * 0.3, b.w * 0.3); for (let y = b.y0 + 4; y < b.y0 + b.h - 4; y += 9) { cr.push(Q([x, y])); x += rnd.range(-4, 4); x = Math.max(b.x - b.w / 2 + 2, Math.min(b.x + b.w / 2 - 2, x)); }
      if (cr.length > 1) c.lines([cr], { sw: 0.55 });
      if (t.broken && k === 0) { // the break: a jagged top edge, rubble flying
        const jag = []; for (let i = 0; i <= 6; i++) jag.push(Q([b.x - b.w / 2 + (b.w * i) / 6, b.y0 + (i % 2 ? -3 : 2)])); c.lines([jag], { sw: 0.9 });
        for (let i = 0; i < 7; i++) { const p = Q([b.x + rnd.range(-b.w * 0.7, b.w * 0.7), b.y0 - rnd.range(4, 18)]); c.fill(Path.poly([[p[0], p[1] - 1.6], [p[0] + 1.6, p[1] + 1], [p[0] - 1.4, p[1] + 1]])); }
      }
    });
  }
  // ---------- the mountains: strata under the ridge
  c.hatch(ridge, { angle: 10, spacing: 1.8, sw: 0.26, spacingFn: t => 1.4 + 1.4 * t, holes: towerPaths }); c.lines([ridgePts], { sw: 0.9 });
  c.lines([ridgePts.map(p => [p[0] + 6, p[1] + 12])].map(pl => pl.filter(p => p[0] < px1)), { sw: 0.4 });
  // ---------- the plain: cracked earth; hooded hordes swarming over it, stumbling
  const hordes = [];
  const hooded = (x, y, s, tilt) => { const p = S([[0, -13], [4, -11], [5, -6], [4, -1], [6, 6], [-6, 6], [-4, -1], [-5, -6], [-4, -11]], 0.45).scale(s, s).rotate(deg(tilt), [0, 6]).translate(x, y); return p; };
  const rows = [[344, 0.5, 9], [360, 0.62, 11], [382, 0.78, 13], [408, 0.95, 16], [440, 1.15, 20]];
  for (const [y, s, step] of rows) { for (let x = px0 + rnd.range(2, step); x < px1 - 4; x += step + rnd.range(-3, 3)) { if (rnd() < 0.18) continue; hordes.push(hooded(x, y + rnd.range(-2, 2), s, rnd.range(-18, 18))); } }
  const hordePolys = hordes.flatMap(h => h.polys());
  const seeds = []; for (let i = 0; i < 60; i++) seeds.push([rnd.range(px0 - 10, px1 + 10), rnd.range(336, py1 + 10)]);
  const cells = voronoiCells(seeds, [[px0 - 20, 320], [px1 + 20, 320], [px1 + 20, py1 + 20], [px0 - 20, py1 + 20]]);
  const fissures = [];
  for (const cell of cells) { if (cell.length < 3) continue; const cx0 = cell.reduce((a, q) => a + q[0], 0) / cell.length, cy0 = cell.reduce((a, q) => a + q[1], 0) / cell.length; const shrunk = cell.map(p => [cx0 + (p[0] - cx0) * 0.93, cy0 + (p[1] - cy0) * 0.93]); fissures.push(...clipTo(shrunk.concat([shrunk[0]]), plain.polys(), hordePolys)); }
  c.lines(fissures, { sw: 0.45 });
  c.hatch(plain, { angle: 0, spacing: 4.6, sw: 0.2, holes: hordes, jitter: 0.5, dash: [3, 20, 4, 16] });
  for (const h of hordes) c.fill(h);
  c.frame();
  return c;
};
