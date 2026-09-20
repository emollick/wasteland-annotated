// Renders each SVG at map size (160px) and enlarged (640px), on bone and on night. Usage: node render.cjs outDir file.svg ...
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
(async () => {
  const [outDir, ...files] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  for (const file of files) {
    const svg = fs.readFileSync(file, 'utf8'); const name = path.basename(file, '.svg');
    const cell = (size, color, bg) => `<div style="width:${size}px;height:${size}px;color:${color};background:${bg};flex:none">${svg}</div>`;
    const html = `<html><head><style>body{margin:0;padding:16px;background:#F3EEE3;display:flex;align-items:flex-start;gap:16px}svg{width:100%;height:100%;display:block}</style></head><body>
      ${cell(160, '#1B1917', '#F3EEE3')}${cell(640, '#1B1917', '#F3EEE3')}${cell(160, '#E6DCCB', '#1A1424')}${cell(640, '#E6DCCB', '#1A1424')}</body></html>`;
    await page.setContent(html);
    await page.screenshot({ path: path.join(outDir, name + '.png'), fullPage: true });
    // separate map-size crop so it can be read at true scale
    await page.setViewportSize({ width: 720, height: 232 });
    await page.setContent(`<html><head><style>body{margin:0;padding:16px;background:#F3EEE3;display:flex;gap:16px}svg{width:100%;height:100%;display:block}</style></head><body>${cell(120, '#1B1917', '#F3EEE3')}${cell(160, '#1B1917', '#F3EEE3')}${cell(200, '#1B1917', '#F3EEE3')}${cell(160, '#E6DCCB', '#1A1424')}</body></html>`);
    await page.screenshot({ path: path.join(outDir, name + '-map.png') });
    await page.setViewportSize({ width: 1280, height: 720 });
  }
  await browser.close();
})();
