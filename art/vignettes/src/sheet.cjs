// Contact sheet: every SVG at 200px on bone, then on night. Usage: node sheet.cjs out.png title file.svg ...
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
(async () => {
  const [out, title, ...files] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 3*248+48, height: 900 } });
  const cells = (color, bg) => files.map(f => `<figure style="margin:0;width:224px;color:${color}"><div style="width:224px;height:224px">${fs.readFileSync(f,'utf8')}</div><figcaption style="font:12px/1.3 Georgia,serif;color:${color};opacity:.75;padding:4px 2px 0">${path.basename(f,'.svg').replace(/-/g,' ')}</figcaption></figure>`).join('');
  const html = `<html><head><style>body{margin:0;background:#F3EEE3}svg{width:100%;height:100%;display:block}.row{display:flex;flex-wrap:wrap;gap:24px;padding:24px 24px 8px;max-width:${3*248+24}px}h1{font:italic 20px Georgia,serif;margin:24px 24px 0;color:#1B1917}</style></head><body>
   <h1>${title}</h1><div class="row">${cells('#1B1917','#F3EEE3')}</div><div class="row" style="background:#1A1424">${cells('#E6DCCB','#1A1424')}</div></body></html>`;
  await page.setContent(html);
  await page.screenshot({ path: out, fullPage: true });
  await browser.close();
})();
