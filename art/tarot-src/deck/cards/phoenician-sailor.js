// XLVII  The Drowned Phoenician Sailor. Head-down through the water, the current picking at him; pearls for eyes.
const { Card, Path, C, INK, rot, deg, clipPolyline, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function sailor() {
  const c = new Card({ name: 'The Drowned Phoenician Sailor', numeral: 'XLVII', seed: 47 });
  const { px0, px1, py0, py1 } = c;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  // ---------- the figure, sinking head first
  const trousers = S([[122, 224], [117, 196], [113, 165], [106, 130], [104, 121], [134, 118], [136, 150], [143, 182], [150, 196], [157, 183], [164, 150], [166, 120], [196, 117], [194, 128], [188, 165], [183, 196], [178, 224], [150, 228]], 0.45);
  const jersey = S([[124, 214], [121, 250], [119, 285], [117, 318], [126, 330], [140, 333], [150, 334], [160, 333], [174, 330], [183, 318], [181, 285], [179, 250], [176, 214], [150, 218]], 0.5);
  const neck = tube([[150, 328], [150, 352]], () => 13);
  const head = Path.ellipse(150, 374, 16.5, 20);
  const sleeveL = tube([[121, 318], [114, 344], [110, 366]], t => 17 - 3 * t);
  const sleeveR = tube([[179, 318], [186, 344], [192, 366]], t => 17 - 3 * t);
  const foreL = tube([[110, 362], [108, 385], [107, 406]], t => 11.5 - 2.5 * t);
  const foreR = tube([[192, 362], [195, 385], [198, 406]], t => 11.5 - 2.5 * t);
  const handL = S([[100, 404], [113, 403], [118, 412], [117, 428], [112, 438], [106, 436], [104, 426], [98, 432], [95, 420]], 0.5);
  const handR = S([[191, 404], [204, 403], [209, 413], [208, 428], [203, 438], [197, 436], [195, 426], [189, 432], [186, 420]], 0.5);
  const footL = S([[102, 122], [128, 119], [130, 108], [122, 100], [110, 102], [104, 110]], 0.5);
  const footR = S([[172, 121], [198, 118], [196, 106], [188, 99], [178, 100], [173, 110]], 0.5);
  const body = [trousers, jersey, neck, head, sleeveL, sleeveR, foreL, foreR, handL, handR, footL, footR];
  // ---------- surface and sky
  const wave = []; for (let x = px0; x <= px1; x += 3) wave.push([x, 84 + 2.8 * Math.sin(x / 12) + 1.4 * Math.sin(x / 4.7 + 1)]);
  const sea = Path.poly([...wave, [px1, py1], [px0, py1]]);
  const gull = new Path().M(212, 60).C(219, 54, 225, 54, 230, 59).C(234, 55, 242, 54, 248, 60);
  c.draw(gull, { sw: 0.9 });
  c.draw(new Path().M(40, 66).L(120, 66), { sw: 0.3 }); c.draw(new Path().M(52, 70).L(96, 70), { sw: 0.3 });
  c.lines([wave], { sw: 1.05 }); c.lines([offsetPolyline(wave, 2.4)], { sw: 0.4 }); c.lines([offsetPolyline(wave, 4.6)], { sw: 0.25 });
  // ---------- the water: wave lines densening with depth; the body occludes
  const seaPolys = sea.polys().concat(body.flatMap(b => b.polys()));
  const pls = []; let y = 92, k = 0;
  while (y < py1 - 2) {
    const t = (y - 92) / (py1 - 92);
    const A = 1.6 + 1.9 * (1 - t), lam = 15 + 8 * Math.sin(k * 0.7);
    const pl = []; for (let x = px0; x <= px1; x += 4.5) pl.push([x, y + A * Math.sin(x / lam + k * 1.3) + 0.7 * Math.sin(x / 6.3 + k * 0.4)]);
    pls.push(...clipPolyline(pl, seaPolys));
    y += 5.6 - 3.3 * t; k++;
  }
  c.lines(pls, { sw: 0.38 });
  // the dark below: cross-hatch in the last band
  c.hatch(Path.poly([[px0, 418], [px1, 418], [px1, py1], [px0, py1]]), { angle: 0, spacing: 2.1, sw: 0.22, holes: body, phase: 1 });
  c.hatch(Path.poly([[px0, 440], [px1, 440], [px1, py1], [px0, py1]]), { angle: 55, spacing: 2.4, sw: 0.22, holes: body });
  // bubbles rising from the mouth
  [[139, 350, 1.4], [134, 330, 1.9], [136, 306, 1.3], [128, 280, 2.2], [131, 250, 1.5], [122, 214, 2.4], [126, 180, 1.7], [116, 140, 2.1], [120, 104, 1.5]].forEach(([x, y, r]) => c.draw(Path.circle(x, y, r), { sw: 0.5 }));
  // ---------- the figure drawn
  // trousers: bell-bottoms, hatched along the leg with a dark inner side
  c.hatch(trousers, { angle: 82, spacing: 3.4, sw: 0.26, jitter: 0.3 });
  const innerShade = S([[143, 182], [150, 196], [157, 183], [164, 152], [166, 124], [156, 124], [153, 160], [150, 178], [147, 160], [144, 128], [134, 128], [136, 150]], 0.4);
  c.hatch(innerShade, { angle: 20, spacing: 1.6, sw: 0.3, clip: trousers });
  c.hatch(S([[184, 128], [188, 165], [183, 196], [178, 224], [170, 224], [175, 196], [180, 165], [176, 128]], 0.4), { angle: 20, spacing: 1.7, sw: 0.3, clip: trousers });
  c.draw(trousers, { sw: 1.05 });
  c.draw(new Path().M(150, 197).C(151, 210, 150, 218, 150, 226), { sw: 0.7 });
  for (const f of [footL, footR]) { c.hatch(f, { angle: 30, spacing: 1.5, sw: 0.26, spacingFn: t => 1.2 + 1.3 * t }); c.draw(f, { sw: 0.9 }); }
  // toes
  c.draw(new Path().M(111, 101).L(111, 96).M(117, 100).L(117, 95).M(123, 100).L(123, 96), { sw: 0.5 });
  c.draw(new Path().M(182, 99).L(182, 94).M(188, 99).L(188, 94).M(194, 100).L(194, 96), { sw: 0.5 });
  c.draw(new Path().M(150, 196).C(151, 210, 150, 220, 150, 228), { sw: 0.7 });
  // jersey: curved stripes
  const base = []; for (let x = 110; x <= 190; x += 4) base.push([x, 230 + 3.2 * Math.sin((x - 150) / 26 * Math.PI / 2 + Math.PI / 2)]);
  c.contours(base, { count: 12, spacing: 9.4, sw: 3.6, clip: jersey, start: -8 });
  c.hatch(jersey, { angle: 85, spacing: 2.0, sw: 0.22, jitter: 0.15 });
  c.hatch(S([[121, 250], [119, 285], [117, 318], [126, 330], [131, 320], [128, 285], [129, 250]], 0.4), { angle: 25, spacing: 1.6, sw: 0.3 });
  c.draw(jersey, { sw: 1.05 });
  c.draw(new Path().M(138, 331).C(144, 340, 156, 340, 162, 331), { sw: 0.8 });
  for (const [sl, st] of [[sleeveL, 1], [sleeveR, -1]]) {
    const b = []; for (let i = 0; i <= 8; i++) b.push([(st > 0 ? 100 : 170) + i * 4, 322 + 1.5 * Math.sin(i)]);
    c.contours(b, { count: 7, spacing: 9.2, sw: 3.4, clip: sl, start: 2 });
    c.hatch(sl, { angle: 100, spacing: 2.0, sw: 0.22 }); c.draw(sl, { sw: 1.0 });
  }
  for (const fa of [foreL, foreR]) { c.hatch(fa, { angle: 100, spacing: 1.8, sw: 0.28, spacingFn: t => 1.3 + 1.4 * t }); c.draw(fa, { sw: 0.95 }); }
  for (const h of [handL, handR]) { c.hatch(h, { angle: 60, spacing: 1.7, sw: 0.26 }); c.draw(h, { sw: 0.9 }); }
  c.draw(new Path().M(104, 426).L(108, 410).M(109, 434).L(112, 412).M(114, 433).L(115, 414), { sw: 0.5 });
  c.draw(new Path().M(195, 426).L(199, 410).M(200, 434).L(203, 412).M(205, 433).L(206, 414), { sw: 0.5 });
  c.hatch(neck, { angle: 90, spacing: 1.6, sw: 0.28 }); c.draw(neck, { sw: 0.9 });
  // head upside down: modelling, hair fanning from the crown, the face
  const eyeHoles = [Path.circle(143.5, 376.5, 5.4), Path.circle(156.5, 376.5, 5.4)];
  c.hatch(head, { angle: 20, spacing: 2.4, sw: 0.24, spacingFn: t => 1.6 + 2.2 * t, holes: eyeHoles });
  c.draw(head, { sw: 1.1 });
  // hair: the current carries it to the right, in long strands from the crown
  for (let i = 0; i < 9; i++) {
    const a = deg(60 + i * 10); const r0 = [150 + 15.2 * Math.cos(a), 373 + 18.6 * Math.sin(a)];
    const L = 30 + 16 * Math.abs(Math.sin(i * 1.9));
    const p = Path.smooth([r0, [r0[0] + L * 0.45, r0[1] + 6 + 4 * Math.sin(i * 1.3)], [r0[0] + L * 0.9, r0[1] + 2 + 5 * Math.cos(i)], [r0[0] + L * 1.25, r0[1] - 6 + 4 * Math.sin(i * 0.7)]]);
    c.draw(p, { sw: 1.0 - 0.06 * (i % 4) });
  }
  c.fill(Path.arc(150, 373, 15.5, deg(30), deg(150), { ry: 19 }).C(150, 386, 145, 384, 143, 381).Z());  // dark of the hair on the crown
  c.draw(new Path().M(139, 367).C(142, 362, 146, 362, 148, 366), { sw: 0.55 }); // brow (below the eye, face inverted)
  c.draw(new Path().M(152, 366).C(154, 362, 158, 362, 161, 367), { sw: 0.55 });
  c.draw(new Path().M(150, 372).C(148, 368, 147, 364, 148, 362).L(152, 362), { sw: 0.5 }); // nose
  c.draw(new Path().M(145, 358.5).C(148, 356.5, 152, 356.5, 155, 358.5), { sw: 0.75 }); // mouth
  for (const x of [143.5, 156.5]) { c.fill(Path.circle(x, 376.5, 3.5), C.gold); c.draw(Path.circle(x, 376.5, 3.5), { sw: 0.6 }); c.draw(Path.arc(x, 376.5, 2.4, deg(200), deg(340)), { sw: 0.35 }); }
  // a ship's wheel fallen to the bottom, right
  const wc = [242, 434], wr = 16;
  c.draw(Path.circle(wc[0], wc[1], wr), { sw: 1.3 }); c.draw(Path.circle(wc[0], wc[1], wr - 3), { sw: 0.45 }); c.draw(Path.circle(wc[0], wc[1], 3.2), { sw: 0.8 });
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + 0.25; c.draw(new Path().M(wc[0] + 3.2 * Math.cos(a), wc[1] + 3.2 * Math.sin(a)).L(wc[0] + (wr + 5) * Math.cos(a), wc[1] + (wr + 5) * Math.sin(a)), { sw: 1.2 }); c.fill(Path.circle(wc[0] + (wr + 5.5) * Math.cos(a), wc[1] + (wr + 5.5) * Math.sin(a), 1.5)); }
  c.frame();
  return c;
};
