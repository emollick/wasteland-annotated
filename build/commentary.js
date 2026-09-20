#!/usr/bin/env node
// Export the site's commentary to the shared commentary directory for the debate threads, and pull it back.
//   node build/commentary.js export
//   node build/commentary.js import part1|part2|part3|part4|part5|site|all [--force]
// Files are handled as raw record text (records split on '---' lines, sections on '===' lines), so a round trip
// keeps every character the threads wrote. Import refuses if a fixed field changed, unless --force.
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data');
const OUT = process.env.COMMENTARY_DIR || '/mnt/project-files/commentary';
const read = f => fs.readFileSync(f, 'utf8');
const exists = f => { try { fs.accessSync(f); return true; } catch { return false; } };
const PARTS = [[1, 1, 76], [2, 77, 172], [3, 173, 311], [4, 312, 321], [5, 322, 434]];
const partOf = n => { if (!(n > 0)) return 1; for (const [p, a, b] of PARTS) if (n >= a && n <= b) return p; return 5; }; // the epigraph and title (line 0) go with Part I

const trimRec = r => r.replace(/^\n+|\n+$/g, '');
const records = text => text.split(/^---\s*$/m).map(trimRec).filter(r => r.trim());
const sections = text => text.split(/^===\s*$/m).map(records).filter(s => s.length);
const joinRecords = recs => recs.join('\n---\n') + '\n';
const joinSections = secs => secs.map(joinRecords).join('===\n');
const keyOf = (rec, k) => { const m = new RegExp(`^${k}:\\s?(.*)$`, 'm').exec(rec); return m ? m[1].trim() : null; };
const stripKey = (rec, k) => rec.replace(new RegExp(`^${k}:.*\\n?`, 'm'), '');
const write = (f, text) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); console.log('wrote', path.relative(process.cwd(), f)); };

// which fields are fixed, per file kind
const FIXED = {
  glosses: ['id', 'line', 'to', 'anchor', 'kind', 'source', 'image', 'lang'],
  ways: ['part', 'kind', 'lens', 'source', 'path'],
  stops: ['path', 'line'],
  pathHeads: ['id'],
  drafts: ['id', 'part', 'line'],
  sources: ['id', 'lines', 'lang', 'kind'],
  listen: ['id', 'group', 'embed', 'host'],
  pages: ['id', 'where'],
  ui: ['id', 'where']
};
function fixedOf(rec, kind) { return FIXED[kind].map(k => `${k}=${keyOf(rec, k) ?? ''}`).join('|'); }
// the field names a record declares, as the build's parser would read them (a body line beginning "word:" becomes a field)
const OPTIONAL = ['passage', 'trans', 'cite', 'quote', 'label', 'why', 'plate']; // fields a debate may add to a record that lacked them
const keysOf = rec => rec.split('\n').map(l => /^([a-z][a-z0-9_-]*):/.exec(l)).filter(Boolean).map(m => m[1]);
// compare two lists of records by their fixed fields and their field names; return problems
function diffFixed(oldRecs, newRecs, kind, label) {
  const problems = [];
  if (oldRecs.length !== newRecs.length) problems.push(`${label}: ${oldRecs.length} records before, ${newRecs.length} now`);
  const n = Math.min(oldRecs.length, newRecs.length);
  for (let i = 0; i < n; i++) {
    const a = fixedOf(oldRecs[i], kind), b = fixedOf(newRecs[i], kind);
    if (a !== b) problems.push(`${label} record ${i + 1}: fixed fields changed\n   was ${a}\n   now ${b}`);
    const ka = keysOf(oldRecs[i]), kb = keysOf(newRecs[i]);
    const extra = kb.filter(k => !ka.includes(k) && !OPTIONAL.includes(k)), gone = ka.filter(k => !kb.includes(k));
    if (extra.length || gone.length) problems.push(`${label} record ${i + 1} (${b}): fields ${extra.length ? 'added ' + extra.join(', ') : ''}${extra.length && gone.length ? '; ' : ''}${gone.length ? 'missing ' + gone.join(', ') : ''} (a line inside a body that starts like "word:" is read as a new field)`);
  }
  return problems;
}

function doExport() {
  for (const [p] of PARTS) {
    const dir = path.join(OUT, 'part' + p);
    write(path.join(dir, 'glosses.txt'), read(path.join(DATA, `glosses-${p}.txt`)));
  }
  // ways: one section per part, header record carries part:
  for (const sec of sections(read(path.join(DATA, 'ways.txt')))) {
    const p = +keyOf(sec[0], 'part');
    write(path.join(OUT, 'part' + p, 'ways.txt'), joinRecords(sec));
  }
  // paths: heads to site/, stops to the part of their line, tagged with path:
  const heads = [], stops = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  for (const sec of sections(read(path.join(DATA, 'paths.txt')))) {
    const id = keyOf(sec[0], 'id'); heads.push(sec[0]);
    for (const st of sec.slice(1)) { const p = partOf(+keyOf(st, 'line')); stops[p].push(`path: ${id}\n${st}`); }
  }
  write(path.join(OUT, 'site', 'paths.txt'), joinRecords(heads));
  for (const p of [1, 2, 3, 4, 5]) write(path.join(OUT, 'part' + p, 'paths.txt'), joinRecords(stops[p]));
  // drafts: by part:, 0 to site
  const dr = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] };
  for (const r of records(read(path.join(DATA, 'drafts.txt')))) dr[+keyOf(r, 'part')].push(r);
  for (const p of [0, 1, 2, 3, 4, 5]) if (dr[p].length) write(path.join(OUT, p ? 'part' + p : 'site', 'drafts.txt'), joinRecords(dr[p]));
  for (const f of ['sources.txt', 'listen.txt', 'timeline.json', 'voices.json', 'pages.txt', 'ui.txt']) if (exists(path.join(DATA, f))) write(path.join(OUT, 'site', f), read(path.join(DATA, f)));
}

function importPart(p, force) {
  const dir = path.join(OUT, 'part' + p); const problems = [];
  // glosses
  const gNew = read(path.join(dir, 'glosses.txt')), gOld = read(path.join(DATA, `glosses-${p}.txt`));
  problems.push(...diffFixed(records(gOld), records(gNew), 'glosses', `part${p}/glosses.txt`));
  // ways: replace the section for this part
  const wSecs = sections(read(path.join(DATA, 'ways.txt')));
  const wi = wSecs.findIndex(s => +keyOf(s[0], 'part') === p);
  const wNew = records(read(path.join(dir, 'ways.txt')));
  problems.push(...diffFixed(wSecs[wi], wNew, 'ways', `part${p}/ways.txt`));
  // paths: replace this part's stops in each pathway
  const pSecs = sections(read(path.join(DATA, 'paths.txt')));
  const sNew = records(read(path.join(dir, 'paths.txt')));
  const sOld = []; for (const sec of pSecs) { const id = keyOf(sec[0], 'id'); for (const st of sec.slice(1)) if (partOf(+keyOf(st, 'line')) === p) sOld.push(`path: ${id}\n${st}`); }
  problems.push(...diffFixed(sOld, sNew, 'stops', `part${p}/paths.txt`));
  // drafts: replace by id
  const dOld = records(read(path.join(DATA, 'drafts.txt')));
  const dNew = exists(path.join(dir, 'drafts.txt')) ? records(read(path.join(dir, 'drafts.txt'))) : [];
  problems.push(...diffFixed(dOld.filter(r => +keyOf(r, 'part') === p), dNew, 'drafts', `part${p}/drafts.txt`));
  if (problems.length && !force) { console.error(problems.join('\n')); console.error('\nnothing imported; fix the fixed fields or run with --force'); process.exit(1); }
  if (problems.length) console.warn(problems.join('\n'));
  // apply
  fs.writeFileSync(path.join(DATA, `glosses-${p}.txt`), gNew.endsWith('\n') ? gNew : gNew + '\n');
  wSecs[wi] = wNew; fs.writeFileSync(path.join(DATA, 'ways.txt'), joinSections(wSecs));
  const byPath = {}; for (const st of sNew) { const id = keyOf(st, 'path'); (byPath[id] = byPath[id] || []).push(stripKey(st, 'path')); }
  // a pathway's stops are not always in line order (one ends on the dedication), so each stop goes back exactly where it was
  const newSecs = pSecs.map(sec => { const id = keyOf(sec[0], 'id'); const mine = byPath[id] || []; let k = 0; return [sec[0], ...sec.slice(1).map(st => partOf(+keyOf(st, 'line')) === p ? (mine[k++] ?? st) : st)]; });
  fs.writeFileSync(path.join(DATA, 'paths.txt'), joinSections(newSecs));
  const dMap = Object.fromEntries(dNew.map(r => [keyOf(r, 'id'), r]));
  fs.writeFileSync(path.join(DATA, 'drafts.txt'), joinRecords(dOld.map(r => dMap[keyOf(r, 'id')] || r)));
  console.log(`imported part${p}`);
}

function importSite(force) {
  const dir = path.join(OUT, 'site'); const problems = [];
  const plain = [['sources.txt', 'sources'], ['listen.txt', 'listen'], ['pages.txt', 'pages'], ['ui.txt', 'ui']];
  const pending = [];
  for (const [f, kind] of plain) {
    if (!exists(path.join(dir, f)) || !exists(path.join(DATA, f))) continue;
    const nw = read(path.join(dir, f)), old = read(path.join(DATA, f));
    problems.push(...diffFixed(records(old), records(nw), kind, `site/${f}`));
    pending.push([path.join(DATA, f), nw]);
  }
  for (const f of ['timeline.json', 'voices.json']) {
    if (!exists(path.join(dir, f))) continue;
    const nw = read(path.join(dir, f)); try { JSON.parse(nw); } catch (e) { problems.push(`site/${f}: not valid JSON (${e.message})`); }
    pending.push([path.join(DATA, f), nw]);
  }
  // path heads
  const pSecs = sections(read(path.join(DATA, 'paths.txt')));
  const hNew = exists(path.join(dir, 'paths.txt')) ? records(read(path.join(dir, 'paths.txt'))) : null;
  if (hNew) problems.push(...diffFixed(pSecs.map(s => s[0]), hNew, 'pathHeads', 'site/paths.txt'));
  // drafts part 0
  const dOld = records(read(path.join(DATA, 'drafts.txt')));
  const dNew = exists(path.join(dir, 'drafts.txt')) ? records(read(path.join(dir, 'drafts.txt'))) : [];
  problems.push(...diffFixed(dOld.filter(r => +keyOf(r, 'part') === 0), dNew, 'drafts', 'site/drafts.txt'));
  if (problems.length && !force) { console.error(problems.join('\n')); console.error('\nnothing imported; fix the fixed fields or run with --force'); process.exit(1); }
  if (problems.length) console.warn(problems.join('\n'));
  for (const [f, text] of pending) fs.writeFileSync(f, text.endsWith('\n') ? text : text + '\n');
  if (hNew) { const byId = Object.fromEntries(hNew.map(r => [keyOf(r, 'id'), r])); fs.writeFileSync(path.join(DATA, 'paths.txt'), joinSections(pSecs.map(s => [byId[keyOf(s[0], 'id')] || s[0], ...s.slice(1)]))); }
  const dMap = Object.fromEntries(dNew.map(r => [keyOf(r, 'id'), r]));
  fs.writeFileSync(path.join(DATA, 'drafts.txt'), joinRecords(dOld.map(r => dMap[keyOf(r, 'id')] || r)));
  console.log('imported site');
}

const [cmd, target, flag] = process.argv.slice(2);
const force = flag === '--force' || target === '--force';
if (cmd === 'export') doExport();
else if (cmd === 'import') {
  const t = target && !target.startsWith('--') ? target : 'all';
  if (t === 'all') { for (const [p] of PARTS) importPart(p, force); importSite(force); }
  else if (/^part[1-5]$/.test(t)) importPart(+t.slice(4), force);
  else if (t === 'site') importSite(force);
  else { console.error('unknown target', t); process.exit(2); }
} else { console.error('usage: node build/commentary.js export | import [part1..part5|site|all] [--force]'); process.exit(2); }
