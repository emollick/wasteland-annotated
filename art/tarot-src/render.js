// Render SVG files to PNG with Chromium (light and dark), and build contact sheets.
// usage: node render.js out_dir scale mode(light|dark|both) file1.svg file2.svg ...
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
(async () => {
  const [outDir, scaleS, mode, ...files] = process.argv.slice(2);
  const scale = parseFloat(scaleS || '2');
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const modes = mode === 'both' ? ['light', 'dark'] : [mode || 'light'];
  for (const m of modes) {
    const bg = m === 'dark' ? '#1A1424' : '#F3EEE3';
    const ink = m === 'dark' ? '#E6DCCB' : '#1B1917';
    const page = await browser.newPage({ deviceScaleFactor: scale, viewport: { width: 400, height: 700 } });
    for (const f of files) {
      const svg = fs.readFileSync(f, 'utf8');
      const vb = (svg.match(/viewBox="([^"]+)"/) || [])[1] || '0 0 300 520';
      const [, , w, h] = vb.split(/\s+/).map(Number);
      const html = `<!doctype html><html><head><style>html,body{margin:0;background:${bg};color:${ink}}
        #w{display:inline-block;padding:20px;background:${bg}} svg{display:block;width:${w}px;height:${h}px}</style></head>
        <body><div id="w">${svg}</div></body></html>`;
      await page.setContent(html);
      const el = await page.$('#w');
      const name = path.basename(f, '.svg') + (m === 'dark' ? '-dark' : '') + '.png';
      await el.screenshot({ path: path.join(outDir, name), omitBackground: false });
      console.log('rendered', name);
    }
    await page.close();
  }
  await browser.close();
})();
