/* The Waste Land, annotated — poem page behaviour. Plain JS, no dependencies. */
(function () {
  'use strict';
  const D = window.WL;
  const ui = id => { const t = (D.ui || {})[id]; if (t === undefined) console.warn('no text in data/ui.txt for', id); return t === undefined ? id : t; }; // the tools' own words, edited in data/ui.txt
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const body = document.body;
  const poem = $('#poem');
  const margin = $('#margin');
  const lineEl = n => document.getElementById('L' + n);
  const glossById = Object.fromEntries(D.glosses.map(g => [g.id, g]));
  const wide = () => matchMedia('(min-width: 1140px)').matches;
  const wide3 = () => matchMedia('(min-width: 1280px)').matches; // room for a third column: the lens legends on the left, the notes on the right
  const legends = $('#legends');
  const chrome = () => document.documentElement.style.setProperty('--chrome-h', headerBottom() + 'px');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const partOf = n => D.parts.find(p => n >= p.first && n <= p.last);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const LENS_KEYS = ['plain', 'echoes', 'notes', 'voices', 'tongues', 'water', 'places', 'clock', 'drafts'];

  /* ---------- theme ---------- */
  const root = document.documentElement;
  const themeNow = () => root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'violet' : 'paper');
  $('.theme').addEventListener('click', () => { const t = themeNow() === 'violet' ? 'paper' : 'violet'; root.dataset.theme = t; try { localStorage.setItem('wl-theme', t); } catch (e) { } paintSpine(); });

  /* ---------- state ---------- */
  const state = { lens: 'echoes', open: [], walk: null, heart: 0, slow: null, follow: null };

  /* ---------- margin card layout ---------- */
  function relTop(el) { const a = el.getBoundingClientRect(), b = poem.getBoundingClientRect(); return a.top - b.top; }
  function layoutMargin() {
    if (!wide()) return;
    const cards = $$('.card', margin).map(c => ({ c, line: +c.dataset.line || 0, want: c.dataset.top ? +c.dataset.top : 0 }));
    cards.sort((a, b) => a.want - b.want || a.line - b.line);
    let bottom = 0;
    for (const k of cards) {
      const top = Math.max(k.want, bottom);
      k.c.style.top = top + 'px';
      bottom = top + k.c.offsetHeight + 12;
    }
    margin.style.minHeight = bottom + 'px';
  }
  let layoutTimer;
  const relayout = () => { clearTimeout(layoutTimer); layoutTimer = setTimeout(layoutMargin, 30); };
  chrome();
  let was3 = wide3();
  window.addEventListener('resize', () => { chrome(); if (wide3() !== was3) { was3 = wide3(); setLens(state.lens); } relayout(); paintSpine(); });

  function placeCard(card, anchorEl, sticky) {
    const n = +(anchorEl.closest('.line')?.dataset.n || 0);
    card.dataset.line = n;
    if (sticky && legends && wide3()) { card.dataset.sticky = '1'; legends.appendChild(card); return; } // a legend keeps to the left column, beside the reader, and leaves the right margin to the notes
    if (wide()) {
      card.dataset.top = Math.max(0, relTop(anchorEl.closest('.line') || anchorEl) - 4);
      if (sticky) card.dataset.sticky = '1';
      margin.appendChild(card);
      relayout();
    } else {
      card.classList.add('card-inline');
      const host = anchorEl.closest('.line') || anchorEl.closest('.part-title') || anchorEl.closest('.tp-epigraph') || anchorEl; // after the epigraph paragraph, not inside it: its lang="la" would set the font's Latin letterforms (u as v) on the card
      if (sticky) { card.dataset.sticky = '1'; const tag = host.previousElementSibling; (tag && tag.classList.contains('voice-tag') ? tag : host).insertAdjacentElement('beforebegin', card); } // a legend reads before the passage, not between two of its lines, and before the voice's tag when the line has one
      else host.insertAdjacentElement('afterend', card);
    }
  }
  function foldOthers(keep) {
    if (!wide()) return;
    for (const c of $$('.card', margin)) { if (c === keep || !['gloss', 'place', 'legend'].includes(c.dataset.ckind)) continue; c.classList.add('folded'); } // where there is no left column, an open note folds the legend to its title
    if (keep) keep.classList.remove('folded');
    relayout();
  }
  function clearCards(kind) {
    for (const c of $$('.card')) { if (!kind || c.dataset.ckind === kind) { if (!c.dataset.pin) c.remove(); } }
    for (const a of $$('.g.open')) if (!kind || kind === 'gloss') a.classList.remove('open');
    relayout();
  }

  /* ---------- gloss cards ---------- */
  function imageFig(id) {
    const im = D.images[id]; if (!im) return '';
    return `<figure class="card-img"><img loading="lazy" src="${esc(im.local)}" alt="${esc(im.title || '')}"><figcaption>${esc(im.title || '')}${im.credit ? '. ' + esc(im.credit) : ''}</figcaption></figure>`;
  }
  function sourceBlock(id) {
    const s = D.sources[id]; if (!s) return '';
    const links = (s.links || []).slice(0, 2).map(l => `<a href="${esc(l.url)}" rel="noopener">${esc(l.label)}</a>`).join('');
    return `<div class="card-src"><b>${esc(s.author)}</b>, <i>${s.title}</i>${s.date ? ' (' + esc(s.date) + ')' : ''}. <a href="library.html#src-${s.id}">${ui('in-library')}</a>${links ? `<div class="card-links">${ui('read-whole-label')} ${links}</div>` : ''}</div>`;
  }
  function glossCard(g) {
    const kindLabel = { echo: ui('kind-echo'), gloss: ui('kind-gloss'), place: ui('kind-place'), draft: ui('kind-draft'), voice: ui('kind-voice'), tongue: ui('kind-tongue'), sound: ui('kind-sound'), image: ui('kind-image') }[g.kind] || ui('kind-gloss');
    const lines = g.to && g.to !== g.line ? `lines ${g.line}–${g.to}` : (g.line ? `line ${g.line}` : '');
    const card = document.createElement('aside');
    card.className = `card kind-${g.kind}`;
    card.dataset.ckind = 'gloss'; card.dataset.g = g.id;
    card.innerHTML = `<button class="card-close" aria-label="${ui('close')}">×</button><span class="card-kind">${kindLabel}${lines ? ' · <span class="lines">' + lines + '</span>' : ''}</span><span class="card-title">${g.title}</span>${g.quote ? `<div class="card-quote"${g.lang ? ` lang="${{ German: 'de', French: 'fr', Italian: 'it', Latin: 'la', Greek: 'grc', Sanskrit: 'sa' }[g.lang] || ''}"` : ''}>${g.quote}</div>` : ''}${g.trans ? `<p class="card-trans">${g.trans}</p>` : ''}${g.cite ? `<p class="card-cite">${g.cite}</p>` : ''}${g.image ? imageFig(g.image) : ''}${g.plate ? `<div class="card-plate" data-svg="art/plate-${esc(g.plate)}.svg" aria-hidden="true"></div>` : ''}<div class="card-body">${g.body}</div>${g.cites || ''}${g.source ? sourceBlock(g.source) : ''}`;
    return card;
  }
  function openGloss(id, anchorEl, opts = {}) {
    const g = glossById[id]; if (!g) return;
    const existing = $(`.card[data-g="${id}"]`);
    if (existing && existing.classList.contains('folded')) { foldOthers(existing); return; }
    if (existing && !opts.keep) { existing.remove(); anchorEl && anchorEl.classList.remove('open'); relayout(); return; }
    if (existing) return;
    const card = glossCard(g);
    const a = anchorEl || $(`.g[data-g="${id}"]`);
    if (a) a.classList.add('open');
    placeCard(card, a || lineEl(g.line) || poem);
    foldOthers(card);
    if (wide() && a && a.closest('.titlepage')) setTimeout(() => card.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }), 80);
    $$('.card-plate[data-svg]', card).forEach(f => fetchSVG(f.dataset.svg).then(t => { if (t) { f.innerHTML = t; relayout(); } }));
    if (!wide() && opts.scroll !== false) card.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', e => {
    const folded = e.target.closest('.card.folded');
    if (folded && !e.target.closest('.card-close')) { foldOthers(folded); return; }
    const close = e.target.closest('.card-close');
    if (close) { const c = close.closest('.card'); const id = c.dataset.g; if (id) $$(`.g[data-g="${id}"]`).forEach(a => a.classList.remove('open')); c.remove(); relayout(); return; }
    const a = e.target.closest('a.g');
    if (a) { e.preventDefault(); openGloss(a.dataset.g, a); return; }
    const pl = e.target.closest('.pl');
    if (pl && state.lens === 'places') { e.preventDefault(); openPlace(pl.dataset.place, pl); return; }
    const t = e.target.closest('.t');
    if (t && state.lens === 'tongues') { toggleTrans(t); return; }
  });

  /* ---------- Eliot's notes lens ---------- */
  function noteCard(nt) {
    const card = document.createElement('aside');
    card.className = 'card kind-note'; card.dataset.ckind = 'note';
    const plain = nt.text.replace(/<[^>]+>/g, '');
    const long = plain.length > 170;
    card.innerHTML = `<span class="card-kind">${ui('note-kind')} <span class="lines">line ${nt.printed}</span></span><div class="card-body${long ? ' clamp' : ''}">${long ? `<p class="short">${esc(plain.slice(0, 150))}… <button class="more">${ui('note-more')}</button></p><div class="full" hidden>${nt.text}</div>` : nt.text}</div>`;
    card.addEventListener('click', e => { if (e.target.closest('.more') || (long && !e.target.closest('a'))) { const f = $('.full', card), s = $('.short', card); if (f && s) { f.hidden = !f.hidden; s.hidden = !f.hidden; relayout(); } } });
    return card;
  }
  function showNotes() {
    clearCards('note');
    const head = document.createElement('aside');
    head.className = 'card kind-note'; head.dataset.ckind = 'note';
    head.innerHTML = `<span class="card-kind">${ui('notes-head-title')}</span><div class="card-body"><p>${ui('notes-head-text')}</p></div>`;
    placeCard(head, legendAnchor(), true);
    for (const nt of D.notes) { const el = lineEl(nt.line); if (el) placeCard(noteCard(nt), el); }
  }

  /* ---------- legends ---------- */
  function legendAnchor() { return lineEl(state.lensAnchor || 1) || lineEl(1); }
  function showEchoes() { placeCard(legendCard(ui('legend-echoes'), `<p>${ui('legend-echoes-text')}</p>`, 'kind-echo'), legendAnchor(), true); }
  function legendCard(title, html, cls = '') {
    const card = document.createElement('aside');
    card.className = 'card ' + cls; card.dataset.ckind = 'legend';
    card.innerHTML = `<span class="card-kind">${title}</span><div class="card-body legend">${html}</div>`;
    return card;
  }
  function showVoices() {
    // tag the first line of each voice run
    let prev = null;
    for (const l of D.lines) {
      const v = D.voiceOf[l.n] || 'poem';
      const el = lineEl(l.n); if (!el) continue;
      const vc = D.voices[v] ? D.voices[v].color : '';
      el.style.setProperty('--vc', vc);
      if (v !== prev) {
        const tag = document.createElement('span'); tag.className = 'voice-tag'; tag.style.setProperty('--vc', vc); tag.textContent = D.voices[v] ? D.voices[v].label : v; tag.dataset.v = v; tag.title = ui('voice-tag-title');
        el.insertAdjacentElement('beforebegin', tag);
      }
      prev = v;
    }
    const counts = {};
    for (const l of D.lines) { const v = D.voiceOf[l.n] || 'poem'; counts[v] = (counts[v] || 0) + 1; }
    const html = `<p>${ui('legend-voices-text')}</p><p class="follow-note">${ui('voices-follow-hint')}</p><ul>${Object.entries(D.voices).map(([k, v]) => `<li data-v="${k}"><span class="sw" style="background:${v.color}"></span>${v.label}<span class="cnt">${counts[k] || 0}</span></li>`).join('')}</ul>`;
    const card = legendCard(ui('legend-voices'), html, 'kind-voice');
    card.addEventListener('click', e => { const li = e.target.closest('li[data-v]'); if (li) follow(li.dataset.v); });
    placeCard(card, legendAnchor(), true);
    if (state.follow) { const f = state.follow; state.follow = null; follow(f); }
  }
  function follow(v) {
    if (state.follow === v) v = null;
    state.follow = v;
    body.classList.toggle('follow', !!v);
    $$('.line').forEach(l => l.classList.toggle('v-on', !!v && (l.dataset.voice || 'poem') === v));
    $$('.voice-tag').forEach(t => t.classList.toggle('v-on', !!v && t.dataset.v === v));
    $$('.legend li[data-v]').forEach(li => li.classList.toggle('on', !!v && li.dataset.v === v));
    const note = $('.legend .follow-note'); if (note) note.textContent = v && D.voices[v] ? ui('voices-following').replace('{voice}', D.voices[v].label).replace('{n}', $$('.line.v-on').length) : ui('voices-follow-hint');
    $$('.legend li.voice-note').forEach(x => x.remove()); // the followed voice's note opens under its name in the list
    if (v && D.voices[v] && D.voices[v].note) { const li = $(`.legend li[data-v="${v}"]`); if (li) { const n = document.createElement('li'); n.className = 'voice-note'; n.innerHTML = `<p>${D.voices[v].note}</p>${D.voices[v].cites || ''}`; li.insertAdjacentElement('afterend', n); } }
    relayout();
    paintSpine();
  }
  document.addEventListener('click', e => { const t = e.target.closest('.voice-tag'); if (t && t.dataset.v) follow(t.dataset.v); });
  function hideVoices() { state.follow = null; body.classList.remove('follow'); $$('.v-on').forEach(x => x.classList.remove('v-on')); $$('.voice-tag').forEach(t => t.remove()); $$('.line').forEach(l => l.style.removeProperty('--vc')); }

  function toggleTrans(t) {
    const line = t.closest('.line') || t.closest('p');
    const ex = $(`.trans-line[data-for="${t.dataset.trans}"]`, line?.parentElement || document);
    if (ex) { ex.remove(); return; }
    const tl = document.createElement('span'); tl.className = 'trans-line'; tl.dataset.for = t.dataset.trans;
    const lang = D.tongues[t.dataset.lang]; tl.style.setProperty('--lang-color', lang ? lang.color : '');
    tl.innerHTML = `<b>${lang ? lang.label : t.dataset.lang}</b>${esc(t.dataset.trans)}`;
    if (line && line.classList.contains('line')) { tl.style.setProperty('--indent', line.style.getPropertyValue('--indent') || '0ch'); line.insertAdjacentElement('afterend', tl); }
    else t.insertAdjacentElement('afterend', tl);
  }
  function showTongues() {
    const counts = {};
    for (const t of $$('.t')) counts[t.dataset.lang] = (counts[t.dataset.lang] || 0) + 1;
    const html = `<p>${ui('legend-tongues-text')}</p><ul>${Object.entries(D.tongues).map(([k, v]) => `<li><span class="sw" style="background:${v.color}"></span>${v.label}<span class="cnt">${counts[k] || 0}</span></li>`).join('')}</ul>`;
    placeCard(legendCard(ui('legend-tongues'), html, 'kind-tongue'), legendAnchor(), true);
    // reveal all translations at once for the epigraph
  }
  function hideTongues() { $$('.trans-line').forEach(t => t.remove()); }

  function showWater() {
    const c = { water: 0, dry: 0, fire: 0 };
    for (const v of Object.values(D.elements.of)) for (const k of v.split(' ')) c[k]++;
    const total = D.lines.length;
    const html = `<p>${ui('legend-water-text')}</p><div class="gauge"><span style="width:${c.water / total * 100}%;background:var(--water)"></span><span style="width:${c.dry / total * 100}%;background:var(--dry)"></span><span style="width:${c.fire / total * 100}%;background:var(--fire)"></span></div><ul><li><span class="sw" style="background:var(--water)"></span>${D.elements.labels.water}<span class="cnt">${c.water} lines</span></li><li><span class="sw" style="background:var(--dry)"></span>${D.elements.labels.dry}<span class="cnt">${c.dry}</span></li><li><span class="sw" style="background:var(--fire)"></span>${D.elements.labels.fire}<span class="cnt">${c.fire}</span></li><li><span class="sw" style="background:var(--paper-3)"></span>${ui('water-neither')}<span class="cnt">${total - c.water - c.dry - c.fire}</span></li></ul><p class="lines">${ui('legend-water-note')}</p>`;
    placeCard(legendCard(ui('legend-water'), html), legendAnchor(), true);
  }

  /* ---------- places ---------- */
  function openPlace(id, anchorEl) {
    const info = D.places.london[id] || D.places.world[id]; if (!info) return;
    const ex = $(`.card[data-place="${id}"]`); if (ex) { ex.remove(); relayout(); return; }
    const card = document.createElement('aside'); card.className = 'card kind-place'; card.dataset.ckind = 'place'; card.dataset.place = id;
    const xy = D.placeXY[id];
    const lines = info.lines.filter(n => n > 0).map(n => `<a href="#L${n}">line ${n}</a>`).join(', ');
    card.innerHTML = `<button class="card-close" aria-label="${ui('close')}">×</button><span class="card-kind">${ui('kind-place')}</span><span class="card-title">${esc(info.label)}</span><div class="card-body"><p>${lines ? ui('place-named').replace('{lines}', lines) : ''}${xy ? ` <span class="lines">${xy[1].toFixed(3)}°, ${xy[0].toFixed(3)}°.</span>` : ''}</p><p><a href="map.html#${id}">${ui('place-map-link')}</a></p></div>`;
    placeCard(card, anchorEl);
    foldOthers(card);
  }
  function showPlaces() {
    const html = `<p>${ui('legend-places-text')}</p><p>${ui('legend-places-link')}</p>`;
    placeCard(legendCard(ui('legend-places'), html, 'kind-place'), legendAnchor(), true);
  }

  /* ---------- clock ---------- */
  function showClock() {
    for (const h of D.times.hours) { const el = lineEl(h.line); if (!el) continue; wrapPhrase(el, h.text, 'tm'); }
    for (const s of D.times.seasons) { const el = lineEl(s.line); if (!el) continue; wrapPhrase(el, s.text, 'tm'); }
    const R = 92, cx = 110, cy = 110;
    const pt = (hour, r) => { const a = (hour / 24) * Math.PI * 2 - Math.PI / 2; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
    let svg = `<svg class="clock" viewBox="0 0 220 220" aria-label="${ui('clock-aria')}">`;
    // night arc 18-6
    const [nx1, ny1] = pt(18, R), [nx2, ny2] = pt(6, R);
    svg += `<path class="night" d="M${cx} ${cy} L${nx1} ${ny1} A${R} ${R} 0 0 1 ${nx2} ${ny2} Z"/>`;
    svg += `<circle class="ring" cx="${cx}" cy="${cy}" r="${R}"/>`;
    for (let h = 0; h < 24; h++) { const [x1, y1] = pt(h, R), [x2, y2] = pt(h, R - (h % 6 ? 3 : 7)); svg += `<line class="tick" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; }
    for (const [h, l] of [[0, ui('clock-midnight')], [6, ui('clock-dawn')], [12, ui('clock-noon')], [18, ui('clock-dusk')]]) { const [x, y] = pt(h, R - 16); svg += `<text x="${x}" y="${y + 3}" text-anchor="middle">${l}</text>`; }
    const used = {};
    for (const h of D.times.hours) { const k = Math.round(h.hour * 2); used[k] = (used[k] || 0) + 1; const [x, y] = pt(h.hour, R - 28 - (used[k] - 1) * 9); svg += `<circle class="hour" cx="${x}" cy="${y}" r="3.2" data-line="${h.line}"><title>${esc(h.text)} (line ${h.line})</title></circle>`; }
    svg += `</svg>`;
    const seasonsList = D.times.seasons.map(s => `<li><a href="#L${s.line}">${esc(s.text)}</a><span class="cnt">l. ${s.line}</span></li>`).join('');
    const hoursList = D.times.hours.slice().sort((a, b) => a.hour - b.hour).map(h => `<li><a href="#L${h.line}">${esc(h.text)}</a><span class="cnt">l. ${h.line}</span></li>`).join('');
    const html = `<p>${ui('legend-clock-text')}</p>${svg}<p><b>${ui('clock-hours')}</b></p><ul>${hoursList}</ul><p><b>${ui('clock-seasons')}</b></p><ul>${seasonsList}</ul>`;
    const card = legendCard(ui('legend-clock'), html); placeCard(card, legendAnchor(), true);
    card.addEventListener('click', e => { const h = e.target.closest('.hour'); if (h) go(+h.dataset.line); });
  }
  function hideClock() { for (const w of $$('.tm')) w.replaceWith(...w.childNodes); }
  function wrapPhrase(el, phrase, cls) {
    const txt = $('.txt', el);
    const walker = document.createTreeWalker(txt, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const i = node.nodeValue.indexOf(phrase);
      if (i === -1) continue;
      const range = document.createRange(); range.setStart(node, i); range.setEnd(node, i + phrase.length);
      const span = document.createElement('span'); span.className = cls; range.surroundContents(span); return true;
    }
    return false;
  }

  /* ---------- drafts lens ---------- */
  function showDrafts() {
    for (const d of D.drafts) {
      const host = d.line ? lineEl(d.line) : $('#part-1 .part-title');
      if (!host) continue;
      const g = document.createElement('div'); g.className = 'ghost'; g.dataset.ghost = d.id;
      g.innerHTML = `<b>${esc(d.title)}</b>${d.body}${d.cites || ''}<p><a href="drafts.html#${d.id}">${ui('drafts-page-link')}</a></p>`;
      host.insertAdjacentElement('beforebegin', g);
    }
    const html = `<p>${ui('legend-drafts-text')}</p><p><a href="drafts.html">${ui('legend-drafts-link')}</a>.</p>`;
    placeCard(legendCard(ui('legend-drafts'), html, 'kind-draft'), legendAnchor(), true);
    relayout();
  }
  function hideDrafts() { $$('.ghost').forEach(g => g.remove()); }

  /* ---------- lens switching ---------- */
  function setLens(k, opts = {}) {
    if (!LENS_KEYS.includes(k)) return;
    const prev = state.lens;
    state.lensAnchor = opts.init ? 1 : nearestLine();
    state.lens = k; body.dataset.lens = k;
    $$('.lens').forEach(b => b.setAttribute('aria-checked', b.dataset.lens === k));
    // teardown
    hideVoices(); hideTongues(); hideClock(); hideDrafts();
    clearCards('note'); clearCards('legend'); clearCards('place');
    if (k === 'echoes') showEchoes();
    if (k === 'notes') showNotes();
    if (k === 'voices') showVoices();
    if (k === 'tongues') showTongues();
    if (k === 'water') showWater();
    if (k === 'places') showPlaces();
    if (k === 'clock') showClock();
    if (k === 'drafts') showDrafts();
    paintSpine();
    relayout();
    if (!opts.init && prev !== k && state.lensAnchor > 1) {
      const legend = !wide() && $('.card-inline[data-sticky]');
      if (legend) window.scrollTo({ top: legend.getBoundingClientRect().top + window.scrollY - headerBottom() - 16, behavior: reduce ? 'auto' : 'smooth' }); // the legend first, then the passage the reader was at
      else go(state.lensAnchor, false);
    }
    try { localStorage.setItem('wl-lens', k); } catch (e) { }
  }
  $$('.lens').forEach(b => b.addEventListener('click', () => setLens(b.dataset.lens)));

  /* ---------- spine ---------- */
  const spine = $('#spine');
  let spineRects = [];
  function buildSpine() {
    const N = D.lines.length;
    const H = 1000, W = 40;
    let s = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">`;
    const step = H / N;
    for (const l of D.lines) { s += `<rect class="sl" data-n="${l.n}" x="8" y="${((l.n - 1) * step).toFixed(2)}" width="24" height="${Math.max(0.8, step - 0.5).toFixed(2)}"/>`; }
    for (const p of D.parts) { s += `<line x1="0" x2="40" y1="${((p.first - 1) * step).toFixed(2)}" y2="${((p.first - 1) * step).toFixed(2)}" stroke="var(--ink-3)" stroke-width="1"/>`; }
    s += `<rect class="cursor" x="4" y="0" width="32" height="${(step * 20).toFixed(2)}"/></svg><span class="tip"></span>`;
    spine.innerHTML = s;
    spineRects = $$('.sl', spine);
    spine.addEventListener('click', e => { const r = e.target.closest('.sl'); if (r) go(+r.dataset.n); });
    spine.addEventListener('mousemove', e => { const r = e.target.closest('.sl'); if (!r) { spine.classList.remove('hover'); return; } const n = +r.dataset.n; const tip = $('.tip', spine); tip.textContent = n + '  ' + D.lines[n - 1].t.slice(0, 48); const rect = spine.getBoundingClientRect(); tip.style.top = (e.clientY - rect.top) + 'px'; spine.classList.add('hover'); });
    spine.addEventListener('mouseleave', () => spine.classList.remove('hover'));
  }
  function spineColor(n) {
    const k = state.lens;
    if (k === 'voices') { const v = D.voiceOf[n] || 'poem'; if (state.follow && v !== state.follow) return 'var(--rule-2)'; return D.voices[v] ? D.voices[v].color : ''; }
    if (k === 'water') { const e = D.elements.of[n]; if (!e) return 'var(--rule-2)'; return e.includes('fire') ? 'var(--fire)' : e.includes('water') ? 'var(--water)' : 'var(--dry)'; }
    if (k === 'notes') return D.notes.some(x => x.line === n) ? 'var(--gold)' : 'var(--rule-2)';
    if (k === 'echoes') return D.glosses.some(g => g.line === n) ? 'var(--violet)' : 'var(--rule-2)';
    if (k === 'tongues') { const el = lineEl(n); return el && $('.t', el) ? (D.tongues[$('.t', el).dataset.lang] || {}).color || 'var(--rule-2)' : 'var(--rule-2)'; }
    if (k === 'places') { const el = lineEl(n); return el && $('.pl', el) ? 'var(--river)' : 'var(--rule-2)'; }
    if (k === 'clock') return D.times.hours.some(h => h.line === n) || D.times.seasons.some(s => s.line === n) ? 'var(--gold)' : 'var(--rule-2)';
    if (k === 'drafts') return D.drafts.some(d => d.line === n) ? 'var(--rust)' : 'var(--rule-2)';
    return 'var(--rule-2)';
  }
  function paintSpine() { for (const r of spineRects) r.style.fill = spineColor(+r.dataset.n); }
  function updateCursor() {
    if (!spineRects.length) return;
    const mid = window.innerHeight * 0.35;
    let best = 1, bd = 1e9;
    for (const l of D.lines) { const el = lineEl(l.n); if (!el) continue; const d = Math.abs(el.getBoundingClientRect().top - mid); if (d < bd) { bd = d; best = l.n; } }
    const N = D.lines.length; const H = 1000; const step = H / N;
    const vis = Math.max(6, Math.round(window.innerHeight / (lineEl(1).offsetHeight || 30)));
    const c = $('.cursor', spine); c.setAttribute('y', ((best - 1) * step).toFixed(2)); c.setAttribute('height', (vis * step).toFixed(2));
    for (const r of spineRects) r.classList.toggle('on', +r.dataset.n >= best && +r.dataset.n < best + vis);
  }
  let ticking = false;
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(() => { updateCursor(); ticking = false; }); ticking = true; } }, { passive: true });

  /* ---------- navigation ---------- */
  function headerBottom() { const rb = $('.readbar'), rh = $('.runhead'); return (rb ? rb.getBoundingClientRect().height : 0) + (rh ? rh.getBoundingClientRect().height : 0); }
  function go(n, hi = true) {
    const el = lineEl(n); if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = wide() ? top - window.innerHeight * 0.3 : top - headerBottom() - 16;
    window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    if (hi) { $$('.line.hi').forEach(l => l.classList.remove('hi')); el.classList.add('hi'); setTimeout(() => el.classList.remove('hi'), 2600); }
  }
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#L"]');
    if (a && /^#L\d+$/.test(a.getAttribute('href'))) { e.preventDefault(); go(+a.getAttribute('href').slice(2)); history.replaceState(null, '', a.getAttribute('href')); }
  });

  /* ---------- ways panels ---------- */
  $$('.ways-toggle').forEach(b => b.addEventListener('click', () => { const p = b.nextElementSibling; const open = p.hidden; p.hidden = !open; b.setAttribute('aria-expanded', open); relayout(); }));
  $$('.way-title').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.path) { startWalk(b.dataset.path); return; }
    if (b.dataset.source) { window.location.href = 'library.html#src-' + b.dataset.source; return; }
    const l = b.dataset.lens;
    if (l === 'listen') { window.location.href = 'listen.html'; return; }
    if (['cards', 'fragments', 'sortes', 'concordance', 'heart', 'walk', 'slow'].includes(l)) { openTool(l); return; }
    if (l) { setLens(l); const part = b.closest('.part'); if (part) { const first = $('.line', part); first && go(+first.dataset.n, false); } }
  }));

  /* ---------- overlays ---------- */
  const overlays = $('#overlays');
  function overlay(title, sub, html, cls = '') {
    closeOverlay();
    const ov = document.createElement('div'); ov.className = 'ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
    ov.innerHTML = `<div class="ov-box ${cls}"><button class="ov-close" aria-label="${ui('close')}">×</button><h2 class="ov-title">${title}</h2>${sub ? `<p class="ov-sub">${sub}</p>` : ''}<div class="ov-body">${html}</div></div>`;
    ov.addEventListener('click', e => { if (e.target === ov || e.target.closest('.ov-close')) closeOverlay(); });
    overlays.appendChild(ov);
    body.style.overflow = 'hidden';
    return ov;
  }
  function closeOverlay() { overlays.innerHTML = ''; body.style.overflow = ''; $$('.tool.active').forEach(t => t.classList.remove('active')); }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeOverlay(); stopWalk(); stopSlow(); if (state.heart) stopHeart(); return; }
    if (e.target.matches('input, textarea')) return;
    if (state.slow && !e.metaKey && !e.ctrlKey && !e.altKey) {
      if (['ArrowDown', 'ArrowRight', ' ', 'j', 'n', 'Enter'].includes(e.key)) { e.preventDefault(); slowTo(state.slow.n + 1); return; }
      if (['ArrowUp', 'ArrowLeft', 'k', 'p'].includes(e.key)) { e.preventDefault(); slowTo(state.slow.n - 1); return; }
    }
    const i = parseInt(e.key, 10);
    if (i >= 1 && i <= LENS_KEYS.length && !e.metaKey && !e.ctrlKey && !e.altKey) setLens(LENS_KEYS[i - 1]);
  });

  /* ---------- the cards (tarot) ---------- */
  const TAROT = [
    { id: 'phoenician-sailor', deck: ui('tarot-phoenician-sailor-deck'), name: ui('tarot-phoenician-sailor-name'), num: '·', img: null, note: ui('tarot-phoenician-sailor-note'), line: 47 },
    { id: 'belladonna', deck: ui('tarot-belladonna-deck'), name: ui('tarot-belladonna-name'), num: '·', img: null, note: ui('tarot-belladonna-note'), line: 49 },
    { id: 'three-staves', deck: ui('tarot-three-staves-deck'), name: ui('tarot-three-staves-name'), num: 'III', img: 'tarot-three-of-wands', note: ui('tarot-three-staves-note'), line: 51 },
    { id: 'wheel', deck: ui('tarot-wheel-deck'), name: ui('tarot-wheel-name'), num: 'X', img: 'tarot-wheel', note: ui('tarot-wheel-note'), line: 51 },
    { id: 'one-eyed-merchant', deck: ui('tarot-one-eyed-merchant-deck'), name: ui('tarot-one-eyed-merchant-name'), num: '·', img: null, note: ui('tarot-one-eyed-merchant-note'), line: 52 },
    { id: 'blank', deck: ui('tarot-blank-deck'), name: ui('tarot-blank-name'), num: '', img: null, note: ui('tarot-blank-note'), line: 53 },
    { id: 'hanged-man', deck: ui('tarot-hanged-man-deck'), name: ui('tarot-hanged-man-name'), num: 'XII', img: 'tarot-hanged-man', note: ui('tarot-hanged-man-note'), line: 55 },
    { id: 'crowd-in-a-ring', deck: ui('tarot-crowd-in-a-ring-deck'), name: ui('tarot-crowd-in-a-ring-name'), num: '·', img: null, note: ui('tarot-crowd-in-a-ring-note'), line: 56 }
  ];
  const PACK = [
    { id: 'sibyl', name: ui('pack-sibyl'), line: 0 }, { id: 'marie', name: ui('pack-marie'), line: 15 }, { id: 'hyacinth-girl', name: ui('pack-hyacinth-girl'), line: 36 }, { id: 'madame-sosostris', name: ui('pack-madame-sosostris'), line: 43 },
    { id: 'crowd-on-london-bridge', name: ui('pack-crowd-on-london-bridge'), line: 60 }, { id: 'stetson', name: ui('pack-stetson'), line: 69 }, { id: 'lady-in-the-chair', name: ui('pack-lady-in-the-chair'), line: 77 }, { id: 'philomel', name: ui('pack-philomel'), line: 99 },
    { id: 'bad-nerves', name: ui('pack-bad-nerves'), line: 111 }, { id: 'closing-time', name: ui('pack-closing-time'), line: 139 }, { id: 'fisher-king', name: ui('pack-fisher-king'), line: 189 }, { id: 'eugenides', name: ui('pack-eugenides'), line: 209 },
    { id: 'tiresias', name: ui('pack-tiresias'), line: 218 }, { id: 'typist', name: ui('pack-typist'), line: 222 }, { id: 'magnus-martyr', name: ui('pack-magnus-martyr'), line: 264 }, { id: 'thames-daughters', name: ui('pack-thames-daughters'), line: 266 },
    { id: 'elizabeth-and-leicester', name: ui('pack-elizabeth-and-leicester'), line: 279 }, { id: 'phlebas', name: ui('pack-phlebas'), line: 312 }, { id: 'road-with-no-water', name: ui('pack-road-with-no-water'), line: 331 }, { id: 'the-third', name: ui('pack-the-third'), line: 360 },
    { id: 'falling-towers', name: ui('pack-falling-towers'), line: 367 }, { id: 'bats-with-baby-faces', name: ui('pack-bats-with-baby-faces'), line: 378 }, { id: 'empty-chapel', name: ui('pack-empty-chapel'), line: 386 }, { id: 'thunder', name: ui('pack-thunder'), line: 401 },
    { id: 'london-bridge-falling', name: ui('pack-london-bridge-falling'), line: 427 }, { id: 'swallow', name: ui('pack-swallow'), line: 429 }, { id: 'tower', name: ui('pack-tower'), line: 430 }
  ];
  // cards the art thread adds after this list was written still join the pack, named from the file's own title
  const packIds = () => { const known = new Set(PACK.map(c => c.id).concat(TAROT.map(c => c.id), ['back', 'blank'])); const extra = D.tarot.map(f => f.replace(/^.*tarot-/, '').replace(/\.svg$/, '')).filter(id => !known.has(id)).map(id => ({ id, name: (D.tarotTitles || {})[id] || id.replace(/-/g, ' '), line: 0 })); return PACK.concat(extra); };
  function tarotSVGFor(id) { const f = D.tarot.find(f => f.endsWith('tarot-' + id + '.svg')); return f || null; }
  const svgCache = {};
  function fetchSVG(url) { if (!svgCache[url]) svgCache[url] = fetch(url).then(r => r.ok ? r.text() : '').then(t => t.replace(/<\?xml[^>]*>/, '').replace(/<!DOCTYPE[^>]*>/, '')).catch(() => ''); return svgCache[url]; }
  function showCards() {
    const backArt = tarotSVGFor('back');
    const cards = TAROT.map((c, i) => {
      const art = tarotSVGFor(c.id);
      const front = art ? '' : (c.img && D.images[c.img] ? `<img src="${esc(D.images[c.img].local)}" alt="${esc(c.name)}">` : `<div><span class="cnum">${c.num}</span><span class="cname">${c.name}</span></div>`);
      return `<div class="tcard" data-i="${i}" tabindex="0" role="button" aria-label="${esc(c.name)}"><div class="face back${backArt ? ' drawn' : ''}"${backArt ? ` data-svg="${backArt}"` : ''}></div><div class="face front${art ? ' drawn' : ''}"${art ? ` data-svg="${art}"` : ''}>${front}</div></div>`;
    }).join('');
    const rest = packIds().filter(c => tarotSVGFor(c.id));
    const pack = rest.length ? `<h3 class="ov-sub">${ui('pack-title')}</h3><p class="small">${ui('pack-intro')}</p><div class="tarot-note pack-note"></div><div class="table pack">${rest.map(c => `<a class="tcard pack-card" data-id="${c.id}" href="#L${c.line || 1}" aria-label="${esc(c.name)}" title="${esc(c.name)}"><div class="face front drawn" data-svg="${tarotSVGFor(c.id)}"></div></a>`).join('')}</div>` : '';
    const ov = overlay(ui('cards-title'), ui('cards-sub'), `<div class="table">${cards}</div><div class="tarot-note"><p class="small">${ui('tarot-turn')}${D.tarot.length ? '' : ' ' + ui('tarot-no-deck')}</p></div>${pack}`);
    $$('.face[data-svg]', ov).forEach(f => fetchSVG(f.dataset.svg).then(t => { if (t) f.innerHTML = t; }));
    ov.addEventListener('click', e => {
      const a = e.target.closest('.pack-card'); if (!a) return;
      e.preventDefault();
      const c = packIds().find(x => x.id === a.dataset.id); if (!c) return;
      if (a.classList.contains('chosen')) { closeOverlay(); go(c.line || 1); return; }
      $$('.pack-card.chosen', ov).forEach(x => x.classList.remove('chosen')); a.classList.add('chosen');
      const note = (D.tarotNotes || {})[c.id]; const pn = $('.pack-note', ov); if (!pn) return;
      pn.innerHTML = `<p><b>${esc(c.name)}.</b> ${note ? note.shows : ''}</p>${note && note.answers ? `<p class="small">${note.answers}</p>` : ''}<p>${ui('pack-go').replace('{link}', `<a href="#L${c.line || 1}" class="tl">${c.line ? ui('goto-line').replace('{n}', c.line) : ui('goto-epigraph')}</a>`)}</p>`;
      pn.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    });
    ov.addEventListener('click', e => { const t = e.target.closest('.tcard'); if (!t || t.classList.contains('pack-card')) return; const c = TAROT[+t.dataset.i]; t.classList.add('flipped'); $$('.tcard.chosen', ov).forEach(x => x.classList.remove('chosen')); t.classList.add('chosen'); $('.tarot-note', ov).innerHTML = `<p><b>${c.name}.</b></p>${c.note}${c.deck && tarotSVGFor(c.id) ? `<p class="small">${c.deck}</p>` : ''}<p><a href="#L${c.line}" class="tl">${ui('goto-line').replace('{n}', c.line)}</a></p>`; });
    ov.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.classList.contains('tcard')) e.target.click(); });
    ov.addEventListener('click', e => { const a = e.target.closest('a.tl'); if (a) { e.preventDefault(); closeOverlay(); go(+a.getAttribute('href').slice(2) || 1); } });
  }

  /* ---------- fragments ---------- */
  const FRAGS = [
    { n: 427, src: 'london-bridge', lang: ui('frag-427') },
    { n: 428, src: 'dante-purg26', lang: ui('frag-428') },
    { n: 429, src: 'pervigilium-veneris', lang: ui('frag-429') },
    { n: 430, src: 'nerval-desdichado', lang: ui('frag-430') },
    { n: 431, src: null, lang: ui('frag-431') },
    { n: 432, src: 'kyd-spanish-tragedy', lang: ui('frag-432') },
    { n: 433, src: 'brihadaranyaka', lang: ui('frag-433') },
    { n: 434, src: 'brihadaranyaka', lang: ui('frag-434') }
  ];
  function showFragments() {
    const html = `<ul class="frags">${FRAGS.map(f => { const s = f.src ? D.sources[f.src] : null; const g = glossById.fragments; return `<li class="frag" data-n="${f.n}"><div class="fline">${esc(D.lines[f.n - 1].t)}<span class="flang">${f.lang}</span></div><div class="fbody">${s ? `<div class="fsrc">${esc(s.author)}, <i>${s.title}</i>, ${esc(s.date)}</div>${s.passage ? `<div class="card-quote">${s.passage}</div>` : ''}${s.trans ? `<p class="card-trans">${s.trans}</p>` : ''}<p>${s.what}</p><p class="card-links"><a href="library.html#src-${s.id}">${ui('in-library')}</a>${(s.links || []).slice(0, 1).map(l => `<a href="${esc(l.url)}" rel="noopener">${ui('read-whole-link')}</a>`).join('')}</p>` : `<p>${ui('frag-own-line')}</p>`}</div></li>`; }).join('')}</ul>`;
    const ov = overlay(ui('fragments-title'), ui('fragments-sub'), html);
    ov.addEventListener('click', e => { const f = e.target.closest('.frag'); if (f && !e.target.closest('a')) f.classList.toggle('open'); });
  }

  /* ---------- sortes ---------- */
  function showSortes() {
    const draw = () => {
      const l = D.lines[Math.floor(Math.random() * D.lines.length)];
      const p = partOf(l.n);
      const gs = D.glosses.filter(g => g.line <= l.n && (g.to || g.line) >= l.n && g.line > 0);
      const g = gs[0];
      return `<div class="sortes"><p class="from">Line ${l.n} · ${p.numeral}. ${p.name}</p><p class="drawn">${esc(l.t)}</p>${g ? `<div class="gl card kind-${g.kind}"><span class="card-kind">${g.kind === 'echo' ? ui('kind-echo') : ui('kind-gloss')}</span><span class="card-title">${g.title}</span>${g.quote ? `<div class="card-quote">${g.quote}</div>` : ''}${g.trans ? `<p class="card-trans">${g.trans}</p>` : ''}${g.cite ? `<p class="card-cite">${g.cite}</p>` : ''}<div class="card-body">${g.body.split('</p>')[0]}</p></div></div>` : `<p class="small">${ui('sortes-none')}</p>`}<p><a href="#L${l.n}" class="tl">${ui('sortes-goto')}</a></p><button class="again">${ui('sortes-again')}</button></div>`;
    };
    const ov = overlay(ui('sortes-title'), ui('sortes-sub'), draw());
    ov.addEventListener('click', e => { if (e.target.closest('.again')) { $('.ov-body', ov).innerHTML = draw(); } const a = e.target.closest('a.tl'); if (a) { e.preventDefault(); closeOverlay(); go(+a.getAttribute('href').slice(2)); } });
  }

  /* ---------- concordance ---------- */
  const STOP = new Set('the a an and of to in i you he she it we they is are was were be been that this these those with for on at by from as but or not no nor so if then than there here where when who whom which what my your his her its our their me him them us do did does have has had shall will would can could may said says one out up down over under into upon only all any each much more most some such very too now still yet again once ever never'.split(' '));
  function showConcordance() {
    const freq = {};
    for (const l of D.lines) for (const w of l.t.toLowerCase().replace(/[^a-zà-ÿ’'\- ]/g, ' ').split(/\s+/)) { const x = w.replace(/^['’\-]+|['’\-]+$/g, ''); if (x.length > 2 && !STOP.has(x)) freq[x] = (freq[x] || 0) + 1; }
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 60);
    const ov = overlay(ui('conc-title'), ui('conc-sub'), `<div class="conc"><input type="search" placeholder="${ui('conc-placeholder')}" autocomplete="off" spellcheck="false"><ul class="hits"></ul><div class="vocab">${top.map(([w, c]) => `<button data-w="${esc(w)}">${esc(w)}<span class="f">${c}</span></button>`).join('')}</div></div>`);
    const input = $('input', ov), hits = $('.hits', ov);
    const run = q => {
      q = q.trim().toLowerCase(); hits.innerHTML = '';
      if (q.length < 2) return;
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const out = [];
      for (const l of D.lines) { if (l.t.toLowerCase().includes(q)) out.push(`<li><a href="#L${l.n}" class="tl"><span class="n">${l.n}</span>${esc(l.t).replace(re, m => `<mark>${m}</mark>`)}</a></li>`); }
      hits.innerHTML = out.join('') || '<li class="small">' + ui('conc-none') + '</li>';
    };
    input.addEventListener('input', () => run(input.value));
    ov.addEventListener('click', e => { const b = e.target.closest('button[data-w]'); if (b) { input.value = b.dataset.w; run(b.dataset.w); } const a = e.target.closest('a.tl'); if (a) { e.preventDefault(); closeOverlay(); go(+a.getAttribute('href').slice(2)); } });
    setTimeout(() => input.focus(), 50);
  }

  /* ---------- by heart ---------- */
  function startHeart() {
    if (state.heart) return;
    state.heart = 1; body.classList.add('heart');
    for (const l of $$('.line .txt')) wrapWords(l);
    applyHeart();
    const bar = document.createElement('div'); bar.className = 'heart-bar'; bar.id = 'heartbar';
    bar.innerHTML = `<span>${ui('heart-title')}</span><button data-lv="1">${ui('heart-lv1')}</button><button data-lv="2">${ui('heart-lv2')}</button><button data-lv="3">${ui('heart-lv3')}</button><button data-lv="0">${ui('heart-lv0')}</button><button class="x">${ui('heart-done')}</button>`;
    bar.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; if (b.classList.contains('x')) { stopHeart(); return; } state.heart = +b.dataset.lv || 1; if (b.dataset.lv === '0') state.heart = 0.5; applyHeart(); $$('button', bar).forEach(x => x.classList.toggle('on', x === b)); });
    document.body.appendChild(bar);
    document.addEventListener('click', heartReveal);
  }
  function heartReveal(e) { const w = e.target.closest('.w'); if (w) w.classList.toggle('show'); }
  function applyHeart() {
    const lv = state.heart;
    $$('.line .txt .w').forEach((w, i) => { w.classList.remove('show'); const idx = +w.dataset.i; const hide = lv === 1 ? idx % 3 === 2 : lv === 2 ? idx % 2 === 1 : lv === 3 ? idx > 0 : false; w.classList.toggle('show', !hide); });
  }
  function stopHeart() { state.heart = 0; body.classList.remove('heart'); $('#heartbar')?.remove(); document.removeEventListener('click', heartReveal); }
  function wrapWords(txt) {
    if (txt.dataset.wrapped) return; txt.dataset.wrapped = '1';
    const walker = document.createTreeWalker(txt, NodeFilter.SHOW_TEXT); const nodes = []; let n; while ((n = walker.nextNode())) nodes.push(n);
    let i = 0;
    for (const node of nodes) {
      const parts = node.nodeValue.split(/(\s+)/); const frag = document.createDocumentFragment();
      for (const p of parts) { if (!p) continue; if (/^\s+$/.test(p)) frag.appendChild(document.createTextNode(p)); else { const s = document.createElement('span'); s.className = 'w'; s.dataset.i = i++; s.textContent = p; frag.appendChild(s); } }
      node.replaceWith(frag);
    }
  }

  /* ---------- pathways ---------- */
  function showWalkChooser() {
    const html = `<ul class="walk-list">${D.paths.map(p => `<li><button data-path="${p.id}"><span class="wl-title">${p.title}</span><span class="wl-why">${p.why || ''}</span><span class="wl-count">${ui('walk-stops').replace('{n}', p.stops.length)}</span></button></li>`).join('')}</ul>`;
    const ov = overlay(ui('walk-title'), ui('walk-sub'), html);
    ov.addEventListener('click', e => { const b = e.target.closest('button[data-path]'); if (b) { closeOverlay(); startWalk(b.dataset.path); } });
  }
  function startWalk(id, at = -1) {
    const p = D.paths.find(x => x.id === id); if (!p) return;
    stopWalk();
    state.walk = { p, i: at };
    const w = document.createElement('div'); w.className = 'walk'; w.id = 'walk';
    document.body.appendChild(w);
    renderWalk();
    history.replaceState(null, '', '#path=' + id);
  }
  function renderWalk() {
    const w = $('#walk'); if (!w || !state.walk) return;
    const { p, i } = state.walk;
    if (i < 0) {
      w.className = 'walk intro';
      w.innerHTML = `<button class="walk-close" aria-label="${ui('walk-leave')}">×</button><p class="walk-title">${ui('walk-title')}</p><p class="walk-head">${p.title}</p>${p.why ? `<p class="walk-why">${p.why}</p>` : ''}<p class="walk-text">${p.intro}</p><div class="walk-nav"><button class="next begin">${ui('walk-begin')}</button><span class="pos">${ui('walk-stops').replace('{n}', p.stops.length)}</span></div>`;
      w.onclick = e => { if (e.target.closest('.walk-close')) stopWalk(); else if (e.target.closest('.next')) { state.walk.i = 0; renderWalk(); } };
      $$('.line.cur').forEach(l => l.classList.remove('cur'));
      return;
    }
    w.className = 'walk';
    const s = p.stops[i];
    const part = s.line ? partOf(s.line) : null;
    w.innerHTML = `<button class="walk-close" aria-label="${ui('walk-leave')}">×</button><p class="walk-title">${p.title} · ${i + 1} of ${p.stops.length}</p><p class="walk-head">${s.line ? `Line ${s.line}${part ? ' · ' + part.numeral : ''}` : ui('walk-title-page')}</p><p class="walk-text">${s.text}</p>${s.cites || ''}<div class="walk-nav"><button class="prev">${ui('walk-back')}</button><button class="next">${i === p.stops.length - 1 ? ui('walk-finish') : ui('walk-next')}</button></div>`;
    w.onclick = e => { if (e.target.closest('.walk-close')) stopWalk(); else if (e.target.closest('.prev')) { state.walk.i = i - 1; renderWalk(); } else if (e.target.closest('.next')) { if (i === p.stops.length - 1) { stopWalk(); return; } state.walk.i = i + 1; renderWalk(); } };
    $$('.line.cur').forEach(l => l.classList.remove('cur'));
    if (s.line) { const el = lineEl(s.line); el && el.classList.add('cur'); go(s.line, false); } else { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); }
  }
  function stopWalk() { state.walk = null; $('#walk')?.remove(); $$('.line.cur').forEach(l => l.classList.remove('cur')); if (location.hash.startsWith('#path=')) history.replaceState(null, '', location.pathname); }

  /* ---------- line by line ---------- */
  function nearestLine() { const mid = window.innerHeight * 0.4; let best = 1, bd = 1e9; for (const l of D.lines) { const el = lineEl(l.n); if (!el) continue; const d = Math.abs(el.getBoundingClientRect().top - mid); if (d < bd) { bd = d; best = l.n; } } return best; }
  function startSlow(at) {
    stopWalk(); closeOverlay(); if (state.heart) stopHeart();
    const n = at || nearestLine();
    state.slow = { n, timer: null };
    body.classList.add('slow');
    if (!$('#slowbar')) { const bar = document.createElement('div'); bar.className = 'walk slowbar'; bar.id = 'slowbar'; document.body.appendChild(bar); }
    $$('.tool').forEach(t => t.classList.toggle('active', t.dataset.tool === 'slow'));
    slowTo(n);
  }
  function slowTo(n) {
    if (!state.slow) return;
    n = Math.max(1, Math.min(D.lines.length, n));
    state.slow.n = n;
    $$('.line.cur, .line.near').forEach(l => l.classList.remove('cur', 'near'));
    const el = lineEl(n); if (!el) return;
    el.classList.add('cur');
    for (const m of [n - 1, n + 1]) { const e = lineEl(m); if (e) e.classList.add('near'); }
    clearCards('gloss'); clearCards('note'); clearCards('slow');
    const gs = D.glosses.filter(g => g.line === n || (g.to && n >= g.line && n <= g.to));
    gs.slice(0, 2).forEach(g => openGloss(g.id, null, { keep: true, scroll: false }));
    const nt = D.notes.find(x => x.line === n); if (nt) placeCard(noteCard(nt), el);
    const v = D.voiceOf[n] || 'poem', pv = D.voiceOf[n - 1] || 'poem';
    if (n > 1 && v !== pv && D.voices[v]) { const c = document.createElement('aside'); c.className = 'card kind-voice'; c.dataset.ckind = 'slow'; c.innerHTML = `<span class="card-kind">${ui('new-voice')}</span><span class="card-title">${D.voices[v].label}</span>${D.voices[v].note ? `<div class="card-body"><p>${D.voices[v].note}</p></div>` : ''}${D.voices[v].cites || ''}`; placeCard(c, el); }
    if (state.lens === 'tongues') { const t = $('.t', el); if (t && !$('.trans-line', el.parentNode)) toggleTrans(t); }
    go(n, false);
    renderSlow();
  }
  function renderSlow() {
    const bar = $('#slowbar'); if (!bar || !state.slow) return;
    const { n, timer } = state.slow; const part = partOf(n);
    bar.innerHTML = `<button class="walk-close" aria-label="${ui('slow-stop-aria')}">×</button><p class="walk-title">${ui('slow-title')} · ${n} of ${D.lines.length}${part ? ' · ' + part.numeral : ''}</p><p class="walk-text">${ui('slow-text')}</p><div class="walk-nav"><button class="prev" ${n === 1 ? 'disabled' : ''}>${ui('walk-back')}</button><button class="next" ${n === D.lines.length ? 'disabled' : ''}>${ui('walk-next')}</button><button class="auto">${timer ? ui('slow-auto-stop') : ui('slow-auto-start')}</button></div>`;
    bar.onclick = e => { if (e.target.closest('.walk-close')) stopSlow(); else if (e.target.closest('.prev')) slowTo(n - 1); else if (e.target.closest('.next')) slowTo(n + 1); else if (e.target.closest('.auto')) toggleAuto(); };
  }
  function toggleAuto() { if (!state.slow) return; if (state.slow.timer) { clearInterval(state.slow.timer); state.slow.timer = null; } else { state.slow.timer = setInterval(() => { if (!state.slow || state.slow.n >= D.lines.length) { toggleAuto(); return; } slowTo(state.slow.n + 1); }, 5200); } renderSlow(); }
  function stopSlow() { if (!state.slow) return; if (state.slow.timer) clearInterval(state.slow.timer); state.slow = null; body.classList.remove('slow'); $('#slowbar')?.remove(); $$('.line.cur, .line.near').forEach(l => l.classList.remove('cur', 'near')); clearCards('slow'); $$('.tool[data-tool="slow"]').forEach(t => t.classList.remove('active')); }
  document.addEventListener('click', e => { if (!state.slow) return; if (e.target.closest('a, button, .card, .walk, .readbar, .runhead, .spine')) return; const ln = e.target.closest('.line'); if (ln) slowTo(+ln.dataset.n); });
  $$('a[data-slow]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); startSlow(1); }));

  /* ---------- tools ---------- */
  function openTool(k) {
    $$('.tool').forEach(t => t.classList.toggle('active', t.dataset.tool === k));
    if (k === 'cards') showCards();
    else if (k === 'fragments') showFragments();
    else if (k === 'sortes') showSortes();
    else if (k === 'concordance') showConcordance();
    else if (k === 'heart') { closeOverlay(); startHeart(); }
    else if (k === 'slow') { if (state.slow) stopSlow(); else startSlow(); }
    else if (k === 'walk') showWalkChooser();
  }
  $$('.tool').forEach(b => b.addEventListener('click', () => openTool(b.dataset.tool)));

  /* ---------- hash routing ---------- */
  function route() {
    const h = location.hash;
    if (!h) return;
    if (h.startsWith('#path=')) { startWalk(h.slice(6)); return; }
    if (/^#L\d+$/.test(h)) { setTimeout(() => go(+h.slice(2)), 60); return; }
    const id = h.slice(1);
    if (glossById[id]) { setTimeout(() => { const g = glossById[id]; if (g.line) go(g.line, false); openGloss(id, null, { keep: true }); }, 60); }
  }
  window.addEventListener('hashchange', route);
  // title page path link
  $$('a[data-path]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); startWalk(a.dataset.path); }));
  // ways to read it
  $$('.howto-item[data-lens]').forEach(b => b.addEventListener('click', () => { setLens(b.dataset.lens); go(1, false); }));
  $$('.howto-item[data-tool]').forEach(b => b.addEventListener('click', () => openTool(b.dataset.tool)));
  $$('.howto-item[data-path]').forEach(b => b.addEventListener('click', () => startWalk(b.dataset.path)));

  /* ---------- init ---------- */
  buildSpine();
  let saved = null; try { saved = localStorage.getItem('wl-lens'); } catch (e) { }
  setLens(saved && LENS_KEYS.includes(saved) ? saved : 'echoes', { init: true });
  updateCursor();
  route();
})();

/* the part plates: fetched and inlined as they come into view, so the ink follows the theme */
(function () {
  var plates = document.querySelectorAll('.plate[data-src]');
  if (!plates.length) return;
  function load(el) { if (el.dataset.done) return; el.dataset.done = '1'; fetch(el.dataset.src).then(function (r) { return r.ok ? r.text() : ''; }).then(function (t) { if (t) el.innerHTML = t.replace(/<\?xml[^>]*>/, '').replace(/<!DOCTYPE[^>]*>/, ''); }).catch(function () {}); }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { load(e.target); io.unobserve(e.target); } }); }, { rootMargin: '900px 0px' });
    plates.forEach(function (p) { io.observe(p); });
  } else plates.forEach(load);
})();
