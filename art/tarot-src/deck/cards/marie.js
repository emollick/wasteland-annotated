// XV  Marie, Marie, hold on tight: the sled going down, the cousin behind her, the mountains where you feel free.
const { Card, Path, C, INK, deg, rot, clipTo, clipPolyline, offsetPolyline } = require('../lib');
const { tube } = require('../fig');
module.exports = function marie() {
  const c = new Card({ name: 'Marie', numeral: 'XV', seed: 15 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const all = [Path.rect(0, 0, 300, 520).polys()[0]];
  // ---------- the slope: snow is bare paper; it runs from the top left down to the bottom right; the sky above it hatched; far peaks
  const slopeTop = [[px0, 150], [60, 176], [120, 214], [180, 262], [240, 322], [px1, 370]];
  const slope = Path.poly([...slopeTop, [px1, py1], [px0, py1]]);
  const skyPoly = Path.poly([[px0, py0], [px1, py0], ...slopeTop.slice().reverse()]);
  // ---------- the sled and its two riders, going down toward the bottom right, seen from the side
  const ang = 32; // the slope's pitch in degrees
  const cx = 150, cy = 280; // the sled's middle
  const R = p => p.rotate(deg(ang), [cx, cy]);
  const runner = R(Path.poly([[cx - 46, cy + 10], [cx + 40, cy + 10], [cx + 50, cy + 4], [cx + 52, cy - 4], [cx + 48, cy - 2], [cx + 46, cy + 4], [cx + 40, cy + 7], [cx - 46, cy + 7]]));
  const deck = R(Path.poly([[cx - 40, cy - 2], [cx + 36, cy - 2], [cx + 36, cy + 2], [cx - 40, cy + 2]]));
  const posts = [R(Path.rect(cx - 34, cy + 2, 2.4, 5)), R(Path.rect(cx - 4, cy + 2, 2.4, 5)), R(Path.rect(cx + 28, cy + 2, 2.4, 5))];
  const rail = R(Path.poly([[cx + 36, cy - 2], [cx + 46, cy - 12], [cx + 48, cy - 10], [cx + 38, cy - 1]]));
  // Marie, in front, small, bent forward, both hands gripping the rail; her scarf streaming back
  const mx = cx + 14, my = cy - 4;
  const girl = {
    coat: R(S([[mx - 14, my - 34], [mx + 2, my - 40], [mx + 14, my - 30], [mx + 16, my - 10], [mx + 14, my - 2], [mx - 16, my - 2], [mx - 18, my - 16]], 0.45)),
    head: R(S([[mx + 4, my - 54], [mx + 14, my - 52], [mx + 18, my - 44], [mx + 14, my - 36], [mx + 4, my - 34], [mx - 2, my - 42]], 0.5)),
    hood: R(S([[mx - 2, my - 58], [mx + 10, my - 60], [mx + 18, my - 52], [mx + 17, my - 40], [mx + 10, my - 36], [mx + 12, my - 42], [mx + 10, my - 52], [mx + 2, my - 52], [mx - 4, my - 46]], 0.45)),
    arm: R(tube([[mx + 8, my - 26], [mx + 22, my - 20], [mx + 34, my - 10]], t => 7 - 1.5 * t)),
    hand: R(S([[mx + 32, my - 14], [mx + 40, my - 14], [mx + 42, my - 6], [mx + 34, my - 5]], 0.5)),
    legs: R(S([[mx - 2, my - 6], [mx + 16, my - 6], [mx + 24, my + 2], [mx + 22, my + 6], [mx + 4, my + 4], [mx - 6, my]], 0.45)),
  };
  const scarf = R(S([[mx - 2, my - 46], [mx - 10, my - 50], [mx - 24, my - 56], [mx - 40, my - 66], [mx - 44, my - 60], [mx - 26, my - 50], [mx - 12, my - 44], [mx, my - 40]], 0.45));
  // the cousin behind her, bigger, upright, one arm round her, a cap
  const bx = cx - 22, by = cy - 4;
  const boy = {
    coat: R(S([[bx - 14, by - 58], [bx + 10, by - 60], [bx + 18, by - 44], [bx + 18, by - 10], [bx + 14, by - 2], [bx - 16, by - 2], [bx - 18, by - 24]], 0.45)),
    head: R(S([[bx - 4, by - 78], [bx + 8, by - 78], [bx + 13, by - 68], [bx + 10, by - 60], [bx - 2, by - 58], [bx - 8, by - 66]], 0.5)),
    cap: R(Path.poly([[bx - 10, by - 76], [bx + 14, by - 76], [bx + 18, by - 74], [bx + 12, by - 80], [bx + 4, by - 84], [bx - 6, by - 82], [bx - 10, by - 76]])),
    arm: R(tube([[bx + 8, by - 46], [bx + 24, by - 40], [bx + 34, by - 34]], t => 8 - 2 * t)),
    legs: R(S([[bx - 6, by - 6], [bx + 14, by - 6], [bx + 20, by + 2], [bx + 18, by + 6], [bx, by + 4], [bx - 10, by]], 0.45)),
  };
  const figure = [runner, deck, ...posts, rail, ...Object.values(girl), scarf, ...Object.values(boy)];
  // sky
  c.hatch(skyPoly, { angle: 0, spacing: 2.0, sw: 0.26, spacingFn: t => 1.4 + 2.4 * t, holes: figure, jitter: 0.15 });
  // far peaks in the sky: bare paper with a hatched shadow side
  const peaks = Path.poly([[px0, 150], [px0, 120], [40, 96], [70, 126], [110, 90], [150, 130], [190, 112], [230, 150], [260, 132], [px1, 160], [px1, 180], [180, 262], [120, 214], [60, 176]]);
  const snowFaces = [Path.poly([[40, 96], [58, 130], [30, 150], [px0, 150], [px0, 130]]), Path.poly([[110, 90], [136, 122], [96, 128]]), Path.poly([[230, 150], [252, 160], [214, 168]]), Path.poly([[190, 112], [206, 136], [176, 140]])];
  c.hatch(peaks, { angle: 0, spacing: 1.2, sw: 0.32, holes: figure.concat(snowFaces), clip: skyPoly, spacingFn: t => 0.9 + 1 * t }); // the peaks stand dark against the sky, their sunward faces left as bare snow
  c.lines(clipTo(peaks.pts(2), skyPoly.polys(), figure.flatMap(f => f.polys())), { sw: 0.6 });
  // ---------- the slope: bare, with a few lines that show its curve, the sled's track behind the sled, and firs
  c.hatch(slope, { angle: -30, spacing: 14, sw: 0.22, holes: figure, dash: [30, 60, 12, 40], jitter: 1 });
  c.lines([slopeTop], { sw: 0.7 });
  // the track: two lines up the slope behind the runners
  const trackA = [[cx - 60, cy + 2], [cx - 110, cy - 40], [cx - 150, cy - 80]].map(p => rot(p, deg(ang), [cx, cy])); const trackB = trackA.map(p => [p[0] - 2, p[1] + 3.6]);
  c.lines([trackA, trackB].flatMap(t => clipTo(t, slope.polys(), figure.flatMap(f => f.polys()))), { sw: 0.5 });
  c.lines([trackA, trackB].flatMap(t => clipTo(offsetPolyline(t, 1.6), slope.polys(), figure.flatMap(f => f.polys()))), { sw: 0.25 });
  // firs: black, a few, on the slope's far side and near the bottom
  const fir = (x, y, h) => { const p = new Path().M(x, y - h); const w = h * 0.36; const tiers = 4; for (let i = 1; i <= tiers; i++) { const yy = y - h + (h * 0.9) * i / tiers; const ww = w * i / tiers; p.L(x + ww, yy).L(x + ww * 0.35, yy); } p.L(x + 1.5, y).L(x - 1.5, y); for (let i = tiers; i >= 1; i--) { const yy = y - h + (h * 0.9) * i / tiers; const ww = w * i / tiers; p.L(x - ww * 0.35, yy).L(x - ww, yy); } p.Z(); c.fill(p); };
  fir(36, 214, 46); fir(58, 236, 34); fir(250, 440, 52); fir(272, 462, 36); fir(226, 400, 28); fir(88, 300, 22);
  // snow shadows on the near slope: soft lines
  c.hatch(Path.poly([[px0, 380], [80, 400], [160, 440], [px1, py1], [px0, py1]]), { angle: -28, spacing: 3.2, sw: 0.24, spacingFn: t => 5 - 2.6 * t, holes: figure });
  // ---------- the sled drawn: black runners and posts, the deck's slats
  c.fill(runner); for (const p of posts) c.fill(p); c.fill(rail);
  c.hatch(deck, { angle: 90 + ang, spacing: 2, sw: 0.3 }); c.draw(deck, { sw: 0.7 });
  // ---------- the riders: coats hatched, faces bare
  const drawRider = (f, light) => {
    c.hatch(f.coat, { angle: 90 + ang, spacing: 2, sw: 0.28, spacingFn: t => 1.3 + 1.6 * t, jitter: 0.2 }); c.outlineVar(f.coat, { min: 0.6, max: 1.2, light });
    c.hatch(f.legs, { angle: 40 + ang, spacing: 1.6, sw: 0.28 }); c.draw(f.legs, { sw: 0.7 });
    c.hatch(f.arm, { angle: 30 + ang, spacing: 1.6, sw: 0.26 }); c.draw(f.arm, { sw: 0.7 });
    c.hatch(f.head, { angle: 100, spacing: 2.4, sw: 0.2, spacingFn: t => 1.6 + 2.2 * t }); c.draw(f.head, { sw: 0.8 });
  };
  drawRider(boy, -60); c.fill(boy.cap);
  drawRider(girl, -60); c.fill(girl.hood); c.hatch(girl.hand, { angle: 30, spacing: 1.4, sw: 0.24 }); c.draw(girl.hand, { sw: 0.7 });
  c.fill(scarf, C.rust); c.draw(scarf, { sw: 0.5 });
  // faces: Marie frightened, eyes wide and mouth open; the cousin's profile calm
  const gf = rot([mx + 12, my - 44], deg(ang), [cx, cy]); c.draw(Path.circle(gf[0], gf[1], 1.6), { sw: 0.5 }); c.fill(Path.circle(gf[0], gf[1], 0.8)); c.draw(Path.ellipse(gf[0] + 2, gf[1] + 5, 1.2, 1.8), { sw: 0.5 });
  const bf = rot([bx + 8, by - 68], deg(ang), [cx, cy]); c.fill(Path.ellipse(bf[0], bf[1], 1.2, 1)); c.draw(new Path().M(bf[0] + 3, bf[1] + 1).C(bf[0] + 5, bf[1] + 2, bf[0] + 5, bf[1] + 4, bf[0] + 3, bf[1] + 5), { sw: 0.5 });
  // the spray of snow off the front runner
  const tip = rot([cx + 50, cy + 6], deg(ang), [cx, cy]); for (let i = 0; i < 14; i++) { const a = deg(-20 - rnd.range(0, 70)); const r0 = rnd.range(4, 10), r1 = r0 + rnd.range(6, 18); c.draw(new Path().M(tip[0] + Math.cos(a) * r0, tip[1] + Math.sin(a) * r0).L(tip[0] + Math.cos(a) * r1, tip[1] + Math.sin(a) * r1), { sw: 0.4 }); }
  c.stipple(Path.circle(tip[0] + 8, tip[1] - 10, 16), { density: 0.08, sw: 0.7 });
  c.frame();
  return c;
};
