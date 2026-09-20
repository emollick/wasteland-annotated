// CCLXIV  Where the walls of Magnus Martyr hold inexplicable splendour of Ionian white and gold: the nave, its columns going back toward the east window; a fishman with a mandoline on the step.
const { Card, Path, C, INK, deg, rot, lerp, clipTo, clipPolyline, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function magnusMartyr() {
  const c = new Card({ name: 'Magnus Martyr', numeral: 'CCLXIV', seed: 264 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const all = [Path.rect(0, 0, 300, 520).polys()[0]];
  // ---------- the nave in one-point perspective: two rows of columns going back to the east end
  const V = [150, 236];
  const nearBase = 408, nearTop = 96, nearX = 34, nearW = 26;
  const cols = [];
  for (const side of [-1, 1]) for (const t of [0, 0.3, 0.52, 0.68, 0.8]) {
    const x = V[0] + side * (V[0] - nearX) * (1 - t) * (side < 0 ? 1 : 1) * (side < 0 ? 1 : 1);
    const xx = side < 0 ? nearX + (V[0] - nearX) * t : (300 - nearX) - ((300 - nearX) - V[0]) * t;
    const base = nearBase + (V[1] - nearBase) * t, top = nearTop + (V[1] - nearTop) * t; const w = nearW * (1 - t) + 2 * t;
    cols.push({ x: xx, base, top, w, t, side });
  }
  cols.sort((a, b) => b.t - a.t); // far first
  const colShapes = cols.map(k => Path.rect(k.x - k.w / 2, k.top, k.w, k.base - k.top));
  // the fishman on the step at the bottom right, sitting, cap, apron, the mandoline across his knee
  const fx = 236, fy = 452;
  const fish = {
    body: S([[fx - 16, fy - 46], [fx + 12, fy - 48], [fx + 20, fy - 30], [fx + 22, fy - 6], [fx - 22, fy - 6], [fx - 22, fy - 30]], 0.45),
    head: S([[fx - 8, fy - 66], [fx + 6, fy - 66], [fx + 11, fy - 56], [fx + 8, fy - 46], [fx - 6, fy - 46], [fx - 12, fy - 56]], 0.5),
    cap: Path.poly([[fx - 14, fy - 64], [fx + 10, fy - 64], [fx + 16, fy - 62], [fx + 10, fy - 68], [fx + 2, fy - 72], [fx - 8, fy - 70], [fx - 14, fy - 64]]),
    legs: S([[fx - 22, fy - 8], [fx + 22, fy - 8], [fx + 30, fy + 6], [fx + 26, fy + 10], [fx - 26, fy + 10], [fx - 30, fy + 6]], 0.4),
    mand: S([[fx - 12, fy - 22], [fx + 2, fy - 24], [fx + 10, fy - 14], [fx + 6, fy - 4], [fx - 8, fy - 2], [fx - 16, fy - 12]], 0.5),
    neck: Path.poly([[fx + 6, fy - 24], [fx + 30, fy - 40], [fx + 32, fy - 37], [fx + 9, fy - 20]]),
    arm: tube([[fx - 12, fy - 40], [fx - 20, fy - 26], [fx - 8, fy - 16]], t => 8 - 2 * t),
  };
  const fishParts = Object.values(fish);
  // ---------- the far wall and the east window, around the vanishing point
  const endWall = Path.rect(V[0] - 40, V[1] - 66, 80, 106);
  const eastWin = Path.poly([[V[0] - 14, V[1] + 24], [V[0] - 14, V[1] - 30], [V[0] - 10, V[1] - 42], [V[0], V[1] - 48], [V[0] + 10, V[1] - 42], [V[0] + 14, V[1] - 30], [V[0] + 14, V[1] + 24]]);
  // ---------- the ceiling: a barrel vault, lines running back to the point and transverse arches; the floor: a chequer in perspective
  const ceiling = Path.poly([[px0, py0], [px1, py0], [V[0] + 40, V[1] - 66], [V[0] - 40, V[1] - 66]]);
  const floor = Path.poly([[px0, py1], [px1, py1], [V[0] + 40, V[1] + 40], [V[0] - 40, V[1] + 40]]);
  const wallL = Path.poly([[px0, py0], [V[0] - 40, V[1] - 66], [V[0] - 40, V[1] + 40], [px0, py1]]);
  const wallR = Path.poly([[px1, py0], [V[0] + 40, V[1] - 66], [V[0] + 40, V[1] + 40], [px1, py1]]);
  const holesAll = colShapes.concat(fishParts);
  // the side walls, back in shadow: hatched toward the point
  for (const [w, side] of [[wallL, -1], [wallR, 1]]) {
    c.hatch(w, { angle: 90, spacing: 1.6, sw: 0.26, holes: holesAll, spacingFn: t => 1.1 + 1.4 * t });
    const pls = []; for (let i = 0; i <= 12; i++) { const y = py0 + (py1 - py0) * i / 12; pls.push(...clipTo([[side < 0 ? px0 : px1, y], [V[0] + side * 40, V[1] - 66 + 106 * i / 12]], w.polys(), holesAll.flatMap(h => h.polys()))); } c.lines(pls, { sw: 0.3 });
  }
  // the ceiling: transverse ribs as arcs, and lines to the point
  c.hatch(ceiling, { angle: 0, spacing: 2.6, sw: 0.22, holes: holesAll, spacingFn: t => 1.6 + 2.6 * t });
  for (const t of [0, 0.3, 0.52, 0.68, 0.8]) { const x0 = nearX + (V[0] - nearX) * t, x1 = (300 - nearX) - ((300 - nearX) - V[0]) * t, top = nearTop + (V[1] - nearTop) * t; const rise = (x1 - x0) * 0.32; c.lines(clipTo(new Path().M(x0, top).C(x0, top - rise, x1, top - rise, x1, top).pts(2), all, holesAll.flatMap(h => h.polys())), { sw: 0.6 }); }
  for (const x of [px0 + 20, 90, 150, 210, px1 - 20]) c.lines(clipTo([[x, py0], [V[0] + (x - 150) * 0.3, V[1] - 66]], ceiling.polys(), holesAll.flatMap(h => h.polys())), { sw: 0.3 });
  // the floor: a chequer
  const F = (u, v) => { const xl = px0 + (V[0] - 40 - px0) * v, xr = px1 - (px1 - V[0] - 40) * v; return [xl + (xr - xl) * u, py1 + (V[1] + 40 - py1) * v]; };
  const nV = 8, nU = 8; for (let i = 0; i < nU; i++) for (let j = 0; j < nV; j++) { if ((i + j) % 2) continue; const v0 = 1 - Math.pow(1 - j / nV, 1.6), v1 = 1 - Math.pow(1 - (j + 1) / nV, 1.6); const cell = Path.poly([F(i / nU, v0), F((i + 1) / nU, v0), F((i + 1) / nU, v1), F(i / nU, v1)]); c.hatch(cell, { angle: 0, spacing: 1.2, sw: 0.3, holes: holesAll }); }
  c.lines(clipTo(floor.pts(2).concat([floor.pts(2)[0]]), all, holesAll.flatMap(h => h.polys())), { sw: 0.5 });
  // the end wall and the window, white
  c.hatch(endWall, { angle: 90, spacing: 1.8, sw: 0.24, holes: [eastWin].concat(holesAll), spacingFn: t => 1.2 + 1.6 * Math.abs(Math.sin(t * Math.PI)) }); c.draw(endWall, { sw: 0.7 });
  c.draw(eastWin, { sw: 0.7 }); c.draw(new Path().M(V[0], V[1] - 48).L(V[0], V[1] + 24).M(V[0] - 14, V[1] - 14).L(V[0] + 14, V[1] - 14), { sw: 0.4 });
  // the altar and its rail
  c.fill(Path.rect(V[0] - 12, V[1] + 26, 24, 6)); c.draw(new Path().M(V[0] - 30, V[1] + 40).L(V[0] + 30, V[1] + 40), { sw: 0.6 });
  // ---------- the columns: white shafts, fluted, with a shadow side; gold Ionic capitals; the entablature over each row
  for (const k of cols) {
    const sh = Path.rect(k.x - k.w / 2, k.top, k.w, k.base - k.top);
    // flutes: vertical lines that crowd toward the edges
    const nf = Math.max(3, Math.round(k.w / 3)); const pls = []; for (let i = 1; i < nf; i++) { const u = i / nf; const x = k.x - k.w / 2 + k.w * (0.5 - 0.5 * Math.cos(u * Math.PI)); pls.push([[x, k.top + 6], [x, k.base - 6]]); }
    c.lines(pls.flatMap(l => clipTo(l, all, fishParts.flatMap(p => p.polys()))), { sw: 0.24 + 0.2 * (1 - k.t) });
    // shadow on the side away from the window
    const shade = Path.rect(k.side < 0 ? k.x - k.w / 2 : k.x + k.w * 0.15, k.top, k.w * 0.35, k.base - k.top); c.hatch(shade, { angle: 90, spacing: 0.9 + 0.8 * k.t, sw: 0.22, holes: fishParts });
    c.lines(clipTo(sh.pts(2).concat([sh.pts(2)[0]]), all, fishParts.flatMap(p => p.polys())), { sw: 0.5 + 0.4 * (1 - k.t) });
    // base and capital: the capital gold with two volutes
    const bw = k.w * 1.3, bh = 4 * (1 - k.t) + 1; c.hatch(Path.rect(k.x - bw / 2, k.base - bh, bw, bh), { angle: 0, spacing: 1, sw: 0.3 }); c.draw(Path.rect(k.x - bw / 2, k.base - bh, bw, bh), { sw: 0.5 });
    const cw = k.w * 1.5, ch = 7 * (1 - k.t) + 1.5; const cap = Path.rect(k.x - cw / 2, k.top - ch, cw, ch); c.fill(cap, C.gold); c.draw(cap, { sw: 0.5 });
    const r = ch * 0.42; for (const sx of [-1, 1]) { const vx = k.x + sx * (cw / 2 - r * 1.1), vy = k.top - ch / 2; c.draw(Path.circle(vx, vy, r), { sw: 0.45 }); if (r > 1.6) c.draw(Path.circle(vx, vy, r * 0.45), { sw: 0.35 }); }
  }
  // the entablature: a beam over each row, running back to the point, with dentils
  for (const side of [-1, 1]) { const x0 = side < 0 ? nearX - nearW * 0.8 : 300 - nearX + nearW * 0.8, x1 = V[0] + side * 30; const y0 = nearTop - 12, y1 = V[1] - 60; const beam = Path.poly([[x0, y0], [x1, y1], [x1, y1 + 3], [x0, y0 + 12]]); c.hatch(beam, { angle: Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI, spacing: 1.4, sw: 0.26 }); c.draw(beam, { sw: 0.7 }); }
  // ---------- the fishman: leaning back on the step, his cap over his eyes, the mandoline whining
  c.hatch(fish.legs, { angle: 20, spacing: 1.6, sw: 0.28 }); c.draw(fish.legs, { sw: 0.7 });
  c.hatch(fish.body, { angle: 90, spacing: 1.8, sw: 0.28, jitter: 0.3 }); c.draw(fish.body, { sw: 0.8 });
  c.hatch(S([[fx - 14, fy - 30], [fx + 12, fy - 30], [fx + 16, fy - 8], [fx - 18, fy - 8]], 0.3), { angle: 0, spacing: 4, sw: 0.5, clip: fish.body }); // the apron's stripes
  c.hatch(fish.arm, { angle: 40, spacing: 1.6, sw: 0.26 }); c.draw(fish.arm, { sw: 0.7 });
  c.hatch(fish.mand, { angle: 0, spacing: 1.3, sw: 0.24 }); c.draw(fish.mand, { sw: 0.8 }); c.fill(Path.circle(fx - 2, fy - 13, 2.4)); c.fill(fish.neck); c.lines([[[fx - 8, fy - 8], [fx + 28, fy - 36]], [[fx - 6, fy - 6], [fx + 29, fy - 34]]], { sw: 0.25 });
  c.hatch(fish.head, { angle: 100, spacing: 2.2, sw: 0.2 }); c.draw(fish.head, { sw: 0.8 }); c.fill(fish.cap);
  c.draw(new Path().M(fx - 4, fy - 52).C(fx - 1, fy - 50, fx + 3, fy - 50, fx + 6, fy - 52), { sw: 0.5 });
  // the whining: three short curved strokes off the strings
  c.lines([[[fx + 30, fy - 46], [fx + 36, fy - 52]], [[fx + 34, fy - 42], [fx + 42, fy - 44]], [[fx + 33, fy - 37], [fx + 40, fy - 33]]], { sw: 0.45 });
  c.frame();
  return c;
};
