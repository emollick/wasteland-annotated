// CCCXII  Phlebas the Phoenician, a fortnight dead: entering the whirlpool, past the stages of his age and youth; the current picking his bones.
const { Card, Path, C, INK, deg, clipTo, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function phlebas() {
  const c = new Card({ name: 'Phlebas the Phoenician', numeral: 'CCCXII', seed: 312 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const cx = 150, cy = 290;
  // ---------- the bones in the vortex, and three small figures of his ages on the spiral: child, man, old man
  const skull = S([[cx, 266], [cx + 12, 270], [cx + 15, 282], [cx + 10, 294], [cx + 6, 302], [cx - 6, 302], [cx - 10, 294], [cx - 15, 282], [cx - 12, 270]], 0.5);
  const bones = [tube([[cx - 40, 320], [cx - 8, 344]], () => 5), tube([[cx + 12, 330], [cx + 46, 316]], () => 4.6), tube([[cx - 30, 262], [cx - 52, 240]], () => 4.2), tube([[cx + 30, 250], [cx + 58, 262]], () => 4)];
  const ribs = []; for (let k = 0; k < 4; k++) ribs.push(Path.arc(cx, 318 + k * 7, 22 - k * 3, Math.PI * 1.1, Math.PI * 1.9, { ry: 10 - k }));
  const figure = (x, y, s, kind) => { const M = p => p.scale(s, s).translate(x, y); const parts = [M(Path.circle(0, -30, 5)), M(S([[-6, -24], [6, -24], [7, 0], [-7, 0]], 0.4)), M(tube([[-3, -1], [-5, 14]], () => 4)), M(tube([[3, -1], [6, 14]], () => 4)), M(tube([[-6, -20], [-14, -8]], () => 3.4)), M(tube([[6, -20], [14, -8]], () => 3.4))]; if (kind === 'old') parts.push(M(tube([[14, -8], [16, 16]], () => 2))); if (kind === 'child') parts.push(M(Path.circle(0, -30, 5))); return parts; };
  const figs = [...figure(62, 128, 0.7, 'child'), ...figure(248, 190, 0.95, 'man'), ...figure(70, 400, 0.9, 'old')];
  const holes = [skull, ...bones, ...figs];
  // ---------- the whirlpool: a spiral of many turns, denser toward the centre; the surface at the top with gulls
  const surface = 76;
  const gull = (x, y, s) => c.draw(new Path().M(x - 9 * s, y).C(x - 5 * s, y - 5 * s, x - 2 * s, y - 5 * s, x, y - 1 * s).C(x + 2 * s, y - 5 * s, x + 5 * s, y - 5 * s, x + 9 * s, y), { sw: 0.8 });
  gull(60, 58, 1); gull(96, 66, 0.7); gull(230, 54, 0.9);
  const wave = []; for (let x = px0; x <= px1; x += 3) wave.push([x, surface + 2.6 * Math.sin(x / 11) + 1.2 * Math.sin(x / 4.3 + 1)]);
  c.lines([wave], { sw: 1.0 }); c.lines([offsetPolyline(wave, 2.4)], { sw: 0.4 });
  const sea = Path.poly([...wave, [px1, py1], [px0, py1]]);
  const seaPolys = sea.polys();
  const spirals = [];
  for (let turn = 0; turn < 2; turn++) {
    const pts = []; for (let a = 0; a < Math.PI * 2 * 9; a += 0.05) { const r = 4 + a * 6.2; pts.push([cx + r * 1.15 * Math.cos(a + turn * Math.PI), cy + r * 0.82 * Math.sin(a + turn * Math.PI)]); }
    spirals.push(...clipTo(pts, seaPolys, holes.flatMap(h => h.polys())));
  }
  c.lines(spirals, { sw: 0.45 });
  // between the spiral arms, finer lines following them
  const fine = []; for (let turn = 0; turn < 4; turn++) { const pts = []; for (let a = Math.PI * 2; a < Math.PI * 2 * 9; a += 0.05) { const r = 4 + a * 6.2 + 3.1 * (turn % 2 ? 1 : -1) * 0.5; pts.push([cx + r * 1.15 * Math.cos(a + turn * Math.PI / 2), cy + r * 0.82 * Math.sin(a + turn * Math.PI / 2)]); } fine.push(...clipTo(pts, seaPolys, holes.flatMap(h => h.polys()))); }
  c.lines(fine, { sw: 0.2 });
  // the dark at the very centre and the corners: the eye of the whirlpool
  c.hatch(Path.circle(cx, cy, 30), { angle: 0, spacing: 1.4, sw: 0.3, holes: [skull] });
  // ---------- bones drawn: the skull, the ribs, the long bones, as bare paper with fine lines
  c.draw(skull, { sw: 0.9 }); c.fill(Path.ellipse(cx - 5, 282, 3, 3.8)); c.fill(Path.ellipse(cx + 5, 282, 3, 3.8)); c.draw(new Path().M(cx - 1.5, 290).L(cx, 293).L(cx + 1.5, 290), { sw: 0.5 }); for (let k = -3; k <= 3; k++) c.draw(new Path().M(cx + k * 2.4, 298).L(cx + k * 2.4, 302), { sw: 0.4 });
  for (const r of ribs) c.draw(r, { sw: 0.7 });
  for (const b of bones) { c.hatch(b, { angle: 30, spacing: 1.6, sw: 0.2 }); c.draw(b, { sw: 0.8 }); const bb = b.bbox(); }
  // ---------- the stages of his age and youth: three small dark figures carried round
  for (const f of figs) c.fill(f);
  c.frame();
  return c;
};
