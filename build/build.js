// Build script for "The Waste Land, annotated". No dependencies.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data');
const RESEARCH = path.join(ROOT, 'research');
const SITE = path.join(ROOT, 'site');
const ART = '/mnt/project-files/art';

const read = f => fs.readFileSync(f, 'utf8');
const exists = f => { try { fs.accessSync(f); return true; } catch { return false; } };
const readJSON = (f, fallback) => exists(f) ? JSON.parse(read(f)) : fallback;
const esc = s => String(s).replace(/&(?!(amp|lt|gt|quot|#\d+);)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// ---------- record parser (key: value lines, multi-line "body:" until "---") ----------
function parseRecords(text, sep = '---') {
  const blocks = text.split(new RegExp(`^${sep}\\s*$`, 'm'));
  const out = [];
  for (const b of blocks) {
    if (!b.trim()) continue;
    const rec = {};
    const lines = b.split('\n');
    let key = null;
    for (const ln of lines) {
      const m = ln.match(/^([a-z][a-z0-9_-]*):\s?(.*)$/);
      if (m && !(key && ['body', 'note', 'passage', 'quote', 'trans', 'text', 'intro'].includes(key) && rec[key] && !/^[a-z]+:$/.test(ln) && ln.startsWith(' '))) {
        key = m[1];
        const v = m[2];
        if (key in rec) { rec[key] += '\n' + v; } else rec[key] = v;
      } else if (key) {
        rec[key] += '\n' + ln;
      }
    }
    for (const k of Object.keys(rec)) rec[k] = rec[k].trim();
    out.push(rec);
  }
  return out;
}
function paragraphs(s) {
  if (!s) return '';
  return s.split(/\n\s*\n/).map(p => `<p>${p.replace(/\n/g, ' ')}</p>`).join('');
}

// ---------- poem ----------
function parsePoem() {
  const txt = read(path.join(DATA, 'poem.txt'));
  const parts = [];
  let part = null, stanza = null, n = 0;
  const partNames = { 1: 'The Burial of the Dead', 2: 'A Game of Chess', 3: 'The Fire Sermon', 4: 'Death by Water', 5: 'What the Thunder Said' };
  const numerals = ['', 'I', 'II', 'III', 'IV', 'V'];
  for (const raw of txt.split('\n')) {
    if (raw.startsWith('## ')) {
      const num = parts.length + 1;
      part = { num, numeral: numerals[num], name: partNames[num], stanzas: [], first: n + 1 };
      parts.push(part); stanza = null; continue;
    }
    if (!part) continue;
    if (raw.trim() === '') { stanza = null; continue; }
    if (!stanza) { stanza = []; part.stanzas.push(stanza); }
    n += 1;
    const indent = raw.match(/^ */)[0].length;
    stanza.push({ n, text: raw.trim(), indent });
  }
  for (const p of parts) p.last = p.stanzas[p.stanzas.length - 1].slice(-1)[0].n;
  return parts;
}

// ---------- markup of a line with nested spans ----------
function markupLine(text, spans) {
  // spans: [{start,end,tag:'g'|'t'|'p', data:{}}], with fixed nesting order g > p > t
  const order = ['g', 'p', 't'];
  const chars = [...text];
  const at = chars.map(() => ({}));
  for (const s of spans) for (let i = s.start; i < s.end && i < chars.length; i++) at[i][s.tag] = s;
  let html = '';
  let open = []; // stack of spans by order index
  const openTag = s => {
    if (s.tag === 'g') return `<a class="g" href="#${s.data.id}" data-g="${s.data.id}" data-kind="${s.data.kind}">`;
    if (s.tag === 't') return `<span class="t" data-lang="${s.data.lang}" data-trans="${attr(s.data.trans || '')}">`;
    if (s.tag === 'p') return `<span class="pl" data-place="${s.data.id}">`;
  };
  const closeTag = s => (s.tag === 'g' ? '</a>' : '</span>');
  for (let i = 0; i <= chars.length; i++) {
    const cur = i < chars.length ? at[i] : {};
    // find first level where the span differs
    let lvl = 0;
    for (; lvl < order.length; lvl++) {
      const t = order[lvl];
      if (open[lvl] !== cur[t]) break;
    }
    // close from innermost down to lvl
    for (let k = open.length - 1; k >= lvl; k--) { if (open[k]) html += closeTag(open[k]); }
    open = open.slice(0, lvl);
    // open from lvl to innermost
    for (let k = lvl; k < order.length; k++) {
      const s = cur[order[k]];
      open[k] = s;
      if (s) html += openTag(s);
    }
    if (i < chars.length) html += esc(chars[i]);
  }
  return html;
}
function findAll(hay, needle) {
  const out = []; if (!needle) return out;
  let i = hay.indexOf(needle);
  while (i !== -1) { out.push(i); i = hay.indexOf(needle, i + needle.length); }
  return out;
}

// ---------- load everything ----------
const parts = parsePoem();
const allLines = parts.flatMap(p => p.stanzas.flat());
const lineByN = Object.fromEntries(allLines.map(l => [l.n, l]));
const notesData = readJSON(path.join(DATA, 'notes.json'));
const voicesData = readJSON(path.join(DATA, 'voices.json'));
const tonguesData = readJSON(path.join(DATA, 'tongues.json'));
const elements = readJSON(path.join(DATA, 'elements.json'));
const times = readJSON(path.join(DATA, 'times.json'));
const placeLines = readJSON(path.join(DATA, 'place-lines.json'));
const timeline = readJSON(path.join(DATA, 'timeline.json'));
const thames = readJSON(path.join(RESEARCH, 'thames.json'), null);
const images = readJSON(path.join(RESEARCH, 'images.json'), []);
const mediaRaw = readJSON(path.join(RESEARCH, "media.json"), []); const media = Array.isArray(mediaRaw) ? mediaRaw : (mediaRaw.items || []);
const sourceLinks = readJSON(path.join(RESEARCH, 'sources-links.json'), []);
const imgById = Object.fromEntries(images.map(i => [i.id, i]));
const linkById = {};
for (const l of sourceLinks) { if (l.verified) { (linkById[l.id] = linkById[l.id] || []).push(l); } }

const glosses = [1, 2, 3, 4, 5].flatMap(i => parseRecords(read(path.join(DATA, `glosses-${i}.txt`))));
for (const g of glosses) { g.line = +g.line; if (g.to) g.to = +g.to; g.body = paragraphs(g.body); }
const sources = parseRecords(read(path.join(DATA, 'sources.txt')));
for (const s of sources) { s.lines = (s.lines || '').split(',').map(x => +x.trim()).filter(x => !isNaN(x)); s.note = paragraphs(s.note); s.links = linkById[s.id] || []; }
const sourceById = Object.fromEntries(sources.map(s => [s.id, s]));
const waysRaw = read(path.join(DATA, 'ways.txt')).split(/^===\s*$/m).map(sec => parseRecords(sec));
const ways = waysRaw.map(recs => ({ part: +recs[0].part, title: recs[0].title, items: recs.slice(1) }));
const pathsRaw = read(path.join(DATA, 'paths.txt')).split(/^===\s*$/m).map(sec => parseRecords(sec));
const paths = pathsRaw.map(recs => ({ id: recs[0].id, title: recs[0].title, intro: recs[0].intro, stops: recs.slice(1).map(s => ({ line: +s.line, text: s.text })) }));
const drafts = parseRecords(read(path.join(DATA, 'drafts.txt')));
for (const d of drafts) { d.line = +d.line; d.part = +d.part; d.body = paragraphs(d.body); }

// voices per line
const voiceOf = {};
for (const [a, b, v] of voicesData.spans) for (let n = a; n <= b; n++) voiceOf[n] = v;
// elements per line
const elOf = {};
for (const k of ['water', 'dry', 'fire']) for (const n of elements[k]) elOf[n] = (elOf[n] ? elOf[n] + ' ' : '') + k;
// notes per line
const notesByLine = {};
for (const nt of notesData.notes) (notesByLine[nt.line] = notesByLine[nt.line] || []).push(nt);
// glosses per line
const glossByLine = {};
for (const g of glosses) if (g.line > 0) (glossByLine[g.line] = glossByLine[g.line] || []).push(g);
// places per line
const placeById = {};
if (thames) for (const p of [...thames.places, ...thames.wider]) placeById[p.id] = p;
const placeSpans = {}; // line -> [{id,text}]
const placeText = {
  'london-bridge': ['London Bridge'], 'king-william-street': ['King William Street'], 'st-mary-woolnoth': ['Saint Mary Woolnoth'],
  'cannon-street-station': ['Cannon Street Hotel'], 'strand': ['the Strand'], 'queen-victoria-street': ['Queen Victoria Street'],
  'lower-thames-street': ['Lower Thames Street'], 'st-magnus-the-martyr': ['Magnus Martyr'], 'greenwich-pier': ['Greenwich reach'],
  'isle-of-dogs': ['Isle of Dogs'], 'highbury': ['Highbury'], 'richmond-bridge': ['Richmond'], 'kew-bridge': ['Kew'], 'moorgate-station': ['Moorgate'],
  'margate': ['Margate Sands'], 'starnberger-see': ['Starnbergersee'], 'hofgarten-munich': ['Hofgarten'], 'lausanne-ouchy': ['Leman'],
  'smyrna-izmir': ['Smyrna'], 'carthage': ['Carthage'], 'mylae-milazzo': ['Mylae'], 'jerusalem': ['Jerusalem'], 'athens': ['Athens'],
  'alexandria': ['Alexandria'], 'vienna': ['Vienna'], 'thebes-greece': ['Thebes'], 'vilnius': ['Litauen'], 'bradford': ['Bradford'],
  'varanasi': ['Ganga'], 'himalaya': ['Himavant'], 'greenwich-palace': ['Elizabeth and Leicester']
};
for (const group of ['london', 'world']) for (const [id, info] of Object.entries(placeLines[group])) {
  for (const n of info.lines) {
    if (n === 0 || !lineByN[n]) continue;
    const words = placeText[id] || [info.label];
    for (const w of words) if (lineByN[n].text.includes(w)) { (placeSpans[n] = placeSpans[n] || []).push({ id, text: w, label: info.label }); break; }
  }
}
// tongues per line
const tongueByLine = {};
for (const t of tonguesData.spans) (tongueByLine[t.line] = tongueByLine[t.line] || []).push(t);

// ---------- render a line ----------
function renderLine(l, initial) {
  const spans = [];
  for (const g of glossByLine[l.n] || []) {
    if (!g.anchor) continue;
    const idx = l.text.indexOf(g.anchor);
    if (idx === -1) { console.warn(`gloss ${g.id}: anchor not found in line ${l.n}: "${g.anchor}"`); continue; }
    spans.push({ start: idx, end: idx + g.anchor.length, tag: 'g', data: g });
  }
  for (const t of tongueByLine[l.n] || []) {
    for (const idx of findAll(l.text, t.text)) spans.push({ start: idx, end: idx + t.text.length, tag: 't', data: t });
  }
  for (const p of placeSpans[l.n] || []) {
    const idx = l.text.indexOf(p.text);
    if (idx !== -1) spans.push({ start: idx, end: idx + p.text.length, tag: 'p', data: p });
  }
  const inner = markupLine(l.text, spans);
  const cls = ['line'];
  const hasNote = notesByLine[l.n] ? ' data-note="1"' : '';
  const el = elOf[l.n] ? ` data-el="${elOf[l.n]}"` : '';
  const caps = /^HURRY UP PLEASE/.test(l.text) || l.text === 'DA' ? ' caps' : '';
  const style = l.indent ? ` style="--indent:${l.indent}ch"` : '';
  const num = (l.n % 5 === 0) ? `<span class="num" aria-hidden="true">${l.n}</span>` : '';
  let txt = inner;
  if (initial) txt = inner.replace(/^((?:<[^>]+>)*)(\S)/, (m, tags, ch) => `${tags}<span class="drop" aria-hidden="true">${inlineSVG(initial, 'drop-svg')}</span><span class="drop-ch">${ch}</span>`);
  return `<p class="${cls.join(' ')}${caps}${initial ? ' first' : ''}" id="L${l.n}" data-n="${l.n}" data-voice="${voiceOf[l.n] || 'poem'}"${el}${hasNote}${style}>${num}<span class="txt">${txt}</span></p>`;
}

// ---------- art from the art threads (optional) ----------
function artFile(rel) { const f = path.join(ART, rel); return exists(f) ? read(f) : null; }
function stripSVG(svg) { return svg.replace(/<\?xml[^>]*>/, '').replace(/<!DOCTYPE[^>]*>/, '').replace(/<metadata>[\s\S]*?<\/metadata>/g, '').replace(/(\d)\s--(?=\d)/g, '$1 ').trim(); }
function inlineSVG(svg, cls) {
  if (!svg) return '';
  return stripSVG(svg).replace(/<svg/, `<svg class="${cls}" role="img"`);
}
const plates = {};
for (const k of ['title', 'part-1', 'part-2', 'part-3', 'part-4', 'part-5']) plates[k] = artFile(`frontispieces/${k}.svg`);
function aspectOf(svg) { const m = /viewBox="\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)"/.exec(svg || ''); return m ? `${m[1]} / ${m[2]}` : '3 / 2'; }
// nest a vignette or card inside another svg at a pin
function nestSVG(svg, x, y, size, cls) {
  if (!svg) return '';
  let t = stripSVG(svg);
  return t.replace(/<svg\b([^>]*)>/, (m, attrs) => { attrs = attrs.replace(/\s(width|height|x|y)="[^"]*"/g, ''); return `<svg${attrs} x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${size}" height="${size}" class="${cls}">`; });
}
const ornaments = {}; for (let i = 1; i <= 5; i++) ornaments[i] = artFile(`frontispieces/ornament-${i}.svg`) || artFile('frontispieces/ornament-plain.svg') || artFile('frontispieces/ornament.svg');
const tailpiece = artFile('frontispieces/tailpiece-shantih.svg') || artFile('frontispieces/tailpiece.svg') || artFile('frontispieces/shantih.svg');
const initials = {}; for (let i = 1; i <= 5; i++) initials[i] = artFile(`frontispieces/initial-${i}.svg`);
const mark = artFile('frontispieces/mark.svg'), markSmall = artFile('frontispieces/mark-small.svg');
const favicon = markSmall ? 'data:image/svg+xml,' + encodeURIComponent(stripSVG(markSmall).replace(/currentColor/g, '#1B1917').replace(/var\(--violet,\s*#4A3560\)/g, '#4A3560').replace(/var\(--gold,\s*#A8873A\)/g, '#A8873A')) : null;
const tarotDir = path.join(ART, 'tarot');
const tarotFiles = exists(tarotDir) ? fs.readdirSync(tarotDir).filter(f => f.endsWith('.svg')) : [];
// the artist's notes on each card, from the tarot thread's NOTES.md tables (file | numeral | what it shows | answers to)
const tarotNotes = {};
if (exists(path.join(tarotDir, 'NOTES.md'))) {
  const md = s => s.trim().replace(/\*([^*]+)\*/g, '<i>$1</i>').replace(/`([^`]+)`/g, '$1').replace(/\s*(?:No accent\.|Accent:[^.]*\.)\s*$/, '');
  for (const row of read(path.join(tarotDir, 'NOTES.md')).split('\n')) {
    const m = /^\|\s*`([a-z0-9-]+)\.svg`\s*\|\s*([^|]*)\|\s*([^|]*)\|\s*(.*?)\s*\|\s*$/.exec(row);
    if (m) tarotNotes[m[1]] = { shows: md(m[3]), answers: md(m[4]) };
  }
}
const vignDir = path.join(ART, 'vignettes');
const vignFiles = exists(vignDir) ? fs.readdirSync(vignDir).filter(f => f.endsWith('.svg')) : [];
// copy art into site/art
fs.mkdirSync(path.join(SITE, 'art'), { recursive: true });
for (const f of tarotFiles) fs.writeFileSync(path.join(SITE, 'art', 'tarot-' + f), stripSVG(fs.readFileSync(path.join(tarotDir, f), 'utf8')));
for (const f of vignFiles) fs.writeFileSync(path.join(SITE, 'art', 'vignette-' + f), stripSVG(fs.readFileSync(path.join(vignDir, f), 'utf8')));
for (const k of Object.keys(plates)) if (plates[k]) fs.writeFileSync(path.join(SITE, 'art', 'plate-' + k + '.svg'), stripSVG(plates[k]));

// ---------- the templates' prose (data/pages.txt) and the tools' own words (data/ui.txt) ----------
const P = Object.fromEntries(parseRecords(read(path.join(DATA, 'pages.txt'))).map(r => [r.id, r.text]));
function page(id) { if (!(id in P)) throw new Error(`data/pages.txt has no record "${id}"`); return P[id]; }
const U = Object.fromEntries(parseRecords(read(path.join(DATA, 'ui.txt'))).map(r => [r.id, r.text]));
{
  const usedUI = new Set([...read(path.join(SITE, 'js', 'poem.js')).matchAll(/\bui\('([a-z0-9-]+)'\)/g)].map(m => m[1]));
  for (const id of usedUI) if (!(id in U)) throw new Error(`data/ui.txt has no record "${id}", which site/js/poem.js uses`);
  for (const id of Object.keys(U)) if (!usedUI.has(id)) console.warn('ui.txt record not used by poem.js:', id);
  const usedP = new Set([...read(__filename).matchAll(/\bpage\('([a-z0-9-]+)'\)/g)].map(m => m[1]));
  for (const id of Object.keys(P)) if (!usedP.has(id)) console.warn('pages.txt record not used by the build:', id);
}

// ---------- page chrome ----------
const NAV = [['index.html', page('nav-poem')], ['map.html', page('nav-map')], ['listen.html', page('nav-listen')], ['drafts.html', page('nav-drafts')], ['library.html', page('nav-library')], ['paths.html', page('nav-paths')], ['about.html', page('nav-about')]];
function head(title, extra = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${page('meta-description')}">
<link rel="preload" href="fonts/eb-garamond-400-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/eb-garamond-400i-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/fonts.css">
<link rel="stylesheet" href="css/site.css">
<link rel="icon" href="${favicon || "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%231A1424'/><text x='16' y='23' font-family='Georgia,serif' font-size='20' text-anchor='middle' fill='%23E6DCCB'>W</text></svg>"}">
<script>try{var t=localStorage.getItem('wl-theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}</script>
${extra}
</head>`;
}
function runningHead(current) {
  return `<nav class="runhead" aria-label="${page('nav-aria')}"><a class="rh-title" href="index.html">${markSmall ? `<span class="rh-mark" aria-hidden="true">${inlineSVG(markSmall, 'rh-mark-svg')}</span>` : ''}${page('runhead-title')}</a><span class="rh-links">${NAV.map(([h, t]) => `<a href="${h}"${h === current ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</span><button class="theme" type="button" aria-label="${page('theme-label')}" title="${page('theme-title')}"><span class="theme-dot"></span></button></nav>`;
}
function foot() {
  return `<footer class="colophon">${mark ? `<div class="foot-mark" aria-hidden="true">${inlineSVG(mark, 'mark-svg')}</div>` : ''}<p>${page('colophon')}</p><p><a href="about.html">${page('colophon-link')}</a></p></footer>`;
}

// ---------- index.html ----------
function renderPoemPage() {
  let body = '';
  // title page
  body += `<header class="titlepage" id="top">
  <div class="fog" aria-hidden="true"></div>
  <div class="tp-inner">
    ${plates.title ? `<div class="plate plate-title">${inlineSVG(plates.title, 'plate-svg')}</div>` : ''}
    <p class="tp-epigraph" lang="la">${markupLine('Nam Sibyllam quidem Cumis ego ipse oculis meis vidi in ampulla pendere, et cum illi pueri dicerent: Σίβυλλα τί θέλεις; respondebat illa: ἀποθανεῖν θέλω.', (tongueByLine[0] || []).filter(t => t.lang !== 'it').flatMap(t => findAll('Nam Sibyllam quidem Cumis ego ipse oculis meis vidi in ampulla pendere, et cum illi pueri dicerent: Σίβυλλα τί θέλεις; respondebat illa: ἀποθανεῖν θέλω.', t.text).map(idx => ({ start: idx, end: idx + t.text.length, tag: 't', data: t }))))}<a class="g tp-g" href="#epigraph" data-g="epigraph" data-kind="echo" aria-label="${page('epigraph-mark')}">·</a></p>
    <h1 class="tp-title"><a class="g" href="#title" data-g="title" data-kind="gloss">The Waste Land</a></h1>
    <p class="tp-author">T. S. Eliot</p>
    <p class="tp-year">1922</p>
    <p class="tp-dedication"><i>For Ezra Pound</i><br><i><a class="g" href="#dedication" data-g="dedication" data-kind="echo"><span class="t" data-lang="it" data-trans="the better craftsman">il miglior fabbro</span></a></i></p>
    <p class="tp-sub">${page('tp-sub')}</p>
    <p class="tp-begin"><a href="#part-1">${page('tp-begin')}</a> <span class="tp-or">${page('tp-or')}</span> <a href="#L1" data-path="first">${page('tp-begin-path')}</a> <span class="tp-or">${page('tp-or')}</span> <a href="#L1" data-slow="1">${page('tp-begin-slow')}</a></p>
  </div>
</header>`;

  // reading bar (lenses)
  body += `<div class="readbar" id="readbar" role="toolbar" aria-label="${page('readbar-aria')}">
  <div class="rb-inner">
    <span class="rb-label">${page('rb-read')}</span>
    <div class="lenses" role="radiogroup">
      ${[['plain', page('lens-plain'), page('lens-plain-desc')], ['echoes', page('lens-echoes'), page('lens-echoes-desc')], ['notes', page('lens-notes'), page('lens-notes-desc')], ['voices', page('lens-voices'), page('lens-voices-desc')], ['tongues', page('lens-tongues'), page('lens-tongues-desc')], ['water', page('lens-water'), page('lens-water-desc')], ['places', page('lens-places'), page('lens-places-desc')], ['clock', page('lens-clock'), page('lens-clock-desc')], ['drafts', page('lens-drafts'), page('lens-drafts-desc')]].map(([k, t, d], i) => `<button type="button" class="lens" data-lens="${k}" role="radio" aria-checked="${k === 'echoes'}" title="${d}"><span class="key">${i + 1}</span>${t}</button>`).join('')}
    </div>
    <span class="rb-label rb-tools-label">${page('rb-do')}</span>
    <div class="tools">
      ${[['slow', page('tool-slow')], ['cards', page('tool-cards')], ['fragments', page('tool-fragments')], ['sortes', page('tool-sortes')], ['concordance', page('tool-concordance')], ['heart', page('tool-heart')], ['walk', page('tool-walk')]].map(([k, t]) => `<button type="button" class="tool" data-tool="${k}">${t}</button>`).join('')}
    </div>
  </div>
</div>`;

  body += `<div class="spine" id="spine" aria-hidden="true"></div>`;
  body += `<div class="page">`;
  body += `<main class="poem" id="poem">`;
  for (const p of parts) {
    const w = ways.find(x => x.part === p.num);
    body += `<section class="part" id="part-${p.num}" data-part="${p.num}">`;
    if (plates['part-' + p.num]) body += `<div class="plate" data-src="art/plate-part-${p.num}.svg" style="--ar:${aspectOf(plates['part-' + p.num])}" aria-hidden="true"></div>`;
    body += `<h2 class="part-title"><span class="numeral" aria-hidden="true">${p.numeral}</span><span class="part-name">${p.numeral}. ${p.name}</span></h2>`;
    if (w) body += `<div class="ways"><button type="button" class="ways-toggle" aria-expanded="false" data-part="${p.num}">${w.title}</button><div class="ways-panel" hidden><ol class="ways-list">${w.items.map(it => `<li class="way way-${it.kind}"><button type="button" class="way-title" ${it.lens ? `data-lens="${it.lens}"` : ''} ${it.path ? `data-path="${it.path}"` : ''} ${it.source ? `data-source="${it.source}"` : ''}>${it.title}</button><p>${it.body}</p></li>`).join('')}</ol></div></div>`;
    const orn = ornaments[p.num];
    body += p.stanzas.map((st, si) => `<div class="stanza">${st.map((l, li) => renderLine(l, si === 0 && li === 0 ? initials[p.num] : null)).join('\n')}</div>`).join(orn ? `<div class="orn">${inlineSVG(orn, 'orn-svg')}</div>` : '\n');
    body += `</section>`;
  }
  if (tailpiece) body += `<div class="tailpiece">${inlineSVG(tailpiece, 'tail-svg')}</div>`;
  // Eliot's notes as printed
  body += `<section class="notes-printed" id="notes"><h2 class="part-title small"><span class="part-name">${page('notes-title')}</span></h2>
  <p class="notes-about">${page('notes-about')}</p>
  <div class="notes-head">${notesData.headnote}</div>
  ${[1, 2, 3, 5].map(pn => `<h3 class="notes-part">${parts[pn - 1].numeral}. ${parts[pn - 1].name}</h3>${pn === 5 ? `<p class="note-item"><span class="note-body">${notesData.part5note}</span></p>` : ''}${notesData.notes.filter(nt => nt.line >= parts[pn - 1].first && nt.line <= parts[pn - 1].last).map(nt => `<p class="note-item" id="note-${nt.printed.replace(/[^0-9]/g, '')}"><a class="note-num" href="#L${nt.line}">${nt.printed}.</a> <span class="note-body">${nt.text}</span></p>`).join('')}`).join('')}
  </section>`;
  body += `</main><aside class="margin" id="margin" aria-label="${page('margin-aria')}"></aside></div>`;
  // overlays container
  body += `<div id="overlays"></div>`;
  body += foot();
  const data = {
    lines: allLines.map(l => ({ n: l.n, t: l.text, p: parts.find(p => l.n >= p.first && l.n <= p.last).num })),
    parts: parts.map(p => ({ num: p.num, numeral: p.numeral, name: p.name, first: p.first, last: p.last })),
    glosses: glosses.map(g => ({ id: g.id, line: g.line, to: g.to || null, kind: g.kind, title: g.title, quote: g.quote || '', trans: g.trans || '', body: g.body, source: g.source || null, image: g.image || null, lang: g.lang || null })),
    sources: Object.fromEntries(sources.map(s => [s.id, { id: s.id, title: s.title, author: s.author, date: s.date, lang: s.lang, kind: s.kind, what: s.what, lines: s.lines, passage: s.passage || '', trans: s.trans || '', note: s.note, links: s.links.map(l => ({ label: l.host ? `${l.work || s.title} at ${l.host}` : (l.work || s.title), url: l.url, note: l.deep_link_note || '' })) }])),
    notes: notesData.notes, headnote: notesData.headnote, part5note: notesData.part5note,
    voices: voicesData.voices, voiceOf, elements: { of: elOf, labels: elements.labels }, tongues: tonguesData.langs,
    times, paths, drafts: drafts.map(d => ({ id: d.id, part: d.part, line: d.line, title: d.title, body: d.body })),
    images: Object.fromEntries(images.map(i => [i.id, { local: i.local ? i.local.replace(/^site\//, '') : `img/${i.id}.jpg`, title: i.title, credit: i.credit, w: i.width, h: i.height }])),
    places: placeLines, placeXY: thames ? Object.fromEntries([...thames.places, ...thames.wider].map(p => [p.id, [p.lon, p.lat, p.name]])) : {},
    tarot: tarotFiles.map(f => 'art/tarot-' + f),
    tarotNotes,
    ui: U,
    tarotTitles: Object.fromEntries(tarotFiles.map(f => { const m = /<title>([^<]*)<\/title>/.exec(read(path.join(tarotDir, f))); return [f.replace(/\.svg$/, ''), m ? m[1].trim() : '']; })),
    media: media.filter(m => m.verified)
  };
  fs.writeFileSync(path.join(SITE, 'js', 'data.js'), 'window.WL = ' + JSON.stringify(data) + ';\n');
  const html = head(page('title-poem')) + `<body class="poem-page" data-lens="echoes">${runningHead('index.html')}${body}<script src="js/data.js"></script><script src="js/poem.js"></script></body></html>`;
  fs.writeFileSync(path.join(SITE, 'index.html'), html);
}

// ---------- map page ----------
function project(lon, lat, bbox, W, H) {
  const [lon0, lat0, lon1, lat1] = bbox;
  const k = Math.cos(((lat0 + lat1) / 2) * Math.PI / 180);
  const x = (lon - lon0) * k / ((lon1 - lon0) * k) * W;
  const y = (lat1 - lat) / (lat1 - lat0) * H;
  return [x, y];
}
function renderMapPage() {
  let london = '<p>Map data not available in this build.</p>';
  if (thames) {
    const bbox = [-0.335, 51.425, 0.105, 51.575];
    const W = 1200, H = Math.round(W * ((bbox[3] - bbox[1]) / ((bbox[2] - bbox[0]) * Math.cos(51.5 * Math.PI / 180))));
    const pts = thames.river.map(([lon, lat]) => project(lon, lat, bbox, W, H));
    const riverLbl = (() => { const t = project(-0.215, 51.47, bbox, W, H); let b = 0, bd = 1e9; pts.forEach((p, i) => { const d = Math.hypot(p[0] - t[0], p[1] - t[1]); if (d < bd) { bd = d; b = i; } }); return pts[b]; })();
    const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    placeLines.london['royal-barge'] = placeLines.london['royal-barge'] || { label: page('place-royal-barge'), lines: [279, 289] };
    placeLines.london['metropole'] = placeLines.london['metropole'] || { label: page('place-metropole'), lines: [214] };
    placeLines.london['gashouse'] = placeLines.london['gashouse'] || { label: page('place-gashouse'), lines: [187, 190] };
    const places = Object.entries(placeLines.london).map(([id, info]) => ({ id, ...info, xy: placeById[id] ? project(placeById[id].lon, placeById[id].lat, bbox, W, H) : null })).filter(p => p.xy);
    // vignettes drawn by the art thread, pinned per their NOTES.md anchors
    const vig = {}; for (const f of vignFiles) vig[f.replace('.svg', '')] = artFile('vignettes/' + f);
    const PIN = { 'st-mary-woolnoth': [100, 172], 'st-magnus-martyr': [100, 172], 'london-bridge': [100, 128], 'red-sailed-barge': [100, 141], 'margate-sands': [100, 166], 'cannon-street-hotel': [100, 172], 'lower-thames-street-bar': [100, 172], 'elizabeth-and-leicester': [100, 138], 'the-metropole': [100, 172], 'the-gashouse': [100, 141], 'richmond': [104, 160], 'highbury': [100, 166], 'kew': [100, 172] };
    const VIG_PLACE = { 'st-mary-woolnoth': 'st-mary-woolnoth', 'st-magnus-martyr': 'st-magnus-the-martyr', 'london-bridge': 'london-bridge', 'cannon-street-hotel': 'cannon-street-station', 'lower-thames-street-bar': 'lower-thames-street' };
    const MAIN_VIG = { 'richmond': 'richmond-bridge', 'kew': 'kew-bridge', 'highbury': 'highbury' };
    const LBL_DX = { 'hogarth-press': 46, 'greenwich-palace': 9 };
    const LBL_DY = { 'wiltons-music-hall': -8, 'isle-of-dogs': -6 };
    const CITY = new Set(['london-bridge', 'king-william-street', 'st-mary-woolnoth', 'lloyds-bank-lombard-street', 'cannon-street-station', 'lower-thames-street', 'st-magnus-the-martyr', 'billingsgate']);
    const LEFT_LBL = new Set(['strand', 'queen-victoria-street', 'kew-bridge', 'richmond-bridge']);
    function pinned(name, cx, cy, size, cls) { const p = PIN[name] || [100, 172]; const k = size / 200; return nestSVG(vig[name], cx - p[0] * k, cy - p[1] * k, size, cls); }
    // the City frame on the main map
    const cityBox = [-0.0965, 51.5062, -0.0785, 51.5148];
    const c0 = project(cityBox[0], cityBox[3], bbox, W, H), c1 = project(cityBox[2], cityBox[1], bbox, W, H);
    const cityFrame = `<a href="#city-map" class="frame-link"><rect class="frame" x="${(c0[0] - 6).toFixed(1)}" y="${(c0[1] - 6).toFixed(1)}" width="${(c1[0] - c0[0] + 12).toFixed(1)}" height="${(c1[1] - c0[1] + 12).toFixed(1)}" rx="2"/><text class="frame-lbl" x="${(c1[0] + 6).toFixed(1)}" y="${(c1[1] + 19).toFixed(1)}" text-anchor="end">${page('map-frame-label')}</text></a>`;
    // the barge on Greenwich Reach: the river point nearest Greenwich pier, nudged upstream
    let barge = '';
    if (vig['red-sailed-barge'] && placeById['greenwich-pier']) {
      const gp = project(placeById['greenwich-pier'].lon, placeById['greenwich-pier'].lat, bbox, W, H);
      let best = 0, bd = 1e9; pts.forEach((p, i) => { const d = Math.hypot(p[0] - gp[0], p[1] - gp[1]); if (d < bd) { bd = d; best = i; } });
      const bp = pts[Math.max(0, best - 7)];
      barge = `<g class="place vig" data-place="greenwich-pier" data-lines="266,275">${pinned('red-sailed-barge', bp[0], bp[1], 96, 'vig-svg')}</g>`;
    }
    // Elizabeth and Leicester: the poem names no reach, so the barge rides the open river above Westminster, heading down towards the white towers
    let elizabeth = '';
    if (vig['elizabeth-and-leicester']) {
      const tp = project(-0.135, 51.484, bbox, W, H);
      let best = 0, bd = 1e9; pts.forEach((p, i) => { const d = Math.hypot(p[0] - tp[0], p[1] - tp[1]); if (d < bd) { bd = d; best = i; } });
      const ep = pts[best];
      elizabeth = `<g class="place vig" data-place="royal-barge" data-lines="279,289">${pinned('elizabeth-and-leicester', ep[0], ep[1], 104, 'vig-svg')}</g>`;
    }
    // Richmond, Kew and Highbury drawn on the main map
    const mainVigs = Object.entries(MAIN_VIG).filter(([v, pid]) => vig[v] && placeById[pid]).map(([v, pid]) => { const [x, y] = project(placeById[pid].lon, placeById[pid].lat, bbox, W, H); const info = placeLines.london[pid] || { lines: [] }; return `<g class="place vig" data-place="${pid}" data-lines="${info.lines.join(',')}">${pinned(v, x, y, 96, 'vig-svg')}</g>`; }).join('');
    // Brighton and the gashouse, off the map or nowhere in particular: cartouches along the foot
    function cartouche(name, x0, label, sub, pid, lines) {
      if (!vig[name]) return '';
      const mx = x0 + 95, my = H - 46;
      return `<g class="place vig" data-place="${pid}" data-lines="${lines}"><rect class="cartouche" x="${x0}" y="${H - 168}" width="190" height="158" rx="3"/>${pinned(name, mx, my, 120, 'vig-svg')}<text class="cart-lbl" x="${mx}" y="${H - 28}">${label}</text><text class="cart-sub" x="${mx}" y="${H - 15}">${sub}</text></g>`;
    }
    const cartouches = cartouche('the-metropole', 560, page('map-metropole-label'), page('map-metropole-sub'), 'metropole', '214') + cartouche('the-gashouse', 340, page('map-gashouse-label'), page('map-gashouse-sub'), 'gashouse', '187,190');
    // Margate, off the map: a cartouche in the corner
    let margate = '';
    if (vig['margate-sands']) {
      const mx = W - 118, my = H - 46;
      margate = `<g class="place vig margate" data-place="margate" data-lines="300"><rect class="cartouche" x="${W - 200}" y="${H - 168}" width="190" height="158" rx="3"/>${pinned('margate-sands', mx, my, 120, 'vig-svg')}<text class="cart-lbl" x="${mx}" y="${H - 28}">${page('map-margate-label')}</text><text class="cart-sub" x="${mx}" y="${H - 15}">${page('map-margate-sub')}</text></g>`;
    }
    // the City inset
    let cityInset = '';
    {
      const cb = cityBox, CW = 1000, CH = Math.round(CW * ((cb[3] - cb[1]) / ((cb[2] - cb[0]) * Math.cos(51.51 * Math.PI / 180))));
      const cpts = thames.river.map(([lon, lat]) => project(lon, lat, cb, CW, CH));
      const cd = cpts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
      const cplaces = places.filter(p => CITY.has(p.id)).map(p => ({ ...p, xy: project(placeById[p.id].lon, placeById[p.id].lat, cb, CW, CH) }));
      const vigFor = {}; for (const [v, pid] of Object.entries(VIG_PLACE)) if (vig[v]) vigFor[pid] = v;
      cityInset = `<svg class="map city" viewBox="0 0 ${CW} ${CH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${page('map-city-aria')}">
      <rect width="${CW}" height="${CH}" class="map-bg"/>
      <rect width="${CW}" height="${CH}" filter="url(#paperish)" opacity="0.6"/>
      <path class="river-glow" d="${cd}"/><path class="river" d="${cd}"/>
      <text class="river-label" x="${CW - 300}" y="${CH - 24}">${page('map-river-label')}</text>
      ${cplaces.map(p => { const v = vigFor[p.id]; const [x, y] = p.xy; if (v) { return `<g class="place vig" data-place="${p.id}" data-lines="${p.lines.join(',')}"><circle r="12" class="halo" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}"/>${pinned(v, x, y, 150, 'vig-svg')}<text class="lbl" x="${x.toFixed(1)}" y="${(y + 22).toFixed(1)}">${esc(p.label)}</text><text class="lines" x="${x.toFixed(1)}" y="${(y + 35).toFixed(1)}">${p.lines.map(n => 'l. ' + n).join(', ')}</text></g>`; } const dy = p.id === 'lloyds-bank-lombard-street' ? 14 : p.id === 'billingsgate' ? 22 : 4; return `<g class="place" data-place="${p.id}" data-lines="${p.lines.join(',')}"${p.eliot ? ' data-eliot="1"' : ''} transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="4" class="dot"/><circle r="12" class="halo"/><text class="lbl" x="9" y="${dy}">${esc(p.label)}</text>${p.lines.length ? `<text class="lines" x="9" y="${dy + 14}">${p.lines.map(n => 'l. ' + n).join(', ')}</text>` : ''}</g>`; }).join('')}
    </svg>`;
      cityInset = `<h2 class="sub">${page('city-title')}</h2><p class="map-lede">${page('city-lede')}</p><div class="map-wrap city" id="city-map">${cityInset}</div>`;
    }
    london = `<svg class="map london" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${page('map-london-aria')}">
      <defs><filter id="paperish"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.06"/></feComponentTransfer></filter></defs>
      <rect width="${W}" height="${H}" class="map-bg"/>
      <rect width="${W}" height="${H}" filter="url(#paperish)" opacity="0.6"/>
      <path class="river-glow" d="${d}"/><path class="river" d="${d}"/>
      <text class="river-label" x="${riverLbl[0]}" y="${riverLbl[1] + 26}">${page('map-river-label')}</text>
      ${places.map(p => { const left = LEFT_LBL.has(p.id); const drawn = Object.values(MAIN_VIG).includes(p.id) && vig[Object.keys(MAIN_VIG).find(k => MAIN_VIG[k] === p.id)]; const dx = LBL_DX[p.id] || 9; const dy0 = LBL_DY[p.id] || 0; if (drawn) return `<g class="place under" data-place="${p.id}" data-lines="${p.lines.join(',')}" transform="translate(${p.xy[0].toFixed(1)} ${p.xy[1].toFixed(1)})"><circle r="12" class="halo"/><text class="lbl" x="0" y="20" text-anchor="middle">${esc(p.label)}</text>${p.lines.length ? `<text class="lines" x="0" y="33" text-anchor="middle">${p.lines.map(n => 'l. ' + n).join(', ')}</text>` : ''}</g>`; return `<g class="place${CITY.has(p.id) ? ' quiet' : ''}" data-place="${p.id}" data-lines="${p.lines.join(',')}"${p.eliot ? ' data-eliot="1"' : ''} transform="translate(${p.xy[0].toFixed(1)} ${p.xy[1].toFixed(1)})"><circle r="4" class="dot"/><circle r="12" class="halo"/><text class="lbl" x="${left ? -9 : dx}" y="${4 + dy0}"${left ? ' text-anchor="end"' : ''}>${esc(p.label)}</text>${p.lines.length ? `<text class="lines" x="${left ? -9 : dx}" y="${18 + dy0}"${left ? ' text-anchor="end"' : ''}>${p.lines.map(n => 'l. ' + n).join(', ')}</text>` : ''}</g>`; }).join('')}
      ${cityFrame}${barge}${elizabeth}${mainVigs}${cartouches}${margate}
    </svg>`;
    london += cityInset;
  }
  // world map
  let world = '';
  const ne = readJSON(path.join(RESEARCH, 'ne_land50.json'), null) || readJSON(path.join(RESEARCH, 'ne_land.json'), null);
  if (ne && thames) {
    const bbox = [-100, -45, 160, 72];
    const W = 1200, H = 540;
    const proj = (lon, lat) => [(lon - bbox[0]) / (bbox[2] - bbox[0]) * W, (bbox[3] - lat) / (bbox[3] - bbox[1]) * H];
    let land = '';
    for (const f of ne.features) {
      const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
      for (const poly of polys) for (const ring of poly) {
        if (ring.length < 20 && f.geometry.type === 'MultiPolygon') { /* keep small islands too */ }
        let dd = '';
        let last = null;
        for (const [lon, lat] of ring) {
          if (lon < bbox[0] - 5 || lon > bbox[2] + 5 || lat < bbox[1] - 5 || lat > bbox[3] + 5) { continue; }
          const [x, y] = proj(lon, lat);
          if (last && Math.abs(x - last[0]) < 1.2 && Math.abs(y - last[1]) < 1.2) continue;
          dd += (dd ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
          last = [x, y];
        }
        if (dd) land += dd + 'Z';
      }
    }
    const worldPlaces = Object.entries(placeLines.world).map(([id, info]) => ({ id, ...info, p: placeById[id] })).filter(p => p.p);
    // journey in poem order (by first line)
    const journey = worldPlaces.filter(p => p.lines.length && !p.eliot).map(p => ({ ...p, first: Math.min(...p.lines) })).sort((a, b) => a.first - b.first);
    const jd = journey.map((p, i) => { const [x, y] = proj(p.p.lon, p.p.lat); return (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1); }).join(' ');
    world = `<svg class="map world" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${page('map-world-aria')}">
      <rect width="${W}" height="${H}" class="map-bg"/>
      <path class="land" d="${land}"/>
      <path class="journey" d="${jd}"/>
      ${worldPlaces.map(p => { const [x, y] = proj(p.p.lon, p.p.lat); return `<g class="place${p.eliot ? ' eliot' : ''}" data-place="${p.id}" data-lines="${p.lines.join(',')}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="3.5" class="dot"/><circle r="11" class="halo"/><text class="lbl" x="7" y="4">${esc(p.label)}</text></g>`; }).join('')}
    </svg>`;
  }
  const html = head(page('title-map')) + `<body class="map-page">${runningHead('map.html')}
  <main class="prose wide">
    <h1 class="pagetitle">${page('map-title')}</h1>
    <p class="lede">${page('map-lede')}</p>
    <div class="map-wrap" id="london-map">${london}</div>
    <div class="map-legend" id="map-legend"><p class="small">${page('map-legend')}</p></div>
    <h2 class="sub">${page('world-title')}</h2>
    <p class="lede">${page('world-lede')}</p>
    <div class="map-wrap" id="world-map">${world}</div>
    <div class="map-card" id="map-card" hidden></div>
  </main>${foot()}<script src="js/data.js"></script><script src="js/map.js"></script></body></html>`;
  fs.writeFileSync(path.join(SITE, 'map.html'), html);
}

// ---------- library page ----------
function renderLibraryPage() {
  const kinds = {};
  for (const s of sources) (kinds[s.kind] = kinds[s.kind] || []).push(s);
  const order = ['poem', 'play', 'opera', 'scripture', 'novel', 'novella', 'prose', 'essay', 'anthropology', 'philosophy', 'history', 'memoir', 'birdbook', 'song'];
  const kindLabel = { poem: page('kind-poem'), play: page('kind-play'), opera: page('kind-opera'), scripture: page('kind-scripture'), novel: page('kind-novel'), novella: page('kind-novel'), prose: page('kind-prose'), essay: page('kind-essay'), anthropology: page('kind-anthropology'), philosophy: page('kind-philosophy'), history: page('kind-history'), memoir: page('kind-memoir'), birdbook: page('kind-birdbook'), song: page('kind-song') };
  let body = `<main class="prose wide library"><h1 class="pagetitle">${page('library-title')}</h1>
  <p class="lede">${page('library-lede')}</p>
  <p class="lib-index">${sources.map(s => `<a href="#src-${s.id}">${esc(s.author.split(',')[0])}</a>`).join(' <span class="dot">·</span> ')}</p>`;
  for (const k of order) {
    if (!kinds[k]) continue;
    body += `<h2 class="sub">${kindLabel[k]}</h2>`;
    for (const s of kinds[k]) {
      const img = s.id && Object.values(imgById).find(i => (i.sources || []).includes(s.id));
      body += `<article class="src" id="src-${s.id}">
        <header><h3>${s.title}</h3><p class="src-meta">${esc(s.author)} · ${esc(s.date)} · ${esc(s.lang)}</p><p class="src-what">${s.what}</p></header>
        ${s.passage ? `<blockquote class="passage" lang="${{ Latin: 'la', German: 'de', French: 'fr', Italian: 'it', Greek: 'grc', Sanskrit: 'sa' }[s.lang.split(/[ ,;]/)[0]] || 'en'}">${s.passage}</blockquote>` : ''}
        ${s.trans ? `<p class="trans">${s.trans}</p>` : ''}
        <div class="src-note">${s.note}</div>
        <p class="src-lines">${page('src-lines-label')} ${s.lines.map(n => n === 0 ? `<a href="index.html#top">${page('src-title-page')}</a>` : `<a href="index.html#L${n}">line ${n}</a>`).join(', ')}</p>
        ${s.links.length ? `<p class="src-links">${page('src-links-label')} ${s.links.map(l => `<a href="${attr(l.url)}" rel="noopener">${esc(l.label)}</a>`).join(' · ')}</p>` : ''}
      </article>`;
    }
  }
  body += `</main>`;
  fs.writeFileSync(path.join(SITE, 'library.html'), head(page('title-library')) + `<body class="library-page">${runningHead('library.html')}${body}${foot()}<script src="js/theme.js"></script></body></html>`);
}

// ---------- drafts page ----------
function renderDraftsPage() {
  let body = `<main class="prose drafts"><h1 class="pagetitle">${page('drafts-title')}</h1>
  <p class="lede">${page('drafts-lede')}</p>
  <p class="lede small">${page('drafts-lede-2')}</p>`;
  for (const d of drafts) {
    body += `<article class="draft-item" id="${d.id}"><h2 class="ts-title">${d.title}</h2>${d.line ? `<p class="ts-at"><a href="index.html#L${d.line}">at line ${d.line}</a></p>` : ''}${d.body}</article>`;
  }
  body += `<h2 class="sub">${page('pencil-title')}</h2><ul class="pound-list">
  <li>${page('pencil-1')}</li>
  <li>${page('pencil-2')}</li>
  <li>${page('pencil-3')}</li>
  <li>${page('pencil-4')}</li>
  <li>${page('pencil-5')}</li>
  <li>${page('pencil-6')}</li>
  <li>${page('pencil-7')}</li>
  <li>${page('pencil-8')}</li>
  </ul>
  <p class="small">${page('drafts-note')}</p></main>`;
  fs.writeFileSync(path.join(SITE, 'drafts.html'), head(page('title-drafts')) + `<body class="drafts-page">${runningHead('drafts.html')}${body}${foot()}<script src="js/theme.js"></script></body></html>`);
}

// ---------- listen page ----------
function renderListenPage() {
  const mediaById = {}; for (const m of media) mediaById[m.id] = m;
  const recs = parseRecords(read(path.join(DATA, 'listen.txt'))).filter(r => mediaById[r.id]);
  const groups = [['eliot', page('listen-eliot-title'), page('listen-eliot-lede')], ['readers', page('listen-readers-title'), page('listen-readers-lede')], ['music', page('listen-music-title'), page('listen-music-lede')], ['birds', page('listen-birds-title'), page('listen-birds-lede')], ['pages', page('listen-pages-title'), page('listen-pages-lede')]];
  const linkOf = (id, text) => { const m = mediaById[id]; return m ? `<a href="${attr(m.url)}" rel="noopener">${text}</a>` : text; };
  function fill(t, m) {
    t = t.replace(/\{link:([\w-]+)\|([^}]+)\}/g, (_, id, text) => linkOf(id, text));
    t = t.replace(/\{parts\}/g, () => m.parts ? Object.entries(m.parts).map(([k, u]) => `<a href="${attr(u)}" rel="noopener">${k}</a>`).join(' · ') : '');
    return t;
  }
  function embedFor(r, m) {
    const e = (r.embed || 'auto').trim();
    if (e === 'none') return '';
    let src = e !== 'auto' ? e : (m.embed_url || '');
    const url = m.url || '';
    if (e === 'auto' && !src) {
      const yt = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
      if (yt) src = `https://www.youtube-nocookie.com/embed/${yt[1]}`;
      else if (/soundcloud\.com\//.test(url)) src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%234a3560&auto_play=false&show_comments=false&show_user=true&visual=false`;
    }
    if (e === 'auto' && /soundcloud\.com\/player/.test(src) && !/color=/.test(src)) src += '&color=%234a3560&auto_play=false&show_comments=false&visual=false';
    if (!src) return '';
    const kind = /soundcloud/.test(src) ? 'sc' : /xeno-canto/.test(src) ? 'xc' : 'video';
    if (kind === 'xc' && !/simple=/.test(src)) src += '?simple=1';
    return `<details class="embed"><summary>${page('listen-play')}</summary><iframe loading="lazy" src="${attr(src)}" title="${attr(r.title)}" class="${kind}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></details>`;
  }
  let body = `<main class="prose wide listen"><h1 class="pagetitle">${page('listen-title')}</h1>
  <p class="lede">${page('listen-lede')}</p>`;
  for (const [k, title, lede] of groups) {
    const items = recs.filter(r => r.group === k);
    if (!items.length) continue;
    body += `<h2 class="sub">${title}</h2><p class="map-lede">${lede}</p><div class="records">`;
    for (const r of items) {
      const m = mediaById[r.id];
      const kind = k === 'birds' ? 'birdsong' : k === 'pages' ? 'scan' : k === 'music' ? 'music' : 'reading';
      const label = (r.who || '').split(/[,;]/)[0];
      body += `<article class="record" data-kind="${kind}" id="rec-${r.id}"><div class="disc" aria-hidden="true"><div class="label"><span class="who">${esc(label)}</span><span class="when">${esc(r.label || ((r.when || '').match(/\d{4}/) || [''])[0])}</span></div></div>
      <div class="rec-body"><h3>${r.title}</h3><p class="rec-who">${esc(r.who || '')}</p><p class="rec-meta">${esc(r.when || '')}</p><p>${fill(paragraphs(r.body || '').replace(/^<p>|<\/p>$/g, ''), m)}</p>
      ${embedFor(r, m)}
      <p class="rec-link"><a href="${attr(m.url)}" rel="noopener">${page('listen-open')} ${esc(r.host || m.host || 'source')}</a></p></div></article>`;
    }
    body += `</div>`;
  }
  body += `</main>`;
  fs.writeFileSync(path.join(SITE, 'listen.html'), head(page('title-listen')) + `<body class="listen-page">${runningHead('listen.html')}${body}${foot()}<script src="js/theme.js"></script></body></html>`);
}

// ---------- paths page ----------
function renderPathsPage() {
  let body = `<main class="prose paths"><h1 class="pagetitle">${page('paths-title')}</h1><p class="lede">${page('paths-lede')}</p><div class="path-list">`;
  for (const p of paths) body += `<a class="path-card" href="index.html#path=${p.id}"><h2>${p.title}</h2><p>${p.intro}</p><p class="stops">${p.stops.length} stops</p></a>`;
  body += `</div></main>`;
  fs.writeFileSync(path.join(SITE, 'paths.html'), head(page('title-paths')) + `<body class="paths-page">${runningHead('paths.html')}${body}${foot()}<script src="js/theme.js"></script></body></html>`);
}

// ---------- about page ----------
function renderAboutPage() {
  const credits = images.map(i => `<li><b>${esc(i.title || i.id)}.</b> ${esc(i.credit || '')}${i.commons_url ? ` <a href="${attr(i.commons_url)}" rel="noopener">Commons</a>` : ''}</li>`).join('');
  const body = `<main class="prose about"><h1 class="pagetitle">${page('about-title')}</h1>
  <h2 class="sub">${page('about-text-title')}</h2>
  <p>${page('about-text-1')}</p>
  <p>${page('about-text-2')}</p>
  <h2 class="sub" id="numbering">${page('about-numbering-title')}</h2>
  <p>${page('about-numbering')}</p>
  <h2 class="sub">${page('about-written-title')}</h2>
  <p>${page('about-written')}</p>
  <h2 class="sub">${page('about-voices-title')}</h2>
  <ul class="quotes">
  <li>${page('about-quote-1')}</li>
  <li>${page('about-quote-2')}</li>
  <li>${page('about-quote-3')}</li>
  <li>${page('about-quote-4')}</li>
  </ul>
  <h2 class="sub">${page('about-timeline-title')}</h2>
  <dl class="timeline">${timeline.map(t => `<dt>${esc(t.when)}</dt><dd>${esc(t.what)}</dd>`).join('')}</dl>
  <h2 class="sub">${page('about-how-title')}</h2>
  <p>${page('about-how-1')}</p>
  <p>${page('about-how-2')}</p>
  <h2 class="sub">${page('about-type-title')}</h2>
  <p>${page('about-type')}</p>
  <ul class="credits">${credits || '<li>' + page('about-credits-empty') + '</li>'}</ul>
  <h2 class="sub">${page('about-map-title')}</h2>
  <p>${page('about-map')}</p>
  </main>`;
  fs.writeFileSync(path.join(SITE, 'about.html'), head(page('title-about')) + `<body class="about-page">${runningHead('about.html')}${body}${foot()}<script src="js/theme.js"></script></body></html>`);
}

for (const g of glosses) if (g.image && !imgById[g.image]) console.warn('image not found for gloss', g.id, g.image);
renderPoemPage();
renderMapPage();
renderLibraryPage();
renderDraftsPage();
renderListenPage();
renderPathsPage();
renderAboutPage();
console.log(`built: ${allLines.length} lines, ${glosses.length} glosses, ${sources.length} sources, ${images.length} images, ${media.filter(m => m.verified).length} media, ${tarotFiles.length} tarot, ${vignFiles.length} vignettes, plates: ${Object.values(plates).filter(Boolean).length}`);
