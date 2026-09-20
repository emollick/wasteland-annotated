// The card back: a current under sea. Rings of engraved water widening from one pearl; a violet band; reversible.
const { Card, Path, C, INK, clipPolyline, offsetPolyline } = require('../lib');
module.exports = function back() {
  const c = new Card({ name: 'Back', seed: 3 });
  c.raw(`<rect x="10" y="10" width="280" height="500" stroke="${INK}" stroke-width="1.1"/>`);
  c.raw(`<path d="M13.5 13.5H286.5V506.5H13.5ZM18.5 18.5V501.5H281.5V18.5Z" fill="${C.violet}" stroke="none" fill-rule="evenodd"/>`);
  c.raw(`<rect x="21" y="21" width="258" height="478" stroke="${INK}" stroke-width="0.55"/>`);
  const field = Path.rect(22, 22, 256, 476);
  const cx = 150, cy = 260;
  const medallion = Path.ellipse(cx, cy, 50, 76);
  const clipPolys = field.polys().concat(medallion.polys());
  // rings: ellipses widening outward, with a slow constant wobble so no two cross; thick and thin alternate
  const thick = [], thin = [];
  for (let r = 4; r < 520; r += 4.6) {
    const pts = []; for (let i = 0; i <= 140; i++) { const a = i / 140 * Math.PI * 2; const w = 1.6 * Math.sin(a * 6 + r * 0.05) + 1.0 * Math.sin(a * 2 + 1); pts.push([cx + Math.cos(a) * (r * 0.72 + w), cy + Math.sin(a) * (r + w)]); }
    (Math.round(r / 4.6) % 2 ? thin : thick).push(...clipPolyline(pts, clipPolys));
  }
  c.lines(thick, { sw: 0.5 }); c.lines(thin, { sw: 0.24 });
  // medallion: double ring; ground of fine diagonal cross-hatch; one pearl left bare
  c.draw(medallion, { sw: 1.1 }); c.draw(Path.ellipse(cx, cy, 46.5, 71.5), { sw: 0.4 });
  const inner = Path.ellipse(cx, cy, 45, 70); const pearl = Path.circle(cx, cy, 14);
  c.hatch(inner, { angle: 45, spacing: 1.5, sw: 0.32, holes: [Path.circle(cx, cy, 17)] });
  c.hatch(inner, { angle: -45, spacing: 1.5, sw: 0.32, holes: [Path.circle(cx, cy, 17)] });
  c.hatch(inner, { angle: 0, spacing: 3.0, sw: 0.24, holes: [Path.circle(cx, cy, 17)] });
  c.draw(pearl, { sw: 0.8 });
  c.draw(Path.arc(cx, cy, 11.5, Math.PI * 0.12, Math.PI * 0.98), { sw: 0.5 });
  c.draw(Path.arc(cx, cy, 8.8, Math.PI * 0.25, Math.PI * 0.9), { sw: 0.36 });
  c.draw(Path.arc(cx, cy, 6, Math.PI * 0.38, Math.PI * 0.8), { sw: 0.28 });
  // lozenges at the compass points, violet; corner squares
  for (const [x, y] of [[cx, cy - 92], [cx, cy + 92], [cx - 66, cy], [cx + 66, cy]]) c.fill(Path.poly([[x, y - 5.5], [x + 3.4, y], [x, y + 5.5], [x - 3.4, y]]), C.violet);
  for (const [x, y] of [[21, 21], [279, 21], [21, 499], [279, 499]]) c.raw(`<rect x="${x - 1.8}" y="${y - 1.8}" width="3.6" height="3.6" fill="${INK}" stroke="none"/>`);
  c.frameSVG = '';
  return c;
};
