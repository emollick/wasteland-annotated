// LIII  The blank card: "something he carries on his back, which I am forbidden to see." Bare paper; the bundle shows faintly through from the other side, reversed.
const { Card, Path, C, INK, offsetPolyline, clipPolyline } = require('../lib');
module.exports = function blank() {
  const c = new Card({ name: 'The Blank Card', numeral: 'LIII', seed: 53 });
  const S = (pts, t = 0.5) => Path.smooth(pts, { closed: true, tension: t });
  // the merchant's bundle, mirrored, as show-through
  const bundle = S([[196, 168], [222, 160], [250, 172], [266, 200], [270, 240], [262, 280], [244, 300], [218, 302], [200, 290], [196, 250], [198, 210]], 0.55).mirrorX(150).scale(1.5, 1.5, [67, 231]).translate(83, 20);
  c.raw('<g id="showthrough" opacity="0.13">');
  c.hatch(bundle, { angle: 150, spacing: 2.4, sw: 0.5 });
  c.draw(bundle, { sw: 1.6 });
  for (const rp of [[[200, 200], [232, 212], [266, 224]], [[206, 262], [236, 254], [266, 250]], [[222, 162], [230, 200], [236, 254], [232, 300]]]) { const pl = Path.smooth(rp).mirrorX(150).scale(1.5, 1.5, [67, 231]).translate(83, 20).pts(2); c.lines([offsetPolyline(pl, 1.4), offsetPolyline(pl, -1.4)].flatMap(p => clipPolyline(p, bundle.polys())), { sw: 0.9 }); }
  c.raw('</g>');
  c.frame();
  return c;
};
