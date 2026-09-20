// (epigraph)  The Sibyl at Cumae, hanging in her jar; the boys below ask what she wants. "I want to die."
const { Card, Path, C, INK, deg, clipTo, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function sibyl() {
  const c = new Card({ name: 'The Sibyl', numeral: '', seed: 1 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  // ---------- the jar: a glass flask hung by a cord from the top
  const jar = S([[150, 118], [162, 120], [166, 132], [170, 146], [190, 160], [206, 190], [212, 230], [208, 272], [194, 306], [172, 326], [150, 330], [128, 326], [106, 306], [92, 272], [88, 230], [94, 190], [110, 160], [130, 146], [134, 132], [138, 120]], 0.5);
  const jarPolys = jar.polys();
  // ---------- the Sibyl inside: tiny, hunched in profile facing left, knees drawn up, arms round them, hair falling over everything
  const sx = 152, sy = 250;
  const body = S([[sx - 30, sy + 12], [sx - 34, sy - 10], [sx - 26, sy - 36], [sx - 10, sy - 56], [sx + 12, sy - 60], [sx + 30, sy - 46], [sx + 38, sy - 20], [sx + 40, sy + 10], [sx + 36, sy + 40], [sx + 20, sy + 54], [sx - 10, sy + 56], [sx - 30, sy + 44], [sx - 38, sy + 26]], 0.5); // the whole crouched mass, back to the right
  const head = S([[sx - 36, sy - 40], [sx - 24, sy - 50], [sx - 10, sy - 46], [sx - 6, sy - 34], [sx - 12, sy - 22], [sx - 26, sy - 18], [sx - 38, sy - 26]], 0.55);
  const shin = S([[sx - 38, sy + 4], [sx - 30, sy - 8], [sx - 14, sy - 4], [sx - 8, sy + 24], [sx - 14, sy + 48], [sx - 30, sy + 44], [sx - 38, sy + 26]], 0.5);
  const arm = tube([[sx + 16, sy - 24], [sx - 6, sy - 6], [sx - 26, sy + 2]], t => 9 - 2 * t);
  const hand = S([[sx - 36, sy - 6], [sx - 26, sy - 8], [sx - 20, sy], [sx - 26, sy + 8], [sx - 38, sy + 6]], 0.5);
  const foot = S([[sx - 44, sy + 44], [sx - 22, sy + 42], [sx - 20, sy + 52], [sx - 44, sy + 54]], 0.4);
  const figure = [body, head, shin, arm, hand, foot];
  const figPolys = figure.flatMap(f => f.polys());
  // ---------- the cave at Cumae: dense dark behind, strata, a floor
  const floor = 428;
  const cave = Path.poly([[px0, py0], [px1, py0], [px1, floor], [px0, floor]]);
  c.hatch(cave, { angle: 90, spacing: 1.7, sw: 0.3, holes: [jar], jitter: 0.2 });
  c.hatch(cave, { angle: 20, spacing: 2.6, sw: 0.24, holes: [jar], spacingFn: t => 1.8 + 1.6 * t });
  // strata of the rock: a few long wavering lines across the dark
  for (let i = 0; i < 7; i++) { const y = 70 + i * 52; const pl = []; for (let x = px0; x <= px1; x += 6) pl.push([x, y + 6 * Math.sin(x / 40 + i) + 2 * Math.sin(x / 9)]); c.lines(clipTo(pl, cave.polys(), jarPolys), { sw: 0.9 }); }
  // the cord
  c.draw(new Path().M(150, py0).L(150, 118), { sw: 1.6 }); c.draw(new Path().M(146, 112).L(154, 112), { sw: 1.2 });
  // ---------- the floor and the boys
  c.draw(new Path().M(px0, floor).L(px1, floor), { sw: 0.8 });
  c.hatch(Path.rect(px0, floor, px1 - px0, py1 - floor), { angle: 0, spacing: 3.0, sw: 0.24, dash: [10, 50, 3, 12] });
  const boy = (x, y, s, dir, pointing) => {
    const M = p => p.scale(s * dir, s).translate(x, y); const parts = [];
    parts.push(M(Path.circle(0, -44, 6.5)));
    parts.push(M(S([[-7, -36], [7, -36], [8, -12], [-8, -12]], 0.35)));
    parts.push(M(tube([[-3, -12], [-6, 0]], () => 4.6))); parts.push(M(tube([[3, -12], [7, 0]], () => 4.6)));
    parts.push(M(Path.ellipse(-7, 0.5, 5, 1.8))); parts.push(M(Path.ellipse(8, 0.5, 5, 1.8)));
    if (pointing) parts.push(M(tube([[6, -32], [16, -46], [24, -58]], () => 3.6))); else parts.push(M(tube([[6, -32], [12, -20], [10, -10]], () => 3.6)));
    parts.push(M(S([[-7, -52], [-2, -56], [4, -55], [8, -50], [7, -44], [-7, -44]], 0.4))); // cap of hair
    for (const p of parts) c.fill(p);
  };
  boy(96, floor - 2, 1.05, 1, true); boy(210, floor - 2, 0.95, -1, false);
  // ---------- the jar drawn: glass, with the figure inside
  // the sibyl: a dark, close-hatched huddle; her face and hand bare; hair falling in long lines over her back and knees
  c.hatch(body, { angle: 30, spacing: 1.3, sw: 0.3, jitter: 0.2, holes: [head, hand, foot] });
  c.hatch(body, { angle: 120, spacing: 2.2, sw: 0.24, holes: [head, hand, foot, shin] });
  c.hatch(shin, { angle: 70, spacing: 1.5, sw: 0.26 }); c.draw(shin, { sw: 0.7 });
  c.hatch(arm, { angle: 140, spacing: 1.4, sw: 0.26 }); c.draw(arm, { sw: 0.7 });
  c.outlineVar(body, { min: 0.6, max: 1.2, light: -140 });
  c.hatch(hand, { angle: 20, spacing: 1.5, sw: 0.22 }); c.draw(hand, { sw: 0.7 }); c.draw(new Path().M(sx - 34, sy + 4).L(sx - 28, sy - 2).M(sx - 30, sy + 6).L(sx - 24, sy), { sw: 0.4 });
  c.hatch(foot, { angle: 30, spacing: 1.5, sw: 0.22 }); c.draw(foot, { sw: 0.7 });
  c.hatch(head, { angle: 100, spacing: 1.7, sw: 0.22, spacingFn: t => 1.2 + 1.6 * (1 - t) }); c.draw(head, { sw: 0.8 });
  // her face, in profile to the left: a sunk eye, a hooked nose, the mouth open
  c.fill(Path.ellipse(sx - 26, sy - 38, 2.4, 1.6)); c.draw(new Path().M(sx - 30, sy - 41).L(sx - 22, sy - 42), { sw: 0.5 });
  c.draw(new Path().M(sx - 34, sy - 36).C(sx - 40, sy - 34, sx - 40, sy - 30, sx - 35, sy - 30), { sw: 0.7 });
  c.draw(new Path().M(sx - 35, sy - 26).C(sx - 32, sy - 24, sx - 30, sy - 24, sx - 28, sy - 26), { sw: 0.6 }); c.fill(S([[sx - 35, sy - 26], [sx - 28, sy - 26], [sx - 30, sy - 23], [sx - 34, sy - 23]], 0.3));
  // hair: from the crown, over the back and down to the floor of the jar
  for (let i = 0; i < 16; i++) { const a = deg(240 + i * 8); const r0 = [sx - 22 + 14 * Math.cos(a), sy - 34 + 16 * Math.sin(a)]; const L = 60 + 40 * Math.abs(Math.sin(i * 1.3)); const p = Path.smooth([r0, [r0[0] + 14 + 6 * Math.sin(i), r0[1] + L * 0.35], [r0[0] + 26 + 8 * Math.cos(i), r0[1] + L * 0.7], [r0[0] + 30 + 10 * Math.sin(i * 0.7), r0[1] + L]]); c.lines(clipTo(p.pts(2), jarPolys, [head.polys()[0], hand.polys()[0]]), { sw: 0.5 }); }
  // the glass: outline heavy, a highlight left bare, curved reflections as long thin arcs, and the darker far side
  c.hatch(jar, { angle: 88, spacing: 4.6, sw: 0.2, holes: figure, jitter: 0.3 });
  c.hatch(S([[190, 160], [206, 190], [212, 230], [208, 272], [194, 306], [186, 300], [198, 270], [200, 230], [194, 196], [178, 170]], 0.4), { angle: 80, spacing: 1.4, sw: 0.28, clip: jar, holes: figure });
  for (const [dx, sw] of [[-28, 0.5], [-22, 0.3]]) c.draw(Path.smooth([[122 + dx * 0.3, 150], [104 + dx * 0.6, 200], [100 + dx * 0.7, 250], [108 + dx * 0.6, 296]]), { sw });
  c.outlineVar(jar, { min: 0.7, max: 1.5, light: -140 });
  c.draw(new Path().M(138, 120).C(142, 126, 158, 126, 162, 120), { sw: 0.6 }); c.draw(new Path().M(134, 132).C(140, 138, 160, 138, 166, 132), { sw: 0.6 });
  c.frame();
  return c;
};
