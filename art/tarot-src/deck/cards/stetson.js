// LXIX  Stetson: the corpse planted last year in the garden has begun to sprout; keep the Dog far hence.
const { Card, Path, C, INK, deg, clipTo, offsetPolyline, voronoiCells } = require('../lib');
const { tube } = require('../fig');
module.exports = function stetson() {
  const c = new Card({ name: 'Stetson', numeral: 'LXIX', seed: 69 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  // ---------- Stetson: a City man in a bowler and overcoat, standing at the left with a spade, turned toward us, looking down at the bed
  const sx = 96;
  const coat = S([[sx, 168], [sx + 26, 174], [sx + 36, 196], [sx + 40, 250], [sx + 42, 310], [sx + 46, 356], [sx + 24, 360], [sx, 362], [sx - 24, 360], [sx - 46, 356], [sx - 42, 310], [sx - 40, 250], [sx - 36, 196], [sx - 26, 174]], 0.45);
  const face = S([[sx, 118], [sx + 12, 122], [sx + 16, 138], [sx + 14, 156], [sx + 6, 166], [sx, 168], [sx - 6, 166], [sx - 14, 156], [sx - 16, 138], [sx - 12, 122]], 0.55);
  const bowler = Path.poly([[-22, 0], [22, 0], [22, -2.6], [15, -2.6], [14, -18], [8, -25], [-8, -25], [-14, -18], [-15, -2.6], [-22, -2.6]]).translate(sx, 124);
  const neck = S([[sx - 8, 164], [sx + 8, 164], [sx + 10, 178], [sx - 10, 178]], 0.4);
  const armL = tube([[sx - 30, 190], [sx - 44, 234], [sx - 40, 274]], t => 17 - 3 * t);
  const handL = S([[sx - 50, 268], [sx - 36, 266], [sx - 30, 276], [sx - 36, 288], [sx - 50, 288], [sx - 56, 278]], 0.5);
  const armR = tube([[sx + 30, 190], [sx + 46, 230], [sx + 52, 262]], t => 17 - 3 * t);
  const handR = S([[sx + 44, 254], [sx + 58, 252], [sx + 64, 262], [sx + 58, 274], [sx + 44, 274], [sx + 38, 264]], 0.5);
  const trousers = S([[sx - 34, 356], [sx + 34, 356], [sx + 30, 400], [sx + 28, 430], [sx + 6, 430], [sx + 4, 400], [sx, 384], [sx - 4, 400], [sx - 6, 430], [sx - 28, 430], [sx - 30, 400]], 0.3);
  const shoes = [S([[sx - 34, 428], [sx - 4, 428], [sx - 2, 438], [sx - 38, 438]], 0.4), S([[sx + 4, 428], [sx + 34, 428], [sx + 38, 438], [sx + 2, 438]], 0.4)];
  const figure = [coat, face, bowler, neck, armL, handL, armR, handR, trousers, ...shoes];
  // the spade, held in the right hand, blade in the earth
  const spadeShaft = Path.poly([[sx + 52, 258], [sx + 56, 257], [sx + 62, 396], [sx + 58, 397]]);
  const spadeBlade = S([[sx + 52, 392], [sx + 68, 390], [sx + 72, 410], [sx + 66, 430], [sx + 52, 432], [sx + 46, 412]], 0.35);
  // ---------- the garden: a fence behind, the dug bed with the mound, the shoot, the dog digging
  const horizon = 300;
  const fenceTop = 226;
  c.hatch(Path.rect(px0, py0, px1 - px0, fenceTop - py0), { angle: 0, spacing: 3.6, sw: 0.22, holes: figure, dash: [30, 100, 5, 30] });
  // fence: palings
  for (let x = px0 + 4; x < px1; x += 11) { const pal = Path.poly([[x, fenceTop + 4], [x + 6, fenceTop + 4], [x + 6, horizon], [x, horizon]]); c.hatch(pal, { angle: 90, spacing: 1.3, sw: 0.26, holes: figure }); c.lines(clipTo(pal.pts(), [Path.rect(0, 0, 300, 520).polys()[0]], figure.flatMap(f => f.polys())), { sw: 0.6 }); c.lines(clipTo([[x, fenceTop + 4], [x + 3, fenceTop], [x + 6, fenceTop + 4]], [Path.rect(0, 0, 300, 520).polys()[0]], figure.flatMap(f => f.polys())), { sw: 0.6 }); }
  for (const y of [fenceTop + 22, horizon - 24]) c.lines(clipTo([[px0, y], [px1, y]], [Path.rect(0, 0, 300, 520).polys()[0]], figure.flatMap(f => f.polys())), { sw: 1.1 });
  // ground: the lawn edge and the dug bed
  c.draw(new Path().M(px0, horizon).L(px1, horizon), { sw: 0.7 });
  const bed = S([[130, 340], [200, 332], [262, 340], [280, 372], [272, 420], [236, 446], [170, 450], [124, 436], [108, 396], [112, 362]], 0.5);
  c.hatch(Path.rect(px0, horizon, px1 - px0, py1 - horizon), { angle: 0, spacing: 4.4, sw: 0.22, holes: figure.concat([bed, spadeBlade]), dash: [3, 20, 3, 18], jitter: 0.6 });
  // the bed: turned earth in short clods; the mound, longer than a man, in the middle
  const clods = []; for (let i = 0; i < 70; i++) clods.push([rnd.range(108, 282), rnd.range(332, 452)]);
  const cells = voronoiCells(clods, [[100, 320], [290, 320], [290, 460], [100, 460]]);
  const mound = S([[140, 372], [180, 360], [230, 364], [262, 378], [258, 400], [226, 412], [176, 414], [140, 402], [130, 388]], 0.5);
  for (const cell of cells) { if (cell.length < 3) continue; const cx0 = cell.reduce((a, q) => a + q[0], 0) / cell.length, cy0 = cell.reduce((a, q) => a + q[1], 0) / cell.length; const sh = cell.map(p => [cx0 + (p[0] - cx0) * 0.86, cy0 + (p[1] - cy0) * 0.86]); c.lines(clipTo(sh.concat([sh[0]]), bed.polys(), [mound.polys()[0], spadeBlade.polys()[0]]), { sw: 0.5 }); }
  c.hatch(bed, { angle: 30, spacing: 2.8, sw: 0.22, holes: [mound, spadeBlade], jitter: 0.4 });
  c.draw(bed, { sw: 0.8 });
  // the mound: raised, hatched round its curve, dark on the right
  const moundTop = []; for (let x = 120; x <= 280; x += 8) moundTop.push([x, 366 + 10 * Math.sin((x - 140) / 40)]);
  c.contours(moundTop, { count: 14, spacing: 3.4, sw: 0.3, clip: mound, start: -6 });
  c.hatch(S([[230, 364], [262, 378], [258, 400], [226, 412], [216, 400], [222, 380]], 0.4), { angle: 60, spacing: 1.4, sw: 0.3, clip: mound });
  c.outlineVar(mound, { min: 0.6, max: 1.3, light: -120 });
  // the shoot: a lilac bud pushing up from the mound, in violet, with two small leaves
  c.draw(new Path().M(200, 388).C(200, 376, 202, 366, 204, 352), { sw: 1.1 });
  const leaf = (x, y, a, L) => new Path().M(0, 0).C(L * 0.3, -L * 0.34, L * 0.75, -L * 0.26, L, 0).C(L * 0.75, L * 0.26, L * 0.3, L * 0.34, 0, 0).Z().rotate(deg(a)).translate(x, y);
  for (const [x, y, a, L] of [[201, 374, -150, 13], [202, 366, 20, 12]]) { const lf = leaf(x, y, a, L); c.hatch(lf, { angle: a + 60, spacing: 1.1, sw: 0.24 }); c.draw(lf, { sw: 0.6 }); }
  const bud = S([[204, 352], [210, 344], [208, 334], [204, 328], [200, 334], [198, 344]], 0.5); c.fill(bud, C.violet); c.draw(bud, { sw: 0.5 });
  for (const [x, y] of [[199, 340], [209, 338], [204, 331]]) { c.fill(Path.circle(x, y, 2.2), C.violet); c.draw(Path.circle(x, y, 2.2), { sw: 0.4 }); }
  // the Dog: at the far end of the mound, nose down, one paw into the earth, tail up
  const dog = [S([[236, 404], [256, 392], [276, 396], [284, 410], [278, 424], [258, 428], [240, 426], [230, 416]], 0.5), // body
    S([[224, 414], [232, 406], [246, 408], [248, 420], [240, 430], [226, 428], [218, 422]], 0.5), // head down
    tube([[250, 424], [248, 440]], () => 5), tube([[268, 424], [270, 440]], () => 5), tube([[232, 428], [226, 440]], () => 4.6), // legs
    Path.smooth([[282, 404], [292, 392], [290, 380]]), // tail (line)
    S([[232, 404], [238, 396], [244, 404]], 0.3)]; // ear
  for (const d of dog.slice(0, 3)) c.fill(d); c.fill(dog[3]); c.fill(dog[4]); c.draw(dog[5], { sw: 2.2 }); c.fill(dog[6]);
  c.fill(Path.circle(222, 421, 1.6), C.paper === 'x' ? INK : INK);
  // ---------- Stetson drawn: coat, face, bowler
  c.hatch(coat, { angle: 88, spacing: 2.0, sw: 0.28, jitter: 0.3 });
  c.hatch(S([[sx + 26, 174], [sx + 36, 196], [sx + 40, 250], [sx + 42, 310], [sx + 46, 356], [sx + 30, 358], [sx + 28, 310], [sx + 26, 250], [sx + 22, 196]], 0.4), { angle: 84, spacing: 1.2, sw: 0.3, clip: coat });
  c.outlineVar(coat, { min: 0.6, max: 1.4, light: -140 });
  c.draw(Path.smooth([[sx - 4, 178], [sx - 2, 260], [sx, 356]]), { sw: 0.6 }); for (const y of [212, 246, 280, 314]) c.fill(Path.circle(sx + 4, y, 2));
  c.draw(new Path().M(sx - 26, 174).C(sx - 14, 186, sx - 4, 190, sx, 184).C(sx + 4, 190, sx + 14, 186, sx + 26, 174), { sw: 0.7 }); // lapels
  for (const a of [armL, armR]) { c.hatch(a, { angle: 60, spacing: 1.9, sw: 0.26 }); c.draw(a, { sw: 0.9 }); }
  for (const h of [handL, handR]) { c.hatch(h, { angle: 20, spacing: 1.9, sw: 0.22 }); c.draw(h, { sw: 0.85 }); }
  c.fill(spadeShaft); c.hatch(spadeBlade, { angle: 80, spacing: 1.2, sw: 0.3 }); c.draw(spadeBlade, { sw: 0.9 });
  c.hatch(trousers, { angle: 88, spacing: 2.0, sw: 0.26 }); c.draw(trousers, { sw: 0.9 }); c.draw(new Path().M(sx - 16, 360).L(sx - 18, 428).M(sx + 16, 360).L(sx + 18, 428), { sw: 0.4 });
  for (const s of shoes) c.fill(s);
  c.hatch(neck, { angle: 90, spacing: 1.7, sw: 0.22 }); c.draw(neck, { sw: 0.7 });
  c.hatch(face, { angle: 100, spacing: 2.4, sw: 0.2, spacingFn: t => 1.6 + 2.4 * t }); c.draw(face, { sw: 0.9 });
  // a face looking down at the bed: lowered lids, a moustache
  for (const x of [sx - 6, sx + 6]) { c.draw(new Path().M(x - 4, 141).C(x - 2, 143.5, x + 2, 143.5, x + 4, 141), { sw: 0.7 }); c.draw(new Path().M(x - 4.5, 138).C(x - 2, 136, x + 2, 136, x + 4.5, 138), { sw: 0.45 }); }
  c.draw(new Path().M(sx, 142).C(sx - 1, 147, sx - 1.5, 150, sx - 2, 152).C(sx - 0.5, 153, sx + 0.5, 153, sx + 2, 152), { sw: 0.45 });
  c.fill(S([[sx - 8, 157], [sx, 155], [sx + 8, 157], [sx + 6, 160], [sx, 159], [sx - 6, 160]], 0.4));
  c.hatch(bowler, { angle: 20, spacing: 1.3, sw: 0.34 }); c.hatch(bowler, { angle: 110, spacing: 2.0, sw: 0.3 }); c.draw(bowler, { sw: 1.0 });
  c.frame();
  return c;
};
