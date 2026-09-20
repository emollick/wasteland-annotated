// LI  The Man with Three Staves. From behind on a cracked headland: a crutch, a rod over the water, a staff planted and sprouting.
const { Card, Path, C, INK, deg, clipPolyline, offsetPolyline, voronoiCells, sunRings, dist } = require('../lib');
const { tube } = require('../fig');
module.exports = function threeStaves() {
  const c = new Card({ name: 'The Man with Three Staves', numeral: 'LI', seed: 51 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const horizon = 236, cx = 142;
  // ---------- figure (from behind)
  const hem = [[cx + 62, 394], [cx + 50, 400], [cx + 36, 396], [cx + 18, 402], [cx + 2, 398], [cx - 14, 403], [cx - 30, 397], [cx - 46, 401], [cx - 62, 394]];
  const cloak = S([[cx, 140], [cx + 22, 143], [cx + 36, 152], [cx + 40, 176], [cx + 44, 230], [cx + 50, 300], [cx + 56, 360], ...hem, [cx - 56, 360], [cx - 50, 300], [cx - 44, 230], [cx - 40, 176], [cx - 36, 152], [cx - 22, 143]], 0.4);
  const hair = S([[cx, 96], [cx + 12, 99], [cx + 18, 110], [cx + 19, 124], [cx + 15, 133], [cx + 8, 137], [cx + 2, 134], [cx - 5, 138], [cx - 12, 135], [cx - 18, 126], [cx - 19, 112], [cx - 12, 100]], 0.5);
  const neck = tube([[cx, 130], [cx, 146]], () => 13);
  const sleeveR = tube([[cx + 26, 162], [cx + 56, 180], [cx + 74, 198]], t => 17 - 5 * t);
  const handR = S([[cx + 68, 194], [cx + 82, 190], [cx + 90, 198], [cx + 86, 210], [cx + 74, 212], [cx + 66, 204]], 0.5);
  const sleeveL = tube([[cx - 26, 162], [cx - 44, 180], [cx - 48, 200]], t => 17 - 5 * t);
  const handL = S([[cx - 56, 196], [cx - 42, 194], [cx - 38, 204], [cx - 42, 214], [cx - 54, 214], [cx - 60, 206]], 0.5);
  const figure = [cloak, hair, neck, sleeveR, handR, sleeveL, handL];
  const figPolys = figure.flatMap(f => f.polys());
  // ---------- sky: bare; low sun (rust) with the engraver's rings; thin lines near the horizon
  const sun = [78, 216], sr = 14;
  const skyBand = Path.rect(px0, 190, px1 - px0, horizon - 190);
  c.hatch(skyBand, { angle: 0, spacing: 3.8, sw: 0.22, holes: figure.concat([Path.circle(sun[0], sun[1], sr + 22)]), dash: [50, 140, 6, 30] });
  for (const r of sunRings(sun[0], sun[1], sr, 5, 3.4)) c.lines(clipPolyline(r.p.pts(2), [Path.rect(px0, py0, px1 - px0, horizon - py0).polys()[0]].concat(figPolys)), { sw: r.sw });
  c.fill(Path.circle(sun[0], sun[1], sr), C.rust); c.draw(Path.circle(sun[0], sun[1], sr), { sw: 0.7 });
  // ---------- water
  const water = Path.rect(px0, horizon, px1 - px0, 336 - horizon);
  const glitter = Path.poly([[sun[0] - 9, horizon], [sun[0] + 9, horizon], [sun[0] + 22, 336], [sun[0] - 24, 336]]);
  c.hatch(water, { angle: 0, spacing: 2.2, sw: 0.3, holes: figure.concat([glitter]), spacingFn: t => 3.6 - 1.8 * t });
  c.hatch(glitter, { angle: 0, spacing: 3.4, sw: 0.36, dash: [2, 7, 2, 5], holes: figure });
  c.draw(new Path().M(px0, horizon).L(px1, horizon), { sw: 0.55 });
  // a spritsail barge far out on the water, and a smaller sail beyond
  const barge = (x, y, s) => { c.fill(Path.poly([[x - 12 * s, y], [x + 12 * s, y], [x + 10 * s, y + 3 * s], [x - 11 * s, y + 3 * s]])); c.draw(new Path().M(x - 2 * s, y).L(x - 2 * s, y - 22 * s), { sw: 0.7 }); const sail = Path.poly([[x - 1 * s, y - 21 * s], [x + 11 * s, y - 6 * s], [x - 1 * s, y - 1 * s]]); c.hatch(sail, { angle: 70, spacing: 1.2 * s, sw: 0.3 }); c.draw(sail, { sw: 0.6 }); c.draw(new Path().M(x - 2 * s, y - 21 * s).L(x - 13 * s, y - 1 * s), { sw: 0.35 }); };
  barge(236, 232, 0.9); barge(206, 227, 0.5);
  // ---------- the headland: cracked earth on top (voronoi fissures), a strata face below the edge
  const edgePts = [[px0, 334], [40, 328], [90, 332], [140, 326], [190, 330], [240, 324], [px1, 328]];
  const edge = Path.smooth(edgePts);
  const top = Path.poly([...edge.pts(3), [px1, py1], [px0, py1]]);
  const topPolys = top.polys().concat(figPolys);
  const seeds = []; for (let i = 0; i < 46; i++) seeds.push([rnd.range(px0 - 10, px1 + 10), rnd.range(326, py1 + 10)]);
  const cells = voronoiCells(seeds, [[px0 - 20, 300], [px1 + 20, 300], [px1 + 20, py1 + 20], [px0 - 20, py1 + 20]]);
  const fissures = [];
  for (const cell of cells) { if (cell.length < 3) continue; const shrunk = cell.map(p => { const cx0 = cell.reduce((a, q) => a + q[0], 0) / cell.length, cy0 = cell.reduce((a, q) => a + q[1], 0) / cell.length; return [cx0 + (p[0] - cx0) * 0.93, cy0 + (p[1] - cy0) * 0.93]; }); fissures.push(...clipPolyline(shrunk.concat([shrunk[0]]), topPolys)); }
  c.lines(fissures, { sw: 0.55 });
  // dust: light broken horizontal strokes over the ground
  c.hatch(top, { angle: 0, spacing: 4.6, sw: 0.22, holes: figure, jitter: 0.6, dash: [4, 26, 4, 22] });
  c.draw(edge, { sw: 0.9 });
  // a dead tree at the left edge, black
  const tree = new Path().M(38, 336).L(44, 336).L(43, 300).L(46, 284).L(56, 272).L(66, 266).L(74, 254).L(72, 252).L(64, 262).L(54, 268).L(48, 274).L(48, 258).L(54, 240).L(58, 232).L(56, 230).L(50, 240).L(46, 250).L(44, 238).L(40, 226).L(37, 228).L(41, 244).L(42, 262).L(34, 252).L(28, 250).L(22, 240).L(20, 242).L(26, 254).L(34, 262).L(40, 276).L(39, 292).L(33, 300).L(26, 302).L(27, 305).L(36, 304).L(38, 316).Z();
  c.fill(tree);
  // ---------- the three staves
  // planted staff at the right, forked, with two small leaves beginning to sprout
  c.fill(tube([[248, 118], [250, 376]], () => 3.4));
  c.draw(new Path().M(248, 118).L(242, 108).M(248, 118).L(255, 110), { sw: 1.3 });
  const leaf = (x, y, a, L) => new Path().M(0, 0).C(L * 0.3, -L * 0.3, L * 0.75, -L * 0.25, L, 0).C(L * 0.75, L * 0.25, L * 0.3, L * 0.3, 0, 0).Z().rotate(deg(a)).translate(x, y);
  for (const [x, y, a, L] of [[250, 150, -30, 11], [248, 162, -160, 10]]) { const lf = leaf(x, y, a, L); c.hatch(lf, { angle: a + 60, spacing: 1.1, sw: 0.24 }); c.draw(lf, { sw: 0.6 }); }
  c.draw(new Path().M(244, 376).C(247, 384, 253, 384, 256, 376), { sw: 0.7 });
  // crutch under the left arm
  c.fill(Path.poly([[cx - 51.5, 164], [cx - 48.5, 164], [cx - 46.5, 398], [cx - 49.5, 398]]));
  const yoke = new Path().M(cx - 64, 156).C(cx - 58, 162, cx - 42, 162, cx - 36, 156).L(cx - 36, 160).C(cx - 42, 166, cx - 58, 166, cx - 64, 160).Z(); c.fill(yoke);
  // the rod, held out over the water, and its line
  c.fill(Path.poly([[cx + 78, 204], [cx + 80, 200], [260, 110], [261.5, 112.5]]));
  c.draw(new Path().M(258, 112).C(262, 150, 258, 200, 260, 240).C(262, 260, 258, 300, 260, 334), { sw: 0.4 });
  // ---------- the figure drawn: drapery from behind
  const folds = [
    [[cx - 20, 150], [cx - 26, 220], [cx - 36, 300], [cx - 44, 390]],
    [[cx - 4, 148], [cx - 8, 230], [cx - 14, 320], [cx - 18, 396]],
    [[cx + 14, 150], [cx + 14, 240], [cx + 12, 330], [cx + 10, 398]],
    [[cx + 30, 158], [cx + 34, 240], [cx + 40, 330], [cx + 48, 396]],
  ];
  c.hatch(cloak, { angle: 87, spacing: 3.0, sw: 0.22, jitter: 0.5 });
  c.drapery(cloak, folds.slice(0, 3), { side: 1, width: 10, spacing: 1.6, sw: 0.3, foldSw: 0.7 });
  // deep folds as black wedges, and the shadow side (right) hatched along the fall of the cloth
  const wedge = (a, b, w) => Path.poly([[a[0] - w * 0.2, a[1]], [a[0] + w * 0.2, a[1]], [b[0] + w, b[1]], [b[0] - w * 0.4, b[1]]]);
  for (const [a, b, w] of [[[cx - 30, 170], [cx - 40, 398], 3.2], [[cx + 4, 165], [cx - 2, 400], 2.6], [[cx + 30, 172], [cx + 44, 398], 3.6]]) c.fill(Path.smooth(wedge(a, b, w).polys()[0], { closed: true, tension: 0.3 }), INK, { extra: '', op: 1 });
  c.hatch(S([[cx + 40, 176], [cx + 44, 230], [cx + 50, 300], [cx + 56, 360], [cx + 62, 394], [cx + 50, 396], [cx + 42, 360], [cx + 36, 300], [cx + 30, 230], [cx + 28, 176]], 0.4), { angle: 82, spacing: 1.4, sw: 0.3, clip: cloak });
  c.outlineVar(cloak, { min: 0.6, max: 1.5, light: -140 });
  // shoulders: a yoke line
  c.draw(new Path().M(cx - 36, 152).C(cx - 10, 160, cx + 10, 160, cx + 36, 152), { sw: 0.6 });
  const outside = [Path.rect(0, 0, 300, 520).polys()[0], cloak.polys()[0]];
  for (const s of [sleeveR, sleeveL]) { c.hatch(s, { angle: 50, spacing: 2.2, sw: 0.26, jitter: 0.3, clip: outside }); c.lines(clipPolyline(s.pts(2), outside), { sw: 1.0 }); }
  for (const h of [handR, handL]) { c.hatch(h, { angle: 30, spacing: 1.9, sw: 0.24 }); c.draw(h, { sw: 0.9 }); }
  c.draw(new Path().M(cx + 72, 208).L(cx + 76, 196).M(cx + 79, 210).L(cx + 82, 197), { sw: 0.45 });
  c.draw(new Path().M(cx - 52, 212).L(cx - 50, 200).M(cx - 46, 213).L(cx - 44, 201), { sw: 0.45 });
  c.hatch(neck, { angle: 90, spacing: 1.5, sw: 0.26 }); c.draw(neck, { sw: 0.9 });
  // hair from behind: a black mass with a crescent of light cut into it, and a few strands at the nape
  const strands = []; for (let i = 0; i < 7; i++) { const a0 = deg(200 + i * 9), a1 = a0 + deg(40 + 6 * (i % 3)); const r = 12 + i * 1.1; const pts = []; for (let k = 0; k <= 8; k++) { const a = a0 + (a1 - a0) * k / 8; pts.push([cx + 18 * Math.cos(a) * (r / 17), 118 + 20 * Math.sin(a) * (r / 17)]); } const L = [], R = []; for (let k = 0; k < pts.length; k++) { const w = 0.55 * Math.sin(Math.PI * k / 8) + 0.1; const p = pts[k]; L.push([p[0], p[1] - w]); R.push([p[0], p[1] + w]); } strands.push(Path.poly(L.concat(R.reverse()))); }
  c.fillEO([hair, ...strands]);
  c.draw(hair, { sw: 0.8 });
  c.draw(new Path().M(cx - 8, 137).L(cx - 6, 142).M(cx, 136).L(cx + 1, 142).M(cx + 8, 137).L(cx + 7, 142), { sw: 0.6 });
  c.frame();
  return c;
};
