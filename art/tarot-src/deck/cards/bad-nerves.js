// CXI  My nerves are bad tonight. Yes, bad. Stay with me. A closed room: the woman upright in her chair, the man silent at the window, the wind under the door, the chess board between them.
const { Card, Path, C, INK, deg, rot, clipTo, clipPolyline, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function badNerves() {
  const c = new Card({ name: 'My Nerves Are Bad Tonight', numeral: 'CXI', seed: 111 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const all = [Path.rect(0, 0, 300, 520).polys()[0]];
  // ---------- the room: a back wall with a closed door, a floor; the window at the right with the man's back to us
  const floorY = 392;
  const door = Path.rect(60, 150, 52, floorY - 150 - 2);
  const window = Path.rect(196, 120, 64, 150);
  // ---------- the woman: in a high-backed chair at the left front, sitting bolt upright, hands gripping the arms, hair coming down
  const wx = 96, wy = 400;
  const chairBack = Path.poly([[wx - 40, wy], [wx - 40, wy - 150], [wx - 36, wy - 158], [wx + 28, wy - 158], [wx + 32, wy - 150], [wx + 32, wy]]);
  const chairSeat = Path.poly([[wx - 44, wy - 44], [wx + 48, wy - 44], [wx + 50, wy - 34], [wx - 46, wy - 34]]);
  const chairLegs = [Path.rect(wx - 42, wy - 34, 4, 40), Path.rect(wx + 42, wy - 34, 4, 40)];
  const armL = Path.poly([[wx - 46, wy - 76], [wx - 30, wy - 76], [wx - 30, wy - 44], [wx - 46, wy - 44]]);
  const armR = Path.poly([[wx + 20, wy - 76], [wx + 48, wy - 76], [wx + 48, wy - 44], [wx + 20, wy - 44]]);
  const dress = S([[wx - 16, wy - 118], [wx + 12, wy - 118], [wx + 22, wy - 96], [wx + 24, wy - 60], [wx + 30, wy - 20], [wx + 26, wy - 4], [wx - 30, wy - 4], [wx - 32, wy - 20], [wx - 26, wy - 60], [wx - 22, wy - 96]], 0.45);
  const neck = S([[wx - 8, wy - 130], [wx + 6, wy - 130], [wx + 8, wy - 116], [wx - 10, wy - 116]], 0.4);
  const head = S([[wx - 2, wy - 156], [wx + 10, wy - 154], [wx + 15, wy - 142], [wx + 12, wy - 130], [wx + 4, wy - 124], [wx - 6, wy - 124], [wx - 14, wy - 132], [wx - 15, wy - 146], [wx - 10, wy - 154]], 0.5);
  const hair = S([[wx - 14, wy - 150], [wx - 6, wy - 162], [wx + 6, wy - 162], [wx + 16, wy - 152], [wx + 20, wy - 136], [wx + 26, wy - 110], [wx + 22, wy - 100], [wx + 16, wy - 124], [wx + 14, wy - 140], [wx + 4, wy - 148], [wx - 8, wy - 148], [wx - 14, wy - 138], [wx - 18, wy - 120], [wx - 24, wy - 100], [wx - 26, wy - 112], [wx - 20, wy - 136]], 0.45);
  const forearmL = tube([[wx - 16, wy - 100], [wx - 30, wy - 90], [wx - 38, wy - 80]], t => 9 - 2 * t); const forearmR = tube([[wx + 12, wy - 100], [wx + 26, wy - 90], [wx + 36, wy - 80]], t => 9 - 2 * t);
  const handL = S([[wx - 46, wy - 84], [wx - 34, wy - 84], [wx - 30, wy - 76], [wx - 36, wy - 70], [wx - 48, wy - 74]], 0.5); const handR = S([[wx + 30, wy - 84], [wx + 44, wy - 84], [wx + 48, wy - 74], [wx + 40, wy - 70], [wx + 28, wy - 76]], 0.5);
  const woman = [chairBack, chairSeat, ...chairLegs, armL, armR, dress, neck, head, hair, forearmL, forearmR, handL, handR];
  // ---------- the man: standing at the window, back to us, hands behind his back, in a dark jacket
  const mx = 228, my = 388;
  const jacket = S([[mx - 20, my - 128], [mx + 20, my - 128], [mx + 24, my - 100], [mx + 22, my - 60], [mx + 20, my - 50], [mx - 20, my - 50], [mx - 22, my - 60], [mx - 24, my - 100]], 0.4);
  const trousers = Path.poly([[mx - 18, my - 52], [mx + 18, my - 52], [mx + 16, my], [mx + 3, my], [mx, my - 30], [mx - 3, my], [mx - 16, my]]);
  const mhead = S([[mx - 8, my - 150], [mx + 8, my - 150], [mx + 11, my - 140], [mx + 8, my - 128], [mx - 8, my - 128], [mx - 11, my - 140]], 0.5);
  const hands = S([[mx - 8, my - 84], [mx + 8, my - 84], [mx + 9, my - 74], [mx - 9, my - 74]], 0.4);
  const man = [jacket, trousers, mhead, hands];
  // ---------- the chess table between them, small, the board seen from a little above
  const table = { x: 158, y: 340 };
  const board = Path.poly([[table.x - 22, table.y - 8], [table.x + 22, table.y - 8], [table.x + 26, table.y + 6], [table.x - 26, table.y + 6]]);
  const tableLeg = Path.rect(table.x - 2, table.y + 6, 4, 46);
  const tableFoot = Path.poly([[table.x - 12, table.y + 54], [table.x + 12, table.y + 54], [table.x + 12, table.y + 50], [table.x - 12, table.y + 50]]);
  const furniture = [board, tableLeg, tableFoot];
  const holes = woman.concat(man, furniture);
  // the back wall: papered, a small close pattern in two directions; door and window are holes
  c.hatch(Path.rect(px0, py0, px1 - px0, floorY - py0), { angle: 90, spacing: 2.6, sw: 0.2, holes: holes.concat([door, window]) });
  c.hatch(Path.rect(px0, py0, px1 - px0, floorY - py0), { angle: 0, spacing: 8, sw: 0.18, holes: holes.concat([door, window]), dash: [2, 3, 2, 9] });
  // the floor: boards in perspective
  const floor = Path.rect(px0, floorY, px1 - px0, py1 - floorY);
  c.hatch(floor, { angle: 0, spacing: 5, sw: 0.24, holes: holes, spacingFn: t => 3 + 4 * t });
  for (let x = px0 + 12; x < px1; x += 30) c.lines(clipTo([[x, floorY], [x + (x - 150) * 0.4, py1]], floor.polys(), holes.flatMap(h => h.polys())), { sw: 0.3 });
  c.draw(new Path().M(px0, floorY).L(px1, floorY), { sw: 0.5 });
  // the door: panelled, closed; under it the wind, as lines slipping in across the floor
  c.hatch(door, { angle: 90, spacing: 1.6, sw: 0.26, spacingFn: t => 1.2 + 1 * t }); c.draw(door, { sw: 0.9 });
  for (const [y, h] of [[164, 70], [246, 70], [328, 54]]) { const p = Path.rect(70, y, 32, h); c.hatch(p, { angle: 90, spacing: 1.2, sw: 0.22, phase: 0.6 }); c.draw(p, { sw: 0.5 }); }
  c.fill(Path.circle(104, 274, 2));
  const gust = []; for (let i = 0; i < 9; i++) { const x0 = 64 + i * 5, y0 = floorY - 1; gust.push(Path.smooth([[x0, y0], [x0 + 6 + i * 2, y0 + 8 + i * 1.4], [x0 + 20 + i * 4, y0 + 10 + i * 2.6]]).pts(3)); }
  c.lines(gust.flatMap(g => clipTo(g, floor.polys(), holes.flatMap(h => h.polys()))), { sw: 0.4 });
  // the window: the night outside cross-hatched dark; the man stands against it; a curtain hangs at one side
  c.hatch(window, { angle: 0, spacing: 1.2, sw: 0.32, holes: man }); c.hatch(window, { angle: 90, spacing: 1.6, sw: 0.26, holes: man });
  c.lines(clipTo([[196, 195], [260, 195]], all, man.flatMap(p => p.polys())).concat(clipTo([[228, 120], [228, 270]], all, man.flatMap(p => p.polys()))), { sw: 0.7 }); c.draw(window, { sw: 0.9 });
  const curtain = Path.poly([[262, 112], [276, 112], [278, 300], [258, 300]]); c.hatch(curtain, { angle: 92, spacing: 1.4, sw: 0.28 }); c.drapery(curtain, [[[268, 116], [266, 200], [270, 298]]], { side: 1, width: 5, spacing: 1.2, sw: 0.26, foldSw: 0.5 }); c.draw(curtain, { sw: 0.7 });
  // ---------- the man drawn: dark, still, a little of the window's light on one shoulder
  c.fillEO([jacket, S([[mx - 22, my - 124], [mx - 12, my - 126], [mx - 14, my - 100], [mx - 22, my - 100]], 0.3)]); c.fill(trousers);
  c.hatch(mhead, { angle: 90, spacing: 1.2, sw: 0.3 }); c.draw(mhead, { sw: 0.8 }); c.fill(S([[mx - 10, my - 152], [mx + 10, my - 152], [mx + 10, my - 142], [mx - 10, my - 142]], 0.4));
  c.hatch(hands, { angle: 30, spacing: 1.4, sw: 0.24 }); c.draw(hands, { sw: 0.6 });
  // ---------- the chess table drawn: the board's squares in perspective, a few pieces standing
  c.draw(board, { sw: 0.8 });
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { if ((i + j) % 2 === 0) continue; const u0 = i / 8, u1 = (i + 1) / 8, v0 = j / 8, v1 = (j + 1) / 8; const P = (u, v) => { const xl = table.x - 22 - 4 * v, xr = table.x + 22 + 4 * v; return [xl + (xr - xl) * u, table.y - 8 + 14 * v]; }; c.fill(Path.poly([P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)])); }
  for (const [x, y, h] of [[table.x - 14, table.y - 4, 8], [table.x + 10, table.y - 6, 10], [table.x + 4, table.y + 2, 7]]) { c.draw(new Path().M(x, y).L(x, y - h), { sw: 1.6 }); c.fill(Path.circle(x, y - h - 1.2, 1.6)); }
  c.fill(tableLeg); c.fill(tableFoot);
  // ---------- the woman drawn: the chair dark and high, the dress hatched, hands gripping, eyes wide, hair loosening
  c.hatch(chairBack, { angle: 90, spacing: 1.2, sw: 0.3, holes: [dress, neck, head, hair] }); c.hatch(chairBack, { angle: 0, spacing: 4, sw: 0.24, holes: [dress, neck, head, hair] }); c.lines(clipTo(chairBack.pts(2), all, [dress, hair].flatMap(p => p.polys())), { sw: 0.9 });
  c.hatch(chairSeat, { angle: 0, spacing: 1.3, sw: 0.3, holes: [dress] }); c.lines(clipTo(chairSeat.pts(2), all, dress.polys()), { sw: 0.7 });
  for (const l of chairLegs) c.fill(l);
  for (const a of [armL, armR]) { c.hatch(a, { angle: 0, spacing: 1.3, sw: 0.3, holes: [handL, handR, forearmL, forearmR] }); c.lines(clipTo(a.pts(2), all, [handL, handR, forearmL, forearmR].flatMap(p => p.polys())), { sw: 0.7 }); }
  c.hatch(dress, { angle: 92, spacing: 2.2, sw: 0.26, spacingFn: t => 1.4 + 2 * t, jitter: 0.3 });
  c.drapery(dress, [[[wx - 6, wy - 90], [wx - 10, wy - 50], [wx - 12, wy - 6]], [[wx + 8, wy - 90], [wx + 12, wy - 50], [wx + 16, wy - 6]]], { side: 1, width: 8, spacing: 1.5, sw: 0.3, foldSw: 0.7 });
  c.outlineVar(dress, { min: 0.6, max: 1.3, light: -60 });
  for (const a of [forearmL, forearmR]) { c.hatch(a, { angle: 30, spacing: 1.6, sw: 0.24 }); c.draw(a, { sw: 0.8 }); }
  for (const h of [handL, handR]) { c.hatch(h, { angle: 20, spacing: 1.5, sw: 0.22 }); c.draw(h, { sw: 0.7 }); }
  // the fingers clenched over the arm-ends
  c.lines([[[wx - 44, wy - 78], [wx - 44, wy - 72]], [[wx - 40, wy - 78], [wx - 40, wy - 71]], [[wx - 36, wy - 78], [wx - 36, wy - 71]], [[wx + 44, wy - 78], [wx + 44, wy - 72]], [[wx + 40, wy - 78], [wx + 40, wy - 71]], [[wx + 36, wy - 78], [wx + 36, wy - 71]]], { sw: 0.4 });
  c.hatch(neck, { angle: 90, spacing: 1.6, sw: 0.22 }); c.draw(neck, { sw: 0.7 });
  c.hatch(head, { angle: 100, spacing: 2.6, sw: 0.2, spacingFn: t => 1.6 + 2.4 * t }); c.draw(head, { sw: 0.9 });
  // the face: eyes wide open, brows up, the mouth a small tight line
  for (const sx of [-1, 1]) { const x = wx + sx * 5, y = wy - 140; c.draw(Path.ellipse(x, y, 3.2, 2.4), { sw: 0.6 }); c.fill(Path.circle(x, y, 1.4)); c.draw(new Path().M(x - 3.4, y - 5.2).C(x - 1.6, y - 6.6, x + 1.6, y - 6.6, x + 3.4, y - 5.2), { sw: 0.45 }); }
  c.draw(new Path().M(wx, wy - 136).L(wx - 1, wy - 132).L(wx + 1, wy - 131), { sw: 0.4 }); c.draw(new Path().M(wx - 3, wy - 127.5).L(wx + 3, wy - 127.5), { sw: 0.6 });
  // hair: a dark mass, two strands already down
  const strand = (a, b, w) => { const pts = Path.smooth([a, [(a[0] + b[0]) / 2 + 2, (a[1] + b[1]) / 2], b]).pts(3); const L = [], R = []; for (let k = 0; k < pts.length; k++) { const t = k / (pts.length - 1); const ww = w * Math.sin(Math.PI * t) + 0.1; const p = pts[k], q = pts[Math.min(pts.length - 1, k + 1)], o = pts[Math.max(0, k - 1)]; let nx = -(q[1] - o[1]), ny = q[0] - o[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l; L.push([p[0] + nx * ww, p[1] + ny * ww]); R.push([p[0] - nx * ww, p[1] - ny * ww]); } return Path.poly(L.concat(R.reverse())); };
  c.fillEO([hair, strand([wx - 6, wy - 158], [wx - 20, wy - 110], 0.6), strand([wx + 8, wy - 158], [wx + 22, wy - 110], 0.6), strand([wx, wy - 160], [wx + 10, wy - 140], 0.4)]);
  // the rat, in the shadow under the chair: rats' alley
  const rx = wx - 20, ry = wy + 2; c.fill(S([[rx - 12, ry], [rx - 4, ry - 5], [rx + 6, ry - 5], [rx + 12, ry - 1], [rx + 8, ry + 2], [rx - 10, ry + 2]], 0.5)); c.draw(Path.smooth([[rx - 12, ry], [rx - 22, ry - 4], [rx - 28, ry + 2]]), { sw: 0.9 });
  c.frame();
  return c;
};
