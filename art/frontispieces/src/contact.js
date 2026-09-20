// node contact.js out.png mode file1.svg "caption1" file2.svg "caption2" ...
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
(async () => {
  const [,, out, mode, ...rest] = process.argv;
  const items = [];
  for (let i = 0; i < rest.length; i += 2) items.push({ svg: fs.readFileSync(rest[i], 'utf8'), cap: rest[i + 1] });
  const bg = mode === 'dark' ? '#1A1424' : '#F3EEE3';
  const ink = mode === 'dark' ? '#E6DCCB' : '#1B1917';
  const colW = 580, gap = 24, pad = 28;
  const cols = 2;
  const html = `<!doctype html><html><head><style>
    html,body{margin:0;padding:0;background:${bg};color:${ink};font-family:Georgia,'Times New Roman',serif;}
    .grid{display:grid;grid-template-columns:repeat(${cols},${colW}px);gap:${gap}px;padding:${pad}px;}
    .item svg{display:block;width:${colW}px;height:auto;}
    .cap{font-size:15px;letter-spacing:0.08em;text-transform:uppercase;margin:8px 0 0 2px;opacity:0.85}
  </style></head><body><div class="grid">${items.map(it => `<div class="item">${it.svg}<div class="cap">${it.cap}</div></div>`).join('')}</div></body></html>`;
  const rows = Math.ceil(items.length / cols);
  const width = pad * 2 + cols * colW + (cols - 1) * gap;
  const height = pad * 2 + rows * (Math.round(colW * 700 / 1200) + 40) + (rows - 1) * gap;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1.5 });
  await page.setContent(html);
  await page.screenshot({ path: out, fullPage: true });
  await browser.close();
  console.log('contact sheet', out, width + 'x' + height);
})();
