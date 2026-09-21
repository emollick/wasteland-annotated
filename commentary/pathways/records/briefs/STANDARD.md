# The standard for every word written for this site

Written for the agents working on the thematic pathways of the annotated *Waste Land* (https://the-waste-land.netlify.app), 20 September 2026. This is the site owner's rule, and it governs every head, intro, reason and stop.

## The voice

The plainness of a good scholarly editor: Ricks and McCue, Southam, Rainey. A note says what a reader needs to know about the line, in ordinary sentences, and stops.

Not allowed (the owner named these shapes after reading the first draft of the site, and rejects prose that has them):
- tour-guide headings ("Where the poem is standing");
- "X is a Y:" aphorisms with rhythmic lists ("The poem's argument is a weather report: rain that is unwelcome, rivers that are dirty, a sea that drowns");
- clever counting ("twenty-nine lines of rock before three words of rain");
- bow-tying last sentences that sum the poem up ("The poem is about things that will not finish");
- paradoxes for effect, knowing asides, winks at the reader ("the poem's trick");
- colons in place of verbs; fragments in place of sentences; lists of three for rhythm;
- names dropped without a word of who or what they are (say "Cornelia's dirge in Webster's <i>The White Devil</i>, sung over her murdered son", not "Webster's dirge");
- a reading passed off as a fact. A reading is marked as a reading, with its owner named ("Cleanth Brooks (1939) read her warning as..."; "usually read as..."; "Southam takes the fisher to be...").
- Eliot's own claims are reported as his ("Eliot's note on line 218 says...").

Allowed and wanted: a fact stated once, with its source where a reader would want it; an instruction to the reader that has a point ("Read the lines first, then the note"); a plain gloss; a quotation from the poem or from a source, exact.

## Facts and sources

- Every fact goes to a checkable source. The first sources are the poem itself, Eliot's 1922 notes (in eliot-notes.txt; cite as "Eliot's note on line N", using the site's line numbers), and the source texts in the site's library (library.txt).
- The scholarship: Ricks and McCue, *The Poems of T. S. Eliot*, vol. 1 (2015), the standard commentary; B. C. Southam, *A Guide to the Selected Poems of T. S. Eliot* (6th ed., 1994); Lawrence Rainey, *The Annotated Waste Land with Eliot's Contemporary Prose* (2nd ed., 2006); Grover Smith, *T. S. Eliot's Poetry and Plays* (1956); Cleanth Brooks, "The Waste Land: Critique of the Myth" (1939); Hugh Kenner, *The Invisible Poet* (1959); Helen Gardner, *The Art of T. S. Eliot* (1949); Lyndall Gordon, *T. S. Eliot: An Imperfect Life* (1998); Robert Crawford, *Young Eliot* (2015); Matthew Hollis, *The Waste Land: A Biography of a Poem* (2022); Jessie L. Weston, *From Ritual to Romance* (1920); J. G. Frazer, *The Golden Bough* (3rd ed., 1906–15; abridged 1922); Henry Clarke Warren, *Buddhism in Translations* (1896); Paul Deussen, *Sechzig Upanishads des Veda* (1897).
- Cite only what you have actually consulted or can verify now. Give a page number only if you have seen the page. Otherwise locate by the work's own structure: a commentary by the line its note is keyed to, a book by its chapter, scripture by book, chapter and verse, a play by act and scene (IV.v), a poem by line or canto. Never invent a page, a chapter title or a quotation.
- The form of a citation is the site's (agreed with the citations thread, whose rules are in CITATIONS-BRIEF.md): the work's short form exactly as works.txt gives it, a comma, the location, nothing else: "Weston, From Ritual to Romance, ch. IX"; "Frazer, The Golden Bough (1922), ch. XXXII"; "Dante, Inferno III 55–57"; "King James Bible, Luke 24:16"; "Book of Common Prayer, the Order for the Burial of the Dead"; "Southam, Guide, note on line 46"; "Ricks and McCue, commentary on line 46"; "Rainey, Annotated Waste Land, note on line 46"; "Brooks (1939)"; "Warren, Buddhism in Translations, §73"; "Letters, vol. 1, Eliot to Sydney Schiff, 4 November 1921". Cite neither the poem nor Eliot's 1922 notes: they are on the page (the text of a stop may say "Eliot's note on line 46 says"). For a book in copyright (Ricks and McCue, Southam, Rainey, Brooks, Grover Smith, Kenner, Gardner, Gordon, Crawford, the facsimile, the Letters), confirm that the book has the point by searching inside its scan: `python3 ol.py '"distinctive phrase"' --limit 40` (add a second word to narrow; its leaf numbers are not page numbers). A work not in works.txt may be cited in the same style if you verify it, and must be listed in your summary with author, title, edition, place and date, and a URL if open.
- Texts before 1930 may be quoted freely and exactly. Eliot's own texts after 1929 (the drafts in the 1971 facsimile, letters, the 1956 lecture "The Frontiers of Criticism", later interviews) are described, or quoted in a phrase of a few words, never in a passage. Eliot's 1923 essay "Ulysses, Order, and Myth" is before 1930 and may be quoted.
- Every quotation from the poem must match poem.txt word for word, spelling and all (the site keeps the 1922 book's spellings: "cruellest", "tonight", "dont", "smoothes"). Every quotation from Eliot's notes must match eliot-notes.txt.

## Line numbers

The site counts every line of the poem, 1 to 434. Line 0 is the title page (title, epigraph, dedication). Eliot's 1922 marginal numbers run one behind from line 346 (his 433 is the site's 434), and his note numbers run one behind from his 366 (the site's 367); the site cites his notes by the site's line throughout, so write "Eliot's note on line 367" for the note he numbered 366, and so on. Parts: I lines 1–76, II 77–172, III 173–311, IV 312–321, V 322–434.

## Format of what the reader sees

A pathway has a title (a few plain words; a name for what the pathway is about, not a sentence), a reason (one sentence saying why a reader might take it), and an intro (one paragraph). A stop names a line and shows a short note of one to four sentences, at most about ninety words, beside the poem, which is open at that line; the reader can see the lines, so the note need not quote more than a few words to point at them. HTML allowed in a note: <i>…</i> for titles and foreign words, <a href="…">…</a> for a link to the library (library.html#src-ID, where ID is a library id) or the listening room, <br>. No Markdown. In stop notes use straight quotation marks (") and straight apostrophes ('); in heads (title, reason, intro) use curly ones (“ ” ’), as the existing files do.

Settled 20 September 2026, 22:10 UTC: the commentaries (Southam, Ricks and McCue, Rainey) are cited by their own line keys, as works.txt says. Southam's keys run one behind the site's line numbers from line 346 (his 433 is the site's 434); Ricks and McCue's the same where a checker has seen the key. The text of a stop uses the site's line numbers; only the sources line uses the commentary's key.
