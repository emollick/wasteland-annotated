// CDXXIX  O swallow swallow: two of them, one near and turning, one far; the sky mostly bare, a reed-bed and water low down.
const { Card, Path, C, INK, deg, rot, clipTo, clipPolyline, offsetPolyline } = require('../lib');
module.exports = function swallow() {
  const c = new Card({ name: 'The Swallow', numeral: 'CDXXIX', seed: 429 });
  const { px0, px1, py0, py1 } = c; const rnd = c.rnd;
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  const all = [Path.rect(0, 0, 300, 520).polys()[0]];
  // a swallow, seen from below and a little to the side, banking: body, two swept wings, the forked tail
  const bird = (x, y, s, ang, bank) => {
    const M = p => p.scale(s, s).rotate(deg(ang), [0, 0]).translate(x, y);
    const pt = q => { const r = rot([q[0] * s, q[1] * s], deg(ang), [0, 0]); return [r[0] + x, r[1] + y]; };
    const body = M(S([[-26, 0], [-18, -6], [-4, -8], [10, -6], [20, -2], [26, 2], [20, 6], [8, 8], [-6, 7], [-18, 4]], 0.5));
    const head = M(S([[20, -2], [28, -6], [36, -4], [40, 0], [36, 4], [28, 5]], 0.5));
    const beak = M(Path.poly([[39, -1], [48, 0.5], [39, 2]]));
    const wingUp = M(Path.poly([[-2, -6], [-10, -30], [-8, -62], [2, -96], [10, -110], [4, -84], [6, -56], [12, -28], [14, -8]]));  // the far wing, swept up and back
    const wingDown = M(Path.poly([[-2, 6], [-14, 24], [-30, 44], [-52, 62], [-70, 70], [-52, 52], [-34, 30], [-18, 12], [0, 2]]));
    const tailA = M(Path.poly([[-24, -3], [-44, -12], [-70, -22], [-92, -34], [-70, -16], [-46, -6], [-26, 2]]));
    const tailB = M(Path.poly([[-24, 3], [-44, 10], [-62, 18], [-78, 28], [-60, 12], [-42, 4], [-26, -1]]));
    const throat = M(S([[24, 0], [30, -2], [36, -1], [37, 3], [31, 5], [25, 4]], 0.5));
    const belly = M(S([[-16, 2], [-4, 0], [10, 0], [20, 3], [14, 7], [0, 7.5], [-12, 6]], 0.5));
    const eye = M(Path.circle(33, -1.6, 1.2));
    return { body, head, beak, wingUp, wingDown, tailA, tailB, throat, belly, eye, M, pt, s };
  };
  // paper hairs along the feathers: thin slivers to subtract from the black
  const sliver = (a, b, w) => { const pts = Path.smooth([a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], b]).pts(3); const L = [], R = []; for (let k = 0; k < pts.length; k++) { const t = k / (pts.length - 1); const ww = w * Math.sin(Math.PI * t) + 0.08; const p = pts[k], q = pts[Math.min(pts.length - 1, k + 1)], o = pts[Math.max(0, k - 1)]; let nx = -(q[1] - o[1]), ny = q[0] - o[0]; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l; L.push([p[0] + nx * ww, p[1] + ny * ww]); R.push([p[0] - nx * ww, p[1] - ny * ww]); } return Path.poly(L.concat(R.reverse())); };
  const drawBird = (b, near) => {
    const s = b.s;
    // wings and tail: black, with feather slivers
    const wu = []; for (let i = 0; i < 6; i++) { const t = 0.2 + i * 0.13; wu.push(sliver(b.pt([-6 + 16 * t, -24 - 70 * t]), b.pt([6 + 6 * t, -14 - 66 * t]), 0.5 * s)); }
    c.fillEO([b.wingUp, ...(near ? wu : [])]);
    const wd = []; for (let i = 0; i < 6; i++) { const t = 0.15 + i * 0.14; wd.push(sliver(b.pt([-4 - 60 * t, 8 + 52 * t]), b.pt([2 - 46 * t, 2 + 44 * t]), 0.5 * s)); }
    c.fillEO([b.wingDown, ...(near ? wd : [])]);
    c.fill(b.tailA); c.fill(b.tailB);
    // body: black above, the belly left as paper and lightly hatched; the throat rust
    c.fillEO([b.body, b.belly, b.throat]); c.hatch(b.belly, { angle: 10, spacing: 1.2 * s + 0.3, sw: 0.22 });
    c.fillEO([b.head, b.throat, b.eye]); c.fill(b.beak); c.fill(b.throat, C.rust);
  };
  const near = bird(146, 232, 1.35, -18, 1);
  const far = bird(232, 118, 0.42, 10, 0.9);
  // ---------- the sky: bare in the main; close lines at the very top thinning to nothing, and the far reed-bed and water at the bottom
  const birdParts = [near.body, near.head, near.beak, near.wingUp, near.wingDown, near.tailA, near.tailB, far.body, far.head, far.wingUp, far.wingDown, far.tailA, far.tailB];
  c.hatch(Path.rect(px0, py0, px1 - px0, 110), { angle: 0, spacing: 2.2, sw: 0.24, spacingFn: t => 1.5 + 9 * t * t, holes: birdParts, jitter: 0.15 });
  // the reed-bed: a low band at the bottom, reeds rising, water below them
  const waterY = 420;
  c.hatch(Path.rect(px0, waterY, px1 - px0, py1 - waterY), { angle: 0, spacing: 2.4, sw: 0.26, spacingFn: t => 3.2 - 1.2 * t, jitter: 0.2 });
  c.draw(new Path().M(px0, waterY).L(px1, waterY), { sw: 0.5 });
  const reeds = []; for (let i = 0; i < 60; i++) { const x = px0 + 4 + (px1 - px0 - 8) * i / 59 + rnd.range(-1.5, 1.5); const h = rnd.range(22, 60); const lean = rnd.range(-6, 6); reeds.push([[x, waterY + 2], [x + lean * 0.4, waterY - h * 0.5], [x + lean, waterY - h]]); }
  c.lines(reeds.map(r => Path.smooth(r).pts(3)), { sw: 0.5 });
  for (const r of reeds) if (rnd() < 0.3) { const top = r[2]; c.fill(S([[top[0] - 1.2, top[1] + 2], [top[0] + 1.2, top[1] + 2], [top[0] + 1.4, top[1] + 10], [top[0] - 1.4, top[1] + 10]], 0.4)); }
  // reflections of the reeds, broken
  c.lines(reeds.filter((r, i) => i % 3 === 0).map(r => [[r[0][0], waterY + 4], [r[0][0] - r[2][0] + r[0][0], waterY + 4 + (r[0][1] - r[2][1]) * 0.35]]).flatMap(l => clipTo(l, [Path.rect(px0, waterY, px1 - px0, py1 - waterY).polys()[0]])), { sw: 0.3 });
  // ---------- the birds
  drawBird(far, false); drawBird(near, true);
  // the near swallow's line of flight: a long curve behind it, broken, the way a burin would note speed
  c.draw(new Path().M(px0 + 6, 330).C(60, 300, 110, 280, 128, 258), { sw: 0.3, dash: [6, 5, 2, 5] });
  c.frame();
  return c;
};
