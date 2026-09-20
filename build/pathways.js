#!/usr/bin/env node
// Take in the thematic pathways written by the "Pathways on the poem's themes" thread.
// Usage: node build/pathways.js [dir] [--dry]
//   dir   the delivered directory (default /mnt/project-files/commentary/pathways), holding
//         heads.txt              one head record per pathway (id, title, intro, why), in the order of the chooser
//         part1.txt … part5.txt  the stops of that part (path, line, text, optional sources), in walking order
//         ways-replacements.txt  way-in items to put in place of those that pointed at a retired pathway
//                                (each with part:, and either replaces: <old path id> or a path: that is new)
//   --dry print what would change and write nothing
// A pathway in heads.txt keeps its old stops when the delivery has none for it; a pathway not in heads.txt is retired.
// Then data/paths.txt and data/ways.txt are rewritten, and the texts that count the pathways (pages.txt) are
// changed in data/ and in the shared copy, so that the two stay identical for the site import.
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data');
const args = process.argv.slice(2);
const dry = args.includes('--dry');
const DIR = args.find(a => !a.startsWith('--')) || '/mnt/project-files/commentary/pathways';
const SHARED = process.env.COMMENTARY_DIR || '/mnt/project-files/commentary';
const read = f => fs.readFileSync(f, 'utf8');
const exists = f => { try { fs.accessSync(f); return true; } catch { return false; } };
const trimRec = r => r.replace(/^\n+|\n+$/g, '');
const records = text => text.split(/^---\s*$/m).map(trimRec).filter(r => r.trim());
const sections = text => text.split(/^===\s*$/m).map(records).filter(s => s.length);
const joinRecords = recs => recs.join('\n---\n') + '\n';
const joinSections = secs => secs.map(joinRecords).join('===\n');
const keyOf = (rec, k) => { const m = new RegExp(`^${k}:\\s?(.*)$`, 'm').exec(rec); return m ? m[1].trim() : null; };
const valueOf = (rec, k) => { const m = new RegExp(`^${k}:\\s?([^]*?)(?=^[a-z][a-z0-9_-]*:|(?![^]))`, 'm').exec(rec); return m ? m[1].trim() : null; }; // a multi-line value
const stripKey = (rec, k) => rec.replace(new RegExp(`^${k}:.*\\n?`, 'm'), '');
const problems = [], notes = [];

// ---- what was delivered
if (!exists(path.join(DIR, 'heads.txt'))) { console.error(`no heads.txt in ${DIR}`); process.exit(1); }
const heads = records(read(path.join(DIR, 'heads.txt')));
const headIds = heads.map(h => keyOf(h, 'id'));
for (const h of heads) for (const k of ['id', 'title', 'intro', 'why']) if (!keyOf(h, k)) problems.push(`heads.txt: record without ${k} (${h.split('\n')[0]})`);
const dup = headIds.filter((id, i) => headIds.indexOf(id) !== i); if (dup.length) problems.push(`heads.txt: repeated id ${dup.join(', ')}`);
const stopsByPath = {};
for (const p of [1, 2, 3, 4, 5]) {
  const f = path.join(DIR, `part${p}.txt`); if (!exists(f)) { notes.push(`no part${p}.txt`); continue; }
  for (const st of records(read(f))) {
    const id = keyOf(st, 'path'), line = keyOf(st, 'line'), text = valueOf(st, 'text');
    if (!id || !headIds.includes(id)) problems.push(`part${p}.txt: a stop for "${id}", which heads.txt does not list (line ${line})`);
    if (!/^\d+$/.test(line || '') || +line > 434) problems.push(`part${p}.txt: stop of ${id} with line "${line}"`);
    if (!text) problems.push(`part${p}.txt: stop of ${id} at line ${line} has no text`);
    else { const words = text.replace(/<[^>]+>/g, '').split(/\s+/).length; if (words > 90) notes.push(`${id} ${line}: ${words} words`); }
    (stopsByPath[id] = stopsByPath[id] || []).push(stripKey(st, 'path'));
  }
}

// ---- the pathways as they stand
const oldSecs = sections(read(path.join(DATA, 'paths.txt')));
const oldById = Object.fromEntries(oldSecs.map(s => [keyOf(s[0], 'id'), s]));
const retired = Object.keys(oldById).filter(id => !headIds.includes(id));
const newSecs = heads.map(h => {
  const id = keyOf(h, 'id');
  const stops = stopsByPath[id] || (oldById[id] ? oldById[id].slice(1) : []);
  if (!stops.length) problems.push(`${id}: no stops delivered and none on file`);
  notes.push(`${id}: ${stops.length} stops${stopsByPath[id] ? ' (delivered)' : ' (kept as they were)'}${oldById[id] ? '' : ' new'}`);
  return [h, ...stops];
});

// ---- the way-in items that pointed at a retired pathway
const waySecs = sections(read(path.join(DATA, 'ways.txt')));
const replFile = path.join(DIR, 'ways-replacements.txt');
if (exists(replFile)) {
  for (const r of records(read(replFile))) {
    const part = +keyOf(r, 'part'), target = keyOf(r, 'replaces'), to = keyOf(r, 'path');
    const sec = waySecs.find(s => +keyOf(s[0], 'part') === part);
    if (!sec) { problems.push(`ways-replacements.txt: no part ${part}`); continue; }
    if (to && !headIds.includes(to)) problems.push(`ways-replacements.txt: an item pointing at "${to}", which heads.txt does not list`);
    const i = sec.findIndex((it, k) => k > 0 && (target ? keyOf(it, 'path') === target : retired.includes(keyOf(it, 'path'))));
    if (i < 0) { problems.push(`ways-replacements.txt: nothing in part ${part} to replace${target ? ` (no item points at ${target})` : ''}`); continue; }
    notes.push(`part ${part}: way in "${keyOf(sec[i], 'title')}" (${keyOf(sec[i], 'path')}) replaced by "${keyOf(r, 'title')}" (${to})`);
    sec[i] = stripKey(stripKey(r, 'part'), 'replaces');
  }
}
for (const sec of waySecs) for (const it of sec.slice(1)) { const to = keyOf(it, 'path'); if (to && !headIds.includes(to)) problems.push(`ways.txt part ${keyOf(sec[0], 'part')}: "${keyOf(it, 'title')}" still points at ${to}`); }

// ---- the texts that count the pathways
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const n = heads.length, word = WORDS[n] || String(n);
const oldWord = WORDS[oldSecs.length] || String(oldSecs.length);
const cap = s => s[0].toUpperCase() + s.slice(1);
const recount = text => text.replace(new RegExp(`\\b${oldWord} pathways\\b`, 'g'), `${word} pathways`).replace(new RegExp(`\\b${cap(oldWord)} pathways\\b`, 'g'), `${cap(word)} pathways`);
const pageFiles = [path.join(DATA, 'pages.txt'), path.join(SHARED, 'site', 'pages.txt')].filter(exists);
const recounted = pageFiles.map(f => { const t = read(f), u = recount(t); const changed = (t.match(new RegExp(`\\b${oldWord} pathways\\b`, 'gi')) || []).length; return [f, u, changed]; });
if (n !== oldSecs.length) for (const [f, , changed] of recounted) notes.push(`${path.relative(ROOT, f)}: "${oldWord} pathways" → "${word} pathways" in ${changed} place${changed === 1 ? '' : 's'}`);

// ---- report, then write
console.log(`delivered: ${heads.length} pathways (${headIds.join(', ')}); retired: ${retired.join(', ') || 'none'}`);
for (const x of notes) console.log('  ' + x);
if (problems.length) { console.log('problems:'); for (const p of problems) console.log('  ' + p); }
if (dry) { console.log('(dry run: nothing written)'); process.exit(problems.length ? 1 : 0); }
if (problems.length) { console.log('nothing written'); process.exit(1); }
fs.writeFileSync(path.join(DATA, 'paths.txt'), joinSections(newSecs));
fs.writeFileSync(path.join(DATA, 'ways.txt'), joinSections(waySecs));
for (const [f, u] of recounted) fs.writeFileSync(f, u);
console.log(`wrote data/paths.txt (${n} pathways, ${newSecs.reduce((a, s) => a + s.length - 1, 0)} stops), data/ways.txt, and the pathway counts in ${pageFiles.map(f => path.relative(ROOT, f)).join(' and ')}`);
