/* The Waste Land, annotated — poem page behaviour. Plain JS, no dependencies. */
(function () {
  'use strict';
  const D = window.WL;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const body = document.body;
  const poem = $('#poem');
  const margin = $('#margin');
  const lineEl = n => document.getElementById('L' + n);
  const glossById = Object.fromEntries(D.glosses.map(g => [g.id, g]));
  const wide = () => matchMedia('(min-width: 1140px)').matches;
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
  window.addEventListener('resize', () => { relayout(); paintSpine(); });

  function placeCard(card, anchorEl, sticky) {
    const n = +(anchorEl.closest('.line')?.dataset.n || 0);
    card.dataset.line = n;
    if (wide()) {
      card.dataset.top = Math.max(0, relTop(anchorEl.closest('.line') || anchorEl) - 4);
      if (sticky) card.dataset.sticky = '1';
      margin.appendChild(card);
      relayout();
    } else {
      card.classList.add('card-inline');
      const host = anchorEl.closest('.line') || anchorEl.closest('.part-title') || anchorEl;
      host.insertAdjacentElement('afterend', card);
    }
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
    return `<div class="card-src"><b>${esc(s.author)}</b>, <i>${s.title}</i>${s.date ? ' (' + esc(s.date) + ')' : ''}. <a href="library.html#src-${s.id}">In the library</a>${links ? `<div class="card-links">Read it whole: ${links}</div>` : ''}</div>`;
  }
  function glossCard(g) {
    const kindLabel = { echo: 'Echo', gloss: 'Note', place: 'Place', draft: 'From the drafts', voice: 'A voice', tongue: 'Another language', sound: 'Sound', image: 'Picture' }[g.kind] || 'Note';
    const lines = g.to && g.to !== g.line ? `lines ${g.line}–${g.to}` : (g.line ? `line ${g.line}` : '');
    const card = document.createElement('aside');
    card.className = `card kind-${g.kind}`;
    card.dataset.ckind = 'gloss'; card.dataset.g = g.id;
    card.innerHTML = `<button class="card-close" aria-label="Close">×</button><span class="card-kind">${kindLabel}${lines ? ' · <span class="lines">' + lines + '</span>' : ''}</span><span class="card-title">${g.title}</span>${g.quote ? `<div class="card-quote"${g.lang ? ` lang="${{ German: 'de', French: 'fr', Italian: 'it', Latin: 'la', Greek: 'grc', Sanskrit: 'sa' }[g.lang] || ''}"` : ''}>${g.quote}</div>` : ''}${g.trans ? `<p class="card-trans">${g.trans}</p>` : ''}${g.image ? imageFig(g.image) : ''}<div class="card-body">${g.body}</div>${g.source ? sourceBlock(g.source) : ''}`;
    return card;
  }
  function openGloss(id, anchorEl, opts = {}) {
    const g = glossById[id]; if (!g) return;
    const existing = $(`.card[data-g="${id}"]`);
    if (existing && !opts.keep) { existing.remove(); anchorEl && anchorEl.classList.remove('open'); relayout(); return; }
    if (existing) return;
    const card = glossCard(g);
    const a = anchorEl || $(`.g[data-g="${id}"]`);
    if (a) a.classList.add('open');
    placeCard(card, a || lineEl(g.line) || poem);
    if (!wide() && opts.scroll !== false) card.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', e => {
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
    card.innerHTML = `<span class="card-kind">Eliot’s note · <span class="lines">line ${nt.printed}</span></span><div class="card-body${long ? ' clamp' : ''}">${long ? `<p class="short">${esc(plain.slice(0, 150))}… <button class="more">more</button></p><div class="full" hidden>${nt.text}</div>` : nt.text}</div>`;
    card.addEventListener('click', e => { if (e.target.closest('.more') || (long && !e.target.closest('a'))) { const f = $('.full', card), s = $('.short', card); if (f && s) { f.hidden = !f.hidden; s.hidden = !f.hidden; relayout(); } } });
    return card;
  }
  function showNotes() {
    clearCards('note');
    const head = document.createElement('aside');
    head.className = 'card kind-note'; head.dataset.ckind = 'note';
    head.innerHTML = `<span class="card-kind">Eliot’s notes, 1922</span><div class="card-body"><p>Written to fill out the Boni &amp; Liveright book; Eliot later called them “bogus scholarship.” They appear here beside the lines they belong to, and in full <a href="#notes">after the poem</a>. Gold dots mark the lines that have one.</p></div>`;
    placeCard(head, lineEl(1), true);
    for (const nt of D.notes) { const el = lineEl(nt.line); if (el) placeCard(noteCard(nt), el); }
  }

  /* ---------- legends ---------- */
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
        const tag = document.createElement('span'); tag.className = 'voice-tag'; tag.style.setProperty('--vc', vc); tag.textContent = D.voices[v] ? D.voices[v].label : v; tag.dataset.v = v; tag.title = 'Follow this voice alone';
        el.insertAdjacentElement('beforebegin', tag);
      }
      prev = v;
    }
    const counts = {};
    for (const l of D.lines) { const v = D.voiceOf[l.n] || 'poem'; counts[v] = (counts[v] || 0) + 1; }
    const html = `<p>The typescript was headed <i>He Do the Police in Different Voices</i>. Each change of speaker is marked; the colours are only a way of seeing where one voice stops and another starts. Who counts as a voice is a reading, not a fact.</p><p class="follow-note">Click a voice, here or in the text, to follow it alone through the poem.</p><ul>${Object.entries(D.voices).map(([k, v]) => `<li data-v="${k}"><span class="sw" style="background:${v.color}"></span>${v.label}<span class="cnt">${counts[k] || 0}</span></li>`).join('')}</ul>`;
    const card = legendCard('Voices · thirty-two of them', html, 'kind-voice');
    card.addEventListener('click', e => { const li = e.target.closest('li[data-v]'); if (li) follow(li.dataset.v); });
    placeCard(card, lineEl(1), true);
    if (state.follow) { const f = state.follow; state.follow = null; follow(f); }
  }
  function follow(v) {
    if (state.follow === v) v = null;
    state.follow = v;
    body.classList.toggle('follow', !!v);
    $$('.line').forEach(l => l.classList.toggle('v-on', !!v && (l.dataset.voice || 'poem') === v));
    $$('.voice-tag').forEach(t => t.classList.toggle('v-on', !!v && t.dataset.v === v));
    $$('.legend li[data-v]').forEach(li => li.classList.toggle('on', !!v && li.dataset.v === v));
    const note = $('.legend .follow-note'); if (note) note.textContent = v && D.voices[v] ? `Following ${D.voices[v].label}, ${$$('.line.v-on').length} lines. Click again to hear everyone.` : 'Click a voice, here or in the text, to follow it alone through the poem.';
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
    const html = `<p>Latin and Greek before the first line; German, French, Italian and Sanskrit inside the poem; Provençal in the notes; and the languages of birds, bells and the river. Click any coloured phrase for its translation. The poem leaves them untranslated on purpose: the reader of 1922 was meant to feel the wall.</p><ul>${Object.entries(D.tongues).map(([k, v]) => `<li><span class="sw" style="background:${v.color}"></span>${v.label}<span class="cnt">${counts[k] || 0}</span></li>`).join('')}</ul>`;
    placeCard(legendCard('Tongues', html, 'kind-tongue'), lineEl(1), true);
    // reveal all translations at once for the epigraph
  }
  function hideTongues() { $$('.trans-line').forEach(t => t.remove()); }

  function showWater() {
    const c = { water: 0, dry: 0, fire: 0 };
    for (const v of Object.values(D.elements.of)) for (const k of v.split(' ')) c[k]++;
    const total = D.lines.length;
    const html = `<p>Every line that is wet, dry or burning, tinted. The poem's argument is a weather report: rain that is unwelcome, rivers that are dirty, a sea that drowns, and then twenty-nine lines of rock before three words of rain.</p><div class="gauge"><span style="width:${c.water / total * 100}%;background:var(--water)"></span><span style="width:${c.dry / total * 100}%;background:var(--dry)"></span><span style="width:${c.fire / total * 100}%;background:var(--fire)"></span></div><ul><li><span class="sw" style="background:var(--water)"></span>${D.elements.labels.water}<span class="cnt">${c.water} lines</span></li><li><span class="sw" style="background:var(--dry)"></span>${D.elements.labels.dry}<span class="cnt">${c.dry}</span></li><li><span class="sw" style="background:var(--fire)"></span>${D.elements.labels.fire}<span class="cnt">${c.fire}</span></li><li><span class="sw" style="background:var(--paper-3)"></span>neither<span class="cnt">${total - c.water - c.dry - c.fire}</span></li></ul><p class="lines">The tagging is by hand and by sense, not by keyword: “a spring” at line 351 is water; “in the spring” at line 198 is not. Argue with it.</p>`;
    placeCard(legendCard('Water, drought, fire', html), lineEl(1), true);
  }

  /* ---------- places ---------- */
  function openPlace(id, anchorEl) {
    const info = D.places.london[id] || D.places.world[id]; if (!info) return;
    const ex = $(`.card[data-place="${id}"]`); if (ex) { ex.remove(); relayout(); return; }
    const card = document.createElement('aside'); card.className = 'card kind-place'; card.dataset.ckind = 'place'; card.dataset.place = id;
    const xy = D.placeXY[id];
    const lines = info.lines.filter(n => n > 0).map(n => `<a href="#L${n}">line ${n}</a>`).join(', ');
    card.innerHTML = `<button class="card-close" aria-label="Close">×</button><span class="card-kind">Place</span><span class="card-title">${esc(info.label)}</span><div class="card-body"><p>${lines ? 'Named at ' + lines + '.' : ''}${xy ? ` <span class="lines">${xy[1].toFixed(3)}°, ${xy[0].toFixed(3)}°.</span>` : ''}</p><p><a href="map.html#${id}">See it on the map</a></p></div>`;
    placeCard(card, anchorEl);
  }
  function showPlaces() {
    const html = `<p>Place names are marked. Click one for its lines and its spot on the map. The route in Part I, London Bridge to King William Street to St Mary Woolnoth, is the walk Eliot took to Lloyds Bank every morning; the river in Part III runs from Richmond to Margate.</p><p><a href="map.html">The map</a>, drawn from the river's real course.</p>`;
    placeCard(legendCard('Places', html, 'kind-place'), lineEl(1), true);
  }

  /* ---------- clock ---------- */
  function showClock() {
    for (const h of D.times.hours) { const el = lineEl(h.line); if (!el) continue; wrapPhrase(el, h.text, 'tm'); }
    for (const s of D.times.seasons) { const el = lineEl(s.line); if (!el) continue; wrapPhrase(el, s.text, 'tm'); }
    const R = 92, cx = 110, cy = 110;
    const pt = (hour, r) => { const a = (hour / 24) * Math.PI * 2 - Math.PI / 2; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
    let svg = `<svg class="clock" viewBox="0 0 220 220" aria-label="The hours the poem names">`;
    // night arc 18-6
    const [nx1, ny1] = pt(18, R), [nx2, ny2] = pt(6, R);
    svg += `<path class="night" d="M${cx} ${cy} L${nx1} ${ny1} A${R} ${R} 0 0 1 ${nx2} ${ny2} Z"/>`;
    svg += `<circle class="ring" cx="${cx}" cy="${cy}" r="${R}"/>`;
    for (let h = 0; h < 24; h++) { const [x1, y1] = pt(h, R), [x2, y2] = pt(h, R - (h % 6 ? 3 : 7)); svg += `<line class="tick" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; }
    for (const [h, l] of [[0, 'midnight'], [6, 'dawn'], [12, 'noon'], [18, 'dusk']]) { const [x, y] = pt(h, R - 16); svg += `<text x="${x}" y="${y + 3}" text-anchor="middle">${l}</text>`; }
    const used = {};
    for (const h of D.times.hours) { const k = Math.round(h.hour * 2); used[k] = (used[k] || 0) + 1; const [x, y] = pt(h.hour, R - 28 - (used[k] - 1) * 9); svg += `<circle class="hour" cx="${x}" cy="${y}" r="3.2" data-line="${h.line}"><title>${esc(h.text)} (line ${h.line})</title></circle>`; }
    svg += `</svg>`;
    const seasonsList = D.times.seasons.map(s => `<li><a href="#L${s.line}">${esc(s.text)}</a><span class="cnt">l. ${s.line}</span></li>`).join('');
    const hoursList = D.times.hours.slice().sort((a, b) => a.hour - b.hour).map(h => `<li><a href="#L${h.line}">${esc(h.text)}</a><span class="cnt">l. ${h.line}</span></li>`).join('');
    const html = `<p>Every hour the poem names, plotted on a day. Most of them fall after dark. The year runs from April to “winter noon” and back to spring; the poem's own season, by its leaves and its weather, is late October.</p>${svg}<p><b>Hours</b></p><ul>${hoursList}</ul><p><b>Seasons</b></p><ul>${seasonsList}</ul>`;
    const card = legendCard('The clock', html); placeCard(card, lineEl(1), true);
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
      g.innerHTML = `<b>${esc(d.title)}</b>${d.body}<p><a href="drafts.html#${d.id}">The drafts page</a></p>`;
      host.insertAdjacentElement('beforebegin', g);
    }
    const html = `<p>Where the typescript differed, a typewritten note stands in the text: the Boston opening, the Fresca couplets, the eighty-three lines of sea voyage, Pound's pencil and Vivien's. The cut passages are still in copyright and are described, not quoted.</p><p><a href="drafts.html">The whole story of the cuts</a>.</p>`;
    placeCard(legendCard('The drafts', html, 'kind-draft'), lineEl(1), true);
    relayout();
  }
  function hideDrafts() { $$('.ghost').forEach(g => g.remove()); }

  /* ---------- lens switching ---------- */
  function setLens(k, opts = {}) {
    if (!LENS_KEYS.includes(k)) return;
    const prev = state.lens;
    state.lens = k; body.dataset.lens = k;
    $$('.lens').forEach(b => b.setAttribute('aria-checked', b.dataset.lens === k));
    // teardown
    hideVoices(); hideTongues(); hideClock(); hideDrafts();
    clearCards('note'); clearCards('legend'); clearCards('place');
    if (k === 'notes') showNotes();
    if (k === 'voices') showVoices();
    if (k === 'tongues') showTongues();
    if (k === 'water') showWater();
    if (k === 'places') showPlaces();
    if (k === 'clock') showClock();
    if (k === 'drafts') showDrafts();
    paintSpine();
    relayout();
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
  function go(n, hi = true) {
    const el = lineEl(n); if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3;
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
    ov.innerHTML = `<div class="ov-box ${cls}"><button class="ov-close" aria-label="Close">×</button><h2 class="ov-title">${title}</h2>${sub ? `<p class="ov-sub">${sub}</p>` : ''}<div class="ov-body">${html}</div></div>`;
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
    { id: 'phoenician-sailor', deck: "In this pack: a sailor in a striped jersey sinking head first through the water, a ship’s wheel already on the bottom, two gold pearls for eyes. He is drawn inverted on purpose: he is the Hanged Man the reading cannot find, gone into the water instead.", name: 'The drowned Phoenician Sailor', num: '·', img: null, note: '<p>Not in any Tarot pack. He is Phlebas of Part IV, the merchant of Part III, and Ferdinand’s drowned father in <i>The Tempest</i>, whose eyes are pearls. “Fear death by water,” says the clairvoyante; Part IV obliges.</p>', line: 47 },
    { id: 'belladonna', deck: "In this pack: a woman in a grotto of stone, wrapped in black to the chin, pupils wide with the drops, lips violet, a sprig of nightshade held up; sea through the mouth of the cave.", name: 'Belladonna, the Lady of the Rocks', num: '·', img: null, note: '<p>“Beautiful lady,” the deadly nightshade, and the drops women used to widen their pupils. Leonardo’s <i>Virgin of the Rocks</i> is behind the title; the woman in the chair of Part II is in front of it. “The lady of situations” is gossip-column English.</p>', line: 49 },
    { id: 'three-staves', deck: "In this pack: a man seen from behind on a headland of cracked earth, watching two barges under a low red sun. His three staves are a crutch, a fishing rod with its line down, and a staff planted in the ground that has begun to sprout: a wound, a line, a rod of office.", name: 'The man with three staves', num: 'III', img: 'tarot-three-of-wands', note: '<p>A real card, the Three of Wands: a figure on a headland, back turned, watching ships go out. Eliot associated him, “quite arbitrarily,” with the Fisher King, who sits on the shore at line 424.</p>', line: 51 },
    { id: 'wheel', deck: "In this pack: Fortune’s wheel drawn as a ship’s wheel, the same man in a bowler at its four stations, enthroned, falling, crushed, climbing. It looks ahead to “you who turn the wheel and look to windward”.", name: 'The Wheel', num: 'X', img: 'tarot-wheel', note: '<p>The Wheel of Fortune, card X of the major arcana: rise, reign, fall. “O you who turn the wheel and look to windward,” line 320, is a helmsman and this card at once.</p>', line: 51 },
    { id: 'one-eyed-merchant', deck: "In this pack: Mr. Eugenides in profile, which is the only kind of one-eyed man a printed card can have: bowler, astrakhan collar, a handful of currants held out, and on his back a roped bundle whose contents are not shown.", name: 'The one-eyed merchant', num: '·', img: null, note: '<p>Not a card. One-eyed because seen in profile; he is Mr. Eugenides of Smyrna, with his currants and his invitation, at line 209. Something on his back that the clairvoyante is forbidden to see.</p>', line: 52 },
    { id: 'blank', deck: "In this pack: bare paper inside the frame. Faintly, the merchant’s bundle shows through from the other side, reversed, as if the print on the back had bled. Something is there and cannot be read. Hold the pointer over it.", name: 'The blank card', num: '', img: null, note: '<p>“This card, / Which is blank, is something he carries on his back, / Which I am forbidden to see.” The one card the poem refuses to read. Weston’s merchants carried the Grail mysteries along the trade routes; whatever this is, it is not shown.</p>', line: 53 },
    { id: 'hanged-man', deck: "In this pack: a dead tree with one long bough, a rope with its noose hanging open, and where the Hanged Man should hang, inverted, one leg crooked, the paper is left bare in his shape. Round the head that is not there, a gold halo. Far off on a road, two walkers and a hooded third.", name: 'The Hanged Man', num: 'XII', img: 'tarot-hanged-man', note: '<p>Card XII: a young man hanging by one foot from a living tree, serene, haloed. Eliot linked him to Frazer’s Hanged God, the sacrificed king whose death brings the rain, and to the hooded figure on the road to Emmaus. Madame Sosostris does not find him. No sacrifice, no resurrection, in this deal.</p>', line: 55 },
    { id: 'crowd-in-a-ring', deck: "In this pack: a ring of walkers in bowlers and cloche hats, seen from above, going round clockwise on a bare plain, the path worn into the ground under their feet. The centre of the ring is empty.", name: 'Crowds of people, walking round in a ring', num: '·', img: null, note: '<p>Not a card but what she sees: Dante’s neutrals running after their banner, Frazer’s villagers round the maypole, the commuters on London Bridge four lines later, the hooded hordes of Part V.</p>', line: 56 }
  ];
  const PACK = [
    { id: 'sibyl', name: 'The Sibyl', line: 0 }, { id: 'hyacinth-girl', name: 'The hyacinth girl', line: 36 }, { id: 'madame-sosostris', name: 'Madame Sosostris', line: 43 },
    { id: 'crowd-on-london-bridge', name: 'The crowd on London Bridge', line: 62 }, { id: 'stetson', name: 'Stetson', line: 69 }, { id: 'lady-in-the-chair', name: 'The lady in the chair', line: 77 },
    { id: 'closing-time', name: 'Closing time', line: 141 }, { id: 'tiresias', name: 'Tiresias', line: 218 }, { id: 'typist', name: 'The typist', line: 222 },
    { id: 'thames-daughters', name: 'The Thames-daughters', line: 266 }, { id: 'phlebas', name: 'Phlebas', line: 312 }, { id: 'fisher-king', name: 'The Fisher King', line: 424 }
  ];
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
    const rest = PACK.filter(c => tarotSVGFor(c.id));
    const pack = rest.length ? `<h3 class="ov-sub">The rest of the pack</h3><p class="small">The poem’s people as a suit of their own, drawn for this edition; each card is numbered with the line where its figure first appears. Click one to go there.</p><div class="table pack">${rest.map(c => `<a class="tcard pack-card" href="${c.line ? '#L' + c.line : '#top'}" aria-label="${esc(c.name)}" title="${esc(c.name)}"><div class="face front drawn" data-svg="${tarotSVGFor(c.id)}"></div></a>`).join('')}</div>` : '';
    const ov = overlay('Madame Sosostris deals', 'Lines 46–56. Turn each card. “I am not familiar with the exact constitution of the Tarot pack of cards, from which I have obviously departed to suit my own convenience.” (Eliot’s note.)', `<div class="table">${cards}</div><div class="tarot-note"><p class="small">Turn a card over to read what it is, where it comes from, and where it turns up again in the poem.${D.tarot.length ? '' : ' The three cards with pictures are Pamela Colman Smith’s designs for the 1909 Rider pack, the one on sale in London when the poem was written; a deck drawn for this edition is on its way.'}</p></div>${pack}`);
    $$('.face[data-svg]', ov).forEach(f => fetchSVG(f.dataset.svg).then(t => { if (t) f.innerHTML = t; }));
    ov.addEventListener('click', e => { if (e.target.closest('.pack-card')) closeOverlay(); });
    ov.addEventListener('click', e => { const t = e.target.closest('.tcard'); if (!t) return; const c = TAROT[+t.dataset.i]; t.classList.add('flipped'); $$('.tcard.chosen', ov).forEach(x => x.classList.remove('chosen')); t.classList.add('chosen'); $('.tarot-note', ov).innerHTML = `<p><b>${c.name}.</b></p>${c.note}${c.deck && tarotSVGFor(c.id) ? `<p class="small">${c.deck}</p>` : ''}<p><a href="#L${c.line}" class="tl">Go to line ${c.line}</a></p>`; });
    ov.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.classList.contains('tcard')) e.target.click(); });
    ov.addEventListener('click', e => { const a = e.target.closest('a.tl'); if (a) { e.preventDefault(); closeOverlay(); go(+a.getAttribute('href').slice(2)); } });
  }

  /* ---------- fragments ---------- */
  const FRAGS = [
    { n: 427, src: 'london-bridge', lang: 'English, a nursery rhyme' },
    { n: 428, src: 'dante-purg26', lang: 'Italian' },
    { n: 429, src: 'pervigilium-veneris', lang: 'Latin, then Tennyson’s English' },
    { n: 430, src: 'nerval-desdichado', lang: 'French' },
    { n: 431, src: null, lang: 'English: the poet’s own line' },
    { n: 432, src: 'kyd-spanish-tragedy', lang: 'English, 1587 spelling' },
    { n: 433, src: 'brihadaranyaka', lang: 'Sanskrit' },
    { n: 434, src: 'brihadaranyaka', lang: 'Sanskrit' }
  ];
  function showFragments() {
    const html = `<ul class="frags">${FRAGS.map(f => { const s = f.src ? D.sources[f.src] : null; const g = glossById.fragments; return `<li class="frag" data-n="${f.n}"><div class="fline">${esc(D.lines[f.n - 1].t)}<span class="flang">${f.lang}</span></div><div class="fbody">${s ? `<div class="fsrc">${esc(s.author)}, <i>${s.title}</i>, ${esc(s.date)}</div>${s.passage ? `<div class="card-quote">${s.passage}</div>` : ''}${s.trans ? `<p class="card-trans">${s.trans}</p>` : ''}<p>${s.what}</p><p class="card-links"><a href="library.html#src-${s.id}">In the library</a>${(s.links || []).slice(0, 1).map(l => `<a href="${esc(l.url)}" rel="noopener">Read it whole</a>`).join('')}</p>` : `<p>“These fragments I have shored against my ruins.” The one line in the stack that is not a quotation, and the poem’s account of its own method: other people’s lines propped like timbers against a wall that is coming down. It is also a boast. The ruins are his.</p>`}</div></li>`; }).join('')}</ul>`;
    const ov = overlay('The fragments, unstacked', 'The last eight lines, in five languages. Click a line to pull it out of the stack and see where it came from.', html);
    ov.addEventListener('click', e => { const f = e.target.closest('.frag'); if (f && !e.target.closest('a')) f.classList.toggle('open'); });
  }

  /* ---------- sortes ---------- */
  function showSortes() {
    const draw = () => {
      const l = D.lines[Math.floor(Math.random() * D.lines.length)];
      const p = partOf(l.n);
      const gs = D.glosses.filter(g => g.line <= l.n && (g.to || g.line) >= l.n && g.line > 0);
      const g = gs[0];
      return `<div class="sortes"><p class="from">Line ${l.n} · ${p.numeral}. ${p.name}</p><p class="drawn">${esc(l.t)}</p>${g ? `<div class="gl card kind-${g.kind}"><span class="card-kind">${g.kind === 'echo' ? 'Echo' : 'Note'}</span><span class="card-title">${g.title}</span>${g.quote ? `<div class="card-quote">${g.quote}</div>` : ''}${g.trans ? `<p class="card-trans">${g.trans}</p>` : ''}<div class="card-body">${g.body.split('</p>')[0]}</p></div></div>` : `<p class="small">No note on this line. Some lines are just lines.</p>`}<p><a href="#L${l.n}" class="tl">Go to it in the poem</a></p><button class="again">Draw another</button></div>`;
    };
    const ov = overlay('Sortes', 'Madame Sosostris’s method: one line, at random, and what stands behind it. Fortune-telling by a poem that is mostly quotations.', draw());
    ov.addEventListener('click', e => { if (e.target.closest('.again')) { $('.ov-body', ov).innerHTML = draw(); } const a = e.target.closest('a.tl'); if (a) { e.preventDefault(); closeOverlay(); go(+a.getAttribute('href').slice(2)); } });
  }

  /* ---------- concordance ---------- */
  const STOP = new Set('the a an and of to in i you he she it we they is are was were be been that this these those with for on at by from as but or not no nor so if then than there here where when who whom which what my your his her its our their me him them us do did does have has had shall will would can could may said says one out up down over under into upon only all any each much more most some such very too now still yet again once ever never'.split(' '));
  function showConcordance() {
    const freq = {};
    for (const l of D.lines) for (const w of l.t.toLowerCase().replace(/[^a-zà-ÿ’'\- ]/g, ' ').split(/\s+/)) { const x = w.replace(/^['’\-]+|['’\-]+$/g, ''); if (x.length > 2 && !STOP.has(x)) freq[x] = (freq[x] || 0) + 1; }
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 60);
    const ov = overlay('Find a word', 'Every occurrence, with its line. The words the poem uses most are listed below; “water” and “nothing” between them are a reading of the poem.', `<div class="conc"><input type="search" placeholder="water, dead, nothing, dry, rock, eyes…" autocomplete="off" spellcheck="false"><ul class="hits"></ul><div class="vocab">${top.map(([w, c]) => `<button data-w="${esc(w)}">${esc(w)}<span class="f">${c}</span></button>`).join('')}</div></div>`);
    const input = $('input', ov), hits = $('.hits', ov);
    const run = q => {
      q = q.trim().toLowerCase(); hits.innerHTML = '';
      if (q.length < 2) return;
      const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const out = [];
      for (const l of D.lines) { if (l.t.toLowerCase().includes(q)) out.push(`<li><a href="#L${l.n}" class="tl"><span class="n">${l.n}</span>${esc(l.t).replace(re, m => `<mark>${m}</mark>`)}</a></li>`); }
      hits.innerHTML = out.join('') || '<li class="small">Not in the poem.</li>';
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
    bar.innerHTML = `<span>By heart</span><button data-lv="1">every third word</button><button data-lv="2">every second</button><button data-lv="3">all but the first</button><button data-lv="0">show all</button><button class="x">done</button>`;
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
    const html = `<ul class="walk-list">${D.paths.map(p => `<li><button data-path="${p.id}">${p.title}</button><p>${p.intro}</p></li>`).join('')}</ul>`;
    const ov = overlay('Take a pathway', 'A walk through the poem in a dozen stops or so. The guide stays in the corner; the poem stays where it is.', html);
    ov.addEventListener('click', e => { const b = e.target.closest('button[data-path]'); if (b) { closeOverlay(); startWalk(b.dataset.path); } });
  }
  function startWalk(id, at = 0) {
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
    const { p, i } = state.walk; const s = p.stops[i];
    const part = s.line ? partOf(s.line) : null;
    w.innerHTML = `<button class="walk-close" aria-label="Leave the pathway">×</button><p class="walk-title">${p.title} · ${i + 1} of ${p.stops.length}</p><p class="walk-head">${s.line ? `Line ${s.line}${part ? ' · ' + part.numeral : ''}` : 'The title page'}</p><p class="walk-text">${s.text}</p><div class="walk-nav"><button class="prev" ${i === 0 ? 'disabled' : ''}>Back</button><button class="next">${i === p.stops.length - 1 ? 'Finish' : 'Next'}</button><span class="pos">${p.intro.split('.')[0]}.</span></div>`;
    w.onclick = e => { if (e.target.closest('.walk-close')) stopWalk(); else if (e.target.closest('.prev')) { state.walk.i = Math.max(0, i - 1); renderWalk(); } else if (e.target.closest('.next')) { if (i === p.stops.length - 1) { stopWalk(); return; } state.walk.i = i + 1; renderWalk(); } };
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
    go(n, false);
    clearCards('gloss'); clearCards('note'); clearCards('slow');
    const gs = D.glosses.filter(g => g.line === n || (g.to && n >= g.line && n <= g.to));
    gs.slice(0, 2).forEach(g => openGloss(g.id, null, { keep: true, scroll: false }));
    const nt = D.notes.find(x => x.line === n); if (nt) placeCard(noteCard(nt), el);
    const v = D.voiceOf[n] || 'poem', pv = D.voiceOf[n - 1] || 'poem';
    if (n > 1 && v !== pv && D.voices[v]) { const c = document.createElement('aside'); c.className = 'card kind-voice'; c.dataset.ckind = 'slow'; c.innerHTML = `<span class="card-kind">A new voice</span><span class="card-title">${D.voices[v].label}</span>`; placeCard(c, el); }
    if (state.lens === 'tongues') { const t = $('.t', el); if (t && !$('.trans-line', el.parentNode)) toggleTrans(t); }
    renderSlow();
  }
  function renderSlow() {
    const bar = $('#slowbar'); if (!bar || !state.slow) return;
    const { n, timer } = state.slow; const part = partOf(n);
    bar.innerHTML = `<button class="walk-close" aria-label="Stop reading line by line">×</button><p class="walk-title">Line by line · ${n} of ${D.lines.length}${part ? ' · ' + part.numeral : ''}</p><p class="walk-text">One line at a time, with whatever belongs to it beside it. <span class="keys">↓</span> or <span class="keys">space</span> for the next, <span class="keys">↑</span> for the last; click any line to move there.</p><div class="walk-nav"><button class="prev" ${n === 1 ? 'disabled' : ''}>Back</button><button class="next" ${n === D.lines.length ? 'disabled' : ''}>Next</button><button class="auto">${timer ? 'Stop it walking' : 'Let it walk'}</button></div>`;
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

  /* ---------- init ---------- */
  buildSpine();
  let saved = null; try { saved = localStorage.getItem('wl-lens'); } catch (e) { }
  setLens(saved && LENS_KEYS.includes(saved) ? saved : 'echoes');
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
