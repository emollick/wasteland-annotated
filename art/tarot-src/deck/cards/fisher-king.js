// CLXXXIX  The Fisher King, fishing in the dull canal behind the gashouse on a winter evening; a rat on the bank.
const { Card, Path, C, INK, deg, clipTo, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function fisherKing() {
  const c = new Card({ name: 'The Fisher King', numeral: 'CLXXXIX', seed: 189 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  // ---------- the gashouse: a gasometer's iron frame at the left against a winter sky; chimneys
  const skyBottom = 250;
  const gas = { x0: 24, x1: 150, top: 96, bot: skyBottom };
  // ---------- the king: seated on the bank in profile facing right, rod out over the water
  const kx = 120, ky = 300;
  const cloak = S([[kx - 6, ky - 66], [kx + 22, ky - 60], [kx + 34, ky - 38], [kx + 38, ky - 10], [kx + 52, ky + 20], [kx + 56, ky + 46], [kx + 40, ky + 50], [kx - 6, ky + 52], [kx - 34, ky + 48], [kx - 40, ky + 24], [kx - 34, ky - 10], [kx - 30, ky - 40], [kx - 22, ky - 60]], 0.45);
  const head = S([[kx + 4, ky - 104], [kx + 18, ky - 100], [kx + 24, ky - 86], [kx + 22, ky - 72], [kx + 12, ky - 64], [kx, ky - 64], [kx - 10, ky - 72], [kx - 12, ky - 88], [kx - 6, ky - 100]], 0.5);
  const crown = Path.poly([[kx - 10, ky - 98], [kx - 8, ky - 116], [kx - 2, ky - 106], [kx + 4, ky - 118], [kx + 10, ky - 106], [kx + 16, ky - 116], [kx + 20, ky - 98]]);
  const neck = S([[kx, ky - 68], [kx + 14, ky - 68], [kx + 16, ky - 58], [kx - 4, ky - 58]], 0.4);
  const arm = tube([[kx + 18, ky - 44], [kx + 42, ky - 30], [kx + 60, ky - 34]], t => 13 - 3 * t);
  const hand = S([[kx + 56, ky - 42], [kx + 70, ky - 42], [kx + 74, ky - 32], [kx + 66, ky - 24], [kx + 54, ky - 28]], 0.5);
  const legs = S([[kx + 20, ky + 6], [kx + 44, ky + 2], [kx + 62, ky + 10], [kx + 70, ky + 24], [kx + 74, ky + 44], [kx + 62, ky + 46], [kx + 56, ky + 28], [kx + 44, ky + 24], [kx + 30, ky + 46]], 0.4); // the near leg, knee up, a bandage on the thigh
  const boot = S([[kx + 62, ky + 44], [kx + 90, ky + 44], [kx + 92, ky + 54], [kx + 60, ky + 56]], 0.4);
  const figure = [cloak, head, crown, neck, arm, hand, legs, boot];
  const figPolys = figure.flatMap(f => f.polys());
  // sky: winter, low lines
  c.hatch(Path.rect(px0, py0, px1 - px0, skyBottom - py0), { angle: 0, spacing: 3.2, sw: 0.22, holes: figure, spacingFn: t => 4.6 - 2.6 * t, dash: [40, 140, 5, 30] });
  // the gasometer: uprights and horizontal hoops, cross-braced
  const gasClip = [Path.rect(0, 0, 300, 520).polys()[0]];
  for (let i = 0; i <= 5; i++) { const x = gas.x0 + i * (gas.x1 - gas.x0) / 5; c.lines(clipTo([[x, gas.top], [x, gas.bot]], gasClip, figPolys), { sw: 1.4 }); }
  for (let j = 0; j <= 4; j++) { const y = gas.top + j * (gas.bot - gas.top) / 4; c.lines(clipTo([[gas.x0, y], [gas.x1, y]], gasClip, figPolys), { sw: 0.9 }); }
  for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) { const x = gas.x0 + i * (gas.x1 - gas.x0) / 5, y = gas.top + j * (gas.bot - gas.top) / 4, w = (gas.x1 - gas.x0) / 5, h = (gas.bot - gas.top) / 4; c.lines(clipTo([[x, y], [x + w, y + h]], gasClip, figPolys).concat(clipTo([[x + w, y], [x, y + h]], gasClip, figPolys)), { sw: 0.35 }); }
  // the drum inside, lower half: hatched dark
  const drum = Path.rect(gas.x0 + 2, gas.top + 100, gas.x1 - gas.x0 - 4, gas.bot - gas.top - 100);
  c.hatch(drum, { angle: 90, spacing: 1.8, sw: 0.3, holes: figure }); c.hatch(drum, { angle: 0, spacing: 5, sw: 0.5, holes: figure });
  // chimneys and a shed to the right
  for (const [x, w, h] of [[214, 8, 120], [236, 6, 90]]) { const ch = Path.rect(x, skyBottom - h, w, h); c.hatch(ch, { angle: 90, spacing: 1.2, sw: 0.3 }); c.draw(ch, { sw: 0.7 }); }
  const shed = Path.poly([[196, skyBottom], [196, 214], [226, 200], [262, 200], [262, skyBottom]]); c.hatch(shed, { angle: 0, spacing: 2.4, sw: 0.26 }); c.draw(shed, { sw: 0.7 });
  // smoke: a slow line from the chimney
  c.draw(Path.smooth([[218, 130], [212, 110], [220, 90], [210, 70], [216, 56]]), { sw: 0.5 });
  // ---------- the bank and the canal
  const bankLine = [[px0, 322], [60, 318], [120, 326], [190, 334], [250, 338], [px1, 342]];
  const bank = Path.poly([[px0, skyBottom], [px1, skyBottom], ...bankLine.slice().reverse()]);
  c.hatch(bank, { angle: 0, spacing: 3.4, sw: 0.24, holes: figure, dash: [6, 36, 3, 14], jitter: 0.5 });
  // the vegetation: tufts of dead grass along the bank in short strokes
  for (let x = px0 + 6; x < px1; x += 9) { const y = 320 + 20 * (x - px0) / (px1 - px0); if (x > kx - 46 && x < kx + 96) continue; for (let k = 0; k < 5; k++) c.draw(new Path().M(x + k * 1.6 - 3, y + 2).C(x + k * 1.6 - 3 + rnd.range(-3, 3), y - 6, x + k * 1.6 - 3 + rnd.range(-4, 4), y - 12, x + k * 1.6 - 4 + rnd.range(-5, 5), y - 16 - rnd.range(0, 8)), { sw: 0.5 }); }
  const canal = Path.poly([...bankLine, [px1, py1], [px0, py1]]);
  c.hatch(canal, { angle: 0, spacing: 2.4, sw: 0.28, spacingFn: t => 1.8 + 1.8 * t, holes: [] });
  c.hatch(Path.poly([[px0, 400], [px1, 410], [px1, py1], [px0, py1]]), { angle: 0, spacing: 2.4, sw: 0.22, phase: 1.2 });
  c.draw(Path.smooth(bankLine), { sw: 0.9 });
  // the float and the line
  c.draw(new Path().M(kx + 74, ky - 34).C(kx + 100, ky - 60, kx + 130, ky - 60, kx + 150, ky - 40), { sw: 1.6 }); // rod
  c.draw(new Path().M(kx + 150, ky - 40).C(kx + 154, ky - 10, kx + 150, ky + 30, kx + 152, ky + 70), { sw: 0.4 });
  c.fill(Path.ellipse(kx + 152, ky + 72, 2.2, 4)); for (const r of [6, 11, 16]) c.draw(Path.ellipse(kx + 152, ky + 74, r * 1.6, r * 0.5), { sw: 0.35 });
  // bones in the grass at the left: a rib and a skull, small
  c.draw(Path.circle(40, 340, 5), { sw: 0.7 }); c.fill(Path.ellipse(38, 339, 1.4, 1.8)); c.fill(Path.ellipse(43, 339, 1.4, 1.8)); c.draw(new Path().M(52, 346).C(60, 340, 70, 342, 78, 348), { sw: 0.8 }); c.draw(new Path().M(56, 350).C(62, 345, 70, 346, 76, 351), { sw: 0.6 });
  // the rat, creeping along the bank at the right, belly to the ground, tail long
  const rat = S([[200, 352], [212, 344], [226, 340], [246, 338], [260, 344], [266, 352], [258, 358], [238, 360], [216, 358], [204, 356]], 0.5);
  c.fill(rat); c.draw(Path.smooth([[266, 352], [282, 344], [288, 352], [286, 362]]), { sw: 1.5 }); c.draw(new Path().M(200, 352).L(190, 349).M(200, 353).L(190, 355).M(200, 351).L(191, 346), { sw: 0.35 });
  c.fill(S([[216, 344], [220, 336], [226, 342]], 0.3)); c.fill(S([[224, 342], [230, 335], [234, 341]], 0.3)); for (const [x, y] of [[214, 358], [232, 360], [252, 358]]) c.fill(tube([[x, y], [x - 2, y + 5]], () => 2.2));
  // ---------- the king drawn: cloak hatched with folds, a crown, the bandaged thigh
  c.hatch(cloak, { angle: 88, spacing: 2.4, sw: 0.26, jitter: 0.3 });
  c.drapery(cloak, [[[kx - 10, ky - 50], [kx - 20, ky], [kx - 24, ky + 46]], [[kx + 10, ky - 50], [kx + 6, ky], [kx + 8, ky + 48]]], { side: 1, width: 9, spacing: 1.5, sw: 0.3, foldSw: 0.7 });
  c.hatch(S([[kx - 30, ky - 40], [kx - 34, ky - 10], [kx - 40, ky + 24], [kx - 34, ky + 48], [kx - 22, ky + 48], [kx - 24, ky + 20], [kx - 20, ky - 10], [kx - 18, ky - 40]], 0.4), { angle: 84, spacing: 1.2, sw: 0.3, clip: cloak });
  c.outlineVar(cloak, { min: 0.6, max: 1.4, light: -120 });
  c.hatch(legs, { angle: 20, spacing: 2.0, sw: 0.26 }); c.draw(legs, { sw: 0.9 });
  // the bandage on the thigh: bare paper wrapped with lines
  const band = S([[kx + 28, ky + 14], [kx + 50, ky + 18], [kx + 52, ky + 34], [kx + 30, ky + 32]], 0.3); c.hatch(band, { angle: 0, spacing: 8, sw: 0.5, clip: legs }); c.draw(band, { sw: 0.5 });
  c.fill(boot);
  c.hatch(arm, { angle: 40, spacing: 1.8, sw: 0.26 }); c.draw(arm, { sw: 0.85 });
  c.hatch(hand, { angle: 20, spacing: 1.8, sw: 0.22 }); c.draw(hand, { sw: 0.8 });
  c.hatch(neck, { angle: 90, spacing: 1.6, sw: 0.22 }); c.draw(neck, { sw: 0.7 });
  c.hatch(head, { angle: 100, spacing: 2.4, sw: 0.2, spacingFn: t => 1.6 + 2.4 * t }); c.draw(head, { sw: 0.9 });
  // a bearded profile facing right: eye, nose, beard
  c.fill(Path.ellipse(kx + 14, ky - 86, 1.8, 1.4)); c.draw(new Path().M(kx + 10, ky - 90).L(kx + 18, ky - 90), { sw: 0.5 });
  c.draw(new Path().M(kx + 22, ky - 84).C(kx + 27, ky - 82, kx + 27, ky - 76, kx + 22, ky - 76), { sw: 0.7 });
  const beard = S([[kx + 4, ky - 70], [kx + 20, ky - 72], [kx + 22, ky - 60], [kx + 14, ky - 48], [kx + 4, ky - 50], [kx - 2, ky - 62]], 0.5); c.hatch(beard, { angle: 80, spacing: 1.2, sw: 0.32 }); c.draw(beard, { sw: 0.6 });
  c.fill(crown, C.gold); c.draw(crown, { sw: 0.7 });
  c.frame();
  return c;
};
