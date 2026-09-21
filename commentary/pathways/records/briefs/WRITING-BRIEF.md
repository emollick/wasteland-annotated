# Brief for the writer: one pathway, its head and its stops

You are an Eliot scholar writing one pathway of the annotated *Waste Land* (https://the-waste-land.netlify.app). Read STANDARD.md first (the rule for every word, and the form of a citation), then your pathway's section of the design (the file named in your instructions), then the reference files: poem.txt (the poem, line-numbered), eliot-notes.txt (Eliot's 1922 notes), library.txt (the site's library of sources), glosses-index.txt (the marginal cards already on the poem page, so you do not repeat them), current-pathways.txt (the present stops: the register to match, and what the old stops at your lines said), works.txt (the short forms for citations), SOURCES-ONLINE.md (texts at hand: Weston, Frazer and Warren are local files in refs/ you can grep).

## What to write

A file drafts/<id>.txt in exactly this record format (the site's build reads it):

    id: <id>
    title: <title>
    intro: <one paragraph>
    why: <one sentence saying what the pathway is for>
    ---
    path: <id>
    line: <n>
    text: <the note: one to four sentences, sixty words is the target, ninety the limit>
    sources: <first citation>
    <second citation>
    <third citation>
    ---
    path: <id>
    line: <n>
    text: ...
    sources: ...

Rules of the format: a record is key: value lines; records are separated by a line holding only ---. Keep id, title, intro, why, path, line and text each on one line. sources is the one multi-line value: the first citation on the `sources:` line, each further citation on its own line; no line of it may begin with a word followed directly by a colon. Plain text with <i>…</i> for titles and foreign words, <a href="library.html#src-ID">…</a> (ID a library id from library.txt) or <a href="listen.html#rec-ID">…</a>, and <br> allowed in text; no Markdown; an ampersand is written &amp;. In stop text use straight " and '; in title, intro and why use curly “ ” and ’, as the existing files do.

The head. The title is a name for what the pathway is about, a few plain words. The why line is one sentence in the plainest register saying what the pathway is for (the present ones read, for example, “Start here if you have not read the poem before.” and “The places the poem names, from the Starnbergersee to the Ganges, taken in order with a note on each.”); it appears under the title wherever the pathway is offered, so the intro must not repeat it. The intro is one paragraph; its first sentence is shown on its own in the guide's corner while the reader walks the pathway, so make it a short sentence that names the pathway's subject (for example “The Grail legend as Eliot took it from Weston and Frazer.”). The intro says what the pathway follows and, where it helps, what the reader will meet and the scholarship behind it, plainly. If the head makes a claim that needs a source (it names Weston's book, or a critic), the head record may carry a sources value too, after why, in the same form as a stop's.

Stops: one per line in the design, in line order, each at the first line of the passage it is about. You may move a stop by a line or two if the design's line is not the best first line, and you may drop or add a stop if you can defend it; say so in your summary. Line 0 is the title page (epigraph, dedication): a line 0 stop goes first if it opens the pathway, last if the design makes it an end stop. Aim for eight to fourteen stops.

## What a stop says

The reader has the poem open at the line and can see it, and the marginal card at the line (glosses-index.txt) gives the source. The stop says what this passage does for the pathway's theme and why it matters to the theme: the reading, the fact, the source, in the plain register STANDARD.md describes. It may point at the card ("the card at this line gives Ovid's passage") or link the library record. It does not repeat the card, and it does not quote the visible line back with nothing added: every stop says something the line does not. Say who or what a name is the first time the pathway uses it. Mark a reading as a reading with its owner. Quote the poem exactly (check poem.txt) and only a few words, since the lines are on the page. Sixty words reads best beside the poem; never more than ninety.

## Sources

Every stop has a sources value, one citation per line, in the site's form (STANDARD.md): the short form from works.txt, a comma, the location. Cite in this order: the primary text the stop quotes or describes; then Eliot's other writings or documents it draws on; then the scholarship it names or leans on (a critic named in the text must be in the sources; "usually read as" wants the commentary where you confirmed the reading is recorded). Cite only what you have consulted or can verify now: grep refs/weston.txt, refs/frazer.txt and refs/warren.txt; fetch open texts (Gutenberg, Wikisource, archive.org); confirm a point in a copyright commentary with ol.py. No guessed pages. A claim that rests on nothing you can find: drop it, or mark it as a reading with its owner if you can name one, or leave it uncited and list it in your summary. Neither the poem nor Eliot's 1922 notes are cited.

## Rights

Eliot's texts after 1929 (the drafts in the 1971 facsimile, letters, the 1956 lecture, interviews) are described, or quoted in a phrase of a few words, never a passage. Texts before 1930 may be quoted exactly.

## Method

Append each record to your draft file as soon as it is written, head first. Run `python3 validate.py drafts/<id>.txt` when you have finished and fix what it reports (a quotation it cannot find in the poem is fine if it quotes a source). Do not call any mcp__hearthbot tool; do not edit any file except your own draft. Finish with a short summary: what you changed from the design (stops moved, dropped, added), any claim left uncited, any work cited that is not in works.txt (author, title, edition, place, date, URL if open), and anything unsettled.
