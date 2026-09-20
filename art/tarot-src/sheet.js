// Contact sheet: node sheet.js out.png cols scale mode file1.svg ... (cards laid out on paper, names beneath)
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
(async () => {
  const [out, colsS, scaleS, mode, ...files] = process.argv.slice(2);
  const cols = parseInt(colsS || '4'); const scale = parseFloat(scaleS || '2');
  const bg = mode === 'dark' ? '#1A1424' : '#F3EEE3'; const ink = mode === 'dark' ? '#E6DCCB' : '#1B1917';
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: scale, viewport: { width: 1600, height: 1200 } });
  const cells = files.map(f => `<div class="c">${fs.readFileSync(f, 'utf8')}</div>`).join('');
  const html = `<!doctype html><html><head><style>html,body{margin:0;background:${bg};color:${ink}}
   #g{display:grid;grid-template-columns:repeat(${cols},300px);gap:28px;padding:36px;width:max-content;background:${bg}}
   .c svg{display:block;width:300px;height:520px}</style></head><body><div id="g">${cells}</div></body></html>`;
  await page.setContent(html);
  const el = await page.$('#g');
  await el.screenshot({ path: out });
  console.log('sheet', out);
  await browser.close();
})();
