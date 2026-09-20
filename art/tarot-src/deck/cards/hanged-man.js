// LV  The Hanged Man, who is not found. The tree and the rope are there; where he should hang, the paper is bare; his halo stays.
const { Card, Path, C, INK, deg, clipTo, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function hangedMan() {
  const c = new Card({ name: 'The Hanged Man', numeral: 'LV', seed: 55 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const pic = Path.rect(px0, py0, px1 - px0, py1 - py0);
  // ---------- the absent man: his silhouette, inverted, as the union of parts (holes in everything behind)
  const ax = 166; // the rope's x
  const legUp = tube([[ax, 138], [ax + 1, 176], [ax, 222]], t => 13 + 5 * t);
  const foot = S([[ax - 5, 128], [ax + 6, 128], [ax + 9, 140], [ax - 7, 141]], 0.4);
  const legBent = tube([[ax - 4, 230], [ax - 30, 206], [ax - 36, 178]], t => 15 - 3 * t);
  const footBent = S([[ax - 44, 168], [ax - 30, 168], [ax - 28, 181], [ax - 44, 182]], 0.4);
  const hips = Path.ellipse(ax - 2, 234, 19, 12);
  const torso = S([[ax - 18, 232], [ax + 16, 232], [ax + 20, 262], [ax + 19, 296], [ax + 14, 314], [ax - 18, 314], [ax - 23, 296], [ax - 22, 262]], 0.5);
  const armL = tube([[ax - 20, 246], [ax - 32, 272], [ax - 26, 300]], () => 10);
  const armR = tube([[ax + 18, 246], [ax + 30, 272], [ax + 24, 300]], () => 10);
  const neck = tube([[ax - 2, 310], [ax - 2, 326]], () => 12);
  const head = Path.ellipse(ax - 2, 342, 15, 18);
  const man = [legUp, foot, legBent, footBent, hips, torso, armL, armR, neck, head];
  const manPolys = man.flatMap(m => m.polys());
  // ---------- the tree: a dead trunk at the left, a long bough across as the beam
  const trunk = S([[52, 466], [60, 400], [58, 330], [64, 260], [60, 190], [66, 130], [74, 96], [90, 90], [96, 100], [84, 120], [86, 190], [82, 260], [88, 330], [86, 400], [92, 466]], 0.35);
  const bough = S([[80, 118], [120, 110], [170, 106], [220, 108], [262, 104], [284, 100], [284, 108], [262, 112], [220, 118], [170, 118], [120, 122], [86, 128]], 0.35);
  const twigs = [Path.smooth([[262, 106], [270, 92], [268, 80]]), Path.smooth([[232, 108], [238, 96], [250, 90]]), Path.smooth([[94, 96], [104, 84], [102, 70]]), Path.smooth([[118, 112], [122, 100]]), Path.smooth([[76, 200], [60, 190], [48, 176]])];
  const tree = [trunk, bough];
  // ---------- the ground and the far road at the bottom: two walkers and a third
  const ground = 430;
  // ---------- the air: dense hatching everywhere behind, the man cut out of it
  const air = Path.poly([[px0, py0], [px1, py0], [px1, ground], [px0, ground]]);
  const holes = man.concat(tree);
  c.hatch(air, { angle: 45, spacing: 1.9, sw: 0.3, holes, jitter: 0.15 });
  c.hatch(air, { angle: -45, spacing: 2.3, sw: 0.24, holes, jitter: 0.15, spacingFn: t => 3.2 - 1.2 * t });
  c.hatch(Path.poly([[px0, 300], [px1, 300], [px1, ground], [px0, ground]]), { angle: 0, spacing: 2.6, sw: 0.22, holes, spacingFn: t => 3.4 - 1.4 * t });
  // the man's edge: not drawn. His halo is: a ring of gold round the head that is not there.
  c.draw(Path.circle(ax - 2, 342, 26), { sw: 2.4, stroke: C.gold });
  c.draw(Path.circle(ax - 2, 342, 23.4), { sw: 0.5 }); c.draw(Path.circle(ax - 2, 342, 28.6), { sw: 0.5 });
  // the rope, tied round the bough, hanging to where the ankle would be, its loop open
  c.draw(new Path().M(ax - 6, 106).C(ax - 8, 112, ax + 8, 112, ax + 6, 106), { sw: 1.6 }); c.draw(new Path().M(ax - 6, 110).C(ax - 8, 116, ax + 8, 116, ax + 6, 110), { sw: 1.6 });
  const rope = tube([[ax, 114], [ax, 128]], () => 3); c.fill(rope);
  const noose = new Path().M(ax - 1.5, 126).C(ax - 16, 132, ax - 18, 152, ax - 4, 154).C(ax + 10, 156, ax + 14, 138, ax + 1.5, 126);
  c.draw(noose, { sw: 2.3 }); c.draw(noose, { sw: 0.6, stroke: C.gold, dash: '1.2 2.2' });
  // ---------- the tree drawn: bark in long wavering lines, black in the cleft
  const barkLines = []; for (let x = 54; x < 92; x += 2.4) { const pl = []; for (let y = 90; y <= 466; y += 6) pl.push([x + 2.2 * Math.sin(y / 34 + 0.5) + 0.7 * Math.sin(y / 11), y]); barkLines.push(...clipTo(pl, trunk.polys(), manPolys)); }
  c.lines(barkLines, { sw: 0.4 });
  c.hatch(S([[58, 330], [64, 260], [60, 190], [70, 190], [72, 260], [68, 330]], 0.4), { angle: 85, spacing: 1.2, sw: 0.34, clip: trunk });
  c.outlineVar(trunk, { min: 0.7, max: 1.5, light: -120 });
  c.hatch(bough, { angle: 5, spacing: 1.7, sw: 0.3, holes: [rope] }); c.hatch(S([[80, 118], [170, 111], [284, 104], [284, 108], [170, 118], [86, 128]], 0.3), { angle: 3, spacing: 1.1, sw: 0.3, clip: bough });
  c.outlineVar(bough, { min: 0.6, max: 1.3, light: -100 });
  for (const t of twigs) c.draw(t, { sw: 1.1 });
  // one green shoot on the dead bough, above where the rope is tied
  const leaf = (x, y, a, L) => new Path().M(0, 0).C(L * 0.3, -L * 0.32, L * 0.75, -L * 0.25, L, 0).C(L * 0.75, L * 0.25, L * 0.3, L * 0.32, 0, 0).Z().rotate(deg(a)).translate(x, y);
  c.draw(new Path().M(184, 108).C(186, 100, 190, 94, 196, 90), { sw: 0.8 });
  for (const [x, y, a, L] of [[190, 96, -40, 11], [194, 91, 15, 10]]) { const lf = leaf(x, y, a, L); c.hatch(lf, { angle: a + 60, spacing: 1.1, sw: 0.24 }); c.draw(lf, { sw: 0.6 }); }
  // ---------- ground: a strip of broken earth, and at the far right the road to Emmaus with three walkers, tiny
  c.draw(new Path().M(px0, ground).L(px1, ground), { sw: 0.9 });
  c.hatch(Path.poly([[px0, ground], [px1, ground], [px1, py1], [px0, py1]]), { angle: 0, spacing: 3.2, sw: 0.24, dash: [6, 40, 3, 14], holes: [trunk] });
  const walker = (x, y, s, hooded) => { const parts = [Path.circle(x, y - 22 * s, 3.2 * s), Path.smooth([[x - 4 * s, y - 18 * s], [x + 4 * s, y - 18 * s], [x + 5 * s, y - 2 * s], [x + 2 * s, y], [x - 5 * s, y], [x - 6 * s, y - 2 * s]], { closed: true, tension: 0.4 }), tube([[x - 1 * s, y - 2 * s], [x - 5 * s, y + 8 * s]], () => 2.6 * s), tube([[x + 1 * s, y - 2 * s], [x + 5 * s, y + 8 * s]], () => 2.6 * s)];
    if (hooded) parts.push(Path.smooth([[x - 6 * s, y - 26 * s], [x, y - 30 * s], [x + 6 * s, y - 26 * s], [x + 7 * s, y - 4 * s], [x, y + 2 * s], [x - 7 * s, y - 4 * s]], { closed: true, tension: 0.4 }));
    for (const p of parts) c.fill(p); };
  walker(226, 448, 0.75, false); walker(240, 449, 0.75, false); walker(256, 448, 0.8, true);
  c.frame();
  return c;
};
