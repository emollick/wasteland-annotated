// LI  The Wheel. Fortune's wheel as a ship's wheel: the same man at four stations of the rim; the hub in gold; the air blasted with lines.
const { Card, Path, C, INK, deg, clipPolyline, rot } = require('../lib');
module.exports = function wheel() {
  const c = new Card({ name: 'The Wheel', numeral: 'LI', seed: 51 });
  const { px0, px1, py0, py1 } = c;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const cx = 150, cy = 252, R = 92;
  const pic = Path.rect(px0, py0, px1 - px0, py1 - py0);
  // ---------- figures at the four stations: one man in a bowler, built of black parts
  const { tube } = require('../fig');
  const man = (parts) => parts; // list of Paths, all filled ink
  const bowler = (x, y, s, a = 0) => Path.poly([[-11, 0], [11, 0], [11, -1.6], [7.5, -1.6], [7, -8.5], [3, -11.5], [-3, -11.5], [-7, -8.5], [-7.5, -1.6], [-11, -1.6]]).scale(s).rotate(deg(a)).translate(x, y);
  // enthroned at the top: seated on the rim, facing us, hands on knees
  const kt = [Path.circle(150, 136, 7.5), bowler(150, 130.5, 0.95),
    Path.smooth([[150, 142], [162, 146], [166, 168], [162, 176], [138, 176], [134, 168], [138, 146]], { closed: true, tension: 0.4 }),
    tube([[163, 150], [172, 166], [170, 180]], () => 6.5), tube([[137, 150], [128, 166], [130, 180]], () => 6.5),
    tube([[144, 174], [140, 186], [138, 200]], () => 8), tube([[156, 174], [160, 186], [162, 200]], () => 8), Path.ellipse(136, 202, 6, 2.6), Path.ellipse(164, 202, 6, 2.6)];
  // falling on the right, head first, arms out, hat gone
  const ft = [Path.circle(258, 300, 7), Path.smooth([[262, 292], [270, 278], [276, 262], [272, 250], [262, 250], [256, 262], [254, 280]], { closed: true, tension: 0.4 }),
    tube([[262, 262], [280, 250], [292, 240]], () => 6), tube([[258, 278], [244, 282], [236, 296]], () => 6),
    tube([[270, 250], [266, 232], [276, 214]], () => 7.5), tube([[266, 252], [252, 240], [246, 226]], () => 7.5), bowler(232, 232, 0.8, -60)];
  // crushed beneath the wheel on the ground, prone, one arm flung out
  const ct = [Path.circle(96, 373, 6.5), Path.smooth([[102, 366], [124, 366], [150, 368], [176, 370], [180, 380], [150, 380], [124, 380], [102, 380]], { closed: true, tension: 0.35 }),
    tube([[176, 370], [196, 372], [214, 376]], () => 6.5), tube([[110, 372], [92, 362], [80, 356]], () => 5.5), bowler(78, 372, 0.8, 90)];
  // climbing on the left: side view, hands on the rim, knee up
  const lt = [Path.circle(52, 262, 7), bowler(52, 256.5, 0.95, -15),
    Path.smooth([[46, 268], [60, 270], [66, 290], [62, 306], [46, 306], [40, 292]], { closed: true, tension: 0.4 }),
    tube([[58, 274], [66, 258], [64, 248]], () => 5.5), tube([[52, 282], [62, 268], [62, 256]], () => 5.5),
    tube([[52, 304], [48, 320], [40, 328]], () => 7.5), tube([[60, 302], [72, 296], [80, 300]], () => 7.5)];
  const figures = [...kt, ...ft, ...ct, ...lt];
  // ---------- the blast: lines radiating from the hub, outside the rim, alternating length
  const outer = Path.circle(cx, cy, R + 12);
  const rays = []; const clipP = pic.polys().concat(outer.polys(), figures.flatMap(f => f.polys()));
  for (let i = 0; i < 144; i++) { const a = i * Math.PI * 2 / 144; const L = 300 * (i % 3 === 0 ? 1 : i % 3 === 1 ? 0.62 : 0.4); const p = [[cx + (R + 12) * Math.cos(a), cy + (R + 12) * Math.sin(a)], [cx + (R + 12 + L) * Math.cos(a), cy + (R + 12 + L) * Math.sin(a)]]; rays.push(...clipPolyline(p, clipP)); }
  c.lines(rays, { sw: 0.32 });
  // the ground the crushed man lies on
  c.draw(new Path().M(px0, 380).L(px1, 380), { sw: 0.7 });
  c.hatch(Path.rect(px0, 380, px1 - px0, py1 - 380), { angle: 0, spacing: 3.0, sw: 0.24, dash: [8, 40, 3, 12], holes: figures });
  // ---------- the wheel
  const rimOuter = Path.circle(cx, cy, R), rimInner = Path.circle(cx, cy, R - 11);
  c.hatch([rimOuter.polys()[0], rimInner.polys()[0]], { angle: 90, spacing: 1.6, sw: 0.3 });
  // wedge marks on the rim (engraved segments)
  for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12; c.draw(new Path().M(cx + (R - 11) * Math.cos(a), cy + (R - 11) * Math.sin(a)).L(cx + R * Math.cos(a), cy + R * Math.sin(a)), { sw: 0.7 }); }
  c.draw(rimOuter, { sw: 1.6 }); c.draw(rimInner, { sw: 0.7 });
  c.draw(Path.circle(cx, cy, R - 5.5), { sw: 0.35 });
  // handles, like a ship's wheel
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + Math.PI / 8; const p = [cx + R * Math.cos(a), cy + R * Math.sin(a)], q = [cx + (R + 14) * Math.cos(a), cy + (R + 14) * Math.sin(a)]; c.draw(new Path().M(p[0], p[1]).L(q[0], q[1]), { sw: 2.6 }); c.fill(Path.circle(q[0], q[1], 2.6)); }
  // spokes: tapered, dark
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; const sp = Path.poly([[cx + 16 * Math.cos(a) - 2.4 * Math.sin(a), cy + 16 * Math.sin(a) + 2.4 * Math.cos(a)], [cx + 16 * Math.cos(a) + 2.4 * Math.sin(a), cy + 16 * Math.sin(a) - 2.4 * Math.cos(a)], [cx + (R - 11) * Math.cos(a) + 1.5 * Math.sin(a), cy + (R - 11) * Math.sin(a) - 1.5 * Math.cos(a)], [cx + (R - 11) * Math.cos(a) - 1.5 * Math.sin(a), cy + (R - 11) * Math.sin(a) + 1.5 * Math.cos(a)]]); c.fill(sp); }
  // between the spokes, a light hatch as the air seen through, denser toward the rim
  for (let i = 0; i < 8; i++) { const a0 = i * Math.PI / 4 + 0.06, a1 = a0 + Math.PI / 4 - 0.12; const wedge = new Path().M(cx + 18 * Math.cos(a0), cy + 18 * Math.sin(a0)).add(Path.arc(cx, cy, R - 12, a0, a1, { move: false })).add(Path.arc(cx, cy, 18, a1, a0, { move: false })).Z(); c.hatch(wedge, { angle: (a0 + a1) / 2 * 180 / Math.PI + 90, spacing: 3.4, sw: 0.2, spacingFn: t => 5 - 2.6 * t }); }
  // the hub, gold
  c.fill(Path.circle(cx, cy, 16), C.gold); c.draw(Path.circle(cx, cy, 16), { sw: 1.1 }); c.draw(Path.circle(cx, cy, 10), { sw: 0.5 }); c.fill(Path.circle(cx, cy, 3));
  for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; c.fill(Path.circle(cx + 12.8 * Math.cos(a), cy + 12.8 * Math.sin(a), 1.1)); }
  // ---------- the figures drawn
  for (const f of figures) c.fill(f);
  c.frame();
  return c;
};
