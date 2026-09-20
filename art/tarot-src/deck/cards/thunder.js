// CDI  Ganga was sunken, and the limp leaves waited for rain, while the black clouds gathered far distant, over Himavant. The jungle crouched, humped in silence. Then spoke the thunder: DA, DA, DA.
const { Card, Path, C, INK, deg, clipTo, clipPolyline, offsetPolyline, voronoiCells } = require('../lib');
const { tube } = require('../fig');
module.exports = function thunder() {
  const c = new Card({ name: 'The Thunder', numeral: 'CDI', seed: 401 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const all = [Path.rect(0, 0, 300, 520).polys()[0]];
  // ---------- the black clouds over Himavant: one great mass filling the top of the card, its underside lobed; paper seams between the lobes
  const underside = Path.smooth([[px1 + 8, 150], [266, 168], [244, 158], [222, 176], [196, 166], [176, 184], [150, 172], [126, 190], [100, 176], [76, 190], [50, 178], [30, 192], [px0 - 8, 180]], { tension: 0.4 }).pts(3);
  const cloud = Path.poly([[px0, py0], [px1, py0], ...underside]);
  const lobe = (x, y, rx, ry) => Path.ellipse(x, y, rx, ry);
  const seams = [];
  const seam = (a, b, w) => { const pts = Path.smooth([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 6], b]).pts(3); const L = [], R = []; for (let k = 0; k < pts.length; k++) { const t = k / (pts.length - 1); const ww = w * Math.sin(Math.PI * t) + 0.1; const p = pts[k], q = pts[Math.min(pts.length - 1, k + 1)], o = pts[Math.max(0, k - 1)]; let nx = -(q[1] - o[1]), ny = q[0] - o[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l; L.push([p[0] + nx * ww, p[1] + ny * ww]); R.push([p[0] - nx * ww, p[1] - ny * ww]); } return Path.poly(L.concat(R.reverse())); };
  for (const [a, b] of [[[px0 + 10, 150], [70, 120]], [[40, 100], [110, 96]], [[90, 150], [150, 130]], [[140, 90], [200, 84]], [[170, 150], [230, 136]], [[220, 110], [px1 - 10, 118]], [[px0 + 20, 70], [80, 62]], [[200, 60], [260, 70]]]) seams.push(seam(a, b, 0.8));
  // the three forks of lightning: bare paper, out of the cloud's underside, one to each side and one to the middle
  const fork = (pts, w) => Path.poly([...pts, ...pts.slice().reverse().map((p, i) => [p[0] + w + (i % 2) * 1.2, p[1] + 0.6])]);
  const forkA = fork([[64, 176], [54, 206], [66, 220], [50, 254], [58, 262], [42, 296]], 3);
  const forkB = fork([[150, 170], [160, 200], [146, 216], [158, 246], [144, 258], [152, 290]], 3.4);
  const forkC = fork([[236, 160], [246, 196], [232, 210], [250, 248], [238, 258], [254, 292]], 3);
  const forks = [forkA, forkB, forkC];
  c.fillEO([cloud, ...seams, ...forks.map(f => f)]);
  // the sky below the cloud: hatched, close, heavy; the peaks of Himavant stand in it, white
  const peaks = Path.poly([[px0, 300], [px0, 262], [34, 232], [52, 250], [78, 214], [96, 236], [118, 226], [140, 248], [166, 216], [190, 240], [212, 222], [236, 248], [258, 228], [px1, 256], [px1, 300]]);
  const skyBelow = Path.poly([[px0, 150], [px1, 150], [px1, 300], [px0, 300]]);
  c.hatch(skyBelow, { angle: 0, spacing: 1.6, sw: 0.28, holes: [cloud, peaks, ...forks], jitter: 0.15, spacingFn: t => 1.2 + 1.6 * t });
  // the forks: an ink hair down each, so they read in dark mode too
  for (const f of [forkA, forkB, forkC]) { const pts = f.polys(1)[0]; const half = pts.slice(0, Math.floor(pts.length / 2)); c.lines([half.map(p => [p[0] + 1.6, p[1] + 0.3])].map(pl => pl.filter((p, i) => i % 1 === 0)), { sw: 0.35 }); }
  // the peaks: snow bare, the shadowed faces hatched, the ridge lines
  c.hatch(peaks, { angle: -50, spacing: 1.6, sw: 0.26, clip: Path.poly([[px0, 300], [34, 232], [52, 250], [78, 214], [96, 236], [118, 226], [140, 248], [166, 216], [190, 240], [212, 222], [236, 248], [258, 228], [px1, 256], [px1, 300]]), spacingFn: t => 1.2 + 2.6 * t });
  for (const [a, b] of [[[34, 232], [46, 300]], [[78, 214], [92, 300]], [[118, 226], [128, 300]], [[166, 216], [176, 300]], [[212, 222], [222, 300]], [[258, 228], [266, 300]]]) c.hatch(Path.poly([a, b, [b[0] + 26, 300], [a[0] + 12, a[1] + 8]]), { angle: 70, spacing: 1.1, sw: 0.3, clip: peaks });
  c.lines([peaks.polys()[0].slice(1, 14)], { sw: 0.9 });
  // ---------- the jungle, crouched, humped in silence: rounded dark masses across the middle, dense hatch, no leaf shown
  const humps = []; for (const [x, y, rx, ry] of [[40, 318, 40, 24], [98, 324, 44, 26], [156, 316, 42, 28], [214, 326, 46, 26], [270, 318, 34, 24], [70, 336, 32, 18], [130, 342, 36, 18], [190, 340, 34, 18], [246, 342, 34, 18]]) humps.push(Path.ellipse(x, y, rx, ry));
  const jungle = Path.poly([[px0, 300], [px1, 300], [px1, 348], [px0, 348]]);
  humps.forEach((h, i) => { c.hatch(h, { angle: 60 + (i % 3) * 30, spacing: 1.0, sw: 0.3, jitter: 0.3, clip: Path.poly([[px0, 292], [px1, 292], [px1, 350], [px0, 350]]) }); c.hatch(h, { angle: -30 + (i % 3) * 30, spacing: 1.6, sw: 0.22, clip: Path.poly([[px0, 292], [px1, 292], [px1, 350], [px0, 350]]) }); });
  for (const h of humps) c.lines(clipTo(h.pts(2), [Path.poly([[px0, 292], [px1, 292], [px1, 350], [px0, 350]]).polys()[0]]), { sw: 0.6 });
  // ---------- Ganga sunken: wide cracked banks, and a thread of water left in the middle; limp leaves at the water's edge
  const bankTop = 350;
  const water = Path.poly([[px0 + 92, 384], [px1 - 88, 380], [px1 - 60, 420], [px1 - 30, py1], [px0 + 40, py1], [px0 + 70, 420]]);
  const bankL = Path.poly([[px0, bankTop], [px1, bankTop], [px1, py1], [px0, py1]]);
  const seeds = []; for (let i = 0; i < 64; i++) seeds.push([rnd.range(px0 - 10, px1 + 10), rnd.range(bankTop, py1 + 10)]);
  const cells = voronoiCells(seeds, [[px0 - 20, 340], [px1 + 20, 340], [px1 + 20, py1 + 20], [px0 - 20, py1 + 20]]);
  const fissures = [];
  for (const cell of cells) { if (cell.length < 3) continue; const cx0 = cell.reduce((a, q) => a + q[0], 0) / cell.length, cy0 = cell.reduce((a, q) => a + q[1], 0) / cell.length; const shrunk = cell.map(p => [cx0 + (p[0] - cx0) * 0.92, cy0 + (p[1] - cy0) * 0.92]); fissures.push(...clipTo(shrunk.concat([shrunk[0]]), bankL.polys(), water.polys())); }
  c.lines(fissures, { sw: 0.5 });
  c.hatch(bankL, { angle: 0, spacing: 4.2, sw: 0.2, holes: [water], jitter: 0.5, dash: [3, 24, 5, 16] });
  // the water: slow lines, and the boat on it, responding gaily
  c.hatch(water, { angle: 0, spacing: 2.6, sw: 0.28, spacingFn: t => 1.8 + 2.2 * t, jitter: 0.2 }); c.draw(water, { sw: 0.7 });
  const bx = 150, by = 430;
  const hull = S([[bx - 18, by], [bx + 18, by], [bx + 14, by + 7], [bx - 14, by + 7]], 0.3); c.fill(hull);
  c.draw(new Path().M(bx - 2, by).L(bx - 2, by - 34), { sw: 1.0 }); const sail = Path.poly([[bx, by - 32], [bx + 22, by - 10], [bx, by - 3]]); c.hatch(sail, { angle: 70, spacing: 1.4, sw: 0.24 }); c.draw(sail, { sw: 0.6 });
  c.draw(new Path().M(bx - 6, by + 2).L(bx - 22, by + 12), { sw: 0.8 }); // the oar
  // limp leaves at the water's edge: long drooping leaf shapes hanging from the bank
  const leaf = (x, y, dir, s) => { const p = S([[x, y], [x + dir * 4 * s, y + 6 * s], [x + dir * 5 * s, y + 16 * s], [x + dir * 2 * s, y + 24 * s], [x - dir * 1 * s, y + 16 * s], [x - dir * 2 * s, y + 6 * s]], 0.5); c.hatch(p, { angle: dir > 0 ? 70 : 110, spacing: 1.1, sw: 0.26 }); c.draw(p, { sw: 0.6 }); c.draw(Path.smooth([[x, y], [x + dir * 2 * s, y + 12 * s], [x + dir * 2 * s, y + 24 * s]]), { sw: 0.4 }); };
  leaf(100, 372, 1, 1); leaf(88, 380, 1, 0.8); leaf(112, 366, -1, 0.7); leaf(206, 368, -1, 1); leaf(218, 374, -1, 0.8); leaf(196, 362, 1, 0.7); leaf(70, 430, 1, 1.1); leaf(240, 426, -1, 1.1);
  // the key, on the near bank, gold: heard once turning in the door
  const kx = 232, ky = 452;
  const key = new Path().M(kx, ky).L(kx + 24, ky).L(kx + 24, ky + 5).L(kx + 21, ky + 5).L(kx + 21, ky + 2.6).L(kx + 17, ky + 2.6).L(kx + 17, ky + 5).L(kx + 14, ky + 5).L(kx + 14, ky + 2.6).L(kx, ky + 2.6).Z();
  c.fill(key, C.gold); c.draw(key, { sw: 0.4 }); c.fillEO([Path.circle(kx - 4, ky + 1.3, 5.2), Path.circle(kx - 4, ky + 1.3, 2.2)], C.gold); c.draw(Path.circle(kx - 4, ky + 1.3, 5.2), { sw: 0.4 }); c.draw(Path.circle(kx - 4, ky + 1.3, 2.2), { sw: 0.4 });
  c.frame();
  return c;
};
