// CCLXXIX  Elizabeth and Leicester, beating oars; the stern was formed a gilded shell; the brisk swell rippled both shores; white towers.
const { Card, Path, C, INK, deg, rot, clipTo, clipPolyline, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function elizabethAndLeicester() {
  const c = new Card({ name: 'Elizabeth and Leicester', numeral: 'CCLXXIX', seed: 279 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const all = [Path.rect(0, 0, 300, 520).polys()[0]];
  const waterY = 300;
  // ---------- the barge, in profile, going left; the stern at the right a gilded shell; a canopy amidships; the oars
  const hull = S([[px0 + 22, 330], [px0 + 30, 318], [70, 322], [130, 324], [190, 324], [240, 322], [262, 312], [270, 300], [266, 322], [260, 342], [240, 350], [190, 352], [130, 352], [70, 350], [px0 + 34, 344]], 0.4);
  const shell = (() => { const p = new Path(); const cx = 258, cy = 318, r = 30; p.M(cx, cy + 4); for (let i = 0; i <= 9; i++) { const a0 = deg(-150 + i * 120 / 9), a1 = deg(-150 + (i + 0.5) * 120 / 9); if (i < 9) p.L(cx + Math.cos(a0) * r, cy + Math.sin(a0) * r).L(cx + Math.cos(a1) * (r - 4), cy + Math.sin(a1) * (r - 4)); else p.L(cx + Math.cos(a0) * r, cy + Math.sin(a0) * r); } p.Z(); return p; })();
  const canopyTop = Path.poly([[96, 268], [206, 268], [214, 274], [88, 274]]);
  const canopyPosts = [Path.rect(98, 274, 2.4, 48), Path.rect(200, 274, 2.4, 48)];
  const drape = Path.poly([[88, 274], [214, 274], [212, 284], [206, 280], [200, 286], [194, 280], [188, 286], [182, 280], [176, 286], [170, 280], [164, 286], [158, 280], [152, 286], [146, 280], [140, 286], [134, 280], [128, 286], [122, 280], [116, 286], [110, 280], [104, 286], [98, 280], [92, 284]]);
  // the two seated under the canopy: the Queen at the right (toward the stern), Leicester at the left; both in ruffs
  const sitter = (x, y, s, queen) => {
    const M = p => p.scale(s, s).translate(x, y);
    return {
      body: M(S(queen ? [[-16, -30], [16, -30], [22, -10], [26, 8], [-26, 8], [-22, -10]] : [[-13, -30], [13, -30], [16, -10], [17, 8], [-17, 8], [-16, -10]], 0.45)),
      ruff: M(Path.ellipse(0, -32, queen ? 17 : 13, 5)),
      head: M(S([[-7, -52], [7, -52], [10, -44], [7, -34], [-7, -34], [-10, -44]], 0.5)),
      hair: M(queen ? S([[-11, -48], [-6, -60], [6, -60], [11, -48], [8, -50], [0, -54], [-8, -50]], 0.4) : Path.poly([[-8, -52], [8, -52], [8, -56], [4, -60], [-4, -60], [-8, -56]])),
      x, y, s, queen,
    };
  };
  const Q = sitter(178, 322, 0.86, true), L = sitter(126, 322, 0.86, false);
  const sitters = [Q, L].flatMap(s => [s.body, s.ruff, s.head, s.hair]);
  // the oars: six on the near side, each a line from the gunwale down into the water at a beat
  const oars = []; for (let i = 0; i < 6; i++) { const x = 60 + i * 30; oars.push([[x + 6, 330], [x - 10, 352], [x - 18, 366]]); }
  const bargeParts = [hull, shell, canopyTop, ...canopyPosts, drape, ...sitters];
  // ---------- the far bank: white towers; the sky above with the southwest wind in it
  const keep = Path.rect(196, 196, 56, 68); const turrets = [[196, 8], [244, 8]].map(([x, w]) => Path.rect(x - 1, 178, w + 2, 20));
  const church = Path.poly([[60, 264], [60, 214], [70, 214], [70, 190], [78, 178], [86, 190], [86, 214], [110, 214], [110, 264]]);
  const bankLine = 264;
  const towers = [keep, ...turrets, church];
  c.hatch(Path.rect(px0, py0, px1 - px0, bankLine - py0), { angle: 0, spacing: 2.4, sw: 0.22, holes: towers.concat(bargeParts), spacingFn: t => 1.6 + 3 * t, dash: [60, 30, 120, 20], jitter: 0.2 });
  // the wind: a few long curved lines crossing the sky from the lower left
  for (const [y0, y1] of [[120, 96], [150, 132], [186, 170]]) c.lines(clipTo(new Path().M(px0, y0).C(80, y0 - 6, 160, y1 + 8, px1, y1).pts(2), all, towers.concat(bargeParts).flatMap(p => p.polys())), { sw: 0.4 });
  // the far bank: a low strip, and the towers on it, white (bare) with a little hatch on their shaded sides
  c.hatch(Path.rect(px0, bankLine - 6, px1 - px0, 6), { angle: 0, spacing: 1.2, sw: 0.3, holes: towers.concat(bargeParts) });
  for (const t of towers) { c.lines(clipTo(t.pts(2).concat([t.pts(2)[0]]), all, bargeParts.flatMap(p => p.polys())), { sw: 0.7 }); }
  c.hatch(Path.rect(232, 196, 20, 68), { angle: 90, spacing: 1.4, sw: 0.24, holes: bargeParts }); c.hatch(Path.rect(96, 214, 14, 50), { angle: 90, spacing: 1.4, sw: 0.24, holes: bargeParts });
  // battlements on the keep and its turrets; slit windows
  for (const [x0, x1, y] of [[196, 252, 196], [195, 205, 178], [243, 253, 178]]) for (let x = x0; x < x1; x += 6) c.fill(Path.rect(x, y - 3, 3, 3));
  for (const [x, y] of [[208, 214], [224, 214], [208, 240], [224, 240]]) c.fill(Path.rect(x, y, 2, 8));
  // the church: a spire, and the peal of bells as arcs beside it
  c.draw(new Path().M(70, 214).L(78, 178).L(86, 214), { sw: 0.6 }); c.fill(Path.poly([[74, 214], [78, 200], [82, 214]]));
  for (const r of [8, 13, 18]) { c.draw(Path.arc(78, 196, r, deg(200), deg(250), { move: true }), { sw: 0.4 }); c.draw(Path.arc(78, 196, r, deg(290), deg(340), { move: true }), { sw: 0.4 }); }
  // ---------- the river: the brisk swell, both shores rippled; lines with small crests, the oars' splashes
  const river = Path.rect(px0, bankLine, px1 - px0, py1 - bankLine);
  const swell = []; for (let y = bankLine + 4; y < py1; y += 4 + (y - bankLine) * 0.03) { const pl = []; for (let x = px0; x <= px1; x += 3) pl.push([x, y + 1.6 * Math.sin(x / 7 + y) + 0.6 * Math.sin(x / 2.3)]); swell.push(pl); }
  c.lines(swell.flatMap(pl => clipTo(pl, river.polys(), [hull, shell].flatMap(p => p.polys()))), { sw: 0.3 });
  for (const o of oars) { const tip = o[2]; for (const r of [3, 6]) c.draw(Path.ellipse(tip[0], tip[1] + 2, r * 2, r * 0.6), { sw: 0.35 }); }
  // ---------- the barge drawn: the hull dark with a paper strake; the shell gold; the canopy striped; the oars
  const strake = Path.poly([[px0 + 30, 334], [262, 330], [262, 332], [px0 + 30, 336]]);
  c.fillEO([hull, strake]);
  c.fill(shell, C.gold); c.draw(shell, { sw: 0.6 }); for (let i = 1; i < 9; i++) { const a = deg(-150 + i * 120 / 9); c.draw(new Path().M(258, 322).L(258 + Math.cos(a) * 28, 318 + Math.sin(a) * 28), { sw: 0.35 }); }
  c.fill(canopyTop); for (const p of canopyPosts) c.fill(p);
  c.hatch(drape, { angle: 90, spacing: 3, sw: 0.7 }); c.draw(drape, { sw: 0.5 });
  for (const o of oars) c.lines([o], { sw: 1.3 });
  // the sitters: the Queen with her high hair and wide ruff, Leicester capped and bearded; both facing forward, toward the bow
  for (const s of [Q, L]) {
    c.hatch(s.body, { angle: 90, spacing: 1.4, sw: 0.3, spacingFn: t => 1 + 1.2 * t }); c.draw(s.body, { sw: 0.8 });
    if (s.queen) { c.hatch(s.body, { angle: 0, spacing: 5, sw: 0.4, clip: s.body }); }
    c.hatch(s.ruff, { angle: 0, spacing: 1.0, sw: 0.24 }); c.draw(s.ruff, { sw: 0.6 });
    c.hatch(s.head, { angle: 100, spacing: 2.2, sw: 0.2 }); c.draw(s.head, { sw: 0.8 });
    c.fill(s.hair);
    const hx = s.x, hy = s.y - 44 * s.s; c.fill(Path.ellipse(hx - 3 * s.s, hy, 1.1, 0.9)); c.fill(Path.ellipse(hx + 3 * s.s, hy, 1.1, 0.9)); c.draw(new Path().M(hx - 2.4, hy + 6).L(hx + 2.4, hy + 6), { sw: 0.5 });
    if (!s.queen) { const bd = S([[hx - 6, hy + 6], [hx + 6, hy + 6], [hx + 5, hy + 12], [hx, hy + 16], [hx - 5, hy + 12]], 0.5); c.hatch(bd, { angle: 80, spacing: 1, sw: 0.3 }); }
  }
  // a small gold crown on the Queen
  c.fill(Path.poly([[Q.x - 7, Q.y - 52 * Q.s], [Q.x - 6, Q.y - 60 * Q.s], [Q.x - 3, Q.y - 55 * Q.s], [Q.x, Q.y - 62 * Q.s], [Q.x + 3, Q.y - 55 * Q.s], [Q.x + 6, Q.y - 60 * Q.s], [Q.x + 7, Q.y - 52 * Q.s]]), C.gold);
  // a pennant at the bow
  c.draw(new Path().M(px0 + 30, 318).L(px0 + 30, 280), { sw: 0.8 }); c.fill(Path.poly([[px0 + 30, 280], [px0 + 54, 286], [px0 + 30, 292]]));
  c.frame();
  return c;
};
