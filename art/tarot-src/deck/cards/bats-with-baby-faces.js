// CCCLXXVIII  A woman drew her long black hair out tight and fiddled whisper music on those strings; bats with baby faces in the violet light crawled head downward down a blackened wall; upside down in air were towers.
const { Card, Path, C, INK, deg, clipTo, clipPolyline, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function batsWithBabyFaces() {
  const c = new Card({ name: 'Bats with Baby Faces', numeral: 'CCCLXXVIII', seed: 378 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const all = [Path.rect(0, 0, 300, 520).polys()[0]];
  // ---------- the blackened wall down the left: a black mass with the courses of its bricks left as paper hairs; a violet window high in it
  const wallX = 112;
  const wall = Path.poly([[px0, py0], [wallX, py0], [wallX + 4, 120], [wallX - 2, 200], [wallX + 3, 280], [wallX - 1, 360], [wallX + 2, py1], [px0, py1]]);
  const window = Path.rect(52, 96, 16, 26);
  // the bats: each is a paper hole in the wall, head downward, wings up; drawn inside the hole after the wall is laid
  const bat = (x, y, s, spread) => {
    const M = p => p.scale(s, s).translate(x, y);
    const body = M(S([[0, -14], [5, -8], [5, 4], [3, 12], [-3, 12], [-5, 4], [-5, -8]], 0.5));
    const face = M(Path.circle(0, 14, 7.5));
    const wing = (dir) => M(Path.poly([[dir * 4, -8], [dir * (16 + spread), -30], [dir * (30 + spread), -22], [dir * (36 + spread), -8], [dir * (30 + spread), 0], [dir * (22 + spread), -8], [dir * (14 + spread), -2], [dir * 6, 2]]));
    return { body, face, wingL: wing(-1), wingR: wing(1), x, y, s, M };
  };
  const bats = [bat(62, 170, 0.9, 0), bat(40, 262, 0.75, 4), bat(84, 336, 0.85, -2), bat(52, 418, 0.7, 2)];
  const batParts = bats.flatMap(b => [b.body, b.face, b.wingL, b.wingR]);
  // courses: thin paper lines across the wall, broken, like mortar seen through soot
  const courses = []; for (let y = py0 + 8; y < py1; y += 9) { const row = []; for (let x = px0 + (Math.floor(y / 9) % 2 ? 0 : 6); x < wallX; x += 13) row.push(Path.poly([[x + 1, y], [x + 10, y], [x + 10, y + 0.7], [x + 1, y + 0.7]])); courses.push(...row); }
  const wallHoles = [window, ...batParts, ...courses];
  c.fillEO([wall, ...wallHoles]);
  c.fill(window, C.violet);
  // the bats drawn in their holes: wings hatched, bodies furred, the baby faces round and plump with small features
  for (const b of bats) {
    for (const w of [b.wingL, b.wingR]) { c.hatch(w, { angle: 100, spacing: 1.1, sw: 0.26, spacingFn: t => 0.8 + 1.2 * t }); c.draw(w, { sw: 0.6 }); }
    // wing bones: from the shoulder to the tips
    for (const dir of [-1, 1]) { const tip = b.M(Path.poly([[dir * 4, -8], [dir * 30, -22]])); c.draw(tip, { sw: 0.7 }); const tip2 = b.M(Path.poly([[dir * 4, -8], [dir * 34, -8]])); c.draw(tip2, { sw: 0.5 }); }
    c.hatch(b.body, { angle: 0, spacing: 1.0, sw: 0.3, jitter: 0.4 }); c.draw(b.body, { sw: 0.6 });
    c.hatch(b.face, { angle: 100, spacing: 2.2, sw: 0.18, spacingFn: t => 1.4 + 2.2 * t }); c.draw(b.face, { sw: 0.7 });
    const fx = b.x, fy = b.y + 14 * b.s, s = b.s;
    for (const sx of [-1, 1]) { c.fill(Path.ellipse(fx + sx * 2.8 * s, fy - 1.2 * s, 1.1 * s, 1.4 * s)); c.draw(new Path().M(fx + sx * 4.6 * s, fy - 3.4 * s).C(fx + sx * 3.4 * s, fy - 4.6 * s, fx + sx * 1.8 * s, fy - 4.4 * s, fx + sx * 1.2 * s, fy - 3.4 * s), { sw: 0.35 }); }
    c.draw(new Path().M(fx - 1.6 * s, fy + 2.6 * s).C(fx - 0.6 * s, fy + 4.2 * s, fx + 0.6 * s, fy + 4.2 * s, fx + 1.6 * s, fy + 2.6 * s), { sw: 0.5 }); // the small mouth, open to whistle
    c.draw(new Path().M(fx, fy + 0.6 * s).L(fx - 0.6 * s, fy + 1.6 * s), { sw: 0.3 });
    // ears: two small points at the top of the face, folded down since the bat hangs head-downward
    for (const sx of [-1, 1]) c.fill(Path.poly([[fx + sx * 4 * s, fy + 5.6 * s], [fx + sx * 6.5 * s, fy + 10 * s], [fx + sx * 2 * s, fy + 7 * s]]));
  }
  // ---------- towers upside down in the air, hanging from the top rule, bells in them
  // a bell must read against the black opening: draw the openings, then the bells as paper holes with ink tongues
  const towerSpec = [[168, 24, 96, 4], [232, 18, 72, -3], [268, 13, 54, 2]];
  for (const [x, w, h, lean] of towerSpec) {
    const L = y => lean * (y - py0) / h; // the lean grows with the drop
    const bodyH = h * 0.5, belfH = h * 0.22, spireH = h - bodyH - belfH;
    const body = Path.poly([[x - w / 2, py0], [x + w / 2, py0], [x + w / 2 + L(py0 + bodyH), py0 + bodyH], [x - w / 2 + L(py0 + bodyH), py0 + bodyH]]);
    const y1 = py0 + bodyH, y2 = y1 + belfH;
    const belfry = Path.poly([[x - w / 2 - 1.5 + L(y1), y1], [x + w / 2 + 1.5 + L(y1), y1], [x + w / 2 + 1.5 + L(y2), y2], [x - w / 2 - 1.5 + L(y2), y2]]);
    const spire = Path.poly([[x - w / 2 - 2 + L(y2), y2], [x + w / 2 + 2 + L(y2), y2], [x + L(y2 + spireH), y2 + spireH]]);
    c.hatch(body, { angle: 90, spacing: 1.3, sw: 0.26, spacingFn: t => 0.9 + 1.4 * t }); c.draw(body, { sw: 0.7 });
    for (let y = py0 + 7; y < y1 - 3; y += 7) c.draw(new Path().M(x - w / 2 + L(y), y).L(x + w / 2 + L(y), y), { sw: 0.3 });
    // slit windows down the body, dark
    for (let y = py0 + 10; y < y1 - 10; y += 16) c.fill(Path.poly([[x - 1.4 + L(y), y], [x + 1.4 + L(y), y], [x + 1.4 + L(y + 7), y + 7], [x - 1.4 + L(y + 7), y + 7]]));
    // the belfry: two arched openings, dark, with a bell hanging (upward, since the tower is upside down) in each
    c.hatch(belfry, { angle: 90, spacing: 1.2, sw: 0.26 }); c.draw(belfry, { sw: 0.7 });
    for (const dx of [-w * 0.24, w * 0.24]) {
      const ox = x + dx, ow = w * 0.3, oy = y1 + 2, oh = belfH - 4;
      const op = Path.poly([[ox - ow / 2 + L(oy), oy], [ox + ow / 2 + L(oy), oy], [ox + ow / 2 + L(oy + oh * 0.7), oy + oh * 0.7], [ox + L(oy + oh), oy + oh], [ox - ow / 2 + L(oy + oh * 0.7), oy + oh * 0.7]]);
      const bx = ox + L(oy + oh * 0.45), by = oy + oh * 0.45; const bs = ow / 7;
      const bell = S([[bx - 2.6 * bs, by + 2.6 * bs], [bx + 2.6 * bs, by + 2.6 * bs], [bx + 1.6 * bs, by - 0.6 * bs], [bx + 1 * bs, by - 3 * bs], [bx - 1 * bs, by - 3 * bs], [bx - 1.6 * bs, by - 0.6 * bs]], 0.35);
      c.fillEO([op, bell]); c.fill(Path.circle(bx, by + 1.6 * bs, 0.7 * bs));
    }
    // the spire, pointing down, a ball at its tip
    c.hatch(spire, { angle: 90 + lean, spacing: 1.1, sw: 0.28, spacingFn: t => 0.8 + 1.2 * t }); c.draw(spire, { sw: 0.7 });
    c.fill(Path.circle(x + L(y2 + spireH), y2 + spireH + 2.2, 2));
    // the tolling: short arcs beside the belfry
    for (const sx of [-1, 1]) { const ax = x + sx * (w / 2 + 6) + L(y1 + belfH / 2), ay = y1 + belfH / 2; c.draw(Path.arc(ax - sx * 4, ay, 5, sx > 0 ? -0.6 : Math.PI - 0.6, sx > 0 ? 0.6 : Math.PI + 0.6, { move: true }), { sw: 0.35 }); c.draw(Path.arc(ax - sx * 4, ay, 8, sx > 0 ? -0.5 : Math.PI - 0.5, sx > 0 ? 0.5 : Math.PI + 0.5, { move: true }), { sw: 0.25 }); }
  }
  // ---------- the woman: seated at the right, in profile facing left, her hair drawn out tight to the right in strings
  const hx = 176, hy = 232; // the head
  const head = S([[hx, hy - 20], [hx - 12, hy - 16], [hx - 16, hy - 4], [hx - 14, hy + 8], [hx - 6, hy + 16], [hx + 6, hy + 16], [hx + 14, hy + 8], [hx + 16, hy - 6], [hx + 12, hy - 16]], 0.5);
  const hairMass = S([[hx - 6, hy - 22], [hx + 10, hy - 24], [hx + 22, hy - 14], [hx + 26, hy + 2], [hx + 22, hy + 16], [hx + 12, hy + 14], [hx + 16, hy], [hx + 12, hy - 10], [hx + 2, hy - 16], [hx - 10, hy - 18]], 0.5);
  const neck = S([[hx - 2, hy + 14], [hx + 10, hy + 14], [hx + 12, hy + 24], [hx - 4, hy + 24]], 0.4);
  const dress = S([[hx - 14, hy + 24], [hx + 18, hy + 24], [hx + 26, hy + 50], [hx + 30, hy + 90], [hx + 34, hy + 130], [hx + 40, hy + 158], [hx - 30, hy + 158], [hx - 26, hy + 120], [hx - 24, hy + 80], [hx - 20, hy + 46]], 0.4);
  const armFar = tube([[hx + 14, hy + 34], [hx + 40, hy + 40], [hx + 68, hy + 36]], t => 11 - 3 * t); // held out to the right: the strings
  const handFar = S([[hx + 64, hy + 28], [hx + 78, hy + 28], [hx + 82, hy + 40], [hx + 72, hy + 46], [hx + 62, hy + 42]], 0.5);
  const armNear = tube([[hx - 6, hy + 40], [hx + 6, hy + 62], [hx + 32, hy + 66]], t => 11 - 3 * t); // the bow arm across
  const handNear = S([[hx + 28, hy + 58], [hx + 42, hy + 58], [hx + 46, hy + 70], [hx + 36, hy + 76], [hx + 26, hy + 72]], 0.5);
  const stool = Path.poly([[hx - 26, hy + 156], [hx + 40, hy + 156], [hx + 40, hy + 164], [hx - 26, hy + 164]]);
  // the room behind her: a floor line and a plain wall, hatched lightly, everything below the towers
  const floorY = 404;
  const figure = [head, hairMass, neck, dress, armFar, handFar, armNear, handNear, stool];
  c.hatch(Path.poly([[wallX, py0], [px1, py0], [px1, floorY], [wallX, floorY]]), { angle: 0, spacing: 3.4, sw: 0.2, holes: figure, dash: [30, 90, 10, 50], phase: 2 });
  c.hatch(Path.poly([[wallX, floorY], [px1, floorY], [px1, py1], [wallX, py1]]), { angle: 0, spacing: 2.6, sw: 0.24, holes: figure, spacingFn: t => 1.8 + 2 * t });
  c.draw(new Path().M(wallX, floorY).L(px1, floorY), { sw: 0.6 });
  // the well at the bottom right: an exhausted well, its mouth a dark ring, a windlass over it
  const well = Path.ellipse(250, 438, 22, 8); const wellIn = Path.ellipse(250, 436, 15, 5);
  c.hatch(Path.poly([[228, 438], [272, 438], [272, 458], [228, 458]]), { angle: 90, spacing: 1.4, sw: 0.26 }); c.draw(new Path().M(228, 438).L(228, 458).M(272, 438).L(272, 458), { sw: 0.7 }); c.draw(Path.arc(250, 458, 22, 0, Math.PI, { move: true, ry: 8 }), { sw: 0.7 });
  c.hatch(well, { angle: 0, spacing: 1.4, sw: 0.24 }); c.draw(well, { sw: 0.7 }); c.fill(wellIn);
  c.draw(new Path().M(232, 438).L(232, 412).L(268, 412).L(268, 438), { sw: 0.8 }); c.draw(new Path().M(250, 412).L(250, 424), { sw: 0.4 }); c.fill(Path.ellipse(250, 426, 2.4, 1.6));
  // ---------- the strings: her hair drawn out tight from the head to the far hand, and the bow across them
  const strings = []; const anchor = [hx + 72, hy + 36];
  for (let i = 0; i < 13; i++) { const a = [hx + 8 + rnd.range(-3, 3), hy - 20 + i * 2.8]; strings.push([a, anchor]); }
  c.lines(strings.flatMap(s => clipTo(s, all, [armFar, handFar, head])), { sw: 0.5 });
  c.lines(strings.slice(0, 13).map(s => [s[0], [s[0][0] + (s[1][0] - s[0][0]) * 0.55, s[0][1] + (s[1][1] - s[0][1]) * 0.55]]).flatMap(s => clipTo(s, all, [armFar, handFar, head])), { sw: 0.5 });
  // the bow: a straight stick with a hair of paper, held in the near hand, crossing the strings
  c.draw(new Path().M(hx + 24, hy + 70).L(hx + 46, hy + 8), { sw: 1.3 }); c.draw(new Path().M(hx + 25.6, hy + 70.4).L(hx + 47.6, hy + 8.4), { sw: 0.3 });
  // ---------- the figure drawn
  c.hatch(dress, { angle: 92, spacing: 2.2, sw: 0.26, spacingFn: t => 1.4 + 2.2 * t, jitter: 0.3 });
  c.drapery(dress, [[[hx - 4, hy + 60], [hx - 8, hy + 110], [hx - 6, hy + 156]], [[hx + 16, hy + 70], [hx + 20, hy + 120], [hx + 24, hy + 156]]], { side: 1, width: 8, spacing: 1.5, sw: 0.3, foldSw: 0.7 });
  c.outlineVar(dress, { min: 0.6, max: 1.3, light: -60 });
  c.hatch(stool, { angle: 0, spacing: 1.2, sw: 0.3 }); c.draw(stool, { sw: 0.7 });
  for (const a of [armFar, armNear]) { c.hatch(a, { angle: 20, spacing: 1.8, sw: 0.24 }); c.draw(a, { sw: 0.8 }); }
  for (const h of [handFar, handNear]) { c.hatch(h, { angle: 30, spacing: 1.6, sw: 0.22 }); c.draw(h, { sw: 0.7 }); }
  c.draw(new Path().M(hx + 70, hy + 34).L(hx + 78, hy + 36).M(hx + 70, hy + 38).L(hx + 78, hy + 40), { sw: 0.4 }); c.draw(new Path().M(hx + 32, hy + 64).L(hx + 42, hy + 66).M(hx + 32, hy + 68).L(hx + 42, hy + 70), { sw: 0.4 });
  c.hatch(neck, { angle: 90, spacing: 1.6, sw: 0.22 }); c.draw(neck, { sw: 0.7 });
  c.hatch(head, { angle: 100, spacing: 2.4, sw: 0.2, spacingFn: t => 1.6 + 2.4 * t }); c.draw(head, { sw: 0.9 });
  // her profile, facing left: brow, nose, lip, chin; one eye closed, listening
  c.draw(new Path().M(hx - 14, hy - 6).C(hx - 19, hy - 2, hx - 19, hy + 2, hx - 15, hy + 3).C(hx - 13, hy + 4, hx - 15, hy + 8, hx - 12, hy + 9).C(hx - 14, hy + 11, hx - 12, hy + 13, hx - 9, hy + 14), { sw: 0.7 });
  c.draw(new Path().M(hx - 12, hy - 4).C(hx - 9, hy - 6, hx - 6, hy - 5, hx - 4, hy - 3), { sw: 0.5 }); c.draw(new Path().M(hx - 11, hy - 1).C(hx - 9, hy + 1, hx - 6, hy + 1, hx - 4, hy - 0.5), { sw: 0.4 });
  c.fill(hairMass);
  c.frame();
  return c;
};
