// XLIII  Madame Sosostris, famous clairvoyante, with a bad cold and a wicked pack of cards.
const { Card, Path, C, INK, deg, clipTo, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function sosostris() {
  const c = new Card({ name: 'Madame Sosostris', numeral: 'XLIII', seed: 43 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  // ---------- she sits behind a table, facing us, heavy, in a dark shawl and a headscarf; spectacles; a handkerchief to her nose
  const tableY = 330;
  const shawl = S([[150, 162], [172, 168], [190, 184], [202, 210], [212, 250], [222, 300], [226, tableY + 6], [74, tableY + 6], [78, 300], [88, 250], [98, 210], [110, 184], [128, 168]], 0.45);
  const scarf = S([[150, 84], [170, 88], [184, 104], [188, 128], [184, 154], [176, 166], [168, 140], [166, 116], [150, 108], [134, 116], [132, 140], [124, 166], [116, 154], [112, 128], [116, 104], [130, 88]], 0.45);
  const face = S([[150, 104], [164, 110], [170, 126], [168, 148], [160, 162], [150, 166], [140, 162], [132, 148], [130, 126], [136, 110]], 0.55);
  const neck = S([[138, 160], [162, 160], [166, 176], [134, 176]], 0.4);
  const armR = tube([[196, 262], [206, 292], [196, 318]], t => 18 - 4 * t); // forearm coming out of the shawl to deal
  const handR = S([[182, 306], [198, 300], [210, 306], [212, 320], [200, 330], [184, 328], [176, 318]], 0.5);
  const armL = tube([[100, 262], [96, 220], [112, 176]], t => 18 - 4 * t); // raised, the handkerchief to her nose
  const hankHand = S([[118, 156], [134, 152], [142, 160], [138, 174], [124, 180], [112, 172]], 0.5);
  const hank = S([[124, 138], [146, 136], [160, 144], [162, 158], [150, 168], [134, 166], [122, 156]], 0.5);
  const figure = [shawl, scarf, face, neck, armR, handR, armL, hankHand, hank];
  // ---------- the room: a curtain behind her in heavy folds, a lamp's cone of paper light? no: a plain curtain
  const curtain = Path.rect(px0, py0, px1 - px0, tableY - py0);
  c.hatch(curtain, { angle: 90, spacing: 2.2, sw: 0.28, holes: figure, jitter: 0.2 });
  c.drapery(curtain, [[[40, py0], [44, 200], [38, tableY]], [[84, py0], [80, 200], [86, tableY]], [[212, py0], [218, 200], [214, tableY]], [[256, py0], [252, 200], [258, tableY]]], { side: 1, width: 12, spacing: 1.6, sw: 0.3, foldSw: 0.8 });
  // (the drapery lines cross the figure; cut them: redraw figure as holes is done by hatch only) -> mask by refilling nothing; instead we draw the figure opaque below.
  // ---------- the table: a cloth edge, the pack fanned, a cup of tea, a spread of cards
    c.draw(new Path().M(px0, tableY).L(px1, tableY), { sw: 1.0 });
  c.hatch(Path.rect(px0, tableY, px1 - px0, py1 - tableY), { angle: 0, spacing: 2.8, sw: 0.22, spacingFn: t => 2.2 + 2 * t });
  const cardShape = (x, y, a, s = 1) => Path.rect(-11 * s, -18 * s, 22 * s, 36 * s).rotate(deg(a)).translate(x, y);
  const back = (x, y, a, s = 1) => { const sh = cardShape(x, y, a, s); c.hatch(sh, { angle: a + 90, spacing: 1.2 * s, sw: 0.24 }); c.draw(sh, { sw: 0.7 }); const med = Path.ellipse(0, 0, 5.5 * s, 8.5 * s).rotate(deg(a)).translate(x, y); c.fill(med, C.violet); c.fill(Path.circle(x, y, 1.6 * s)); };
  // cards laid on the table in front of her, faces down but one face up and blank
  back(74, 380, -12); back(110, 392, 6); back(150, 396, -3); back(190, 392, 8); back(226, 380, 14);
  const up = cardShape(150, 442, 0, 1.05); c.draw(up, { sw: 0.8 }); c.draw(Path.rect(-9, -16, 18, 32).translate(150, 442), { sw: 0.3 });
  // a teacup and saucer at the right
  c.draw(Path.ellipse(252, 424, 20, 6), { sw: 0.7 }); c.hatch(S([[236, 410], [268, 410], [264, 426], [240, 426]], 0.4), { angle: 0, spacing: 1.6, sw: 0.24 }); c.draw(S([[236, 410], [268, 410], [264, 426], [240, 426]], 0.4), { sw: 0.8 }); c.draw(Path.ellipse(252, 410, 16, 4), { sw: 0.6 }); c.draw(new Path().M(268, 414).C(276, 412, 276, 422, 266, 424), { sw: 0.7 });
  // ---------- the figure drawn: the shawl dark and close-hatched, folds falling from the shoulders; the arms over it
  const armHoles = [armR, handR, armL, hankHand, hank];
  c.hatch(shawl, { angle: 90, spacing: 1.3, sw: 0.34, holes: armHoles, jitter: 0.15 });
  c.hatch(shawl, { angle: 20, spacing: 2.2, sw: 0.26, holes: armHoles });
  c.drapery(shawl, [[[118, 190], [104, 260], [92, 324]], [[182, 190], [198, 260], [210, 324]], [[150, 180], [150, 260], [152, 324]]], { side: 1, width: 10, spacing: 1.4, sw: 0.34, foldSw: 0.9 });
  // the fringe along the hem
  for (let x = 78; x <= 222; x += 4.5) c.draw(new Path().M(x, tableY + 2).L(x + 1, tableY + 12), { sw: 0.5 });
  c.outlineVar(shawl, { min: 0.7, max: 1.4, light: -120 });
  // dealing arm and hand, bare, with a card between finger and thumb
  c.hatch(armR, { angle: 60, spacing: 1.6, sw: 0.28 }); c.draw(armR, { sw: 0.8 });
  c.hatch(handR, { angle: 20, spacing: 2.0, sw: 0.22 }); c.draw(handR, { sw: 0.85 });
  c.draw(new Path().M(186, 328).L(190, 314).M(194, 330).L(198, 314).M(202, 328).L(205, 316), { sw: 0.45 });
  const dealt = cardShape(214, 336, 70, 0.95); c.hatch(dealt, { angle: 160, spacing: 1.2, sw: 0.24 }); c.draw(dealt, { sw: 0.8 }); c.fill(Path.ellipse(0, 0, 5.2, 8).rotate(deg(70)).translate(214, 336), C.violet); c.fill(Path.circle(214, 336, 1.5));
  // the raised arm with the handkerchief
  c.hatch(armL, { angle: 60, spacing: 1.6, sw: 0.28 }); c.draw(armL, { sw: 0.8 });
  c.hatch(hankHand, { angle: 20, spacing: 2.0, sw: 0.22 }); c.draw(hankHand, { sw: 0.8 }); c.draw(new Path().M(122, 172).L(126, 160).M(128, 176).L(132, 162).M(134, 176).L(137, 164), { sw: 0.4 });
  c.draw(hank, { sw: 0.8 }); c.draw(Path.smooth([[130, 140], [138, 150], [136, 162]]), { sw: 0.35 }); c.draw(Path.smooth([[146, 138], [150, 150], [148, 164]]), { sw: 0.35 }); for (let k = 0; k < 6; k++) c.draw(Path.arc(126 + k * 6, 165 + (k % 2), 2.2, 0.2, 3.0), { sw: 0.4 });
  // face: heavy, spectacled, the nose behind the handkerchief; eyes tired
  c.hatch(face, { angle: 100, spacing: 2.4, sw: 0.2, spacingFn: t => 1.6 + 2.4 * t }); c.draw(face, { sw: 0.9 });
  c.hatch(neck, { angle: 90, spacing: 1.8, sw: 0.22 }); c.draw(neck, { sw: 0.7 });
  for (const x of [143, 157]) { c.draw(Path.circle(x, 130, 6.2), { sw: 0.8 }); c.draw(new Path().M(x - 4, 130).C(x - 2, 128.4, x + 2, 128.4, x + 4, 130), { sw: 0.6 }); c.fill(Path.circle(x, 130.6, 1.5)); c.draw(new Path().M(x - 5, 128.5).C(x - 3, 126.5, x + 3, 126.5, x + 5, 128.5), { sw: 0.4 }); }
  c.draw(new Path().M(149.2, 130).L(150.8, 130), { sw: 0.8 }); c.draw(new Path().M(136.8, 129).L(131, 126).M(163.2, 129).L(169, 126), { sw: 0.7 });
  c.draw(new Path().M(137, 122).C(141, 119, 146, 119.5, 149, 122).M(151, 122).C(154, 119.5, 159, 119, 163, 122), { sw: 0.8 });
  c.draw(new Path().M(150, 134).C(148.5, 138, 147.5, 141, 147, 144), { sw: 0.45 });
  c.draw(new Path().M(143, 156).C(146, 154.5, 154, 154.5, 157, 156), { sw: 0.7 });
  // the headscarf: hatched with its knot; a few grey curls escaping
  c.hatch(scarf, { angle: 20, spacing: 1.5, sw: 0.3 }); c.hatch(scarf, { angle: 110, spacing: 2.6, sw: 0.24 }); c.draw(scarf, { sw: 0.95 });
  for (const k of [S([[178, 156], [190, 150], [196, 160], [186, 168]], 0.5), S([[176, 162], [190, 166], [186, 178], [172, 172]], 0.5)]) { c.hatch(k, { angle: 20, spacing: 1.3, sw: 0.3 }); c.draw(k, { sw: 0.7 }); }
  for (const [x, y] of [[126, 158], [130, 166], [176, 160]]) c.draw(Path.arc(x, y, 3, 0.3, 5.2), { sw: 0.5 });
  c.frame();
  return c;
};
