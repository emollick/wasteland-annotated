// LVI  "I see crowds of people, walking round in a ring." A ring of walkers on a bare plain, seen from above; a path worn into the ground.
const { Card, Path, C, INK, deg, clipTo } = require('../lib');
const { tube } = require('../fig');
module.exports = function crowd() {
  const c = new Card({ name: 'The Crowd in a Ring', numeral: 'LVI', seed: 56 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const cx = 150, cy = 300, rx = 108, ry = 66;
  // walkers: profile, bowler or cloche, coat, mid-stride. dir = +1 walking right, -1 walking left; s = scale
  const walker = (x, y, s, dir, k) => {
    const M = p => p.scale(s * dir, s).translate(x, y);
    const parts = [];
    const woman = k % 3 === 1;
    parts.push(M(Path.circle(0, -30, 3.6)));
    if (woman) parts.push(M(Path.smooth([[-5, -33], [0, -37], [5, -33], [4.5, -28], [-4.5, -28]], { closed: true, tension: 0.4 }))); // cloche
    else parts.push(M(Path.poly([[-6.5, -33], [6.5, -33], [6.5, -34.2], [4, -34.2], [3.5, -39], [0, -40.5], [-3.5, -39], [-4, -34.2], [-6.5, -34.2]])));
    parts.push(M(Path.smooth([[-5, -26], [5, -26], [6.5, -12], [5.5, 0], [-5.5, 0], [-6.5, -12]], { closed: true, tension: 0.4 }))); // coat
    if (woman) parts.push(M(Path.smooth([[-6, -6], [6, -6], [8, 6], [-8, 6]], { closed: true, tension: 0.3 })));
    else { parts.push(M(tube([[-2, -1], [-5, 6], [-7, 12]], () => 3.4))); parts.push(M(tube([[2, -1], [4, 6], [6, 12]], () => 3.4))); }
    parts.push(M(tube([[4, -22], [7, -12], [5, -4]], () => 3)));
    for (const p of parts) c.fill(p);
    // a small shadow at the feet
    c.fill(M(Path.ellipse(0, 12.5, 8, 1.6)), INK, { op: 0.6 });
  };
  // ---------- the plain: horizon high, a few far marks, the ground faintly hatched; the trodden ring
  const horizon = 118;
  c.draw(new Path().M(px0, horizon).L(px1, horizon), { sw: 0.6 });
  c.hatch(Path.rect(px0, horizon - 22, px1 - px0, 22), { angle: 0, spacing: 3.6, sw: 0.22, dash: [40, 120, 6, 30] });
  const ground = Path.rect(px0, horizon, px1 - px0, py1 - horizon);
  c.hatch(ground, { angle: 0, spacing: 5.2, sw: 0.22, jitter: 0.8, dash: [4, 30, 4, 26], spacingFn: t => 7 - 3 * t });
  // the ring, worn into the ground: a band of many concentric ellipses
  const ringPts = (k) => { const pts = []; for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2; pts.push([cx + (rx + k) * Math.cos(a), cy + (ry + k * 0.62) * Math.sin(a)]); } return pts; };
  for (let k = -14; k <= 14; k += 2.2) c.lines([ringPts(k)], { sw: Math.abs(k) < 6 ? 0.42 : 0.26 });
  // ---------- the walkers, spaced round the ring, nearer ones larger; clockwise as seen from above
  const n = 26;
  const order = []; for (let i = 0; i < n; i++) order.push(i);
  order.sort((a, b) => Math.sin(a / n * Math.PI * 2) - Math.sin(b / n * Math.PI * 2)); // far first
  for (const i of order) {
    const a = i / n * Math.PI * 2 + 0.1; const x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
    const depth = (Math.sin(a) + 1) / 2; const s = 0.62 + 0.5 * depth;
    const dir = Math.sin(a) > 0 ? -1 : 1; // bottom of the ring walks left, top walks right
    walker(x + rnd.range(-2, 2), y + 4, s, dir, i);
  }
  c.frame();
  return c;
};
