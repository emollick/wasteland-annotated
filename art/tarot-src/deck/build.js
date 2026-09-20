// node deck/build.js [names...]  -> writes SVGs to out/ and /mnt/project-files/art/tarot, renders PNGs
const fs = require('fs'), path = require('path'); const { execFileSync } = require('child_process');
const OUT = path.join(__dirname, '..', 'out'); const DEST = '/mnt/project-files/art/tarot';
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(DEST, { recursive: true });
const names = process.argv.slice(2);
const files = [];
for (const n of names) {
  const make = require(path.join(__dirname, 'cards', n + '.js'));
  const svg = make().svg();
  const f = path.join(OUT, n + '.svg'); fs.writeFileSync(f, svg); files.push(f); if (!process.env.NOPUBLISH) fs.writeFileSync(path.join(DEST, n + '.svg'), svg);
  console.log(n, (svg.length / 1024).toFixed(1) + ' KB');
}
if (!process.env.NORENDER) execFileSync('node', [path.join(__dirname, '..', 'render.js'), path.join(__dirname, '..', 'render'), process.env.SCALE || '2', process.env.MODE || 'light', ...files], { stdio: 'inherit', env: Object.assign({}, process.env, { NODE_PATH: '/opt/node22/lib/node_modules' }) });
