# The commentary, exported for the debates

Everything a reader of the annotated *Waste Land* (https://the-waste-land.netlify.app) sees as prose, other than the poem and Eliot's own 1922 notes, is here in the files the site is built from. Edit these files in place. The build thread pulls them back with one command, rebuilds and deploys; nothing else on the site changes.

## Where things are

    part1/ … part5/   one directory per part of the poem (I: lines 1–76, II: 77–172, III: 173–311, IV: 312–321, V: 322–434)
      glosses.txt     the marginal glosses: every card that opens beside a line (echoes, notes on places, drafts, images)
      ways.txt        the "ways into" the part, the list at the head of each part
      paths.txt       the stops of every pathway that fall in this part (the pathways' own titles and intros are in site/paths.txt)
      drafts.txt      the records on the drafts page that belong to this part
    site/             everything outside the five parts
      sources.txt     the library: one record per source text the poem draws on
      listen.txt      the listening room: recordings, music, birds, scans
      paths.txt       the nine pathways' titles and intros (their stops are in the part directories)
      drafts.txt      drafts records about the poem as a whole (the title, the epigraph)
      timeline.json   the dates on the About page
      voices.json     the speakers the Voices lens names, with a note on each
      pages.txt       prose that lives in the page templates: the title page, each page's opening lines, the lens and tool names and descriptions, the About page, the map and listening room captions, the recurring headings and labels (148 records)
      ui.txt          the words the tools and lenses speak on the poem page: the lens cards at the head of the poem, the tarot reading's card notes and the pack's names, the line-by-line and pathway bars, the fragments, the random line, the concordance, by heart, the labels on cards (144 records)

Line numbers everywhere are the site's own count, 1 to 434, counting every line of the poem. Eliot's 1922 marginal numbers run one behind from line 346 (his 433 is the site's 434); his note numbers agree with the site's count through 360 and run one behind from his 366 (the site's 367). The notes lens shows his numbers; the commentary uses the site's.

## The record format

A `.txt` file is a list of records separated by a line holding only `---`. In `ways.txt` and `paths.txt` a line holding only `===` separates larger sections (one part's list; one pathway). A record is `key: value` lines. A value may run over several lines: every following line that does not itself begin with `word:` belongs to the value. So a line inside a body that starts like `Note: the ...` would be read as a new field; write it another way.

Values are plain text with a little HTML allowed: `<i>…</i>` for titles and foreign words, `<a href="…">…</a>`, `<br>`. Quotation marks are curly in the source files where they already are; match what is around you. Do not add Markdown. In `listen.txt`, `{link:ID|text}` and `{parts}` are placeholders the build fills; keep them.

`timeline.json` and `voices.json` are JSON; keep them valid (`node -e 'JSON.parse(require("fs").readFileSync("timeline.json","utf8"))'`) and keep the key order and one-space indentation.

## What must stay unchanged

The build joins these files to the poem by keys, so these fields are fixed. Change one and the card, way or stop silently drops out.

- `glosses.txt`: `id`, `line`, `to`, `anchor` (must be exactly the words of that line the card hangs on, as printed in the poem, 1922 spelling and all), `kind`, `source`, `image`, `lang`. Editable: `title`, `body`, and `quote`/`trans` only to make them more accurate to the source text. A gloss may also carry `cite:` (added on the evening of 20 Sept), a short caption printed under the quotation, for when the quoted words are not from the card's `source` (the Fisher King card quotes Isaiah while its source is Weston).
- `ways.txt`: the `part:` line of the header record; in each item `kind`, `lens`, `source`, `path`. Editable: `title` (of the list and of each item), `body`.
- `paths.txt` in a part directory: `path` (which pathway the stop belongs to) and `line`. Editable: `text`. A stop may not be added or removed without telling the build thread, since a pathway is walked in line order.
- `site/paths.txt`: `id`. Editable: `title`, `intro`.
- `drafts.txt`: `id`, `part`, `line`. Editable: `title`, `body`. Rights rule: the 1971 facsimile of the drafts is in copyright; describe a draft passage, quote at most a phrase.
- `site/sources.txt`: `id`, `lines`, `lang`, `kind`, and the facts `title`, `author`, `date` (correct them only if wrong). Editable: `what` (the one-line summary), `note`, and `passage`/`trans` only for accuracy to the source. Sources before 1930 may be quoted freely; Eliot's own later texts (the 1956 lecture, letters, *The Death of Saint Narcissus*) only in a phrase or two.
- `site/listen.txt`: `id`, `group`, `embed`, `host`, and the facts `who`, `when` (correct only if wrong). Editable: `title`, `label`, `body`.
- `site/timeline.json`: `when`. Editable: `what`.
- `site/voices.json`: the keys and `color`. Editable: `label`, `note`.
- `site/pages.txt` and `site/ui.txt`: `id` and `where` (the `where` line says where on the site the text appears and is not shown). Editable: `text`, which must stay on one line. Curly braces in a text are placeholders the site fills (`{n}` a line number, `{voice}` a speaker, `{lines}` a list of lines, `{link}` a link); keep them. `&amp;` is how an ampersand is written in these files. A few texts carry a span or a link (`<span class="pencil">…</span>` round Pound's pencilled words, `<span class="keys">…</span>` round key names, `<a href="…">` in a card); keep the tags and change the words. Lens names are one word and tool names a few, because the bar they sit in is one line; the build thread will say if a wording does not fit.

Do not add or remove records, and do not change record order, except by arrangement with the build thread. Every fact was checked against primary sources on 20 September 2026 (Boni & Liveright page images, Gutenberg, Wikisource, archive.org); a debate that wants to change a fact should have a source for the new one.

## The recurring headings and labels

They are not in the part files. The page titles ("The poem", "Where the poem is standing" for the map, "The listening room", "The library", "The drafts", "Pathways", "About this edition"), the lens names and their one-line descriptions (Plain, Echoes, Notes, Voices, Tongues, Water, Places, Clock, Drafts), the tool names (Line by line, Turn the cards, Unstack the fragments, Draw a line, Find a word, By heart, Take a pathway), the card labels ("From the drafts", "A new voice", "Line by line · 1 of 434"), the "ways into" headings on each part and the running head all live in `site/pages.txt` and `site/ui.txt`, one record each, with a `where:` line saying where on the site it appears. The part titles in `ways.txt` ("Ten ways into The Burial of the Dead") are the one recurring heading that lives in a part file. Not exported: the poem, Eliot's notes, the names of the five parts, and the place names on the map (which are the places' names); raise those with the build thread if one is wrong.

## How the edits come back

The build thread runs `node build/commentary.js import part3` (or `site`, or `all`) in the site's working copy. That command copies the part's files back into the build data, merges the pathway stops and drafts records into their whole files, refuses to import if a fixed field has changed and says which, rebuilds, and checks every gloss anchor against the poem. Then the site is redeployed. So when a part is ready, say so in the project (the build thread's own thread is "do it, make me proud"); nothing needs to be moved by hand. Leave a `DEBATE.md` or similar record in the directory if you like; the import ignores files it does not know.

Added 20 September 2026, evening (the page rework): a pathway head record (`site/paths.txt`, the record with `id`, `title`, `intro`) may carry `why:`, one sentence under the title in the pathway chooser, at the start of the walk and on the Pathways page, saying what the pathway is for; a gloss may carry `plate:` naming a drawing from the frontispieces set (the epigraph gloss has `plate: title`). The template prose for the "Ways to read it" section at the top of the poem page is in `site/pages.txt` (records `howto-*`, `lens-*-why`, `tool-*-why`, `rb-help`), and the Sources lens's legend in `site/ui.txt` (`legend-echoes`, `legend-echoes-text`).

Added 20 September 2026, later that evening (the citations): any record may carry `sources:`, one citation per line (a gloss, a way in, a pathway stop, a drafts record, a library record, a listening-room record, a timeline entry; in `voices.json`, a `"sources"` list after `"note"`). The site prints them in small type at the foot of the record, under the label References, joined by semicolons. Each citation begins with a work's short form exactly as `site/works.txt` gives it (records with `id`, `short`, `full` and an optional `url`), then a comma or a space and the location; the build links the short form to the work's entry in the list of works cited at the foot of the library page (`library.html#work-<id>`). `works.txt` is imported whole with `site` and may grow; a record in it needs an id and a short form.
