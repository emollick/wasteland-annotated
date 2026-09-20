// LII  The One-Eyed Merchant. Mr. Eugenides in profile (one eye is all a profile shows), unshaven, currants in his open hand, a bundle on his back.
const { Card, Path, C, INK, deg, clipPolyline, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function merchant() {
  const c = new Card({ name: 'The One-Eyed Merchant', numeral: 'LII', seed: 52 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  // ---------- the figure, profile facing left
  // head: profile with a bowler
  const head = S([[126, 114], [140, 106], [156, 108], [166, 118], [168, 134], [164, 150], [156, 160], [146, 164], [136, 160], [128, 152], [118, 148], [114, 140], [118, 134], [116, 126], [122, 118]], 0.45);
  const crown = S([[118, 114], [126, 96], [142, 86], [160, 88], [172, 100], [176, 114]], 0.45);
  const brim = new Path().M(106, 117).C(108, 111, 114, 112, 120, 114).L(176, 114).C(184, 112, 190, 112, 192, 118).C(186, 120, 176, 120, 168, 119).L(122, 119).C(114, 120, 108, 121, 106, 117).Z();
  const hat = crown; // hatched crown; brim filled
  const collar = S([[118, 160], [136, 166], [158, 164], [178, 158], [190, 168], [190, 184], [176, 190], [158, 184], [138, 186], [118, 190], [108, 178], [108, 166]], 0.5);
  const coat = S([[116, 186], [140, 190], [160, 190], [182, 190], [194, 208], [200, 240], [204, 290], [206, 340], [210, 386], [176, 390], [150, 392], [122, 390], [100, 386], [100, 340], [102, 290], [108, 240], [110, 208]], 0.42);
  const armNear = tube([[128, 210], [116, 236], [98, 258], [82, 274]], t => 20 - 6 * t);
  const hand = S([[62, 270], [74, 264], [86, 266], [92, 274], [86, 284], [72, 288], [60, 284], [56, 276]], 0.5);
  const trousers = S([[106, 386], [138, 388], [176, 388], [206, 386], [202, 420], [196, 446], [166, 446], [164, 420], [156, 400], [150, 420], [148, 446], [116, 446], [112, 420]], 0.3);
  const legL = trousers, legR = trousers;
  const shoeL = new Path().M(90, 446).C(96, 440, 106, 442, 116, 444).L(148, 444).L(150, 456).L(112, 458).C(102, 458, 92, 457, 88, 452).Z();
  const shoeR = new Path().M(140, 446).C(146, 440, 156, 442, 166, 444).L(196, 444).L(198, 456).L(162, 458).C(152, 458, 142, 457, 138, 452).Z();
  const bundle = S([[196, 168], [222, 160], [250, 172], [266, 200], [270, 240], [262, 280], [244, 300], [218, 302], [200, 290], [196, 250], [198, 210]], 0.55);
  const figure = [head, crown, brim, collar, coat, armNear, hand, trousers, shoeL, shoeR, bundle];
  const figPolys = figure.flatMap(f => f.polys());
  // ---------- the City: fog in fine horizontal lines, a wall of brick courses behind, pavement
  const fog = Path.rect(px0, py0, px1 - px0, 300 - py0);
  c.hatch(fog, { angle: 0, spacing: 3.4, sw: 0.22, holes: figure, spacingFn: t => 5 - 2.4 * t, jitter: 0.3, dash: [30, 120, 4, 24] });
  // a wall: brick courses to the left, low, with a doorway dark
  const wall = Path.rect(px0, 214, 92, 236);
  c.hatch(wall, { angle: 0, spacing: 6.5, sw: 0.45, holes: figure });
  c.hatch(wall, { angle: 90, spacing: 13, sw: 0.4, holes: figure, dash: [6, 6.6, 6.4, 6.6] });
  c.draw(new Path().M(px0 + 92, 214).L(px0 + 92, 450), { sw: 0.7 }); c.draw(new Path().M(px0, 214).L(px0 + 92, 214), { sw: 0.7 });
  const door = Path.rect(30, 330, 34, 120); c.hatch(door, { angle: 90, spacing: 1.2, sw: 0.36, holes: figure }); c.hatch(door, { angle: 0, spacing: 2.4, sw: 0.26, holes: figure }); c.draw(door, { sw: 0.8 });
  // pavement
  c.draw(new Path().M(px0, 450).L(px1, 450), { sw: 0.8 });
  c.hatch(Path.rect(px0, 450, px1 - px0, py1 - 450), { angle: 0, spacing: 5.5, sw: 0.3, holes: [shoeL, shoeR] });
  for (const x of [60, 130, 200, 262]) c.draw(new Path().M(x, 450).L(x - 14, py1), { sw: 0.3 });
  // a bollard and a kerb at right
  c.fill(S([[238, 400], [250, 400], [252, 450], [236, 450]], 0.3)); c.fill(Path.ellipse(244, 398, 8, 4));
  // ---------- the figure drawn
  // bundle: cloth texture, rope crossing, knot
  c.hatch(bundle, { angle: 30, spacing: 2.4, sw: 0.28, jitter: 0.3 });
  c.hatch(S([[240, 172], [266, 200], [270, 240], [262, 280], [244, 300], [236, 280], [246, 240], [244, 200]], 0.5), { angle: 60, spacing: 1.4, sw: 0.3, clip: bundle });
  c.outlineVar(bundle, { min: 0.7, max: 1.4, light: -120 });
  for (const rp of [[[200, 200], [232, 212], [266, 224]], [[206, 262], [236, 254], [266, 250]], [[222, 162], [230, 200], [236, 254], [232, 300]]]) { const pl = Path.smooth(rp).pts(2); c.lines([offsetPolyline(pl, 1.2), offsetPolyline(pl, -1.2)].map(p => clipPolyline(p, bundle.polys())).flat(), { sw: 0.55 }); }
  c.fill(Path.circle(232, 212, 3.2)); c.fill(Path.circle(236, 254, 3.2));
  // the strap over his shoulder
  c.fill(tube([[188, 168], [176, 200], [168, 240]], () => 4.2));
  // coat: long, dark, vertical fall of the cloth, darker at the back; lapel, buttons, a bulging pocket
  c.hatch(coat, { angle: 88, spacing: 1.9, sw: 0.3, jitter: 0.3 });
  c.hatch(S([[182, 190], [194, 208], [200, 240], [204, 290], [206, 340], [210, 386], [190, 388], [188, 340], [186, 290], [180, 240], [172, 208]], 0.4), { angle: 86, spacing: 1.1, sw: 0.32, clip: coat });
  c.hatch(S([[116, 186], [140, 190], [138, 240], [136, 300], [134, 386], [122, 390], [100, 386], [102, 290], [108, 240], [110, 208]], 0.4), { angle: 60, spacing: 2.6, sw: 0.22, clip: coat });
  c.outlineVar(coat, { min: 0.7, max: 1.5, light: -140 });
  c.draw(Path.smooth([[126, 198], [124, 260], [122, 330], [120, 388]]), { sw: 0.7 }); // front edge
  c.draw(new Path().M(140, 190).C(134, 200, 128, 212, 126, 226).L(140, 214).Z(), { sw: 0.6 }); // lapel
  for (const y of [222, 250, 278, 306]) c.fill(Path.circle(131, y, 2.0));
  const pocket = S([[174, 296], [202, 298], [204, 320], [176, 318]], 0.3); c.hatch(pocket, { angle: 85, spacing: 0.9, sw: 0.3, clip: coat }); c.draw(pocket, { sw: 0.7 });
  c.draw(new Path().M(98, 386).C(130, 396, 180, 396, 212, 386), { sw: 0.8 }); // hem
  // the near arm and the open hand with currants
  c.hatch(armNear, { angle: -50, spacing: 2.0, sw: 0.3 }); c.hatch(armNear, { angle: 40, spacing: 3.6, sw: 0.22 }); c.outlineVar(armNear, { min: 0.7, max: 1.3, light: -140 });
  c.draw(new Path().M(82, 262).C(86, 270, 88, 274, 84, 282), { sw: 0.6 }); // cuff
  c.hatch(hand, { angle: 20, spacing: 2.0, sw: 0.22 }); c.draw(hand, { sw: 0.9 });
  c.draw(new Path().M(62, 282).L(64, 270).M(70, 286).L(72, 272).M(78, 286).L(80, 272), { sw: 0.45 });
  for (const [x, y] of [[66, 268], [72, 265], [78, 267], [70, 272], [76, 272], [64, 274], [82, 271]]) { c.fill(Path.circle(x, y, 2.4), C.violet); c.draw(Path.circle(x, y, 2.4), { sw: 0.4 }); }
  // trousers and shoes
  c.hatch(trousers, { angle: 88, spacing: 2.2, sw: 0.28 }); c.hatch(S([[150, 420], [148, 446], [166, 446], [164, 420], [156, 400]], 0.3), { angle: 80, spacing: 1.1, sw: 0.3, clip: trousers }); c.draw(trousers, { sw: 0.9 });
  c.draw(new Path().M(124, 392).L(122, 446).M(180, 392).L(184, 446), { sw: 0.5 });
  for (const sh of [shoeL, shoeR]) c.fill(sh);
  // collar: astrakhan, drawn as small curls
  const curls = []; const cp = collar.polys(); for (let i = 0; i < 260; i++) { const x = rnd.range(106, 192), y = rnd.range(158, 192); if (!require('../lib').inside([x, y], cp)) continue; const r = rnd.range(1.1, 2.0), a0 = rnd.range(0, 6.28); curls.push(Path.arc(x, y, r, a0, a0 + 4.2)); }
  for (const cu of curls) c.draw(cu, { sw: 0.45 });
  c.draw(collar, { sw: 0.9 });
  // head: the face in profile
  c.hatch(head, { angle: 100, spacing: 2.2, sw: 0.22, spacingFn: t => 1.5 + 2.4 * (1 - t) });
  c.draw(head, { sw: 1.0 });
  // stubble on the jaw
  c.stipple(S([[124, 140], [140, 150], [156, 160], [146, 164], [136, 160], [128, 152], [118, 148]], 0.4), { density: 0.5, sw: 0.5 });
  // the one eye, the brow, the ear, the mouth
  c.draw(new Path().M(124, 128).C(128, 124, 134, 124, 138, 127), { sw: 0.8 }); // brow
  c.draw(new Path().M(126, 133).C(129, 130, 134, 130, 137, 133).C(134, 135.5, 129, 135.5, 126, 133), { sw: 0.6 }); c.fill(Path.circle(131.5, 133, 2.0));
  c.draw(new Path().M(114, 140).C(116, 144, 120, 146, 124, 146), { sw: 0.6 }); // nostril
  c.draw(new Path().M(122, 152).C(128, 152, 132, 151, 136, 150), { sw: 0.7 }); // mouth
  c.draw(new Path().M(160, 128).C(166, 124, 168, 134, 162, 140), { sw: 0.6 }); // ear
  // the bowler: crown hatched round its curve, the brim black
  c.hatch(crown, { angle: 0, spacing: 1.6, sw: 0.32, spacingFn: t => 1.2 + 1.4 * t });
  c.hatch(S([[150, 88], [172, 100], [176, 114], [160, 114], [156, 100]], 0.4), { angle: 60, spacing: 1.2, sw: 0.32, clip: crown });
  c.draw(crown, { sw: 1.0 });
  c.fill(brim); c.draw(new Path().M(120, 110).L(174, 110), { sw: 0.5 });
  c.frame();
  return c;
};
