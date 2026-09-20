// XXXVI  The hyacinth girl, back late from the garden, arms full and hair wet, against the heart of light.
const { Card, Path, C, INK, deg, clipTo, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function hyacinthGirl() {
  const c = new Card({ name: 'The Hyacinth Girl', numeral: 'XXXVI', seed: 36 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  // ---------- the figure: full length, facing us, a drop-waist dress, arms cradling a sheaf of hyacinths
  const dress = S([[150, 176], [172, 180], [184, 196], [188, 230], [186, 270], [190, 320], [196, 372], [200, 412], [176, 418], [150, 420], [124, 418], [100, 412], [104, 372], [110, 320], [114, 270], [112, 230], [116, 196], [128, 180]], 0.45);
  const face = S([[150, 116], [163, 121], [168, 138], [166, 156], [158, 168], [150, 172], [142, 168], [134, 156], [132, 138], [137, 121]], 0.55);
  const hair = S([[150, 104], [166, 108], [176, 126], [178, 156], [182, 190], [176, 204], [168, 190], [170, 156], [166, 132], [150, 128], [134, 132], [130, 156], [132, 190], [124, 204], [118, 190], [122, 156], [124, 126], [134, 108]], 0.45);
  const neck = S([[142, 166], [158, 166], [160, 182], [140, 182]], 0.4);
  const armL = tube([[126, 200], [110, 236], [122, 268], [144, 276]], t => 15 - 3 * t);
  const armR = tube([[176, 200], [192, 236], [180, 266], [158, 274]], t => 15 - 3 * t);
  const handL = S([[136, 266], [148, 262], [158, 268], [160, 280], [150, 288], [138, 286], [132, 276]], 0.45);
  const handR = S([[156, 262], [168, 262], [174, 272], [170, 284], [158, 288], [150, 280], [150, 268]], 0.45);
  const shoes = [S([[118, 416], [140, 416], [142, 430], [116, 430]], 0.4), S([[160, 416], [182, 416], [184, 430], [158, 430]], 0.4)];
  // the sheaf of hyacinths in her arms: a mass of spikes fanning up from the hands
  const sheaf = S([[150, 262], [180, 250], [206, 224], [216, 196], [204, 186], [180, 200], [160, 214], [150, 210], [140, 214], [120, 200], [96, 186], [84, 196], [94, 224], [120, 250]], 0.5);
  const figure = [dress, face, hair, neck, armL, armR, handL, handR, ...shoes, sheaf];
  // ---------- the heart of light: a bare oval behind her; the garden hatched densely round it
  const light = Path.ellipse(150, 250, 108, 178);
  const garden = Path.rect(px0, py0, px1 - px0, py1 - py0);
  const holes = [light].concat(figure);
  c.hatch(garden, { angle: 90, spacing: 1.6, sw: 0.32, holes, jitter: 0.25 });
  c.hatch(garden, { angle: 15, spacing: 2.4, sw: 0.24, holes });
  // rays: the light's edge dissolving into the dark in short strokes
  const rays = []; for (let i = 0; i < 160; i++) { const a = i / 160 * Math.PI * 2; const r0 = 1.0, r1 = 1.0 + 0.05 + 0.09 * Math.abs(Math.sin(i * 2.3)); rays.push([[150 + 108 * r0 * Math.cos(a), 250 + 178 * r0 * Math.sin(a)], [150 + 108 * r1 * Math.cos(a), 250 + 178 * r1 * Math.sin(a)]]); }
  // (drawn as paper gaps: cut the rays out of the hatching by hatching a second ring with holes) -- simpler: draw thin ink rays inside the light's edge
  const inner = []; for (let i = 0; i < 90; i++) { const a = i / 90 * Math.PI * 2; const r1 = 1.0 - 0.04 - 0.07 * Math.abs(Math.sin(i * 1.7)); inner.push(...clipTo([[150 + 108 * Math.cos(a), 250 + 178 * Math.sin(a)], [150 + 108 * r1 * Math.cos(a), 250 + 178 * r1 * Math.sin(a)]], light.polys(), figure.flatMap(f => f.polys()))); }
  c.lines(inner, { sw: 0.3 });
  // a garden: a path at her feet, a low wall with a gate at the left and right edges, leaves in the dark
  c.draw(new Path().M(px0, 432).L(px1, 432), { sw: 0.6 });
  c.hatch(Path.rect(px0, 432, px1 - px0, py1 - 432), { angle: 0, spacing: 3.4, sw: 0.24, holes: shoes, dash: [8, 40, 3, 12] });
  const leaf = (x, y, a, L) => new Path().M(0, 0).C(L * 0.3, -L * 0.34, L * 0.75, -L * 0.26, L, 0).C(L * 0.75, L * 0.26, L * 0.3, L * 0.34, 0, 0).Z().rotate(deg(a)).translate(x, y);
  for (let i = 0; i < 34; i++) { const x = rnd.range(px0 + 4, px1 - 4), y = rnd.range(py0 + 6, 426); if (require('../lib').inside([x, y], light.polys()) ) continue; const lf = leaf(x, y, rnd.range(-90, 90), rnd.range(9, 16)); c.fillEO([lf, leaf(x + 1.5, y, 0, 0.1)]); c.draw(new Path().M(x, y).L(x + 8 * Math.cos(deg(30)), y + 8 * Math.sin(deg(30))), { sw: 0.3, stroke: 'none' }); }
  // ---------- the figure drawn
  c.hatch(dress, { angle: 88, spacing: 2.8, sw: 0.24, jitter: 0.3 });
  c.drapery(dress, [[[128, 300], [124, 360], [120, 414]], [[172, 300], [178, 360], [184, 414]], [[150, 290], [150, 360], [152, 416]]], { side: 1, width: 8, spacing: 1.5, sw: 0.28, foldSw: 0.6 });
  c.hatch(S([[184, 196], [188, 230], [186, 270], [190, 320], [196, 372], [200, 412], [186, 412], [182, 372], [176, 320], [174, 270], [176, 230], [172, 200]], 0.4), { angle: 84, spacing: 1.3, sw: 0.3, clip: dress });
  c.outlineVar(dress, { min: 0.6, max: 1.3, light: -120 });
  c.draw(new Path().M(112, 300).C(130, 306, 170, 306, 188, 300), { sw: 0.55 }); // the dropped waist
  for (const a of [armL, armR]) { c.hatch(a, { angle: 40, spacing: 2.2, sw: 0.24 }); c.draw(a, { sw: 0.9 }); }
  for (const h of [handL, handR]) { c.hatch(h, { angle: 20, spacing: 1.9, sw: 0.22 }); c.draw(h, { sw: 0.8 }); }
  c.draw(new Path().M(140, 284).L(143, 272).M(147, 285).L(149, 273).M(160, 283).L(162, 271).M(166, 282).L(167, 272), { sw: 0.4 });
  for (const s of shoes) c.fill(s);
  c.hatch(neck, { angle: 90, spacing: 1.8, sw: 0.22 }); c.draw(neck, { sw: 0.7 });
  // face
  c.hatch(face, { angle: 100, spacing: 2.6, sw: 0.2, spacingFn: t => 1.6 + 2.6 * t }); c.draw(face, { sw: 0.85 });
  for (const x of [144, 156]) { c.draw(new Path().M(x - 4.2, 141).C(x - 2.5, 137.8, x + 2.5, 137.8, x + 4.2, 141).C(x + 2.5, 143.6, x - 2.5, 143.6, x - 4.2, 141), { sw: 0.55 }); c.fill(Path.circle(x, 140.9, 1.9)); }
  c.draw(new Path().M(139, 135).C(142, 132, 146, 132, 149, 134.5).M(151, 134.5).C(154, 132, 158, 132, 161, 135), { sw: 0.6 });
  c.draw(new Path().M(150.5, 142).C(149.5, 147, 149, 150, 148.5, 153).C(150, 154.5, 152, 154.5, 153.5, 153), { sw: 0.45 });
  c.draw(new Path().M(145, 160).C(148, 158.4, 152, 158.4, 155, 160), { sw: 0.75 }); c.draw(new Path().M(146.5, 161.4).C(149, 163.4, 151, 163.4, 153.5, 161.4), { sw: 0.4 });
  // wet hair: black mass, with long paper slivers where the strands catch the light, ends dripping
  const strand = (a, b, w) => { const pts = Path.smooth([a, [(a[0] + b[0]) / 2 + 2, (a[1] + b[1]) / 2], b]).pts(3); const L = [], R = []; for (let i = 0; i < pts.length; i++) { const t = i / (pts.length - 1); const ww = w * Math.sin(Math.PI * t) + 0.12; const p = pts[i], q = pts[Math.min(pts.length - 1, i + 1)], o = pts[Math.max(0, i - 1)]; let nx = -(q[1] - o[1]), ny = q[0] - o[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l; L.push([p[0] + nx * ww, p[1] + ny * ww]); R.push([p[0] - nx * ww, p[1] - ny * ww]); } return Path.poly(L.concat(R.reverse())); };
  c.fillEO([hair, strand([138, 112], [124, 190], 0.8), strand([146, 108], [128, 200], 0.6), strand([160, 110], [172, 194], 0.8), strand([166, 116], [178, 200], 0.6), strand([152, 106], [150, 126], 0.5)]);
  c.draw(hair, { sw: 0.8 });
  for (const [x, y] of [[121, 210], [180, 212], [127, 212]]) c.fill(Path.ellipse(x, y, 1.1, 2.2)); // drops
  // ---------- the hyacinths: a sheaf of spikes, each a stalk with bells in violet
  c.hatch(sheaf, { angle: 70, spacing: 2.4, sw: 0.22, jitter: 0.3 });
  const spikes = [[150, 262, 150, 182], [138, 262, 118, 196], [162, 262, 182, 196], [130, 258, 100, 206], [170, 258, 200, 206], [144, 262, 132, 190], [156, 262, 168, 190], [122, 254, 92, 218], [178, 254, 208, 218]];
  for (const [x0, y0, x1, y1] of spikes) {
    c.draw(new Path().M(x0, y0).L(x1, y1), { sw: 1.1 });
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy);
    for (let k = 0.28; k < 0.98; k += 0.09) { const bx = x0 + dx * k, by = y0 + dy * k; const nx = -dy / L, ny = dx / L; for (const s of [-1, 1]) { const bell = S([[bx, by], [bx + s * nx * 5.5 - 1.6, by + s * ny * 5.5 - 1.6], [bx + s * nx * 6.5, by + s * ny * 6.5 + 1], [bx + s * nx * 5.5 + 1.6, by + s * ny * 5.5 + 1.6]], 0.3); c.fill(bell, C.violet); c.draw(bell, { sw: 0.3 }); } }
  }
  c.frame();
  return c;
};
