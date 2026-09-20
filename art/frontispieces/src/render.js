// Usage: node render.js in.svg out.png [width] [mode: light|dark] [clip: x,y,w,h in viewBox units] [scale]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
(async () => {
  const [,, inp, out, wArg, mode='light', clipArg, scaleArg] = process.argv;
  const width = parseInt(wArg || '1200', 10);
  const scale = parseFloat(scaleArg || '1');
  const svg = fs.readFileSync(inp, 'utf8');
  const m = svg.match(/viewBox="([\d.\-\s]+)"/);
  const vb = m ? m[1].trim().split(/\s+/).map(Number) : [0,0,1200,700];
  const height = Math.round(width * vb[3] / vb[2]);
  const bg = mode === 'dark' ? '#1A1424' : '#F3EEE3';
  const ink = mode === 'dark' ? '#E6DCCB' : '#1B1917';
  const html = `<!doctype html><html><head><style>
    html,body{margin:0;padding:0;background:${bg};color:${ink};}
    svg{display:block;width:${width}px;height:${height}px;}
  </style></head><body>${svg}</body></html>`;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: scale });
  await page.setContent(html);
  let clip;
  if (clipArg && clipArg !== '-') {
    const [cx, cy, cw, ch] = clipArg.split(',').map(Number);
    const k = width / vb[2];
    clip = { x: cx * k, y: cy * k, width: cw * k, height: ch * k };
  }
  await page.screenshot({ path: out, fullPage: false, clip });
  await browser.close();
  console.log('rendered', out, width+'x'+height, mode, clip ? JSON.stringify(clip) : '');
})();
