// XCIX  The change of Philomel, by the barbarous king so rudely forced: the picture over the mantel, as though a window gave upon the sylvan scene; the nightingale in the tree above.
const { Card, Path, C, INK, deg, rot, clipTo, clipPolyline, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function philomel() {
  const c = new Card({ name: 'Philomel', numeral: 'XCIX', seed: 99 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const all = [Path.rect(0, 0, 300, 520).polys()[0]];
  // ---------- the picture: a framed panel, as though a window; the mantel-shelf under it
  const fx0 = 40, fy0 = 70, fx1 = 260, fy1 = 380; // the inside of the frame
  const frameOuter = Path.rect(fx0 - 12, fy0 - 12, fx1 - fx0 + 24, fy1 - fy0 + 24);
  const frameInner = Path.rect(fx0, fy0, fx1 - fx0, fy1 - fy0);
  const scene = frameInner; const scenePolys = scene.polys();
  // ---------- the figures in the scene: Philomel running to the left, her arms already wings; the king behind with a drawn sword
  const px = 118, py = 320; // Philomel's feet
  const gown = S([[px - 6, py - 84], [px + 14, py - 86], [px + 22, py - 60], [px + 26, py - 30], [px + 30, py], [px - 20, py], [px - 18, py - 30], [px - 14, py - 60]], 0.45);
  const head = S([[px - 2, py - 110], [px + 8, py - 110], [px + 14, py - 100], [px + 12, py - 90], [px + 4, py - 84], [px - 4, py - 86], [px - 10, py - 96], [px - 8, py - 106]], 0.5);
  const hair = S([[px - 10, py - 104], [px - 2, py - 116], [px + 10, py - 116], [px + 18, py - 104], [px + 22, py - 90], [px + 30, py - 84], [px + 22, py - 96], [px + 14, py - 100], [px + 4, py - 98], [px - 6, py - 100]], 0.45);
  const wingL = Path.poly([[px - 10, py - 76], [px - 30, py - 96], [px - 56, py - 112], [px - 82, py - 112], [px - 66, py - 98], [px - 48, py - 82], [px - 30, py - 66], [px - 14, py - 62]]);
  const wingR = Path.poly([[px + 16, py - 78], [px + 34, py - 98], [px + 50, py - 124], [px + 60, py - 150], [px + 46, py - 136], [px + 36, py - 118], [px + 26, py - 96], [px + 18, py - 82]]);
  const feet = [S([[px - 12, py - 2], [px - 2, py - 2], [px, py + 4], [px - 14, py + 4]], 0.4), S([[px + 14, py - 2], [px + 26, py - 4], [px + 30, py + 2], [px + 16, py + 4]], 0.4)];
  // the king: at the right, striding after her, a black figure with a crown and a raised sword
  const kx = 206, ky = 330;
  const kingBody = S([[kx - 14, ky - 96], [kx + 14, ky - 98], [kx + 22, ky - 70], [kx + 24, ky - 30], [kx + 28, ky], [kx - 26, ky], [kx - 22, ky - 30], [kx - 20, ky - 70]], 0.45);
  const kingHead = S([[kx - 8, ky - 118], [kx + 8, ky - 118], [kx + 12, ky - 108], [kx + 8, ky - 96], [kx - 8, ky - 96], [kx - 12, ky - 108]], 0.5);
  const crown = Path.poly([[kx - 10, ky - 116], [kx - 9, ky - 132], [kx - 4, ky - 122], [kx, ky - 134], [kx + 4, ky - 122], [kx + 9, ky - 132], [kx + 10, ky - 116]]);
  const kingArm = tube([[kx - 12, ky - 84], [kx - 30, ky - 100], [kx - 40, ky - 124]], t => 10 - 3 * t);
  const sword = Path.poly([[kx - 42, ky - 126], [kx - 30, ky - 156], [kx - 20, ky - 184], [kx - 18, ky - 182], [kx - 26, ky - 154], [kx - 36, ky - 124]]);
  const kingLegs = [tube([[kx - 8, ky - 4], [kx - 24, ky + 14]], () => 9), tube([[kx + 8, ky - 4], [kx + 18, ky + 16]], () => 9)];
  const figure = [gown, head, hair, wingL, wingR, ...feet, kingBody, kingHead, crown, kingArm, sword, ...kingLegs];
  // ---------- the sylvan scene: trees to either side, foliage in stipple and short hatch; a clearing behind the figures; the nightingale in the left tree
  const trunkL = Path.poly([[fx0, fy1], [fx0 + 10, fy1], [fx0 + 22, 240], [fx0 + 26, 150], [fx0 + 20, fy0], [fx0, fy0]]);
  const trunkR = Path.poly([[fx1, fy1], [fx1 - 26, fy1], [fx1 - 30, 260], [fx1 - 22, 160], [fx1 - 18, fy0], [fx1, fy0]]);
  const canopy = S([[fx0, fy0], [fx1, fy0], [fx1, 150], [220, 168], [180, 140], [150, 172], [120, 146], [90, 176], [fx0, 156]], 0.4);
  // ground: a clearing that darkens at the sides
  const ground = Path.poly([[fx0, 300], [fx1, 300], [fx1, fy1], [fx0, fy1]]);
  const clearing = Path.poly([[fx0, 150], [fx1, 150], [fx1, 300], [fx0, 300]]);
  c.hatch(clearing, { angle: 0, spacing: 3.2, sw: 0.2, holes: figure.concat([trunkL, trunkR]), clip: scene, spacingFn: t => 4 - 2 * t, dash: [24, 60, 8, 30] });
  c.hatch(ground, { angle: 0, spacing: 2.2, sw: 0.26, holes: figure.concat([trunkL, trunkR]), clip: scene, spacingFn: t => 1.8 + 1.6 * t, jitter: 0.3 });
  // grass tufts
  for (let i = 0; i < 30; i++) { const x = rnd.range(fx0 + 12, fx1 - 30), y = rnd.range(304, fy1 - 6); if (Math.abs(x - px) < 34 && y < py + 6) continue; if (Math.abs(x - kx) < 32 && y < ky + 18) continue; for (let k = 0; k < 3; k++) c.draw(new Path().M(x + k * 1.6, y).L(x + k * 2.2 + rnd.range(-2, 2), y - rnd.range(5, 11)), { sw: 0.36 }); }
  // the canopy: dense stipple and short strokes, darker at the top
  c.stipple(canopy, { density: 0.22, sw: 0.7, holes: figure, densityFn: (x, y) => 0.04 + 0.2 * (1 - (y - fy0) / 110) });
  c.hatch(canopy, { angle: 70, spacing: 1.6, sw: 0.24, holes: figure, jitter: 0.6, dash: [4, 3, 2, 4], spacingFn: t => 1.2 + 2.2 * t });
  c.hatch(canopy, { angle: 160, spacing: 3.2, sw: 0.2, holes: figure, jitter: 0.6, dash: [3, 5, 5, 4] });
  c.lines(clipTo(canopy.pts(2), scenePolys), { sw: 0.6 });
  for (const t of [trunkL, trunkR]) { c.hatch(t, { angle: 92, spacing: 1.3, sw: 0.3, spacingFn: tt => 0.9 + 1.4 * tt }); c.hatch(t, { angle: 0, spacing: 7, sw: 0.24, jitter: 1.2, dash: [4, 6, 8, 5] }); c.lines(clipTo(t.pts(2), scenePolys), { sw: 0.8 }); }
  // a bough from the left tree, and the nightingale on it, beak open, singing: her voice as short strokes
  c.draw(new Path().M(fx0 + 20, 180).C(fx0 + 40, 176, fx0 + 60, 168, fx0 + 84, 172), { sw: 1.4 }); c.draw(new Path().M(fx0 + 56, 171).C(fx0 + 62, 162, fx0 + 66, 158, fx0 + 72, 154), { sw: 0.7 });
  const nx = fx0 + 72, ny = 166; const bird = S([[nx - 9, ny], [nx - 4, ny - 5], [nx + 3, ny - 5], [nx + 7, ny - 2], [nx + 5, ny + 2], [nx - 2, ny + 3], [nx - 12, ny + 4]], 0.5);
  c.fill(bird); c.fill(Path.poly([[nx + 6, ny - 3], [nx + 13, ny - 6], [nx + 7, ny - 1]])); c.fill(Path.poly([[nx + 6, ny - 1], [nx + 12, ny + 1], [nx + 7, ny + 1]]));
  c.lines([[[nx + 15, ny - 8], [nx + 20, ny - 12]], [[nx + 16, ny - 4], [nx + 22, ny - 5]], [[nx + 15, ny], [nx + 20, ny + 3]]], { sw: 0.5 });
  // ---------- Philomel drawn: the gown hatched, the wings feathered, her face turned back toward the king, mouth open, crying
  c.hatch(gown, { angle: 92, spacing: 2.2, sw: 0.26, spacingFn: t => 1.4 + 2 * t, jitter: 0.3 });
  c.drapery(gown, [[[px, py - 60], [px - 4, py - 30], [px - 6, py - 2]], [[px + 14, py - 50], [px + 16, py - 20], [px + 20, py - 2]]], { side: 1, width: 7, spacing: 1.4, sw: 0.28, foldSw: 0.6 });
  c.outlineVar(gown, { min: 0.6, max: 1.2, light: -60 });
  for (const w of [wingL, wingR]) { c.hatch(w, { angle: 100, spacing: 1.2, sw: 0.28, spacingFn: t => 0.8 + 1.4 * t }); c.draw(w, { sw: 0.7 }); }
  // the feathers: short curved strokes along the wings
  for (let i = 0; i < 6; i++) { const t = i / 5; c.draw(new Path().M(px - 14 - 60 * t, py - 64 - 46 * t).C(px - 20 - 60 * t, py - 74 - 46 * t, px - 24 - 60 * t, py - 84 - 46 * t, px - 22 - 60 * t, py - 96 - 44 * t), { sw: 0.4 }); }
  for (let i = 0; i < 5; i++) { const t = i / 4; c.draw(new Path().M(px + 20 + 30 * t, py - 84 - 56 * t).C(px + 28 + 30 * t, py - 92 - 56 * t, px + 36 + 30 * t, py - 100 - 56 * t, px + 44 + 30 * t, py - 106 - 54 * t), { sw: 0.4 }); }
  for (const f of feet) c.fill(f);
  c.hatch(head, { angle: 100, spacing: 2.4, sw: 0.2, spacingFn: t => 1.6 + 2.2 * t }); c.draw(head, { sw: 0.9 });
  c.draw(Path.circle(px + 8, py - 100, 1.8), { sw: 0.5 }); c.fill(Path.circle(px + 8.6, py - 100, 0.9)); c.draw(Path.ellipse(px + 9, py - 91, 1.6, 2.4), { sw: 0.5 }); // an eye turned back, the mouth open
  c.fill(hair);
  // ---------- the king drawn: a black figure, the crown gold, the sword bare
  c.fillEO([kingBody]); for (const l of kingLegs) c.fill(l); c.fill(kingArm);
  c.hatch(kingHead, { angle: 100, spacing: 1.6, sw: 0.26, spacingFn: t => 1.2 + 1.2 * t }); c.draw(kingHead, { sw: 0.8 });
  c.fill(Path.ellipse(kx - 5, ky - 108, 1.6, 1.2)); c.draw(new Path().M(kx - 8, ky - 100).C(kx - 5, ky - 98, kx, ky - 98, kx + 3, ky - 100), { sw: 0.5 });
  const beard = S([[kx - 8, ky - 100], [kx + 6, ky - 100], [kx + 8, ky - 92], [kx, ky - 84], [kx - 8, ky - 90]], 0.5); c.hatch(beard, { angle: 80, spacing: 1.1, sw: 0.3 }); c.draw(beard, { sw: 0.5 });
  c.fill(crown, C.gold); c.draw(crown, { sw: 0.5 });
  c.hatch(sword, { angle: 60, spacing: 1.6, sw: 0.22 }); c.draw(sword, { sw: 0.7 }); c.draw(new Path().M(kx - 46, ky - 122).L(kx - 32, ky - 130), { sw: 1.6 });
  // ---------- the frame: a double moulding, the corners squared; the mantel-shelf under it, and the wall
  c.hatch(Path.poly([[px0, py0], [px1, py0], [px1, 400], [px0, 400]]), { angle: 90, spacing: 3.4, sw: 0.2, holes: [frameOuter], dash: [30, 80, 10, 50] });
  c.hatch(frameOuter, { angle: 45, spacing: 1.2, sw: 0.28, holes: [frameInner] }); c.draw(frameOuter, { sw: 1.1 }); c.draw(frameInner, { sw: 0.8 });
  c.draw(Path.rect(fx0 - 6, fy0 - 6, fx1 - fx0 + 12, fy1 - fy0 + 12), { sw: 0.4 });
  // the mantel: a shelf with a moulded edge, the fire-opening dark below
  c.draw(new Path().M(px0 + 10, 402).L(px1 - 10, 402), { sw: 1.2 }); c.draw(new Path().M(px0 + 14, 408).L(px1 - 14, 408), { sw: 0.5 });
  c.hatch(Path.rect(px0 + 10, 402, px1 - px0 - 20, 6), { angle: 0, spacing: 1.2, sw: 0.26 });
  c.hatch(Path.rect(px0, 408, px1 - px0, py1 - 408), { angle: 90, spacing: 2.6, sw: 0.24, holes: [Path.rect(70, 420, 160, 46)], spacingFn: t => 2 + 1.4 * t });
  c.fillEO([Path.rect(70, 420, 160, 46), Path.rect(76, 426, 148, 40)]); c.hatch(Path.rect(76, 426, 148, 40), { angle: 0, spacing: 1.1, sw: 0.32 }); c.hatch(Path.rect(76, 426, 148, 40), { angle: 90, spacing: 1.6, sw: 0.26 });
  c.frame();
  return c;
};
